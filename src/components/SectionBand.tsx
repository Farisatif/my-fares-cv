import type { ReactNode } from "react";

/**
 * SectionBand — alternating colored bands that wrap each main section.
 *
 * Three variants cycle across the page: light, dark, primary.
 * In dark mode, light and dark swap automatically (the variant is the same,
 * but the underlying tokens flip), while primary stays as the brand accent.
 *
 * This gives the homepage a deliberate, magazine-style rhythm of contrasting
 * sections while keeping the design system cohesive.
 */
export type BandVariant = "light" | "dark" | "primary" | "surface" | "soft";

interface Props {
  variant: BandVariant;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Show subtle grid pattern background */
  pattern?: "grid" | "grid-fine" | "grid-dots" | "mesh" | "aurora" | "gradient" | "chevron" | "none";
  /** Show top hairline divider */
  divider?: boolean;
  /** Round the bottom corners — creates a soft "card stack" rhythm between sections. */
  roundBottom?: boolean;
  /** Round the top corners — pairs with the previous section's roundBottom. */
  roundTop?: boolean;
}

const variantClasses: Record<BandVariant, string> = {
  light: "bg-band-light text-band-light-foreground",
  dark: "bg-band-dark text-band-dark-foreground",
  primary: "bg-band-primary text-band-primary-foreground",
  surface: "bg-band-surface text-band-surface-foreground",
  soft: "bg-band-soft text-band-soft-foreground",
};

const patternClasses: Record<NonNullable<Props["pattern"]>, string> = {
  grid: "grid-bg",
  "grid-fine": "grid-bg-fine",
  "grid-dots": "grid-bg-dots",
  mesh: "mesh-bg",
  aurora: "aurora-bg",
  gradient: "gradient-bg",
  chevron: "chevron-bg",
  none: "",
};

export function SectionBand({
  variant,
  children,
  className = "",
  id,
  pattern = "none",
  divider = false,
  roundBottom = false,
  roundTop = false,
}: Props) {
  const radiusClasses = [
    roundTop ? "rounded-t-[2.5rem] sm:rounded-t-[3.5rem]" : "",
    roundBottom ? "rounded-b-[2.5rem] sm:rounded-b-[3.5rem]" : "",
  ].filter(Boolean).join(" ");
  // Negative top margin pulls each rounded-top band up so it visually
  // overlaps the previous band's rounded bottom — creating a layered
  // "card stack" where every section's tail tucks beneath the next one.
  const overlapClass = roundTop ? "-mt-10 sm:-mt-16" : "";
  return (
    <div
      id={id}
      data-band={variant}
      className={`relative isolate noise-overlay overflow-hidden ${variantClasses[variant]} ${radiusClasses} ${overlapClass} ${className}`}
      style={{
        // Stack later sections above earlier ones so the overlap is visible
        // and the rounded top corners sit on top of the previous section.
        zIndex: roundTop ? 1 : 0,
        ...(roundBottom || roundTop
          ? {
              boxShadow:
                "0 -20px 50px -30px color-mix(in oklab, currentColor 22%, transparent), 0 30px 60px -40px color-mix(in oklab, currentColor 25%, transparent)",
            }
          : {}),
      }}
    >
      {divider && (
        <div className="absolute top-0 left-0 right-0 section-divider opacity-60" />
      )}
      {pattern !== "none" && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-[1] ${patternClasses[pattern]}`}
        />
      )}
      {children}
    </div>
  );
}
