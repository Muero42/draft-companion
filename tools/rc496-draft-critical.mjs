import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const idx=fs.readFileSync('index.html','utf8');
const boardSrc=fs.readFileSync('expert-v2-board.js','utf8').trim();
const board=JSON.parse(boardSrc.replace(/^window\.PITTI_EXPERT_V2=/,'').replace(/;\s*$/,''));

const activeVersion=(app.match(/const APP_VERSION='v11\.8\.0-rc4\.(\d+)'/)||[])[1];assert.ok(Number(activeVersion)>=96,'active runtime below rc4.96 feature gate');
assert.match(app,/st==='QUESTIONABLE'\?0/,'Questionable must remain score-neutral');
assert.match(app,/const sparsePanelPenalty=r\.n>=4\?0:r\.n===3\?2:r\.n===2\?7:14/,'sparse-panel score guard missing');
assert.match(app,/const confidenceCap=r\.n>=4\?96:r\.n===3\?78:r\.n===2\?62:50/,'sparse-panel confidence cap missing');
assert.match(app,/Number\.isFinite\(Number\(x\.w\)\)\?Number\(x\.w\):Number\(x\.effectiveWeight\)/,'embedded expert weights must survive evidence export');
assert.match(app,/const byPick=new Map\(\)/,'decision evidence canonical per-pick dedupe missing');
assert.match(app,/supersededFixtureCount/,'decision evidence superseded-fixture telemetry missing');
assert.match(app,/mixedModelVersions:modelVersions.length>1/,'decision evidence mixed-version guard missing');
assert.match(app,/modelVersion:f.modelVersion\|\|null/,'decision summary model-version attribution missing');
assert.match(app,/panelN:Number\.isFinite/,'decision evidence panelN missing');
assert.match(app,/reasons:Array\.isArray\(x\.reasons\)/,'decision evidence scoring reasons missing');
assert.match(app,/const displayGap=current<=70\?18:current<=110\?22:26/,'presentation normal-cut must be broader than safety gate');
assert.match(app,/current>=121&&n>=6\)x-=14/,'late WR7 marginal-utility guard missing');
assert.match(app,/current>=121&&n<=4\)x\+=3\.5/,'late RB contingent-option utility missing');
assert.match(app,/ACTIVE_2026_MANAGER_MAP_TEXT='1=Michael, 2=Pascal Voerde, 3=Marc Düsseldorf, 4=Thomas, 5=Bjoern, 6=Pascal Gelderner, 7=Giuliano, 8=Basti, 9=Muerotechnik, 10=Dutch Marc'/,'canonical 2026 manager map drift');
assert.match(app,/coverageStatus:missing\.length\?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE'/,'expert coverage status must be explicit');
assert.match(app,/missingExperts:missing/,'missing expert identities must be retained per player');
assert.match(app,/intendedN:intendedExperts\.length,coverage:vals\.length\/intendedExperts\.length/,'effective-vs-intended panel coverage telemetry missing');
assert.match(app,/coveragePolicy:'FAIL_CLOSED_EXPLICIT_MISSINGNESS'/,'v4-v5 coverage fail-closed policy missing');
assert.match(app,/EXPERT_V4_BLUEPRINT/,'v4 blueprint missing');
assert.match(app,/maxSingleWeight:\.30/,'single-expert influence cap missing');
assert.match(app,/EXPERT_V5_BLUEPRINT=\{base:'expertv3',add:'Sean Koerner',fundPrimarilyFrom:'Draft Sharks Team'/,'v5 Koerner/DS design drift');
assert.match(app,/expertv4:\{QB:'expert-v4-qb'/,'v4 profile map missing');
assert.match(app,/expertv5:\{QB:'expert-v5-qb'/,'v5 profile map missing');
assert.match(app,/function expertProfileReady\(id\)/,'v4-v5 selector readiness gate missing');
assert.match(app,/opt\.disabled=!expertProfileReady\(opt\.value\)/,'v4-v5 selector must fail closed');
assert.match(app,/els\.analysisExpertProfile\.onchange=/,'analysis selector wiring missing');
assert.match(app,/function extractPairwiseInvertedRows\(/,'Koerner pairwise inversion parser missing');
assert.match(app,/Number\(payload\?\.total_experts\)!==2/,'pairwise inversion must require exactly two experts');
assert.match(app,/fetchExpertOverallPairwise\(expert,ref\)/,'Koerner pairwise API fallback missing');
assert.match(app,/HALF:\['HALF','HALF_PPR','HALF-PPR','0\.5PPR','0\.5_PPR'\]/,'Compare Players HALF scoring aliases missing');
assert.match(app,/if\(vals\.length===1\)block=vals\[0\]/,'Compare Players unambiguous scoring fallback missing');
assert.match(app,/FantasyPros API pairwise exact inversion/,'pairwise provenance label missing');
assert.match(app,/crosscheck=\{checked,matched,ok:checked>=2&&matched===checked\}/,'Koerner fallback Compare Players match gate missing');
assert.match(app,/finalRows\.length>=80&&crosscheck\.ok/,'Koerner fallback must fail closed on crosscheck mismatch');
assert.match(app,/function normalizeWeights\(raw,cap=\.30\)/,'v4-v5 normalized weight cap builder missing');
assert.match(app,/function buildPanelFromExpertRows\(/,'v4-v5 complete-panel builder missing');
assert.match(app,/function ensureExpertV4Panels\(\)/,'v4 live panel construction missing');
assert.match(app,/function ensureExpertV5Panels\(\)/,'v5 live panel construction missing');
assert.match(app,/\^expert-v\[2345\]-\(qb\|rb\|wr\|te\)\$/,'v4-v5 shadow panels must be runtime-selectable');
assert.ok(idx.indexOf('id="analysisExpertSelector"')>idx.indexOf('id="strategyMode"')&&idx.indexOf('id="analysisExpertSelector"')<idx.indexOf('id="refreshBtn"'),'v3-v5 switch must remain directly above Analyze in draft configuration');
assert.match(app,/Object\.prototype\.hasOwnProperty\.call\(EXPERT_PROFILE_IDS,id\)/,'legacy incumbent-v2 profile switching must remain supported');
assert.match(app,/\[\.\.\.els\.expertProfile\.options\]\.some\(o=>o\.value===id\)/,'dedicated v4-v5 switch must not blank legacy profile selector');
assert.match(app,/INCOMPLETE_V5_NO_DS_FUNDING/,'v5 must fail closed when DS funding is absent');
assert.match(app,/if\(!ds\|\|Number\(ds\.effectiveWeight\|\|0\)<=0\)/,'v5 DS funding guard missing');
assert.doesNotMatch(app,/transfer=Math\.min\(\.20,Number\(ds\?\.effectiveWeight\|\|0\)\)/,'v5 must not add zero-funded Koerner');
assert.match(app,/EXPERT_DECISION_CORE_MIN=\{QB:24,RB:60,WR:70,TE:24\}/,'position-specific decision-core thresholds missing');
assert.match(app,/slice\(0,need\)/,'v4-v5 readiness must validate position-specific decision core');
assert.match(app,/core\.length>=need&&core\.every\(row=>row\?\.coverageStatus==='COMPLETE'\)/,'v4-v5 decision-core completeness gate missing');
assert.match(app,/rows\[name\]\.length<EXPERT_DECISION_CORE_MIN\[pos\]/,'v4 source acquisition minimum must be position-specific');
assert.match(app,/kRows\.length<EXPERT_DECISION_CORE_MIN\[pos\]/,'Koerner source acquisition minimum must be position-specific');
assert.match(app,/const v4Ready=ensureExpertV4Panels\(\),v5Ready=ensureExpertV5Panels\(\)/,'v4-v5 refresh wiring missing');
assert.match(app,/v45Names=\[\.\.\.new Set\(Object\.values\(EXPERT_V4_BLUEPRINT\)/,'v4-v5 experts must be included in refresh acquisition');
assert.match(app,/coverageStatus:missing\.length\?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE'/,'new panels must preserve per-player coverage status');
assert.doesNotMatch(app,/5=Basti, 6=Bjoern/,'rc4.84 wrong slot-5/6 mapping resurrected');
assert.doesNotMatch(app,/8=Pascal Gelderner/,'rc4.84 wrong slot-8 mapping resurrected');
assert.doesNotMatch(app,/Moers Venom/i,'stale user team identity resurrected');
assert.doesNotMatch(app,/Michael K/i,'nonexistent Michael K identity resurrected');
assert.match(app,/function canonicalize2026ManagerMap\(stored\)/,'persisted manager-map migration missing');
assert.match(app,/legacyUserTeam=\['Moers','Venom'\]\.join\(' '\)/,'legacy team migration signature missing');
assert.ok(app.includes("legacyManager=['Michael','K.'].join(' ')"),'legacy manager migration signature missing');
assert.match(app,/stale=\/5\\s\*=\\s\*Basti\|8\\s\*=\\s\*Pascal Gelderner\/i/,'stale manager-map signatures not migrated');
assert.match(app,/managerMap\.value=canonicalize2026ManagerMap\(v\.managerMap\)/,'backup restore must canonicalize stale manager map');
assert.match(live,/return'PANEL-CHECK'/,'live sparse-panel signal missing');
assert.match(live,/Panel unvollständig\|Panel-Streuung/,'live sparse-panel negative evidence handling missing');
const observedDecisionZoneEvidence=[
  'Zay Flowers','Travis Etienne','Luther Burden','Davante Adams','Terry McLaurin','Jameson Williams','Christian Watson','Mike Evans','DJ Moore',
  'Drake Maye','Joe Burrow','Bhayshul Tuten','Rome Odunze','Parker Washington','Tucker Kraft','Sam LaPorta','Marvin Harrison Jr.','Jaylen Warren',
  'Brian Thomas Jr.','Harold Fannin Jr.','DK Metcalf','Jonathon Brooks','Rico Dowdle','Tony Pollard','Courtland Sutton','J.K. Dobbins','Jayden Reed',
  'Jordan Addison','Quentin Johnston','Blake Corum','Jacory Croskey-Merritt','Chris Godwin','Michael Pittman','Josh Downs','Stefon Diggs','Jordan Mason',
  'Kenny Gainwell','Xavier Worthy','Jakobi Meyers','Rachaad White','Matthew Golden','Chris Rodriguez Jr.','Aaron Jones','Romeo Doubs',"Wan'Dale Robinson",
  'Woody Marks','Tyjae Spears','Tank Bigsby','Mike Washington','Zach Charbonnet','Tyler Allgeier','Deebo Samuel','Keaton Mitchell','Jalen Coker',
  'Rashid Shaheed','MarShawn Lloyd','Khalil Shakir','Ray Davis'
];
for(const name of observedDecisionZoneEvidence){
  const single="[norm('"+name.replaceAll("'","\\'")+"')]";
  const double='[norm("'+name.replaceAll('"','\\"')+'")]';
  assert.ok(app.includes(single)||app.includes(double),'decision-zone evidence missing: '+name);
}

const qb=board.rows.QB, rb=board.rows.RB;
assert.equal(qb.some(x=>x.name==='Cameron Ward'),false,'split Cameron Ward alias resurrected');
assert.equal(rb.some(x=>x.name==='Kenneth Gainwell'),false,'split Kenneth Gainwell alias resurrected');
const cam=qb.find(x=>x.name==='Cam Ward');
assert.ok(cam&&cam.n===5,'Cam Ward must contain all five base experts');
assert.ok(Math.abs(cam.rank-178.4)<1e-9,'Cam Ward merged weighted rank drift');
const gain=rb.find(x=>x.name==='Kenny Gainwell');
assert.ok(gain&&gain.n===4,'Kenny Gainwell must contain all four base experts');
assert.ok(Math.abs(gain.rank-122.65)<1e-9,'Kenny Gainwell merged weighted rank drift');
const dob=rb.find(x=>x.name==='J.K. Dobbins');
assert.ok(dob&&dob.n===2,'Dobbins sparse-panel canary must remain visible to generic guard');

console.log('RC496_DRAFT_CRITICAL_PASS');
