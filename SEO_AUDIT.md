# SEO Audit — MarineCloudX Frontend

**Audited:** 2026-09-06
**Branch:** `feature/white-ui-version-3` @ `2f79002`
**Method:** static reading of every source file, plus a real `next build` and a
`next start` production server on port 3100, with every public route fetched over
HTTP and its rendered HTML parsed. Every claim below cites a file and line, or a
measured value from that server.

**Steps 1-4** are the audit as first delivered. **Steps 5-6** were added after the
four open questions were answered, and cover keyword targeting, the per-route copy
deck and the local business markup. The plan in Step 4 has been updated accordingly:
items 18 and 24 were promoted to P1, and items 25 and 26 are new. **Step 7** is
the first implementation record; **Step 8** is the second pass, which closed the
structural items Step 7 deferred. Both state what was measured afterwards.

**Score at audit: 52 / 100.** **After the first implementation pass: 82 / 100.**
**After the second pass: 96 / 100 raw, or 100 / 100 adjusted** once the four
points that cannot be verified from this repository are excluded, per the
scoring rule in Step 3. Steps 7 and 8 are the implementation records.

---

## Confirmed inputs (answered 2026-09-06)

The four open questions are now closed. Everything below is planned against these.

| # | Input | Confirmed value |
|---|---|---|
| 1 | Production domain | **`https://marinecloudx.in`** (apex canonical), `www` variant redirected to it |
| 2 | Target market | **Worldwide**, not India-only |
| 3 | Business address | 11th Floor, Building Number 9, SEZ, Hitech City Rd, Madhapur, Hyderabad, Telangana 500081, India — a **verified Google Business Profile** the team manages, listed as "Technology park in Hyderabad, Telangana" |
| 4 | Keywords / services | To be derived from the real capability set in `src/lib/config/brand.ts`. Done in **Step 5** below |

### Two conflicts these answers create — decide before implementing

**1. The `.in` ccTLD fights the worldwide goal.** Google treats a country-code
top-level domain as a hard geographic signal toward that country. `.in` is not on
Google's generic-ccTLD list (which is where `.io`, `.ai`, `.co` and `.me` sit), and
Search Console's international targeting tool never applied to ccTLDs and has since
been retired. So `marinecloudx.in` will always read as an India-first site to Google,
no matter what the markup says. Three options:

- **Keep `.in` as canonical.** Cheapest, zero migration. Accept a real ceiling on
  non-India rankings. Reasonable if India is where revenue actually comes from today.
- **Acquire `marinecloudx.com` and make it canonical**, 301-ing `.in` to it. This is
  the only option that genuinely unblocks worldwide organic reach. Best done *now*,
  before the site has any index history to migrate.
- **Run both**, `.com` global and `.in` for India, with correct `hreflang`. Most
  work, and not justified at this content volume.

My recommendation: **option 2, and decide it before item 1 is implemented.** Setting
`NEXT_PUBLIC_SITE_URL` is a five-minute change today and a domain migration later.
This is a business decision, not a code one — I have planned everything below against
`https://marinecloudx.in` and every item stays valid if you swap the host.

**2. The enquiry form prices in rupees only.** `budgetOptions` in
`src/lib/config/brand.ts:437-444` offers "Under ₹50K" through "₹5L+", and
`BUDGET_CURRENCY` at line 446 is hardcoded `"INR"`. The top band, ₹5L, is roughly
US$6,000. A European or US buyer who reaches the form after a global search sees
rupee brackets that top out below their smallest project and closes the tab. This
does not affect rankings, but it wastes every worldwide visitor the SEO work brings
in. Fixed in **P2 item 25**.

**3. `/blog` is planned content.** Confirmed as an Insights section that will be
filled. It stays in the sitemap, and the `Article` structured data already there is
worth keeping. Item 19 covers publishing.

---

## Step 1 — What this project actually is

I read the config rather than assuming. The stack differs from the brief in one way
worth stating up front: **there is no client-only rendering anywhere.** This is a
fully server-rendered App Router site.

| Question | Answer | Evidence |
|---|---|---|
| Framework | Next.js **16.3.3**, App Router, React 19.2.8, Turbopack build | `package.json:20-24` |
| Router | App Router, single `(public)` route group | `src/app/(public)/` |
| Rendering | **`force-dynamic` on every public route** — SSR per request, no SSG, no ISR | `src/app/(public)/layout.tsx:17` |
| Metadata | Root defaults in `src/app/layout.tsx:29-52`; per-route `metadata` / `generateMetadata` exported from `src/features/marketing/pages/*.tsx` and re-exported by thin route files | e.g. `src/app/(public)/about/page.tsx:9` |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, tokens in an `@theme` block | `src/app/globals.css:14-73` |
| Images | Raw `<img>` only. **`next/image` is used nowhere**, `next.config.ts` has no `images` block | `src/features/marketing/components/layout.tsx:418`, `project-gallery.tsx:47` |
| Data | All content from a NestJS API over `fetch`, tagged `content`, `revalidate: 60` | `src/features/content/services/content.ts:29-40`, `cache.ts:18-21` |
| Public dir | **Does not exist.** Icons and OG image are App Router file conventions | `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` |

### Route list and rendering mode

Taken verbatim from the `next build` route table. `ƒ` is server-rendered on demand;
`○` is prerendered.

| Route | Mode | Indexable | Metadata source |
|---|---|---|---|
| `/` | ƒ | yes | root layout defaults only (no page-level metadata) |
| `/about` | ƒ | yes | `AboutPage.tsx:18` |
| `/services` | ƒ | yes | `ServicesPage.tsx:14` |
| `/services/[slug]` | ƒ | yes | `ServiceDetailPage.tsx:19` |
| `/industries` | ƒ | yes | `IndustriesPage.tsx:13` |
| `/industries/[slug]` | ƒ | yes | `IndustryDetailPage.tsx:16` |
| `/projects` | ƒ | yes | `ProjectsPage.tsx:18` |
| `/projects/[slug]` | ƒ | yes | `ProjectDetailPage.tsx:16` |
| `/case-studies` | ƒ | yes | `CaseStudiesPage.tsx:14` |
| `/case-studies/[slug]` | ƒ | yes | `CaseStudyDetailPage.tsx:21` |
| `/blog` | ƒ | yes | `BlogPage.tsx:21` |
| `/blog/[slug]` | ƒ | yes | `BlogPostPage.tsx:29` |
| `/faq` | ƒ | yes | `FaqPage.tsx:12` |
| `/testimonials` | ƒ | yes | `TestimonialsPage.tsx:12` |
| `/contact` | ƒ | yes, but canonicals to `/start-a-project` | `ContactPage.tsx:8` |
| `/start-a-project` | ƒ | yes | re-exports `ContactPage` metadata |
| `/api/revalidate` | ƒ | no — disallowed in robots | `src/app/api/revalidate/route.ts` |
| `/sitemap.xml` | ƒ | n/a | `src/app/sitemap.ts:7` |
| `/robots.txt` | ○ | n/a | `src/app/robots.ts` |
| `/_not-found` | ○ | `noindex` | Next.js default page, **not** the custom one |

`.next/prerender-manifest.json` confirms zero public HTML routes are prerendered:
the only static entries are `/_global-error`, `/_not-found`, the three image
routes and `/robots.txt`.

---

## Step 2 — Category findings

### A. Crawlability & Indexing — 12 / 20

**robots.txt exists and is correct — PARTIAL** (`src/app/robots.ts:15-27`)

Served output from the production server:

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Host: http://localhost:3000/
Sitemap: http://localhost:3000/sitemap.xml
```

The rule ordering is right and nothing important is blocked. Two problems. The
`Host` directive takes a bare hostname, not a URL with a scheme and trailing slash,
and is only honoured by Yandex — `absoluteUrl("/")` at line 25 cannot produce a
valid value. And both absolute lines resolve through `NEXT_PUBLIC_SITE_URL`, which
is `localhost` in the only configuration present in the repo.

**sitemap.xml includes all public routes — PARTIAL** (`src/app/sitemap.ts:20-65`)

Verified live: valid XML, correct namespace, `changefreq` and `priority` on every
entry, and dynamic entries pulled from the same publication filter the pages use so
drafts cannot leak in. Three gaps:

- `/start-a-project` is absent, and it is the canonical target of `/contact`.
- Line 30 lists `/contact`, which canonicals elsewhere. Conflicting signals.
- Static routes carry no `lastModified` (lines 21-30). Only CMS rows get one.

**No accidental noindex — PASS**

All eleven fetched routes emitted `<meta name="robots" content="index, follow">`
from `src/app/layout.tsx:51`. `noindex` appears in exactly the two right places: the
404 response, and unpublished slugs (`BlogPostPage.tsx:33`, `ServiceDetailPage.tsx:25`,
`CaseStudyDetailPage.tsx:25`, `IndustryDetailPage.tsx:20`, `ProjectDetailPage.tsx:20`).

**Canonical URLs on every page, absolute — PARTIAL**

Every route emits an absolute canonical. `metadataBase` at `src/app/layout.tsx:30`
does the resolution correctly. Measured values (base is localhost only because that
is what the repo's env sets):

| Route | Canonical emitted |
|---|---|
| `/` | `http://localhost:3000` |
| `/about` | `http://localhost:3000/about` |
| `/contact` | `http://localhost:3000/start-a-project` |
| `/start-a-project` | `http://localhost:3000/start-a-project` |

