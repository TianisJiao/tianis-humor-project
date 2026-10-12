"use client";
import { useState } from "react";
import { NYC_LANDMARKS } from "../../lib/nyc-landmarks.mjs";
import UploadForm from "./upload-form";

export function LandmarkDrawing({ kind, ...props }) {
  const columns = [24, 38, 52, 66, 80];
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" {...props}>
    <g stroke="#403c30" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="55" cy="93" rx="49" ry="4" fill="#b6b49a" opacity=".5" stroke="none" />
      {kind === "bridge" ? <><path d="M5 77L105 77M5 83L105 83" /><path d="M25 80V29H39V80M73 80V29H87V80" fill="#d5a37b" /><path d="M23 29L32 20L41 29M71 29L80 20L89 29M5 63Q32 30 56 64Q80 30 105 63" fill="none" />{[10,18,46,54,62,95,103].map(x => <path key={x} d={`M${x} 64V77`} />)}<path d="M29 66V42Q32 35 35 42V66M77 66V42Q80 35 83 42V66" fill="#f5eedb" /></> : kind === "arch" ? <><path d="M20 89V24H90V89H70V61C70 36 40 36 40 61V89Z" fill="#e8d7b3" /><path d="M17 24H93V15H17ZM23 32H87M25 79H37M73 79H85" fill="#eadfc8" /><path d="M26 34V72M83 34V72M44 20H65" /><circle cx="55" cy="32" r="4" fill="#cb8a69" /></> : kind === "tower" ? <><path d="M34 88L32 16L64 6L90 22V88Z" fill="#d5bb96" /><path d="M64 6L63 89M33 22L64 13L90 29M33 81L63 80L90 82" fill="none" />{[30,40,50,60,70].map(y => <g key={y}><path d={`M39 ${y}L56 ${y-5}M69 ${y-4}L83 ${y+1}`} stroke="#866a50" /></g>)}</> : <>
        {kind === "dome" ? <><path d="M22 41Q22 12 55 12Q88 12 88 41Z" fill="#9bafa0" /><path d="M42 14Q37 28 38 41M55 12V40M68 14Q74 28 72 41" fill="none" /><path d="M51 12V5H59V12" fill="#b8c5ad" /></> : <path d="M13 43L55 21L97 43Z" fill="#c08c6a" />}
        <path d="M14 46H96V82H14Z" fill="#dfc5a4" /><path d="M9 44H101V50H9Z" fill="#eee1c5" />
        {columns.map(x => <g key={x}><path d={`M${x} 53V80M${x+5} 53V80`} strokeWidth="3" stroke="#9d8266" /><path d={`M${x-2} 52H${x+7}M${x-2} 81H${x+7}`} /></g>)}
        <path d="M10 85H100M6 90H104" strokeWidth="3" />
        {kind === "clock" && <><circle cx="55" cy="33" r="8" fill="#f5efda" /><path d="M55 28V33L59 36" /></>}
        {kind === "library" && <><path d="M5 83L12 70L19 83ZM92 83L99 70L106 83Z" fill="#bc916b" /></>}
      </>}
    </g>
  </svg>;
}

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
          <svg className="atlas-land" viewBox="0 0 800 650" aria-hidden="true">
            <defs><pattern id="atlas-water" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M3 16q7-5 14 0t14 0" fill="none" stroke="#87a4a0" opacity=".4" /></pattern></defs>
            <rect width="800" height="650" fill="#c5d8cf" /><rect width="800" height="650" fill="url(#atlas-water)" />
            <path d="M0 0H298L340 87L241 245L179 391L68 558L0 590Z" fill="#e4d7b9" stroke="#988568" strokeWidth="2" />
            <path d="M390-20L651 0L590 171L508 327L409 458L317 577L254 604L216 566L255 451L325 289L364 142Z" fill="#f3e7c9" stroke="#847b60" strokeWidth="2" />
            <path d="M800 140L740 182L695 267L632 335L535 384L472 520L404 650H800Z" fill="#e5d8b7" stroke="#988568" strokeWidth="2" />
            <path d="M468 85L533 104L478 239L412 225Z" fill="#a4b38a" stroke="#879568" />
            <path d="M564 0L509 161L416 341L282 551M609 0L556 181L463 351L326 563" stroke="#d3c3a0" strokeWidth="4" fill="none" />
            {[200,260,320,380,440].map(y => <path key={y} d={`M${455-y*.25} ${y}l110 26`} stroke="#dfd1b1" strokeWidth="3" />)}
            <path d="M304 558L554 529" stroke="#897858" strokeWidth="6" strokeDasharray="9 7" />
            <text x="65" y="245" transform="rotate(-65 65 245)" fill="#5f7f78" fontFamily="Georgia" fontStyle="italic" fontSize="26">Hudson River</text>
            <text x="607" y="282" transform="rotate(-52 607 282)" fill="#5f7f78" fontFamily="Georgia" fontStyle="italic" fontSize="24">East River</text>
            <text x="621" y="615" fill="#857657" fontFamily="Georgia" fontSize="23" letterSpacing="4">BROOKLYN</text>
            <text x="485" y="159" transform="rotate(-65 485 159)" fill="#5f704c" fontFamily="Georgia" fontSize="15">CENTRAL PARK</text>
            <g transform="translate(94 81)" stroke="#6f7058" fill="none"><circle r="31" /><path d="M0-25L7 0L0 25L-7 0Z" fill="#a97253" /><path d="M-25 0H25" /><text x="-5" y="-40" fill="#6f7058" stroke="none" fontFamily="Georgia" fontSize="18">N</text></g>
            <g fill="#879a70" stroke="#657750"><path d="M740 436l-13 22h26ZM718 475l-13 22h26ZM745 500l-13 22h26Z" /></g>
            <g className="atlas-ferry" transform="translate(126 469)" stroke="#645941"><path d="M0 0H40L32 12H9Z" fill="#b36f53" /><path d="M12 0V-12H28V0" fill="#f3e7c9" /><path d="M20-12V-20" /></g>
          </svg>
          {NYC_LANDMARKS.map((place, index) => <button key={place.id} className={`atlas-pin ${selected.id === place.id ? "is-selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} aria-label={`Explore ${place.name}`} aria-pressed={selected.id === place.id} onClick={() => { setSelected(place); setError(""); }}><LandmarkDrawing kind={place.kind} aria-hidden="true" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}
          <span className="atlas-map-note">Illustrated positions · not for navigation</span>
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
