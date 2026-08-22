'use strict';
// Research-only lexical wrapper around the audited rc4.59 full-policy harness.
// It changes only Coach candidate admissibility for pre-registered ablation screens.
// Controls, opponent kernel, Return-v2, freeze, seeds and outcome evaluator remain unchanged.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECT='5c313bb54538139145761c3885d29f480e138b45';
const variant=String(process.argv[2]||'QB1_ONLY');
const count=+(process.argv[3]||10);
if(!Number.isInteger(count)||count<1)throw Error('count');
const src=fs.readFileSync(CORE,'utf8'),body=Buffer.from(src);
const actual=crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
if(actual!==EXPECTED)throw Error(`core blob mismatch ${actual}`);
const needle='let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,\'progressive\')}));';
if(src.split(needle).length-1!==1)throw Error('coach scoring needle mismatch');
const guard=`const priorPos=(pos)=>mine.filter(x=>String(x?.metadata?.position||'').toUpperCase()===pos).length;\n`+
`const qb=priorPos('QB'),te=priorPos('TE'),rb=priorPos('RB');\n`+
`let coachPool=ranked;\n`+
`if('${variant}'==='QB1_ONLY') coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1));\n`+
`if('${variant}'==='QB1_TE1') coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));\n`+
`if('${variant}'==='QB1_TE1_DEFER_TE69') coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&(te>=1||pn<69)));\n`+
`if('${variant}'==='QB1_TE1_RB2_BY52'){coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));if(pn===12&&rb===0)coachPool=coachPool.filter(p=>p.pos==='RB');if((pn===49||pn===52)&&rb<2)coachPool=coachPool.filter(p=>p.pos==='RB');}\n`+
`if(!coachPool.length)coachPool=ranked;\n`+
`let scored=coachPool.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));`;
let patched=src.replace(needle,guard);
// Tag output so artifacts cannot be confused with canonical policy certification.
patched=patched.replace("const out={schema:2,status:'PASS'",`const out={schema:2,ablation_variant:'${variant}',status:'PASS'`);
const tmp=path.join('/tmp',`rc459_ablation_${variant}.js`);fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical));
if(x.ablation_variant!==variant||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('output invariant');
const out=`policy_certification_2026/ABLATION_${variant}.json`;fs.renameSync(canonical,out);
console.log(JSON.stringify({status:'PASS',variant,count,rows:x.rows.length,out},null,2));