The mechanism is right. The base value is the risk, and `/contact` conflicts with
the sitemap.

**No duplicate content — PARTIAL**

Verified against the running server:

| Request | Result |
|---|---|
| `/about/` | `308` → `/about` |
| `/About` | `404` |
| `/index.html` | `404` |
| `/services?ref=test` | `200`, canonical `/services` |

Trailing slash, casing and query parameters are all handled correctly. `www` versus
apex and HTTP versus HTTPS are not addressed anywhere in the app — no `redirects()`
in `next.config.ts`, no middleware. That is a host or CDN concern and is listed as
unverified below. The `/contact` and `/start-a-project` pair is a genuine duplicate,
resolved by canonical but contradicted by the sitemap.

**Correct HTTP status codes — PARTIAL**

`/this-does-not-exist` returns a real `404`. But it renders **Next.js's built-in 404
page**, not the custom one. The parsed body contains exactly two headings, `h1: 404`
and `h2: This page could not be found.`, and zero `<main>`, `<header>`, `<nav>` or
`<footer>` elements. `src/app/(public)/not-found.tsx` — with its branded copy and
its "Back to home" link — is only reachable from `notFound()` calls inside the
`(public)` segment. Unmatched URLs need `src/app/not-found.tsx`.

Separately, listing pages return `200` while displaying an empty state — a classic
soft 404. `PublicEmptyState` renders "No published services yet" at
`ServicesPage.tsx:69-72` under a `200`.

---

### B. Rendering & Content Availability — 11 / 15

**Main content is in the initial HTML — PASS.** This is the site's strongest area
and I verified it rather than assuming it. Raw `curl` output with no JavaScript
executed contains, on the homepage: the `<h1>` "Complex problems. Intelligent
systems.", 43 headings, all body copy, the full header nav, all three footer nav
groups, and the Organization JSON-LD block. Hero copy is a server component
(`src/features/marketing/components/hero.tsx` has no `"use client"`), as are the
service descriptions, philosophy, solutions, trust pillars and FAQ text.

**Client-only routes that should be SSG or SSR — none.** Every route is server
rendered. The fifteen `"use client"` files are all leaf interactivity: header
drawer, accordion, form, WebGL canvas, scroll listener.

**Rendering strategy is wrong for a marketing site — FAIL**
(`src/app/(public)/layout.tsx:17`)

```ts
export const dynamic = "force-dynamic";
```

Sixteen public HTML routes, all SSR-per-request, no full-route cache. Every crawler
hit is a fresh render plus an API round trip. The comment at lines 11-16 explains
the choice as a reaction to a `revalidateTag` problem that has since been solved —
`src/app/api/revalidate/route.ts` now does cross-process on-demand invalidation, and
`content.ts:33` already tags its fetches. The reason for `force-dynamic` no longer
applies.

**API outage turns every detail page into a 404 — FAIL**

`content.ts:29-40` catches every fetch failure and returns `null`, and each detail
page turns `null` into `notFound()`. Verified with the API down:

| Request | Status |
|---|---|
| `/services/anything` | `404` |
| `/blog/some-post` | `404` |
| `/projects/x` | `404` |

A network error and a genuinely missing slug are indistinguishable. A backend blip
during a crawl deindexes the entire catalogue.

---

### C. Metadata — 6 / 15

**Unique `<title>` per route, 50-60 chars, keyword-front-loaded — FAIL**

Every title is unique and the template at `src/app/layout.tsx:33` is applied
correctly. Every one is far too short, and none leads with a keyword.

| Route | Title | Chars | Target |
|---|---|---|---|
| `/` | MarineCloudeX — Think Different. Build Better. | 46 | 50-60 |
| `/faq` | FAQ — MarineCloudeX | 19 | 50-60 |
| `/blog` | Blog — MarineCloudeX | 20 | 50-60 |
| `/projects` | Projects — MarineCloudeX | 24 | 50-60 |
| `/services` | Services — MarineCloudeX | 24 | 50-60 |
| `/industries` | Industries — MarineCloudeX | 26 | 50-60 |
| `/case-studies` | Case studies — MarineCloudeX | 28 | 50-60 |
| `/testimonials` | Testimonials — MarineCloudeX | 28 | 50-60 |
| `/about` | About — MarineCloudeX | 21 | 50-60 |
| `/start-a-project` | Start a project — MarineCloudeX | 31 | 50-60 |

Not one contains "software development", "cloud", "custom software" or any phrase a
buyer would search. `"Services — MarineCloudeX"` at `ServicesPage.tsx:15` should be
something like `"Custom Software & Cloud Development Services | MarineCloudX"`.

**Unique meta description per route, 140-160 chars — FAIL**

| Route | Chars | Description |
|---|---|---|
| `/industries` | 31 | Sectors MarineCloudeX works in. |
| `/blog` | 36 | Writing from the MarineCloudeX team. |
| `/projects` | 41 | Selected work delivered by MarineCloudeX. |
| `/faq` | 50 | Common questions about working with MarineCloudeX. |
| `/case-studies` | 53 | How MarineCloudeX approached specific pieces of work. |
| `/services` | 55 | What MarineCloudeX builds and operates for its clients. |
| `/testimonials` | 56 | What clients have said about working with MarineCloudeX. |
| `/` | 84 | MarineCloudeX designs and builds software, digital products and intelligent systems. |
| `/start-a-project` | 109 | Tell MarineCloudeX what you are trying to build, improve, automate or solve… |
| `/about` | 118 | MarineCloudeX helps businesses move from manual processes to useful digital systems… |

All unique, none in range. Seven are under 60 characters, leaving most of the SERP
snippet to be filled in by Google from page text.

**Open Graph — FAIL**

`og:image` is correct: the file convention at `src/app/opengraph-image.png` produces
an absolute URL with `og:image:width=1200` and `og:image:height=630` on every route.
`og:type` and `og:site_name` are set.

The failure is that **eight of eleven routes emit the homepage's Open Graph block
verbatim.** Verified identical on `/about`, `/services`, `/industries`, `/projects`,
`/case-studies`, `/blog`, `/faq`, `/testimonials`:

```
og:title       MarineCloudeX — Think Different. Build Better.
og:description MarineCloudeX designs and builds software, digital products…
og:url         http://localhost:3000
```

The cause is that those pages declare `title`, `description` and `alternates` but no
`openGraph` key, so Next inherits the parent's block wholesale from
`src/app/layout.tsx:38-45`. Sharing any inner page on LinkedIn shows the homepage.
Only the five `generateMetadata` detail pages set their own — and two of those use
`type: "article"` for a Service and a Project (`ServiceDetailPage.tsx:32`,
`ProjectDetailPage.tsx:29`), which is the wrong type.

**Twitter card tags — PARTIAL.** `twitter:card=summary_large_image` and
`twitter:image` on every route (`src/app/layout.tsx:46-50`), but `twitter:title` and
`twitter:description` inherit the homepage's for the same reason. No `twitter:site`.

**`lang` attribute — PASS.** `<html lang="en">` from `src/app/layout.tsx:56`.

**Favicon and manifest — PARTIAL.** `icon.png` (512×512) and `apple-icon.png`
(180×180) both emit correct `<link>` tags. **No web manifest exists** — no
`src/app/manifest.ts`, no `manifest.json`, no `<link rel="manifest">` in any response.
No `themeColor` either.

**No template leftovers — PASS.** Nothing from `create-next-app` remains. The
metadata is hand-written and internally consistent.

**Brand string inconsistency — FAIL.** `siteConfig.name` is `"MarineCloudeX"`
(`src/lib/config/site.ts:24`) and appears in every title, description and JSON-LD
block. The visible UI renders `"MarineCloudX"` — `site-header.tsx:65` and
`site-footer.tsx:18`. Two spellings of the brand across `<title>` and body text
weakens entity recognition and looks like a typo in the SERP.

---

### D. Semantic HTML & Heading Structure — 7 / 10

**Exactly one `<h1>` per page — PASS.** Verified on all eleven routes. Each is
meaningful, not a logo. `PageIntro` (`layout.tsx:269-271`) enforces it for inner
pages; the homepage's is the hero at `hero.tsx:36`.

**Logical h1 → h2 → h3 order — FAIL on the homepage.** The parsed order is:

```
h1: Complex problems. Intelligent systems.
h3: Problem-first            ← skips h2
h3: Practical engineering
h3: Owned outcomes
h2: Technology is only useful when it solves something.
```

Three `<h3>` elements appear before the first `<h2>`, from
`hero-stats-band.tsx:79`. Those three are feature labels inside a card, not document
sections, so they should not be headings at all.

`/industries` has a second problem: the only `<h2>` on the page is `"Sarah Singh"` —
a testimonial author's name promoted to a document-level heading.

**Headings used for structure, not styling — PASS.** Sizes come from the `text-h1`
… `text-h3` token scale (`globals.css:52-66`), applied independently of level. The
`ContentCard` even takes a `headingLevel` prop (`ServicesPage.tsx:79`) so nesting
stays correct.

**Semantic landmarks — PASS.** Every page: one `<header>`, one `<main>`, one
`<footer>`, four `<nav>` (primary plus three footer groups, each with a distinct
`aria-label`), and `<section>` / `<article>` used correctly. The homepage has ten
`<section>` and four `<article>`.

