import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
function sourceOf(name){
  const start=app.indexOf(`function ${name}(`);assert.notEqual(start,-1,`missing ${name}`);
  const brace=app.indexOf('{',start);let depth=0;
  for(let i=brace;i<app.length;i++){if(app[i]==='{')depth++;if(app[i]==='}'&&--depth===0)return app.slice(start,i+1);}
  throw new Error(`unterminated ${name}`);
}
const sandbox={};vm.createContext(sandbox);
vm.runInContext([sourceOf('seasonSlotEligible'),sourceOf('seasonLegalDrop'),sourceOf('seasonStructurallyDroppable')].join('\n'),sandbox);
const row=(id,pos,status='ACTIVE',extra={})=>({seasonStatus:status,p:{id,name:id,pos},...extra});
const active=[row('qb','QB'),row('rb1','RB'),row('rb2','RB'),row('wr1','WR'),row('wr2','WR'),row('te1','TE'),row('te2','TE'),row('ir','RB','RESERVE')];
assert.equal(sandbox.seasonLegalDrop(active.at(-1),row('fa','WR'),active),false,'Reserve/IR cannot be an ordinary drop');
assert.equal(sandbox.seasonLegalDrop(row('only-te','TE'),row('Jalen Coker','WR'),[row('only-te','TE'),row('qb','QB')]),false,'Coker cannot replace the only active TE');
assert.equal(sandbox.seasonLegalDrop(row('only-qb','QB'),row('fa-rb','RB'),[row('only-qb','QB'),row('te','TE')]),false,'only active QB is protected cross-position');
assert.equal(sandbox.seasonLegalDrop(row('k','K'),row('fa-rb','RB'),active),false,'kicker cannot be compared with RB/WR/TE');
assert.equal(sandbox.seasonSlotEligible('FLEX','TE'),true,'two-TE roster remains legal because TE is FLEX eligible');
const protectedRb=row('protected','RB','ACTIVE',{nonDroppable:true});
assert.equal(sandbox.seasonStructurallyDroppable([...active,protectedRb]).some(x=>x.p.id==='protected'),false,'future D/ST cost excludes structurally protected players');
assert(app.includes("base=draftById.get(pid)")&&app.includes("season.my_roster.players"),'live Sleeper roster must be row authority; draft is metadata only');
assert(app.includes('seasonAcquisitionDecision(drop,fa'),'waiver decisions must use structural acquisition planning');
assert(app.includes('seasonLiveAuthority(season)')&&app.includes("before.status!=='VERIFIED'||after.status!=='VERIFIED'"),'actionability must fail closed without fresh live and weekly evidence');
assert(!app.includes('automatic fantasy transaction'));
console.log('SEASON_WAIVER_TEAM_NEEDS_V3_PASS');
