'use strict';
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function draftSlotAtPick(p,teams){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1;return r%2?w:teams-w+1}
function slotsBetween(current,next,teams){const a=[];for(let p=current;p<next;p++)a.push(draftSlotAtPick(p,teams));return a}
function firstOpponentPick(current,teams,userSlot){return draftSlotAtPick(current,teams)===userSlot?current+1:current}
if(slotsBetween(firstOpponentPick(1,10,9),9,10).length!==8)throw new Error('pre-draft slot 9 must have 8 opponent picks before 1.09');
if(slotsBetween(firstOpponentPick(9,10,9),12,10).length!==2)throw new Error('after/at 1.09 short turn must have 2 opponent picks before 2.02');
function need(pos,c){if(pos==='TE')return c.TE===0?1.10:.20;if(pos==='RB')return c.RB<2?1.12:c.RB<4?.92:.58;if(pos==='WR')return c.WR<3?1.10:c.WR<5?.94:.62;return 1}
function weight(p,pick,c){const center=p.adp*.72+p.rank*.28,tau=pick<=30?3.25:pick<=80?5.5:8.5;return Math.exp(clamp((pick-center)/tau,-8,3.5))*need(p.pos,c)}
function rng(seed){let x=seed>>>0;return()=>{x=(x+0x6D2B79F5)|0;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function choose(pool,pick,c,r){const ws=pool.map(p=>weight(p,pick,c));let q=r()*ws.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){q-=ws[i];if(q<=0)return i}return pool.length-1}
const P=[
 ['Bijan','RB',1.2,1.9],['Gibbs','RB',1.8,2.3],['Chase','WR',3,3.7],['Puka','WR',4,4.8],['JSN','WR',5.2,7.3],['Amon','WR',5.8,8.2],['Cook','RB',9,8.6],['CMC','RB',9.2,5.7],['JT','RB',9.4,6.4],['Jeanty','RB',11.1,11.9],['Brown','RB',11.9,16.4],['Lamb','WR',12.7,10.3],['Jefferson','WR',13.4,11.4],['Walker','RB',13.7,20.6],['Bowers','TE',14,18],['Hampton','RB',15.9,14.7],['London','WR',17.7,15.5],['Barkley','RB',17.8,13.5],['Achane','RB',17.9,13.6],['Nico','WR',21.2,18.5],['Henry','RB',23.5,22],['AJB','WR',24,18.2],['Pickens','WR',24.2,27.1],['Olave','WR',26.9,31.8],['Flowers','WR',27,43.5]
].map(([name,pos,rank,adp])=>({name,pos,rank,adp}));
const runs=6000,survive=Object.fromEntries(P.map(p=>[p.name,0]));
for(let run=0;run<runs;run++){
 const r=rng(731+run*2654435761),pool=P.slice(),rosters=Array.from({length:8},()=>({RB:0,WR:0,TE:0}));
 for(let pick=1;pick<=8;pick++){const i=choose(pool,pick,rosters[pick-1],r),p=pool.splice(i,1)[0];rosters[pick-1][p.pos]=(rosters[pick-1][p.pos]||0)+1}
 const left=new Set(pool.map(p=>p.name));for(const p of P)if(left.has(p.name))survive[p.name]++;
}
const pct=n=>survive[n]/runs;
if(pct('Bijan')>.12||pct('Gibbs')>.15||pct('Chase')>.20)throw new Error(`elite early-market survival implausible: ${pct('Bijan')},${pct('Gibbs')},${pct('Chase')}`);
if(pct('Jeanty')<.55)throw new Error(`pick-12 market player made too unavailable by pick 9: ${pct('Jeanty')}`);
console.log('PASS',Object.fromEntries(['Bijan','Gibbs','Chase','Puka','JSN','Amon','Cook','JT','Jeanty'].map(n=>[n,Math.round(pct(n)*1000)/10])));
