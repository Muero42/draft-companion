const $=id=>document.getElementById(id);
const els=Object.fromEntries(['apiKey','season','scoring','diagnoseBtn','loadExpertsBtn','diagnostic','panelName','expertsList','savePanelBtn','loadRanksBtn','panelStatus','adpFile','adpStatus','draftInput','slot','topN','refreshBtn','draftStatus','draftSummary','currentPick','nextPick','untilPick','snapshot','copyBtn','shareBtn','onlineState','dataAge'].map(id=>[id,$(id)]));

const store={
  get(k,f=null){try{const v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch{return f}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))},
  text(k,f=''){return localStorage.getItem(k)??f},
  setText(k,v){localStorage.setItem(k,v)}
};
const normName=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');

let experts=store.get('v41_experts',[]);
let panel=store.get('v41_panel',{name:'Standard',members:{}});
let panelRanks=store.get('v41_panelRanks',{});
let adp=store.get('v41_sleeperAdp',{});
let lastFetch=null;

els.apiKey.value=store.text('v41_apiKey','');
els.season.value=store.text('v41_season','2026');
els.scoring.value=store.text('v41_scoring','HALF');
els.panelName.value=panel.name||'Standard';
els.draftInput.value=store.text('v41_draft','');
for(let i=1;i<=16;i++) els.slot.add(new Option(i,i));
els.slot.value=store.text('v41_slot','9');

function persist(){
  store.setText('v41_apiKey',els.apiKey.value.trim());
  store.setText('v41_season',els.season.value.trim());
  store.setText('v41_scoring',els.scoring.value);
  store.setText('v41_draft',els.draftInput.value.trim());
  store.setText('v41_slot',els.slot.value);
  store.set('v41_experts',experts);store.set('v41_panel',panel);store.set('v41_panelRanks',panelRanks);store.set('v41_sleeperAdp',adp);
}

async function proxyCall(path,key){
  const response=await fetch(`/api/fantasypros?path=${encodeURIComponent(path)}`,{headers:{'x-fp-key':key},cache:'no-store'});
  const text=await response.text();let data;
  try{data=JSON.parse(text)}catch{data={raw:text.slice(0,1200)}}
  if(!response.ok){const error=new Error(data?.error||data?.message||`HTTP ${response.status}`);error.status=response.status;error.payload=data;throw error}
  return {data,status:response.status,upstream:response.headers.get('x-upstream-status')};
}

function findArrays(value,depth=0){
  if(depth>4||value==null) return [];
  if(Array.isArray(value)) return [value];
  if(typeof value!=='object') return [];
  return Object.values(value).flatMap(v=>findArrays(v,depth+1));
}
function field(obj,names){
  const keys=Object.keys(obj||{});
  for(const name of names){
    const target=name.toLowerCase().replace(/[^a-z0-9]/g,'');
    const key=keys.find(k=>k.toLowerCase().replace(/[^a-z0-9]/g,'')===target);
    if(key&&obj[key]!==''&&obj[key]!=null) return obj[key];
  }
  return null;
}
function extractExperts(payload){
  const arrays=findArrays(payload).sort((a,b)=>b.length-a.length);
  for(const rows of arrays){
    const mapped=rows.map(row=>{
      const id=field(row,['expert_id','expertid','id']);
      const name=field(row,['expert_name','expertname','name','full_name']);
      const site=field(row,['site_name','sitename','site','affiliation']);
      return id&&name?{id:String(id),name:String(name),site:site?String(site):''}:null;
    }).filter(Boolean);
    if(mapped.length) return [...new Map(mapped.map(x=>[x.id,x])).values()];
  }
  return [];
}
function extractRankRows(payload){
  const arrays=findArrays(payload).sort((a,b)=>b.length-a.length);
  for(const rows of arrays){
    const mapped=rows.map(row=>{
      const name=field(row,['player_name','playername','name','full_name']);
      const rank=Number(field(row,['rank','rank_ecr','rankexpert','expert_rank','overall_rank']));
      const pos=field(row,['position','pos']);
      return name&&Number.isFinite(rank)&&rank>0?{name:String(name),rank,pos:pos?String(pos).toUpperCase():''}:null;
    }).filter(Boolean);
    if(mapped.length) return mapped;
  }
  return [];
}

