import { db } from "./db";
import { comments, siteSettings, adminSettings, type Comment } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Public
  listApprovedComments(limit?: number): Promise<Comment[]>;
  insertPendingComment(input: { authorName: string; message: string }): Promise<Comment>;
  getSiteSettingsData(): Promise<unknown | null>;

  // Admin
  listAllComments(limit?: number): Promise<Comment[]>;
  setCommentStatus(id: string, status: "approved" | "rejected" | "pending"): Promise<void>;
  deleteComment(id: string): Promise<void>;
  upsertSiteSettings(data: unknown): Promise<void>;

  // Admin auth singleton
  getAdminSettings(): Promise<{ passwordHash: string; recoveryCodeHash: string } | null>;
  upsertAdminSettings(passwordHash: string, recoveryCodeHash: string): Promise<void>;
  updateAdminPassword(passwordHash: string): Promise<void>;
  updateAdminRecoveryCode(recoveryCodeHash: string): Promise<void>;
  updateAdminPasswordAndRecovery(passwordHash: string, recoveryCodeHash: string): Promise<void>;

  ping(): Promise<void>;
}

export class DbStorage implements IStorage {
  async listApprovedComments(limit = 50): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.status, "approved"))
      .orderBy(desc(comments.createdAt))
      .limit(limit);
  }

  async insertPendingComment(input: { authorName: string; message: string }): Promise<Comment> {
    const [row] = await db
      .insert(comments)
      .values({
        authorName: input.authorName.slice(0, 80),
        message: input.message.slice(0, 1000),
        status: "pending",
      })
      .returning();
    return row;
  }

  async getSiteSettingsData(): Promise<unknown | null> {
    const [row] = await db
      .select({ data: siteSettings.data })
      .from(siteSettings)
      .where(eq(siteSettings.id, "singleton"))
      .limit(1);
    return row?.data ?? null;
  }

  async listAllComments(limit = 500): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(limit);
  }

  async setCommentStatus(id: string, status: "approved" | "rejected" | "pending"): Promise<void> {
    await db.update(comments).set({ status }).where(eq(comments.id, id));
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  async upsertSiteSettings(data: unknown): Promise<void> {
    await db
      .insert(siteSettings)
      .values({ id: "singleton", data: data as object, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { data: data as object, updatedAt: new Date() },
      });
  }

  async getAdminSettings() {
    const [row] = await db
      .select({
        passwordHash: adminSettings.passwordHash,
        recoveryCodeHash: adminSettings.recoveryCodeHash,
      })
      .from(adminSettings)
      .where(eq(adminSettings.id, "singleton"))
      .limit(1);
    return row ?? null;
  }

  async upsertAdminSettings(passwordHash: string, recoveryCodeHash: string): Promise<void> {
    await db
      .insert(adminSettings)
      .values({
        id: "singleton",
        passwordHash,
        recoveryCodeHash,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: adminSettings.id,
        set: { passwordHash, recoveryCodeHash, updatedAt: new Date() },
      });
  }

  async updateAdminPassword(passwordHash: string): Promise<void> {
    await db
      .update(adminSettings)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async updateAdminRecoveryCode(recoveryCodeHash: string): Promise<void> {
    await db
      .update(adminSettings)
      .set({ recoveryCodeHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async updateAdminPasswordAndRecovery(passwordHash: string, recoveryCodeHash: string): Promise<void> {
    await db
      .update(adminSettings)
      .set({ passwordHash, recoveryCodeHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async ping(): Promise<void> {
    await db.select({ id: adminSettings.id }).from(adminSettings).limit(1);
  }
}

export const storage = new DbStorage();
