/**
 * Approved MarineCloudX brand content.
 *
 * This replaces the Step 12 placeholder module. Everything here is copy the
 * business has supplied and approved — it is no longer marked as provisional.
 *
 * What is deliberately NOT here, because it has not been provided and must
 * never be invented: founder names, office locations, employee counts, years in
 * business, client counts, revenue, awards, certifications, uptime figures or
 * any performance metric.
 *
 * Content that has a CMS model — services, industries, FAQs, projects, case
 * studies, testimonials — is NOT duplicated here. It lives in the database and
 * is read through src/server/public/content.ts, so the team can edit it without
 * a developer. Only the narrative sections with no CMS model live in this file.
 */

export const brand = {
  philosophy: "Problem first. Technology second.",
  positioning: "Think Different. Build Better.",
  /** Used on the industries band. */
  industriesLine: "Technology that understands your industry.",
} as const;

export const hero = {
  eyebrow: "Problem first. Technology second.",
  heading: "Complex problems. Intelligent systems.",
  headingLines: ["Complex problems.", "Intelligent systems."],
  supporting:
    "We design and build intelligent software, cloud platforms and connected systems around real business problems.",
} as const;

/**
 * The three supporting points under the hero copy. `icon` maps to a small inline
 * SVG in the hero component — not an icon font or image.
 */
export const heroFeatures = [
  {
    icon: "compass",
    title: "Problem-first",
    description: "We define the real problem before choosing any technology.",
  },
  {
    icon: "code",
    title: "Practical engineering",
    description: "Systems your team can actually run — not a demo that impresses once.",
  },
  {
    icon: "shield",
    title: "Owned outcomes",
    description: "We stay responsible for what we ship, through launch and after.",
  },
] as const;

/**
 * Hero stats bar.
 *
 * Deliberately NOT client counts, years in business, revenue or performance
 * metrics — none of those have been provided and must never be invented (see the
 * note at the top of this file). Every figure here describes the offering and is
 * verifiable elsewhere on the site.
 */
export const stats = [
  { value: "6", label: "Stage delivery process" },
  { value: "8", label: "Capability areas" },
  { value: "8", label: "Industries served" },
  { value: "12", label: "Managed content types" },
] as const;

export const about = {
  lead: "MarineCloudX was started to help small businesses bring their work into the digital world.",
  body: [
    "Many small businesses still depend on manual processes while technology becomes more important to how they operate and compete. That gap is the reason MarineCloudX exists — to make useful technology practical and accessible for the businesses that need it most.",
    "We work with startups, small and local businesses, growing companies, established businesses and individuals. The work spans websites, applications, business systems, AI, automation and cloud — but it always begins with understanding the problem.",
  ],
  vision:
    "The long-term vision is to grow into a technology company that combines service and product work, creates opportunities for the people who build here, and is known for the experience it gives its customers.",
} as const;

/** Why MarineCloudX — the six-step reasoning behind "we understand why you need it". */
export const whyPoints = [
  {
    title: "Understand the problem",
    description: "We start with what is actually going wrong, not with a product to sell you.",
  },
  {
    title: "Analyse the current process",
    description: "How the work happens today, who does it, and where the time goes.",
  },
  {
    title: "Identify what can be simplified",
    description: "Some steps should be automated. Some should be removed entirely.",
  },
  {
    title: "Select appropriate technology",
    description: "The stack follows the problem. Nothing is chosen because it is fashionable.",
  },
  {
    title: "Build practical solutions",
    description: "Systems your team can actually use, not a demo that impresses once.",
  },
  {
    title: "Improve over time",
    description: "What ships is a starting point. It gets better with real use.",
  },
] as const;

export const coreValues = [
  {
    title: "Think Different",
    description: "The obvious solution is not always the right one. We question the brief before we build against it.",
  },
  {
    title: "Customer First",
    description: "Your outcome matters more than our preferred tools. We recommend what serves the problem.",
  },
  {
    title: "Build With Purpose",
    description: "Every feature earns its place. Anything that does not help someone do their work comes out.",
  },
  {
    title: "Make Technology Accessible",
    description: "You should not need to speak our language. We explain what we are building and why.",
  },
  {
    title: "Own the Outcome",
    description: "We are responsible for what we ship — through launch, and after it.",
  },
  {
    title: "Grow Together",
    description: "Good work compounds. We build relationships that outlast a single project.",
  },
] as const;

/**
 * Solutions are business problems, distinct from services (what we build).
 * The technology lists describe what a solution may involve, not a fixed offer.
 */
export const solutions = [
  {
    title: "Lead Management",
    problem: "Enquiries arrive from everywhere and get lost between them.",
    flow: ["Capture", "Qualify", "Assign", "Follow up", "Convert"],
    technologies: ["Website", "CRM", "AI", "WhatsApp", "Automation"],
  },
  {
    title: "Business Digitization",
    problem: "The work runs on paper, spreadsheets and memory.",
    flow: ["Manual process", "Digital workflow", "Dashboard", "Automation"],
    technologies: ["Web application", "Custom software", "Integrations"],
  },
  {
    title: "Customer Support",
    problem: "The same questions arrive again and again, and answers are inconsistent.",
    flow: ["Question", "AI / knowledge", "Response", "Human escalation"],
    technologies: ["AI assistant", "Knowledge base", "WhatsApp", "CRM"],
  },
  {
    title: "Business Operations",
    problem: "The data exists, but nobody can see what it means.",
    flow: ["Data", "Systems", "Dashboards", "Decisions"],
    technologies: ["Dashboards", "APIs", "Cloud", "Reporting"],
  },
] as const;

