import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=fs.readFileSync('manifest.webmanifest','utf8');

function must(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}

must(app.includes("const APP_VERSION='v11.8.0-rc4.158'"),'app version');
must(html.includes('v11.8.0-rc4.158'),'index version');
must(sw.includes('v11.8.0-rc4.158'),'sw version');
must(manifest.includes('v11.8.0-rc4.158'),'manifest version');
must(html.includes('id="expertDeltaBtn"'),'delta button present');
must(app.includes("'expertDeltaBtn'"),'delta button wired into ids');
must(app.includes('async function loadExpertRanks(expertId,{force=false}={})'),'force-capable expert load');
must(app.includes('if(!force&&cache&&cache.schemaVersion>=13'),'normal 12h cache preserved unless forced');
must(app.includes('async function checkExpertDeltas()'),'delta function present');
must(app.includes('const beforeSig=rankingSignature(before,500)'),'full-ish baseline signature');
must(app.includes('const freshSig=rankingSignature(fresh,500)'),'fresh signature');
must(app.includes('if(beforeSig&&freshSig===beforeSig){'),'unchanged branch');
must(app.includes('restoreExpertBaseline(id,before);\n        unchanged.push(entry.name);'),'unchanged list restores exact baseline');
must(app.includes('if(!usable){\n        restoreExpertBaseline(id,before);'),'failed/incomplete refresh restores baseline');
must(app.includes('if(baselineMode||changed.length){\n      await loadAllRanks();'),'panel recompute only baseline creation or real changes');
must(app.includes("store.set('v7_expertDeltaAudit'"),'delta audit persisted');
must(app.includes("timeZone:'Europe/Berlin'"),'draft-day baseline date uses league timezone');
must(!app.includes("v11.8.0-rc4.157"),'no stale app version');
must(!html.includes("v11.8.0-rc4.157"),'no stale index version');
must(!sw.includes("v11.8.0-rc4.157"),'no stale sw version');

console.log('PASS rc4.158 expert delta refresh contract');
