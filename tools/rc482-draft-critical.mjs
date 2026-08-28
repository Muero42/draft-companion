import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const policy=fs.readFileSync('decision-policy.js','utf8');
const boardSrc=fs.readFileSync('expert-v2-board.js','utf8');
const idx=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=fs.readFileSync('manifest.webmanifest','utf8');

const activeVersion=(app.match(/const APP_VERSION='v11\.8\.0-rc4\.(\d+)'/)||[])[1];assert.ok(Number(activeVersion)>=82,'active runtime below rc4.82 feature gate');
for(const stale of ['v11.8.0-rc4.78','v11.8.0-rc4.79','v11.8.0-rc4.80','11.8.0-rc4.72'])assert.ok(!app.includes(stale),`stale active version ${stale}`);
const currentTag='v11.8.0-rc4.'+activeVersion;assert.ok(idx.includes(currentTag));assert.ok(sw.includes(currentTag));assert.ok(manifest.includes(currentTag));
assert.ok(sw.includes('./decision-policy.js'));

const psrc=policy.replace(/export\s+/g,'');
const {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy}=new Function(psrc+';return {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy}')();
assert.equal(USER_DRAFT_QB_LIMIT,1);
assert.equal(userDraftStrategyExcluded('QB',{QB:0}),false);
assert.equal(userDraftStrategyExcluded('QB',{QB:1}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:7},rank:130.8,adp:127.3,current:132}),false);
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

console.log('RC482_DRAFT_CRITICAL_PASS');
