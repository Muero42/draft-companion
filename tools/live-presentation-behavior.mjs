import fs from 'node:fs';import vm from 'node:vm';
const src=fs.readFileSync('live-surface-v3.js','utf8');
const store={v7_positionPanels:JSON.stringify({QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'})};
const el=()=>({textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},querySelector(){return null},getBoundingClientRect(){return {top:0,bottom:1}},setAttribute(){},scrollIntoView(){}});
const ctx={window:{PITTI_LIVE_DECISION_STATE:()=>null},document:{getElementById:()=>el(),querySelector:()=>null,createElement:()=>el(),addEventListener(){},hidden:false,readyState:'complete',body:{appendChild(){},classList:{toggle(){},add(){},remove(){}}}},localStorage:{getItem:k=>store[k]??null},navigator:{clipboard:{writeText:async()=>{}}},setInterval:()=>0,clearInterval(){},MutationObserver:class{observe(){} disconnect(){}},addEventListener(){},innerHeight:800,console};
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

// Additional scenario coverage: same evidence may legitimately yield same prose; roster/market signals remain orthogonal.
const mid=[
 {...rows[0],name:'Generic RB A',ret:.55,adp:25,panel:24,loss:'mittel',arrows:'',researchResidual:null,reasons:['Positions-Alternativen 4 nah']},
 {...rows[0],name:'Generic RB B',ret:.88,adp:40,panel:39,loss:'niedrig',arrows:'',researchResidual:null,reasons:['Positions-Alternativen 4 nah']},
 {...rows[2],name:'Generic WR C',ret:.45,adp:60,panel:54,loss:'mittel',arrows:'',researchResidual:null,reasons:['WR-Sättigung: 7 WR']},
];
assert(p.signal(mid[1],1)==='WAIT','high-return WAIT exception missing');
assert(p.keyword(mid[2],2).includes('VALUE')&&p.keyword(mid[2],2).includes('ROSTER-SÄTTIGUNG'),'value/roster orthogonal markers missing');
assert(p.minus(mid[2]).includes('WR-Sättigung'),'roster saturation not surfaced as downside');
assert(p.plus(mid[0],0)===p.plus({...mid[0],name:'Generic RB D'},0),'similar evidence was artificially differentiated');


// Evidence-kind coverage: every arrow-eligible structured kind must map to a specific user-facing rationale.
const kinds=[
 ['ascension','↑','Breakout-Upside'],['upside','↑','Breakout-Upside'],['ceiling','↑','Elite-Ceiling'],
 ['talent','↑','Talent-Upside'],['efficiency','↑','Effizienz-Upside'],['role_environment','↑','Rollen-Upside'],
 ['elite_rookie_role','↑','Rookie-Rollen-Upside'],['elite_role','↑','Rollen-Upside'],
 ['decline_tail','↓','Regressionsrisiko'],['decline_risk','↓','Regressionsrisiko'],['regression','↓','Regressionsrisiko']
];
for(const [kind,arrow,want] of kinds){const x={...rows[0],name:'Fixture '+kind,arrows:arrow,researchResidual:{active:true,components:[{kind,dir:arrow==='↑'?1:-1,strength:.7,confidence:.9}]}};assert(p.arrowWhy(x)===want,'kind rationale '+kind+': '+p.arrowWhy(x));}


// Draft-phase/roster-state matrix. Presentation must remain stable under early/mid/late labels and saturated rosters.
const phases=[
 {phase:'early',pick:9,row:{...rows[2],ret:.18,adp:4,panel:4}},
 {phase:'mid',pick:69,row:{...rows[3],ret:.82}},
 {phase:'late',pick:129,row:{...mid[2],ret:.44,reasons:['WR-Sättigung: 7 WR']}},
 {phase:'late-rb-saturated',pick:132,row:{...mid[0],pos:'RB',role:'RB5',reasons:['Positions-Alternativen 3 nah']}}
];
for(const z of phases){const x=z.row;assert(typeof p.plus(x,0)==='string'&&p.plus(x,0).length>2,'plus '+z.phase);assert(typeof p.minus(x)==='string'&&p.minus(x).length>2,'minus '+z.phase);assert(typeof p.keyword(x,0)==='string','keyword '+z.phase);if(z.phase==='mid')assert(p.signal(x,0)==='WAIT','mid WAIT');if(z.phase==='late')assert(p.minus(x).includes('WR-Sättigung'),'late saturation');}


// rc4.77 specific-decision evidence: top candidates must expose real differentiators where structured evidence exists.
const specific=[
 {name:'Jahmyr Gibbs',pos:'RB',role:'RB1',panel:1.1,adp:1.3,ret:0,loss:'hoch',arrows:'',reasons:['Positions-Alternativen 4 nah'],individual:rows[0].individual,researchResidual:{displayActive:true,components:[{display:true,kind:'consistency',dir:0,confidence:.95,causal:'Einziger RB mit mindestens 21 PPR-Punkten/Spiel in beiden letzten Saisons; dazu 500+ Receiving-Yards im Zweijahresfenster'}]}},
 {name:'Bijan Robinson',pos:'RB',role:'RB1',panel:1.9,adp:2.8,ret:0,loss:'hoch',arrows:'',reasons:['Positions-Alternativen 4 nah'],individual:rows[1].individual,researchResidual:{displayActive:true,components:[{display:true,kind:'dual_threat_elite',dir:0,confidence:.95,causal:'Elite Dual-Threat-Profil: 2025 Top-3 bei Target Share, YPRR, Missed Tackles und Yards after Contact; zusätzlicher Goal-Line-Pfad 2026'}]}},
 {name:'Jonathan Taylor',pos:'RB',role:'RB1',panel:7.5,adp:6.6,ret:.07,loss:'hoch',arrows:'',reasons:[],individual:rows[1].individual,researchResidual:{displayActive:true,components:[{display:true,kind:'workhorse_volume',dir:0,confidence:.95,causal:'Bewährtes Workhorse: 2025 #1 Snap Share, #2 Opportunity Share und #2 Red-Zone-Touches unter RBs'}]}},
 {name:'Amon-Ra St. Brown',pos:'WR',role:'WR1',panel:7.8,adp:7.9,ret:.31,loss:'mittel',arrows:'',reasons:[],individual:rows[2].individual,researchResidual:{displayActive:true,components:[{display:true,kind:'consistency',dir:0,confidence:.97,causal:'Elite-Konstanz: drei Jahre in Folge mindestens 1.250 Yards und 141 Targets; 172 Targets in 2025'}]}}
];
const renderedSpecific=specific.map((x,i)=>p.plus(x,i));
assert(new Set(renderedSpecific).size===specific.length,'specific evidence collapsed into generic repeated prose: '+renderedSpecific.join(' || '));
assert(renderedSpecific[2].includes('Workhorse'),'Taylor advantage missing');
assert(renderedSpecific[3].includes('Elite-Konstanz'),'Amon-Ra advantage missing');
assert(p.keyword(specific[2],5).includes('WORKHORSE'),'Taylor Top-10 trait missing');
assert(p.keyword(specific[3],7).includes('KONSTANZ'),'Amon-Ra Top-10 trait missing');
const chaseRisk={...rows[2],injury:'Questionable',researchResidual:{displayActive:true,components:[{displayRisk:true,confidence:.9,causal:'Aktuell Knie-Hyperextension; Chase bezeichnete sie als gering und wäre nach eigener Aussage spielbereit'}]}};
assert(p.minus(chaseRisk).includes('Knie-Hyperextension'),'specific risk context missing');
assert(!renderedSpecific.slice(0,2).every(x=>x.includes('Expertenkonsens Top-5')),'Gibbs/Bijan still generic consensus');
const neutralAge={...rows[0],name:'Neutral Age Fixture',arrows:'',researchResidual:{active:true,displayActive:true,components:[{display:true,kind:'age',dir:0,confidence:.95,causal:'Age 29'}]}};
assert(!p.plus(neutralAge,0).includes('Age 29'),'neutral age leaked into plus');
const fairRange={...rows[0],name:'Fair Range Fixture',panel:10,adp:10,reasons:['Fairer Bereich: ADP 10.0 vs Pick 10']};
assert(!p.plus(fairRange,0).includes('Fairer Bereich'),'fair-range context leaked into plus');
const mixedPolarity={...rows[0],name:'Mixed Polarity Fixture',arrows:'',researchResidual:{active:true,displayActive:true,components:[{display:true,kind:'age',dir:0,confidence:.99,causal:'Age 29'},{display:true,kind:'elite_role',dir:1,confidence:.90,causal:'Elite workload and receiving role'},{displayRisk:true,display:true,kind:'decline_risk',dir:-1,confidence:.92,causal:'Workload-driven decline risk'}]}};
assert(p.plus(mixedPolarity,0).includes('Elite workload'),'neutral evidence masked positive Pro');
assert(p.minus(mixedPolarity).includes('Workload-driven decline risk'),'negative risk masked by neutral evidence');
const badRiskPolarity={...rows[0],name:'Bad Risk Polarity Fixture',researchResidual:{active:true,components:[{displayRisk:true,kind:'upside',dir:1,confidence:.99,causal:'Positive upside must not render as risk'}]}};
assert(!p.minus(badRiskPolarity).includes('Positive upside must not render as risk'),'positive evidence leaked into Contra via displayRisk');

assert(src.includes('x.expertTier?.label'), 'rc4.136 tier label not wired into live surface');
const cardPos=src.indexOf('<h3>${i+1}. ${esc(x.name)}'), tierPos=src.indexOf('x.expertTier?.label',cardPos), arrowPos=src.indexOf('headerArrow(x)',cardPos);
assert(cardPos>=0&&tierPos>cardPos&&arrowPos>tierPos,'rc4.136 tier must render after player name and before research arrows');

assert(src.includes("const APP_VERSION='v11.8.0-rc4.138'"),'rc4.138 version missing');
const requiredDescriptionCoverage=["Tyler Warren","Emeka Egbuka","Tetairoa McMillan","Cam Skattebo","Jayden Daniels","TreVeyon Henderson","Jadarian Price","Jalen Hurts","Rhamondre Stevenson","Justin Herbert","Trevor Lawrence","Dak Prescott","Brock Purdy","Chuba Hubbard","Jaxson Dart","RJ Harvey","Patrick Mahomes","Bo Nix","Alec Pierce","Michael Wilson","KC Concepcion","Makai Lemon","Jonah Coleman","Dylan Sampson","Hunter Henry","Brian Robinson","Braelon Allen","Alvin Kamara","Tyrone Tracy","Emmett Johnson","Kaelon Black","Nicholas Singleton","Kaleb Johnson"];
for(const name of requiredDescriptionCoverage){
 const q1="[norm('"+name.replaceAll("'","\\'")+"')]";
 const q2='[norm("'+name.replaceAll('"','\\"')+'")]';
 assert(src.includes(q1)||src.includes(q2),'missing individual-description coverage: '+name);
}

console.log('LIVE_PRESENTATION_BEHAVIOR_PASS');