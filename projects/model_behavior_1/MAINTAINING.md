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
- The `.ep-num` label ("04" → "05")
- The `.label` chip ("EP_04" → "EP_05")
- The pixel-art block at the bottom of `index.html` (`const ART_04 = ...`) — either replace with a new ascii grid for the new episode, or just rename the variable.
- Section meta line: `RELEASED MM.DD.YYYY · MM:SS RUNTIME`
- Also update the **hero CTA** at the top of the page (`▶ PLAY LATEST EP`) and the **SPOTIFY / APPLE chips** in `.listen-on` to point at the new episode (see "Per-episode platform URLs" below).

### 2. `index.html` — Ticker / Marquee
Find `<!-- MAINTAIN: marquee -->` and update the `<span>` items inside `.track`. These are short hype lines that should change when a new episode drops — current ones reference Claudius/tungsten, swap in references to the new episode.

### 3. `episodes.html` — Episode grid
Find `<!-- MAINTAIN: episode-grid -->`. The grid is **newest first**, top-left.

**When an upcoming episode releases** (e.g. EP 05 goes live):
- Find the `<article class="ep-card upcoming">` for that episode at the top of the grid.
- Remove the `upcoming` class from the `<article>`.
- Replace the `INCOMING` tag with a proper category chip (e.g. `<span class="tag tag-purple">CRYPTID FILES</span>`).
- Replace `DROPS FRI MMM DD, YYYY` in `.ep-meta` with the actual `MM:SS` runtime and `MMM DD, YYYY` release date (3 spans).
- Refine `.ep-desc` if needed.
- Replace the single `<span class="mini-btn upcoming-pill">` action with the standard three actions:
  ```html
  <a class="mini-btn primary" href="https://open.spotify.com/episode/<id>" target="_blank" rel="noopener">▶ SPOTIFY</a>
  <a class="mini-btn" href="https://podcasts.apple.com/us/podcast/<slug>/id1896064622?i=<trackId>" target="_blank" rel="noopener">APPLE</a>
  <button class="mini-btn">SHOW NOTES</button>
  ```
  See "Per-episode platform URLs" below for how to look up the IDs.

**Then add the next upcoming episode** at the top:
- Copy the now-released card, paste a duplicate above it, add the `upcoming` class back, reset the tag/meta/actions, and add a matching `ART_NN` pixel-art block + `renderPixelArt()` call at the bottom of this file.
- Bump the section meta: `N EPISODES · SEASON X`.

### 4. `episodes.html` — "Coming up next"
The upcoming episode lives **inside the grid** as the top-left `<article class="ep-card upcoming">`. See step 3 above for the upcoming → released conversion when it goes live, and how to add the next one.

### 5. RSS / podcast platforms (out of scope of this codebase)
Update Spotify, Apple, RSS feed independently.

---

## Per-episode platform URLs

Spotify and Apple Podcasts both use their own internal episode IDs that are **not** in our RSS feed. To grab them after a new episode goes live:

### Spotify
1. Open the show on Spotify: <https://open.spotify.com/show/4GivgXuwvjhk0L9VlSCZFH>
2. Right-click the new episode → "Copy link" → that gives you `https://open.spotify.com/episode/<id>?si=...` — strip the `?si=...` tracking param, what's left is the canonical URL.

Or scrape all of them with:
```sh
curl -sL "https://open.spotify.com/show/4GivgXuwvjhk0L9VlSCZFH" -A "Mozilla/5.0" \
  | grep -oE '/episode/[A-Za-z0-9]{22}' | sort -u
```

### Apple Podcasts
The iTunes Lookup API returns the latest episodes with `trackViewUrl` mapped:
```sh
curl -sL "https://itunes.apple.com/lookup?id=1896064622&entity=podcastEpisode&limit=20" \
  | python3 -c "import json,sys; [print(r['trackName'], '→', r['trackViewUrl']) for r in json.load(sys.stdin)['results'] if r.get('wrapperType')=='podcastEpisode']"
```
Strip the trailing `&uo=4` analytics param from each URL.

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
| `app.js` | Tweaks panel, konami easter egg, forms, pixel-art renderer |
| `wordmark.svg` | Original chunky-pixel wordmark (currently unused on hero — kept for favicons, OG images, etc.) |
