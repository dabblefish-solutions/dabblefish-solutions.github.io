/* === MODEL BEHAVIOR — shared interactions === */

// ---------- TWEAKS (persist via localStorage) ----------
const DEFAULTS = {
  palette: "crt",      // "crt" | "neon" | "gameboy" | "paper"
  scanlines: "on",     // "on" | "off"
  scale: "chunky",     // "chunky" | "fine"
};

function readTweaks() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("mb_tweaks") || "{}") };
  } catch (e) { return { ...DEFAULTS }; }
}
function writeTweaks(t) { localStorage.setItem("mb_tweaks", JSON.stringify(t)); }

function applyTweaks(t) {
  const body = document.body;
  if (t.palette === "crt") body.removeAttribute("data-palette");
  else body.setAttribute("data-palette", t.palette);
  body.setAttribute("data-scanlines", t.scanlines);
  body.setAttribute("data-scale", t.scale);
  document.documentElement.style.setProperty("--px", t.scale === "chunky" ? "4px" : "2px");
}

function renderTweaksPanel() {
  const t = readTweaks();
  const panel = document.getElementById("tweaks-panel");
  if (!panel) return;

  const set = (key, val) => {
    const cur = readTweaks();
    cur[key] = val;
    writeTweaks(cur);
    applyTweaks(cur);
    renderTweaksPanel();
  };

  panel.innerHTML = `
    <h4>
      <span>▶ TWEAKS.EXE</span>
      <button class="close" id="tweaks-close" aria-label="Close">X</button>
    </h4>
    <div class="tweak-row">
      <label>PALETTE</label>
      <div class="swatches">
        ${[
          ["crt",     ["#14e1e1","#eb28d2","#ffffff","#070a0d"]],
          ["neon",    ["#ff2d6f","#ffd93d","#3dffb8","#5d8eff"]],
          ["gameboy", ["#0f380f","#306230","#8bac0f","#9bbc0f"]],
          ["paper",   ["#f4ecd8","#1a1a1a","#d9381e","#1a1a1a"]],
        ].map(([id, colors]) => `
          <button class="swatch ${t.palette===id?'active':''}" data-pal="${id}" title="${id}">
            ${colors.map(c => `<span style="background:${c}"></span>`).join('')}
          </button>
        `).join('')}
      </div>
    </div>
    <div class="tweak-row">
      <label>SCANLINES</label>
      <div class="opts">
        <button class="opt ${t.scanlines==='on'?'active':''}" data-sl="on">ON</button>
        <button class="opt ${t.scanlines==='off'?'active':''}" data-sl="off">OFF</button>
      </div>
    </div>
    <div class="tweak-row">
      <label>PIXEL SCALE</label>
      <div class="opts">
        <button class="opt ${t.scale==='chunky'?'active':''}" data-sc="chunky">CHUNKY</button>
        <button class="opt ${t.scale==='fine'?'active':''}" data-sc="fine">FINE</button>
      </div>
    </div>
  `;

  panel.querySelectorAll("[data-pal]").forEach(b => b.onclick = () => set("palette", b.dataset.pal));
  panel.querySelectorAll("[data-sl]").forEach(b => b.onclick = () => set("scanlines", b.dataset.sl));
  panel.querySelectorAll("[data-sc]").forEach(b => b.onclick = () => set("scale", b.dataset.sc));
  document.getElementById("tweaks-close").onclick = () => {
    panel.classList.remove("open");
    document.getElementById("tweaks-toggle").style.display = "";
    if (window.parent !== window) {
      window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
    }
  };
}

// ---------- WORDMARK glitch ----------
function buildWordmark(el, text) {
  el.innerHTML = "";
  text.split(" ").forEach((word, wi, words) => {
    const row = document.createElement("span");
    row.className = "row";
    word.split("").forEach(ch => {
      const letter = document.createElement("span");
      letter.className = "letter";
      letter.setAttribute("data-c", ch);
      letter.textContent = ch;
      row.appendChild(letter);
    });
    el.appendChild(row);
    if (wi < words.length - 1) {
      const sp = document.createElement("span");
      sp.innerHTML = "&nbsp;";
      el.appendChild(sp);
    }
  });

  // Random glitch loop
  const letters = el.querySelectorAll(".letter");
  setInterval(() => {
    letters.forEach(l => l.classList.remove("glitch"));
    const n = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * letters.length);
      letters[idx].classList.add("glitch");
    }
    setTimeout(() => letters.forEach(l => l.classList.remove("glitch")), 180);
  }, 1400);
}

