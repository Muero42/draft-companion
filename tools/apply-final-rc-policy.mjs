import fs from 'node:fs';

let app=fs.readFileSync('app.js','utf8');
function replaceOnce(from,to,label){const i=app.indexOf(from);if(i<0)throw new Error(`missing final-RC anchor: ${label}`);if(app.indexOf(from,i+from.length)>=0)throw new Error(`ambiguous final-RC anchor: ${label}`);app=app.slice(0,i)+to+app.slice(i+from.length);console.log(`final-RC anchor OK: ${label}`)}

// User-hard QB exclusions are stable league preferences, not model estimates.
replaceOnce(
  "const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\b(jr|sr|ii|iii|iv)\\b\\.?/g,'').replace(/[^a-z0-9]/g,'');",
  "const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\b(jr|sr|ii|iii|iv)\\b\\.?/g,'').replace(/[^a-z0-9]/g,'');\nconst USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers']);\n// Acute status is a fail-closed recommendation guard, not a fabricated numeric injury model.\n// Update/remove the entry after an event-driven practice/status refresh.\nconst DRAFT_ACUTE_STATUS_2026={ashtonjeanty:{label:'AKUTER STATUS: Sprunggelenkverletzung · Teilnahme/Belastbarkeit vor Draft prüfen',blockRecommendation:true,asOf:'2026-08-24'}};",
  'hard QB exclusions and acute-status registry'
);

replaceOnce(
  "  if(!r)return{score:-999,r:null,a,reasons:['Panel-Rang fehlt']};",
  "  if(!r)return{score:-999,r:null,a,reasons:['Panel-Rang fehlt']};\n  if(p.pos==='QB'&&USER_HARD_QB_EXCLUSIONS.has(norm(p.name)))return{score:-999,rawScore:-999,r,a,reasons:['USER HARD EXCLUSION'],hardExcluded:true};\n  const acuteStatus=DRAFT_ACUTE_STATUS_2026[norm(p.name)];\n  if(acuteStatus?.blockRecommendation)return{score:-998,rawScore:-998,r,a,reasons:[acuteStatus.label],acuteStatus,recommendationBlocked:true};",
  'fail-closed hard exclusion / acute status in candidate scoring'
);

// The prior rc4.52 runtime permanently suppressed QB2/TE2. Metadata-safe mechanism
// audits showed that early/mid duplicates are generally poor but very late QB2 (and
// exceptional TE2) can carry real option/startability value. Use broad draft phases,
// deliberately not a seed-fitted pick cutoff.
replaceOnce(
  "  const qbNeed=c.QB===0?(current>=125?13:current>=95?9:current>=65?4:1):-24;\n  const teNeed=c.TE===0?(current>=130?1.5:current>=80?1:0.5):-22;",
  "  const qbNeed=c.QB===0?(current>=125?13:current>=95?9:current>=65?4:1):(current>=141?-2:current>=121?-10:-24);\n  const teNeed=c.TE===0?(current>=130?1.5:current>=80?1:0.5):(current>=141?-4:current>=121?-12:-22);",
  'phase-sensitive duplicate need'
);

replaceOnce(
  "    const elite=rank<=45&&Number.isFinite(adp)&&current-adp>=35;\n    return elite?-8:-42;",
  "    const elite=rank<=45&&Number.isFinite(adp)&&current-adp>=35;\n    if(current>=141)return elite?0:-8;\n    if(current>=121)return elite?-4:-24;\n    return elite?-8:-42;",
  'phase-sensitive QB2 exception'
);
replaceOnce(
  "    const elite=rank<=35&&Number.isFinite(adp)&&current-adp>=30;\n    return elite?-7:-38;",
  "    const elite=rank<=35&&Number.isFinite(adp)&&current-adp>=30;\n    if(current>=141)return elite?0:-10;\n    if(current>=121)return elite?-5:-26;\n    return elite?-7:-38;",
  'phase-sensitive TE2 exception'
);

// Version is intentionally distinct from the prepared rc4.52 baseline and rc4.59 research line.
for(const f of ['app.js','index.html','manifest.webmanifest','sw.js','_worker.js','README.md']){
  if(!fs.existsSync(f))throw new Error(`required runtime file missing: ${f}`);
  let s=fs.readFileSync(f,'utf8');
  s=s.replaceAll('rc4.52','rc4.60');
  fs.writeFileSync(f,s);
}

fs.writeFileSync('app.js',app);
console.log('rc4.60 final RC policy applied');