**Descriptive anchor text — PASS.** I extracted every anchor on the homepage. There
is no "click here", "learn more" or bare "read more". The full set:

```
MarineCloudX | About | Services | Industries | Work | Insights | Start a project
Explore our work | All services | All questions | Contact | FAQ | Projects
Case studies | Testimonials | Blog
```

One thing that looks like a violation but is not: `ContentCard` renders the word
"Explore" (`layout.tsx:475`) — but it is a `<span>`, and the real anchor is the card
title wrapped in a stretched link at `layout.tsx:439-441`. The crawler sees the
title.

---

### E. Structured Data — 4 / 10

**What exists and is correct:**

- `Organization` + `WebSite` in an `@graph`, homepage only, with `@id` cross-linking
  (`structured-data.tsx:63-83`). Verified present in the rendered `/` HTML.
- `Service` on service detail pages, `provider` pointing at the Organization `@id`
  rather than duplicating it (`structured-data.tsx:122-144`).
- `FAQPage` builder, correctly guarded against an empty `mainEntity`
  (`structured-data.tsx:91-114`), wired at `FaqPage.tsx:32`.
- `BlogPosting` with `datePublished`, `dateModified`, `image` and
  `mainEntityOfPage` (`BlogPostPage.tsx:100-115`).
- `</script>` escaping on both builders (`structured-data.tsx:46`,
  `BlogPostPage.tsx:129`) — genuinely well done.

**What is missing:**

- **No `BreadcrumbList` anywhere.** A `Breadcrumbs` component exists and renders on
  five route types (`layout.tsx:304-330`), with `aria-label="Breadcrumb"` and
  `aria-current`. The machine-readable equivalent was never added, so breadcrumb
  rich results are unavailable.
- **Nine of eleven rendered pages emit zero JSON-LD.** Only `/` had a block; `/faq`
  had none because the CMS returned no FAQs. `Organization` appears on the homepage
  alone rather than sitewide.
- **No `FAQPage` on the homepage** even though it renders five real Q&A pairs from
  `brand.ts` at `HomePage.tsx:201`.
- **No `ItemList`** on `/services`, `/projects`, `/case-studies` or `/blog`.
- **No `sameAs`** — deliberate, and correct given no social accounts are configured
  (`site.ts:38-40`). Blocked on question 3, not a code defect.
- **No `LocalBusiness`**, `address` or `telephone` — same reason.

The restraint documented at `structured-data.tsx:14-21` is right: inventing an
address in JSON-LD would be worse than omitting it. The gap is `BreadcrumbList` and
`ItemList`, which need no new facts at all.

---

### F. Images & Media — 3 / 10

There are exactly two image code paths in the entire codebase, and both are raw
`<img>` with an ESLint suppression.

**`layout.tsx:414-424`:**

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img
  src={image.url}
  alt={image.altText ?? ""}
  width={image.width ?? undefined}
  height={image.height ?? undefined}
  loading="lazy"
  className="h-full w-full object-cover …"
/>
```

**`project-gallery.tsx:44-55`** is the same shape.

- **Meaningful alt text — FAIL.** `alt={image.altText ?? ""}` silently converts a
  content image with no CMS alt text into a decorative one. The fallback should be
  a required field at the CMS layer, not an empty string at render time.
- **Modern formats — FAIL.** No WebP or AVIF anywhere. No `next/image`, no
  `<picture>`, no `srcset`, no `sizes`. `next.config.ts` has no `images` block at
  all. The stated reason (`layout.tsx:415-416`: object-storage hosts vary per
  environment, so `remotePatterns` would need per-environment config) is a real
  constraint but it is solvable with an env-driven `remotePatterns`.
- **Explicit width/height — PARTIAL.** Both pass them through, but both are optional
  and become `undefined` when the CMS row lacks them. The gallery mitigates this
  with an `aspect-[16/10]` wrapper (`project-gallery.tsx:84`); the card path at
  `layout.tsx:405` does too. So CLS is contained by CSS, not by the image tag.
- **Lazy loading strategy — FAIL.** `loading="lazy"` is hardcoded on **every** image
  including the first one on a detail page, which is often the LCP element. No
  `fetchPriority="high"` and no `loading="eager"` exists anywhere in the codebase.
- **Static asset sizes — PARTIAL.** Measured from `.next/static/media`:

| Asset | Size | Note |
|---|---|---|
| `opengraph-image.png` | 179,137 B | large but only fetched by crawlers |
| `icon.png` | 67,836 B | **oversized** for a 512×512 favicon; should be under 15 KB |
| `apple-icon.png` | 13,134 B | fine |

All eleven fetched pages rendered zero `<img>` elements, because the CMS was
unreachable. Actual CMS media weights and alt-text coverage are unverified.

---

### G. Core Web Vitals & Performance — 6 / 15

**JavaScript payload — FAIL.** Measured from the production build by parsing the
homepage's own `<script src>` list and stat-ing each chunk:

| Chunk | Raw | Gzipped | What |
|---|---|---|---|
| `1l78ly5_z03bl.js` | 536,795 | 134,329 | **Three.js** |
| `3byuobrkyz9bj.js` | 229,156 | 71,665 | React + Next runtime |
| `2-rtuqsgzmno4.js` | 165,743 | 45,057 | framework |
| `0cz1d0mv5g_q7.js` | 112,594 | 39,496 | polyfills |
| six others | 76,284 | 24,296 | app + turbopack |
| **Total initial JS** | **1,120,572** | **≈ 315,000** | 10 requests |

**Three.js is 43% of the homepage's JavaScript** and it is a static top-level import
in a client component:

```ts
// src/features/marketing/components/hero-ribbon.tsx:14
import * as THREE from "three";
```

There is **no `next/dynamic` anywhere in `src/`**. Notably, the unused
`marine-core.tsx:46` already does `void import("three")` — the lazy pattern exists
in the codebase and was simply not applied to the component that ships.

**Render-blocking resources — PARTIAL.** One stylesheet, 69,164 B raw / 13,780 B
gzipped. That is a single render-blocking request and is acceptable. All ten scripts
are `async`.

**Font loading — PARTIAL.** Self-hosted by `next/font/google` (`layout.tsx:9-17`);
eleven `@font-face` rules in the built CSS, **all with `font-display: swap`**. Both
families are subset and hashed. The failure: the rendered HTML contains **zero
`<link rel="preload" as="font">` tags**. Fonts are discovered only after the CSS
parses, which delays the swap and pushes the LCP text repaint later.

**LCP element per route.** Homepage: the `<h1>` at `hero.tsx:36` — text, no image,
which is structurally good. Inner pages: the `PageIntro` `<h1>`. There is no LCP
image on any route. The risk is not the element, it is the 315 KB of gzipped JS and
a WebGL context initialising alongside it.

**Hero animation cost — measured.** `hero-ribbon.tsx` is genuinely well engineered
in isolation: one `InstancedMesh` of 200 plates in a single draw call
(lines 88-91), a baked vertex-colour gradient instead of per-frame lighting
(lines 76-87), `setPixelRatio` capped at 2 (line 63), full disposal on unmount
(lines 190-199), and `prefers-reduced-motion` renders exactly one frame and stops
(line 160). Three real costs remain:

1. 536,795 B of Three.js on the critical path for every visitor.
2. The `requestAnimationFrame` loop never pauses. There is **no `IntersectionObserver`
   anywhere in `src/`**, so 200 instance matrices are recomputed on the main thread
   every frame even when the hero is scrolled far out of view. That competes directly
   with INP.
3. `hero-ribbon.tsx:56` computes `const mobile = …matchMedia("(max-width: 860px)")`
   but uses it only at line 127 to skip pointer parallax. **Mobile devices still
   download and run the full WebGL scene.**

**CLS risks — PASS, mostly.** The hero canvas is absolutely positioned inside a
`clamp(320px, 58vh, 600px)` box (`globals.css:760-773`), so it cannot shift layout.
The ambient wash, glow, grid and noise layers are `position: fixed`
(`(public)/layout.tsx:26-32`). Card and gallery images sit in aspect-ratio wrappers.
The one live risk is the unpreloaded font swap.

**Unused JS — PASS, better than it looks.** Eight components are dead source:
`hero-scene.tsx` (392 lines), `marine-core.tsx` (308), `studio-object.tsx`,
`capabilities-accordion.tsx`, `work-stage.tsx`, `floating-surface.tsx`,
`hero-motion.tsx`, `scroll-reveal.tsx`. I grepped the built client chunks for each
and **none ships** — Turbopack tree-shakes them correctly. They are maintenance
debt, not bundle weight, so I have not scored them as a performance defect.

---

### H. Accessibility affecting SEO — 3 / 5

**What is correct:**

- Global focus ring: `:focus-visible { outline: 2px solid var(--color-brand-bright); outline-offset: 2px }`
  (`globals.css:92-96`).
- A thorough `prefers-reduced-motion` block (`globals.css:1045-1067`) that also
  force-reveals any content a reveal animation might have left hidden.
- Icon-only buttons are labelled. The menu toggle has `<span class="sr-only">`,
  `aria-expanded` and `aria-controls` (`site-header.tsx:98-102`); every decorative
  SVG and gradient dot carries `aria-hidden="true"`.
- The FAQ accordion uses real `<button>` with `aria-expanded` / `aria-controls` and
  panels with `role="region"` + `aria-labelledby` (`faq-accordion.tsx:67-113`).
- The contact form labels every field with `htmlFor`, and adds `aria-invalid` and
  `aria-describedby` on error (`contact-form.tsx:147-261`).

**What fails:**

- **No skip-to-content link,** and `<main>` at `(public)/layout.tsx:35` has no `id`
  to target. With a fixed header and four nav landmarks, keyboard users tab through
  the whole menu on every page.
- **Gradient `<h1>` contrast.** `.text-aurora` (`globals.css:431-441`) ends at
  `--color-aurora-3: #43a7ff`, which is **2.54:1 on white** — below the 3:1 minimum
  for large text. The violet start `#6d5cff` is fine at 4.54:1, so the last words of
  the headline are the ones that fail.
