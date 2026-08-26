import fs from 'node:fs';
import zlib from 'node:zlib';
const app=fs.readFileSync('app.js','utf8');
const data=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync('research/expert-v2-exact-return-input-v2.json.gz.b64','utf8').replace(/\s+/g,''),'base64')).toString('utf8'));
function sliceFn(name,nextNames=[]){
  const s=app.indexOf(`function ${name}(`); if(s<0) throw Error(`missing ${name}`);
  let e=app.length; for(const n of nextNames){const x=app.indexOf(`function ${n}(`,s+1); if(x>s&&x<e)e=x;}
  return app.slice(s,e);
}
console.log('POOL_KEYS',JSON.stringify(Object.keys(data.pool[Object.keys(data.pool)[0]]||{})));
console.log('FIXTURE_KEYS',JSON.stringify(Object.keys(data.fixtures[0]||{})));
for(const n of ['scoreCandidate','playerQualityBaseScore','applyResolvedReturnScore','applyPlayerQualitySafetyGate','normalizeCoachScores','lossIfGone','actionLabel']){
  const s=app.indexOf(`function ${n}(`); if(s<0){console.log(`FN_${n}=MISSING`);continue;}
  const e=app.indexOf('\nfunction ',s+10);
  console.log(`FN_${n}_BEGIN`); console.log(app.slice(s,e>0?e:s+12000)); console.log(`FN_${n}_END`);
}
