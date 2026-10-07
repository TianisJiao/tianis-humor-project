import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request) {
  return updateSession(request);
}

export const config = {
  matcher: ["/login", "/profile/:path*", "/members/:path*", "/auth/callback", "/auth/signout"],
};
