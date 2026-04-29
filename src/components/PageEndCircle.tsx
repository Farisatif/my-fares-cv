import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Section-top illuminating disc — exclusive, layered "sun" composition.
 *
 * Architecture (back → front):
 *   1. Soft conic halo — wide brand-tinted bloom that bleeds into the band
 *   2. Outer atmosphere ring — slow rotating dashed ring, gives orbital depth
 *   3. Core disc — solid brand-aware fill (inverts vs heading), with an inner
 *      highlight gradient for dimensional sphere quality
 *   4. Specular highlight — small offset bright spot on the upper-left,
 *      reading as ambient light hitting a polished surface
 *   5. Rim light — thin gradient stroke catching the disc's edge
 *
 * Parallax: descends from above the section, scales to 1, then drifts past.
 * Mount inside a `relative overflow-hidden` parent.
 */
export function PageEndCircle() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Descend, grow, then drift past — gentle, deliberate easing.
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["-45%", "0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.88]);
  // Halo breathes against the core for a living glow.
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.15, 1.25]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.85, 0.7, 0.4]);
  // Ring rotates slowly with scroll — orbital effect tied to the user.
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 35]);

  const sizing = "h-[58vw] w-[58vw] max-h-[420px] max-w-[420px] sm:h-[38vw] sm:w-[38vw]";

  // Static fallback for reduced motion — still layered, just no parallax.
  if (reduced) {
    return (
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center"
      >
        <div className={`relative ${sizing}`}>
          <DiscLayers />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center"
    >
      <motion.div
        style={{ y, scale, opacity, transformOrigin: "50% 50%" }}
        className={`relative ${sizing}`}
      >
        {/* Soft conic halo — bleeds into the section band */}
        <motion.div
          style={{ scale: haloScale, opacity: haloOpacity }}
          className="absolute inset-[-22%] rounded-full blur-3xl"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(from 140deg, color-mix(in oklab, var(--primary) 30%, transparent), color-mix(in oklab, var(--primary-glow) 22%, transparent), color-mix(in oklab, var(--primary) 28%, transparent), color-mix(in oklab, var(--primary-glow) 18%, transparent), color-mix(in oklab, var(--primary) 30%, transparent))",
            }}
          />
        </motion.div>

        {/* Outer atmosphere ring — slow scroll-rotation */}
        <motion.div
          style={{ rotate: ringRotate }}
          className="absolute inset-[-6%] rounded-full"
        >
          <div
            className="h-full w-full rounded-full opacity-40"
            style={{
              background: "transparent",
              border:
                "1px dashed color-mix(in oklab, var(--primary) 28%, transparent)",
              maskImage:
                "radial-gradient(circle, transparent 62%, black 65%, black 78%, transparent 82%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 62%, black 65%, black 78%, transparent 82%)",
            }}
          />
        </motion.div>

        {/* Core disc + highlight + rim — wrapped in a single positioned layer */}
        <DiscLayers />
      </motion.div>
    </div>
  );
}

/**
 * The layered disc composition (core, inner highlight, specular, rim).
 * Extracted so the reduced-motion fallback can render the same visual.
 */
function DiscLayers() {
  return (
    <div className="absolute inset-0">
      {/* Core disc — INVERTED: matches band tone (light in light, dark in dark) */}
      <div
        className="absolute inset-0 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, oklch(1 0 0) 0%, oklch(0.94 0.012 258) 60%, oklch(0.86 0.03 262) 100%)",
        }}
      />
      {/* Dark-mode override: deep indigo-black disc */}
      <div
        className="hidden dark:block absolute inset-0 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, oklch(0.22 0.04 268) 0%, oklch(0.115 0.025 268) 60%, oklch(0.07 0.018 268) 100%)",
        }}
      />

      {/* Rim light — thin gradient ring catching the upper edge */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 220deg, transparent 0%, color-mix(in oklab, var(--primary) 45%, transparent) 18%, transparent 40%, transparent 60%, color-mix(in oklab, var(--primary-glow) 35%, transparent) 78%, transparent 100%)",
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0.7,
        }}
      />

      {/* Specular highlight — small offset bright bloom on upper-left */}
      <div
        className="absolute rounded-full blur-2xl mix-blend-screen"
        style={{
          top: "12%",
          left: "18%",
          width: "32%",
          height: "32%",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 70%, white) 0%, transparent 70%)",
          opacity: 0.55,
        }}
      />

      {/* Inner subtle vignette — deepens the bottom edge for sphere illusion */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 110%, color-mix(in oklab, black 35%, transparent), transparent 55%)",
          mixBlendMode: "multiply",
          opacity: 0.45,
        }}
      />
    </div>
  );
}
