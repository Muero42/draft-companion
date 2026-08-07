const $=id=>document.getElementById(id);
const ids=['onlineState','rankingAge','adpCount','qualityMini','apiQuickStatus','qualityStatus','panelSummary','dataSection','draftSection','coachSection','loadExpertsBtn','applyPresetBtn','loadAllRanksBtn','refreshAllBtn','presetStatus','panelStatus','adpFile','adpStatus','draftInput','slot','topN','snapshotMode','refreshBtn','copyBtn','shareBtn','autoRefresh','draftStatus','draftSummary','teamSummary','favoritesBlock','coachList','snapshot','emptyCoach','logDecisionBtn','clearLogBtn','mockReview','decisionLog','apiKey','toggleKeyBtn','clearKeyBtn','season','scoring','activePanel','diagnoseBtn','diagnostic','expertSearch','expertsList','savePanelBtn','newPanelBtn','renamePanelBtn','deletePanelBtn','qbPanel','rbPanel','wrPanel','tePanel','backupBtn','restoreFile','clearDraftDataBtn'];
const els=Object.fromEntries(ids.map(id=>[id,$(id)]));
const store={get(k,f=null){try{const v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch{return f}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},text(k,f=''){return localStorage.getItem(k)??f},setText(k,v){localStorage.setItem(k,v)}};
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

let experts=store.get('v7_experts',[]);
let panels=store.get('v7_panels',{standard:{name:'Standard',members:{}},pat:{name:'Pat einzeln',members:{}}});
let activePanelId=store.text('v7_activePanel','standard');
let positionPanels=store.get('v7_positionPanels',{QB:'qb',RB:'rb',WR:'wr',TE:'te'});
let rankCache=store.get('v7_rankCache',{});
let panelRanks=store.get('v7_panelRanks',{});
let adp=store.get('v7_adp',{});let adpMeta=store.get('v72_adpMeta',{source:'none',updated:0,count:0});
let decisionLog=store.get('v7_decisionLog',[]);
let lastDraftContext=null;
let autoTimer=null;

els.apiKey.value=store.text('v7_apiKey','');
els.season.value=store.text('v7_season','2026');
els.scoring.value=store.text('v7_scoring','HALF');
els.draftInput.value=store.text('v7_draft','');
els.autoRefresh.checked=store.get('v7_autoRefresh',false);
for(let i=1;i<=16;i++)els.slot.add(new Option(i,i));
els.slot.value=store.text('v7_slot','9');
els.topN.value=store.text('v7_topN','35');
els.snapshotMode.value=store.text('v7_snapshotMode','compact');

function persist(){
  store.setText('v7_apiKey',els.apiKey.value.trim());store.setText('v7_season',els.season.value.trim());store.setText('v7_scoring',els.scoring.value);
  store.setText('v7_draft',els.draftInput.value.trim());store.setText('v7_slot',els.slot.value);store.setText('v7_topN',els.topN.value);store.setText('v7_snapshotMode',els.snapshotMode.value);
  store.set('v7_autoRefresh',els.autoRefresh.checked);store.set('v7_experts',experts);store.set('v7_panels',panels);store.setText('v7_activePanel',activePanelId);
  store.set('v7_positionPanels',positionPanels);store.set('v7_rankCache',rankCache);store.set('v7_panelRanks',panelRanks);store.set('v7_adp',adp);store.set('v72_adpMeta',adpMeta);store.set('v7_decisionLog',decisionLog);
}

async function proxyCall(path){
  const key=els.apiKey.value.trim();if(!key)throw new Error('API-Key fehlt.');
  const r=await fetch(`/api/fantasypros?path=${encodeURIComponent(path)}`,{headers:{'x-fp-key':key},cache:'no-store'});
  const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text.slice(0,1200)}}
  if(!r.ok){const e=new Error(data?.error||data?.message||`HTTP ${r.status}`);e.status=r.status;throw e}return data;
}
function expertSlug(name){
  return String(name||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
async function fetchPublicExpertRanking(expert){
  const slug=expertSlug(expert?.name);
  if(!slug)throw new Error('Expertenname fehlt.');
  const r=await fetch(`/api/fp-public-ranking?expert=${encodeURIComponent(slug)}&season=${encodeURIComponent(els.season.value.trim())}&scoring=${encodeURIComponent(els.scoring.value)}`,{cache:'no-store'});
  const data=await r.json();
  if(!r.ok)throw new Error(data?.error||`FantasyPros Public HTTP ${r.status}`);
  if(!Array.isArray(data.players)||data.players.length<40)throw new Error(`${expert?.name||slug}: öffentliche Rangliste unvollständig (${data.players?.length||0}).`);
  return data;
}

function arrays(v,d=0){if(d>5||v==null)return[];if(Array.isArray(v))return[v];if(typeof v!=='object')return[];return Object.values(v).flatMap(x=>arrays(x,d+1))}
function field(o,names){const keys=Object.keys(o||{});for(const n of names){const t=n.toLowerCase().replace(/[^a-z0-9]/g,'');const k=keys.find(x=>x.toLowerCase().replace(/[^a-z0-9]/g,'')===t);if(k&&o[k]!==''&&o[k]!=null)return o[k]}return null}
function extractExperts(payload){for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){const m=rows.map(row=>{const id=field(row,['expert_id','expertid','id']),name=field(row,['expert_name','expertname','name','full_name']),site=field(row,['site_name','sitename','site','affiliation']);const accuracy=Number(field(row,['accuracy_draft_season','accuracy','draft_accuracy']));return id&&name?{id:String(id),name:String(name),site:String(site||''),accuracy:Number.isFinite(accuracy)?accuracy:null}:null}).filter(Boolean);if(m.length)return[...new Map(m.map(x=>[x.id,x])).values()]}return[]}
function extractRankRows(payload){
  for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){
    const m=rows.map(row=>{
      const name=field(row,['player_name','playername','name','full_name']);
      const rank=Number(field(row,['rank_ecr','overall_rank','expert_rank','rankexpert','rank']));
      let posRankRaw=field(row,['pos_rank','rank_ecr_pos','rank_position','position_rank','rank_pos','rank_pos_ecr']);
      if(typeof posRankRaw==='string'){const hit=posRankRaw.match(/(\d+(?:\.\d+)?)/);posRankRaw=hit?hit[1]:posRankRaw}
      const posRank=Number(posRankRaw);
      const pos=String(field(row,['player_position_id','position_id','position','pos'])||'').toUpperCase().replace(/[0-9]/g,'');
      return name&&Number.isFinite(rank)&&rank>0?{name:String(name),rank,posRank:Number.isFinite(posRank)&&posRank>0?posRank:null,pos}:null
    }).filter(Boolean);
    if(m.length)return m
  }
  return []
}
function filteredForExpert(payload,expertId){
  const ids=String(payload?.filters??'').match(/\d+/g)||[];
  const total=Number(payload?.total_experts);
  return ids.includes(String(expertId)) && (!Number.isFinite(total)||total===1);
}
function extractSingleExpertRows(payload,expertId){
  const filtered=filteredForExpert(payload,expertId);

  for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){
    const m=rows.map(row=>{
      const name=field(row,['player_name','playername','name','full_name']);
      if(!name)return null;

      const min=Number(field(row,['rank_min','min_rank','rankmin']));
      const max=Number(field(row,['rank_max','max_rank','rankmax']));
      const hasCollapsedRange=Number.isFinite(min)&&Number.isFinite(max)&&min>0&&Math.abs(min-max)<=.001;

      // Critical v9.0.6 fix:
      // rank_ecr is the consensus/ECR column, not necessarily the selected expert's rank.
      // When FantasyPros confirms a single-expert filter, only trust the collapsed
      // rank_min/rank_max value as the individual expert rank.
      let rank=null;
      if(filtered && hasCollapsedRange)rank=min;
      else if(!filtered && hasCollapsedRange)rank=min;
      else return null;

      let posRankRaw=field(row,['pos_rank','rank_ecr_pos','rank_position','position_rank','rank_pos','rank_pos_ecr']);
      if(typeof posRankRaw==='string'){
        const hit=posRankRaw.match(/(\d+(?:\.\d+)?)/);
        posRankRaw=hit?hit[1]:posRankRaw;
      }
      const posRank=Number(posRankRaw);
      const pos=String(field(row,['player_position_id','position_id','position','pos'])||'').toUpperCase().replace(/[0-9]/g,'');

      return {
        name:String(name),
        rank,
        posRank:Number.isFinite(posRank)&&posRank>0?posRank:null,
        pos,
        source:'expert-range'
      };
    }).filter(Boolean);

    if(m.length>=25)return m;
  }
  return [];
}

