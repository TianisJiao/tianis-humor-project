import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function getIdeas() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { ideas: [], message: "Add SUPABASE_URL and SUPABASE_ANON_KEY to your environment to connect the database." };
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("caption_ideas")
      .select("id, title, context, category")
      .order("id", { ascending: true });

    if (error) throw error;
    return { ideas: data ?? [], message: null };
  } catch (error) {
    console.error("Could not load caption ideas:", error);
    return { ideas: [], message: "The database could not be loaded. Check the project URL, key, table, and read policy." };
  }
}

export default async function Home() {
  const { ideas, message } = await getIdeas();

  return (
    <main className="shell">
      <header className="masthead">
        <span className="brand">THE HUMOR PROJECT</span>
        <nav className="header-nav" aria-label="Main navigation"><Link href="/members">Members studio</Link><Link href="/profile">Profile</Link><Link href="/login">Sign in</Link></nav>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="dot" /> THE PUNCHLINE CLUB / COLUMBIA × NYC</div>
        <h1>Your day<span className="accent">.</span><br /><em>With a punchline.</em></h1>
        <p className="intro">Dorm chaos, subway drama, weekend side quests. Sign in, turn your photo into three AI captions, and vote on what makes the club laugh.</p>
        <Link className="button" style={{ textDecoration: "none" }} href="/members">Start the laugh test ↗</Link>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="section-heading">
          <div>
            <span className="overline">THE COLLECTION</span>
            <h2 id="collection-title">Caption ideas</h2>
          </div>
          <span className="count">{ideas.length} {ideas.length === 1 ? "idea" : "ideas"}</span>
        </div>

        {message ? (
          <p className="notice" role="status">{message}</p>
        ) : ideas.length === 0 ? (
          <p className="notice">No ideas yet. Add a row to the caption_ideas table in Supabase to see it here.</p>
        ) : (
          <ul className="idea-list">
            {ideas.map((idea, index) => (
              <li className="idea-card" key={idea.id}>
                <span className="number">{String(index + 1).padStart(2, "0")}</span>
                <div className="idea-copy">
                  <span className="category">{idea.category}</span>
                  <h3>{idea.title}</h3>
                  <p>{idea.context}</p>
                </div>
                <span className="arrow" aria-hidden="true">↗</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer><span>Built with Next.js + Supabase</span><span>The Humor Project / Week 04</span></footer>
    </main>
  );
}
