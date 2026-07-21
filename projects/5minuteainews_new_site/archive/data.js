/* ============================================================================
 * 5 MINUTE AI NEWS — ARCHIVE DATA
 * ----------------------------------------------------------------------------
 * This is the ONE blob a future automation should overwrite daily. Everything
 * below the "ARCHIVE_DATA" const is generated/derived at render time by
 * archive.js — nothing else in this file needs to change day to day.
 *
 * Source: Tmp/console_snapshot.json → the "episodes" array (11 episodes,
 * 2026-07-07 through 2026-07-20), sorted newest first. Per story:
 * rank/category/headline/dek are carried over verbatim. `source_count` and
 * `audio_url` from the snapshot are intentionally dropped — this page shows
 * no source counts and has no in-page audio playback (see archive/index.html
 * for the two placeholder "Listen" links per episode instead).
 *
 * Four snapshot entries (2026-07-13, 2026-07-09, 2026-07-08, 2026-07-07) had
 * hero: null in console_snapshot.json — the console only started capturing
 * the hero line partway through the run. Those four `hero` values below were
 * backfilled from the pipeline's own listing_<date>-001.json output
 * (app_v2/output/<date>/listing_<date>-001.json), which is the same
 * authoritative source the homepage's data.js uses.
 * ========================================================================= */