function derivePositionRanks(rows){
  const groups={QB:[],RB:[],WR:[],TE:[]};
  for(const row of rows){
    if(groups[row.pos])groups[row.pos].push(row);
  }
  const map={};
  for(const [pos,list] of Object.entries(groups)){
    list.sort((a,b)=>a.rank-b.rank).forEach((row,i)=>{
      map[norm(row.name)]={...row,pos,posRank:row.posRank||i+1};
    });
  }
  return map;
}
async function fetchExpertOverall(expertId){
  const season=els.season.value.trim(),
    scoring=encodeURIComponent(els.scoring.value),
    eid=encodeURIComponent(expertId);

  const attempts=[
    `/nfl/${season}/rankings?week=0&position=ALL&scoring=${scoring}&ranking_type=DRAFT&filters=${eid}&range=true&rankstats=true&experts=show`,
    `/nfl/${season}/rankings?week=0&position=ALL&scoring=${scoring}&type=DRAFT&filters=${eid}&range=true&rankstats=true&experts=show`,
    `/nfl/${season}/rankings?week=0&filters=${eid}&range=true&rankstats=true&experts=show`,
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&type=DRAFT&filters=${eid}&experts=show`
  ];

  let last=null;
  for(const path of attempts){
    try{
      const data=await proxyCall(path);
      const rows=extractSingleExpertRows(data,expertId);
      if(rows.length)return rows;
    }catch(e){last=e}
  }
  if(last)throw last;
  throw new Error('FantasyPros lieferte kein verifizierbares Einzelranking für diesen Experten.');
}
async function fetchExpertPosition(expertId,pos){
  // Position ranks are derived from the verified overall list to avoid mixing in a consensus response.
  const rows=await fetchExpertOverall(expertId);
  return rows.filter(x=>x.pos===pos).sort((a,b)=>a.rank-b.rank).map((x,i)=>({...x,posRank:i+1}));
}

function sourceMentionsSleeper(payload){
  const text=JSON.stringify(payload).toLowerCase();
  return text.includes('"sleeper"')||text.includes('sleeper adp')||text.includes('sleeper_adp');
}
function extractSleeperAdp(payload){
  const out={};
  for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){
    for(const row of rows){
      const name=field(row,['player_name','playername','name','full_name']);
      if(!name)continue;
      let raw=field(row,['sleeper_adp','adp_sleeper','sleeper']);
      if(raw==null){
        const source=String(field(row,['source','site','provider','platform','adp_source'])||'').toLowerCase();
        if(source.includes('sleeper'))raw=field(row,['adp','average_draft_position','rank_adp','avg_pick']);
      }
      const value=Number(String(raw??'').replace(',','.'));
      if(Number.isFinite(value)&&value>0)out[norm(name)]=value;
    }
    if(Object.keys(out).length>=50)return out;
  }
  return out;
}

function sleeperAdpValue(row){
  const stats=row?.stats||row?.projection||row?.projections||{};
  for(const raw of [
    field(row,['adp_half_ppr','adp_half','half_ppr_adp','adp_hppr','adp']),
    field(stats,['adp_half_ppr','adp_half','half_ppr_adp','adp_hppr','adp'])
  ]){
    const v=Number(String(raw??'').replace(',','.'));
    if(Number.isFinite(v)&&v>0)return v;
  }
  return null;
}
function sleeperProjectionName(row){
  return field(row,['player_name','full_name','name'])||
    [field(row,['first_name']),field(row,['last_name'])].filter(Boolean).join(' ')||
    field(row?.player||{},['full_name','player_name','name']);
}
async function loadSleeperAdpDirect(){
  const season=els.season.value.trim();
  try{
    const r=await fetch(`/api/sleeper-adp?season=${encodeURIComponent(season)}&format=half_ppr`,{cache:'no-store'});
    const data=await r.json();
    if(!r.ok)throw new Error(data?.error||`HTTP ${r.status}`);
    const values={};
    for(const row of data.players||[]){
      const v=Number(row.adp);
      if(row.name&&Number.isFinite(v)&&v>0&&v<999)values[norm(row.name)]=v;
    }
    if(Object.keys(values).length>=50){
      adp=values;
      adpMeta={source:'Sleeper Draft ADP (half-PPR)',updated:Date.now(),count:Object.keys(values).length};
      persist();
      return {ok:true,count:Object.keys(values).length};
    }
    return {ok:false,count:Object.keys(values).length,errors:['Sleeper lieferte zu wenige ADP-Werte.']};
  }catch(e){
    return {ok:false,count:0,errors:[e.message]};
  }
}

async function loadSleeperAdpFromFantasyPros(){
  const season=els.season.value.trim(),scoring=encodeURIComponent(els.scoring.value);
  const attempts=[
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&type=ADP&source=SLEEPER`,
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&ranking_type=ADP&source=SLEEPER`,
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&type=ADP`,
    `/nfl/${season}/rankings?position=ALL&scoring=${scoring}&type=ADP&source=SLEEPER`
  ];
  const errors=[];
  for(const path of attempts){
    try{
      const data=await proxyCall(path);
      const values=extractSleeperAdp(data);
      if(Object.keys(values).length>=50 && (sourceMentionsSleeper(data)||path.includes('source=SLEEPER'))){
        adp=values;
        adpMeta={source:'FantasyPros / Sleeper',updated:Date.now(),count:Object.keys(values).length};
        persist();
        return {ok:true,count:Object.keys(values).length,path};
      }
    }catch(e){errors.push(e.message)}
  }
  return {ok:false,count:0,errors};
}


const PRESETS={
  standard:{name:'Standard',list:[['Pat Fitzmaurice',30],['Justin Boone',25],['Sean Koerner',20],['Andrew Erickson',15],['Derek Brown',10]],max:5},
  rb:{name:'RB',list:[['Pat Fitzmaurice',35],['Justin Boone',30],['Sean Koerner',20],['Andrew Erickson',15],['Derek Brown',10]],max:4},
  wr:{name:'WR',list:[['Matt Harmon',35],['Pat Fitzmaurice',30],['Justin Boone',20],['Andrew Erickson',15],['Derek Brown',10]],max:4},
  qb:{name:'QB',list:[['Pat Fitzmaurice',45],['Justin Boone',30],['Sean Koerner',25],['Andrew Erickson',15]],max:3},
  te:{name:'TE',list:[['Pat Fitzmaurice',40],['Justin Boone',25],['Andrew Erickson',20],['Derek Brown',15],['Sean Koerner',15]],max:4}
};
function findExpert(name){const n=norm(name);return experts.find(e=>norm(e.name)===n)||experts.find(e=>name.toLowerCase().split(/\s+/).filter(x=>x.length>2).every(p=>e.name.toLowerCase().includes(p)))}
function applyPreset(){if(!experts.length)throw new Error('Zuerst Experten laden.');const missing=[];for(const[id,p]of Object.entries(PRESETS)){const members={};for(const[name,w]of p.list){const e=findExpert(name);if(e&&Object.keys(members).length<p.max)members[e.id]=w;else if(!e)missing.push(name)}panels[id]={name:p.name,members}}const pat=findExpert('Pat Fitzmaurice');panels.pat={name:'Pat einzeln',members:pat?{[pat.id]:100}:{}};positionPanels={QB:'qb',RB:'rb',WR:'wr',TE:'te'};activePanelId='standard';panelRanks={};persist();renderAll();els.presetStatus.className='notice ok';els.presetStatus.textContent=`Preset eingerichtet.${missing.length?` Nicht gefunden: ${[...new Set(missing)].join(', ')}.`:''}`}

