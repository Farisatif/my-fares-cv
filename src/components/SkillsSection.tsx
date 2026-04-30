import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteData } from "./SiteDataProvider";
import { useLang } from "./LanguageProvider";

// Matter.js + the physics canvas is ~heavy. Defer the chunk until the
// section is about to scroll into view, and keep it out of SSR entirely
// (it touches `window` on mount).
const PhysicsPills = lazy(() =>
  import("./PhysicsPills").then((m) => ({ default: m.PhysicsPills })),
);

export function SkillsSection() {
  const { data } = useSiteData();
  const { t } = useLang();

  const pills = (data.skills as Array<{ name: string; level?: number }>).map((s, i) => ({
    label: s.name,
    variant: i % 12,
    level: s.level,
  }));

  const [height, setHeight] = useState(900);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [physicsReady, setPhysicsReady] = useState(false);

  // Defer mounting the physics canvas until this section is near the
  // viewport. SSR/initial paint is not blocked on Matter.js.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (physicsReady) return;
    if (!("IntersectionObserver" in window)) {
      setPhysicsReady(true);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPhysicsReady(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [physicsReady]);

  useEffect(() => {
    const onResize = () => {
      // Taller field — pills get more room to fall and bounce. Scales with
      // viewport so it stays generous on mobile and dramatic on desktop.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fluid = Math.round(
        Math.max(680, Math.min(1100, h * 0.95, w * 0.7 + 360)),
      );
      setHeight(fluid);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="skills"
      className="relative pt-0 pb-0 mb-0"
      style={{ overflow: "visible" }}
    >
      {/* Soft accent backdrop matching the hero blobs. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-[oklch(0.85_0.12_250)] opacity-30 blur-3xl" />
        <div className="absolute -top-20 right-10 h-[300px] w-[300px] rounded-full bg-[oklch(0.8_0.13_270)] opacity-25 blur-3xl" />
      </div>

      {/* Physics canvas — full-bleed. The heading sits ON TOP of this same
          area (transparent, no background) and the pills travel BEHIND it. */}
      <Reveal delay={0.05}>
        <div ref={sentinelRef} className="relative w-full mt-0">
          {/* Pills layer — explicitly behind the heading. */}
          <div className="relative z-0">
            {physicsReady ? (
              <Suspense
                fallback={<div style={{ height }} aria-hidden className="w-full" />}
              >
                <PhysicsPills pills={pills} height={height} floorOffset={0} />
              </Suspense>
            ) : (
              <div style={{ height }} aria-hidden className="w-full" />
            )}
          </div>

          {/* Heading overlay — transparent, non-interactive so pills can be
              dragged through it. Inner text re-enables pointer events. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-6 pt-20 sm:pt-28 md:pt-36 lg:pt-44">
            <div className="pointer-events-auto text-center max-w-4xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  / 02 — {t(
                    data.content?.skills?.eyebrow_en ?? "Toolkit",
                    data.content?.skills?.eyebrow_ar ?? "الأدوات",
                  )}
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[oklch(0.55_0.2_255)]" />
                  <span className="tabular-nums text-foreground font-medium">
                    {data.skills.length}
                  </span>
                  {t("tech", "تقنية")}
                </span>
              </div>
              <h2 className="font-display h-display-xl pb-2">
                {t(
                  data.content?.skills?.titlePrefix_en ?? "Drag the things ",
                  data.content?.skills?.titlePrefix_ar ?? "اسحب الأشياء ",
                )}
                <span className="italic gradient-text-sky inline-block pb-1">
                  {t(
                    data.content?.skills?.titleAccent_en ?? "I build with.",
                    data.content?.skills?.titleAccent_ar ?? "التي أبني بها.",
                  )}
                </span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t(
                  `${data.skills.length} technologies, frameworks and platforms — toss them around. Real physics, no walls.`,
                  `${data.skills.length} تقنية وإطار ومنصة — حرّكها كما تريد. فيزياء حقيقية، بلا حواجز.`,
                )}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
