import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';

// Also bounds APT calls made later by Playwright --with-deps. Authentication
// and TLS defaults are deliberately untouched; partial index refreshes fail.
export const APT_BOUNDS = 'Acquire::Retries "0";\nAcquire::http::Timeout "15";\nAcquire::https::Timeout "15";\nAPT::Update::Error-Mode "any";\n';
export function replaceAzureMirror(source) {
  return source.split('\n').map(line => {
    if (!/^\s*(?:URIs:|deb(?:-src)?\s)/.test(line)) return line;
    return line.replace(/https?:\/\/azure\.archive\.ubuntu\.com\/ubuntu\/?(?=\s|$)/g, 'https://archive.ubuntu.com/ubuntu/');
  }).join('\n');
}

export function bootstrap({run, fallback}) {
  const apt = (seconds, args) => run('timeout', ['--kill-after=15s', `${seconds}s`, 'apt-get', ...args]);
  const attempt = () => {
    const update = apt(120, ['update', '--error-on=any']);
    return update === 0 ? apt(180, ['install', '--yes', 'bubblewrap']) : update;
  };
  const first = attempt();
  if (first === 0) return;
  console.error(`APT primary attempt failed (exit ${first}); attempting one official HTTPS mirror fallback`);
  if (!fallback()) throw new Error('APT failed; no supported Azure Ubuntu source to replace');
  const second = attempt();
  if (second !== 0) throw new Error(`APT official HTTPS fallback failed (exit ${second}); validation cannot proceed`);
}

function main() {
  if (process.platform !== 'linux' || process.arch !== 'x64' || process.getuid() !== 0 ||
      !/^ID=ubuntu$/m.test(fs.readFileSync('/etc/os-release', 'utf8'))) {
    throw new Error('APT bootstrap requires the Ubuntu x64 root CI environment');
  }
  fs.writeFileSync('/etc/apt/apt.conf.d/99pitti-ci-bounds', APT_BOUNDS);
  bootstrap({
    run: (command, args) => {
      console.log(`APT bounded command: ${command} ${args.join(' ')}`);
      const result = spawnSync(command, args, {stdio: 'inherit', env: {...process.env, DEBIAN_FRONTEND: 'noninteractive'}});
      if (result.error) throw result.error;
      return result.status ?? 1;
    },
    fallback: () => {
      const directory = '/etc/apt/sources.list.d';
      const files = ['/etc/apt/sources.list', ...fs.readdirSync(directory).filter(f => /\.(list|sources)$/.test(f)).map(f => path.join(directory, f))];
      let changed = false;
      for (const file of files.filter(f => fs.existsSync(f))) {
        const before = fs.readFileSync(file, 'utf8'), after = replaceAzureMirror(before);
        if (after !== before) {
          fs.writeFileSync(file, after);
          console.log(`APT fallback: replaced Azure Ubuntu URI in ${file}; suites, components and signing policy preserved`);
          changed = true;
        }
      }
      return changed;
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
