import type { ReactNode } from "react";

/**
 * Kitsys-inspired chevron pattern background.
 * Driven by `currentColor` so it naturally inverts per theme:
 *  - Light theme bands → dark chevrons
 *  - Dark theme bands  → light chevrons
 *
 * Use either as a wrapper (children rendered above the pattern) or via the
 * `chevron-bg` utility class on a positioned overlay (used by SectionBand).
 */
export function ChevronPattern({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 chevron-bg"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Kitsys-inspired dotted grid pattern background.
 * Driven by `var(--primary)` so it's visible in both themes.
 */
export function DotPattern({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--primary) 1.2px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
