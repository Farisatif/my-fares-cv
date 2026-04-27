import { motion, LayoutGroup } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import { Hop as Home, Compass, MessageSquare, Mail, Sun, Moon, Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const loc = useLocation();
  const { t, lang, setLang } = useLang();
  const { data } = useSiteData();
  const { theme, setTheme } = useTheme();
  const nav = data.navigation;
  const showComments = nav?.showComments !== false;

  const onComments = loc.pathname === "/comments";
  const onExplore = loc.pathname === "/explore";
  const onHome = loc.pathname === "/";

  const pillSpring = {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
    mass: 0.8,
  };

  const navIconBase =
    "focus-ring relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-300 z-10";

  const NavIcon = ({
    to,
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    to?: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    label: string;
    isActive: boolean;
    onClick?: () => void;
  }) => {
    const content = (
      <div
        className={`${navIconBase} cursor-pointer group relative ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute inset-0 rounded-xl bg-secondary"
            transition={pillSpring}
          />
        )}
        <Icon size={24} className="relative z-10" />
      </div>
    );

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {to ? (
              <Link to={to} preload="intent" className="block">
                {content}
              </Link>
            ) : (
              <button type="button" onClick={onClick}>
                {content}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <motion.header
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed left-3 md:left-4 top-0 bottom-0 z-50 flex flex-col items-center py-6 pointer-events-none [&>*]:pointer-events-auto"
    >
      <LayoutGroup id="navbar">
        <nav className="flex flex-col items-center gap-3 rounded-2xl px-2 py-4 backdrop-blur-xl border border-[var(--hairline)] bg-[var(--surface-1)]/80 brand-shadow-sm h-fit">
          {/* Home */}
          <NavIcon
            to="/"
            icon={Home}
            label={t("Home", "الرئيسية")}
            isActive={onHome}
          />

          {/* Explore */}
          <NavIcon
            to="/explore"
            icon={Compass}
            label={t("Explore", "استكشف")}
            isActive={onExplore}
          />

          {/* Comments */}
          {showComments && (
            <NavIcon
              to="/comments"
              icon={MessageSquare}
              label={t("Comments", "التعليقات")}
              isActive={onComments}
            />
          )}

          {/* Contact */}
          <NavIcon
            to="/"
            icon={Mail}
            label={t("Contact", "تواصل")}
            isActive={false}
            onClick={() => {
              const contactEl = document.querySelector("[id='contact']");
              contactEl?.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* Divider */}
          <div className="w-6 h-px bg-border my-1" />

          {/* Theme Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`${navIconBase} cursor-pointer`}
                >
                  {theme === "dark" ? (
                    <Sun size={24} className="relative z-10" />
                  ) : (
                    <Moon size={24} className="relative z-10" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {theme === "dark"
                  ? t("Light Mode", "الوضع الفاتح")
                  : t("Dark Mode", "الوضع الداكن")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Language Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className={`${navIconBase} cursor-pointer`}
                >
                  <Globe size={24} className="relative z-10" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {lang === "ar"
                  ? t("English", "English")
                  : t("العربية", "العربية")}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </LayoutGroup>
    </motion.header>
  );
}
