import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Check, Copy } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";

/**
 * Per-character heading with spring-driven entrance.
 * Each glyph rises into place on its own delay for a tactile, "settling" feel.
 */
function PhysicsHeading({
  prefix,
  accent,
}: {
  prefix: string;
  accent: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const renderChars = (text: string, baseDelay: number, accentClass = "") => {
    // Arabic letters MUST stay joined — splitting per-character breaks shaping.
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const parts = isArabic ? [text] : Array.from(text);
    return parts.map((ch, i) => (
      <motion.span
        key={`${baseDelay}-${i}`}
        className={`inline-block ${accentClass}`}
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, y: "0.6em", rotate: -6 }
        }
        animate={
          inView
            ? reduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, rotate: 0 }
            : {}
        }
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 22,
          mass: 0.6,
          delay: baseDelay + (isArabic ? 0 : i * 0.025),
        }}
        style={{ transformOrigin: "50% 100%" }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ));
  };

  return (
    <h2
      ref={ref}
      className="font-display h-display-lg pb-2"
    >
      {renderChars(prefix, 0)}
      <span className="italic gradient-text-sky inline-block pb-1">
        {renderChars(accent, 0.18, "italic")}
      </span>
    </h2>
  );
}

/** Eases a number from 0 → target with a spring. */
function useCountUp(target: number, start: boolean) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20, mass: 1 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    mv.set(target);
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [start, target, reduce, mv, spring]);

  return display;
}

/** Parses "120+", "30k", "2019" — keeps the original suffix, animates the leading number. */
function AnimatedStat({
  value,
  active,
}: {
  value: string | number;
  active: boolean;
}) {
  const raw = String(value);
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return <>{raw}</>;
  const target = parseInt(match[1], 10);
  const suffix = match[2];
  const display = useCountUp(target, active);
  return (
    <>
      {display}
      {suffix}
    </>
  );
}

/** A stat card with magnetic 3D tilt driven by springs. */
function StatCard({
  value,
  label,
  index,
  scrollProgress,
}: {
  value: string | number;
  label: string;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  // Pointer-driven tilt
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 18, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 200, damping: 18, mass: 0.5 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  // Subtle parallax float tied to page scroll, staggered per card
  const floatRange = 14 + index * 4;
  const floatY = useTransform(
    scrollProgress,
    [0, 1],
    [floatRange, -floatRange],
  );

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(x);
    py.set(y);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: 60, filter: "blur(8px)" }
      }
      animate={
        inView
          ? reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        mass: 0.9,
        delay: index * 0.08,
      }}
      style={{
        y: floatY,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className="group bg-[var(--surface-1)] p-8 sm:p-10 transition-colors hover:bg-[var(--surface-2)] relative overflow-hidden cursor-default"
    >
      {/* Pointer-following glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [glowX, glowY] as unknown as MotionValue<string>[],
            ([x, y]: string[]) =>
              `radial-gradient(220px circle at ${x} ${y}, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)`,
          ),
        }}
      />

      <motion.div
        className="font-display h-display-md tracking-tight relative"
        style={{ translateZ: 24 }}
        whileHover={reduce ? undefined : { y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <AnimatedStat value={value} active={inView} />
      </motion.div>
      <motion.div
        className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3 relative"
        style={{ translateZ: 12 }}
      >
        {label}
      </motion.div>

      {/* Hairline accent that draws on hover */}
      <motion.span
        aria-hidden
        className="absolute left-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 60%, transparent), transparent)",
        }}
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </motion.div>
  );
}

/**
 * IDE-style code comment block. Renders the bio paragraph as a multi-line
 * developer comment with line numbers, syntax tokens, a "live" status dot,
 * a typewriter sweep, and a copy-to-clipboard control.
 */
