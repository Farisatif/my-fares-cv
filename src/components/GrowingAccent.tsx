import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Kitsys-inspired scroll-reactive accent shape.
 * Renders a deep-blue rounded square that scales as the user scrolls past it.
 *
 * Two modes:
 *  - inline (default): flows with content
 *  - absolute: positioned absolutely behind content (use within a `relative` parent)
 */
export function GrowingAccent({
  size = "md",
  className = "",
  absolute = false,
  blur = false,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  absolute?: boolean;
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 1.6]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 0.85, 0.85, 0]);

  const dim =
    size === "sm"
      ? "h-16 w-16"
      : size === "lg"
        ? "h-32 w-32"
        : size === "xl"
          ? "h-44 w-44"
          : "h-24 w-24";

  const wrapperClass = absolute
    ? `absolute pointer-events-none ${className}`
    : `relative inline-flex ${className}`;

  return (
    <div ref={ref} className={wrapperClass} aria-hidden>
      {!reduced && (
        <motion.div
          style={{
            scale,
            y,
            opacity,
            background:
              "linear-gradient(135deg, oklch(0.22 0.14 268), oklch(0.3 0.18 268) 60%, var(--primary-deep))",
            filter: blur ? "blur(28px)" : undefined,
          }}
          className={`${dim} rounded-2xl will-change-transform shadow-lg shadow-primary/30`}
        />
      )}
    </div>
  );
}
