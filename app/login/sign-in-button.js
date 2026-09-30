"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/browser";

export default function GoogleSignIn() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      setMessage("Could not start Google sign-in. Check the Supabase Google provider and public environment variables.");
      setBusy(false);
    }
  }

  return <div><button className="button" onClick={signIn} disabled={busy}>{busy ? "Connecting…" : "Continue with Google ↗"}</button>{message && <p className="notice" role="alert">{message}</p>}</div>;
}
