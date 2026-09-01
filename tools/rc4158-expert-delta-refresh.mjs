import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=fs.readFileSync('manifest.webmanifest','utf8');

function must(cond,msg){if(!cond){console.error('FAIL:',msg);process.exit(1)}}

const versionOf=s=>Number((String(s).match(/v11\\.8\\.0-rc4\\.(\\d+)/)||[])[1]);
must(versionOf(app)>=158,'app version >= rc4.158');
must(versionOf(html)>=158,'index version >= rc4.158');
must(versionOf(sw)>=158,'sw version >= rc4.158');
must(versionOf(manifest)>=158,'manifest version >= rc4.158');
must(html.includes('id="expertDeltaBtn"'),'delta button present');
must(app.includes("'expertDeltaBtn'"),'delta button wired into ids');
must(app.includes('async function loadExpertRanks(expertId,{force=false}={})'),'force-capable expert load');
must(app.includes('if(!force&&cache&&cache.schemaVersion>=13'),'normal 12h cache preserved unless forced');
must(app.includes('async function checkExpertDeltas()'),'delta function present');
must(app.includes('const id=String(entry.expert.id),before=rankCache[id]||null,beforeSig=expertDeltaSignature(before);'),'full baseline signature');
must(app.includes('const freshSig=expertDeltaSignature(fresh);'),'fresh signature');
must(app.includes('if(beforeSig&&freshSig===beforeSig){'),'unchanged branch');
must(app.includes('restoreExpertBaseline(id,before);\n        unchanged.push(entry.name);'),'unchanged list restores exact baseline');
must(app.includes('if(!usable){\n        restoreExpertBaseline(id,before);'),'failed/incomplete refresh restores baseline');
must(app.includes('if(baselineMode||repairMode||changed.length){\n      await loadAllRanks({skipFetch:true});'),'cache-only panel rebuild');
must(app.includes("store.set('v7_expertDeltaAudit'"),'delta audit persisted');
must(app.includes('async function loadAllRanks({skipFetch=false}={})'),'loadAllRanks cache-only mode');
must(app.includes("const c=skipFetch?rankCache[id]:await loadExpertRanks(id);"),'cache-only rebuild avoids refetch');
must(app.includes("repairMode&&!retryNames.has(entry.name)"),'baseline repair retries only failed experts');
must(app.includes('function expertDeltaSignature(cache)'),'delta signature includes full cache');
must(app.includes("timeZone:'Europe/Berlin'"),'draft-day baseline date uses league timezone');
must(!app.includes("v11.8.0-rc4.157"),'no stale app version');
must(!html.includes("v11.8.0-rc4.157"),'no stale index version');
must(!sw.includes("v11.8.0-rc4.157"),'no stale sw version');

console.log('PASS rc4.158 expert delta refresh contract');
