# The Humor Project — Assignments 1 and 2

One Next.js app with two distinct Git commits. The Week 1 commit renders a Hello World page. The Week 2 commit adds a Supabase-backed list page.

## Run locally

1. Install dependencies: `npm install`
2. In your Supabase project, open SQL Editor and run [`supabase/setup.sql`](supabase/setup.sql). It creates `caption_ideas`, enables RLS, permits public *read only* access, and inserts three sample rows.
3. Copy `.env.example` to `.env.local` and replace both example values with your project's **Project URL** and **anon or publishable key**. Do not use a secret or service role key. `.env.local` is gitignored.
4. Run `npm run dev` and open the local URL. The page should show three rows from Supabase.

## Deploy on Vercel

Push and deploy the Week 1 commit first, and record its specific deployment URL. Then push the Week 2 commit and deploy again. Under the Vercel project's Environment Variables, add `SUPABASE_URL` and `SUPABASE_ANON_KEY` for Production (and Preview if needed) before the Week 2 deployment. Open its URL in an Incognito window and confirm the rows appear. In Vercel Deployment Protection settings, disable protection for the assignment's public deployments as instructed by the course. Submit each deployment's **specific URL**, rather than only the mutable production alias.

## Git history

- `Week 1: deployable Hello World Next.js app` — use its Vercel deployment URL for Assignment 1.
- `Week 2: read Supabase caption ideas` — use its later Vercel deployment URL for Assignment 2.

Both assignments also require the relevant week's Humor Study separately.
