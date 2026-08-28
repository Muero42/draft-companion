import fs from 'node:fs';
import vm from 'node:vm';

const file=process.argv[2];
if(!file){console.error('Usage: node tools/analyze-current-decision-evidence.mjs PITTI-Decision-Evidence-*.json');process.exit(2)}
const e=JSON.parse(fs.readFileSync(file,'utf8'));
if(!Array.isArray(e.fixtures))throw new Error('fixtures missing');

const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const loadBoard=(path,prefix)=>{
  let raw=fs.readFileSync(path,'utf8').trim();
  if(raw.startsWith(prefix))raw=raw.slice(prefix.length);
  raw=raw.replace(/;\s*$/,'');
  return JSON.parse(raw);
};
const v2=loadBoard('expert-v2-board.js','window.PITTI_EXPERT_V2=');
let v3raw=fs.readFileSync('expert-v3-board.js','utf8').trim();
v3raw=v3raw.replace(/^window\.PITTI_EXPERT_V3=/,'').replace(/;\s*$/,'');
const v3=vm.runInNewContext('('+v3raw+')');

const rawRows=e.fixtures.filter(f=>String(f.draftId||'')===String(e.draftId||''));
const byPick=new Map();
for(const f of rawRows){const k=Number(f.current);const p=byPick.get(k);if(!p||Number(f.createdAt||0)>=Number(p.createdAt||0))byPick.set(k,f);}
const fixtures=[...byPick.values()].sort((a,b)=>Number(a.current)-Number(b.current));
const latest=fixtures.slice().sort((a,b)=>(b.picks?.length||0)-(a.picks?.length||0))[0]||{};
const picked=new Map((latest.picks||[]).filter(p=>p.player_name).map(p=>[norm(p.player_name),Number(p.pick_no)]));

function boardN(name,pos,panelId){
  const base=(v2.rows?.[pos]||[]).find(r=>norm(r.name)===norm(name));
  if(!base)return null;
  if(String(panelId||'').startsWith('expert-v3-')&&v3.challengers?.[pos]){
    const has=v3.challengers[pos].ranks.some(([n])=>norm(n)===norm(name));
    return Number(base.n||0)+(has?1:0);
  }
  if(String(panelId||'').startsWith('expert-v2-'))return Number(base.n||0);
  return null;
}
function candidateN(x){
  if(Number.isFinite(Number(x.panelN)))return Number(x.panelN);
  if(Array.isArray(x.panelIndividuals)&&x.panelIndividuals.length)return x.panelIndividuals.length;
  return boardN(x.name,x.pos,x.panelId);
}
const summaryByPick=new Map((e.summaries||[]).map(s=>[Number(s.pick),s]));
const decisions=fixtures.map(f=>{
  const s=summaryByPick.get(Number(f.current))||{};
  const top=f.candidates?.[0]||s.coachTop||null;
  const chosen=f.chosenPlayer||s.chosen||null;
  const counts=s.rosterCounts||{};
  return {
    pick:Number(f.current),returnPick:Number.isFinite(Number(f.returnPick))?Number(f.returnPick):null,
    rosterCounts:counts,top:top?.name||null,topPos:top?.pos||null,topScore:top?.coachScore??top?.score??null,
    topPanel:top?.panelRank??null,topN:top?candidateN(top):null,topReturn:top?.returnProb??null,
    chosen:chosen?.name||null,followed:s.followedCoach??f.decisionOutcome?.followedCoach??null,
    override:(s.followedCoach??f.decisionOutcome?.followedCoach)===false,
    wrSaturated:top?.pos==='WR'&&Number(counts.WR||0)>=6
  };
});

const sparse=[],evidence=[],calibration=[],staleCandidateStates=[];
for(const f of fixtures){
  const chosen=norm(f.chosenPlayer?.name||'');
  for(const [i,x] of (f.candidates||[]).entries()){
    const n=candidateN(x);
    if(i<10&&Number.isFinite(n)&&n<4)sparse.push({pick:f.current,rank:i+1,name:x.name,pos:x.pos,panelId:x.panelId,n,panelRank:x.panelRank});
    if(i<10){
      const comps=x.researchResidual?.components||[];
      const specific=comps.some(c=>c?.display===true||c?.displayRisk===true);
      evidence.push({pick:f.current,rank:i+1,name:x.name,specific});
    }
    if(!Number.isFinite(Number(f.returnPick))||norm(x.name)===chosen||!Number.isFinite(Number(x.returnProb)))continue;
    const pn=picked.get(norm(x.name));
    if(Number.isFinite(pn)&&pn<Number(f.current)){staleCandidateStates.push({pick:f.current,name:x.name,alreadyTaken:pn});continue;}
    const actual=(!Number.isFinite(pn)||pn>=Number(f.returnPick))?1:0;
    calibration.push({pick:f.current,name:x.name,pred:Number(x.returnProb),actual,brier:(Number(x.returnProb)-actual)**2,taken:pn??null});
  }
}
const bins=[[0,.1],[.1,.25],[.25,.5],[.5,.75],[.75,.9],[.9,1.000001]];
const calibrationBins=bins.map(([lo,hi],idx)=>{
  const a=calibration.filter(x=>(idx===0?x.pred>=lo:x.pred>lo)&&x.pred<=hi);
  return {range:String(lo)+'-'+String(hi>1?1:hi),n:a.length,pred:a.length?a.reduce((s,x)=>s+x.pred,0)/a.length:null,actual:a.length?a.reduce((s,x)=>s+x.actual,0)/a.length:null,brier:a.length?a.reduce((s,x)=>s+x.brier,0)/a.length:null};
});
const topMisses=calibration.slice().sort((a,b)=>b.brier-a.brier).slice(0,15);
const evidenceCoverage=evidence.length?evidence.filter(x=>x.specific).length/evidence.length:null;
const missingEvidence=[...new Map(evidence.filter(x=>!x.specific).map(x=>[x.name,x])).values()].map(x=>x.name);
const overrides=decisions.filter(x=>x.override).map(x=>({...x,topTaken:x.top?picked.get(norm(x.top))??null:null,chosenTaken:x.chosen?picked.get(norm(x.chosen))??null:null}));

console.log(JSON.stringify({
  meta:{format:e.format,appVersion:e.appVersion,draftId:e.draftId,slot:e.slot,mode:e.mode,rawFixtureCount:rawRows.length,canonicalFixtureCount:fixtures.length,supersededFixtureCount:rawRows.length-fixtures.length,canonicalPicks:fixtures.map(f=>f.current)},
  verdict:{
    expectedOwnPicks:e.mode==='mock'?15:null,
    canonicalOwnPickCount:fixtures.length,
    duplicatePickStates:rawRows.length-fixtures.length,
    sparseTop10Count:sparse.length,
    top10SpecificEvidenceCoverage:evidenceCoverage,
    wrSaturatedCoachTopCount:decisions.filter(x=>x.wrSaturated).length,
    overrideCount:overrides.length,
    qb2ViolationCount:decisions.filter(x=>x.topPos==='QB'&&Number(x.rosterCounts?.QB||0)>=1).length,
    returnPredictionCount:calibration.length,
    returnBrier:calibration.length?calibration.reduce((s,x)=>s+x.brier,0)/calibration.length:null,
    staleCandidateStateCount:staleCandidateStates.length
  },
  decisions,overrides,sparse,missingEvidence,calibrationBins,topReturnMisses:topMisses,staleCandidateStates
},null,2));
