import { createServerFn } from "@tanstack/react-start";
import { storage } from "@server/storage";

// JSON-serializable shape — TanStack Start requires the return type of a
// server function to be JSON-serializable, and `unknown` does not satisfy
// that constraint. Using a recursive JSON value type makes the contract
// explicit and keeps the wire format honest.
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

// Public: read the current site_settings.data JSON.
// Returns null when the singleton row is empty / missing — the client
// then falls back to the default resume bundled in the build.
export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JsonObject | null> => {
    const data = await storage.getSiteSettingsData();
    if (!data || typeof data !== "object" || Object.keys(data as object).length === 0) {
      return null;
    }
    return data as JsonObject;
  },
);
