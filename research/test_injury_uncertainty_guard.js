'use strict';
const assert=require('assert');
const {STATES,relevantHealthyWindow,forceVisibleDecisionBoard,recommendationAction,displayHealthy}=require('./injury_uncertainty_guard');
const row=(key,panel,normal=true)=>({playerKey:key,panelRank:panel,normalAdmissible:normal});
const jeanty={state:STATES.MATERIAL_UNCERTAINTY,healthyPanelRank:9,healthyPanelAsOf:'2026-08-22',blockRecommendation:true};

// A: Jeanty-like uncertainty remains visible but cannot become automatic TAKE.
{
 const rows=[row('cook',7,true),row('lamb',14,true),row('jeanty',18.6,false),...Array.from({length:10},(_,i)=>row('f'+i,20+i,false))];
 const out=forceVisibleDecisionBoard(rows,{currentPick:9,normalQualityBoundary:16,records:{jeanty}});
 assert(out.board.some(x=>x.playerKey==='jeanty'));
 assert.equal(recommendationAction(rows[2],jeanty,'EHER JETZT'),'HOLD');
 assert.equal(displayHealthy(jeanty),9);
}
// B: severe injury does not force visibility.
assert.equal(relevantHealthyWindow({state:STATES.KNOWN_SEVERE,healthyPanelRank:5},{currentPick:9,normalQualityBoundary:16}),false);
// C: minor injury does not force healthy-value visibility.
assert.equal(relevantHealthyWindow({state:STATES.KNOWN_MINOR,healthyPanelRank:5},{currentPick:9,normalQualityBoundary:16}),false);
// D: no event => no special visibility.
assert.equal(relevantHealthyWindow(null,{currentPick:9,normalQualityBoundary:16}),false);
// E: ten normal candidates cannot be evicted; uncertainty becomes explicit overflow risk faller.
{
 const normals=Array.from({length:10},(_,i)=>row('n'+i,i+1,true));
 const out=forceVisibleDecisionBoard([...normals,row('jeanty',18.6,false)],{currentPick:9,normalQualityBoundary:16,records:{jeanty}});
 assert.equal(out.board.length,10);assert(!out.board.some(x=>x.playerKey==='jeanty'));assert(out.riskFallers.some(x=>x.playerKey==='jeanty'));
}
// F: no healthy provenance => no invented Healthy number / no force.
{
 const rec={state:STATES.MATERIAL_UNCERTAINTY,blockRecommendation:true};
 assert.equal(displayHealthy(rec),null);assert.equal(relevantHealthyWindow(rec,{currentPick:9,normalQualityBoundary:16}),false);
}
// G: kernel changes visibility/action only; it contains no score/penalty mutation API.
assert.equal(Object.prototype.hasOwnProperty.call(require('./injury_uncertainty_guard'),'scorePenalty'),false);
console.log('injury uncertainty guard A-G PASS');
