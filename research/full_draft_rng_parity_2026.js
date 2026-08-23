'use strict';
/* Whole-draft RNG integration parity gate.
   This intentionally isolates the opponent-draft RNG plumbing used by the rc4.59
   research kernel. It proves that replacing the legacy closure RNG with the
   snapshot-capable StatefulRng changes no draft outcome when no treatment occurs. */
const assert=require('assert');
const {StatefulRng,legacyRng}=require('./stateful_rng_2026');
const crypto=require('crypto');
function stable(v){if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return '['+v.map(stable).join(',')+']';return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}'}
function sha(v){return crypto.createHash('sha256').update(stable(v)).digest('hex')}
function wpick(r,items,weights){let total=weights.reduce((a,b)=>a+b,0),x=r()*total;for(let i=0;i<items.length;i++){x-=weights[i];if(x<=0)return items[i]}return items.at(-1)}
function special(r,c,pn){/* same multi-draw shape as full harness: hazard gate + conditional selector */
  const hk=c.K===0&&pn>110?.18:0,hd=c.DEF===0&&pn>110?.16:0,anyp=1-(1-hk)*(1-hd);if(r()>=anyp)return null;if(hk<=0)return'DEF';if(hd<=0)return'K';return r()<hk/(hk+hd)?'K':'DEF';
}
function slotAt(p){const rd=Math.floor((p-1)/10)+1,w=(p-1)%10+1;return rd%2?w:11-w}
function simulate(makeRng,seed){
  const r=makeRng(seed), pool=[]; for(let i=1;i<=245;i++)pool.push({id:String(i),pos:['RB','WR','TE','QB'][i%4],q:i});
  const avail=new Set(pool.map(x=>x.id)),rosters=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,[]])),picks=[];
  for(let pn=1;pn<=150;pn++){
    const slot=slotAt(pn),c={QB:0,RB:0,WR:0,TE:0,K:0,DEF:0};for(const x of rosters[slot])c[x.pos]=(c[x.pos]||0)+1;
    const sp=special(r,c,pn);if(sp){const x={id:`${sp}-${pn}`,pos:sp,q:999};rosters[slot].push(x);picks.push([pn,slot,x.id]);continue}
    const cand=pool.filter(x=>avail.has(x.id)).slice(0,Math.min(32,avail.size));
    const weights=cand.map((x,j)=>Math.exp(-j/8)*(x.pos==='RB'&&c.RB<2?1.12:x.pos==='WR'&&c.WR<3?1.10:1));
    const x=wpick(r,cand,weights);avail.delete(x.id);rosters[slot].push(x);picks.push([pn,slot,x.id]);
  }
  return {picks,rosters,remaining:[...avail]};
}
const seeds=[1,17,20260823,0xffffffff,0x12345678];
for(const seed of seeds){const a=simulate(s=>legacyRng(s),seed),b=simulate(s=>{const x=new StatefulRng(s);return()=>x.next()},seed);assert.deepStrictEqual(b,a,'whole-draft mismatch seed '+seed)}
console.log(JSON.stringify({status:'PASS',gate:'whole-draft-legacy-stateful-parity',seeds,draw_shapes:['weighted-choice','special-multi-draw'],drafts:seeds.length,picks_per_draft:150,fingerprint:sha(seeds.map(s=>simulate(x=>legacyRng(x),s).picks))}));
