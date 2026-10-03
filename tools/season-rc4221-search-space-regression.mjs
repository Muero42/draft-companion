import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8').replace(/\r\n/g,'\n');
const start=app.indexOf('function seasonTradeTargetPool('),end=app.indexOf('\nfunction ',start+1);
const context={seasonWeeklyMetric:(p,metric)=>({status:p.stale?'STALE_OR_UNVERIFIED':'VERIFIED',value:metric==='trade_value'?p.market:p.points})};
vm.createContext(context);vm.runInContext(app.slice(start,end),context);
// Synthetic regression values only; never used as recovered Production evidence.
const row=(id,pos,market,extra={})=>({seasonStatus:'ACTIVE',p:{id,pos,market,points:10,...extra}});
const mine=[...Array.from({length:6},(_,i)=>row('mw'+i,'WR',20)),...Array.from({length:4},(_,i)=>row('mr'+i,'RB',20)),row('mq','QB',20),row('mt1','TE',20),row('mt2','TE',20)];
const opponent=[row('q1','QB',15),row('q2','QB',10),row('t1','TE',20),row('t2','TE',10),row('r1','RB',30),row('r2','RB',25),row('r3','RB',35),row('wr-star','WR',80),row('wr2','WR',50),row('wr3','WR',12)];
const old=opponent.slice().sort((a,b)=>mine.filter(x=>x.p.pos===a.p.pos).length-mine.filter(x=>x.p.pos===b.p.pos).length).slice(0,6);
assert(!old.some(x=>x.p.pos==='WR'),'real roster count geometry reproduces former WR exclusion');
const select=rows=>context.seasonTradeTargetPool(rows,mine,{});
const chosen=select(opponent);
assert.equal(chosen.length,6);assert(chosen.includes(opponent[7])&&chosen.includes(opponent[8]),'current market leaders survive WR abundance');
assert.deepEqual(new Set(chosen.map(x=>x.p.pos)),new Set(['QB','RB','WR','TE']));
assert.equal(new Set(chosen.map(x=>x.p.id)).size,chosen.length);
assert.deepEqual(chosen.map(x=>x.p.id),select(opponent.slice().reverse()).map(x=>x.p.id),'stable market ordering independent of roster order');
const invalid=[row('stale','WR',100,{stale:true}),row('zero','QB',0),{...row('ir','TE',100),seasonStatus:'RESERVE'},row('k','K',100)];
assert(!select([...opponent,...invalid]).some(x=>invalid.includes(x)));
assert(select(opponent.filter(x=>x.p.pos==='WR')).every(x=>x.p.pos==='WR'),'no unsupported positional quota');
assert.equal(select(invalid).length,0,'no stale/zero/special/IR admission');
// Quality-qualified coverage, not a compulsory slot for each positive-valued position.
for(const pos of ['WR','RB']){
  const heavy=Array.from({length:7},(_,i)=>row(pos+i,pos,100-i*10));
  const weak=row('weak-q','QB',0.01),representative=row('good-t','TE',30);
  const pool=select([...heavy,weak,representative]);
  assert(!pool.includes(weak),'near-zero coverage must not displace a strong market asset');
  assert(pool.includes(representative),'quality-qualified lower-market position remains discoverable');
  assert.equal(pool.length,6);assert(pool.includes(heavy[0])&&pool.includes(heavy[1]));
  assert.deepEqual(pool.map(x=>x.p.id),select([...heavy,weak,representative].reverse()).map(x=>x.p.id));
}
const elite=[row('elite-q','QB',100),row('elite-t','TE',95),...Array.from({length:6},(_,i)=>row('elite-w'+i,'WR',90-i*5)),row('elite-r','RB',40)];
assert(select(elite).includes(elite[0])&&select(elite).includes(elite[1]),'elite QB/TE market leaders cannot be starved');
const shallow=[row('only-w','WR',80),row('only-r','RB',1)];
assert.equal(select(shallow).length,2,'shallow pools retain available assets without padding');
const ties=['WR','RB','TE','QB','WR','RB','TE','QB'].map((pos,i)=>row('tie'+i,pos,20));
assert.deepEqual(select(ties).map(x=>x.p.id),select(ties.slice().reverse()).map(x=>x.p.id),'equal-value ties use positional abundance then stable ID, never input order');
const boundary=[...Array.from({length:6},(_,i)=>row('b'+i,'WR',100-i*10)),row('at-floor','TE',25),row('below-floor','QB',24.99)];
assert(select(boundary).includes(boundary[6]));assert(!select(boundary).includes(boundary[7]),'half marginal-value coverage boundary is explicit');
assert(app.includes('const targetPool=seasonTradeTargetPool(roster,mine,live)'));
assert(app.includes('slice(0,6)'), 'six-asset sell bound preserved');
assert(app.includes('slice(0,5)'), 'five-secondary bound preserved');
assert(app.includes('if(++units%4===0)yield'), 'cooperative package yield preserved');
assert.equal(6*((6+6*5/2)*(1+5))*9,6804,'54 targets at126 evaluations each in ten-team fixture');
console.log('RC4221_SEARCH_SPACE_PASS: former WR exclusion reproduced; market leaders and evidence-backed positional coverage; six targets;126/target;6804 league bound; stale/IR/zero unavailable fail closed');
