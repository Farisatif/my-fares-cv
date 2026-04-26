import type { ReactNode } from "react";

/**
 * Kitsys-inspired chevron pattern background.
 * Uses the brand primary color via CSS so it renders consistently in both
 * light and dark themes (no hard-coded hex).
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
        className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
        style={{
          backgroundColor: "var(--primary)",
          WebkitMaskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='14,22 22,30 14,38' transform='rotate(15 18 30)'/><polyline points='38,22 46,30 38,38' transform='rotate(-25 42 30)'/></g></svg>\")",
          maskImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='14,22 22,30 14,38' transform='rotate(15 18 30)'/><polyline points='38,22 46,30 38,38' transform='rotate(-25 42 30)'/></g></svg>\")",
          WebkitMaskSize: "60px 60px",
          maskSize: "60px 60px",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
        }}
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
