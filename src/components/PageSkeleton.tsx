/**
 * PageSkeleton — pixel-accurate silhouette of the real homepage.
 *
 * Every section mirrors its live counterpart exactly:
 * - Same SectionBand variant (bg-band-*) + rounded corners
 * - Same background patterns (gradient-bg, chevron-bg …)
 * - Same container widths, paddings, and grid layouts
 * - Same decorative elements (blobs, rings, dividers)
 *
 * Skeleton elements use `animate-pulse` + translucent fills so they
 * "breathe" gently while feeling like the real page in negative space.
 */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="relative z-[2] min-h-screen text-foreground"
    >

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background globs — identical to Hero.tsx */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
        <div aria-hidden className="pointer-events-none absolute top-20 -left-32 h-[500px] w-[500px] rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute bottom-20 -right-32 h-[400px] w-[400px] rounded-full bg-primary/6 dark:bg-primary/10 blur-[80px]" />

        <div className="container relative mx-auto px-6 max-w-7xl py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — content column */}
            <div className="order-2 lg:order-1 space-y-8">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-background/80">
                <span className="h-2 w-2 rounded-full bg-emerald-500/40 animate-pulse" />
                <Bone className="h-3.5 w-36 rounded-full" />
              </div>

              {/* Headline — 3 lines matching clamp(2.5rem,6vw,5rem) */}
              <div className="space-y-3">
                <Bone className="rounded-xl w-[82%]" style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} brand />
                <Bone className="rounded-xl w-[68%]" style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} brand />
                <Bone className="rounded-xl w-[55%]" style={{ height: "clamp(2.4rem,5.8vw,4.8rem)" }} brand />
              </div>

              {/* Bio paragraph */}
              <div className="space-y-2.5 max-w-lg">
                <Bone className="h-4 w-full rounded-full" soft />
                <Bone className="h-4 w-[96%] rounded-full" soft />
                <Bone className="h-4 w-[88%] rounded-full" soft />
                <Bone className="h-4 w-[70%] rounded-full" soft />
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Bone className="h-11 w-40 rounded-full" />
                <Bone className="h-11 w-28 rounded-full" soft />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/30">
                <Bone className="h-3.5 w-28 rounded-full" soft />
                <Bone className="h-3.5 w-44 rounded-full" soft />
              </div>
            </div>

            {/* Right — avatar column */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative rings */}
                <div aria-hidden className="absolute inset-0 -m-4 rounded-full border border-border/15" />
                <div aria-hidden className="absolute inset-0 -m-8 rounded-full border border-border/8" />
                <div aria-hidden className="absolute inset-0 -m-12 rounded-full border border-border/5" />
                {/* Avatar circle */}
                <Bone
                  className="h-56 w-56 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full ring-4 ring-background"
                  brand
                />
                {/* Floating badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <Bone className="h-9 w-40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator (desktop only) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
            <Bone className="h-3 w-24 rounded-full" soft />
            <Bone className="h-3.5 w-3.5 rounded" soft />
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="border-y border-border bg-secondary/60 py-4 sm:py-6 overflow-hidden">
        <div className="flex gap-8 px-6 whitespace-nowrap">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8">
              <Bone
                className="h-7 sm:h-9 rounded-lg"
                soft
                style={{ width: `${80 + (i * 31) % 90}px` }}
              />
              <span className="text-xl sm:text-3xl text-[oklch(0.42_0.2_255)]/30">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. ABOUT — light/gradient, roundBottom ──────────────────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-light text-band-light-foreground rounded-b-[2.5rem] sm:rounded-b-[3.5rem]"
        style={{ boxShadow: "0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />

        <div className="container mx-auto px-6 max-w-7xl pt-20 sm:pt-28 pb-12">
          <SectionHeader eyebrowW="w-24" titleW1="w-[55%]" titleW2="w-[40%]" descW="w-full" />
        </div>
        <div className="container mx-auto px-6 max-w-7xl pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCard key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. LANGUAGES — dark, roundTop + roundBottom ─────────────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-dark text-band-dark-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
        }}
      >
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />
        {/* Gradient backdrop matching LanguagesSection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 55%), radial-gradient(100% 70% at 100% 100%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 60%)",
          }}
        />

        <div className="container mx-auto px-6 max-w-5xl pt-20 sm:pt-28 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-primary/30" />
            <Bone className="h-3 w-24 rounded-full" soft />
          </div>
          <Bone className="rounded-2xl w-[60%]" brand style={{ height: "clamp(2.2rem,5.5vw,4.5rem)" }} />
          <Bone className="rounded-2xl w-[45%] mt-2" brand style={{ height: "clamp(2.2rem,5.5vw,4.5rem)" }} />
          <Bone className="h-3.5 w-full max-w-xl rounded-full mt-6" soft />
        </div>

        {/* Gauge placeholder — half-circle */}
        <div className="container mx-auto px-6 max-w-5xl pb-24 flex justify-center">
          <div className="relative">
            {/* Half-circle gauge shell */}
            <div
              className="animate-pulse rounded-t-full border-[12px] border-current/10 border-b-transparent"
              style={{ width: 280, height: 140, boxSizing: "border-box" }}
            />
            {/* Language list */}
            <div className="mt-8 flex flex-col items-center gap-3">
              {[70, 48, 36].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full animate-pulse"
                    style={{ background: `color-mix(in oklab, var(--primary) ${60 - i * 15}%, currentColor)` }}
                  />
                  <Bone className={`h-3.5 rounded-full`} soft style={{ width: w }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. SKILLS — surface/gradient, roundTop + roundBottom ─────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-surface text-band-surface-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />
        {/* Blobs matching SkillsSection */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-[oklch(0.85_0.12_250)] opacity-20 blur-3xl" />
          <div className="absolute -top-20 right-10 h-[300px] w-[300px] rounded-full bg-[oklch(0.8_0.13_270)] opacity-18 blur-3xl" />
        </div>

        {/* Physics canvas placeholder — pill cloud */}
        <div className="relative w-full" style={{ minHeight: 780 }}>
          {/* Scattered pill skeletons */}
          <div className="absolute inset-0 overflow-hidden">
            {PILL_POSITIONS.map((p, i) => (
              <div
                key={i}
                className="absolute animate-pulse rounded-full border border-current/15 bg-current/6"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.w,
                  height: 36,
                  animationDelay: `${(i * 0.18) % 1.4}s`,
                  animationDuration: "2.4s",
                  transform: `rotate(${p.r}deg)`,
                }}
              />
            ))}
          </div>

          {/* Heading overlay — identical position to SkillsSection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-6 pt-20 sm:pt-28 md:pt-36 lg:pt-44">
            <div className="text-center max-w-4xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bone className="h-3 w-24 rounded-full" soft />
                <Bone className="h-6 w-20 rounded-full" soft />
              </div>
              <Bone className="rounded-2xl w-[72%] mx-auto" brand style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
              <Bone className="rounded-2xl w-[55%] mx-auto mt-3" brand style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
              <Bone className="h-3.5 w-72 rounded-full mx-auto mt-5" soft />
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. EXPERIENCE — light/gradient, roundTop + roundBottom ──────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-light text-band-light-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] chevron-bg" />
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />

        <div className="container mx-auto px-6 max-w-7xl pt-20 sm:pt-28 pb-12">
          <SectionHeader eyebrowW="w-28" titleW1="w-[52%]" titleW2="w-[38%]" descW="w-[85%]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl pb-24 grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ExperienceCard key={i} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── 7. ACHIEVEMENTS — dark, roundTop + roundBottom ───────────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-dark text-band-dark-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
        }}
      >
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />
        {/* Radial glow matching AchievementsSection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[60%] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center top, color-mix(in oklab, currentColor 8%, transparent), transparent 70%)",
          }}
        />

        <div className="container mx-auto px-6 max-w-7xl pt-20 sm:pt-28 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <Bone className="h-3 w-24 rounded-full mx-auto mb-5" soft />
            <Bone className="rounded-2xl w-[78%] mx-auto" brand style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
            <Bone className="rounded-2xl w-[60%] mx-auto mt-3" brand style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
            <Bone className="h-3.5 w-3/4 rounded-full mx-auto mt-6" soft />
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <AchievementCard key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. BRIDGE — light/gradient, roundTop + roundBottom ──────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-light text-band-light-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[1] gradient-bg" />
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />

        <div className="container mx-auto px-6 max-w-5xl py-20 sm:py-28 text-center">
          <Bone className="h-3 w-28 rounded-full mx-auto mb-5" soft />
          <Bone className="rounded-2xl w-[60%] mx-auto" brand style={{ height: "clamp(2rem,5vw,4rem)" }} />
          <div className="mt-6 space-y-2.5 max-w-2xl mx-auto">
            <Bone className="h-3.5 w-full rounded-full" soft />
            <Bone className="h-3.5 w-[85%] mx-auto rounded-full" soft />
          </div>
          <div className="mt-10 flex justify-center">
            <Bone className="h-12 w-52 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── 9. CONTACT — dark, roundTop ─────────────────────────────────────── */}
      <div
        className="relative isolate noise-overlay overflow-hidden bg-band-dark text-band-dark-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] -mt-10 sm:-mt-16"
        style={{
          zIndex: 1,
          boxShadow: "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent)",
        }}
      >
        <div aria-hidden className="absolute top-0 left-0 right-0 section-divider opacity-60" />
        {/* Blob glows matching ContactSection */}
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

        <div className="container mx-auto px-6 max-w-5xl pt-20 sm:pt-32 pb-10 text-center">
          <Bone className="h-3 w-20 rounded-full mx-auto mb-6" soft />
          <Bone className="rounded-2xl w-[58%] mx-auto" brand style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
          <Bone className="rounded-2xl w-[42%] mx-auto mt-4" brand style={{ height: "clamp(2.75rem,7.5vw,7rem)" }} />
          <div className="mt-10 space-y-2.5 max-w-xl mx-auto">
            <Bone className="h-3.5 w-full rounded-full" soft />
            <Bone className="h-3.5 w-[78%] mx-auto rounded-full" soft />
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Bone className="h-12 w-60 rounded-full" />
            <Bone className="h-12 w-36 rounded-full" soft />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Bone className="h-4 w-36 rounded-full" soft />
            <Bone className="h-4 w-28 rounded-full" soft />
            <Bone className="h-4 w-32 rounded-full" soft />
          </div>
        </div>

        {/* Footer band — bg-band-dark already, no extra wrapper needed */}
        <div className="container mx-auto px-6 max-w-7xl py-16 sm:py-24 border-t border-current/8">
          <Bone className="rounded-2xl w-[55%]" brand style={{ height: "clamp(2.5rem,8vw,6rem)" }} />
          <Bone className="rounded-2xl w-[42%] mt-3" brand style={{ height: "clamp(2.5rem,8vw,6rem)" }} />
          <div className="mt-12 flex flex-wrap gap-4">
            <Bone className="h-10 w-52 rounded-full" soft />
            <Bone className="h-10 w-28 rounded-full" soft />
            <Bone className="h-10 w-28 rounded-full" soft />
          </div>
          <div className="mt-16 flex flex-wrap justify-between items-center gap-4 border-t border-current/8 pt-6">
            <Bone className="h-3.5 w-40 rounded-full" soft />
            <Bone className="h-3.5 w-28 rounded-full" soft />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

// ─── Shared skeleton primitives ────────────────────────────────────────────────

function Bone({
  className = "",
  brand,
  soft,
  style,
}: {
  className?: string;
  brand?: boolean;
  soft?: boolean;
  style?: React.CSSProperties;
}) {
  const base = brand
    ? "bg-primary/15 dark:bg-primary/20"
    : soft
      ? "bg-foreground/8 dark:bg-foreground/10"
      : "bg-foreground/12 dark:bg-foreground/15";
  return (
    <div
      aria-hidden
      className={`animate-pulse ${base} ${className}`}
      style={style}
    />
  );
}

function SectionHeader({
  eyebrowW,
  titleW1,
  titleW2,
  descW,
}: {
  eyebrowW: string;
  titleW1: string;
  titleW2: string;
  descW: string;
}) {
  return (
    <div>
      <Bone className={`h-3 ${eyebrowW} rounded-full mb-5`} soft />
      <Bone className={`rounded-2xl ${titleW1}`} brand style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
      <Bone className={`rounded-2xl ${titleW2} mt-3`} brand style={{ height: "clamp(2.5rem,6.5vw,5.5rem)" }} />
      <Bone className={`h-3.5 ${descW} max-w-2xl rounded-full mt-6`} soft />
      <Bone className="h-3.5 w-[80%] max-w-xl rounded-full mt-2" soft />
    </div>
  );
}

function StatCard() {
  return (
    <div className="rounded-2xl border border-current/10 p-5 flex flex-col gap-4 bg-current/4">
      <Bone className="h-10 w-10 rounded-xl" />
      <Bone className="h-5 w-3/4 rounded-full" />
      <div className="space-y-2">
        <Bone className="h-3 w-full rounded-full" soft />
        <Bone className="h-3 w-5/6 rounded-full" soft />
        <Bone className="h-3 w-2/3 rounded-full" soft />
      </div>
    </div>
  );
}

function ExperienceCard({ delay: _delay }: { delay: number }) {
  return (
    <div className="rounded-2xl border border-current/10 bg-current/4 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
        {/* Period column */}
        <div className="sm:w-40 shrink-0 space-y-2">
          <Bone className="h-3 w-24 rounded-full" soft />
          <Bone className="h-3 w-16 rounded-full" soft />
        </div>
        {/* Content column */}
        <div className="flex-1 space-y-3">
          <Bone className="h-5 w-2/3 rounded-full" />
          <Bone className="h-3.5 w-1/2 rounded-full" soft />
          <div className="space-y-2 pt-1">
            <Bone className="h-3 w-full rounded-full" soft />
            <Bone className="h-3 w-[90%] rounded-full" soft />
            <Bone className="h-3 w-[75%] rounded-full" soft />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Bone key={i} className="h-6 rounded-full" soft style={{ width: 52 + (i * 14) % 36 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementCard() {
  return (
    <div className="rounded-2xl border border-current/10 p-5 flex flex-col gap-4 bg-current/4">
      <Bone className="h-10 w-10 rounded-xl" />
      <Bone className="h-5 w-3/4 rounded-full" />
      <div className="space-y-2">
        <Bone className="h-3 w-full rounded-full" soft />
        <Bone className="h-3 w-5/6 rounded-full" soft />
        <Bone className="h-3 w-1/2 rounded-full" soft />
      </div>
    </div>
  );
}

/** Pre-computed pill positions so the skill-cloud always looks the same. */
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
