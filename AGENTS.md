# AGENTS.md

## Project purpose

This repository is a static, single-page portfolio for **Arpit**, a BTech AI/ML student, developer, and builder. It presents an original creative-tech identity around **AI × Code × Creativity** without inventing experience, achievements, project metrics, or social links.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind 4 is available from the scaffold, but the visual system is primarily authored in `client/src/index.css` for precision and maintainability.
- `lucide-react` supplies interface icons.
- No backend or external API is required.

## Architecture

`client/src/pages/Home.tsx` owns the single continuous page and its reusable section components. Content is centralized in `client/src/data/content.ts`. Global tokens, responsive rules, component styling, motion, and reduced-motion support live in `client/src/index.css`. `client/index.html` owns document metadata and favicon configuration.

## Design system

The portfolio uses a premium dark palette built from deep navy, charcoal, violet, peach, mint, lavender, and off-white. Display typography uses Space Grotesk, body copy uses Manrope, and metadata uses DM Mono. The visual language is editorial, asymmetric, textured with a fine grid, and intentionally restrained rather than neon or card-heavy.

## Animation philosophy

Motion is purposeful: section reveals are scroll-triggered, the hero orbital visual responds subtly to pointer movement, cards lift on hover, the nav changes state after scroll, and a desktop-only cursor provides a light layer of tactility. All non-essential motion is disabled or minimized for `prefers-reduced-motion`.

## Important files

- `client/src/pages/Home.tsx` — page sections and interactions
- `client/src/data/content.ts` — projects, skills, focus, hackathons, journey, and social data
- `client/src/index.css` — design tokens and responsive styling
- `client/index.html` — SEO and social metadata
- `client/public/favicon.svg` — brand favicon

## Content updates

Add or edit projects, skills, focus areas, hackathons, journey entries, and social links only in `client/src/data/content.ts`. Keep project descriptions and links factual. Empty `linkedin` and `email` values are intentional until Arpit supplies them. Do not remove the explicit TODO labels without real values.

## Adding a project

Add one object to `projects` with `title`, `category`, `description`, `technologies`, `github`, `live`, `accent`, `index`, and `featured`. The current abstract project visuals are CSS-generated, so no large local image asset is necessary. If a real image is later added, use the project storage workflow rather than committing large media to `client/public`.

## Local development

From the project root:

```bash
pnpm install
pnpm dev
```

The default dev server runs on port 3000.

## Build and deploy

```bash
pnpm run check
pnpm run build
```

The static Vite output is deployment-ready for Vercel. No environment variables are currently required. Never commit `.env.local`, tokens, or credentials.

## Preserve

Preserve the centralized content model, honest placeholders, semantic section IDs, keyboard-visible focus states, responsive layout, dark palette, reduced-motion handling, and the no-fabrication content policy.

## Avoid

Avoid introducing heavy animation libraries, fake metrics, unverified project claims, generic gradients, excessive rounded cards, autoplay media, or direct edits to generated server files. Keep the portfolio frontend-only unless a future request explicitly changes the product scope.
