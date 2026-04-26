import { useEffect, useRef } from "react";

/**
 * Kitsys-style chevron field that points toward the mouse cursor.
 * Pure canvas, DPR-aware, only animates while in viewport.
 * Falls back to a static pattern under prefers-reduced-motion.
 *
 * mode="absolute" (default) — fills the parent element (parent must be
 *   `relative`). Tracks the pointer relative to the parent.
 * mode="fixed" — covers the whole viewport as a global background. Tracks
 *   the pointer at the window level. Use exactly one instance globally.
 */
export function KitsysArrowField({
  className = "",
  mode = "absolute",
}: {
  className?: string;
  mode?: "absolute" | "fixed";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const visibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const ripplesRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const animatingRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0;
    let height = 0;
    let points: { x: number; y: number; angle: number }[] = [];
    let protectedRects: { left: number; top: number; right: number; bottom: number }[] = [];
    const SPACING = 30;
    const DEFAULT_ANGLE = 0;
    const FALLOFF = 520; // distance after which arrows ease back to default
    const TEXT_PAD = 22;
    const TEXT_FADE = 70;
    // Click ripple — radius expands at this many CSS pixels per millisecond.
    const RIPPLE_SPEED = 0.85;
    const RIPPLE_THICKNESS = 90;
    const RIPPLE_LIFETIME = 1400; // ms
    // Subtle ambient breathing so the field feels alive even when idle.
    const BREATH_AMP = 0.06; // radians
    const BREATH_FREQ = 0.0006; // rad/ms

    const updateProtectedRects = () => {
      const selectors = [
        "h1",
        "h2",
        "h3",
        "p",
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "nav",
        "[role='button']",
      ].join(",");

      protectedRects = Array.from(document.querySelectorAll<HTMLElement>(selectors))
        .map((el) => el.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth)
        .map((rect) => ({
          left: Math.max(0, rect.left - TEXT_PAD),
          top: Math.max(0, rect.top - TEXT_PAD),
          right: Math.min(window.innerWidth, rect.right + TEXT_PAD),
          bottom: Math.min(window.innerHeight, rect.bottom + TEXT_PAD),
        }));
    };

    const readabilityAlpha = (x: number, y: number) => {
      let multiplier = 1;
      for (const rect of protectedRects) {
        const dx = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
        const dy = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return 0;
        multiplier = Math.min(multiplier, Math.min(1, distance / TEXT_FADE));
      }
      return multiplier;
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const buildGrid = () => {
      if (mode === "fixed") {
        width = Math.max(1, Math.floor(window.innerWidth));
        height = Math.max(1, Math.floor(window.innerHeight));
      } else {
        const rect = wrap.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateProtectedRects();

      points = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Slight stagger every other row for organic rhythm.
          const xJit = (r % 2 === 0 ? 0 : SPACING / 2);
          points.push({
            x: c * SPACING + xJit,
            y: r * SPACING,
            angle: DEFAULT_ANGLE,
          });
        }
      }
    };

    const drawChevron = (x: number, y: number, angle: number, alpha: number, dark: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = dark
        ? `rgba(255,255,255,${alpha})`
        : `rgba(15,23,42,${alpha})`;
      ctx.lineWidth = dark ? 1.5 : 1.75;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const s = 5; // chevron half-size
      ctx.beginPath();
      ctx.moveTo(-s, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(-s, s);
      ctx.stroke();
      ctx.restore();
    };

    const renderStatic = () => {
      const dark = isDark();
      ctx.clearRect(0, 0, width, height);
      for (const p of points) {
        const readable = mode === "fixed" ? readabilityAlpha(p.x, p.y) : 1;
        if (readable > 0.08) {
          drawChevron(p.x, p.y, DEFAULT_ANGLE, (dark ? 0.18 : 0.42) * readable, dark);
        }
      }
    };

    const renderFrame = () => {
      rafRef.current = null;
      if (!visibleRef.current) return;
      const dark = isDark();
      ctx.clearRect(0, 0, width, height);
      const m = mouseRef.current;
      const baseAlphaDark = 0.18;
      const baseAlphaLight = 0.42;
      const now = performance.now();
      // Prune dead ripples.
      if (ripplesRef.current.length) {
        ripplesRef.current = ripplesRef.current.filter(
          (r) => now - r.t < RIPPLE_LIFETIME,
        );
      }
      const hasRipples = ripplesRef.current.length > 0;
      for (const p of points) {
        let target = DEFAULT_ANGLE;
        let intensity = 0;
        if (m.active) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / FALLOFF);
          intensity = t;
          if (t > 0) {
            target = Math.atan2(dy, dx);
          }
        }
        // Ripple contribution — newest wins on direction; intensities sum.
        let rippleBoost = 0;
        if (hasRipples) {
          for (const r of ripplesRef.current) {
            const age = now - r.t;
            const radius = age * RIPPLE_SPEED;
            const dx = p.x - r.x;
            const dy = p.y - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const band = Math.abs(dist - radius);
            if (band > RIPPLE_THICKNESS) continue;
            // Triangular falloff across the band, fades out over lifetime.
            const bandFactor = 1 - band / RIPPLE_THICKNESS;
            const lifeFactor = 1 - age / RIPPLE_LIFETIME;
            const w = bandFactor * lifeFactor;
            if (w <= 0) continue;
            // Arrows in the wave point AWAY from the ripple center.
            target = Math.atan2(dy, dx);
            rippleBoost = Math.max(rippleBoost, w);
          }
        }
        // Ambient breathing — phase-shifted by position so it doesn't look uniform.
        const breath =
          BREATH_AMP * Math.sin(now * BREATH_FREQ + (p.x + p.y) * 0.01);
        // Lerp angle toward target — handle wrap-around.
        let diff = target + breath - p.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        // Snappier when a ripple or pointer is engaging this point.
        const lerp = 0.14 + 0.18 * Math.max(intensity, rippleBoost);
        p.angle += diff * lerp;
        const readable = mode === "fixed" ? readabilityAlpha(p.x, p.y) : 1;
        if (readable <= 0.08) continue;
        const dynamic = Math.max(intensity, rippleBoost);
        const alpha =
          ((dark ? baseAlphaDark : baseAlphaLight) +
            dynamic * (dark ? 0.42 : 0.28)) *
          readable;
        drawChevron(p.x, p.y, p.angle, alpha, dark);
      }
      // Keep animating while pointer is active, ripples are alive, or we're
      // breathing in fixed mode.
      const keepAnimating = m.active || hasRipples || mode === "fixed";
      animatingRef.current = keepAnimating;
      if (keepAnimating) {
        rafRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const scheduleFrame = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    buildGrid();
    if (reduced) {
      renderStatic();
    } else {
      renderStatic();
    }

    const onMove = (e: PointerEvent) => {
      if (mode === "fixed") {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      } else {
        const rect = wrap.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      }
      mouseRef.current.active = true;
      if (!reduced) scheduleFrame();
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      if (!reduced) scheduleFrame();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reduced) return;
      const x = mode === "fixed" ? e.clientX : e.clientX - wrap.getBoundingClientRect().left;
      const y = mode === "fixed" ? e.clientY : e.clientY - wrap.getBoundingClientRect().top;
      ripplesRef.current.push({ x, y, t: performance.now() });
      // Cap concurrent ripples to keep cost bounded on rapid clicks.
      if (ripplesRef.current.length > 6) ripplesRef.current.shift();
      scheduleFrame();
    };

    const target: HTMLElement | Window = mode === "fixed" ? window : wrap;
    target.addEventListener("pointermove", onMove as EventListener, { passive: true } as AddEventListenerOptions);
    target.addEventListener("pointerleave", onLeave as EventListener);
    target.addEventListener("pointerdown", onPointerDown as EventListener, { passive: true } as AddEventListenerOptions);

    let scrollTick = false;
    const onScroll = () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        updateProtectedRects();
        if (reduced || !visibleRef.current) renderStatic();
        else scheduleFrame();
      });
    };
    if (mode === "fixed") {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    let onResizeWin: (() => void) | null = null;
    if (mode === "fixed") {
      visibleRef.current = true;
      onResizeWin = () => {
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        buildGrid();
        if (reduced) {
          renderStatic();
        } else {
          scheduleFrame();
        }
      };
      window.addEventListener("resize", onResizeWin, { passive: true });
    } else {
      ro = new ResizeObserver(() => {
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        buildGrid();
        if (reduced || !visibleRef.current) {
          renderStatic();
        } else {
          scheduleFrame();
        }
      });
      ro.observe(wrap);

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visibleRef.current = entry.isIntersecting;
            if (entry.isIntersecting && !reduced) {
              scheduleFrame();
            }
          }
        },
        { rootMargin: "100px" },
      );
      io.observe(wrap);
    }

    const themeObserver = new MutationObserver(() => {
      if (reduced || !visibleRef.current) {
        renderStatic();
      } else {
        scheduleFrame();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      target.removeEventListener("pointermove", onMove as EventListener);
      target.removeEventListener("pointerleave", onLeave as EventListener);
      target.removeEventListener("pointerdown", onPointerDown as EventListener);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (onResizeWin) window.removeEventListener("resize", onResizeWin);
      if (mode === "fixed") window.removeEventListener("scroll", onScroll);
      themeObserver.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`${
        mode === "fixed" ? "pointer-events-none fixed" : "pointer-events-auto absolute"
      } inset-0 overflow-hidden ${className}`}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 45%, transparent 92%)",
        maskImage:
          "radial-gradient(ellipse at center, black 45%, transparent 92%)",
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}