import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const must=(ok,msg)=>{if(!ok){console.error('RC498_EVIDENCE_POLARITY_FAIL:',msg);process.exitCode=1;}};

// Runtime-version parity for this challenger.
must(app.includes("const APP_VERSION='v11.8.0-rc4.98';"),'app version != rc4.98');

// Sign-aware presentation contract.
must(live.includes("Number(c.dir??0)>=0"),'displayEvidence does not exclude negative research from plus path');
must(live.includes("re&&Number(re.dir??0)>=0?researchText(x):null"),'plus path is not sign-aware');
must(live.includes("re&&Number(re.dir??0)<0"),'minus path does not route negative research by sign');
must(!live.includes("rr&&!/Regression/.test(rr)"),'old lexical polarity heuristic remains');
must(!live.includes("rr&&/Regression/.test(rr)"),'old lexical negative heuristic remains');

// Scan structured priors for impossible explicit display polarity.
const components=[];
let i=0;
while((i=app.indexOf('{kind:',i))>=0){
  const e=app.indexOf('}',i); if(e<0)break;
  const obj=app.slice(i,e+1);
  if(/dir:-?\d/.test(obj)&&/causal:/.test(obj)){
    const start=app.lastIndexOf('[norm(',i);
    const name=(app.slice(start,start+220).match(/\[norm\((['"])(.*?)\1\)\]/)||[])[2]||'?';
    components.push({
      name,
      kind:(obj.match(/kind:'([^']+)'/)||[])[1]||'?',
      dir:Number((obj.match(/dir:(-?\d+)/)||[])[1]),
      display:/display:true/.test(obj),
      displayRisk:/displayRisk:true/.test(obj),
      causal:(obj.match(/causal:'([^']*)'/)||[])[1]||''
    });
  }
  i=e+1;
}
for(const c of components){
  must(!(c.display&&c.dir<0),`${c.name} ${c.kind}: negative component marked display:true`);
  must(!(c.displayRisk&&c.dir>0),`${c.name} ${c.kind}: positive component marked displayRisk:true`);
  must(!(c.display&&c.displayRisk),`${c.name} ${c.kind}: same component marked both plus and risk`);
}

// Exact regressions that triggered this audit.
// CMC must retain both substantive upside and decline/camp risk; never fall back to generic market text.
{
  const p=app.indexOf(`[norm('Christian McCaffrey')]`); const chunk=app.slice(p,p+2200);
  must(p>=0,'Christian McCaffrey prior missing');
  must(/kind:'elite_dual_threat_role',dir:0[^}]*display:true/.test(chunk),'CMC substantive positive display evidence missing');
  must(/kind:'decline_tail',dir:-1/.test(chunk),'CMC negative decline prior missing');
  must(/kind:'current_camp_context',dir:0[^}]*displayRisk:true/.test(chunk),'CMC current camp risk display missing');
}
for(const name of ['A.J. Brown']){
  const p=app.indexOf(`[norm('${name}')]`);
  must(p>=0,`${name} prior missing`);
  const chunk=app.slice(p,p+1800);
  must(/kind:'decline_(tail|risk)',dir:-1/.test(chunk),`${name} negative decline prior missing`);
}
console.log(`RC498_EVIDENCE_POLARITY_PASS components=${components.length}`);
