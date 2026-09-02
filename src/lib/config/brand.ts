/**
 * Approved MarineCloudeX brand content.
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
  headingLines: ["Think different.", "Build better."],
  supporting:
    "We start with the problem, not the technology. Tell us what you are trying to build, improve or automate — we will work out what should actually be built.",
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
  lead: "MarineCloudeX was started to help small businesses bring their work into the digital world.",
  body: [
    "Many small businesses still depend on manual processes while technology becomes more important to how they operate and compete. That gap is the reason MarineCloudeX exists — to make useful technology practical and accessible for the businesses that need it most.",
    "We work with startups, small and local businesses, growing companies, established businesses and individuals. The work spans websites, applications, business systems, AI, automation and cloud — but it always begins with understanding the problem.",
  ],
  vision:
    "The long-term vision is to grow into a technology company that combines service and product work, creates opportunities for the people who build here, and is known for the experience it gives its customers.",
} as const;

/** Why MarineCloudeX — the six-step reasoning behind "we understand why you need it". */
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
