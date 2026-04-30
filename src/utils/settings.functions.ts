import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcryptjs";
import { storage } from "@server/storage";

// In-memory rate limit store (per-instance). Keyed by client IP.
type Attempt = { count: number; firstAt: number; lockedUntil: number };
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

function getClientKey(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRate(key: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a) return { allowed: true };
  if (a.lockedUntil > now) return { allowed: false, retryAfter: Math.ceil((a.lockedUntil - now) / 1000) };
  if (now - a.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }
  return { allowed: true };
}

function recordFail(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || now - a.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  a.count += 1;
  if (a.count >= MAX_ATTEMPTS) a.lockedUntil = now + LOCK_MS;
}

// 24-char recovery code from a no-ambiguity alphabet, formatted XXXX-XXXX-...
function generateRecoveryCode(): { raw: string; formatted: string } {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const buf = new Uint8Array(24);
  crypto.getRandomValues(buf);
  let raw = "";
  for (let i = 0; i < 24; i++) raw += alphabet[buf[i] % alphabet.length];
  const formatted = (raw.match(/.{1,4}/g) || []).join("-");
  return { raw, formatted };
}

// Normalize user-typed recovery codes (strip spaces/dashes, uppercase).
function normalizeCode(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

async function readAdminRow() {
  const existing = await storage.getAdminSettings();
  if (existing) return existing;
  // Auto-initialize on first use using the configured admin password secret.
  const seedPw = process.env.SETTINGS_ADMIN_PASSWORD;
  if (!seedPw) throw new Error("Admin settings not initialized");
  const { raw } = generateRecoveryCode();
  const passwordHash = await bcrypt.hash(seedPw, 10);
  const recoveryCodeHash = await bcrypt.hash(raw, 10);
  await storage.upsertAdminSettings(passwordHash, recoveryCodeHash);
  console.warn(
    "[admin_settings] Initialized singleton row from SETTINGS_ADMIN_PASSWORD. Recovery code:",
    (raw.match(/.{1,4}/g) || []).join("-"),
  );
  return { passwordHash, recoveryCodeHash };
}

type PasswordCheck = { ok: true } | { ok: false; error: string; retryAfter?: number };

async function checkPassword(password: string): Promise<PasswordCheck> {
  const { getRequest } = await import("@tanstack/react-start/server");
  const req = getRequest();
  const key = getClientKey(req.headers);
  const rate = checkRate(key);
  if (!rate.allowed) {
    return { ok: false, error: `Too many attempts. Try again in ${rate.retryAfter}s.`, retryAfter: rate.retryAfter };
  }
  try {
    const row = await readAdminRow();
    let ok = await bcrypt.compare(password, row.passwordHash);
    // Self-heal: if the supplied password matches the configured secret
    // exactly but the stored hash was rotated/stale, re-seed the hash from the
    // secret so the admin can always log in with the configured password.
    if (!ok) {
      const seedPw = process.env.SETTINGS_ADMIN_PASSWORD;
      if (seedPw && password === seedPw) {
        const newHash = await bcrypt.hash(seedPw, 10);
        await storage.updateAdminPassword(newHash);
        ok = true;
      }
    }
    if (!ok) {
      recordFail(key);
      return { ok: false, error: "Invalid password" };
    }
    return { ok: true };
  } catch (error) {
    recordFail(key);
    return {
      ok: false,
      error:
        error instanceof Error && error.message
          ? error.message
          : "Invalid password",
    };
  }
}

export const saveSiteSettings = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; data: unknown }) => {
    if (!input || typeof input.password !== "string") throw new Error("Invalid input");
    if (input.password.length > 200) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok) return auth;
    await storage.upsertSiteSettings(data.data);
    return { ok: true as const };
  });

export const verifySettingsPassword = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (!input || typeof input.password !== "string" || input.password.length > 200) {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    return checkPassword(data.password);
  });

