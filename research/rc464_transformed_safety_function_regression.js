'use strict';
/* Executes the ACTUAL transformed PlayerQualitySafety function extracted from generated
   candidate source. This guards against divergence between research mechanism pseudocode
   and the implementation candidate. No app.js mutation. */
const fs=require('fs'),cp=require('child_process'),assert=require('assert');
const r=cp.spawnSync(process.execPath,['research/rc464_minimal_safety_transform.js'],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||r.stdout);const src=fs.readFileSync('/tmp/rc464_minimal_safety_app.js','utf8');
function func(name){const a=src.indexOf('function '+name+'(');if(a<0)throw Error('missing '+name);let b=src.indexOf('{',a),d=0,q=null,esc=false;for(let i=b;i<src.length;i++){const c=src[i];if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;else if(c==='}'&&--d===0)return src.slice(a,i+1)}throw Error('unclosed '+name)}
const code=func('playerQualitySafetyThreshold')+'\n'+func('applyPlayerQualitySafetyGate')+'\nreturn {playerQualitySafetyThreshold,applyPlayerQualitySafetyGate};';const F=new Function(code)();
const row=(name,pos,raw,panel,adp)=>({p:{name,pos},r:{rank:panel},rawScore:raw,a:adp,reasons:[],hardExcluded:false,recommendationBlocked:false});
const names=x=>x.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank).map(z=>z.p.name);
let n=0;
// With no state argument, behavior is exact backward-compatible full-safety behavior.
{const a=[row('QB2','QB',90,40,80),row('RB','RB',100,90,95)],b=structuredClone(a);F.applyPlayerQualitySafetyGate(a,92);F.applyPlayerQualitySafetyGate(b,92,null);assert.deepStrictEqual(a,b);n++}
// First QB/TE are unaffected because count is zero.
for(const pos of ['QB','TE']){const a=[row('First',pos,80,45,70),row('RB','RB',100,90,95),row('WR','WR',99,92,100)],b=structuredClone(a);F.applyPlayerQualitySafetyGate(a,92);F.applyPlayerQualitySafetyGate(b,92,{counts:{QB:pos==='QB'?0:1,TE:pos==='TE'?0:1,RB:2,WR:5}});assert.deepStrictEqual(a,b);n++}
// Ordinary repeat QB remains valid/valueSafety-decorated but cannot be safety-only promoted.
{const a=[row('OrdinaryQB2','QB',70,76,98),row('CorumLike','RB',102,90,94),row('WR','WR',90,95,105)];F.applyPlayerQualitySafetyGate(a,92,{counts:{QB:1,TE:1,RB:2,WR:5}});const q=a[0],rb=a[1];assert(q.valueSafety);assert(!q.hardExcluded&&!q.recommendationBlocked);assert(rb.rawScore>q.rawScore);assert.equal(q.valueSafety.promoted,false);n++}
// Exact causal shape: full safety can promote ordinary QB2, guard cannot.
{const full=[row('Trevor','QB',47.73946,76.2537,97.7),row('Corum','RB',102.167509,89.6667,93.5),row('WR','WR',86.65,83.15,116.3)],guard=structuredClone(full);F.applyPlayerQualitySafetyGate(full,92);F.applyPlayerQualitySafetyGate(guard,92,{counts:{QB:1,TE:1,RB:2,WR:5}});assert(names(full)[0]==='Trevor');assert(names(guard)[0]==='Corum');assert(guard.find(x=>x.p.name==='Trevor').valueSafety);n++}
// Existing exceptional-slide conditions remain eligible.
{const a=[row('EliteQB','QB',80,40,50),row('RB','RB',100,70,95),row('WR','WR',99,72,100)];F.applyPlayerQualitySafetyGate(a,92,{counts:{QB:1,TE:1,RB:2,WR:5}});assert(names(a)[0]==='EliteQB');n++}
{const a=[row('EliteTE','TE',80,30,70),row('RB','RB',100,65,100),row('WR','WR',99,67,105)];F.applyPlayerQualitySafetyGate(a,112,{counts:{QB:1,TE:1,RB:3,WR:5}});assert(names(a)[0]==='EliteTE');n++}
// Natural repeat raw leader remains eligible (not hard banned).
{const a=[row('NaturalQB2','QB',110,80,90),row('RB','RB',100,90,95),row('WR','WR',99,95,100)];F.applyPlayerQualitySafetyGate(a,112,{counts:{QB:1,TE:1,RB:3,WR:5}});assert(names(a)[0]==='NaturalQB2');assert(a[0].valueSafety);n++}
console.log(JSON.stringify({status:'PASS',actual_transformed_function:true,tests:n,valueSafety_repeat_preserved:true,ordinary_repeat_safety_resurrection_blocked:true,exceptional_slides_preserved:true,first_qbte_invariant:true,hard_ban:false,production_mutation:false},null,2));
