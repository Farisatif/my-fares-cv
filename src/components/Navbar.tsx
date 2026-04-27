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
    "focus-ring relative px-2 sm:px-3.5 py-1 sm:py-1.5 text-xs rounded-full transition-all duration-300 whitespace-nowrap z-10 active:scale-[0.97] font-medium";

  const pillSpring = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.8 };

  // Storm cloud palette: dark to light progression with smart contrast
  const colorPalette = {
    midnight: { bg: "#1C2429", text: "#FFFFFF" },      // Darkest
    shadowed: { bg: "#384A52", text: "#FFFFFF" },      // Dark
    thunder: { bg: "#618094", text: "#FFFFFF" },       // Medium
    rain: { bg: "#96B2C2", text: "#1C2429" },          // Light
    storm: { bg: "#D1DBE3", text: "#1C2429" },         // Lightest
  };

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
        className={`flex items-center gap-0.5 sm:gap-1 rounded-full px-1 sm:px-1.5 py-1 sm:py-1.5 transition-all duration-300 backdrop-blur-md border text-xs sm:text-sm ${
          scrolled
            ? "bg-black/40 border-white/10 shadow-lg"
            : "bg-black/25 border-white/5 shadow-md"
        }`}
      >
        <Link
          to="/"
          preload="intent"
          className={`relative ${navLinkBase} font-display text-sm sm:text-base shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ${
            onHome 
              ? "shadow-md"
              : "hover:shadow-sm"
          }`}
          style={{
            backgroundColor: colorPalette.midnight.bg,
            color: colorPalette.midnight.text,
          }}
        >
          <span className="relative">Fares.</span>
        </Link>
        <span className="w-px h-5 bg-white/10 mx-0.5" />
        <Link
          to="/explore"
          preload="intent"
          className={`${navLinkBase} rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ${
            onExplore
              ? "shadow-md"
              : "hover:shadow-sm"
          }`}
          style={{
            backgroundColor: colorPalette.shadowed.bg,
            color: colorPalette.shadowed.text,
          }}
        >
          <span className="relative">{t("Explore", "استكشف")}</span>
        </Link>
        {showComments && (
          <>
            <span className="w-px h-5 bg-white/10 mx-0.5" />
            <Link
              to="/comments"
              preload="intent"
              className={`${navLinkBase} rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ${
                onComments
                  ? "shadow-md"
                  : "hover:shadow-sm"
              }`}
              style={{
                backgroundColor: colorPalette.thunder.bg,
                color: colorPalette.thunder.text,
              }}
            >
              <span className="relative">{t("Comments", "التعليقات")}</span>
            </Link>
          </>
        )}
        <span className="w-px h-5 bg-white/10 mx-0.5" />
        <Link
          to="/"
          hash="contact"
          className={`focus-ring rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium transition-all duration-300 whitespace-nowrap shrink-0 active:scale-[0.96] shadow-md hover:shadow-lg`}
          style={{
            backgroundColor: colorPalette.rain.bg,
            color: colorPalette.rain.text,
          }}
        >
          {contactLabel}
        </Link>
        <span className="w-px h-5 bg-white/10 mx-0.5" />
        <ThemeLangToggle />
      </nav>
      </LayoutGroup>
    </motion.header>
  );
}
