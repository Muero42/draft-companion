const $=id=>document.getElementById(id);const safe=(el,fn)=>{if(el)fn(el)};
const ids=['apiKey','toggleKeyBtn','clearKeyBtn','season','scoring','diagnoseBtn','loadExpertsBtn','diagnostic','expertSearch','activePanel','applyRecommendedBtn','presetStatus','newPanelBtn','renamePanelBtn','deletePanelBtn','expertsList','savePanelBtn','loadRanksBtn','panelStatus','qbPanel','rbPanel','wrPanel','tePanel','adpFile','adpStatus','qualityStatus','backupBtn','restoreFile','clearDraftDataBtn','draftInput','slot','topN','refreshBtn','autoRefresh','draftStatus','draftSummary','currentPick','nextPick','untilPick','teamFit','coachList','snapshot','copyBtn','shareBtn','onlineState','dataAge','qualityMini','refreshAllBtn','emptyCoach'];
const els=Object.fromEntries(ids.map(id=>[id,$(id)]));
const store={get(k,f=null){try{const v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch{return f}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},text(k,f=''){return localStorage.getItem(k)??f},setText(k,v){localStorage.setItem(k,v)}};
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const esc=v=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

let experts=store.get('v50_experts',[]);
let panels=store.get('v50_panels',{standard:{name:'Standard',members:{}},pat:{name:'Pat einzeln',members:{}}});
let activePanelId=store.text('v50_activePanel','standard');
let positionPanels=store.get('v50_positionPanels',{QB:'standard',RB:'standard',WR:'standard',TE:'standard'});
let rankCache=store.get('v50_rankCache',{}); // expertId -> player map
let panelRanks=store.get('v50_panelRanks',{}); // panelId -> player map
let adp=store.get('v50_adp',{});
let lastFetch=null;let autoTimer=null;

els.apiKey.value=store.text('v50_apiKey','');els.season.value=store.text('v50_season','2026');els.scoring.value=store.text('v50_scoring','HALF');els.draftInput.value=store.text('v50_draft','');els.autoRefresh.checked=store.get('v51_autoRefresh',false);
for(let i=1;i<=16;i++)els.slot.add(new Option(i,i));els.slot.value=store.text('v50_slot','9');

function persist(){store.setText('v50_apiKey',els.apiKey.value.trim());store.setText('v50_season',els.season.value.trim());store.setText('v50_scoring',els.scoring.value);store.setText('v50_draft',els.draftInput.value.trim());store.setText('v50_slot',els.slot.value);store.set('v50_experts',experts);store.set('v50_panels',panels);store.setText('v50_activePanel',activePanelId);store.set('v50_positionPanels',positionPanels);store.set('v50_rankCache',rankCache);store.set('v50_panelRanks',panelRanks);store.set('v50_adp',adp);store.set('v51_autoRefresh',els.autoRefresh.checked)}

function updateQuality(){
  const loadedPanels=Object.keys(panelRanks).length;
  const configuredPanels=Object.keys(panels).length;
  const adpCount=Object.keys(adp).length;
  const expertCount=experts.length;
  const issues=[];
  if(!els.apiKey.value.trim())issues.push('API-Key fehlt');
  if(!expertCount)issues.push('Expertenliste fehlt');
  if(!loadedPanels)issues.push('Panel-Rankings fehlen');
  if(!adpCount)issues.push('Sleeper-ADP fehlt');
  if(issues.length){
    els.qualityStatus.className='notice warn';
    if(els.qualityMini)els.qualityMini.textContent='Unvollständig';els.qualityStatus.textContent=`Noch nicht draftbereit: ${issues.join(' · ')}`;
  }else{
    els.qualityStatus.className='notice ok';
    if(els.qualityMini)els.qualityMini.textContent='Bereit';els.qualityStatus.textContent=`Draftbereit: ${expertCount} Experten · ${loadedPanels}/${configuredPanels} Panels geladen · ${adpCount} verifizierte Sleeper-ADPs.`;
  }
}
function safeBackup(){
  return {
    format:'draft-companion-final-2026',
    version:'5.2.0',
    createdAt:new Date().toISOString(),
    season:els.season.value,
    scoring:els.scoring.value,
    experts,panels,activePanelId,positionPanels,rankCache,panelRanks,adp,
    draftInput:els.draftInput.value,
    slot:els.slot.value,
    topN:els.topN.value
  };
}
function downloadJson(name,value){
  const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function applyBackup(value){
  if(!value||value.format!=='draft-companion-final-2026')throw new Error('Keine gültige Draft-Companion-Sicherung.');
  experts=Array.isArray(value.experts)?value.experts:[];
  panels=value.panels||{standard:{name:'Standard',members:{}},pat:{name:'Pat einzeln',members:{}}};
  activePanelId=value.activePanelId||'standard';
  positionPanels=value.positionPanels||{QB:'standard',RB:'standard',WR:'standard',TE:'standard'};
  rankCache=value.rankCache||{};
  panelRanks=value.panelRanks||{};
  adp=value.adp||{};
  els.season.value=value.season||'2026';
  els.scoring.value=value.scoring||'HALF';
  els.draftInput.value=value.draftInput||'';
  els.slot.value=String(value.slot||9);
  els.topN.value=String(value.topN||35);
  persist();renderAll();updateQuality();
}
function setAutoRefresh(){
  if(autoTimer){clearInterval(autoTimer);autoTimer=null}
  persist();
  if(els.autoRefresh.checked){
    autoTimer=setInterval(()=>{
      if(!document.hidden&&!els.refreshBtn.disabled&&els.draftInput.value.trim()){
        refresh().catch(e=>{els.draftStatus.textContent=`Auto-Refresh: ${e.message}`;els.draftStatus.className='notice bad'})
      }
    },10000);
  }
}

async function proxyCall(path,key){const r=await fetch(`/api/fantasypros?path=${encodeURIComponent(path)}`,{headers:{'x-fp-key':key},cache:'no-store'});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text.slice(0,1200)}}if(!r.ok){const e=new Error(data?.error||data?.message||`HTTP ${r.status}`);e.status=r.status;e.payload=data;throw e}return{data,status:r.status}}
function arrays(v,d=0){if(d>5||v==null)return[];if(Array.isArray(v))return[v];if(typeof v!=='object')return[];return Object.values(v).flatMap(x=>arrays(x,d+1))}
function field(o,names){const keys=Object.keys(o||{});for(const n of names){const t=n.toLowerCase().replace(/[^a-z0-9]/g,'');const k=keys.find(x=>x.toLowerCase().replace(/[^a-z0-9]/g,'')===t);if(k&&o[k]!==''&&o[k]!=null)return o[k]}return null}
function extractExperts(payload){for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){const mapped=rows.map(row=>{const id=field(row,['expert_id','expertid','id']),name=field(row,['expert_name','expertname','name','full_name']),site=field(row,['site_name','sitename','site','affiliation']);const accuracy=Number(field(row,['accuracy_draft_season','accuracy','draft_accuracy','accuracy_weekly_season']));return id&&name?{id:String(id),name:String(name),site:site?String(site):'',accuracy:Number.isFinite(accuracy)?accuracy:null}:null}).filter(Boolean);if(mapped.length)return[...new Map(mapped.map(x=>[x.id,x])).values()]}return[]}
function extractRankRows(payload){for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){const mapped=rows.map(row=>{const name=field(row,['player_name','playername','name','full_name']);const rank=Number(field(row,['rank','rank_ecr','rankexpert','expert_rank','overall_rank']));const pos=field(row,['position','pos']);return name&&Number.isFinite(rank)&&rank>0?{name:String(name),rank,pos:pos?String(pos).toUpperCase():''}:null}).filter(Boolean);if(mapped.length)return mapped}return[]}


