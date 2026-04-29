import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, MessageSquare, Mail } from "lucide-react";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

/**
 * Floating vertical icon rail — refined, slim, and theme-aware.
 * Anchored to the right edge in LTR, left edge in RTL.
 *
 * Visuals:
 *  - Glass capsule (backdrop blur + saturate) with subtle inner highlight
 *  - Animated active pill that slides between items (vertical LayoutGroup)
 *  - Icons-only with delicate tooltip on the inner side
 *  - Premium contact CTA at the bottom with brand gradient
 *  - Slim footprint to never obscure mobile content
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

  const pillSpring = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.7 };

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
  ].filter((i) => i.show);

  // Side anchor: right for LTR, left for RTL.
  const sideClass = lang === "ar" ? "left-2.5 sm:left-4" : "right-2.5 sm:right-4";
  const tooltipSide = lang === "ar" ? "left-full ml-2.5" : "right-full mr-2.5";

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
          className={`pointer-events-auto relative flex flex-col items-center gap-1 rounded-full p-1.5 backdrop-blur-2xl border transition-all duration-500 ${
            scrolled
              ? "bg-[var(--surface-1)]/55 border-[var(--hairline)]"
              : "bg-[var(--surface-1)]/40 border-[var(--hairline)]"
          }`}
          style={{
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            boxShadow:
              "0 1px 0 0 color-mix(in oklab, var(--foreground) 6%, transparent) inset, 0 18px 50px -22px color-mix(in oklab, var(--primary) 35%, transparent), 0 6px 18px -10px color-mix(in oklab, var(--foreground) 14%, transparent)",
          }}
        >
          {/* Subtle inner glow at the top */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-0 h-1/2 rounded-full opacity-40"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent), transparent)",
            }}
          />

          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.active === true;

            return (
              <Link
                key={item.key}
                to={item.to}
                hash={item.hash}
                preload="intent"
                aria-label={item.label}
                title={item.label}
                className={`group/icon relative flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-colors duration-300 focus-ring active:scale-[0.92] ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-rail-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(140deg, color-mix(in oklab, var(--primary) 18%, transparent), color-mix(in oklab, var(--primary-glow) 14%, transparent))",
                      boxShadow:
                        "inset 0 0 0 1px color-mix(in oklab, var(--primary) 35%, transparent), 0 6px 14px -6px color-mix(in oklab, var(--primary) 45%, transparent)",
                    }}
                    transition={pillSpring}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.1} />
                </span>
                {/* Tooltip — appears on hover on the inner side */}
                <span
                  className={`pointer-events-none absolute ${tooltipSide} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 backdrop-blur-xl bg-[var(--surface-1)]/85 border border-[var(--hairline)] text-foreground brand-shadow-sm`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Hairline divider */}
          <span
            className="my-0.5 h-px w-4 rounded-full"
            style={{ background: "color-mix(in oklab, currentColor 18%, transparent)" }}
          />

          {/* Contact CTA — premium filled pill */}
          <Link
            to="/"
            hash="contact"
            preload="intent"
            aria-label={contactLabel}
            title={contactLabel}
            className="group/icon relative flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-foreground text-background hover:scale-[1.05] active:scale-95 transition-transform duration-200 focus-ring"
            style={{
              boxShadow:
                "0 6px 16px -6px color-mix(in oklab, var(--foreground) 50%, transparent)",
            }}
          >
            <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.1} />
            <span
              className={`pointer-events-none absolute ${tooltipSide} top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 backdrop-blur-xl bg-[var(--surface-1)]/85 border border-[var(--hairline)] text-foreground brand-shadow-sm`}
            >
              {contactLabel}
            </span>
          </Link>

          {/* Hairline divider */}
          <span
            className="my-0.5 h-px w-4 rounded-full"
            style={{ background: "color-mix(in oklab, currentColor 18%, transparent)" }}
          />

          {/* Theme + language */}
          <div className="flex flex-col items-center gap-1 pb-0.5">
            <ThemeLangToggle />
          </div>
        </nav>
      </LayoutGroup>
    </motion.aside>
  );
}
