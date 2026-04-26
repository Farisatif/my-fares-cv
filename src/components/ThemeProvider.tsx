import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

type ToggleOptions = { x?: number; y?: number };

const Ctx = createContext<{
  theme: Theme;
  toggle: (opts?: ToggleOptions) => void;
  setTheme: (next: Theme, opts?: ToggleOptions) => void;
}>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

// Apply the theme class to <html>. Kept outside React so we can call it
// synchronously from inside a View Transition update callback.
const applyTheme = (next: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* ignore quota / privacy errors */
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Hydrate from storage / system preference once on mount.
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const initial: Theme =
      saved ?? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((next: Theme, opts?: ToggleOptions) => {
    if (typeof document === "undefined") return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const supportsVT =
      // Safari ships it, Chrome ships it, Firefox is rolling it out.
      typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition ===
      "function";

    // Fallback: just toggle the class with a soft cross-fade via existing
    // `theme-anim` styles.
    if (!supportsVT || reduceMotion) {
      const root = document.documentElement;
      root.classList.add("theme-anim");
      applyTheme(next);
      setThemeState(next);
      window.setTimeout(() => root.classList.remove("theme-anim"), 600);
      return;
    }

    // Compute the origin of the circular reveal — defaults to the cursor /
    // top-right of the viewport when no coordinates are provided.
    const x = opts?.x ?? window.innerWidth - 40;
    const y = opts?.y ?? 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.style.setProperty("--theme-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-y", `${y}px`);
    document.documentElement.style.setProperty("--theme-r", `${endRadius}px`);
    document.documentElement.classList.add("theme-transitioning");

    // Tell the browser which direction we're animating so the CSS rules
    // can pick the right keyframes (clip new vs uncover old).
    document.documentElement.dataset.themeTo = next;

    const transition = (
      document as unknown as {
        startViewTransition: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
      }
    ).startViewTransition(() => {
      applyTheme(next);
      setThemeState(next);
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("theme-transitioning");
      delete document.documentElement.dataset.themeTo;
    });
  }, []);

  const toggle = useCallback(
    (opts?: ToggleOptions) => {
      setTheme(theme === "light" ? "dark" : "light", opts);
    },
    [theme, setTheme],
  );

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
