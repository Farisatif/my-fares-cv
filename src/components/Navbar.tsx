import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { ThemeLangToggle } from "./ThemeLangToggle";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

export function Navbar() {
  const loc = useLocation();
  const { t, lang } = useLang();
  const { data } = useSiteData();
  const nav = data.navigation;
  const showComments = nav?.showComments !== false;
  const contactLabel = lang === "ar"
    ? nav?.contactLabelAr || "تواصل"
    : nav?.contactLabelEn || "Contact";

  const onComments = loc.pathname === "/comments";
  const onExplore = loc.pathname === "/explore";
  const onHome = loc.pathname === "/";

  const navLinkBase =
    "focus-ring relative px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-300 whitespace-nowrap z-10 active:scale-[0.97] group";

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };
  const isActive = onHome || onExplore || onComments;

  return (
    <motion.header
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="hidden sm:flex fixed left-0 top-0 h-screen z-50 w-64 flex-col pointer-events-none [&>*]:pointer-events-auto p-6 sm:p-8"
    >
      <LayoutGroup id="navbar">
        {/* Logo area */}
        <Link
          to="/"
          preload="intent"
          className="mb-8 sm:mb-12 focus-ring rounded-lg p-2 -m-2 inline-flex"
        >
          <motion.div
            initial={false}
            animate={{ scale: onHome ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="font-display text-lg sm:text-xl font-semibold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
          >
            Fares.
          </motion.div>
        </Link>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col gap-1">
          <div className="space-y-1 mb-6">
            <Link
              to="/"
              preload="intent"
              className={`${navLinkBase} ${
                onHome
                  ? "text-foreground bg-[var(--surface-2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]/50"
              }`}
            >
              {onHome && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-lg"
                  transition={pillSpring}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span>Home</span>
              </span>
            </Link>

            <Link
              to="/explore"
              preload="intent"
              className={`${navLinkBase} ${
                onExplore
                  ? "text-foreground bg-[var(--surface-2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]/50"
              }`}
            >
              {onExplore && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-lg"
                  transition={pillSpring}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span>{t("Explore", "استكشف")}</span>
              </span>
            </Link>

            {showComments && (
              <Link
                to="/comments"
                preload="intent"
                className={`${navLinkBase} ${
                  onComments
                    ? "text-foreground bg-[var(--surface-2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]/50"
                }`}
              >
                {onComments && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-lg"
                    transition={pillSpring}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span>{t("Comments", "التعليقات")}</span>
                </span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-[var(--hairline)]" />

          {/* Contact link */}
          <motion.div
            layout
            className="mt-auto space-y-3"
          >
            <Link
              to="/"
              hash="contact"
              className="focus-ring w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-center font-medium active:scale-[0.96] inline-block"
            >
              {contactLabel}
            </Link>
          </motion.div>
        </nav>

        {/* Theme toggle at bottom */}
        <div className="flex justify-between items-center pt-6 border-t border-[var(--hairline)]">
          <ThemeLangToggle />
        </div>
      </LayoutGroup>
    </motion.header>
  );
}
