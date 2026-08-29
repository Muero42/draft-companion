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

// Frozen rc4.101 fixture deltas: replay the bounded rc4.104 marginal-utility change
// against the actual draft 1399284498113294336 roster states. These assertions do
// not pretend to reconstruct unrelated scoring layers; they prove the repair moves
// the mandatory failure points in the intended generic direction.
const oldMru=(pos,n,current)=>{
  let x=0;
  if(pos==='RB'&&current>=81){
    if(n>=7)x-=3.5; else if(n>=6)x-=2; else if(current>=121&&n<=4)x+=3.5;
    else if(current>=101&&n<=4)x+=2; else if(n<=3)x+=1;
  }
  if(pos==='WR'&&current>=81){
    if(current>=121&&n>=8)x-=20; else if(current>=121&&n>=7)x-=17;
    else if(current>=121&&n>=6)x-=14; else if(current>=101&&n>=8)x-=12;
    else if(current>=101&&n>=7)x-=9; else if(current>=101&&n>=6)x-=6;
    else if(n>=8)x-=8; else if(n>=7)x-=6; else if(n>=6)x-=4; else if(n<=4)x+=.5;
  }
  if(pos==='QB'&&n===0&&current>=130)x+=7;
  if(pos==='TE'&&n===0&&current>=120)x+=4;
  return x;
};
const delta=(pos,n,wr,rb,pick)=>mru({pos},pick,{counts:{WR:wr,RB:rb,QB:pos==='QB'?n:1,TE:pos==='TE'?n:0}})-oldMru(pos,n,pick);
assert.equal(delta('WR',6,6,2,92),-1.5,'pick92 WR6/RB2 opportunity cost');
assert.equal(delta('WR',7,7,2,109),-7.5,'pick109 WR7/RB2 opportunity cost');
assert.equal(delta('WR',8,8,2,112),-7.5,'pick112 WR8/RB2 opportunity cost');
assert.equal(delta('RB',3,9,3,132),0,'pick132 RB leader score is not directly retuned');
assert.equal(delta('TE',0,9,3,132),0,'pick132 TE score is not directly retuned');
// PR validation trigger: frozen-fixture contract revision 1\nconsole.log('RC4104_ROSTER_PORTFOLIO_PASS');
