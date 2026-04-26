import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";

export function MobileNav() {
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
    "focus-ring relative px-3 py-2 text-xs rounded-lg transition-all duration-300 whitespace-nowrap z-10 active:scale-[0.97] flex-1 text-center";

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };

  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--hairline)] bg-[var(--surface-1)]/95 backdrop-blur-xl pointer-events-none [&>*]:pointer-events-auto"
    >
      <LayoutGroup id="mobile-navbar">
        <nav className="flex items-center gap-px px-2 py-2 justify-between">
          <Link
            to="/"
            preload="intent"
            className={`${navLinkBase} ${
              onHome
                ? "text-foreground bg-[var(--surface-2)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {onHome && (
              <motion.span
                layoutId="mobile-nav-active-pill"
                className="absolute inset-0 rounded-lg bg-secondary/20"
                transition={pillSpring}
              />
            )}
            <span className="relative">Home</span>
          </Link>

          <Link
            to="/explore"
            preload="intent"
            className={`${navLinkBase} ${
              onExplore
                ? "text-foreground bg-[var(--surface-2)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {onExplore && (
              <motion.span
                layoutId="mobile-nav-active-pill"
                className="absolute inset-0 rounded-lg bg-secondary/20"
                transition={pillSpring}
              />
            )}
            <span className="relative">{t("Explore", "استكشف")}</span>
          </Link>

          {showComments && (
            <Link
              to="/comments"
              preload="intent"
              className={`${navLinkBase} ${
                onComments
                  ? "text-foreground bg-[var(--surface-2)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {onComments && (
                <motion.span
                  layoutId="mobile-nav-active-pill"
                  className="absolute inset-0 rounded-lg bg-secondary/20"
                  transition={pillSpring}
                />
              )}
              <span className="relative">{t("Comments", "التعليقات")}</span>
            </Link>
          )}

          <Link
            to="/"
            hash="contact"
            className="focus-ring px-3 py-2 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 whitespace-nowrap shrink-0 active:scale-[0.96] flex-1 text-center"
          >
            {contactLabel}
          </Link>
        </nav>
      </LayoutGroup>
    </motion.footer>
  );
}
