'use strict';
// RESEARCH ONLY: dimensionally coherent joint next-own-pick pair-sum screen.
const fs=require('fs'),cp=require('child_process'),crypto=require('crypto'),path=require('path');
const CORE='research/rc459_full_policy_paired_2026.js';
const EXPECT='5c313bb54538139145761c3885d29f480e138b45';
const variant=String(process.argv[2]||'PAIRSUM_LONG2');
const count=+(process.argv[3]||10);
const ALLOWED=new Set(['CONTROL','PAIRSUM_LONG2','PAIRSUM_EARLY4']);
if(!ALLOWED.has(variant))throw Error('unknown variant '+variant);
if(!Number.isInteger(count)||count<1)throw Error('count');
let src=fs.readFileSync(CORE,'utf8'),body=Buffer.from(src);
const actual=crypto.createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex');
if(actual!==EXPECT)throw Error(`core blob mismatch ${actual}`);
// Fresh outer seeds: Joint-v1 used the 459260000 family. Fail closed if source drifted.
const oldSeed='459260000',freshSeed='459263000';
if(src.split(oldSeed).length-1!==1)throw Error('fresh-seed needle mismatch');
src=src.replace(oldSeed,freshSeed);
const scoreNeedle="let scored=ranked.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));";
const normNeedle='C.normalizeCoachScores(scored);';
const sortNeedle='scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);';
const returnNeedle="return{chosen:scored[0].p,top:scored.slice(0,5).map((x,i)=>({rank:i+1,name:x.p.name,pos:x.p.pos,score:x.score,raw:+x.rawScore.toFixed(3),ret:Number.isFinite(x.ret)?+x.ret.toFixed(4):null})),return_runs:rv?.runs||0,safety}}";
const decisionNeedle="coach_diag:diag?{top:diag.top,return_runs:diag.return_runs}:null";
for(const [n,k] of [['score',scoreNeedle],['norm',normNeedle],['sort',sortNeedle],['return',returnNeedle],['decision',decisionNeedle]])if(src.split(k).length-1!==1)throw Error(`${n} patch needle mismatch`);

const pre=`const priorPos=(pos)=>mine.filter(x=>String(x?.metadata?.position||'').toUpperCase()===pos).length;\n`+
`const qb=priorPos('QB'),te=priorPos('TE');\n`+
`let coachPool=ranked.filter(p=>!(p.pos==='QB'&&qb>=1)&&!(p.pos==='TE'&&te>=1));\n`+
`const starterMissing=['QB','RB','WR','TE'].filter(pos=>priorPos(pos)===0);\n`+
`const remainingOwn=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149].filter(x=>x>=pn).length;\n`+
`if(starterMissing.length&&remainingOwn<=starterMissing.length){const forced=coachPool.filter(p=>starterMissing.includes(p.pos));if(forced.length)coachPool=forced;}\n`+
`if(!coachPool.length)coachPool=ranked;\n`+
`let scored=coachPool.map(p=>({p,...C.scoreCandidate(p,pn,next,state,ranked,'progressive')}));`;
let patched=src.replace(scoreNeedle,pre);

