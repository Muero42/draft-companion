import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const idx=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const b2src=fs.readFileSync('expert-v2-board.js','utf8');
const b3src=fs.readFileSync('expert-v3-board.js','utf8');

for(const [n,s] of [['app',app],['index',idx],['sw',sw]])assert.match(s,/v11\.8\.0-rc4\.(?:90|9[1-9]|[1-9][0-9]{2,})/,n+' rc4.90+ version mismatch');

// Root-cause guard: Expert-v3 shadow panels must be selectable just like frozen v2 boards.
assert.ok(app.includes("if(/^expert-v[2345]-(qb|rb|wr|te)$/.test(id))return true;"),'Expert-v3/v4/v5 panel selectability missing');
assert.ok(app.includes("profile:currentExpertProfile()"),'live state must expose actual profile');
assert.ok(app.includes("const panelId=x.r.panelId||null")&&app.includes("panelId,panelName:x.r.panel||null"),'live state must expose actual panel id');
assert.ok(live.includes("const actual=[...new Set((x.individual||[]).map(r=>r.expertName||r.source).filter(Boolean))]"),'live expert display must derive from actual rows');
assert.ok(!live.includes("members=p==='expertv3'"),'live expert display must not re-infer membership from profile');

const b2=JSON.parse(b2src.match(/window\.PITTI_EXPERT_V2=([\s\S]+);\s*$/)[1]);
const sandbox={window:{}};new Function('window',b3src)(sandbox.window);const b3=sandbox.window.PITTI_EXPERT_V3;
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');

function v3Experts(pos,name){
  const row=b2.rows[pos].find(x=>norm(x.name)===norm(name));assert.ok(row,name+' missing base row');
  const spec=b3.challengers[pos], weights=b3.weights[pos], cm=new Map(spec.ranks.map(([n,r])=>[norm(n),Number(r)]));
  const cr=cm.get(norm(name));assert.ok(Number.isFinite(cr),name+' missing challenger rank');
  const vals=[];
  for(const e of row.individual){
    let ew=Number(e.effectiveWeight)||0;
    const old=Number(b2.weights[pos][e.expertName]),nw=Number(weights[e.expertName]);
    if(Number.isFinite(old)&&old>0&&Number.isFinite(nw)&&nw>=0)ew*=nw/old;
    if(ew>0)vals.push(e.expertName);
  }
  if(Number(weights[spec.name])>0)vals.push(spec.name);
  return vals;
}
assert.deepEqual(new Set(v3Experts('RB','James Cook')),new Set(['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Ryan Weisse']));
assert.deepEqual(new Set(v3Experts('TE','Brock Bowers')),new Set(['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Justin Boone','Wolf of Roto Street']));
assert.ok(v3Experts('QB','Josh Allen').includes('Todd D Clark'));

// Current early-round visible candidates must have substantive display evidence, not generic filler.
for(const name of ['James Cook','CeeDee Lamb','Justin Jefferson','Saquon Barkley','Brock Bowers','Chase Brown',"De'Von Achane",'Kenneth Walker III','Omarion Hampton','Drake London','Nico Collins','George Pickens','Chris Olave','Kyren Williams','Trey McBride','Ashton Jeanty','Javonte Williams','Josh Allen','Tee Higgins','Rashee Rice','Garrett Wilson','Jaylen Waddle','Breece Hall','Ladd McConkey']){
  const start=app.indexOf("[norm('"+name+"')]")>=0?app.indexOf("[norm('"+name+"')]"):app.indexOf('[norm("'+name+'")]');
  assert.ok(start>=0,name+' research prior missing');
  const slice=app.slice(start,start+2200);
  assert.ok(slice.includes('display:true'),name+' substantive positive/display evidence missing');
}
for(const phrase of ['Opportunity Cost gegenüber den direkten Alternativen','mit konkurrenzfähiger Panel-Bewertung'])assert.ok(!live.includes(phrase),'generic fallback resurrected: '+phrase);
assert.ok(live.includes("s.rows.slice(0,10).map(card).join('')"),'ten full cards missing');
assert.ok(live.includes('live-cut-warning'),'orange cut warning hook missing');

console.log('RC490_PANEL_SELECTION_AND_EARLY_INFO_PASS');