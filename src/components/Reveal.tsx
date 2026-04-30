import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  // Cap caller-supplied delays — long staggers were a major source of the
  // "feels slow" perception. Anything above 0.18s is clamped down.
  const d = Math.min(delay, 0.18);
  return (
    <motion.div
      ref={ref}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: Math.min(y, 18) }
      }
      animate={
        inView
          ? reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : {}
      }
      transition={
        reduce
          ? { duration: 0.2, delay: d }
          : {
              opacity: { duration: 0.36, delay: d, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.42, delay: d, ease: [0.22, 1, 0.36, 1] },
            }
      }
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}