'use strict';
const fs=require('fs');
function ok(x,m){if(!x)throw Error('REALITY_AUDIT_FAIL: '+m)}
const cfg=JSON.parse(fs.readFileSync('research/VERIFIED_LEAGUE_CONFIG_2026-08-23.json','utf8'));
const core=fs.readFileSync('research/rc459_full_policy_paired_2026.js','utf8');
const screen=fs.readFileSync('research/rc459_decision_counterfactual_screen_2026.js','utf8');
const util=fs.readFileSync('research/rc459_direct_2_02_regular_season_utility_2026.py','utf8');
const app=fs.readFileSync('app.js','utf8');

ok(cfg.teams===10,'verified teams');
ok(cfg.rounds===15,'verified rounds');
ok(cfg.user_slot===9,'verified user slot');
ok(JSON.stringify(cfg.user_picks)===JSON.stringify([9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]),'verified user picks');
ok(cfg.turn_1_09_to_2_02.pick_10.slot===10&&cfg.turn_1_09_to_2_02.pick_11.slot===10,'Dutch owns picks 10 and 11');
ok(cfg.turn_1_09_to_2_02.pick_10.research_alias==='Dutch Marc'&&cfg.turn_1_09_to_2_02.pick_11.research_alias==='Dutch Marc','same Dutch alias at 10+11');

ok(core.includes("const USER_SLOT=9, USER_PICKS=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149];"),'core USER_PICK geometry');
ok(core.includes("10:'Dutch Marc'"),'core slot10 manager');
ok(core.includes("function slotAt(p){const r=Math.floor((p-1)/10)+1,w=(p-1)%10+1;return r%2?w:11-w}"),'core snake function');
const slotAt=p=>{const r=Math.floor((p-1)/10)+1,w=(p-1)%10+1;return r%2?w:11-w};
ok(slotAt(9)===9&&slotAt(10)===10&&slotAt(11)===10&&slotAt(12)===9,'1.09->2.02 snake geometry');
for(const p of cfg.user_picks)ok(slotAt(p)===9,'user pick '+p+' maps slot9');

/* Roster-dependency guard: opponent decision must derive counts from the current roster of that exact slot. */
ok(screen.includes("const c=api.counts(s.rosters[slot]),sp=api.special(s.r,name,c,pn)"),'counterfactual opponent reads current slot roster');
ok(screen.includes("api.oppWeight(p,pn,c,name,stress)"),'counterfactual opponent weights receive current roster counts');
ok(core.includes("function oppWeight(p,pn,c,name,stress)"),'full-policy opponent has roster-count argument');
ok(core.includes("*need(p.pos,c)*managerHist(name,p.pos,pn)*trait(name,p,pn)"),'opponent choice materially uses roster need');

/* Current production app must agree with frozen identity geometry. */
ok(app.includes("const LIVE_DRAFT_ID_2026='1366053132970233856';"),'canonical live draft id present');
ok(app.includes("if(Number(teams)!==10)errors.push('Teams')"),'app canonical 10-team guard');
ok(app.includes("if(Number(rounds)!==15)errors.push('Runden')"),'app canonical 15-round guard');
ok(app.includes("if(Number(slot)!==9)errors.push('Slot')"),'app canonical slot9 guard');
ok(app.includes("10=Dutch Marc"),'app manager map slot10');

/* Exact verified starter topology from current NFL Elite screenshot. */
const r=cfg.roster;
ok(r.QB===1&&r.RB===1&&r.WR===2&&r.TE===1&&r.FLEX_W_R_T===1&&r.FLEX_W_R===1&&r.K===1&&r.DEF===1&&r.BN===6&&r.IR===1,'verified roster slots');
ok(r.skill_start_topology.RB_max===3&&r.skill_start_topology.WR_max===4&&r.skill_start_topology.TE_max===2&&r.skill_start_topology.RB_WR_TE_total===6,'verified skill topology');
ok(util.includes('one flex RB/WR/TE, second RB/WR; TE max 2 in a lineup.'),'utility documents asymmetric flex topology');
ok(util.includes('for rb in range(1,4):')&&util.includes('for wr in range(2,5):')&&util.includes('for te in range(1,3):')&&util.includes('if rb+wr+te!=6:continue'),'utility enforces verified skill topology');

const aliases=Object.fromEntries(cfg.draft_order.map(x=>[x.slot,x.research_alias]));
const expected={1:'Michael',2:'Pascal Voerde',3:'Marc Düsseldorf',4:'Thomas',5:'Bjoern',6:'Pascal Gelderner',7:'Giuliano',8:'Basti',9:'Tim',10:'Dutch Marc'};
ok(JSON.stringify(aliases)===JSON.stringify(expected),'verified screenshot identities map to research aliases');

const out={status:'PASS',verified_config:'research/VERIFIED_LEAGUE_CONFIG_2026-08-23.json',teams:10,rounds:15,user_slot:9,user_picks:cfg.user_picks,turn:{9:9,10:10,11:10,12:9},turn_manager:{10:'Dutch Marc',11:'Dutch Marc'},roster_dependency_verified:true,starter_topology_verified:true,canonical_live_draft_id:'1366053132970233856',strategy_evidence_allowed:true};
fs.mkdirSync('diagnostics_2026',{recursive:true});fs.writeFileSync('diagnostics_2026/RC459_VERIFIED_LEAGUE_REALITY_AUDIT_2026.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
