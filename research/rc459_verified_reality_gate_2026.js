'use strict';
/* Fail-closed preflight for PRIMARY strategy simulations. No strategy output. */
const fs=require('fs'),crypto=require('crypto');
const SRC='research/rc459_full_policy_paired_2026.js';
const src=fs.readFileSync(SRC,'utf8');
const ok=(x,m)=>{if(!x)throw Error('VERIFIED_REALITY_GATE: '+m)};
const grab=(re,m)=>{const x=src.match(re);ok(x,m);return x};
const slotAt=p=>{const r=Math.floor((p-1)/10)+1,w=(p-1)%10+1;return r%2?w:11-w};
const userPicks=[];for(let p=1;p<=150;p++)if(slotAt(p)===9)userPicks.push(p);
const expected=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149];
ok(JSON.stringify(userPicks)===JSON.stringify(expected),'snake user picks');
ok(slotAt(9)===9&&slotAt(10)===10&&slotAt(11)===10&&slotAt(12)===9,'first turn geometry');
const us=grab(/const USER_SLOT=(\d+)/,'USER_SLOT')[1];ok(+us===9,'USER_SLOT != 9');
const up=grab(/const USER_PICKS=\[([^\]]+)\]/,'USER_PICKS')[1].split(',').map(Number);ok(JSON.stringify(up)===JSON.stringify(expected),'source USER_PICKS mismatch');
const mapLine=grab(/const MAP=\{([^\n]+)\};/,'MAP')[1];const activeLine=grab(/const ACTIVE=\{([^\n]+)\};/,'ACTIVE')[1];
ok(/10:'Dutch Marc'/.test(mapLine),'MAP slot10 is not Dutch Marc');ok(/10:'Dutch Marc'/.test(activeLine),'ACTIVE slot10 is not Dutch Marc');
/* Verify opponent() derives manager by slot on EACH pick and roster counts from that same slot.
   This proves pick 11 sees slot-10 roster after pick 10 when called sequentially. */
const screen=fs.readFileSync('research/rc459_decision_counterfactual_screen_2026.js','utf8');
ok(/const slot=api\.slotAt\(pn\),name=api\.ACTIVE\[slot\]/.test(screen),'opponent manager not slot-derived');
ok(/api\.counts\(s\.rosters\[slot\]\)/.test(screen),'opponent decision not conditioned on same-slot roster');
ok(/s\.rosters\[slot\]\.push\(ch\)/.test(screen),'opponent roster not updated after pick');
/* Candidate gate contract: current frozen gate must explicitly preserve fallers at pick 12 and ban Allen primary. */
const gate=fs.readFileSync('research/MARKET_REALITY_GATE_2026-08-23.md','utf8');
ok(gate.includes('any first-round-quality faller still available'),'pick12 faller contract missing');
ok(gate.includes('Josh Allen is CONTROL/MAJOR REACH at 2.02'),'Allen control contract missing');
ok(gate.includes('current Sleeper room/ADP as the primary availability market'),'Sleeper-primary market contract missing');
/* Verified league artifact contract from app.js. */
const app=fs.readFileSync('app.js','utf8');ok(app.includes('1366053132970233856'),'canonical live draft id missing');
ok(/teams[^\n]{0,100}10|10[^\n]{0,100}teams/i.test(app),'10-team validation evidence missing');
ok(/rounds[^\n]{0,100}15|15[^\n]{0,100}rounds/i.test(app),'15-round validation evidence missing');
const out={schema:1,status:'PASS',purpose:'preflight only; no strategy output',verified:{teams:10,rounds:15,user_slot:9,user_picks:expected,first_turn:[{pick:9,slot:9,actor:'USER'},{pick:10,slot:10,actor:'DUTCH'},{pick:11,slot:10,actor:'DUTCH'},{pick:12,slot:9,actor:'USER'}],dutch_pick11_roster_conditioned:true,pick12_fallers_required:true,josh_allen_2_02_primary:false},source_sha256:crypto.createHash('sha256').update(src).digest('hex')};
fs.mkdirSync('diagnostics_2026',{recursive:true});fs.writeFileSync('diagnostics_2026/RC459_VERIFIED_REALITY_GATE_2026.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));