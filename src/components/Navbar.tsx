import { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageSquare, Mail, Sun, Moon, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

/**
 * Edge-anchored vertical icon column.
 *
 * Each icon is a half-pill flush to the screen edge:
 *  - rounded on the INNER side only (toward the page)
 *  - flat on the OUTER side (kissing the viewport edge)
 *  - its own brand-tinted background so each glyph reads as a distinct chip
 *
 * Order (top → bottom, single straight line):
 *   Home · Explore · Comments · Contact · Language · Theme
 */
export function Navbar() {
  const [, setScrolled] = useState(false);
  const loc = useLocation();
  const { lang, t, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
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
  const isRTL = lang === "ar";

  // Side anchoring: flush to the viewport edge (no horizontal offset).
  const sideClass = isRTL ? "left-0" : "right-0";
  const tooltipSide = isRTL ? "left-full ml-2" : "right-full mr-2";
  // Inner-side rounded corners only — outer edge stays flat against the screen.
  const halfPillRadius = isRTL
    ? "rounded-r-2xl rounded-l-none"
    : "rounded-l-2xl rounded-r-none";

  type NavItem = {
    key: string;
    label: string;
    icon: LucideIcon;
    to: string;
    hash?: string;
    active?: boolean;
    show: boolean;
  };

  // Unified chip style — every icon is a solid filled half-pill (matches the
  // contact CTA's visual weight) so the rail reads as one cohesive ribbon.
  // Uses the foreground token so it auto-inverts: black-on-light, white-on-dark.
  const chipBg = "var(--foreground)";
  const chipText = "var(--background)";
  // Professional layered shadow — soft ambient + tight contact shadow for depth.
  const chipShadow =
    "0 12px 28px -14px color-mix(in oklab, var(--foreground) 55%, transparent), 0 4px 10px -6px color-mix(in oklab, var(--foreground) 35%, transparent), inset 0 1px 0 0 color-mix(in oklab, #ffffff 14%, transparent)";
  // Brand-blue shadow for the contact CTA so it carries identity weight.
  const mailShadow =
    "0 14px 32px -12px color-mix(in oklab, var(--primary) 65%, transparent), 0 4px 12px -6px color-mix(in oklab, var(--primary) 50%, transparent), inset 0 1px 0 0 color-mix(in oklab, #ffffff 18%, transparent)";

  const items: NavItem[] = [
    {
      key: "home",
      label: t("Home", "الرئيسية"),
      icon: Home,
      to: "/",
      active: onHome,
      show: true,
    },
    {
      key: "explore",
      label: t("Explore", "استكشف"),
      icon: Compass,
      to: "/explore",
      active: onExplore,
      show: true,
    },
    {
      key: "comments",
      label: t("Comments", "التعليقات"),
      icon: MessageSquare,
      to: "/comments",
      active: onComments,
      show: showComments,
    },
  ].filter((i) => i.show);

  return (
    <motion.aside
      initial={{ opacity: 0, x: isRTL ? -32 : 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${sideClass} pointer-events-none`}
      aria-label={t("Primary navigation", "التنقل الرئيسي")}
    >
      <LayoutGroup id="navbar-rail-edge">
        {/* Tight straight column — icons stack with a hairline gap so they
            read as one continuous edge ribbon yet remain distinct chips. */}
        <nav className="pointer-events-auto relative flex flex-col items-stretch gap-1.5">
          {items.map((item) => (
            <RailIcon
              key={item.key}
              icon={item.icon}
              label={item.label}
              to={item.to}
              hash={item.hash}
              active={item.active === true}
              tooltipSide={tooltipSide}
              halfPillRadius={halfPillRadius}
              chipBg={chipBg}
              isRTL={isRTL}
              pillSpring={pillSpring}
            />
          ))}

          {/* Contact CTA — solid foreground filled half-pill */}
          <Link
            to="/"
            hash="contact"
            preload="intent"
            aria-label={contactLabel}
            title={contactLabel}
            className={`group/icon relative flex items-center justify-center h-10 w-11 sm:h-11 sm:w-12 ${halfPillRadius} bg-foreground text-background hover:scale-x-[1.04] active:scale-95 transition-transform duration-200 focus-ring`}
            style={{
              transformOrigin: isRTL ? "left center" : "right center",
              boxShadow:
                "0 8px 22px -10px color-mix(in oklab, var(--foreground) 55%, transparent)",
            }}
          >
            <Mail className="h-[18px] w-[18px]" strokeWidth={2.1} />
            <Tooltip side={tooltipSide}>{contactLabel}</Tooltip>
          </Link>

          {/* Language toggle — its own edge chip */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("Toggle language", "تبديل اللغة")}
            title={t("Toggle language", "تبديل اللغة")}
            className={`group/icon relative flex items-center justify-center h-10 w-11 sm:h-11 sm:w-12 ${halfPillRadius} text-foreground hover:scale-x-[1.04] active:scale-95 transition-transform duration-200 focus-ring overflow-hidden`}
            style={{
              transformOrigin: isRTL ? "left center" : "right center",
              background: chipBg,
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              boxShadow:
                "inset 0 1px 0 0 color-mix(in oklab, var(--foreground) 5%, transparent), 0 6px 16px -10px color-mix(in oklab, var(--foreground) 22%, transparent)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={lang}
                initial={{ y: 8, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -8, opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="flex items-center gap-1 font-display text-[11px] tracking-wider"
              >
                <Languages className="h-3.5 w-3.5 opacity-70" strokeWidth={2.1} />
                {lang === "ar" ? "ع" : "EN"}
              </motion.span>
            </AnimatePresence>
            <Tooltip side={tooltipSide}>
              {t("Language", "اللغة")}
            </Tooltip>
          </button>

          {/* Theme toggle — directly below language for one straight line */}
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              toggleTheme({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            aria-label={t("Toggle theme", "تبديل المظهر")}
            title={t("Toggle theme", "تبديل المظهر")}
            className={`group/icon relative flex items-center justify-center h-10 w-11 sm:h-11 sm:w-12 ${halfPillRadius} text-foreground hover:scale-x-[1.04] active:scale-95 transition-transform duration-200 focus-ring overflow-hidden`}
            style={{
              transformOrigin: isRTL ? "left center" : "right center",
              background: chipBg,
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              boxShadow:
                "inset 0 1px 0 0 color-mix(in oklab, var(--foreground) 5%, transparent), 0 6px 16px -10px color-mix(in oklab, var(--foreground) 22%, transparent)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.span
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Moon className="h-[17px] w-[17px]" strokeWidth={2.1} />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sun className="h-[17px] w-[17px]" strokeWidth={2.1} />
                </motion.span>
              )}
            </AnimatePresence>
            <Tooltip side={tooltipSide}>{t("Theme", "المظهر")}</Tooltip>
          </button>
        </nav>
      </LayoutGroup>
    </motion.aside>
  );
}

function RailIcon({
  icon: Icon,
  label,
  to,
  hash,
  active,
  tooltipSide,
  halfPillRadius,
  chipBg,
  isRTL,
  pillSpring,
}: {
  icon: LucideIcon;
  label: string;
  to: string;
  hash?: string;
  active: boolean;
  tooltipSide: string;
  halfPillRadius: string;
  chipBg: string;
  isRTL: boolean;
  pillSpring: { type: "spring"; stiffness: number; damping: number; mass: number };
}) {
  return (
    <Link
      to={to}
      hash={hash}
      preload="intent"
      aria-label={label}
      title={label}
      className={`group/icon relative flex items-center justify-center h-10 w-11 sm:h-11 sm:w-12 ${halfPillRadius} text-foreground/80 hover:text-foreground transition-[color,transform] duration-300 focus-ring active:scale-95 overflow-hidden`}
      style={{
        transformOrigin: isRTL ? "left center" : "right center",
        background: chipBg,
        backdropFilter: "blur(18px) saturate(160%)",
        WebkitBackdropFilter: "blur(18px) saturate(160%)",
        boxShadow:
          "inset 0 1px 0 0 color-mix(in oklab, var(--foreground) 5%, transparent), 0 6px 16px -10px color-mix(in oklab, var(--foreground) 22%, transparent)",
      }}
    >
      {/* Hover sheen — soft inner highlight on the inner side */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
        style={{
          background: isRTL
            ? "linear-gradient(to left, transparent 50%, color-mix(in oklab, var(--foreground) 8%, transparent))"
            : "linear-gradient(to right, transparent 50%, color-mix(in oklab, var(--foreground) 8%, transparent))",
        }}
      />

      {/* Active brand wash — sliding shared layout */}
      {active && (
        <motion.span
          layoutId="rail-edge-active"
          aria-hidden
          className={`absolute inset-0 ${halfPillRadius}`}
          style={{
            background:
              "linear-gradient(140deg, color-mix(in oklab, var(--primary) 32%, transparent), color-mix(in oklab, var(--primary-glow) 22%, transparent))",
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, var(--primary) 40%, transparent)",
          }}
          transition={pillSpring}
        />
      )}

      {/* Active edge accent — a colored bar pinned to the OUTER edge */}
      {active && (
        <motion.span
          layoutId="rail-edge-bar"
          aria-hidden
          className={`absolute top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full ${
            isRTL ? "left-0" : "right-0"
          }`}
          style={{
            background: "var(--primary)",
            boxShadow: "0 0 10px var(--primary)",
          }}
          transition={pillSpring}
        />
      )}

      <span className="relative z-10 flex items-center justify-center">
        <Icon className="h-[17px] w-[17px]" strokeWidth={2.1} />
      </span>

      <Tooltip side={tooltipSide}>{label}</Tooltip>
    </Link>
  );
}

function Tooltip({ children, side }: { children: React.ReactNode; side: string }) {
  return (
    <span
      className={`pointer-events-none absolute ${side} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 backdrop-blur-xl bg-[var(--surface-1)]/90 border border-[var(--hairline)] text-foreground brand-shadow-sm z-20`}
    >
      {children}
    </span>
  );
}
