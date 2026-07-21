/* ============================================================================
 * 5 MINUTE AI NEWS — EPISODE DATA
 * ----------------------------------------------------------------------------
 * This is the ONE blob a future automation should overwrite daily. Everything
 * below the "PODCAST_DATA" const is generated/derived at render time by
 * app.js — nothing else in this file needs to change day to day.
 *
 * Source of truth for `today` and `recent[].headline`/`.dek`/`.stories` is the
 * pipeline's listing_*.json output (app_v2/output/<date>/listing_<date>-NNN.json).
 * `today` was populated from the newest listing on disk as of this build:
 *   app_v2/output/2026-07-20/listing_2026-07-20-001.json
 * `recent` (reverse-chronological, most recent first) comes from the three
 * listing files before it: 2026-07-19, 2026-07-18, 2026-07-17.
 *
 * Fields NOT present in listing_*.json (host, listeners_this_week,
 * episode_number, teaser, note_quote) are placeholders — see the inline
 * comment on each for what real value should replace it and where that
 * value should come from once the pipeline/site are wired together.
 *
 * NOTE: there is intentionally no in-page audio player or audio_url field.
 * The site links out to listening platforms (Apple/Spotify/YouTube/
 * Overcast/RSS) instead of embedding playback — see the '#' placeholder
 * hrefs in index.html.
 * ========================================================================= */
const PODCAST_DATA = {

  today: {
    date: "2026-07-20",                 // ISO date; day-of-week is derived in app.js
    runtime_estimate: "4:48",           // from listing.runtime_estimate

    // Placeholder — the pipeline DB (see app_v2/SPEC.md "record episode in
    // DB") is the real counter. This is a stand-in computed as "weekdays
    // since 2024-01-01" so numbers look plausible and increase correctly
    // across the sample dates. Replace with the DB's true episode id.
    episode_number: 666,

    host: "Chip & Dot",                 // the show's two hosts (see app_v2/prompts/script.txt)

    // Placeholder marketing stat — no analytics feed exists yet.
    // TODO: wire to real listener analytics when available.
    listeners_this_week: 128400,

    // hero: one-sentence, multi-story summary — verbatim from listing.hero
    hero: "Alibaba previews a 2.4 trillion parameter model, Moonshot pauses Kimi K3 subscriptions, Netflix acquires an AI filmmaking startup, Google releases AlphaEvolve, and Netflix deploys generative AI recommendations.",

    // teaser: short 3-clause synthesis for the player card's title, in the
    // style of the design mockup. Hand-written per episode for now; a future
    // "editor's note" field from the pipeline could supply this instead.
    teaser: "Alibaba's trillion-parameter surprise, Moonshot's capacity crunch, and Netflix's AI filmmaking buyout.",

    // note_quote: editorial pull-quote for the "From today's note" band.
    // Hand-written, grounded in story #2's dek below. Same caveat as teaser.
    note_quote: "The sharper part of Moonshot pausing Kimi K3 subscriptions isn't the capacity crunch — it's that the model straining those GPUs is stronger at <em>frontend code than it is at advanced math</em>.",

    // stories: verbatim rank/category/headline/dek/in_at from listing.stories
    stories: [
      {
        rank: 1,
        category: "MODELS",
        headline: "Alibaba previews 2.4 trillion-parameter Qwen 3.8-Max model without benchmarks",
        dek: "Alibaba unveiled a multimodal Mixture-of-Experts model claiming top-tier performance. However, the lack of published benchmarks and transparency documentation makes verifying these claims difficult.",
        in_at: "0:21"
      },
      {
        rank: 2,
        category: "BUSINESS",
        headline: "Moonshot pauses Kimi K3 subscriptions after GPU capacity exhausts in 48 hours",
        dek: "Moonshot halted new subscriptions for its Kimi K3 model due to immediate compute bottlenecks. Meanwhile, new benchmarks show the model excels in frontend coding but struggles with advanced mathematics.",
        in_at: "1:29"
      },
      {
        rank: 3,
        category: "BUSINESS",
        headline: "Netflix acquires Ben Affleck's AI filmmaking startup InterPositive for $587 million",
        dek: "Netflix purchased the AI filmmaking startup in an all-cash deal. This consolidation signals major streaming platforms are aggressively integrating generative AI directly into their primary production workflows.",
        in_at: "2:22"
      },
      {
        rank: 4,
        category: "BIG TECH",
        headline: "Google DeepMind's AlphaEvolve reaches general availability for enterprise code optimization",
        dek: "Google transitioned its evolutionary code optimization research project into a generally available enterprise service. The system runs evaluators strictly on the client side, keeping proprietary codebases private.",
        in_at: "3:11"
      },
      {
        rank: 5,
        category: "BIG TECH",
        headline: "Netflix replaces traditional recommendation pipeline with generative AI system GenPage",
        dek: "Netflix deployed a generative AI system to dynamically build personalized user homepages. This architectural shift proves single-model generative AI can replace complex legacy machine learning pipelines at scale.",
        in_at: "4:03"
      }
    ]
  },

  // Most recent first. Each entry uses the #1-ranked story from that day's
  // listing as the card's headline/dek (the mockup's recent-episode cards
  // show a single top story, not the multi-topic `hero` sentence).
  //
  // NOTE on episode_number below: the "weekdays since 2024-01-01" placeholder
  // formula only advances on Mon–Fri, so 2026-07-17 (Fri), 2026-07-18 (Sat),
  // and 2026-07-19 (Sun) all land on the same count (665) even though the
  // pipeline published an episode on each of those calendar days. This is a
  // known artifact of the placeholder, not a data error — see the note on
  // today.episode_number above; the real DB counter won't have this gap.
  recent: [
    {
      date: "2026-07-19",
      episode_number: 665,              // placeholder, see note on today.episode_number
      runtime_estimate: "4:44",
      headline: "China launches global AI organization to rival Western frameworks",
      dek: "President Xi Jinping announced a new international AI group offering 5,000 training slots to Global South nations. The move aims to establish parallel governance structures independent of Western influence."
    },
    {
      date: "2026-07-18",
      episode_number: 665,
      runtime_estimate: "4:43",
      headline: "Moonshot AI's Kimi K3 matches Claude Opus 4.8",
      dek: "Chinese startup Moonshot AI released Kimi K3, matching Anthropic's Claude Opus 4.8 with a 300-person team. This challenges U.S. export controls and the necessity of compute moats."
    },
    {
      date: "2026-07-17",
      episode_number: 665,
      runtime_estimate: "4:39",
      headline: "Google rebrands NotebookLM to Gemini Notebook and updates AI search",
      dek: "Google is integrating its note-taking app into the Gemini ecosystem and updating Search to act as an agentic assistant. The update includes dedicated cloud computers for notebooks to execute code."
    }
  ]
};
