## What will change

### 1. GitHub activity section ("Real activity. Synced live.") — invert + polish
File: `src/components/GithubActivitySection.tsx` and `src/routes/index.tsx`.

- In `index.tsx`, the section currently sits in `SectionBand variant="soft"`. Switch it to `variant="dark"` (which auto-inverts between modes via the `--band-dark` tokens) so the section reads inverted vs. the surrounding bands in both light and dark themes.
- Drop the `pattern="aurora"` grid backdrop (replaced by the new gradient — see #4).
- Inside the section:
  - Refresh the heading hierarchy: bigger eyebrow with live pulse, and an italic gradient accent that adapts to the inverted band (use `color-mix` against `currentColor` so it works on both themes).
  - Upgrade the profile card and stats with stronger glass surfaces (`backdrop-blur`, hairline borders against currentColor) so they feel premium on the dark inverted background.
  - **RTL horizontal scroll fix for the contributions heatmap**: the heatmap container currently relies on `overflow-x-auto`, but in Arabic the outer `dir="rtl"` makes the scroll origin start at the right edge — users can't drag the grid into view. Wrap the heatmap in a `dir="ltr"` scroll container (the inner heatmap is already `dir="ltr"`) and add an explicit `min-width` on the grid so horizontal scroll always engages. Add subtle edge-fade masks (left+right gradient) so the user gets a visual hint that it scrolls, and on mobile show a tiny "← →" hint chip in Arabic identical to English.
  - Add momentum scroll (`scroll-snap-type: x proximity`) per week column so the swipe feels deliberate.

### 2. Experience section ("Where I've put in the hours.") — invert between themes
File: `src/components/ExperienceSection.tsx`.

- The section is hard-coded `bg-foreground text-background`, so it always uses the inverted palette regardless of theme — that's the opposite of "invert between themes." Replace with the band token system: remove the inline `bg-foreground text-background` and rely on the `SectionBand variant` from `index.tsx`. Switch the band wrapper from `dark` to `light` (or vice-versa) so it inverts cleanly per theme.
- Update the inner card surfaces to use `currentColor`-mixed backgrounds (instead of hard-coded `var(--background)` mixes) so the cards stay legible on whichever side of the inversion the user is viewing.
- Keep the existing chevron pattern but lower its opacity so it doesn't fight the new gradient backdrop (#4).

### 3. Typewriter heading (`about.dev.ts`) — stop the page-jump on mobile
File: `src/components/AboutSection.tsx` (`CodeCommentCard`).

The current `wrapByWords` re-flows lines as characters arrive, so the card height grows line-by-line and pushes the page on phones. Fix:
- Pre-compute the **final** wrapped lines from the full `text` once. Render those final lines as the layout skeleton (transparent / placeholder spans reserving height), then overlay the typed slice character-by-character on top so the container height is locked from frame 1.
- Slow the typewriter further on mobile (use a width-aware `duration` floor — e.g. 5500ms minimum for ≤640px viewports) and switch from RAF-by-character to a steadier, eased per-word interval so it reads as a deliberate, professional reveal.
- Keep the blinking caret at the current write-head; never call `setTyped` with a value that would change the reserved line count.

### 4. Replace square-grid backgrounds with a smooth blue gradient
Target: every section that currently shows a grid pattern.

- In `src/routes/index.tsx`, change `pattern="grid-fine"` / `pattern="grid-dots"` / `pattern="aurora"` on every `SectionBand` to `pattern="none"` (or a new `pattern="gradient"` variant — see below).
- Add a new `gradient` variant to `SectionBand` (`src/components/SectionBand.tsx`) and a matching `.gradient-bg` class in `src/styles.css` that paints the same soft blue → white wash from the reference screenshot:
  - Light mode: `linear-gradient(135deg, oklch(0.92 0.07 255) 0%, oklch(0.985 0.005 255) 60%, oklch(0.96 0.02 255) 100%)` plus a subtle radial highlight in the top-left.
  - Dark mode: mirror with deep navy → near-black so the same composition reads in both themes.
- Remove `ChevronPattern` overlays from `ContactSection.tsx` (or drop opacity to ~0.04) so the gradient stays clean.
- Also remove the `GlowDots` square-grid backdrop inside `GithubActivitySection.tsx` (replaced by the new gradient at the band level).

### 5. Headlines polish (match reference screenshot)
- Bump the heading scale on the contact + experience + github + about sections via the existing `h-display-xl` / `h-display-lg` utilities so they read with the same weight as the screenshot ("Got an idea? / Let's build it.").
- Make the italic accent line use a brighter sky-blue gradient (`linear-gradient(90deg, oklch(0.72 0.18 245), oklch(0.55 0.22 255))`) — exposed as a new `.gradient-text-sky` utility in `styles.css`. Apply it to: GitHub "Synced live.", Experience "put in the hours.", and About's accent line.
- Tighten letter-spacing slightly on the display headings (`tracking-[-0.04em]`) for the magazine-poster feel.

### 6. New floating side navbar — icon-only, glass, edge-anchored
File: `src/components/Navbar.tsx`.

Replace the current bottom-center pill with a vertical floating rail:
- Position: `fixed top-1/2 -translate-y-1/2`. In LTR, anchor to the **right** edge (`right-3`). In RTL, anchor to the **left** edge (`left-3`). Read `lang` from `useLang()` to pick the side.
- Style: same pill DNA as the current navbar — `backdrop-blur-xl`, `bg-[var(--surface-1)]/55`, `border border-[var(--hairline)]`, `brand-shadow`, full rounding (`rounded-full`). Slightly more transparent than today (≈55%) per the "شبه شفاف" requirement.
- Icons only (no text labels): Home (`Home`), Explore (`Compass`), Comments (`MessageSquare`, conditional on `showComments`), Contact (`Mail`, hashes to `#contact`). Each has an accessible `aria-label` and a tooltip on hover (small floating chip on the inner side of the rail).
- Active state: keep the existing `LayoutGroup` / `motion.span` pill highlight — animates vertically between icons instead of horizontally.
- Theme/lang toggle: keep `ThemeLangToggle` but render it at the bottom of the rail (stacked) so the right edge stays the single nav surface.
- Mobile: the rail collapses to a smaller width (icons ~36px) and stays anchored to the side; on very narrow viewports (`<360px`) it auto-shifts to bottom-center as a safety fallback so it never overlaps content.
- Remove the bottom-padding the page reserved for the old bottom navbar (search for any `pb-` spacers tied to `Navbar`); replace with side padding equal to the rail width on `lg+` so content never hides behind it.

### 7. Cleanup pass
- Delete unused imports left over from removed grid backgrounds (`GlowDots` in GitHub section, `ChevronPattern` in Contact if fully removed).
- Verify `useReducedMotion` paths still work for the new typewriter (instant fill, no caret).
- Smoke-test both `lang === "en"` and `lang === "ar"` for: navbar side, heatmap horizontal scroll, gradient backgrounds, inverted Experience colors.

## Files touched
- `src/routes/index.tsx` — band variants, pattern flags
- `src/components/SectionBand.tsx` — add `gradient` pattern
- `src/components/Navbar.tsx` — full rebuild (vertical, icon-only, glass, side-anchored)
- `src/components/GithubActivitySection.tsx` — invert via band, polish, RTL scroll fix, drop GlowDots
- `src/components/ExperienceSection.tsx` — remove hard-coded inversion, use band tokens
- `src/components/AboutSection.tsx` — typewriter height-lock + slower mobile pacing
- `src/components/ContactSection.tsx` — drop chevron grid, lean on band gradient
- `src/styles.css` — add `.gradient-bg` (light + dark) and `.gradient-text-sky`

No database/auth changes; no new dependencies.
