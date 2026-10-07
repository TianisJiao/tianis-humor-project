"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadMeme } from "./actions";
import { MAX_IMAGE_BYTES } from "../../lib/meme-validation.mjs";

export default function UploadForm() {
  const [state, action, pending] = useActionState(uploadMeme, {});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => { if (state.imageId) router.refresh(); }, [state.imageId, router]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return <form action={action} className="upload-form" aria-busy={pending} onReset={() => { setFile(null); setPreview(""); }}>
    <label className="upload-drop" htmlFor="meme-image">{preview ? <Image src={preview} alt="Preview of your selected image" width={440} height={260} unoptimized /> : <><span className="upload-icon" aria-hidden="true">↥</span><strong>Your next great joke<br />starts right here.</strong></>}<span>{file ? file.name : "Choose an image"}</span><small>PNG / JPEG / WebP · 2 MB max</small></label>
    <input id="meme-image" name="image" type="file" accept="image/png,image/jpeg,image/webp" required disabled={pending} aria-describedby="upload-status" onChange={event => {
      const selected = event.target.files?.[0];
      setError(""); setPreview(""); setFile(null);
      if (selected && (!selected.size || selected.size > MAX_IMAGE_BYTES || !["image/png", "image/jpeg", "image/webp"].includes(selected.type))) { setError("Choose a PNG, JPEG, or WebP image of 2 MB or less."); event.target.value = ""; return; }
      setFile(selected ?? null);
      if (selected) setPreview(URL.createObjectURL(selected));
    }} />
    <label className="theme-label" htmlFor="caption-theme">What kind of day is it?</label>
    <select id="caption-theme" name="theme" defaultValue="campus" disabled={pending}><option value="campus">Campus chaos</option><option value="dorm">Dorm &amp; roommate life</option><option value="city">NYC survival mode</option><option value="weekend">Weekend side quests</option></select>
    <button className="club-cta generate-button" disabled={pending || !file || !!error}>{pending ? "Finding the funny…" : "Generate 3 captions"}<span aria-hidden="true">✳</span></button>
    <div id="upload-status" className="upload-status" role="status" aria-live="polite">{pending ? "Uploading your image, describing it, and writing three captions. This can take about a minute. Keep this page open." : error || state.error || state.success || "Up to 10 uploads per day (UTC). Each image gets three captions."}{!pending && state.imageId && !error && <a href={`#meme-${state.imageId}`}>See your punchlines ↓</a>}</div>
  </form>;
}
