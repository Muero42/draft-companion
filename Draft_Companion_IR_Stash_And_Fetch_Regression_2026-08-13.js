const fs=require('fs'); const s=fs.readFileSync('app.js','utf8');
// Regression is about IR/fetch semantics. Version is intentionally checked only for a
// valid v11.8.0-rc4.x release marker so future release bumps cannot create a false failure.
const checks=[
 ['version marker',/v11\.8\.0-rc4\.\d+/.test(s)],
 ['bounded fetch',/AbortController/.test(s)&&/Timeout nach/.test(s)],
 ['no second full player fetch',/players:first\.players/.test(s)&&/Draft-Kontrolle/.test(s)&&/Picks-Kontrolle/.test(s)],
 ['one IR slot modeled',/irSlots:1/.test(s)],
 ['PUP free-slot late tiebreak',/st==='PUP'\)return freeIr\?\(current>=121\?2\.5:0\):-4\.0/.test(s)],
 ['PUP injury penalty waived only late/free slot',/st==='PUP'&&freeIr&&current>=121\?0/.test(s)],
 ['IR still materially penalized',/st==='IR'&&freeIr\?12:st==='IR'\?18/.test(s)]
];
for(const [n,ok] of checks) console.log(`${ok?'PASS':'FAIL'} ${n}`);
if(checks.some(x=>!x[1]))process.exit(1);