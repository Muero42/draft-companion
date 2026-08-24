'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const app=fs.readFileSync('app.js','utf8');

function extractFunction(name,nextName){
  const start=app.indexOf(`function ${name}(`);
  const end=app.indexOf(`\nfunction ${nextName}(`,start);
  assert(start>=0&&end>start,`cannot extract ${name}`);
  return app.slice(start,end);
}

const ctx={};
vm.createContext(ctx);
vm.runInContext(extractFunction('rosterExceptionPenalty','lateUpsideBonus'),ctx);
const state={counts:{QB:1,RB:2,WR:3,TE:1}};

// Duplicate QB/TE must remain strongly suppressed while scarce RB/WR roster value is still being built.
assert.strictEqual(ctx.rosterExceptionPenalty('QB',state,29,70,100),-42);
assert.strictEqual(ctx.rosterExceptionPenalty('TE',state,29,50,80),-38);
assert.strictEqual(ctx.rosterExceptionPenalty('QB',state,121,70,100),-24);
assert.strictEqual(ctx.rosterExceptionPenalty('TE',state,121,50,80),-26);

// Endgame is no longer a permanent ban: ordinary duplicates remain penalized, genuinely fallen elite value can escape.
assert.strictEqual(ctx.rosterExceptionPenalty('QB',state,141,70,100),-8);
assert.strictEqual(ctx.rosterExceptionPenalty('TE',state,141,50,80),-10);
assert.strictEqual(ctx.rosterExceptionPenalty('QB',state,141,40,80),0);
assert.strictEqual(ctx.rosterExceptionPenalty('TE',state,141,30,65),0);

// Hard safety invariants.
assert(app.includes("const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])"));
assert(app.includes('recommendationBlocked:true'));
assert(app.includes('DRAFT_ACUTE_STATUS_2026'));
assert(!/chasebrown.*(?:force|winner|override)/i.test(app),'player-specific Chase Brown winner override detected');
assert(!/brockbowers.*(?:force|winner|override)/i.test(app),'player-specific Bowers winner override detected');

console.log('PASS final RC behavioral gate');
