import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import UploadForm from "./upload-form";
import VoteControls from "./vote-controls";
import CopyCaption from "./copy-caption";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function loadGallery(supabase, userId) {
  const { data: images, error } = await supabase.from("meme_images")
    .select("id, storage_path, description, created_at, meme_captions(id, text, position)")
    .eq("status", "ready").order("created_at", { ascending: false }).limit(20);
  if (error) return { images: [], error: "The gallery couldn't load. Please try again shortly." };
  const ids = images.flatMap(image => image.meme_captions.map(c => c.id));
  const [scoresResult, votesResult, urlsResult] = await Promise.all([
    ids.length ? supabase.rpc("caption_scores", { caption_ids: ids }) : Promise.resolve({ data: [] }),
    ids.length ? supabase.from("caption_votes").select("caption_id, value").eq("user_id", userId).in("caption_id", ids) : Promise.resolve({ data: [] }),
    images.length ? supabase.storage.from("meme-images").createSignedUrls(images.map(i => i.storage_path), 3600) : Promise.resolve({ data: [] }),
  ]);
  if (scoresResult.error || votesResult.error || urlsResult.error) return { images: [], error: "Images or votes couldn't load. Refresh to try again." };
  const scores = new Map((scoresResult.data ?? []).map(s => [s.caption_id, s]));
  const votes = new Map((votesResult.data ?? []).map(v => [v.caption_id, v.value]));
  const urls = new Map((urlsResult.data ?? []).map(u => [u.path, u.signedUrl]));
  return { images: images.map(image => ({ ...image, url: urls.get(image.storage_path), captions: image.meme_captions.sort((a, b) => a.position - b.position).map(c => ({ ...c, votes: { ...(scores.get(c.id) ?? { score: 0, upvotes: 0, downvotes: 0 }), mine: votes.get(c.id) ?? 0 } })) })), error: null };
}

function MemeGallery({ images, error }) {
  return <section className="club-gallery" id="gallery" aria-labelledby="gallery-heading">
    <div className="club-section-title"><div><span className="club-kicker">THE AUDIENCE HAS THE LAST WORD</span><h2 id="gallery-heading">The laugh test<span>.</span></h2></div><span className="club-stamp">↑ FUNNY<br />↓ TRY AGAIN</span></div>
    <p className="club-helper">Vote on each punchline. Tap your selected vote again to undo it. Showing the latest 20 images.</p>
    {error ? <p className="club-message" role="alert">{error}</p> : images.length === 0 ? <div className="club-empty"><span className="empty-star" aria-hidden="true">✳</span><h3>A room full of potential.</h3><p>No images yet. Upload the first one and give this club something to laugh about.</p><a href="#upload">Take the mic ↗</a></div> : <div className="meme-grid">{images.map((image, index) => <article className="meme-card" key={image.id} id={`meme-${image.id}`}>
      <div className="meme-photo">{image.url ? <Image src={image.url} alt={image.description} width={700} height={520} unoptimized /> : <p>Image unavailable. Refresh to try again.</p>}<span className="photo-number">FRAME {String(index + 1).padStart(2, "0")}</span></div>
      <div className="caption-choices">{image.captions.map(caption => <div className="caption-choice" key={caption.id}><span className="caption-index">0{caption.position}</span><div><p>{caption.text}</p><VoteControls captionId={caption.id} initial={caption.votes} /><CopyCaption text={caption.text} imageUrl={image.url} captionId={caption.id} /></div></div>)}</div>
      <details className="image-description"><summary>What the AI saw ↗</summary><p>{image.description}</p></details>
    </article>)}</div>}
  </section>;
}

export default async function Members() {
  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) redirect("/login");
  const { data: profile, error } = await supabase.from("profiles").select("first_name, last_name").eq("id", data.user.id).single();
  if (error || !profile?.first_name?.trim() || !profile?.last_name?.trim()) redirect("/profile?setup=1");
  const gallery = await loadGallery(supabase, data.user.id);
  const dailyPrompts = ["Your most dramatic coffee break", "A dorm object that deserves a personality", "A commute with main-character energy", "Your study setup, unfiltered", "A lunch with unexpected lore", "A tiny NYC discovery", "The weekend side quest nobody planned"];
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" }).format(new Date());
  const dailyPrompt = dailyPrompts[["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(weekday)];
  return <main className="club">
    <a className="club-skip" href="#upload">Skip to upload</a>
    <div className="club-wrap">
      <header className="club-header"><Link className="club-logo" href="/members">THE PUNCHLINE<br /><span>CLUB ✳</span></Link><nav aria-label="Club navigation"><Link href="/members#upload">Generate captions</Link><Link href="/profile">{profile.first_name}&apos;s profile ↗</Link><form action="/auth/signout" method="post"><button>Sign out</button></form></nav></header>
      <section className="club-hero"><div><span className="club-kicker">COLUMBIA × NYC / VOL. 04</span><h1>Good image.<br /><em>Bad influence.</em></h1><p>Dorm chaos. Subway drama. Weekend side quests.<br />Turn your ordinary day into the group chat&apos;s next meme.</p><a className="club-cta" href="#upload">Make something funny <span>↗</span></a></div><div className="club-poster" aria-hidden="true"><span className="poster-top">EST. JUST NOW</span><div className="poster-face"><i /><i /><b /></div><strong>PLEASE<br />DO LAUGH.</strong><span className="poster-bottom">CAMPUS TO CITY.</span><span className="poster-sticker">100%<br />SUBJECTIVE</span></div></section>
    </div>
    <div className="club-ticker" aria-hidden="true"><span>ONE IMAGE ✳ THREE PUNCHLINES ✳ YOUR VERDICT ✳ ONE IMAGE ✳ THREE PUNCHLINES ✳ YOUR VERDICT ✳ </span></div>
    <div className="club-wrap"><section className="club-upload" id="upload" aria-labelledby="upload-heading"><div className="upload-copy"><span className="club-kicker">01 / TAKE THE MIC</span><h2 id="upload-heading">Every picture<br />has a punchline.</h2><p>That library coffee. Your roommate&apos;s desk. A strangely dramatic subway moment. Pick a theme, upload a photo, and let the club find the funny.</p><aside className="daily-prompt"><span className="club-kicker">TODAY&apos;S PHOTO PROMPT</span><p>{dailyPrompt}</p><small>A different idea each day. Your own photo always works, too.</small></aside><div className="chain-note"><span>01 &nbsp; IMAGE</span><span>02 &nbsp; DESCRIPTION</span><span>03 &nbsp; PUNCHLINES</span></div><p className="upload-privacy">Your photo is sent to OpenAI to generate captions, then shared with signed-in club members. Upload images you&apos;re comfortable sharing.</p></div><UploadForm /></section><MemeGallery {...gallery} /><footer className="club-footer"><span>THE HUMOR PROJECT ✳ WEEK 04</span><span>Humor is subjective. Your vote isn&apos;t.</span></footer></div>
  </main>;
}
