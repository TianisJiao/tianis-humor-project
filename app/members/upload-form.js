"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadMeme } from "./actions";
import { NYC_LANDMARKS } from "../../lib/nyc-landmarks.mjs";
import { MAX_IMAGE_BYTES } from "../../lib/meme-validation.mjs";

export default function UploadForm({ preset }) {
  const [state, action, pending] = useActionState(uploadMeme, {});
  const [file, setFile] = useState(preset?.file ?? null);
  const [preview, setPreview] = useState(() => preset?.file ? URL.createObjectURL(preset.file) : "");
  const inputRef = useRef(null);
  useEffect(() => {
    if (preset?.file && inputRef.current) {
      const transfer = new DataTransfer(); transfer.items.add(preset.file); inputRef.current.files = transfer.files;
    }
  }, [preset]);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => { if (state.imageId) router.refresh(); }, [state.imageId, router]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  return <form action={action} className="upload-form" aria-busy={pending} onReset={() => { setFile(null); setPreview(""); }}>
    <label className="upload-drop" htmlFor="meme-image">{preview ? <Image src={preview} alt="Preview of your selected image" width={440} height={260} unoptimized /> : <><span className="upload-icon" aria-hidden="true">↥</span><strong>Your next postcard<br />starts right here.</strong></>}<span>{file ? file.name : "Choose an image"}</span><small>PNG / JPEG / WebP · 2 MB max</small></label>
    <input ref={inputRef} id="meme-image" name="image" type="file" accept="image/png,image/jpeg,image/webp" required disabled={pending} aria-describedby="upload-status" onChange={event => {
      const selected = event.target.files?.[0];
      setError(""); setPreview(""); setFile(null);
      if (selected && (!selected.size || selected.size > MAX_IMAGE_BYTES || !["image/png", "image/jpeg", "image/webp"].includes(selected.type))) { setError("Choose a PNG, JPEG, or WebP image of 2 MB or less."); event.target.value = ""; return; }
      setFile(selected ?? null);
      if (selected) setPreview(URL.createObjectURL(selected));
    }} />
    <label className="theme-label" htmlFor="caption-mode">Caption style</label>
    <select id="caption-mode" name="caption_mode" defaultValue="auto" disabled={pending} aria-describedby="caption-mode-help"><option value="auto">Auto · AI chooses from your image</option><option value="meme">Meme · funny captions</option><option value="scenery">Scenery · poetic captions</option></select>
    <small id="caption-mode-help">AI detects scenery or meme content. Choose a style yourself if you want a different mood.</small>
    <label className="theme-label" htmlFor="landmark">Landmark inspiration (optional)</label>
    <select id="landmark" name="landmark" defaultValue={preset?.landmarkId ?? ""} disabled={pending}><option value="">My own NYC discovery</option>{NYC_LANDMARKS.map(place => <option key={place.id} value={place.id}>{place.name}</option>)}</select>
    <label className="theme-label" htmlFor="caption-theme">What kind of day is it?</label>
    <select id="caption-theme" name="theme" defaultValue="city" disabled={pending}><option value="campus">Campus moments</option><option value="dorm">Dorm &amp; roommate life</option><option value="city">City moments</option><option value="weekend">Weekend side quests</option></select>
    <button className="club-cta generate-button" disabled={pending || !file || !!error}>{pending ? "Reading your image…" : "Generate 3 captions"}<span aria-hidden="true">✳</span></button>
    <div id="upload-status" className="upload-status" role="status" aria-live="polite">{pending ? "Uploading your image, identifying its style, and writing three captions. This can take about a minute. Keep this page open." : error || state.error || state.success || "Up to 10 uploads per day (UTC). Each image gets three captions."}{!pending && state.imageId && !error && <a href={`#meme-${state.imageId}`}>See your captions ↓</a>}</div>
  </form>;
}
