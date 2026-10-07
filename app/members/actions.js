"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";
import { generateCaptions } from "../../lib/caption-chain";
import { imageType, MAX_IMAGE_BYTES } from "../../lib/meme-validation.mjs";

async function authenticated() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error || !data.user ? null : { supabase, user: data.user };
}

export async function uploadMeme(_previous, formData) {
  const session = await authenticated();
  if (!session) return { error: "Your session expired. Sign in again before uploading." };
  if (!process.env.OPENAI_API_KEY) return { error: "Caption generation is not configured yet. Please try again later." };
  const theme = String(formData.get("theme") ?? "campus");
  if (!["campus", "dorm", "city", "weekend"].includes(theme)) return { error: "Choose a caption theme." };
  const file = formData.get("image");
  if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_BYTES) return { error: "Choose a PNG, JPEG, or WebP image of 2 MB or less." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = imageType(bytes);
  if (!type) return { error: "That file is not a supported image. Choose PNG, JPEG, or WebP." };
  const { supabase } = session;
  const { data: image, error: reserveError } = await supabase.rpc("reserve_meme_image", { extension: type.extension });
  if (reserveError) {
    const error = reserveError.message.includes("daily_limit") ? "You have reached today's 10-upload limit. Come back tomorrow." : reserveError.message.includes("generation_in_progress") ? "Your previous image is still processing. Please wait a few minutes." : "The upload could not start. Please try again later.";
    return { error };
  }
  let uploaded = false;
  try {
    const { error } = await supabase.storage.from("meme-images").upload(image.storage_path, bytes, { contentType: type.mime, upsert: false });
    if (error) throw new Error("Storage upload failed");
    uploaded = true;
    const generated = await generateCaptions(bytes, type.mime, theme);
    const { error: saveError } = await supabase.rpc("publish_meme", {
      image_id: image.id, image_description: generated.description, caption_texts: generated.captions,
      generation_prompts: generated.prompts, generation_model: generated.model, generation_version: generated.version,
    });
    if (saveError) throw new Error("Caption save failed");
    revalidatePath("/members");
    return { success: "Three new punchlines are ready. Find your image at the top of the gallery.", imageId: image.id };
  } catch (error) {
    console.error("Meme generation failed", { imageId: image.id, message: error.message });
    // Only unpublished objects can be removed; published images remain consistent.
    if (uploaded) await supabase.storage.from("meme-images").remove([image.storage_path]);
    await supabase.rpc("fail_meme", { image_id: image.id });
    return { error: "We couldn't finish or confirm this upload. Refresh the gallery before trying again." };
  }
}

export async function voteOnCaption(captionId, value) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(captionId) || ![1, -1].includes(value)) return { error: "Invalid vote." };
  const session = await authenticated();
  if (!session) return { error: "Your session expired. Sign in again to vote." };
  const { data, error } = await session.supabase.rpc("cast_caption_vote", { target_caption: captionId, direction: value });
  if (error) return { error: "Your vote wasn't saved. Please try again." };
  revalidatePath("/members");
  return { vote: data };
}
