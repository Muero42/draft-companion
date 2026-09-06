import fs from 'node:fs';import assert from 'node:assert/strict';import YAML from 'yaml';
const dir='.github/workflows',all=Object.fromEntries(fs.readdirSync(dir).filter(f=>/\.ya?ml$/.test(f)).map(f=>{const d=YAML.parseDocument(fs.readFileSync(dir+'/'+f,'utf8'),{uniqueKeys:true});assert.deepEqual(d.errors,[],f+' YAML errors');return[f,d.toJS()];}));
const w=all['pitti-cloud-auto.yml'];assert.deepEqual(Object.keys(w.on),['workflow_dispatch']);
for(const key of ['task_id','task_prompt','expected_main_sha','allowed_scope','max_attempts','authorization_reference'])assert(w.on.workflow_dispatch.inputs[key]);
assert.equal(w.permissions.contents,'read');assert(!w.permissions.deployments);
for(const job of Object.values(w.jobs))for(const s of job.steps)if(s.uses?.startsWith('actions/checkout@')&&s.with.path==='control')assert.equal(s.with.ref,'${{ github.workflow_sha }}','controller must come from trusted workflow SHA, never unverified input');
assert.equal(w.jobs.publish.needs,'validate');assert.equal(w.jobs.validate.needs,'implement');assert(w.jobs['independent-review'].needs.includes('exact-ci'));
const actions=Object.values(w.jobs).flatMap(j=>j.steps).filter(x=>x.uses?.startsWith('openai/codex-action@'));
assert.equal(actions.length,2);assert(actions.every(x=>x.uses.endsWith('86365089eb2b84e0a8fb0717b304f8bdcb13b20e')&&x.with['safety-strategy']==='drop-sudo'));
assert.equal(actions[0].with['permission-profile'],':workspace');assert.equal(actions[1].with['permission-profile'],':read-only');
assert(!w.jobs.publish.steps.some(s=>/npm |cloud-validate|strict-suite|codex-action/.test((s.run||'')+(s.uses||''))),'publisher may not run candidate code');
for(const [name,job] of Object.entries(w.jobs)){
  assert.equal(job['runs-on'],'ubuntu-latest',name);assert(job['timeout-minutes']<=40);
  for(const s of job.steps){if(s.uses?.startsWith('actions/checkout@'))assert.equal(s.with['persist-credentials'],false);if(s.run)assert(!s.run.includes('${{ inputs.'),'inputs must enter shell through environment, never interpolation');}
}
for(const f of ['rc461-live-surface-v3.yml','rc462-decision-ui.yml','rc463-mock-live-parity.yml']){const h=all[f];assert.deepEqual(Object.keys(h.on),['workflow_dispatch']);assert.equal(h.permissions.contents,'read');assert(Object.values(h.jobs).every(j=>j.if==='${{ false }}'));}
const validation=all['pitti-cloud-validation.yml'];
assert.deepEqual(validation.on.pull_request.branches,['main','pitti/rc4190-roster-week1-needs'],'cloud validation PR bases must remain an explicit, approved allowlist');
assert.deepEqual(validation.on.push.branches,['main'],'intermediate integration branches must not gain push-triggered release validation');
assert.deepEqual(validation.permissions,{contents:'read'});
const validationJob=validation.jobs['cloud-validation'];
assert.equal(validationJob.name,'pitti-cloud-validation');
const validationCheckout=validationJob.steps.find(s=>s.uses?.startsWith('actions/checkout@'));
assert.equal(validationCheckout.with.ref,'${{ github.event.pull_request.head.sha || github.sha }}');
assert.equal(validationCheckout.with['persist-credentials'],false);
const validationScript=validationJob.steps.map(s=>s.run||'').join('\n');
assert(validationScript.includes('sudo apt-get install --yes bubblewrap'));
assert(validationScript.includes('sudo --preserve-env=PATH node tools/cloud-security-regression.mjs'));
assert(validationScript.includes('test "$(git rev-parse HEAD)" = "$EXPECTED_HEAD"'));
assert(validationScript.includes('node tools/cloud-isolated-validation.mjs'));
const isolatedValidator=fs.readFileSync('tools/cloud-isolated-validation.mjs','utf8');
assert(isolatedValidator.includes("process.platform!=='linux'||!fs.existsSync('/usr/bin/bwrap')"));
assert(isolatedValidator.includes("fs.readFileSync('/proc/sys/kernel/yama/ptrace_scope','utf8')"));
console.log('CLOUD_WORKFLOW_SYNTAX_PASS '+Object.keys(all).length+' YAML documents');
