import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import resume from "@/data/resume.json";
import { PageSkeleton, EmptyDataState } from "./PageSkeleton";
import { getSiteSettings } from "@/utils/site-settings.functions";

export type SiteData = typeof resume;

const Ctx = createContext<{ data: SiteData; refresh: () => void }>({
  data: resume as SiteData,
  refresh: () => {},
});

const POLL_INTERVAL_MS = 15000;

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const load = useCallback(async () => {
    try {
      const row = await getSiteSettings();
      if (row && typeof row === "object" && Object.keys(row).length > 0) {
        setData(row as SiteData);
        setErrored(false);
      } else {
        // Singleton row missing/empty — fall back to bundled default resume.
        setData(resume as SiteData);
        setErrored(false);
      }
    } catch {
      // On error, still render the bundled default so the site stays usable.
      setData(resume as SiteData);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (typeof window === "undefined") return;
    const id = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  if (loading) return <PageSkeleton />;
  if (!data) {
    return (
      <EmptyDataState
        message={errored ? "Could not reach the database. Please try again." : undefined}
      />
    );
  }

  return <Ctx.Provider value={{ data, refresh: load }}>{children}</Ctx.Provider>;
}

export const useSiteData = () => useContext(Ctx);
