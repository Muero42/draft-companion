'use strict';
// RESEARCH ONLY: rolling NEXT-own-pick opportunity-cost probe over audited rc4.59 harness.
// No production/runtime code and no outcome evaluator are modified here.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECT='5c313bb54538139145761c3885d29f480e138b45';
const variant=String(process.argv[2]||'ROLL_LONG');
const count=+(process.argv[3]||10);
const ALLOWED=new Set(['CONTROL','ROLL_LONG','ROLL_EARLY4','ROLL_ALL']);
if(!ALLOWED.has(variant))throw Error('unknown variant '+variant);
if(!Number.isInteger(count)||count<1)throw Error('count');
const src=fs.readFileSync(CORE,'utf8'),body=Buffer.from(src);
const actual=crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
if(actual!==EXPECT)throw Error(`core blob mismatch ${actual}`);
const scoreNeedle="let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));";
const normNeedle='C.normalizeCoachScores(scored);';
const sortNeedle='scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);';
if(src.split(scoreNeedle).length-1!==1||src.split(normNeedle).length-1!==1||src.split(sortNeedle).length-1!==1)throw Error('patch needle mismatch');
// Keep the already-diagnosed minimal generic feasibility layer: one QB/TE cap and end-roster starter feasibility.
const pre=`const priorPos=(pos)=>mine.filter(x=>String(x?.metadata?.position||'').toUpperCase()===pos).length;\n`+
`const qb=priorPos('QB'),te=priorPos('TE');\n`+
`let coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));\n`+
`const starterMissing=['QB','RB','WR','TE'].filter(pos=>priorPos(pos)===0);\n`+
`const remainingOwn=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149].filter(x=>x>=pn).length;\n`+
`if(starterMissing.length&&remainingOwn<=starterMissing.length){const forced=coachPool.filter(p=>starterMissing.includes(p.pos));if(forced.length)coachPool=forced;}\n`+
`if(!coachPool.length)coachPool=ranked;\n`+
`let scored=coachPool.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));`;
let patched=src.replace(scoreNeedle,pre);
// Rolling layer is deliberately AFTER canonical quality safety + normalization inputs are resolved,
// but it does not overwrite score/rawScore. It only chooses among the canonical top-5 frontier.
const rolling=`${normNeedle}\n`+
`const __rollActive=('${variant}'==='ROLL_ALL'?[9,12,29,32,49,52,69,72,89,92,109,112,129,132]:'${variant}'==='ROLL_LONG'?[12,32,52,72,92,112,132]:'${variant}'==='ROLL_EARLY4'?[9,12,29,32]:[]).includes(pn)&&next;\n`+
`let __rollWinner=null,__rollDiag=null;\n`+
`const __canonCmp=(a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank;\n`+
`if(__rollActive){\n`+
`  const canon=scored.slice().sort(__canonCmp);const frontier=canon.slice(0,5);const baseCovered=new Set(['QB','RB','WR','TE'].filter(pos=>priorPos(pos)>0));\n`+
`  const tmp=[];\n`+
`  for(const a of frontier){\n`+
`    const retPool=canon.filter(x=>x.p.id!==a.p.id&&x.p.key!==a.p.key&&x.p.name!==a.p.name).slice(0,5);\n`+
`    let survival=1,ebest=0,ecov=0;const branches=[];\n`+
`    for(const b of retPool){const pr=Number.isFinite(b.ret)?C.__clamp(b.ret,0,1):0,mass=survival*pr;ebest+=mass*b.score;const cov=new Set(baseCovered);cov.add(a.p.pos);cov.add(b.p.pos);ecov+=mass*(cov.size-baseCovered.size);branches.push({name:b.p.name,pos:b.p.pos,ret:+pr.toFixed(4),mass:+mass.toFixed(5),score:+b.score.toFixed(3)});survival*=1-pr;}\n`+
`    const fb=retPool.length?retPool.at(-1):a;ebest+=survival*fb.score;const fcov=new Set(baseCovered);fcov.add(a.p.pos);if(retPool.length)fcov.add(fb.p.pos);ecov+=survival*(fcov.size-baseCovered.size);\n`+
`    tmp.push({x:a,q:a.score,ebest,coverage:C.__clamp(ecov,0,1),branches});\n`+
`  }\n`+
`  const z=(vals,v)=>{const m=vals.reduce((s,x)=>s+x,0)/vals.length;const sd=Math.sqrt(vals.reduce((s,x)=>s+(x-m)*(x-m),0)/vals.length);return sd>1e-9?(v-m)/sd:0};\n`+
`  const qs=tmp.map(t=>t.q),es=tmp.map(t=>t.ebest);\n`+
`  for(const t of tmp){t.zq=z(qs,t.q);t.ze=z(es,t.ebest);t.utility=t.zq+t.ze+0.25*t.coverage;t.x.__rollUtility=t.utility;}\n`+
`  tmp.sort((a,b)=>b.utility-a.utility||__canonCmp(a.x,b.x));__rollWinner=tmp[0].x;__rollDiag=tmp.map(t=>({name:t.x.p.name,pos:t.x.p.pos,q:+t.q.toFixed(3),expectedNext:+t.ebest.toFixed(3),zq:+t.zq.toFixed(4),ze:+t.ze.toFixed(4),coverage:+t.coverage.toFixed(4),utility:+t.utility.toFixed(4),branches:t.branches}));\n`+
`}\n`;
patched=patched.replace(normNeedle,rolling);
const replacementSort=`if(__rollWinner){scored.sort((a,b)=>a===__rollWinner?-1:b===__rollWinner?1:__canonCmp(a,b));scored.__rollDiag=__rollDiag;}else scored.sort(__canonCmp);`;
patched=patched.replace(sortNeedle,replacementSort);
const tmp=path.join('/tmp',`rc459_rolling_${variant}.js`);fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical,'utf8'));
if(x.status!=='PASS'||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('output invariant');
x.rolling_variant=variant;x.rolling_screen=true;x.rolling_core_git_blob=EXPECT;x.rolling_frontier=5;x.rolling_coverage_lambda=0.25;x.rolling_normalization='within-frontier population z-score of canonical normalized score and expected-next score';x.rolling_joint_state_approximation='marginal-return-v2 ordered-survival; screening only; requires joint-state/dependence validation before promotion';
const out=`policy_certification_2026/ROLLING_${variant}.json`;fs.writeFileSync(out,JSON.stringify(x));fs.unlinkSync(canonical);
console.log(JSON.stringify({status:'PASS',variant,count,rows:x.rows.length,out},null,2));
