'use strict';
// RESEARCH ONLY. Dynamic elite-TE opportunity-cost screen around the audited rc4.59 full-policy harness.
// No production/runtime files are changed. Common controls, seeds, opponent kernel, Return-v2 and outcome evaluator remain unchanged.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECT='5c313bb54538139145761c3885d29f480e138b45';
const variant=String(process.argv[2]||'TE_SOFT4');
const count=+(process.argv[3]||10);
const ALLOWED=new Set(['TE_SOFT2','TE_SOFT4','TE_SOFT6','TE_RETURN_GATE','DEFER_TE69_ANCHOR']);
if(!ALLOWED.has(variant))throw Error('unknown variant '+variant);
if(!Number.isInteger(count)||count<1)throw Error('count');
const src=fs.readFileSync(CORE,'utf8'),body=Buffer.from(src);
const actual=crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
if(actual!==EXPECT)throw Error(`core blob mismatch ${actual}`);
const scoreNeedle="let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));";
const safetyNeedle='const safety=C.applyPlayerQualitySafetyGate(scored,pn);';
if(src.split(scoreNeedle).length-1!==1||src.split(safetyNeedle).length-1!==1)throw Error('patch needle mismatch');
// Minimal roster policy repair shared by every candidate:
// - at most one QB and one TE (unless no eligible alternative exists);
// - generic starter feasibility: if remaining user picks equal missing QB/RB/WR/TE starter positions, only missing positions are admissible.
// This is a feasibility constraint, not an early positional target.
const pre=`const priorPos=(pos)=>mine.filter(x=>String(x?.metadata?.position||'').toUpperCase()===pos).length;\n`+
`const qb=priorPos('QB'),te=priorPos('TE');\n`+
`let coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));\n`+
`const starterMissing=['QB','RB','WR','TE'].filter(pos=>priorPos(pos)===0);\n`+
`const remainingOwn=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149].filter(x=>x>=pn).length;\n`+
`if(starterMissing.length&&remainingOwn<=starterMissing.length){const forced=coachPool.filter(p=>starterMissing.includes(p.pos));if(forced.length)coachPool=forced;}\n`+
`if('${variant}'==='DEFER_TE69_ANCHOR'&&pn<69&&te===0){const noTe=coachPool.filter(p=>p.pos!=='TE');if(noTe.length)coachPool=noTe;}\n`+
`if(!coachPool.length)coachPool=ranked;\n`+
`let scored=coachPool.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));`;
let patched=src.replace(scoreNeedle,pre);
// Apply after exact Return-v2/resolved-return scoring but before Player Quality Safety Gate and normalization.
// Opportunity-cost signal: if the best RB/WR alternative is less likely to return than an early TE,
// penalize the TE by lambda * (TE_return - alternative_return). Thus a scarce TE is never penalized merely for being a TE.
// TE_RETURN_GATE is deliberately conservative: it excludes an early TE only when the alternative is >=15pp less likely to return
// AND the TE's current raw-score edge is <3 points. No named-player forcing.
const post=`if(pn<69&&te===0&&'${variant}'!=='DEFER_TE69_ANCHOR'){\n`+
`  const alts=scored.filter(x=>['RB','WR'].includes(x.p.pos)&&Number.isFinite(x.ret));\n`+
`  const bestAlt=alts.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];\n`+
`  if(bestAlt){for(const x of scored){if(x.p.pos!=='TE'||!Number.isFinite(x.ret))continue;const gap=Math.max(0,x.ret-bestAlt.ret);\n`+
`    if('${variant}'.startsWith('TE_SOFT')){const lambda=Number('${variant}'.replace('TE_SOFT',''));x.rawScore-=lambda*gap;x.teOpportunityCost={alt:bestAlt.p.name,altRet:bestAlt.ret,teRet:x.ret,gap,penalty:lambda*gap};}\n`+
`    if('${variant}'==='TE_RETURN_GATE'&&gap>=0.15&&(x.rawScore-bestAlt.rawScore)<3){x.rawScore-=100;x.teOpportunityCost={alt:bestAlt.p.name,altRet:bestAlt.ret,teRet:x.ret,gap,gated:true};}\n`+
`  }}\n`+
`}\n`+safetyNeedle;
patched=patched.replace(safetyNeedle,post);
const tmp=path.join('/tmp',`rc459_dynamic_te_${variant}.js`);fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical,'utf8'));
if(x.status!=='PASS'||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('output invariant');
x.dynamic_te_variant=variant;x.dynamic_te_screen=true;x.dynamic_te_core_git_blob=EXPECT;
const out=`policy_certification_2026/DYNAMIC_TE_${variant}.json`;fs.writeFileSync(out,JSON.stringify(x));fs.unlinkSync(canonical);
console.log(JSON.stringify({status:'PASS',variant,count,rows:x.rows.length,out},null,2));
