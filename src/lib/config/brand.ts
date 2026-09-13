/**
 * Approved MarineCloudX brand content.
 *
 * Positioning: Technology Solutions & Engineering Partner.
 * Designing and engineering digital products, applications, and intelligent systems
 * around real-world business requirements.
 *
 * Content that has a CMS model — services, industries, FAQs, projects, case
 * studies, testimonials — is read through src/server/public/content.ts.
 * Static narrative sections and verified engineering capabilities live in this file.
 */

export const brand = {
  name: "MarineCloudX",
  legalName: "MarineCloudX Technologies Private Limited",
  tagline: "Technology Solutions & Engineering Partner",
  philosophy: "We engineer technology around real-world business requirements.",
  positioning: "Technology Solutions & Engineering Partner",
  /** Used on the industry sections. */
  industriesLine: "Industry Experience: Education, Interiors, and Dental.",
} as const;

export const hero = {
  eyebrow: "Technology Solutions & Engineering Partner",
  heading: "Engineering digital products, custom applications and intelligent systems.",
  headingLines: [
    "Engineering digital products,",
    "applications & intelligent systems.",
  ],
  supporting:
    "We design and engineer custom software, web platforms, cloud infrastructure, AI systems and workflow integrations — built around real-world business requirements with structured delivery and long-term commitment.",
} as const;

/**
 * The three supporting points under the hero copy. `icon` maps to a small inline
 * SVG in the hero component.
 */
export const heroFeatures = [
  {
    icon: "compass",
    title: "Problem-First Discovery",
    description: "We analyse operational workflows and business requirements before recommending architecture or writing code.",
  },
  {
    icon: "code",
    title: "End-to-End Engineering",
    description: "Full-stack applications, robust cloud infrastructure, AI integrations, and connected systems built to scale.",
  },
  {
    icon: "shield",
    title: "Continuous Engineering",
    description: "We provide ongoing technical support, system monitoring, and continuous engineering as requirements evolve.",
  },
] as const;

/**
 * Hero stats bar.
 *
 * Verifiable capabilities describing our delivery model, engineering breadth,
 * domain experience, and execution approach.
 */
export const stats = [
  { value: "6", label: "Delivery Stages" },
  { value: "8", label: "Core Capabilities" },
  { value: "3", label: "Industry Experience" },
] as const;

export const about = {
  lead: "We are a technology solutions and engineering partner designing and building digital products, applications, and intelligent systems around real business requirements.",
  body: [
    "Our industry experience spans Education, Interiors, and Dental — three distinct domains with different operational models, customer journeys, and technical workflows. These projects demonstrate our ability to understand complex business environments and engineer tailored software solutions that perform in production.",
    "Our engineering capabilities encompass custom application development, cloud infrastructure, AI integrations, workflow automation, data systems, and system integrations. We provide end-to-end technology engineering, from initial discovery and design through deployment and continuous evolution.",
  ],
  vision:
    "We are building toward larger, more sophisticated, and longer-term technology engineering engagements — partnering with ambitious organisations to design, engineer, and continuously advance their digital products and core platforms.",
} as const;

/** Why MarineCloudX — the six-step reasoning behind "we understand why you need it". */
export const whyPoints = [
  {
    title: "Understand the Requirement",
    description: "We start with what your business and users actually need, not with a pre-packaged product to sell you.",
  },
  {
    title: "Analyse Operational Workflows",
    description: "How the work happens today, who does it, where the bottlenecks lie, and where technology delivers genuine leverage.",
  },
  {
    title: "Simplify Architecture Before Building",
    description: "Some steps require custom software, some need automation, and some should be eliminated to avoid technical debt.",
  },
  {
    title: "Select Purpose-Fit Technology",
    description: "The technical stack follows the problem. Every framework, database, and service is chosen for durability and fit.",
  },
  {
    title: "Engineer Resilient Systems",
    description: "We build reliable, maintainable software and infrastructure your team can run with confidence in production.",
  },
  {
    title: "Continuous Evolution",
    description: "Deployment is a milestone, not the finish line. We monitor, maintain, and advance systems as requirements scale.",
  },
] as const;

