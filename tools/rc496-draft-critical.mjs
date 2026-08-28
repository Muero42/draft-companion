import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const boardSrc=fs.readFileSync('expert-v2-board.js','utf8').trim();
const board=JSON.parse(boardSrc.replace(/^window\.PITTI_EXPERT_V2=/,'').replace(/;\s*$/,''));

assert.match(app,/const APP_VERSION='v11\.8\.0-rc4\.96'/,'rc4.96 version missing');
assert.match(app,/st==='QUESTIONABLE'\?0/,'Questionable must remain score-neutral');
assert.match(app,/const sparsePanelPenalty=r\.n>=4\?0:r\.n===3\?2:r\.n===2\?7:14/,'sparse-panel score guard missing');
assert.match(app,/const confidenceCap=r\.n>=4\?96:r\.n===3\?78:r\.n===2\?62:50/,'sparse-panel confidence cap missing');
assert.match(app,/Number\.isFinite\(Number\(x\.w\)\)\?Number\(x\.w\):Number\(x\.effectiveWeight\)/,'embedded expert weights must survive evidence export');
assert.match(app,/const byPick=new Map\(\)/,'decision evidence canonical per-pick dedupe missing');
assert.match(app,/supersededFixtureCount/,'decision evidence superseded-fixture telemetry missing');
assert.match(app,/panelN:Number\.isFinite/,'decision evidence panelN missing');
assert.match(app,/reasons:Array\.isArray\(x\.reasons\)/,'decision evidence scoring reasons missing');
assert.match(app,/const displayGap=current<=70\?18:current<=110\?22:26/,'presentation normal-cut must be broader than safety gate');
assert.match(app,/current>=121&&n>=6\)x-=12/,'late WR7 marginal-utility guard missing');
assert.match(app,/current>=121&&n<=4\)x\+=2/,'late RB contingent-option utility missing');
assert.match(live,/return'PANEL-CHECK'/,'live sparse-panel signal missing');
assert.match(live,/Panel unvollständig\|Panel-Streuung/,'live sparse-panel negative evidence handling missing');

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
