const $=id=>document.getElementById(id);
const ids=['onlineState','rankingAge','adpCount','qualityMini','apiQuickStatus','qualityStatus','panelSummary','dataSection','draftSection','coachSection','loadExpertsBtn','applyPresetBtn','loadAllRanksBtn','refreshAllBtn','presetStatus','panelStatus','adpFile','adpStatus','adpHelper','draftInput','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','modeStatus','simulateBtn','simulationStatus','simulationResults','strategyMode','strategyStatus','refreshBtn','copyBtn','shareBtn','autoRefresh','draftStatus','draftSummary','teamSummary','favoritesBlock','coachList','snapshot','emptyCoach','logDecisionBtn','clearLogBtn','mockReview','decisionLog','apiKey','toggleKeyBtn','clearKeyBtn','season','scoring','activePanel','diagnoseBtn','diagnostic','expertSearch','expertsList','savePanelBtn','newPanelBtn','renamePanelBtn','deletePanelBtn','qbPanel','rbPanel','wrPanel','tePanel','backupBtn','restoreFile','clearDraftDataBtn','researchCacheStatus'];
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
els.draftMode.value=store.text('v11_draftMode',store.text('v10_draftMode','mock'));
els.replayCutoff.value=store.text('v11_replayCutoff',store.text('v10_replayCutoff',''));
const ACTIVE_2026_MANAGER_MAP_TEXT='1=Michael, 2=Pascal Voerde, 3=Marc Düsseldorf, 4=Thomas, 5=Bjoern, 6=Pascal Gelderner, 7=Giuliano, 8=Basti, 9=Tim, 10=Dutch Marc';
els.managerMap.value=store.text('v11_managerMap',store.text('v10_managerMap',ACTIVE_2026_MANAGER_MAP_TEXT));
els.stressMode.value=store.text('v113_stressMode','baseline');
els.strategyMode.value=store.text('v111_strategyMode','progressive');

function persist(){
  store.setText('v7_apiKey',els.apiKey.value.trim());store.setText('v7_season',els.season.value.trim());store.setText('v7_scoring',els.scoring.value);
  store.setText('v7_draft',els.draftInput.value.trim());store.setText('v7_slot',els.slot.value);store.setText('v7_topN',els.topN.value);store.setText('v7_snapshotMode',els.snapshotMode.value);store.setText('v11_draftMode',els.draftMode.value);store.setText('v11_replayCutoff',els.replayCutoff.value);store.setText('v11_managerMap',els.managerMap.value);store.setText('v113_stressMode',els.stressMode.value);store.setText('v111_strategyMode',els.strategyMode.value);
  store.set('v7_autoRefresh',els.autoRefresh.checked);store.set('v7_experts',experts);store.set('v7_panels',panels);store.setText('v7_activePanel',activePanelId);
  store.set('v7_positionPanels',positionPanels);store.set('v7_rankCache',rankCache);store.set('v7_panelRanks',panelRanks);store.set('v7_adp',adp);store.set('v72_adpMeta',adpMeta);store.set('v7_decisionLog',decisionLog);
}