// ---------- AUDIO PLAYER ----------
// If the .player div has data-audio="<url>", drive the UI from a real <audio>
// element. Otherwise fall back to a fake counter so the UI still animates.
function initPlayer() {
  const player = document.querySelector(".player");
  if (!player) return;
  const playBtn = player.querySelector(".play-btn");
  const fill = player.querySelector(".bar-fill");
  const bar = player.querySelector(".bar");
  const curEl = player.querySelector(".cur");
  const totalEl = player.querySelector(".total");
  const fallbackTotal = parseInt(player.dataset.duration || "2742", 10);
  const audioSrc = player.dataset.audio;

  const fmt = s => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  if (audioSrc) {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioSrc;

    totalEl.textContent = fmt(fallbackTotal);
    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration)) totalEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      const total = isFinite(audio.duration) ? audio.duration : fallbackTotal;
      if (total) fill.style.width = `${(audio.currentTime / total) * 100}%`;
      curEl.textContent = fmt(audio.currentTime);
    });
    audio.addEventListener("ended", () => { playBtn.textContent = "▶"; });
    audio.addEventListener("error", () => {
      showToast("AUDIO LOAD FAILED", 2200);
    });

    playBtn.onclick = () => {
      if (audio.paused) { audio.play(); playBtn.textContent = "❚❚"; }
      else { audio.pause(); playBtn.textContent = "▶"; }
    };
    bar.onclick = (e) => {
      const rect = bar.getBoundingClientRect();
      const total = isFinite(audio.duration) ? audio.duration : fallbackTotal;
      if (total) audio.currentTime = ((e.clientX - rect.left) / rect.width) * total;
    };
    return;
  }

  // Fake fallback (used when no MP3 is wired up)
  let cur = 0, playing = false, interval = null;
  const render = () => {
    fill.style.width = `${(cur / fallbackTotal) * 100}%`;
    curEl.textContent = fmt(cur);
  };
  totalEl.textContent = fmt(fallbackTotal);
  const toggle = () => {
    playing = !playing;
    playBtn.textContent = playing ? "❚❚" : "▶";
    if (playing) {
      interval = setInterval(() => {
        cur += 1;
        if (cur >= fallbackTotal) { cur = 0; toggle(); }
        render();
      }, 1000);
    } else {
      clearInterval(interval);
    }
  };
  playBtn.onclick = toggle;
  bar.onclick = (e) => {
    const rect = bar.getBoundingClientRect();
    cur = Math.floor(((e.clientX - rect.left) / rect.width) * fallbackTotal);
    render();
  };
  render();
}

// ---------- EPISODE CARD PLAYERS ----------
// Each .ep-card PLAY button can carry data-audio="<mp3 url>". On click, the
// actions row is hidden and a native <audio controls> element is inserted
// inline below it so playback happens in-page.
function initEpisodePlayers() {
  document.querySelectorAll(".ep-card .mini-btn.primary[data-audio]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = btn.dataset.audio;
      const actions = btn.closest(".ep-actions");
      if (!actions || actions.dataset.expanded === "1") return;
      actions.dataset.expanded = "1";

      const audio = document.createElement("audio");
      audio.controls = true;
      audio.autoplay = true;
      audio.preload = "metadata";
      audio.src = url;
      audio.className = "ep-audio";
      actions.style.display = "none";
      actions.parentNode.insertBefore(audio, actions.nextSibling);
      audio.addEventListener("error", () => showToast("AUDIO LOAD FAILED", 2200));
    });
  });
}

// ---------- TOAST ----------
function showToast(text, ms = 2400) {
  let toast = document.getElementById("mb-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "mb-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), ms);
}

