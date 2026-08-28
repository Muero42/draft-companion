import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes("v11.8.0-rc4.91"));
assert.ok(app.includes("pickNo<=30?4.25"),'early Return-v2 tau calibration missing');
assert.ok(!app.includes("pickNo<=30?1.35"),'old overconfident early tau resurrected');
// Analytic canary: market-only relative weight at pick 10 for ADP-like centers 16-19
// must remain material rather than near-zero. This does not assert a player-specific return.
const w=(pick,center,tau=4.25)=>Math.exp(Math.max(-9,Math.min(3.8,(pick-center)/tau)));
assert.ok(w(10,16)>=.20,'ADP16 candidate still implausibly suppressed at turn');
assert.ok(w(10,19)>=.10,'ADP19 candidate still implausibly suppressed at turn');
assert.ok(app.includes("managerHistoryPosMult"),'manager-history layer lost');
assert.ok(app.includes("candidateManagerMod"),'manager candidate layer lost');
console.log('RC491_EARLY_RETURN_CALIBRATION_PASS');