'use strict';
const assert=require('assert');
const {statefulRng,legacyRng}=require('./stateful_rng_2026');
for(const seed of [0,1,459260000,460260019,0xffffffff]){
  const a=legacyRng(seed),b=statefulRng(seed);
  for(let i=0;i<10000;i++)assert.strictEqual(b(),a(),`legacy parity seed=${seed} draw=${i}`);
}
const r=statefulRng(459260123);for(let i=0;i<137;i++)r();const snap=r.snapshot();const c1=statefulRng(snap),c2=r.clone();
for(let i=0;i<5000;i++){const x=r(),y=c1(),z=c2();assert.strictEqual(y,x);assert.strictEqual(z,x)}
const p=statefulRng(7);const before=p.snapshot();const q=p.clone();q();q();assert.deepStrictEqual(p.snapshot(),before,'clone advanced parent');
console.log(JSON.stringify({status:'PASS',legacy_parity_seeds:5,draws_per_seed:10000,resume_draws:5000,parent_clone_isolation:true}));
