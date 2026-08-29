import fs from 'node:fs';
import assert from 'node:assert/strict';
import {safetyPromotionEligiblePolicy} from '../decision-policy.js';

const app=fs.readFileSync('app.js','utf8');
const m=app.match(/function marginalRosterUtility\(p,current,state\)\{([\s\S]*?)\n\}/);
assert.ok(m,'marginalRosterUtility missing');
const mru=new Function('p','current','state',m[1]+'\nreturn x;');
const s=(wr,rb,pick,pos='WR')=>mru({pos},pick,{counts:{WR:wr,RB:rb,QB:0,TE:0}});

// rc4.101 strict-Coach evidence: WR6/RB2 at pick 92 must not be force-promoted
// by Player-Quality Safety unless it is a genuine large market value.
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6,RB:2},rank:93.6,adp:100.1,current:92}),false);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6,RB:2},rank:93.6,adp:80,current:92}),true);
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:5,RB:2},rank:93.6,adp:100.1,current:92}),true);

// Repeated WR7+/RB<=3 construction gets an extra soft cost, never exclusion.
assert.equal(s(7,3,109),-16.5);
assert.equal(s(8,2,112),-19.5);
assert.equal(s(7,4,109),-10.5);
assert.ok(Number.isFinite(s(9,2,112)));
assert.ok(!m[1].includes('return -999'));

console.log('RC4104_ROSTER_PORTFOLIO_PASS');
