import { createFileRoute } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { lazy } from "react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { SectionBand } from "@/components/SectionBand";
import { LazyOnVisible } from "@/components/LazyOnVisible";
import { useSiteData } from "@/components/SiteDataProvider";
import { useLang } from "@/components/LanguageProvider";
import { ScrollProgress } from "@/components/motion-primitives";

// Below-the-fold sections — split into independent chunks and only loaded
// once the user scrolls them near the viewport. Hero + About stay in the
// initial route bundle so first paint stays fast.
const SkillsSection = lazy(() =>
  import("@/components/SkillsSection").then((m) => ({ default: m.SkillsSection })),
);
const ExperienceSection = lazy(() =>
  import("@/components/ExperienceSection").then((m) => ({ default: m.ExperienceSection })),
);
const AchievementsSection = lazy(() =>
  import("@/components/AchievementsSection").then((m) => ({ default: m.AchievementsSection })),
);
const LanguagesSection = lazy(() =>
  import("@/components/LanguagesSection").then((m) => ({ default: m.LanguagesSection })),
);

const SectionPlaceholder = ({ minH = 480 }: { minH?: number }) => (
  <div aria-hidden style={{ minHeight: minH }} className="w-full" />
);

import { buildMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({
      title: "Fares Ahmed — Software Engineer & Builder",
      description:
        "Fares Ahmed — bilingual full-stack engineer from Sana'a, Yemen. Browse skills, experience, and live GitHub activity in this interactive portfolio.",
      path: "/",
      ogType: "profile",
    }),
  }),
  component: Index,
});

function Index() {
  const { data } = useSiteData();
  const { lang, t } = useLang();
  const tagsEn = data.personal.en.taglines;
  const tagsAr = data.personal.ar.taglines;
  return (
    <div className="relative z-[2] min-h-screen text-foreground">
      <ScrollProgress />
      {/* Hero keeps default background to anchor the page */}
      <Hero />
      <Marquee items={tagsEn} itemsAr={tagsAr} key={lang} />

      {/* Curated rhythm — five-tone band system creates magazine-style
          progression: light → surface → dark → soft → dark. Each transition
          is intentional and the contrast walks the eye down the page. */}
      <SectionBand variant="light" pattern="gradient" divider roundBottom>
        <AboutSection />
      </SectionBand>

      {/* Languages — moved above Skills. Uses an inverted-theme band so it
          reads as a "negative" of the surrounding sections (dark in light
          mode, light in dark mode). */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <LazyOnVisible
          load={LanguagesSection as never}
          placeholder={<SectionPlaceholder minH={420} />}
        />
      </SectionBand>

      <SectionBand variant="surface" pattern="gradient" divider roundTop roundBottom>
        <LazyOnVisible
          load={SkillsSection as never}
          placeholder={<SectionPlaceholder minH={780} />}
        />
      </SectionBand>

      <SectionBand variant="light" pattern="gradient" divider roundTop roundBottom>
        <LazyOnVisible
          load={ExperienceSection as never}
          placeholder={<SectionPlaceholder minH={620} />}
        />
      </SectionBand>

      {/* Signature inverted band — pure black in light, pure white in dark. */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <LazyOnVisible
          load={AchievementsSection as never}
          placeholder={<SectionPlaceholder minH={520} />}
        />
      </SectionBand>

      {/* Bridge to /explore — projects + GitHub activity now live there.
          Inverted vs. the Achievements band above (light in light theme,
          dark surface in dark theme via tokens). */}
      <SectionBand variant="light" pattern="gradient" divider roundTop roundBottom>
        <section className="relative py-20 sm:py-28">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {t("Beyond the CV", "ما وراء السيرة")}
            </p>
            <h2 className="mt-5 font-display h-display-md">
              {t("Projects, code & live activity.", "المشاريع، الأكواد، والنشاط المباشر.")}
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t(
                "Open source projects and a live look at GitHub contributions live in their own dedicated space.",
                "تجد المشاريع مفتوحة المصدر ونظرة مباشرة على نشاط جيت‌هاب في مساحتها المخصصة."
              )}
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/explore"
                preload="intent"
                className="focus-ring group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_14px_40px_-16px_color-mix(in_oklab,var(--foreground)_45%,transparent)] transition-all duration-300 active:scale-[0.97] text-sm sm:text-base font-medium"
              >
                {t("Explore the workshop", "ادخل الورشة")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </SectionBand>

      {/* Note: a dedicated ContactSection used to live here, but it duplicated
          the global Footer (same email/GitHub/LinkedIn + CTA headline).
          The Footer renders on every page via __root.tsx. */}
    </div>
  );
}
