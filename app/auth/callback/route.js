import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/login?error=oauth", url.origin));

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login?error=session", url.origin));

  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("first_name, last_name").eq("id", user.id).single();
  if (profileError) return NextResponse.redirect(new URL("/profile?setup=1", url.origin));
  const target = profile?.first_name?.trim() && profile?.last_name?.trim() ? "/members" : "/profile?setup=1";
  return NextResponse.redirect(new URL(target, url.origin));
}
