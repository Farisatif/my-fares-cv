import { Reveal } from "./Reveal";
import { ArrowUpRight, GitFork, Star, Github, CalendarDays } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";
import { useRef, useState, type MouseEvent } from "react";


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
        <div className="container mx-auto px-6 max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              / 04 — {t("Selected work", "أعمال مختارة")}
            </p>
            <h2 className="font-display h-display-lg pb-2 max-w-4xl">
              {t("Projects ", "مشاريع ")}
              <span className="italic gradient-text-sky">
                {t("in the wild.", "على أرض الواقع.")}
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg opacity-65 max-w-2xl leading-relaxed">
              {t(
                "A curated selection of repositories — production builds, experiments, and open-source contributions.",
                "مجموعة مختارة من المستودعات — مشاريع إنتاجية، تجارب، ومساهمات مفتوحة المصدر.",
              )}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6">
            {data.projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <ProjectCard
                  project={p}
                  index={i}
                  total={data.projects.length}
                  lang={lang}
                  t={t}
                />
              </Reveal>
            ))}
          </div>
        </div>
    </section>
  );
}

interface Project {
  name: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  tags_en: string[];
  tags_ar: string[];
  en: { description: string };
  ar: { description: string };
}

function ProjectCard({
  project: p,
  index,
  total,
  lang,
  t,
}: {
  project: Project;
  index: number;
  total: number;
  lang: "en" | "ar";
  t: (en: string, ar: string) => string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const tags = lang === "ar" ? p.tags_ar : p.tags_en;
  const desc = lang === "ar" ? p.ar.description : p.en.description;
  const langColor = LANG_COLORS[p.language] || LANG_COLORS.Other;
  const repoPath = p.url.replace(/^https?:\/\//, "").replace(/^github\.com\//, "");

  return (
    <a
      ref={cardRef}
      href={`https://${p.url.replace(/^https?:\/\//, "")}`}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="view"
      data-cursor-label={t("Open", "افتح")}
      className="group block relative rounded-3xl p-8 sm:p-10 h-full overflow-hidden transition-all hover-lift border-l-4"
      style={{
        borderLeftColor: langColor,
        backgroundColor: "color-mix(in oklab, currentColor 6%, transparent)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: hovered
          ? "color-mix(in oklab, var(--primary) 45%, transparent)"
          : "color-mix(in oklab, currentColor 14%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 rtl:right-auto rtl:-left-32 h-64 w-64 rounded-full opacity-0 group-hover:opacity-60 blur-3xl transition-opacity duration-700"
        style={{ background: `color-mix(in oklab, ${langColor} 55%, transparent)` }}
      />

      {/* Mouse-tracked spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(450px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--primary) 18%, transparent), transparent 60%)",
        }}
      />

      {/* Top-right rotating arrow */}
      <div
        className="absolute top-6 right-6 rtl:right-auto rtl:left-6 h-10 w-10 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
        style={{
          backgroundColor: "color-mix(in oklab, currentColor 12%, transparent)",
          color: "currentColor",
        }}
      >
        <ArrowUpRight className="h-4 w-4" />
      </div>

      <div className="relative">
        {/* Top row — project pill + language */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className="text-xs px-3 py-1 rounded-full font-mono tabular-nums tracking-[0.2em] uppercase"
            style={{
              backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)",
              color: "color-mix(in oklab, currentColor 80%, transparent)",
            }}
          >
            {t("Project", "مشروع")} {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: `color-mix(in oklab, ${langColor} 22%, transparent)`,
              color: langColor,
              border: `1px solid color-mix(in oklab, ${langColor} 40%, transparent)`,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: langColor }}
            />
            {p.language}
          </span>
        </div>

        {/* Project name */}
        <h3 className="font-display text-3xl sm:text-4xl tracking-tight">{p.name}</h3>

        {/* Repo path */}
        <div className="mt-3 flex items-center gap-2 text-sm opacity-60">
          <Github className="h-3.5 w-3.5" />
          <span className="truncate">{repoPath}</span>
        </div>

        <p className="mt-4 text-base opacity-70 leading-relaxed">{desc}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6">
            {tags.slice(0, 5).map((tg) => (
              <span
                key={tg}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors group-hover:opacity-100 opacity-70"
                style={{
                  backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)",
                  border: "1px solid color-mix(in oklab, currentColor 15%, transparent)",
                }}
              >
                {tg}
              </span>
            ))}
          </div>
        )}

        {/* Footer: stats */}
        <div className="mt-8 flex items-center gap-5 text-sm opacity-60">
          <span className="inline-flex items-center gap-1.5" title={t("Stars", "نجوم")}>
            <Star className="h-3.5 w-3.5" />
            {formatNum(p.stars)} {t("stars", "نجمة")}
          </span>
          <span aria-hidden className="opacity-50">•</span>
          <span className="inline-flex items-center gap-1.5" title={t("Forks", "نسخ")}>
            <GitFork className="h-3.5 w-3.5" />
            {formatNum(p.forks)} {t("forks", "نسخة")}
          </span>
        </div>
      </div>
    </a>
  );
}