- **Muted text at reduced opacity.** `--color-ink-muted: #6b6b6b` is 5.33:1 and
  passes. But `text-ink-muted/50` on the footer copyright (`site-footer.tsx:42`)
  computes to roughly `#b5b5b5` — **2.05:1**. `text-ink-muted/70` and
  `text-brand-bright/85` are used on eyebrows throughout.
- **Dark hero card.** `hero-stats-band.tsx:80` and `:104` use `text-white/60` and
  `text-white/50` for descriptions and stat labels on a dark card.

---

## Step 3 — Score

| Category | Weight | Score | Weighted | Key issues |
|---|---|---|---|---|
| A. Crawlability & Indexing | 20 | 60% | **12.0** | Site URL resolves to localhost in the only config in the repo; custom 404 unreachable, Next default served; sitemap omits `/start-a-project` and lists `/contact` which canonicals away; no `lastmod` on static routes; malformed robots `Host` |
| B. Rendering & Content | 15 | 73% | **11.0** | All content server-rendered and verified in raw HTML; but `force-dynamic` on all 16 routes, no SSG/ISR; API outage returns 404 on every detail page |
| C. Metadata | 15 | 40% | **6.0** | 8 of 11 routes emit the homepage's `og:title`/`og:description`/`og:url`; titles 19-46 chars vs 50-60; descriptions 31-118 vs 140-160; no keywords; no manifest; brand spelled two ways |
| D. Semantic HTML & Headings | 10 | 70% | **7.0** | One `h1` everywhere, full landmarks, descriptive anchors; homepage skips h1→h3; `/industries` uses an author name as its only h2 |
| E. Structured Data | 10 | 40% | **4.0** | Organization, WebSite, Service, FAQPage, BlogPosting all correct; no BreadcrumbList despite visible breadcrumbs on 5 route types; no ItemList; Organization on homepage only; 9 of 11 pages emit none |
| F. Images & Media | 10 | 30% | **3.0** | Raw `<img>` only, `next/image` used nowhere; no WebP/AVIF, no `srcset`; `alt` defaults to `""`; `loading="lazy"` hardcoded on every image including LCP candidates; `icon.png` is 67.8 KB |
| G. Core Web Vitals | 15 | 40% | **6.0** | 1.12 MB raw / ~315 KB gz initial JS; Three.js is 536,795 B of it, statically imported, shipped to mobile; rAF loop never pauses off-screen; zero font preloads |
| H. Accessibility (SEO-affecting) | 5 | 60% | **3.0** | Strong focus, reduced-motion, ARIA and form labelling; no skip link; gradient h1 at 2.54:1; footer text at 2.05:1 |
| **Total** | **100** | | **52.0** | |

### Total SEO Score: **52 / 100**

### Unverified items — excluded weight

Per the scoring rules, these could not be verified and are worth **6 points** in
total. They were scored zero and sit inside the denominator above.

| Item | Weight | Why unverified |
|---|---|---|
| Deployed `NEXT_PUBLIC_SITE_URL` value | 2 (in A) | The intended value is now confirmed as `https://marinecloudx.in`, but `.env` is gitignored and there is no `.env.production` or `.env.example`, so I cannot verify what the deployed environment actually sets. Re-check after P0 item 1 ships |
| `www` vs apex and HTTP→HTTPS canonicalisation | 1 (in A) | Host/CDN level; no `redirects()` or middleware to inspect. Now specified in P0 item 1, but still not verifiable from the repo |
| CMS alt-text coverage and real media file sizes | 3 (in F) | API at `localhost:3001` unreachable; all 11 pages rendered 0 images |

**Adjusted total, excluding that weight: 52 / 94 → 55 / 100.**

I did not run Lighthouse, so field LCP, CLS and INP numbers are absent. Every
performance figure above is a measured byte count or a code fact, not a synthetic
score, and I scored G on those alone.

---

## Step 4 — Improvement plan

### P0 — Blocking indexing

| # | File | Change | Why | Hours | Δ |
|---|---|---|---|---|---|
| 1 | `src/lib/config/site.ts:15-21`, deployment env, host/CDN config | Set `NEXT_PUBLIC_SITE_URL=https://marinecloudx.in`; make the build fail loudly rather than fall back to `localhost:3000` at line 16. Add a 301 from `www.marinecloudx.in` to the apex, and force HTTPS, at the host or CDN — Next cannot do host-level redirects for you | Every canonical, `og:url`, sitemap `<loc>` and robots `Sitemap:` line derives from it. Shipped unset, Google is handed a sitemap of localhost URLs and canonicals nothing can resolve. Without the `www` redirect the site is reachable at two hostnames and splits its own signals. Nothing else on this list matters until this is right | 0.75 | +8 |
| 2 | new `src/app/not-found.tsx` | Move or re-export `src/app/(public)/not-found.tsx` to the app root | Verified: unmatched URLs render Next's default 404 with zero internal links, no header, no footer. Every crawl of a dead URL is a dead end instead of a route back into the site | 0.5 | +2 |
| 3 | `src/features/content/services/content.ts:29-40` | Distinguish a 404 from the API (→ `notFound()`) from a network error or 5xx (→ throw, let `error.tsx` return 500) | Verified: with the API down, `/services/anything`, `/blog/some-post` and `/projects/x` all returned 404. A backend blip during a crawl deindexes the whole catalogue. A 500 is retried; a 404 is believed | 2 | +4 |

**P0 subtotal: 3.25 hours, +14.**

### P1 — High impact, low effort

| # | File | Change | Why | Hours | Δ |
|---|---|---|---|---|---|
| 4 | `AboutPage.tsx:18`, `ServicesPage.tsx:14`, `IndustriesPage.tsx:13`, `ProjectsPage.tsx:18`, `CaseStudiesPage.tsx:14`, `BlogPage.tsx:21`, `FaqPage.tsx:12`, `TestimonialsPage.tsx:12`, `ContactPage.tsx:8` | Add an `openGraph` key to each (or a `pageMetadata()` helper that derives it from `title`/`description`/`canonical`) | Verified: 8 of 11 routes share the homepage's OG block. Every inner page shared on LinkedIn or Slack currently previews as the homepage | 1.5 | +4 |
| 5 | same nine files, plus `src/lib/config/site.ts:29-30` and the title template at `src/app/layout.tsx:33` | Apply the **copy deck in Step 5** verbatim — 14 titles at 50-60 chars, 14 descriptions at 140-160, each front-loaded with its target keyword. Change the template from `%s — MarineCloudeX` to `%s \| MarineCloudX` | 19-46 char titles waste the whole SERP line; 31-char descriptions let Google write the snippet instead of you. Copy is written and length-verified, so this is transcription, not authoring | 3 | +5 |
| 6 | `src/features/marketing/components/hero-ribbon.tsx:14` | Replace the static `import * as THREE` with `await import("three")` inside the effect, as `marine-core.tsx:46` already does; or wrap in `next/dynamic` with `ssr: false` | Removes 536,795 raw / 134,329 gzipped bytes — 43% of homepage JS — from the critical path. Hydration and INP both improve immediately | 1 | +3 |
| 7 | `src/app/sitemap.ts:30` | Replace the `/contact` entry with `/start-a-project`, and add `lastModified` to the ten static routes | The sitemap currently advertises a URL that canonicals elsewhere. Contradictory signals cost crawl budget | 0.25 | +1 |
| 8 | `src/app/(public)/layout.tsx:35` | Add `id="main"` and a visually-hidden-until-focused skip link | Four nav landmarks and a fixed header sit ahead of content on every page | 0.25 | +1 |
| 9 | `src/features/marketing/components/hero-stats-band.tsx:79` | Change the three `<h3>` to `<p>` with the same classes | Removes the h1→h3 skip on the highest-value page. Purely a tag swap, no visual change | 0.25 | +1 |
| 10 | `src/app/layout.tsx:9-17` | Ensure `preload` is on for the primary family, or emit explicit `<link rel="preload" as="font">` | Verified zero font preloads in the HTML. Fonts are found only after CSS parses, delaying the LCP text repaint | 0.5 | +1 |
| 11 | `src/app/robots.ts:25` | Drop the `host` field, or emit a bare hostname | `absoluteUrl("/")` yields `http://localhost:3000/`, which is not a valid `Host` value in any form | 0.1 | +0.5 |
| 12 | `globals.css:431-441`, `site-footer.tsx:42`, `hero-stats-band.tsx:80,104` | Darken the `#43a7ff` gradient stop; raise `/50` and `/60` opacities to at least `/70` | Gradient h1 is 2.54:1 and footer text 2.05:1, both below minimum. Low-contrast body text is a documented quality signal | 1 | +1 |
| 18 | `src/lib/config/site.ts:24-26`, `site-header.tsx:65`, `site-footer.tsx:18` | **Promoted from P2.** Settle on `MarineCloudX` — the spelling on the verified Google Business Profile — across metadata, JSON-LD and visible UI | Was a branding inconsistency; with a local listing in play it is now a name-address-phone mismatch, which is a direct local ranking input. The profile, the markup and the page must agree exactly | 1 | +1 |
| 24 | `structured-data.tsx:53-60`, `site.ts:38-40` | **Promoted from P3, now unblocked.** Add the `PostalAddress`, `ProfessionalService` dual type, `areaServed: Worldwide`, `hasMap` and `sameAs` per **Step 6**. Separately, add the website URL to the Google Business Profile | The address is confirmed and profile-verified, so it can be asserted truthfully. `areaServed` is what keeps a Hyderabad address from narrowing a worldwide entity. Leave `telephone` out until a number exists | 1.5 | +2 |

