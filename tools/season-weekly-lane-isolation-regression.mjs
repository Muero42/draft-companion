import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('async function refreshSeasonRankings('),end=app.indexOf('\nconst SEASON_TRADE_VALUE_AUTO_MS',start);
assert(start>=0&&end>start,'production Weekly Evidence refresh block missing');
const refresh=app.slice(start,end);
assert.match(refresh,/Promise\.allSettled\(WEEKLY_PROJECTION_POSITIONS/,'projection positions must settle independently');
assert.match(refresh,/const projectionSnapshot=api\.buildSnapshot/,'projection-stage snapshot must be built');
assert.match(refresh,/refreshStage:'PROJECTIONS'/,'projection-stage snapshot must be persisted explicitly');
assert.match(refresh,/Promise\.allSettled\(WEEKLY_PROJECTION_POSITIONS[\s\S]*consensus-rankings/,'rank positions must settle independently');
const projectionWrite=refresh.indexOf("refreshStage:'PROJECTIONS'"),rankStart=refresh.indexOf('consensus-rankings');
assert(projectionWrite>=0&&rankStart>projectionWrite,'verified projections must persist before optional rank acquisition starts');
assert(!refresh.includes("snapshot.lanes.projections.status!=='AVAILABLE'"),'partial record-valid projection snapshots must not be globally rejected');
assert.match(refresh,/some\(position=>position\.status==='AVAILABLE'\)/,'all-projection-failure must fail closed before replacing prior evidence');
console.log('SEASON_WEEKLY_LANE_ISOLATION_PASS');