async function diagnose(){
  const key=els.apiKey.value.trim(),season=els.season.value.trim(),scoring=els.scoring.value;
  const tests=[
    {name:'Cloudflare-Proxy',health:true},
    {name:'Expertenliste',path:`/nfl/${season}/rankings/experts`},
    {name:'RB-Rankings',path:`/nfl/${season}/consensus-rankings?position=RB&scoring=${encodeURIComponent(scoring)}`},
    {name:'Spielerdaten',path:'/nfl/players'}
  ];
  const rows=[];
  for(const test of tests){
    const start=performance.now();
    try{
      let result;
      if(test.health){
        const r=await fetch('/api/fantasypros?health=1',{cache:'no-store'});result={status:r.status,data:await r.json()};
      }else result=await proxyCall(test.path,key);
      const arrays=findArrays(result.data);const largest=Math.max(0,...arrays.map(a=>a.length));
      rows.push({ok:true,name:test.name,status:result.status,ms:Math.round(performance.now()-start),largest,keys:Object.keys(result.data||{}).slice(0,8)});
    }catch(error){rows.push({ok:false,name:test.name,status:error.status||0,ms:Math.round(performance.now()-start),error:error.message,detail:error.payload?.detail||''})}
  }
  return rows;
}
function diagText(rows){
  return rows.map(x=>x.ok
    ?`✓ ${x.name}: HTTP ${x.status} · ${x.ms} ms · größtes Array ${x.largest} · Felder ${x.keys.join(', ')||'–'}`
    :`✗ ${x.name}: ${x.error}${x.status?` · HTTP ${x.status}`:''}${x.detail?` · ${x.detail}`:''}`
  ).join('\n');
}

els.diagnoseBtn.onclick=async()=>{
  persist();els.diagnostic.className='diagnostic';els.diagnostic.textContent='Teste Cloudflare-Proxy und FantasyPros …';els.diagnoseBtn.disabled=true;
  try{const rows=await diagnose();els.diagnostic.textContent=diagText(rows);els.diagnostic.className='diagnostic '+(rows.every(x=>x.ok)?'ok':'warn')}
  catch(error){els.diagnostic.textContent=`Diagnosefehler: ${error.message}`;els.diagnostic.className='diagnostic bad'}
  finally{els.diagnoseBtn.disabled=false}
};

els.loadExpertsBtn.onclick=async()=>{
  persist();const key=els.apiKey.value.trim(),season=els.season.value.trim();els.diagnostic.textContent='Lade Expertenliste …';els.loadExpertsBtn.disabled=true;
  try{
    const result=await proxyCall(`/nfl/${season}/rankings/experts`,key);
    experts=extractExperts(result.data);
    if(!experts.length) throw new Error(`Antwort erhalten, aber keine Experten erkannt. Oberste Felder: ${Object.keys(result.data||{}).join(', ')||'keine'}`);
    persist();renderExperts();els.diagnostic.textContent=`${experts.length} Experten geladen.`;els.diagnostic.className='diagnostic ok';
  }catch(error){els.diagnostic.textContent=`Fehler: ${error.message}`;els.diagnostic.className='diagnostic bad'}
  finally{els.loadExpertsBtn.disabled=false}
};

function renderExperts(){
  if(!experts.length){els.expertsList.className='empty';els.expertsList.textContent='Noch keine Experten geladen.';return}
  els.expertsList.className='';
  els.expertsList.innerHTML=experts.map(e=>`<div class="expert"><label><input type="checkbox" data-id="${escapeHtml(e.id)}" ${panel.members[e.id]!=null?'checked':''}> ${escapeHtml(e.name)}${e.site?` · ${escapeHtml(e.site)}`:''}</label><input type="number" min="0" max="100" value="${panel.members[e.id]??25}" data-weight="${escapeHtml(e.id)}" aria-label="Gewicht"></div>`).join('');
}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
renderExperts();

