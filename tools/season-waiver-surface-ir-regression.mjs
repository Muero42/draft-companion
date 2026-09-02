import fs from 'node:fs';import assert from 'node:assert/strict';
const a=fs.readFileSync('app.js','utf8');
assert(a.includes("renderRosterFaAudit(rows,available||[],true,{render:false})"),'Kader must not render FA-vs-roster decisions');
assert(a.includes("x.seasonStatus==='ACTIVE'"),'IR/reserve must be excluded from live drop candidates');
assert(a.includes("rosterFaStatus.style.display='none'"),'legacy Kader FA surface must be hidden');
assert(a.includes("renderWaiverWorkspace(true)"),'Waiver workspace must remain the decision surface');
console.log('SEASON_WAIVER_SURFACE_IR_PASS');
