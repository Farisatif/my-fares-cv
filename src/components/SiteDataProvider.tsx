import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import resume from "@/data/resume.json";
import { PageSkeleton, EmptyDataState } from "./PageSkeleton";

export type SiteData = typeof resume;

const Ctx = createContext<{ data: SiteData; refresh: () => void }>({
  data: resume as SiteData,
  refresh: () => {},
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const load = async () => {
    try {
      const { data: row, error } = await supabase
        .from("site_settings")
        .select("data")
        .eq("id", "singleton")
        .maybeSingle();
      if (error) throw error;
      if (row?.data && typeof row.data === "object" && Object.keys(row.data as object).length > 0) {
        setData(row.data as SiteData);
        setErrored(false);
      } else {
        setData(null);
        setErrored(false);
      }
    } catch {
      setData(null);
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("site-settings-stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  if (loading) return <PageSkeleton />;
  if (!data) {
    return (
      <EmptyDataState
        message={
          errored
            ? "Could not reach the cloud database. Please try again."
            : undefined
        }
      />
    );
  }

  return <Ctx.Provider value={{ data, refresh: load }}>{children}</Ctx.Provider>;
}

export const useSiteData = () => useContext(Ctx);