const ARCHIVE_DATA = {
  episodes: [
    {
      date: "2026-07-20",
      hero: "Alibaba previews a 2.4 trillion parameter model, Moonshot pauses Kimi K3 subscriptions, Netflix acquires an AI filmmaking startup, Google releases AlphaEvolve, and Netflix deploys generative AI recommendations.",
      stories: [
        { rank: 1, category: "MODELS", headline: "Alibaba previews 2.4 trillion-parameter Qwen 3.8-Max model without benchmarks", dek: "Alibaba unveiled a multimodal Mixture-of-Experts model claiming top-tier performance. However, the lack of published benchmarks and transparency documentation makes verifying these claims difficult." },
        { rank: 2, category: "BUSINESS", headline: "Moonshot pauses Kimi K3 subscriptions after GPU capacity exhausts in 48 hours", dek: "Moonshot halted new subscriptions for its Kimi K3 model due to immediate compute bottlenecks. Meanwhile, new benchmarks show the model excels in frontend coding but struggles with advanced mathematics." },
        { rank: 3, category: "BUSINESS", headline: "Netflix acquires Ben Affleck's AI filmmaking startup InterPositive for $587 million", dek: "Netflix purchased the AI filmmaking startup in an all-cash deal. This consolidation signals major streaming platforms are aggressively integrating generative AI directly into their primary production workflows." },
        { rank: 4, category: "BIG TECH", headline: "Google DeepMind's AlphaEvolve reaches general availability for enterprise code optimization", dek: "Google transitioned its evolutionary code optimization research project into a generally available enterprise service. The system runs evaluators strictly on the client side, keeping proprietary codebases private." },
        { rank: 5, category: "BIG TECH", headline: "Netflix replaces traditional recommendation pipeline with generative AI system GenPage", dek: "Netflix deployed a generative AI system to dynamically build personalized user homepages. This architectural shift proves single-model generative AI can replace complex legacy machine learning pipelines at scale." }
      ]
    },
    {
      date: "2026-07-19",
      hero: "China launches a global AI organization, the US Navy adopts an AI-first strategy, the government pilots AI for insurance, open cyber gaps close, and Google introduces continuous memory agents.",
      stories: [
        { rank: 1, category: "POLICY", headline: "China launches global AI organization to rival Western frameworks", dek: "President Xi Jinping announced a new international AI group offering 5,000 training slots to Global South nations. The move aims to establish parallel governance structures independent of Western influence." },
        { rank: 2, category: "POLICY", headline: "US Navy adopts AI-first strategy for fleet operations", dek: "The Department of the Navy will deploy large language models directly on warships. The strategy prioritizes operational speed over perfect safety alignment in military deployments." },
        { rank: 3, category: "POLICY", headline: "US government pilots AI for healthcare prior authorizations", dek: "A new federal program uses artificial intelligence to process insurance coverage decisions. While the system could reduce administrative bottlenecks, it raises concerns regarding automated medical denials." },
        { rank: 4, category: "SECURITY", headline: "British Security Institute reports shrinking open-weight cyber gap", dek: "The capability gap between open-weight and closed frontier models in cybersecurity has narrowed to four to seven months. Current safety measures on these open models remain largely ineffective." },
        { rank: 5, category: "BIG TECH", headline: "Google Cloud introduces Always-On Memory Agent for Gemini", dek: "Google released a reference implementation that uses Gemini 3.1 Flash-Lite to write structured memory directly into SQLite. The architecture entirely replaces traditional retrieval-augmented generation and vector databases." }
      ]
    },
    {
      date: "2026-07-18",
      hero: "Moonshot AI matches Claude Opus 4.8, Apple sues OpenAI over trade secrets, San Francisco targets explicit AI apps, GPT-5.6 deletes user files, and Databricks reaches a $188 billion valuation.",
      stories: [
        { rank: 1, category: "MODELS", headline: "Moonshot AI's Kimi K3 matches Claude Opus 4.8", dek: "Chinese startup Moonshot AI released Kimi K3, matching Anthropic's Claude Opus 4.8 with a 300-person team. This challenges U.S. export controls and the necessity of compute moats." },
        { rank: 2, category: "BIG TECH", headline: "Apple files trade secrets lawsuit against OpenAI", dek: "Apple is suing OpenAI over trade secrets, citing that over 400 former employees now work there. This legal action could disrupt OpenAI's reported plans for an upcoming IPO." },
        { rank: 3, category: "POLICY", headline: "San Francisco orders Apple and Google to remove nudify apps", dek: "San Francisco's City Attorney demanded Apple and Google purge AI nudify applications from their stores. This targets the distribution layer to enforce state laws on non-consensual explicit content." },
        { rank: 4, category: "SECURITY", headline: "OpenAI's GPT-5.6 accidentally deletes user files in Full Access Mode", dek: "OpenAI's GPT-5.6 unintentionally wiped user home directories while in Full Access Mode. The incident emphasizes the safety risks of granting frontier models autonomous read and write access." },
        { rank: 5, category: "BUSINESS", headline: "Databricks reaches $188 billion valuation amid AI pivot", dek: "Databricks achieved a $188 billion valuation by positioning itself as a core artificial intelligence company. This highlights the market demand for integrating foundational models into enterprise data infrastructure." }
      ]
    },
    {
      date: "2026-07-17",
      hero: "Google rebrands NotebookLM to deepen AI search integration, the EU orders Android to open its ecosystem, xAI sues a user, Netflix details AI adoption, and Roblox launches text-to-game generation.",
      stories: [
        { rank: 1, category: "BIG TECH", headline: "Google rebrands NotebookLM to Gemini Notebook and updates AI search", dek: "Google is integrating its note-taking app into the Gemini ecosystem and updating Search to act as an agentic assistant. The update includes dedicated cloud computers for notebooks to execute code." },
        { rank: 2, category: "POLICY", headline: "EU mandates Google open Android AI ecosystem to competitors", dek: "The European Union ordered Google to give AI rivals deeper access to Android and share search data. Google is opposing the mandate, citing privacy and security vulnerabilities." },
        { rank: 3, category: "SECURITY", headline: "xAI sues user for generating illegal content with Grok", dek: "Elon Musk's xAI filed a lawsuit against a user for bypassing Grok's guardrails to generate and distribute illegal material. The case highlights escalating legal liabilities for generative models." },
        { rank: 4, category: "BUSINESS", headline: "Netflix discloses generative AI usage across 300 different productions", dek: "Netflix reported using generative AI in roughly 300 titles to cut costs and accelerate post-production workflows. The savings will be reinvested into the company's content budget." },
        { rank: 5, category: "BIG TECH", headline: "Roblox introduces mobile text-to-game AI generation feature", dek: "Roblox is rolling out a feature allowing mobile users to generate playable 3D games from text prompts. The update democratizes game creation but raises concerns about low-quality content." }
      ]
    },
    {
      date: "2026-07-16",
      hero: "Thinking Machines launches an open-weights model, xAI open-sources Grok-Build following a data breach, PrismML compresses a 27B model for mobile, and OpenAI debuts automated red-teaming alongside new developer hardware.",
      stories: [
        { rank: 1, category: "MODELS", headline: "Thinking Machines Launches Open-Weights Inkling Model", dek: "Mira Murati's new startup released a 975-billion-parameter foundation model under an Apache 2.0 license. The model is designed as a highly customizable base layer rather than competing on raw frontier benchmarks." },
        { rank: 2, category: "BIG TECH", headline: "xAI Open-Sources Grok Build After Data Breach", dek: "Elon Musk's xAI released its 844,530-line command-line tool after discovering it was silently uploading users' local directories to Google Cloud servers." },
        { rank: 3, category: "MODELS", headline: "PrismML Compresses 27-Billion-Parameter Model For Smartphones", dek: "Bonsai 27B shrinks the Qwen3.6-27B architecture to under four gigabytes while retaining 90 percent of its benchmark performance. Apple is reportedly testing the technology for its on-device AI capabilities." },
        { rank: 4, category: "SECURITY", headline: "OpenAI Deploys Automated GPT-Red System To Test Models", dek: "OpenAI's internal automated red-teaming system uses self-play to successfully expose vulnerabilities in 84 percent of test scenarios. The generated data is being used to harden the upcoming GPT-5.6 Sol model." },
        { rank: 5, category: "INFRASTRUCTURE", headline: "OpenAI Enters Hardware Market With $230 Codex Micro Keyboard", dek: "The specialized light-up keyboard helps developers monitor multiple autonomous agentic threads simultaneously. The launch coincides with an ongoing legal battle with Apple over alleged hardware trade secret theft." }
      ]
    },
    {
      date: "2026-07-15",
      hero: "Google overhauls Image Search with AI generation, ex-Meta employees sue over algorithmic layoffs, OpenAI develops a smart speaker, New York pauses data center construction, and DeepSeek seeks additional funding.",
      stories: [
        { rank: 1, category: "BIG TECH", headline: "Google adds AI image generation to search results", dek: "Google is transforming Image Search into a personalized discovery engine with its Nano Banana 2 Lite model. The system will automatically generate images if no matching picture exists on the web." },
        { rank: 2, category: "POLICY", headline: "Former Meta employees sue over alleged AI use in layoffs", dek: "Twenty-six former employees claim Meta used AI tools to determine dismissals during an 8,000-person layoff. The lawsuit alleges the system disproportionately targeted workers on medical or parental leave." },
        { rank: 3, category: "BIG TECH", headline: "OpenAI reportedly developing a screenless smart speaker for 2027", dek: "OpenAI is building a ChatGPT-powered device with moving mechanical parts and environmental sensors. The project marks the company's first entry into consumer hardware and ambient computing." },
        { rank: 4, category: "INFRASTRUCTURE", headline: "New York enacts one-year ban on new data center construction", dek: "Governor Kathy Hochul has halted approvals for large data centers to protect local electricity grids and water supplies. New York is the first US state to implement such a ban." },
        { rank: 5, category: "BUSINESS", headline: "DeepSeek seeks $1.5 billion ahead of planned 2027 IPO", dek: "The Chinese AI lab aims for a $71 billion valuation to fund its own data centers and chips. The raise underscores the high capital requirements of frontier AI development." }
      ]
    },
    {
      date: "2026-07-14",
      hero: "PixVerse secures $439 million for video generation, Google debuts a wearable health model, Turing winner Rich Sutton founds an AI agent startup, Mistral releases Robostral, and Germany launches Soofi.",
      stories: [
        { rank: 1, category: "BUSINESS", headline: "PixVerse secures $439 million to expand generative video AI", dek: "PixVerse has raised $439 million, pushing its valuation past $2 billion. The capital will fund the expansion of its world models and international customer base." },
        { rank: 2, category: "RESEARCH", headline: "Google unveils SensorFM foundation model for wearable health data", dek: "Google trained SensorFM on over a trillion minutes of wearable sensor data from five million users. The model transforms raw biometric signals into a general-purpose health intelligence layer." },
        { rank: 3, category: "BUSINESS", headline: "Turing winner Richard Sutton founds continuous learning startup Oak Lab", dek: "Turing Award winner Richard Sutton has launched Oak Lab to build AI agents. The startup focuses on continuous reinforcement learning directly from environments rather than static pre-trained models." },
        { rank: 4, category: "ROBOTICS", headline: "Mistral AI releases Robostral Navigate for vision-based robotics", dek: "Mistral's eight-billion parameter navigation model allows robots to follow instructions using a single RGB camera. This eliminates the need for expensive LiDAR or depth sensors." },
        { rank: 5, category: "MODELS", headline: "German research consortium launches Soofi S 30B open language model", dek: "A German consortium released a 31.6 billion parameter open language model trained on local cloud infrastructure. The bilingual model tops fully open competitors on German and English benchmarks." }
      ]
    },
    {
      date: "2026-07-13",
      // hero backfilled from app_v2/output/2026-07-13/listing_2026-07-13-001.json (see file header note)
      hero: "Apple sues OpenAI over alleged trade secret theft, Microsoft criticizes proprietary AI data practices, economists warn of economic shifts, Apple launches iOS 27, and Nous Research nears unicorn status.",
      stories: [
        { rank: 1, category: "BIG TECH", headline: "Apple Sues OpenAI Over Alleged Trade Secret Theft", dek: "Apple filed a lawsuit claiming OpenAI conspired with former employees to steal proprietary data. The suit alleges an ex-engineer exploited a rare bug for persistent network access after departing." },
        { rank: 2, category: "BIG TECH", headline: "Microsoft CEO Criticizes OpenAI Over Restrictive Data Practices", dek: "Satya Nadella publicly criticized OpenAI and Anthropic for prohibiting model distillation. He warned enterprise customers that these proprietary labs restrict how customers use their APIs." },
        { rank: 3, category: "POLICY", headline: "Economists and AI Leaders Issue Warning on Economic Impact", dek: "Over 200 experts, including 16 Nobel laureates, signed a statement urging preparation for rapid AI-driven economic shifts. The group suggests the transformation could exceed the Industrial Revolution in scale." },
        { rank: 4, category: "BIG TECH", headline: "Apple Launches iOS 27 Public Beta Featuring Siri AI", dek: "Apple released the first public betas for its fall operating system updates, including iOS 27. The flagship feature is Siri AI, a generative revamp of the company's virtual assistant." },
        { rank: 5, category: "BUSINESS", headline: "Nous Research Nears 75 Million Dollar Funding Round", dek: "The AI startup known for its open-weight Hermes models is in advanced talks to raise 75 million dollars. This new funding would value Nous Research at 1.5 billion dollars." }
      ]
    },
    {
      date: "2026-07-09",
      // hero backfilled from app_v2/output/2026-07-09/listing_2026-07-09-001.json (see file header note)
      hero: "OpenAI launches GPT-5.6 with enterprise agents, The New York Times seeks sanctions over deleted evidence, Google mandates AI ad disclosures, and Meta releases new image and coding models.",
      stories: [
        { rank: 1, category: "MODELS", headline: "OpenAI Releases GPT-5.6 and ChatGPT Work Agents Following Government Approval", dek: "OpenAI has publicly launched GPT-5.6 and long-running enterprise agents after passing a limited government preview. Microsoft is integrating the model into its 365 Copilot suite." },
        { rank: 2, category: "POLICY", headline: "News Publishers Seek Sanctions Over Alleged OpenAI Evidence Deletion", dek: "The New York Times and other publishers allege OpenAI intentionally deleted ChatGPT logs and internal datasets. The motion claims this hidden evidence could identify copyrighted journalism." },
        { rank: 3, category: "BIG TECH", headline: "Google Requires Disclosures for AI Altered Advertisements", dek: "Google is expanding its transparency policies to require labels on all ads containing synthetic or digitally altered content. The disclosure will appear across Search, Discover, and YouTube." },
        { rank: 4, category: "POLICY", headline: "Meta Faces Privacy Backlash Over Muse Image Scraping Features", dek: "Meta's new image generator allows users to create synthetic images using public Instagram photos without explicit consent. The opt-out mechanism is raising immediate compliance concerns in Europe." },
        { rank: 5, category: "MODELS", headline: "Meta Targets Enterprise Developers With Muse Spark Coding Model", dek: "Meta has introduced Muse Spark 1.1, an enterprise AI model optimized for complex software engineering and autonomous code migrations. The release directly challenges platforms like GitHub Copilot." }
      ]
    },
    {
      date: "2026-07-08",
      // hero backfilled from app_v2/output/2026-07-08/listing_2026-07-08-001.json (see file header note)
      hero: "OpenAI introduces full-duplex voice models for natural conversations, Meta prototypes always-on smart glasses, and xAI releases a cost-efficient Grok 4.5 to capture enterprise markets.",
      stories: [
        { rank: 1, category: "MODELS", headline: "OpenAI launches full-duplex GPT-Live voice models", dek: "OpenAI's new voice models can listen and speak simultaneously to enable natural conversations. The system delegates complex reasoning to a background model to maintain fast response times." },
        { rank: 2, category: "BIG TECH", headline: "Meta prototypes always-on AI smart glasses", dek: "Meta is developing smart glasses that continuously record audio and capture photos every few seconds. The technology provides constant real-world context but raises significant privacy and surveillance concerns." },
        { rank: 3, category: "MODELS", headline: "Meta releases agentic Muse Image generator", dek: "Meta's new image generation model utilizes web search and code execution to refine outputs. It faces regulatory scrutiny over an opt-out feature that generates images using public Instagram photos." },
        { rank: 4, category: "MODELS", headline: "xAI launches highly cost-efficient Grok 4.5", dek: "xAI has released Grok 4.5, an Opus-class model trained on Nvidia GB300 GPUs. The model aims to capture enterprise users by aggressively undercutting competitor pricing and token requirements." },
        { rank: 5, category: "BUSINESS", headline: "Legal AI startup Norm reaches unicorn status", dek: "Norm has raised $120 million in Series C funding to reach a $1.2 billion valuation. The investment reflects growing confidence in specialized AI to reliably handle complex legal functions." }
      ]
    },
    {
      date: "2026-07-07",
      // hero backfilled from app_v2/output/2026-07-07/listing_2026-07-07-001.json (see file header note)
      hero: "Anthropic expands Claude Cowork to mobile devices, Microsoft cuts 4,800 jobs, DeepSeek designs proprietary AI chips, Tencent releases an open-source model, and Microsoft phases out external Copilot models.",
      stories: [
        { rank: 1, category: "BIG TECH", headline: "Anthropic expands Claude Cowork AI agents to mobile and web", dek: "Anthropic is bringing its Claude Cowork platform to mobile devices and browsers. This enables agents to process tasks asynchronously in the background and request human input via push notifications." },
        { rank: 2, category: "BUSINESS", headline: "Microsoft lays off 4,800 employees across Xbox and commercial sales", dek: "Microsoft is cutting 2.1 percent of its global workforce, heavily impacting its gaming division. The restructuring is partly driven by the company's reallocation of resources toward artificial intelligence initiatives." },
        { rank: 3, category: "INFRASTRUCTURE", headline: "Chinese AI startup DeepSeek designs proprietary chips to bypass controls", dek: "DeepSeek is designing custom artificial intelligence chips to reduce reliance on external suppliers like Nvidia and Huawei. The move aims to secure the company's supply chain against US export restrictions." },
        { rank: 4, category: "MODELS", headline: "Tencent releases 295-billion parameter open-source language model", dek: "Tencent launched Hy3, a highly efficient Mixture-of-Experts model that activates 21 billion parameters per token. It is available under an Apache 2.0 license and reduces hallucination rates to 5.4 percent." },
        { rank: 5, category: "BIG TECH", headline: "Microsoft replaces external Copilot models with internal technology", dek: "Microsoft is phasing out OpenAI and Anthropic models in enterprise products like Excel and Outlook. The company is routing queries through its proprietary MAI models to cut third-party licensing costs." }
      ]
    }
  ]
};