const RECOMMENDED_PRESETS={
  standard:{
    name:'Standard',
    candidates:[
      ['Pat Fitzmaurice',30],
      ['Justin Boone',25],
      ['Nick Mariano',20],
      ['Sean Koerner',20],
      ['Andrew Erickson',15],
      ['Derek Brown',10]
    ],
    max:5
  },
  wr:{
    name:'WR',
    candidates:[
      ['Matt Harmon',35],
      ['Pat Fitzmaurice',30],
      ['Justin Boone',20],
      ['Nick Mariano',15],
      ['Andrew Erickson',15],
      ['Derek Brown',10]
    ],
    max:4
  },
  rb:{
    name:'RB',
    candidates:[
      ['Pat Fitzmaurice',35],
      ['Justin Boone',30],
      ['Sean Koerner',20],
      ['Nick Mariano',15],
      ['Andrew Erickson',15],
      ['Derek Brown',10]
    ],
    max:4
  },
  qb:{
    name:'QB',
    candidates:[
      ['Pat Fitzmaurice',45],
      ['Justin Boone',30],
      ['Sean Koerner',25],
      ['Andrew Erickson',15]
    ],
    max:3
  },
  te:{
    name:'TE',
    candidates:[
      ['Pat Fitzmaurice',40],
      ['Justin Boone',25],
      ['Andrew Erickson',20],
      ['Derek Brown',15],
      ['Sean Koerner',15]
    ],
    max:4
  }
};
function findExpertByName(target){
  const t=norm(target);
  let exact=experts.find(e=>norm(e.name)===t);
  if(exact)return exact;
  const parts=target.toLowerCase().split(/\s+/).filter(x=>x.length>2);
  return experts.find(e=>parts.every(p=>e.name.toLowerCase().includes(p)))||null;
}
function ensureRecommendedPanels(){
  if(!experts.length)throw new Error('Zuerst „Experten laden“ antippen.');
  const missing=new Set(),selected=[];
  for(const [id,preset] of Object.entries(RECOMMENDED_PRESETS)){
    const members={};
    for(const [name,weight] of preset.candidates){
      const expert=findExpertByName(name);
      if(expert && Object.keys(members).length<preset.max){
        members[expert.id]=weight;
        selected.push(`${preset.name}: ${expert.name}`);
      }else if(!expert){
        missing.add(name);
      }
    }
    panels[id]={name:preset.name,members};
  }
  const pat=findExpertByName('Pat Fitzmaurice');
  panels.pat={name:'Pat einzeln',members:pat?{[pat.id]:100}:{}};
  activePanelId='standard';
  positionPanels={QB:'qb',RB:'rb',WR:'wr',TE:'te'};
  panelRanks={};
  persist();
  renderAll();
  updatePresetStatus([...missing],selected);
}
function updatePresetStatus(missing=[],selected=[]){
  const configured=Object.entries(panels)
    .filter(([id])=>['standard','wr','rb','qb','te','pat'].includes(id))
    .map(([id,p])=>`${p.name}: ${Object.keys(p.members||{}).length}`)
    .join(' · ');
  const missingText=missing.length?` Nicht über FantasyPros gefunden: ${missing.join(', ')}.`:'';
  els.presetStatus.className='notice '+(configured?'ok':'warn');
  els.presetStatus.textContent=configured?`Eingerichtet: ${configured}.${missingText}`:'Noch kein Preset angewendet.';
}
function rankingsAgeHours(){
  const times=Object.values(rankCache).map(x=>Number(x?.updated)).filter(Number.isFinite);
  if(!times.length)return null;
  return (Date.now()-Math.min(...times))/3600000;
}
function updateStaleWarning(){
  const saved=Number(store.get('v60_lastRankingUpdate',0));const age=saved?(Date.now()-saved)/3600000:rankingsAgeHours();
  if(age!=null && age>24){
    els.panelStatus.className='notice warn';
    els.panelStatus.textContent=`Rankings sind ${Math.floor(age)} Stunden alt. Vor dem nächsten Mock bitte „Alle Panel-Rankings laden“ antippen.`;
  }
}

