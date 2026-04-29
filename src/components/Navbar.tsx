import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageSquare, Mail } from "lucide-react";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

/**
 * Floating vertical icon rail.
 * Anchored to the right edge in LTR, left edge in RTL. Glass surface,
 * icons-only, with a sliding active pill (LayoutGroup, animates vertically).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };

  type NavItem = {
    key: string;
    label: string;
    icon: typeof Home;
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
    { key: "contact", label: contactLabel, icon: Mail, to: "/", hash: "contact", show: true },
  ].filter((i) => i.show);

  // Side anchor: right for LTR, left for RTL.
  const sideClass = lang === "ar" ? "left-3 sm:left-4" : "right-3 sm:right-4";
  const tooltipSide = lang === "ar" ? "left-full ml-2" : "right-full mr-2";

  return (
    <motion.aside
      initial={{ opacity: 0, x: lang === "ar" ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${sideClass} pointer-events-none`}
      aria-label={t("Primary navigation", "التنقل الرئيسي")}
    >
      <LayoutGroup id="navbar-rail">
        <nav
          className={`pointer-events-auto flex flex-col items-center gap-1 rounded-full p-1.5 backdrop-blur-2xl border transition-all duration-300 ${
            scrolled
              ? "bg-[var(--surface-1)]/45 border-[var(--hairline)] brand-shadow"
              : "bg-[var(--surface-1)]/35 border-[var(--hairline)] brand-shadow-sm"
          }`}
          style={{ WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isContact = item.key === "contact";
            const isActive = item.active === true;

            const inner = (
              <span className="relative z-10 flex items-center justify-center w-full h-full">
                <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
              </span>
            );

            const baseBtn =
              "group/icon relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all duration-300 focus-ring active:scale-[0.92]";

            return (
              <Link
                key={item.key}
                to={item.to}
                hash={item.hash}
                preload="intent"
                aria-label={item.label}
                title={item.label}
                className={`${baseBtn} ${
                  isContact
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && !isContact && (
                  <motion.span
                    layoutId="nav-rail-pill"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={pillSpring}
                  />
                )}
                {inner}
                {/* Tooltip — appears on hover on the inner side */}
                <span
                  className={`pointer-events-none absolute ${tooltipSide} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] whitespace-nowrap opacity-0 -translate-x-1 group-hover/icon:opacity-100 group-hover/icon:translate-x-0 transition-all duration-200 backdrop-blur-xl bg-[var(--surface-1)]/80 border border-[var(--hairline)] text-foreground brand-shadow-sm`}
                  style={{
                    transform: lang === "ar" ? "translate(0,-50%)" : undefined,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Divider */}
          <span className="my-1 h-px w-5 bg-border" />

          {/* Theme + language */}
          <div className="flex flex-col items-center gap-1 py-0.5">
            <ThemeLangToggle />
          </div>
        </nav>
      </LayoutGroup>
    </motion.aside>
  );
}
