import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, Github, Mail, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type PointerEvent } from "react";
import { MagneticButton } from "./MagneticButton";
import faresImg from "@/assets/fares.jpg";
import heroSplash from "@/assets/hero-splash.jpg";
import { DotPattern } from "./Patterns";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";

export function Hero() {
  const { data } = useSiteData();
  const { lang, t } = useLang();
  const p = data.personal;
  const loc = lang === "ar" ? p.ar : p.en;
  const heroWords =
    lang === "ar"
      ? data.hero?.words_ar?.length
        ? data.hero.words_ar
        : ["مهندس برمجيات.", "مفكر بالأنظمة.", "بعقلية عالمية."]
      : data.hero?.words_en?.length
        ? data.hero.words_en
        : ["Software Engineer.", "Systems Thinker.", "Globally Minded."];

  const reduce = useReducedMotion();

  // Pointer-driven parallax for the headline (gentle, springy).
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });
  const headlineX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const headlineY = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  // Splash parallax — opposite direction, very subtle.
  const splashX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const splashY = useTransform(sy, [-0.5, 0.5], [8, -8]);

  // Avatar: pointer tilt + scroll parallax-free spring float.
  const avatarRef = useRef<HTMLDivElement>(null);
  const ax = useMotionValue(0);
  const ay = useMotionValue(0);
  const asx = useSpring(ax, { stiffness: 180, damping: 16, mass: 0.5 });
  const asy = useSpring(ay, { stiffness: 180, damping: 16, mass: 0.5 });
  const avatarRotX = useTransform(asy, [-0.5, 0.5], [10, -10]);
  const avatarRotY = useTransform(asx, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: globalThis.PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      px.set(e.clientX / w - 0.5);
      py.set(e.clientY / h - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  const handleAvatarMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ax.set((e.clientX - rect.left) / rect.width - 0.5);
    ay.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleAvatarLeave = () => {
    ax.set(0);
    ay.set(0);
  };

  return (
    <section id="top" className="relative min-h-screen pt-12 sm:pt-16 pb-24 overflow-hidden">
      {/* Toned-down dot pattern for subtle texture */}
      <DotPattern className="absolute inset-0 -z-10 opacity-40">
        <div className="h-full w-full" />
      </DotPattern>
      {/* Soft mesh atmosphere — much dimmer so content stays primary */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mesh-bg opacity-30 dark:opacity-40" />
      {/* Single calm accent halo, off to one side — visible in both themes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"
      />
      {/* Faint grid for depth, masked to fade at edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-25 dark:opacity-30" />

      {/* ───── Half-background splash (the uploaded blue/silver painting) ─────
          Sits ABOVE the soft mesh/grid but BELOW the global arrow field.
          On mobile: bottom half. On desktop: end-side (right in LTR / left in RTL) half.
          A directional gradient mask makes it dissolve into the page edge-to-edge. */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-[5]
          inset-x-0 top-0 h-[78%]
          lg:inset-y-0 lg:h-full lg:w-1/2
          lg:right-0 lg:left-auto rtl:lg:left-0 rtl:lg:right-auto
        "
      >
        {/* Mobile/base: image anchored to TOP, fades into the page below.
            We use bg-bottom so the densest blue area shows above the fold. */}
        <div
          className="absolute inset-0 bg-cover bg-bottom opacity-[0.7] dark:opacity-[0.55]"
          style={{
            backgroundImage: `url(${heroSplash})`,
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          }}
        />
        {/* Desktop directional mask — fade from outer edge into center */}
        <div
          className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-[0.7] dark:opacity-[0.55]"
          style={{
            backgroundImage: `url(${heroSplash})`,
            WebkitMaskImage:
              "linear-gradient(to left, black 30%, transparent 100%)",
            maskImage:
              "linear-gradient(to left, black 30%, transparent 100%)",
          }}
        />
        {/* RTL desktop reverse */}
        <div
          className="hidden rtl:lg:block lg:hidden absolute inset-0 bg-cover bg-center opacity-[0.7] dark:opacity-[0.55]"
          style={{
            backgroundImage: `url(${heroSplash})`,
            WebkitMaskImage:
              "linear-gradient(to right, black 30%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 30%, transparent 100%)",
          }}
        />
        {/* Tone down any remaining whites with a soft primary-tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <div className="container relative mx-auto px-6 max-w-7xl">
        {/* Top meta row — chip + edition counter */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
            whileHover={reduce ? undefined : { y: -2, transition: { type: "spring", stiffness: 300, damping: 18 } }}
            className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/70 bg-background/60 backdrop-blur-md soft-shadow relative overflow-hidden"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="relative text-xs sm:text-sm text-muted-foreground tracking-wide font-medium">
              {t("Available for new opportunities", "متاح لفرص جديدة")}
            </span>
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, color-mix(in oklab, var(--primary) 18%, transparent) 50%, transparent 70%)",
                }}
                variants={{ hover: { x: ["−100%", "120%"] } }}
                animate="hover"
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
              />
            )}
          </motion.div>

          {/* Magazine-style edition stamp */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80"
          >
            <span className="h-px w-8 bg-border" />
            <span>
              {t("Edition", "إصدار")} 01 · {t("Hero", "البداية")}
            </span>
          </motion.div>
        </div>

        <motion.h1
          ref={headlineRef}
          style={
            reduce
              ? undefined
              : {
                  x: headlineX,
                  y: headlineY,
                  transformPerspective: 1200,
                }
          }
          className="font-display text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.05em] will-change-transform pb-2 [text-shadow:0_2px_24px_color-mix(in_oklab,var(--background)_55%,transparent)]"
        >
          {heroWords.map((word, wi) => {
            const isAccent = wi === 1;
            const isArabic = /[\u0600-\u06FF]/.test(word);
            const chars = isArabic ? [word] : Array.from(word);
            return (
              <span
                key={word}
                className={`block overflow-hidden pb-[0.12em] ${isAccent ? "italic font-normal text-sky-100 dark:text-sky-200 [text-shadow:0_2px_18px_rgba(8,30,70,0.55)]" : ""}`}
              >
                {chars.map((ch, ci) => (
                  <motion.span
                    key={`${wi}-${ci}`}
                    className="inline-block"
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: "1.05em", rotate: -6 }
                    }
                    animate={
                      reduce
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, rotate: 0 }
                    }
                    transition={
                      reduce
                        ? { duration: 0.4, delay: 0.3 + wi * 0.08 }
                        : {
                            type: "spring",
                            stiffness: 260,
                            damping: 22,
                            mass: 0.7,
                            delay: 0.3 + wi * 0.14 + (isArabic ? 0 : ci * 0.025),
                          }
                    }
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </motion.h1>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="lg:col-span-7 max-w-xl rounded-2xl bg-background/55 dark:bg-background/40 backdrop-blur-md border border-border/40 px-5 py-4 sm:px-6 sm:py-5"
          >
            <p className="text-base sm:text-lg text-foreground leading-relaxed">
              {t("Hi — I'm ", "مرحباً — أنا ")}
              <span className="text-foreground font-semibold">{p.name}</span>
              {t(", ", "، ")}
              {loc.bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" hash="contact" className="inline-block">
                <MagneticButton>
                  <Mail className="h-4 w-4" />
                  {t("Get in touch", "تواصل معي")}
                </MagneticButton>
              </Link>
              <MagneticButton href={`https://${p.github}`} variant="ghost">
                <Github className="h-4 w-4" />
                {t("GitHub", "جيت‌هاب")}
              </MagneticButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay: 0.6 }}
            className="lg:col-span-5 relative flex lg:justify-end"
            style={{ perspective: 1000 }}
          >
            <div
              ref={avatarRef}
              data-cursor="view"
              data-cursor-label={p.name}
              className="relative h-40 w-40 sm:h-52 sm:w-52 rounded-full overflow-hidden shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--primary)_55%,transparent)] bg-background isolate z-10"
            >
              <img
                src={faresImg}
                alt={p.name}
                className="h-full w-full object-cover opacity-100"
                draggable={false}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.0 }}
              whileHover={reduce ? undefined : { y: -2, scale: 1.04 }}
              className="absolute -bottom-2 -right-2 lg:right-0 bg-foreground text-background text-xs px-3 py-1.5 rounded-full font-medium tracking-wide soft-shadow z-20"
            >
              {loc.location}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom strip — credibility row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-20 pt-8 border-t border-border/40 flex items-center justify-between gap-6 flex-wrap"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            {t("Scroll to explore", "مرر للاستكشاف")}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="tracking-wide">
              {t("Engineering · Systems · Product", "هندسة · أنظمة · منتج")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