async function proxyCall(path){
  const key=els.apiKey.value.trim();if(!key)throw new Error('API-Key fehlt.');
  const r=await fetch(`/api/fantasypros?path=${encodeURIComponent(path)}`,{headers:{'x-fp-key':key},cache:'no-store'});
  const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={raw:text.slice(0,1200)}}
  if(!r.ok){const e=new Error(data?.error||data?.message||`HTTP ${r.status}`);e.status=r.status;throw e}return data;
}
function slugifyExpert(name){
  return String(name||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
async function loadPublicExpertDirectory(){
  try{
    const r=await fetch(`/api/fp-expert-directory?season=${encodeURIComponent(els.season.value.trim())}`,{cache:'no-store'});
    const data=await r.json();
    if(!r.ok)throw new Error(data?.error||`HTTP ${r.status}`);
    return Array.isArray(data.experts)?data.experts:[];
  }catch{return []}
}
async function fetchMultiSourceExpertRanking(expert){
  const r=await fetch(`/api/expert-ranking?name=${encodeURIComponent(expert.name)}&site=${encodeURIComponent(expert.site||'')}&season=${encodeURIComponent(els.season.value.trim())}&scoring=${encodeURIComponent(els.scoring.value)}`,{cache:'no-store'});
  const data=await r.json();
  if(!r.ok)throw new Error(data?.error||`HTTP ${r.status}`);
  if(!Array.isArray(data.players)||data.players.length<80)throw new Error(`${expert.name}: ${data.players?.length||0} Overall-Spieler – Quelle nicht vollständig genug.`);
  return data;
}

function arrays(v,d=0){if(d>5||v==null)return[];if(Array.isArray(v))return[v];if(typeof v!=='object')return[];return Object.values(v).flatMap(x=>arrays(x,d+1))}
function field(o,names){const keys=Object.keys(o||{});for(const n of names){const t=n.toLowerCase().replace(/[^a-z0-9]/g,'');const k=keys.find(x=>x.toLowerCase().replace(/[^a-z0-9]/g,'')===t);if(k&&o[k]!==''&&o[k]!=null)return o[k]}return null}
function extractExperts(payload){for(const rows of arrays(payload).sort((a,b)=>b.length-a.length)){const m=rows.map(row=>{const id=field(row,['expert_id','expertid','id']),name=field(row,['expert_name','expertname','name','full_name']),site=field(row,['source','site_name','sitename','site','affiliation','expert_source_name']);const accuracy=Number(field(row,['accuracy_draft_season','accuracy','draft_accuracy','accuracy_overall']));return id&&name?{id:String(id),name:String(name),site:String(site||''),accuracy:Number.isFinite(accuracy)?accuracy:null}:null}).filter(Boolean);if(m.length)return[...new Map(m.map(x=>[x.id,x])).values()]}return[]}

const DRAFT_POOL_LIMITS={QB:30,RB:90,WR:80,TE:30};

function parsePosRank(raw,pos){
  if(raw==null)return null;
  const s=String(raw).trim().toUpperCase();
  const m=s.match(new RegExp(`^${pos}(\\d+(?:\\.\\d+)?)$`))||s.match(/(\d+(?:\.\d+)?)/);
  const v=Number(m?.[1]);
  return Number.isFinite(v)&&v>0?v:null;
}
function confirmedSingleExpert(payload,expertId){
  const eid=String(expertId);
  const filters=String(payload?.filters??'').match(/\d+/g)||[];
  const total=Number(payload?.total_experts);
  const names=payload?.expert_name&&typeof payload.expert_name==='object'?payload.expert_name:{};
  const pubs=payload?.expert_pub&&typeof payload.expert_pub==='object'?payload.expert_pub:{};
  const explicitId=filters.includes(eid)||Object.prototype.hasOwnProperty.call(names,eid)||Object.prototype.hasOwnProperty.call(pubs,eid);
  return total===1&&explicitId;
}
function extractVerifiedOverall(payload,expertId){
  if(!confirmedSingleExpert(payload,expertId))return [];
  const rows=Array.isArray(payload?.players)?payload.players:[];
  return rows.map(row=>{
    const id=String(field(row,['player_id','playerid','id'])||'');
    const name=field(row,['player_name','playername','name','full_name']);
    const pos=String(field(row,['player_position_id','position_id','position','pos'])||'').toUpperCase().replace(/[0-9]/g,'');
    const rank=Number(field(row,['rank_ecr','rank','overall_rank']));
    const posRank=parsePosRank(field(row,['pos_rank','rank_ecr_pos','rank_position','position_rank']),pos);
    return id&&name&&['QB','RB','WR','TE'].includes(pos)&&Number.isFinite(rank)&&rank>0
      ?{id,name:String(name),pos,rank,posRank}
      :null;
  }).filter(Boolean);
}
function compareRanksFor(payload,expertId,scoring){
  const block=payload?.rankings?.[scoring]||payload?.rankings?.[String(scoring).toUpperCase()]||{};
  const out={};
  for(const [pid,rows] of Object.entries(block||{})){
    const hit=(Array.isArray(rows)?rows:[]).find(x=>String(x?.expert_id)===String(expertId));
    const rank=Number(hit?.rank);
    if(Number.isFinite(rank)&&rank>0)out[String(pid)]=rank;
  }
  return out;
}
async function fetchVerifiedExpertOverall(expert){
  const season=els.season.value.trim(),scoring=encodeURIComponent(els.scoring.value),eid=encodeURIComponent(expert.id);
  const attempts=[
    // FantasyPros preseason/draft consensus: week 0, no explicit type is the canonical legacy form.
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&week=0&filters=${eid}&experts=show`,
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&week=0&type=PRESEASON&filters=${eid}&experts=show`,
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&week=0&type=DRAFT&filters=${eid}&experts=show`
  ];
  const failures=[];
  for(const path of attempts){
    try{
      const data=await proxyCall(path);
      const rows=extractVerifiedOverall(data,expert.id);
      const verified=confirmedSingleExpert(data,expert.id);
      if(verified&&rows.length>=80)return {data,rows,path};
      failures.push(`ranking_type=${data?.ranking_type_name||data?.type||'?'} total_experts=${data?.total_experts??'?'} filters=${data?.filters??'leer'} rows=${rows.length}`);
    }catch(e){failures.push(e?.message||String(e))}
  }
  throw new Error(`${expert.name}: kein echter Einzel-Overall-Response. ${failures.join(' | ')}`);
}
async function validateExpertWithCompare(expert,rows){
  // Independent API cross-check: compare-players is positional, so compare against pos_rank.
  const scoring=els.scoring.value;
  const grouped={RB:[],WR:[],QB:[],TE:[]};
  for(const row of rows)if(grouped[row.pos]&&Number.isFinite(row.posRank))grouped[row.pos].push(row);
  const pos=['RB','WR','QB','TE'].find(p=>grouped[p].length>=3);
  if(!pos)return {ok:false,checked:0,reason:'Keine drei Spieler mit Positionsrang für Crosscheck.'};
  const sample=grouped[pos].sort((a,b)=>a.posRank-b.posRank).slice(0,3);
  const players=sample.map(x=>x.id).join(':');
  const path=`/nfl/compare-players?players=${players}&position=${pos}&year=${encodeURIComponent(els.season.value.trim())}&experts=${encodeURIComponent(expert.id)}&ranking_type=draft&details=all`;
  const data=await proxyCall(path);
  if(String(data?.position_id||'').toUpperCase()!==pos)
    return {ok:false,checked:0,reason:`Compare-Players meldete Position ${data?.position_id||'?'}.`};
  if(String(data?.ranking_type||'').toLowerCase()!=='draft')
    return {ok:false,checked:0,reason:`Compare-Players meldete Rankingtyp ${data?.ranking_type||'?'}.`};
  const actual=compareRanksFor(data,expert.id,scoring);
  let matched=0,checked=0;
  for(const row of sample){
    if(actual[row.id]==null)continue;
    checked++;
    if(Number(actual[row.id])===Number(row.posRank))matched++;
  }
  return {
    ok:checked>=2&&matched===checked,
    checked,matched,pos,
    expected:Object.fromEntries(sample.map(x=>[x.id,x.posRank])),
    actual
  };
}
function buildDraftCandidatePool(expertIds){
  const buckets={QB:new Map(),RB:new Map(),WR:new Map(),TE:new Map()};
  for(const eid of expertIds){
    const cache=rankCache[eid];
    if(!cache?.verifiedIndividual)continue;
    for(const [key,row] of Object.entries(cache.ranks||{})){
      if(!buckets[row.pos])continue;
      const cur=buckets[row.pos].get(key)||{key,name:row.name,pos:row.pos,ranks:[]};
      cur.ranks.push(Number(row.rank));
      buckets[row.pos].set(key,cur);
    }
  }
  const keep=new Set(),counts={};
  for(const [pos,limit] of Object.entries(DRAFT_POOL_LIMITS)){
    const list=[...buckets[pos].values()].map(x=>({
      ...x,
      best:Math.min(...x.ranks),
      mean:x.ranks.reduce((a,b)=>a+b,0)/x.ranks.length,
      mentions:x.ranks.length
    })).sort((a,b)=>a.best-b.best||a.mean-b.mean||b.mentions-a.mentions||a.name.localeCompare(b.name));
    const chosen=list.slice(0,limit);
    chosen.forEach(x=>keep.add(x.key));
    counts[pos]=chosen.length;
  }
  return {keep,counts,total:keep.size};
}
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
function presetCandidateIds(){
  return [...new Set(Object.values(PRESETS).flatMap(p=>p.list.map(([name])=>findExpert(name)?.id).filter(Boolean)))];
}
function backfillPresetPanels(){
  const changes=[];
  for(const[id,p]of Object.entries(PRESETS)){
    const before=Object.keys(panels[id]?.members||{});
    const members={};
    for(const[name,w]of p.list){
      const e=findExpert(name);
      if(!e)continue;
      const c=rankCache[e.id];
      if(c?.verifiedIndividual&&!c?.duplicateOf&&Object.keys(members).length<p.max)members[e.id]=w;
    }
    panels[id]={name:p.name,members};
    const after=Object.keys(members);
    if(before.join('|')!==after.join('|'))changes.push(`${p.name}: ${after.map(eid=>rankCache[eid]?.expertName||experts.find(e=>String(e.id)===String(eid))?.name||eid).join(' + ')||'keine'}`);
  }
  const pat=findExpert('Pat Fitzmaurice');
  panels.pat={name:'Pat einzeln',members:pat&&rankCache[pat.id]?.verifiedIndividual&&!rankCache[pat.id]?.duplicateOf?{[pat.id]:100}:{}};
  return changes;
}
function applyPreset(){if(!experts.length)throw new Error('Zuerst Experten laden.');const missing=[];for(const[id,p]of Object.entries(PRESETS)){const members={};for(const[name,w]of p.list){const e=findExpert(name);if(e&&Object.keys(members).length<p.max)members[e.id]=w;else if(!e)missing.push(name)}panels[id]={name:p.name,members}}const pat=findExpert('Pat Fitzmaurice');panels.pat={name:'Pat einzeln',members:pat?{[pat.id]:100}:{}};positionPanels={QB:'qb',RB:'rb',WR:'wr',TE:'te'};activePanelId='standard';panelRanks={};persist();renderAll();els.presetStatus.className='notice ok';els.presetStatus.textContent=`Preset eingerichtet.${missing.length?` Nicht gefunden: ${[...new Set(missing)].join(', ')}.`:''}`}

function panelOptions(el,value){el.innerHTML='';for(const[id,p]of Object.entries(panels)){const o=new Option(p.name,id);o.selected=id===value;el.add(o)}}
function renderAll(){if(!panels[activePanelId])activePanelId='standard';panelOptions(els.activePanel,activePanelId);for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])panelOptions(el,positionPanels[pos]||activePanelId);renderExperts();renderLog();updateStatus()}
function renderExperts(){const q=els.expertSearch.value.trim().toLowerCase(),members=panels[activePanelId]?.members||{},total=Object.values(members).reduce((s,w)=>s+Number(w||0),0);const list=experts.filter(e=>!q||`${e.name} ${e.site}`.toLowerCase().includes(q));els.expertsList.innerHTML=list.length?list.map(e=>{const on=members[e.id]!=null,w=Number(members[e.id]??25),pct=on&&total?Math.round(w/total*100):0;return `<div class="expert"><label><input type="checkbox" data-id="${esc(e.id)}" ${on?'checked':''}> ${esc(e.name)}<small>${esc(e.site||'Quelle unbekannt')}${e.accuracy!=null?` · Accuracy ${e.accuracy}`:''}${on?` · effektiv ${pct}%`:''}</small></label><input type="number" min="0" max="100" value="${w}" data-weight="${esc(e.id)}"></div>`}).join(''):'<div class="notice">Noch keine Experten geladen oder keine Treffer.</div>'}
function saveCurrentPanel(){const p=panels[activePanelId];if(!p)return;const members={};els.expertsList.querySelectorAll('[data-id]').forEach(cb=>{if(cb.checked){const id=cb.dataset.id,w=Number(els.expertsList.querySelector(`[data-weight="${CSS.escape(id)}"]`)?.value||0);if(w>0)members[id]=w}});p.members=members;persist()}

async function loadExperts(){
  if(els.loadExpertsBtn)els.loadExpertsBtn.disabled=true;
  try{
    const season=els.season.value.trim(),scoring=encodeURIComponent(els.scoring.value);
    let apiExperts=[];
    try{
      const data=await proxyCall(`/nfl/${season}/rankings/experts?position=ALL&type=DRAFT&scoring=${scoring}&include_overall=true`);
      apiExperts=extractExperts(data);
    }catch{}
    const publicExperts=await loadPublicExpertDirectory();

    const merged=new Map();
    for(const e of publicExperts){
      if(!e?.name)continue;
      merged.set(norm(e.name),{
        id:`pub:${e.slug||slugifyExpert(e.name)}`,
        name:String(e.name),
        site:String(e.site||''),
        accuracy:null,
        publicSlug:e.slug||slugifyExpert(e.name),
        directPublic:!!e.directPublic,
        comparisonPublic:!!e.comparisonPublic
      });
    }
    for(const e of apiExperts){
      const key=norm(e.name),prev=merged.get(key)||{};
      merged.set(key,{...prev,...e,id:String(e.id),apiId:String(e.id)});
    }

    // The presets must remain selectable even if FantasyPros' API/directory temporarily omits them.
    for(const p of Object.values(PRESETS)){
      for(const [name] of p.list){
        const key=norm(name);
        if(!merged.has(key))merged.set(key,{id:`pub:${slugifyExpert(name)}`,name,site:'',accuracy:null,publicSlug:slugifyExpert(name),virtual:true});
      }
    }

    experts=[...merged.values()].sort((a,b)=>(b.accuracy??-999)-(a.accuracy??-999)||a.name.localeCompare(b.name));
    if(!experts.length)throw new Error('Keine Experten erkannt.');
    applyPreset();
    persist();renderAll();

    const wanted=['Pat Fitzmaurice','Justin Boone','Sean Koerner','Andrew Erickson','Derek Brown','Matt Harmon'];
    const found=wanted.filter(n=>findExpert(n)).length;
    els.presetStatus.className='notice ok';
    els.presetStatus.textContent=`${experts.length} Experten verfügbar · Preset ${found}/${wanted.length} auswählbar. Quellen werden pro Experte automatisch geprüft.`;
    return {count:experts.length,found,api:apiExperts.length,public:publicExperts.length};
  }finally{
    if(els.loadExpertsBtn)els.loadExpertsBtn.disabled=false;
  }
}
async function loadExpertRanks(expertId){
  const cache=rankCache[expertId];
  if(cache&&cache.schemaVersion>=13&&cache.season===els.season.value&&cache.scoring===els.scoring.value&&cache.verifiedIndividual&&Object.keys(cache.ranks||{}).length&&Date.now()-cache.updated<12*3600e3)return cache;

  const expert=experts.find(e=>String(e.id)===String(expertId));
  if(!expert)throw new Error(`Experte ${expertId} nicht gefunden.`);

  try{
    const data=await fetchMultiSourceExpertRanking(expert);
    if(/^FantasyPros/.test(String(data.source||''))&&data.sourceContextVerified!==true)
      throw new Error(`${expert.name}: FantasyPros Scoring/Saison konnte nicht eindeutig verifiziert werden.`);
    const ranks={},counts={QB:0,RB:0,WR:0,TE:0};
    for(const row of data.players){
      const pos=String(row.pos||'').toUpperCase();
      const rank=Number(row.rank),posRank=Number(row.posRank);
      if(!row.name||!['QB','RB','WR','TE'].includes(pos)||!Number.isFinite(rank)||rank<=0)continue;
      ranks[norm(row.name)]={
        rank,
        posRank:Number.isFinite(posRank)&&posRank>0?posRank:null,
        name:row.name,
        pos,
        source:data.source,
        sourceUrl:data.sourceUrl||'',
        sourceUpdated:data.updated||'',
        exact:row.exact!==false,
        reconstructed:row.exact===false,
        reconstructionSpread:Number(row.spread)||0,
        reconstructionAnchors:Number(row.anchors)||0
      };
      counts[pos]++;
    }
    const total=Object.keys(ranks).length;
    if(total<80)throw new Error(`${expert.name}: nur ${total} verwertbare QB/RB/WR/TE-Spieler.`);

    const result={
      schemaVersion:13,season:els.season.value,scoring:els.scoring.value,updated:Date.now(),
      expertId:String(expertId),expertName:expert.name,ranks,
      missing:Object.entries(counts).filter(([,n])=>!n).map(([p])=>p),
      derived:[],overallCount:total,counts,
      verifiedIndividual:true,
      crosscheck:data.crosscheck||{ok:false,optional:true},
      source:data.source,
      sourceUrl:data.sourceUrl||'',
      sourceUpdated:data.updated||'',
      sourceConfidence:data.confidence||'primary',
      exactCount:Number(data.exactCount)||Object.values(ranks).filter(x=>x.exact).length,
      reconstructedCount:Number(data.reconstructedCount)||Object.values(ranks).filter(x=>x.reconstructed).length,
      coverage:Number(data.coverage)||0,
      quality:data.quality||null,
      sourceContextVerified:data.sourceContextVerified===true,
      sourceSeason:data.sourceSeason||'',sourceScoring:data.sourceScoring||'',
      sourceContext:data.sourceContext||null
    };
    rankCache[expertId]=result;
    store.set('v7_rank_'+expertId,result);
    return result;
  }catch(e){
    if(cache&&cache.schemaVersion>=13&&cache.verifiedIndividual&&Object.keys(cache.ranks||{}).length){
      const fallback={...cache,staleFallback:true,error:e.message};
      rankCache[expertId]=fallback;
      return fallback;
    }
    const failed={
      schemaVersion:13,season:els.season.value,scoring:els.scoring.value,updated:Date.now(),
      expertId:String(expertId),expertName:expert.name,ranks:{},missing:['SOURCE'],derived:[],
      overallCount:0,counts:{QB:0,RB:0,WR:0,TE:0},verifiedIndividual:false,error:e.message
    };
    rankCache[expertId]=failed;
    return failed;
  }
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

function computePanel(panelId,candidateKeys=null){
  const panel=panels[panelId],all={};
  for(const[eid,w0]of Object.entries(panel?.members||{})){
    const cache=rankCache[eid],w=Number(w0);
    if(!cache?.verifiedIndividual)continue;
    if(cache?.duplicateOf)continue;
    for(const[k,v]of Object.entries(cache?.ranks||{})){
      if(candidateKeys&&!candidateKeys.has(k))continue;
      all[k]??={name:v.name,pos:v.pos,values:[]};
      const sourceWeight=v.reconstructed?Math.max(.55,1-Math.min(10,Number(v.reconstructionSpread)||0)/25):1;
      all[k].values.push({
        expertId:eid,expertName:cache.expertName,rank:v.rank,posRank:v.posRank||null,
        w:w*sourceWeight,baseWeight:w,source:v.source||'unknown',
        exact:v.exact!==false,reconstructed:!!v.reconstructed,
        spread:Number(v.reconstructionSpread)||0,anchors:Number(v.reconstructionAnchors)||0
      });
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
  const selectedIds=[...new Set(Object.values(panels).flatMap(p=>Object.keys(p.members||{})))];
  const ids=[...new Set([...selectedIds,...presetCandidateIds()])];
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
      if(c.verifiedIndividual&&c.missing.length)skipped.push(`${c.expertName}: Positionsdaten fehlen ${c.missing.join('/')}`);
      if(c.derived?.length)skipped.push(`${c.expertName}: ${c.derived.join('/')} aus Overall abgeleitet`);
      if(c.staleFallback)skipped.push(`${c.expertName}: Quelle aktuell nicht erreichbar – letztes verifiziertes Ranking beibehalten`);
      if(c.reconstructedCount){
        const q=c.quality;
        skipped.push(`${c.expertName}: ${c.exactCount} exakte + ${c.reconstructedCount} rekonstruierte Overall-Ränge (${Math.round((q?.exactCoverage??c.coverage??0)*100)}% exakte Draft-Abdeckung${q?`, Ø-Spread ${Number(q.avgSpread||0).toFixed(1)}`:''})`);
      }
    }
    skipped.push(...flagDuplicateExpertRankings(ids));
    const backfilled=backfillPresetPanels();
    if(backfilled.length)skipped.push(`Preset-Backfill: ${backfilled.join(' · ')}`);
    const failedExperts=ids.filter(id=>!rankCache[id]?.verifiedIndividual);
    if(failedExperts.length)skipped.push(...failedExperts.map(id=>`${rankCache[id]?.expertName||id}: derzeit nicht automatisch verfügbar – übersprungen${rankCache[id]?.error?` (${rankCache[id].error})`:''}`));
    const verifiedIds=ids.filter(id=>rankCache[id]?.verifiedIndividual&&!rankCache[id]?.duplicateOf);
    if(!verifiedIds.length)throw new Error('Keine verifizierte Expertenquelle verfügbar. Vorhandene Paneldaten bleiben unverändert.');
    const pool=buildDraftCandidatePool(verifiedIds);
    if(pool.total<120)throw new Error(`Verifizierter Experten-Kandidatenpool zu klein (${pool.total}). Vorhandene Paneldaten bleiben unverändert.`);
    const candidate={};
    for(const id of Object.keys(panels))candidate[id]=computePanel(id,pool.keep);
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
    els.panelStatus.textContent=`Panels geladen · Expertenpool ${pool.total} (QB ${pool.counts.QB}, RB ${pool.counts.RB}, WR ${pool.counts.WR}, TE ${pool.counts.TE}) · ${Object.entries(panelRanks).map(([id,r])=>`${panels[id]?.name}: ${Object.keys(r).length}`).join(' · ')}${skipped.length?` · Hinweise: ${skipped.join(', ')}`:''}`;
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

function updateStatus(){const rankTime=Number(store.get('v7_lastRankingUpdate',0)),hours=rankTime?(Date.now()-rankTime)/3600000:null;const hasKey=Boolean(els.apiKey.value.trim());if(els.apiQuickStatus){els.apiQuickStatus.className=`notice ${hasKey?'ok':'bad'}`;els.apiQuickStatus.textContent=hasKey?'FantasyPros API-Key gespeichert. „Alles aktualisieren“ lädt Experten, Preset und Rankings.':'FantasyPros API-Key fehlt. Unter „Erweitert“ einmalig eintragen.';}els.onlineState.textContent=navigator.onLine?'Online':'Offline';els.onlineState.className=navigator.onLine?'ok':'bad';els.rankingAge.textContent=hours==null?'Wartet auf Draft':hours<1?`${Math.max(1,Math.round(hours*60))} Min.`:hours<24?`${Math.round(hours)} Std.`:`${Math.floor(hours/24)} Tag(e)`;els.rankingAge.className=hours==null?'bad':hours>24?'warn':'ok';els.adpCount.textContent=Object.keys(adp).length?String(Object.keys(adp).length):'Wartet auf Draft';els.adpCount.className=Object.keys(adp).length?'ok':'bad';const ready=experts.length&&Object.keys(panelRanks).length&&Object.keys(adp).length;els.qualityMini.textContent=ready?'Bereit':'Unvollständig';els.qualityMini.className=ready?'ok':'warn';const issues=[];if(!els.apiKey.value.trim())issues.push('API-Key fehlt');if(!experts.length)issues.push('Experten fehlen');if(!Object.keys(panelRanks).length)issues.push('Panel-Rankings fehlen');if(!Object.keys(adp).length)issues.push('Sleeper-ADP fehlt');els.qualityStatus.className=`notice ${issues.length?'warn':'ok'}`;els.qualityStatus.textContent=issues.length?`Noch nicht draftbereit: ${issues.join(' · ')}`:`Draftbereit: ${experts.length} Experten · ${Object.keys(panelRanks).length} Panels · ${Object.keys(adp).length} Sleeper-ADPs.`;if(Object.keys(adp).length){els.adpStatus.className='notice ok';els.adpStatus.textContent=`${Object.keys(adp).length} Sleeper-ADPs aktiv · Quelle: ${adpMeta.source||'verifizierter Import'}.`;if(els.adpHelper)els.adpHelper.textContent=`Sleeper-ADP aktiv (${Object.keys(adp).length}). Reach und Return nutzen diese Marktwerte zusätzlich zum Expertenpanel.`}else{els.adpStatus.className='notice warn';els.adpStatus.textContent='Keine verifizierte Sleeper-ADP vorhanden. Reach und Return werden konservativ behandelt.';if(els.adpHelper)els.adpHelper.textContent='Keine verifizierte Sleeper-ADP vorhanden. Das Expertenpanel bleibt Baseline; Reach und Return werden bewusst konservativ behandelt.'}}

const S='https://api.sleeper.app/v1';
const draftId=v=>(String(v||'').match(/(\d{10,})/)||[])[1]||String(v||'').trim();
async function jf(url,label){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${label}: HTTP ${r.status}`);return r.json()}
async function fetchDraft(id){const bust=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const[draft,picks,players]=await Promise.all([jf(`${S}/draft/${id}?_=${bust}`,'Draft'),jf(`${S}/draft/${id}/picks?_=${bust}`,'Picks'),jf(`${S}/players/nfl?_=${bust}`,'Spieler')]);return{draft,picks,players}}
async function fetchDraftFresh(id){
  const first=await fetchDraft(id);
  // Sleeper kann den Picks-Endpunkt unmittelbar nach einem Pick kurz verzögert ausliefern.
  // Eine zweite, kurze Kontrollabfrage innerhalb desselben Klicks verhindert den beobachteten "zweimal drücken"-Effekt.
  await new Promise(r=>setTimeout(r,220));
  try{const second=await fetchDraft(id);return (second.picks?.length||0)>=(first.picks?.length||0)?second:first}catch{return first}
}
function pinfo(id,m,players){const p=players[id]||{};return{name:m?.first_name&&m?.last_name?`${m.first_name} ${m.last_name}`:(p.full_name||m?.player_name||id),pos:String(m?.position||p.position||'?').toUpperCase(),team:String(m?.team||p.team||'FA').toUpperCase(),searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null,yearsExp:Number.isFinite(Number(p.years_exp))?Number(p.years_exp):null}}
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
function adpFor(name){const v=Number(adp[norm(name)]);return Number.isFinite(v)&&v>0?v:NaN}
function agreement(sd,n){if(!n||n<2)return'Einzelmeinung';if(sd<=3)return'Sehr hoher Konsens';if(sd<=7)return'Hoher Konsens';if(sd<=12)return'Umstritten';return'Stark umstritten'}
function returnChance(next,a){if(!Number.isFinite(next)||!Number.isFinite(a))return null;/* P(Spieler ist am Folgepick noch da): ADP als Marktmittel, bewusst enger als die alte Kurve. */return clamp(1/(1+Math.exp((next-a)/4)),.01,.99)}
function rosterState(mine,players,current=1){
  const c={QB:0,RB:0,WR:0,TE:0},byes={QB:{},RB:{},WR:{},TE:{}};
  for(const pick of mine){const p=pinfo(String(pick.player_id),pick.metadata,players);if(c[p.pos]!=null){c[p.pos]++;if(p.bye)byes[p.pos][p.bye]=(byes[p.pos][p.bye]||0)+1}}
  // v11: Replacement-Level statt bloßer leerer Startposition. In 10-Team/1QB ist QB1
  // aufschiebbar, QB2 fast immer verschwendeter Bench-Value. TE1 ist sogar bis nach dem
  // Draft aufschiebbar; TE2 wird ähnlich hart wie QB2 behandelt.
  const qbNeed=c.QB===0?(current>=125?13:current>=95?9:current>=65?4:1):-24;
  const teNeed=c.TE===0?(current>=130?1.5:current>=80?1:0.5):-22;
  const rbNeed=c.RB<2?9:c.RB<4?6:c.RB<6?3.5:c.RB<8?1.5:0;
  const wrNeed=c.WR<3?8:c.WR<5?4:c.WR<6?1.5:c.WR<7?0:-2;
  return{counts:c,need:{QB:qbNeed,RB:rbNeed,WR:wrNeed,TE:teNeed},byes};
}
function rosterExceptionPenalty(pos,state,current,rank,adp){
  if(pos==='QB'&&state.counts.QB>=1){
    // Ausnahme nur bei absurd gefallenem Elite-Value; normale QB12-20 sollen nie RB/WR-Lottery-Tickets verdrängen.
    const elite=rank<=45&&Number.isFinite(adp)&&current-adp>=35;
    return elite?-8:-42;
  }
  if(pos==='TE'&&state.counts.TE>=1){
    const elite=rank<=35&&Number.isFinite(adp)&&current-adp>=30;
    return elite?-7:-38;
  }
  return 0;
}
function lateUpsideBonus(p,current,state){
  let b=0;
  if(current>=90&&p.pos==='RB')b+=current>=125?5:3;
  if(current>=120&&p.pos==='WR'&&state.counts.WR>=6)b-=2;
  return b;
}

function strategyLabel(mode){return mode==='balanced'?'Balanced / Anti-Reach (v10)':'Progressive Upside (v11)'}
function progressiveStage(current){
  if(current<81)return 0;      // Starter-Value dominiert
  if(current<101)return 1;     // Übergang: Startertiefe + Ceiling
  if(current<121)return 2;     // Bench-Aufbau: asymmetrischer Upside-Pfad
  return 3;                    // Endgame: Trigger-EV + Opportunity Cost
}
function progressiveUpsideBonus(p,current,state){
  const stage=progressiveStage(current);if(!stage)return 0;
  let b=0;
  // RB-Upside steigt ab Runde 9 graduell. Rookie/Year-2-Profile bekommen einen kleinen
  // Zusatz, weil ihr Rollenwert in der zweiten Saisonhälfte besonders stark springen kann.
  if(p.pos==='RB')b += [0,2.0,4.0,6.5][stage];
  if((p.pos==='RB'||p.pos==='WR')&&p.yearsExp!=null&&p.yearsExp<=1)b += [0,1.0,2.0,3.5][stage];
  // Ein sehr tiefer WR-Room bleibt ein Tiebreaker, wird aber nicht zum harten Ausschluss.
  if(p.pos==='WR'&&state.counts.WR>=7)b -= [0,1,2,3][stage];
  return b;
}
function strategyStatusText(mode){
  return mode==='balanced'
    ? 'BALANCED / ANTI-REACH: eingefrorene Referenzstrategie. Panel/ADP und Warten bleiben auch spät stark gewichtet.'
    : 'PROGRESSIVE UPSIDE: Standard. Ab Runde 9 steigt Ceiling-Gewichtung graduell; späte Reaches werden bei plausiblen Breakout-Pfaden toleranter.';
}
function injuryStashAdjustment(p,current){
  // Replay-Kalibrierung: PUP/IR ist kein Upside-Bonus. Verpasste Wochen und belegter Benchplatz
  // haben Opportunity Cost; IR bleibt stark negativ, bis season-ending/return timetable extern geklärt ist.
  const st=String(p.injury||'').toUpperCase();
  if(st==='PUP')return current>=121?-4.0:-5.0;
  if(st==='IR')return -12;
  return 0;
}
function marginalRosterUtility(p,current,state){
  // Keine starre Sollverteilung: nur gradueller Grenznutzen. Eure Flex-Regeln erlauben 1–3 RB und 2–4 WR Starter.
  const c=state.counts||{},n=Number(c[p.pos]||0);let x=0;
  if(p.pos==='RB'&&current>=81){if(n>=7)x-=3.5;else if(n>=6)x-=2;else if(n<=3)x+=1;}
  if(p.pos==='WR'&&current>=81){if(n>=8)x-=6;else if(n>=7)x-=4;else if(n>=6)x-=1.5;else if(n<=4)x+=.5;}
  if(p.pos==='QB'&&n===0&&current>=130)x+=7;
  if(p.pos==='TE'&&n===0&&current>=120)x+=4;
  return x;
}


// Opponent Model v1. Evidence-weighted: only tendencies supported by historical review/user observations.
// Candidate-specific traits stay deliberately modest; they modify return pressure, never override the panel.
const MANAGER_PROFILES={
  basti:{label:'Basti',pos:{WR:.10,RB:.05},confidence:'mittel-hoch',history:{years:8,firstQB:6.1,firstTE:7.8,recentQB:7.0,recentTE:8.7},traits:{rookieRB:.18,bears:.06,lateReach:.12,bearsTargets:.08}},
  michael:{label:'Michael',pos:{TE:-.08,RB:.03,WR:.06},confidence:'hoch',history:{years:7,firstQB:6.4,firstTE:8.0,recentQB:7.7,recentTE:12.0},traits:{knownNames:.10,rookie:-.10}},
  'pascal voerde':{label:'Pascal / Voerde',pos:{},confidence:'mittel',history:{years:8,firstQB:5.4,firstTE:5.3,recentQB:7.0,recentTE:3.7},traits:{unconventional:.05}},
  'dutch marc':{label:'Dutch-Marc',pos:{QB:.06,TE:.06},confidence:'mittel-hoch',history:{years:8,firstQB:5.1,firstTE:4.5,recentQB:5.3,recentTE:5.0},traits:{}},
  'pascal geldern':{label:'Pascal / Gelderner',pos:{WR:.05},confidence:'mittel',history:{years:2,firstQB:3.0,firstTE:4.5,recentQB:3.0,recentTE:4.5},traits:{waitQBTE:.07,wrEarly:.05,unconventional:.05}},
  thomas:{label:'Thomas',pos:{QB:.03,TE:.03},confidence:'mittel',traits:{}},
  giuliano:{label:'Giuliano',pos:{QB:.04,TE:.04},confidence:'mittel',history:{years:6,firstQB:5.7,firstTE:5.3,recentQB:6.0,recentTE:5.5},traits:{}},
  // 2021 all-rookie was a confirmed one-season theme and is intentionally excluded from normal Björn tendencies.
  bjorn:{label:'Björn',pos:{RB:.10},confidence:'mittel-hoch',history:{years:7,firstQB:8.2,firstTE:8.4,recentQB:9.0,recentTE:9.0,excludeTheme2021:true},traits:{recentEarlyRB:.08}},
  bjoern:{label:'Björn',pos:{RB:.10},confidence:'mittel-hoch',history:{years:7,firstQB:8.2,firstTE:8.4,recentQB:9.0,recentTE:9.0,excludeTheme2021:true},traits:{recentEarlyRB:.08}},
  'dusseldorf marc':{label:'Düsseldorf-Marc',pos:{},confidence:'niedrig',traits:{}}
};
function parseManagerMap(text){const out={};for(const part of String(text||'').split(',')){const m=part.trim().match(/^(\d+)\s*=\s*(.+)$/);if(m)out[Number(m[1])]=m[2].trim()}return out}
const ACTIVE_2026_MANAGER_MAP=Object.freeze(parseManagerMap(ACTIVE_2026_MANAGER_MAP_TEXT));
function resolvedManagerMap(mode,season,teams,text){
  // The real 2026 league composition/order is confirmed. Never let stale historical/localStorage maps
  // (e.g. Kai) leak into LIVE Return-v2. Replay/mock keep their explicit mapping semantics.
  if(mode==='live'&&String(season)==='2026'&&Number(teams)===10)return {...ACTIVE_2026_MANAGER_MAP};
  return parseManagerMap(text);
}
function managerProfile(name){const n=norm(name).replace(/oe/g,'o').replace(/ue/g,'u');return Object.entries(MANAGER_PROFILES).find(([k])=>n.includes(norm(k).replace(/oe/g,'o').replace(/ue/g,'u')))?.[1]||null}
function rosterBySlot(picks,players,teams){const out={};for(let s=1;s<=teams;s++)out[s]={QB:0,RB:0,WR:0,TE:0,K:0,DEF:0};for(const pick of picks){const s=Number(pick.draft_slot),pos=pinfo(String(pick.player_id),pick.metadata,players).pos;if(out[s]&&out[s][pos]!=null)out[s][pos]++}return out}
function slotsBetween(current,next,teams){const a=[];if(!Number.isFinite(next))return a;for(let p=current;p<next;p++){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1,s=r%2?w:teams-w+1;a.push(s)}return a}
function endgameSkillShare(c,current){
  if(current<120)return 1;
  // Gegner mit noch offenen K/DST-Slots verbrauchen im Endgame einen erheblichen Teil ihrer Picks dort.
  const openSpecial=(c.K===0?1:0)+(c.DEF===0?1:0);
  return openSpecial===2?.34:openSpecial===1?.62:.92;
}
function plausibleFor(pos,c,current=1){let v;if(pos==='QB')v=c.QB===0?1:c.QB===1?.18:.03;else if(pos==='TE')v=c.TE===0?1:c.TE===1?.20:.04;else if(pos==='RB')v=c.RB<3?1:c.RB<5?.72:.35;else if(pos==='WR')v=c.WR<4?1:c.WR<6?.78:.40;else v=.2;return v*endgameSkillShare(c,current)}
function candidateManagerMod(prof,p,current){
  if(!prof||!p)return{mult:1,labels:[]};
  const t=prof.traits||{},labels=[];let delta=0;
  // Historical timing is used as a soft hazard layer, never as a deterministic rule.
  // Recent seasons get more weight, but explicit current-year intel (e.g. Pascal waiting at QB/TE) remains separate below.
  const h=prof.history||{},round=Math.floor((current-1)/10)+1;
  if(p.pos==='QB'&&Number.isFinite(h.recentQB)){const d=round-h.recentQB;if(d>=0){const z=Math.min(.22,.06+d*.035);delta+=z;labels.push(`QB-Timing +${Math.round(z*100)}%`)}else if(d<=-2){delta-=.05;labels.push('QB-Timing -5%')}}
  if(p.pos==='TE'&&Number.isFinite(h.recentTE)){const d=round-h.recentTE;if(d>=0){const z=Math.min(.22,.06+d*.035);delta+=z;labels.push(`TE-Timing +${Math.round(z*100)}%`)}else if(d<=-2){delta-=.05;labels.push('TE-Timing -5%')}}
  const rookie=p.yearsExp===0;
  if(t.rookie&&rookie){delta+=t.rookie;labels.push(`Rookie ${t.rookie>0?'+':''}${Math.round(t.rookie*100)}%`)}
  if(t.rookieRB&&rookie&&p.pos==='RB'){delta+=t.rookieRB;labels.push(`Rookie-RB +${Math.round(t.rookieRB*100)}%`)}
  if(t.bears&&p.team==='CHI'){delta+=t.bears;labels.push(`Bears +${Math.round(t.bears*100)}%`)}
  if(t.bearsTargets&&['caleb williams','colston loveland'].includes(norm(p.name))){delta+=t.bearsTargets;labels.push(`Bears-Ziel/Stack-Hypothese +${Math.round(t.bearsTargets*100)}%`)}
  if(t.wrEarly&&p.pos==='WR'&&current<=60){delta+=t.wrEarly;labels.push(`früher WR-Prior +${Math.round(t.wrEarly*100)}%`)}
  if(t.recentEarlyRB&&p.pos==='RB'&&current<=50){delta+=t.recentEarlyRB;labels.push(`2025-RB-Regime +${Math.round(t.recentEarlyRB*100)}%`)}
  if(t.lateReach&&current>=81){delta+=t.lateReach;labels.push(`Late-Reach +${Math.round(t.lateReach*100)}%`)}
  if(t.waitQBTE&&(p.pos==='QB'||p.pos==='TE')&&current<100){delta-=t.waitQBTE;labels.push(`QB/TE warten -${Math.round(t.waitQBTE*100)}%`)}
  // knownNames/unconventional are retained as profile evidence but not auto-scored without a robust player-level proxy.
  // Correlated qualitative signals are capped so fandom, player target and stack narratives cannot double-count without bound.
  delta=clamp(delta,-.25,.25);
  return{mult:Math.max(.65,1+delta),labels};
}
function stressProfile(mode,p,current){
  if(mode==='rb')return{mult:p.pos==='RB'?1.22:1,label:p.pos==='RB'?'RB-Druck +22%':''};
  if(mode==='te')return{mult:p.pos==='TE'?1.35:1,label:p.pos==='TE'?'TE-Run +35%':''};
  if(mode==='rookie')return{mult:(p.pos==='RB'&&p.yearsExp===0)?1.38:(p.pos==='RB'?1.08:1),label:(p.pos==='RB'&&p.yearsExp===0)?'Rookie-RB-Druck +38%':(p.pos==='RB'?'RB-Druck +8%':'')};
  if(mode==='late'&&current>=81)return{mult:(p.pos==='RB'||p.pos==='WR')?1.18:1.06,label:(p.pos==='RB'||p.pos==='WR')?'Late-Upside-Druck +18%':'Late-Druck +6%'};
  return{mult:1,label:''};
}
function stressLabel(mode){return({baseline:'Baseline',rb:'RB-Run / RB-Druck',te:'TE-Run',rookie:'Rookie-RB-Reach',late:'Late-Round-Upside'})[mode]||'Baseline'}
function liveIntel(p,current,next,picks,players,teams,mode,map,stress='baseline'){
  const pos=p.pos,between=slotsBetween(current+1,next,teams),rosters=rosterBySlot(picks,players,teams);let hazard=0,plausible=0,uncertain=0,mods=[];
  for(const s of between){const base=plausibleFor(pos,rosters[s]||{QB:0,RB:0,WR:0,TE:0,K:0,DEF:0},current);if(base>=.6)plausible++;let mult=1;
    if(mode==='live'){const prof=managerProfile(map[s]);if(prof){const m=prof.pos[pos]||0;mult*=1+m;const cm=candidateManagerMod(prof,p,current);mult*=cm.mult;if(m||cm.labels.length)mods.push(`${prof.label}${m?` ${m>0?'+':''}${Math.round(m*100)}% ${pos}`:''}${cm.labels.length?` · ${cm.labels.join(' · ')}`:''}`);if(prof.uncertain)uncertain++}}
    const sp=stressProfile(stress,p,current);mult*=sp.mult;if(sp.label)mods.push(`Stress: ${sp.label}`);hazard+=base*mult;
  }
  const effectiveSkillPicks=between.reduce((a,s)=>a+endgameSkillShare(rosters[s]||{K:0,DEF:0},current),0);
  return{between:between.length,effectiveSkillPicks,plausible,hazard,uncertain,mods:[...new Set(mods)]};
}
function adjustedReturn(base,intel){if(base==null)return null;const eff=Math.max(.5,intel.effectiveSkillPicks??intel.between);const pressure=clamp((intel.hazard-eff*.45)*.07,-.12,.15);const endgameRelief=clamp((intel.between-eff)*.035,0,.30);return clamp(base-pressure+endgameRelief,.02,.98)}
function returnConfidence(ret,intel,mode,hasAdp){let score=hasAdp?82:52;score-=Math.min(22,intel.between*1.7);score-=intel.uncertain*5;if(mode==='replay')score+=4;return clamp(Math.round(score),30,94)}
function lossIfGone(x){let loss=0;if(x.sameTier<=2)loss+=2;if(Number.isFinite(x.tierGap))loss+=Math.min(4,x.tierGap/4);if(Number.isFinite(x.alternativeGap))loss+=Math.min(3,x.alternativeGap/6);if((x.nearAlternatives||0)>=2)loss-=1.5;else if((x.nearAlternatives||0)===1)loss-=.5;if(x.p.pos==='RB'&&x.r.rank>=70)loss+=1;return loss>=5?'hoch':loss>=2.5?'mittel':'niedrig'}
function actionLabel(x){if(x.loss==='hoch'&&(x.ret??1)<.65)return'JETZT';if((x.ret??0)>=.72)return'WARTEN';if((x.ret??1)<.35)return'EHER JETZT';return'ABWÄGEN'}
function modeStatusText(mode,map){if(mode==='live')return `LIVE LEAGUE: Managerhistorie aktiv${Object.keys(map).length?` · ${Object.keys(map).length} Slots zugeordnet`:' · WARNUNG: keine Slot→Manager-Zuordnung'}`;if(mode==='replay')return 'REPLAY: historische Picks werden nur bis zum gewählten Cutoff sichtbar.';return 'MOCK/TEST: Managerhistorie ist vollständig deaktiviert.'}



// v11.4 Simulation Lab v1. It is deliberately a counterfactual stress tool, not a new ranking source.
// Opponent selections are sampled from panel rank + ADP + roster need + evidence-weighted manager traits.
function simNeedWeight(pos,c){
  if(pos==='QB')return c.QB===0?1.15:c.QB===1?.18:.03;
  if(pos==='TE')return c.TE===0?1.10:c.TE===1?.20:.04;
  if(pos==='RB')return c.RB<2?1.12:c.RB<4?.92:.58;
  if(pos==='WR')return c.WR<3?1.10:c.WR<5?.94:.62;
  return .2;
}
function seededRng(seed){let x=seed>>>0;return()=>{x=(x+0x6D2B79F5)|0;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function weightedChoice(rows,rng=Math.random){let total=rows.reduce((a,x)=>a+x.w,0),r=rng()*total;for(const x of rows){r-=x.w;if(r<=0)return x}return rows[rows.length-1]}
function simCandidateWeight(p,pickNo,roster,profile,stress){
  const r=rankFor(p.name,p.pos);if(!r)return 0;
  const a=adpFor(p.name);
  // Selection pressure must remain ordered even after players become overdue.
  // The old one-sided distance collapsed every overdue player to the same market weight,
  // making e.g. rank 5 and rank 50 nearly equivalent at pick 60 apart from roster need.
  // Panel is the primary anchor; Sleeper ADP supplies a smaller market correction.
  const panelDelta=clamp((pickNo-r.rank)/18,-4,4);
  let w=Math.exp(panelDelta)*simNeedWeight(p.pos,roster);
  if(Number.isFinite(a)){
    const adpDelta=clamp((pickNo-a)/38,-2.5,2.5);
    w*=Math.exp(adpDelta);
  }
  if(profile){w*=1+(profile.pos[p.pos]||0);w*=candidateManagerMod(profile,p,pickNo).mult;}
  w*=stressProfile(stress,p,pickNo).mult;
  return Math.max(.0001,w);
}
function cloneRosters(x){const o={};for(const[k,v]of Object.entries(x))o[k]={...v};return o}
function returnV2Confidence(ret,runs,mode,hasAdp,mapCoverage,slotCount){
  if(!Number.isFinite(ret))return 30;
  // Monte-Carlo sampling uncertainty + evidence quality. Manager mapping matters only in live mode.
  const se=Math.sqrt(Math.max(.000001,ret*(1-ret))/Math.max(1,runs));
  let score=92-Math.min(24,se*100*5);
  if(!hasAdp)score-=18;
  if(mode==='live')score-=Math.round((1-clamp(mapCoverage,0,1))*18);
  if(slotCount>=12)score-=3;
  return clamp(Math.round(score),35,95);
}
function simulateReturnV2(ctx,stress='baseline',runs=900){
  const {current,next,picks,players,teams,map,rankedAvailable,mode='mock'}=ctx;
  if(!Number.isFinite(next)||next<=current)return null;
  const targets=rankedAvailable.slice(0,24),targetNames=targets.map(p=>norm(p.name));
  const survive=Object.fromEntries(targetNames.map(n=>[n,0]));
  const takenBy=Object.fromEntries(targetNames.map(n=>[n,{}]));
  // Target Collision Probability: per-manager probability of taking >=1 current target
  // before the user's return. Count once per manager/run even if that manager has
  // two sequential picks and takes two targets.
  const collisionByManager={};
  const collisionTargetCounts={};
  const baseRosters=rosterBySlot(picks,players,teams),slots=slotsBetween(current+1,next,teams);
  const mappedSlots=new Set(slots.filter(s=>managerProfile(map[s])));
  const mapCoverage=slots.length?mappedSlots.size/new Set(slots).size:0;
  const seedBase=(current*1009+next*9176+stress.split('').reduce((a,c)=>a+c.charCodeAt(0),0)*131+731)>>>0;
  for(let run=0;run<runs;run++){
    const rng=seededRng(seedBase+run*2654435761);
    let pool=rankedAvailable.slice(),rosters=cloneRosters(baseRosters);
    const collidedManagers=new Set();
    for(let i=0;i<slots.length&&pool.length;i++){
      const slot=slots[i],pickNo=current+1+i,prof=mode==='live'?managerProfile(map[slot]):null,roster=rosters[slot];
      const skillShare=endgameSkillShare(roster,pickNo);
      if(pickNo>=120&&rng()>skillShare){
        if(roster.DEF===0&&roster.K===0){if(rng()<.5)roster.DEF++;else roster.K++;}
        else if(roster.DEF===0)roster.DEF++;else if(roster.K===0)roster.K++;
        continue;
      }
      const board=pool.slice(0,70).map(p=>({p,w:simCandidateWeight(p,pickNo,roster,prof,stress)}));
      const chosen=weightedChoice(board,rng);if(!chosen)break;
      const key=norm(chosen.p.name),idx=pool.indexOf(chosen.p);if(idx>=0)pool.splice(idx,1);
      if(roster[chosen.p.pos]!=null)roster[chosen.p.pos]++;
      if(takenBy[key]){
        const label=prof?.label||`Slot ${slot}`;
        const k=`${label}|${slot}`;
        takenBy[key][k]=(takenBy[key][k]||0)+1;
        collidedManagers.add(k);
        collisionTargetCounts[k]=collisionTargetCounts[k]||{};
        collisionTargetCounts[k][key]=(collisionTargetCounts[k][key]||0)+1;
      }
    }
    for(const k of collidedManagers)collisionByManager[k]=(collisionByManager[k]||0)+1;
    const left=new Set(pool.map(p=>norm(p.name)));for(const n of targetNames)if(left.has(n))survive[n]++;
  }
  const result={};
  for(const p of targets){
    const n=norm(p.name),ret=survive[n]/runs,entries=Object.entries(takenBy[n]||{}).sort((a,b)=>b[1]-a[1]);
    const top=entries[0];
    result[n]={
      ret,
      runs,
      topRisk:top?{label:top[0].split('|')[0],slot:Number(top[0].split('|')[1]),prob:top[1]/runs}:null,
      takers:Object.fromEntries(entries.map(([k,v])=>[k,v/runs])),
      confidence:returnV2Confidence(ret,runs,mode,Number.isFinite(adpFor(p.name)),mapCoverage,slots.length)
    };
  }
  const collisions=Object.fromEntries(
    Object.entries(collisionByManager)
      .sort((a,b)=>b[1]-a[1])
      .map(([k,v])=>{
        const [label,slotText]=k.split('|');
        const collisionTargets=Object.entries(collisionTargetCounts[k]||{})
          .sort((a,b)=>b[1]-a[1])
          .slice(0,8)
          .map(([key,count])=>({key,name:targets.find(p=>norm(p.name)===key)?.name||key,prob:count/runs}));
        return[k,{label,slot:Number(slotText),prob:v/runs,targets:collisionTargets}];
      })
  );
  return{players:result,runs,slots,mapCoverage,collisions};
}
function returnValidationKey(){return 'v118_returnValidation'}
function decisionFixtureKey(){return 'v118_decisionFixtures'}
function loadReturnValidation(){try{return JSON.parse(localStorage.getItem(returnValidationKey())||'[]')}catch{return []}}
function saveReturnValidation(rows){try{localStorage.setItem(returnValidationKey(),JSON.stringify(rows.slice(-500)))}catch{}}
function loadDecisionFixtures(){try{const v=JSON.parse(localStorage.getItem(decisionFixtureKey())||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function saveDecisionFixtures(rows){try{localStorage.setItem(decisionFixtureKey(),JSON.stringify(rows.slice(-250)))}catch{}}
function resolveReturnValidation(draftId,picks){
  const rows=loadReturnValidation();let changed=false;
  for(const row of rows){
    if(row.draftId!==draftId||row.resolved||!Number.isFinite(row.returnPick))continue;
    const ownPick=picks.find(p=>Number(p.pick_no)===Number(row.current)&&(!Number.isFinite(Number(row.slot))||Number(p.draft_slot)===Number(row.slot)));
    const chosenKey=ownPick?norm(ownPick.metadata?.first_name&&ownPick.metadata?.last_name?`${ownPick.metadata.first_name} ${ownPick.metadata.last_name}`:(ownPick.metadata?.player_name||'')):'';
    if((picks?.length||0)<row.returnPick-1&&!chosenKey)continue;
    const window=picks.filter(p=>p.pick_no>row.current&&p.pick_no<row.returnPick);
    let allResolved=(picks?.length||0)>=row.returnPick-1;
    for(const pred of row.predictions){
      if(chosenKey&&pred.key===chosenKey){pred.forecastResolution='censored_user_pick';pred.brier=null;pred.actualSurvived=null;continue}
      if(!allResolved){pred.forecastResolution='pending';continue}
      const hit=window.find(p=>norm(p.metadata?.first_name&&p.metadata?.last_name?`${p.metadata.first_name} ${p.metadata.last_name}`:(p.metadata?.player_name||''))===pred.key);
      pred.actualSurvived=!hit;pred.actualTakenPick=hit?.pick_no??null;pred.actualTakenSlot=hit?.draft_slot??null;
      pred.forecastResolution='resolved';pred.brier=(pred.returnProb-(pred.actualSurvived?1:0))**2;
    }
    if(allResolved){row.resolved=true;row.resolvedAt=Date.now()}changed=true;
  }
  if(changed)saveReturnValidation(rows);
}
function freezeReturnValidation(draftId,current,returnPick,rv2,rankedAvailable,slot){
  if(!rv2||!Number.isFinite(returnPick)||returnPick<=current)return;
  const rows=loadReturnValidation(),id=`${draftId}|${current}|${returnPick}`;
  if(rows.some(r=>r.id===id))return;
  const predictions=rankedAvailable.slice(0,12).map(p=>{const x=rv2.players[norm(p.name)];return x?{key:norm(p.name),name:p.name,pos:p.pos,returnProb:x.ret,confidence:x.confidence,topRisk:x.topRisk,forecastResolution:'pending',brier:null}:null}).filter(Boolean);
  rows.push({id,draftId,current,returnPick,slot:Number.isFinite(Number(slot))?Number(slot):null,createdAt:Date.now(),resolved:false,predictions});saveReturnValidation(rows);
}
function freezeDecisionFixture({draftId,current,returnPick,picks,mine,rankedAvailable,scored,rv2,mode,strategy,stress,teams,slot,fingerprint}){
  const rows=loadDecisionFixtures(),id=`${draftId}|${current}|${fingerprint}`;if(rows.some(r=>r.id===id))return;
  const endOfDraft=!Number.isFinite(returnPick)||returnPick<=current;
  const evidenceCutoff=Date.now();
  rows.push({
    id,draftId,current,returnPick:Number.isFinite(returnPick)?returnPick:null,createdAt:evidenceCutoff,fingerprint,mode,strategy,stress,teams,slot,
    modelVersion:'v11.8.0-rc4.5',rng:{runs:rv2?.runs??900,seedBasis:`${current}|${returnPick??'end'}|${stress}`},
    picks:picks.map(p=>({pick_no:p.pick_no,draft_slot:p.draft_slot,player_id:String(p.player_id),player_name:p.metadata?.first_name&&p.metadata?.last_name?`${p.metadata.first_name} ${p.metadata.last_name}`:(p.metadata?.player_name||'')})),
    userRoster:mine.map(p=>({pick_no:p.pick_no,player_id:String(p.player_id),player_name:p.metadata?.first_name&&p.metadata?.last_name?`${p.metadata.first_name} ${p.metadata.last_name}`:(p.metadata?.player_name||'')})),
    candidates:scored.slice(0,16).map(x=>({playerId:String(x.p.id||''),name:x.p.name,pos:x.p.pos,panelRank:x.r?.rank??null,panelId:x.r?.panelId??null,adp:Number.isFinite(x.a)?x.a:null,injury:x.p.injury||null,researchEvidence:researchPlayerState(x.p,evidenceCutoff).slice(-4),returnProb:x.ret??null,returnConfidence:x.returnConfidence??null,topRisk:x.topRisk??null,coachScore:x.score??null,action:x.action??null})),
    forecastResolution:endOfDraft?'unresolved_end_of_draft':'pending',chosenPlayer:null
  });saveDecisionFixtures(rows);
}
function resolveDecisionFixtures(draftId,picks){const rows=loadDecisionFixtures();let changed=false;for(const f of rows){if(f.draftId!==draftId||f.chosenPlayer)continue;const hit=picks.find(p=>Number(p.pick_no)===Number(f.current)&&Number(p.draft_slot)===Number(f.slot));if(hit){f.chosenPlayer={playerId:String(hit.player_id),name:hit.metadata?.first_name&&hit.metadata?.last_name?`${hit.metadata.first_name} ${hit.metadata.last_name}`:(hit.metadata?.player_name||'')};if(f.forecastResolution==='pending')f.forecastResolution='chosen';changed=true}}if(changed)saveDecisionFixtures(rows)}
function simulateToReturn(ctx,stress='baseline',runs=1200){
  const {current,next,picks,players,teams,map,rankedAvailable}=ctx;
  if(!Number.isFinite(next)||next<=current)return null;
  const targetNames=rankedAvailable.slice(0,24).map(p=>norm(p.name)),survive=Object.fromEntries(targetNames.map(n=>[n,0]));
  const baseRosters=rosterBySlot(picks,players,teams),slots=slotsBetween(current+1,next,teams),seedBase=(current*1009+next*9176+stress.split('').reduce((a,c)=>a+c.charCodeAt(0),0)*131)>>>0;
  for(let run=0;run<runs;run++){
    const rng=seededRng(seedBase+run*2654435761);
    let pool=rankedAvailable.slice(),rosters=cloneRosters(baseRosters);
    for(let i=0;i<slots.length&&pool.length;i++){
      const slot=slots[i],pickNo=current+1+i,prof=managerProfile(map[slot]),roster=rosters[slot];
      // Replay calibration: in the endgame opponents often spend nominal picks on K/DST.
      // Those picks must consume a turn without removing a QB/RB/WR/TE from the simulated pool.
      const skillShare=endgameSkillShare(roster,pickNo);
      if(pickNo>=120&&rng()>skillShare){
        if(roster.DEF===0&&roster.K===0){if(rng()<.5)roster.DEF++;else roster.K++;}
        else if(roster.DEF===0)roster.DEF++;
        else if(roster.K===0)roster.K++;
        continue;
      }
      // Evaluate a deep but bounded board; random tail gives late reaches a path without dominating runtime.
      const board=pool.slice(0,70).map(p=>({p,w:simCandidateWeight(p,pickNo,roster,prof,stress)}));
      const chosen=weightedChoice(board,rng);if(!chosen)break;
      const idx=pool.indexOf(chosen.p);if(idx>=0)pool.splice(idx,1);
      if(roster[chosen.p.pos]!=null)roster[chosen.p.pos]++;
    }
    const left=new Set(pool.map(p=>norm(p.name)));for(const n of targetNames)if(left.has(n))survive[n]++;
  }
  return Object.fromEntries(Object.entries(survive).map(([n,v])=>[n,v/runs]));
}
function runSimulationLab(){
  const c=lastDraftContext;if(!c||!c.rankedAvailable||!Number.isFinite(c.next)||c.next<=c.current){els.simulationStatus.className='notice warn';els.simulationStatus.textContent='Kein Folgepick für eine Simulation verfügbar.';return}
  els.simulateBtn.disabled=true;els.simulationStatus.className='notice';els.simulationStatus.textContent='Simuliere 5 Szenarien × 1.200 Läufe …';
  setTimeout(()=>{try{
    const modes=['baseline','rb','te','rookie','late'],out={};for(const m of modes)out[m]=simulateToReturn(c,m,1200);
    const focus=c.scored.slice(0,8);
    const cell=(x,m)=>out[m]?.[norm(x.p.name)];
    const avg=x=>modes.reduce((a,m)=>a+(cell(x,m)??0),0)/modes.length;
    const spread=x=>{const v=modes.map(m=>cell(x,m)).filter(Number.isFinite);return v.length?Math.max(...v)-Math.min(...v):0};
    els.simulationResults.innerHTML=`<div class="tiny" style="overflow-x:auto"><table><thead><tr><th>Spieler</th>${modes.map(m=>`<th>${esc(stressLabel(m))}</th>`).join('')}<th>Ø</th><th>Spanne</th></tr></thead><tbody>${focus.map(x=>`<tr><td><b>${esc(x.p.name)}</b> · ${x.p.pos}</td>${modes.map(m=>`<td>${Number.isFinite(cell(x,m))?Math.round(cell(x,m)*100)+'%':'–'}</td>`).join('')}<td><b>${Math.round(avg(x)*100)}%</b></td><td>${Math.round(spread(x)*100)} Pkt.</td></tr>`).join('')}</tbody></table></div>`;
    const volatile=focus.slice().sort((a,b)=>spread(b)-spread(a))[0];
    els.simulationStatus.className='notice ok';els.simulationStatus.textContent=`Gegenprobe fertig (deterministisch reproduzierbar). Ø = Mittel der fünf Stresswelten; Spanne = Szenario-Sensitivität.${volatile?` Höchste Sensitivität: ${volatile.p.name} (${Math.round(spread(volatile)*100)} Pkt.).`:''} Keine neue Rankingquelle.`;
  }catch(e){els.simulationStatus.className='notice bad';els.simulationStatus.textContent=`Simulation fehlgeschlagen: ${e.message}`}finally{els.simulateBtn.disabled=false}},20);
}

function draftPhaseNeedFactor(current){
  if(current<=20)return .15;
  if(current<=50)return .28;
  if(current<=90)return .42;
  return .58;
}
function normalizeCoachScores(rows){
  if(!rows.length)return rows;
  const bestRaw=Math.max(...rows.map(x=>x.rawScore));
  for(const x of rows)x.score=Math.round(clamp(100-Math.max(0,bestRaw-x.rawScore)*2.15,0,100));
  return rows;
}

/*
 * v11.8-dev: Player-Quality / Value-Safety gate.
 *
 * Canonical invariant:
 * Market price, roster need, upside and Return-v2 may decide WHEN to take a player,
 * but they may not silently make a materially superior selected-panel player disappear.
 *
 * This gate does not replace the selected panel with ADP/ECR and does not remove
 * alternatives. It only prevents the final recommendation from bypassing a clearly
 * stronger panel band without an explicit evidence-based override layer.
 */
function playerQualitySafetyThreshold(current){
  // Slightly wider later because roster construction/upside legitimately matters more,
  // while still preventing large unexplained panel-quality skips.
  if(current<=30)return 7;
  if(current<=70)return 9;
  if(current<=110)return 11;
  return 13;
}
function applyPlayerQualitySafetyGate(rows,current){
  const valid=rows.filter(x=>x?.r&&Number.isFinite(x.r.rank)&&Number.isFinite(x.rawScore));
  if(!valid.length)return{triggered:false,reason:'no-valid-candidates'};

  const naturalLeader=valid.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];
  const bestPanelRank=Math.min(...valid.map(x=>x.r.rank));
  const threshold=playerQualitySafetyThreshold(current);
  const gap=naturalLeader.r.rank-bestPanelRank;

  if(gap<threshold){
    for(const x of valid)x.valueSafety={triggered:false,bestPanelRank,threshold,naturalLeaderRank:naturalLeader.r.rank};
    return{triggered:false,bestPanelRank,threshold,naturalLeaderRank:naturalLeader.r.rank};
  }

  // Keep a narrow panel-quality band admissible for the top recommendation.
  // Within that band normal utility/Return logic may still choose among peers.
  const qualityBandMax=bestPanelRank+Math.max(3,Math.floor(threshold/2));
  const qualityBand=valid.filter(x=>x.r.rank<=qualityBandMax);
  const safetyLeader=qualityBand.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];
  const maxRaw=Math.max(...valid.map(x=>x.rawScore));

  // A future research override can bypass this only by setting an explicit,
  // evidence-backed override object. Current development code has no such
  // validated override path, so the gate is deliberately fail-safe.
  const override=naturalLeader?.qualityOverride;
  const overrideValid=Boolean(
    override?.approved===true &&
    typeof override.reason==='string' &&
    override.reason.trim().length>=12 &&
    Number(override.confidence)>=70
  );

  if(!overrideValid&&safetyLeader){
    safetyLeader.rawScore=Math.max(safetyLeader.rawScore,maxRaw+.25);
    safetyLeader.reasons=safetyLeader.reasons||[];
    safetyLeader.reasons.push(
      `Value-Safety Gate: Panel #${safetyLeader.r.rank.toFixed(1)} vor natürlichem Leader #${naturalLeader.r.rank.toFixed(1)}`
    );
  }else if(overrideValid){
    naturalLeader.reasons=naturalLeader.reasons||[];
    naturalLeader.reasons.push(`Value-Safety Override: ${override.reason}`);
  }

  for(const x of valid)x.valueSafety={
    triggered:true,
    bestPanelRank,
    threshold,
    qualityBandMax,
    naturalLeaderRank:naturalLeader.r.rank,
    safetyLeaderRank:safetyLeader?.r?.rank??null,
    promoted:!overrideValid&&x===safetyLeader,
    overrideValid
  };

  return{
    triggered:true,
    bestPanelRank,
    threshold,
    qualityBandMax,
    naturalLeaderRank:naturalLeader.r.rank,
    safetyLeaderRank:safetyLeader?.r?.rank??null,
    promoted:!overrideValid,
    overrideValid
  };
}
function tierContext(player,rank,available){
  const same=available.map(x=>({p:x,r:rankFor(x.name,x.pos)})).filter(x=>x.r&&x.p.pos===player.pos&&x.r.tier===rank.tier).sort((a,b)=>a.r.rank-b.r.rank);
  const later=available.map(x=>({p:x,r:rankFor(x.name,x.pos)})).filter(x=>x.r&&x.p.pos===player.pos&&x.r.rank>rank.rank).sort((a,b)=>a.r.rank-b.r.rank);
  const nextTier=later.find(x=>x.r.tier>rank.tier);
  return{sameTierCount:same.length,isLastInTier:same.length===1,tierGap:nextTier?Math.max(0,nextTier.r.rank-rank.rank):null};
}
function positionalAlternativeContext(player,rank,available){
  // Opportunity-cost scarcity: a candidate is more urgent when passing him causes a
  // meaningful quality drop at that position. Conversely, several near-equal alternatives
  // reduce urgency even if the candidate's own Return probability is modest.
  const alts=available.map(x=>({p:x,r:rankFor(x.name,x.pos)}))
    .filter(x=>x.r&&x.p.pos===player.pos&&norm(x.p.name)!==norm(player.name))
    .sort((a,b)=>a.r.rank-b.r.rank);
  if(!alts.length)return{bestGap:24,nearEqual:0,qualityAlternatives:0,bonus:4};
  const bestGap=Math.max(0,alts[0].r.rank-rank.rank);
  const nearEqual=alts.filter(x=>x.r.rank<=rank.rank+8).length;
  const qualityAlternatives=alts.filter(x=>x.r.rank<=rank.rank+15).length;
  let bonus=clamp(bestGap*.24,0,4.5);
  if(nearEqual>=2)bonus-=2.0;else if(nearEqual===1)bonus-=1.0;
  else if(qualityAlternatives===0)bonus+=1.0;
  return{bestGap,nearEqual,qualityAlternatives,bonus:clamp(bonus,-2,5)};
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

function scoreCandidate(p,current,next,state,available,strategy='progressive'){
  const r=rankFor(p.name,p.pos),a=Number(adp[norm(p.name)]);
  if(!r)return{score:-999,r:null,a,reasons:['Panel-Rang fehlt']};
  /* v9.8.0: Panel-first Raw Utility. Sichtbarer Coach-Score wird relativ zum besten aktuellen Kandidaten normiert. */
  const stage=strategy==='progressive'?progressiveStage(current):0;
  const panelPenaltyRate=strategy==='progressive'?[1.10,1.00,.90,.78][stage]:1.10;
  let score=100-clamp((r.rank-current)*panelPenaltyRate,0,74)-clamp((current-r.rank)*.15,0,3),reasons=[];
  const value=valueLabel(current,a);
  if(Number.isFinite(value.value)){
    const reachScale=strategy==='progressive'?[1,.85,.65,.45][stage]:1;
    const valueScale=value.value<0?reachScale:1;
    score+=clamp(value.value*.16*valueScale,-4.5,4.5);
  }
  reasons.push(value.label);
  const needContribution=clamp((state.need[p.pos]||0)*draftPhaseNeedFactor(current),-16,7);
  score+=needContribution;
  if((state.need[p.pos]||0)>=7)reasons.push(`${p.pos}-Need (${p.pos==='QB'?'aufschiebbar':'draftphasenabhängig'})`);
  const exceptionPenalty=rosterExceptionPenalty(p.pos,state,current,r.rank,a);
  if(exceptionPenalty){score+=exceptionPenalty;reasons.push(p.pos==='QB'?'QB2 nur Ausnahmefall':'TE2 nur Ausnahmefall')}
  const upside=lateUpsideBonus(p,current,state);if(upside){score+=upside;reasons.push(upside>0?'Late-RB Upside-Bonus':'WR-Sättigung')}
  if(strategy==='progressive'){const prog=progressiveUpsideBonus(p,current,state);if(prog){score+=prog;reasons.push(prog>0?`Progressive-Upside +${prog.toFixed(1)}`:'Progressive WR-Sättigung')}}
  const stash=injuryStashAdjustment(p,current);if(stash){score+=stash;reasons.push(stash<0?'Injury-Stash Opportunity Cost':'Injury-Stash')};
  const mru=marginalRosterUtility(p,current,state);if(mru){score+=mru;reasons.push(`Marginal Roster Utility ${mru>0?'+':''}${mru.toFixed(1)}`)}
  const tier=tierContext(p,r,available);
  let scarcityBonus=0;
  if(tier.isLastInTier){scarcityBonus+=.75;reasons.push(`Letzter Spieler in Tier ${r.tier}`)}
  else if(tier.sameTierCount<=2){scarcityBonus+=.5;reasons.push(`Tier fast leer (${tier.sameTierCount})`)}
  if(tier.tierGap!=null&&tier.tierGap>=8){scarcityBonus+=Math.min(.75,tier.tierGap/20);reasons.push(`Tier-Drop +${tier.tierGap.toFixed(0)}`)}
  score+=Math.min(1.5,scarcityBonus);
  const alt=positionalAlternativeContext(p,r,available);
  if(alt.bonus){score+=alt.bonus;reasons.push(`Positions-Alternativen ${alt.nearEqual} nah · Gap ${alt.bestGap.toFixed(1)} (${alt.bonus>0?'+':''}${alt.bonus.toFixed(1)})`)}
  const agree=agreement(r.sd,r.n);
  if(agree==='Sehr hoher Konsens')score+=1.5;
  else if(agree==='Stark umstritten')score-=3;
  if(p.injury){const st=String(p.injury).toUpperCase();const pen=st==='PUP'?3:st==='QUESTIONABLE'?3:st==='DOUBTFUL'?7:st==='IR'?18:8;score-=pen;reasons.push(`Injury ${p.injury}${st==='PUP'?' · Return-Timetable prüfen':''}${st==='IR'?' · Season-ending prüfen':''}`)}
  if(p.bye&&(state.byes[p.pos]?.[p.bye]||0)>=2){score-=1;reasons.push(`Bye ${p.bye} (nur Tiebreaker)`)}
  // Return is scored only after Return-v2 / fallback resolution in the coach loop.
  // Keeping the legacy ADP curve here as a score input would double-count return pressure
  // and could make the displayed Return-v2 probability disagree with the actual ranking.
  const ret=returnChance(next,a);
  const expertBase=r.n>=5?4:r.n>=3?1:r.n===2?-5:-12;
  const confidence=clamp(Math.round(88-r.sd*2+(Number.isFinite(a)?4:-10)+expertBase),35,96);
  return{score:0,rawScore:score,r,a,ret,reasons,agree,sameTier:tier.sameTierCount,tierGap:tier.tierGap,alternativeGap:alt.bestGap,nearAlternatives:alt.nearEqual,confidence,valueKind:value.kind};
}
function applyResolvedReturnScore(x,current,strategy){
  if(x.ret==null)return;
  const stage=progressiveStage(current);
  const returnWeight=strategy==='progressive'?[12,10,7,4][stage]:12;
  x.rawScore+=clamp((.50-x.ret)*returnWeight,-6,6);
  // Reasons must describe the same resolved probability that the UI displays.
  if(x.ret>=.80)x.reasons.push(`Warten attraktiv (${Math.round(x.ret*100)}% Return)`);
  else if(x.ret<=.25)x.reasons.push(`Jetzt-Pick dringlich (${Math.round(x.ret*100)}% Return)`);
  else if(x.ret>=.65)x.reasons.push(`Gute Return-Chance (${Math.round(x.ret*100)}%)`);
}

function expertRanksHtml(r){
  return `<div class="coach-section-title">Einzelrankings</div><div class="expert-grid">${r.individual.map(x=>{
    const delta=x.rank-r.rank,cls=delta<=-4?'high':delta>=4?'low':'';
    const deltaText=Math.abs(delta)<1?'nahe Panel':delta<0?`${Math.abs(Math.round(delta))} höher`:`${Math.round(delta)} niedriger`;
    return `<div class="expert-rank"><b>${esc(x.expertName)}</b><span>#${Number(x.rank).toFixed(0)}${Number.isFinite(x.posRank)?` (${r.pos}${Math.round(x.posRank)})`:''}</span><span class="delta ${cls}">${deltaText}</span></div>`;
  }).join('')}</div>`;
}
function renderCoach(rows,state,current,next){
  const top=rows.slice(0,5);
  els.favoritesBlock.innerHTML=top.length?`<div class="favorite-box"><b>${top[0].action}: ${esc(top[0].p.name)} · ${top[0].p.pos}</b><div class="tiny">Top 5 sichtbar · 10–15 Kandidaten werden intern weitergeführt.</div></div>`:'';
  els.coachList.innerHTML=`<div class="coach-section-title">Empfehlung + 4 Alternativen</div>`+top.map((x,i)=>`<article class="coach"><div class="coach-head"><div><h3>${i+1}. ${esc(x.p.name)} · ${x.p.pos}</h3><div class="tiny">${i===0?'EMPFEHLUNG · ':''}${x.action} · Tier ${x.r.tier||'–'} · Loss ${x.loss}</div></div><div class="score">${x.score}${Number.isFinite(x.balancedScore)?`<small class="strategy-compare">v10 ${x.balancedScore}</small>`:''}</div></div><div class="metrics"><div class="metric"><b>${x.r.rank.toFixed(1)}</b><span>Overall</span></div><div class="metric"><b>${Number.isFinite(x.a)?x.a.toFixed(1):'–'}</b><span>ADP</span></div><div class="metric"><b>${x.ret!=null?Math.round(x.ret*100)+'%':'–'}</b><span>Return</span></div><div class="metric"><b>${x.returnConfidence}%</b><span>Return-Conf.</span></div><div class="metric"><b>${x.intel.plausible}</b><span>Abnehmer</span></div></div>${expertRanksHtml(x.r)}<div class="tags">${x.reasons.slice(-7).map(reason=>`<span class="tag info">${esc(reason)}</span>`).join('')}</div></article>`).join('');
  els.teamSummary.innerHTML=Object.entries(state.counts).map(([p,n])=>`<div class="summary-item"><b>${n}</b><span>${p}</span></div>`).join('')+`<div class="summary-item"><b>${current}</b><span>Pick</span></div><div class="summary-item"><b>${next??'–'}</b><span>Nächster</span></div>`;
}

let analysisBusy=false,lastSnapshotFingerprint=store.text('v116_lastSnapshotFingerprint',''),lastSnapshotPickCount=Number(store.text('v116_lastSnapshotPickCount','-1'));
function snapshotFingerprint(id,picks,slot){
  const tail=picks.slice(-8).map(p=>`${p.pick_no}:${p.player_id}:${p.draft_slot}`).join('|');
  return `${id}|${slot}|${picks.length}|${tail}`;
}
function setAnalysisBusy(busy){
  analysisBusy=busy;
  els.refreshBtn.disabled=busy;
  els.copyBtn.disabled=busy || !els.snapshot.value;
  els.shareBtn.disabled=busy || !els.snapshot.value;
  els.refreshBtn.textContent=busy?'Analysiere …':'Analysieren & Snapshot kopieren';
}
function speedTier(current,next){
  if(next==null)return {key:'complete',label:'Draft abgeschlossen',budget:0};
  const picks=Math.max(0,next-current);
  if(picks<=1)return {key:'emergency',label:'EMERGENCY',budget:8};
  if(picks<=4)return {key:'focused',label:'FOCUSED',budget:20};
  return {key:'full',label:'FULL',budget:45};
}
function researchCacheKey(){return 'v117_researchEvidence';}
function loadResearchEvents(){try{const v=JSON.parse(localStorage.getItem(researchCacheKey())||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function evidenceIdentity(e){return [e.sourceId||'',e.playerId||e.playerKey||'',e.evidenceType||'',e.sourcePublishedAt||e.observedAt||'',e.thesisPath||''].join('|')}
function appendResearchEvidence(input){
  const now=Date.now(),published=Number(input.sourcePublishedAt||0),eventAt=Number(input.eventOccurredAt||input.payload?.eventOccurredAt||0),corroboratedAt=Number(input.currentStatusCorroboratedAt||input.payload?.currentStatusCorroboratedAt||0),critical=/injury|ir|pup|suspension|inactive/i.test(String(input.evidenceType||''));
  // Critical status is actionable only when chronology is explicit AND temporal relevance is current.
  // A legacy injury page can be freshly crawled/embedded today while describing an old event; crawl/observedAt never proves recency.
  // Reports older than 45d require a separate current-status corroboration no older than 14d. Fail closed if either date is unavailable.
  const chronologyValid=Boolean(published&&eventAt&&eventAt<=published+7*86400000&&published<=now+3600000&&eventAt<=now+3600000);
  const publicationRecent=Boolean(chronologyValid&&now-published<=45*86400000);
  const currentCorroboration=Boolean(corroboratedAt&&corroboratedAt<=now+3600000&&now-corroboratedAt<=14*86400000);
  const freshnessVerified=Boolean(chronologyValid&&(publicationRecent||currentCorroboration));
  const e={id:input.id||`ev_${now}_${Math.random().toString(36).slice(2,8)}`,observedAt:Number(input.observedAt||now),sourcePublishedAt:published||Number(input.observedAt||now),eventOccurredAt:eventAt||null,currentStatusCorroboratedAt:corroboratedAt||null,ingestedAt:Number(input.ingestedAt||now),playerId:String(input.playerId||''),playerKey:norm(input.playerName||input.playerKey||''),evidenceType:String(input.evidenceType||'unknown'),thesisPath:String(input.thesisPath||''),sourceId:String(input.sourceId||''),sourceOriginality:String(input.sourceOriginality||'unknown'),confidence:clamp(Number(input.confidence??.5),0,1),flags:Array.isArray(input.flags)?input.flags.slice(0,8):[],payload:input.payload||{},freshnessVerified:critical?freshnessVerified:true,critical};
  const events=loadResearchEvents();if(events.some(x=>evidenceIdentity(x)===evidenceIdentity(e)))return {added:false,event:e};events.push(e);localStorage.setItem(researchCacheKey(),JSON.stringify(events));updateResearchCacheStatus();return {added:true,event:e};
}
function researchEventsAt(cutoff=Infinity){return loadResearchEvents().filter(e=>Number(e.sourcePublishedAt||e.observedAt||0)<=cutoff)}
function researchPlayerState(p,cutoff=Infinity){const key=norm(p.name),pid=String(p.id||'');return researchEventsAt(cutoff).filter(e=>(pid&&e.playerId===pid)||e.playerKey===key).sort((a,b)=>a.sourcePublishedAt-b.sourcePublishedAt)}
function actionableResearchEvents(p,cutoff=Infinity){return researchPlayerState(p,cutoff).filter(e=>!e.critical||e.freshnessVerified===true)}
function researchHint(p,cutoff=Infinity){const all=researchPlayerState(p,cutoff),ev=actionableResearchEvents(p,cutoff);if(!all.length)return '';const rejected=all.length-ev.length;if(!ev.length)return rejected?`${rejected} kritische Meldung(en) wegen ungeprüfter Ereignis-Aktualität ignoriert`:'';const latest=ev[ev.length-1],age=Math.round((Date.now()-Number(latest.sourcePublishedAt||latest.observedAt))/3600000),flags=[...new Set(ev.flatMap(x=>x.flags||[]))].slice(-4).join(', '),suffix=rejected?` · ${rejected} stale/unverifiziert ignoriert`:'';return flags?`${flags}${age<48?` · Cache ${age}h`:' · Cache veraltet'}${suffix}`:`${ev.length} Evidence-Event(s)${suffix}`}
function updateResearchCacheStatus(){if(!els.researchCacheStatus)return;const e=loadResearchEvents();const players=new Set(e.map(x=>x.playerId||x.playerKey).filter(Boolean));els.researchCacheStatus.textContent=e.length?`${e.length} Evidence-Events · ${players.size} Spieler · append-only`:'Noch keine versionierte Evidence gespeichert.'}
function positionDecisionPath(state,scored,current,next){
  const out=[];
  if(state.counts.QB===0){
    const q=scored.filter(x=>x.p.pos==='QB').slice(0,4);
    if(q.length)out.push(`QB-Pfad: ${q.map(x=>`${x.p.name} (${x.action})`).join(' → ')}`);
  }
  if(state.counts.TE===0){
    const t=scored.filter(x=>x.p.pos==='TE').slice(0,3);
    if(t.length)out.push(`TE-Pfad: ${t.map(x=>`${x.p.name} (${x.action})`).join(' → ')}`);
  }
  const r=scored.filter(x=>x.p.pos==='RB').slice(0,5);
  if(current>=81&&r.length)out.push(`Late-RB-Pfad: ${r.map(x=>x.p.name).join(' / ')}`);
  return out;
}

async function refresh(){
  persist();
  const id=draftId(els.draftInput.value);
  if(!id)throw new Error('Draft-ID fehlt.');
  setAnalysisBusy(true);
  els.draftStatus.textContent='Aktualisiere Sleeper … Snapshot-Kopie ist bis zum Abschluss gesperrt.';
  try{
    const fetched=await fetchDraftFresh(id),draft=fetched.draft,players=fetched.players,mode=els.draftMode.value,strategy=els.strategyMode.value,stress=els.stressMode.value,cutoff=Number(els.replayCutoff.value),picks=(mode==='replay'&&Number.isFinite(cutoff)&&cutoff>=0?fetched.picks.filter(p=>Number(p.pick_no)<=cutoff):fetched.picks),
      teams=Number(draft.settings?.teams||10),
      rounds=Number(draft.settings?.rounds||15),
      map=resolvedManagerMap(mode,els.season.value,teams,els.managerMap.value),
      slot=Number(els.slot.value),
      total=teams*rounds,
      current=Math.min(picks.length+1,total),
      next=nextOwn(current,teams,slot,total),
      returnPick=next===current?nextOwn(current+1,teams,slot,total):next,
      mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no),
      drafted=new Set(picks.map(p=>String(p.player_id))),
      fingerprint=snapshotFingerprint(id,picks,slot),
      duplicateSnapshot=fingerprint===lastSnapshotFingerprint,
      tier=speedTier(current,next);

    const allAvailable=Object.entries(players)
      .filter(([pid,p])=>!drafted.has(pid)&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false&&p.full_name)
      .map(([pid,p])=>({id:pid,name:p.full_name,pos:p.position,team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null,yearsExp:Number.isFinite(Number(p.years_exp))?Number(p.years_exp):null}));

    const rankedAvailable=allAvailable
      .map(p=>({p,r:rankFor(p.name,p.pos)}))
      .filter(x=>x.r&&panelHasVerifiedExperts(x.r.panelId))
      .sort((a,b)=>a.r.rank-b.r.rank||(a.p.searchRank||9999)-(b.p.searchRank||9999))
      .map(x=>x.p);

    const diagnosticAvailable=allAvailable
      .slice()
      .sort((a,b)=>(a.searchRank||9999)-(b.searchRank||9999))
      .slice(0,25);

    const state=rosterState(mine,players,current);
    const scored=rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,strategy)})).filter(x=>x.r);
    const referenceBalanced=strategy==='progressive'?rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,'balanced')})).filter(x=>x.r):null;
    const returnCtx={current,next:returnPick,picks,players,teams,map,rankedAvailable,mode};
    const rv2=Number.isFinite(returnPick)&&returnPick>current?simulateReturnV2(returnCtx,stress,900):null;
    for(const x of scored){
      x.intel=liveIntel(x.p,current,returnPick,picks,players,teams,mode,map,stress);
      const v2=rv2?.players?.[norm(x.p.name)];
      if(v2){x.ret=v2.ret;x.returnConfidence=v2.confidence;x.topRisk=v2.topRisk;if(v2.topRisk)x.reasons.push(`Top-Risiko: ${v2.topRisk.label} ${Math.round(v2.topRisk.prob*100)}%`);}
      else{x.ret=adjustedReturn(x.ret,x.intel);x.returnConfidence=returnConfidence(x.ret,x.intel,mode,Number.isFinite(x.a));}
      applyResolvedReturnScore(x,current,strategy);
      x.loss=lossIfGone(x);x.action=actionLabel(x);
      if(mode==='live'&&x.intel.mods.length)x.reasons.push(`Manager-Kontext: ${x.intel.mods.join(', ')}`);
      x.reasons.push(`Loss if gone: ${x.loss}`);
    }
    if(referenceBalanced){for(const x of referenceBalanced){const v2=rv2?.players?.[norm(x.p.name)];x.ret=v2?v2.ret:adjustedReturn(x.ret,liveIntel(x.p,current,returnPick,picks,players,teams,mode,map,stress));applyResolvedReturnScore(x,current,'balanced');}}
    resolveReturnValidation(id,picks);resolveDecisionFixtures(id,picks);freezeReturnValidation(id,current,returnPick,rv2,rankedAvailable,slot);
    els.modeStatus.className=`notice ${mode==='live'&&!Object.keys(map).length?'warn':'ok'}`;els.modeStatus.textContent=modeStatusText(mode,map);
    const boardTop=scored.slice().sort((x,y)=>x.r.rank-y.r.rank).slice(0,12).filter(x=>x.ret!=null);
    const sortedReturns=boardTop.map(x=>x.ret).sort((x,y)=>x-y);
    const medianReturn=sortedReturns.length?sortedReturns[Math.floor(sortedReturns.length/2)]:null;
    if(medianReturn!=null)for(const x of scored){
      if(x.ret==null)continue;
      const rel=clamp((medianReturn-x.ret)*6,-3,3);
      x.rawScore+=rel;
      if(Math.abs(rel)>=1.5)x.reasons.push(rel>0?'Dringlicher als Board':'Mehr Wartepotenzial als Board');
    }
    if(referenceBalanced){
      const refBoard=referenceBalanced.slice().sort((x,y)=>x.r.rank-y.r.rank).slice(0,12).filter(x=>x.ret!=null);
      const refReturns=refBoard.map(x=>x.ret).sort((x,y)=>x-y),refMedian=refReturns.length?refReturns[Math.floor(refReturns.length/2)]:null;
      if(refMedian!=null)for(const x of referenceBalanced){if(x.ret==null)continue;x.rawScore+=clamp((refMedian-x.ret)*6,-3,3);}
    }
    const valueSafety=applyPlayerQualitySafetyGate(scored,current);
    normalizeCoachScores(scored);
    if(referenceBalanced){
      applyPlayerQualitySafetyGate(referenceBalanced,current);
      normalizeCoachScores(referenceBalanced);
      const bm=new Map(referenceBalanced.map(x=>[norm(x.p.name),x.score]));
      for(const x of scored)x.balancedScore=bm.get(norm(x.p.name));
    }
    els.strategyStatus.className='notice ok';els.strategyStatus.textContent=strategyStatusText(strategy);
    scored.sort((x,y)=>y.score-x.score||y.rawScore-x.rawScore||x.r.rank-y.r.rank);

    const draftComplete=String(draft.status||'').toLowerCase()==='complete'||picks.length>=total;
    if(draftComplete){
      els.favoritesBlock.innerHTML='<div class="favorite-box"><b>Draft abgeschlossen</b><div class="tiny">Keine Live-Empfehlungen mehr. Mock Review und Snapshot bleiben verfügbar.</div></div>';
      els.coachList.innerHTML='';
      els.teamSummary.innerHTML=Object.entries(state.counts).map(([p,n])=>`<div class="summary-item"><b>${n}</b><span>${p}</span></div>`).join('')+`<div class="summary-item"><b>✓</b><span>Fertig</span></div>`;
    }else renderCoach(scored,state,current,returnPick);
    renderMockReview(mine,players);

    const best=scored[0]?.score??0,
      favorites=scored.slice(0,5),
      snapshotLimit=els.snapshotMode.value==='full'?40:25,
      availableSnapshot=scored.slice().sort((a,b)=>a.r.rank-b.r.rank).slice(0,snapshotLimit),
      usedPanelIds=[...new Set(['QB','RB','WR','TE'].map(panelFor).filter(Boolean))],
      rankedCounts=usedPanelIds.map(pid=>`${panels[pid]?.name||pid}: ${Object.keys(panelRanks[pid]||{}).length}`).join(' · '),
      rankingUpdated=Number(store.get('v7_lastRankingUpdate',0)),
      rankingStamp=rankingUpdated?new Date(rankingUpdated).toLocaleString('de-DE'):'unbekannt',
      adpStamp=adpMeta.updated?new Date(adpMeta.updated).toLocaleString('de-DE'):'nicht geladen';

    const researchCandidates=scored.filter((x,i)=>{
      const marketGap=Number.isFinite(x.a)?Math.abs(x.a-x.r.rank):0;
      const lateRb=x.p.pos==='RB'&&x.r.rank>=45&&x.r.rank<=140;
      return i<12&&(x.p.injury||x.r.sd>=8||marketGap>=8)||lateRb&&i<45;
    }).slice(0,12).map(x=>{
      const flags=[];
      if(x.p.injury)flags.push(`Injury ${x.p.injury}`);
      if(x.r.sd>=8)flags.push(`Expertenstreuung ${x.r.sd.toFixed(1)}`);
      if(Number.isFinite(x.a)&&Math.abs(x.a-x.r.rank)>=8)flags.push(`Panel/ADP Gap ${Math.round(x.a-x.r.rank)}`);
      if(x.p.pos==='RB'&&x.r.rank>=45)flags.push('Late-RB/Upside prüfen');
      return{x,flags};
    });

    const lines=[
      '===== SLEEPER DRAFT SNAPSHOT =====',
      `Draft-ID: ${id}`,
      `Status: ${draft.status}`,
      `Teams: ${teams} | Runden: ${rounds} | Mein Slot: ${slot}`,
      `Aktueller Pick: ${current}`,
      `Mein nächster Pick: ${next??'keiner'} | Picks bis dahin: ${next==null?'–':next-current}`,
      `Return-Modell: Folgepick ${returnPick??'keiner'}${returnPick!=null?` | ${Math.max(0,returnPick-current-1)} gegnerische Picks bis dahin`:''}`,
      `Snapshot-Fingerprint: ${fingerprint} | ${duplicateSnapshot?'DUPLIKAT/UNVERÄNDERT':'NEU'}`,
      `Live-Speed: ${tier.label} | Analysebudget ${tier.budget}s`, 
      '',
      'DATENSTATUS',
      `Verwendete Panels: ${usedPanelIds.map(pid=>panels[pid]?.name||pid).join(' / ')||'FEHLT'}`,
      `Geladene Panel-Spieler: ${rankedCounts||'FEHLT'}`,
      `Verifizierte Einzelrankings: ${usedPanelIds.map(pid=>{const ids=Object.keys(panels[pid]?.members||{}).filter(eid=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);return `${panels[pid]?.name||pid}: ${ids.length}/${Object.keys(panels[pid]?.members||{}).length}`}).join(' · ')||'FEHLT'}`,
      `Expertenquelle: automatische Multi-Source-Pipeline (vollständige öffentliche Einzelrankings; Vergleichsseiten nur Kontrolle)`,
      `Kandidatenpool: max. 230 ohne K/DST · QB 30 · RB 90 · WR 80 · TE 30 · Auswahl ausschließlich aus Expertenrankings`,
      `Overall-Ränge: Originalwerte inkl. K/DST-Einfluss; K/DST werden erst NACH der Ranking-Rekonstruktion aus dem Draftpool entfernt`,
      `Panel-Gewichte: pro Spieler automatisch auf die tatsächlich verfügbaren verifizierten Experten normiert`,
      `Coach-Modell: v11.8.0-rc4.5 Return-v2 · Strategie ${strategyLabel(strategy)} · Modus ${mode} · Stress ${stressLabel(stress)} · Panel-first · Return + Gegnerroster + plausible Abnehmer${mode==='live'?' + Manager-Layer':''} · Loss-if-Gone`,
      ...(mode==='live'&&rv2?.collisions?(()=>{
        const b=Object.values(rv2.collisions).find(x=>norm(x.label)==='basti');
        return b?[`Basti Target Collision: ${Math.round(b.prob*100)}% · ${b.targets.slice(0,4).map(x=>`${x.name} ${Math.round(x.prob*100)}%`).join(' · ')}`]:[];
      })():[]),
      `Aktive Expertenquellen: ${[...new Set(usedPanelIds.flatMap(pid=>Object.keys(panels[pid]?.members||{})))].filter(eid=>rankCache[eid]?.verifiedIndividual).map(eid=>`${rankCache[eid]?.expertName}: ${rankCache[eid]?.source||'verifiziert'}${rankCache[eid]?.sourceScoring?` [${rankCache[eid].sourceScoring}${rankCache[eid]?.sourceContextVerified?' ✓':' ?'}]`:''}${rankCache[eid]?.sourceUpdated?` (${rankCache[eid].sourceUpdated})`:''}`).join(' · ')||'KEINE'}`,
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

    if(draftComplete){
      lines.push('', 'POST-DRAFT STATUS', 'DRAFT ABGESCHLOSSEN — keine Live-Pick-Entscheidung, keine Return-Prognose und keine Live-Research-Aufgabe mehr.', 'Der Snapshot dient nur noch der abgeschlossenen Board-/Roster-Dokumentation. Für Retrospektive/FA-Analyse den separaten Post-Draft-Workflow verwenden.');
    }else{
    lines.push('','TOP 5 LIVE-ENTSCHEIDUNG');
    if(draftComplete){
      lines.push('DRAFT ABGESCHLOSSEN — keine Pick-Entscheidung und keine Return-Prognose mehr.');
    }else if(favorites.length){
      favorites.forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score}${Number.isFinite(x.balancedScore)?` | v10-Ref ${x.balancedScore}`:''} | Panel ${x.r.rank.toFixed(1)} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Return-Confidence ${x.returnConfidence}% | ${x.action} | Loss ${x.loss}`));
    }else lines.push('KEINE — Panel-Zuordnung/Rankings prüfen.');

    lines.push('','DRAFT COACH TOP 8');
    if(draftComplete){
      lines.push('NICHT ANWENDBAR — Draft abgeschlossen. Verfügbare Spieler unten sind nur noch Post-Draft/FA-Kontext.');
    }else if(scored.length){
      scored.slice(0,8).forEach((x,i)=>{
        lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score}${Number.isFinite(x.balancedScore)?` | v10-Ref ${x.balancedScore}`:''} | ${x.r.panel} ${x.r.rank.toFixed(1)} Tier ${x.r.tier||'–'} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Confidence ${x.confidence}% | ${x.agree}`);
        lines.push(`   Einzelrankings: ${x.r.individual.filter(v=>rankCache[v.expertId]?.verifiedIndividual).map(v=>`${v.expertName} ${v.reconstructed?'≈':'#'}${Math.round(v.rank)}${Number.isFinite(v.posRank)?` (${x.p.pos}${Math.round(v.posRank)})`:''}${v.reconstructed?` [rekonstr., ${v.anchors} Anker]`:''}`).join(' · ')||'KEINE VERIFIZIERT'}`);
      });
    }else lines.push('KEINE — keine verfügbaren Spieler konnten einem geladenen Panel-Ranking zugeordnet werden.');

    if(!scored.length){
      lines.push('','DIAGNOSE OHNE EXPERTENPANEL');
      lines.push('Kein verifiziertes Einzelranking verfügbar. Folgende Sleeper-Reihenfolge dient nur zur technischen Kontrolle, NICHT als Expertenbaseline:');
      diagnosticAvailable.forEach((p,i)=>lines.push(`${i+1}. ${p.name} — ${p.pos}, ${p.team} | Sleeper SearchRank ${Number.isFinite(p.searchRank)?p.searchRank:'–'} | ADP ${Number.isFinite(adp[norm(p.name)])?Number(adp[norm(p.name)]).toFixed(1):'FEHLT'}`));
    }

    lines.push('','RESEARCH-KANDIDATEN FÜR LIVE-ANALYSE');
    lines.push('Diese Spieler gezielt auf aktuelle Sleeper-/Breakout-/League-Winner-/Bust-Artikel, Camp-News, Rollenänderungen, Verletzungen und Depth Chart prüfen. Artikel sind Kontext; Expertenpanel bleibt Baseline.');
    if(researchCandidates.length){
      researchCandidates.forEach(({x,flags},i)=>{const replayEvidenceCutoff=(mode==='replay'&&Number.isFinite(cutoff)&&cutoff>1000000000000)?cutoff:Infinity;const rh=researchHint(x.p,replayEvidenceCutoff);lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Panel ${x.r.rank.toFixed(1)} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | ${flags.join(' · ')}${rh?` · PRE-CACHE: ${rh}`:''}`)});
    }else lines.push('Keine besonderen Research-Signale im aktuellen Kandidatenfeld.');

    const decisionPaths=positionDecisionPath(state,scored,current,returnPick);
    lines.push('','VORAB-ENTSCHEIDUNGSPFADE');
    if(decisionPaths.length)decisionPaths.forEach(x=>lines.push(x));else lines.push('Keine besondere QB/TE/Late-RB-Weiche.');
    lines.push('Live-Regel: vorhandenen Pre-Draft-Cache nutzen; Web nur für entscheidungsändernde neue Verletzung/PUP/IR/Depth-Chart-News oder echten Gleichstand.');
    lines.push('','VERFÜGBARE SPIELER NACH PANEL');
    if(availableSnapshot.length){
      availableSnapshot.forEach((x,i)=>{
        lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Panel ${x.r.rank.toFixed(1)} (${x.r.panel}) | Pos ${Number.isFinite(x.r.posRank)?x.p.pos+x.r.posRank.toFixed(1):'–'} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Sleeper SearchRank ${Number.isFinite(x.p.searchRank)?x.p.searchRank:'–'}${x.p.injury?` | Injury ${x.p.injury}`:''}`);
        if(els.snapshotMode.value==='full')lines.push(`   Einzelrankings: ${x.r.individual.map(v=>`${v.expertName} ${v.reconstructed?'≈':'#'}${Math.round(v.rank)}${v.reconstructed?' [rekonstr.]':''}`).join(' · ')||'FEHLT'}`);
      });
    }else lines.push('KEINE.');

    lines.push(
      '',
      'HARTE REGEL',
      strategy==='balanced'?'Kein großer Reach ohne konkrete aktuelle Begründung. Fehlende Panel- oder ADP-Daten ausdrücklich als Unsicherheit behandeln. K und DST werden nicht gedraftet. Bye Weeks sind nur ein kleiner Tiebreaker.':'Panel bleibt Baseline. Ab Runde 9 graduell mehr Ceiling/Breakout-EV und höhere Reach-Toleranz; ein Reach braucht weiterhin einen plausiblen Upside-Pfad. K und DST werden nicht gedraftet. Bye Weeks sind nur ein kleiner Tiebreaker.',
      '',
      'AUFGABE',
      'Prüfe aktuelle Verletzungen, Depth Charts und News, einschließlich angekündigter/geplanter IR- oder PUP-Moves und ob IR season-ending ist, sowie gezielt die Research-Kandidaten auf aktuelle Sleeper-, Breakout-, League-Winner- und Bust-Analysen. Artikel dienen als begründungspflichtiger Kontext; das Expertenpanel bleibt Baseline. Nutze das Expertenpanel als Baseline und Sleeper-ADP als Marktindikator, sofern vorhanden. Nenne alle nahezu gleichwertigen Favoriten, danach 2–3 Alternativen, Return-Chancen und Confidence. Erzwinge keine Einzelentscheidung, wenn mehrere Spieler nahezu gleichauf liegen. Abweichungen vom Expertenpanel oder der Sleeper-ADP ausdrücklich begründen. In dieser 10-Team-1QB-Liga QB2 und TE2 nur in absoluten Ausnahmefällen empfehlen; TE1 darf bei einem Run bis nach dem Draft aufgeschoben werden. Bei ähnlich guten QB1-Kandidaten Rushing-Upside bevorzugen. Späte Bench-Picks primär auf RB-Upside optimieren. Override-Guard: Weiche vom Coach-Topfavoriten oder dessen TAKE/WAIT-Sequenz nur bei konkreter entscheidungsändernder Evidenz ab. Eine allgemeine Positions-/Upside-Präferenz allein reicht insbesondere dann nicht, wenn die Alternative laut Return-v2 sehr wahrscheinlich bis zum nächsten Pick zurückkommt und als WARTEN markiert ist.'
    );
    }

    els.snapshot.value=lines.join('\n');
    lastSnapshotFingerprint=fingerprint;lastSnapshotPickCount=picks.length;store.setText('v116_lastSnapshotFingerprint',fingerprint);store.setText('v116_lastSnapshotPickCount',String(picks.length));
    els.draftStatus.className=scored.length?'notice ok':'notice warn';
    const dataState=scored.length?(navigator.onLine?'LIVE':'VERALTET'):'FALLBACK';
    const nextText=draftComplete?'DRAFT ABGESCHLOSSEN':`NÄCHSTER EIGENER PICK: ${next??'keiner'}${next===current?' · DU BIST DRAN':''}`;
    els.draftStatus.textContent=`${nextText} · ${dataState} · Sleeper-Picks ${picks.length}/${total} · ${scored.length} Kandidaten bewertet · Modus ${mode.toUpperCase()}.`;
    els.draftSummary.hidden=false;
    els.emptyCoach.hidden=true;
    els.copyBtn.disabled=false;
    els.shareBtn.disabled=false;
    if(!draftComplete)freezeDecisionFixture({draftId:id,current,returnPick,picks,mine,rankedAvailable,scored,rv2,mode,strategy,stress,teams,slot,fingerprint});
    lastDraftContext={id,current,next:returnPick,favorites,scored,picks,mine,mode,strategy,stress,map,dataState,players,teams,rankedAvailable};
    if(els.simulateBtn)els.simulateBtn.disabled=!(Number.isFinite(returnPick)&&returnPick>current);
  }finally{
    setAnalysisBusy(false);
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
function logDecision(){if(!lastDraftContext)return alert('Zuerst Draft analysieren.');const coach=lastDraftContext.favorites.map(x=>x.p.name).join(' / ')||'–',chosen=prompt('Welchen Spieler hast du gewählt?',lastDraftContext.favorites[0]?.p.name||'');if(!chosen)return;const reason=prompt('Grund (Coach gefolgt, Upside, Value, Stack, Positionsbedarf, Bauchgefühl):','Coach gefolgt')||'ohne Angabe';decisionLog.push({draftId:lastDraftContext.id,pick:lastDraftContext.current,mode:lastDraftContext.mode,dataState:lastDraftContext.dataState,coach,chosen,reason,top5:lastDraftContext.scored.slice(0,5).map(x=>({name:x.p.name,pos:x.p.pos,score:x.score,return:x.ret,returnConfidence:x.returnConfidence,loss:x.loss,action:x.action,plausible:x.intel?.plausible||0})),at:Date.now()});persist();renderLog()}

function backup(){return{format:'draft-companion-v7',version:'11.8.0-rc4.5',createdAt:new Date().toISOString(),season:els.season.value,scoring:els.scoring.value,experts,panels,activePanelId,positionPanels,rankCache,panelRanks,adp,adpMeta,decisionLog,draft:els.draftInput.value,slot:els.slot.value}}
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

els.refreshBtn.onclick=async()=>{try{await refresh();if(!els.snapshot.value)throw new Error('Kein frischer Snapshot erzeugt.');await navigator.clipboard.writeText(els.snapshot.value);els.draftStatus.className='notice ok';els.draftStatus.textContent+=' · Frischer Snapshot kopiert ✓';}catch(e){els.draftStatus.className='notice bad';els.draftStatus.textContent=e.message}};
els.copyBtn.onclick=async()=>{if(analysisBusy)return;await navigator.clipboard.writeText(els.snapshot.value);els.copyBtn.textContent='Kopiert ✓';setTimeout(()=>els.copyBtn.textContent='Snapshot erneut kopieren',1200)};
els.shareBtn.onclick=()=>{if(analysisBusy)return;return navigator.share?navigator.share({title:'Sleeper Draft Snapshot',text:els.snapshot.value}):navigator.clipboard.writeText(els.snapshot.value)};
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
  try{
    const info=await loadExperts();
    out.push(`✓ Expertenverzeichnis: ${info.count} gesamt · API ${info.api} · öffentlich ${info.public}`);
  }catch(e){out.push(`✗ Expertenverzeichnis: ${e.message}`)}

  for(const name of ['Pat Fitzmaurice','Andrew Erickson','Derek Brown','Justin Boone','Matt Harmon','Sean Koerner']){
    const e=findExpert(name);
    if(!e){out.push(`! ${name}: nicht auswählbar`);continue}
    try{
      const data=await fetchMultiSourceExpertRanking(e);
      const aj=data.players.find(x=>norm(x.name)===norm('A.J. Brown'));
      out.push(`✓ ${name}: ${data.players.length} Spieler · ${data.source} · ${data.sourceContextVerified?'Scoring verifiziert':'Scoring NICHT verifiziert'}${data.sourceScoring?` ${data.sourceScoring}`:''}${data.updated?` · ${data.updated}`:''}${aj?` · A.J. Brown #${aj.rank}`:''}`);
    }catch(err){out.push(`! ${name}: ${err.message}`)}
  }
  try{
    const result=await loadSleeperAdpDirect();
    out.push(result.ok?`✓ Sleeper Half-PPR ADP: ${result.count}`:`✗ Sleeper Half-PPR ADP: ${result.errors?.join('; ')||'nicht verfügbar'}`);
  }catch(e){out.push(`✗ Sleeper-ADP: ${e.message}`)}
  els.diagnostic.textContent=out.join('\n')
}catch(e){els.diagnostic.textContent=e.message}};
els.toggleKeyBtn.onclick=()=>{const show=els.apiKey.type==='password';els.apiKey.type=show?'text':'password';els.toggleKeyBtn.textContent=show?'Key verbergen':'Key anzeigen'};
els.clearKeyBtn.onclick=()=>{if(confirm('API-Key löschen?')){els.apiKey.value='';persist();updateStatus()}};
els.backupBtn.onclick=()=>downloadJson(`draft-companion-v7-backup-${new Date().toISOString().slice(0,10)}.json`,backup());
els.restoreFile.onchange=async()=>{try{applyBackup(JSON.parse(await els.restoreFile.files[0].text()))}catch(e){alert(e.message)}finally{els.restoreFile.value=''}};

if(els.simulateBtn)els.simulateBtn.onclick=runSimulationLab;
if(els.strategyMode)els.strategyMode.onchange=()=>{persist();els.strategyStatus.className='notice ok';els.strategyStatus.textContent=strategyStatusText(els.strategyMode.value);};
if(els.strategyStatus){els.strategyStatus.className='notice ok';els.strategyStatus.textContent=strategyStatusText(els.strategyMode.value);}
els.clearDraftDataBtn.onclick=()=>{if(confirm('Draft-Verbindung zurücksetzen?')){els.draftInput.value='';els.draftSummary.hidden=true;els.emptyCoach.hidden=false;persist()}};
if(els.draftInput)els.draftInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();els.draftInput.blur();}});
for(const el of [els.apiKey,els.season,els.scoring,els.draftInput,els.slot,els.topN,els.snapshotMode,els.draftMode,els.replayCutoff,els.managerMap,els.stressMode])el.addEventListener('change',()=>{persist();updateStatus()});
addEventListener('online',updateStatus);addEventListener('offline',updateStatus);
setInterval(updateStatus,60000);
function setWorkspace(name){
  const valid=['draft','roster','waiver','trade','live'];if(!valid.includes(name))name='draft';
  localStorage.setItem('v117_workspace',name);
  document.querySelectorAll('[data-workspace]').forEach(el=>{el.hidden=el.dataset.workspace!==name});
  document.querySelectorAll('[data-workspace-target]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.workspaceTarget===name);btn.setAttribute('aria-pressed',btn.dataset.workspaceTarget===name?'true':'false')});
}
document.querySelectorAll('[data-workspace-target]').forEach(btn=>btn.addEventListener('click',()=>setWorkspace(btn.dataset.workspaceTarget)));
setWorkspace(localStorage.getItem('v117_workspace')||'draft');
updateResearchCacheStatus();

renderAll();setAuto();updateStatus();
