import { Outlet, createRootRoute, HeadContent, Scripts, useLocation, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteDataProvider } from "@/components/SiteDataProvider";
import { useEffect, useState } from "react";
import { PageBoot } from "@/components/PageBoot";
import { KitsysArrowField } from "@/components/KitsysArrowField";
import { Navbar } from "@/components/Navbar";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { NotFoundPage } from "@/components/NotFoundPage";
import { buildMeta, buildPersonJsonLd } from "@/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "color-scheme", content: "light dark" },
      ...buildMeta({
        title: "Fares Ahmed — Software Engineer & Builder",
        description:
          "Bilingual full-stack engineer from Sana'a, Yemen — building scalable systems, mobile experiences, and elegant UIs. Browse projects, skills, and live GitHub activity.",
        path: "/",
      }),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      { rel: "apple-touch-icon", href: "/logo.svg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildPersonJsonLd()),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteDataProvider>
          <PageBoot />
          <HeroArrowBackdrop />
          <TopProgressBar />
          <main id="main-content">
            <AnimatedOutlet />
          </main>
          <Footer />
          <AnchorPulse />
          <BackToTop />
          <Navbar />
          <CommandPalette />
          <Toaster position="bottom-right" />
        </SiteDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}


function AnimatedOutlet() {
  const loc = useLocation();
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        if (typeof window !== "undefined") {
          // Only reset scroll for true route changes (no hash). Hash navigation
          // is handled by AnchorPulse + native smooth-scroll.
          if (!window.location.hash) {
            window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
          }
        }
      }}
    >
      <motion.div
        key={loc.pathname + loc.hash}
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, y: 10 }
        }
        animate={
          reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
        }
        exit={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, y: -6 }
        }
        transition={
          reduce
            ? { duration: 0.15 }
            : {
                opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              }
        }
        style={{
          willChange: "transform, opacity",
          transformOrigin: "center 30%",
        }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Subtle highlight pulse on the section that matches the current URL hash.
 * Triggers on every hash change (e.g. clicking #contact in the navbar) so
 * users get visual confirmation of where the smooth-scroll just landed.
 */
function AnchorPulse() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const pulse = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      // Wait one tick so the route's anchor exists in the DOM after navigation.
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (!el) return;
        el.classList.remove("anchor-pulse");
        // Force reflow so re-adding the class restarts the animation.
        void el.offsetWidth;
        el.classList.add("anchor-pulse");
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove("anchor-pulse"), 2200);
      });
    };

    pulse();
    window.addEventListener("hashchange", pulse);
    return () => {
      window.removeEventListener("hashchange", pulse);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}

function TopProgressBar() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let tickTimer: ReturnType<typeof setInterval> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (showTimer || visible) return;
      showTimer = setTimeout(() => {
        setVisible(true);
        setProgress(15);
        tickTimer = setInterval(() => {
          setProgress((p) => (p < 85 ? p + (90 - p) * 0.08 : p));
        }, 120);
      }, 120);
    };

    const done = () => {
      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
      }
      setProgress(100);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    };

    const unsubLoad = router.subscribe("onBeforeLoad", start);
    const unsubResolved = router.subscribe("onResolved", done);

    return () => {
      unsubLoad();
      unsubResolved();
      if (showTimer) clearTimeout(showTimer);
      if (tickTimer) clearInterval(tickTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [router, visible]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-gradient-to-r from-foreground/40 via-foreground to-foreground/40"
        style={{
          width: `${progress}%`,
          transition: "width 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}


function HeroArrowBackdrop() {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const compute = () => {
      const hero = document.getElementById("top");
      const heroH = hero?.offsetHeight ?? window.innerHeight;
      const y = window.scrollY;
      const start = heroH * 0.35;
      const end = heroH * 0.85;
      let o = 1;
      if (y >= end) o = 0;
      else if (y > start) o = 1 - (y - start) / (end - start);
      setOpacity(o);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-200"
      style={{ opacity: opacity * 0.55 }}
    >
      <KitsysArrowField mode="fixed" className="chevron-canvas" />
    </div>
  );
}
