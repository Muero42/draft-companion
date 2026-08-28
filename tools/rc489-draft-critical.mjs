import fs from 'node:fs';import assert from 'node:assert/strict';import vm from 'node:vm';
const app=fs.readFileSync('app.js','utf8'),live=fs.readFileSync('live-surface-v3.js','utf8'),idx=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8'),css=fs.readFileSync('live-surface-v3.css','utf8');
for(const [n,s] of [['app',app],['index',idx],['sw',sw]])assert.ok(s.includes('v11.8.0-rc4.89'),n+' version mismatch');
assert.ok(live.includes("expertv3:'Expert-v3 POSITIONSSPEZIFISCH'"));
assert.ok(live.includes("p.QB==='expert-v3-qb'&&p.RB==='expert-v3-rb'&&p.WR==='expert-v2-wr'&&p.TE==='expert-v3-te'"));
assert.ok(live.includes("const V3={QB:"));
assert.ok(live.includes("'Todd D Clark'"));
assert.ok(live.includes("'Ryan Weisse'"));
assert.ok(live.includes("'Wolf of Roto Street'"));
assert.ok(live.includes("s.rows.slice(0,10).map(card).join('')"));
assert.ok(!live.includes('10ER-ÜBERSICHT'));
assert.ok(!live.includes('live-hierarchy'));
assert.ok(live.includes('TOP 10 KANDIDATEN'));
assert.ok(live.includes('live-cut-warning'));
assert.ok(css.includes('.live-cut-warning'));
for(const name of ['James Cook','CeeDee Lamb','Justin Jefferson','Brock Bowers'])assert.ok(app.includes("[norm('"+name+"')]"),name+' rich evidence missing');

// Runtime presentation check: selected v3 profile must show the actual v3 experts, not incumbent names.
const store={v7_positionPanels:JSON.stringify({QB:'expert-v3-qb',RB:'expert-v3-rb',WR:'expert-v2-wr',TE:'expert-v3-te'})};
const el=()=>({textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},querySelector(){return null},getBoundingClientRect(){return{top:0,bottom:1}},setAttribute(){},scrollIntoView(){},hidden:false});
const ctx={window:{PITTI_LIVE_DECISION_STATE:()=>null},document:{getElementById:()=>el(),querySelector:()=>null,createElement:()=>el(),addEventListener(){},hidden:false,readyState:'complete',body:{appendChild(){},classList:{toggle(){},add(){},remove(){}}}},localStorage:{getItem:k=>store[k]??null},navigator:{clipboard:{writeText:async()=>{}}},MutationObserver:class{observe(){}},addEventListener(){},innerHeight:800,console};ctx.window.window=ctx.window;ctx.window.localStorage=ctx.localStorage;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(live,ctx);
const p=ctx.window.PITTI_LIVE_PRESENTATION_V3;assert.equal(p.profileLabel(),'Expert-v3 POSITIONSSPEZIFISCH');
const rb={pos:'RB',individual:[{expertName:'Draft Sharks Team',rank:12},{expertName:'Dalton Del Don',rank:15},{expertName:'Pat Fitzmaurice',rank:18},{expertName:'Nick Mariano',rank:14},{expertName:'Ryan Weisse',rank:10}]};
const te={pos:'TE',individual:[{expertName:'Draft Sharks Team',rank:20},{expertName:'Dalton Del Don',rank:24},{expertName:'Pat Fitzmaurice',rank:23},{expertName:'Justin Boone',rank:21},{expertName:'Wolf of Roto Street',rank:19}]};
const qb={pos:'QB',individual:[{expertName:'Draft Sharks Team',rank:30},{expertName:'Dalton Del Don',rank:35},{expertName:'Pat Fitzmaurice',rank:40},{expertName:'Nick Mariano',rank:32},{expertName:'Justin Boone',rank:36},{expertName:'Todd D Clark',rank:25}]};
assert.ok(p.ex(rb).includes('Weisse #10'));assert.ok(!p.ex(rb).includes('Erickson'));
assert.ok(p.ex(te).includes('Wolf #19'));assert.ok(!p.ex(te).includes('D. Brown'));
assert.ok(p.ex(qb).includes('Todd #25'));assert.ok(!p.ex(qb).includes('Koerner'));
console.log('RC489_LIVE_EXPERT_V3_AND_TOP10_PASS');