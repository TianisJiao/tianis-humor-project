import {registerHooks} from 'node:module';
import assert from 'node:assert/strict';
registerHooks({resolve(specifier,context,next){if(specifier==='server-only')return {url:'data:text/javascript,',shortCircuit:true};if(specifier.endsWith('/caption-chain'))return next(specifier+'.js',context);return next(specifier,context);}});
const {generateCaptions}=await import('../lib/caption-chain.js');
const {generateMedia}=await import('../lib/generate-media.js');
process.env.OPENAI_API_KEY='test-only-value';
const config={slug:'postcard',model:'configured-model',steps:[{position:2,instructions_suffix:'Use a personal postcard voice.'}],terms:[{term:'Detour',definition:'A little adventure.',style:'scenery'},{term:'Wrong style',definition:'Skip this.',style:'meme'}],examples:[{title:'Light',input_description:'A skyline.',caption:'A quiet city.',style:'scenery'}]};
let calls=[],events=[],fail=false;
globalThis.fetch=async(_url,request)=>{const body=JSON.parse(request.body);calls.push(body);const first=body.input[0].content.some(c=>c.type==='input_image');return {ok:!fail,status:fail?401:200,headers:new Headers({'x-request-id':'req-test'}),json:async()=>({id:'resp-test',status:'completed',usage:{input_tokens:12,output_tokens:7},output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(first?{description:'A skyline.',detected_type:'scenery',reason:'Visible architecture.'}:{captions:['One','Two','Three']})}]}]})};};
const generated=await generateCaptions(new Uint8Array([1,2,3]),'image/png','city','','auto',{config,onStep:e=>events.push(e)});
assert.equal(events.length,2);assert.ok(events.every(e=>e.status==='succeeded'&&e.input_tokens===12&&e.provider_request_id==='req-test'));
assert.equal(calls[1].model,'configured-model');assert.ok(calls[1].instructions.includes('personal postcard'));
assert.ok(calls[1].input[0].content[0].text.includes('A little adventure'));assert.ok(!calls[1].input[0].content[0].text.includes('Wrong style'));
assert.equal(events[1].prompt.user_prompt,calls[1].input[0].content[0].text);
assert.ok(!JSON.stringify(events).includes('data:image'));assert.ok(!JSON.stringify(events).includes(process.env.OPENAI_API_KEY));
assert.equal(generated.version,'week7-postcard');
fail=true;events=[];await assert.rejects(()=>generateCaptions(new Uint8Array([1]),'image/png','city','','auto',{config,onStep:e=>events.push(e)}),/provider_authentication/);
assert.equal(events.length,1);assert.equal(events[0].http_status,401);assert.equal(events[0].output_text,'');assert.equal(events[0].input_tokens,null);
// Real orchestration: logs are mandatory; published media survives uncertain responses.
let dbCalls=[],published=false,removeCount=0,publishError=false;
const supabase={rpc:async(name,args)=>{dbCalls.push({name,args});if(name==='begin_generation')return {data:{request_id:'test-request',config}};if(name==='publish_meme'){published=true;if(publishError)return {error:{message:'network'}};}return {data:null,error:null};},
 storage:{from:()=>({upload:async()=>({error:null}),remove:async()=>{removeCount++;return {error:null};}})},
 from:()=>({select:()=>({eq:()=>({single:async()=>({data:{status:published?'ready':'pending'},error:null})})})})};
const args={supabase,image:{id:'test-image',storage_path:'private/photo.png'},bytes:new Uint8Array([1]),mime:'image/png',theme:'city',mode:'auto',source:'rating_app'};
fail=false;await generateMedia(args);assert.deepEqual(dbCalls.map(c=>c.name),['begin_generation','record_generation_step','record_generation_step','publish_meme','finish_generation']);
assert.equal(dbCalls.at(-1).args.succeeded,true);
published=false;dbCalls=[];fail=true;await assert.rejects(()=>generateMedia(args));assert.equal(removeCount,1);assert.equal(dbCalls.at(-1).args.failure_code,'provider_authentication');
fail=false;publishError=true;dbCalls=[];await assert.rejects(()=>generateMedia(args));assert.equal(removeCount,1);assert.ok(!dbCalls.some(c=>c.name==='fail_meme'));
console.log('PASS: real chain and orchestration with mocked provider/database; exact step outputs, usage/errors, active config, style references, persistence order, uncertain-publish protection.');