async function diagnose(){const key=els.apiKey.value.trim(),season=els.season.value.trim(),scoring=els.scoring.value;const tests=[{name:'Cloudflare-Proxy',health:true},{name:'Expertenliste',path:`/nfl/${season}/rankings/experts`},{name:'RB-Rankings',path:`/nfl/${season}/consensus-rankings?position=RB&scoring=${encodeURIComponent(scoring)}`},{name:'Spielerdaten',path:'/nfl/players'}],out=[];for(const t of tests){const start=performance.now();try{const result=t.health?await (async()=>{const r=await fetch('/api/fantasypros?health=1',{cache:'no-store'});return{status:r.status,data:await r.json()}})():await proxyCall(t.path,key);const aa=arrays(result.data);out.push({ok:true,name:t.name,status:result.status,ms:Math.round(performance.now()-start),largest:Math.max(0,...aa.map(a=>a.length)),keys:Object.keys(result.data||{}).slice(0,8)})}catch(e){out.push({ok:false,name:t.name,status:e.status||0,error:e.message})}}return out}
els.diagnoseBtn.onclick=async()=>{persist();els.diagnostic.textContent='Teste …';try{const rows=await diagnose();els.diagnostic.textContent=rows.map(x=>x.ok?`✓ ${x.name}: HTTP ${x.status} · ${x.ms} ms · Array ${x.largest} · ${x.keys.join(', ')}`:`✗ ${x.name}: ${x.error}`).join('\n');els.diagnostic.className='diagnostic '+(rows.every(x=>x.ok)?'ok':'warn')}catch(e){els.diagnostic.textContent=e.message;els.diagnostic.className='diagnostic bad'}};

async function loadExperts(){
persist();els.loadExpertsBtn.disabled=true;els.diagnostic.textContent='Lade Experten …';try{const r=await proxyCall(`/nfl/${els.season.value.trim()}/rankings/experts`,els.apiKey.value.trim());experts=extractExperts(r.data).sort((a,b)=>(b.accuracy??-999)-(a.accuracy??-999)||a.name.localeCompare(b.name));if(!experts.length)throw new Error('Keine Experten erkannt.');const pat=experts.find(e=>e.name.toLowerCase().includes('pat fitz'));if(pat&&!Object.keys(panels.pat.members).length)panels.pat.members={[pat.id]:100};persist();renderAll();updatePresetStatus();els.diagnostic.textContent=`${experts.length} Experten geladen. Du kannst jetzt das empfohlene Preset automatisch anwenden.`;els.diagnostic.className='diagnostic ok'}catch(e){els.diagnostic.textContent=`Fehler: ${e.message}`;els.diagnostic.className='diagnostic bad'}finally{els.loadExpertsBtn.disabled=false}};