els.savePanelBtn.onclick=()=>{
  const members={};document.querySelectorAll('[data-id]').forEach(cb=>{if(cb.checked){const id=cb.dataset.id;const weight=Number(document.querySelector(`[data-weight="${CSS.escape(id)}"]`)?.value||0);if(weight>0)members[id]=weight}});
  panel={name:els.panelName.value.trim()||'Standard',members};persist();els.panelStatus.textContent=`Panel gespeichert: ${Object.keys(members).length} Experten.`;els.panelStatus.className='notice ok';
};

async function loadExpertRanks(expertId){
  const key=els.apiKey.value.trim(),season=els.season.value.trim(),scoring=els.scoring.value;
  const candidates=[];
  for(const position of ['QB','RB','WR','TE']){
    candidates.push(`/nfl/${season}/rankings?position=${position}&scoring=${encodeURIComponent(scoring)}&expert_id=${encodeURIComponent(expertId)}`);
  }
  const result={};
  for(const path of candidates){
    const response=await proxyCall(path,key);const rows=extractRankRows(response.data);
    if(!rows.length) throw new Error(`Keine Rankings im Endpunkt ${path} erkannt.`);
    for(const row of rows) result[normName(row.name)]={rank:row.rank,name:row.name,pos:row.pos};
  }
  return result;
}

els.loadRanksBtn.onclick=async()=>{
  els.savePanelBtn.click();const ids=Object.keys(panel.members);if(!ids.length){alert('Mindestens einen Experten auswählen.');return}
  els.panelStatus.textContent='Lade und kombiniere Rankings …';els.panelStatus.className='notice';els.loadRanksBtn.disabled=true;
  try{
    const weighted={};
    for(const id of ids){
      const weight=Number(panel.members[id]);if(weight<=0)continue;
      const ranks=await loadExpertRanks(id);
      for(const [key,value] of Object.entries(ranks)){
        weighted[key]??={sum:0,weight:0,name:value.name,pos:value.pos};weighted[key].sum+=value.rank*weight;weighted[key].weight+=weight;
      }
    }
    panelRanks={};for(const [key,value] of Object.entries(weighted)){if(value.weight)panelRanks[key]={rank:value.sum/value.weight,name:value.name,pos:value.pos}}
    persist();els.panelStatus.textContent=`${Object.keys(panelRanks).length} gewichtete Panel-Ränge geladen.`;els.panelStatus.className='notice ok';
  }catch(error){els.panelStatus.textContent=`Fehler: ${error.message}`;els.panelStatus.className='notice bad'}
  finally{els.loadRanksBtn.disabled=false}
};

function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const char=text[i],next=text[i+1];
    if(char==='"'&&quoted&&next==='"'){cell+='"';i++}
    else if(char==='"')quoted=!quoted;
    else if(char===','&&!quoted){row.push(cell.trim());cell=''}
    else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell.trim());cell='';if(row.some(x=>x!==''))rows.push(row);row=[]}
    else cell+=char;
  }
  if(cell||row.length){row.push(cell.trim());rows.push(row)}
  if(!rows.length)return[];const headers=rows[0];return rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function getField(obj,names){const keys=Object.keys(obj||{});for(const n of names){const target=n.toLowerCase().replace(/[^a-z0-9]/g,'');const key=keys.find(k=>k.toLowerCase().replace(/[^a-z0-9]/g,'')===target);if(key&&obj[key]!==''&&obj[key]!=null)return obj[key]}return null}