function panelOptions(el,value){el.innerHTML='';for(const[id,p]of Object.entries(panels)){const o=new Option(p.name,id);o.selected=id===value;el.add(o)}}
function renderAll(){if(!panels[activePanelId])activePanelId='standard';panelOptions(els.activePanel,activePanelId);for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])panelOptions(el,positionPanels[pos]||activePanelId);renderExperts();renderLog();updateStatus()}
function renderExperts(){const q=els.expertSearch.value.trim().toLowerCase(),members=panels[activePanelId]?.members||{},total=Object.values(members).reduce((s,w)=>s+Number(w||0),0);const list=experts.filter(e=>!q||`${e.name} ${e.site}`.toLowerCase().includes(q));els.expertsList.innerHTML=list.length?list.map(e=>{const on=members[e.id]!=null,w=Number(members[e.id]??25),pct=on&&total?Math.round(w/total*100):0;return `<div class="expert"><label><input type="checkbox" data-id="${esc(e.id)}" ${on?'checked':''}> ${esc(e.name)}<small>${esc(e.site||'Quelle unbekannt')}${e.accuracy!=null?` · Accuracy ${e.accuracy}`:''}${on?` · effektiv ${pct}%`:''}</small></label><input type="number" min="0" max="100" value="${w}" data-weight="${esc(e.id)}"></div>`}).join(''):'<div class="notice">Noch keine Experten geladen oder keine Treffer.</div>'}
function saveCurrentPanel(){const p=panels[activePanelId];if(!p)return;const members={};els.expertsList.querySelectorAll('[data-id]').forEach(cb=>{if(cb.checked){const id=cb.dataset.id,w=Number(els.expertsList.querySelector(`[data-weight="${CSS.escape(id)}"]`)?.value||0);if(w>0)members[id]=w}});p.members=members;persist()}

async function loadExperts(){if(els.loadExpertsBtn)els.loadExpertsBtn.disabled=true;try{const data=await proxyCall(`/nfl/${els.season.value.trim()}/rankings/experts`);experts=extractExperts(data).sort((a,b)=>(b.accuracy??-999)-(a.accuracy??-999)||a.name.localeCompare(b.name));if(!experts.length)throw new Error('Keine Experten erkannt.');persist();renderAll();els.presetStatus.className='notice ok';els.presetStatus.textContent=`${experts.length} Experten geladen.`}finally{if(els.loadExpertsBtn)els.loadExpertsBtn.disabled=false}}
async function loadExpertRanks(expertId){
  const cache=rankCache[expertId];
  if(cache&&cache.schemaVersion>=7&&cache.season===els.season.value&&cache.scoring===els.scoring.value&&cache.verifiedIndividual&&Object.keys(cache.ranks||{}).length&&Date.now()-cache.updated<12*3600e3)return cache;

  const expert=experts.find(e=>e.id===expertId);
  if(!expert)throw new Error(`Experte ${expertId} nicht gefunden.`);

  let publicData;
  try{
    publicData=await fetchPublicExpertRanking(expert);
  }catch(e){
    if(cache&&cache.verifiedIndividual&&Object.keys(cache.ranks||{}).length){
      const fallback={...cache,staleFallback:true,verifiedIndividual:true};
      rankCache[expertId]=fallback;
      return fallback;
    }
    const failed={schemaVersion:7,season:els.season.value,scoring:els.scoring.value,updated:Date.now(),expertId,expertName:expert.name,ranks:{},missing:['PUBLIC'],derived:[],overallCount:0,counts:{},verifiedIndividual:false,error:e.message};
    rankCache[expertId]=failed;
    return failed;
  }

  const ranks={};
  const byPos={QB:[],RB:[],WR:[],TE:[]};
  for(const row of publicData.players){
    if(!row?.name||!Number.isFinite(Number(row.rank)))continue;
    const pos=String(row.pos||'').toUpperCase();
    if(!byPos[pos])continue;
    byPos[pos].push(row);
  }
  for(const [pos,list] of Object.entries(byPos)){
    list.sort((a,b)=>Number(a.rank)-Number(b.rank)).forEach((row,i)=>{
      ranks[norm(row.name)]={
        rank:Number(row.rank),
        posRank:Number(row.posRank)||i+1,
        name:row.name,
        pos,
        source:'fantasypros-public'
      };
    });
  }

  const counts=Object.fromEntries(Object.entries(byPos).map(([pos,list])=>[pos,list.length]));
  const missing=Object.entries(counts).filter(([,n])=>!n).map(([pos])=>pos);
  const result={
    schemaVersion:7,
    season:els.season.value,
    scoring:els.scoring.value,
    updated:Date.now(),
    expertId,
    expertName:expert.name,
    ranks,
    missing,
    derived:[],
    overallCount:Object.keys(ranks).length,
    counts,
    verifiedIndividual:Object.keys(ranks).length>=40,
    publicSource:publicData.source,
    publicUpdated:publicData.updated||null,
    publicTitle:publicData.title||''
  };
  rankCache[expertId]=result;
  return result;
}

function rankingSignature(cache,limit=80){
  return Object.values(cache?.ranks||{}).filter(x=>Number.isFinite(x.rank)).sort((a,b)=>a.rank-b.rank).slice(0,limit).map(x=>`${norm(x.name)}:${x.rank}`).join('|');
}
function flagDuplicateExpertRankings(ids){
  const seen=new Map(),warnings=[];
  for(const id of ids){
    const c=rankCache[id];
    if(!c)continue;
    delete c.duplicateOf;
    const sig=rankingSignature(c);
    if(!sig)continue;
    if(seen.has(sig)){
      c.duplicateOf=seen.get(sig);
      warnings.push(`${c.expertName}: identisch zu ${rankCache[c.duplicateOf]?.expertName||c.duplicateOf} – nicht als eigener Experte gewertet`);
    }else seen.set(sig,id);
  }
  return warnings;
}