export const deleteComment = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; id: string }) => {
    if (!input || typeof input.password !== "string" || typeof input.id !== "string") {
      throw new Error("Invalid input");
    }
    if (input.password.length > 200 || input.id.length > 64) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok) return auth;
    await storage.deleteComment(data.id);
    return { ok: true as const };
  });

export const listAllComments = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (!input || typeof input.password !== "string" || input.password.length > 200) {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok)
      return {
        ...auth,
        comments: [] as Array<{
          id: string;
          author_name: string;
          message: string;
          created_at: string;
          status: string;
        }>,
      };
    const rows = await storage.listAllComments(500);
    return {
      ok: true as const,
      comments: rows.map((c) => ({
        id: c.id,
        author_name: c.authorName,
        message: c.message,
        created_at: c.createdAt.toISOString(),
        status: c.status,
      })),
    };
  });

// Approve or reject a comment.
export const setCommentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; id: string; status: "approved" | "rejected" | "pending" }) => {
    if (!input || typeof input.password !== "string" || typeof input.id !== "string") {
      throw new Error("Invalid input");
    }
    if (!["approved", "rejected", "pending"].includes(input.status)) throw new Error("Invalid status");
    if (input.password.length > 200 || input.id.length > 64) throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok) return auth;
    await storage.setCommentStatus(data.id, data.status);
    return { ok: true as const };
  });

// Reset password using a one-time recovery code. On success, returns a freshly
// generated recovery code (the old one is invalidated).
export const resetAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: { recoveryCode: string; newPassword: string }) => {
    if (!input || typeof input.recoveryCode !== "string" || typeof input.newPassword !== "string") {
      throw new Error("Invalid input");
    }
    if (input.recoveryCode.length > 200 || input.newPassword.length > 200 || input.newPassword.length < 6) {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const key = getClientKey(req.headers);
    const rate = checkRate(key);
    if (!rate.allowed) {
      return { ok: false as const, error: `Too many attempts. Try again in ${rate.retryAfter}s.` };
    }
    const row = await readAdminRow();
    const codeOk = await bcrypt.compare(normalizeCode(data.recoveryCode), row.recoveryCodeHash);
    if (!codeOk) {
      recordFail(key);
      return { ok: false as const, error: "Invalid recovery code" };
    }
    const newPwHash = await bcrypt.hash(data.newPassword, 10);
    const newCode = generateRecoveryCode();
    const newCodeHash = await bcrypt.hash(newCode.raw, 10);
    await storage.updateAdminPasswordAndRecovery(newPwHash, newCodeHash);
    return { ok: true as const, newRecoveryCode: newCode.formatted };
  });

// Generate a new recovery code (requires current password). Old code becomes invalid.
export const rotateRecoveryCode = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => {
    if (!input || typeof input.password !== "string" || input.password.length > 200) {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok) return auth;
    const newCode = generateRecoveryCode();
    const newCodeHash = await bcrypt.hash(newCode.raw, 10);
    await storage.updateAdminRecoveryCode(newCodeHash);
    return { ok: true as const, newRecoveryCode: newCode.formatted };
  });

// Change password while logged in (requires current password).
export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string; newPassword: string }) => {
    if (!input || typeof input.password !== "string" || typeof input.newPassword !== "string") {
      throw new Error("Invalid input");
    }
    if (input.password.length > 200 || input.newPassword.length > 200 || input.newPassword.length < 6) {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const auth = await checkPassword(data.password);
    if (!auth.ok) return auth;
    const newPwHash = await bcrypt.hash(data.newPassword, 10);
    await storage.updateAdminPassword(newPwHash);
    return { ok: true as const };
  });

// Lightweight DB connectivity check for the admin panel.
export const pingDatabase = createServerFn({ method: "GET" }).handler(async () => {
  const startedAt = Date.now();
  try {
    await storage.ping();
    return { ok: true as const, latencyMs: Date.now() - startedAt };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : String(e),
      latencyMs: Date.now() - startedAt,
    };
  }
});
