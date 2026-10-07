"use client";

import { useState, useTransition } from "react";
import { voteOnCaption } from "./actions";

export default function VoteControls({ captionId, initial }) {
  const [vote, setVote] = useState(initial);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(value) {
    startTransition(async () => {
      setError("");
      try {
        const result = await voteOnCaption(captionId, value);
        if (result.error) setError(result.error);
        else setVote(result.vote);
      } catch { setError("Your vote wasn't saved. Please try again."); }
    });
  }
  return <div className="vote-area"><div className="vote-controls" aria-label="Rate this caption" aria-busy={pending}>
    <button type="button" aria-label="Upvote caption" aria-pressed={vote.mine === 1} disabled={pending} onClick={() => submit(1)}>↑ <span>Funny</span> <b>{vote.upvotes}</b></button>
    <span className="vote-score" aria-label={`Score: ${vote.score}`} aria-live="polite">{Number(vote.score) > 0 ? "+" : ""}{vote.score}</span>
    <button type="button" aria-label="Downvote caption" aria-pressed={vote.mine === -1} disabled={pending} onClick={() => submit(-1)}>↓ <span>Pass</span> <b>{vote.downvotes}</b></button>
  </div>{error && <p className="vote-error" role="alert">{error}</p>}</div>;
}
