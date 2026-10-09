import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import {APT_BOUNDS, bootstrap, replaceAzureMirror} from './cloud-apt-bootstrap.mjs';
import {assertCloudInstallContract, REQUIRED_INSTALL_SCRIPT} from './cloud-install-contract.mjs';
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name);};
const installFixture=()=>({jobs:{'cloud-validation':{steps:[{name:'Install pinned project, Chromium and mandatory isolation','timeout-minutes':12,env:{PLAYWRIGHT_BROWSERS_PATH:'${{ runner.temp }}/pitti-playwright'},run:REQUIRED_INSTALL_SCRIPT},{name:'Complete exact-head cloud validation'}]}}});
const bootstrapSource=fs.readFileSync('tools/cloud-apt-bootstrap.mjs','utf8');
test('installation contract accepts reviewed bootstrap and LF/CRLF',()=>{assertCloudInstallContract(installFixture(),bootstrapSource);assertCloudInstallContract(installFixture(),bootstrapSource.replace(/\r?\n/g,'\r\n'));});
for(const [name,mutate] of [
  ['removed bootstrap',s=>{s.run=s.run.split('\n').slice(1).join('\n');}],
  ['substituted bootstrap',s=>{s.run=s.run.replace('cloud-apt-bootstrap','other-bootstrap');}],
  ['ignored failure',s=>{s.run=s.run.replace('bootstrap.mjs','bootstrap.mjs || true');}],
  ['early exit',s=>{s.run='exit 0\n'+s.run;}],
  ['missing Chromium',s=>{s.run=s.run.replace('npx --no-install playwright install --with-deps chromium','');}],
  ['missing dependencies',s=>{s.run=s.run.replace('--with-deps ','');}],
  ['missing security probe',s=>{s.run=s.run.replace('sudo --preserve-env=PATH node tools/cloud-security-regression.mjs','');}],
  ['conditional install',s=>{s.if='${{ false }}';}],
  ['continue on error',s=>{s['continue-on-error']=true;}],
  ['unsafe shell',s=>{s.shell='bash {0}';}],
  ['removed time bound',s=>{delete s['timeout-minutes'];}]
])test('installation contract rejects '+name,()=>{const w=installFixture();mutate(w.jobs['cloud-validation'].steps[0]);assert.throws(()=>assertCloudInstallContract(w,bootstrapSource));});
test('installation contract rejects inherited bypass and wrong order',()=>{for(const key of ['defaults','env','if','continue-on-error'])for(const level of ['workflow','job']){const w=installFixture();(level==='job'?w.jobs['cloud-validation']:w)[key]={};assert.throws(()=>assertCloudInstallContract(w,bootstrapSource));}const w=installFixture();w.jobs['cloud-validation'].steps.reverse();assert.throws(()=>assertCloudInstallContract(w,bootstrapSource));});
test('installation contract rejects bootstrap weakening even with expected command text retained',()=>{for(const source of ['',bootstrapSource.replace("'bubblewrap'","'curl'"),bootstrapSource.replace('if (second !== 0)','if (false)'),bootstrapSource.replace('https://archive.ubuntu.com','http://archive.ubuntu.com'),bootstrapSource+'\nprocess.exit(0);\n'])assert.throws(()=>assertCloudInstallContract(installFixture(),source));});
test('APT fallback preserves suites, components, signatures and unrelated sources',()=>{
  const source='Types: deb\nURIs: http://azure.archive.ubuntu.com/ubuntu/\nSuites: noble noble-updates noble-security\nComponents: main universe\nSigned-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg\n\ndeb [arch=amd64 signed-by=/key] https://azure.archive.ubuntu.com/ubuntu noble main\n# http://azure.archive.ubuntu.com/ubuntu\nURIs: https://security.ubuntu.com/ubuntu/ https://azure.archive.ubuntu.com.evil/ubuntu/\n';
  assert.equal(replaceAzureMirror(source),source.replace('URIs: http://azure.archive.ubuntu.com/ubuntu/','URIs: https://archive.ubuntu.com/ubuntu/').replace('] https://azure.archive.ubuntu.com/ubuntu ','] https://archive.ubuntu.com/ubuntu/ '));
});
test('APT bounds reject partial updates without weakening authentication',()=>{
  assert.equal(APT_BOUNDS,'Acquire::Retries "0";\nAcquire::http::Timeout "15";\nAcquire::https::Timeout "15";\nAPT::Update::Error-Mode "any";\n');
});
function aptScenario(statuses, available=true) {
  const calls=[];let fallbacks=0,error;
  try{bootstrap({run:(command,args)=>{calls.push([command,...args]);assert(statuses.length,'unexpected retry');return statuses.shift();},fallback:()=>{fallbacks++;return available;}});}catch(e){error=e;}
  for(const call of calls){assert.equal(call[0],'timeout');assert.equal(call[1],'--kill-after=15s');assert.equal(call[3],'apt-get');assert.deepEqual(call.slice(2),call[4]==='update'?['120s','apt-get','update','--error-on=any']:['180s','apt-get','install','--yes','bubblewrap']);}
  return {calls,fallbacks,error};
}
test('APT success still installs mandatory bubblewrap without fallback',()=>{const r=aptScenario([0,0]);assert.equal(r.calls.length,2);assert.equal(r.fallbacks,0);assert.equal(r.error,undefined);});
test('APT timeout gets exactly one full HTTPS update and install retry',()=>{const r=aptScenario([124,0,0]);assert.equal(r.calls.length,3);assert.equal(r.fallbacks,1);assert.equal(r.error,undefined);});
test('APT package acquisition failure also requires successful fresh update and install',()=>{const r=aptScenario([0,100,0,0]);assert.equal(r.calls.length,4);assert.equal(r.fallbacks,1);assert.equal(r.error,undefined);});
test('APT fallback failure or unsupported source blocks validation',()=>{for(const statuses of [[100,100],[100,0,100],[124,137]]){const r=aptScenario(statuses);assert(r.error);assert.equal(r.fallbacks,1);}const r=aptScenario([100],false);assert(r.error);assert.equal(r.calls.length,1);});
test('cloud installation keeps mandatory isolation, pinned install and Chromium in fail-fast order',()=>{
  const validation=fs.readFileSync('.github/workflows/pitti-cloud-validation.yml','utf8').replace(/\r\n/g,'\n');
  const install=validation.slice(validation.indexOf('      - name: Install pinned project'),validation.indexOf('      - name: Complete exact-head'));
  assert(install.includes('timeout-minutes: 12'));
  assert.equal(install.slice(install.indexOf('        run: |')).trimEnd(),`        run: |
          sudo --preserve-env=PATH node tools/cloud-apt-bootstrap.mjs
          sudo --preserve-env=PATH node tools/cloud-security-regression.mjs
          npm ci --ignore-scripts
          npx --no-install playwright install --with-deps chromium`);
  assert(!validation.includes('continue-on-error:'));
  assert(validation.includes('node tools/cloud-isolated-validation.mjs'));
});
const workflow=fs.readFileSync('.github/workflows/pitti-cloud-auto.yml','utf8'),validator=fs.readFileSync('tools/cloud-isolated-validation.mjs','utf8'),controller=fs.readFileSync('tools/cloud-run.mjs','utf8'),contract=fs.readFileSync('tools/cloud-contract.mjs','utf8');
test('each Codex action is the final explicit job step',()=>{for(const [start,end] of [['  implement:','  validate:'],['  independent-review:','  review-receipt:']]){const block=workflow.slice(workflow.indexOf(start),workflow.indexOf(end));assert(block.trimEnd().endsWith(`codex-args: '["--ephemeral"]'`));}});
test('model transfers only schema-bound payload',()=>{assert(workflow.includes('steps.codex.outputs.final-message'));assert(workflow.includes('cloud-implementation.schema.json'));assert(!workflow.includes('implementation-${{ github.run_id }}'));});
test('validator has empty network and read-only trust mounts',()=>{for(const x of ["'--unshare-pid','--unshare-net','--unshare-ipc','--unshare-uts','--unshare-cgroup'","'--die-with-parent'","'--clearenv'","'--ro-bind',control","'--ro-bind',work"])assert(validator.includes(x));});
test('publisher uses atomic new-ref API and no git push',()=>{assert(controller.includes("api('git/refs','POST'"));assert(!controller.includes("['push'"));});
test('apply and publish repeat index-mode guard',()=>assert((controller.match(/indexModeErrors\(r\.expected_main_sha\)/g)||[]).length>=3));
test('review refuses pre-existing model output',()=>assert(controller.includes("fs.existsSync(path.join(out,'review-raw.json'))")));
test('trusted job reconstructs binding before accepting review payload',()=>{assert(workflow.includes('needs: [publish, exact-ci, independent-review]'));assert(workflow.includes('PITTI_REVIEW_PAYLOAD: ${{ needs.independent-review.outputs.payload }}'));});
test('least-privilege protection never requests administration-only ruleset history',()=>assert(!controller.includes('/history')));
test('redacted bypass actors cannot be replaced by pinned or attested ruleset metadata',()=>{assert(!contract.includes('RULESET_PINS'));assert(!/updated_at|attested_/i.test(contract));assert(contract.includes('least-privilege API evidence is insufficient'));});
test('all executable third-party actions are immutable pins',()=>{for(const f of fs.readdirSync('.github/workflows').filter(x=>/\.ya?ml$/.test(x)))for(const m of fs.readFileSync('.github/workflows/'+f,'utf8').matchAll(/uses:\s+([^\s#]+)/g))assert(/@[a-f0-9]{40}$/.test(m[1]),f+': '+m[1]);});
const hostNamespaceProbeAvailable=process.platform==='linux'&&fs.existsSync('/proc/sys/kernel/yama/ptrace_scope')&&fs.existsSync('/usr/bin/bwrap')&&fs.existsSync('/usr/bin/setpriv');
if(hostNamespaceProbeAvailable&&process.env.PITTI_IN_ISOLATED_VALIDATION!=='1'){
  test('candidate cannot inspect parent memory or enable supervisor debugger',()=>{assert(Number(fs.readFileSync('/proc/sys/kernel/yama/ptrace_scope','utf8'))>=1);const attack="const fs=require('fs');try{fs.openSync('/proc/'+process.ppid+'/mem','r');process.exit(9)}catch(e){if(e.code!=='EACCES'&&e.code!=='EPERM')throw e}process.kill(process.ppid,'SIGUSR1');",supervisor="require('child_process').execFileSync(process.execPath,['-e',"+JSON.stringify(attack)+"]);setTimeout(()=>process.exit(0),100);";const r=spawnSync('/usr/bin/setpriv',['--reuid=65534','--regid=65534','--clear-groups','--bounding-set=-all','--inh-caps=-all','--ambient-caps=-all','--no-new-privs',process.execPath,'--disable-sigusr1','-e',supervisor],{encoding:'utf8',timeout:5000,env:{PATH:'/usr/bin:/bin'}});assert.equal(r.status,0,r.stderr);assert(!r.stderr.includes('Debugger listening'));assert(validator.includes("'NODE_OPTIONS','--disable-sigusr1'"));});
  test('real namespace denies writes, network and inherited secret env',()=>{assert(fs.existsSync('/usr/bin/bwrap'));const d=fs.mkdtempSync(path.join(os.tmpdir(),'pitti-bwrap-')),code=path.join(d,'probe.js'),marker=path.join(d,'marker');fs.chmodSync(d,0o755);fs.writeFileSync(code,`const fs=require('fs');let ok=process.getuid()===65534?1:0;try{fs.writeFileSync('/work/marker','x')}catch{ok++}if(process.env.PITTI_PROBE_SECRET===undefined)ok++;fetch('https://example.com').catch(()=>{if(++ok===4)process.exit(0);process.exit(9)});setTimeout(()=>process.exit(8),3000);`);const nodeRoot=path.dirname(path.dirname(process.execPath)),bind=['--ro-bind','/usr','/usr'];for(const p of ['/bin','/lib','/lib64'])if(fs.existsSync(p)){const st=fs.lstatSync(p);if(st.isSymbolicLink())bind.push('--symlink',fs.readlinkSync(p),p);else bind.push('--ro-bind',p,p);}const r=spawnSync('/usr/bin/bwrap',['--unshare-pid','--unshare-net','--unshare-ipc','--unshare-uts','--unshare-cgroup','--die-with-parent','--clearenv',...bind,'--ro-bind',nodeRoot,'/node','--ro-bind',d,'/work','--proc','/proc','--dev','/dev','--perms','1777','--tmpfs','/tmp','--chdir','/work','--cap-add','CAP_SETUID','--cap-add','CAP_SETGID','--cap-add','CAP_SETPCAP','/usr/bin/setpriv','--reuid=65534','--regid=65534','--clear-groups','--bounding-set=-all','--inh-caps=-all','--ambient-caps=-all','--no-new-privs','/node/bin/node','/work/probe.js'],{env:{PATH:'/usr/bin:/bin',PITTI_PROBE_SECRET:'must-not-cross'},timeout:5000,encoding:'utf8'});assert.equal(r.status,0,r.stderr||r.stdout);assert(!fs.existsSync(marker));});
}else console.log('INFO namespace probe skipped: isolated validation or required Linux host controls unavailable');
console.log('CLOUD_SECURITY_REGRESSION_PASS '+count+' cases');