function computePanel(panelId){
  const panel=panels[panelId],all={};
  for(const[eid,w0]of Object.entries(panel?.members||{})){
    const cache=rankCache[eid],w=Number(w0);
    if(!cache?.verifiedIndividual)continue;
    if(cache?.duplicateOf)continue;
    for(const[k,v]of Object.entries(cache?.ranks||{})){
      all[k]??={name:v.name,pos:v.pos,values:[]};
      all[k].values.push({expertId:eid,expertName:cache.expertName,rank:v.rank,posRank:v.posRank||null,w,source:v.source||'unknown'});
    }
  }
  const out={};
  for(const[k,v]of Object.entries(all)){
    const sw=v.values.reduce((s,x)=>s+x.w,0);if(!sw)continue;
    const mean=v.values.reduce((s,x)=>s+x.rank*x.w,0)/sw;
    const variance=v.values.reduce((s,x)=>s+x.w*(x.rank-mean)**2,0)/sw;
    const posValues=v.values.filter(x=>Number.isFinite(x.posRank));
    const posWeight=posValues.reduce((s,x)=>s+x.w,0);
    const posMean=posWeight?posValues.reduce((s,x)=>s+x.posRank*x.w,0)/posWeight:null;
    out[k]={name:v.name,pos:v.pos,rank:mean,posRank:posMean,sd:Math.sqrt(variance),n:v.values.length,individual:v.values.sort((a,b)=>a.rank-b.rank)};
  }
  assignTiers(out);return out
}
function assignTiers(map){for(const pos of ['QB','RB','WR','TE']){const rows=Object.values(map).filter(x=>x.pos===pos).sort((a,b)=>a.rank-b.rank);let tier=1,prev=null;for(const row of rows){if(prev!=null&&row.rank-prev>=4)tier++;row.tier=tier;prev=row.rank}}}
async function loadAllRanks(){
  saveCurrentPanel();
  const ids=[...new Set(Object.values(panels).flatMap(p=>Object.keys(p.members||{})))];
  if(!ids.length)throw new Error('Preset oder Expertenauswahl fehlt.');
  if(els.loadAllRanksBtn)els.loadAllRanksBtn.disabled=true;
  const skipped=[];
  const previousPanelRanks=panelRanks;
  try{
    let i=0;
    for(const id of ids){
      i++;
      els.panelStatus.textContent=`Lade ${i}/${ids.length}: ${experts.find(e=>e.id===id)?.name||id}`;
      const c=await loadExpertRanks(id);
      if(c.missing.length)skipped.push(`${c.expertName}: fehlt ${c.missing.join('/')}`);
      if(c.derived?.length)skipped.push(`${c.expertName}: ${c.derived.join('/')} aus Overall abgeleitet`);
      if(c.staleFallback)skipped.push(`${c.expertName}: öffentliche Seite aktuell nicht erreichbar – letztes verifiziertes Ranking beibehalten`);
      if(c.verifiedIndividual&&c.publicUpdated)skipped.push(`${c.expertName}: öffentliches Ranking ${c.publicUpdated}`);
    }
    skipped.push(...flagDuplicateExpertRankings(ids));
    const candidate={};
    for(const id of Object.keys(panels))candidate[id]=computePanel(id);
    const usable=Object.values(candidate).reduce((n,r)=>n+Object.keys(r||{}).length,0);
    if(!usable){
      panelRanks=previousPanelRanks;
      persist();
      throw new Error('FantasyPros lieferte keine verwertbaren Spieler-Rankings. Vorhandene Rankings wurden aus Sicherheitsgründen NICHT überschrieben.');
    }
    panelRanks=candidate;
    store.set('v7_lastRankingUpdate',Date.now());
    persist();
    els.panelStatus.className=skipped.length?'notice warn':'notice ok';
    els.panelStatus.textContent=`Panels geladen: ${Object.entries(panelRanks).map(([id,r])=>`${panels[id]?.name}: ${Object.keys(r).length}`).join(' · ')}${skipped.length?` · Hinweise: ${skipped.join(', ')}`:''}`;
    updateStatus();
  }finally{if(els.loadAllRanksBtn)els.loadAllRanksBtn.disabled=false}
}


function parseCsv(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++}else if(c==='"')q=!q;else if(c===','&&!q){row.push(cell.trim());cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());cell='';if(row.some(x=>x!==''))rows.push(row);row=[]}else cell+=c}if(cell||row.length){row.push(cell.trim());rows.push(row)}if(!rows.length)return[];const h=rows[0];return rows.slice(1).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]??''])))}
async function parseAdp(file){const text=await file.text();let rows;if(file.name.toLowerCase().endsWith('.json')){const v=JSON.parse(text);rows=Array.isArray(v)?v:(v.players||Object.values(v))}else rows=parseCsv(text);const m={};for(const row of rows){const name=field(row,['player_name','player','name','full_name']),raw=field(row,['sleeper_adp','adp_sleeper','sleeper']);const val=Number(String(raw??'').replace(',','.'));if(name&&Number.isFinite(val)&&val>0)m[norm(name)]=val}if(!Object.keys(m).length)throw new Error('Keine Spalten player_name + sleeper_adp erkannt.');return m}


function renderPanelSummary(){
  if(!els.panelSummary)return;
  const active=panels[activePanelId]?.name||'Standard';
  const expertCount=experts.length;
  const positions=['QB','RB','WR','TE'];
  const posItems=positions.map(pos=>{
    const pid=positionPanels[pos];
    const ready=Boolean(panelRanks[pid]&&Object.keys(panelRanks[pid]).length);
    return `<div class="panel-summary-item"><span>${pos}</span><strong class="${ready?'status-ok':'status-warn'}">${ready?'✓':'Nicht geladen'}</strong></div>`;
  }).join('');
  els.panelSummary.innerHTML=`<div class="panel-summary-card">
    <b>Aktives Panel: ${esc(active)}</b>
    <div class="panel-summary-item"><span>Experten</span><strong>${expertCount}</strong></div>
    <div class="panel-summary-grid">${posItems}</div>
  </div>`;
}

function updateStatus(){const rankTime=Number(store.get('v7_lastRankingUpdate',0)),hours=rankTime?(Date.now()-rankTime)/3600000:null;const hasKey=Boolean(els.apiKey.value.trim());if(els.apiQuickStatus){els.apiQuickStatus.className=`notice ${hasKey?'ok':'bad'}`;els.apiQuickStatus.textContent=hasKey?'FantasyPros API-Key gespeichert. „Alles aktualisieren“ lädt Experten, Preset und Rankings.':'FantasyPros API-Key fehlt. Unter „Erweitert“ einmalig eintragen.';}els.onlineState.textContent=navigator.onLine?'Online':'Offline';els.onlineState.className=navigator.onLine?'ok':'bad';els.rankingAge.textContent=hours==null?'Wartet auf Draft':hours<1?`${Math.max(1,Math.round(hours*60))} Min.`:hours<24?`${Math.round(hours)} Std.`:`${Math.floor(hours/24)} Tag(e)`;els.rankingAge.className=hours==null?'bad':hours>24?'warn':'ok';els.adpCount.textContent=Object.keys(adp).length?String(Object.keys(adp).length):'Wartet auf Draft';els.adpCount.className=Object.keys(adp).length?'ok':'bad';const ready=experts.length&&Object.keys(panelRanks).length&&Object.keys(adp).length;els.qualityMini.textContent=ready?'Bereit':'Unvollständig';els.qualityMini.className=ready?'ok':'warn';const issues=[];if(!els.apiKey.value.trim())issues.push('API-Key fehlt');if(!experts.length)issues.push('Experten fehlen');if(!Object.keys(panelRanks).length)issues.push('Panel-Rankings fehlen');if(!Object.keys(adp).length)issues.push('Sleeper-ADP fehlt');els.qualityStatus.className=`notice ${issues.length?'warn':'ok'}`;els.qualityStatus.textContent=issues.length?`Noch nicht draftbereit: ${issues.join(' · ')}`:`Draftbereit: ${experts.length} Experten · ${Object.keys(panelRanks).length} Panels · ${Object.keys(adp).length} Sleeper-ADPs.`;if(Object.keys(adp).length){els.adpStatus.className='notice ok';els.adpStatus.textContent=`${Object.keys(adp).length} Sleeper-ADPs aktiv · Quelle: ${adpMeta.source||'verifizierter Import'}.`}else{els.adpStatus.className='notice warn';els.adpStatus.textContent='Keine verifizierte Sleeper-ADP vorhanden. Reach und Return werden konservativ behandelt.'}}