export const process = [
  { title: "Discover", description: "Understand the business, its users, the problem and the goal." },
  { title: "Define", description: "Identify the actual problem and decide what should be built." },
  { title: "Design", description: "Shape the experience, the architecture and the solution." },
  { title: "Build", description: "Develop, integrate and test." },
  { title: "Deploy", description: "Bring the system into production." },
  { title: "Improve", description: "Maintain, optimise and evolve it." },
] as const;

/**
 * Trust built on how we operate — not on social proof we do not have.
 * There are no client logos, awards, certifications or statistics here by design.
 */
export const trustPillars = [
  {
    title: "Clear communication",
    description: "You should understand what is being built and why, at every stage.",
  },
  {
    title: "Practical engineering",
    description: "Technology is selected for the problem, not for the pitch.",
  },
  {
    title: "Transparent process",
    description: "The project has understandable stages, and you know where it stands.",
  },
  {
    title: "Long-term support",
    description: "The relationship can continue after launch — maintenance, improvement, and what comes next.",
  },
] as const;

/**
 * Technology groups shown on the homepage — chosen for the problem, not the résumé.
 * Static narrative; not a CMS model.
 */
export const techGroups = [
  { key: "AI", items: ["OpenAI", "Anthropic", "LangChain", "Vector DBs"] },
  { key: "Cloud", items: ["AWS", "Docker", "Kubernetes", "Terraform"] },
  { key: "Backend", items: ["Node.js", "Python", "Go", "PostgreSQL"] },
  { key: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { key: "Mobile", items: ["React Native", "Flutter", "Swift"] },
  { key: "Data", items: ["Kafka", "Redis", "TimescaleDB"] },
  { key: "IoT", items: ["MQTT", "Edge runtimes", "Modbus"] },
  { key: "Security", items: ["OAuth 2.0", "Zero-trust", "Audit logging"] },
] as const;

/**
 * Interactive system diagram nodes on the homepage.
 */
export const systemNodes = [
  {
    name: "AI",
    title: "Models that make decisions",
    items: ["Models", "Agents", "Voice", "RAG", "Automation"],
  },
  {
    name: "Cloud",
    title: "Infrastructure that scales quietly",
    items: ["AWS", "APIs", "Infrastructure", "Scaling"],
  },
  {
    name: "Data",
    title: "One source of truth",
    items: ["Pipelines", "Warehousing", "Vector search", "Analytics"],
  },
  {
    name: "Devices",
    title: "The physical edge",
    items: ["Devices", "Telemetry", "Edge compute", "Real-time data"],
  },
  {
    name: "Apps",
    title: "Where people meet the system",
    items: ["Web", "Mobile", "ERP", "CRM"],
  },
  {
    name: "Automation",
    title: "Work that runs itself",
    items: ["Workflows", "Integrations", "Event triggers", "Reporting"],
  },
] as const;

/**
 * Static homepage content from the Glass UI design reference.
 * Homepage does not fetch CMS/DB data — it renders this content only.
 */
export const homeCapabilities = [
  {
    name: "AI & Intelligent Systems",
    slug: "ai-intelligent-systems",
    shortDescription: "Systems that reason over your data and act on it.",
    technologies: ["AI Agents", "Voice AI", "RAG", "LLM Integration", "Automation"],
  },
  {
    name: "Cloud & Software Platforms",
    slug: "cloud-software-platforms",
    shortDescription: "Infrastructure that holds up under real load.",
    technologies: ["AWS", "APIs", "SaaS", "Backend", "DevOps"],
  },
  {
    name: "Connected & IoT Systems",
    slug: "connected-iot-systems",
    shortDescription: "Hardware, telemetry and the cloud in one loop.",
    technologies: ["IoT", "Real-time Systems", "Telemetry", "Monitoring", "Edge"],
  },
  {
    name: "Digital Products",
    slug: "digital-products",
    shortDescription: "Interfaces people actually want to use.",
    technologies: ["Web", "Mobile", "ERP", "CRM"],
  },
] as const;

export const homeProjects = [
  {
    name: "AI Meeting Copilot",
    line: "Real-time voice-based AI assistant with intelligent model responses.",
    tags: ["AI", "Voice", "Real-time", "Cloud"],
    slot: "Placeholder — product screenshot",
    beats: [
      {
        k: "Capability",
        v: "Live voice capture, transcription and intelligent response in one loop.",
      },
      {
        k: "Stack",
        v: "Streaming audio, multi-model reasoning, cloud backend.",
      },
    ],
  },
  {
    name: "Multi-Model AI Platform",
    line: "Switch between AI providers and models through a unified interface.",
    tags: ["AI", "Platform", "APIs"],
    slot: "Placeholder — platform screenshot",
    beats: [
      {
        k: "Capability",
        v: "One interface across providers, with model selection per task.",
      },
      {
        k: "Stack",
        v: "Provider abstraction layer, unified API, streaming responses.",
      },
    ],
  },
  {
    name: "Highway Speed Monitoring",
    line: "IoT-based vehicle monitoring and speed detection system.",
    tags: ["IoT", "Telemetry", "Edge", "Real-time"],
    slot: "Placeholder — monitoring dashboard",
    beats: [
      {
        k: "Capability",
        v: "Roadside devices detecting and reporting vehicle speed continuously.",
      },
      {
        k: "Stack",
        v: "Edge sensing, telemetry pipeline, real-time monitoring.",
      },
    ],
  },
  {
    name: "Cloud Backend Platform",
    line: "Scalable APIs, cloud deployment, monitoring, and production infrastructure.",
    tags: ["Cloud", "DevOps", "APIs", "AWS"],
    slot: "Placeholder — architecture diagram",
    beats: [
      {
        k: "Capability",
        v: "Production infrastructure with deployment and monitoring built in.",
      },
      {
        k: "Stack",
        v: "Scalable APIs, cloud deployment pipelines, observability.",
      },
    ],
  },
] as const;

export const homeProcess = [
  { title: "Understand", description: "The problem, the constraints and who lives with the result." },
  { title: "Architect", description: "Decide the shape of the system before writing it." },
  { title: "Build", description: "Small, reviewed increments with tests that mean something." },
  { title: "Deploy", description: "Automated, observable, reversible." },
  { title: "Improve", description: "Measure in production and act on what it tells you." },
] as const;

/** Static FAQs for the homepage — no CMS dependency. */
export const homeFaqs = [
  {
    id: "faq-1",
    question: "Do I need to know the technology before we start?",
    answer:
      "No. Tell us the problem you are trying to solve. We will recommend the technology that fits — and explain why in plain language.",
  },
  {
    id: "faq-2",
    question: "How does a project usually start?",
    answer:
      "We begin by understanding the current process, the people involved, and what success looks like. Only then do we shape the solution.",
  },
  {
    id: "faq-3",
    question: "Can you work with systems we already have?",
    answer:
      "Yes. Most work builds on what you already run — websites, CRMs, spreadsheets, or internal tools. We integrate and improve rather than replace everything by default.",
  },
  {
    id: "faq-4",
    question: "What happens after launch?",
    answer:
      "We can stay on for maintenance, improvements, and the next phase. The relationship does not have to end when the first version ships.",
  },
  {
    id: "faq-5",
    question: "How do you price the work?",
    answer:
      "Pricing follows the scope of the problem and the system that solves it. We clarify that before build starts, so you know what you are committing to.",
  },
] as const;

export const homeEvidence = [
  {
    label: "Open source",
    title: "Read the code",
    description: "Public repositories reviewers can inspect directly.",
  },
  {
    label: "Architecture",
    title: "Decision records",
    description: "System diagrams and the trade-offs behind them.",
  },
  {
    label: "Certification",
    title: "Verified credentials",
    description: "Only certifications the team actually holds.",
  },
  {
    label: "Outcomes",
    title: "Measured results",
    description: "Real numbers from delivered projects, when available.",
  },
] as const;

export const homeInsights = [
  { title: "How AI voice systems actually work", label: "AI / Voice" },
  { title: "How RAG changes enterprise search", label: "AI / Data" },
  { title: "Designing multi-model AI systems", label: "Architecture" },
  { title: "How IoT data reaches the cloud", label: "IoT / Cloud" },
  { title: "Building production-ready AI applications", label: "Engineering" },
] as const;

export const homePhilosophy = {
  heading: "Technology is only useful when it solves something.",
  body: "We start with the problem, understand the environment, and then choose the technology that actually makes sense.",
} as const;

export const finalCta = {
  heading: "Have a problem worth solving?",
  supporting:
    "Tell us what you are trying to build, improve, automate or solve. We will understand the problem first, then help you determine the right technology.",
  line: "Your problem is unique. Your technology should be too.",
} as const;

/* -------------------------------------------------------------------------- */
/* Enquiry form options                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Budget bands, mapped to the numeric range the lead API stores.
 * `null` bounds mean open-ended; "not decided" sends no budget at all.
 */
export const budgetOptions = [
  { value: "", label: "Not decided yet", min: null, max: null },
  { value: "under-50k", label: "Under ₹50K", min: null, max: 50_000 },
  { value: "50k-1l", label: "₹50K – ₹1L", min: 50_000, max: 100_000 },
  { value: "1l-3l", label: "₹1L – ₹3L", min: 100_000, max: 300_000 },
  { value: "3l-5l", label: "₹3L – ₹5L", min: 300_000, max: 500_000 },
  { value: "5l-plus", label: "₹5L+", min: 500_000, max: null },
] as const;

export const BUDGET_CURRENCY = "INR";

export const timelineOptions = [
  "Immediately",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Just exploring",
  "Not sure yet",
] as const;
