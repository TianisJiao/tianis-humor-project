"use client";
import { useState } from "react";
import { NYC_LANDMARKS } from "../../lib/nyc-landmarks.mjs";
import UploadForm from "./upload-form";
import { LandmarkDrawing, AtlasBackdrop } from "./atlas-art";

async function postcardFile(place) {
  const svg = document.querySelector("[data-landmark-art] svg");
  if (!svg) throw new Error("Illustration unavailable");
  const clone = svg.cloneNode(true);
  clone.setAttribute("width", "660"); clone.setAttribute("height", "600");
  const markup = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const drawing = new window.Image(); drawing.src = url; await drawing.decode();
    const canvas = document.createElement("canvas"); canvas.width = 1000; canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#f5eddc"; ctx.fillRect(0, 0, 1000, 900);
    ctx.strokeStyle = "#75684b"; ctx.lineWidth = 3; ctx.strokeRect(26, 26, 948, 848);
    ctx.drawImage(drawing, 170, 110, 660, 600);
    ctx.fillStyle = "#403c30"; ctx.textAlign = "center";
    ctx.font = "bold 40px Georgia"; ctx.fillText(place.name, 500, 752);
    ctx.font = "24px Arial"; ctx.fillText(place.area, 500, 796);
    ctx.font = "18px Arial"; ctx.fillText("NYC SIDE QUESTS · LANDMARK ILLUSTRATION", 500, 846);
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Export failed")), "image/png"));
    return new File([blob], `${place.id}-postcard.png`, { type: "image/png" });
  } finally { URL.revokeObjectURL(url); }
}

export default function NYCExplorer({ dailyIndex }) {
  const [selected, setSelected] = useState(NYC_LANDMARKS[dailyIndex]);
  const [preset, setPreset] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function usePostcard() {
    setBusy(true); setError("");
    try {
      const file = await postcardFile(selected);
      setPreset({ file, landmarkId: selected.id, key: Date.now() });
      document.getElementById("upload")?.scrollIntoView({ behavior: "auto", block: "start" });
    } catch { setError("Couldn't prepare the illustration. You can still upload your own photo below."); }
    finally { setBusy(false); }
  }
  return <>
    <section className="nyc-explorer" id="explore" aria-labelledby="explore-title">
      <div className="atlas-heading"><div><span className="club-kicker">A LITTLE ATLAS / NEW YORK CITY</span><h1 id="explore-title">Take the scenic route<span>.</span></h1><p>Pick a landmark. Find its story. Give it a punchline.</p></div><span className="atlas-stamp">SIX STOPS<br />ENDLESS STORIES<br />VOL. 05</span></div>
      <div className="atlas-layout">
        <div className="atlas-map" aria-label="Illustrated New York landmark explorer">
          <AtlasBackdrop />
          {NYC_LANDMARKS.map((place, index) => <button key={place.id} className={`atlas-pin ${selected.id === place.id ? "is-selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} aria-label={`Explore ${place.name}`} aria-pressed={selected.id === place.id} onClick={() => { setSelected(place); setError(""); }}><LandmarkDrawing kind={place.kind} aria-hidden="true" /><span className="atlas-pin-number">{String(index + 1).padStart(2, "0")}</span><span className="atlas-pin-name">{place.mapLabel}</span></button>)}
          <span className="atlas-map-note">An illustrated journey · not to scale</span>
        </div>
        <article className="atlas-card" aria-labelledby="place-title">
          <span className="club-kicker">{selected.id === NYC_LANDMARKS[dailyIndex].id ? "TODAY’S SIDE QUEST" : "YOUR NEXT STOP"}</span>
          <div className="atlas-card-art" data-landmark-art><LandmarkDrawing kind={selected.kind} aria-hidden="true" /><span>NEW YORK<br />POSTCARD No. {String(NYC_LANDMARKS.indexOf(selected) + 1).padStart(2, "0")}</span></div>
          <h2 id="place-title">{selected.name}</h2><p className="atlas-area">{selected.area}</p>
          <div aria-live="polite"><p className="atlas-fact">{selected.fact}</p></div><a className="atlas-source" href={selected.source} target="_blank" rel="noreferrer">Read the official history ↗</a>
          <p className="atlas-prompt">Photo mission: {selected.prompt}</p>
          <button className="atlas-primary" type="button" onClick={usePostcard} disabled={busy}>{busy ? "Preparing postcard…" : "Make captions for this illustration ↗"}</button>
          <a className="atlas-secondary" href="#upload">Or upload your NYC photo ↓</a>
          <p className="atlas-note">An illustration, not a historical photograph. AI captions are jokes; the history above is sourced.</p>
          {error && <p role="alert">{error}</p>}
        </article>
      </div>
      <nav className="atlas-stop-list" aria-label="Choose a landmark">{NYC_LANDMARKS.map((place, i) => <button type="button" key={place.id} aria-pressed={selected.id === place.id} onClick={() => setSelected(place)}><span>{String(i + 1).padStart(2,"0")}</span>{place.name}</button>)}</nav>
    </section>
    <section className="club-upload atlas-upload" id="upload" aria-labelledby="upload-heading"><div className="upload-copy"><span className="club-kicker">02 / MAKE A POSTCARD</span><h2 id="upload-heading">New York.<br /><em>Your punchline.</em></h2><p>Use a landmark illustration or a photo you’re comfortable sharing. AI describes the image, then writes three captions. The community chooses the best one.</p><p className="upload-privacy">Your image is sent to OpenAI for caption generation, then shared with signed-in members. Your exact generation prompts are saved privately.</p><a className="atlas-secondary" href="#gallery">Just here to vote? Browse the postcards ↓</a></div><UploadForm key={preset?.key ?? "own-photo"} preset={preset} /></section>
  </>;
}
