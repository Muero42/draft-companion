'use strict';
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const app=fs.readFileSync('app.js','utf8');
const fx=JSON.parse(fs.readFileSync('diagnostics_2026/RC459_DYNAMIC_FIXTURES_2026.json','utf8'));
const panel=JSON.parse(fs.readFileSync('freeze_2026/FRESH_2026_PANEL_PAYLOAD.json','utf8'));
const raw=JSON.parse(fs.readFileSync('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json','utf8'));
const APP_SHA='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3';
if(crypto.createHash('sha256').update(app).digest('hex')!==APP_SHA)throw new Error('app.js is not numbered rc4.59 source');
function fn(name){const st=app.indexOf('function '+name+'(');if(st<0)throw new Error('missing function '+name);let d=0,seen=false;for(let i=st;i<app.length;i++){if(app[i]==='{'){d++;seen=true}else if(app[i]==='}'&&seen){d--;if(d===0)return app.slice(st,i+1)}}throw new Error('unclosed '+name)}
function lineConst(name){const m=app.match(new RegExp('^const '+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'=.*?;$','m'));if(!m)throw new Error('missing const '+name);return m[0]}
function between(a,b){const st=app.indexOf(a),en=app.indexOf(b,st);if(st<0||en<0)throw new Error('range missing '+a);return app.slice(st,en)}
const names=['pinfo','draftSlotAtPick','panelHasVerifiedExperts','panelFor','rankFor','adpFor','agreement','returnChance','rosterState','rosterExceptionPenalty','lateUpsideBonus','progressiveStage','progressiveUpsideBonus','injuryStashAdjustment','marginalRosterUtility','managerProfile','managerProfilesActive','managerPhase','liveManagerStateForProfile','managerHistoryPosMult','specialPositionHazard','chooseSpecialTeamPick','rosterBySlot','slotsBetween','endgameSkillShare','basePositionPlausible','expectedSkillShare','plausibleFor','candidateManagerMod','stressProfile','simNeedWeight','seededRng','weightedChoice','simCandidateWeight','cloneRosters','returnV2Confidence','simulateReturnV2','draftPhaseNeedFactor','normalizeCoachScores','playerQualitySafetyThreshold','applyPlayerQualitySafetyGate','assignTiers','tierContext','positionalAlternativeContext','valueLabel','bestAvailablePanelRank','playerQualityBaseScore','scoreCandidate','applyResolvedReturnScore'];
const code=[lineConst('norm'),lineConst('clamp'),between('const MANAGER_PROFILES=','\nconst MANAGER_PROFILE_DATA='),between('const MANAGER_PROFILE_DATA=','\nconst MANAGER_PROFILE_SOURCE_HASH='),"let LIVE_MANAGER_ADAPTATION_STATE={};",...names.map(fn)].join('\n');
function baseContext(shadowDelta=0){
 const panelRanks=structuredClone(panel.panels);
 const panels={},rankCache={};
 for(const [id,members] of Object.entries(panel.effective_members)){panels[id]={name:id,members:Object.fromEntries(members.map(x=>[x,1]))};for(const x of members)rankCache[x]={verifiedIndividual:true,duplicateOf:null}}
 const ctx={console,Math,Date,JSON,Object,Array,Number,String,Set,Map,Infinity,structuredClone,panels,panelRanks,rankCache,positionPanels:{QB:'qb',RB:'rb',WR:'wr',TE:'te'},activePanelId:'standard',adp:Object.fromEntries(raw.pool_rows.map(x=>[x.key,x.adp])),els:{season:{value:'2026'}},researchResidualShadow:(p,r,a,current)=>({model:'dynamic-shadow-neutral',delta:shadowDelta,active:shadowDelta!==0,components:[]})};
 vm.createContext(ctx);vm.runInContext(code,ctx);for(const x of Object.values(ctx.panelRanks))ctx.assignTiers(x);return ctx;
}
function execute(f,shadowDelta=0){
 const c=baseContext(shadowDelta),mine=f.picks.filter(p=>Number(p.draft_slot)===9),state=c.rosterState(mine,f.players,f.current),all=f.available,rankedAvailable=all.map(p=>({p,r:c.rankFor(p.name,p.pos)})).filter(x=>x.r).sort((a,b)=>a.r.rank-b.r.rank).map(x=>x.p);
 if(rankedAvailable.length<24)throw new Error('ranked pool <24 '+f.id);
 for(const pos of ['QB','RB','WR','TE'])if(state.counts[pos]!==Number(f.expected_rosters['9'][pos]||0))throw new Error(`user roster mapping ${f.id} ${pos}`);
 const allR=c.rosterBySlot(f.picks,f.players,f.teams);for(let s=1;s<=10;s++)for(const pos of ['QB','RB','WR','TE','K','DEF'])if(Number(allR[s][pos]||0)!==Number(f.expected_rosters[String(s)][pos]||0))throw new Error(`roster mapping ${f.id} s${s} ${pos}`);
 let scored=rankedAvailable.map(p=>({p,...c.scoreCandidate(p,f.current,f.next,state,rankedAvailable,f.strategy)}));
 const rv=c.simulateReturnV2({current:f.current,next:f.next,picks:f.picks,players:f.players,teams:f.teams,map:f.managerMap,rankedAvailable,mode:f.mode,userSlot:f.userSlot},f.stress,900);
 for(const x of scored){const q=rv?.players?.[c.norm(x.p.name)];if(q){x.ret=q.ret;x.returnConfidence=q.confidence;x.topRisk=q.topRisk}c.applyResolvedReturnScore(x,f.current,f.strategy)}
 const topPanel=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,12),rs=topPanel.map(x=>x.ret).filter(Number.isFinite).sort((a,b)=>a-b),med=rs.length?rs[Math.floor(rs.length/2)]:null;
 if(Number.isFinite(med))for(const x of scored)if(Number.isFinite(x.ret))x.rawScore+=c.clamp((med-x.ret)*6,-3,3);
 const safety=c.applyPlayerQualitySafetyGate(scored,f.current);c.normalizeCoachScores(scored);scored.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);
 return {id:f.id,current:f.current,next:f.next,state,ranked_pool:rankedAvailable.length,return_runs:rv?.runs||0,map_coverage:rv?.mapCoverage,quality_safety:safety,top:scored.slice(0,10).map((x,i)=>({rank:i+1,name:x.p.name,pos:x.p.pos,panel_rank:x.r.rank,adp:Number.isFinite(x.a)?x.a:null,return_prob:Number.isFinite(x.ret)?Number(x.ret.toFixed(4)):null,return_confidence:x.returnConfidence??null,raw_score:Number(x.rawScore.toFixed(4)),score:x.score}))};
}
const rows=[];let deterministic=true,shadowInvariant=true;
for(const f of fx.fixtures){const a=execute(f,0),b=execute(f,0),z=execute(f,99);if(JSON.stringify(a)!==JSON.stringify(b))deterministic=false;if(a.top.map(x=>x.name).join('|')!==z.top.map(x=>x.name).join('|'))shadowInvariant=false;rows.push(a)}
const coverage={};for(const r of rows){coverage[r.current]=coverage[r.current]||{};const n=r.top[0]?.name||'NONE';coverage[r.current][n]=(coverage[r.current][n]||0)+1}
const ok=rows.length===fx.fixture_count&&rows.every(r=>r.ranked_pool>=24&&r.return_runs===900)&&deterministic&&shadowInvariant;
const out={schema:1,status:ok?'PASS':'FAIL_CLOSED',numbered_rc459_app_sha256:APP_SHA,freeze_package_sha256:fx.freeze_package_sha256,fixture_count:rows.length,turns:fx.turns,exact_live_score_path:true,research_shadow_note:'Research Residual is deliberately shadow-only in rc4.59. Dynamic harness proves live recommendation order invariant even under an artificial +99 shadow delta.',deterministic_repeatability:deterministic,shadow_live_order_invariant:shadowInvariant,all_return_runs_900:rows.every(r=>r.return_runs===900),all_input_rosters_exact:true,top1_by_turn:coverage,policy_ranking_certified:false,fixtures:rows};
fs.writeFileSync('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026.json',JSON.stringify(out,null,2));fs.writeFileSync('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026_GATE.json',JSON.stringify({status:out.status,numbered_rc459_app_sha256:APP_SHA,freeze_package_sha256:out.freeze_package_sha256,fixture_count:out.fixture_count,turns:out.turns,deterministic_repeatability:deterministic,shadow_live_order_invariant:shadowInvariant,all_return_runs_900:out.all_return_runs_900,all_input_rosters_exact:true,top1_by_turn:coverage,policy_ranking_certified:false},null,2));console.log(JSON.stringify({status:out.status,fixture_count:rows.length,deterministic,shadowInvariant,top1_by_turn:coverage},null,2));if(!ok)process.exit(2);
