import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { updateNames, uploadAvatar } from "./actions";

export const dynamic = "force-dynamic";

export default async function Profile({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) redirect("/login");
  const { data: profile, error } = await supabase.from("profiles")
    .select("first_name, last_name, avatar_path").eq("id", claims.sub).single();
  const query = await searchParams;
  let avatarUrl;
  if (profile?.avatar_path) {
    const { data } = await supabase.storage.from("avatars").createSignedUrl(profile.avatar_path, 60 * 10);
    avatarUrl = data?.signedUrl;
  }
  const needsNames = !profile?.first_name?.trim() || !profile?.last_name?.trim();

  return (
    <main className="shell auth-page">
      <div className="page-nav"><Link href="/members#upload">← Generate captions</Link><Link href="/members">Members studio →</Link></div>
      <span className="overline">YOUR SPACE / WEEK 03</span>
      <h1>Your profile<span className="accent">.</span></h1>
      {needsNames && !error && <p className="notice" role="status">Welcome! Add your first and last name to complete your profile and enter the studio.</p>}
      {error && <p className="notice" role="alert">Profile table is unavailable. Run supabase/week3-auth.sql in your Supabase SQL Editor.</p>}
      {query.error && <p className="notice" role="alert">{query.error === "file" ? "Please choose a PNG, JPEG, or WebP image under 2 MB." : "That change could not be saved. Check your Supabase table and Storage policies, then try again."}</p>}
      {query.saved && <p className="notice success" role="status">Your profile is saved.</p>}
      <div className="profile-grid">
        <section className="panel" aria-labelledby="name-title">
          <span className="overline">01 / THE BASICS</span>
          <h2 id="name-title">A name to know you by</h2>
          <p className="muted">Your name is only visible in your own profile and private studio.</p>
          <form action={updateNames} className="form-stack">
            <label>First name<input name="first_name" type="text" maxLength={80} required defaultValue={profile?.first_name ?? ""} autoComplete="given-name" /></label>
            <label>Last name<input name="last_name" type="text" maxLength={80} required defaultValue={profile?.last_name ?? ""} autoComplete="family-name" /></label>
            <button className="button" type="submit">Save your name ↗</button>
          </form>
        </section>
        <section className="panel" aria-labelledby="photo-title">
          <span className="overline">02 / YOUR PORTRAIT</span>
          <h2 id="photo-title">Add a photo</h2>
          {avatarUrl ? <Image className="avatar" src={avatarUrl} alt="Your profile photo" width={130} height={130} unoptimized /> : <div className="avatar avatar-empty" aria-label="No profile photo yet">✳</div>}
          <p className="muted">PNG, JPEG, or WebP · 2 MB maximum. Stored in Supabase Storage.</p>
          <form action={uploadAvatar} className="form-stack">
            <label>Choose a photo<input name="avatar" type="file" accept="image/png,image/jpeg,image/webp" required /></label>
            <button className="button button-outline" type="submit">Upload photo ↗</button>
          </form>
        </section>
      </div>
      <form action="/auth/signout" method="post" className="signout"><button type="submit" className="text-button">Sign out ↗</button></form>
    </main>
  );
}
