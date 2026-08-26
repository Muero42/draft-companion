import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const INPUT='research/expert-v2-exact-return-input-v2.json.gz.b64';
const APP='app.js';
const buf=Buffer.from(fs.readFileSync(INPUT,'utf8').replace(/\s+/g,''),'base64');
const data=JSON.parse(zlib.gunzipSync(buf).toString('utf8'));
const app=fs.readFileSync(APP,'utf8');

if(data.kernelCommit!=='9ba6db89fc1e7550052a7526bd0c68d6cc7459dc') throw new Error('kernel pin drift');
if(data.schema!=='pitti-expert-v2-exact-return-input-v2') throw new Error('input schema drift');

const start=app.indexOf('const MANAGER_PROFILES=');
const end=app.indexOf('function returnValidationKey()');
if(start<0||end<=start) throw new Error('cannot extract Return-v2 kernel slice');
const kernel=app.slice(start,end);

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const pool=data.pool;
const keys=Object.keys(pool);
const baseIndex=new Map(keys.map((k,i)=>[k,i]));

function armRank(key,arm){
  const p=pool[key];
  if(!p)return NaN;
  if(arm==='wr-v2'&&p.pos==='WR'&&Number.isFinite(Number(p.v2Rank))) return Number(p.v2Rank);
  return Number(p.incRank);
}
function rankedAvailable(f,arm){
  // The frozen fixture order is the exact incumbent rankedAvailable order. For the WR-only
  // treatment, change only WR panel ranks and use the frozen order as deterministic tie-break.
  return f.available.map((key,i)=>({...pool[key],key,__fixtureOrder:i}))
    .filter(p=>p&&Number.isFinite(armRank(p.key,arm)))
    .sort((a,b)=>armRank(a.key,arm)-armRank(b.key,arm)||a.__fixtureOrder-b.__fixtureOrder)
    .map(p=>({name:p.name,pos:p.pos,team:p.team,yearsExp:p.yearsExp,key:p.key}));
}

function buildEngine(){
  const prelude=`
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\b(jr|sr|ii|iii|iv)\\b\\.?/g,'').replace(/[^a-z0-9]/g,'');
  const els={season:{value:'2026'}};
  const localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
  const ACTIVE_2026_MANAGER_MAP_TEXT='1=Michael, 2=Pascal Voerde, 3=Marc Düsseldorf, 4=Thomas, 5=Bjoern, 6=Pascal Gelderner, 7=Giuliano, 8=Basti, 9=Tim, 10=Dutch Marc';
  function rankFor(name,pos){const k=norm(name),r=globalThis.__rankMap[k];return Number.isFinite(r)?{rank:r}:null}
  function adpFor(name){const v=globalThis.__adpMap[norm(name)];return Number.isFinite(v)?v:null}
  function draftSlotAtPick(pickNo,teams){const r=Math.floor((pickNo-1)/teams)+1,w=(pickNo-1)%teams+1;return r%2?w:teams-w+1}
  function pinfo(){return{pos:''}}
  `;
  const suffix=`
  rosterBySlot=function(){const o={};for(const [k,v] of Object.entries(globalThis.__fixtureRosters||{}))o[k]={...v};return o};
  globalThis.__pitti={simulateReturnV2};
  `;
  const ctx={console,Math,JSON,Object,Array,Number,String,Set,Map,Date,Infinity,NaN};
  vm.createContext(ctx);
  vm.runInContext(prelude+kernel+suffix,ctx,{timeout:5000});
  return ctx;
}

const ctx=buildEngine();
function runFixture(f,arm){
  ctx.__fixtureRosters=f.rosters;
  ctx.__rankMap={};ctx.__adpMap={};
  for(const [k,p] of Object.entries(pool)){
    ctx.__rankMap[norm(p.name)]=armRank(k,arm);
    ctx.__adpMap[norm(p.name)]=Number(p.adp);
  }
  const ranked=rankedAvailable(f,arm);
  const rv=ctx.__pitti.simulateReturnV2({
    current:f.current,next:f.next,picks:[],players:{},teams:data.teams,map:f.managerMap,
    rankedAvailable:ranked,mode:f.mode||'mock',userSlot:data.slot
  },f.stress||'baseline',900);
  return {ranked,rv};
}

let n=0,sum=0,max=0;
const rows=[];
for(const f of data.fixtures){
  if(!Number.isFinite(f.next))continue;
  const {rv}=runFixture(f,'control');
  for(const [key,expected] of Object.entries(f.capturedReturn||{})){
    const got=rv?.players?.[key]?.ret;
    if(!Number.isFinite(got))throw new Error(`missing control Return pick=${f.current} player=${key}`);
    const e=Math.abs(got-Number(expected)); n++;sum+=e;max=Math.max(max,e);
  }
  rows.push({pick:f.current,controlTop24:Object.keys(rv.players),controlReturns:Object.fromEntries(Object.entries(rv.players).map(([k,v])=>[k,v.ret]))});
}
const mae=n?sum/n:NaN;
console.log(`CONTROL_PARITY predictions=${n} mae=${mae} max=${max}`);
if(max!==0) {
  console.error('CONTROL_PARITY_FAIL');
  process.exit(2);
}

console.log('WR_ONLY_RETURN_DIFFS');
for(const f of data.fixtures){
  if(!Number.isFinite(f.next))continue;
  const c=runFixture(f,'control'),w=runFixture(f,'wr-v2');
  const names=new Set([...Object.keys(c.rv.players),...Object.keys(w.rv.players)]);
  const diffs=[...names].map(k=>({k,c:c.rv.players[k]?.ret,w:w.rv.players[k]?.ret}))
    .filter(x=>Number.isFinite(x.c)&&Number.isFinite(x.w)&&Math.abs(x.c-x.w)>1e-12)
    .sort((a,b)=>Math.abs(b.w-b.c)-Math.abs(a.w-a.c));
  const maxDiff=diffs.length?Math.max(...diffs.map(x=>Math.abs(x.w-x.c))):0;
  console.log(JSON.stringify({pick:f.current,roster:f.rosters[String(data.slot)],maxReturnDelta:maxDiff,changedTop24:[...names].filter(k=>!(k in c.rv.players)||!(k in w.rv.players)),largest:diffs.slice(0,8)}));
}