export const coreValues = [
  {
    title: "Think Different",
    description: "The obvious solution is not always the right one. We question the brief and explore optimal architecture before building.",
  },
  {
    title: "Requirements First",
    description: "Your business outcomes dictate technical choices. We recommend what serves the operational reality best.",
  },
  {
    title: "Build With Purpose",
    description: "Every feature earns its place. We build clean, high-utility systems without unnecessary bloat.",
  },
  {
    title: "Transparent Engineering",
    description: "We communicate clearly about architecture, trade-offs, timelines, and progress at every phase of the project.",
  },
  {
    title: "Own the Outcome",
    description: "We are responsible for what we ship — through discovery, implementation, deployment, and ongoing operation.",
  },
  {
    title: "Long-Term Partnership",
    description: "Good engineering compounds. We build relationships that grow alongside your technology needs.",
  },
] as const;

/**
 * Solutions: Real business challenges across our industry experience,
 * demonstrating how capabilities come together to solve concrete operational problems.
 */
export const solutions = [
  {
    title: "Education: Admissions & Student Journey Platform",
    problem: "Educational institutions require structured workflows to manage enquiries, student admissions, documentation, and communication without fragmented tool sprawl.",
    flow: ["Enquiry capture", "Lead qualification", "Admissions workflow", "Communication", "Reporting"],
    technologies: ["Web application", "PostgreSQL", "Role-based portals", "Notification APIs", "Cloud"],
  },
  {
    title: "Interiors: Project Lifecycle & Client Experience Portal",
    problem: "Design-led businesses need project deliverables, visual asset approvals, client revisions, and quotation tracking unified in one connected system.",
    flow: ["Enquiry", "Portfolio review", "Project workflow", "Client approvals", "Milestone sign-off"],
    technologies: ["Custom software", "Cloud asset storage", "Workflow engine", "Client portal", "APIs"],
  },
  {
    title: "Dental: Patient Journey & Practice Operations",
    problem: "Healthcare practices require streamlined patient appointment booking, automated visit reminders, and operational coordination without front-desk bottlenecks.",
    flow: ["Patient enquiry", "Online scheduling", "Automated reminders", "Visit follow-up", "Practice dashboard"],
    technologies: ["Web application", "Calendar automation", "Messaging gateways", "Cloud backend", "Audit logs"],
  },
  {
    title: "Cross-Industry: Complex Workflows, Data Systems & Integrations",
    problem: "Organisations face similar technical challenges across domains: turning fragmented operational workflows into connected, reliable digital systems built for scale.",
    flow: ["Process analysis", "System architecture", "Connected services", "Data visibility", "Continuous evolution"],
    technologies: ["Custom applications", "Cloud infrastructure", "REST APIs", "Data pipelines", "Automation"],
  },
] as const;

export const process = [
  { title: "Discover", description: "Understand the business, its users, the operational workflows, and the core goal." },
  { title: "Define", description: "Identify core requirements, shape system architecture, and specify what should be built." },
  { title: "Design", description: "Architect user experiences, system components, API contracts, and infrastructure." },
  { title: "Build", description: "Engineer, integrate, and test in reviewed, incremental cycles." },
  { title: "Deploy", description: "Bring the system into production with automated, observable deployment pipelines." },
  { title: "Evolve", description: "Maintain, optimise, monitor, and advance the platform as business needs grow." },
] as const;

/**
 * Trust built on engineering discipline and transparent collaboration.
 */
export const trustPillars = [
  {
    title: "Clear communication",
    description: "You understand what is being built, how it operates, and why specific technical choices were made.",
  },
  {
    title: "Practical engineering",
    description: "Technology is chosen for stability, performance, and long-term maintainability — never for novelty.",
  },
  {
    title: "Structured delivery",
    description: "The project progresses through well-defined stages with clear milestones, deliverables, and visibility.",
  },
  {
    title: "Continuous engineering",
    description: "We support the software after launch — providing maintenance, performance optimisation, and feature expansion.",
  },
] as const;

/**
 * Technology groups shown on the homepage — chosen for the problem, not the résumé.
 */