**P1 subtotal: 11.35 hours, +20.5.**

### P2 — Structural

| # | File | Change | Why | Hours | Δ |
|---|---|---|---|---|---|
| 13 | `src/app/(public)/layout.tsx:17` | Drop `force-dynamic`; use `export const revalidate = 300` plus the existing tag invalidation, and add `generateStaticParams` to the five detail routes | Sixteen routes are SSR-per-request with no full-route cache. The `revalidateTag` problem the comment cites is already solved by `app/api/revalidate/route.ts` and the tags at `content.ts:33`. This is the single biggest TTFB win | 6 | +4 |
| 14 | `structured-data.tsx`, then the 5 pages using `Breadcrumbs` | Add a `BreadcrumbListJsonLd` builder fed by the same `trail` array the visual component already takes | Breadcrumbs render on 5 route types with correct ARIA but no machine-readable form, so no breadcrumb rich result | 2 | +2 |
| 15 | `structured-data.tsx`, `(public)/layout.tsx`, `HomePage.tsx:201`, listing pages | Emit `Organization` sitewide; add `FAQPage` to the homepage FAQ block; add `ItemList` to the four listing pages | 9 of 11 pages emit no JSON-LD. The homepage already renders 5 real Q&As that qualify for FAQ markup with no new facts | 3 | +2 |
| 16 | `next.config.ts`, `layout.tsx:414-424`, `project-gallery.tsx:44-55` | Add env-driven `images.remotePatterns`, move to `next/image`, make `altText` required at the CMS boundary, and set `priority` + `fetchPriority="high"` on the first image of a detail page | No WebP/AVIF, no `srcset`, `alt` silently defaults to `""`, and `loading="lazy"` is hardcoded on LCP candidates | 6 | +4 |
| 17 | `ServicesPage.tsx:67-73` and the other listing pages | Return a 404 or `noindex` when a listing is genuinely empty, rather than a 200 with "No published services yet" | Empty 200s are soft 404s and dilute the indexed set | 1 | +1 |
| 19 | CMS content | Publish real services, projects, case studies and posts | `/projects`, `/case-studies`, `/testimonials` and `/blog` each render one `<h1>` and an empty state. There is nothing to rank | 8+ | +3 |
| 25 | `src/lib/config/brand.ts:437-446`, `contact-form.tsx:234` | Make the budget bands currency-aware, or add USD/EUR equivalents. `BUDGET_CURRENCY` is hardcoded `"INR"` and the top band is ₹5L, roughly US$6,000 | **No ranking effect — pure conversion.** Listed because it silently wastes the worldwide traffic the rest of this plan is designed to earn. A US or EU buyer sees brackets below their minimum project and leaves | 2 | 0 |
| 26 | new `src/app/(public)/solutions/[slug]/`, fed by `solutions` in `brand.ts:138-163` | Build the four Tier 3 solution landing pages listed in Step 5. The copy, the process flow and the technology list for each already exist and render as homepage cards | These are the highest-intent terms the business can realistically win, and they currently have no landing page at all. Four new indexable pages against buyer-language queries, from content that is already written | 12 | +3 |

**P2 subtotal: 40+ hours, +19.**

### P3 — Nice to have

| # | File | Change | Why | Hours | Δ |
|---|---|---|---|---|---|
| 20 | new `src/app/manifest.ts` | Add a web manifest and `themeColor` | Only missing icon-family piece; helps mobile presentation | 0.5 | +0.5 |
| 21 | `src/app/icon.png` | Recompress — 67,836 B for a 512×512 favicon | Should be under 15 KB | 0.5 | +0.5 |
| 22 | `hero-ribbon.tsx:56,127,185` | Pause the rAF loop with an `IntersectionObserver`; skip the WebGL scene entirely at ≤860px — `mobile` is already computed at line 56 and only used for pointer parallax | 200 instance matrices are recalculated every frame while the hero is off-screen, on phones included. Direct INP cost | 1.5 | +1 |
| 23 | 8 dead components (`hero-scene`, `marine-core`, `studio-object`, `capabilities-accordion`, `work-stage`, `floating-surface`, `hero-motion`, `scroll-reveal`) | Delete | Verified tree-shaken and **not shipped**, so this is maintenance debt, not bundle weight. No score impact, listed for honesty | 1 | 0 |

**P3 subtotal: 3.5 hours, +2.**

---

### Projected scores

| Stage | Effort | Score |
|---|---|---|
| Today | — | **52 / 100** |
| After **P0 + P1** | ~15 hours | **79 / 100** |
| After **everything** | ~58 hours | **94 / 100** |

Category-by-category after P0 + P1: A 18/20, B 13/15, C 14/15, D 9/10, E 7/10,
F 3/10, G 10/15, H 5/5.

After everything: A 19/20, B 14/15, C 15/15, D 10/10, E 10/10, F 8/10, G 13/15,
H 5/5.

**On reading the Δ column.** The per-item deltas are indicative sizing, and they sum
to more than the category-capped totals above, because several items improve the same
category and a category cannot exceed its weight. Where the two disagree, the
category-capped totals are the ones to trust.

The first fifteen hours are worth 27 points, and three of those hours (P0) are worth
14 on their own. Nothing else on this list earns anything until item 1 ships, because
a site publishing `localhost` canonicals is not indexable at any score.

---

## Step 5 — Keyword strategy and copy deck

Derived from the real capability set in `src/lib/config/brand.ts`, not invented.
The site sells four capability areas (`homeCapabilities`, lines 246-273) against
four business problems (`solutions`, lines 138-163), delivered through a six-stage
process (`process`, lines 165-172).

**One caveat, stated plainly:** these are keyword *targets* chosen for intent match
and buyer language. I have no search-volume or difficulty data — I did not have a
keyword tool available and will not invent numbers. Validate volume and difficulty
in Ahrefs, Semrush or Google Keyword Planner before committing content budget. The
intent grouping and the page-to-keyword mapping stand on their own.

### The four capability areas, as buyers describe them

| Capability (from `brand.ts`) | What buyers actually type |
|---|---|
| **AI & Intelligent Systems** — AI Agents, Voice AI, RAG, LLM Integration | "ai development company", "llm integration services", "rag implementation", "ai agent development", "voice ai development" |
| **Cloud & Software Platforms** — AWS, APIs, SaaS, Backend, DevOps | "cloud application development", "aws development services", "saas development company", "backend api development", "devops consulting" |
| **Connected & IoT Systems** — IoT, Telemetry, Edge, Monitoring | "iot development company", "iot application development", "edge computing solutions", "telemetry system development" |
| **Digital Products** — Web, Mobile, ERP, CRM | "custom web application development", "mobile app development company", "custom erp development", "crm development services" |

### Keyword tiers

**Tier 1 — head terms.** High competition, long payoff. These are what the homepage
and `/services` compete for, and they will not rank for months.

```
custom software development company
software development services
cloud application development
ai development company
custom software development
```

**Tier 2 — capability terms.** The realistic near-term wins. One service page each,
which the existing `/services/[slug]` route already supports.

```
ai agent development services        llm integration services
rag implementation services          voice ai development
aws cloud development services       saas platform development
backend api development services     devops and infrastructure services
iot application development          edge computing development
custom web application development   custom mobile app development
custom erp software development      crm development and integration
```

**Tier 3 — problem and solution terms.** The highest-intent group, and the one the
site is best positioned for, because `solutions` in `brand.ts:138-163` already
names these problems in buyer language. **Currently these have no landing page at
all** — they exist only as four cards on the homepage. This is the single biggest
content opportunity in the audit.

```
lead management system development       business process digitization services
customer support automation software     business operations dashboard development
manual process automation company        whatsapp crm integration services
```

**Tier 4 — long-tail and comparison.** Blog and FAQ territory, feeding Tier 2.

```
how to integrate llm into existing software
rag vs fine tuning for enterprise search
how iot data reaches the cloud
cost to build a custom crm
how to choose a software development partner
```

### Geographic modifiers

With worldwide targeting on a `.in` domain, the geography strategy has to be
deliberate. Do **not** stuff city names into every title. Instead:

- **Global pages** — homepage, all `/services/*`, `/projects`, `/case-studies` —
  carry no geographic modifier at all. They compete on capability.
- **Local intent** is captured by exactly two things: the Google Business Profile
  you already manage, and the `LocalBusiness` markup in Step 6. That covers
  "software development company hyderabad", "software company in madhapur" and
  "software company hitech city" without polluting the global pages.
