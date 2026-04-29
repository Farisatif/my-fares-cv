import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.22, y: y * 0.3 });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  const base =
    "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-150 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.95] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--foreground)_35%,transparent)]"
      : "bg-card text-foreground border border-[var(--hairline)] hover:bg-secondary hover:border-border hover:translate-y-[-2px] active:scale-[0.95] transition-[background-color,color,box-shadow,transform,translate] duration-200";

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 16, mass: 0.5 }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer noopener" : undefined}
        aria-label={ariaLabel}
        className="focus-ring inline-block rounded-full"
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="focus-ring inline-block rounded-full bg-transparent border-0 p-0"
    >
      {content}
    </button>
  );
}
