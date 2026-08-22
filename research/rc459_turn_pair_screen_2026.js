'use strict';
// RESEARCH ONLY: bounded turn-pair opportunity-cost probe over the audited rc4.59 harness.
// This file does not touch production/runtime code and deliberately contains no outcome evaluator.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECT='5c313bb54538139145761c3885d29f480e138b45';
const variant=String(process.argv[2]||'PAIR_FIRST');
const count=+(process.argv[3]||10);
const ALLOWED=new Set(['CONTROL','PAIR_FIRST','PAIR_FIRST_TWO']);
if(!ALLOWED.has(variant))throw Error('unknown variant '+variant);
if(!Number.isInteger(count)||count<1)throw Error('count');
const src=fs.readFileSync(CORE,'utf8'),body=Buffer.from(src);
const actual=crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
if(actual!==EXPECT)throw Error(`core blob mismatch ${actual}`);
const scoreNeedle="let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));";
const safetyNeedle='const safety=C.applyPlayerQualitySafetyGate(scored,pn);';
if(src.split(scoreNeedle).length-1!==1||src.split(safetyNeedle).length-1!==1)throw Error('patch needle mismatch');
// Same minimal feasibility repair used by the completed dynamic-TE screen: QB1/TE1 cap plus end-roster starter feasibility.
const pre=`const priorPos=(pos)=>mine.filter(x=>String(x?.metadata?.position||'').toUpperCase()===pos).length;\n`+
`const qb=priorPos('QB'),te=priorPos('TE');\n`+
`let coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));\n`+
`const starterMissing=['QB','RB','WR','TE'].filter(pos=>priorPos(pos)===0);\n`+
`const remainingOwn=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149].filter(x=>x>=pn).length;\n`+
`if(starterMissing.length&&remainingOwn<=starterMissing.length){const forced=coachPool.filter(p=>starterMissing.includes(p.pos));if(forced.length)coachPool=forced;}\n`+
`if(!coachPool.length)coachPool=ranked;\n`+
`let scored=coachPool.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));`;
let patched=src.replace(scoreNeedle,pre);
// Pair layer runs after resolved Return-v2 scoring and before the unchanged Player Quality Safety Gate.
// Q uses current rawScore. Expected return quality uses preregistered marginal approximation over the top-5 quality frontier.
// CoverageDelta counts newly covered QB/RB/WR/TE starter position types after the pair; all four types are symmetric.
const pair=`const pairStarts=('${variant}'==='PAIR_FIRST_TWO'?[9,29]:'${variant}'==='PAIR_FIRST'?[9]:[]);\n`+
`if(pairStarts.includes(pn)&&next){\n`+
`  const frontier=scored.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank).slice(0,5);\n`+
`  const qualitySorted=scored.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank);\n`+
`  const baseCovered=new Set(['QB','RB','WR','TE'].filter(pos=>priorPos(pos)>0));\n`+
`  const diag=[];\n`+
`  for(const a of frontier){\n`+
`    const retPool=qualitySorted.filter(x=>x.p.id!==a.p.id&&x.p.key!==a.p.key&&x.p.name!==a.p.name).slice(0,5);\n`+
`    let survival=1,ebest=0;const branches=[];\n`+
`    for(const b of retPool){const pr=Number.isFinite(b.ret)?C.__clamp(b.ret,0,1):0;const mass=survival*pr;ebest+=mass*b.rawScore;branches.push({name:b.p.name,pos:b.p.pos,ret:pr,mass:+mass.toFixed(5),q:+b.rawScore.toFixed(3)});survival*=1-pr;}\n`+
`    const fallback=retPool.length?retPool.at(-1).rawScore:a.rawScore;ebest+=survival*fallback;\n`+
`    let ecov=0;survival=1;\n`+
`    for(const b of retPool){const pr=Number.isFinite(b.ret)?C.__clamp(b.ret,0,1):0,mass=survival*pr;const cov=new Set(baseCovered);cov.add(a.p.pos);cov.add(b.p.pos);ecov+=mass*(cov.size-baseCovered.size);survival*=1-pr;}\n`+
`    const covFallback=new Set(baseCovered);covFallback.add(a.p.pos);if(retPool.length)covFallback.add(retPool.at(-1).p.pos);ecov+=survival*(covFallback.size-baseCovered.size);\n`+
`    const pairScore=a.rawScore+ebest+0.5*ecov;diag.push({a:a.p.name,pos:a.p.pos,q:+a.rawScore.toFixed(3),expectedReturnQuality:+ebest.toFixed(3),expectedCoverageDelta:+ecov.toFixed(4),pairScore:+pairScore.toFixed(3),branches});\n`+
`    a.rawScore=pairScore;\n`+
`  }\n`+
`  scored.__turnPairDiag=diag;\n`+
`}\n`+safetyNeedle;
patched=patched.replace(safetyNeedle,pair);
const tmp=path.join('/tmp',`rc459_turn_pair_${variant}.js`);fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical,'utf8'));
if(x.status!=='PASS'||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('output invariant');
x.turn_pair_variant=variant;x.turn_pair_screen=true;x.turn_pair_core_git_blob=EXPECT;x.turn_pair_preregistered_lambda=0.5;x.turn_pair_frontier=5;x.turn_pair_joint_state_approximation='marginal-return-v2 ordered-survival; requires joint-state validation before promotion';
const out=`policy_certification_2026/TURN_PAIR_${variant}.json`;fs.writeFileSync(out,JSON.stringify(x));fs.unlinkSync(canonical);
console.log(JSON.stringify({status:'PASS',variant,count,rows:x.rows.length,out},null,2));
