'use strict';
function path(rows,pos,limit){
  return rows.filter(x=>x.p.pos===pos).slice().sort((a,b)=>{
    const ap=Number.isFinite(a.r?.posRank)?a.r.posRank:Infinity;
    const bp=Number.isFinite(b.r?.posRank)?b.r.posRank:Infinity;
    if(ap!==bp)return ap-bp;
    const ar=Number.isFinite(a.r?.rank)?a.r.rank:Infinity;
    const br=Number.isFinite(b.r?.rank)?b.r.rank:Infinity;
    if(ar!==br)return ar-br;
    const aa=Number.isFinite(a.a)?a.a:Infinity;
    const ba=Number.isFinite(b.a)?b.a:Infinity;
    if(aa!==ba)return aa-ba;
    return (b.score??-999)-(a.score??-999);
  }).slice(0,limit);
}
const qb=(name,posRank,rank,score,adp)=>({p:{name,pos:'QB'},r:{posRank,rank},score,a:adp});
const rows=[
  qb('Geno Smith',28,104,99,170),
  qb('Aaron Rodgers',29,109,98,175),
  qb('Josh Allen',1,24,30,24),
  qb('Lamar Jackson',2,31,28,31),
  qb('Drake Maye',3,38,10,38),
  qb('Joe Burrow',4,43,9,43),
  qb('Jayden Daniels',5,49,8,49),
  qb('Jalen Hurts',6,52,7,52),
  qb('Justin Herbert',8,66,6,66),
];
const got=path(rows,'QB',4).map(x=>x.p.name);
const expected=['Josh Allen','Lamar Jackson','Drake Maye','Joe Burrow'];
if(JSON.stringify(got)!==JSON.stringify(expected))throw new Error(`QB path ordering failed: ${got.join(', ')}`);
if(got.includes('Geno Smith')||got.includes('Aaron Rodgers'))throw new Error('Deep QBs leaked into top path');
const te=[
 {p:{name:'Deep TE',pos:'TE'},r:{posRank:18,rank:120},score:100,a:140},
 {p:{name:'TE1',pos:'TE'},r:{posRank:1,rank:18},score:10,a:20},
 {p:{name:'TE2',pos:'TE'},r:{posRank:2,rank:24},score:9,a:25},
 {p:{name:'TE3',pos:'TE'},r:{posRank:3,rank:40},score:8,a:42},
];
const gotTe=path(te,'TE',3).map(x=>x.p.name);
if(JSON.stringify(gotTe)!==JSON.stringify(['TE1','TE2','TE3']))throw new Error(`TE path ordering failed: ${gotTe.join(', ')}`);
console.log('PASS position-path panel-positional-first regression');
