import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import GoogleSignIn from "./sign-in-button";

export default async function Login({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (claims) redirect("/members");
  const { error } = await searchParams;
  return (
    <main className="shell auth-page">
      <Link className="text-link" href="/">← Back to the collection</Link>
      <span className="overline">WEEK 03 / AUTH WEEK</span>
      <h1>Come on in<span className="accent">.</span></h1>
      <p className="intro">Sign in with Google to see the members-only studio and make a profile of your own.</p>
      {error && <p className="notice" role="alert">Sign-in did not finish. Please try again.</p>}
      <GoogleSignIn />
    </main>
  );
}
