# @marinecloudex/frontend

SMIVORA / MarineCloudeX **public website** — Next.js (App Router, RSC), Tailwind.
API-driven: every read comes from the NestJS backend over HTTP. **No database
access, ever.**

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

<!-- ```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:3000 -->

Self-contained: own `package.json`, lockfile, tsconfig, lint and Next config.
The shared wire contract is a committed copy at `src/contracts/` — regenerate it
from the repo root with `npm run sync:contracts`.

Public pages, SEO files and marketing components move here from the legacy `src/`
app in Phase 12 of `docs/monorepo-migration-plan.md`.
