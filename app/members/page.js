import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Members() {
  const supabase = await createClient();
  const { data: { claims } } = await supabase.auth.getClaims();
  if (!claims?.sub) redirect("/login");
  const { data: profile, error } = await supabase.from("profiles")
    .select("first_name, last_name").eq("id", claims.sub).single();
  if (error || !profile?.first_name?.trim() || !profile?.last_name?.trim()) redirect("/profile?setup=1");

  return <main className="shell auth-page">
    <div className="page-nav"><Link href="/">← Collection</Link><Link href="/profile">Edit profile ↗</Link></div>
    <span className="overline">WEEK 03 / THE PRIVATE STUDIO</span>
    <h1>Welcome, {profile.first_name}<span className="accent">.</span></h1>
    <p className="intro">You made it in. This members-only page is rendered only after your sign-in is checked on the server.</p>
    <div className="panel studio"><span className="overline">A LITTLE PROMPT</span><h2>What made you laugh today?</h2><p className="muted">Your favorite punchline may be the start of the next idea. The public caption collection is waiting outside.</p><Link className="text-link" href="/">Explore the ideas ↗</Link></div>
    <form action="/auth/signout" method="post" className="signout"><button type="submit" className="text-button">Sign out ↗</button></form>
  </main>;
}
