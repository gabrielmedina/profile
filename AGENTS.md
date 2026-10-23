<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Routes live in `src/app`. Keep them thin: load data, export metadata, render a feature.
- Server Components are the default. Add `'use client'` only for state, effects, and browser APIs.
- Domain code lives in `src/features/<domain>`. Shared UI lives in `src/components`. Pure helpers live in `src/lib`.
- Presentation components stay presentational; business rules live in feature utils/hooks (`specs/002-component-boundaries.md`).
- Do not re-export server modules and client components from the same barrel. Import the module that owns the symbol.
- Filesystem and remote reads belong in `server-only` modules. Cache them with `use cache` and an explicit `cacheLife`.
- Validate content and external payloads at the boundary with Zod. Pages should receive typed data.
- Posts follow SEO + HTML5 rules in `specs/003-posts-seo.md`. Images follow `specs/004-images.md` (`next/image`, light WebP/JPEG).
- Architecture decisions and the refactor backlog live in `specs/`. Update a spec when a decision changes.
- Format with Prettier. Lint with the Next.js ESLint flat config (`eslint-config-next`).