const S='https://api.sleeper.app/v1';
const draftId=v=>(String(v||'').match(/(\d{10,})/)||[])[1]||String(v||'').trim();
async function jf(url,label){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${label}: HTTP ${r.status}`);return r.json()}
async function fetchDraft(id){const[draft,picks,players]=await Promise.all([jf(`${S}/draft/${id}`,'Draft'),jf(`${S}/draft/${id}/picks`,'Picks'),jf(`${S}/players/nfl`,'Spieler')]);return{draft,picks,players}}
function pinfo(id,m,players){const p=players[id]||{};return{name:m?.first_name&&m?.last_name?`${m.first_name} ${m.last_name}`:(p.full_name||m?.player_name||id),pos:String(m?.position||p.position||'?').toUpperCase(),team:String(m?.team||p.team||'FA').toUpperCase(),searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null}}
function nextOwn(current,teams,slot,total){for(let p=current;p<=total;p++){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1,s=r%2?w:teams-w+1;if(s===slot)return p}return null}
function panelHasVerifiedExperts(id){
  return !!id && Object.keys(panels[id]?.members||{}).some(eid=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);
}
function panelFor(pos){
  const preferred=positionPanels[pos];
  if(preferred&&panelHasVerifiedExperts(preferred)&&Object.keys(panelRanks[preferred]||{}).length)return preferred;
  if(activePanelId&&panelHasVerifiedExperts(activePanelId)&&Object.keys(panelRanks[activePanelId]||{}).length)return activePanelId;
  return Object.keys(panelRanks).find(id=>panelHasVerifiedExperts(id)&&Object.keys(panelRanks[id]||{}).length)||preferred||activePanelId;
}
function rankFor(name,pos){const id=panelFor(pos),r=panelRanks[id]?.[norm(name)];return r?{...r,panel:panels[id]?.name||id,panelId:id}:null}
function agreement(sd,n){if(!n||n<2)return'Einzelmeinung';if(sd<=3)return'Sehr hoher Konsens';if(sd<=7)return'Hoher Konsens';if(sd<=12)return'Umstritten';return'Stark umstritten'}
function returnChance(next,a){if(!Number.isFinite(next)||!Number.isFinite(a))return null;return clamp(1/(1+Math.exp((next-a)/6)),.01,.99)}
function rosterState(mine,players){const c={QB:0,RB:0,WR:0,TE:0},byes={QB:{},RB:{},WR:{},TE:{}};for(const pick of mine){const p=pinfo(String(pick.player_id),pick.metadata,players);if(c[p.pos]!=null){c[p.pos]++;if(p.bye)byes[p.pos][p.bye]=(byes[p.pos][p.bye]||0)+1}}const need={QB:c.QB===0?8:c.QB===1?0:-7,TE:c.TE===0?7:c.TE===1?0:-6,RB:c.RB<2?8:c.RB<4?4:c.RB<6?1:-2,WR:c.WR<3?8:c.WR<5?4:c.WR<7?1:-2};return{counts:c,need,byes}}

function tierContext(player,rank,available){
  const same=available.map(x=>({p:x,r:rankFor(x.name,x.pos)})).filter(x=>x.r&&x.p.pos===player.pos&&x.r.tier===rank.tier).sort((a,b)=>a.r.rank-b.r.rank);
  const later=available.map(x=>({p:x,r:rankFor(x.name,x.pos)})).filter(x=>x.r&&x.p.pos===player.pos&&x.r.rank>rank.rank).sort((a,b)=>a.r.rank-b.r.rank);
  const nextTier=later.find(x=>x.r.tier>rank.tier);
  return{sameTierCount:same.length,isLastInTier:same.length===1,tierGap:nextTier?Math.max(0,nextTier.r.rank-rank.rank):null};
}
function valueLabel(current,adp){
  if(!Number.isFinite(adp))return{label:'ADP fehlt',kind:'info',value:null};
  const value=current-adp;
  if(value>=10)return{label:`Starker Value +${Math.round(value)}`,kind:'ok',value};
  if(value>=4)return{label:`Value +${Math.round(value)}`,kind:'ok',value};
  if(value<=-15)return{label:`Großer Reach ${Math.abs(Math.round(value))}`,kind:'bad',value};
  if(value<=-7)return{label:`Reach ${Math.abs(Math.round(value))}`,kind:'bad',value};
  return{label:'Fairer Bereich',kind:'info',value};
}

function scoreCandidate(p,current,next,state,available){
  const r=rankFor(p.name,p.pos),a=Number(adp[norm(p.name)]);
  if(!r)return{score:-999,r:null,a,reasons:['Panel-Rang fehlt']};
  let score=100-clamp((r.rank-1)*.65,0,70),reasons=[];
  const value=valueLabel(current,a);
  if(Number.isFinite(value.value))score+=clamp(value.value*.45,-12,14);
  reasons.push(value.label);
  score+=state.need[p.pos]||0;
  if((state.need[p.pos]||0)>=7)reasons.push(`${p.pos}-Need`);
  const tier=tierContext(p,r,available);
  if(tier.isLastInTier){score+=7;reasons.push(`Letzter Spieler in Tier ${r.tier}`)}
  else if(tier.sameTierCount<=2){score+=5;reasons.push(`Tier fast leer (${tier.sameTierCount})`)}
  if(tier.tierGap!=null&&tier.tierGap>=8){score+=4;reasons.push(`Tier-Drop +${tier.tierGap.toFixed(0)}`)}
  const agree=agreement(r.sd,r.n);
  if(agree==='Sehr hoher Konsens')score+=4;
  else if(agree==='Stark umstritten')score-=4;
  if(p.injury){score-=10;reasons.push(`Injury ${p.injury}`)}
  if(p.bye&&(state.byes[p.pos]?.[p.bye]||0)>=2){score-=1;reasons.push(`Bye ${p.bye} (nur Tiebreaker)`)}
  const ret=returnChance(next,a);
  if(ret!=null&&ret>.8)reasons.push('Sehr hohe Return-Chance');
  if(ret!=null&&ret<.25)reasons.push('Kaum Return-Chance');
  const expertBase=r.n>=5?4:r.n>=3?1:r.n===2?-5:-12;
  const confidence=clamp(Math.round(88-r.sd*2+(Number.isFinite(a)?4:-10)+expertBase),35,96);
  return{score:Math.round(clamp(score,0,100)),r,a,ret,reasons,agree,sameTier:tier.sameTierCount,tierGap:tier.tierGap,confidence,valueKind:value.kind};
}
function expertRanksHtml(r){
  return `<div class="coach-section-title">Einzelrankings</div><div class="expert-grid">${r.individual.map(x=>{
    const delta=x.rank-r.rank,cls=delta<=-4?'high':delta>=4?'low':'';
    const deltaText=Math.abs(delta)<1?'nahe Panel':delta<0?`${Math.abs(Math.round(delta))} höher`:`${Math.round(delta)} niedriger`;
    return `<div class="expert-rank"><b>${esc(x.expertName)}</b><span>#${Number(x.rank).toFixed(0)}${Number.isFinite(x.posRank)?` (${r.pos}${Math.round(x.posRank)})`:''}</span><span class="delta ${cls}">${deltaText}</span></div>`;
  }).join('')}</div>`;
}
function renderCoach(rows,state,current,next){
  const best=rows[0]?.score??0;
  const favorites=rows.filter(x=>best-x.score<=3).slice(0,4);
  const alternatives=rows.filter(x=>best-x.score>3).slice(0,4);
  els.favoritesBlock.innerHTML=favorites.length?`<div class="favorite-box"><b>Favoriten für diesen Pick</b><div class="favorite-list">${favorites.map((x,i)=>`<div class="favorite-row"><span class="rank-badge">${i+1}</span><div><strong>${esc(x.p.name)} · ${x.p.pos}</strong><small>${esc(x.agree)} · Tier ${x.r.tier||'–'} · Confidence ${x.confidence}%</small></div><b>${x.score}</b></div>`).join('')}</div>${favorites.length>1?'<div class="tiny">Keine Einzelentscheidung nötig: Diese Spieler liegen im Coach-Score nahezu gleichauf.</div>':''}</div>`:'';
  const cards=(list,offset=0)=>list.map((x,i)=>`<article class="coach"><div class="coach-head"><div><h3>${offset+i+1}. ${esc(x.p.name)} · ${x.p.pos}</h3><div class="tiny">${esc(x.r.panel)} · Tier ${x.r.tier||'–'} · ${esc(x.agree)}${x.p.bye?` · Bye ${x.p.bye}`:''}</div></div><div class="score">${x.score}</div></div><div class="metrics"><div class="metric"><b>${x.r.rank.toFixed(1)}</b><span>Overall</span></div><div class="metric"><b>${Number.isFinite(x.r.posRank)?x.r.posRank.toFixed(1):'–'}</b><span>${x.p.pos}-Rang</span></div><div class="metric"><b>${Number.isFinite(x.a)?x.a.toFixed(1):'–'}</b><span>ADP</span></div><div class="metric"><b>${x.ret!=null?Math.round(x.ret*100)+'%':'–'}</b><span>Return</span></div><div class="metric"><b>${x.confidence}%</b><span>Confidence</span></div></div>${expertRanksHtml(x.r)}<div class="tags">${x.reasons.map(reason=>{const kind=reason.startsWith('Reach')||reason.startsWith('Großer Reach')||reason.startsWith('Injury')?'bad':reason.includes('Return-Chance')||reason.includes('Tier-Drop')?'warn':reason==='Fairer Bereich'||reason==='ADP fehlt'?'info':'ok';return `<span class="tag ${kind}">${esc(reason)}</span>`}).join('')}</div></article>`).join('');
  els.coachList.innerHTML=`<div class="coach-section-title">Top-Kandidaten</div>${cards(favorites)}${alternatives.length?`<div class="coach-section-title">Nächste Alternativen</div>${cards(alternatives,favorites.length)}`:''}`;
  els.teamSummary.innerHTML=Object.entries(state.counts).map(([p,n])=>`<div class="summary-item"><b>${n}</b><span>${p}</span></div>`).join('')+`<div class="summary-item"><b>${current}</b><span>Pick</span></div><div class="summary-item"><b>${next??'–'}</b><span>Nächster</span></div>`;
}
async function refresh(){
  persist();
  const id=draftId(els.draftInput.value);
  if(!id)throw new Error('Draft-ID fehlt.');
  els.refreshBtn.disabled=true;
  els.draftStatus.textContent='Lade Draft …';
  try{
    const{draft,picks,players}=await fetchDraft(id),
      teams=Number(draft.settings?.teams||10),
      rounds=Number(draft.settings?.rounds||15),
      slot=Number(els.slot.value),
      total=teams*rounds,
      current=Math.min(picks.length+1,total),
      next=nextOwn(current,teams,slot,total),
      mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no),
      drafted=new Set(picks.map(p=>String(p.player_id)));

    const allAvailable=Object.entries(players)
      .filter(([pid,p])=>!drafted.has(pid)&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false&&p.full_name)
      .map(([pid,p])=>({id:pid,name:p.full_name,pos:p.position,team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null}));

    const rankedAvailable=allAvailable
      .map(p=>({p,r:rankFor(p.name,p.pos)}))
      .filter(x=>x.r&&panelHasVerifiedExperts(x.r.panelId))
      .sort((a,b)=>a.r.rank-b.r.rank||(a.p.searchRank||9999)-(b.p.searchRank||9999))
      .map(x=>x.p);

    const diagnosticAvailable=allAvailable
      .slice()
      .sort((a,b)=>(a.searchRank||9999)-(b.searchRank||9999))
      .slice(0,25);

    const state=rosterState(mine,players);
    const scored=rankedAvailable
      .map(p=>({p,...scoreCandidate(p,current,next,state,rankedAvailable)}))
      .filter(x=>x.r)
      .sort((a,b)=>b.score-a.score||a.r.rank-b.r.rank);

    renderCoach(scored,state,current,next);
    renderMockReview(mine,players);

    const best=scored[0]?.score??0,
      favorites=scored.filter(x=>best-x.score<=3).slice(0,4),
      snapshotLimit=els.snapshotMode.value==='full'?40:25,
      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,snapshotLimit),
      usedPanelIds=[...new Set(['QB','RB','WR','TE'].map(panelFor).filter(Boolean))],
      rankedCounts=usedPanelIds.map(pid=>`${panels[pid]?.name||pid}: ${Object.keys(panelRanks[pid]||{}).length}`).join(' · '),
      rankingUpdated=Number(store.get('v7_lastRankingUpdate',0)),
      rankingStamp=rankingUpdated?new Date(rankingUpdated).toLocaleString('de-DE'):'unbekannt',
      adpStamp=adpMeta.updated?new Date(adpMeta.updated).toLocaleString('de-DE'):'nicht geladen';

    const lines=[
      '===== SLEEPER DRAFT SNAPSHOT =====',
      `Draft-ID: ${id}`,
      `Status: ${draft.status}`,
      `Teams: ${teams} | Runden: ${rounds} | Mein Slot: ${slot}`,
      `Aktueller Pick: ${current}`,
      `Mein nächster Pick: ${next??'keiner'} | Picks bis dahin: ${next==null?'–':next-current}`,
      '',
      'DATENSTATUS',
      `Verwendete Panels: ${usedPanelIds.map(pid=>panels[pid]?.name||pid).join(' / ')||'FEHLT'}`,
      `Geladene Panel-Spieler: ${rankedCounts||'FEHLT'}`,
      `Verifizierte Einzelrankings: ${usedPanelIds.map(pid=>{const ids=Object.keys(panels[pid]?.members||{}).filter(eid=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);return `${panels[pid]?.name||pid}: ${ids.length}/${Object.keys(panels[pid]?.members||{}).length}`}).join(' · ')||'FEHLT'}`,
      `Expertenquelle: öffentliche FantasyPros-Einzelrankings (API nur Expertenliste)`,
      `Expertenstände: ${[...new Set(usedPanelIds.flatMap(pid=>Object.keys(panels[pid]?.members||{})))].map(eid=>`${rankCache[eid]?.expertName||eid}: ${rankCache[eid]?.verifiedIndividual?(rankCache[eid]?.publicUpdated||'verifiziert'):'NICHT VERIFIZIERT'}`).join(' · ')}`,
      `Panel-Stand: ${rankingStamp}`,
      `Sleeper-ADP: ${Object.keys(adp).length} | Quelle: ${adpMeta.source||'none'} | Stand: ${adpStamp}`,
      `Bewertbare verfügbare Spieler: ${scored.length}`,
      '',
      'BISHERIGE PICKS'
    ];

    if(picks.length){
      for(const pick of picks.slice().sort((a,b)=>a.pick_no-b.pick_no)){
        const p=pinfo(String(pick.player_id),pick.metadata,players);
        lines.push(`${pick.pick_no}. ${p.name} — ${p.pos}, ${p.team}${Number(pick.draft_slot)===slot?' [MEIN PICK]':''}`);
      }
    }else lines.push('Noch keine Picks.');

    lines.push('','MEIN TEAM');
    for(const pick of mine){
      const p=pinfo(String(pick.player_id),pick.metadata,players);
      lines.push(`${pick.pick_no}. ${p.name} — ${p.pos}, ${p.team}`);
    }
    if(!mine.length)lines.push('Noch keine Picks.');

    lines.push('','GLEICHWERTIGE FAVORITEN');
    if(favorites.length){
      favorites.forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score} | Panel ${x.r.rank.toFixed(1)} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Confidence ${x.confidence}%`));
    }else lines.push('KEINE — Panel-Zuordnung/Rankings prüfen.');

    lines.push('','DRAFT COACH TOP 8');
    if(scored.length){
      scored.slice(0,8).forEach((x,i)=>{
        lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score} | ${x.r.panel} ${x.r.rank.toFixed(1)} Tier ${x.r.tier||'–'} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Confidence ${x.confidence}% | ${x.agree}`);
        lines.push(`   Einzelrankings: ${x.r.individual.filter(v=>rankCache[v.expertId]?.verifiedIndividual).map(v=>`${v.expertName} #${Math.round(v.rank)}${Number.isFinite(v.posRank)?` (${x.p.pos}${Math.round(v.posRank)})`:''}`).join(' · ')||'KEINE VERIFIZIERT'}`);
      });
    }else lines.push('KEINE — keine verfügbaren Spieler konnten einem geladenen Panel-Ranking zugeordnet werden.');

    if(!scored.length){
      lines.push('','DIAGNOSE OHNE EXPERTENPANEL');
      lines.push('Kein verifiziertes Einzelranking verfügbar. Folgende Sleeper-Reihenfolge dient nur zur technischen Kontrolle, NICHT als Expertenbaseline:');
      diagnosticAvailable.forEach((p,i)=>lines.push(`${i+1}. ${p.name} — ${p.pos}, ${p.team} | Sleeper SearchRank ${Number.isFinite(p.searchRank)?p.searchRank:'–'} | ADP ${Number.isFinite(adp[norm(p.name)])?Number(adp[norm(p.name)]).toFixed(1):'FEHLT'}`));
    }

    lines.push('','VERFÜGBARE SPIELER NACH PANEL');
    if(availableSnapshot.length){
      availableSnapshot.forEach((x,i)=>{
        lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Panel ${x.r.rank.toFixed(1)} (${x.r.panel}) | Pos ${Number.isFinite(x.r.posRank)?x.p.pos+x.r.posRank.toFixed(1):'–'} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Sleeper SearchRank ${Number.isFinite(x.p.searchRank)?x.p.searchRank:'–'}${x.p.injury?` | Injury ${x.p.injury}`:''}`);
        if(els.snapshotMode.value==='full')lines.push(`   Einzelrankings: ${x.r.individual.map(v=>`${v.expertName} #${Math.round(v.rank)}`).join(' · ')||'FEHLT'}`);
      });
    }else lines.push('KEINE.');

    lines.push(
      '',
      'HARTE REGEL',
      'Kein großer Reach ohne konkrete aktuelle Begründung. Fehlende Panel- oder ADP-Daten ausdrücklich als Unsicherheit behandeln. K und DST werden nicht gedraftet. Bye Weeks sind nur ein kleiner Tiebreaker.',
      '',
      'AUFGABE',
      'Prüfe aktuelle Verletzungen, Depth Charts und News. Nutze das Expertenpanel als Baseline und Sleeper-ADP als Marktindikator, sofern vorhanden. Nenne alle nahezu gleichwertigen Favoriten, danach 2–3 Alternativen, Return-Chancen und Confidence. Erzwinge keine Einzelentscheidung, wenn mehrere Spieler nahezu gleichauf liegen. Abweichungen vom Expertenpanel oder der Sleeper-ADP ausdrücklich begründen.'
    );

    els.snapshot.value=lines.join('\n');
    els.draftStatus.className=scored.length?'notice ok':'notice warn';
    els.draftStatus.textContent=`${picks.length} Picks geladen · ${scored.length} Kandidaten bewertet · ${allAvailable.length} Spieler verfügbar.`;
    els.draftSummary.hidden=false;
    els.emptyCoach.hidden=true;
    els.copyBtn.disabled=false;
    els.shareBtn.disabled=false;
    lastDraftContext={id,current,next,favorites,scored,picks,mine};
  }finally{
    els.refreshBtn.disabled=false;
  }
}