els.refreshAllBtn.onclick=refreshAllData;
els.applyRecommendedBtn.onclick=()=>{try{ensureRecommendedPanels()}catch(e){els.presetStatus.textContent=e.message;els.presetStatus.className='notice bad'}};

function panelOptions(select,value){select.innerHTML='';for(const[id,p]of Object.entries(panels)){const o=new Option(p.name,id);o.selected=id===value;select.add(o)}}
function renderAll(){if(!panels[activePanelId])activePanelId=Object.keys(panels)[0];panelOptions(els.activePanel,activePanelId);for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])panelOptions(el,positionPanels[pos]||activePanelId);renderExperts();updatePanelStatus()}
function renderExperts(){const q=els.expertSearch.value.trim().toLowerCase(),members=panels[activePanelId]?.members||{};const filtered=experts.filter(e=>!q||`${e.name} ${e.site}`.toLowerCase().includes(q));if(!filtered.length){els.expertsList.className='empty';els.expertsList.textContent=experts.length?'Keine Treffer.':'Noch keine Experten geladen.';return}els.expertsList.className='';const total=Object.values(members).reduce((s,w)=>s+Number(w||0),0);els.expertsList.innerHTML=filtered.map(e=>{const w=Number(members[e.id]??25),pct=members[e.id]!=null&&total>0?Math.round(w/total*100):0;return `<div class="expert"><label><input type="checkbox" data-id="${esc(e.id)}" ${members[e.id]!=null?'checked':''}> ${esc(e.name)}<small>${esc(e.site||'Quelle unbekannt')}${e.accuracy!=null?` · Accuracy ${e.accuracy}`:''}${members[e.id]!=null?` · effektiv ${pct}%`:''}</small></label><input type="number" min="0" max="100" value="${w}" data-weight="${esc(e.id)}"></div>`}).join('')}
function updatePanelStatus(){const counts=Object.entries(panelRanks).map(([id,r])=>`${panels[id]?.name||id}: ${Object.keys(r).length}`).join(' · ');els.panelStatus.textContent=counts||'Keine Panel-Ränge gespeichert.';if(window.__skippedExperts?.length)els.panelStatus.textContent+=` · Übersprungen: ${window.__skippedExperts.join(', ')}`;els.panelStatus.className='notice '+(counts?'ok':'');updateStaleWarning()}
els.expertSearch.oninput=renderExperts;els.activePanel.onchange=()=>{saveCurrentPanel();activePanelId=els.activePanel.value;persist();renderAll()};
function saveCurrentPanel(){const p=panels[activePanelId];if(!p)return;const members={};document.querySelectorAll('[data-id]').forEach(cb=>{if(cb.checked){const id=cb.dataset.id,w=Number(document.querySelector(`[data-weight="${CSS.escape(id)}"]`)?.value||0);if(w>0)members[id]=w}});p.members=members;persist()}
els.savePanelBtn.onclick=()=>{saveCurrentPanel();els.panelStatus.textContent=`${panels[activePanelId].name}: ${Object.keys(panels[activePanelId].members).length} Experten gespeichert.`;els.panelStatus.className='notice ok'};
els.newPanelBtn.onclick=()=>{const name=prompt('Name des neuen Panels:','WR');if(!name)return;let id=norm(name)||`panel${Date.now()}`;while(panels[id])id+=Math.floor(Math.random()*10);panels[id]={name,members:{}};activePanelId=id;persist();renderAll()};
els.renamePanelBtn.onclick=()=>{const p=panels[activePanelId],name=prompt('Neuer Panelname:',p.name);if(name){p.name=name.trim();persist();renderAll()}};
els.deletePanelBtn.onclick=()=>{if(['standard','pat'].includes(activePanelId))return alert('Standard und Pat einzeln bleiben erhalten.');if(!confirm(`${panels[activePanelId].name} löschen?`))return;delete panels[activePanelId];delete panelRanks[activePanelId];for(const pos of ['QB','RB','WR','TE'])if(positionPanels[pos]===activePanelId)positionPanels[pos]='standard';activePanelId='standard';persist();renderAll()};
for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])el.onchange=()=>{positionPanels[pos]=el.value;persist()};

async function loadExpertRanks(id){if(rankCache[id]?.season===els.season.value&&rankCache[id]?.scoring===els.scoring.value&&Date.now()-rankCache[id].updated<12*3600e3)return rankCache[id].ranks;const ranks={};for(const position of ['QB','RB','WR','TE']){const path=`/nfl/${els.season.value.trim()}/rankings?position=${position}&scoring=${encodeURIComponent(els.scoring.value)}&expert_id=${encodeURIComponent(id)}`;const r=await proxyCall(path,els.apiKey.value.trim()),rows=extractRankRows(r.data);if(!rows.length)throw new Error(`Keine ${position}-Ränge für ${experts.find(e=>e.id===id)?.name||id}.`);for(const row of rows)ranks[norm(row.name)]={rank:row.rank,name:row.name,pos:row.pos||position}}rankCache[id]={season:els.season.value,scoring:els.scoring.value,updated:Date.now(),ranks};return ranks}

