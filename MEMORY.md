# MEMORY.md

## Identity

Arpit is presented as a **BTech AI/ML Student · Developer · Builder** exploring the intersection of AI, code, and creative digital experiences.

## Current architecture

The app is a static Vite + React + TypeScript site. `Home.tsx` contains the single-page portfolio sections and small reusable components. `data/content.ts` is the source of truth for all portfolio content. `index.css` is the source of truth for the visual system and responsive behavior.

## Visual direction

The site uses a premium dark editorial direction inspired by modern creative-tech portfolios without cloning any reference. It combines deep navy, charcoal, violet, peach, mint, and lavender with Space Grotesk, Manrope, and DM Mono. The hero uses an original CSS orbital system rather than an external image or 3D dependency.

## Motion decisions

IntersectionObserver drives lightweight reveal animations. The hero visual has pointer-reactive parallax. Navigation becomes translucent and blurred after scroll; a scroll progress line stays at the top. A subtle custom cursor is desktop-only. `prefers-reduced-motion` makes the page effectively static.

## Content state

The public GitHub profile URL is `https://github.com/awakenedarpit`. The named project concepts in the brief (Campus Grid, Prism, Vox, and COSMOS) are represented as explicitly editable entries because the configured GitHub API returned 404 for the requested account during this build. Their descriptions do not claim unverified outcomes. LinkedIn and email remain visible TODO placeholders because no real values were available.

## Deployment

The scaffold is Vercel-ready and requires no environment variables. Run `pnpm run build`, then import the repository into Vercel with the default Vite settings.

## Known limitations

Project links currently point to the GitHub profile rather than unverified individual repositories. No contact form is implemented; the page provides GitHub and clearly marked placeholders for LinkedIn and email.

## Future ideas

Replace the editable project entries with confirmed repository URLs and screenshots, add verified LinkedIn/email links, and optionally add a small static Open Graph image once the personal brand mark is final.

## Pending user decisions

- Confirm project descriptions, repository URLs, live demo URLs, and imagery.
- Supply LinkedIn URL and preferred email address.