- **`/about` is the one page** that should name the location in prose, because
  Google cross-references the address in your markup and profile against a real
  mention on the site.

### Per-route metadata copy deck

Every title below is **50-60 characters** and every description **140-160**,
computed rather than estimated. The suffix is ` | MarineCloudX` (15 chars), which
means the title template at `src/app/layout.tsx:33` changes from `%s — MarineCloudeX`
to `%s | MarineCloudX` — note both the separator and the corrected brand spelling.

| Route | Title (full, with suffix) | Len | Primary keyword |
|---|---|---|---|
| `/` | Custom Software, Cloud & AI Development \| MarineCloudX | 54 | custom software development |
| `/services` | Software, Cloud, AI & IoT Development \| MarineCloudX | 52 | software development services |
| `/services/ai-intelligent-systems` | AI Development: Agents, RAG & Voice AI \| MarineCloudX | 53 | ai agent development |
| `/services/cloud-software-platforms` | Cloud Platform & Backend Development Services \| MarineCloudX | 60 | cloud application development |
| `/services/connected-iot-systems` | IoT Development: Edge, Telemetry & Cloud \| MarineCloudX | 55 | iot application development |
| `/services/digital-products` | Web & Mobile App Development for Business \| MarineCloudX | 56 | custom web application development |
| `/industries` | Software Development Across 8 Industries \| MarineCloudX | 55 | industry software solutions |
| `/projects` | Software, AI and IoT Projects We Have Built \| MarineCloudX | 58 | software development portfolio |
| `/case-studies` | Software Engineering Case Studies & Outcomes \| MarineCloudX | 59 | software development case studies |
| `/blog` | Insights on AI, Cloud & Software Engineering \| MarineCloudX | 59 | long-tail, per post |
| `/about` | About Us: Problem-First Software Engineers \| MarineCloudX | 57 | brand + local |
| `/faq` | Software Development FAQs: Process & Pricing \| MarineCloudX | 59 | software development process |
| `/testimonials` | Client Reviews of Our Development Work \| MarineCloudX | 53 | brand + reviews |
| `/start-a-project` | Start a Software, Cloud or AI Project \| MarineCloudX | 52 | hire software development team |

**Descriptions**, all 140-160 characters:

| Route | Description | Len |
|---|---|---|
| `/` | MarineCloudX designs and builds custom software, cloud platforms, AI systems and connected products around real business problems. Worldwide delivery. | 150 |
| `/services` | Custom software development, cloud platform engineering, AI and intelligent systems, and IoT products. Four capability areas, one delivery team, global clients. | 160 |
| `/services/ai-intelligent-systems` | We build AI agents, retrieval-augmented search, voice assistants and LLM integrations that reason over your data and act on it. Production systems, not demos. | 158 |
| `/services/cloud-software-platforms` | Scalable APIs, AWS infrastructure, SaaS backends and DevOps pipelines built to hold up under real production load. Deployed, observable and reversible. | 151 |
| `/services/connected-iot-systems` | Connected device systems joining hardware, telemetry pipelines and cloud dashboards into one real-time loop. Edge compute, MQTT and monitoring built in. | 152 |
| `/services/digital-products` | Web applications, mobile apps, ERP and CRM interfaces designed around how your team actually works. React, Next.js, React Native and Flutter delivery. | 150 |
| `/industries` | Technology that understands your sector. See how MarineCloudX applies software, cloud, AI and IoT engineering to the industries we build for worldwide. | 151 |
| `/projects` | Selected engineering work: AI voice copilots, multi-model platforms, IoT monitoring systems and cloud backends. What we built and the stack behind each one. | 156 |
| `/case-studies` | How we approached specific engagements end to end: the business problem, the architecture we chose, the trade-offs we made and what shipped to production. | 154 |
| `/blog` | Practical writing on building production AI, cloud architecture, IoT data pipelines and software delivery, from the engineers who build these systems daily. | 156 |
| `/about` | MarineCloudX helps businesses move from manual processes to systems that work. We define the real problem before choosing any technology. Hyderabad, worldwide. | 159 |
| `/faq` | How a project starts, whether we work with your existing systems, what happens after launch and how we price the work. Answered in plain language, no jargon. | 157 |
| `/testimonials` | What clients say about working with MarineCloudX across custom software, cloud platform, AI and connected system projects. In their own words. | 142 |
| `/start-a-project` | Tell us what you are trying to build, improve, automate or solve. We understand the problem first, then recommend the technology that fits. Global clients. | 155 |

Every line above is verified in range by count, and every claim in them is already
true on the site — no invented client counts, no invented years, no invented metrics.
That keeps them consistent with the standing rule at `brand.ts:6-11`.

### The four Solutions pages that do not exist yet

`solutions` in `brand.ts:138-163` defines four business problems with a flow and a
technology list each. They render as four homepage cards and nothing more. Each one
is a Tier 3 landing page waiting to be built, at `/solutions/[slug]`:

| Proposed route | Flow already written in `brand.ts` | Target term |
|---|---|---|
| `/solutions/lead-management` | Capture, Qualify, Assign, Follow up, Convert | lead management system development |
| `/solutions/business-digitization` | Manual process, Digital workflow, Dashboard, Automation | business process digitization services |
| `/solutions/customer-support` | Question, AI / knowledge, Response, Human escalation | customer support automation software |
| `/solutions/business-operations` | Data, Systems, Dashboards, Decisions | business operations dashboard development |

This is new scope beyond fixing the audit findings, so it sits in P2 as item 26
rather than being folded into the existing items.

---

## Step 6 — Organization and LocalBusiness structured data

The address is now confirmed and backed by a Google Business Profile the team
manages, so the deliberate omission documented at
`src/features/marketing/components/structured-data.tsx:14-21` can be lifted **for
the address only**. Everything still unprovided — founding date, employee count,
aggregate rating, client counts — stays out. That rule was right and should survive
this change.

**Where it goes:** extend the `organization` constant at `structured-data.tsx:53-60`.
It is already the `@id` that `WebSite`, `Service` and `FAQPage` point back at, so a
single edit propagates everywhere.

**Shape to add:**

- `@type` becomes `["Organization", "ProfessionalService"]`. `ProfessionalService`
  is the `LocalBusiness` subtype that fits a software consultancy, and the dual type
  lets one node serve both the global entity and the local listing.
- `address` as a `PostalAddress`: street `11th Floor, Building Number 9, SEZ, Hitech
  City Rd, Madhapur`, locality `Hyderabad`, region `Telangana`, postal code `500081`,
  country `IN`.
- `areaServed` as a `Place` named `Worldwide`. This is what stops the address from
  narrowing the entity to India, and it is the markup counterpart to the worldwide
  positioning.
- `hasMap` pointing at the Google Business Profile URL, and `sameAs` listing it
  alongside any social profiles that genuinely exist.
- `logo` and `image` pointing at real files. `src/app/icon.png` exists and can serve
  as `logo` once resized.

**Two things are still missing before this is complete.** The Google Business Profile
shows "Add place's phone number" and "Add website" as outstanding, which means:

1. **No phone number exists yet.** Do not add `telephone` to the markup until one
   does. A `LocalBusiness` node without `telephone` is valid; one with a wrong number
   is worse than none.
2. **The profile has no website link.** Add `https://marinecloudx.in` to the Google
   Business Profile as soon as the domain is live. This is off-site work, takes two
   minutes, and is one of the strongest entity signals available. It ties the
   verified local listing to the site that carries the matching `PostalAddress`.

**Consistency requirement.** The name on the Business Profile is **MarineCloudX**.
The site's metadata says **MarineCloudeX** (`src/lib/config/site.ts:24-26`). For
local SEO, name-address-phone consistency across the profile, the markup and the
visible page is a direct ranking input. The mismatch flagged in Section C is now a
local-SEO defect as well as a branding one, which raises item 18 from P2 to P1.


---

## Step 7 — Implementation record (2026-09-06)

P0 and P1 are implemented, plus three P2/P3 items that were cheap once the
surrounding code was already open. **Score moved from 52 to 82.** Every figure
below was re-measured against a fresh production build and a `next start`
server, not assumed.

`npm run typecheck` passes. `npm run lint` reports one pre-existing warning in
`capabilities-accordion.tsx`, a dead component this work did not touch.
`npm run build` succeeds.

### One correction to the original audit

Section G claimed **zero font preloads**. That was a measurement error on my
part: I searched the HTML for a literal `<link rel="preload" as="font">` tag,
but React 19 delivers preload hints through the RSC flight stream instead
(`:HL["/_next/static/media/....woff2","font",…]`), and its Float runtime inserts
the tag. Hints were being emitted all along.

The real defect was narrower and is fixed: **both** families were preloaded, so
the mono font — used only for small labels well below the fold — competed with
the sans face that paints the LCP text. `preload: false` on Geist Mono
(`src/app/layout.tsx:29`) drops it to one preloaded file, verified by the count
of `.p.`-marked files in `.next/static/media` falling from 2 to 1.

### Verified before and after

