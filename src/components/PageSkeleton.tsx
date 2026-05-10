/**
 * PageSkeleton — professional shimmer skeleton that mirrors the real homepage.
 *
 * Uses the `.skeleton` / `.skeleton-brand` / `.skeleton-soft` CSS classes
 * (defined in styles.css) which combine a directional shimmer sweep with a
 * slow opacity pulse — giving a polished, on-brand loading feel.
 *
 * Animation delays are staggered so elements "wake up" sequentially,
 * making it obvious to the user that content is being fetched.
 */

import React from "react";

export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="relative z-[2] min-h-screen text-foreground"
    >
      {/* ── Top loading bar ─────────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-[999] h-[2px] overflow-hidden">
        <div
          className="h-full skeleton skeleton-brand"
          style={{
            width: "100%",
            borderRadius: 0,
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab,var(--primary) 60%,transparent) 40%, var(--primary) 50%, color-mix(in oklab,var(--primary) 60%,transparent) 60%, transparent 100%)",
            backgroundSize: "280% 100%",
          }}
        />
      </div>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
        <div aria-hidden className="pointer-events-none absolute top-20 -left-32 h-[500px] w-[500px] rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-20 -right-32 h-[400px] w-[400px] rounded-full bg-primary/6 dark:bg-primary/10 blur-[80px]" />

        <div className="container relative mx-auto px-6 max-w-7xl py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — content column */}
            <div className="order-2 lg:order-1 space-y-8">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm">
                <Bone className="h-2 w-2 rounded-full" delay={0} />
                <Bone className="h-3.5 w-36 rounded-full" soft delay={0.05} />
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <Bone className="rounded-xl w-[82%]" brand delay={0.1} style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} />
                <Bone className="rounded-xl w-[68%]" brand delay={0.18} style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} />
                <Bone className="rounded-xl w-[50%]" brand delay={0.26} style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} />
              </div>

              {/* Bio */}
              <div className="space-y-2.5 max-w-lg">
                <Bone className="h-4 w-full rounded-full" soft delay={0.34} />
                <Bone className="h-4 w-[96%] rounded-full" soft delay={0.38} />
                <Bone className="h-4 w-[88%] rounded-full" soft delay={0.42} />
                <Bone className="h-4 w-[65%] rounded-full" soft delay={0.46} />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Bone className="h-11 w-40 rounded-full" delay={0.52} />
                <Bone className="h-11 w-28 rounded-full" soft delay={0.58} />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/30">
                <Bone className="h-3.5 w-28 rounded-full" soft delay={0.64} />
                <Bone className="h-3.5 w-44 rounded-full" soft delay={0.68} />
              </div>
            </div>

            {/* Right — avatar */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                <div aria-hidden className="absolute inset-0 -m-4 rounded-full border border-border/15" />
                <div aria-hidden className="absolute inset-0 -m-8 rounded-full border border-border/8" />
                <div aria-hidden className="absolute inset-0 -m-12 rounded-full border border-border/5" />
                <Bone
                  className="h-56 w-56 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full ring-4 ring-background"
                  brand delay={0.08}
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <Bone className="h-9 w-40 rounded-full" delay={0.2} />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
            <Bone className="h-3 w-24 rounded-full" soft delay={0.8} />
            <Bone className="h-3.5 w-3.5 rounded" soft delay={0.85} />
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-secondary/60 py-4 sm:py-6 overflow-hidden">
        <div className="flex gap-8 px-6 whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8">
              <Bone
                className="h-7 sm:h-9 rounded-lg"
                soft
                delay={i * 0.04}
                style={{ width: `${80 + (i * 31) % 90}px` }}
              />
              <span className="text-xl sm:text-3xl text-primary/20">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. ABOUT ────────────────────────────────────────────────────────── */}
      <BandSection
        variant="light"
        roundBottom
        className="pt-20 sm:pt-28"
        decorators={<div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />}
      >
        <div className="container mx-auto px-6 max-w-7xl pb-12">
          <SectionHeader eyebrowW="w-24" titleW1="w-[55%]" titleW2="w-[40%]" descW="w-full" baseDelay={0} />
        </div>
        <div className="container mx-auto px-6 max-w-7xl pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCard key={i} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </BandSection>

      {/* ── 4. LANGUAGES ────────────────────────────────────────────────────── */}
      <BandSection
        variant="dark"
        roundTop roundBottom
        className="-mt-10 sm:-mt-16 pt-20 sm:pt-28"
        decorators={
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-[1]"
            style={{
              background:
                "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 55%), radial-gradient(100% 70% at 100% 100%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 60%)",
            }}
          />
        }
      >
        <div className="container mx-auto px-6 max-w-5xl pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-primary/30" />
            <Bone className="h-3 w-24 rounded-full" soft delay={0} />
          </div>
          <Bone className="rounded-2xl w-[60%]" brand delay={0.1} style={{ height: "clamp(2.2rem,5.5vw,4.5rem)" }} />
          <Bone className="rounded-2xl w-[44%] mt-2" brand delay={0.18} style={{ height: "clamp(2.2rem,5.5vw,4.5rem)" }} />
          <Bone className="h-3.5 w-full max-w-xl rounded-full mt-6" soft delay={0.26} />
        </div>
        <div className="container mx-auto px-6 max-w-5xl pb-24 flex justify-center">
          <div className="relative">
            <div
              className="skeleton skeleton-soft rounded-t-full border-[12px] border-current/10 border-b-transparent"
              style={{ width: 280, height: 140, boxSizing: "border-box", animationDelay: "0.3s" }}
            />
            <div className="mt-8 flex flex-col items-center gap-3">
              {[70, 48, 36].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Bone className="h-2.5 w-2.5 rounded-full" delay={0.35 + i * 0.06} />
                  <Bone className="h-3.5 rounded-full" soft delay={0.38 + i * 0.06} style={{ width: w }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </BandSection>

      {/* ── 5. SKILLS ───────────────────────────────────────────────────────── */}
      <BandSection
        variant="surface"
        roundTop roundBottom
        className="-mt-10 sm:-mt-16"
        decorators={
          <>
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-[oklch(0.85_0.12_250)] opacity-20 blur-3xl" />
              <div className="absolute -top-20 right-10 h-[300px] w-[300px] rounded-full bg-[oklch(0.8_0.13_270)] opacity-18 blur-3xl" />
            </div>
          </>
        }
      >
        <div className="relative w-full" style={{ minHeight: 780 }}>
          <div className="absolute inset-0 overflow-hidden">
            {PILL_POSITIONS.map((p, i) => (
              <div
                key={i}
                className="absolute skeleton skeleton-soft rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.w,
                  height: 36,
                  animationDelay: `${(i * 0.11) % 1.6}s`,
                  transform: `rotate(${p.r}deg)`,
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-20 sm:pt-28 md:pt-36 lg:pt-44">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bone className="h-3 w-24 rounded-full" soft delay={0} />
                <Bone className="h-6 w-20 rounded-full" soft delay={0.05} />
              </div>
              <Bone className="rounded-2xl w-[72%] mx-auto" brand delay={0.1} style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
              <Bone className="rounded-2xl w-[52%] mx-auto mt-3" brand delay={0.18} style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
              <Bone className="h-3.5 w-72 rounded-full mx-auto mt-5" soft delay={0.26} />
            </div>
          </div>
        </div>
      </BandSection>

      {/* ── 6. EXPERIENCE ───────────────────────────────────────────────────── */}
      <BandSection
        variant="light"
        roundTop roundBottom
        className="-mt-10 sm:-mt-16 pt-20 sm:pt-28"
        decorators={<div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] chevron-bg" />}
      >
        <div className="container mx-auto px-6 max-w-7xl pb-12">
          <SectionHeader eyebrowW="w-28" titleW1="w-[52%]" titleW2="w-[38%]" descW="w-[85%]" baseDelay={0} />
        </div>
        <div className="container mx-auto px-6 max-w-7xl pb-24 grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ExperienceCard key={i} delay={i * 0.1} />
          ))}
        </div>
      </BandSection>

      {/* ── 7. ACHIEVEMENTS ─────────────────────────────────────────────────── */}
      <BandSection
        variant="dark"
        roundTop roundBottom
        className="-mt-10 sm:-mt-16 pt-20 sm:pt-28"
        decorators={
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[60%] opacity-30"
            style={{ background: "radial-gradient(ellipse at center top, color-mix(in oklab, currentColor 8%, transparent), transparent 70%)" }}
          />
        }
      >
        <div className="container mx-auto px-6 max-w-7xl pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <Bone className="h-3 w-24 rounded-full mx-auto mb-5" soft delay={0} />
            <Bone className="rounded-2xl w-[78%] mx-auto" brand delay={0.1} style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
            <Bone className="rounded-2xl w-[58%] mx-auto mt-3" brand delay={0.18} style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
            <Bone className="h-3.5 w-3/4 rounded-full mx-auto mt-6" soft delay={0.26} />
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <AchievementCard key={i} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </BandSection>

      {/* ── 8. BRIDGE ───────────────────────────────────────────────────────── */}
      <BandSection
        variant="light"
        roundTop roundBottom
        className="-mt-10 sm:-mt-16"
        decorators={<div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />}
      >
        <div className="container mx-auto px-6 max-w-5xl py-20 sm:py-28 text-center">
          <Bone className="h-3 w-28 rounded-full mx-auto mb-5" soft delay={0} />
          <Bone className="rounded-2xl w-[60%] mx-auto" brand delay={0.1} style={{ height: "clamp(2rem,5vw,4rem)" }} />
          <div className="mt-6 space-y-2.5 max-w-2xl mx-auto">
            <Bone className="h-3.5 w-full rounded-full" soft delay={0.18} />
            <Bone className="h-3.5 w-[85%] mx-auto rounded-full" soft delay={0.22} />
          </div>
          <div className="mt-10 flex justify-center">
            <Bone className="h-12 w-52 rounded-full" delay={0.3} />
          </div>
        </div>
      </BandSection>

      {/* ── 9. CONTACT ──────────────────────────────────────────────────────── */}
      <BandSection
        variant="dark"
        roundTop
        className="-mt-10 sm:-mt-16 pt-20 sm:pt-32"
        decorators={
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
              style={{ background: "color-mix(in oklab, var(--primary) 70%, transparent)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
              style={{ background: "color-mix(in oklab, var(--primary) 60%, transparent)" }}
            />
          </>
        }
      >
        <div className="container mx-auto px-6 max-w-5xl pb-10 text-center">
          <Bone className="h-3 w-20 rounded-full mx-auto mb-6" soft delay={0} />
          <Bone className="rounded-2xl w-[58%] mx-auto" brand delay={0.1} style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
          <Bone className="rounded-2xl w-[42%] mx-auto mt-4" brand delay={0.18} style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
          <div className="mt-10 space-y-2.5 max-w-xl mx-auto">
            <Bone className="h-3.5 w-full rounded-full" soft delay={0.26} />
            <Bone className="h-3.5 w-[78%] mx-auto rounded-full" soft delay={0.3} />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Bone className="h-12 w-60 rounded-full" delay={0.36} />
            <Bone className="h-12 w-36 rounded-full" soft delay={0.42} />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Bone className="h-4 w-36 rounded-full" soft delay={0.48} />
            <Bone className="h-4 w-28 rounded-full" soft delay={0.52} />
            <Bone className="h-4 w-32 rounded-full" soft delay={0.56} />
          </div>
        </div>

        {/* Footer band */}
        <div className="container mx-auto px-6 max-w-7xl py-16 sm:py-24 border-t border-current/8">
          <Bone className="rounded-2xl w-[55%]" brand delay={0.1} style={{ height: "clamp(2.5rem,8vw,6rem)" }} />
          <Bone className="rounded-2xl w-[42%] mt-3" brand delay={0.18} style={{ height: "clamp(2.5rem,8vw,6rem)" }} />
          <div className="mt-12 flex flex-wrap gap-4">
            <Bone className="h-10 w-52 rounded-full" soft delay={0.26} />
            <Bone className="h-10 w-28 rounded-full" soft delay={0.32} />
            <Bone className="h-10 w-28 rounded-full" soft delay={0.38} />
          </div>
          <div className="mt-16 flex flex-wrap justify-between items-center gap-4 border-t border-current/8 pt-6">
            <Bone className="h-3.5 w-40 rounded-full" soft delay={0.44} />
            <Bone className="h-3.5 w-28 rounded-full" soft delay={0.48} />
          </div>
        </div>
      </BandSection>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

// ─── Primitives ─────────────────────────────────────────────────────────────

function Bone({
  className = "",
  brand,
  soft,
  delay = 0,
  style,
}: {
  className?: string;
  brand?: boolean;
  soft?: boolean;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const cls = brand ? "skeleton skeleton-brand" : soft ? "skeleton skeleton-soft" : "skeleton";
  return (
    <div
      aria-hidden
      className={`${cls} ${className}`}
      style={{ animationDelay: `${delay}s`, ...style }}
    />
  );
}

// ─── Band wrapper (mirrors SectionBand variants) ─────────────────────────────

function BandSection({
  variant,
  roundTop,
  roundBottom,
  className = "",
  decorators,
  children,
}: {
  variant: "light" | "dark" | "surface";
  roundTop?: boolean;
  roundBottom?: boolean;
  className?: string;
  decorators?: React.ReactNode;
  children: React.ReactNode;
}) {
  const bg =
    variant === "dark"
      ? "bg-band-dark text-band-dark-foreground"
      : variant === "surface"
      ? "bg-band-surface text-band-surface-foreground"
      : "bg-band-light text-band-light-foreground";

  const rt = roundTop ? "rounded-t-[2.5rem] sm:rounded-t-[3.5rem]" : "";
  const rb = roundBottom ? "rounded-b-[2.5rem] sm:rounded-b-[3.5rem]" : "";
  const shadow =
    roundTop && roundBottom
      ? "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)"
      : roundTop
      ? "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent)"
      : roundBottom
      ? "0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)"
      : undefined;

  return (
    <div
      className={`relative isolate noise-overlay overflow-hidden ${bg} ${rt} ${rb} ${className}`}
      style={{ zIndex: 1, boxShadow: shadow }}
    >
      <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />
      {decorators}
      {children}
    </div>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({
  eyebrowW,
  titleW1,
  titleW2,
  descW,
  baseDelay = 0,
}: {
  eyebrowW: string;
  titleW1: string;
  titleW2: string;
  descW: string;
  baseDelay?: number;
}) {
  return (
    <div>
      <Bone className={`h-3 ${eyebrowW} rounded-full mb-5`} soft delay={baseDelay} />
      <Bone className={`rounded-2xl ${titleW1}`} brand delay={baseDelay + 0.08} style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
      <Bone className={`rounded-2xl ${titleW2} mt-3`} brand delay={baseDelay + 0.16} style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
      <Bone className={`h-3.5 ${descW} max-w-2xl rounded-full mt-6`} soft delay={baseDelay + 0.24} />
      <Bone className="h-3.5 w-[80%] max-w-xl rounded-full mt-2" soft delay={baseDelay + 0.28} />
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="rounded-2xl border border-current/10 p-5 flex flex-col gap-4 bg-current/4 backdrop-blur-[2px]">
      <Bone className="h-10 w-10 rounded-xl" delay={delay} />
      <Bone className="h-5 w-3/4 rounded-full" delay={delay + 0.06} />
      <div className="space-y-2">
        <Bone className="h-3 w-full rounded-full" soft delay={delay + 0.1} />
        <Bone className="h-3 w-5/6 rounded-full" soft delay={delay + 0.13} />
        <Bone className="h-3 w-2/3 rounded-full" soft delay={delay + 0.16} />
      </div>
    </div>
  );
}

// ─── Experience card ─────────────────────────────────────────────────────────

function ExperienceCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="rounded-2xl border border-current/10 bg-current/4 p-6 sm:p-8 backdrop-blur-[2px]">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
        <div className="sm:w-40 shrink-0 space-y-2">
          <Bone className="h-3 w-24 rounded-full" soft delay={delay} />
          <Bone className="h-3 w-16 rounded-full" soft delay={delay + 0.04} />
        </div>
        <div className="flex-1 space-y-3">
          <Bone className="h-5 w-2/3 rounded-full" delay={delay + 0.08} />
          <Bone className="h-3.5 w-1/2 rounded-full" soft delay={delay + 0.12} />
          <div className="space-y-2 pt-1">
            <Bone className="h-3 w-full rounded-full" soft delay={delay + 0.16} />
            <Bone className="h-3 w-[90%] rounded-full" soft delay={delay + 0.19} />
            <Bone className="h-3 w-[75%] rounded-full" soft delay={delay + 0.22} />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-6 rounded-full" soft delay={delay + 0.26 + i * 0.04} style={{ width: 52 + (i * 14) % 36 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Achievement card ────────────────────────────────────────────────────────

function AchievementCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="rounded-2xl border border-current/10 p-5 flex flex-col gap-4 bg-current/4 backdrop-blur-[2px]">
      <Bone className="h-10 w-10 rounded-xl" delay={delay} />
      <Bone className="h-5 w-3/4 rounded-full" delay={delay + 0.06} />
      <div className="space-y-2">
        <Bone className="h-3 w-full rounded-full" soft delay={delay + 0.1} />
        <Bone className="h-3 w-5/6 rounded-full" soft delay={delay + 0.13} />
        <Bone className="h-3 w-1/2 rounded-full" soft delay={delay + 0.16} />
      </div>
    </div>
  );
}

// ─── Pill positions for skills cloud ────────────────────────────────────────

const PILL_POSITIONS = [
  { x: 5,  y: 8,  w: 88,  r: -3 },
  { x: 18, y: 15, w: 104, r: 2  },
  { x: 35, y: 6,  w: 72,  r: -5 },
  { x: 55, y: 10, w: 96,  r: 4  },
  { x: 70, y: 5,  w: 80,  r: -2 },
  { x: 82, y: 14, w: 112, r: 6  },
  { x: 7,  y: 28, w: 96,  r: 3  },
  { x: 22, y: 35, w: 80,  r: -4 },
  { x: 40, y: 24, w: 120, r: 2  },
  { x: 58, y: 30, w: 88,  r: -6 },
  { x: 75, y: 22, w: 72,  r: 5  },
  { x: 88, y: 32, w: 100, r: -3 },
  { x: 12, y: 50, w: 88,  r: 4  },
  { x: 30, y: 55, w: 104, r: -2 },
  { x: 48, y: 48, w: 76,  r: 3  },
  { x: 63, y: 52, w: 96,  r: -5 },
  { x: 78, y: 45, w: 88,  r: 2  },
  { x: 5,  y: 68, w: 112, r: -3 },
  { x: 20, y: 72, w: 80,  r: 5  },
  { x: 42, y: 70, w: 96,  r: -2 },
  { x: 60, y: 66, w: 104, r: 4  },
  { x: 78, y: 72, w: 80,  r: -4 },
  { x: 90, y: 60, w: 88,  r: 2  },
] as const;
