# Parkette — Design System · "June Colors" scheme

**Brand character: Abuela.** A hand-drawn matriarch — curly hair, round glasses,
a halo behind her head, a dress with a bib collar. She is the face of the brand
and, recolored to the **June Colors** palette, its source of warmth: cocoa-brown
line and hair, cream skin, an olive dress, an orange halo, pink lips.

The feeling is **sun-washed folk warmth** — flat pastel color on cream, bubbly
rounded type, a chunky cocoa "sticker" shadow, and a little 8-bit sparkle
(the pixel-flower motif) borrowed from the reference palette card.

> **Using this with Claude Code:** keep this file in the repo (e.g. `docs/design-system.md`)
> and tell Claude to follow it. Ship it with `parkette-tokens.css`, `parkette-components.css`,
> `tailwind.config.js`, and the `assets/` folder (Abuela artwork). Build from the
> **semantic tokens**, and reach for **Abuela** as the hero of any first impression.

---

## 1. Principles

1. **Abuela leads.** She headlines hero screens, empty states, loaders, the app icon. When in doubt, put Abuela in it.
2. **Cocoa is the ink.** There is no black in this scheme — text, outlines, and her hair are all warm cocoa `#6B342A`.
3. **Cream is the paper, never white.** The whole system sits on `#FDF8EC`.
4. **Six pastels, all peers.** Pink, sky, orange, yellow, olive — rotate them freely; orange is the hero fill for calls-to-action.
5. **Flat color, no gradients.** Depth comes from the cocoa offset shadow, not blur or gradients.
6. **Round everything,** keep the hand-made texture, and spend one bold move per screen. Motion bounces; respect `prefers-reduced-motion`.

---

## 2. Color — the June palette

| Token | Hex | Role |
|---|---|---|
| `--pk-paper` | `#FDF8EC` | Background (warm cream). |
| `--pk-masa` | `#F5E8D5` | Raised surfaces / cards (her skin). |
| `--pk-ink` | `#6B342A` | Cocoa — all text, outlines, wordmark, her hair. |
| `--pk-pink` | `#F8B1B9` | Accent (her lips). |
| `--pk-sky` | `#9CCBED` | Accent. |
| `--pk-orange` | `#F9A24A` | Hero fill / default CTA (her halo). |
| `--pk-yellow` | `#F4C816` | Accent. |
| `--pk-olive` | `#B1B735` | Accent / the "green" (her dress). |
| `--pk-ink-muted` | `#936A4E` | Secondary text. |
| `--pk-hairline` | `#EBDFC8` | Dividers. |
| `*-deep` variants | — | Hover / pressed / same-hue borders. |

**Text-on-color** — cocoa is dark enough to read on *every* accent, which keeps things simple:
- **Cocoa ink** on: `paper`, `masa`, `pink`, `sky`, `orange`, `yellow`, `olive`.
- **Cream** (`paper`) on: cocoa `ink` fills (and `orange-deep` if used for long text).
- On `olive`, cocoa is fine for headings/UI; for long body text prefer cream or bump size/weight.
- Never tint the cream toward gray, and never use pure white.

---

## 3. The character: how to use Abuela

Assets live in `assets/` (all recolored to June):
- **`abuela.svg`** — full vector portrait. Hero illustration.
- **`abuela-portrait.png`** — transparent raster, lighter for web heroes.
- **`abuela-badge.png`** — circular sticker avatar (sky disc + cocoa ring). App icon, profile mark, loaders.
- **`abuela-favicon.png`** — 128px badge.

Rules: give her room (plain cream or one flat color field, never a busy pattern) · the **halo is a reusable frame** (`.pk-halo` / `.pk-badge`) · don't recolor her again, stretch, blur, or crop through her glasses · one Abuela per view.

---

## 4. Typography

- **Display — Fredoka** (500/600): bubbly rounded wordmark voice. Headings, wordmark, big numbers.
- **Text — Nunito Sans** (400/700): body and UI.
- **Eyebrow — Nunito Sans, uppercase, `0.22em` tracking, 700.** The `LET'S CONNECT` treatment; section labels.