export const techGroups = [
  { key: "AI", items: ["OpenAI", "Anthropic", "Model Routing", "Streaming APIs"] },
  { key: "Cloud", items: ["AWS", "Docker", "Containerization", "CI/CD"] },
  { key: "Backend", items: ["Node.js", "Python", "REST APIs", "PostgreSQL"] },
  { key: "Frontend", items: ["React", "Next.js", "TypeScript", "TailwindCSS"] },
  { key: "Databases", items: ["PostgreSQL", "Prisma", "Redis", "Relational Modeling"] },
  { key: "Integrations", items: ["REST APIs", "Webhooks", "Event-Driven", "External Connectors"] },
  { key: "Security", items: ["OAuth / NextAuth", "RBAC", "HTTPS / SSL", "Audit Logging"] },
  { key: "DevOps", items: ["Automated Builds", "Logging", "Health Checks", "Observability"] },
] as const;

/**
 * Interactive system diagram nodes on the homepage.
 */
export const systemNodes = [
  {
    name: "AI",
    title: "Applied Intelligence",
    items: ["LLM Integration", "Streaming Responses", "Task Automation", "Model Routing"],
  },
  {
    name: "Cloud",
    title: "Resilient Infrastructure",
    items: ["Cloud Hosting", "APIs", "Scalability", "Containerization"],
  },
  {
    name: "Data",
    title: "Structured Information",
    items: ["PostgreSQL", "Relational Schemas", "Pipelines", "Audit Visibility"],
  },
  {
    name: "Integrations",
    title: "Connected Systems",
    items: ["REST APIs", "Webhooks", "Gateway Connectors", "Event Workflows"],
  },
  {
    name: "Apps",
    title: "Product Interfaces",
    items: ["Web Applications", "Client Portals", "Admin Dashboards", "Responsive UIs"],
  },
  {
    name: "Automation",
    title: "Streamlined Workflows",
    items: ["Notification Triggers", "Status Pipelines", "Background Jobs", "Scheduling"],
  },
] as const;

/**
 * 8 Core Capabilities covering end-to-end technology engineering.
 */
