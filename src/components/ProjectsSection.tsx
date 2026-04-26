import { Reveal } from "./Reveal";
import { ArrowUpRight, GitFork, Star, Github } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";
import { ChevronPattern } from "./Patterns";

// Professional color map for common languages — refined to match site identity
// Colors are balanced for elegance: reduced chroma, adjusted lightness for hierarchy
const LANG_COLORS: Record<string, string> = {
  TypeScript: "oklch(0.55 0.15 260)",     // Deep indigo (site primary-aligned)
  JavaScript: "oklch(0.70 0.14 85)",      // Warm amber (approachable)
  Python: "oklch(0.60 0.12 240)",         // Cool blue (professional)
  Go: "oklch(0.65 0.11 210)",             // Cyan-blue (modern)
  Rust: "oklch(0.52 0.14 30)",            // Burnt orange (distinctive)
  Java: "oklch(0.58 0.13 45)",            // Orange-brown (established)
  "C++": "oklch(0.56 0.13 340)",          // Rose (elegant)
  C: "oklch(0.58 0.10 265)",              // Purple (cohesive)
  Dart: "oklch(0.62 0.12 220)",           // Sky blue (friendly)
  Swift: "oklch(0.62 0.15 35)",           // Orange-red (energetic)
  Kotlin: "oklch(0.58 0.14 295)",         // Violet (premium)
  Ruby: "oklch(0.52 0.16 20)",            // Deep red (rich)
  PHP: "oklch(0.56 0.12 280)",            // Deep purple (established)
  HTML: "oklch(0.62 0.14 35)",            // Orange (warm)
  CSS: "oklch(0.58 0.13 240)",            // Blue (tech)
  Shell: "oklch(0.60 0.12 140)",          // Green (productive)
  Other: "oklch(0.55 0.08 265)",          // Muted indigo (neutral)
};

const formatNum = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

export function ProjectsSection() {
  const { data } = useSiteData();
  const { lang, t } = useLang();
  const reduce = useReducedMotion();
  return (
    <section id="projects" className="section-padding">
      <ChevronPattern>
        <div className="container mx-auto px-6 max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
              / 04 — {t("Selected work", "أعمال مختارة")}
            </p>
            <h2 className="font-display h-display-lg pb-2 max-w-4xl">
              {t("Projects ", "مشاريع ")}
              <span 
                className="italic"
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in oklab, var(--primary) 60%, var(--foreground)) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("in the wild.", "على أرض الواقع.")}
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t(
                "A curated selection of repositories — production builds, experiments, and open-source contributions.",
                "مجموعة مختارة من المستودعات — مشاريع إنتاجية، تجارب، ومساهمات مفتوحة المصدر.",
              )}
            </p>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-2 gap-5 sm:gap-6">
            {data.projects.map((p, i) => {
              const tags = lang === "ar" ? p.tags_ar : p.tags_en;
              const desc = lang === "ar" ? p.ar.description : p.en.description;
              const langColor = LANG_COLORS[p.language] || LANG_COLORS.Other;
              const repoPath = p.url.replace(/^https?:\/\//, "").replace(/^github\.com\//, "");
              return (
                <motion.div
                  key={p.name}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.16), ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`https://${p.url.replace(/^https?:\/\//, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="view"
                    data-cursor-label={t("Open", "افتح")}
                    className="group relative flex h-full flex-col rounded-3xl border border-[var(--hairline)] bg-[var(--surface-1)] brand-shadow p-7 sm:p-9 overflow-hidden transition-[border-color,transform,box-shadow] duration-200 hover:border-[color-mix(in_oklab,var(--primary)_45%,var(--hairline))] hover-lift"
                  >
                    {/* Accent gradient corner — reveals on hover with refined opacity */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-0 group-hover:opacity-50 blur-3xl transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${langColor} 0%, transparent 70%)`,
                      }}
                    />
                    {/* Colored accent line on top edge — more prominent */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${langColor}, transparent)`,
                      }}
                    />

                    {/* Header row: index + open arrow */}
                    <div className="flex items-start justify-between gap-4 mb-7">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs tracking-widest text-muted-foreground tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-8 bg-[var(--hairline)]" />
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground truncate max-w-[180px] sm:max-w-[240px]">
                          <Github className="h-3 w-3 shrink-0" />
                          <span className="truncate">{repoPath}</span>
                        </span>
                      </div>
                      <div className="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center transition-[transform,background-color,color] duration-200 group-hover:rotate-45 group-hover:bg-foreground group-hover:text-background">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Title + description */}
                    <div className="flex-1">
                      <h3 
                        className="font-display text-3xl sm:text-[2.5rem] leading-[1.05] tracking-[-0.03em] transition-all duration-200"
                        style={{
                          background: `linear-gradient(135deg, ${langColor} 0%, color-mix(in oklab, ${langColor} 70%, var(--foreground)) 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          textFillColor: "transparent",
                        }}
                      >
                        {p.name}
                      </h3>
                      <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-7">
                        {tags.slice(0, 5).map((tg) => (
                          <span
                            key={tg}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[var(--hairline)] text-muted-foreground bg-[var(--surface-2)] transition-colors group-hover:text-foreground"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer: meta */}
                    <div className="mt-6 pt-5 border-t border-[var(--hairline)] flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <span className="flex items-center gap-2.5 font-medium px-3 py-1.5 rounded-full transition-all duration-200" 
                        style={{ 
                          background: `color-mix(in oklab, ${langColor} 15%, transparent)`,
                          color: langColor,
                          border: `1px solid color-mix(in oklab, ${langColor} 35%, transparent)`,
                        }}>
                        <span
                          className="h-2 w-2 rounded-full ring-1 ring-offset-1 transition-shadow duration-200"
                          style={{ 
                            background: langColor, 
                            ringColor: langColor,
                            boxShadow: `inset 0 0 0 1px ${langColor}40`,
                          }}
                        />
                        {p.language}
                      </span>
                      <div className="flex items-center gap-4 text-muted-foreground tabular-nums">
                        <span className="flex items-center gap-1.5" title={t("Stars", "نجوم")}>
                          <Star className="h-3.5 w-3.5" /> {formatNum(p.stars)}
                        </span>
                        <span className="flex items-center gap-1.5" title={t("Forks", "نسخ")}>
                          <GitFork className="h-3.5 w-3.5" /> {formatNum(p.forks)}
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </ChevronPattern>
    </section>
  );
}
