import { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageSquare, Mail, Sun, Moon, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

/**
 * Edge-anchored vertical nav rail — glassmorphism edition.
 *
 * New in this version:
 *  • Semi-transparent chips with backdrop-blur (glass effect, keeps colors)
 *  • Hover-expand: the whole rail widens to reveal inline labels
 *  • Scroll-aware opacity: fully solid when scrolled, ghost-like at the top
 *  • Active chip breathing glow
 *  • Magnetic cursor attraction on each chip
 *  • Scroll progress bar integrated into the outer edge
 */
export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const loc = useLocation();
  const { lang, t, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme }  = useTheme();
  const { data } = useSiteData();
  const nav = data.navigation;
  const showComments  = nav?.showComments !== false;
  const contactLabel  = lang === "ar"
    ? nav?.contactLabelAr || "تواصل"
    : nav?.contactLabelEn || "Contact";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.min(1, y / docH) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onComments = loc.pathname === "/comments";
  const onExplore  = loc.pathname === "/explore";
  const onHome     = loc.pathname === "/";
  const isRTL      = lang === "ar";

  const sideClass     = isRTL ? "left-0" : "right-0";
  const tooltipSide   = isRTL ? "left-full ml-2" : "right-full mr-2";
  const halfPillRadius = isRTL
    ? "rounded-r-2xl rounded-l-none"
    : "rounded-l-2xl rounded-r-none";

  const pillSpring = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.7 };

  // Glass chip: keeps the original brand color but semi-transparent + blur
  const chipBgSolid   = "oklch(0.18 0.02 265)";
  const chipBgGlass   = "color-mix(in oklab, oklch(0.18 0.02 265) 72%, transparent)";
  const chipText      = "oklch(0.95 0.01 265)";
  // Use glass when at top of page, solid when scrolled
  const chipBg        = scrolled ? chipBgSolid : chipBgGlass;

  const chipShadow =
    "0 8px 24px -12px color-mix(in oklab, oklch(0.1 0.02 265) 55%, transparent), 0 3px 8px -4px color-mix(in oklab, oklch(0.1 0.02 265) 40%, transparent), inset 0 1px 0 0 color-mix(in oklab, #ffffff 10%, transparent)";
  const mailShadow =
    "0 10px 28px -10px color-mix(in oklab, var(--primary) 60%, transparent), 0 3px 10px -5px color-mix(in oklab, var(--primary) 45%, transparent), inset 0 1px 0 0 color-mix(in oklab, #ffffff 18%, transparent)";

  // Subtle glass border for definition
  const chipBorder = `inset 0 0 0 1px color-mix(in oklab, #ffffff ${scrolled ? "7" : "12"}%, transparent)`;

  type NavItem = {
    key: string; label: string; icon: LucideIcon;
    to: string; hash?: string; active?: boolean; show: boolean;
  };

  const items: NavItem[] = [
    { key: "home",     label: t("Home", "الرئيسية"),     icon: Home,         to: "/",         active: onHome,     show: true },
    { key: "explore",  label: t("Explore", "استكشف"),    icon: Compass,      to: "/explore",  active: onExplore,  show: true },
    { key: "comments", label: t("Comments", "التعليقات"),icon: MessageSquare,to: "/comments", active: onComments, show: showComments },
  ].filter((i) => i.show);

  // Scroll progress track height (percentage of rail height)
  const progressH = `${Math.round(scrollPct * 100)}%`;

  return (
    <motion.aside
      initial={{ opacity: 0, x: isRTL ? -32 : 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${sideClass} pointer-events-none`}
      aria-label={t("Primary navigation", "التنقل الرئيسي")}
    >
      <LayoutGroup id="navbar-rail-edge">
        <div className="pointer-events-auto relative flex flex-col items-stretch">

          {/* ── Scroll progress track ───────────────────────────────────────
              Thin line pinned to the outer edge of the rail. Grows from top
              to bottom as the user scrolls, giving a subtle depth cue. */}
          <div
            aria-hidden
            className={`absolute top-0 bottom-0 w-[2px] ${isRTL ? "right-0" : "left-[calc(100%-2px)]"} rounded-full overflow-hidden`}
            style={{ background: "color-mix(in oklab, currentColor 6%, transparent)" }}
          >
            <motion.div
              className="w-full rounded-full"
              style={{
                height: progressH,
                background: "color-mix(in oklab, var(--primary) 70%, transparent)",
                boxShadow: "0 0 8px color-mix(in oklab, var(--primary) 80%, transparent)",
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* ── Rail ────────────────────────────────────────────────────── */}
          <nav className="relative flex flex-col items-stretch gap-1.5">
            {items.map((item) => (
              <RailChip
                key={item.key}
                itemKey={item.key}
                icon={item.icon}
                label={item.label}
                to={item.to}
                hash={item.hash}
                active={item.active === true}
                tooltipSide={tooltipSide}
                halfPillRadius={halfPillRadius}
                chipBg={chipBg}
                chipBorder={chipBorder}
                chipText={chipText}
                chipShadow={chipShadow}
                isRTL={isRTL}
                pillSpring={pillSpring}
                isHovered={hoveredKey === item.key}
                onHoverChange={(h) => setHoveredKey(h ? item.key : null)}
                scrolled={scrolled}
              />
            ))}

            {/* Contact CTA */}
            <ExpandableChip
              as="link"
              to="/"
              hash="contact"
              label={contactLabel}
              tooltipSide={tooltipSide}
              halfPillRadius={halfPillRadius}
              isRTL={isRTL}
              isHovered={hoveredKey === "contact"}
              onHoverChange={(h) => setHoveredKey(h ? "contact" : null)}
              chipBg="linear-gradient(140deg, oklch(0.42 0.16 260) 0%, oklch(0.30 0.13 265) 100%)"
              chipBorder="inset 0 1px 0 0 color-mix(in oklab, #ffffff 18%, transparent)"
              chipText="#ffffff"
              chipShadow={mailShadow}
              scrolled={scrolled}
            >
              <Mail className="h-[17px] w-[17px] shrink-0" strokeWidth={2.1} />
            </ExpandableChip>

            {/* Language toggle */}
            <ExpandableChip
              as="button"
              onClick={toggleLang}
              label={t("Language", "اللغة")}
              tooltipSide={tooltipSide}
              halfPillRadius={halfPillRadius}
              isRTL={isRTL}
              isHovered={hoveredKey === "lang"}
              onHoverChange={(h) => setHoveredKey(h ? "lang" : null)}
              chipBg={chipBg}
              chipBorder={chipBorder}
              chipText={chipText}
              chipShadow={chipShadow}
              scrolled={scrolled}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={lang}
                  initial={{ y: 8, opacity: 0, scale: 0.85 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -8, opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                  className="flex items-center gap-1 font-display text-[11px] tracking-wider shrink-0"
                >
                  <Languages className="h-3.5 w-3.5 opacity-70 shrink-0" strokeWidth={2.1} />
                  {lang === "ar" ? "ع" : "EN"}
                </motion.span>
              </AnimatePresence>
            </ExpandableChip>

            {/* Theme toggle */}
            <ExpandableChip
              as="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                const rect = e.currentTarget.getBoundingClientRect();
                toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
              }}
              label={t("Theme", "المظهر")}
              tooltipSide={tooltipSide}
              halfPillRadius={halfPillRadius}
              isRTL={isRTL}
              isHovered={hoveredKey === "theme"}
              onHoverChange={(h) => setHoveredKey(h ? "theme" : null)}
              chipBg={chipBg}
              chipBorder={chipBorder}
              chipText={chipText}
              chipShadow={chipShadow}
              scrolled={scrolled}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.span key="moon"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon className="h-[17px] w-[17px]" strokeWidth={2.1} />
                  </motion.span>
                ) : (
                  <motion.span key="sun"
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
            </ExpandableChip>
          </nav>
        </div>
      </LayoutGroup>
    </motion.aside>
  );
}

// ─── RailChip — nav links with magnetic hover + active glow ───────────────────

function RailChip({
  icon: Icon, label, to, hash, active,
  tooltipSide, halfPillRadius,
  chipBg, chipBorder, chipText, chipShadow,
  isRTL, pillSpring, railHovered, scrolled,
}: {
  icon: LucideIcon; label: string; to: string; hash?: string; active: boolean;
  tooltipSide: string; halfPillRadius: string;
  chipBg: string; chipBorder: string; chipText: string; chipShadow: string;
  isRTL: boolean; pillSpring: object; railHovered: boolean; scrolled: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy  = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.25);
    my.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const glowOpacity = useTransform(
    useMotionValue(active ? 1 : 0),
    [0, 1],
    ["0", "1"],
  );

  return (
    <motion.div style={{ x: sx, y: sy }} className="relative">
      {/* Active chip ambient glow — bleeds behind */}
      {active && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.5, 0.85, 0.5], scale: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 -z-10 ${halfPillRadius} blur-md`}
          style={{
            background: "linear-gradient(140deg, oklch(0.50 0.20 260), oklch(0.38 0.16 265))",
            transform: "scale(1.3)",
          }}
        />
      )}

      <Link
        ref={ref}
        to={to}
        hash={hash}
        preload="intent"
        aria-label={label}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`group/icon relative flex items-center justify-center overflow-hidden ${halfPillRadius} active:scale-95 transition-[width,transform] duration-200 focus-ring`}
        style={{
          height: 44,
          width: 44,
          minWidth: 44,
          transformOrigin: isRTL ? "left center" : "right center",
          background: active
            ? "linear-gradient(140deg, oklch(0.50 0.18 260) 0%, oklch(0.38 0.15 265) 100%)"
            : chipBg,
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          color: chipText,
          boxShadow: active
            ? `0 8px 24px -8px color-mix(in oklab, var(--primary) 55%, transparent), inset 0 1px 0 0 color-mix(in oklab, #ffffff 18%, transparent)`
            : `${chipShadow}, ${chipBorder}`,
        }}
      >
        {/* Hover inner sheen */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
          style={{
            background: isRTL
              ? "linear-gradient(to left, transparent 40%, color-mix(in oklab, #ffffff 7%, transparent))"
              : "linear-gradient(to right, transparent 40%, color-mix(in oklab, #ffffff 7%, transparent))",
          }}
        />

        {/* Active edge accent bar */}
        {active && (
          <motion.span
            layoutId="rail-edge-bar"
            aria-hidden
            className={`absolute top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full ${isRTL ? "left-0" : "right-0"}`}
            style={{
              background: "oklch(0.85 0.08 240)",
              boxShadow: "0 0 8px oklch(0.85 0.08 240), 0 0 16px color-mix(in oklab, var(--primary) 50%, transparent)",
            }}
            transition={pillSpring}
          />
        )}

        <span className="relative z-10 flex items-center justify-center" style={{ color: "#ffffff" }}>
          <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={2.1} />
        </span>

        {/* Hover-expand label */}
        <motion.span
          aria-hidden
          initial={{ maxWidth: 0, opacity: 0 }}
          animate={{ maxWidth: railHovered ? 72 : 0, opacity: railHovered ? 1 : 0, x: railHovered ? 0 : (isRTL ? 4 : -4) }}
          transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.5 }}
          className="overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-wide"
          style={{ color: "#ffffff" }}
        >
          <span className={`block ${isRTL ? "pr-1.5 pl-2.5" : "pl-1.5 pr-2.5"}`}>{label}</span>
        </motion.span>

        <Tooltip side={tooltipSide} show={!railHovered}>{label}</Tooltip>
      </Link>
    </motion.div>
  );
}