export const homeCapabilities = [
  {
    name: "Strategy & Discovery",
    slug: "strategy-discovery",
    shortDescription: "Understanding business operations, user journeys and technical requirements before selecting any stack.",
    technologies: ["Workflow Analysis", "System Architecture", "Technical Roadmaps", "Requirements Scoping"],
    highlights: [
      { title: "Workflow Analysis", description: "Mapping real-world operational bottlenecks, manual friction points, and multi-role user journeys." },
      { title: "System Architecture", description: "Defining resilient technical architecture, data boundaries, and API contracts before coding." },
      { title: "Technical Roadmaps", description: "Staged engineering blueprints prioritizing core milestones, dependencies, and business impact." },
      { title: "Requirements Scoping", description: "Translating business goals into precise functional and technical specifications." },
    ],
  },
  {
    name: "Product & UX Design",
    slug: "product-ux-design",
    shortDescription: "Shaping intuitive experiences, responsive interfaces and design systems built around complex workflows.",
    technologies: ["UI/UX Design", "Design Systems", "Prototyping", "Information Architecture"],
    highlights: [
      { title: "Task-Centered UX", description: "Designing clear, low-friction task flows for complex administrative and customer portals." },
      { title: "Design Systems", description: "Scalable component libraries and design tokens engineered for visual consistency and rapid extension." },
      { title: "Interactive Prototyping", description: "Simulating interface states and user interactions to validate requirements early." },
      { title: "Information Architecture", description: "Structuring application hierarchies, navigation patterns, and dense data displays cleanly." },
    ],
  },
  {
    name: "Web & Digital Experiences",
    slug: "web-digital-experiences",
    shortDescription: "High-performance web platforms and digital experiences engineered for speed, SEO, and engagement.",
    technologies: ["Next.js", "React", "TypeScript", "Performance Tuning", "Modern Web Standards"],
    highlights: [
      { title: "High-Performance Next.js", description: "Modern React and Next.js applications engineered for instant page transitions and low latency." },
      { title: "Core Web Vitals Optimization", description: "Sub-second initial loads, optimized asset delivery, and responsive layout stability." },
      { title: "Semantic Accessibility", description: "Structured HTML5, ARIA compliance, and keyboard navigation meeting modern web standards." },
      { title: "CMS Architecture", description: "Dynamic content integration empowering marketing teams without developer intervention." },
    ],
  },
  {
    name: "Application Development",
    slug: "application-development",
    shortDescription: "Custom web applications, business platforms, portals and internal operational systems.",
    technologies: ["Full-Stack Engineering", "Relational Databases", "REST APIs", "Authentication", "Dashboard UIs"],
    highlights: [
      { title: "Full-Stack Architecture", description: "End-to-end frontend and backend engineering built with TypeScript and modular design." },
      { title: "Relational Modeling", description: "Structured PostgreSQL schemas, optimized query indexing, and robust transaction safety." },
      { title: "Role-Based Access Control", description: "Granular permissions, secure session handling, and authenticated multi-tenant workflows." },
      { title: "Operational Dashboards", description: "Interactive management consoles, real-time status tracking, and reporting tools." },
    ],
  },
  {
    name: "Cloud & Infrastructure",
    slug: "cloud-infrastructure",
    shortDescription: "Resilient, secure and scalable cloud infrastructure for modern web applications and services.",
    technologies: ["Cloud Architecture", "Docker", "CI/CD Pipelines", "Monitoring", "Security Best Practices"],
    highlights: [
      { title: "Cloud Architecture", description: "Scalable, highly available cloud hosting topologies configured for real production load." },
      { title: "Containerization", description: "Standardized Docker runtimes ensuring reproducible environments across staging and production." },
      { title: "Automated CI/CD", description: "Continuous integration pipelines with automated type checking, test suites, and deployments." },
      { title: "Security & TLS Controls", description: "Automated HTTPS certificate management, firewall rules, and security header hardening." },
    ],
  },
  {
    name: "AI & Intelligent Automation",
    slug: "ai-intelligent-automation",
    shortDescription: "Practical AI integrations and intelligent workflows that automate operational friction and assist users.",
    technologies: ["AI Model Integration", "LLM APIs", "Streaming Responses", "Workflow Automation"],
    highlights: [
      { title: "Foundation Model Integration", description: "Connecting leading AI providers (OpenAI, Anthropic) directly into core business workflows." },
      { title: "Low-Latency Response Streaming", description: "Real-time SSE and WebSocket streaming delivering conversational and predictive responses." },
      { title: "Intelligent Workflows", description: "Automated text extraction, intent routing, and intelligent triage reducing manual handling." },
      { title: "Provider-Agnostic Design", description: "Abstracted integration gateways preventing lock-in to any single AI foundation provider." },
    ],
  },
  {
    name: "Data, Integrations & Systems",
    slug: "data-integrations-systems",
    shortDescription: "Connecting third-party platforms, external APIs, and structured data into cohesive business systems.",
    technologies: ["API Development", "Webhooks", "Third-Party Connectors", "Data Synchronization"],
    highlights: [
      { title: "Custom API Services", description: "Clean, documented REST API services designed for dependable service-to-service communication." },
      { title: "Event-Driven Webhooks", description: "Real-time automated triggers syncing data across payment gateways, CRMs, and internal tools." },
      { title: "Data Pipelines & Sync", description: "Structured ingestion and scheduled reconciliation ensuring accurate data consistency." },
      { title: "System Interoperability", description: "Connecting modern applications with existing databases and legacy operational tools." },
    ],
  },
  {
    name: "Deployment & Continuous Engineering",
    slug: "deployment-support-continuous-engineering",
    shortDescription: "Reliable production releases, system observability, proactive maintenance, and feature evolution.",
    technologies: ["Automated Deployment", "Health Monitoring", "Ongoing Engineering", "Feature Iteration"],
    highlights: [
      { title: "Automated Deployment", description: "Zero-downtime release pipelines with automated build checks and instant rollback safety." },
      { title: "Health Monitoring", description: "Proactive uptime alerts, application telemetry, error logging, and performance monitoring." },
      { title: "Ongoing Engineering", description: "Continuous codebase maintenance, security patch updates, and framework dependency tuning." },
      { title: "Feature Iteration", description: "Ongoing engineering sprints to build new modules, optimize features, and scale with business growth." },
    ],
  },
] as const;