async function loadExpertPositionSafe(expert,position){
  const attempts=[
    {position, type:'draft'},
    {position, type:'overall'},
    {position, type:'cheatsheets'},
    {position}
  ];
  let lastError=null;
  for(const params of attempts){
    try{
      const result=await loadExpertRankings(expert,params.position,params.type);
      if(result&&Object.keys(result).length)return result;
    }catch(e){lastError=e}
  }
  return {__missing:true,__error:lastError?.message||'Keine Rangliste verfügbar'};
}

function computePanel(id){const p=panels[id],all={};for(const[eid,w0]of Object.entries(p.members||{})){const ranks=rankCache[eid]?.ranks||{},w=Number(w0);for(const[k,v]of Object.entries(ranks)){all[k]??={name:v.name,pos:v.pos,values:[]};all[k].values.push({rank:v.rank,w})}}const out={};for(const[k,v]of Object.entries(all)){const sw=v.values.reduce((s,x)=>s+x.w,0);if(!sw)continue;const mean=v.values.reduce((s,x)=>s+x.rank*x.w,0)/sw;const variance=v.values.reduce((s,x)=>s+x.w*(x.rank-mean)**2,0)/sw;out[k]={name:v.name,pos:v.pos,rank:mean,sd:Math.sqrt(variance),n:v.values.length}}assignTiers(out);return out}
function assignTiers(map){for(const pos of ['QB','RB','WR','TE']){const rows=Object.values(map).filter(x=>x.pos===pos).sort((a,b)=>a.rank-b.rank);let tier=1,prev=null;for(const row of rows){if(prev!=null&&row.rank-prev>=4)tier++;row.tier=tier;prev=row.rank}}}
els.loadRanksBtn.onclick=async()=>{saveCurrentPanel();const expertIds=[...new Set(Object.values(panels).flatMap(p=>Object.keys(p.members||{})))];if(!expertIds.length)return alert('Mindestens einen Experten auswählen.');els.loadRanksBtn.disabled=true;els.panelStatus.textContent=`Lade ${expertIds.length} Experten …`;try{let i=0;for(const id of expertIds){i++;els.panelStatus.textContent=`Lade ${i}/${expertIds.length}: ${experts.find(e=>e.id===id)?.name||id}`;await loadExpertRanks(id)}panelRanks={};for(const id of Object.keys(panels))panelRanks[id]=computePanel(id);store.set('v60_lastRankingUpdate',Date.now());store.set('v52_lastRankingUpdate',Date.now());persist();updatePanelStatus();updateQuality()}catch(e){els.panelStatus.textContent=`Fehler: ${e.message}`;els.panelStatus.className='notice bad'}finally{els.loadRanksBtn.disabled=false}};

function parseCsv(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){cell+='"';i++}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell.trim());cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());cell='';if(row.some(x=>x!==''))rows.push(row);row=[]}else cell+=c}if(cell||row.length){row.push(cell.trim());rows.push(row)}if(!rows.length)return[];const h=rows[0];return rows.slice(1).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]??''])))}
async function parseAdp(file){const text=await file.text();let rows;if(file.name.toLowerCase().endsWith('.json')){const v=JSON.parse(text);rows=Array.isArray(v)?v:(v.players||Object.values(v))}else rows=parseCsv(text);const m={};for(const row of rows){const name=field(row,['player_name','player','name','full_name']),raw=field(row,['sleeper_adp','adp_sleeper','sleeper']);const val=Number(String(raw??'').replace(',','.'));if(name&&Number.isFinite(val)&&val>0)m[norm(name)]=val}if(!Object.keys(m).length)throw new Error('Keine player_name + sleeper_adp Spalten erkannt.');return m}
els.adpFile.onchange=async()=>{try{adp=await parseAdp(els.adpFile.files[0]);persist();els.adpStatus.textContent=`${Object.keys(adp).length} Sleeper-ADPs gespeichert.`;els.adpStatus.className='notice ok';updateQuality()}catch(e){els.adpStatus.textContent=e.message;els.adpStatus.className='notice bad'}};


