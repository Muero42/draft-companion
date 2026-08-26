import fs from 'node:fs';
import zlib from 'node:zlib';
const OLD='v11.8.0-rc4.65', NEW='v11.8.0-rc4.66';
const raw=fs.readFileSync('research/expert-v2-exact-return-input-v2.json.gz.b64','utf8').replace(/\s+/g,'');
const d=JSON.parse(zlib.gunzipSync(Buffer.from(raw,'base64')));
if(d.schema!=='pitti-expert-v2-exact-return-input-v2'||d.kernelCommit!=='9ba6db89fc1e7550052a7526bd0c68d6cc7459dc')throw Error('frozen Expert-v2 source pin mismatch');
const weights={QB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':20,'Justin Boone':10,'Pat Fitzmaurice':10},RB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':25,'Pat Fitzmaurice':15},WR:{'Nick Mariano':35,'Draft Sharks Team':30,'Pat Fitzmaurice':15,'Dalton Del Don':10,'Justin Boone':10},TE:{'Draft Sharks Team':35,'Pat Fitzmaurice':30,'Dalton Del Don':25,'Justin Boone':10}};
for(const [pos,w] of Object.entries(weights))if(Object.values(w).reduce((a,b)=>a+b,0)!==100)throw Error(pos+' weights != 100');
const rows={QB:[],RB:[],WR:[],TE:[]};for(const p of Object.values(d.pool)){if(rows[p.pos]&&Number.isFinite(+p.v2Rank))rows[p.pos].push({name:p.name,rank:+p.v2Rank});}for(const pos of Object.keys(rows)){rows[pos].sort((a,b)=>a.rank-b.rank);if(rows[pos].length<15)throw Error(pos+' board too small: '+rows[pos].length);}
fs.writeFileSync('expert-v2-board.js',`window.PITTI_EXPERT_V2=${JSON.stringify({schema:'pitti-expert-v2-board.v1',source:'frozen-researched-2026-08-26',kernelCommit:d.kernelCommit,weights,rows})};\n`);
let a=fs.readFileSync('app.js','utf8');
if(!a.includes('EXPERT_PROFILE_IDS')||!a.includes('ensureExpertV2Panels'))throw Error('rc4.65 expert profile base missing');
const oldReload="    applyPreset();\n    persist();renderAll();";
const newReload="    const expertProfileBeforeReload=currentExpertProfile();\n    applyPreset();\n    ensureExpertV2Panels();\n    if(EXPERT_PROFILE_IDS[expertProfileBeforeReload])positionPanels={...EXPERT_PROFILE_IDS[expertProfileBeforeReload]};\n    persist();renderAll();";
if(a.includes(oldReload))a=a.replace(oldReload,newReload);else if(!a.includes('expertProfileBeforeReload'))throw Error('loadExperts reload marker missing');
a=a.replaceAll(OLD,NEW);fs.writeFileSync('app.js',a);
for(const f of ['index.html','sw.js','manifest.webmanifest','README.md']){let s=fs.readFileSync(f,'utf8');s=s.replaceAll(OLD,NEW);fs.writeFileSync(f,s);}
console.log('RC466_BUILD_READY profile-preservation',Object.fromEntries(Object.entries(rows).map(([k,v])=>[k,v.length])));