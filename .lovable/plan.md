## Goal

Two refinements:
1. Invert the colors of the descending disc behind the contact heading so it harmonizes with the band (dark disc in dark mode, light disc in light mode).
2. Rebuild the floating side rail without a surrounding capsule — exclusive, container-less, premium vertical icon column.

## 1. Disc color inversion (`src/components/PageEndCircle.tsx`)

Swap the core gradients in `DiscLayers()`:
- **Light mode**: white/paper disc (`oklch(1 0 0)` → `oklch(0.86 0.03 262)`) — blends into the soft sky-blue gradient band instead of clashing as a black orb.
- **Dark mode**: deep indigo-black disc (`oklch(0.22 0.04 268)` → `oklch(0.07 0.018 268)`) — reads as a richer shadow against the dark band.

Keep all surrounding layers (conic halo, orbital ring, specular highlight, rim light, vignette) intact — they already adapt via brand tokens.

## 2. Container-less navbar rebuild (`src/components/Navbar.tsx`)

Remove the glass capsule wrapper entirely. Each icon becomes a standalone floating glyph in a tight vertical column.

**Layout**
- `flex flex-col items-center gap-3 sm:gap-3.5` — clean vertical rhythm
- Anchored: `right-3 sm:right-5` (LTR) / `left-3 sm:left-5` (RTL)
- No background, no border, no shadow on the wrapper

**Icon states (per glyph)**
- **Idle**: bare icon at `text-foreground/55`, size `h-4 w-4` (mobile) / `h-[17px] w-[17px]` (desktop)
- **Hover**: a soft glass disc fades in *behind only that icon* (backdrop-blur + hairline border) — appears only on demand
- **Active**:
  - Brand-gradient halo (linear primary → primary-glow) with `LayoutGroup` sliding between items
  - Crisp 1px primary ring inset
  - Small brand-colored indicator dot pinned to the inner edge (also animates between active items via shared layout id)
- **Tooltip**: appears on the inner side on hover — pill with hairline + backdrop blur

**Section dividers**
Replace the inline hairline `<span>` with tiny opacity-40 dots (`h-1 w-1 rounded-full`) between groups — minimal, exclusive feel.

**Groups (top → bottom)**
1. Home / Explore / Comments (filtered by settings)
2. Separator dot
3. Contact CTA — solid `bg-foreground` filled circle (only this one keeps a surface, as a deliberate "primary action" anchor)
4. Separator dot
5. Theme + Language toggle stack (existing `<ThemeLangToggle/>`)

**Animation specs**
- Active pill spring: `stiffness: 320, damping: 30, mass: 0.7`
- Shared `layoutId="rail-edge-pill"` on the halo, `layoutId="rail-edge-indicator"` on the edge dot
- Reveal: `x: 32 → 0` over 0.7s with `[0.22, 1, 0.36, 1]` ease (mirrored for RTL)

## Files modified

- `src/components/PageEndCircle.tsx` — gradient inversion in `DiscLayers()` only
- `src/components/Navbar.tsx` — full rewrite of the rail (no capsule, per-icon states)

No new dependencies. No CSS additions needed — uses existing tokens (`--primary`, `--primary-glow`, `--surface-1`, `--hairline`, `--foreground`).