function renderMockReview(mine,players){
  if(!els.mockReview)return;
  if(!mine.length){els.mockReview.innerHTML='<div class="notice">Noch keine eigenen Picks für eine Auswertung.</div>';return}
  const rows=mine.map(pick=>{
    const p=pinfo(String(pick.player_id),pick.metadata,players),r=rankFor(p.name,p.pos),a=Number(adp[norm(p.name)]);
    const value=Number.isFinite(a)?pick.pick_no-a:null;
    let label='Neutral',score=70;
    if(value!=null&&value>=8){label='Starker Value';score=92}
    else if(value!=null&&value>=3){label='Value';score=84}
    else if(value!=null&&value<=-12){label='Großer Reach';score=45}
    else if(value!=null&&value<=-6){label='Reach';score=58}
    else if(r&&pick.pick_no<=r.rank+4){label='Board-konform';score=78}
    return{pick:pick.pick_no,p,label,score,r,a};
  });
  const best=rows.slice().sort((a,b)=>b.score-a.score)[0],worst=rows.slice().sort((a,b)=>a.score-b.score)[0];
  els.mockReview.innerHTML=`<div class="review-row"><div><b>⭐ Bester Pick bisher</b><small>${esc(best.p.name)} · Pick ${best.pick} · ${best.label}</small></div><div class="review-score">${best.score}</div></div><div class="review-row"><div><b>⚠ Größter Reach / Risiko</b><small>${esc(worst.p.name)} · Pick ${worst.pick} · ${worst.label}</small></div><div class="review-score">${worst.score}</div></div>${rows.map(x=>`<div class="review-row"><div><b>Pick ${x.pick}: ${esc(x.p.name)}</b><small>${x.label}${Number.isFinite(x.a)?` · ADP ${x.a.toFixed(1)}`:''}${x.r?` · Panel ${x.r.rank.toFixed(1)}`:''}</small></div><div class="review-score">${x.score}</div></div>`).join('')}`;
}