async function parseAdpFile(file){
  const text=await file.text();let rows;
  if(file.name.toLowerCase().endsWith('.json')){const value=JSON.parse(text);rows=Array.isArray(value)?value:(value.players||Object.values(value))}else rows=parseCsv(text);
  const map={};for(const row of rows){const name=getField(row,['player_name','player','name','full_name']);const raw=getField(row,['sleeper_adp','adp_sleeper','sleeper']);const value=Number(String(raw??'').replace(',','.'));if(name&&Number.isFinite(value)&&value>0)map[normName(name)]=value}
  if(!Object.keys(map).length)throw new Error('Keine Spalten player_name + sleeper_adp erkannt.');return map;
}
els.adpFile.onchange=async()=>{
  try{adp=await parseAdpFile(els.adpFile.files[0]);persist();els.adpStatus.textContent=`${Object.keys(adp).length} verifizierte Sleeper-ADPs importiert.`;els.adpStatus.className='notice ok'}
  catch(error){els.adpStatus.textContent=error.message;els.adpStatus.className='notice bad'}
};
if(Object.keys(adp).length){els.adpStatus.textContent=`${Object.keys(adp).length} verifizierte Sleeper-ADPs gespeichert.`;els.adpStatus.className='notice ok'}
if(Object.keys(panelRanks).length){els.panelStatus.textContent=`${Object.keys(panelRanks).length} Panel-Ränge gespeichert.`;els.panelStatus.className='notice ok'}

const SLEEPER='https://api.sleeper.app/v1';
function draftId(value){return (String(value||'').match(/(\d{10,})/)||[])[1]||String(value||'').trim()}
async function fetchJson(url,label){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`${label}: HTTP ${response.status}`);return response.json()}
async function fetchDraft(id){const [draft,picks,players]=await Promise.all([fetchJson(`${SLEEPER}/draft/${id}`,'Draft'),fetchJson(`${SLEEPER}/draft/${id}/picks`,'Picks'),fetchJson(`${SLEEPER}/players/nfl`,'Spieler')]);return{draft,picks,players}}
function playerInfo(id,meta,players){const p=players?.[id]||{};return{name:meta?.first_name&&meta?.last_name?`${meta.first_name} ${meta.last_name}`:(p.full_name||meta?.player_name||id),pos:(meta?.position||p.position||'?').toUpperCase(),team:(meta?.team||p.team||'FA').toUpperCase(),searchRank:Number(p.search_rank),injury:p.injury_status||null}}
function nextOwnPick(current,teams,slot,total){for(let p=current;p<=total;p++){const round=Math.floor((p-1)/teams)+1,within=((p-1)%teams)+1,draftSlot=round%2?within:teams-within+1;if(draftSlot===slot)return p}return null}
function valueText(current,playerAdp){if(!Number.isFinite(playerAdp))return'ADP FEHLT';const delta=Math.round(playerAdp-current);if(delta>=15)return`WARTEN: ${delta} Picks vor ADP`;if(delta>=8)return`Reach: ${delta} Picks vor ADP`;if(delta<=-15)return`Elite Value: ${Math.abs(delta)} Picks gefallen`;if(delta<=-8)return`Value: ${Math.abs(delta)} Picks gefallen`;return'Fair zum ADP'}

