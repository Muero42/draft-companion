import fs from 'node:fs';

const must=(ok,msg)=>{if(!ok){console.error('RELEASE_GUARD_FAIL:',msg);process.exitCode=1;}};
const read=f=>fs.readFileSync(f,'utf8');
const index=read('index.html');
const app=read('app.js');
const sw=read('sw.js');
const manifest=read('manifest.webmanifest');
const live=read('live-surface-v3.js');
const readme=read('README.md');

const vm=index.match(/<span class="version">(v11\.8\.0-rc4\.\d+)<\/span>/);
must(vm,'visible version missing from index.html');
const V=vm?.[1];
if(V){
  const bare=V.slice(1);
  must(readme.split(/\r?\n/).slice(0,5).join('\n').includes(V),`README active release header is not ${V}`);
  must(app.includes(V)||app.includes(`'${bare}'`)||app.includes(`"${bare}"`),`app.js does not carry ${V}`);
  must(sw.includes(V),`sw.js cache/version does not carry ${V}`);
  must(manifest.includes(V)||manifest.includes(bare),`manifest.webmanifest does not carry ${V}`);
  must(index.includes(`live-surface-v3.css?v=${bare}`)||index.includes(`live-surface-v3.css?v=${V}`),`live-surface CSS cache-buster is stale vs ${V}`);
  must(index.includes(`live-surface-v3.js?v=${bare}`)||index.includes(`live-surface-v3.js?v=${V}`),`live-surface JS cache-buster is stale vs ${V}`);
  must(index.includes(`app.js?v=${bare}`)||index.includes(`app.js?v=${V}`),`app.js HTML cache-buster is stale vs ${V}`);
  must(sw.includes(`./app.js?v=${bare}`)||sw.includes(`./app.js?v=${V}`)||sw.includes("'./app.js'"),`service-worker app.js cache key is stale vs ${V}`);
}

// Draft-day UI invariants that have regressed before.
for(const x of [
  "GLOBAL_EXPERT_ORDER=['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone'",
  'Math.round(hit.rank)',
  "x.arrows?' '+esc(x.arrows):''",
  'live-plus',
  'live-minus',
  'live-signal',
  '10ER-ÜBERSICHT'
]) must(live.includes(x),`live-surface invariant missing: ${x}`);
must(!live.includes('<details><summary>Experten'),'expert ranks must not be collapsible');
must(!/shortName\(name\).*%/.test(live),'expert weights leaked into live card instead of ranks');

// Selected Expert-v2 profile must carry individual rows, not aggregate only.
must(app.includes('individual')||app.includes('PITTI_EXPERT_V2'),'Expert-v2 individual-rank plumbing missing');

if(!process.exitCode) console.log('RELEASE_GUARD_PASS',V);
