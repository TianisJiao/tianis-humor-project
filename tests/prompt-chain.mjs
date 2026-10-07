// Stub only Next's server-only boundary; execute the actual prompt-chain code.
import { registerHooks } from 'node:module';
import assert from 'node:assert/strict';
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') return {url:'data:text/javascript,',shortCircuit:true};
  return nextResolve(specifier, context);
}});
const {generateCaptions}=await import('../lib/caption-chain.js');
const calls=[];
process.env.OPENAI_API_KEY='test-placeholder';
process.env.OPENAI_MODEL='test-vision-model';
globalThis.fetch=async (_url,request)=>{
 const body=JSON.parse(request.body); calls.push(body);
 const text=calls.length===1?'A cat sits in a cardboard box.':JSON.stringify({captions:['Rent controlled.','My office has walls.','If I fits, I commits.']});
 return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text}]}]})};
};
const result=await generateCaptions(new Uint8Array([137,80,78,71]),'image/png','dorm');
assert.equal(calls.length,2);
assert.equal(calls[0].input[0].content[1].type,'input_image');
assert.equal(calls[1].input[0].content.length,1);
assert.equal(calls[1].input[0].content[0].type,'input_text');
assert.ok(calls[1].input[0].content[0].text.includes(result.description));
assert.ok(calls[1].input[0].content[0].text.includes('dorm life'));
assert.equal(result.captions.length,3);
assert.equal(calls[0].store,false);
assert.equal(calls[1].text.format.type,'json_schema');
for (let i=0;i<2;i++) {
 assert.equal(result.prompts[i].instructions,calls[i].instructions);
 assert.equal(result.prompts[i].user_prompt,calls[i].input[0].content[0].text);
 assert.equal(result.prompts[i].model,calls[i].model);
}
assert.deepEqual(result.prompts[1].response_format,calls[1].text.format);
assert.equal(result.prompts[0].image_detail,calls[0].input[0].content[1].detail);
assert.ok(!JSON.stringify(result.prompts).includes('data:image'));
assert.ok(!JSON.stringify(result.prompts).includes('test-placeholder'));
await assert.rejects(()=>generateCaptions(new Uint8Array(),'image/png','invalid'));
assert.equal(calls.length,2);
console.log('PASS: sequential image-to-description-to-caption chain; exact prompt/model/format capture; no image bytes or API key in saved prompts; theme validation. Provider responses are mocked.');