Wordmark: **"Parkette."** — trailing period, tight tracking. The period can carry a color accent (orange or pink). A **multicolor wordmark** (each letter a different June accent) is allowed for playful, display-only moments — a direct nod to the reference's "JUNE COLORS" lettering. Never multicolor body text.

| Role | Token | Family |
|---|---|---|
| Hero / wordmark | `--pk-text-hero` | Fredoka 600 |
| H1 / H2 | `--pk-text-h1` · `--pk-text-h2` | Fredoka 600 |
| H3 | `--pk-text-h3` | Fredoka 500 |
| Body / Small | `--pk-text-body` (17px) · `--pk-text-sm` | Nunito Sans 400 |
| Eyebrow | `--pk-text-eyebrow` | Nunito Sans 700, caps, tracked |

---

## 5. Space, radius, shape

- **Spacing:** 4px scale → `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.
- **Radius:** `sm 14 · md 20 · lg 30 · xl 44 · pill 999`. Buttons/chips are pills; cards use `lg`.
- **Circle** is Abuela's shape (halo, badge, glasses). **Square** is the reference's shape (color tiles, pixel accents) — use crisp squares for the pixel-flower and corner confetti.

---

## 6. The signature: sticker elevation + pixel flower

Depth = a hard offset shadow in cocoa, not a soft blur.

```css
box-shadow: 4px 4px 0 var(--pk-ink);   /* resting */
```

Interactive elements lift toward the cursor on hover, press flush on active
(`translate(-2px,-2px)` → `translate(4px,4px)`, easing `--pk-ease-bounce`). Don't
stack a soft blur on the same element. `--pk-shadow-soft` is only for quiet surfaces.

**Pixel flower** (`.pk-flower`) — a 3×3 plus of squares echoing the reference's
center motif. Set petal + center colors via `--p` / `--c`. Use it as a bullet,
divider ornament, empty-state sparkle, or loading tile. Pair with square
"confetti" pixels peeking from card corners. Use sparingly so it stays a wink,
not wallpaper.

---

## 7. Components (see `parkette-components.css`)

- **`.pk-btn`** — sticker pill. Variants: default (orange), `--pink`, `--sky`, `--yellow`, `--olive`, `--cocoa`, `--ghost`.
- **`.pk-chip`** — tag pill with cocoa outline. `--pink`, `--sky`, `--orange`, `--yellow`, `--olive`.
- **`.pk-card`** — masa surface, cocoa outline, sticker shadow. `--flat` for quiet cards.
- **`.pk-input`** — rounded, cocoa-outlined; focus shows the sticker shadow.
- **`.pk-badge`** — circular Abuela avatar (`background-image: url(assets/abuela-badge.png)`).
- **`.pk-halo`** — wraps any element in her sky-disc + cocoa-ring frame.
- **`.pk-flower`** — the pixel-flower accent.
- Type helpers: `.pk-wordmark`, `.pk-eyebrow`, `.pk-h1/2/3`, `.pk-muted`.

---

## 8. Voice & copy

Warm, plain, a little playful — like Abuela herself. Short and active ("Let's connect,"
"Thank you for playing!", "Come on in"). Sentence case in UI; eyebrows are the only caps.
Errors are friendly and specific, never apologetic. The period after **Parkette.** is
part of the voice: calm, complete, done.

---

## 9. Accessibility floor

- Cocoa text on cream/masa/pink/sky/orange/yellow → AA+. On `olive`, reserve cocoa for headings/UI; use cream or heavier weight for long text.
- Every interactive element has a visible focus ring (`--pk-focus-ring`): cream gap then orange ring.
- Hit targets ≥ 44px. Motion honors `prefers-reduced-motion`.
- Never rely on color alone — pair with label or icon.
- Abuela art needs `alt` text; decorative pixel-flowers use `alt=""` / `aria-hidden`.

---

## 10. Do / Don't

**Do:** put Abuela on first impressions · use cocoa as the only "dark" · lead CTAs with orange, rotate the six pastels · sprinkle pixel-flowers as accents · frame avatars with the halo · use the sticker shadow for anything interactive.

**Don't:** reintroduce black or pure white · recolor/stretch/blur/crop Abuela · add gradients or glows · set long body text on olive without a contrast bump · stack soft + sticker shadows · turn the pixel-flower into wallpaper.
