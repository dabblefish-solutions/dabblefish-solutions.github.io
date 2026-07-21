/* ============================================================================
 * 5 MINUTE AI NEWS — archive page render logic
 * Reads the single ARCHIVE_DATA blob (data.js) and populates the page.
 * ========================================================================= */
(function () {
  "use strict";

  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function parseISODateLocal(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDateBadge(iso) {
    const d = parseISODateLocal(iso);
    return DAY_NAMES[d.getDay()] + " · " + MONTH_ABBR[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function render() {
    const episodes = ARCHIVE_DATA.episodes; // already newest-first in data.js

    document.querySelectorAll("[data-archive-now]").forEach((n) => {
      n.textContent = episodes.length + " briefings archived";
    });

    const rangeEl = document.querySelector("[data-archive-range]");
    if (rangeEl && episodes.length) {
      const newest = parseISODateLocal(episodes[0].date);
      const oldest = parseISODateLocal(episodes[episodes.length - 1].date);
      rangeEl.innerHTML =
        "<strong>" + episodes.length + " briefings</strong>" +
        MONTH_ABBR[oldest.getMonth()] + " " + oldest.getDate() + " – " +
        MONTH_ABBR[newest.getMonth()] + " " + newest.getDate() + ", " + newest.getFullYear();
    }

    const list = document.querySelector("[data-archive-list]");
    if (!list) return;
    list.innerHTML = "";

    episodes.forEach((ep) => {
      const card = el("article", "ep-card");

      const head = el("div", "ep-card-head");
      head.innerHTML =
        '<span class="ep-card-date">№ ' + formatDateBadge(ep.date) + "</span>" +
        '<p class="ep-card-hero">' + escapeHtml(ep.hero) + "</p>";
      card.appendChild(head);

      const storyList = el("div", "ep-story-list");
      ep.stories
        .slice()
        .sort((a, b) => a.rank - b.rank)
        .forEach((s) => {
          const row = el("div", "ep-story");
          row.innerHTML =
            '<div class="n">' + s.rank + "</div>" +
            '<div class="tag">' + escapeHtml(s.category) + "</div>" +
            '<div class="body"><h4>' + escapeHtml(s.headline) + "</h4><p>" + escapeHtml(s.dek) + "</p></div>";
          storyList.appendChild(row);
        });
      card.appendChild(storyList);

      // "Listen" affordance — exactly two placeholder links per episode.
      // Real per-episode Spotify/Apple Podcasts URLs aren't known yet; do
      // not invent them. No <audio>, no play button, per the brief.
      const foot = el("div", "ep-card-foot");
      foot.innerHTML =
        '<span class="listen-label">Listen</span>' +
        '<a href="#">Spotify</a>' +
        '<a href="#">Apple Podcasts</a>';
      card.appendChild(foot);

      list.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
