import fs from 'node:fs';
import assert from 'node:assert/strict';

const file=process.argv[2];
if(!file){console.error('Usage: node tools/analyze-decision-evidence.mjs PITTI-Decision-Evidence-*.json');process.exit(2)}
const e=JSON.parse(fs.readFileSync(file,'utf8'));
assert.equal(e.format,'pitti-decision-evidence-v2','Expected Evidence-v2 export');
assert.ok(Array.isArray(e.summaries),'summaries missing');
assert.ok(Array.isArray(e.fixtures),'fixtures missing');
assert.equal(e.appVersion,'v11.8.0-rc4.83','Evidence must come from frozen rc4.83 challenger');
assert.ok(e.draftId,'draftId missing');
assert.ok(Number.isFinite(Number(e.slot)),'slot missing');
assert.equal(e.mode,'mock','OOS promotion evidence must come from the realistic mock gate');
assert.equal(Number(e.slot),9,'OOS promotion evidence must use user slot 9');
assert.ok(Number(e.fixtureCount)===e.fixtures.length,'fixtureCount mismatch');
assert.ok(Number(e.resolvedCount)<=Number(e.fixtureCount),'resolvedCount exceeds fixtures');

const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const fixtureByPick=new Map(e.fixtures.map(f=>[Number(f.current),f]));
const rows=e.summaries.map(s=>{
  const f=fixtureByPick.get(Number(s.pick))||{};
  const candidates=f.candidates||[];
  const top=candidates[0]||s.coachTop||null;
  const chosen=candidates.find(x=>norm(x.name)===norm(s.chosen?.name))||null;
  const counts=s.rosterCounts||{};
  const flags=[];
  if(s.qb2Violation)flags.push('QB2_VIOLATION');
  if(s.wr7PlusFlag)flags.push('WR7_PLUS_COACH');
  else if(s.wrSaturationFlag)flags.push('WR6_PLUS_COACH');
  if(top?.pos==='TE'&&Number(counts.TE||0)>=1)flags.push('TE2_COACH');
  const acuteNames=new Set(['ashtonjeanty']);
  if(acuteNames.has(norm(top?.name))||acuteNames.has(norm(s.chosen?.name)))flags.push('ACUTE_STATUS_CONFOUND');
  if(s.override)flags.push('USER_OVERRIDE');
  if(s.chosen&&!s.chosenInFrozenCandidates)flags.push('CHOSEN_OUTSIDE_TOP16');
  const top3=candidates.slice(0,3).map((x,i)=>`${i+1}.${x.name}(${x.pos},${Number.isFinite(x.coachScore)?x.coachScore.toFixed(2):'?'})`).join(' | ');
  return{pick:s.pick,roster:`QB${counts.QB||0}/RB${counts.RB||0}/WR${counts.WR||0}/TE${counts.TE||0}`,coach:top?.name||'',coachPos:top?.pos||'',chosen:s.chosen?.name||'',followed:s.followedCoach===true?'YES':s.followedCoach===false?'NO':'?',chosenFrozenRank:s.chosen?.frozenRank??'',scoreDelta:Number.isFinite(s.scoreDelta)?s.scoreDelta.toFixed(2):'',panelDelta:Number.isFinite(s.panelDelta)?s.panelDelta.toFixed(2):'',flags:flags.join(','),top3};
});

const resolved=rows.filter(r=>r.chosen);
const overrides=resolved.filter(r=>r.followed==='NO');
const qb2=rows.filter(r=>r.flags.includes('QB2_VIOLATION'));
const wr6=rows.filter(r=>r.flags.includes('WR6_PLUS_COACH')||r.flags.includes('WR7_PLUS_COACH'));
const wr7=rows.filter(r=>r.flags.includes('WR7_PLUS_COACH'));
const te2=rows.filter(r=>r.flags.includes('TE2_COACH'));
const outside=rows.filter(r=>r.flags.includes('CHOSEN_OUTSIDE_TOP16'));
const acuteConfounds=rows.filter(r=>r.flags.includes('ACUTE_STATUS_CONFOUND'));
const cleanRows=rows.filter(r=>!r.flags.includes('ACUTE_STATUS_CONFOUND'));
const cleanWr6=cleanRows.filter(r=>r.flags.includes('WR6_PLUS_COACH')||r.flags.includes('WR7_PLUS_COACH'));
const cleanWr7=cleanRows.filter(r=>r.flags.includes('WR7_PLUS_COACH'));
const cleanQb2=cleanRows.filter(r=>r.flags.includes('QB2_VIOLATION'));
const completeness={
 fixtureCount:e.fixtureCount,summaryCount:e.summaries.length,resolved:e.resolvedCount,
 expectedOwnPicks:e.mode==='mock'?15:null,
 allFixturesSummarized:e.fixtureCount===e.summaries.length,
 allResolved:e.fixtureCount===e.resolvedCount,
 appVersion:e.appVersion
};
const verdict={
 telemetryComplete:completeness.allFixturesSummarized&&completeness.allResolved,
 hardQb2Pass:qb2.length===0,
 acuteStatusConfoundCount:acuteConfounds.length,
 cleanDecisionCount:cleanRows.length,
 cleanHardQb2Pass:cleanQb2.length===0,
 saturatedWrCount:wr6.length,
 wr7PlusCount:wr7.length,
 cleanSaturatedWrCount:cleanWr6.length,
 cleanWr7PlusCount:cleanWr7.length,
 te2CoachCount:te2.length,
 overrideCount:overrides.length,
 chosenOutsideTop16:outside.length
};
if(e.mode==='mock')assert.equal(Number(e.fixtureCount),15,'Expected 15 own-pick fixtures for completed 10x15 mock');
assert.equal(new Set(e.fixtures.map(f=>Number(f.current))).size,e.fixtures.length,'duplicate fixture pick detected');
console.log(JSON.stringify({meta:{draftId:e.draftId,createdAt:e.createdAt,mode:e.mode,slot:e.slot},completeness,verdict,rows},null,2));
