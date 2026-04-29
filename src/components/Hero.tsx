import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type PointerEvent } from "react";
import { MagneticButton } from "./MagneticButton";
import faresImg from "@/assets/fares.jpg";
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
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Subtle gradient overlay for depth */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/20 to-background/60" 
      />
      
      {/* Accent glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 -left-32 h-[500px] w-[500px] rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-20 -right-32 h-[400px] w-[400px] rounded-full bg-primary/6 dark:bg-primary/10 blur-[80px]"
      />

      <div className="container relative mx-auto px-6 max-w-7xl py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Content */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {t(
                  data.content?.hero?.chip_en ?? "Available for new opportunities",
                  data.content?.hero?.chip_ar ?? "متاح لفرص جديدة",
                )}
              </span>
            </motion.div>

            {/* Main Headline */}
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
              className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1] tracking-[-0.03em] will-change-transform"
            >
              {heroWords.map((word, wi) => {
                const isAccent = wi === 1;
                const isArabic = /[\u0600-\u06FF]/.test(word);
                const chars = isArabic ? [word] : Array.from(word);
                return (
                  <span
                    key={word}
                    className={`block overflow-hidden pb-1 ${isAccent ? "text-primary" : ""}`}
                  >
                    {chars.map((ch, ci) => (
                      <motion.span
                        key={`${wi}-${ci}`}
                        className="inline-block"
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, y: "1.1em", rotate: -4 }
                        }
                        animate={
                          reduce
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, rotate: 0 }
                        }
                        transition={
                          reduce
                            ? { duration: 0.4, delay: 0.2 + wi * 0.08 }
                            : {
                                type: "spring",
                                stiffness: 280,
                                damping: 24,
                                mass: 0.6,
                                delay: 0.2 + wi * 0.12 + (isArabic ? 0 : ci * 0.02),
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

            {/* Bio Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              {t(
                data.content?.hero?.greeting_en ?? "Hi — I'm ",
                data.content?.hero?.greeting_ar ?? "مرحباً — أنا ",
              )}
              <span className="text-foreground font-semibold">{p.name}</span>
              {t(", ", "، ")}
              {loc.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/" hash="contact" className="inline-block">
                <MagneticButton>
                  <Mail className="h-4 w-4" />
                  {t(
                    data.content?.hero?.ctaPrimary_en ?? "Get in touch",
                    data.content?.hero?.ctaPrimary_ar ?? "تواصل معي",
                  )}
                </MagneticButton>
              </Link>
              <MagneticButton href={`https://${p.github}`} variant="ghost">
                <Github className="h-4 w-4" />
                {t(
                  data.content?.hero?.ctaSecondary_en ?? "GitHub",
                  data.content?.hero?.ctaSecondary_ar ?? "جيت‌هاب",
                )}
              </MagneticButton>
            </motion.div>

            {/* Stats/Highlights Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-border/30"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{loc.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  {t(
                    data.content?.hero?.tagline_en ?? "Engineering · Systems · Product",
                    data.content?.hero?.tagline_ar ?? "هندسة · أنظمة · منتج",
                  )}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative rings */}
              <div 
                aria-hidden 
                className="absolute inset-0 -m-4 rounded-full border border-border/20 animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <div 
                aria-hidden 
                className="absolute inset-0 -m-8 rounded-full border border-border/10"
              />
              <div 
                aria-hidden 
                className="absolute inset-0 -m-12 rounded-full border border-border/5"
              />
              
              {/* Avatar Container */}
              <motion.div
                ref={avatarRef}
                onPointerMove={handleAvatarMove}
                onPointerLeave={handleAvatarLeave}
                style={
                  reduce
                    ? undefined
                    : {
                        rotateX: avatarRotX,
                        rotateY: avatarRotY,
                        transformPerspective: 800,
                      }
                }
                data-cursor="view"
                data-cursor-label={p.name}
                className="relative h-56 w-56 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full overflow-hidden ring-4 ring-background shadow-2xl shadow-primary/20 will-change-transform"
              >
                <img
                  src={faresImg}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                {/* Subtle overlay for depth */}
                <div 
                  aria-hidden 
                  className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"
                />
              </motion.div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.8 }}
                whileHover={reduce ? undefined : { scale: 1.05, y: -2 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm px-5 py-2 rounded-full font-medium shadow-lg"
              >
                {t("Full-Stack Developer", "مطور فول ستاك")}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t(
              data.content?.hero?.scrollPrompt_en ?? "Scroll to explore",
              data.content?.hero?.scrollPrompt_ar ?? "مرر للاستكشاف",
            )}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
