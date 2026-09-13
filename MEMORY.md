# MEMORY.md

## Project identity

This repository is the public portfolio for **Arpit Raj**, a BTech AI/ML student, developer, and builder exploring the intersection of AI, code, and creative digital experiences.

Repository: `https://github.com/awakenedarpit/Portfolio`
Working directory: `/home/ubuntu/Portfolio`
Branch: `main`
Latest commit at handoff: `750bac0 Improve certificate editor visibility`

## Stack and architecture

The app is a static React 19 + TypeScript + Vite frontend using Tailwind 4, Lucide icons, Supabase JS, and a custom CSS design system in `client/src/index.css`. The public page is assembled in `client/src/pages/Home.tsx`. The authenticated editor is in `client/src/pages/Admin.tsx`. Supabase helpers and types live in `client/src/lib/supabase.ts`. Centralized fallback content is in `client/src/data/content.ts`.

The `server/` directory is template infrastructure and should not be modified for frontend work. Large media assets should not be added to `client/public`; project media uses Supabase Storage.

## Visual direction and motion

The public site uses a premium dark editorial creative-tech direction with deep navy, charcoal, violet, peach, mint, and lavender. Typography blends Space Grotesk, Manrope, and DM Mono. The hero uses a CSS orbital system, not an external 3D dependency. IntersectionObserver powers reveal animations, the hero has pointer-reactive parallax, navigation becomes translucent after scroll, and a desktop-only custom cursor is present. Reduced-motion preferences are respected.

## Local preview

The development server normally runs on port `4173` bound to `0.0.0.0`:

- Public preview: https://4173-iq2pyq8c40n2xneop0yna-6ef0d6bb.sg2.manus.computer/
- Admin preview: https://4173-iq2pyq8c40n2xneop0yna-6ef0d6bb.sg2.manus.computer/admin
- Local URL: `http://localhost:4173/`

The preview process may stop between sessions. Restart with:

```bash
cd /home/ubuntu/Portfolio
pnpm dev --host 0.0.0.0 --port 4173
```

Verify both routes with `curl -I http://127.0.0.1:4173/` and `curl -I http://127.0.0.1:4173/admin`.

## Supabase configuration

Local environment is in `/home/ubuntu/Portfolio/.env.local` and uses the active Supabase project `toqxzvwdrlcnziehrpcz.supabase.co`. The browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Tables:

- `portfolio_projects`
- `portfolio_project_images`
- `portfolio_certifications`

Storage bucket:

- `project-images`

Project images use `project-images/{project-slug}/...`. Legacy certification proof images may exist under `project-images/certifications/{certification-id}/...`, but the current certification UI intentionally does not use photos.

The certifications table has legacy columns (`caption`, `issuer`, `issue_date`, `credential_url`, `image_url`) and the current `linkedin_url` column. Public access was fixed with:

```sql
grant usage on schema public to anon, authenticated;
grant select on public.portfolio_certifications to anon, authenticated;
create policy portfolio_certifications_public_read on public.portfolio_certifications for select to anon, authenticated using (true);
```

## Current public page

`Home.tsx` includes the fixed responsive navigation, hero, About, Currently Building, Skills, Projects, Hackathons, Journey, Certifications, GitHub CTA, Contact, and Footer sections.

Projects have a full preview gallery rendered through a portal so it is not clipped by card overflow. The gallery supports selected main thumbnail, thumbnail navigation, previous/next controls, and a full-screen preview panel.

The public Certifications section is intentionally simplified: each row displays the certificate name and a right-aligned **View this certificate on LinkedIn** button. It loads current rows with `fetchPortfolioCertifications()` in `client/src/lib/supabase.ts`, selecting `id,title,caption,linkedin_url,issuer,issue_date,credential_url,image_url,sort_order` and ordering by `sort_order`.

## Current admin workflow

The admin dashboard is Supabase-authenticated. If `/admin` shows the login screen, the authenticated editor is not mounted until the user signs in. After sign-in, a visible **Certifications** shortcut in the header links to the `#certifications` editor anchor.

The current desired certification workflow is:

- Click **Add certificate**
- Enter **Certificate name**
- Enter **LinkedIn certificate URL**
- Click **Save**
- Optionally reorder or delete certificates

The public site then shows the name and LinkedIn button. Do not reintroduce photo upload or caption fields unless Arpit explicitly requests that again.

Project gallery admin controls support upload, set main thumbnail, reorder, and delete. Main thumbnail is stored in `portfolio_projects.thumbnail_url`. Image order is stored in `portfolio_project_images.sort_order`. Reordering uses temporary positions before final positions to avoid concurrent sort-order collisions.

## Validation workflow

Run after meaningful frontend changes:

```bash
cd /home/ubuntu/Portfolio
pnpm run check
pnpm run build
```

Both passed at the latest completed implementation. The build may warn that a JavaScript chunk is larger than 500 kB; this is only a warning.

After changes, verify both preview routes, commit to `main`, and push to GitHub. Keep edits focused and do not touch `server/`.

## Recent commits

- `1147323` — Simplify certifications to LinkedIn links
- `1dde25c` — Polish certificate editor UI
- `750bac0` — Improve certificate editor visibility

Note: the working tree may include later uncommitted or newly applied changes after this memory snapshot. Always run `git status` at handoff start and update this file after committing the next meaningful change.

## Handoff notes

Arpit may switch AI/Manus sessions. Start by reading this file, checking `git status`, and verifying the port-4173 preview. The most recent user direction is to keep Certifications very simple: certificate name plus LinkedIn URL only, with a polished admin editor and a simple public row.

If a certification is not visible publicly, test the Supabase REST endpoint with the public anon key before changing UI code. The endpoint should return rows from `portfolio_certifications`; if it returns an empty array, inspect grants and the public read policy.

Do not ask Arpit to repeat repository context unless the task materially changes scope. Maintain this file after meaningful architecture, schema, workflow, or deployment changes.