// ---------- KONAMI ----------
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
function initKonami() {
  let buf = [];
  window.addEventListener("keydown", e => {
    buf.push(e.key);
    if (buf.length > KONAMI.length) buf.shift();
    if (buf.join(",").toLowerCase() === KONAMI.join(",").toLowerCase()) {
      showToast("CHEAT UNLOCKED: ALL MODELS MISBEHAVING", 3200);
      // wild glitch storm
      document.querySelectorAll(".wordmark .letter").forEach(l => {
        l.classList.add("glitch");
        setTimeout(() => l.classList.remove("glitch"), 2400);
      });
      buf = [];
    }
  });
}

// ---------- NEWSLETTER ----------
function initNewsletter() {
  const form = document.querySelector(".newsletter form");
  if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    if (!email || !email.includes("@")) {
      showToast("ERROR: INVALID INPUT", 1800);
      return;
    }
    form.innerHTML = `<p style="font-family:'Press Start 2P',monospace;font-size:11px;color:var(--mint);letter-spacing:1.5px;margin:0;">▶ TRANSMISSION RECEIVED. SEE YOU IN YOUR INBOX.</p>`;
  };
}

// ---------- CONTACT FORMS ----------
function initSponsorForm() {
  const sponsor = document.getElementById("sponsor-form");
  if (sponsor) {
    sponsor.onsubmit = e => {
      e.preventDefault();
      const company = sponsor.querySelector('[name="company"]').value;
      if (!company) { showToast("ERROR: COMPANY REQUIRED", 1800); return; }
      sponsor.innerHTML = `
        <h3 style="font-family:'Press Start 2P',monospace;font-size:16px;color:var(--mint);margin-bottom:14px;">▶ MESSAGE QUEUED</h3>
        <p style="font-size:20px;">Thanks, ${company}. We'll reply within 48hrs — usually with a weird AI story attached. Stay tuned to your inbox.</p>
      `;
    };
  }

  const general = document.getElementById("general-form");
  if (general) {
    general.onsubmit = e => {
      e.preventDefault();
      const name = general.querySelector('[name="name"]').value;
      if (!name) { showToast("ERROR: NAME REQUIRED", 1800); return; }
      general.innerHTML = `
        <h3 style="font-family:'Press Start 2P',monospace;font-size:16px;color:var(--mint);margin-bottom:14px;">▶ TRANSMISSION RECEIVED</h3>
        <p style="font-size:20px;">Thanks, ${name}. We read every message. We don't always reply, but we usually do — especially if you brought receipts.</p>
      `;
    };
  }
}

// ---------- PIXEL ART RENDERER ----------
// Renders ascii-pixel-art into a div. Each row is a string of single-char color codes.
function renderPixelArt(container, art, palette, cellSize = 16) {
  const rows = art.split("\n").filter(r => r.length);
  const cols = Math.max(...rows.map(r => r.length));
  const cv = document.createElement("canvas");
  cv.width = cols;
  cv.height = rows.length;
  const ctx = cv.getContext("2d");
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (palette[c]) {
        ctx.fillStyle = palette[c];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });
  cv.style.width = "100%";
  cv.style.height = "100%";
  cv.style.imageRendering = "pixelated";
  container.appendChild(cv);
}

// ---------- TWEAKS host integration ----------
function initEditModeBridge() {
  window.addEventListener("message", (ev) => {
    const d = ev.data;
    if (!d || !d.type) return;
    if (d.type === "__activate_edit_mode") {
      document.getElementById("tweaks-panel").classList.add("open");
      document.getElementById("tweaks-toggle").style.display = "none";
    }
    if (d.type === "__deactivate_edit_mode") {
      document.getElementById("tweaks-panel").classList.remove("open");
      document.getElementById("tweaks-toggle").style.display = "";
    }
  });
  if (window.parent !== window) {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  }
}

// ---------- INIT ----------
window.addEventListener("DOMContentLoaded", () => {
  applyTweaks(readTweaks());
  renderTweaksPanel();
  initEditModeBridge();

  document.getElementById("tweaks-toggle")?.addEventListener("click", () => {
    document.getElementById("tweaks-panel").classList.add("open");
    document.getElementById("tweaks-toggle").style.display = "none";
  });

  document.querySelectorAll("[data-wordmark]").forEach(el => {
    buildWordmark(el, el.getAttribute("data-wordmark"));
  });

  initPlayer();
  initEpisodePlayers();
  initKonami();
  initNewsletter();
  initSponsorForm();
});
