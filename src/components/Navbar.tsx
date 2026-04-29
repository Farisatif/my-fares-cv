import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageSquare, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

/**
 * Floating vertical icon column — exclusive, container-less rail.
 * No surrounding capsule. Each icon stands alone, with its own micro
 * glass disc revealed on hover or active state.
 */
export function Navbar() {
  const [, setScrolled] = useState(false);
  const loc = useLocation();
  const { lang, t } = useLang();
  const { data } = useSiteData();
  const nav = data.navigation;
  const showComments = nav?.showComments !== false;
  const contactLabel =
    lang === "ar" ? nav?.contactLabelAr || "تواصل" : nav?.contactLabelEn || "Contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onComments = loc.pathname === "/comments";
  const onExplore = loc.pathname === "/explore";
  const onHome = loc.pathname === "/";

  const pillSpring = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.7 };

  type NavItem = {
    key: string;
    label: string;
    icon: LucideIcon;
    to: string;
    hash?: string;
    active?: boolean;
    show: boolean;
  };

  const items: NavItem[] = [
    { key: "home", label: t("Home", "الرئيسية"), icon: Home, to: "/", active: onHome, show: true },
    { key: "explore", label: t("Explore", "استكشف"), icon: Compass, to: "/explore", active: onExplore, show: true },
    {
      key: "comments",
      label: t("Comments", "التعليقات"),
      icon: MessageSquare,
      to: "/comments",
      active: onComments,
      show: showComments,
    },
  ].filter((i) => i.show);

  const isRTL = lang === "ar";
  const sideClass = isRTL ? "left-3 sm:left-5" : "right-3 sm:right-5";
  const tooltipSide = isRTL ? "left-full ml-3" : "right-full mr-3";
  const indicatorSide = isRTL ? "right-0 -mr-1.5" : "left-0 -ml-1.5";

  return (
    <motion.aside
      initial={{ opacity: 0, x: isRTL ? -32 : 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${sideClass} pointer-events-none`}
      aria-label={t("Primary navigation", "التنقل الرئيسي")}
    >
      <LayoutGroup id="navbar-rail-edge">
        <nav className="pointer-events-auto relative flex flex-col items-center gap-3 sm:gap-3.5">
          {items.map((item) => (
            <RailIcon
              key={item.key}
              icon={item.icon}
              label={item.label}
              to={item.to}
              hash={item.hash}
              active={item.active === true}
              tooltipSide={tooltipSide}
              indicatorSide={indicatorSide}
              pillSpring={pillSpring}
            />
          ))}

          <SeparatorDot />

          {/* Premium contact CTA — solid foreground glyph */}
          <Link
            to="/"
            hash="contact"
            preload="intent"
            aria-label={contactLabel}
            title={contactLabel}
            className="group/icon relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-foreground text-background hover:scale-[1.06] active:scale-95 transition-transform duration-200 focus-ring"
            style={{
              boxShadow:
                "0 8px 22px -8px color-mix(in oklab, var(--foreground) 55%, transparent), 0 0 0 1px color-mix(in oklab, var(--foreground) 18%, transparent)",
            }}
          >
            <Mail className="h-4 w-4 sm:h-[17px] sm:w-[17px]" strokeWidth={2.1} />
            <Tooltip side={tooltipSide}>{contactLabel}</Tooltip>
          </Link>

          <SeparatorDot />

          <div className="flex flex-col items-center gap-2 pt-0.5">
            <ThemeLangToggle />
          </div>
        </nav>
      </LayoutGroup>
    </motion.aside>
  );
}

function SeparatorDot() {
  return (
    <span
      aria-hidden
      className="h-1 w-1 rounded-full opacity-40"
      style={{ background: "currentColor" }}
    />
  );
}

function RailIcon({
  icon: Icon,
  label,
  to,
  hash,
  active,
  tooltipSide,
  indicatorSide,
  pillSpring,
}: {
  icon: LucideIcon;
  label: string;
  to: string;
  hash?: string;
  active: boolean;
  tooltipSide: string;
  indicatorSide: string;
  pillSpring: { type: "spring"; stiffness: number; damping: number; mass: number };
}) {
  return (
    <Link
      to={to}
      hash={hash}
      preload="intent"
      aria-label={label}
      title={label}
      className={`group/icon relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-colors duration-300 focus-ring active:scale-[0.92] ${
        active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {/* Hover glass disc — only when not active */}
      {!active && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
          style={{
            background: "color-mix(in oklab, var(--surface-1) 55%, transparent)",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            border: "1px solid var(--hairline)",
            boxShadow:
              "0 6px 18px -10px color-mix(in oklab, var(--foreground) 22%, transparent)",
          }}
        />
      )}

      {/* Active gradient halo */}
      {active && (
        <motion.span
          layoutId="rail-edge-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(140deg, color-mix(in oklab, var(--primary) 22%, transparent), color-mix(in oklab, var(--primary-glow) 16%, transparent))",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--primary) 38%, transparent), 0 8px 22px -8px color-mix(in oklab, var(--primary) 50%, transparent)",
          }}
          transition={pillSpring}
        />
      )}

      {/* Active edge indicator — small brand dot on the inner side */}
      {active && (
        <motion.span
          layoutId="rail-edge-indicator"
          aria-hidden
          className={`absolute ${indicatorSide} top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full`}
          style={{
            background: "var(--primary)",
            boxShadow: "0 0 10px var(--primary)",
          }}
          transition={pillSpring}
        />
      )}

      <span className="relative z-10 flex items-center justify-center">
        <Icon className="h-4 w-4 sm:h-[17px] sm:w-[17px]" strokeWidth={2.1} />
      </span>

      <Tooltip side={tooltipSide}>{label}</Tooltip>
    </Link>
  );
}

function Tooltip({ children, side }: { children: React.ReactNode; side: string }) {
  return (
    <span
      className={`pointer-events-none absolute ${side} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 backdrop-blur-xl bg-[var(--surface-1)]/90 border border-[var(--hairline)] text-foreground brand-shadow-sm`}
    >
      {children}
    </span>
  );
}
