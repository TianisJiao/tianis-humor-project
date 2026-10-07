import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const query = await searchParams;
  // Supabase may return to Site URL when a redirect URL isn't allowlisted.
  // Preserve the code for the existing callback's session exchange.
  if (typeof query?.code === "string" && query.code) {
    redirect(`/auth/callback?${new URLSearchParams({ code: query.code })}`);
  }
  redirect("/members");
}
