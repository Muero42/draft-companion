const fs=require('fs'); const s=fs.readFileSync('app.js','utf8'),appVersion=s.match(/const APP_VERSION='([^']+)'/)?.[1],state=JSON.parse(fs.readFileSync('PITTI_CURRENT_STATE.json','utf8'));
const checks=[
 // rc4.13 is historical; verify the current authority without reviving that release.
 ['version',appVersion===state.authority.source_candidate||(process.env.PITTI_CANDIDATE_PREFLIGHT==='1'&&fs.readFileSync('README.md','utf8').includes(appVersion))],
 ['bounded fetch',/AbortController/.test(s)&&/Timeout nach/.test(s)],
 ['no second full player fetch',/players:first\.players/.test(s)&&/Draft-Kontrolle/.test(s)&&/Picks-Kontrolle/.test(s)],
 ['one IR slot modeled',/irSlots:1/.test(s)],
 ['PUP free-slot late tiebreak',/st==='PUP'\)return freeIr\?\(current>=121\?2\.5:0\):-4\.0/.test(s)],
 ['PUP injury penalty waived only late/free slot',/st==='PUP'&&freeIr&&current>=121\?0/.test(s)],
 ['IR still materially penalized',/st==='IR'&&freeIr\?12:st==='IR'\?18/.test(s)]
];
for(const [n,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${n}`);
if(checks.some(x=>!x[1]))process.exit(1);
