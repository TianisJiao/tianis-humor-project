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

## Week 4 — The Punchline Club

Week 4 extends the existing `/members` route. The public Week 2 collection and Week 3 Google login, names, and profile photos remain available.

### Setup

1. In the **same Supabase project's SQL Editor**, run `supabase/week4-memes.sql` in full, after the existing Week 2 and Week 3 migrations. It creates `meme_images`, `meme_captions`, `caption_votes`, a private `meme-images` bucket, and authenticated RPCs. It also enables RLS on every public application table. The final result sets list tables and policies: every table must show RLS enabled. If you have extra tables or preexisting permissive policies, review them separately; enabling RLS does not remove existing policies.
2. Add **`OPENAI_API_KEY`** to Vercel's server environment for **Production and Preview**. Keep it secret; never prefix it with `NEXT_PUBLIC_`. The default model is `gpt-4.1-mini`; optionally set `OPENAI_MODEL` to another vision- and structured-output-compatible Responses API model. OpenAI API usage requires an API account with available credit; a ChatGPT subscription does not configure this app's API access. No Supabase service-role key is needed.
3. Keep the four existing Supabase environment variables available for Production and Preview. Redeploy after environment changes.
4. Copy the new deployment's exact URL from **Vercel → Deployments**. In **Supabase → Authentication → URL Configuration**, add its exact `/auth/callback` URL to Redirect URLs. Preserve the existing production callback. The app uses its current origin for OAuth.
5. In **Vercel → Settings → Deployment Protection**, disable protection for the submitted deployment so an Incognito visitor can reach the app and login page. App-level login protection still applies to members, uploads, and votes.

### How it works

- Only signed-in members can browse the image gallery, upload images, and vote. New users still complete their name in `/profile` first.
- The server checks PNG/JPEG/WebP signatures and a 2 MB limit. A database reservation serializes upload requests and limits each user to 10 attempts per UTC day, including failed attempts; only one generation may start per user within a five-minute pending window.
- Request 1 sends the uploaded image to OpenAI for a factual description. Request 2 receives only that description and requests three distinct funny captions using structured JSON output. `store: false` is used. Each request has a 40-second timeout. `/members` allows a maximum runtime of 120 seconds.
- A database transaction publishes the description and all three captions together. Failures leave no partial captions; unpublished uploaded objects are removed on handled errors. A server crash may leave a private pending image/object; the pending reservation stops blocking after five minutes. API output is validated rather than replaced with canned jokes.
- Photos live in a private Storage bucket; the database stores the path and description. Members view published photos via signed URLs valid for one hour (refresh the page if a URL expires). The gallery displays the latest 20 images.
- The first vote inserts a row associated with the authenticated user and caption. A unique `(caption_id, user_id)` key prevents duplicate votes. Switching direction updates that row; repeating the selected direction deletes it. The displayed score is upvotes minus downvotes, not an invented popularity count.
- RLS prevents users from reading or editing another user's vote/profile. Aggregate counts are returned by an authenticated RPC without exposing voter identities. Anonymous users cannot access meme tables, publish, or vote. Published photos cannot be deleted via the client; upload write permissions apply only to a reserved path owned by that user.
- Narrow authenticated `SECURITY DEFINER` functions validate `auth.uid()` with fixed search paths. They handle reservations, atomic publication, and aggregate vote counts without exposing a service-role key. Owners can publish only their own reserved images; direct image/caption writes are denied.

### Verification

`npm run lint`, `npm run build`, and `npm run test:rls` check code and database behavior. The RLS test executes the real migrations in PGlite (PostgreSQL), with simulated Supabase auth and Storage tables. It checks migration reruns, atomic publishing, vote insert/change/undo, duplicate constraints, cross-user access, anonymous denial, storage policies, upload limits, and all public-table RLS. It does not verify deployed Supabase Storage APIs, Google OAuth, or real model availability.

Test the deployed app separately:

- In Incognito, open the **commit-specific deployment URL**. Verify `/members` redirects to login and the Vercel page itself is accessible.
- Sign in with Google. Upload an actual photo; verify three captions appear with the photo and `What the AI saw` exposes the saved description. Reload: image and captions must persist.
- Upvote, reload, change to downvote, reload, and tap again to cancel. Check `caption_votes` in Supabase: first click creates one row, changing retains one row, cancellation removes it.
- Use a second account to verify shared images/counts and independent votes. Direct database attempts to write another user's vote must fail.
- Check unsupported/oversized files and generation failures show useful feedback. Check phone layout, keyboard navigation, and reduced-motion settings.
- Confirm Vercel shows the intended Git commit and a successful deployment. Submit that deployment's exact URL in **Week 4 Submissions**, not a moving production alias or the old Week 3 URL.

Code checks and a successful Vercel build are separate from real upload, generation, authentication, and persistence verification. The SQL and environment settings must be applied in the account before the online feature can work.

### Revised Week 4: Rating App — persona and intent

The target user is Sam: a chronically online Columbia College junior, originally from the Midwest, who lives in dorms and explores NYC on weekends. The existing photo-caption format satisfies the broader AI-media requirement; two sequential model calls remain an implementation choice.

- **A reason to return:** a rotating daily photo idea (New York weekday) helps Sam find humor in ordinary campus/city moments. Seven prompts rotate weekly. This is inspiration, not a fabricated popularity signal or a claim about actual campus events.
- **A reason to create:** four optional contexts—campus chaos, dorm/roommate life, NYC survival, and weekend side quests—make captions more relevant without pretending every uploaded photo was taken at Columbia or in NYC. Three distinct approaches give Sam a choice.
- **A reason to spread content:** each caption has a Copy caption button for taking the text to a group chat. This copies only text and sends nothing automatically. The shared member gallery and real vote totals let users see which jokes resonate.
- **Proposed improvement over a generic caption generator:** let the creator choose the social context, compare three caption approaches on the same image, and get real audience feedback. This is our product proposal, not a verified claim about Crackd's current features.

`meme_generations` stores, per successful image generation, the exact instructions and user text sent in both requests, model identifiers, second-step response schema, first-step image detail setting, and prompt version. The stored image supplies the image input; we do not duplicate image bytes or API secrets in prompt records. The second prompt includes the actual generated description and chosen theme. The publish transaction saves prompt history and all three captions together; missing/invalid prompt history prevents publication. Only the image owner can read their prompt records. The revised SQL removes the old three-argument publication RPC so callers cannot omit prompts.

Run `npm run test:chain` to verify two sequential calls, exact prompt capture, theme handling, and absence of keys/image bytes in prompt history using mocked provider responses. `npm run test:rls` also verifies prompt persistence and owner-only prompt access. Online LLM generation is still a separate required check.

**PM feedback remains pending.** During the Feedback Group session, observe whether Sam's tasks are clear: choose a photo/context, generate, vote, and copy a caption. Record the PM's actual comments, prioritize the resulting changes, implement them, and retest before submission. No PM feedback or revision is claimed until that session occurs.
