"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

async function signedIn() {
  const supabase = await createClient();
  const { data: { claims }, error } = await supabase.auth.getClaims();
  if (error || !claims?.sub) redirect("/login");
  return { supabase, id: claims.sub };
}

export async function updateNames(formData) {
  const { supabase, id } = await signedIn();
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80) redirect("/profile?error=names");

  const { error } = await supabase.from("profiles")
    .update({ first_name: firstName, last_name: lastName, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect("/profile?error=save");
  revalidatePath("/profile");
  revalidatePath("/members");
  redirect("/profile?saved=1");
}

export async function uploadAvatar(formData) {
  const { supabase, id } = await signedIn();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0 || file.size > 2 * 1024 * 1024) redirect("/profile?error=file");

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const type = png ? "image/png" : jpg ? "image/jpeg" : webp ? "image/webp" : null;
  if (!type) redirect("/profile?error=file");

  const extension = png ? "png" : jpg ? "jpg" : "webp";
  const path = `${id}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { contentType: type, upsert: false });
  if (uploadError) redirect("/profile?error=upload");

  const { error: dbError } = await supabase.from("profiles")
    .update({ avatar_path: path, updated_at: new Date().toISOString() }).eq("id", id);
  if (dbError) {
    await supabase.storage.from("avatars").remove([path]);
    redirect("/profile?error=save");
  }
  revalidatePath("/profile");
  redirect("/profile?saved=1");
}
