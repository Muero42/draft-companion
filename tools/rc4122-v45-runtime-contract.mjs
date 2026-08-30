import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const v2src=fs.readFileSync('expert-v2-board.js','utf8');
const v3src=fs.readFileSync('expert-v3-board.js','utf8');

const must=(s,x,msg)=>{if(!s.includes(x))throw new Error(msg+': '+x)};

for(const x of [
  "const APP_VERSION='v11.8.0-rc4.123'",
  "const v3Id=EXPERT_PROFILE_IDS.expertv3[pos]",
  "const overall=Number(row.overallRank),posRank=Number(row.posRank??row.rank);",
  "rank:mean,overallRank:mean,posRank:posMean",
  "rank:Number(k.overallRank??k.rank)",
  "const rawTotal=Object.values(raw).reduce((z,w)=>z+(Number(w)||0),0);",
  "rehydrateDerivedExpertPanelsOnStartup();"
]) must(app,x,'app contract missing');

for(const x of [
  "function expertRankLabel(hit,pos)",
  "return'expertv5'",
  "return'expertv4'",
  "${pos}#${Math.round(posRank)} · Ovr #${Math.round(overall)}"
]) must(live,x,'live contract missing');

if(app.includes("expertName:koerner,rank:Number(k.posRank??k.rank)"))
  throw new Error('v5 mixes Koerner positional rank into frozen v3 Overall baseline');
if(app.includes("byName.get(k).vals.push({expertName,rank:Number(row.posRank??row.rank)"))
  throw new Error('v4 uses positional rank as global cross-position panel rank');

const ctx2={window:{}};vm.createContext(ctx2);vm.runInContext(v2src,ctx2);
const ctx3={window:{}};vm.createContext(ctx3);vm.runInContext(v3src,ctx3);
const v2=ctx2.window.PITTI_EXPERT_V2,v3=ctx3.window.PITTI_EXPERT_V3;
if(!v2||!v3)throw new Error('embedded boards did not load');

const mins={QB:24,RB:60,WR:70,TE:24};
for(const pos of Object.keys(mins)){
  const rows=v2.rows?.[pos]||[];
  if(rows.length<mins[pos])throw new Error(`v5 ${pos} base depth ${rows.length}<${mins[pos]}`);
  const base=v3.weights?.[pos]||v2.weights?.[pos]||{};
  const raw={...base};let need=15;
  const ds=Object.keys(raw).find(n=>n==='Draft Sharks Team');
  if(ds){const take=Math.min(Number(raw[ds])||0,need);raw[ds]-=take;need-=take}
  if(need>0){
    const others=Object.keys(raw).filter(n=>n!==ds&&Number(raw[n])>0);
    const sum=others.reduce((z,n)=>z+Number(raw[n]),0);
    for(const n of others)raw[n]=Math.max(0,Number(raw[n])-need*Number(raw[n])/sum);
  }
  raw['Sean Koerner']=15;
  const total=Object.values(raw).reduce((z,w)=>z+(Number(w)||0),0);
  const weights=Object.fromEntries(Object.entries(raw).filter(([,w])=>Number(w)>0).map(([n,w])=>[n,Number(w)/total]));
  if(Math.abs(weights['Sean Koerner']-.15)>1e-12)throw new Error(`${pos} Koerner not exact 15%`);
  const expectedDs=Math.max(0,(Number(base['Draft Sharks Team']||0)-15)/100);
  if(Math.abs((weights['Draft Sharks Team']||0)-expectedDs)>1e-12)throw new Error(`${pos} Draft Sharks funding drift`);
}

// Execute the exact compact label function as the device surface would use it.
const start=live.indexOf('function expertRankLabel'),end=live.indexOf('\nfunction ex',start);
if(start<0||end<0)throw new Error('expertRankLabel extraction failed');
const label=vm.runInNewContext('('+live.slice(start,end).replace(/^function expertRankLabel/,'function')+')');
if(label({rank:14,posRank:8,overallRank:14})!=='#14')
  throw new Error('Barkley/Pat compact Overall-only canary failed');
if(label({rank:14,overallRank:14,posRank:null})!=='#14')
  throw new Error('Overall-only label failed');
if(live.includes('Ovr #${Math.round(overall)}')||live.includes('${pos}#${Math.round(posRank)}'))
  throw new Error('compact surface exposes positional/dual-rank clutter');

console.log('rc4.122 v4/v5 runtime contract PASS');
