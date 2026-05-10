import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// DATABASE_URL is only required when Supabase is NOT configured.
// When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are present the app uses
// SupabaseStorage and this module is never imported.
if (!process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
  throw new Error(
    "Either DATABASE_URL (Replit Postgres) or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY must be set.",
  );
}

// Lazy — only initialised when DbStorage actually calls into this module.
const connectionString = process.env.DATABASE_URL ?? "";
export const pool = connectionString ? new Pool({ connectionString }) : null!;
export const db = connectionString ? drizzle(pool, { schema }) : null!;
