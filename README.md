# The Humor Project — Weeks 1–3

One Next.js app. Week 2's public Supabase caption list remains at `/`; Week 3 adds Google sign-in, a private `/members` route, a `/profile` editor, and a profile photo upload to Supabase Storage.

## Week 3 setup in the existing Supabase project

1. Open **SQL Editor** in the same Supabase project used for Week 2 and run [`supabase/week3-auth.sql`](supabase/week3-auth.sql) in full. It creates `profiles`, an `auth.users` trigger (including backfill for existing users), owner-only RLS policies, and a private `avatars` Storage bucket. First and last names start as `NULL`, so a new user is prompted to fill them in.
2. In **Google Cloud Console → Google Auth Platform**, configure the consent screen, then create a **Web application** OAuth client. For **Authorized JavaScript origins**, add `https://tianis-humor-project.vercel.app` (and `http://localhost:3000` if testing locally). For **Authorized redirect URIs**, add **`https://akoqrcncbcjkzzfsnzth.supabase.co/auth/v1/callback`**. This is Google's handoff to Supabase; it is different from the application's `/auth/callback` path.
3. In **Supabase → Authentication → Sign In / Providers → Google**, enable Google and paste the OAuth Client ID and Client Secret there. Never commit that secret. In **Authentication → URL Configuration**, set Site URL to `https://tianis-humor-project.vercel.app` and add **`https://tianis-humor-project.vercel.app/auth/callback`** to allowed redirect URLs. Add `http://localhost:3000/auth/callback` if testing locally. For a commit-specific Vercel deployment, add its *exact* `https://...vercel.app/auth/callback` URL to the allow list before testing Google sign-in on that deployment. The app's `redirectTo` always points to the current origin's `/auth/callback`, without other query parameters.
4. In **Vercel → Project → Environment Variables**, keep the existing `SUPABASE_URL` and `SUPABASE_ANON_KEY` for Production, and add **`NEXT_PUBLIC_SUPABASE_URL`** with the *same project URL* and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** with the *same publishable/anon key*. These are public browser configuration values, **not** the Google client secret, Supabase secret key, or service role key. Redeploy after adding them because `NEXT_PUBLIC_` values are baked into the client bundle at build time.

## Run locally

Run `npm install`; copy `.env.example` to `.env.local`, replacing each placeholder with the same Week 2 Supabase project URL and publishable/anon key; then `npm run dev`. The two `NEXT_PUBLIC_` values repeat the corresponding server values to support the browser-based OAuth button. `.env.local` is gitignored.

## Check the assignment

- `/` still displays the three `caption_ideas` rows without login.
- Open `/members` signed out: you should be sent to `/login` (including in Incognito).
- Click **Continue with Google**: after returning via `/auth/callback`, a new user goes to `/profile` to add first and last name. Saving them enables `/members`.
- `/profile` can update both names and upload a PNG, JPEG, or WebP photo under 2 MB. The `profiles.avatar_path` column stores only a Storage path. The bucket is private and photos are displayed with short-lived signed URLs.
- In Vercel's Deployment Protection settings, keep public access enabled for this assignment. Test the newly generated **commit-specific** deployment URL in Incognito and submit it in the course's **Assignment Submissions → Week 3** section.

The Week 3 application code, SQL migration, Google credentials, and Vercel/Supabase settings are separate steps: pushing code cannot create the Google OAuth client or execute the SQL migration on your account.
