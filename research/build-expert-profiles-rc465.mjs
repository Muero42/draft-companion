import fs from 'node:fs';
import zlib from 'node:zlib';
const OLD='v11.8.0-rc4.64', NEW='v11.8.0-rc4.65';
const raw=fs.readFileSync('research/expert-v2-exact-return-input-v2.json.gz.b64','utf8').replace(/\s+/g,'');
const d=JSON.parse(zlib.gunzipSync(Buffer.from(raw,'base64')));
if(d.schema!=='pitti-expert-v2-exact-return-input-v2'||d.kernelCommit!=='9ba6db89fc1e7550052a7526bd0c68d6cc7459dc')throw Error('frozen Expert-v2 source pin mismatch');
const weights={QB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':20,'Justin Boone':10,'Pat Fitzmaurice':10},RB:{'Draft Sharks Team':35,'Nick Mariano':25,'Dalton Del Don':25,'Pat Fitzmaurice':15},WR:{'Nick Mariano':35,'Draft Sharks Team':30,'Pat Fitzmaurice':15,'Dalton Del Don':10,'Justin Boone':10},TE:{'Draft Sharks Team':35,'Pat Fitzmaurice':30,'Dalton Del Don':25,'Justin Boone':10}};
for(const [pos,w] of Object.entries(weights))if(Object.values(w).reduce((a,b)=>a+b,0)!==100)throw Error(pos+' weights != 100');
const rows={QB:[],RB:[],WR:[],TE:[]};
for(const p of Object.values(d.pool)){if(rows[p.pos]&&Number.isFinite(+p.v2Rank))rows[p.pos].push({name:p.name,rank:+p.v2Rank});}
for(const pos of Object.keys(rows)){rows[pos].sort((a,b)=>a.rank-b.rank);if(rows[pos].length<15)throw Error(pos+' board too small: '+rows[pos].length);}
fs.writeFileSync('expert-v2-board.js',`window.PITTI_EXPERT_V2=${JSON.stringify({schema:'pitti-expert-v2-board.v1',source:'frozen-researched-2026-08-26',kernelCommit:d.kernelCommit,weights,rows})};\n`);
let a=fs.readFileSync('app.js','utf8');
if(!a.includes("'expertProfile'"))a=a.replace("'liveLockStatus']","'liveLockStatus','expertProfile']");
const marker="let positionPanels=store.get('v7_positionPanels',{QB:'qb',RB:'rb',WR:'wr',TE:'te'});";
const block=`\nconst EXPERT_PROFILE_IDS={incumbent:{QB:'qb',RB:'rb',WR:'wr',TE:'te'},fullv2:{QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'},wrv2:{QB:'qb',RB:'rb',WR:'expert-v2-wr',TE:'te'}};\nfunction ensureExpertV2Panels(){const src=globalThis.PITTI_EXPERT_V2;if(!src||src.schema!=='pitti-expert-v2-board.v1')return false;for(const pos of ['QB','RB','WR','TE']){const list=src.rows?.[pos]||[];if(!list.length)return false;const id='expert-v2-'+pos.toLowerCase(),ranks={};for(const row of list){const rank=Number(row.rank);if(row.name&&Number.isFinite(rank)&&rank>0)ranks[norm(row.name)]={name:row.name,pos,rank,mean:rank,median:rank,sd:null,n:null};}panelRanks[id]=ranks;panels[id]={name:'Expert-v2 '+pos+' · 26.08.',members:{},shadow:true,weights:src.weights?.[pos]||{},source:src.source};}return true;}\nfunction currentExpertProfile(){for(const [id,map] of Object.entries(EXPERT_PROFILE_IDS))if(['QB','RB','WR','TE'].every(pos=>positionPanels[pos]===map[pos]))return id;return 'custom';}\nfunction applyExpertProfile(id){const map=EXPERT_PROFILE_IDS[id];if(!map)return;positionPanels={...map};persist();renderAll();if(els.expertProfile)els.expertProfile.value=id;}\n`;
if(!a.includes('EXPERT_PROFILE_IDS')){if(!a.includes(marker))throw Error('positionPanels marker missing');a=a.replace(marker,marker+block);}
a=a.replace("panelRanks=rebuilt;return true;","panelRanks=rebuilt;ensureExpertV2Panels();return true;");
a=a.replace("if(!Object.keys(panelRanks).length)rebuildPanelRanksFromCache();","if(!Object.keys(panelRanks).length)rebuildPanelRanksFromCache();\nensureExpertV2Panels();");
const eventMarker="for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])el.onchange=()=>{positionPanels[pos]=el.value;persist()};";
if(!a.includes('els.expertProfile.onchange')){if(!a.includes(eventMarker))throw Error('panel event marker missing');a=a.replace(eventMarker,eventMarker+"\nif(els.expertProfile){els.expertProfile.value=currentExpertProfile();els.expertProfile.onchange=()=>applyExpertProfile(els.expertProfile.value);}");}
a=a.replaceAll(OLD,NEW);
fs.writeFileSync('app.js',a);
let h=fs.readFileSync('index.html','utf8');
if(!h.includes('id="expertProfile"')){const needle='<div id="apiQuickStatus" class="notice"></div>';
const ui=`<div class="strategy-box"><label for="expertProfile"><b>Experten-Konfiguration</b></label><select id="expertProfile"><option value="incumbent">Bisherige Konfiguration (rc4.64)</option><option value="fullv2">Expert-v2 · alle Positionen</option><option value="wrv2">Expert-v2 · nur WR</option><option value="custom" disabled>Benutzerdefiniert</option></select><p class="tiny">Vergleichsmodus: gleicher Decision-/Return-Kernel, nur die Positionspanels wechseln. Expert-v2: QB DS35/Mariano25/Del Don20/Boone10/Pat10 · RB DS35/Mariano25/Del Don25/Pat15 · WR Mariano35/DS30/Pat15/Del Don10/Boone10 · TE DS35/Pat30/Del Don25/Boone10.</p></div>`;
if(!h.includes(needle))throw Error('UI insertion marker missing');h=h.replace(needle,needle+ui);}
if(!h.includes('expert-v2-board.js')){const needle='<script type="module" src="app.js';const i=h.indexOf(needle);if(i<0)throw Error('app script marker missing');h=h.slice(0,i)+'<script src="expert-v2-board.js?v=20260826"></script>\n'+h.slice(i);}
h=h.replaceAll(OLD,NEW);fs.writeFileSync('index.html',h);
for(const f of ['sw.js','manifest.webmanifest','README.md']){let s=fs.readFileSync(f,'utf8');s=s.replaceAll(OLD,NEW);fs.writeFileSync(f,s);}
console.log('RC465_BUILD_READY',Object.fromEntries(Object.entries(rows).map(([k,v])=>[k,v.length])));