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
  return (
    <motion.div
      ref={ref}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y, scale: 0.985, filter: "blur(8px)" }
      }
      animate={
        inView
          ? reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : {}
      }
      transition={
        reduce
          ? { duration: 0.4, delay }
          : {
              opacity: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] },
              filter: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
            }
      }
      style={{ willChange: "transform, opacity, filter" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}