import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
const grab=name=>{
  const s=app.indexOf(`function ${name}`);assert.ok(s>=0,name+' missing');
  let i=app.indexOf('{',s),d=0;
  for(let j=i;j<app.length;j++){if(app[j]==='{')d++;else if(app[j]==='}'){d--;if(d===0)return app.slice(s,j+1)}}
  throw new Error(name+' parse');
};
const src=grab('verifiedIndividualEntries');
const factory=new Function('panels','rankCache',src+';return verifiedIndividualEntries');

{
  const fn=factory({'expert-v3-rb':{shadow:true}},{});
  const rows=[{expertName:'Draft Sharks Team',rank:9},{expertName:'Pat Fitzmaurice',rank:10}];
  assert.deepEqual(fn({panelId:'expert-v3-rb',individual:rows}),rows,'embedded rows must render without live rankCache flags');
}
{
  const fn=factory({live:{shadow:false}},{a:{verifiedIndividual:true},b:{verifiedIndividual:false},c:{verifiedIndividual:true,duplicateOf:'a'}});
  const rows=[{expertId:'a',expertName:'A',rank:1},{expertId:'b',expertName:'B',rank:2},{expertId:'c',expertName:'C',rank:3}];
  assert.deepEqual(fn({panelId:'live',individual:rows}).map(x=>x.expertName),['A'],'live rows must remain verified and deduplicated');
}
assert.ok(app.includes('verifiedIndividualEntries(x.r).map'),'snapshot Coach Top 8 must use panel-aware individual verification');
assert.ok(!app.includes('x.r.individual.filter(v=>rankCache[v.expertId]?.verifiedIndividual).map'),'stale live-cache-only snapshot filter resurrected');
console.log('RC4106_EMBEDDED_INDIVIDUALS_PASS');
