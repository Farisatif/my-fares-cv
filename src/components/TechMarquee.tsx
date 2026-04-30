import { useLang } from "./LanguageProvider";
import { useSiteData } from "./SiteDataProvider";
import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Database,
  Globe,
  Layers,
  Cpu,
  Server,
  Smartphone,
  Terminal,
  Braces,
  FileCode,
  GitBranch,
  Cloud,
  Palette,
  Boxes,
  Zap,
  Shield,
  Rocket,
  Binary,
  type LucideIcon,
} from "lucide-react";

// Icon mapping for tech items
const ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  database: Database,
  globe: Globe,
  layers: Layers,
  cpu: Cpu,
  server: Server,
  smartphone: Smartphone,
  terminal: Terminal,
  braces: Braces,
  file: FileCode,
  git: GitBranch,
  cloud: Cloud,
  palette: Palette,
  boxes: Boxes,
  zap: Zap,
  shield: Shield,
  rocket: Rocket,
  binary: Binary,
};

// Default tech items if none in database
const DEFAULT_ITEMS = [
  { icon: "code", text_en: "React", text_ar: "رياكت" },
  { icon: "braces", text_en: "TypeScript", text_ar: "تايب سكريبت" },
  { icon: "server", text_en: "Node.js", text_ar: "نود جي إس" },
  { icon: "database", text_en: "PostgreSQL", text_ar: "بوستغرس" },
  { icon: "globe", text_en: "Next.js", text_ar: "نكست جي إس" },
  { icon: "smartphone", text_en: "Flutter", text_ar: "فلاتر" },
  { icon: "layers", text_en: "Docker", text_ar: "دوكر" },
  { icon: "cloud", text_en: "AWS", text_ar: "أمازون" },
  { icon: "git", text_en: "Git", text_ar: "جيت" },
  { icon: "terminal", text_en: "Linux", text_ar: "لينكس" },
  { icon: "palette", text_en: "Figma", text_ar: "فيجما" },
  { icon: "zap", text_en: "Vite", text_ar: "فايت" },
];

interface TechItem {
  icon: string;
  text_en: string;
  text_ar: string;
}

export function TechMarquee() {
  const { lang, t } = useLang();
  const { data } = useSiteData();
  const reduce = useReducedMotion();

  // Get items from database or use defaults
  const items: TechItem[] = (data as any).techMarquee?.items?.length 
    ? (data as any).techMarquee.items 
    : DEFAULT_ITEMS;

  // Repeat items for seamless loop
  const REPEATS = 4;
  const looped = Array.from({ length: REPEATS }, () => items).flat();

  return (
    <section className="relative overflow-hidden py-6 sm:py-8">
      {/* Gradient fades on edges */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10"
        style={{
          background: "linear-gradient(to right, var(--background), transparent)",
        }}
      />
      <div 
        aria-hidden 
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10"
        style={{
          background: "linear-gradient(to left, var(--background), transparent)",
        }}
      />

      {/* Header */}
      <div className="container mx-auto px-6 max-w-7xl mb-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground text-center">
          {t("Technologies & Tools", "التقنيات والأدوات")}
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative" dir="ltr">
        <motion.div
          className="flex gap-6 sm:gap-8"
          style={{ width: "max-content" }}
          animate={reduce ? undefined : { x: ["0%", "-25%"] }}
          transition={
            reduce
              ? undefined
              : {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    // Slower, calmer drift — was 30s, now 75s for a much
                    // gentler horizontal flow that doesn't pull attention.
                    duration: 75,
                    ease: "linear",
                  },
                }
          }
        >
          {looped.map((item, i) => {
            const IconComponent = ICON_MAP[item.icon] || Code2;
            const text = lang === "ar" ? item.text_ar : item.text_en;
            
            return (
              <div
                key={`${item.text_en}-${i}`}
                className="group flex shrink-0 items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--primary) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--primary) 20%, transparent)",
                }}
              >
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
                  }}
                >
                  <IconComponent className="h-4 w-4 text-primary" />
                </span>
                <span 
                  className="font-medium text-sm sm:text-base whitespace-nowrap"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Reverse direction row */}
      <div className="relative mt-4" dir="ltr">
        <motion.div
          className="flex gap-6 sm:gap-8"
          style={{ width: "max-content" }}
          animate={reduce ? undefined : { x: ["-25%", "0%"] }}
          transition={
            reduce
              ? undefined
              : {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    // Reverse track also slowed down (was 35s, now 90s) and
                    // intentionally a bit slower than the top row so the
                    // two layers don't lock into a distracting pattern.
                    duration: 90,
                    ease: "linear",
                  },
                }
          }
        >
          {[...looped].reverse().map((item, i) => {
            const IconComponent = ICON_MAP[item.icon] || Code2;
            const text = lang === "ar" ? item.text_ar : item.text_en;
            
            return (
              <div
                key={`rev-${item.text_en}-${i}`}
                className="group flex shrink-0 items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "color-mix(in oklab, currentColor 6%, transparent)",
                  border: "1px solid color-mix(in oklab, currentColor 12%, transparent)",
                }}
              >
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: "color-mix(in oklab, currentColor 10%, transparent)",
                  }}
                >
                  <IconComponent className="h-4 w-4 opacity-70" />
                </span>
                <span 
                  className="font-medium text-sm sm:text-base whitespace-nowrap opacity-80"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