els.toggleKeyBtn.onclick=()=>{
  const show=els.apiKey.type==='password';
  els.apiKey.type=show?'text':'password';
  els.toggleKeyBtn.textContent=show?'Key verbergen':'Key anzeigen';
}
els.loadExpertsBtn.onclick=loadExperts;
els.clearKeyBtn.onclick=()=>{
  if(!confirm('Gespeicherten API-Key auf diesem Gerät löschen?'))return;
  els.apiKey.value='';persist();updateQuality();
};
els.backupBtn.onclick=()=>downloadJson(`draft-companion-backup-${new Date().toISOString().slice(0,10)}.json`,safeBackup());
els.restoreFile.onchange=async()=>{
  try{
    const file=els.restoreFile.files?.[0];if(!file)return;
    applyBackup(JSON.parse(await file.text()));
    els.qualityStatus.textContent='Sicherung erfolgreich eingelesen.';
    els.qualityStatus.className='notice ok';
  }catch(e){
    els.qualityStatus.textContent=`Sicherung konnte nicht gelesen werden: ${e.message}`;
    els.qualityStatus.className='notice bad';
  }finally{els.restoreFile.value=''}
};
els.clearDraftDataBtn.onclick=()=>{
  if(!confirm('Nur Draft-Link, Slot und Snapshot zurücksetzen? Rankings und ADP bleiben erhalten.'))return;
  els.draftInput.value='';els.snapshot.value='';els.draftSummary.hidden=true;els.copyBtn.disabled=true;els.shareBtn.disabled=true;
  persist();
};
els.autoRefresh.onchange=setAutoRefresh;


async function refreshAllData(){
  const btn=els.refreshAllBtn;
  try{
    if(btn){btn.disabled=true;btn.textContent='Aktualisiere …'}
    if(!experts.length)await loadExperts();
    if(!Object.values(panels).some(p=>Object.keys(p.members||{}).length))ensureRecommendedPanels();
    await loadAllPanelRanks();
    updateQuality();
  }catch(e){
    els.qualityStatus.textContent=`Aktualisierung unvollständig: ${e.message}`;
    els.qualityStatus.className='notice bad';
  }finally{
    if(btn){btn.disabled=false;btn.textContent='Alles aktualisieren'}
  }
}

