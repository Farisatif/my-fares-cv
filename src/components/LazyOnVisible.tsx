import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type Props = {
  /**
   * The component to render once this region scrolls near the viewport.
   * Pass a `React.lazy()`-wrapped component for true code-splitting.
   */
  load: ComponentType<Record<string, never>>;
  /**
   * What to show before the component is mounted (and while its chunk loads).
   * Tip: reserve roughly the same vertical space to prevent CLS.
   */
  placeholder?: ReactNode;
  /**
   * Distance from viewport (CSS margin string) at which to start loading.
   * Defaults to 200px — start loading just before the section scrolls in.
   */
  rootMargin?: string;
  /** Optional className applied to the wrapper div. */
  className?: string;
};

/**
 * Defers mounting of an expensive component until its placeholder scrolls
 * close to the viewport (IntersectionObserver). Combine with `React.lazy`
 * for true code-splitting — the chunk download is deferred until scroll
 * brings the section into view, dramatically improving initial TTI.
 *
 * SSR-safe: server always renders the placeholder; the real component
 * mounts on the client after hydration + intersection.
 */
export function LazyOnVisible({
  load: Component,
  placeholder = null,
  rootMargin = "200px",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Older browsers or SSR fallback — just mount immediately.
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? <Suspense fallback={placeholder}>{<Component />}</Suspense> : placeholder}
    </div>
  );
}
