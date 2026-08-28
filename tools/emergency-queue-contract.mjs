import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const grab=name=>{
  const s=app.indexOf(`function ${name}`);assert.ok(s>=0,name+' missing');
  let i=app.indexOf('{',s),d=0;
  for(let j=i;j<app.length;j++){if(app[j]==='{')d++;else if(app[j]==='}'){d--;if(d===0)return app.slice(s,j+1)}}
  throw new Error(name+' parse');
};
const src=grab('buildEmergencyQueueText');
const appVersion=(app.match(/const APP_VERSION='([^']+)'/)||[])[1];
assert.ok(appVersion,'APP_VERSION missing');
const fn=new Function('APP_VERSION',src+';return buildEmergencyQueueText')(appVersion);
const row=(name,pos,score=100,injury=null)=>({p:{name,pos,team:'TST',injury},score});
const base=[
 row('QB A','QB'),row('QB B','QB'),row('TE A','TE'),row('TE B','TE'),
 ...Array.from({length:40},(_,i)=>row('RB '+(i+1),'RB',90-i))
];
let txt=fn(base,{counts:{QB:0,TE:0}},99,'draft-x');
let lines=txt.split('\n').filter(x=>/^\d+\./.test(x));
assert.equal(lines.length,35,'queue cap');
assert.equal(lines.filter(x=>x.includes('— QB,')).length,1,'only one QB while QB1 open');
assert.equal(lines.filter(x=>x.includes('— TE,')).length,1,'only one TE while TE1 open');
assert.ok(!txt.includes('QB B'),'QB2 leaked');
assert.ok(!txt.includes('TE B'),'TE2 leaked');

txt=fn(base,{counts:{QB:1,TE:1}},120,'draft-y');
lines=txt.split('\n').filter(x=>/^\d+\./.test(x));
assert.equal(lines.filter(x=>x.includes('— QB,')).length,0,'QB leaked after QB1');
assert.equal(lines.filter(x=>x.includes('— TE,')).length,0,'TE leaked after TE1');
assert.ok(txt.includes('App-Version:'),'version metadata missing');
assert.ok(txt.includes('Draft-ID: draft-y'),'draft identity missing');
assert.ok(txt.includes('K/DST ausgeschlossen'),'fallback rule missing');
console.log('EMERGENCY_QUEUE_CONTRACT_PASS');