async function refresh(){
  persist();const id=draftId(els.draftInput.value);if(!id)throw new Error('Draft-ID fehlt.');els.draftStatus.textContent='Lade Draft …';els.refreshBtn.disabled=true;
  try{
    const {draft,picks,players}=await fetchDraft(id);const teams=Number(draft.settings?.teams||10),rounds=Number(draft.settings?.rounds||15),slot=Number(els.slot.value),total=teams*rounds,current=Math.min(picks.length+1,total),next=nextOwnPick(current,teams,slot,total);
    const mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no);const drafted=new Set(picks.map(p=>String(p.player_id)));
    const available=Object.entries(players).filter(([pid,p])=>!drafted.has(pid)&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false).map(([pid,p])=>[pid,{name:p.full_name,pos:p.position,team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null}]).sort((a,b)=>(a[1].searchRank||9999)-(b[1].searchRank||9999)).slice(0,Number(els.topN.value));
    const lines=[];lines.push('===== SLEEPER DRAFT SNAPSHOT =====',`Draft-ID: ${id}`,`Status: ${draft.status}`,`Teams: ${teams} | Runden: ${rounds} | Mein Slot: ${slot}`,`Aktueller Pick: ${current}`,`Mein nächster Pick: ${next??'keiner'} | Picks bis dahin: ${next==null?'–':next-current}`,'','DATENSTATUS',`Panel: ${panel.name} | Panel-Ränge: ${Object.keys(panelRanks).length}`,`Verifizierte Sleeper-ADP: ${Object.keys(adp).length}`,'','MEIN TEAM');
    if(!mine.length)lines.push('Noch keine Picks.');for(const pick of mine){const p=playerInfo(String(pick.player_id),pick.metadata,players);lines.push(`${pick.pick_no}. ${p.name} — ${p.pos}, ${p.team}`)}
    lines.push('','LETZTE PICKS');for(const pick of [...picks].sort((a,b)=>b.pick_no-a.pick_no).slice(0,12).reverse()){const p=playerInfo(String(pick.player_id),pick.metadata,players);lines.push(`${pick.pick_no}. Slot ${pick.draft_slot}: ${p.name} — ${p.pos}, ${p.team}`)}
    lines.push('','VERFÜGBARE SPIELER');available.forEach(([,p],index)=>{const key=normName(p.name),rank=panelRanks[key]?.rank,playerAdp=Number(adp[key]);lines.push(`${index+1}. ${p.name} — ${p.pos}, ${p.team} | Panel ${Number.isFinite(rank)?rank.toFixed(1):'FEHLT'} | Sleeper-ADP ${Number.isFinite(playerAdp)?playerAdp.toFixed(1):'FEHLT'} | ${valueText(current,playerAdp)}${p.injury?` | Injury ${p.injury}`:''} | search_rank ${Number.isFinite(p.searchRank)?p.searchRank:'–'} (nur Sortierung)`)});
    lines.push('','HARTE REGEL','search_rank ist keine ADP. Keine Empfehlung ohne Panel-Rang und verifizierte Sleeper-ADP ohne ausdrücklichen Unsicherheitshinweis. Reaches über 15 Picks nur mit außergewöhnlicher aktueller Begründung.','','AUFGABE','Prüfe aktuelle Verletzungen, Depth Charts, Camp-News sowie Breakout-/Sleeper-/League-Winner-Analysen. Gib Empfehlung, 2–3 Alternativen, Return-Chancen und Confidence. Abweichungen vom Panel ausdrücklich begründen.');
    els.snapshot.value=lines.join('\n');els.draftStatus.textContent=`${picks.length} Picks geladen.`;els.draftStatus.className='notice ok';els.draftSummary.hidden=false;els.currentPick.textContent=current;els.nextPick.textContent=next??'–';els.untilPick.textContent=next==null?'–':next-current;els.copyBtn.disabled=false;els.shareBtn.disabled=false;lastFetch=new Date();return els.snapshot.value;
  }finally{els.refreshBtn.disabled=false}
}
els.refreshBtn.onclick=()=>refresh().catch(error=>{els.draftStatus.textContent=`Fehler: ${error.message}`;els.draftStatus.className='notice bad'});
els.copyBtn.onclick=async()=>{await navigator.clipboard.writeText(els.snapshot.value);els.copyBtn.textContent='Kopiert';setTimeout(()=>els.copyBtn.textContent='Kopieren',1200)};
els.shareBtn.onclick=async()=>{if(navigator.share)await navigator.share({title:'Sleeper Draft Snapshot',text:els.snapshot.value});else await navigator.clipboard.writeText(els.snapshot.value)};

function updateStatus(){els.onlineState.textContent=navigator.onLine?'Online':'Offline';els.onlineState.className=navigator.onLine?'ok':'bad';if(!lastFetch)els.dataAge.textContent='–';else{const seconds=Math.floor((Date.now()-lastFetch)/1000);els.dataAge.textContent=seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m`}}
setInterval(updateStatus,1000);window.addEventListener('online',updateStatus);window.addEventListener('offline',updateStatus);updateStatus();
