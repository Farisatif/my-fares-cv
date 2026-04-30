import { createServerFn } from "@tanstack/react-start";
import { storage } from "@server/storage";

// Public: read the current site_settings.data JSON.
// Returns null when the singleton row is empty / missing — the client
// then falls back to the default resume bundled in the build.
export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const data = await storage.getSiteSettingsData();
  if (!data || typeof data !== "object" || Object.keys(data as object).length === 0) {
    return null;
  }
  return data as Record<string, unknown>;
});
