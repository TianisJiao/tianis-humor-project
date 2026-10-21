import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import NYCExplorer from "./nyc-explorer";
import { NYC_LANDMARKS } from "../../lib/nyc-landmarks.mjs";
import VoteControls from "./vote-controls";
import CopyCaption from "./copy-caption";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function loadGallery(supabase, userId) {
  const { data: images, error } = await supabase.from("meme_images")
    .select("id, storage_path, description, caption_style, created_at, meme_captions(id, text, position)")
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
    <div className="club-section-title"><div><span className="club-kicker">03 / POSTCARDS FROM THE COMMUNITY</span><h2 id="gallery-heading">The postcard club<span>.</span></h2></div><span className="club-stamp">MEMES &amp;<br />SCENIC MOMENTS</span></div>
    <p className="club-helper">Rate each AI caption: Funny / Pass for memes, Like / Dislike for scenic images. Tap your selected vote again to undo it. Showing the latest 20 images.</p>
    {error ? <p className="club-message" role="alert">{error}</p> : images.length === 0 ? <div className="club-empty"><span className="empty-star" aria-hidden="true">✳</span><h3>A room full of potential.</h3><p>No images yet. Upload the first one and give this club a moment to remember.</p><a href="#upload">Create a postcard ↗</a></div> : <div className="meme-grid">{images.map((image, index) => <article className="meme-card" key={image.id} id={`meme-${image.id}`}>
      <div className="meme-photo">{image.url ? <Image src={image.url} alt={image.description} width={700} height={520} unoptimized /> : <p>Image unavailable. Refresh to try again.</p>}<span className="photo-number">FRAME {String(index + 1).padStart(2, "0")}</span></div>
      <p className="caption-style-badge">{image.caption_style === "scenery" ? "SCENERY · POETIC CAPTIONS" : "MEME · FUNNY CAPTIONS"}</p><div className="caption-choices">{image.captions.map(caption => <div className="caption-choice" key={caption.id}><span className="caption-index">0{caption.position}</span><div><p>{caption.text}</p><VoteControls captionId={caption.id} initial={caption.votes} captionStyle={image.caption_style} /><CopyCaption text={caption.text} imageUrl={image.url} captionId={caption.id} /></div></div>)}</div>
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
  const dailyIndex = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", day: "numeric" }).format(new Date())) % NYC_LANDMARKS.length;
  return <main className="club">
    <a className="club-skip" href="#upload">Skip to upload</a>
    <div className="club-wrap">
      <header className="club-header"><Link className="club-logo" href="/members">NYC SIDE<br /><span>QUESTS ✳</span></Link><nav aria-label="Club navigation"><Link href="/members#explore">Explore NYC</Link><Link href="/members#upload">Generate captions</Link><Link href="/profile">{profile.first_name}&apos;s profile ↗</Link><form action="/auth/signout" method="post"><button>Sign out</button></form></nav></header>

    </div>
    <div className="club-wrap"><NYCExplorer dailyIndex={dailyIndex} /><MemeGallery {...gallery} /><footer className="club-footer"><span>NYC SIDE QUESTS ✳ THE HUMOR PROJECT / WEEK 05</span><span>A city worth exploring. A caption worth sharing.</span></footer></div>
  </main>;
}
