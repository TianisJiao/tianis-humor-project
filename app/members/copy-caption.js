"use client";
import { useEffect, useState } from "react";
import { drawPostcard, POSTCARD_WIDTH, POSTCARD_HEIGHT } from "../../lib/postcard-layout.mjs";

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
    canvas.width = POSTCARD_WIDTH;
    canvas.height = POSTCARD_HEIGHT;
    drawPostcard(ctx, photo, text);
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
      const file = new File([blob], `nyc-postcard-${captionId}.png`, { type: "image/png" });
      setAsset({ blob, file, url: URL.createObjectURL(blob) });
      setMessage("Your postcard is ready: your photo + this caption. Download it or open your device’s share menu.");
    } catch { setMessage("Couldn't prepare the image. Refresh this page and try again."); }
    finally { setBusy(false); }
  }
  async function share() {
    try {
      if (!navigator.share || !navigator.canShare?.({ files: [asset.file] })) {
        setMessage("File sharing isn't available in this browser. Use Download PNG for Instagram, WeChat, or another platform.");
        return;
      }
      await navigator.share({ files: [asset.file], title: "A postcard from NYC Side Quests" });
      setMessage("Share menu completed.");
    } catch (error) {
      setMessage(error.name === "AbortError" ? "Sharing was canceled or unavailable. Your postcard is still ready to download." : "Couldn't share here. Download the PNG instead.");
    }
  }
  return <div className="copy-caption">
    {!asset ? <button type="button" disabled={busy || !imageUrl} onClick={prepare}>{busy ? "Making postcard…" : "Share · make a postcard ↗"}</button> : <>
      {/* Preparation is separate so sharing runs directly on a user click. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="meme-export-preview" src={asset.url} alt="New York postcard preview with your complete photo and selected caption" />
      <div className="meme-share-actions"><a href={asset.url} download={asset.file.name} onClick={() => setMessage("PNG download requested. Upload the saved image to your favorite platform.")}>Download postcard PNG</a><button type="button" onClick={share}>Open share menu ↗</button></div>
    </>}
    <span role="status" aria-live="polite">{message}</span>
  </div>;
}