function CodeCommentCard({
  text,
  language,
  filename,
}: {
  text: string;
  language: "en" | "ar";
  filename: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [typed, setTyped] = useState(reduce ? text.length : 0);

  // Pre-compute the final wrapped layout ONCE from the full text. The
  // container height is locked to this layout from frame 1 — only the
  // characters revealed inside each final line change as we type, so the
  // surrounding page never reflows on mobile.
  const isRTL = language === "ar";
  const finalLines = useRef<string[]>([]);
  if (finalLines.current.length === 0) {
    const lines = wrapByWords(text, isRTL ? 38 : 64);
    while (lines.length < 4) lines.push("");
    finalLines.current = lines;
  }
  const lineStarts = useRef<number[]>([]);
  if (lineStarts.current.length === 0) {
    let acc = 0;
    const starts: number[] = [];
    for (const ln of finalLines.current) {
      starts.push(acc);
      // +1 accounts for the whitespace consumed between wrapped lines.
      acc += ln.length + 1;
    }
    lineStarts.current = starts;
  }

  // Word-aware typewriter — slower, deliberate reveal. Floor longer on
  // mobile so the eye has time to follow.
  useEffect(() => {
    if (!inView || reduce) return;
    const total = text.length;
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    const start = performance.now();
    const baseFloor = isMobile ? 6500 : 4500;
    const duration = Math.min(15000, baseFloor + total * (isMobile ? 55 : 40));
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out-quart for a fast-then-settling reveal
      const eased = 1 - Math.pow(1 - p, 4);
      setTyped(Math.floor(eased * total));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTyped(total);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  // Use the locked layout (do NOT recompute from `visible` — that would
  // shrink the line count on mobile and pop the page).
  const lines = finalLines.current;

  return (
    <motion.div
      ref={ref}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 24, filter: "blur(8px)" }
      }
      animate={
        inView
          ? reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        mass: 0.9,
        delay: 0.25,
      }}
      dir="ltr"
      className="mt-8 group relative rounded-2xl overflow-hidden border border-[var(--hairline)] bg-[var(--surface-1)] brand-shadow"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--hairline)] bg-[var(--surface-2)]/60">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="text-[11px] font-mono text-muted-foreground/80 tracking-wide">
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-mono">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  "color-mix(in oklab, var(--primary) 80%, transparent)",
              }}
              animate={
                reduce
                  ? undefined
                  : { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            live
          </span>
          <button
            onClick={handleCopy}
            aria-label="Copy comment"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="block"
                >
                  <Check className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="block"
                >
                  <Copy className="h-3.5 w-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="relative p-5 sm:p-6 font-mono text-sm sm:text-base leading-[1.85]" style={{ letterSpacing: "0.3px" }}>
        {/* Subtle gradient sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px circle at 100% 0%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 60%)",
          }}
        />
        <div className="relative">
          {/* Block opener */}
          <div className="flex gap-4 text-muted-foreground/70">
            <span className="select-none w-5 text-right tabular-nums">1</span>
            <span>
              <span className="text-muted-foreground/50">/**</span>
            </span>
          </div>

          {/* Lines — each one reserves the FULL final width via an
              invisible placeholder. We overlay the visible substring on
              top so revealing characters never reflows the container. */}
          {lines.map((line, i) => {
            const startChar = lineStarts.current[i] ?? 0;
            const visibleInLine =
              line.length === 0
                ? ""
                : line.slice(0, Math.max(0, Math.min(line.length, typed - startChar)));
            // The current "write head" line is the last line that has any
            // visible characters but isn't fully revealed yet.
            const isWriting =
              !reduce &&
              typed < text.length &&
              line.length > 0 &&
              typed >= startChar &&
              typed < startChar + line.length;
            return (
              <div
                key={i}
                className="flex gap-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <span
                  dir="ltr"
                  className="select-none w-5 text-right tabular-nums text-muted-foreground/60"
                >
                  {i + 2}
                </span>
                <span className="flex-1 text-foreground/85">
                  <span className="text-muted-foreground/50 select-none">
                    *{line ? " " : ""}
                  </span>
                  {renderHighlighted(visibleInLine)}
                  {isWriting && (
                    <motion.span
                      aria-hidden
                      className="inline-block w-[2px] h-[1em] align-[-2px] ml-0.5"
                      style={{
                        background:
                          "color-mix(in oklab, var(--primary) 90%, transparent)",
                      }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  {/* Invisible remainder — reserves the rest of the line so
                      width/height never changes as characters reveal. */}
                  {line.length > visibleInLine.length && (
                    <span aria-hidden className="opacity-0 select-none">
                      {line.slice(visibleInLine.length) || "\u00A0"}
                    </span>
                  )}
                  {line.length === 0 && (
                    <span aria-hidden className="opacity-0 select-none">
                      {"\u00A0"}
                    </span>
                  )}
                </span>
              </div>
            );
          })}

          {/* Block closer + signature */}
          <div className="flex gap-4 text-muted-foreground/60 mt-1">
            <span className="select-none w-5 text-right tabular-nums">
              {lines.length + 2}
            </span>
            <span className="text-muted-foreground/50">*/</span>
          </div>
          <div className="flex gap-4 mt-1">
            <span className="select-none w-5 text-right tabular-nums text-muted-foreground/40">
              {lines.length + 3}
            </span>
            <span>
              <span style={{ color: "color-mix(in oklab, var(--primary) 80%, var(--foreground))" }}>
                const
              </span>{" "}
              <span className="text-foreground">author</span>{" "}
              <span className="text-muted-foreground/70">=</span>{" "}
              <span className="text-emerald-500/90 dark:text-emerald-400/90">
                "@dev"
              </span>
              <span className="text-muted-foreground/70">;</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Wrap a string into lines of ~maxLen characters without splitting words. */
function wrapByWords(text: string, maxLen: number): string[] {
  if (!text) return [];
  const words = text.split(/(\s+)/); // keep whitespace tokens
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + w).length > maxLen && current.trim().length > 0) {
      lines.push(current.trimEnd());
      current = w.trimStart();
    } else {
      current += w;
    }
  }
  if (current.trim().length > 0) lines.push(current.trimEnd());
  return lines;
}

/** Highlight quoted strings, numbers, and a few keywords inside the comment. */
function renderHighlighted(line: string) {
  if (!line) return null;
  // Regex tokens: numbers, quoted strings, em-dash, colons.
  const tokenRe = /(\b\d{4}\b|\b\d+\b|—|:)/g;
  const parts: Array<{ t: string; kind: "txt" | "num" | "punct" }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(line)) !== null) {
    if (m.index > last) {
      parts.push({ t: line.slice(last, m.index), kind: "txt" });
    }
    const isNum = /^\d+$/.test(m[0]);
    parts.push({ t: m[0], kind: isNum ? "num" : "punct" });
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push({ t: line.slice(last), kind: "txt" });
  return parts.map((p, i) => {
    if (p.kind === "num") {
      return (
        <span
          key={i}
          style={{
            color: "color-mix(in oklab, var(--primary) 70%, var(--foreground))",
          }}
        >
          {p.t}
        </span>
      );
    }
    if (p.kind === "punct") {
      return (
        <span key={i} className="text-muted-foreground/70">
          {p.t}
        </span>
      );
    }
    return <span key={i}>{p.t}</span>;
  });
}