/**
 * Selected Work — real project experience demonstrating technical range and execution depth.
 * Every entry strictly presents: Challenge, What We Built, Technology/Capabilities,
 * What This Demonstrates, and Verified Outcome.
 */
export const homeProjects = [
  {
    name: "Education Admissions & Student Portal",
    industry: "Education",
    line: "Custom admissions management application and student inquiry tracking system.",
    tags: ["Web Application", "PostgreSQL", "REST APIs", "Cloud"],
    beats: [
      {
        k: "Challenge",
        v: "High enquiry volume, multi-step document verification, and fragmented communication across disconnected files and messaging channels.",
      },
      {
        k: "What We Built",
        v: "A dedicated web application featuring structured student application workflows, role-based administration dashboards, and automated status notifications.",
      },
      {
        k: "Technology / Capabilities",
        v: "Full-stack Next.js, React, TypeScript, PostgreSQL database, secure session authentication, REST APIs, and automated messaging integration.",
      },
      {
        k: "What This Demonstrates",
        v: "End-to-end web application engineering, relational data modeling, role-based workflows, and cross-channel notification pipelines.",
      },
      {
        k: "Outcome",
        v: "A unified admissions pipeline replacing manual tracking with structured digital records and real-time status visibility.",
      },
    ],
  },
  {
    name: "Interiors Project Lifecycle & Client Portal",
    industry: "Interiors",
    line: "Central project management, design showcase, and milestone tracking platform.",
    tags: ["Custom Software", "Cloud Storage", "Workflow Engine", "Client Portal"],
    beats: [
      {
        k: "Challenge",
        v: "Coordinating multi-phase interior design deliverables, visual revisions, vendor schedules, and client approvals across unlinked email threads.",
      },
      {
        k: "What We Built",
        v: "A collaborative web portal providing milestone tracking, visual asset presentation, revision management, and client approval records in one system.",
      },
      {
        k: "Technology / Capabilities",
        v: "Modern responsive web interfaces, cloud asset delivery, structured project state workflows, and third-party communication APIs.",
      },
      {
        k: "What This Demonstrates",
        v: "High-fidelity user interface design, media asset workflow handling, and structured project state management.",
      },
      {
        k: "Outcome",
        v: "Direct visibility for clients into project milestones and structured design sign-offs between interior designers and project managers.",
      },
    ],
  },
  {
    name: "Dental Practice Operations & Patient System",
    industry: "Dental",
    line: "Digital appointment coordination, automated patient reminders, and clinic dashboard.",
    tags: ["Automation", "Cloud Infrastructure", "APIs", "Healthcare Workflows"],
    beats: [
      {
        k: "Challenge",
        v: "Appointment scheduling friction, manual reminder calls by front-desk staff, and patient drop-off outside regular clinic operating hours.",
      },
      {
        k: "What We Built",
        v: "An integrated patient appointment booking workflow, automated SMS/email reminder pipelines, and an administrative clinic management dashboard.",
      },
      {
        k: "Technology / Capabilities",
        v: "Custom web interface, calendar scheduling logic, communication API integrations, and secure cloud-hosted backend services.",
      },
      {
        k: "What This Demonstrates",
        v: "Resilient workflow automation, external API orchestration, and reliable scheduling logic tailored to healthcare operations.",
      },
      {
        k: "Outcome",
        v: "24/7 patient booking availability and automated appointment notifications operating without requiring manual front-desk intervention.",
      },
    ],
  },
  {
    name: "Multi-Model AI Integration Platform",
    industry: "Cross-Industry / Technology Proof",
    line: "Unified API gateway and interface for real-time AI model interactions and response streaming.",
    tags: ["AI & LLMs", "Streaming APIs", "Cloud Deployment", "Modern Web"],
    beats: [
      {
        k: "Business Value",
        v: "Enables organisations to evaluate and deploy multiple AI foundation models across business workflows through a single interface — eliminating vendor lock-in.",
      },
      {
        k: "Challenge",
        v: "Evaluating and integrating multiple AI model providers into software workflows without vendor lock-in or fragile custom wrappers.",
      },
      {
        k: "What We Built",
        v: "A unified application and API layer that connects to major foundation model providers with real-time token streaming and prompt configuration.",
      },
      {
        k: "Technical Architecture",
        v: "Next.js, TypeScript, Provider API abstractions (OpenAI/Anthropic), Server-Sent Events (SSE) streaming, and cloud container deployment.",
      },
      {
        k: "What This Demonstrates",
        v: "Practical AI systems engineering, low-latency streaming integration, and modular third-party API architecture.",
      },
      {
        k: "Outcome",
        v: "A functional, vendor-neutral AI integration gateway capable of streaming model responses into application workflows.",
      },
    ],
  },
] as const;

