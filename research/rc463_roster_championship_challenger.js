'use strict';

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function slideFade(slide,start,end){return clamp((slide-start)/(end-start),0,1);}

// Research-only challenger. This does not replace Panel/Coach/Return-v2.
// It tests a final decision-priority layer that converts player value into
// marginal roster/championship value while preserving exceptional falls.
function decisionPriority(candidate,state){
  const current=Number(state.current||0);
  const counts=state.counts||{};
  const pos=String(candidate.pos||'');
  const panelRank=Number(candidate.panelRank);
  const slide=Number.isFinite(panelRank)?current-panelRank:0;
  let score=Number(candidate.coachScore||0);
  const p=Number(candidate.returnProb);

  // Timing is used as opportunity cost, not as a hard TAKE/WAIT sorter.
  if(Number.isFinite(p)) score += 12*(1-clamp(p,0,1));

  // Filled single-starter positions: strong hurdle, never a hard ban.
  if(pos==='QB' && Number(counts.QB||0)>=1)
    score -= 35*(1-slideFade(slide,20,45));
  if(pos==='TE' && Number(counts.TE||0)>=1)
    score -= 28*(1-slideFade(slide,20,45));

  // Ordinary WR7+ depth is less valuable; exceptional falls remain legal.
  if(pos==='WR' && Number(counts.WR||0)>=6)
    score -= 32*(1-slideFade(slide,25,45));

  // Late bench: favor contingent RB ceiling while the RB room is not saturated.
  if(pos==='RB' && current>=100 && Number(counts.RB||0)<6)
    score += 8*Math.max(0,(6-Number(counts.RB||0))/3);

  // Do not turn late-RB preference into blind RB7+ accumulation.
  if(pos==='RB' && Number(counts.RB||0)>=6)
    score -= 10*(Number(counts.RB||0)-5)*(1-slideFade(slide,25,45));

  return score;
}

const fixtures=[
  {label:'69: Kraft over high-return Parker Washington',state:{current:69,counts:{RB:2,WR:4,QB:0,TE:0}},candidates:[
    {name:'Parker Washington',pos:'WR',coachScore:100,panelRank:56.09,returnProb:.7567},
    {name:'Tucker Kraft',pos:'TE',coachScore:97,panelRank:63.10,returnProb:.4589}],expected:'Tucker Kraft'},
  {label:'89: QB1 remains legal',state:{current:89,counts:{RB:2,WR:5,QB:0,TE:1}},candidates:[
    {name:'Justin Herbert',pos:'QB',coachScore:100,panelRank:75,returnProb:.5256},
    {name:'Trevor Lawrence',pos:'QB',coachScore:77,panelRank:76.25,returnProb:.9389},
    {name:'Blake Corum',pos:'RB',coachScore:56,panelRank:89.67,returnProb:.9244}],expected:'Justin Herbert'},
  {label:'92: QB2 reality after Herbert',state:{current:92,counts:{RB:2,WR:5,QB:1,TE:1}},candidates:[
    {name:'Trevor Lawrence',pos:'QB',coachScore:100,panelRank:76.25,returnProb:.3711},
    {name:'Blake Corum',pos:'RB',coachScore:99,panelRank:89.67,returnProb:.0478},
    {name:'Jacory Croskey-Merritt',pos:'RB',coachScore:74,panelRank:92.78,returnProb:.1889}],expected:'Blake Corum'},
  {label:'112: deep-WR marginal utility',state:{current:112,counts:{RB:3,WR:6,QB:1,TE:1}},candidates:[
    {name:'Stefon Diggs',pos:'WR',coachScore:100,panelRank:83.15,returnProb:.0156},
    {name:'Rachaad White',pos:'RB',coachScore:68,panelRank:103.17,returnProb:.1322},
    {name:'Chris Rodriguez',pos:'RB',coachScore:0,panelRank:128.8,returnProb:.6722}],expected:'Rachaad White'},
  {label:'129: timing + roster state',state:{current:129,counts:{RB:4,WR:6,QB:1,TE:1}},candidates:[
    {name:'Jalen Coker',pos:'WR',coachScore:100,panelRank:111.7,returnProb:.9622},
    {name:'Jonah Coleman',pos:'RB',coachScore:99,panelRank:127.67,returnProb:.97},
    {name:'Mike Washington',pos:'RB',coachScore:89,panelRank:127.94,returnProb:.9911}],expected:'Jonah Coleman'},
  {label:'149: no blind RB accumulation',state:{current:149,counts:{RB:6,WR:6,QB:1,TE:1}},candidates:[
    {name:'Jalen Coker',pos:'WR',coachScore:100,panelRank:111.7,returnProb:null},
    {name:'Mike Washington',pos:'RB',coachScore:91,panelRank:127.94,returnProb:null}],expected:'Jalen Coker'},
  {label:'synthetic TE2 hurdle',state:{current:100,counts:{RB:3,WR:5,QB:1,TE:1}},candidates:[
    {name:'Ordinary TE2',pos:'TE',coachScore:100,panelRank:86,returnProb:.25},
    {name:'Comparable RB',pos:'RB',coachScore:90,panelRank:96,returnProb:.25}],expected:'Comparable RB'},
  {label:'synthetic exceptional QB fall stays legal',state:{current:110,counts:{RB:4,WR:5,QB:1,TE:1}},candidates:[
    {name:'Exceptional QB Fall',pos:'QB',coachScore:100,panelRank:55,returnProb:.05},
    {name:'Ordinary RB',pos:'RB',coachScore:78,panelRank:105,returnProb:.05}],expected:'Exceptional QB Fall'}
];

let failed=0;
for(const t of fixtures){
  const ranked=t.candidates.map(c=>({...c,priority:decisionPriority(c,t.state)})).sort((a,b)=>b.priority-a.priority);
  const ok=ranked[0].name===t.expected;
  console.log(`${ok?'PASS':'FAIL'} | ${t.label} | top=${ranked[0].name} | ${ranked.map(x=>`${x.name}:${x.priority.toFixed(2)}`).join(' ; ')}`);
  if(!ok)failed++;
}
if(failed)process.exit(1);
console.log(`PASS | ${fixtures.length}/${fixtures.length} roster/championship challenger cases`);

module.exports={decisionPriority};
