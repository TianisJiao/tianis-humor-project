-- Run AFTER week4-memes.sql in the same Supabase project; safe to rerun.
-- Existing captions were generated as jokes: preserve their style and all votes.
begin;
alter table public.meme_images add column if not exists caption_style text not null default 'meme'
  check (caption_style in ('meme', 'scenery'));

create or replace function public.publish_meme(image_id uuid, image_description text, caption_texts text[], generation_prompts jsonb, generation_model text, generation_version text)
returns void language plpgsql security definer set search_path = '' as $$
declare img public.meme_images; caption text; prompt jsonb; n integer := 0; style text;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  select * into img from public.meme_images i where i.id = image_id and i.user_id = auth.uid() for update;
  if not found or img.status <> 'pending' then raise exception 'invalid_image'; end if;
  if not exists (select 1 from storage.objects o where o.bucket_id = 'meme-images' and o.name = img.storage_path) then raise exception 'missing_upload'; end if;
  if image_description is null or length(trim(image_description)) not between 1 and 4000 or caption_texts is null or cardinality(caption_texts) <> 3 then raise exception 'invalid_output'; end if;
  if (select count(distinct trim(t)) from unnest(caption_texts) as t) <> 3 then raise exception 'invalid_output'; end if;
  if generation_prompts is null or jsonb_typeof(generation_prompts) <> 'array' then raise exception 'invalid_prompts'; end if;
  if octet_length(generation_prompts::text) > 30000 or jsonb_array_length(generation_prompts) <> 2 or generation_model is null or generation_version is null then raise exception 'invalid_prompts'; end if;
  if generation_prompts->0->>'step' is distinct from 'describe_image' or generation_prompts->1->>'step' is distinct from 'write_captions' then raise exception 'invalid_prompts'; end if;
  for prompt in select value from jsonb_array_elements(generation_prompts) loop
    if jsonb_typeof(prompt->'instructions') is distinct from 'string' or length(trim(prompt->>'instructions')) not between 1 and 8000
      or jsonb_typeof(prompt->'user_prompt') is distinct from 'string' or length(trim(prompt->>'user_prompt')) not between 1 and 8000
      or prompt->>'model' is distinct from generation_model then raise exception 'invalid_prompts'; end if;
  end loop;
  style := coalesce(generation_prompts->0->>'caption_style', 'meme');
  if style not in ('meme', 'scenery') then raise exception 'invalid_caption_style'; end if;
  insert into public.meme_generations(image_id, prompts, model, prompt_version) values (img.id, generation_prompts, generation_model, generation_version);
  foreach caption in array caption_texts loop
    if caption is null or length(trim(caption)) not between 1 and 240 then raise exception 'invalid_caption'; end if;
    n := n + 1;
    insert into public.meme_captions(image_id, text, position) values (img.id, trim(caption), n);
  end loop;
  update public.meme_images set description = trim(image_description), caption_style = style, status = 'ready' where id = img.id;
end $$;

revoke all on function public.publish_meme(uuid,text,text[],jsonb,text,text) from public, anon;
grant execute on function public.publish_meme(uuid,text,text[],jsonb,text,text) to authenticated;
commit;
