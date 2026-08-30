import fs from 'node:fs';
import assert from 'node:assert/strict';
import {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy} from '../decision-policy.js';

const app=fs.readFileSync('app.js','utf8');

assert.equal(USER_DRAFT_QB_LIMIT,1);
assert.equal(userDraftStrategyExcluded('QB',{QB:0}),false,'QB1 must remain draftable');
assert.equal(userDraftStrategyExcluded('QB',{QB:1}),true,'QB2 must be excluded after QB1');
assert.equal(userDraftStrategyExcluded('RB',{QB:1}),false,'QB policy must not leak to RB');
assert.equal(userDraftStrategyExcluded('QB',{QB:0},'Geno Smith'),true,'Geno Smith user hard exclusion missing');
assert.equal(userDraftStrategyExcluded('QB',{QB:0},'Aaron Rodgers'),true,'Aaron Rodgers user hard exclusion missing');
assert.equal(userDraftStrategyExcluded('QB',{QB:0},'Jared Goff'),false,'ordinary QB1 must remain eligible');

// OOS natural mock 1398395487467368448, pick 149: Trevor Lawrence already rostered.
// Kyler Murray/Jared Goff must not be able to consume the user's Coach surface.
for(const name of ['Kyler Murray','Jared Goff']){
  assert.equal(userDraftStrategyExcluded('QB',{QB:1,RB:5,WR:7,TE:1}),true,`${name}: QB2 exclusion failed`);
}

// OOS picks 129/132: ordinary WR8 safety resurrection is blocked at WR7.
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:7},rank:130.8,adp:127.3,current:129}),false,'pick129 ordinary WR8 safety resurrection');
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:7},rank:130.8,adp:127.3,current:132}),false,'pick132 ordinary WR8 safety resurrection');

// Not a WR cap: genuine strong market value can still be protected; late WR6+ ordinary safety resurrection is bounded.
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:7},rank:105,adp:110,current:132}),true,'exceptional WR value must remain eligible');
assert.equal(safetyPromotionEligiblePolicy({pos:'WR',counts:{WR:6},rank:130.8,adp:127.3,current:132}),false,'ordinary late WR6 safety resurrection must be bounded');

// Late RB remains eligible; no blind RB forcing is encoded here.
assert.equal(safetyPromotionEligiblePolicy({pos:'RB',counts:{RB:5,WR:7,QB:1,TE:1},rank:157.3,adp:162.6,current:149}),true,'late RB eligibility unexpectedly blocked');

// TE remains a separate soft exceptional-value path, not a QB2-style global ban.
assert.equal(safetyPromotionEligiblePolicy({pos:'TE',counts:{TE:1},rank:30,adp:110,current:149}),true,'exceptional TE2 path removed');
assert.equal(safetyPromotionEligiblePolicy({pos:'TE',counts:{TE:1},rank:40,adp:110,current:149}),false,'ordinary TE2 should not be safety-promoted');

// Wiring: executable helpers must be the actual app policy path.
assert.match(app,/from '\.\/decision-policy\.js'/);
assert.match(app,/userDraftStrategyExcluded\(p\.pos,state\.counts,p\.name\)/);
assert.match(app,/safetyPromotionEligiblePolicy\(\{/);
assert.doesNotMatch(app,/if\(x\.p\.pos==='WR'.*stateCounts.*WR.*>=7.*return Number\.isFinite/s);

console.log('RC478_OOS_POLICY_PASS draft=1398395487467368448 picks=129,132,149');
