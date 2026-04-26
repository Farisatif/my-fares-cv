import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const { t, lang } = useLang();
  const { data } = useSiteData();
  const nav = data.navigation;
  const showComments = nav?.showComments !== false;
  const contactLabel = lang === "ar"
    ? nav?.contactLabelAr || "تواصل"
    : nav?.contactLabelEn || "Contact";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onComments = loc.pathname === "/comments";
  const onExplore = loc.pathname === "/explore";
  const onHome = loc.pathname === "/";

  const navLinkBase =
    "focus-ring relative px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm rounded-full transition-colors duration-300 whitespace-nowrap z-10 active:scale-[0.97]";

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };

  return (
    <motion.header
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
      className="fixed left-0 right-0 z-50 flex justify-center px-3 pointer-events-none [&>*]:pointer-events-auto"
    >
      <LayoutGroup id="navbar">
      <nav
        className={`flex items-center gap-1 rounded-full px-1.5 py-1.5 transition-all duration-300 backdrop-blur-xl border ${
          scrolled
            ? "bg-[var(--surface-1)]/85 border-[var(--hairline)] brand-shadow"
            : "bg-[var(--surface-1)]/65 border-[var(--hairline)] brand-shadow-sm"
        }`}
      >
        <Link
          to="/"
          preload="intent"
          className={`relative ${navLinkBase} font-display text-sm sm:text-base shrink-0 ${
            onHome ? "text-foreground" : "text-foreground/90 hover:text-foreground"
          }`}
        >
          {onHome && (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 rounded-full bg-secondary"
              transition={pillSpring}
            />
          )}
          <span className="relative">Fares.</span>
        </Link>
        <span className="w-px h-5 bg-border mx-0.5" />
        <Link
          to="/explore"
          preload="intent"
          className={`${navLinkBase} ${
            onExplore
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {onExplore && (
            <motion.span
              layoutId="nav-active-pill"
              className="absolute inset-0 rounded-full bg-secondary"
              transition={pillSpring}
            />
          )}
          <span className="relative">{t("Explore", "استكشف")}</span>
        </Link>
        {showComments && (
          <>
            <span className="w-px h-5 bg-border mx-0.5" />
            <Link
              to="/comments"
              preload="intent"
              className={`${navLinkBase} ${
                onComments
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {onComments && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-secondary"
                  transition={pillSpring}
                />
              )}
              <span className="relative">{t("Comments", "التعليقات")}</span>
            </Link>
          </>
        )}
        <span className="w-px h-5 bg-border mx-0.5" />
        <ThemeLangToggle />
        <Link
          to="/"
          hash="contact"
          className="focus-ring ml-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 whitespace-nowrap shrink-0 active:scale-[0.96]"
        >
          {contactLabel}
        </Link>
      </nav>
      </LayoutGroup>
    </motion.header>
  );
}
