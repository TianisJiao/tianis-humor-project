import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`
create role anon; create role authenticated;
create schema auth; create schema storage;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth, storage to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
create table storage.buckets (id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
alter table storage.objects enable row level security;
grant select, insert, delete on storage.objects to authenticated;
create function storage.foldername(text) returns text[] language sql as $$ select string_to_array($1,'/') $$;
`);
const root = fileURLToPath(new URL('../', import.meta.url));
await db.exec(readFileSync(root+'supabase/setup.sql','utf8'));
await db.exec(readFileSync(root+'supabase/week3-auth.sql','utf8'));
const migration = readFileSync(root+'supabase/week4-memes.sql','utf8');
await db.exec(migration);
await db.exec(migration); // Migration must be idempotent.
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
await db.exec(`insert into auth.users values ('${a}'),('${b}');`);
async function role(user, kind='authenticated') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user??'']);
  await db.exec('set role '+kind);
}
async function denied(sql, params=[]) { await assert.rejects(()=>db.query(sql, params)); }
const prompts=JSON.stringify([{step:'describe_image',model:'test-model',instructions:'Describe visible content.',user_prompt:'Describe this image.'},{step:'write_captions',model:'test-model',instructions:'Write three funny captions.',user_prompt:'Image description: a cat in a box.'}]);
const publishSql = "select public.publish_meme($1,$2,$3::text[],$4::jsonb,'test-model','test-v1')";
await role(a);
const reservation=(await db.query("select public.reserve_meme_image('png') as r")).rows[0].r;
await denied("select public.reserve_meme_image('png')"); // Concurrent generation blocked.
await db.query("insert into storage.objects(bucket_id,name) values ('meme-images',$1)",[reservation.storage_path]);
await denied(publishSql,[reservation.id,"description",["same","same","same"],prompts]);
assert.equal((await db.query('select count(*)::int as n from public.meme_captions')).rows[0].n,0);
await denied(publishSql,[reservation.id,"A cat sits in a box.",["a","b","c"],"[]"]);
await db.query(publishSql,[reservation.id,"A cat sits in a box.",["Rent controlled.","My office has walls.","If I fits, I commits."],prompts]);
assert.deepEqual((await db.query('select prompts from public.meme_generations')).rows[0].prompts,JSON.parse(prompts));
const c=(await db.query('select id from public.meme_captions order by position')).rows[0].id;
async function vote(value) { return (await db.query('select public.cast_caption_vote($1,$2) as r',[c,value])).rows[0].r; }
assert.deepEqual(await vote(1),{score:1,upvotes:1,downvotes:0,mine:1});
assert.deepEqual(await vote(-1),{score:-1,upvotes:0,downvotes:1,mine:-1});
assert.deepEqual(await vote(-1),{score:0,upvotes:0,downvotes:0,mine:0});
await vote(1);
await denied('select public.cast_caption_vote($1,0)',[c]);
await denied("insert into public.caption_votes(caption_id,user_id,value) values ($1,$2,-1)",[c,b]);
await denied("insert into public.caption_votes(caption_id,user_id,value) values ($1,$2,1)",[c,a]); // Duplicate.
await denied('update public.meme_images set description=\'tamper\'');
await role(b);
assert.equal((await db.query('select count(*)::int as n from public.caption_votes')).rows[0].n,0); // Other votes private.
assert.equal((await db.query('select count(*)::int as n from public.meme_captions')).rows[0].n,3);
assert.equal((await db.query("delete from storage.objects where name=$1 returning id",[reservation.storage_path])).rows.length,0);
await denied(publishSql,[reservation.id,"tamper",["a","b","c"],prompts]);
assert.equal((await db.query('select count(*)::int as n from public.meme_generations')).rows[0].n,0); // Other users cannot read prompts.
assert.deepEqual(await vote(-1),{score:0,upvotes:1,downvotes:1,mine:-1});
assert.equal((await db.query('select score from public.caption_scores(array[$1::uuid])',[c])).rows[0].score,0);
assert.equal((await db.query('delete from public.caption_votes where user_id=$1 returning caption_id',[a])).rows.length,0);
await role(null,'anon');
await denied('select * from public.meme_images');
await denied('select public.cast_caption_vote($1,1)',[c]);
await denied("select public.reserve_meme_image('png')");
assert.equal((await db.query('select count(*)::int as n from public.caption_ideas')).rows[0].n,3);
await role(a);
for(let i=0;i<9;i++) { const r=(await db.query("select public.reserve_meme_image('png') as r")).rows[0].r; await db.query('select public.fail_meme($1)',[r.id]); }
await denied("select public.reserve_meme_image('png')");
await db.exec('reset role');
const tables=(await db.query("select tablename, rowsecurity from pg_tables where schemaname='public'")).rows;
assert.ok(tables.every(t=>t.rowsecurity));
console.log('PASS: migration rerun, private prompt persistence, atomic publish, insert/change/undo votes, uniqueness, cross-user RLS, anonymous denial, private Storage, daily upload cap, all public-table RLS.');
await db.close();
