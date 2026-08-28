import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const must=(ok,msg)=>{if(!ok){console.error('RC498_EVIDENCE_POLARITY_FAIL:',msg);process.exitCode=1;}};

// Runtime-version parity for this challenger.
const activeVersion=Number((app.match(/const APP_VERSION='v11\\.8\\.0-rc4\\.(\\d+)'/)||[])[1]);
must(Number.isFinite(activeVersion)&&activeVersion>=98,'app version below rc4.98 polarity contract');

// Sign-aware presentation contract. Neutral evidence may remain displayable as context, but never as a plus.
must(live.includes("Number(c.dir??0)>=0"),'displayEvidence must retain neutral evidence for neutral/context surfaces');
must(live.includes("Number(re.dir??0)>0?researchText(x):null"),'plus path is not sign-aware');
must(live.includes("positiveDisplayEvidence"),'positive display-evidence selector missing');
must(live.includes("Number(c.dir??0)!==0"),'signed research selector must outrank neutral display context');
must(live.includes("c?.displayRisk===true&&Number(c.dir??0)<=0"),'risk display must reject positive polarity');
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
for(const name of ['Christian McCaffrey','A.J. Brown']){
  const p=app.indexOf(`[norm('${name}')]`);
  must(p>=0,`${name} prior missing`);
  const chunk=app.slice(p,p+1800);
  must(/kind:'decline_(tail|risk)',dir:-1/.test(chunk),`${name} negative decline prior missing`);
}
console.log(`RC498_EVIDENCE_POLARITY_PASS components=${components.length}`);
