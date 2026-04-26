import { cn } from "@/lib/utils";

type SkeletonVariant =
  | "default"
  | "text"
  | "text-sm"
  | "text-lg"
  | "title"
  | "heading"
  | "circle"
  | "avatar"
  | "avatar-sm"
  | "button"
  | "pill"
  | "card"
  | "thumb"
  | "icon"
  | "icon-sm";

type SkeletonTone = "default" | "brand" | "soft";

type SkeletonProps = React.HTMLAttributes<HTMLElement> & {
  /** Render as <span> when used inline inside text/number elements. */
  as?: "div" | "span";
  /** Visual preset that matches a real piece of UI. */
  variant?: SkeletonVariant;
  /** Color tone — `brand` adds a primary wash, `soft` is subtler. */
  tone?: SkeletonTone;
};

/* Unified sizing scale — every skeleton in the app pulls from this set so the
   placeholders keep a consistent visual rhythm regardless of section. */
const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  default: "rounded-md",
  // Text lines (matches body type sizes)
  "text-sm": "h-2.5 w-full rounded-full",
  text: "h-3 w-full rounded-full",
  "text-lg": "h-3.5 w-full rounded-full",
  // Headings
  title: "h-5 w-3/4 rounded-lg",
  heading: "h-7 w-2/3 rounded-xl",
  // Round shapes
  circle: "rounded-full aspect-square",
  // Avatars (matches comment & admin row avatars)
  "avatar-sm": "h-9 w-9 rounded-xl",
  avatar: "h-11 w-11 rounded-2xl",
  // Interactive elements
  button: "h-10 w-32 rounded-full",
  pill: "h-6 w-20 rounded-full",
  // Media / cards
  card: "h-40 w-full rounded-2xl",
  thumb: "aspect-video w-full rounded-xl",
  // Inline icons
  icon: "h-4 w-4 rounded-md",
  "icon-sm": "h-3.5 w-3.5 rounded-md",
};

const TONE_CLASSES: Record<SkeletonTone, string> = {
  default: "",
  brand: "skeleton-brand",
  soft: "skeleton-soft",
};

/**
 * Modern skeleton placeholder with a soft shimmer sweep.
 * Uses theme-aware tokens via color-mix in styles.css (.skeleton).
 * Always preserve final layout dimensions to avoid jank on reveal.
 */
function Skeleton({
  className,
  as = "div",
  variant = "default",
  tone = "default",
  ...props
}: SkeletonProps) {
  const Tag = as as keyof React.JSX.IntrinsicElements;
  return (
    <Tag
      className={cn("skeleton", VARIANT_CLASSES[variant], TONE_CLASSES[tone], className)}
      aria-hidden="true"
      {...(props as Record<string, unknown>)}
    />
  );
}

/** Three-dot bouncing pulse — drop-in replacement for spinner icons. */
function DotPulse({ className }: { className?: string }) {
  return (
    <span className={cn("dot-pulse", className)} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export { Skeleton, DotPulse };
