import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const tests=new Map();
for(const f of ['release-contract-v2.yml','release-contract-v2-package.yml','pitti-project-guardrails.yml'])for(const m of fs.readFileSync('.github/workflows/'+f,'utf8').matchAll(/node (tools\/[\w.-]+\.mjs|Draft_Companion_[\w.-]+\.js)/g))if(!/rc4115|rc4122|rc497-microfix|strict-suite|audit-v45-backup/.test(m[1]))tests.set(m[1],[m[1]]);
for(const f of fs.readdirSync('tools'))if(/^(season-.*(?:regression|contract|gate|e2e)|week1-.*regression|live-(league-state|trade-manager-faab)-regression|postmerge-authority-(contract|regression)|permission-contract-regression|takeover-authority-regression)\.mjs$/.test(f))tests.set('tools/'+f,['tools/'+f]);
for(const f of ['season-parallel-contract-regression.mjs','tools/emergency-queue-contract.mjs','Draft_Companion_IR_Stash_And_Fetch_Regression_2026-08-13.js'])tests.set(f,[f]);
tests.set('backup self-test',['tools/audit-v45-backup.mjs','--self-test']);
tests.set('cloud foundation regression',['tools/cloud-foundation-regression.mjs']);
for(const f of [...fs.readdirSync('.').filter(f=>f.endsWith('.js')),...fs.readdirSync('tools').filter(f=>f.endsWith('.mjs')).map(f=>'tools/'+f)])tests.set('--check '+f,['--check',f]);
const results=[];
for(const [name,args] of tests){const r=spawnSync(process.execPath,args,{encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024,env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'0'}});const status=r.status===0?'PASS':'FAIL';results.push({name,status,output:r.stdout+r.stderr});console.log(status+' '+name);if(status==='FAIL')console.error(r.stdout+r.stderr);}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(results,null,2));
console.log('STRICT_SUITE '+results.filter(x=>x.status==='PASS').length+'/'+results.length);process.exitCode=results.some(x=>x.status==='FAIL')?1:0;
