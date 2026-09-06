import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
function sourceOf(name){
  const start=app.indexOf(`function ${name}(`);assert.notEqual(start,-1,`missing ${name}`);
  const brace=app.indexOf('{',start);let depth=0;
  for(let i=brace;i<app.length;i++){
    if(app[i]==='{')depth++;
    if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);
  }
  throw new Error(`unterminated ${name}`);
}
const sandbox={lastDraftContext:{season:{ok:true,generated_at:Date.now()}},Date};
vm.createContext(sandbox);
vm.runInContext([sourceOf('postDraftRosterCounts'),sourceOf('waiverV3Context'),sourceOf('waiverV3DropLegal'),sourceOf('seasonSlotEligible')].join('\n'),sandbox);
const row=(id,pos,status='ACTIVE')=>({seasonStatus:status,p:{id,name:id,pos}});
const active=[row('qb','QB'),row('rb1','RB'),row('rb2','RB'),row('wr1','WR'),row('wr2','WR'),row('te1','TE'),row('te2','TE'),row('ir','RB','RESERVE')];
const ctx=sandbox.waiverV3Context(active);

assert.equal(ctx.counts.RB,2,'Reserve/IR must not count as active depth');
assert.equal(sandbox.waiverV3DropLegal(active.at(-1),row('fa','WR'),ctx),false,'Reserve/IR cannot be an ordinary drop');
assert.equal(sandbox.waiverV3DropLegal(row('only-te','TE'),row('Jalen Coker','WR'),sandbox.waiverV3Context([row('only-te','TE'),row('qb','QB')])),false,'Coker cannot replace the only active TE');
assert.equal(sandbox.waiverV3DropLegal(row('only-qb','QB'),row('fa-rb','RB'),sandbox.waiverV3Context([row('only-qb','QB'),row('te','TE')])),false,'only active QB is protected cross-position');
assert.equal(sandbox.waiverV3DropLegal(row('k','K'),row('fa-rb','RB'),ctx),false,'kicker cannot be compared with RB/WR/TE');
assert.equal(sandbox.seasonSlotEligible('FLEX','TE'),true,'two-TE roster remains legal because TE is FLEX eligible');
assert(app.includes("base=draftById.get(pid)")&&app.includes("season.my_roster.players"),'live Sleeper roster must be the row authority; draft is metadata only');
assert(app.includes('capacityCost=ctx.rosterHasDst?0:')&&app.includes('-capacityCost*.35'),'pending D/ST slot cost must reduce a preceding acquisition score');
assert(app.includes('ctx.liveFresh&&freshEvidencePresent'),'actionability must fail closed without fresh live and player evidence');
assert(app.includes('Market/FAAB pressure:')&&app.includes('needAddressed')&&app.includes('lineupGain'),'v3 rationale fields missing');
assert(!app.includes('automatic fantasy transaction'));
console.log('SEASON_WAIVER_TEAM_NEEDS_V3_PASS');
