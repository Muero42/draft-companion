import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

export const REQUIRED_INSTALL_SCRIPT = [
  'sudo --preserve-env=PATH node tools/cloud-apt-bootstrap.mjs',
  'sudo --preserve-env=PATH node tools/cloud-security-regression.mjs',
  'npm ci --ignore-scripts',
  'npx --no-install playwright install --with-deps chromium'
].join('\n');

export function assertCloudInstallContract(workflow, bootstrapSource) {
  const job = workflow.jobs['cloud-validation'];
  for (const scope of [workflow, job]) {
    for (const key of ['defaults', 'env', 'if', 'continue-on-error']) {
      assert(!Object.hasOwn(scope, key), `installation must not inherit ${key}`);
    }
  }
  const installs = job.steps.filter(s => s.name === 'Install pinned project, Chromium and mandatory isolation');
  assert.equal(installs.length, 1, 'one mandatory installation step');
  const install = {...installs[0], run: installs[0].run?.replace(/\r\n/g, '\n').trimEnd()};
  assert.deepEqual(install, {
    name: 'Install pinned project, Chromium and mandatory isolation',
    'timeout-minutes': 12,
    env: {PLAYWRIGHT_BROWSERS_PATH: '${{ runner.temp }}/pitti-playwright'},
    run: REQUIRED_INSTALL_SCRIPT
  }, 'bootstrap, security probe and Chromium must execute unconditionally in fail-fast order');
  const validationIndex = job.steps.findIndex(s => s.name === 'Complete exact-head cloud validation');
  assert(validationIndex > job.steps.indexOf(installs[0]), 'installation must precede isolated validation');
  // Pin the reviewed implementation, not text fragments that commented-out or
  // bypassed commands could satisfy. Changes require an explicit contract review.
  const bytes = Buffer.from(bootstrapSource.replace(/\r\n/g, '\n'));
  const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(blob, '137c97b4a8af42337526c820dcff0e875601274a', 'bounded, authenticated, fail-closed APT bootstrap changed');
}
