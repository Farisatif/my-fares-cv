import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "ar";
const Ctx = createContext<{
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
  t: (en: string, ar: string) => string;
}>({
  lang: "en",
  toggle: () => {},
  setLang: () => {},
  t: (en) => en,
});

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved =
      (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("lang", lang);
      document.cookie = `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
  }, [lang]);

  const applyLang = (next: Lang) => {
    if (typeof document === "undefined") {
      setLangState(next);
      return;
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const doc = document as DocWithVT;
    if (!reduce && typeof doc.startViewTransition === "function") {
      document.documentElement.classList.add("lang-switching");
      const transition = doc.startViewTransition(() => {
        setLangState(next);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove("lang-switching");
      });
      return;
    }
    setLangState(next);
  };

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang: applyLang,
        toggle: () => applyLang(lang === "en" ? "ar" : "en"),
        t: (en, ar) => (lang === "ar" ? ar : en),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
