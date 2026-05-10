import { supabase } from "./supabase";
import type { IStorage } from "./storage";

type CommentRow = {
  id: string;
  author_name: string;
  message: string;
  status: string;
  created_at: string;
};

function toComment(row: CommentRow) {
  return {
    id: row.id,
    authorName: row.author_name,
    message: row.message,
    status: row.status,
    createdAt: new Date(row.created_at),
  };
}

export class SupabaseStorage implements IStorage {
  // ─── Public ────────────────────────────────────────────────────────────────

  async listApprovedComments(limit = 50) {
    const { data, error } = await supabase
      .from("comments")
      .select("id, author_name, message, status, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []).map(toComment);
  }

  async insertPendingComment(input: { authorName: string; message: string }) {
    const { data, error } = await supabase
      .from("comments")
      .insert({
        author_name: input.authorName.slice(0, 80),
        message: input.message.slice(0, 1000),
        status: "pending",
      })
      .select("id, author_name, message, status, created_at")
      .single();

    if (error) throw new Error(error.message);
    return toComment(data);
  }

  async getSiteSettingsData(): Promise<unknown | null> {
    const { data, error } = await supabase
      .from("site_settings")
      .select("data")
      .eq("id", "singleton")
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data?.data ?? null;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  async listAllComments(limit = 500) {
    const { data, error } = await supabase
      .from("comments")
      .select("id, author_name, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []).map(toComment);
  }

  async setCommentStatus(id: string, status: "approved" | "rejected" | "pending") {
    const { error } = await supabase
      .from("comments")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async deleteComment(id: string) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async upsertSiteSettings(data: unknown) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { id: "singleton", data, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );

    if (error) throw new Error(error.message);
  }

  // ─── Admin auth singleton ──────────────────────────────────────────────────

  async getAdminSettings() {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("password_hash, recovery_code_hash")
      .eq("id", "singleton")
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      passwordHash: data.password_hash,
      recoveryCodeHash: data.recovery_code_hash,
    };
  }

  async upsertAdminSettings(passwordHash: string, recoveryCodeHash: string) {
    const { error } = await supabase
      .from("admin_settings")
      .upsert(
        {
          id: "singleton",
          password_hash: passwordHash,
          recovery_code_hash: recoveryCodeHash,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    if (error) throw new Error(error.message);
  }

  async updateAdminPassword(passwordHash: string) {
    const { error } = await supabase
      .from("admin_settings")
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq("id", "singleton");

    if (error) throw new Error(error.message);
  }

  async updateAdminRecoveryCode(recoveryCodeHash: string) {
    const { error } = await supabase
      .from("admin_settings")
      .update({ recovery_code_hash: recoveryCodeHash, updated_at: new Date().toISOString() })
      .eq("id", "singleton");

    if (error) throw new Error(error.message);
  }

  async updateAdminPasswordAndRecovery(passwordHash: string, recoveryCodeHash: string) {
    const { error } = await supabase
      .from("admin_settings")
      .update({
        password_hash: passwordHash,
        recovery_code_hash: recoveryCodeHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "singleton");

    if (error) throw new Error(error.message);
  }

  // ─── Connectivity ──────────────────────────────────────────────────────────

  async ping() {
    const { error } = await supabase
      .from("admin_settings")
      .select("id")
      .limit(1);

    if (error) throw new Error(error.message);
  }
}
