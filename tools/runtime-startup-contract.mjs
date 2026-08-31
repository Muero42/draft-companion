import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const policy=fs.readFileSync('decision-policy.js','utf8');

const version=(app.match(/const APP_VERSION='([^']+)'/)||[])[1];
assert(version,'APP_VERSION missing');
for(const src of [html,sw])assert(src.includes(version),'runtime version parity missing: '+version);

// Parse source app after removing its static import.
new Function(app.replace(/^import[^\n]*\n/,''));

// Parse decision policy after removing ESM export keywords.
new Function(policy.replace(/\bexport\s+/g,''));

// Browser-visible controls required before any refresh can work.
for(const id of ['refreshAllBtn','qualityStatus','apiKey','season','scoring','draftInput','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','strategyMode']){
  assert(new RegExp('id=["\\\']'+id+'["\\\']').test(html),'required DOM id missing: '+id);
}

// Reproduce exactly the service-worker app transform that the Android/PWA runtime receives.
const base=sw.match(/const BASE='([^']+)',TARGET='([^']+)'/);
assert(base,'service-worker BASE/TARGET missing');
const start=sw.indexOf('function patchApp(s){');
const end=sw.indexOf('\nfunction patchText',start);
assert(start>=0&&end>start,'patchApp extraction failed');
const patchApp=Function('const BASE='+JSON.stringify(base[1])+',TARGET='+JSON.stringify(base[2])+';\n'+sw.slice(start,end)+'; return patchApp')();
const patched=patchApp(app);
new Function(patched.replace(/^import[^\n]*\n/,''));

// The exact failure that broke rc4.138-rc4.140: adjacent object properties without a comma.
assert(!/\]\}\s+\[norm\(/.test(app),'fatal RESEARCH_RESIDUAL_PRIORS property adjacency without comma');

// Refresh must become visibly observable before any network call.
const handler=app.slice(app.indexOf('els.refreshAllBtn.onclick='),app.indexOf('if(els.adpFile)',app.indexOf('els.refreshAllBtn.onclick=')));
assert(handler.includes("els.refreshAllBtn.textContent='Aktualisiere …'"),'refresh immediate button feedback missing');
assert(handler.includes("els.qualityStatus.textContent='Datenupdate gestartet …'"),'refresh immediate status feedback missing');
assert(handler.indexOf("Datenupdate gestartet …") < handler.indexOf("proxyCall("),'refresh feedback must precede first network call');


/* Execute the real app prefix through refresh-handler binding in a browser-like harness.
   This catches top-level runtime aborts that syntax-only CI misses. */
const elements=new Map();
function fakeElement(id=''){
  const base={id,value:'',checked:false,disabled:false,hidden:false,options:[],style:{},dataset:{},
    classList:{add(){},remove(){},toggle(){}},add(x){this.options.push(x)},addEventListener(){},
    querySelectorAll(){return[]},querySelector(){return null},append(){},appendChild(){},
    setAttribute(){},removeAttribute(){},focus(){},blur(){}};
  return new Proxy(base,{get(t,p){if(p in t)return t[p];if(['innerHTML','textContent','className','type'].includes(String(p)))return '';return ()=>{}},set(t,p,v){t[p]=v;return true}});
}
globalThis.document={getElementById(id){if(!elements.has(id))elements.set(id,fakeElement(id));return elements.get(id)},querySelectorAll(){return[]}};
globalThis.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]??null},get length(){return this._m.size}};
globalThis.Option=function(text,value){this.text=text;this.value=value};
Object.defineProperty(globalThis,'navigator',{value:{},configurable:true,writable:true});
Object.defineProperty(globalThis,'location',{value:{},configurable:true,writable:true});
Object.defineProperty(globalThis,'window',{value:globalThis,configurable:true,writable:true});
globalThis.fetch=async()=>({ok:false,json:async()=>({}),text:async()=>''});
const prefixEnd=app.indexOf('if(els.adpFile)',app.indexOf('els.refreshAllBtn.onclick='));
assert(prefixEnd>0,'refresh handler prefix boundary missing');
new Function(app.slice(0,prefixEnd).replace(/^import[^\n]*\n/,''))();
assert.equal(typeof elements.get('refreshAllBtn')?.onclick,'function','refreshAllBtn handler was not bound during startup prefix');

console.log('RUNTIME_STARTUP_CONTRACT_PASS',version);
