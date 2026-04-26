import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubActivitySection } from "@/components/GithubActivitySection";
import { SectionBand } from "@/components/SectionBand";
import { ScrollProgress } from "@/components/motion-primitives";
import { useLang } from "@/components/LanguageProvider";
import exploreSplash from "@/assets/explore-splash.jpg";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Projects & GitHub Activity · Fares Ahmed" },
      {
        name: "description",
        content:
          "Beyond the CV — open source projects, GitHub activity, and the experimental work of Fares Ahmed.",
      },
      { property: "og:title", content: "Explore — Fares Ahmed" },
      {
        property: "og:description",
        content:
          "Open source projects and live GitHub contributions from a bilingual full-stack engineer.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { t } = useLang();
  const reduce = useReducedMotion();

  return (
    <div className="relative z-[2] min-h-screen text-foreground">
      <ScrollProgress />

      {/* ───────── Hero header — uses the uploaded grunge image as a bold,
          full-bleed banner. Dark, fragmented, electric blue palette. ───────── */}
      <header
        id="top"
        className="relative isolate overflow-hidden min-h-[88vh] sm:min-h-[92vh] flex items-end pt-28 pb-16 sm:pb-20"
      >
        {/* Background image — fills the hero at full clarity, no overlays */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${exploreSplash})` }}
        />

        <div className="container relative mx-auto px-6 max-w-7xl">
          {/* Back-to-CV link */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
              {t("Back to CV", "العودة للسيرة الذاتية")}
            </Link>
          </motion.div>

          {/* Tag chip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-200 text-[10px] sm:text-xs uppercase tracking-[0.3em] backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3" />
            {t("Beyond the CV", "ما وراء السيرة")}
          </motion.div>

          {/* Bold title */}
          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(3rem,11vw,9rem)] leading-[0.86] tracking-[-0.05em] text-white [text-shadow:0_4px_40px_rgba(8,30,90,0.65)]"
          >
            <span className="block">{t("Explore", "استكشف")}</span>
            <span className="block italic font-normal text-sky-300/95">
              {t("the workshop.", "الورشة.")}
            </span>
          </motion.h1>

          {/* Lede */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed"
          >
            {t(
              "A look beyond the resume — open source projects, live GitHub activity, and the experiments that don't always fit on a CV.",
              "نظرة وراء السيرة الذاتية — مشاريع مفتوحة المصدر، نشاط مباشر على جيت‌هاب، والتجارب التي لا تجد مكانها دائمًا في السيرة."
            )}
          </motion.p>
        </div>
      </header>

      {/* Projects — kept on a soft band so card content reads cleanly */}
      <SectionBand variant="dark" pattern="grid-fine" divider roundTop roundBottom>
        <ProjectsSection />
      </SectionBand>

      {/* GitHub activity — inverted band: light background in dark mode, dark in light mode */}
      <SectionBand variant="dark" pattern="none" divider roundTop>
        <GithubActivitySection />
      </SectionBand>
    </div>
  );
}
