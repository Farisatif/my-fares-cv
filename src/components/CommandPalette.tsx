import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  /** Material icon-style emoji-free glyph drawn with SVG. */
  glyph: "home" | "compass" | "chat" | "sun" | "moon" | "globe" | "anchor" | "external";
  /** Returns true to keep the palette open after running. */
  run: () => void | boolean | Promise<void | boolean>;
};

const SECTION_ANCHORS = [
  { id: "top", en: "Hero", ar: "الترحيب" },
  { id: "about", en: "About", ar: "عني" },
  { id: "skills", en: "Skills", ar: "المهارات" },
  { id: "languages", en: "Languages", ar: "اللغات" },
  { id: "experience", en: "Experience", ar: "الخبرة" },
  { id: "achievements", en: "Achievements", ar: "الإنجازات" },
  { id: "contact", en: "Contact", ar: "تواصل" },
];

function Glyph({ name }: { name: Action["glyph"] }) {
  const common = "h-4 w-4 shrink-0 text-muted-foreground";
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-6 2 2-6 6-2z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "anchor":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <circle cx="12" cy="5" r="2" /><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 21H5M16 21h3" />
        </svg>
      );
    case "external":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={common}>
          <path d="M14 4h6v6M10 14L20 4M19 13v6H5V5h6" />
        </svg>
      );
  }
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { lang, toggle: toggleLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
  const isAr = lang === "ar";

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // Toggle on Ctrl/Cmd + K
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Focus input + lock body scroll when opened
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goAnchor = useCallback(
    (id: string) => {
      navigate({ to: "/", hash: id });
      // Smooth scroll fallback if already on /
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    [navigate],
  );

  const actions = useMemo<Action[]>(() => {
    const navGroup = isAr ? "تنقّل" : "Navigate";
    const sectionsGroup = isAr ? "أقسام الصفحة الرئيسية" : "Home sections";
    const settingsGroup = isAr ? "الإعدادات" : "Settings";
    const linksGroup = isAr ? "روابط خارجية" : "External links";

    const list: Action[] = [
      {
        id: "go-home",
        label: isAr ? "الصفحة الرئيسية" : "Home",
        group: navGroup,
        glyph: "home",
        run: () => {
          navigate({ to: "/" });
        },
      },
      {
        id: "go-explore",
        label: isAr ? "استكشف المشاريع" : "Explore projects",
        group: navGroup,
        glyph: "compass",
        run: () => {
          navigate({ to: "/explore" });
        },
      },
      {
        id: "go-comments",
        label: isAr ? "كتاب الزوار" : "Guestbook",
        group: navGroup,
        glyph: "chat",
        run: () => {
          navigate({ to: "/comments" });
        },
      },
      ...SECTION_ANCHORS.map<Action>((s) => ({
        id: `anchor-${s.id}`,
        label: isAr ? s.ar : s.en,
        hint: `#${s.id}`,
        group: sectionsGroup,
        glyph: "anchor",
        run: () => goAnchor(s.id),
      })),
      {
        id: "toggle-theme",
        label: isAr
          ? theme === "dark"
            ? "الوضع الفاتح"
            : "الوضع الداكن"
          : theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode",
        group: settingsGroup,
        glyph: theme === "dark" ? "sun" : "moon",
        run: () => {
          toggleTheme();
        },
      },
      {
        id: "toggle-lang",
        label: isAr ? "English" : "العربية",
        hint: isAr ? "تبديل اللغة" : "Switch language",
        group: settingsGroup,
        glyph: "globe",
        run: () => {
          toggleLang();
        },
      },
      {
        id: "github",
        label: "GitHub — Farisatif",
        hint: "github.com/Farisatif",
        group: linksGroup,
        glyph: "external",
        run: () => {
          window.open("https://github.com/Farisatif", "_blank", "noopener,noreferrer");
          return true;
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: isAr ? "ملفي الشخصي" : "Open profile",
        group: linksGroup,
        glyph: "external",
        run: () => {
          window.open(
            "https://www.linkedin.com/in/fares-atef-01a02a404",
            "_blank",
            "noopener,noreferrer",
          );
          return true;
        },
      },
    ];
    return list;
  }, [isAr, navigate, goAnchor, theme, toggleTheme, toggleLang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        (a.hint?.toLowerCase().includes(q) ?? false),
    );
  }, [actions, query]);

  // Reset/clamp active index when filtered list changes
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  // Keep active item in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const grouped = useMemo(() => {
    const map = new Map<string, { item: Action; idx: number }[]>();
    filtered.forEach((item, idx) => {
      const arr = map.get(item.group) ?? [];
      arr.push({ item, idx });
      map.set(item.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const runAt = useCallback(
    async (idx: number) => {
      const a = filtered[idx];
      if (!a) return;
      const keepOpen = await a.run();
      if (!keepOpen) close();
    },
    [filtered, close],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk-root"
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          dir={isAr ? "rtl" : "ltr"}
        >
          <motion.div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? "لوحة الأوامر" : "Command palette"}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  isAr ? "ابحث عن صفحة، قسم، أو إعداد..." : "Search pages, sections, settings..."
                }
                className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                Esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {isAr ? "لا توجد نتائج." : "No results found."}
                </div>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group}
                    </div>
                    {items.map(({ item, idx }) => {
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          data-idx={idx}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => runAt(idx)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-start text-sm transition-colors ${
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground hover:bg-accent/60"
                          }`}
                        >
                          <Glyph name={item.glyph} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.hint && (
                            <span className="truncate text-xs text-muted-foreground">
                              {item.hint}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                    ↑↓
                  </kbd>
                  {isAr ? "تنقّل" : "navigate"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                    ↵
                  </kbd>
                  {isAr ? "تنفيذ" : "select"}
                </span>
              </div>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">
                  Ctrl K
                </kbd>
                {isAr ? "افتح / أغلق" : "toggle"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
