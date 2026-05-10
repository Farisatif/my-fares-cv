import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import resume from "@/data/resume.json";
import { getSiteSettings } from "@/utils/site-settings.functions";

export type SiteData = typeof resume;

const Ctx = createContext<{ data: SiteData; refresh: () => void }>({
  data: resume as SiteData,
  refresh: () => {},
});

const POLL_INTERVAL_MS = 15000;

export function SiteDataProvider({ children }: { children: ReactNode }) {
  // Start with bundled resume.json so the page renders immediately.
  // Supabase data will overwrite this once it arrives.
  const [data, setData] = useState<SiteData>(resume as SiteData);

  const load = useCallback(async () => {
    try {
      const row = await getSiteSettings();
      if (row && typeof row === "object" && Object.keys(row).length > 0) {
        setData(row as SiteData);
      }
      // On null / empty → keep the current data (either bundled or previously loaded)
    } catch {
      // Network / Supabase error — keep showing whatever data we already have
    }
  }, []);

  useEffect(() => {
    load();
    if (typeof window === "undefined") return;
    const id = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  return <Ctx.Provider value={{ data, refresh: load }}>{children}</Ctx.Provider>;
}

export const useSiteData = () => useContext(Ctx);
