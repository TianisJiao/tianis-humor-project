"use client";
import { useState } from "react";

export default function CopyCaption({ text }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setMessage("Copied — ready for your group chat."); }
    catch { setMessage("Couldn't copy automatically. Select the caption text to copy it."); }
  }
  return <div className="copy-caption"><button type="button" onClick={copy}>Copy caption ↗</button>{message && <span role="status">{message}</span>}</div>;
}
