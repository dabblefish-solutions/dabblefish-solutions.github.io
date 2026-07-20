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
 *   app_v2/output/2026-07-13/listing_2026-07-13-001.json
 * `recent` (reverse-chronological, most recent first) comes from the three
 * listing files before it: 2026-07-09, 2026-07-08, 2026-07-07.
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
    date: "2026-07-13",                 // ISO date; day-of-week is derived in app.js
    runtime_estimate: "5:11",           // from listing.runtime_estimate

    // Placeholder — the pipeline DB (see app_v2/SPEC.md "record episode in
    // DB") is the real counter. This is a stand-in computed as "weekdays
    // since 2024-01-01" so numbers look plausible and increase correctly
    // across the sample dates. Replace with the DB's true episode id.
    episode_number: 661,

    host: "Chip & Dot",                 // the show's two hosts (see app_v2/prompts/script.txt)

    // Placeholder marketing stat — no analytics feed exists yet.
    // TODO: wire to real listener analytics when available.
    listeners_this_week: 128400,

    // hero: one-sentence, multi-story summary — verbatim from listing.hero
    hero: "Apple sues OpenAI over alleged trade secret theft, Microsoft criticizes proprietary AI data practices, economists warn of economic shifts, Apple launches iOS 27, and Nous Research nears unicorn status.",

    // teaser: short 3-clause synthesis for the player card's title, in the
    // style of the design mockup. Hand-written per episode for now; a future
    // "editor's note" field from the pipeline could supply this instead.
    teaser: "Apple vs. OpenAI, Nadella's warning shot, and the economists' alarm.",

    // note_quote: editorial pull-quote for the "From today's note" band.
    // Hand-written, grounded in story #2's dek below. Same caveat as teaser.
    note_quote: "The sharper part of Nadella's swipe at OpenAI and Anthropic isn't the complaint — it's that Microsoft needs enterprises to believe there's <em>a safer proprietary lab in the room</em>.",

    // stories: verbatim rank/category/headline/dek/in_at from listing.stories
    stories: [
      {
        rank: 1,
        category: "BIG TECH",
        headline: "Apple Sues OpenAI Over Alleged Trade Secret Theft",
        dek: "Apple filed a lawsuit claiming OpenAI conspired with former employees to steal proprietary data. The suit alleges an ex-engineer exploited a rare bug for persistent network access after departing.",
        in_at: "0:23"
      },
      {
        rank: 2,
        category: "BIG TECH",
        headline: "Microsoft CEO Criticizes OpenAI Over Restrictive Data Practices",
        dek: "Satya Nadella publicly criticized OpenAI and Anthropic for prohibiting model distillation. He warned enterprise customers that these proprietary labs restrict how customers use their APIs.",
        in_at: "1:27"
      },
      {
        rank: 3,
        category: "POLICY",
        headline: "Economists and AI Leaders Issue Warning on Economic Impact",
        dek: "Over 200 experts, including 16 Nobel laureates, signed a statement urging preparation for rapid AI-driven economic shifts. The group suggests the transformation could exceed the Industrial Revolution in scale.",
        in_at: "2:21"
      },
      {
        rank: 4,
        category: "BIG TECH",
        headline: "Apple Launches iOS 27 Public Beta Featuring Siri AI",
        dek: "Apple released the first public betas for its fall operating system updates, including iOS 27. The flagship feature is Siri AI, a generative revamp of the company's virtual assistant.",
        in_at: "3:13"
      },
      {
        rank: 5,
        category: "BUSINESS",
        headline: "Nous Research Nears 75 Million Dollar Funding Round",
        dek: "The AI startup known for its open-weight Hermes models is in advanced talks to raise 75 million dollars. This new funding would value Nous Research at 1.5 billion dollars.",
        in_at: "4:03"
      }
    ]
  },

  // Most recent first. Each entry uses the #1-ranked story from that day's
  // listing as the card's headline/dek (the mockup's recent-episode cards
  // show a single top story, not the multi-topic `hero` sentence).
  recent: [
    {
      date: "2026-07-09",
      episode_number: 659,              // placeholder, see note on today.episode_number
      runtime_estimate: "5:06",
      headline: "OpenAI Releases GPT-5.6 and ChatGPT Work Agents Following Government Approval",
      dek: "OpenAI has publicly launched GPT-5.6 and long-running enterprise agents after passing a limited government preview. Microsoft is integrating the model into its 365 Copilot suite."
    },
    {
      date: "2026-07-08",
      episode_number: 658,
      runtime_estimate: "5:13",
      headline: "OpenAI launches full-duplex GPT-Live voice models",
      dek: "OpenAI's new voice models can listen and speak simultaneously to enable natural conversations. The system delegates complex reasoning to a background model to maintain fast response times."
    },
    {
      date: "2026-07-07",
      episode_number: 657,
      runtime_estimate: "4:48",
      headline: "Anthropic expands Claude Cowork AI agents to mobile and web",
      dek: "Anthropic is bringing its Claude Cowork platform to mobile devices and browsers. This enables agents to process tasks asynchronously in the background and request human input via push notifications."
    }
  ]
};
