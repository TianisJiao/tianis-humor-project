import assert from 'node:assert/strict';
import { fitPostcardPhoto, wrapPostcardText, drawPostcard } from '../lib/postcard-layout.mjs';
const ctx = new Proxy({font:'',measureText(text) { return {width: Array.from(text).length * (parseInt(this.font.match(/\d+/)?.[0] ?? '38')*.55)}; }},{get(target,key){return key in target ? target[key] : ()=>{};}});
for(const [width,height] of [[4000,3000],[1200,4000],[8000,500],[1080,1080]]) {
 const fit=fitPostcardPhoto(width,height);
 assert.ok(fit.x>=90 && fit.y>=226 && fit.x+fit.width<=942.01 && fit.y+fit.height<=946.01);
 assert.ok(Math.abs(fit.width/fit.height-width/height)<1e-8);
}
const caption='New York gave me a skyline, a side quest, and absolutely no explanation for why my coffee costs this much. '.repeat(2).slice(0,240);
const result=drawPostcard(ctx,{naturalWidth:1200,naturalHeight:4000},caption);
assert.equal(result.lines.join(' ').replace(/\s+/g,' ').trim(),caption.replace(/\s+/g,' ').trim());
assert.ok(304+(result.lines.length-1)*result.fontSize*1.35+result.fontSize<921);
ctx.font='38px Georgia';
const chinese='纽约的每一栋楼都像是在认真开会而我只是来散步的'.repeat(3);
assert.equal(wrapPostcardText(ctx,chinese,472).join(''),chinese);
assert.throws(()=>fitPostcardPhoto(0,100));
console.log('PASS: whole-photo aspect ratios; long-caption layout within postcard panel; CJK wrapping; invalid image rejection. Browser export still needs live verification.');
const { NYC_LANDMARKS, NYC_BOROUGHS, landmarkById } = await import('../lib/nyc-landmarks.mjs');
assert.equal(NYC_LANDMARKS.length,16);
assert.equal(new Set(NYC_LANDMARKS.map(place=>place.id)).size,16);
for(const borough of NYC_BOROUGHS) assert.ok(NYC_LANDMARKS.some(place=>place.borough===borough.name));
for(const place of NYC_LANDMARKS) {
 assert.ok(place.x>0&&place.x<100&&place.y>0&&place.y<100);
 assert.ok(place.source.startsWith('https://'));
 assert.equal(landmarkById(place.id),place);
}
assert.equal(landmarkById('unknown-place'),undefined);
console.log('PASS: sixteen unique sourced stops; all five boroughs represented; positions within the atlas.');
