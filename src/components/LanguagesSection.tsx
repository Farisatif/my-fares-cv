import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";

/**
 * LanguagesSection — minimalist gauge-only edition.
 *
 * Stripped from the previous dashboard layout: no outer panel/card chrome,
 * no KPI strip, no side list. Just a single elegant half-circle gauge that
 * sits directly on the section's band background. Designed to be smooth on
 * mobile where rapid scroll could otherwise trigger expensive repaints —
 * the gauge uses pre-computed SVG geometry, no layout-thrashing hover, and
 * pointer-events on slices are scoped so vertical scroll gestures pass
 * through cleanly.
 */
export function LanguagesSection() {
  const { data } = useSiteData();
  const { t, lang: uiLang } = useLang();
  const reduce = useReducedMotion();

  const langs = useMemo(
    () =>
      [...data.languages]
        .filter((l) => l.percent > 0)
        .sort((a, b) => b.percent - a.percent),
    [data.languages],
  );

  const total = useMemo(
    () => langs.reduce((s, l) => s + l.percent, 0) || 1,
    [langs],
  );

  const colorFor = (i: number, n: number) => {
    const spread = 130;
    const offset = n <= 1 ? 0 : (i / Math.max(n - 1, 1) - 0.5) * spread;
    return `oklch(0.66 0.17 calc(var(--primary-hue, 255) + ${offset}))`;
  };

  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="languages"
      className="section-padding relative overflow-hidden"
    >
      {/* Brand-identity gradient backdrop — replaces the dotted pattern with
          a soft, directional wash that uses the site's primary tokens. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 55%), radial-gradient(100% 70% at 100% 100%, color-mix(in oklab, var(--primary-glow, var(--primary)) 18%, transparent) 0%, transparent 60%), linear-gradient(135deg, color-mix(in oklab, var(--primary) 6%, transparent) 0%, transparent 50%, color-mix(in oklab, var(--primary-glow, var(--primary)) 8%, transparent) 100%)",
        }}
      />

      <div className="container mx-auto px-6 max-w-5xl relative">
        {/* ───────── Section header ───────── */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span
              aria-hidden
              className="h-px w-10"
              style={{
                background:
                  "color-mix(in oklab, var(--primary) 60%, transparent)",
              }}
            />
            <p className="text-xs uppercase tracking-[0.28em] opacity-60 font-mono">
              / 06 — {t(
                data.content?.languages?.eyebrow_en ?? "Languages",
                data.content?.languages?.eyebrow_ar ?? "اللغات",
              )}
            </p>
          </div>
          <h2 className="font-display h-display-lg pb-2 max-w-4xl">
            {t(
              data.content?.languages?.titlePrefix_en ?? "Fluent in ",
              data.content?.languages?.titlePrefix_ar ?? "أتحدث ",
            )}
            <span className="italic gradient-text-sky inline-block pb-1">
              {t(
                data.content?.languages?.titleAccent_en ?? "many tongues.",
                data.content?.languages?.titleAccent_ar ?? "لغات عديدة.",
              )}
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg opacity-65 max-w-2xl leading-relaxed">
            {t(
              (data.content?.languages as Record<string, string> | undefined)?.description_en ?? "A live snapshot of where my coding hours actually go — measured by the languages I reach for most.",
              (data.content?.languages as Record<string, string> | undefined)?.description_ar ?? "لمحة حية عن اللغات التي أعتمد عليها فعليًا — مرتبطة بساعات البرمجة التي أقضيها في كلٍ منها.",
            )}
          </p>
        </Reveal>

        {/* ───────── Gauge only — no surrounding container ───────── */}
        <Reveal delay={0.05}>
          <div className="mt-14 sm:mt-20">
            <Gauge
              langs={langs}
              total={total}
              colorFor={colorFor}
              active={active}
              setActive={setActive}
              reduce={!!reduce}
              centerHint={t("of total", "من الإجمالي")}
              rtl={uiLang === "ar"}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── Gauge (half-circle) ─────────────────────────── */

function Gauge({
  langs,
  total,
  colorFor,
  active,
  setActive,
  reduce,
  centerHint,
  rtl,
}: {
  langs: { name: string; percent: number }[];
  total: number;
  colorFor: (i: number, n: number) => string;
  active: number | null;
  setActive: (i: number | null) => void;
  reduce: boolean;
  centerHint: string;
  rtl: boolean;
}) {
  const SIZE = 360;
  const STROKE = 30;
  const R = (SIZE - STROKE) / 2;
  const CX = SIZE / 2;
  // Place the circle's center near the TOP of the viewBox so its bottom
  // half (the only portion drawn via stroke-dasharray) fits inside the
  // 204-tall viewBox. The whole SVG is then CSS-rotated 180° so the arc
  // appears at the top of the rendered container as a speedometer shape.
  const CY = STROKE / 2;
  const HALF = Math.PI * R;

  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [drawn, setDrawn] = useState(reduce);
  useEffect(() => {
    if (inView) setDrawn(true);
  }, [inView]);

  const focusedIndex = active ?? 0;
  const focused = langs[focusedIndex];
  const focusedPct = focused
    ? Math.round((focused.percent / total) * 100)
    : 0;

  let acc = 0;
  const slices = langs.map((l, i) => {
    const frac = l.percent / total;
    const len = HALF * frac;
    const offset = acc;
    acc += len;
    return {
      i,
      name: l.name,
      len,
      offset,
      color: colorFor(i, langs.length),
    };
  });

  return (
    <div className="relative">
      <div
        className="relative mx-auto"
        style={{ width: "100%", maxWidth: SIZE, aspectRatio: `${SIZE} / ${SIZE / 2 + 60}` }}
      >
        {/* Halo behind gauge */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-2 rounded-full blur-2xl opacity-40"
          style={{
            width: "70%",
            paddingTop: "35%",
            background:
              "color-mix(in oklab, var(--primary) 35%, transparent)",
          }}
        />

        <svg
          ref={ref}
          viewBox={`0 0 ${SIZE} ${SIZE / 2 + 24}`}
          width="100%"
          height="100%"
          className="relative block"
          style={{
            transform: "rotate(180deg) scaleX(-1)",
            // Mobile smoothness: avoid expensive filter recompute on scroll
            // by promoting to its own layer. willChange on transform tells
            // the compositor to keep the layer stable across scroll frames.
            willChange: "transform",
            // Allow vertical scroll gestures to pass through the gauge on
            // touch — prevents the chart from "catching" quick swipes.
            touchAction: "pan-y",
          }}
        >
          {/* Track */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            stroke="color-mix(in oklab, currentColor 8%, transparent)"
            strokeDasharray={`${HALF} ${HALF * 2}`}
          />

          {/* Slices */}
          {slices.map((s) => {
            const isActive = focusedIndex === s.i;
            const dim = active !== null && !isActive ? 0.35 : 1;
            return (
              <circle
                key={s.name}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={isActive ? STROKE + 4 : STROKE}
                strokeLinecap="butt"
                strokeDasharray={`${drawn ? s.len : 0} ${HALF * 2}`}
                strokeDashoffset={-s.offset}
                style={{
                  opacity: dim,
                  transition:
                    "stroke-dasharray 1.1s cubic-bezier(0.22,1,0.36,1), stroke-width 0.3s ease, opacity 0.3s ease",
                  cursor: "pointer",
                  filter: isActive
                    ? `drop-shadow(0 0 6px ${s.color})`
                    : "none",
                }}
                onMouseEnter={() => setActive(s.i)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>

        {/* Endpoint labels */}
        <span
          className="absolute bottom-12 sm:bottom-10 text-[10px] uppercase tracking-[0.22em] opacity-50 font-mono"
          style={{ left: rtl ? "auto" : 0, right: rtl ? 0 : "auto" }}
        >
          0%
        </span>
        <span
          className="absolute bottom-12 sm:bottom-10 text-[10px] uppercase tracking-[0.22em] opacity-50 font-mono"
          style={{ right: rtl ? "auto" : 0, left: rtl ? 0 : "auto" }}
        >
          100%
        </span>

        {/* Center value */}
        <div className="absolute inset-x-0 top-[34%] flex flex-col items-center text-center pointer-events-none">
          <motion.div
            key={focused?.name ?? "default"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-55 font-mono">
              {focused?.name ?? "—"}
            </span>
            <span className="font-display text-5xl sm:text-6xl tracking-tight tabular-nums leading-none mt-1">
              {focusedPct}
              <span className="text-2xl opacity-60">%</span>
            </span>
            <span className="text-[11px] opacity-55 mt-1">{centerHint}</span>
          </motion.div>
        </div>
      </div>

      {/* Slim legend — replaces the removed sidebar list. Kept inline and
          horizontally scrollable on mobile so the section stays compact. */}
      <div
        className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2.5 max-w-2xl mx-auto"
        onMouseLeave={() => setActive(null)}
      >
        {langs.map((l, i) => {
          const isActive = focusedIndex === i;
          const color = colorFor(i, langs.length);
          return (
            <button
              key={l.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group inline-flex items-center gap-2 text-sm transition-opacity"
              style={{ opacity: active === null || isActive ? 1 : 0.45 }}
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full transition-transform"
                style={{
                  background: color,
                  transform: isActive ? "scale(1.4)" : "scale(1)",
                  boxShadow: isActive
                    ? `0 0 8px ${color}`
                    : "none",
                }}
              />
              <span className="font-medium">{l.name}</span>
              <span className="font-mono tabular-nums opacity-60 text-xs">
                {l.percent}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