export function AboutSection() {
  const { data } = useSiteData();
  const { lang, t } = useLang();
  const stats = data.personal.stats;
  const loc = lang === "ar" ? data.personal.ar : data.personal.en;
  const items = [
    { label: t("Commits", "المساهمات"), value: stats.commits },
    { label: t("Repositories", "المستودعات"), value: stats.repos },
    { label: t("Stars earned", "النجوم"), value: stats.stars },
    { label: t("Coding since", "البرمجة منذ"), value: stats.since },
  ];

  // Section-scoped scroll progress drives subtle parallax on the stats grid.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.6,
  });

  return (
    <section id="about" ref={sectionRef} className="section-padding relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
              / 01 — {t(data.content?.about?.eyebrow_en ?? "About", data.content?.about?.eyebrow_ar ?? "نبذة")}
            </p>
            <PhysicsHeading
              prefix={t(
                data.content?.about?.titlePrefix_en ?? "Crafting software ",
                data.content?.about?.titlePrefix_ar ?? "أصنع برمجيات ",
              )}
              accent={t(
                data.content?.about?.titleAccent_en ?? "that ships.",
                data.content?.about?.titleAccent_ar ?? "تصل للمستخدم.",
              )}
            />
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7 lg:pt-4">
            <p className="text-xl sm:text-2xl leading-relaxed text-foreground/80 font-light">
              {loc.bio}
            </p>
            <CodeCommentCard
              language={lang === "ar" ? "ar" : "en"}
              filename="about.dev.ts"
              text={t(
                data.content?.about?.codeComment_en ?? "I started coding in 2019 — middle school. Today I build full-stack web apps, mobile experiences, and systems-level tools. I care about details: spacing, motion, edge cases, and the small joys that make software feel alive.",
                data.content?.about?.codeComment_ar ?? "بدأت البرمجة في ٢٠١٩ في المرحلة الإعدادية. اليوم أبني تطبيقات ويب متكاملة وتجارب جوال وأدوات أنظمة. أهتم بالتفاصيل: التباعد، الحركة، الحالات الحدية، والتفاصيل الصغيرة التي تمنح البرمجيات حياة.",
              )}
            />
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--hairline)] rounded-3xl overflow-hidden brand-shadow">
          {items.map((item, i) => (
            <StatCard
              key={item.label}
              index={i}
              value={item.value}
              label={item.label}
              scrollProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