/** 6-Stage Delivery Process supporting applications, platforms, cloud, and AI. */
export const homeProcess = [
  {
    title: "Discover",
    description: "Understand the business environment, users, operational workflows and technical constraints before selecting any technology.",
  },
  {
    title: "Define",
    description: "Scope the core technical requirements, specify system architecture and data models, and establish clear project milestones.",
  },
  {
    title: "Design",
    description: "Architect the user experience, design systems, data workflows, API contracts, and infrastructure topology.",
  },
  {
    title: "Build",
    description: "Engineer resilient frontend and backend services, integrations, databases, and automated test suites in reviewed increments.",
  },
  {
    title: "Deploy",
    description: "Implement automated CI/CD pipelines and configure production cloud environments with monitoring and security controls.",
  },
  {
    title: "Evolve",
    description: "Provide continuous engineering support, system monitoring, performance optimisation, and feature expansion as requirements grow.",
  },
] as const;

/** Static FAQs for the homepage. */
export const homeFaqs = [
  {
    id: "faq-1",
    question: "Do we need fully defined technical specifications before reaching out?",
    answer:
      "No. Tell us the business requirement, the problem you are solving, or the system you want to build. During discovery, we work with you to define the architecture, technical requirements, and project scope.",
  },
  {
    id: "faq-2",
    question: "How does a technology engagement typically start?",
    answer:
      "We begin with discovery: understanding your operational workflows, user journeys, data requirements, and integration needs. From there, we define the architecture and build plan before any development begins.",
  },
  {
    id: "faq-3",
    question: "Can you work with our existing infrastructure and software?",
    answer:
      "Yes. Most engineering projects connect with existing systems — including databases, third-party APIs, legacy platforms, and cloud services. We integrate and modernize rather than rebuild without reason.",
  },
  {
    id: "faq-4",
    question: "How do you approach ongoing maintenance and continuous engineering?",
    answer:
      "We design systems for long-term reliability and can partner with you after initial deployment for ongoing engineering, monitoring, performance optimisation, and continuous feature development.",
  },
  {
    id: "faq-5",
    question: "How is project pricing and scope structured?",
    answer:
      "Pricing is structured around clear project milestones, technical deliverables, and required engineering scope. We establish transparent terms and deliverables before development commences.",
  },
] as const;

export const homeEvidence = [
  {
    label: "Open Source & Code",
    title: "Inspectable Engineering",
    description: "Clean code structure, TypeScript typing, and architectural standards.",
  },
  {
    label: "System Architecture",
    title: "Engineered Decisions",
    description: "Documented technical blueprints, data flows, and schema trade-offs.",
  },
  {
    label: "Delivery Standards",
    title: "Structured Execution",
    description: "6-stage delivery process from discovery through continuous evolution.",
  },
  {
    label: "Real Projects",
    title: "Verified Capabilities",
    description: "Practical applications and platforms built for real operating environments.",
  },
] as const;

export const homePhilosophy = {
  heading: "We engineer technology around real-world business requirements.",
  body: "We start with the business requirement, understand the operating environment, and engineer the technology that actually makes sense — whether that is a digital product, a custom web application, cloud infrastructure, or an intelligent system.",
} as const;

export const finalCta = {
  heading: "Ready to discuss your technology requirement?",
  supporting:
    "Whether you are planning a new application, building a business platform, migrating to cloud infrastructure, or integrating AI and automation — we engineer solutions designed for reliability and long-term evolution.",
  line: "We provide end-to-end technology engineering, from discovery and design through development, deployment and continuous evolution.",
} as const;

/* -------------------------------------------------------------------------- */
/* Enquiry form options                                                        */
/* -------------------------------------------------------------------------- */

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
