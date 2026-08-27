import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const policy=fs.readFileSync('decision-policy.js','utf8');
const boardSrc=fs.readFileSync('expert-v2-board.js','utf8');
const idx=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=fs.readFileSync('manifest.webmanifest','utf8');

assert.match(app,/const APP_VERSION='v11\.8\.0-rc4\.83'/);
for(const stale of ['v11.8.0-rc4.78','v11.8.0-rc4.79','v11.8.0-rc4.80','11.8.0-rc4.72'])assert.ok(!app.includes(stale),`stale active version ${stale}`);
assert.ok(idx.includes('v11.8.0-rc4.83'));
assert.ok(sw.includes('v11.8.0-rc4.83'));
assert.ok(manifest.includes('v11.8.0-rc4.83'));
assert.ok(sw.includes('./decision-policy.js'));

const psrc=policy.replace(/export\s+/g,'');
const {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy}=new Function(psrc+';return {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy}')();
assert.equal(USER_DRAFT_QB_LIMIT,1);
assert.equal(userDraftStrategyExcluded('QB',{QB:0}),false);
assert.equal(userDraftStrategyExcluded('QB',{QB:1}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6},rank:130.8,adp:127.3,current:132}),false);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6},rank:105,adp:110,current:132}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6},rank:105,adp:110,current:100}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:7},rank:105,adp:110,current:132}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'TE',counts:{TE:1},rank:30,adp:110,current:149}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'TE',counts:{TE:1},rank:40,adp:110,current:149}),false);

