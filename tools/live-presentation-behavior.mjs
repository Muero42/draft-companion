import fs from 'node:fs';import vm from 'node:vm';
const src=fs.readFileSync('live-surface-v3.js','utf8');
const store={v7_positionPanels:JSON.stringify({QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'})};
const el=()=>({textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},querySelector(){return null}});
const ctx={window:{PITTI_LIVE_DECISION_STATE:()=>null},document:{getElementById:()=>el(),querySelector:()=>null,createElement:()=>el(),body:{appendChild(){}}},localStorage:{getItem:k=>store[k]??null},navigator:{clipboard:{writeText:async()=>{}}},setInterval:()=>0,clearInterval(){},console};
ctx.window.window=ctx.window;ctx.window.localStorage=ctx.localStorage;ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const p=ctx.window.PITTI_LIVE_PRESENTATION_V3;if(!p)throw Error('presentation export missing');
const ind=(pairs)=>pairs.map(([expertName,rank])=>({expertName,rank}));
const rows=[
{name:'Jahmyr Gibbs',pos:'RB',team:'DET',role:'RB1',panel:1.5,adp:2.0,ret:.05,score:100,confidence:90,returnConfidence:90,loss:'hoch',arrows:'↑',reasons:['Positions-Alternativen 4 nah'],individual:ind([['Draft Sharks Team',1],['Dalton Del Don',1],['Pat Fitzmaurice',2],['Nick Mariano',1]]) ,researchResidual:{active:true,components:[{kind:'efficiency_upside',dir:1,strength:.7,confidence:.9}]}},
{name:'Bijan Robinson',pos:'RB',team:'ATL',role:'RB1',panel:1.8,adp:1.0,ret:.04,score:99,confidence:90,returnConfidence:90,loss:'hoch',arrows:'',reasons:['Positions-Alternativen 4 nah'],individual:ind([['Draft Sharks Team',2],['Dalton Del Don',2],['Pat Fitzmaurice',1],['Nick Mariano',2]])},
{name:"Ja'Marr Chase",pos:'WR',team:'CIN',role:'WR1',panel:3.5,adp:3.3,ret:0,score:98,confidence:88,returnConfidence:90,loss:'hoch',arrows:'',reasons:['Positions-Alternativen 4 nah'],individual:ind([['Draft Sharks Team',4],['Dalton Del Don',3],['Pat Fitzmaurice',4],['Nick Mariano',3],['Justin Boone',4]])},
{name:'Parker Washington',pos:'WR',team:'JAX',role:'WR2',panel:59,adp:75,ret:.86,score:70,confidence:75,returnConfidence:80,loss:'niedrig',arrows:'↑↑',reasons:[],individual:ind([['Draft Sharks Team',72],['Dalton Del Don',64],['Pat Fitzmaurice',58],['Nick Mariano',56],['Justin Boone',49]]),researchResidual:{active:true,components:[{kind:'role_environment',dir:1,strength:.8,confidence:.9}]}}
];
const assert=(v,m)=>{if(!v)throw Error(m)};
assert(p.signal(rows[0],0)!=='JETZT'&&p.signal(rows[0],0)!=='EHER JETZT','redundant timing visible');
assert(p.signal(rows[3],3)==='VALUE'||p.signal(rows[3],3)==='WAIT','Parker actionable marker missing');
assert(p.headerArrow(rows[3]).includes('↑↑')&&p.headerArrow(rows[3]).includes('WR2 mit WR1-Upside'),'Parker header');
assert(!p.plus(rows[0],0).includes('Positions-Alternativen'),'technical generic reason displaced evidence');
assert(p.plus(rows[0],0)!==p.plus(rows[1],1),'available differentiating evidence not reflected');
const ex=p.ex(rows[2]);assert(ex==='DS #4 · Del Don #3 · Pat #4 · Mariano #3 · Boone #4','expert render/order/ranks: '+ex);
const injury={...rows[1],injury:'Q',arrows:''};assert(!p.headerArrow(injury),'injury manufactured arrow');
console.log(JSON.stringify(rows.map((x,i)=>({name:x.name,signal:p.signal(x,i),plus:p.plus(x,i),minus:p.minus(x),keyword:p.keyword(x,i),header:p.headerArrow(x),experts:p.ex(x)})),null,2));
console.log('LIVE_PRESENTATION_BEHAVIOR_PASS');