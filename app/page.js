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
        <span className="edition">WEEK 02 / CONNECTING THE DATABASE</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="dot" /> LIVE FROM SUPABASE</div>
        <h1>Hello World<span className="accent">.</span><br /><em>Meet the database.</em></h1>
        <p className="intro">A small collection of caption ideas, fetched from a real PostgreSQL table every time you visit this page.</p>
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

      <footer><span>Built with Next.js + Supabase</span><span>Assignment 01 → 02</span></footer>
    </main>
  );
}
