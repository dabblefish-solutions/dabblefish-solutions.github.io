# Model Behavior — Maintaining the Site

When a new episode drops, here's exactly what to update. Every spot is tagged with `<!-- MAINTAIN: <key> -->` in the HTML so you can `grep -r "MAINTAIN:" .` to find them all.

---

## Per-episode release checklist

When **episode N+1** publishes, do these in order:

### 1. `index.html` — Featured ("Latest") Episode
Find `<!-- MAINTAIN: latest-episode -->` and update:
- Tag chip (e.g. `<span class="tag tag-purple">CRYPTID FILES</span>`)
- Episode title in `<h3>`
- Episode number, runtime, date in `.ep-meta`
- `.ep-desc` paragraph (the description)
- `data-duration` on `<div class="player">` (seconds — used by the fake player)
- `.total` text inside `.times` (formatted as MM:SS)
- The `.ep-num` label ("04" → "05")
- The pixel-art block at the bottom of `index.html` (`const ART_04 = ...`) — either replace with a new ascii grid for the new episode, or just rename the variable.
- Section meta line: `RECORDED MM.DD.YYYY · MM:SS RUNTIME`

### 2. `index.html` — Ticker / Marquee
Find `<!-- MAINTAIN: marquee -->` and update the `<span>` items inside `.track`. These are short hype lines that should change when a new episode drops — current ones reference Claudius/tungsten, swap in references to the new episode.

### 3. `episodes.html` — Episode grid
Find `<!-- MAINTAIN: episode-grid -->`. To add the new episode:
- Copy the topmost `<article class="ep-card">` block, paste a duplicate above it
- Update all fields (tag, h3, ep-meta, ep-desc, unhinged rating meter segments, transcript teaser)
- Add a new pixel-art block at the bottom (`const ART_05 = ...`) and a renderPixelArt call
- Update the section meta: `N EPISODES · SEASON X`

### 4. `episodes.html` — "Coming up next" teaser
Find `<!-- MAINTAIN: next-episode-teaser -->`. Update the EP NN+1 hint to point to what's coming after.

### 5. RSS / podcast platforms (out of scope of this codebase)
Update Spotify, Apple, YouTube, RSS feed independently.

---

## Other periodic updates

### Stats on `contact.html`
Find `<!-- MAINTAIN: sponsor-stats -->`. Update downloads/episode, full-listen rate, etc. as the show grows.

### Sponsor testimonials
Find `<!-- MAINTAIN: sponsor-testimonials -->`. Add/rotate quotes from past sponsors.

### Hosts bios on `index.html`
Find `<!-- MAINTAIN: hosts -->` if hosts change or want new bio copy.

---

## Tweaks panel

The "TWK" floating panel exposes three zero-maintenance options:
- **Palette** (CRT / Neon / Game Boy / Paper)
- **Scanlines on/off** (accessibility-positive — some readers will turn it off)
- **Pixel scale** (chunky / fine)

These are all driven from CSS custom properties and don't require any per-episode updates.

---

## Easter egg
↑↑↓↓←→←→ B A triggers a wordmark glitch storm and a "CHEAT UNLOCKED" toast. Lives in `app.js → initKonami()`. No maintenance needed.

---

## File map

| File | Purpose |
|---|---|
| `index.html` | Home: hero, latest episode, hosts, newsletter |
| `episodes.html` | All episodes grid + next-up teaser |
| `contact.html` | General contact form (top) + sponsor info (bottom) |
| `styles.css` | All visual styles, including palette CSS variables |
| `app.js` | Tweaks panel, fake audio player, konami, forms, pixel-art renderer |
| `wordmark.svg` | Original chunky-pixel wordmark (currently unused on hero — kept for favicons, OG images, etc.) |