const joint=`${normNeedle}\n`+
`const __jointActive=('${variant}'==='PAIRSUM_EARLY4'?[9,12,29,32]:'${variant}'==='PAIRSUM_LONG2'?[12,32]:[]).includes(pn)&&next;\n`+
`let __jointWinner=null,__jointDiag=null;\n`+
`const __canonCmp=(a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank;\n`+
`if(__jointActive){\n`+
`  const canon=scored.slice().sort(__canonCmp),frontier=canon.slice(0,5);\n`+
`  const before=new Map(scored.map(x=>[x.p.key,[x.score,x.rawScore]]));\n`+
`  const stateString=picks.map(p=>String(p.pick_no)+':'+String(p.player_id)).join('|')+'|'+pn+'|'+next+'|PAIRSUM_V2';\n`+
`  let h=2166136261>>>0;for(let i=0;i<stateString.length;i++){h^=stateString.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}\n`+
`  const countsFrom=(pk,slot)=>{const c={QB:0,RB:0,WR:0,TE:0,K:0,DEF:0};for(const p of pk){if(+p.draft_slot!==slot)continue;const pos=String(p?.metadata?.position||'').toUpperCase();if(pos in c)c[pos]++;}return c};\n`+
`  const futureLegal=(p,uc)=>!(p.pos==='QB'&&uc.QB>=1)&&!(p.pos==='TE'&&uc.TE>=1);\n`+
`  const evalA=(a,runs)=>{const ranks=[],names=[];for(let ri=0;ri<runs;ri++){\n`+
`    const rr=rng((h+Math.imul(ri+1,2654435761))>>>0),av=new Set(available),pk=picks.map(p=>({...p,metadata:{...(p.metadata||{})}})),md={...pm};\n`+
`    if(!av.has(a.p.key))throw Error('joint candidate unavailable '+a.p.name);av.delete(a.p.key);md[a.p.key]=pmeta(a.p);pk.push({pick_no:pn,draft_slot:USER_SLOT,player_id:a.p.key,metadata:{position:a.p.pos,player_name:a.p.name,team:a.p.team}});\n`+
`    for(let k=pn+1;k<next;k++){const slot=slotAt(k);if(slot===USER_SLOT)throw Error('joint geometry user pick inside interval');const name=ACTIVE[slot];if(!name)throw Error('joint missing manager '+slot);const c=countsFrom(pk,slot),sp=special(rr,name,c,k);if(sp){const id='__joint_'+sp+'_'+k+'_'+ri;md[id]={full_name:sp+' placeholder '+k,position:sp,team:'',years_exp:null,injury_status:null,bye_week:null};pk.push({pick_no:k,draft_slot:slot,player_id:id,metadata:{position:sp,player_name:sp+' placeholder '+k}});continue;}const board=[...av].map(key=>players[key]).filter(Boolean).sort((x,y)=>x.panel-y.panel||x.adp-y.adp).slice(0,70);if(!board.length)throw Error('joint empty opponent board');const weights=board.map(p=>oppWeight(p,k,c,name,'baseline')),ch=wpick(rr,board,weights);if(!ch||!av.has(ch.key))throw Error('joint invalid opponent pick');av.delete(ch.key);md[ch.key]=pmeta(ch);pk.push({pick_no:k,draft_slot:slot,player_id:ch.key,metadata:{position:ch.pos,player_name:ch.name,team:ch.team}});}\n`+
`    const uc=countsFrom(pk,USER_SLOT);let fp=[...av].map(key=>players[key]).filter(Boolean).filter(p=>futureLegal(p,uc));const missing=['QB','RB','WR','TE'].filter(pos=>(uc[pos]||0)===0),remain=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149].filter(x=>x>=next).length;if(missing.length&&remain<=missing.length){const forced=fp.filter(p=>missing.includes(p.pos));if(forced.length)fp=forced;}\n`+
`    const nxt=fp.map(p=>({p,r:C.rankFor(p.name,p.pos)})).filter(x=>x.r).sort((x,y)=>x.r.rank-y.r.rank||x.p.adp-y.p.adp)[0];if(!nxt)throw Error('joint no legal next candidate');if((uc.QB>=1&&nxt.p.pos==='QB')||(uc.TE>=1&&nxt.p.pos==='TE'))throw Error('joint future legality failure');ranks.push(+nxt.r.rank);names.push(nxt.p.name);\n`+
`  }ranks.sort((a,b)=>a-b);const freq={};for(const n of names)freq[n]=(freq[n]||0)+1;const topNext=Object.entries(freq).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,5).map(([name,n])=>({name,n}));const mean=ranks.reduce((s,x)=>s+x,0)/ranks.length;const q=p=>ranks[Math.min(ranks.length-1,Math.max(0,Math.floor((ranks.length-1)*p)))];return{meanRank:mean,q10:q(.10),q50:q(.50),q90:q(.90),topNext};};\n`+
`  const orderCheckF=frontier.map(a=>[a.p.key,evalA(a,3).meanRank]),orderCheckR=frontier.slice().reverse().map(a=>[a.p.key,evalA(a,3).meanRank]);const cm=new Map(orderCheckF);for(const[k,v]of orderCheckR)if(Math.abs(cm.get(k)-v)>1e-12)throw Error('joint frontier order dependence');\n`+
`  const rows=frontier.map(a=>({x:a,currentCoach:a.score,currentPanel:+a.r.rank,...evalA(a,120)}));\n`+
`  for(const x of scored){const b=before.get(x.p.key);if(!b||x.score!==b[0]||x.rawScore!==b[1])throw Error('joint mutated canonical scores');}\n`+
`  for(const r of rows)r.packageCost=r.currentPanel+r.meanRank;rows.sort((a,b)=>a.packageCost-b.packageCost||__canonCmp(a.x,b.x));__jointWinner=rows[0].x;__jointDiag=rows.map(r=>({name:r.x.p.name,pos:r.x.p.pos,currentCoach:+r.currentCoach.toFixed(3),currentPanel:+r.currentPanel.toFixed(3),expectedBestLegalNextPanelRank:+r.meanRank.toFixed(3),packageCost:+r.packageCost.toFixed(3),q10:r.q10,q50:r.q50,q90:r.q90,topNext:r.topNext}));\n`+
`  const rev=rows.slice().reverse().sort((a,b)=>a.packageCost-b.packageCost||__canonCmp(a.x,b.x))[0].x;if(rev!==__jointWinner)throw Error('joint winner order instability');\n`+
`}\n`;
patched=patched.replace(normNeedle,joint);
patched=patched.replace(sortNeedle,`if(__jointWinner)scored.sort((a,b)=>a===__jointWinner?-1:b===__jointWinner?1:__canonCmp(a,b));else scored.sort(__canonCmp);`);
patched=patched.replace(returnNeedle,returnNeedle.replace('safety}}','safety,joint_diag:__jointDiag}}'));
patched=patched.replace(decisionNeedle,"coach_diag:diag?{top:diag.top,return_runs:diag.return_runs,joint_diag:diag.joint_diag}:null");
const tmp=path.join('/tmp',`rc459_joint_pairsum_${variant}.js`);fs.writeFileSync(tmp,patched);
const r=cp.spawnSync(process.execPath,[tmp,String(count)],{cwd:process.cwd(),stdio:'inherit'});if(r.status!==0)process.exit(r.status??2);
const canonical='policy_certification_2026/RC459_FULL_POLICY_PAIRED_DRAFTS_2026.json';
const x=JSON.parse(fs.readFileSync(canonical,'utf8'));if(x.status!=='PASS'||x.rows.length!==count*x.regimes.length*x.policies.length)throw Error('output invariant');x.joint_variant=variant;x.joint_pairsum_screen=true;x.joint_core_git_blob=EXPECT;x.outer_seed_base=+freshSeed;x.joint_frontier=5;x.joint_rollouts=120;x.joint_choice='min(current selected-panel rank + expected best LEGAL next-own-pick selected-panel rank)';x.joint_next_legality='QB1/TE1 feasibility plus last-picks starter completion';x.joint_opponent_kernel='validated full-policy opponent kernel, baseline inner rollouts, common random numbers across candidate branches';
const out=`policy_certification_2026/PAIRSUM_${variant}.json`;fs.writeFileSync(out,JSON.stringify(x));fs.unlinkSync(canonical);console.log(JSON.stringify({status:'PASS',variant,count,rows:x.rows.length,out,outer_seed_base:+freshSeed},null,2));