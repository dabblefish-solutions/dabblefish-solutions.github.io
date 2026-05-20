# Episode Icon Design Guide

Per-episode mini-icons appear on the Latest Episode block (`index.html`) and in the Episodes grid (`episodes.html`). They're tiny pixel-art compositions rendered from ASCII grids → `<canvas>` → CSS-scaled to fit.

This doc tells Claude Code (or anyone) how to make a new one.

---

## TL;DR

Each icon is **one ASCII string + one palette object** at the bottom of `index.html` (latest only) and `episodes.html` (all). Each character in the grid maps to a hex color via the palette object. The `renderPixelArt()` helper in `app.js` paints it onto a canvas the size of the grid, then the browser scales it up.

Add a new episode → add `const ART_NN = ...` and `const PAL_NN = ...` plus one `renderPixelArt(document.getElementById('mini-NN'), ART_NN, PAL_NN);` call.

---

## Canvas dimensions

| Use | Recommended grid | Where |
|---|---|---|
| **Featured (home page hero)** | 32×27 (wider, more detail) | bottom of `index.html` |
| **Mini (episodes grid)** | 16×16 or 17×16 | bottom of `episodes.html` |

Square or slightly-tall is best. The container is `aspect-ratio: 1/1` so non-square grids will distort. Stick within ±2 rows of square.

Don't go bigger than ~32×32 for minis — the cards are 140px wide so each pixel ends up tiny anyway and the detail is wasted. Don't go smaller than 14×14 — looks like a glyph.

---

## Palette — pick from these (CRT mode, which is the default)

```
'#070a0d'  near-black (page bg)
'#0d1216'  slightly lighter bg
'#161c22'  card surface
'#1e272f'  panel border
'#5a6770'  muted
'#ffffff'  white
'#14e1e1'  cyan        ← primary glow
'#eb28d2'  magenta     ← primary accent
'#ffd93d'  yellow
'#5d8eff'  blue
'#b85dff'  purple
```

**Rule of thumb:** use the dark bg as background, cyan + magenta for the main shapes, and ONE secondary color (yellow OR blue OR purple) as a punch. Pure white for highlights only. More than 4 colors total starts looking muddy at 16×16.

---

## Letter convention (informal)

When picking palette keys, try to stay readable:

```
. = background (the dark color the card sits on)
k = darker bg / shadow
d = even darker / outline
w = white / highlight
y = yellow
b = blue or cyan
p = pink/magenta or pop accent
m = mid/secondary
```

You can use any single character — these are just conventions so anyone reading the grid can roughly tell what's what.

---

## How the renderer works (so you can design with intent)

`renderPixelArt(container, art, palette, cellSize)` from `app.js`:

1. Splits `art` on newlines, strips empty lines.
2. Creates a canvas the size of the grid (one CSS pixel = one rendered pixel before scaling).
3. For each character: if `palette[char]` exists, fill that 1×1 pixel. If not, leave transparent.
4. Adds `image-rendering: pixelated` so the browser scales it up crisp.

So:
- **Spaces and unmapped characters are transparent** — the card's `--bg-3` shows through. Use `.` to mean "background" if you want to be explicit.
- **No anti-aliasing.** What you type is exactly what shows.
- **All rows must be the same length** if you want predictable framing. Pad short rows with `.`.

---

## A worked example

EP 04 (The Cryptid — Loab):

```js
const ART_04 = `
................
................
....kkkkkkkkk....
...kkdddkkdddk...
...kdpkpkkpkpd...
...kdpkpkkpkpd...
...kkdddkkdddk...
....kkkkkkkkk....
.....kkpppkk.....
.....kpppppk.....
.....kkpppkk.....
......kkkkk......
....kkdkkkdkk....
....kdddddddk....
.....kkkkkkk.....
................
`;
const PAL_04 = {
  '.': '#0d1216',   // bg
  'k': '#161c22',   // face base
  'd': '#1e272f',   // shadow / outline
  'p': '#eb28d2',   // eyes + mouth (the unsettling pop)
};
renderPixelArt(document.getElementById('mini-04'), ART_04, PAL_04);
```

Reads as: a soft skull-shape, with magenta eyes and mouth that draw the eye. Three colors total. Centered with `.` padding.

---

## How to add a new episode icon

1. **Sketch the concept** in 1-2 sentences, then on graph paper or in a text editor.
2. **Pick a tag color** for the episode card (`tag-pink`, `tag-yellow`, `tag-mint`, `tag-blue`, `tag-purple`) and let the icon's dominant accent match it loosely.
3. **Draft the ASCII** at the chosen grid size. Always wrap in `` ` `` template strings — newlines are significant.
4. **Pad rows with `.`** so they're all equal length.
5. **Write the palette** at most 4 entries.
6. **At the bottom of `episodes.html`** add:
   ```js
   const ART_05 = `... your grid ...`;
   const PAL_05 = { '.':'#0d1216', /* ... */ };
   renderPixelArt(document.getElementById('mini-05'), ART_05, PAL_05);
   ```
7. **In the new `<article class="ep-card">`** make sure the `<div class="pixel-art" id="mini-05">` id matches the `getElementById` call.
8. **If this is the new "latest"**, also update `index.html`'s `ART_05` block at the bottom (a larger version, ~32×27 grid).

---

## Style guidance

- **One readable shape per icon.** Tiny detail doesn't read. A face, an object, a symbol — not a scene.
- **High contrast.** Dark background + bright cyan/magenta foreground. The cards already have a dark background — your icon should pop off it.
- **No text in the icons.** Pixel text at 16×16 is unreadable; the episode number badge already covers that need.
- **Centered.** Leave 1-2 rows of `.` on top/bottom so the icon doesn't kiss the edge.
- **No diagonals smaller than 3 pixels** — they look like garbage. If you need a diagonal in a 16×16 grid, make it a clean step pattern.
- **Match the show's tone.** Slightly menacing + funny. A skull is fine. A smiling robot is fine. An emoji-style mascot is not.

---

## Concept prompts for the next few episodes

These are fair game for Claude Code to interpret if a brief is too thin:

- **Tungsten cube agent (rumored EP 05):** a stack of magenta cubes, or a single cube with a cyan "ORDER PLACED" ping
- **Sydney (already EP 02):** broken/cracked heart
- **Bridge / Golden Gate Claude (already EP 01):** suspension bridge silhouette
- **GPT-4 + TaskRabbit (already EP 03):** robot with shifty eyes
- **Loab (already EP 04):** uncanny face in static

For a generic placeholder when in doubt: a question mark glyph in cyan with magenta scanline overlay.
