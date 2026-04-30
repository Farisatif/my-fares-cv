import { Github, Linkedin, Mail, MapPin, Heart } from "lucide-react";
import { lazy, Suspense } from "react";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";

// Admin CMS — never used by visitors; load on demand only when the
// trigger button is rendered/interacted with. Saves ~1500 lines + all
// of the form sub-components from the initial bundle.
const SettingsDrawer = lazy(() =>
  import("./cms/SettingsDrawer").then((m) => ({ default: m.SettingsDrawer })),
);

/**
 * Global Footer — appears on all pages.
 * Features a large title, social links, and copyright.
 */
export function Footer() {
  const { data } = useSiteData();
  const { t } = useLang();
  const p = data.personal;

  return (
    <footer className="relative bg-band-dark text-band-dark-foreground overflow-hidden">
      {/* Subtle gradient overlay */}
      <div 
        aria-hidden 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 30% 0%, color-mix(in oklab, var(--primary) 25%, transparent) 0%, transparent 60%)"
        }}
      />
      
      <div className="container mx-auto px-6 max-w-7xl relative">
        {/* Main footer content */}
        <div className="py-16 sm:py-24">
          {/* Large title */}
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em]">
            {t("Let's create", "لنصنع")}
            <br />
            <span className="italic text-primary">
              {t("something great.", "شيئاً عظيماً.")}
            </span>
          </h2>

          {/* Social links */}
          <div className="mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href={`mailto:${p.email}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-current/20 bg-current/5 hover:bg-current/10 transition-colors text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              {p.email}
            </a>
            <a
              href={`https://${p.github}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-current/20 bg-current/5 hover:bg-current/10 transition-colors text-sm font-medium"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={`https://${p.linkedin}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-current/20 bg-current/5 hover:bg-current/10 transition-colors text-sm font-medium"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-current/10 py-6 flex flex-wrap gap-4 justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse"
              style={{ background: "var(--primary)", boxShadow: "0 0 12px var(--primary)" }}
            />
            <span className="font-medium">
              © {new Date().getFullYear()} {p.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 opacity-70">
            <span>{t("Crafted with", "صُنع بـ")}</span>
            <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {t("Sana'a, Yemen", "صنعاء، اليمن")}
            </span>
          </div>

          <Suspense fallback={null}>
            <SettingsDrawer />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}
