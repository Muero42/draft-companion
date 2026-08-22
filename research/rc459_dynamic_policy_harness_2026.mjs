#!/usr/bin/env node
// Research-only dynamic rc4.59 decision harness.
// Executes the numbered rc4.59 scoring/Return-v2 code in a headless VM against
// deterministic synthetic draft states built from the fresh 2026 freeze.
// This is a dynamic-semantics gate, not a production mutation or policy certification.
const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const APP='app.js';
const EXPECT='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3';
const src=fs.readFileSync(APP,'utf8');
if(crypto.createHash('sha256').update(src).digest('hex')!==EXPECT) throw Error('app hash mismatch');
function extract(name){const st=src.indexOf('function '+name+'(');if(st<0)throw Error('missing '+name);let d=0,seen=false;for(let i=st;i<src.length;i++){if(src[i]=='{'){d++;seen=true}else if(src[i]=='}'&&seen){d--;if(d===0)return src.slice(st,i+1)}}throw Error('unterminated '+name)}
// First dynamic gate deliberately targets deterministic Coach base scoring and safety
// functions. simulateReturnV2 is source-locked separately and needs a richer DOM/state
// shim before exact stochastic fixture execution is claimed.
const names=['progressiveStage','valueLabel','draftPhaseNeedFactor','rosterExceptionPenalty','lateUpsideBonus','progressiveUpsideBonus','injuryStashAdjustment','marginalRosterUtility','tierContext','positionalAlternativeContext','agreement','researchResidualShadow','returnChance','bestAvailablePanelRank','playerQualityBaseScore','scoreCandidate','applyResolvedReturnScore','playerQualitySafetyThreshold','applyPlayerQualitySafetyGate','normalizeCoachScores','rosterState'];
const ctx={console,Math,Date,structuredClone,window:{},document:{},localStorage:{getItem(){return null},setItem(){},removeItem(){}},store:{},strategyMode:'progressive',stressMode:'baseline'};
vm.createContext(ctx);vm.runInContext(names.map(extract).join('\n'),ctx);
const freeze=JSON.parse(fs.readFileSync('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json','utf8'));
const rows=freeze.pool_rows.filter(x=>['QB','RB','WR','TE'].includes(x.pos)).slice(0,80);
const out={schema:1,status:'PASS',app_sha256:EXPECT,functions_loaded:names.length,player_pool:rows.length,claims:{deterministic_functions_execute:true,exact_return_v2_dynamic:false,policy_ranking_certified:false},probes:[]};
function probe(fn,args,label){try{const v=ctx[fn](...args);out.probes.push({label,fn,status:'PASS',type:typeof v,finite:typeof v==='number'?Number.isFinite(v):null});return v}catch(e){out.probes.push({label,fn,status:'FAIL',error:String(e)});out.status='FAIL_CLOSED';return null}}
// Signature-light smoke probes only where primitive arguments are accepted. Fail closed
// on runtime exceptions; do not invent app state for functions requiring live globals.
probe('progressiveStage',[9],'progressiveStage@9');probe('progressiveStage',[92],'progressiveStage@92');
probe('valueLabel',[10,20],'valueLabel');probe('returnChance',[.5],'returnChance');
probe('playerQualitySafetyThreshold',[9],'qualityThreshold@9');probe('playerQualitySafetyThreshold',[109],'qualityThreshold@109');
const pass=out.probes.filter(x=>x.status==='PASS').length;out.pass_count=pass;out.probe_count=out.probes.length;
if(pass<4)out.status='FAIL_CLOSED';
fs.mkdirSync('diagnostics_2026',{recursive:true});fs.writeFileSync('diagnostics_2026/RC459_DYNAMIC_POLICY_HARNESS_2026.json',JSON.stringify(out,null,2));
fs.writeFileSync('diagnostics_2026/RC459_DYNAMIC_POLICY_HARNESS_2026_GATE.json',JSON.stringify({status:out.status,app_sha256:EXPECT,functions_loaded:names.length,probe_count:out.probe_count,pass_count:out.pass_count,exact_return_v2_dynamic:false,policy_ranking_certified:false,interpretation:'First dynamic execution gate for deterministic rc4.59 Coach dependencies. Exact stochastic Return-v2 fixture execution remains the next gate; no production change.'},null,2));
console.log(JSON.stringify(out,null,2));if(out.status!=='PASS')process.exit(2);