// ─── ExpandableChip — for non-link chips (contact, lang, theme) ───────────────

type ExpandableChipProps = {
  as: "link" | "button";
  to?: string; hash?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string; children: React.ReactNode;
  tooltipSide: string; halfPillRadius: string;
  chipBg: string; chipBorder: string; chipText: string; chipShadow: string;
  isRTL: boolean; railHovered: boolean; scrolled: boolean;
};

function ExpandableChip({
  as, to, hash, onClick, label, children,
  tooltipSide, halfPillRadius,
  chipBg, chipBorder, chipText, chipShadow,
  isRTL, railHovered, scrolled,
}: ExpandableChipProps) {
  const ref = useRef<HTMLElement>(null);
  const mx  = useMotionValue(0);
  const my  = useMotionValue(0);
  const sx  = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy  = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.25);
    my.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const commonStyle: React.CSSProperties = {
    height: 44, minWidth: 44,
    transformOrigin: isRTL ? "left center" : "right center",
    background: chipBg,
    backdropFilter: "blur(14px) saturate(1.4)",
    WebkitBackdropFilter: "blur(14px) saturate(1.4)",
    color: chipText,
    boxShadow: `${chipShadow}, ${chipBorder}`,
  };

  const commonClassName = `group/icon relative flex items-center justify-center overflow-hidden ${halfPillRadius} active:scale-95 focus-ring`;

  const sharedContent = (
    <>
      {/* Hover sheen */}
      <span aria-hidden
        className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
        style={{
          background: isRTL
            ? "linear-gradient(to left, transparent 40%, color-mix(in oklab, #ffffff 7%, transparent))"
            : "linear-gradient(to right, transparent 40%, color-mix(in oklab, #ffffff 7%, transparent))",
        }}
      />
      <span className="relative z-10 flex items-center justify-center" style={{ width: 44, height: 44, position: "absolute", left: 0, top: 0 }}>
        {children}
      </span>
      {/* Expand label */}
      <span style={{ width: 44, height: 44, flexShrink: 0 }} aria-hidden />
      <motion.span
        aria-hidden
        initial={{ maxWidth: 0, opacity: 0 }}
        animate={{ maxWidth: railHovered ? 72 : 0, opacity: railHovered ? 1 : 0, x: railHovered ? 0 : (isRTL ? 4 : -4) }}
        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.5 }}
        className="overflow-hidden whitespace-nowrap text-[11px] font-medium tracking-wide"
      >
        <span className={`block ${isRTL ? "pr-1 pl-2.5" : "pl-1 pr-2.5"}`}>{label}</span>
      </motion.span>
      <Tooltip side={tooltipSide} show={!railHovered}>{label}</Tooltip>
    </>
  );

  if (as === "link" && to) {
    return (
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          hash={hash}
          preload="intent"
          aria-label={label}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className={commonClassName}
          style={commonStyle}
        >
          {sharedContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div style={{ x: sx, y: sy }}>
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-label={label}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={commonClassName}
        style={commonStyle}
      >
        {sharedContent}
      </button>
    </motion.div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ children, side, show = true }: {
  children: React.ReactNode; side: string; show?: boolean;
}) {
  return (
    <span className={`pointer-events-none absolute ${side} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-opacity duration-200 backdrop-blur-xl bg-[var(--surface-1)]/90 border border-[var(--hairline)] text-foreground brand-shadow-sm z-20 ${show ? "opacity-0 group-hover/icon:opacity-100" : "opacity-0"}`}>
      {children}
    </span>
  );
}