const S='https://api.sleeper.app/v1';const draftId=v=>(String(v||'').match(/(\d{10,})/)||[])[1]||String(v||'').trim();async function jsonFetch(url,label){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${label}: HTTP ${r.status}`);return r.json()}async function fetchDraft(id){const[draft,picks,players]=await Promise.all([jsonFetch(`${S}/draft/${id}`,'Draft'),jsonFetch(`${S}/draft/${id}/picks`,'Picks'),jsonFetch(`${S}/players/nfl`,'Spieler')]);return{draft,picks,players}}
function pinfo(id,m,players){const p=players[id]||{};return{name:m?.first_name&&m?.last_name?`${m.first_name} ${m.last_name}`:(p.full_name||m?.player_name||id),pos:(m?.position||p.position||'?').toUpperCase(),team:(m?.team||p.team||'FA').toUpperCase(),searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null}}
function nextOwn(current,teams,slot,total){for(let p=current;p<=total;p++){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1,s=r%2?w:teams-w+1;if(s===slot)return p}return null}
function panelFor(pos){return positionPanels[pos]||activePanelId}function rankFor(name,pos){const id=panelFor(pos),r=panelRanks[id]?.[norm(name)];return r?{...r,panel:panels[id]?.name||id}:null}
function returnChance(next,playerAdp){if(!Number.isFinite(next)||!Number.isFinite(playerAdp))return null;return clamp(1/(1+Math.exp((next-playerAdp)/6)),.01,.99)}
function agreement(sd,n){if(!n||n<2)return'Einzelmeinung';if(sd<=3)return'Sehr hoch';if(sd<=7)return'Hoch';if(sd<=12)return'Mittel';return'Niedrig'}
function rosterState(mine,players){const counts={QB:0,RB:0,WR:0,TE:0},byes={QB:{},RB:{},WR:{},TE:{}};for(const pick of mine){const p=pinfo(String(pick.player_id),pick.metadata,players);if(counts[p.pos]!=null){counts[p.pos]++;if(p.bye)byes[p.pos][p.bye]=(byes[p.pos][p.bye]||0)+1}}const need={QB:counts.QB===0?8:counts.QB===1?0:-6,TE:counts.TE===0?7:counts.TE===1?0:-5,RB:counts.RB<2?8:counts.RB<4?4:counts.RB<6?1:-2,WR:counts.WR<3?8:counts.WR<5?4:counts.WR<7?1:-2};return{counts,need,byes}}
function candidateScore(p,current,next,state,available){const r=rankFor(p.name,p.pos),a=Number(adp[norm(p.name)]);if(!r)return{score:-999,r:null,a,reason:['Panel-Rang fehlt']};let score=100-clamp((r.rank-1)*.65,0,70);const reasons=[];if(Number.isFinite(a)){const delta=current-a;score+=clamp(delta*.45,-12,14);if(delta>=8)reasons.push(`Value +${Math.round(delta)}`);else if(delta<=-12)reasons.push(`Reach ${Math.abs(Math.round(delta))}`)}else reasons.push('ADP fehlt');score+=state.need[p.pos]||0;if((state.need[p.pos]||0)>=7)reasons.push(`${p.pos}-Need`);const sameTier=available.filter(x=>x.pos===p.pos&&rankFor(x.name,x.pos)?.tier===r.tier).length;if(sameTier<=2){score+=5;reasons.push(`Tier fast leer (${sameTier})`)}const agree=agreement(r.sd,r.n);if(agree==='Sehr hoch')score+=4;else if(agree==='Niedrig')score-=4;if(p.injury){score-=10;reasons.push(`Injury ${p.injury}`)}if(p.bye&&(state.byes?.[p.pos]?.[p.bye]||0)>=2){score-=1;reasons.push(`Bye ${p.bye} (nur Tiebreaker)`)}const ret=returnChance(next,a);if(ret!=null&&ret>0.8)reasons.push('Sehr hohe Return-Chance');if(ret!=null&&ret<0.25)reasons.push('Kaum Return-Chance');return{score:Math.round(clamp(score,0,100)),r,a,ret,agree,sameTier,reasons}}
function coachHtml(rows){const best=rows[0]?.score??0;const favorites=rows.filter(x=>best-x.score<=3).slice(0,4);const favoriteHtml=favorites.length?`<div class="favorite-box"><b>Favoriten für diesen Pick</b>${favorites.map(x=>`${esc(x.p.name)} (${x.p.pos}, Score ${x.score})`).join(' · ')}</div>`:'';els.coachList.innerHTML=favoriteHtml+rows.slice(0,8).map((x,i)=>`<div class="coach"><div class="coach-head"><div><h3>${i+1}. ${esc(x.p.name)} · ${x.p.pos}</h3><div class="tiny">${esc(x.r.panel)} · Tier ${x.r.tier||'–'} · ${esc(x.agree)}${x.p.bye?` · Bye ${x.p.bye}`:''}</div></div><div class="score">${x.score}</div></div><div class="metrics"><div class="metric"><b>${x.r.rank.toFixed(1)}</b><span>Panel</span></div><div class="metric"><b>${Number.isFinite(x.a)?x.a.toFixed(1):'–'}</b><span>ADP</span></div><div class="metric"><b>${x.ret!=null?Math.round(x.ret*100)+'%':'–'}</b><span>Return</span></div><div class="metric"><b>${x.r.sd.toFixed(1)}</b><span>Streuung</span></div></div><div class="tags">${x.reasons.map(r=>`<span class="tag ${r.startsWith('Reach')||r.startsWith('Injury')?'bad':r.includes('Return-Chance')?'warn':'ok'}">${esc(r)}</span>`).join('')}</div></div>`).join('')}

async function refresh(){persist();const id=draftId(els.draftInput.value);if(!id)throw new Error('Draft-ID fehlt.');els.refreshBtn.disabled=true;els.draftStatus.textContent='Lade Draft …';try{const{draft,picks,players}=await fetchDraft(id),teams=Number(draft.settings?.teams||10),rounds=Number(draft.settings?.rounds||15),slot=Number(els.slot.value),total=teams*rounds,current=Math.min(picks.length+1,total),next=nextOwn(current,teams,slot,total),mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no),drafted=new Set(picks.map(p=>String(p.player_id)));const available=Object.entries(players).filter(([pid,p])=>!drafted.has(pid)&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false).map(([pid,p])=>({id:pid,name:p.full_name,pos:p.position,team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null})).sort((a,b)=>(a.searchRank||9999)-(b.searchRank||9999)).slice(0,Number(els.topN.value));const state=rosterState(mine,players),scored=available.map(p=>({p,...candidateScore(p,current,next,state,available)})).filter(x=>x.r).sort((a,b)=>b.score-a.score);coachHtml(scored);els.teamFit.textContent=`Kader: QB ${state.counts.QB} · RB ${state.counts.RB} · WR ${state.counts.WR} · TE ${state.counts.TE}\nPriorität: ${Object.entries(state.need).sort((a,b)=>b[1]-a[1]).map(([p,n])=>`${p} ${n>=7?'hoch':n>=3?'mittel':n<0?'niedrig':'neutral'}`).join(' · ')}`;const lines=['===== SLEEPER DRAFT SNAPSHOT =====',`Draft-ID: ${id}`,`Status: ${draft.status}`,`Teams: ${teams} | Runden: ${rounds} | Mein Slot: ${slot}`,`Aktueller Pick: ${current}`,`Mein nächster Pick: ${next??'keiner'} | Picks bis dahin: ${next==null?'–':next-current}`,'','DATENSTATUS',`Panels: ${Object.keys(panelRanks).length}/${Object.keys(panels).length} geladen | Sleeper-ADP: ${Object.keys(adp).length}`,`Positionspanels: QB=${panels[positionPanels.QB]?.name} | RB=${panels[positionPanels.RB]?.name} | WR=${panels[positionPanels.WR]?.name} | TE=${panels[positionPanels.TE]?.name}`,'','TEAMSTATUS',els.teamFit.textContent,'','MEIN TEAM'];if(!mine.length)lines.push('Noch keine Picks.');for(const pick of mine){const p=pinfo(String(pick.player_id),pick.metadata,players);lines.push(`${pick.pick_no}. ${p.name} — ${p.pos}, ${p.team}`)}lines.push('','LETZTE PICKS');for(const pick of [...picks].sort((a,b)=>b.pick_no-a.pick_no).slice(0,12).reverse()){const p=pinfo(String(pick.player_id),pick.metadata,players);lines.push(`${pick.pick_no}. Slot ${pick.draft_slot}: ${p.name} — ${p.pos}, ${p.team}`)}const bestScore=scored[0]?.score??0,favorites=scored.filter(x=>bestScore-x.score<=3).slice(0,4);lines.push('','FAVORITEN FÜR DIESEN PICK');if(favorites.length)favorites.forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Score ${x.score} | ${x.r.panel} ${x.r.rank.toFixed(1)}${x.p.bye?` | Bye ${x.p.bye}`:''}`));else lines.push('Keine belastbaren Favoriten.');lines.push('','DRAFT COACH TOP 8');scored.slice(0,8).forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Score ${x.score} | ${x.r.panel} ${x.r.rank.toFixed(1)} Tier ${x.r.tier||'–'} | Streuung ${x.r.sd.toFixed(1)} (${x.agree}) | Sleeper-ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | ${x.reasons.join(', ')||'neutral'}`));lines.push('','VERFÜGBARE SPIELER');available.forEach((p,i)=>{const x=candidateScore(p,current,next,state,available),r=x.r;lines.push(`${i+1}. ${p.name} — ${p.pos}, ${p.team} | Panel ${r?r.rank.toFixed(1):'FEHLT'}${r?` Tier ${r.tier||'–'} · SD ${r.sd.toFixed(1)}`:''} | Sleeper-ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Coach ${x.score>=0?x.score:'–'}${p.injury?` | Injury ${p.injury}`:''} | search_rank ${Number.isFinite(p.searchRank)?p.searchRank:'–'} (nur Sortierung)`)});lines.push('','MODELLHINWEIS','Return ist eine transparente ADP-basierte Schätzung, keine Garantie. Draft-Coach-Scores sind Entscheidungshilfe; Expertenpanel und verifizierte Sleeper-ADP bleiben die Basis. Mock-Bot-Picks sind kein Verhalten echter Ligagegner. Bye Weeks sind nur ein kleiner Tiebreaker und niemals Ausschlusskriterium für einen klar besseren Spieler.','','HARTE REGEL','Kein großer Reach ohne konkrete aktuelle Begründung. Fehlende Panel- oder ADP-Daten ausdrücklich als Unsicherheit behandeln. K und DST werden nicht gedraftet.','','AUFGABE','Prüfe aktuelle Rankings des verwendeten Panels, Verletzungen, Depth Charts und News. Gib 1) Empfehlung, 2) 2–3 Alternativen, 3) Return-Chancen, 4) Confidence. Abweichungen vom Panel oder der Sleeper-ADP ausdrücklich begründen.');els.snapshot.value=lines.join('\n');els.draftStatus.textContent=`${picks.length} Picks geladen · ${scored.length} Kandidaten bewertet.`;els.draftStatus.className='notice ok';els.draftSummary.hidden=false;if(els.emptyCoach)els.emptyCoach.hidden=true;els.currentPick.textContent=current;els.nextPick.textContent=next??'–';els.untilPick.textContent=next==null?'–':next-current;els.copyBtn.disabled=false;els.shareBtn.disabled=false;lastFetch=new Date()}finally{els.refreshBtn.disabled=false}}
els.refreshBtn.onclick=()=>refresh().catch(e=>{els.draftStatus.textContent=`Fehler: ${e.message}`;els.draftStatus.className='notice bad'});els.copyBtn.onclick=async()=>{await navigator.clipboard.writeText(els.snapshot.value);els.copyBtn.textContent='Kopiert';setTimeout(()=>els.copyBtn.textContent='Kopieren',1200)};els.shareBtn.onclick=async()=>navigator.share?navigator.share({title:'Sleeper Draft Snapshot',text:els.snapshot.value}):navigator.clipboard.writeText(els.snapshot.value);
function status(){els.onlineState.textContent=navigator.onLine?'Online':'Offline';els.onlineState.className=navigator.onLine?'ok':'bad';els.dataAge.className=!lastFetch?'':(Date.now()-lastFetch<30000?'ok':Date.now()-lastFetch<90000?'warn':'bad');els.dataAge.textContent=!lastFetch?'–':Math.floor((Date.now()-lastFetch)/1000)<60?`${Math.floor((Date.now()-lastFetch)/1000)}s`:`${Math.floor((Date.now()-lastFetch)/60000)}m`}setInterval(status,1000);addEventListener('online',status);addEventListener('offline',status);if(Object.keys(adp).length){els.adpStatus.textContent=`${Object.keys(adp).length} Sleeper-ADPs gespeichert.`;els.adpStatus.className='notice ok'}renderAll();updatePresetStatus();updateQuality();updateStaleWarning();setAutoRefresh();status();
