import { SectionBand } from "./SectionBand";
import { DotPattern } from "./Patterns";
import heroSplash from "@/assets/hero-splash.jpg";

/**
 * PageSkeleton — full-page skeleton that EXACTLY mirrors the real
 * homepage silhouette so when the real content loads, nothing jumps.
 *
 * It uses the same containers, paddings, band variants, rounded-corner
 * rhythm, and even the hero's blue splash backdrop — so the loading
 * state reads as a softer version of the real page rather than a
 * generic placeholder.
 */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="relative z-[2] min-h-screen text-foreground"
    >
      {/* ---------- HERO silhouette — mirrors src/components/Hero.tsx ---------- */}
      <section className="relative min-h-screen pt-12 sm:pt-16 pb-24 overflow-hidden">
        {/* Same background layers as the real hero so the visual stays put */}
        <DotPattern className="absolute inset-0 -z-10 opacity-40">
          <div className="h-full w-full" />
        </DotPattern>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mesh-bg opacity-30 dark:opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 chevron-bg" />

        {/* Half-background splash — matches Hero.tsx exactly */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-[5] inset-x-0 top-0 h-[78%] lg:inset-y-0 lg:h-full lg:w-1/2 lg:right-0 lg:left-auto rtl:lg:left-0 rtl:lg:right-auto"
        >
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-[0.7] dark:opacity-[0.55]"
            style={{
              backgroundImage: `url(${heroSplash})`,
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            }}
          />
          <div
            className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-[0.7] dark:opacity-[0.55]"
            style={{
              backgroundImage: `url(${heroSplash})`,
              WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 100%)",
              maskImage: "linear-gradient(to left, black 30%, transparent 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent mix-blend-multiply dark:mix-blend-soft-light" />
        </div>

        <div className="container relative mx-auto px-6 max-w-7xl">
          {/* Top meta row — chip + edition stamp */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="skeleton h-8 w-56 sm:w-64 rounded-full" />
            <div className="hidden sm:flex items-center gap-3">
              <span className="h-px w-8 bg-border" />
              <div className="skeleton skeleton-soft h-3 w-32 rounded-full" />
            </div>
          </div>

          {/* Headline — three stacked blocks at the same fluid height as h-display-xl */}
          <div className="space-y-3 sm:space-y-4">
            <div
              className="skeleton skeleton-brand rounded-2xl w-[78%]"
              style={{ height: "clamp(2.8rem, 9vw, 8.5rem)" }}
            />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[58%]"
              style={{ height: "clamp(2.8rem, 9vw, 8.5rem)" }}
            />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[68%]"
              style={{ height: "clamp(2.8rem, 9vw, 8.5rem)" }}
            />
          </div>

          {/* Bio card + avatar grid — matches Hero exactly */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7 max-w-xl rounded-2xl bg-background/55 dark:bg-background/40 backdrop-blur-md border border-border/40 px-5 py-4 sm:px-6 sm:py-5">
              <div className="space-y-3">
                <div className="skeleton skeleton-soft h-3.5 w-full rounded-full" />
                <div className="skeleton skeleton-soft h-3.5 w-[94%] rounded-full" />
                <div className="skeleton skeleton-soft h-3.5 w-[88%] rounded-full" />
                <div className="skeleton skeleton-soft h-3.5 w-[60%] rounded-full" />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="skeleton h-12 w-40 rounded-full" />
                <div className="skeleton skeleton-soft h-12 w-32 rounded-full" />
              </div>
            </div>

            <div className="lg:col-span-5 relative flex lg:justify-end">
              <div className="relative">
                <div className="skeleton skeleton-brand h-40 w-40 sm:h-52 sm:w-52 rounded-full" />
                <div className="skeleton absolute -bottom-2 -right-2 lg:right-0 h-7 w-32 rounded-full" />
              </div>
            </div>
          </div>

          {/* Bottom credibility row */}
          <div className="mt-20 pt-8 border-t border-border/40 flex items-center justify-between gap-6 flex-wrap">
            <div className="skeleton skeleton-soft h-3 w-40 rounded-full" />
            <div className="skeleton skeleton-soft h-3 w-56 rounded-full" />
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE strip — same height & border as Marquee.tsx ---------- */}
      <div className="border-y border-[var(--hairline)] py-6 overflow-hidden">
        <div className="flex gap-10 px-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-soft h-4 w-32 sm:w-44 rounded-full shrink-0"
            />
          ))}
        </div>
      </div>

      {/* ---------- ABOUT band (light, grid-fine, roundBottom) ---------- */}
      <SectionBand variant="light" pattern="chevron" divider roundBottom>
        <SectionHeaderSkeleton container="max-w-7xl" />
        <div className="container mx-auto px-6 max-w-7xl pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </SectionBand>

      {/* ---------- LANGUAGES band (dark) ---------- */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <SectionHeaderSkeleton container="max-w-5xl" />
        <div className="container mx-auto px-6 max-w-5xl pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="skeleton h-44 w-44 rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </SectionBand>

      {/* ---------- SKILLS band (surface, grid-dots) ---------- */}
      <SectionBand variant="surface" pattern="chevron" divider roundTop roundBottom>
        <div className="container mx-auto px-6 max-w-4xl pt-20 sm:pt-28 pb-24 text-center">
          <div className="skeleton skeleton-soft h-3 w-32 rounded-full mx-auto mb-5" />
          <div
            className="skeleton skeleton-brand rounded-2xl w-[70%] mx-auto"
            style={{ height: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
          />
          <div
            className="skeleton skeleton-brand rounded-2xl w-[55%] mx-auto mt-3"
            style={{ height: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
          />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-9 rounded-full"
                style={{ width: `${60 + ((i * 23) % 80)}px` }}
              />
            ))}
          </div>
        </div>
      </SectionBand>

      {/* ---------- EXPERIENCE band (dark, grid-fine) ---------- */}
      <SectionBand variant="dark" pattern="chevron" divider roundTop roundBottom>
        <SectionHeaderSkeleton container="max-w-7xl" />
        <div className="container mx-auto px-6 max-w-7xl pb-24 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--hairline)] p-6 flex flex-col sm:flex-row gap-5"
            >
              <div className="skeleton skeleton-soft h-3 w-24 rounded-full shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-5 w-2/3 rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-1/2 rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-[85%] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </SectionBand>

      {/* ---------- ACHIEVEMENTS band (dark) ---------- */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <div className="container mx-auto px-6 max-w-7xl pt-20 sm:pt-28 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="skeleton skeleton-soft h-3 w-32 rounded-full mx-auto mb-5" />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[80%] mx-auto"
              style={{ height: "clamp(2.75rem, 7.5vw, 7rem)" }}
            />
            <div className="skeleton skeleton-soft h-3 w-3/4 rounded-full mx-auto mt-6" />
          </div>
          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </SectionBand>

      {/* ---------- BRIDGE band (soft, aurora) ---------- */}
      <SectionBand variant="soft" pattern="aurora" divider roundTop roundBottom>
        <section className="relative section-padding">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="skeleton skeleton-soft h-3 w-28 rounded-full mx-auto mb-5" />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[80%] mx-auto"
              style={{ height: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
            />
            <div className="mt-6 space-y-2.5 max-w-2xl mx-auto">
              <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-[88%] mx-auto rounded-full" />
            </div>
            <div className="mt-10 flex justify-center">
              <div className="skeleton h-12 w-56 rounded-full" />
            </div>
          </div>
        </section>
      </SectionBand>

      {/* ---------- CONTACT band (dark, grid-fine) ---------- */}
      <SectionBand variant="dark" pattern="chevron" divider roundTop>
        <section className="pt-20 sm:pt-32 pb-6 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="skeleton skeleton-soft h-3 w-32 rounded-full mx-auto mb-6" />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[70%] mx-auto"
              style={{ height: "clamp(2.75rem, 7.5vw, 7rem)" }}
            />
            <div
              className="skeleton skeleton-brand rounded-2xl w-[55%] mx-auto mt-4"
              style={{ height: "clamp(2.75rem, 7.5vw, 7rem)" }}
            />
            <div className="mt-10 space-y-2.5 max-w-xl mx-auto">
              <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-[80%] mx-auto rounded-full" />
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <div className="skeleton h-12 w-56 rounded-full" />
              <div className="skeleton skeleton-soft h-12 w-40 rounded-full" />
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
              <div className="skeleton skeleton-soft h-4 w-40 rounded-full" />
              <div className="skeleton skeleton-soft h-4 w-28 rounded-full" />
              <div className="skeleton skeleton-soft h-4 w-32 rounded-full" />
            </div>
          </div>
          <div className="container mx-auto px-6 max-w-7xl mt-8">
            <div className="flex flex-wrap gap-4 justify-between items-center border-t border-[var(--hairline)] pt-4">
              <div className="skeleton skeleton-soft h-3 w-40 rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-48 rounded-full" />
            </div>
          </div>
        </section>
      </SectionBand>

      <span className="sr-only">Loading content from the cloud…</span>
    </div>
  );
}

/** Shared section-header silhouette: eyebrow + big title + supporting line. */
function SectionHeaderSkeleton({ container }: { container: string }) {
  return (
    <div className={`container mx-auto px-6 ${container} pt-20 sm:pt-28 pb-12`}>
      <div className="skeleton skeleton-soft h-3 w-28 rounded-full mb-5" />
      <div
        className="skeleton skeleton-brand rounded-2xl w-[60%]"
        style={{ height: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
      />
      <div className="skeleton skeleton-soft h-3 w-full max-w-xl rounded-full mt-6" />
    </div>
  );
}

/** Bordered card silhouette matching real card styling. */
function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--hairline)] p-5 flex flex-col gap-4 bg-[var(--surface-1)]/40">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton h-5 w-3/4 rounded-full" />
      <div className="space-y-2">
        <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
        <div className="skeleton skeleton-soft h-3 w-5/6 rounded-full" />
        <div className="skeleton skeleton-soft h-3 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Shown when Supabase responded but the singleton row is empty
 * or unavailable. The page intentionally renders nothing else so
 * the user sees only what is in the database.
 */
export function EmptyDataState({ message }: { message?: string }) {
  return (
    <div
      role="alert"
      className="relative z-[2] min-h-screen flex items-center justify-center bg-background text-foreground px-6"
    >
      <div className="max-w-md text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] opacity-60">
          No content
        </p>
        <h2 className="font-display text-3xl tracking-tight">
          Nothing to show yet.
        </h2>
        <p className="text-sm opacity-70 leading-relaxed">
          {message ??
            "The cloud database has no site content. Add content from the settings drawer to populate this page."}
        </p>
      </div>
    </div>
  );
}
