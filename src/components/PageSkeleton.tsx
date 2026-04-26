/**
 * PageSkeleton — full-page shimmering skeleton shown while
 * site content is being fetched from the cloud (Supabase).
 *
 * Mirrors the rough silhouette of the real page (hero, marquee,
 * stacked section bands) so the layout doesn't jump when the
 * real content arrives. Uses the project's `.skeleton` class so
 * the shimmer matches the rest of the design system.
 */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className="relative z-[2] min-h-screen bg-background text-foreground"
    >
      {/* Hero silhouette */}
      <section className="container mx-auto px-6 pt-28 sm:pt-32 pb-16 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="skeleton h-6 w-48 rounded-full" />
            <div className="skeleton skeleton-brand h-16 sm:h-20 lg:h-24 w-3/4 rounded-2xl" />
            <div className="skeleton skeleton-brand h-16 sm:h-20 lg:h-24 w-1/2 rounded-2xl" />
            <div className="skeleton skeleton-brand h-16 sm:h-20 lg:h-24 w-2/3 rounded-2xl" />
            <div className="mt-8 space-y-3 max-w-xl">
              <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-[92%] rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-[85%] rounded-full" />
              <div className="skeleton skeleton-soft h-3 w-[60%] rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <div className="relative">
              <div className="skeleton skeleton-brand h-40 w-40 sm:h-52 sm:w-52 rounded-full" />
              <div className="skeleton absolute -bottom-2 -right-2 h-7 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="border-y border-[color-mix(in_oklab,currentColor_10%,transparent)] py-6 overflow-hidden">
        <div className="flex gap-10 px-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-soft h-4 w-32 sm:w-44 rounded-full shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Section silhouettes */}
      {Array.from({ length: 3 }).map((_, s) => (
        <section
          key={s}
          className="container mx-auto px-6 max-w-6xl py-20 sm:py-28"
        >
          <div className="flex flex-col gap-5 mb-12">
            <div className="skeleton skeleton-soft h-3 w-28 rounded-full" />
            <div className="skeleton skeleton-brand h-12 sm:h-16 w-2/3 rounded-2xl" />
            <div className="skeleton skeleton-soft h-3 w-full max-w-xl rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[color-mix(in_oklab,currentColor_10%,transparent)] p-5 flex flex-col gap-4"
              >
                <div className="skeleton h-5 w-3/4 rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-full rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-5/6 rounded-full" />
                <div className="skeleton skeleton-soft h-3 w-2/3 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ))}

      <span className="sr-only">Loading content from the cloud…</span>
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
