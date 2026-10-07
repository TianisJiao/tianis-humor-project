"use client";
import { useEffect, useState } from "react";

// Export a self-contained image: no expiring Storage URL is shared.
async function renderMeme(imageUrl, text) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("image unavailable");
  const photoUrl = URL.createObjectURL(await response.blob());
  try {
    const photo = new window.Image();
    photo.src = photoUrl;
    await photo.decode();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    const width = 1080;
    const padding = 64;
    const photoHeight = Math.round(width * photo.naturalHeight / photo.naturalWidth);
    const font = "bold 44px Arial, sans-serif";
    ctx.font = font;
    const lines = [];
    let line = "";
    // Character wrapping also handles long words and languages without spaces.
    for (const char of Array.from(text)) {
      if (char === "\n" || ctx.measureText(line + char).width > width - padding * 2) {
        lines.push(line.trim());
        line = char === "\n" ? "" : char;
      } else line += char;
    }
    if (line.trim()) lines.push(line.trim());
    canvas.width = width;
    canvas.height = photoHeight + padding * 2 + lines.length * 58 + 62;
    ctx.fillStyle = "#faf6ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, 0, 0, width, photoHeight);
    ctx.fillStyle = "#30223d";
    ctx.font = font;
    ctx.textBaseline = "top";
    lines.forEach((value, index) => ctx.fillText(value, padding, photoHeight + padding + index * 58));
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText("THE PUNCHLINE CLUB · AI-GENERATED CAPTION", padding, canvas.height - 52);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("export failed")), "image/png"));
  } finally { URL.revokeObjectURL(photoUrl); }
}

export default function CopyCaption({ text, imageUrl, captionId }) {
  const [asset, setAsset] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => () => { if (asset) URL.revokeObjectURL(asset.url); }, [asset]);
  async function prepare() {
    setBusy(true);
    setMessage("");
    try {
      const blob = await renderMeme(imageUrl, text);
      const file = new File([blob], `punchline-${captionId}.png`, { type: "image/png" });
      setAsset({ blob, file, url: URL.createObjectURL(blob) });
      setMessage("Ready: photo + this caption. Share or download below.");
    } catch { setMessage("Couldn't prepare the image. Refresh this page and try again."); }
    finally { setBusy(false); }
  }
  async function share() {
    try {
      if (!navigator.share || !navigator.canShare?.({ files: [asset.file] })) {
        setMessage("File sharing isn't available in this browser. Use Download PNG for Instagram, WeChat, or another platform.");
        return;
      }
      await navigator.share({ files: [asset.file], title: "The Punchline Club" });
      setMessage("Share menu completed.");
    } catch (error) {
      setMessage(error.name === "AbortError" ? "Sharing canceled. Your meme is still ready." : "Couldn't share here. Download the PNG instead.");
    }
  }
  return <div className="copy-caption">
    {!asset ? <button type="button" disabled={busy || !imageUrl} onClick={prepare}>{busy ? "Preparing meme…" : "Share this meme ↗"}</button> : <>
      {/* Preparation is separate so sharing runs directly on a user click. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="meme-export-preview" src={asset.url} alt="Share preview: photo with the selected caption" />
      <div className="meme-share-actions"><a href={asset.url} download={asset.file.name} onClick={() => setMessage("PNG download requested. Upload the saved image to your favorite platform.")}>Download PNG</a><button type="button" onClick={share}>Share to apps ↗</button></div>
    </>}
    <span role="status" aria-live="polite">{message}</span>
  </div>;
}
