import "server-only";
import {generateCaptions} from "./caption-chain";
function checked(result, code) {if (result.error) throw new Error(code); return result.data;}
export async function generateMedia({supabase, image, bytes, mime, theme, landmarkId = "", mode, source}) {
  let requestId = null, uploaded = false;
  try {
    const request = checked(await supabase.rpc("begin_generation", {target_image: image.id, request_source: source, caption_mode: mode}), "generation_configuration_failed");
    requestId = request.request_id;
    if (request.config?.error) throw new Error("no_enabled_chain");
    checked(await supabase.storage.from("meme-images").upload(image.storage_path, bytes, {contentType: mime, upsert: false}), "storage_upload_failed");
    uploaded = true;
    const generated = await generateCaptions(bytes, mime, theme, landmarkId, mode, {
      config: request.config,
      onStep: async payload => checked(await supabase.rpc("record_generation_step", {target_request: requestId, payload}), "telemetry_write_failed"),
    });
    checked(await supabase.rpc("publish_meme", {image_id: image.id, image_description: generated.description,
      caption_texts: generated.captions, generation_prompts: generated.prompts,
      generation_model: generated.model, generation_version: generated.version}), "publish_failed");
    checked(await supabase.rpc("finish_generation", {target_request: requestId, succeeded: true}), "telemetry_finish_failed");
    return generated;
  } catch (error) {
    // A timed-out publish may have committed. Never remove a published object's file.
    const current = await supabase.from("meme_images").select("status").eq("id", image.id).single();
    if (!current.error && current.data?.status !== "ready") {
      if (uploaded) await supabase.storage.from("meme-images").remove([image.storage_path]);
      await supabase.rpc("fail_meme", {image_id: image.id});
      if (requestId) await supabase.rpc("finish_generation", {target_request: requestId, succeeded: false,
        failure_code: /^[a-z0-9_]{1,80}$/.test(error.message) ? error.message : "generation_failed"});
    }
    console.error("Generation did not finish", {imageId: image.id, requestId, code: /^[a-z0-9_]{1,80}$/.test(error.message) ? error.message : "generation_failed"});
    throw new Error("Generation could not finish or be confirmed. Check Generation requests in the admin app before retrying.");
  }
}
