import { Reveal } from "./Reveal";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";
import { ChevronPattern } from "./Patterns";
import { useRef, useState, type MouseEvent } from "react";
import { Building2, MapPin, CalendarDays, Sparkles, ArrowUpRight } from "lucide-react";

/**
 * Experience section — mirrors the visual structure of `ProjectsSection`
 * (same ChevronPattern background + card anatomy) but inverts the theme:
 * dark surfaces against a primary-tinted dark backdrop, so the two sections
 * read as a yin/yang pair instead of looking identical.
 */
export function ExperienceSection() {
  const { data } = useSiteData();
  const { lang, t } = useLang();

  const labels = {
    period: t("Period", "الفترة"),
    company: t("Company", "الجهة"),
    highlights: t("Key impact", "أبرز الأثر"),
    role: t("Role", "الدور"),
    chapter: t("Chapter", "الفصل"),
  };

  return (
    <section
      id="work"
      className="section-padding relative overflow-hidden"
    >
      <ChevronPattern>
        <div className="container mx-auto px-6 max-w-7xl relative">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              / 03 — {t(
                data.content?.experience?.eyebrow_en ?? "Experience",
                data.content?.experience?.eyebrow_ar ?? "الخبرة",
              )}
            </p>
            <h2 className="font-display h-display-lg pb-2 max-w-4xl">
              {t(
                data.content?.experience?.titlePrefix_en ?? "Where I've ",
                data.content?.experience?.titlePrefix_ar ?? "أين قضيت ",
              )}
              <span className="italic gradient-text-sky">
                {t(
                  data.content?.experience?.titleAccent_en ?? "put in the hours.",
                  data.content?.experience?.titleAccent_ar ?? "ساعات العمل.",
                )}
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg opacity-65 max-w-2xl leading-relaxed">
              {t(
                "A timeline of roles where I've shipped real software, collaborated with thoughtful teams, and grown as an engineer.",
                "سجلٌّ مهني يرصد المحطات التي شحنت فيها برمجيات حقيقية وتعاونت مع فرق مميزة ونمَوت فيها كمهندس.",
              )}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6">
            {data.experience.map((exp, i) => {
              const l = lang === "ar" ? exp.ar : exp.en;
              return (
                <Reveal key={exp.company} delay={i * 0.08}>
                  <ExperienceCard
                    period={exp.period}
                    company={exp.company}
                    role={l.role}
                    location={l.location}
                    description={l.description}
                    highlights={l.highlights}
                    index={i}
                    total={data.experience.length}
                    labels={labels}
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </ChevronPattern>
    </section>
  );
}

function ExperienceCard({
  period,
  company,
  role,
  location,
  description,
  highlights,
  index,
  total,
  labels,
}: {
  period: string;
  company: string;
  role: string;
  location: string;
  description: string;
  highlights: string[];
  index: number;
  total: number;
  labels: { period: string; company: string; highlights: string; role: string; chapter: string };
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const isCurrent = period.includes("Present") || period.includes("الحالي");
  
  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group block relative rounded-3xl p-8 sm:p-10 h-full overflow-hidden transition-all hover-lift border-l-4 ${
        isCurrent ? "border-l-primary/80" : "border-l-muted/40"
      }`}
      style={{
        // Surface uses currentColor so the card stays legible whether the
        // surrounding band is light or dark (auto-inverted across themes).
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
      {/* Hover glow — same idea as Projects card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 rtl:right-auto rtl:-left-32 h-64 w-64 rounded-full opacity-0 group-hover:opacity-60 blur-3xl transition-opacity duration-700"
        style={{ background: "color-mix(in oklab, var(--primary) 55%, transparent)" }}
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

      {/* Top-right rotating arrow — identical to Projects card */}
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
        {/* Top row — chapter pill + date pill (parallels Projects' tags row) */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span
            className="text-xs px-3 py-1 rounded-full font-mono tabular-nums tracking-[0.2em] uppercase"
            style={{
              backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)",
              color: "color-mix(in oklab, currentColor 80%, transparent)",
            }}
          >
            {labels.chapter} {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
            style={{
              backgroundColor: "color-mix(in oklab, var(--primary) 22%, transparent)",
              color: "color-mix(in oklab, var(--primary) 80%, currentColor)",
              border: "1px solid color-mix(in oklab, var(--primary) 40%, transparent)",
            }}
          >
            <CalendarDays className="h-3 w-3" />
            {period}
          </span>
        </div>

        {/* Company — matches Projects h3 size */}
        <h3 className="font-display text-3xl sm:text-4xl tracking-tight">{company}</h3>

        {/* Role + location �� replaces Projects' description position */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-base">
          <span
            className="font-medium"
            style={{ color: "color-mix(in oklab, var(--primary) 80%, currentColor)" }}
          >
            {role}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm opacity-60">
            <MapPin className="h-3.5 w-3.5" />
            {location}
          </span>
        </div>

        <p className="mt-4 text-base opacity-70 leading-relaxed">{description}</p>

        {/* Highlights — replaces Projects' bottom stats row */}
        {highlights.length > 0 && (
          <>
            <div
              className="mt-7 mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] opacity-55"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{labels.highlights}</span>
            </div>
            <ul className="space-y-2">
              {highlights.map((h, hi) => (
                <li
                  key={h}
                  className="group/item flex items-start gap-3 text-sm sm:text-[15px] leading-relaxed opacity-85 rounded-lg p-2 -mx-2 transition-all duration-300 hover:opacity-100"
                  style={{
                    transitionDelay: hovered ? `${hi * 30}ms` : "0ms",
                  }}
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full shrink-0 transition-transform duration-300 group-hover/item:scale-150"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary), var(--primary-glow))",
                      boxShadow:
                        "0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent)",
                    }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Footer meta row — mirrors Projects' language/stars/forks line */}
        <div className="mt-8 flex items-center gap-5 text-sm opacity-60">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            {labels.company}
          </span>
          <span aria-hidden className="opacity-50">•</span>
          <span>{company}</span>
        </div>
      </div>
    </div>
  );
}