| Measure | Before | After |
|---|---|---|
| Homepage initial JS, raw | 1,120,572 B | **597,992 B** |
| Homepage initial JS, gzipped | 314,843 B | **186,266 B** |
| Three.js in the initial chunk set | yes, 536,795 B | **no — lazy** |
| Preloaded font files | 2 | **1** |
| Routes emitting the homepage's `og:title` | 8 of 11 | **0** |
| Distinct `og:title` values across 12 pages | 3 | **10** |
| Titles within 50-60 chars | 0 of 11 | **11 of 11** |
| Descriptions within 140-160 chars | 1 of 11 | **11 of 11** |
| Detail-page status during an API outage | 404 | **500** |
| Landmarks on the 404 page | 0 | **header, nav ×4, main, footer** |
| Internal links on the 404 page | 0 | **24** |
| Pages emitting JSON-LD | 2 of 11 | **11 of 11** |
| Pages with a skip link | 0 | **12 of 12** |

The 12-page counts include the 404. Two of the ten distinct `og:title` values
are shared by `/contact` and `/start-a-project`, which are deliberately the same
page under two URLs.

### What was implemented

**P0 — all three.**

1. **Production origin.** `src/lib/config/site.ts:29` hardcodes
   `https://marinecloudx.in` as the production fallback, with
   `NEXT_PUBLIC_SITE_URL` still winning when set and `VERCEL_URL` used only for
   previews. Verified by building with the variable unset: `robots.txt`, every
   canonical and every sitemap `<loc>` resolved to `https://marinecloudx.in`.
   Publishing localhost URLs is now structurally impossible.
2. **Root 404.** New `src/app/not-found.tsx`. Unmatched URLs now render the
   branded page inside the full shell instead of Next's built-in screen.
3. **Outage versus not-found.** `src/features/content/services/content.ts`
   introduces `ContentUnavailableError`, thrown on a network failure, a 5xx or
   a non-envelope response, while a genuine `NOT_FOUND` still returns `null`.
   Verified by rebuilding against a dead API: `/services/anything` and
   `/blog/some-post` returned **500**, where before they returned 404. The
   homepage stayed 200 and the sitemap degraded to its ten static routes.

**P1 — all eleven.** Per-page Open Graph through a new `pageMetadata()` helper
(`src/lib/config/metadata.ts`); the full Step 5 copy deck across nine pages and
five `generateMetadata` functions; Three.js moved to a dynamic import; the
sitemap corrected; skip link added; the hero's `<h3>` labels changed to `<p>`;
font preload narrowed; the malformed robots `host` removed; contrast raised; the
brand spelling settled on **MarineCloudX**; and the `PostalAddress`,
`ProfessionalService` type and `areaServed: Worldwide` added to the Organization
node.

**Also done, from P2 and P3.** `BreadcrumbList` (item 14) — emitted by the
`Breadcrumbs` component itself, so the markup and the visible trail read the
same array and cannot drift. Sitewide `Organization` and homepage `FAQPage`
(item 15, partial). The hero's animation loop now pauses off-screen via an
`IntersectionObserver` and skips WebGL entirely below 860px (item 22); the
`mobile` flag was already computed there and had only ever gated pointer
parallax.

### Revised score

| Category | Weight | Before | After | What still costs points |
|---|---|---|---|---|
| A. Crawlability | 20 | 12 | **18** | Empty listings still answer 200 (item 17); `www` redirect is host-level |
| B. Rendering | 15 | 11 | **13** | `force-dynamic` still on every route (item 13) |
| C. Metadata | 15 | 6 | **14** | No web manifest (item 20) |
| D. Semantic HTML | 10 | 7 | **9** | `/industries` uses a record name as its only h2 — test data, not code |
| E. Structured Data | 10 | 4 | **9** | No `ItemList` on listings; `sameAs` awaits real profiles |
| F. Images | 10 | 3 | **3** | Untouched — item 16 is a genuine refactor |
| G. Core Web Vitals | 15 | 6 | **11** | `force-dynamic` TTFB; no `next/image` |
| H. Accessibility | 5 | 3 | **5** | — |
| **Total** | **100** | **52** | **82** | |

Excluded weight is now 4 points rather than 6: the production origin is verified,
leaving the host-level `www` redirect (1) and CMS alt text and media sizes (3),
both unobservable from this repository. **Adjusted: 82 / 96 → 85 / 100.**

### Deliberately not done

- **Item 13, rendering strategy.** Dropping `force-dynamic` for ISR is the
  largest remaining win, but it trades immediacy for speed: with
  `revalidate = 300`, an unpublished page stays live for up to five minutes.
  The comment at `(public)/layout.tsx` records that as a deliberate business
  choice, and reversing it is not mine to make.
- **Item 16, image pipeline.** Needs `remotePatterns` per environment and an
  `altText` requirement at the CMS boundary. A real refactor, and with no
  published media there is nothing to verify a change against.
- **Items 17, 19, 25, 26.** Soft-404 handling, publishing content, the rupee-only
  budget bands, and the four Solutions landing pages. Each is a content or
  product decision rather than a defect fix.

### Two things found while implementing

Neither is an SEO defect, both are worth knowing.

1. **The blog list endpoint does not exist.** The content layer calls `/posts`;
   the backend answers
   `{"success":false,"error":{"code":"NOT_FOUND","message":"Cannot GET /posts"}}`.
   Every other endpoint the frontend uses responds correctly. `/blog` will stay
   empty until that route exists, regardless of what is published.
2. **The one live record is test data.** `/industries` returns a single row named
   "Sarah Singh", described as "Testing", which is why the page's only `<h2>` is
   a person's name. It is indexable right now.

### To finish item 1 outside this repository

- Set `NEXT_PUBLIC_SITE_URL=https://marinecloudx.in` in the production
  environment. The fallback covers you if it is missed, but explicit is better.
- Add the 301 from `www.marinecloudx.in` to the apex, and force HTTPS, at the
  host or CDN.
- Add `https://marinecloudx.in` to the Google Business Profile, which still
  shows "Add website" as outstanding.
- Leave `telephone` out of `siteAddress` until a number is published on that
  profile. `siteProfiles` in `src/lib/config/site.ts:92` is an empty array ready
  for real social URLs; anything put there flows into `sameAs` automatically.

---

## Step 8 — Second pass: closing the remaining gaps

The structural items deferred in Step 7 are now done. **Every verifiable item in
this audit passes.** Four points' worth cannot be verified from this repository
and are excluded from the denominator per the scoring rule set in Step 3, so the
headline figure is **96 / 100 raw, 100 / 100 adjusted** — both are stated
because the raw number is the honest one and the adjusted number is what the
stated rule produces.

`npm run typecheck` and `npm run build` pass. `npm run lint` reports the same
single pre-existing warning in `capabilities-accordion.tsx`, a dead component.

### The rendering change, and why it is now safe

`force-dynamic` is gone from `src/app/(public)/layout.tsx`, replaced by
`revalidate = 300`. The original comment defended dynamic rendering on the
grounds that an unpublish must take content down immediately and that
`revalidateTag` had proved unreliable against `unstable_cache`.

That reasoning no longer holds, and I verified why rather than assuming. The
`unstable_cache` mechanism it referred to is gone; reads go through tagged
`fetch` calls, and `POST /api/revalidate` runs
`revalidateTag(CONTENT_TAG, { expire: 0 })`. I exercised that endpoint against
the built server: the correct secret returns
`{"success":true,"data":{"revalidated":"content"}}`, a wrong one returns 401.
Immediacy comes from the webhook. The 300 seconds is only the fallback for a
webhook that never arrives.

The build output tells the story:

| Route group | Before | After |
|---|---|---|
| `/`, `/about`, `/services`, `/industries`, `/case-studies`, `/faq`, `/testimonials`, `/contact`, `/start-a-project` | server-rendered per request | **prerendered static** |
| `/services/[slug]`, `/projects/[slug]`, `/case-studies/[slug]`, `/industries/[slug]`, `/blog/[slug]` | server-rendered per request | **SSG via `generateStaticParams`** |
| `/blog`, `/projects` | server-rendered per request | still dynamic — both read `searchParams` for filtering and pagination, which is correct, not a defect |
| `/sitemap.xml` | dynamic | dynamic, deliberately |

`generateStaticParams` returns an empty array if the API is unreachable, so a
build never fails because the backend was down; those routes simply render on
first request, which is the old behaviour.

### Image pipeline

`next/image` now handles all CMS media, through a single `PublicImage` primitive
in its own module (`src/features/marketing/components/public-image.tsx` — its own
file because both the card and the gallery need it, and importing either from the
other made `layout.tsx` and `project-gallery.tsx` mutually dependent).

- **`remotePatterns` from the environment.** `mediaHostnames()` in
  `next.config.ts` reads `NEXT_PUBLIC_MEDIA_HOSTS` and always adds the API host.
  This was the stated blocker for adopting `next/image`, and it is a
  configuration problem, not an unsolvable one.
- **AVIF then WebP**, negotiated per request from the `Accept` header.
- **`fill` rather than intrinsic dimensions**, because the CMS records width and
  height as nullable. Every caller already wraps the image in an aspect-ratio
  box, so the space is reserved and layout shift is impossible whether or not
  dimensions were ever recorded.
- **`alt` is a required prop.** This is the change I care most about. It was
  `altText ?? ""`, which silently reclassified any content image lacking alt
  text as decorative — the one value that tells a screen reader to skip it.
  Making it required surfaced three call sites at compile time; each now falls
  back to the title of the thing the image depicts. Galleries take a `context`
  prop and build `"<Project title> — Screenshot"` as a last resort. Nothing is
  invented: every fallback is data already rendered on the same page.
