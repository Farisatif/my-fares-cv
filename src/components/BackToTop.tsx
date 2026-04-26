import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLang } from "./LanguageProvider";

/**
 * Floating back-to-top button.
 *
 * Appears once the user has scrolled past ~80% of the viewport height.
 * Sits above the bottom-anchored navbar with a safe-area inset so it never
 * overlaps the floating pill on iOS. Uses smooth scroll, respects reduced
 * motion, and is fully keyboard-accessible via the shared focus ring.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { t } = useLang();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.8);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const label = t("Back to top", "العودة للأعلى");

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label={label}
          title={label}
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          whileHover={reduce ? undefined : { y: -3 }}
          whileTap={{ scale: 0.94 }}
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
          }}
          className="focus-ring fixed right-4 sm:right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background border border-[var(--hairline)] brand-shadow-sm hover:bg-foreground/90 transition-colors"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
