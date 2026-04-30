import { useEffect, useState } from "react";

/**
 * Thin scroll-progress bar fixed to the top of the viewport. Updates a CSS
 * `scaleX` transform on every scroll based on the document's scroll ratio.
 */
export function ScrollProgress({ className = "" }: { className?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-primary ${className}`}
      style={{ transform: `scaleX(${p})`, transition: "transform 80ms linear" }}
    />
  );
}