assert.match(app,/const EXPERT_PROFILE_IDS=\{incumbent:\{QB:'qb',RB:'rb',WR:'wr',TE:'te'\},fullv2:\{QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'\},wrv2:\{QB:'qb',RB:'rb',WR:'expert-v2-wr',TE:'te'\}\}/);
for(const option of ['Bisherige Konfiguration (rc4.64)','Expert-v2 · alle Positionen','Expert-v2 · nur WR'])assert.ok(idx.includes(option),option);
assert.ok(app.includes('function activePanelHealthState()'));
assert.ok(app.includes("Panel-Health: ${activeHealth.degraded?'DEGRADED':'OK'}"));
assert.ok(app.includes('Expertenquelle: ${activePanelSourceSummary()}'));
assert.ok(app.includes('Panel-Gewichte: ${activePanelWeightSummary()}'));
assert.ok(app.includes('aktive Expert-v2 Stimmen'));
assert.ok(app.includes("mode==='hybrid'"));

const grab=name=>{const s=app.indexOf(`function ${name}`);assert.ok(s>=0,name);let i=app.indexOf('{',s),d=0;for(let j=i;j<app.length;j++){if(app[j]==='{')d++;else if(app[j]==='}'){d--;if(d===0)return app.slice(s,j+1)}}throw new Error(name)};
const hsrc=[grab('embeddedPanelExpertNames'),grab('activePanelHealthState'),grab('activePanelHealthSummaryText')].join('\n');
const factory=new Function('panels','panelRanks','rankCache','positionPanels','PRESETS','panelFor',hsrc+';return {activePanelHealthState,activePanelHealthSummaryText}');
function fixture(profile,badLive=false){
  const positionPanels=profile==='fullv2'?{QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'}:profile==='wrv2'?{QB:'qb',RB:'rb',WR:'expert-v2-wr',TE:'te'}:{QB:'qb',RB:'rb',WR:'wr',TE:'te'};
  const panels={},panelRanks={},rankCache={},PRESETS={qb:{max:3},rb:{max:4},wr:{max:4},te:{max:4}};
  for(const pos of ['QB','RB','WR','TE']){const id='expert-v2-'+pos.toLowerCase();panels[id]={shadow:true,members:{}};panelRanks[id]={x:{individual:[{expertName:'Draft Sharks Team',rank:1},{expertName:'Pat Fitzmaurice',rank:2}]}}}
  for(const [id,max] of [['qb',3],['rb',4],['wr',4],['te',4]]){const members={};for(let i=0;i<max;i++){const eid=id+i;members[eid]=1;rankCache[eid]={verifiedIndividual:true,duplicateOf:null,staleFallback:false}}panels[id]={shadow:false,members};panelRanks[id]={x:{rank:1}}}
  if(badLive)delete rankCache.qb2;
  const f=factory(panels,panelRanks,rankCache,positionPanels,PRESETS,pos=>positionPanels[pos]);
  return f.activePanelHealthState();
}
assert.equal(fixture('fullv2').degraded,false);
assert.equal(fixture('fullv2').mode,'embedded');
assert.equal(fixture('wrv2').degraded,false);
assert.equal(fixture('wrv2').mode,'hybrid');
assert.equal(fixture('wrv2',true).degraded,true,'hybrid must not hide degraded live QB panel');
assert.equal(fixture('incumbent').degraded,false);

const m=boardSrc.match(/window\.PITTI_EXPERT_V2=([\s\S]+);\s*$/);assert.ok(m);
const board=JSON.parse(m[1]);
assert.equal(board.schema,'pitti-expert-v2-board.v4');
assert.deepEqual(Object.fromEntries(Object.entries(board.rows).map(([k,v])=>[k,v.length])),{QB:46,RB:102,WR:143,TE:54});
assert.deepEqual(board.weights,{
  QB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':20,'Justin Boone':10,'Pat Fitzmaurice':10},
  RB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':25,'Pat Fitzmaurice':15},
  WR:{'Nick Mariano':35,'Draft Sharks Team':30,'Pat Fitzmaurice':15,'Dalton Del Don':10,'Justin Boone':10},
  TE:{'Draft Sharks Team':35,'Pat Fitzmaurice':30,'Dalton Del Don':25,'Justin Boone':10}
});
assert.ok(!JSON.stringify(board.weights).includes('Derek Brown'));

for(const name of ['Kyler Murray','Malik Willis','Jared Goff'])assert.ok(app.includes(`[norm('${name}')]`),name);
assert.ok(app.includes('Fitzmaurice 27.08.'));
assert.ok(app.indexOf('userDraftStrategyExcluded(p.pos,state.counts)')>app.indexOf('function scoreCandidate'));

console.log('RC483_DRAFT_CRITICAL_PASS');

// rc4.83 bounded late-WR saturation challenger invariants.
const mru=grab('marginalRosterUtility'),prog=grab('progressiveUpsideBonus');
assert.ok(mru.includes("if(n>=8)x-=6.5;else if(n>=7)x-=5;else if(n>=6)x-=3"));
assert.ok(prog.includes("state.counts.WR>=6"));
assert.ok(prog.includes("[0,1.5,3,4.5]"));
assert.ok(prog.includes("[0,.75,1.5,2.5]"));
assert.ok(!app.includes("&& !(x.p.pos==='WR'"),'saturation policy must remain centralized in decision-policy.js');

// Decision-quality evidence must distinguish Coach recommendation from user override.
assert.ok(app.includes('decisionOutcome={coachTop:coach?'));
assert.ok(app.includes('followedCoach:!!coach'));
assert.ok(app.includes('chosenInFrozenCandidates:!!chosenCandidate'));
assert.ok(app.includes('chosenVsCoachScoreDelta'));

// One-tap current-draft decision evidence export.
assert.ok(app.includes("format:'pitti-decision-evidence-v2'"));
assert.ok(app.includes("fixtures:rows"));
assert.ok(app.includes("overrideCount:rows.filter"));
assert.ok(index.includes('id="decisionEvidenceBtn"'));

assert.ok(app.includes('wrSaturationRecommendationCount'));
assert.ok(app.includes('qb2ViolationCount'));
assert.ok(app.includes('rosterCounts:counts'));

// Freeze audit: explicit user QB exclusions and K/DST omission from candidate construction.
assert.ok(app.includes("USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])"));
assert.ok(app.includes("USER_HARD_QB_EXCLUSIONS.has(norm(p.name))"));
assert.ok(app.includes("['QB','RB','WR','TE'].includes(p.pos)"));
assert.ok(!policy.includes("userDraftStrategyExcluded('WR'"));

// Evidence roster counts must not depend on rankedAvailable membership (e.g. already-drafted roster players).
assert.ok(app.includes("player_name:p.metadata?.first_name"));
assert.ok(app.includes("pos:meta.position||p.metadata?.position||null"));
assert.ok(app.includes("const pos=p.pos||(f.rankedPool||[]).find"));
assert.ok(app.includes("freezeDecisionFixture({draftId:id,current,returnPick,picks,mine,players,rankedAvailable"));

// Evidence schema contract: future analysis must not silently lose per-pick context.
for(const k of ['current','rosterCounts','candidates','chosenPlayer','decisionOutcome'])assert.ok(app.includes(k),k);
assert.ok(app.includes("format:'pitti-decision-evidence-v2'"));
assert.ok(app.includes('wrSaturationRecommendationCount'));
assert.ok(app.includes('qb2ViolationCount'));

// Evidence-v2 offline analyzer must remain available for immediate OOS grading.
const evidenceAnalyzer=fs.readFileSync('tools/analyze-decision-evidence.mjs','utf8');
for(const k of ['QB2_VIOLATION','WR6_PLUS_COACH','WR7_PLUS_COACH','TE2_COACH','USER_OVERRIDE','CHOSEN_OUTSIDE_TOP16'])assert.ok(evidenceAnalyzer.includes(k),k);
assert.ok(evidenceAnalyzer.includes("hardQb2Pass:qb2.length===0"));
assert.ok(evidenceAnalyzer.includes('telemetryComplete:'));
