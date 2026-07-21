/* ============================================================================
 * 5 MINUTE AI NEWS — render logic
 * Reads the single PODCAST_DATA blob (data.js) and populates the page.
 * Nothing here should need to change when the daily data blob is swapped out.
 * ========================================================================= */
(function () {
  "use strict";

  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function parseISODateLocal(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function fmtListeners(n) {
    return n.toLocaleString("en-US");
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
    const today = PODCAST_DATA.today;
    const recent = PODCAST_DATA.recent;
    const date = parseISODateLocal(today.date);
    const dayFull = DAY_NAMES[date.getDay()];
    const dayAbbr = DAY_ABBR[date.getDay()];
    const monthAbbr = MONTH_ABBR[date.getMonth()];
    const dayNum = date.getDate();
    const yy = String(date.getFullYear()).slice(-2);

    // ——— Top bar "now" indicator ———
    document.querySelectorAll("[data-ep-now]").forEach((n) => {
      n.textContent = "Today · live now";
    });

    // ——— Marquee ticker ———
    const tickerItems = today.stories
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((s) => "<span>" + escapeHtml(s.headline) + "</span> <span class=\"arr\">→</span>");
    const tickerHtml =
      "<span class=\"pill\">№ " + today.date + "</span> " +
      tickerItems.join(" ") +
      " <span class=\"pill\">listen now · " + today.runtime_estimate + "</span>";
    document.querySelectorAll("[data-marquee-track]").forEach((track) => {
      // Duplicate the content once so the -50% translateX loop is seamless.
      track.innerHTML = "<span>" + tickerHtml + "</span><span>" + tickerHtml + "</span>";
    });

    // ——— Hero ———
    const eyebrow = document.querySelector("[data-hero-eyebrow]");
    if (eyebrow) {
      eyebrow.textContent =
        dayFull + " · " + monthAbbr + " " + dayNum + " · Daily briefing · " + today.runtime_estimate;
    }
    const deck = document.querySelector("[data-hero-deck]");
    if (deck) deck.textContent = today.hero;
    const metaHost = document.querySelector("[data-meta-host]");
    if (metaHost) metaHost.textContent = today.host;
    const metaRuntime = document.querySelector("[data-meta-runtime]");
    if (metaRuntime) metaRuntime.textContent = today.runtime_estimate.replace(":", " min ") + " sec";
    const metaListeners = document.querySelector("[data-meta-listeners]");
    if (metaListeners) metaListeners.textContent = fmtListeners(today.listeners_this_week);

    // ——— Player card ———
    const badge = document.querySelector("[data-player-badge]");
    if (badge) badge.textContent = monthAbbr + " " + dayNum;
    const title = document.querySelector("[data-player-title]");
    if (title) title.textContent = today.teaser;
    const totalTimeEls = document.querySelectorAll("[data-player-total]");
    totalTimeEls.forEach((n) => (n.textContent = today.runtime_estimate));

    // ——— Today's five (story list) ———
    const list = document.querySelector("[data-story-list]");
    if (list) {
      list.innerHTML = "";
      today.stories
        .slice()
        .sort((a, b) => a.rank - b.rank)
        .forEach((s) => {
          const article = el("article", "story");
          article.innerHTML =
            '<div class="n">' + s.rank + "</div>" +
            '<div class="body">' +
            '<div class="tag">' + escapeHtml(s.category) + "</div>" +
            '<h3 class="h">' + escapeHtml(s.headline) + "</h3>" +
            '<p class="d">' + escapeHtml(s.dek) + "</p>" +
            "</div>" +
            '<div class="ts">In at<strong>' + escapeHtml(s.in_at) + "</strong></div>";
          list.appendChild(article);
        });
    }
    const rundownRight = document.querySelector("[data-rundown-meta]");
    if (rundownRight) {
      rundownRight.innerHTML =
        "<strong>" + today.stories.length + " stories · 5 minutes</strong>" +
        dayAbbr + ", " + monthAbbr + " " + dayNum + " " + yy;
    }

    // ——— Pull-quote slab ———
    const quote = document.querySelector("[data-note-quote]");
    if (quote) quote.innerHTML = today.note_quote; // trusted, hand-authored content (see data.js)
    const cite = document.querySelector("[data-note-cite]");
    if (cite) cite.textContent = "— " + today.host + ", hosts";

    // ——— Recent briefings ———
    const allLink = document.querySelector("[data-all-episodes]");
    if (allLink) allLink.textContent = "All episodes →";
    const episodes = document.querySelector("[data-episodes]");
    if (episodes) {
      episodes.innerHTML = "";
      recent.forEach((r) => {
        const d = parseISODateLocal(r.date);
        const abbr = DAY_ABBR[d.getDay()];
        const mon = MONTH_ABBR[d.getMonth()];
        const tile = el("article", "ep-tile");
        tile.innerHTML =
          "<div>" +
          '<span class="ep-tile-pill">№ ' + r.date + " · " + abbr + "</span>" +
          "<h3>" + escapeHtml(r.headline) + "</h3>" +
          '<p class="ep-tile-d">' + escapeHtml(r.dek) + "</p>" +
          "</div>" +
          '<div class="bot">' +
          '<div class="ep-tile-meta">' + mon + " " + d.getDate() + " · " + r.runtime_estimate + "</div>" +
          "</div>";
        episodes.appendChild(tile);
      });
    }
  }

  /* ——— Subscribe form: no backend wired yet — just acknowledge input. ——— */
  function initSubscribeForm() {
    const form = document.querySelector("[data-subscribe-form]");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks — subscriber signup isn't wired to a backend yet.");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    initSubscribeForm();
  });
})();