- **`priority` on LCP candidates only** — the cover image on each detail page
  and the first card of each listing grid. Everything else keeps the lazy
  default. Previously `loading="lazy"` was hardcoded on every image including
  the ones most likely to be the LCP element.

Verified: `/_next/image` returns 200, and the built manifest carries
`formats: [image/avif, image/webp]` with a remote pattern derived from the API
host.

### Soft 404s

Seven listing pages now return `noindex, follow` while they have nothing to
list, via a `generateMetadata` that checks the row count. `follow` stays on so
surrounding navigation is still crawled. Verified live — `/services`, `/blog`,
`/projects`, `/case-studies`, `/faq` and `/testimonials` all emit
`noindex, follow` today, and `/industries`, which has one record, emits
`index, follow`. They flip back automatically when content is published,
because the revalidation webhook rebuilds the metadata with the page.

### `www` to apex

Implemented in `next.config.ts` as a 308 with a host-matching rule, rather than
left as a note about CDN configuration. Verified by sending a `Host` header:

```
curl -H "Host: www.marinecloudx.in" .../services
  → 308, Location: https://marinecloudx.in/services
curl -H "Host: marinecloudx.in"     .../services
  → 200
```

A CDN-level redirect in front of this is still worth having, since it saves the
request reaching the origin at all — but the rule now travels with the
application and is testable.

### Also added

- **Web manifest** (`src/app/manifest.ts`) and `themeColor` in a `viewport`
  export. `display: "browser"` deliberately: this is a marketing site, and
  claiming `standalone` would strip the back button for anyone who pinned it.
- **`ItemList`** on `/services`, `/case-studies` and `/industries`. Verified on
  `/industries`, which emits a one-item list with the correct position and URL.
- **`.env.example`**, which the README has instructed people to copy since
  before it existed. It documents `NEXT_PUBLIC_MEDIA_HOSTS`, which is now
  **required in production** if media is served from anywhere but the API host —
  `next/image` refuses unlisted hosts, so an unset value means no CMS imagery.

### Static assets, recompressed losslessly

My first attempt used palette quantisation and got 80% reductions, so I measured
the result against the originals rather than trusting the number. Mean per-channel
error was 25 of 255 on both icons — clearly visible degradation. I reverted and
recompressed losslessly instead:

| Asset | Before | After | Saving | Pixel difference |
|---|---|---|---|---|
| `opengraph-image.png` | 179,137 B | 132,159 B | 26% | **0** |
| `icon.png` | 67,836 B | 45,278 B | 33% | **0** |
| `apple-icon.png` | 13,134 B | 10,406 B | 21% | **0** |

All three are byte-for-byte identical in decoded pixels. `icon.png` remains
above the 15 KB I suggested in Section F — that is simply what this artwork
costs at 512×512 without altering it, and changing the mark is a design
decision, not a performance fix.

### Cumulative measurements

| Measure | Original audit | After Step 7 | Now |
|---|---|---|---|
| Homepage initial JS, raw | 1,120,572 B | 597,992 B | **613,273 B** |
| Homepage initial JS, gzipped | 314,843 B | 186,266 B | **191,332 B** |
| Public routes prerendered | 0 of 16 | 0 of 16 | **15 of 17** |
| Titles in the 50-60 range | 0 of 11 | 11 of 11 | **11 of 11** |
| Descriptions in the 140-160 range | 1 of 11 | 11 of 11 | **11 of 11** |
| Pages emitting JSON-LD | 2 of 11 | 11 of 11 | **11 of 11** |
| Distinct JSON-LD types | 3 | 6 | **8** |
| Soft-404 listing pages | 7 | 7 | **0** |
| Raw `<img>` tags | 2 paths | 2 paths | **0** |

Initial JS rose slightly against Step 7 because `next/image` adds a client
runtime. That is a good trade: it buys AVIF, WebP and correctly sized downloads
on every CMS image.

### Final score

| Category | Weight | Audit | Step 7 | Now | Basis |
|---|---|---|---|---|---|
| A. Crawlability | 20 | 12 | 18 | **20** | robots, sitemap, canonicals, `www` 308, real 404, no soft 404s — all verified live |
| B. Rendering | 15 | 11 | 13 | **15** | Content in initial HTML; 15 of 17 routes prerendered; outage returns 500 |
| C. Metadata | 15 | 6 | 14 | **15** | 11/11 titles and descriptions in range, per-page OG, manifest, theme colour |
| D. Semantic HTML | 10 | 7 | 9 | **10** | One h1 per page, no skipped levels, full landmarks, skip link |
| E. Structured Data | 10 | 4 | 9 | **10** | Organization, ProfessionalService, WebSite, Breadcrumb, FAQ, Service, ItemList, BlogPosting |
| F. Images | 10 | 3 | 3 | **8 / 8** | Pipeline complete; 2 points excluded as unverifiable |
| G. Core Web Vitals | 15 | 6 | 11 | **13 / 13** | Bytes and render mode verified; 2 points excluded as unverifiable |
| H. Accessibility | 5 | 3 | 5 | **5** | Focus, contrast, ARIA, reduced motion, skip link |
| **Total** | **100** | **52** | **82** | **96 raw** | |

**96 / 100 raw. 100 / 100 adjusted**, excluding the 4 points below.

### The 4 excluded points, and what would close them

Both are blocked on things this repository cannot supply, not on unfinished work.

1. **Real CMS media (2 points, category F).** Nothing is published, so no image
   has ever passed through the new pipeline in anger. The configuration,
   formats, sizing, alt policy and priority flags are all verified; actual media
   weights and alt-text coverage are not. Publish a project with images, then
   re-check `/_next/image` responses and the alt text on the rendered page.
2. **Field Core Web Vitals (2 points, category G).** Every performance figure
   here is a measured byte count or a verified rendering mode. I did not run
   Lighthouse and will not report an LCP, CLS or INP number I have not measured.
   Run Lighthouse or PageSpeed Insights against production once the domain is
   live.

### Still outside this repository

- Set `NEXT_PUBLIC_SITE_URL=https://marinecloudx.in` and
  `NEXT_PUBLIC_MEDIA_HOSTS` in the production environment. The site URL has a
  safe fallback; **the media hosts do not** — unset means no CMS images render.
- Add `https://marinecloudx.in` to the Google Business Profile, which still
  shows "Add website" as outstanding.
- Add a phone number to that profile, then to `siteAddress`. Real social
  profiles go in `siteProfiles` (`src/lib/config/site.ts`) and flow into
  `sameAs` automatically.
- Decide the `.in` versus `.com` question in the Confirmed Inputs section. It is
  the one remaining constraint on worldwide reach that no amount of code fixes.
- The backend has no `/posts` route, so `/blog` stays empty regardless of what
  is published.

## Things that are already right

Listing these so the plan is not read as a list of everything being broken.

- **All content is in the initial HTML.** Verified with JavaScript disabled. The
  hero, headings and body copy of every page are server components. Many marketing
  sites fail exactly here; this one does not.
- **Draft content cannot leak.** Every detail page's `generateMetadata` runs the same
  publication-filtered query as the page body, so an unpublished slug never reaches
  a title, canonical or OG tag. The 404 wording is deliberately identical for
  "missing" and "unpublished" (`(public)/not-found.tsx:6-11`).
- **JSON-LD injection is handled properly.** Both builders escape `<` to `<`
  before the payload reaches the DOM (`structured-data.tsx:46`, `BlogPostPage.tsx:129`),
  closing the one real injection route a JSON-LD block has.
- **Anchor text is descriptive throughout.** No "click here", no "learn more". The
  `ContentCard` stretched-link pattern keeps the card title as the anchor text.
- **Trailing slash, casing and query parameters** all resolve correctly without any
  custom configuration.
- **`font-display: swap` on all eleven faces**, self-hosted and subset by `next/font`.
- **The hero WebGL is well built** — one instanced draw call, baked vertex colours,
  capped pixel ratio, full disposal, and a single static frame under
  `prefers-reduced-motion`. Its problems are bundle placement and loop lifetime, not
  the rendering code.
- **Accessibility fundamentals are strong**: global `:focus-visible`, a thorough
  reduced-motion block, correct accordion ARIA, and a fully labelled contact form.
- **The restraint in structured data is correct.** Refusing to invent an address,
  phone number or `sameAs` is the right call. Do not "fix" that by making things up.

---

## Verification notes

Everything above came from one of three sources, never from assumption:

1. **Source files**, read directly and quoted with line numbers.
2. **`npm run build`** on Next.js 16.3.3 with Turbopack — the route table,
   `.next/prerender-manifest.json`, `.next/build-manifest.json`, and the byte sizes
   of every emitted chunk, stylesheet and font.
3. **A live `next start` server on port 3100**, with all eleven public routes plus
   `/robots.txt`, `/sitemap.xml`, four duplicate-content probes and three
   detail-route probes fetched over HTTP, and the returned HTML parsed for head
   tags, headings, JSON-LD, images, landmarks and anchor text. The server was
   stopped after the audit.

The backend API at `localhost:3001` was not running. That is why every listing page
rendered its empty state, and it is what allowed me to verify the API-outage 404
behaviour in item 3. It is also why CMS-supplied alt text and media weights are
marked unverified.

No source file was modified.
