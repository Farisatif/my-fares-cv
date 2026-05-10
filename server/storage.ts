// ─── Interface ────────────────────────────────────────────────────────────────

export interface IStorage {
  // Public
  listApprovedComments(limit?: number): Promise<Array<{
    id: string;
    authorName: string;
    message: string;
    status: string;
    createdAt: Date;
  }>>;
  insertPendingComment(input: { authorName: string; message: string }): Promise<{
    id: string;
    authorName: string;
    message: string;
    status: string;
    createdAt: Date;
  }>;
  getSiteSettingsData(): Promise<unknown | null>;

  // Admin
  listAllComments(limit?: number): Promise<Array<{
    id: string;
    authorName: string;
    message: string;
    status: string;
    createdAt: Date;
  }>>;
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

// ─── Drizzle / Replit Postgres fallback ──────────────────────────────────────

export class DbStorage implements IStorage {
  async listApprovedComments(limit = 50) {
    const { db } = await import("./db");
    const { comments } = await import("@shared/schema");
    const { desc, eq } = await import("drizzle-orm");
    return await db
      .select()
      .from(comments)
      .where(eq(comments.status, "approved"))
      .orderBy(desc(comments.createdAt))
      .limit(limit);
  }

  async insertPendingComment(input: { authorName: string; message: string }) {
    const { db } = await import("./db");
    const { comments } = await import("@shared/schema");
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
    const { db } = await import("./db");
    const { siteSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const [row] = await db
      .select({ data: siteSettings.data })
      .from(siteSettings)
      .where(eq(siteSettings.id, "singleton"))
      .limit(1);
    return row?.data ?? null;
  }

  async listAllComments(limit = 500) {
    const { db } = await import("./db");
    const { comments } = await import("@shared/schema");
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
      .limit(limit);
  }

  async setCommentStatus(id: string, status: "approved" | "rejected" | "pending") {
    const { db } = await import("./db");
    const { comments } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db.update(comments).set({ status }).where(eq(comments.id, id));
  }

  async deleteComment(id: string) {
    const { db } = await import("./db");
    const { comments } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db.delete(comments).where(eq(comments.id, id));
  }

  async upsertSiteSettings(data: unknown) {
    const { db } = await import("./db");
    const { siteSettings } = await import("@shared/schema");
    await db
      .insert(siteSettings)
      .values({ id: "singleton", data: data as object, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { data: data as object, updatedAt: new Date() },
      });
  }

  async getAdminSettings() {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
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

  async upsertAdminSettings(passwordHash: string, recoveryCodeHash: string) {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    await db
      .insert(adminSettings)
      .values({ id: "singleton", passwordHash, recoveryCodeHash, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: adminSettings.id,
        set: { passwordHash, recoveryCodeHash, updatedAt: new Date() },
      });
  }

  async updateAdminPassword(passwordHash: string) {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db
      .update(adminSettings)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async updateAdminRecoveryCode(recoveryCodeHash: string) {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db
      .update(adminSettings)
      .set({ recoveryCodeHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async updateAdminPasswordAndRecovery(passwordHash: string, recoveryCodeHash: string) {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db
      .update(adminSettings)
      .set({ passwordHash, recoveryCodeHash, updatedAt: new Date() })
      .where(eq(adminSettings.id, "singleton"));
  }

  async ping() {
    const { db } = await import("./db");
    const { adminSettings } = await import("@shared/schema");
    await db.select({ id: adminSettings.id }).from(adminSettings).limit(1);
  }
}

// ─── StorageRouter — defers to Supabase or Postgres on each method call ──────
// Using a cached-promise pattern avoids both top-level await (which breaks
// TanStack Start's server-function split) and require() (which is unavailable
// in ESM). The promise resolves once, then every subsequent call hits the
// cached instance directly.

let _instancePromise: Promise<IStorage> | null = null;

function instancePromise(): Promise<IStorage> {
  if (_instancePromise) return _instancePromise;

  _instancePromise = (async (): Promise<IStorage> => {
    const hasSupabase =
      process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (hasSupabase) {
      const { SupabaseStorage } = await import("./storage-supabase");
      console.log("[storage] Using Supabase as primary database");
      return new SupabaseStorage();
    }

    console.log("[storage] Using Replit PostgreSQL as primary database");
    return new DbStorage();
  })();

  return _instancePromise;
}

class StorageRouter implements IStorage {
  private async get(): Promise<IStorage> {
    return instancePromise();
  }

  async listApprovedComments(limit?: number) {
    return (await this.get()).listApprovedComments(limit);
  }
  async insertPendingComment(input: { authorName: string; message: string }) {
    return (await this.get()).insertPendingComment(input);
  }
  async getSiteSettingsData() {
    return (await this.get()).getSiteSettingsData();
  }
  async listAllComments(limit?: number) {
    return (await this.get()).listAllComments(limit);
  }
  async setCommentStatus(id: string, status: "approved" | "rejected" | "pending") {
    return (await this.get()).setCommentStatus(id, status);
  }
  async deleteComment(id: string) {
    return (await this.get()).deleteComment(id);
  }
  async upsertSiteSettings(data: unknown) {
    return (await this.get()).upsertSiteSettings(data);
  }
  async getAdminSettings() {
    return (await this.get()).getAdminSettings();
  }
  async upsertAdminSettings(passwordHash: string, recoveryCodeHash: string) {
    return (await this.get()).upsertAdminSettings(passwordHash, recoveryCodeHash);
  }
  async updateAdminPassword(passwordHash: string) {
    return (await this.get()).updateAdminPassword(passwordHash);
  }
  async updateAdminRecoveryCode(recoveryCodeHash: string) {
    return (await this.get()).updateAdminRecoveryCode(recoveryCodeHash);
  }
  async updateAdminPasswordAndRecovery(passwordHash: string, recoveryCodeHash: string) {
    return (await this.get()).updateAdminPasswordAndRecovery(passwordHash, recoveryCodeHash);
  }
  async ping() {
    return (await this.get()).ping();
  }
}

export const storage: IStorage = new StorageRouter();