function renderLog(){els.decisionLog.innerHTML=decisionLog.length?decisionLog.slice().reverse().map(x=>`<div class="log-item"><b>Pick ${x.pick}: ${esc(x.chosen)}</b><div class="tiny">Coach: ${esc(x.coach)} · Grund: ${esc(x.reason)} · ${new Date(x.at).toLocaleString('de-DE')}</div></div>`).join(''):'<div class="notice">Noch keine Entscheidungen protokolliert.</div>'}
function logDecision(){if(!lastDraftContext)return alert('Zuerst Draft analysieren.');const coach=lastDraftContext.favorites.map(x=>x.p.name).join(' / ')||'–',chosen=prompt('Welchen Spieler hast du gewählt?',lastDraftContext.favorites[0]?.p.name||'');if(!chosen)return;const reason=prompt('Grund (Coach gefolgt, Upside, Value, Stack, Positionsbedarf, Bauchgefühl):','Coach gefolgt')||'ohne Angabe';decisionLog.push({draftId:lastDraftContext.id,pick:lastDraftContext.current,coach,chosen,reason,at:Date.now()});persist();renderLog()}

function backup(){return{format:'draft-companion-v7',version:'9.1.0',createdAt:new Date().toISOString(),season:els.season.value,scoring:els.scoring.value,experts,panels,activePanelId,positionPanels,rankCache,panelRanks,adp,adpMeta,decisionLog,draft:els.draftInput.value,slot:els.slot.value}}
function downloadJson(name,v){const b=new Blob([JSON.stringify(v,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function applyBackup(v){if(v?.format!=='draft-companion-v7')throw new Error('Ungültige Sicherung.');experts=v.experts||[];panels=v.panels||panels;activePanelId=v.activePanelId||'standard';positionPanels=v.positionPanels||positionPanels;rankCache=v.rankCache||{};panelRanks=v.panelRanks||{};adp=v.adp||{};adpMeta=v.adpMeta||{source:'Backup',updated:Date.now(),count:Object.keys(adp).length};decisionLog=v.decisionLog||[];els.season.value=v.season||'2026';els.scoring.value=v.scoring||'HALF';els.draftInput.value=v.draft||'';els.slot.value=String(v.slot||9);persist();renderAll()}
function setAuto(){if(autoTimer)clearInterval(autoTimer);autoTimer=null;persist();if(els.autoRefresh.checked)autoTimer=setInterval(()=>{if(!document.hidden&&els.draftInput.value.trim())refresh().catch(()=>{})},10000)}

if(els.loadExpertsBtn)els.loadExpertsBtn.onclick=()=>loadExperts().catch(e=>{els.presetStatus.className='notice bad';els.presetStatus.textContent=e.message});
if(els.applyPresetBtn)els.applyPresetBtn.onclick=()=>{try{applyPreset()}catch(e){els.presetStatus.className='notice bad';els.presetStatus.textContent=e.message}};
if(els.loadAllRanksBtn)els.loadAllRanksBtn.onclick=()=>loadAllRanks().catch(e=>{els.panelStatus.className='notice bad';els.panelStatus.textContent=e.message});
els.refreshAllBtn.onclick=async()=>{els.refreshAllBtn.disabled=true;els.refreshAllBtn.textContent='Aktualisiere …';try{
  await proxyCall('/nfl/'+els.season.value.trim()+'/rankings/experts');
  await loadExperts();
  if(!Object.values(panels).some(p=>Object.keys(p.members||{}).length))applyPreset();
  await loadAllRanks();
  let adpResult=await loadSleeperAdpDirect();
  if(!adpResult.ok)adpResult=await loadSleeperAdpFromFantasyPros();
  const sleeperPlayers=await fetch('https://api.sleeper.app/v1/players/nfl',{cache:'no-store'});
  if(!sleeperPlayers.ok)throw new Error('Sleeper-Spielerdaten nicht erreichbar.');
  store.set('v7_lastFullUpdate',Date.now());
  updateStatus();
  els.qualityStatus.className=Object.keys(adp).length?'notice ok':'notice warn';
  els.qualityStatus.textContent=Object.keys(adp).length
    ?`Alles aktuell: Experten, Panels, Rankings, Sleeper-Spielerdaten und ${Object.keys(adp).length} Sleeper-ADPs (${adpMeta.source}).`
    :'Experten, Panels, Rankings und Sleeper-Spielerdaten aktuell. Weder Sleeper noch FantasyPros lieferten eine verifizierbare Sleeper-ADP; Reach und Return bleiben deshalb bewusst unsicher.';
}catch(e){els.qualityStatus.className='notice bad';els.qualityStatus.textContent=e.message}finally{els.refreshAllBtn.disabled=false;els.refreshAllBtn.textContent='Alles aktualisieren'}};
if(els.adpFile)els.adpFile.onchange=async()=>{try{adp=await parseAdp(els.adpFile.files[0]);adpMeta={source:'verifizierter Datei-Import',updated:Date.now(),count:Object.keys(adp).length};persist();updateStatus()}catch(e){els.adpStatus.className='notice bad';els.adpStatus.textContent=e.message}};
for(const section of [els.dataSection,els.draftSection]){
  const heading=section?.querySelector('.section-heading');
  if(heading)heading.addEventListener('click',()=>section.classList.toggle('section-collapsed'));
}

els.refreshBtn.onclick=()=>refresh().catch(e=>{els.draftStatus.className='notice bad';els.draftStatus.textContent=e.message});
els.copyBtn.onclick=async()=>{await navigator.clipboard.writeText(els.snapshot.value);els.copyBtn.textContent='Kopiert';setTimeout(()=>els.copyBtn.textContent='Snapshot kopieren',1200)};
els.shareBtn.onclick=()=>navigator.share?navigator.share({title:'Sleeper Draft Snapshot',text:els.snapshot.value}):navigator.clipboard.writeText(els.snapshot.value);
els.autoRefresh.onchange=setAuto;
els.logDecisionBtn.onclick=logDecision;
els.clearLogBtn.onclick=()=>{if(confirm('Decision Log löschen?')){decisionLog=[];persist();renderLog()}};
els.expertSearch.oninput=renderExperts;
els.activePanel.onchange=()=>{saveCurrentPanel();activePanelId=els.activePanel.value;persist();renderAll()};
els.savePanelBtn.onclick=()=>{saveCurrentPanel();renderExperts();els.panelStatus.className='notice ok';els.panelStatus.textContent=`${panels[activePanelId].name}: ${Object.keys(panels[activePanelId].members).length} Experten gespeichert.`};
els.newPanelBtn.onclick=()=>{const name=prompt('Name des Panels:','Custom');if(!name)return;let id=norm(name)||`panel${Date.now()}`;while(panels[id])id+='x';panels[id]={name,members:{}};activePanelId=id;persist();renderAll()};
els.renamePanelBtn.onclick=()=>{const p=panels[activePanelId],name=prompt('Neuer Name:',p.name);if(name){p.name=name;persist();renderAll()}};
els.deletePanelBtn.onclick=()=>{if(['standard','pat'].includes(activePanelId))return alert('Standard und Pat bleiben erhalten.');if(confirm('Panel löschen?')){delete panels[activePanelId];delete panelRanks[activePanelId];activePanelId='standard';persist();renderAll()}};
for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])el.onchange=()=>{positionPanels[pos]=el.value;persist()};
els.diagnoseBtn.onclick=async()=>{els.diagnostic.textContent='Teste …';try{
  const out=[];
  for(const[n,p]of [['Experten',`/nfl/${els.season.value}/rankings/experts`],['RB-Consensus',`/nfl/${els.season.value}/consensus-rankings?position=RB&scoring=${els.scoring.value}&type=DRAFT&experts=show`]]){
    try{const d=await proxyCall(p);out.push(`✓ FantasyPros ${n}: Array ${Math.max(0,...arrays(d).map(a=>a.length))}`)}
    catch(e){out.push(`✗ FantasyPros ${n}: ${e.message}`)}
  }
  try{const r=await fetch('https://api.sleeper.app/v1/players/nfl',{cache:'no-store'});const d=await r.json();out.push(`✓ Sleeper Spielerdaten: ${Object.keys(d||{}).length}`)}
  catch(e){out.push(`✗ Sleeper Spielerdaten: ${e.message}`)}
  try{const result=await loadSleeperAdpFromFantasyPros();out.push(result.ok?`✓ FantasyPros Sleeper-ADP: ${result.count}`:'! FantasyPros lieferte keine eindeutig gekennzeichnete Sleeper-ADP')}catch(e){out.push(`! Sleeper-ADP-Prüfung: ${e.message}`)}
  els.diagnostic.textContent=out.join('\n')
}catch(e){els.diagnostic.textContent=e.message}};
els.toggleKeyBtn.onclick=()=>{const show=els.apiKey.type==='password';els.apiKey.type=show?'text':'password';els.toggleKeyBtn.textContent=show?'Key verbergen':'Key anzeigen'};
els.clearKeyBtn.onclick=()=>{if(confirm('API-Key löschen?')){els.apiKey.value='';persist();updateStatus()}};
els.backupBtn.onclick=()=>downloadJson(`draft-companion-v7-backup-${new Date().toISOString().slice(0,10)}.json`,backup());
els.restoreFile.onchange=async()=>{try{applyBackup(JSON.parse(await els.restoreFile.files[0].text()))}catch(e){alert(e.message)}finally{els.restoreFile.value=''}};
els.clearDraftDataBtn.onclick=()=>{if(confirm('Draft-Verbindung zurücksetzen?')){els.draftInput.value='';els.draftSummary.hidden=true;els.emptyCoach.hidden=false;persist()}};
for(const el of [els.apiKey,els.season,els.scoring,els.draftInput,els.slot,els.topN,els.snapshotMode])el.addEventListener('change',()=>{persist();updateStatus()});
addEventListener('online',updateStatus);addEventListener('offline',updateStatus);
setInterval(updateStatus,60000);
renderAll();setAuto();updateStatus();
