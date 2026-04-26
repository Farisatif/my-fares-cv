import { createFileRoute } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { AchievementsSection } from "@/components/AchievementsSection";
import { ContactSection } from "@/components/ContactSection";
import { LanguagesSection } from "@/components/LanguagesSection";
import { SectionBand } from "@/components/SectionBand";
import { useSiteData } from "@/components/SiteDataProvider";
import { useLang } from "@/components/LanguageProvider";
import { ScrollProgress } from "@/components/motion-primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fares Ahmed — Software Engineer & Builder" },
      {
        name: "description",
        content:
          "Fares Ahmed is a bilingual full-stack engineer from Sana'a, Yemen — building scalable systems, mobile experiences, and elegant UIs.",
      },
      { property: "og:title", content: "Fares Ahmed — Software Engineer" },
      {
        property: "og:description",
        content:
          "Full-stack engineer building scalable systems and elegant user experiences across web, mobile, and systems.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data } = useSiteData();
  const { lang } = useLang();
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
      <SectionBand variant="light" pattern="grid-fine" divider roundBottom>
        <AboutSection />
      </SectionBand>

      {/* Languages — moved above Skills. Uses an inverted-theme band so it
          reads as a "negative" of the surrounding sections (dark in light
          mode, light in dark mode). */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <LanguagesSection />
      </SectionBand>

      <SectionBand variant="surface" pattern="grid-dots" divider roundTop roundBottom>
        <SkillsSection />
      </SectionBand>

      <SectionBand variant="dark" pattern="grid-fine" divider roundTop roundBottom>
        <ExperienceSection />
      </SectionBand>

      {/* Signature inverted band — pure black in light, pure white in dark. */}
      <SectionBand variant="dark" pattern="none" divider roundTop roundBottom>
        <AchievementsSection />
      </SectionBand>

      {/* Bridge to /explore — projects + GitHub activity now live there */}
      <SectionBand variant="soft" pattern="aurora" divider roundTop roundBottom>
        <section className="relative py-20 sm:py-28">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-muted-foreground">
              {t("Beyond the CV", "ما وراء السيرة")}
            </p>
            <h2 className="mt-5 font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
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
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 active:scale-[0.97] text-sm sm:text-base font-medium"
              >
                {t("Explore the workshop", "ادخل الورشة")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </SectionBand>

      <SectionBand variant="dark" pattern="grid-fine" divider roundTop>
        <ContactSection />
      </SectionBand>
    </div>
  );
}
