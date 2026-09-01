import {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy} from './decision-policy.js';
const APP_VERSION='v11.8.0-rc4.159';
const $=id=>document.getElementById(id);
const ids=['onlineState','rankingAge','adpCount','qualityMini','apiQuickStatus','qualityStatus','panelSummary','dataSection','draftSection','coachSection','loadExpertsBtn','applyPresetBtn','loadAllRanksBtn','refreshAllBtn','expertDeltaBtn','presetStatus','panelStatus','adpFile','adpStatus','adpHelper','draftInput','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','modeStatus','simulateBtn','simulationStatus','simulationResults','strategyMode','strategyStatus','refreshBtn','copyBtn','shareBtn','autoRefresh','draftStatus','draftSummary','teamSummary','favoritesBlock','coachList','snapshot','emptyCoach','logDecisionBtn','clearLogBtn','mockReview','decisionLog','apiKey','toggleKeyBtn','clearKeyBtn','season','scoring','activePanel','diagnoseBtn','diagnostic','expertSearch','expertsList','savePanelBtn','newPanelBtn','renamePanelBtn','deletePanelBtn','qbPanel','rbPanel','wrPanel','tePanel','backupBtn','restoreFile','decisionEvidenceBtn','decisionEvidenceStatus','clearDraftDataBtn','researchCacheStatus','watcherSyncStatus','rosterStatus','rosterSummary','rosterList','rosterBenchStatus','rosterBenchList','rosterFaStatus','rosterFaList','tradeStatus','tradeList','waiverStatus','waiverList','seasonActionStatus','seasonActionList','fpHandoff','fpOpenBtn','fpSetupBtn','fpImportFile','fpStatus','queueBtn','mockViewBtn','liveViewBtn','livePreviewCutoff','livePreviewBtn','livePreviewExitBtn','livePreviewStatus','liveLockStatus','expertProfile','analysisExpertProfile','analysisExpertAuditStatus','expertV3AuditBtn','expertV3AuditStatus','liveManagerModeControl','liveManagerGrid','liveManagerApply','liveManagerModeStatus'];
const els=Object.fromEntries(ids.map(id=>[id,$(id)]));
const store={get(k,f=null){try{const v=localStorage.getItem(k);return v===null?f:JSON.parse(v)}catch{return f}},set(k,v){localStorage.setItem(k,JSON.stringify(v))},text(k,f=''){return localStorage.getItem(k)??f},setText(k,v){localStorage.setItem(k,v)}};
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
// User draft strategy: in this 10-team/1QB league, draft exactly one QB. A QB2 has no
// useful pre-Week-1 option-value because it would be dropped for K/DST; unlike late RB
// (and, to a lesser extent, WR/TE), it cannot earn a roster slot through role news.
const DRAFT_ACUTE_STATUS_2026={ashtonjeanty:{label:'AKUTER STATUS: Sprunggelenkverletzung · Raiders zählen für Week 1 auf ihn; Belastbarkeit weiter beobachten',blockRecommendation:false,asOf:'2026-08-28'},wandalerobinson:{label:'AKUTER STATUS: Nach hartem Hit auf Gehirnerschütterung untersucht; aktuell nicht von Concussion ausgegangen, Symptome weiter beobachten',blockRecommendation:false,asOf:'2026-08-28'},joshjacobs:{label:'AKUTER STATUS: Commissioner Exempt List · darf derzeit weder trainieren noch spielen; Dauer unklar',blockRecommendation:true,asOf:'2026-08-30'}};
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const LIVE_DRAFT_ID_2026='1366053132970233856';
const WATCHER_BASE_URL='https://pitti-watcher.tim-muero.workers.dev';
const SEASON_LEAGUE_ID_KEY='v118_seasonLeagueId',SEASON_USER_ID_KEY='v118_seasonUserId';
function sleeperPlayerRow(pid,players){const p=players?.[String(pid)]||{};return{id:String(pid),name:p.full_name||[p.first_name,p.last_name].filter(Boolean).join(' ')||String(pid),pos:p.position||'',team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null,yearsExp:Number.isFinite(Number(p.years_exp))?Number(p.years_exp):null};}
async function fetchSeasonLeagueState(draft){
  let leagueId=String(draft?.league_id||store.text(SEASON_LEAGUE_ID_KEY,'')||'').trim();
  if(!leagueId&&draft?.draft_id){try{const leagues=await jf(`${S}/user/${encodeURIComponent(String(draft.created_by||''))}/leagues/nfl/2026?_=${Date.now()}`,'Ligen',9000);const hit=(leagues||[]).find(l=>String(l.draft_id||'')===String(draft.draft_id));leagueId=String(hit?.league_id||'').trim();}catch{}}
  if(!leagueId)return{ok:false,reason:'NO_LEAGUE_ID'};
  // The draft slot is NOT the Sleeper roster_id. Resolve the user's roster from
  // the canonical draft mapping first; stale cached owner IDs are never authoritative.
  let userId='',url=new URL(WATCHER_BASE_URL+'/league-state');url.searchParams.set('league_id',leagueId);
  let r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('League-State HTTP '+r.status);let v=await r.json();
  const slot=Number(els.slot.value||9),mappedRosterId=Number(draft?.slot_to_roster_id?.[String(slot)]??draft?.slot_to_roster_id?.[slot]);
  let roster=null;
  if(Number.isFinite(mappedRosterId))roster=(v.rosters||[]).find(x=>Number(x.roster_id)===mappedRosterId);
  if(!roster){
    const order=draft?.draft_order||{};
    const ownerFromSlot=Object.entries(order).find(([,s])=>Number(s)===slot)?.[0]||'';
    if(ownerFromSlot)roster=(v.rosters||[]).find(x=>String(x.owner_id||'')===String(ownerFromSlot));
  }
  userId=String(roster?.owner_id||'').trim();
  if(!userId)return{ok:false,reason:'USER_ROSTER_MAPPING_UNRESOLVED',leagueId,userId};
  store.setText(SEASON_USER_ID_KEY,userId);url.searchParams.set('user_id',userId);r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('League-State user HTTP '+r.status);v=await r.json();
  if(!v?.ok||!v?.my_roster||String(v.my_roster.owner_id||'')!==userId)return{ok:false,reason:'MY_ROSTER_UNRESOLVED',leagueId,userId};store.setText(SEASON_LEAGUE_ID_KEY,leagueId);return{ok:true,leagueId,userId,...v};
}
function seasonRosterRows(season,players,draftMine){if(!season?.ok||!season.my_roster)return null;const draftById=new Map((draftMine||[]).map(pk=>[String(pk.player_id),pk])),reserve=new Set((season.my_roster.reserve||[]).map(String));return[...new Set((season.my_roster.players||[]).map(String))].map(pid=>{const p=sleeperPlayerRow(pid,players),base=draftById.get(pid);return{pk:base||{player_id:pid,pick_no:999,metadata:{}},p:{...p,injury:reserve.has(pid)?(p.injury||'IR/RESERVE'):p.injury},r:rankFor(p.name,p.pos),a:adpFor(p.name),seasonStatus:reserve.has(pid)?'RESERVE':'ACTIVE'};});}
function seasonLineupHtml(rows,season){
  const byId=new Map(rows.map(x=>[String(x.p.id),x])),starters=(season?.my_roster?.starters||season?.my_starters||[]).map(String).filter(x=>x&&x!=='0');
  const starterSet=new Set(starters),active=rows.filter(x=>x.seasonStatus!=='RESERVE'),bench=active.filter(x=>!starterSet.has(String(x.p.id))),reserve=rows.filter(x=>x.seasonStatus==='RESERVE');
  const posClass=p=>['QB','RB','WR','TE'].includes(p)?p.toLowerCase():'flex';
  const row=(x,label,alt='')=>'<div class="lineup-row"><span class="pos-chip '+posClass(x.p.pos)+'">'+esc(label||x.p.pos)+'</span><div class="lineup-player"><b>'+esc(x.p.name)+'</b><span>'+esc(x.p.team)+(x.p.injury?' · '+esc(x.p.injury):'')+(alt?' · '+esc(alt):'')+'</span></div><b class="lineup-state">'+(x.seasonStatus==='RESERVE'?'IR':'')+'</b></div>';
  let html='<div class="lineup-section-title">STARTER</div>';
  for(const pid of starters){const x=byId.get(pid);if(x)html+=row(x,x.p.pos);}
  if(!starters.length)html+='<div class="notice warn">Sleeper-Starter noch nicht verfügbar; Kader ist geladen.</div>';
  html+='<div class="lineup-section-title">BENCH</div>'+bench.map(x=>row(x,'BN')).join('');
  if(reserve.length)html+='<div class="lineup-section-title">RESERVE / IR</div>'+reserve.map(x=>row(x,'IR')).join('');
  // Lightweight alternatives: strongest bench option by position from the current panel.
  const alts=bench.filter(x=>x.r).sort((a,b)=>a.r.rank-b.r.rank).slice(0,4);
  if(alts.length)html+='<div class="lineup-section-title">START-ALTERNATIVEN</div>'+alts.map(x=>row(x,x.p.pos,'Bench-Option · Panel '+x.r.rank.toFixed(1))).join('');
  return html;
}
const SEASON_SPECIAL_TEAMS_MODEL={
  version:'st-v1.1',updated:'2026-09-01',
  acquisitionPolicy:{dstEarlyAdd:'compare replacement edge vs weakest roster option value and market-loss risk',rbPreWeek1OptionValue:'elevated',defaultTiming:'wait unless DST scarcity/edge clears roster-option threshold'},
  dst:{panelCandidates:['Ted Chmyz — Fantasy Football Blueprint','Nathan Jahnke — PFF','Marc Shannep — Fantasy Knockout','Sean Koerner — Action Network'],specialist:'Joey Pollizze — RotoBaller',qualityFloor:true,horizonWeeks:4},
  k:{panelCandidates:['Jared Smola / Draft Sharks','Joe Bond — Fantasy Six Pack','Nathan Jahnke — PFF','Sean Koerner — Action Network'],qualityFloor:false,horizonWeeks:1},
  provenance:'FantasyPros weekly positional accuracy 2023-2025 + current weekly source availability; candidates remain gated until current-week machine-readable rankings are verified.'
};
function seasonAvailableSpecialTeams(season,players,pos){
  if(!season?.ok)return[];
  const owned=new Set(Object.keys(season.ownership||{}).map(String));
  for(const roster of season.rosters||[])for(const pid of [...(roster?.players||[]),...(roster?.reserve||[]),...(roster?.taxi||[])])owned.add(String(pid));
  const wanted=pos==='DST'?new Set(['DEF','DST']):new Set(['K']);
  return Object.entries(players||{}).filter(([pid,p])=>!owned.has(String(pid))&&wanted.has(String(p.position||'').toUpperCase())&&p.active!==false).map(([pid])=>sleeperPlayerRow(pid,players));
}
function seasonAvailablePlayers(season,players){
  if(!season?.ok)return null;
  // Never trust a derived ownership object as the sole FA authority. Build ownership
  // directly from every live Sleeper roster as well; a player is FA only if absent from
  // BOTH sources. This prevents rostered stars (e.g. Bowers) from leaking into FA audit.
  const owned=new Set(Object.keys(season.ownership||{}).map(String));
  for(const roster of season.rosters||[]){
    for(const pid of roster?.players||[])owned.add(String(pid));
    for(const pid of roster?.reserve||[])owned.add(String(pid));
    for(const pid of roster?.taxi||[])owned.add(String(pid));
  }
  return Object.entries(players||{}).filter(([pid,p])=>!owned.has(String(pid))&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false&&p.full_name).map(([pid])=>sleeperPlayerRow(pid,players)).map(p=>({p,r:rankFor(p.name,p.pos)})).filter(x=>x.r&&panelSelectable(x.r.panelId)).sort((a,b)=>a.r.rank-b.r.rank||(a.p.searchRank||9999)-(b.p.searchRank||9999)).map(x=>x.p);
}

function activeDraftSurface(){return localStorage.getItem('v118_draftSurface')==='live'?'live':'mock'}
function resolveActiveDraftId(){return activeDraftSurface()==='live'?LIVE_DRAFT_ID_2026:draftId(els.draftInput.value)}
function validateCanonicalLiveDraft({id,season,teams,rounds,slot}){const errors=[];if(String(id)!==LIVE_DRAFT_ID_2026)errors.push('Draft-ID');if(String(season)!=='2026')errors.push('Saison');if(Number(teams)!==10)errors.push('Teams');if(Number(rounds)!==15)errors.push('Runden');if(Number(slot)!==9)errors.push('Slot');return{ok:!errors.length,errors}}
function normalCandidateAdmissible(row){
  // Presentation normal-cut is deliberately broader than the Player-Quality Safety gate.
  // The Safety gate constrains who may become the top recommendation; it must not make
  // otherwise useful Top-10 context look like "fallback" this early in a 10-team draft.
  const v=row?.valueSafety;
  if(!row?.r||!Number.isFinite(row.r.rank)||!v)return false;
  const best=Number(v.bestPanelRank);
  if(!Number.isFinite(best))return false;
  const current=Number(lastDraftContext?.current||1);
  const displayGap=current<=70?18:current<=110?22:26;
  return row.r.rank<=best+displayGap;
}
function applyTurnPortfolioOrdering(rows,current,next){
  if(!Array.isArray(rows)||rows.length<2||!Number.isFinite(current)||!Number.isFinite(next))return rows;
  // Portfolio ordering is presentation-only: it never mutates Coach scores or Return-v2.
  // At a 3-pick turn we can use a broad defer window. On a long turn, only a very high-
  // Return WAIT leader may be deferred, and only for a close-quality, genuinely urgent
  // alternative. This closes the "WAIT still shown #1" failure without position forcing.
  const turnGap=next-current,shortTurn=turnGap<=3;
  const leader=rows[0],leaderRet=Number(leader?.ret);
  const leaderRetMin=shortTurn?.85:.90;
  if(leader?.action!=='WAIT'||!Number.isFinite(leaderRet)||leaderRet<leaderRetMin)return rows;
  const leaderPanel=Number(leader?.r?.rank),leaderRaw=Number(leader?.rawScore);
  if(!Number.isFinite(leaderPanel))return rows;
  const maxAltRet=shortTurn?.82:.25;
  const maxPanelGap=shortTurn?25:15;
  const maxRawGap=shortTurn?Infinity:10;
  // rc4.105: a short-turn timing override may defer a high-Return leader only for
  // an alternative that is still materially viable on the normalized Coach scale.
  // This preserves the validated TLaw/Corum case (47) while blocking the rc4.104
  // pick-129 failure where a score-0 WR displaced a score-100 RB solely on Return.
  const minShortTurnCoachScore=40;
  const alternatives=rows.slice(1).filter(x=>{
    const ret=Number(x?.ret),panel=Number(x?.r?.rank),raw=Number(x?.rawScore);
    return !x?.hardExcluded&&!x?.recommendationBlocked&&normalCandidateAdmissible(x)
      &&(!shortTurn||Number(x?.score)>=minShortTurnCoachScore)
      &&Number.isFinite(ret)&&ret<=maxAltRet
      &&Number.isFinite(panel)&&panel<=leaderPanel+maxPanelGap
      &&(!Number.isFinite(leaderRaw)||!Number.isFinite(raw)||leaderRaw-raw<=maxRawGap);
  }).sort((a,b)=>Number(a.ret)-Number(b.ret)||Number(a.r.rank)-Number(b.r.rank)||Number(b.rawScore)-Number(a.rawScore));
  const take=alternatives[0];
  if(!take)return rows;
  const ordered=[take,...rows.filter(x=>x!==take)];
  take.turnPortfolioReason=`Turn-Portfolio: ${leader.p.name} mit ${Math.round(leaderRet*100)}% Return aufschieben`;
  if(Array.isArray(take.reasons)&&!take.reasons.includes(take.turnPortfolioReason))take.reasons.push(take.turnPortfolioReason);
  leader.turnPortfolioDeferred=true;
  const deferReason=`Turn-Portfolio: hoher Return (${Math.round(leaderRet*100)}%) · für Folgepick einplanen`;
  if(Array.isArray(leader.reasons)&&!leader.reasons.includes(deferReason))leader.reasons.push(deferReason);
  return ordered;
}
function visibleCoachCandidates(rows){
  const source=(rows||[]).filter(x=>x?.p&&x?.r);
  if(!source.length)return[];
  const normal=source.filter(normalCandidateAdmissible);
  const visible=normal.slice(0,10);
  // If fewer than ten normal candidates exist, fill remaining slots with the best
  // outside-cut context candidates. Never let fallback rows displace normal-cut peers.
  if(visible.length<10){
    const seen=new Set(visible.map(x=>norm(x.p.name)));
    for(const x of source){
      if(visible.length>=10)break;
      if(seen.has(norm(x.p.name)))continue;
      visible.push(x);seen.add(norm(x.p.name));
    }
  }
  return visible.map(row=>({...row,outsideNormalCut:!normalCandidateAdmissible(row)}));
}

let experts=store.get('v7_experts',[]);
let panels=store.get('v7_panels',{standard:{name:'Standard',members:{}},pat:{name:'Pat einzeln',members:{}}});
let activePanelId=store.text('v7_activePanel','standard');
let positionPanels=store.get('v7_positionPanels',{QB:'qb',RB:'rb',WR:'wr',TE:'te'});
const EXPERT_PROFILE_IDS={incumbent:{QB:'qb',RB:'rb',WR:'wr',TE:'te'},fullv2:{QB:'expert-v2-qb',RB:'expert-v2-rb',WR:'expert-v2-wr',TE:'expert-v2-te'},wrv2:{QB:'qb',RB:'rb',WR:'expert-v2-wr',TE:'te'},expertv3:{QB:'expert-v3-qb',RB:'expert-v3-rb',WR:'expert-v2-wr',TE:'expert-v3-te'},expertv4:{QB:'expert-v4-qb',RB:'expert-v4-rb',WR:'expert-v4-wr',TE:'expert-v4-te'},expertv5:{QB:'expert-v5-qb',RB:'expert-v5-rb',WR:'expert-v5-wr',TE:'expert-v5-te'}};
const EXPERT_V4_BLUEPRINT={
  // v4 is individual-only and position-specific. Weights combine verified multi-year
  // Draft Accuracy with recent signal; Pat is retained only as a small stability anchor
  // where his positional accuracy does not justify primary influence.
  QB:{experts:['Sean Koerner','Todd D Clark','Justin Boone','Dalton Del Don','Nick Mariano','Pat Fitzmaurice'],weights:{'Sean Koerner':30,'Todd D Clark':25,'Justin Boone':15,'Dalton Del Don':10,'Nick Mariano':10,'Pat Fitzmaurice':10},maxSingleWeight:.30},
  RB:{experts:['Ryan Weisse','Kev Wheeler','Dalton Del Don','Nick Mariano','Sean Koerner','Pat Fitzmaurice'],weights:{'Ryan Weisse':25,'Kev Wheeler':25,'Dalton Del Don':15,'Nick Mariano':15,'Sean Koerner':10,'Pat Fitzmaurice':10},maxSingleWeight:.30},
  WR:{experts:['Sean Koerner','Nick Mariano','Justin Boone','Todd D Clark','Dalton Del Don','Pat Fitzmaurice'],weights:{'Sean Koerner':25,'Nick Mariano':25,'Justin Boone':20,'Todd D Clark':10,'Dalton Del Don':10,'Pat Fitzmaurice':10},maxSingleWeight:.30},
  TE:{experts:['Wolf of Roto Street','Ryan Weisse','Sean Koerner','Dalton Del Don','Pat Fitzmaurice','Justin Boone'],weights:{'Wolf of Roto Street':25,'Ryan Weisse':20,'Sean Koerner':15,'Dalton Del Don':15,'Pat Fitzmaurice':15,'Justin Boone':10},maxSingleWeight:.30}
};
const EXPERT_V5_BLUEPRINT={base:'expertv3',add:'Sean Koerner',fundPrimarilyFrom:'Draft Sharks Team',positionSpecific:true,maxSingleWeight:.30};
const EXPERT_DECISION_CORE_MIN={QB:24,RB:60,WR:70,TE:24};
function ensureExpertV2Panels(){const src=globalThis.PITTI_EXPERT_V2;if(!src||src.schema!=='pitti-expert-v2-board.v4')return false;for(const pos of ['QB','RB','WR','TE']){const list=src.rows?.[pos]||[];if(!list.length)return false;const id='expert-v2-'+pos.toLowerCase(),ranks={};for(const row of list){const rank=Number(row.rank);if(row.name&&Number.isFinite(rank)&&rank>0)ranks[norm(row.name)]={name:row.name,pos,rank,mean:rank,median:rank,sd:Number.isFinite(Number(row.sd))?Number(row.sd):null,n:Number.isFinite(Number(row.n))?Number(row.n):null,tier:row.tier??null,individual:Array.isArray(row.individual)?row.individual.map(e=>({expertName:e.expertName,rank:Number(e.rank),effectiveWeight:Number(e.effectiveWeight),reconstructed:!!e.reconstructed,spread:e.spread??null})).filter(e=>e.expertName&&Number.isFinite(e.rank)):[]};}panelRanks[id]=ranks;panels[id]={name:'Expert-v2 '+pos+' · 26.08.',members:{},shadow:true,weights:src.weights?.[pos]||{},source:src.source};}return true;}
function ensureExpertV3Panels(){
  const base=globalThis.PITTI_EXPERT_V2,v3=globalThis.PITTI_EXPERT_V3;
  if(!base||base.schema!=='pitti-expert-v2-board.v4'||!v3||v3.schema!=='pitti-expert-v3-board.v1')return false;
  for(const pos of ['QB','RB','TE']){
    const spec=v3.challengers?.[pos],weights=v3.weights?.[pos],baseRows=base.rows?.[pos]||[];
    if(!spec||!weights||!baseRows.length)return false;
    const challenger=new Map((spec.ranks||[]).map(([name,rank])=>[norm(name),Number(rank)]).filter(([,rank])=>Number.isFinite(rank)&&rank>0));
    const intendedExperts=Object.entries(weights).filter(([,w])=>Number(w)>0).map(([name])=>name);
    const id='expert-v3-'+pos.toLowerCase(),ranks={};
    for(const row of baseRows){
      if(!row?.name||!Number.isFinite(Number(row.rank)))continue;
      const cr=challenger.get(norm(row.name));
      const vals=[];
      for(const e of Array.isArray(row.individual)?row.individual:[]){
        if(!e?.expertName||!Number.isFinite(Number(e.rank)))continue;
        let ew=Number(e.effectiveWeight)||0;
        const oldBase=Number(base.weights?.[pos]?.[e.expertName]);
        const newBase=Number(weights?.[e.expertName]);
        if(Number.isFinite(oldBase)&&oldBase>0&&Number.isFinite(newBase)&&newBase>=0)ew*=newBase/oldBase;
        // Frozen v3 board values are cross-position Overall ranks. Keep them on that
        // common scale; v5 must never mix them with Koerner positional ranks.
        vals.push({expertName:e.expertName,rank:Number(e.rank),posRank:null,overallRank:Number(e.rank),effectiveWeight:ew,reconstructed:!!e.reconstructed,spread:e.spread??null});
      }
      const cw=Number(weights[spec.name]||0);
      if(Number.isFinite(cr)&&cw>0)vals.push({expertName:spec.name,rank:cr,posRank:null,overallRank:cr,effectiveWeight:cw,reconstructed:false,spread:null});
      const present=new Set(vals.map(e=>e.expertName));
      const missing=intendedExperts.filter(name=>!present.has(name));
      const sw=vals.reduce((sum,e)=>sum+e.effectiveWeight,0);
      if(!sw)continue;
      // Coverage semantics: keep historical v3 rank math frozen for control comparability,
      // but never pretend a sparse row is the same ensemble. Missing experts are explicit
      // right-censored/unknown coverage until source metadata proves acquisition failure.
      const mean=vals.reduce((sum,e)=>sum+e.rank*e.effectiveWeight,0)/sw;
      const variance=vals.reduce((sum,e)=>sum+e.effectiveWeight*(e.rank-mean)**2,0)/sw;
      ranks[norm(row.name)]={
        name:row.name,pos,rank:mean,mean,median:mean,sd:Math.sqrt(variance),n:vals.length,tier:row.tier??null,
        intendedN:intendedExperts.length,coverage:vals.length/intendedExperts.length,
        coverageStatus:missing.length?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE',
        missingExperts:missing,
        individual:vals.sort((a,b)=>a.rank-b.rank)
      };
    }
    assignTiers(ranks);
    panelRanks[id]=ranks;
    panels[id]={name:'Expert-v3 '+pos+' · 28.08.',members:{},shadow:true,weights,source:v3.source,methodology:v3.methodology,coveragePolicy:'FAIL_CLOSED_EXPLICIT_MISSINGNESS'};
  }
  return true;
}
function normalizeWeights(raw,cap=.30){
  const entries=Object.entries(raw||{}).filter(([,w])=>Number(w)>0).map(([name,w])=>[name,Number(w)]);
  if(!entries.length)return{};
  let weights=Object.fromEntries(entries),free=new Set(entries.map(([n])=>n)),remaining=1;
  while(free.size){
    const base=[...free].reduce((a,n)=>a+weights[n],0);if(!base)break;
    let capped=false;
    for(const n of [...free]){
      const proposed=remaining*weights[n]/base;
      if(proposed>cap){weights[n]=cap;remaining-=cap;free.delete(n);capped=true}
    }
    if(!capped){const denom=[...free].reduce((a,n)=>a+weights[n],0);for(const n of free)weights[n]=remaining*weights[n]/denom;break}
  }
  return weights;
}
function buildPanelFromExpertRows(id,pos,expertRows,rawWeights,meta={}){
  const weights=normalizeWeights(rawWeights,meta.maxSingleWeight??.30);
  const intendedExperts=Object.keys(weights),byName=new Map();
  for(const expertName of intendedExperts){
    for(const row of expertRows[expertName]||[]){
      const k=norm(row.name);if(!k)continue;
      if(!byName.has(k))byName.set(k,{name:row.name,pos,vals:[]});
      const overall=Number(row.overallRank),posRank=Number(row.posRank??row.rank);
      // Cross-position Coach quality must live on one common scale: published Overall.
      // Position rank is aggregated independently for position-specific interpretation/UI.
      byName.get(k).vals.push({expertName,rank:overall,posRank,overallRank:overall,effectiveWeight:weights[expertName],reconstructed:false,spread:null});
    }
  }
  const ranks={};
  for(const [k,item] of byName){
    const vals=item.vals.filter(x=>Number.isFinite(x.rank)&&x.rank>0&&Number.isFinite(x.posRank)&&x.posRank>0),present=new Set(vals.map(x=>x.expertName)),missing=intendedExperts.filter(x=>!present.has(x));
    const sw=vals.reduce((a,x)=>a+x.effectiveWeight,0);if(!sw)continue;
    const mean=vals.reduce((a,x)=>a+x.rank*x.effectiveWeight,0)/sw,variance=vals.reduce((a,x)=>a+x.effectiveWeight*(x.rank-mean)**2,0)/sw;
    const posMean=vals.reduce((a,x)=>a+x.posRank*x.effectiveWeight,0)/sw;
    ranks[k]={name:item.name,pos,rank:mean,overallRank:mean,posRank:posMean,mean,median:mean,sd:Math.sqrt(variance),n:vals.length,intendedN:intendedExperts.length,coverage:vals.length/intendedExperts.length,coverageStatus:missing.length?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE',missingExperts:missing,individual:vals.sort((a,b)=>a.rank-b.rank)};
  }
  assignTiers(ranks);panelRanks[id]=ranks;panels[id]={name:meta.name||id,members:{},shadow:true,weights,source:meta.source||'verified-expert-import',coveragePolicy:'FAIL_CLOSED_EXPLICIT_MISSINGNESS'};return ranks;
}
function verifiedRowsForExpert(name,pos){
  const e=findExpert(name),cache=e?rankCache[e.id]:null;if(!cache?.verifiedIndividual||cache?.duplicateOf)return[];
  const rows=Object.values(cache.ranks||{}).filter(x=>x?.pos===pos&&Number.isFinite(Number(x.posRank??x.rank)));
  // v4/v5 aggregate POSITION rank. Provenance must keep the source's published Overall
  // rank separately. Some source adapters store rank=Overall and posRank correctly; others
  // expose no native posRank, in which case only the positional ordering is derived.
  const sorted=rows.slice().sort((a,b)=>Number(a.posRank??a.rank)-Number(b.posRank??b.rank)||Number(a.rank)-Number(b.rank));
  return sorted.map((x,i)=>{
    const pr=Number.isFinite(Number(x.posRank))&&Number(x.posRank)>0?Number(x.posRank):i+1;
    const publishedOverall=Number.isFinite(Number(x.overallRank))&&Number(x.overallRank)>0?Number(x.overallRank):(Number.isFinite(Number(x.rank))&&Number(x.rank)>0?Number(x.rank):null);
    return {name:x.name,pos,rank:publishedOverall,posRank:pr,overallRank:publishedOverall};
  });
}
function ensureExpertV4Panels(){
  let ok=true;
  for(const pos of ['QB','RB','WR','TE']){
    const bp=EXPERT_V4_BLUEPRINT[pos],rows={};
    for(const name of bp.experts)rows[name]=verifiedRowsForExpert(name,pos);
    // Source depth is checked separately from row overlap. A published positional list can
    // legitimately stop before another expert's tail; that is right-censoring, not an
    // acquisition failure and must not be converted into a vote or silently renormalized.
    if(bp.experts.some(name=>rows[name].length<EXPERT_DECISION_CORE_MIN[pos])){ok=false;continue}
    buildPanelFromExpertRows('expert-v4-'+pos.toLowerCase(),pos,rows,bp.weights||Object.fromEntries(bp.experts.map(name=>[name,1])),{name:'Expert-v4 '+pos,source:'live verified individual experts',maxSingleWeight:bp.maxSingleWeight});
  }
  // Source-depth failures remain hard failures. For overlap/readiness, use the shared
  // COMPLETE-row decision-core rule; never let sparse rows define the acceptance sample.
  return ok&&expertProfileReady('expertv4');
}
function ensureExpertV5Panels(){
  // v5 is the controlled v3 challenger: preserve v3 and fund verified Sean Koerner
  // primarily by reducing Draft Sharks Team, never by stacking Koerner onto v4.
  const koerner='Sean Koerner',v3=globalThis.PITTI_EXPERT_V3;let ok=true;
  if(!v3)return false;
  for(const pos of ['QB','RB','WR','TE']){
    // Frozen v3 intentionally reuses the v2 WR panel rather than creating expert-v3-wr.
    // Resolve through the canonical profile map so v5 inherits the actual v3 baseline.
    const v3Id=EXPERT_PROFILE_IDS.expertv3[pos],baseRows=panelRanks[v3Id]||{},kRows=verifiedRowsForExpert(koerner,pos);
    if(kRows.length<EXPERT_DECISION_CORE_MIN[pos]||!Object.keys(baseRows).length){ok=false;continue}
    const kMap=new Map(kRows.map(x=>[norm(x.name),x])),ranks={};
    const baseWeights=v3.weights?.[pos]||panels[v3Id]?.weights||{};
    // Target Koerner share 15%. Take it from DS first; only if DS has less than 15
    // would the remainder be funded proportionally from the other v3 voices.
    const target=.15,raw={...baseWeights};
    const dsKey=Object.keys(raw).find(n=>norm(n)===norm('Draft Sharks Team'));
    let need=target*100;
    if(dsKey){const take=Math.min(Number(raw[dsKey])||0,need);raw[dsKey]=Math.max(0,(Number(raw[dsKey])||0)-take);need-=take}
    if(need>0){const others=Object.keys(raw).filter(n=>n!==dsKey&&Number(raw[n])>0),sum=others.reduce((z,n)=>z+Number(raw[n]),0);for(const n of others)raw[n]=Math.max(0,Number(raw[n])-need*Number(raw[n])/sum)}
    raw[koerner]=target*100;
    // v5 is a controlled v3 perturbation: preserve every frozen v3 share except the
    // explicitly funded Draft-Sharks reduction. Do NOT apply the v4 single-expert cap here,
    // because that would silently rewrite v3 (notably WR Mariano 35%) and move Koerner
    // away from the required exact 15 percentage points.
    const rawTotal=Object.values(raw).reduce((z,w)=>z+(Number(w)||0),0);
    const weights=Object.fromEntries(Object.entries(raw).filter(([,w])=>Number(w)>0).map(([name,w])=>[name,Number(w)/rawTotal]));
    for(const [key,row] of Object.entries(baseRows)){
      const k=kMap.get(key),vals=[];
      for(const x of row.individual||[]){
        const w=Number(weights[x.expertName]);if(!(w>0)||!Number.isFinite(Number(x.rank)))continue;
        // v3/v2 base rows are frozen Overall ranks; v5 stays on that same common scale.
        vals.push({...x,rank:Number(x.rank),overallRank:Number(x.rank),posRank:Number.isFinite(Number(x.posRank))?Number(x.posRank):null,effectiveWeight:w});
      }
      if(k&&Number(weights[koerner])>0)vals.push({expertName:koerner,rank:Number(k.overallRank??k.rank),posRank:Number(k.posRank),overallRank:Number(k.overallRank??k.rank),effectiveWeight:Number(weights[koerner]),reconstructed:false,spread:null});
      const intended=Object.keys(weights).filter(n=>weights[n]>0),present=new Set(vals.map(x=>x.expertName)),missing=intended.filter(n=>!present.has(n)),sw=vals.reduce((z,x)=>z+Number(x.effectiveWeight||0),0);
      if(!sw)continue;
      const mean=vals.reduce((z,x)=>z+Number(x.rank)*Number(x.effectiveWeight||0),0)/sw,variance=vals.reduce((z,x)=>z+Number(x.effectiveWeight||0)*(Number(x.rank)-mean)**2,0)/sw;
      ranks[key]={...row,rank:mean,mean,median:mean,sd:Math.sqrt(variance),n:vals.length,intendedN:intended.length,coverage:vals.length/intended.length,coverageStatus:missing.length?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE',missingExperts:missing,individual:vals.sort((x,y)=>x.rank-y.rank)};
    }
    // v5 may contain historically sparse v3 rows. Readiness is therefore based on
    // source depth + a usable decision core, while per-player missingness stays explicit
    // and fail-closed. Do not require impossible COMPLETE overlap across every v3 voice.
    const usableCount=Object.values(ranks).filter(row=>Number.isFinite(Number(row?.rank))).length;
    if(usableCount<EXPERT_DECISION_CORE_MIN[pos])ok=false;
    assignTiers(ranks);panelRanks['expert-v5-'+pos.toLowerCase()]=ranks;panels['expert-v5-'+pos.toLowerCase()]={name:'Expert-v5 '+pos+' · v3 + Koerner',members:{},shadow:true,weights,source:'Expert-v3 plus verified Sean Koerner funded primarily from Draft Sharks Team',coveragePolicy:'FAIL_CLOSED_EXPLICIT_MISSINGNESS'};
  }
  return ok;
}
function expertPanelMembershipAudit(id){
  const weights=panels[id]?.weights||{},allowed=new Set(Object.keys(weights).filter(n=>Number(weights[n])>0).map(norm));
  const bad=[];
  for(const row of Object.values(panelRanks[id]||{})){
    for(const x of row?.individual||[])if(x?.expertName&&!allowed.has(norm(x.expertName)))bad.push({player:row.name,expert:x.expertName});
  }
  return bad;
}
function currentExpertProfile(){for(const [id,map] of Object.entries(EXPERT_PROFILE_IDS))if(['QB','RB','WR','TE'].every(pos=>positionPanels[pos]===map[pos]))return id;return 'custom';}
function expertProfileReady(id){
  const map=EXPERT_PROFILE_IDS[id];if(!map)return false;
  return ['QB','RB','WR','TE'].every(pos=>{
    const pid=map[pos],rows=panelRanks[pid];
    if(!rows||!Object.keys(rows).length)return false;
    if((id==='expertv4'||id==='expertv5')&&expertPanelMembershipAudit(pid).length)return false;
    if(id==='expertv3')return Object.values(rows).every(row=>row?.coverageStatus==='COMPLETE'||!('coverageStatus' in row));
    const need=EXPERT_DECISION_CORE_MIN[pos];
    if(id==='expertv5'){
      // v5 inherits v3's intentionally sparse historical board. Source validity is proved by
      // a successful v5 build plus a usable position core; per-player missingness remains
      // explicit and never becomes an invented vote.
      const usable=Object.values(rows).filter(row=>Number.isFinite(Number(row?.rank))).length;
      return usable>=need;
    }
    // v4 is individual-only and its decision core must have full intended-expert overlap.
    const complete=Object.values(rows).filter(row=>row?.coverageStatus==='COMPLETE').sort((a,b)=>Number(a.rank)-Number(b.rank));
    return complete.length>=need;
  });
}
function expertV45AuditSummary(){
  const parts=[];
  for(const pos of ['QB','RB','WR','TE']){
    const need=EXPERT_DECISION_CORE_MIN[pos],bp=EXPERT_V4_BLUEPRINT[pos];
    const source=bp.experts.map(name=>{
      const e=findExpert(name),cache=e?rankCache[e.id]:null,rows=verifiedRowsForExpert(name,pos);
      let state=String(rows.length);
      if(!e)state='NICHT GEFUNDEN';
      else if(cache?.duplicateOf)state='DUPLIKAT';
      else if(!cache?.verifiedIndividual)state='QUELLE FEHLT'+(cache?.error?': '+String(cache.error).slice(0,90):'');
      else if(cache?.staleFallback)state=rows.length+' STALE';
      return name+' '+state+'/'+need;
    }).join(', ');
    const panel=panelRanks['expert-v4-'+pos.toLowerCase()]||{};
    const complete=Object.values(panel).filter(row=>row?.coverageStatus==='COMPLETE').length;
    parts.push('v4 '+pos+': '+source+' · COMPLETE '+complete+'/'+need);
  }
  const koerner='Sean Koerner';
  for(const pos of ['QB','RB','WR','TE']){
    const need=EXPERT_DECISION_CORE_MIN[pos],e=findExpert(koerner),cache=e?rankCache[e.id]:null,rows=verifiedRowsForExpert(koerner,pos);
    const panel=panelRanks['expert-v5-'+pos.toLowerCase()]||{},complete=Object.values(panel).filter(row=>row?.coverageStatus==='COMPLETE').length;
    let state=String(rows.length);
    if(!e)state='NICHT GEFUNDEN';
    else if(cache?.duplicateOf)state='DUPLIKAT';
    else if(!cache?.verifiedIndividual)state='QUELLE FEHLT'+(cache?.error?': '+String(cache.error).slice(0,90):'');
    else if(cache?.staleFallback)state=rows.length+' STALE';
    parts.push('v5 '+pos+': Koerner '+state+'/'+need+' · COMPLETE '+complete+'/'+need);
  }
  return parts;
}
function renderExpertV45Audit(){
  if(!els.analysisExpertAuditStatus)return;
  const v4=expertProfileReady('expertv4'),v5=expertProfileReady('expertv5');
  els.analysisExpertAuditStatus.className='notice '+(v4&&v5?'ok':'warn');
  els.analysisExpertAuditStatus.textContent=(v4?'v4 BEREIT':'v4 GESPERRT')+' · '+(v5?'v5 BEREIT':'v5 GESPERRT')+' | '+expertV45AuditSummary().join(' | ');
}
function syncAnalysisExpertSelector(){
  if(!els.analysisExpertProfile)return;
  const active=currentExpertProfile();
  for(const opt of els.analysisExpertProfile.options){
    if(opt.value==='expertv3'){opt.disabled=false;continue}
    opt.disabled=!expertProfileReady(opt.value);
  }
  els.analysisExpertProfile.value=['expertv3','expertv4','expertv5'].includes(active)?active:'expertv3';
  renderExpertV45Audit();
}
function applyExpertProfile(id){
  if(!Object.prototype.hasOwnProperty.call(EXPERT_PROFILE_IDS,id))return false;
  if((id==='expertv4'||id==='expertv5')&&!expertProfileReady(id))return false;
  const map=EXPERT_PROFILE_IDS[id];if(!map)return false;
  positionPanels={...map};persist();renderAll();
  // The legacy configuration selector intentionally exposes incumbent/v2/v3 only.
  // Do not blank it when the dedicated v4/v5 analysis switch is active.
  if(els.expertProfile&&[...els.expertProfile.options].some(o=>o.value===id))els.expertProfile.value=id;
  syncAnalysisExpertSelector();return true;
}

function loadRankCacheCompact(){
  const legacy=store.get('v7_rankCache',{}),out={};
  if(legacy&&typeof legacy==='object')Object.assign(out,legacy);
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k?.startsWith('v7_rank_'))continue;const id=k.slice(8);if(id&&!out[id]){const v=store.get(k,null);if(v&&typeof v==='object')out[id]=v}}}catch{}
  return out;
}
function removeLegacyRankingStorage(){
  // v7_rankCache and v7_panelRanks are obsolete full duplicates. Removing them first is
  // safe because panels are rebuilt from the per-expert source caches / sealed boards.
  try{localStorage.removeItem('v7_rankCache');localStorage.removeItem('v7_panelRanks')}catch{}
}
function pruneNonCriticalStorageForRankWrite(){
  // Decision fixtures are primary draft evidence and must never be sacrificed to refresh
  // reproducible ranking caches. Evict only secondary/rebuildable data here.
  const keys=['v118_returnValidation','v117_researchEvidence'];
  for(const key of keys){try{localStorage.removeItem(key)}catch{}}
}
function persistExpertRankCache(expertId,result){
  const key='v7_rank_'+expertId,payload=JSON.stringify(result);
  try{localStorage.setItem(key,payload);return{ok:true,recovered:false}}
  catch(first){
    removeLegacyRankingStorage();
    try{localStorage.setItem(key,payload);return{ok:true,recovered:true}}
    catch(second){
      pruneNonCriticalStorageForRankWrite();
      try{localStorage.setItem(key,payload);return{ok:true,recovered:true}}
      catch(third){return{ok:false,error:third}}
    }
  }
}
let rankCache=loadRankCacheCompact();
removeLegacyRankingStorage();
let panelRanks={};
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
const ACTIVE_2026_MANAGER_MAP_TEXT='1=Michael, 2=Pascal Voerde, 3=Marc Düsseldorf, 4=Thomas, 5=Bjoern, 6=Pascal Gelderner, 7=Giuliano, 8=Basti, 9=Muerotechnik, 10=Dutch Marc';
function canonicalize2026ManagerMap(stored){
  const v=String(stored||'').trim();
  const legacyUserTeam=['Moers','Venom'].join(' '),legacyManager=['Michael','K.'].join(' ');const stale=/5\s*=\s*Basti|8\s*=\s*Pascal Gelderner/i.test(v)||v.includes(legacyUserTeam)||v.includes(legacyManager);
  return !v||stale?ACTIVE_2026_MANAGER_MAP_TEXT:v;
}
els.managerMap.value=canonicalize2026ManagerMap(store.text('v11_managerMap',store.text('v10_managerMap',ACTIVE_2026_MANAGER_MAP_TEXT)));
let pendingLiveManagerModes=null;
function liveManagerModeAtCurrent(slot){
  const current=Number(lastDraftContext?.current||1);
  const seg=explicitManagerModeAt(loadManagerModeSegments(),Number(slot),current);
  return seg||'infer';
}
function populateLiveManagerModeControl(){
  if(!els.liveManagerGrid)return;
  const map=parseManagerMap(ACTIVE_2026_MANAGER_MAP_TEXT);
  els.liveManagerGrid.innerHTML=Object.entries(map).filter(([slot])=>Number(slot)!==9).map(([slot,name])=>{
    const mode=liveManagerModeAtCurrent(Number(slot));
    return `<label class="live-manager-row"><span class="live-manager-name">${esc(slot+' · '+name)}</span><select class="live-manager-mode-select" data-slot="${slot}" aria-label="${esc(name)} Modus"><option value="infer" ${mode==='infer'?'selected':''}>? / erkennen</option><option value="autodraft" ${mode==='autodraft'?'selected':''}>AUTO</option><option value="manual" ${mode==='manual'?'selected':''}>MANUELL</option></select></label>`;
  }).join('');
  els.liveManagerGrid.querySelectorAll('.live-manager-mode-select').forEach(sel=>sel.onchange=()=>{sel.dataset.dirty='1';});
  renderLiveManagerModeStatus();
}
function renderLiveManagerModeStatus(){
  if(!els.liveManagerModeStatus||!els.liveManagerGrid)return;
  let auto=0,manual=0,infer=0;
  els.liveManagerGrid.querySelectorAll('.live-manager-mode-select').forEach(sel=>{
    if(sel.dataset.dirty!=='1')sel.value=liveManagerModeAtCurrent(Number(sel.dataset.slot));
    if(sel.value==='autodraft')auto++;else if(sel.value==='manual')manual++;else infer++;
  });
  const pick=Number(lastDraftContext?.current||1);
  els.liveManagerModeStatus.textContent=`Pick ${pick} · AUTO ${auto} · MANUELL ${manual} · ? ${infer}`;
}
function collectLiveManagerModesFromUi(){
  const out={};
  els.liveManagerGrid?.querySelectorAll('.live-manager-mode-select').forEach(sel=>{out[Number(sel.dataset.slot)]=String(sel.value||'infer');});
  return out;
}
function applyPendingLiveManagerModesAtPick(current){
  if(!pendingLiveManagerModes)return 0;
  const segments=loadManagerModeSegments();let changed=0;
  for(const [slotText,mode] of Object.entries(pendingLiveManagerModes)){
    const slot=Number(slotText);if(!Number.isFinite(slot)||slot===9)continue;
    const effective=explicitManagerModeAt(segments,slot,current)||'infer';
    if(effective===mode)continue;
    const arr=Array.isArray(segments[slot])?segments[slot]:[];
    arr.push({fromPick:current,mode,source:'user-explicit-live-grid',createdAt:Date.now()});
    segments[slot]=arr;changed++;
  }
  saveManagerModeSegments(segments);pendingLiveManagerModes=null;
  els.liveManagerGrid?.querySelectorAll('.live-manager-mode-select').forEach(sel=>delete sel.dataset.dirty);
  return changed;
}
async function applyLiveManagerModesToCoach(){
  if(analysisBusy)return;
  pendingLiveManagerModes=collectLiveManagerModesFromUi();
  if(els.liveManagerApply){els.liveManagerApply.disabled=true;els.liveManagerApply.textContent='Übernehme & aktualisiere Coach …';}
  try{
    await refresh();
    if(els.liveManagerModeStatus)els.liveManagerModeStatus.textContent='Übernommen · '+els.liveManagerModeStatus.textContent;
  }catch(e){
    pendingLiveManagerModes=null;
    if(els.draftStatus){els.draftStatus.className='notice bad';els.draftStatus.textContent=e?.message||String(e);}
  }finally{
    if(els.liveManagerApply){els.liveManagerApply.disabled=false;els.liveManagerApply.textContent='Manager-Modi an Coach übernehmen';}
  }
}
populateLiveManagerModeControl();
els.stressMode.value=store.text('v113_stressMode','baseline');
els.strategyMode.value=store.text('v111_strategyMode','progressive');
if(els.analysisExpertProfile)els.analysisExpertProfile.value=currentExpertProfile();

function persist(){
  store.setText('v7_apiKey',els.apiKey.value.trim());store.setText('v7_season',els.season.value.trim());store.setText('v7_scoring',els.scoring.value);
  store.setText('v7_draft',els.draftInput.value.trim());store.setText('v7_slot',els.slot.value);store.setText('v7_topN',els.topN.value);store.setText('v7_snapshotMode',els.snapshotMode.value);store.setText('v11_draftMode',els.draftMode.value);store.setText('v11_replayCutoff',els.replayCutoff.value);store.setText('v11_managerMap',els.managerMap.value);store.setText('v113_stressMode',els.stressMode.value);store.setText('v111_strategyMode',els.strategyMode.value);
  store.set('v7_autoRefresh',els.autoRefresh.checked);store.set('v7_experts',experts);store.set('v7_panels',panels);store.setText('v7_activePanel',activePanelId);
  store.set('v7_positionPanels',positionPanels);store.set('v7_adp',adp);store.set('v72_adpMeta',adpMeta);store.set('v7_decisionLog',decisionLog);
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
  const roots=payload?.rankings||{},want=String(scoring||'').toUpperCase();
  const aliases={
    HALF:['HALF','HALF_PPR','HALF-PPR','0.5PPR','0.5_PPR'],
    PPR:['PPR','FULL','FULL_PPR','FULL-PPR'],
    STD:['STD','STANDARD','NON_PPR','NON-PPR']
  };
  const keys=[scoring,want,...(aliases[want]||[])].filter(Boolean);
  let block=null;
  for(const k of keys){if(roots?.[k]&&typeof roots[k]==='object'){block=roots[k];break}}
  // Some Compare Players responses expose the scoring block directly or use a single
  // scoring key. Accept that only when unambiguous; never silently substitute another format.
  if(!block){
    const vals=Object.values(roots).filter(x=>x&&typeof x==='object'&&!Array.isArray(x));
    if(vals.length===1)block=vals[0];
  }
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

function extractPairwiseInvertedRows(payload,targetExpertId,referenceExpertId,referenceRows){
  const target=String(targetExpertId),ref=String(referenceExpertId);
  const ids=String(payload?.filters??'').match(/\d+/g)||[];
  const names=payload?.expert_name&&typeof payload.expert_name==='object'?payload.expert_name:{};
  const hasBoth=(ids.includes(target)&&ids.includes(ref))||(Object.prototype.hasOwnProperty.call(names,target)&&Object.prototype.hasOwnProperty.call(names,ref));
  if(Number(payload?.total_experts)!==2||!hasBoth)return [];
  const refMap=new Map(referenceRows.map(x=>[norm(x.name),Number(x.rank)]).filter(([,rank])=>Number.isFinite(rank)&&rank>0));
  const out=[];
  for(const row of Array.isArray(payload?.players)?payload.players:[]){
    const name=field(row,['player_name','playername','name','full_name']);
    const pos=String(field(row,['player_position_id','position_id','position','pos'])||'').toUpperCase().replace(/[0-9]/g,'');
    const min=Number(field(row,['rank_min','min_rank','rankmin']));
    const max=Number(field(row,['rank_max','max_rank','rankmax']));
    const rr=refMap.get(norm(name));
    if(!name||!['QB','RB','WR','TE'].includes(pos)||!Number.isFinite(rr)||!Number.isFinite(min)||!Number.isFinite(max)||min<=0||max<=0)continue;
    let rank=null;
    if(Math.abs(min-max)<=.001&&Math.abs(rr-min)<=.001)rank=rr;
    else if(Math.abs(rr-min)<=.001)rank=max;
    else if(Math.abs(rr-max)<=.001)rank=min;
    else continue;
    out.push({name:String(name),pos,rank,posRank:null,source:'pairwise-range-inversion',exact:true});
  }
  return out;
}
async function fetchExpertOverallPairwise(targetExpert,referenceExpert){
  const reference=await fetchVerifiedExpertOverall(referenceExpert);
  const referenceRows=reference.rows;
  const season=els.season.value.trim(),scoring=encodeURIComponent(els.scoring.value);
  const pair=encodeURIComponent(String(targetExpert.id)+':'+String(referenceExpert.id));
  const attempts=[
    `/nfl/${season}/consensus-rankings?position=ALL&scoring=${scoring}&type=DRAFT&filters=${pair}&experts=show`,
    `/nfl/${season}/rankings?week=0&position=ALL&scoring=${scoring}&filters=${pair}&range=true&rankstats=true&experts=show`
  ];
  const failures=[];
  for(const p of attempts){
    try{
      const data=await proxyCall(p);
      const rows=extractPairwiseInvertedRows(data,targetExpert.id,referenceExpert.id,referenceRows);
      if(rows.length<80){failures.push('pair rows '+rows.length);continue}
      // Independent positional cross-check on several target rows. Pairwise inversion is accepted
      // only when compare-players returns the same target expert ranks.
      const derived=derivePositionRanks(rows);
      const finalRows=Object.values(derived);
      const grouped={QB:[],RB:[],WR:[],TE:[]};for(const x of finalRows)grouped[x.pos]?.push(x);
      let checked=0,matched=0;
      for(const pos of ['RB','WR','QB','TE']){
        const sample=grouped[pos].sort((a,b)=>a.posRank-b.posRank).slice(0,Math.min(3,grouped[pos].length));if(!sample.length)continue;
        const idsByName=new Map((reference.data?.players||[]).map(x=>[norm(field(x,['player_name','playername','name','full_name'])),String(field(x,['player_id','playerid','id'])||'')]));
        const playerIds=sample.map(x=>idsByName.get(norm(x.name))).filter(Boolean).slice(0,4);
        if(!playerIds.length)continue;
        const cmp=await proxyCall(`/nfl/compare-players?players=${playerIds.join(':')}&position=${pos}&year=${season}&experts=${encodeURIComponent(String(targetExpert.id)+':'+String(referenceExpert.id))}&ranking_type=draft&details=all`);
        const actual=compareRanksFor(cmp,targetExpert.id,els.scoring.value);
        for(const x of sample){
          const pid=idsByName.get(norm(x.name));if(!pid||actual[pid]==null)continue;
          checked++;
          if(Number(actual[pid])===Number(x.posRank))matched++;
        }
      }
      const crosscheck={checked,matched,ok:checked>=2&&matched===checked};
      if(finalRows.length>=80&&crosscheck.ok)return {rows:finalRows,path:p,method:'PAIRWISE_RANGE_INVERSION',crosscheck};
      failures.push('compare crosscheck '+matched+'/'+checked);
    }catch(e){failures.push(e?.message||String(e))}
  }
  throw new Error(targetExpert.name+': Pairwise-API-Fallback fehlgeschlagen. '+failures.join(' | '));
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
const DESIRED_EXPERT_POOL=['Pat Fitzmaurice','Justin Boone','Sean Koerner','Andrew Erickson','Derek Brown','Matt Harmon'];

function desiredExpertPoolHealth(){
  const rows=DESIRED_EXPERT_POOL.map(name=>{
    const e=findExpert(name),c=e?rankCache[e.id]:null;
    let status='unavailable';
    if(c?.duplicateOf)status='duplicate';
    else if(c?.verifiedIndividual&&c?.staleFallback)status='stale-fallback';
    else if(c?.verifiedIndividual)status='verified';
    else if(c?.error)status='unavailable';
    const source=c?.source||'none';
    const sourceUpdated=c?.sourceUpdated||'';
    const refreshed=Number(c?.updated||0);
    return{name,id:e?.id||null,status,source,sourceUpdated,refreshed,error:c?.error||'',counts:c?.counts||{}};
  });
  // Strict health semantics: stale fallback is usable computation evidence, but not current verification.
  const verified=rows.filter(x=>x.status==='verified').length;
  const stale=rows.filter(x=>x.status==='stale-fallback').length;
  const usable=verified+stale;
  return{verified,stale,usable,total:rows.length,degraded:verified<rows.length,rows};
}
function expertHealthDetailLine(row){
  const status=row.status==='verified'?'VERIFIED':row.status==='stale-fallback'?'STALE-FALLBACK':row.status==='duplicate'?'DUPLICATE':'UNAVAILABLE';
  const refreshed=row.refreshed?new Date(row.refreshed).toLocaleString('de-DE'):'';
  const times=[row.sourceUpdated?`Quelle ${row.sourceUpdated}`:'',refreshed?`lokal ${refreshed}`:''].filter(Boolean).join(' · ');
  return`${row.name}: ${status} · ${row.source||'keine Quelle'}${times?` · ${times}`:''}${row.error?` · ${row.error}`:''}`;
}
function embeddedPanelExpertNames(pid){
  const panel=panels[pid]||{};
  if(!panel.shadow)return[];
  const names=new Set();
  for(const row of Object.values(panelRanks[pid]||{}))for(const x of (row?.individual||[]))if(x?.expertName&&Number.isFinite(Number(x.rank)))names.add(x.expertName);
  return[...names];
}
function panelIndividualVerificationLine(pid){
  const panel=panels[pid]||{},embedded=embeddedPanelExpertNames(pid);
  if(panel.shadow)return `${panel.name||pid}: ${embedded.length}/${embedded.length} eingebettet`;
  const ids=Object.keys(panel.members||{}).filter(eid=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);
  return `${panel.name||pid}: ${ids.length}/${Object.keys(panel.members||{}).length}`;
}
function activePanelSourceLines(usedPanelIds){
  const out=[];
  for(const pid of usedPanelIds){
    const panel=panels[pid]||{},embedded=embeddedPanelExpertNames(pid);
    if(panel.shadow&&embedded.length){
      const boardSource=panel.source||globalThis.PITTI_EXPERT_V2?.source||'eingebettetes Expert-Board';
      out.push(...embedded.map(name=>`${name}: ${boardSource} (eingebettet)`));continue;
    }
    for(const eid of Object.keys(panel.members||{})){
      const row=rankCache[eid];if(!row?.verifiedIndividual)continue;
      out.push(`${row.expertName}: ${row.source||'verifiziert'}${row.sourceScoring?` [${row.sourceScoring}${row.sourceContextVerified?' ✓':' ?'}]`:''}${row.sourceUpdated?` (${row.sourceUpdated})`:''}`);
    }
  }
  return[...new Set(out)];
}
function effectivePanelHealthLine(pos){
  const pid=panelFor(pos),panel=panels[pid]||{},embedded=embeddedPanelExpertNames(pid);
  if(panel.shadow)return `${pos}: ${embedded.length?embedded.join(' + '):'keine eingebetteten Einzelränge'} | ${panel.name||'eingebettetes Expert-Board'}`;
  const members=Object.entries(panel.members||{}).filter(([eid])=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);
  const total=members.reduce((sum,[,w])=>sum+Number(w||0),0);
  const effective=members.map(([eid,w])=>{
    const name=rankCache[eid]?.expertName||experts.find(e=>String(e.id)===String(eid))?.name||eid;
    const pct=total?Math.round(Number(w||0)/total*100):0;
    const stale=rankCache[eid]?.staleFallback?' [STALE]':'';
    return`${name} ${pct}%${stale}`;
  });
  const preset=PRESETS[pid];
  const priority=preset?preset.list.map(([name,w])=>`${name} ${w}`).join(' > '):'';
  return`${pos}: ${effective.join(' + ')||'keine'}${priority?` | Soll-Priorität (max ${preset.max}): ${priority}`:''}`;
}
function activePanelHealthState(){
  const positions=['QB','RB','WR','TE'],details=[],embeddedExperts=new Set(),embeddedPositions=[],livePositions=[];
  let degraded=false;
  for(const pos of positions){
    const pid=panelFor(pos),panel=panels[pid]||{};
    if(panel.shadow){
      const names=embeddedPanelExpertNames(pid);names.forEach(n=>embeddedExperts.add(n));embeddedPositions.push(pos);
      const ok=names.length>0&&Object.keys(panelRanks[pid]||{}).length>0;
      if(!ok)degraded=true;
      details.push({pos,pid,kind:'embedded',ok,count:names.length,target:names.length,stale:false});
      continue;
    }
    livePositions.push(pos);
    const configured=Object.entries(panel.members||{});
    const usable=configured.filter(([eid])=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);
    const stale=usable.some(([eid])=>rankCache[eid]?.staleFallback);
    const target=PRESETS[pid]?.max??configured.length;
    const ok=usable.length>=target&&target>0&&!stale;
    if(!ok)degraded=true;
    details.push({pos,pid,kind:'live',ok,count:usable.length,target,stale});
  }
  const mode=embeddedPositions.length===4?'embedded':embeddedPositions.length?'hybrid':'live';
  return{degraded,mode,details,embeddedExperts:[...embeddedExperts],embeddedPositions,livePositions};
}
function activePanelHealthSummaryText(){
  const h=activePanelHealthState();
  if(h.mode==='embedded')return`aktive eingebettete Expertenstimmen ${h.embeddedExperts.length}`;
  const bad=h.details.filter(x=>!x.ok).map(x=>`${x.pos} ${x.count}/${x.target}${x.stale?' stale':''}`);
  if(h.mode==='hybrid')return`aktive Panels ${h.degraded?'DEGRADED':'OK'} · v2 ${h.embeddedPositions.join('/')} + live ${h.livePositions.join('/')}${bad.length?` · ${bad.join(', ')}`:''}`;
  return`aktive Live-Panels ${h.degraded?'DEGRADED':'OK'}${bad.length?` · ${bad.join(', ')}`:''}`;
}
function activePanelSourceSummary(){
  const h=activePanelHealthState();
  if(h.mode==='embedded')return'eingebettete positionsspezifische Expert-Boards; Live-Multi-Source-Pipeline nur Refresh/Diagnose';
  if(h.mode==='hybrid')return`Hybrid: Expert-v2 Frozen Board (${h.embeddedPositions.join('/')}) + verifizierte Live-Multi-Source-Pipeline (${h.livePositions.join('/')})`;
  return'automatische Multi-Source-Pipeline (vollständige öffentliche Einzelrankings; Vergleichsseiten nur Kontrolle)';
}
function activePanelWeightSummary(){
  const h=activePanelHealthState();
  if(h.mode==='embedded')return'im gewählten eingebetteten Expert-Board eingefrorene effektive Gewichte; keine Live-Neunormierung';
  if(h.mode==='hybrid')return'Expert-v2-Positionen nutzen eingefrorene effektive Gewichte; Live-Positionen normieren auf tatsächlich verfügbare verifizierte Experten';
  return'pro Spieler automatisch auf die tatsächlich verfügbaren verifizierten Experten normiert';
}

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
function rebuildPanelRanksFromCache(){
  const verifiedIds=Object.keys(rankCache).filter(id=>rankCache[id]?.verifiedIndividual&&!rankCache[id]?.duplicateOf);
  if(!verifiedIds.length)return false;
  const pool=buildDraftCandidatePool(verifiedIds);if(pool.total<120)return false;
  const rebuilt={};for(const id of Object.keys(panels))rebuilt[id]=computePanel(id,pool.keep);
  if(!Object.values(rebuilt).some(r=>Object.keys(r||{}).length))return false;
  panelRanks=rebuilt;ensureExpertV2Panels();ensureExpertV3Panels();return true;
}
if(!Object.keys(panelRanks).length)rebuildPanelRanksFromCache();
ensureExpertV2Panels();ensureExpertV3Panels();
function renderAll(){if(!panels[activePanelId])activePanelId='standard';panelOptions(els.activePanel,activePanelId);for(const[pos,el]of [['QB',els.qbPanel],['RB',els.rbPanel],['WR',els.wrPanel],['TE',els.tePanel]])panelOptions(el,positionPanels[pos]||activePanelId);renderExperts();renderLog();updateStatus()}
function renderExperts(){const q=els.expertSearch.value.trim().toLowerCase(),members=panels[activePanelId]?.members||{},total=Object.values(members).reduce((s,w)=>s+Number(w||0),0);const list=experts.filter(e=>!q||`${e.name} ${e.site}`.toLowerCase().includes(q));els.expertsList.innerHTML=list.length?list.map(e=>{const on=members[e.id]!=null,w=Number(members[e.id]??25),pct=on&&total?Math.round(w/total*100):0;return `<div class="expert"><label><input type="checkbox" data-id="${esc(e.id)}" ${on?'checked':''}> ${esc(e.name)}<small>${esc(e.site||'Quelle unbekannt')}${e.accuracy!=null?` · Accuracy ${e.accuracy}`:''}${on?` · effektiv ${pct}%`:''}</small></label><input type="number" min="0" max="100" value="${w}" data-weight="${esc(e.id)}"></div>`}).join(''):'<div class="notice">Noch keine Experten geladen oder keine Treffer.</div>'}
function saveCurrentPanel(){const p=panels[activePanelId];if(!p)return;const members={};els.expertsList.querySelectorAll('[data-id]').forEach(cb=>{if(cb.checked){const id=cb.dataset.id,w=Number(els.expertsList.querySelector(`[data-weight="${CSS.escape(id)}"]`)?.value||0);if(w>0)members[id]=w}});p.members=members;persist()}

async function loadExperts(){
  if(els.loadExpertsBtn)els.loadExpertsBtn.disabled=true;
  try{
    const season=els.season.value.trim();
    let apiExperts=[];
    try{
      // FantasyPros' documented expert-directory example uses position + include_overall
      // without DRAFT/scoring filters. The previous ALL+DRAFT+HALF combination returned
      // an empty directory on the live key even while public rankings showed 160+ experts.
      const mergedApi=new Map();
      for(const pos of ['QB','RB','WR','TE']){
        try{
          const data=await proxyCall(`/nfl/${season}/rankings/experts?position=${pos}&include_overall=true`);
          for(const e of extractExperts(data))mergedApi.set(String(e.id),e);
        }catch{}
      }
      apiExperts=[...mergedApi.values()];
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
        apiId:e.apiId?String(e.apiId):null,
        directPublic:!!e.directPublic,
        comparisonPublic:!!e.comparisonPublic
      });
    }
    for(const e of apiExperts){
      const key=norm(e.name),prev=merged.get(key)||{};
      merged.set(key,{...prev,...e,id:String(e.id),apiId:String(e.id)});
    }

    // Every expert referenced by an active model must remain addressable even when the
    // FantasyPros directory omits that name. Source adapters resolve the ranking itself;
    // directory presence must never decide whether a configured expert exists.
    const configuredNames=new Set([
      ...Object.values(PRESETS).flatMap(p=>p.list.map(([name])=>name)),
      ...Object.values(EXPERT_V4_BLUEPRINT).flatMap(x=>x.experts),
      EXPERT_V5_BLUEPRINT.add
    ]);
    for(const name of configuredNames){
      const key=norm(name);
      if(!merged.has(key))merged.set(key,{id:`pub:${slugifyExpert(name)}`,name,site:'',accuracy:null,publicSlug:slugifyExpert(name),virtual:true});
    }

    experts=[...merged.values()].sort((a,b)=>(b.accuracy??-999)-(a.accuracy??-999)||a.name.localeCompare(b.name));
    if(!experts.length)throw new Error('Keine Experten erkannt.');
    const expertProfileBeforeReload=currentExpertProfile();
    applyPreset();
    ensureExpertV2Panels();ensureExpertV3Panels();
    if(EXPERT_PROFILE_IDS[expertProfileBeforeReload])positionPanels={...EXPERT_PROFILE_IDS[expertProfileBeforeReload]};
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
async function loadExpertRanks(expertId,{force=false}={}){
  const cache=rankCache[expertId];
  if(!force&&cache&&cache.schemaVersion>=13&&cache.season===els.season.value&&cache.scoring===els.scoring.value&&cache.verifiedIndividual&&Object.keys(cache.ranks||{}).length&&Date.now()-cache.updated<12*3600e3)return cache;

  const expert=experts.find(e=>String(e.id)===String(expertId));
  if(!expert)throw new Error(`Experte ${expertId} nicht gefunden.`);

  try{
    let data;
    try{data=await fetchMultiSourceExpertRanking(expert)}
    catch(primaryError){
      if(norm(expert.name)!==norm('Sean Koerner'))throw primaryError;
      const refs=['Pat Fitzmaurice','Justin Boone','Dalton Del Don','Nick Mariano'].map(findExpert).filter(Boolean);
      let recovered=null,last=primaryError;
      for(const ref of refs){try{recovered=await fetchExpertOverallPairwise(expert,ref);if(recovered?.rows?.length>=80)break}catch(e){last=e}}
      if(!recovered?.rows?.length)throw last;
      data={players:recovered.rows,source:'FantasyPros API pairwise exact inversion',sourceUrl:'',updated:new Date().toISOString(),confidence:'pairwise-verified',sourceContextVerified:true,sourceSeason:els.season.value,sourceScoring:els.scoring.value,coverage:1,exactCount:recovered.rows.length,reconstructedCount:0,crosscheck:recovered.crosscheck};
    }
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
    // A successful source acquisition remains valid in memory even when the browser cannot
    // persist it. Quota pressure is a storage concern, never a source-verification failure.
    rankCache[expertId]=result;
    const persisted=persistExpertRankCache(expertId,result);
    if(!persisted.ok)result.persistenceWarning='Browser-Speicher voll; Ranking nur für diese Sitzung gehalten.';
    else if(persisted.recovered)result.persistenceRecovered=true;
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
function expertDeltaSignature(cache){
  return Object.values(cache?.ranks||{})
    .filter(x=>Number.isFinite(x.rank))
    .sort((a,b)=>a.rank-b.rank||norm(a.name).localeCompare(norm(b.name)))
    .map(x=>`${norm(x.name)}:${x.pos||''}:${x.rank}:${Number.isFinite(Number(x.posRank))?Number(x.posRank):''}`)
    .join('|');
}
function draftDayExpertDateKey(){
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
}
function draftDayV4ExpertEntries(){
  const names=[...new Set(Object.values(EXPERT_V4_BLUEPRINT).flatMap(x=>x.experts))];
  return names.map(name=>({name,expert:findExpert(name)}));
}
function restoreExpertBaseline(expertId,cache){
  if(cache){
    rankCache[expertId]=cache;
    persistExpertRankCache(expertId,cache);
  }else{
    delete rankCache[expertId];
    try{localStorage.removeItem('v7_rank_'+expertId)}catch{}
  }
}
async function checkExpertDeltas(){
  if(!experts.length)await loadExperts();
  const entries=draftDayV4ExpertEntries(),day=draftDayExpertDateKey();
  if(!entries.length)throw new Error('Keine v4-Experten für Delta-Prüfung gefunden.');
  const priorAudit=store.get('v7_expertDeltaAudit',{}),
    baselineMode=priorAudit.day!==day,
    repairMode=!baselineMode&&priorAudit.complete!==true,
    retryNames=new Set(Array.isArray(priorAudit.failedNames)?priorAudit.failedNames:[]);
  const changed=[],unchanged=[],failed=[],accepted=[];
  const modeLabel=baselineMode?'Tagesbaseline':repairMode?'Baseline-Reparatur':'Delta-Prüfung';
  if(els.expertDeltaBtn){els.expertDeltaBtn.disabled=true;els.expertDeltaBtn.textContent=baselineMode?'Tagesbaseline …':repairMode?'Baseline reparieren …':'Experten-Delta …'}
  try{
    let i=0;
    for(const entry of entries){
      i++;
      if(repairMode&&!retryNames.has(entry.name)){accepted.push(entry.name);continue}
      if(!entry.expert){failed.push(entry.name+' (nicht im Expertenverzeichnis)');continue}
      const id=String(entry.expert.id),before=rankCache[id]||null,beforeSig=expertDeltaSignature(before);
      if(els.panelStatus)els.panelStatus.textContent=`${modeLabel} ${i}/${entries.length}: ${entry.name}`;
      const fresh=await loadExpertRanks(id,{force:true});
      const freshSig=expertDeltaSignature(fresh);
      const usable=!!(fresh?.verifiedIndividual&&!fresh?.staleFallback&&freshSig&&Object.keys(fresh.ranks||{}).length>=80);
      if(!usable){
        restoreExpertBaseline(id,before);
        failed.push(entry.name+(fresh?.error?` (${fresh.error})`:''));
        continue;
      }
      if(baselineMode||repairMode){
        accepted.push(entry.name);
        continue;
      }
      if(beforeSig&&freshSig===beforeSig){
        restoreExpertBaseline(id,before);
        unchanged.push(entry.name);
      }else{
        changed.push(entry.name);
      }
    }
    if(baselineMode||repairMode||changed.length){
      await loadAllRanks({skipFetch:true});
    }
    const failedNames=failed.map(x=>x.replace(/ \(.*/,'')),complete=failed.length===0;
    const priorAccepted=Array.isArray(priorAudit.accepted)?priorAudit.accepted:[];
    const baselineAccepted=[...new Set(baselineMode?accepted:[...priorAccepted,...accepted])];
    store.set('v7_expertDeltaAudit',{
      day,complete,lastChecked:Date.now(),
      baselineCreated:baselineMode?Date.now():(priorAudit.baselineCreated||null),
      accepted:(baselineMode||repairMode)?baselineAccepted:priorAccepted,
      changed,unchanged,failed,failedNames
    });
    if(els.panelStatus){
      els.panelStatus.className=failed.length?'notice warn':'notice ok';
      els.panelStatus.textContent=(baselineMode||repairMode)
        ?`Experten-Tagesbaseline ${baselineAccepted.length}/${entries.length}${failed.length?` · nicht aktualisiert: ${failed.join(', ')}`:' · vollständig'}`
        :`Experten-Delta geprüft · geändert ${changed.length}: ${changed.join(', ')||'keine'} · unverändert ${unchanged.length}${failed.length?` · Baseline beibehalten bei: ${failed.join(', ')}`:''}`;
    }
    updateStatus();
    return{baselineMode,repairMode,complete,changed,unchanged,failed,accepted:baselineAccepted};
  }finally{
    if(els.expertDeltaBtn){els.expertDeltaBtn.disabled=false;els.expertDeltaBtn.textContent='Experten-Delta prüfen'}
  }
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
async function loadAllRanks({skipFetch=false}={}){
  saveCurrentPanel();
  const selectedIds=[...new Set(Object.values(panels).flatMap(p=>Object.keys(p.members||{})))];
  const v45Names=[...new Set(Object.values(EXPERT_V4_BLUEPRINT).flatMap(x=>x.experts).concat(EXPERT_V5_BLUEPRINT.add))];
  const v45Ids=v45Names.map(findExpert).filter(Boolean).map(e=>e.id);
  const ids=[...new Set([...selectedIds,...presetCandidateIds(),...v45Ids])];
  if(!ids.length)throw new Error('Preset oder Expertenauswahl fehlt.');
  if(els.loadAllRanksBtn)els.loadAllRanksBtn.disabled=true;
  const skipped=[];
  const previousPanelRanks=panelRanks;
  try{
    let i=0;
    for(const id of ids){
      i++;
      els.panelStatus.textContent=`${skipFetch?'Verarbeite':'Lade'} ${i}/${ids.length}: ${experts.find(e=>e.id===id)?.name||id}`;
      const c=skipFetch?rankCache[id]:await loadExpertRanks(id);
      if(!c)continue;
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
    // Panel ranks are derived deterministically from the verified per-expert caches. Keeping a second full copy
    // in localStorage caused quota exhaustion on Android. Persist only the compact source caches and rebuild panels in memory.
    panelRanks=candidate;
    // Sealed Expert-v2 panels are not derived from live FantasyPros members. Rehydrate them
    // after every live-rank rebuild so a refresh cannot silently erase the selected v2 boards.
    if(!ensureExpertV2Panels())throw new Error('Expert-v2 Board konnte nach Ranking-Refresh nicht wiederhergestellt werden.');
    if(!ensureExpertV3Panels())throw new Error('Expert-v3 Board konnte nach Ranking-Refresh nicht wiederhergestellt werden.');
    const v4Ready=ensureExpertV4Panels(),v5Ready=ensureExpertV5Panels();
    if(v4Ready){const tierStatus=await loadV4ConsensusTiers();skipped.push(...tierStatus.map(x=>'v4 Tier '+x));}
    else {v4ConsensusTierCache={};store.set('v4137_v4ConsensusTiers',{});}
    syncAnalysisExpertSelector();
    if(!v4Ready)skipped.push('Expert-v4 bleibt gesperrt: mindestens eine verifizierte Individualquelle/Position unvollständig.');
    if(!v5Ready)skipped.push('Expert-v5 bleibt gesperrt: Koerner/v3 Coverage nicht vollständig verifiziert.');
    store.set('v7_lastRankingUpdate',Date.now());
    try{localStorage.removeItem('v7_panelRanks');localStorage.removeItem('v7_rankCache')}catch{}
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
  const activeHealth=activePanelHealthState();
  const healthText=activePanelHealthSummaryText();
  els.panelSummary.innerHTML=`<div class="panel-summary-card">
    <b>Aktives Panel: ${esc(active)}</b>
    <div class="panel-summary-item"><span>Experten verfügbar</span><strong>${expertCount}</strong></div>
    <div class="panel-summary-item"><span>Aktive Panel-Health</span><strong class="${activeHealth.degraded?'status-warn':'status-ok'}">${esc(healthText)}</strong></div>
    <div class="panel-summary-grid">${posItems}</div>
  </div>`;
}

function updateStatus(){const rankTime=Number(store.get('v7_lastRankingUpdate',0)),hours=rankTime?(Date.now()-rankTime)/3600000:null;const hasKey=Boolean(els.apiKey.value.trim());if(els.apiQuickStatus){els.apiQuickStatus.className=`notice ${hasKey?'ok':'bad'}`;els.apiQuickStatus.textContent=hasKey?'FantasyPros API-Key gespeichert. „Alles aktualisieren“ lädt Experten, Preset und Rankings.':'FantasyPros API-Key fehlt. Unter „Erweitert“ einmalig eintragen.';}els.onlineState.textContent=navigator.onLine?'Online':'Offline';els.onlineState.className=navigator.onLine?'ok':'bad';els.rankingAge.textContent=hours==null?'Wartet auf Draft':hours<1?`${Math.max(1,Math.round(hours*60))} Min.`:hours<24?`${Math.round(hours)} Std.`:`${Math.floor(hours/24)} Tag(e)`;els.rankingAge.className=hours==null?'bad':hours>24?'warn':'ok';els.adpCount.textContent=Object.keys(adp).length?String(Object.keys(adp).length):'Wartet auf Draft';els.adpCount.className=Object.keys(adp).length?'ok':'bad';const ready=experts.length&&Object.keys(panelRanks).length&&Object.keys(adp).length;els.qualityMini.textContent=ready?'Bereit':'Unvollständig';els.qualityMini.className=ready?'ok':'warn';const issues=[];if(!els.apiKey.value.trim())issues.push('API-Key fehlt');if(!experts.length)issues.push('Experten fehlen');if(!Object.keys(panelRanks).length)issues.push('Panel-Rankings fehlen');if(!Object.keys(adp).length)issues.push('Sleeper-ADP fehlt');const poolHealth=desiredExpertPoolHealth();const activeHealth=activePanelHealthState();const healthDegraded=activeHealth.degraded;els.qualityStatus.className=`notice ${issues.length||healthDegraded?'warn':'ok'}`;els.qualityStatus.textContent=issues.length?`Noch nicht draftbereit: ${issues.join(' · ')}`:`Draftbereit${healthDegraded?' (aktive Panels degradiert)':''}: ${experts.length} Experten · ${activePanelHealthSummaryText()} · ${Object.keys(panelRanks).length} Panels · ${Object.keys(adp).length} Sleeper-ADPs.`;if(Object.keys(adp).length){els.adpStatus.className='notice ok';els.adpStatus.textContent=`${Object.keys(adp).length} Sleeper-ADPs aktiv · Quelle: ${adpMeta.source||'verifizierter Import'}.`;if(els.adpHelper)els.adpHelper.textContent=`Sleeper-ADP aktiv (${Object.keys(adp).length}). Reach und Return nutzen diese Marktwerte zusätzlich zum Expertenpanel.`}else{els.adpStatus.className='notice warn';els.adpStatus.textContent='Keine verifizierte Sleeper-ADP vorhanden. Reach und Return werden konservativ behandelt.';if(els.adpHelper)els.adpHelper.textContent='Keine verifizierte Sleeper-ADP vorhanden. Das Expertenpanel bleibt Baseline; Reach und Return werden bewusst konservativ behandelt.'}}

const S='https://api.sleeper.app/v1';
const draftId=v=>(String(v||'').match(/(\d{10,})/)||[])[1]||String(v||'').trim();
async function jf(url,label,timeoutMs=6500){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{const r=await fetch(url,{cache:'no-store',signal:controller.signal});if(!r.ok)throw new Error(`${label}: HTTP ${r.status}`);return await r.json()}
  catch(e){if(e?.name==='AbortError')throw new Error(`${label}: Timeout nach ${Math.round(timeoutMs/1000)}s`);throw e}
  finally{clearTimeout(timer)}
}
async function fetchDraft(id){const bust=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const[draft,picks,players]=await Promise.all([jf(`${S}/draft/${id}?_=${bust}`,'Draft'),jf(`${S}/draft/${id}/picks?_=${bust}`,'Picks'),jf(`${S}/players/nfl?_=${bust}`,'Spieler',9000)]);return{draft,picks,players}}
async function bootstrapSeasonWorkspace(){
  if(!navigator.onLine)return;
  const id=LIVE_DRAFT_ID_2026;
  try{
    const {draft,picks,players}=await fetchDraft(id),teams=Number(draft.settings?.teams||10),rounds=Number(draft.settings?.rounds||15),total=teams*rounds;
    if(String(draft.status||'').toLowerCase()!=='complete'&&picks.length<total)return;
    const slot=Number(els.slot.value||9),mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no);
    const season=await fetchSeasonLeagueState({...draft,draft_id:id}),rows=seasonRosterRows(season,players,mine),available=seasonAvailablePlayers(season,players),availableDST=seasonAvailableSpecialTeams(season,players,'DST'),availableK=seasonAvailableSpecialTeams(season,players,'K');
    if(!rows)throw new Error(season?.reason||'MY_ROSTER_UNRESOLVED');
    const counts=postDraftRosterCounts(rows);
    els.rosterStatus.className='notice ok';els.rosterStatus.textContent='LIVE Sleeper-Kader · '+rows.length+' Spieler · Source of Truth: League-State · Reserve/IR '+rows.filter(x=>x.seasonStatus==='RESERVE').length+' · Auto-Sync beim Start.';
    els.rosterSummary.innerHTML=Object.entries(counts).filter(([,n])=>n).map(([pos,n])=>'<div class="summary-item"><b>'+n+'</b><span>'+pos+'</span></div>').join('');
    els.rosterList.innerHTML=seasonLineupHtml(rows,season);
    renderRosterBenchAudit(rows,players,total,true);renderRosterFaAudit(rows,available||[],true);
    renderWaiverWorkspace(true);renderSeasonActionBoard(true);
    lastDraftContext={id,current:total,players,picks,mine,teams,rankedAvailable:available||[],availableDST,availableK,draftComplete:true,season,seasonRows:rows,specialTeamsModel:SEASON_SPECIAL_TEAMS_MODEL};
    localStorage.setItem('v118_seasonBootstrapAt',String(Date.now()));
  }catch(e){
    if(els.rosterStatus){els.rosterStatus.className='notice warn';els.rosterStatus.textContent='Season Auto-Sync FAIL-CLOSED · '+esc(e?.message||String(e))+' · keine FA-Aktion freigegeben.';}
  }
}
async function fetchDraftFresh(id){
  const first=await fetchDraft(id);
  // Die Kontrollabfrage darf nicht erneut den ~NFL-Spielerpool laden: genau dieser doppelte
  // Großrequest konnte den Snapshot-Pfad unnötig blockieren. Nur Draft+Picks werden verifiziert.
  await new Promise(r=>setTimeout(r,220));
  try{
    const bust=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const[draft,picks]=await Promise.all([jf(`${S}/draft/${id}?_=${bust}`,'Draft-Kontrolle',3500),jf(`${S}/draft/${id}/picks?_=${bust}`,'Picks-Kontrolle',3500)]);
    return (picks?.length||0)>=(first.picks?.length||0)?{draft,picks,players:first.players}:first;
  }catch{return first}
}

function pinfo(id,m,players){const p=players[id]||{};return{name:m?.first_name&&m?.last_name?`${m.first_name} ${m.last_name}`:(p.full_name||m?.player_name||id),pos:String(m?.position||p.position||'?').toUpperCase(),team:String(m?.team||p.team||'FA').toUpperCase(),searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null,yearsExp:Number.isFinite(Number(p.years_exp))?Number(p.years_exp):null}}
function draftSlotAtPick(p,teams){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1;return r%2?w:teams-w+1}
function nextOwn(current,teams,slot,total){for(let p=current;p<=total;p++){if(draftSlotAtPick(p,teams)===slot)return p}return null}
function panelHasVerifiedExperts(id){
  return !!id && Object.keys(panels[id]?.members||{}).some(eid=>rankCache[eid]?.verifiedIndividual&&!rankCache[eid]?.duplicateOf);
}
function panelSelectable(id){
  if(!id||!Object.keys(panelRanks[id]||{}).length)return false;
  if(/^expert-v[2345]-(qb|rb|wr|te)$/.test(id))return true;
  return panelHasVerifiedExperts(id);
}
function panelFor(pos){
  const preferred=positionPanels[pos];
  if(panelSelectable(preferred))return preferred;
  if(panelSelectable(activePanelId))return activePanelId;
  return Object.keys(panelRanks).find(panelSelectable)||preferred||activePanelId;
}
function sanitizeExpertPanelRow(id,row){
  if(!row)return null;
  const weights=panels[id]?.weights||{};
  const intended=Object.keys(weights).filter(name=>Number(weights[name])>0);
  if(!intended.length||!Array.isArray(row.individual))return row;
  const allowed=new Set(intended.map(norm));
  const vals=row.individual.filter(x=>x?.expertName&&allowed.has(norm(x.expertName))&&Number.isFinite(Number(x.rank)));
  if(!vals.length)return row;
  const present=new Set(vals.map(x=>norm(x.expertName))),missing=intended.filter(name=>!present.has(norm(name)));
  const raw=vals.map(x=>({...x,effectiveWeight:Number(weights[x.expertName]??x.effectiveWeight??0)})).filter(x=>x.effectiveWeight>0);
  const sw=raw.reduce((z,x)=>z+x.effectiveWeight,0);
  if(!sw)return {...row,individual:vals,missingExperts:missing,coverageStatus:missing.length?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE'};
  const rank=raw.reduce((z,x)=>z+Number(x.rank)*x.effectiveWeight,0)/sw;
  const posVals=raw.filter(x=>Number.isFinite(Number(x.posRank))&&Number(x.posRank)>0);
  const posSw=posVals.reduce((z,x)=>z+x.effectiveWeight,0);
  const posRank=posSw?posVals.reduce((z,x)=>z+Number(x.posRank)*x.effectiveWeight,0)/posSw:row.posRank;
  const variance=raw.reduce((z,x)=>z+x.effectiveWeight*(Number(x.rank)-rank)**2,0)/sw;
  return {...row,rank,mean:rank,overallRank:rank,posRank,sd:Math.sqrt(variance),n:raw.length,intendedN:intended.length,coverage:raw.length/intended.length,coverageStatus:missing.length?'INCOMPLETE_RIGHT_CENSORED_OR_SOURCE_UNKNOWN':'COMPLETE',missingExperts:missing,individual:raw.sort((a,b)=>Number(a.rank)-Number(b.rank))};
}
function rankFor(name,pos){const id=panelFor(pos),r=panelRanks[id]?.[norm(name)],clean=sanitizeExpertPanelRow(id,r);return clean?{...clean,panel:panels[id]?.name||id,panelId:id}:null}
function verifiedIndividualEntries(r){
  const list=Array.isArray(r?.individual)?r.individual:[];
  const panel=panels[r?.panelId]||{};
  // Embedded Expert-v2/v3 boards are already frozen, audited source artifacts. Their
  // individual rows do not depend on the live FantasyPros rankCache verification flags.
  // Live panels still require the per-expert verifiedIndividual flag.
  return panel.shadow
    ? list.filter(v=>v?.expertName&&Number.isFinite(Number(v.rank)))
    : list.filter(v=>rankCache[v?.expertId]?.verifiedIndividual&&!rankCache[v?.expertId]?.duplicateOf);
}
function adpFor(name){const v=Number(adp[norm(name)]);return Number.isFinite(v)&&v>0?v:NaN}
function agreement(sd,n){if(!n||n<2)return'Einzelmeinung';if(sd<=3)return'Sehr hoher Konsens';if(sd<=7)return'Hoher Konsens';if(sd<=12)return'Umstritten';return'Stark umstritten'}
function returnChance(next,a){if(!Number.isFinite(next)||!Number.isFinite(a))return null;/* P(Spieler ist am Folgepick noch da): ADP als Marktmittel, bewusst enger als die alte Kurve. */return clamp(1/(1+Math.exp((next-a)/4)),.01,.99)}
function rosterState(mine,players,current=1){
  const c={QB:0,RB:0,WR:0,TE:0},byes={QB:{},RB:{},WR:{},TE:{}},irEligible=mine.filter(pick=>{const st=String(pinfo(String(pick.player_id),pick.metadata,players).injury||'').toUpperCase();return st==='PUP'||st==='IR'}).length;
  for(const pick of mine){const p=pinfo(String(pick.player_id),pick.metadata,players);if(c[p.pos]!=null){c[p.pos]++;if(p.bye)byes[p.pos][p.bye]=(byes[p.pos][p.bye]||0)+1}}
  // v11: Replacement-Level statt bloßer leerer Startposition. In 10-Team/1QB ist QB1
  // aufschiebbar, QB2 fast immer verschwendeter Bench-Value. TE1 ist sogar bis nach dem
  // Draft aufschiebbar; TE2 wird ähnlich hart wie QB2 behandelt.
  const qbNeed=c.QB===0?(current>=125?13:current>=95?9:current>=65?4:1):(current>=141?-2:current>=121?-10:-24);
  const teNeed=c.TE===0?(current>=130?1.5:current>=80?1:0.5):(current>=141?-4:current>=121?-12:-22);
  const rbNeed=c.RB<2?9:c.RB<4?6:c.RB<6?3.5:c.RB<8?1.5:0;
  const wrNeed=c.WR<3?8:c.WR<5?4:c.WR<6?1.5:c.WR<7?0:-2;
  return{counts:c,need:{QB:qbNeed,RB:rbNeed,WR:wrNeed,TE:teNeed},byes,irEligible,irSlots:1};
}
function rosterExceptionPenalty(pos,state,current,rank,adp){
  if(pos==='QB'&&state.counts.QB>=1){
    // Ausnahme nur bei absurd gefallenem Elite-Value; normale QB12-20 sollen nie RB/WR-Lottery-Tickets verdrängen.
    const elite=rank<=45&&Number.isFinite(adp)&&current-adp>=35;
    if(current>=141)return elite?0:-8;
    if(current>=121)return elite?-4:-24;
    return elite?-8:-42;
  }
  if(pos==='TE'&&state.counts.TE>=1){
    const elite=rank<=35&&Number.isFinite(adp)&&current-adp>=30;
    if(current>=141)return elite?0:-10;
    if(current>=121)return elite?-5:-26;
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
  if(p.pos==='WR'&&state.counts.WR>=6)b -= state.counts.WR>=7?[0,1.5,3,4.5][stage]:[0,.75,1.5,2.5][stage];
  return b;
}
function strategyStatusText(mode){
  return mode==='balanced'
    ? 'BALANCED / ANTI-REACH: eingefrorene Referenzstrategie. Panel/ADP und Warten bleiben auch spät stark gewichtet.'
    : 'PROGRESSIVE UPSIDE: Standard. Ab Runde 9 steigt Ceiling-Gewichtung graduell; späte Reaches werden bei plausiblen Breakout-Pfaden toleranter.';
}
function injuryStashAdjustment(p,current,state){
  // Liga: ein IR-Slot; PUP ist nach den verifizierten aktuellen Einstellungen IR-eligible.
  // Ein freier Slot erzeugt keinen künstlichen Ceiling-Bonus, reduziert aber im Endgame die
  // Opportunity Cost und darf als Tiebreaker wirken, weil direkt nach dem Draft ein FA nachrücken kann.
  const st=String(p.injury||'').toUpperCase(),freeIr=(state.irEligible||0)<(state.irSlots||0);
  if(st==='PUP')return freeIr?(current>=121?2.5:0):-4.0;
  if(st==='IR')return freeIr?-6:-12; // IR bleibt vorsichtig, bis Return/season-ending extern geklärt ist.
  return 0;
}

function marginalRosterUtility(p,current,state){
  // Soft roster economics, never a positional cap. The relevant comparison is marginal
  // championship option value: after WR6, another WR must clear an increasingly meaningful
  // hurdle versus RB contingency/upside, while exceptional panel/value edges remain draftable.
  const c=state.counts||{},n=Number(c[p.pos]||0);let x=0;
  if(p.pos==='RB'&&current>=81){
    if(n>=7)x-=3.5;
    else if(n>=6)x-=2;
    else if(current>=121&&n<=4)x+=3.5;
    else if(current>=101&&n<=4)x+=2;
    else if(n<=3)x+=1;
  }
  if(p.pos==='WR'&&current>=81){
    const rb=Number(c.RB||0);
    if(current>=121&&n>=8)x-=20;
    else if(current>=121&&n>=7)x-=17;
    else if(current>=121&&n>=6)x-=14;
    else if(current>=101&&n>=8)x-=12;
    else if(current>=101&&n>=7)x-=9;
    else if(current>=101&&n>=6)x-=6;
    else if(n>=8)x-=8;
    else if(n>=7)x-=6;
    else if(n>=6)x-=4;
    else if(n<=4)x+=.5;
    // Portfolio imbalance matters independently of raw WR count. It remains a soft
    // opportunity-cost term, never a cap: exceptional WR value may still overcome it.
    if(n>=6&&rb<=4)x-=current>=121?3:1.5;
    // Repeated strict-Coach mocks reached WR9 while carrying only two or three RBs.
    // Once WR7+ and RB<=3 coexist, the next WR must clear an additional meaningful
    // championship-utility hurdle instead of winning on panel rank alone.
    if(n>=7&&rb<=3)x-=6;
  }
  if(p.pos==='QB'&&n===0&&current>=130)x+=7;
  if(p.pos==='TE'&&n===0&&current>=120)x+=4;
  return x;
}


// Opponent Model v1. Evidence-weighted: only tendencies supported by historical review/user observations.
// Candidate-specific traits stay deliberately modest; they modify return pressure, never override the panel.
const MANAGER_PROFILES={
  basti:{label:'Basti',pos:{WR:.10,RB:.05},confidence:'mittel-hoch',history:{years:8,firstQB:6.1,firstTE:7.8,recentQB:7.0,recentTE:8.7},traits:{rookieRB:.18,bears:.06,lateReach:.12,bearsTargets:.08}},
  michael:{label:'Michael',pos:{TE:-.08,RB:.03,WR:.06},confidence:'hoch',history:{years:6,firstQB:6.4,firstTE:8.0,recentQB:7.7,recentTE:12.0},traits:{knownNames:.10,rookie:-.10}},
  'pascal voerde':{label:'Pascal / Voerde',pos:{},confidence:'mittel',history:{years:9,firstQB:5.4,firstTE:5.3,recentQB:7.0,recentTE:3.7},traits:{unconventional:.05}},
  'dutch marc':{label:'Dutch-Marc',pos:{QB:.06,TE:.06},confidence:'mittel-hoch',history:{years:8,firstQB:5.1,firstTE:4.5,recentQB:5.3,recentTE:5.0},traits:{}},
  'pascal geldern':{label:'Pascal / Gelderner',pos:{WR:.05},confidence:'mittel',history:{years:2,firstQB:3.0,firstTE:4.5,recentQB:3.0,recentTE:4.5},traits:{waitQBTE:.07,wrEarly:.05,unconventional:.05}},
  thomas:{label:'Thomas',pos:{QB:.03,TE:.03},confidence:'mittel',traits:{}},
  giuliano:{label:'Giuliano',pos:{QB:.04,TE:.04},confidence:'mittel',history:{years:6,firstQB:5.7,firstTE:5.3,recentQB:6.0,recentTE:5.5},traits:{}},
  // 2021 all-rookie was a confirmed one-season theme and is intentionally excluded from normal Björn tendencies.
  bjorn:{label:'Björn',pos:{RB:.10},confidence:'mittel-hoch',history:{years:7,firstQB:8.2,firstTE:8.4,recentQB:9.0,recentTE:9.0,excludeTheme2021:true},traits:{recentEarlyRB:.08}},
  bjoern:{label:'Björn',pos:{RB:.10},confidence:'mittel-hoch',history:{years:7,firstQB:8.2,firstTE:8.4,recentQB:9.0,recentTE:9.0,excludeTheme2021:true},traits:{recentEarlyRB:.08}},
  'dusseldorf marc':{label:'Düsseldorf-Marc',pos:{},confidence:'niedrig',traits:{}}
};
const MANAGER_PROFILE_DATA={"generated":"2026-08-14","leaguePhaseShares":{"early":{"DEF":0,"K":0,"QB":0.0787,"RB":0.4618,"TE":0.0657,"WR":0.3938},"end":{"DEF":0.1347,"K":0.1281,"QB":0.1043,"RB":0.2084,"TE":0.0888,"WR":0.3357},"late":{"DEF":0.0898,"K":0.0626,"QB":0.1249,"RB":0.2627,"TE":0.1254,"WR":0.3347},"mid1":{"DEF":0.0013,"K":0.0007,"QB":0.1273,"RB":0.2784,"TE":0.1364,"WR":0.4559},"mid2":{"DEF":0.0731,"K":0.0752,"QB":0.0963,"RB":0.2616,"TE":0.1014,"WR":0.3924}},"profiles":{"Basti":{"excludedYears":[],"identity":"Bastian","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.0648,"RB":0.3657,"TE":0.216,"WR":0.3536},"end":{"DEF":0.144,"K":0.2242,"QB":0.0238,"RB":0.3335,"TE":0.0064,"WR":0.2682},"late":{"DEF":0,"K":0,"QB":0.1423,"RB":0.3593,"TE":0.1958,"WR":0.3026},"mid1":{"DEF":0,"K":0,"QB":0.0731,"RB":0.2195,"TE":0.0746,"WR":0.6328},"mid2":{"DEF":0,"K":0,"QB":0.097,"RB":0.0949,"TE":0.0367,"WR":0.7713}},"positions":{"DEF":{"finalCount":0.48,"firstRound":14.49,"firstRoundSd":1.17,"recentTaken":0.481,"takenRate":0.556},"K":{"finalCount":0.75,"firstRound":14.67,"firstRoundSd":0.66,"recentTaken":0.749,"takenRate":0.667},"QB":{"finalCount":1.21,"firstRound":7.92,"firstRoundSd":3.4,"recentTaken":1,"takenRate":1},"RB":{"finalCount":4.23,"firstRound":1.7,"firstRoundSd":0.93,"recentTaken":1,"takenRate":1},"TE":{"finalCount":1.59,"firstRound":6.18,"firstRoundSd":3.67,"recentTaken":1,"takenRate":1},"WR":{"finalCount":7.08,"firstRound":2.48,"firstRoundSd":1.49,"recentTaken":1,"takenRate":1}},"sampleYears":9,"years":[2017,2018,2019,2020,2021,2022,2023,2024,2025]},"Bjoern":{"excludedYears":[2021,2023],"identity":"Bjoern","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.0179,"RB":0.671,"TE":0,"WR":0.3112},"end":{"DEF":0.1483,"K":0.0514,"QB":0.1376,"RB":0.1504,"TE":0.1715,"WR":0.3408},"late":{"DEF":0.1647,"K":0,"QB":0.1495,"RB":0.1231,"TE":0.1283,"WR":0.4345},"mid1":{"DEF":0,"K":0,"QB":0,"RB":0.194,"TE":0.1195,"WR":0.6865},"mid2":{"DEF":0,"K":0.0179,"QB":0.1375,"RB":0.3333,"TE":0.1283,"WR":0.383}},"positions":{"DEF":{"finalCount":0.99,"firstRound":13.34,"firstRoundSd":1.49,"recentTaken":0.961,"takenRate":0.857},"K":{"finalCount":0.23,"firstRound":13.73,"firstRoundSd":3.78,"recentTaken":0.225,"takenRate":0.429},"QB":{"finalCount":1.37,"firstRound":9.53,"firstRoundSd":2.9,"recentTaken":0.961,"takenRate":0.857},"RB":{"finalCount":4.47,"firstRound":2.16,"firstRoundSd":1.77,"recentTaken":1,"takenRate":1},"TE":{"finalCount":1.7,"firstRound":8.66,"firstRoundSd":3.84,"recentTaken":1,"takenRate":1},"WR":{"finalCount":6.58,"firstRound":3.04,"firstRoundSd":1.32,"recentTaken":1,"takenRate":1}},"sampleYears":7,"years":[2017,2018,2019,2020,2022,2024,2025]},"Dutch Marc":{"excludedYears":[],"identity":"Marc_Dutch","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.0985,"RB":0.4744,"TE":0.0455,"WR":0.3816},"end":{"DEF":0.187,"K":0.2324,"QB":0.0089,"RB":0.1602,"TE":0.2301,"WR":0.1813},"late":{"DEF":0.1745,"K":0.0719,"QB":0.2113,"RB":0.2572,"TE":0,"WR":0.2851},"mid1":{"DEF":0,"K":0,"QB":0.2387,"RB":0.2021,"TE":0.2741,"WR":0.2851},"mid2":{"DEF":0.017,"K":0.0236,"QB":0.0099,"RB":0.4438,"TE":0.0909,"WR":0.4148}},"positions":{"DEF":{"finalCount":1.2,"firstRound":11.8,"firstRoundSd":1.42,"recentTaken":1,"takenRate":1},"K":{"finalCount":1.06,"firstRound":13.14,"firstRoundSd":1.41,"recentTaken":1,"takenRate":1},"QB":{"finalCount":1.7,"firstRound":4.43,"firstRoundSd":1.13,"recentTaken":1,"takenRate":1},"RB":{"finalCount":4.67,"firstRound":1.81,"firstRoundSd":0.68,"recentTaken":1,"takenRate":1},"TE":{"finalCount":2,"firstRound":4.52,"firstRoundSd":1.16,"recentTaken":1,"takenRate":1},"WR":{"finalCount":4.71,"firstRound":1.46,"firstRoundSd":0.73,"recentTaken":1,"takenRate":1}},"sampleYears":9,"years":[2017,2018,2019,2020,2021,2022,2023,2024,2025]},"Giuliano":{"excludedYears":[],"identity":"Giuliano","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.0158,"RB":0.493,"TE":0.0816,"WR":0.4096},"end":{"DEF":0.2128,"K":0.1982,"QB":0.2194,"RB":0.1211,"TE":0.0632,"WR":0.1853},"late":{"DEF":0.1121,"K":0.0816,"QB":0.0377,"RB":0.2261,"TE":0.214,"WR":0.3285},"mid1":{"DEF":0,"K":0,"QB":0.1404,"RB":0.3333,"TE":0.0638,"WR":0.4625},"mid2":{"DEF":0.0491,"K":0.0377,"QB":0.1771,"RB":0.1438,"TE":0.3283,"WR":0.2639}},"positions":{"DEF":{"finalCount":1.17,"firstRound":12.67,"firstRoundSd":2.13,"recentTaken":1,"takenRate":1},"K":{"finalCount":1,"firstRound":13.17,"firstRoundSd":2.36,"recentTaken":1,"takenRate":1},"QB":{"finalCount":1.82,"firstRound":6.19,"firstRoundSd":1.8,"recentTaken":1,"takenRate":1},"RB":{"finalCount":3.98,"firstRound":1.38,"firstRoundSd":0.61,"recentTaken":1,"takenRate":1},"TE":{"finalCount":2.27,"firstRound":5.73,"firstRoundSd":1.67,"recentTaken":1,"takenRate":1},"WR":{"finalCount":4.99,"firstRound":1.92,"firstRoundSd":0.91,"recentTaken":1,"takenRate":1}},"sampleYears":7,"years":[2018,2019,2020,2021,2023,2024,2025]},"Marc Düsseldorf":{"excludedYears":[],"identity":"Marc_Duesseldorf","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.3349,"RB":0.1433,"TE":0.0379,"WR":0.4839},"end":{"DEF":0.1777,"K":0.0831,"QB":0.0348,"RB":0,"TE":0.1178,"WR":0.5866},"late":{"DEF":0.0379,"K":0,"QB":0.1543,"RB":0.2427,"TE":0.2954,"WR":0.2696},"mid1":{"DEF":0,"K":0,"QB":0.1395,"RB":0.3333,"TE":0,"WR":0.5271},"mid2":{"DEF":0.1016,"K":0.1016,"QB":0.0527,"RB":0.4613,"TE":0.1543,"WR":0.1285}},"positions":{"DEF":{"finalCount":1,"firstRound":12.51,"firstRoundSd":2.54,"recentTaken":1,"takenRate":1},"K":{"finalCount":0.58,"firstRound":11.3,"firstRoundSd":3.49,"recentTaken":0.577,"takenRate":0.75},"QB":{"finalCount":2.16,"firstRound":3.45,"firstRoundSd":1.8,"recentTaken":1,"takenRate":1},"RB":{"finalCount":3.54,"firstRound":4.45,"firstRoundSd":1.92,"recentTaken":1,"takenRate":1},"TE":{"finalCount":1.85,"firstRound":8.01,"firstRoundSd":3.14,"recentTaken":1,"takenRate":1},"WR":{"finalCount":6.15,"firstRound":1.86,"firstRoundSd":1.5,"recentTaken":1,"takenRate":1}},"sampleYears":4,"years":[2021,2022,2024,2025]},"Michael":{"excludedYears":[],"identity":"Michael_Polk","phaseShares":{"early":{"DEF":0,"K":0,"QB":0,"RB":0.3765,"TE":0,"WR":0.6235},"end":{"DEF":0.2204,"K":0.1644,"QB":0.0803,"RB":0.1115,"TE":0.0655,"WR":0.3578},"late":{"DEF":0,"K":0,"QB":0.06,"RB":0.0911,"TE":0.3022,"WR":0.5467},"mid1":{"DEF":0,"K":0,"QB":0.1576,"RB":0.3225,"TE":0.0311,"WR":0.4887},"mid2":{"DEF":0,"K":0,"QB":0.1157,"RB":0.3752,"TE":0,"WR":0.5091}},"positions":{"DEF":{"finalCount":0.75,"firstRound":15.54,"firstRoundSd":0.5,"recentTaken":0.75,"takenRate":0.8},"K":{"finalCount":0.56,"firstRound":15,"firstRoundSd":0,"recentTaken":0.56,"takenRate":0.6},"QB":{"finalCount":1.27,"firstRound":6.75,"firstRoundSd":2.3,"recentTaken":1,"takenRate":1},"RB":{"finalCount":3.88,"firstRound":1.96,"firstRoundSd":0.63,"recentTaken":1,"takenRate":1},"TE":{"finalCount":1.22,"firstRound":9.78,"firstRoundSd":1.59,"recentTaken":1,"takenRate":1},"WR":{"finalCount":7.72,"firstRound":1.22,"firstRoundSd":0.42,"recentTaken":1,"takenRate":1}},"sampleYears":6,"years":[2020,2021,2022,2023,2024,2025]},"Pascal Gelderner":{"excludedYears":[],"identity":"Pascal_Gelderner","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.1844,"RB":0.3333,"TE":0.0772,"WR":0.4051},"end":{"DEF":0.1489,"K":0,"QB":0.3333,"RB":0.1489,"TE":0,"WR":0.3688},"late":{"DEF":0.1072,"K":0.2261,"QB":0,"RB":0.1072,"TE":0.3333,"WR":0.2261},"mid1":{"DEF":0,"K":0,"QB":0.1489,"RB":0.1844,"TE":0.2561,"WR":0.4105},"mid2":{"DEF":0.0772,"K":0.1072,"QB":0,"RB":0.4051,"TE":0,"WR":0.4105}},"positions":{"DEF":{"finalCount":1,"firstRound":10.88,"firstRoundSd":2.04,"recentTaken":1,"takenRate":1},"K":{"finalCount":1,"firstRound":10.25,"firstRoundSd":1.74,"recentTaken":1,"takenRate":1},"QB":{"finalCount":2,"firstRound":3.45,"firstRoundSd":0.5,"recentTaken":1,"takenRate":1},"RB":{"finalCount":3.54,"firstRound":2.13,"firstRoundSd":0.87,"recentTaken":1,"takenRate":1},"TE":{"finalCount":2,"firstRound":4.84,"firstRoundSd":2.11,"recentTaken":1,"takenRate":1},"WR":{"finalCount":5.46,"firstRound":2.02,"firstRoundSd":1.17,"recentTaken":1,"takenRate":1}},"sampleYears":3,"years":[2023,2024,2025]},"Pascal Voerde":{"excludedYears":[],"identity":"Pascal_Voerde","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.1489,"RB":0.3333,"TE":0.1844,"WR":0.3333},"end":{"DEF":0,"K":0.0772,"QB":0.1489,"RB":0.1072,"TE":0,"WR":0.6667},"late":{"DEF":0.2561,"K":0.2561,"QB":0.1844,"RB":0,"TE":0.2261,"WR":0.0772},"mid1":{"DEF":0,"K":0,"QB":0.1844,"RB":0.3333,"TE":0.1489,"WR":0.3333},"mid2":{"DEF":0.0772,"K":0,"QB":0,"RB":0.2261,"TE":0.1072,"WR":0.5895}},"positions":{"DEF":{"finalCount":1,"firstRound":10.31,"firstRoundSd":1.27,"recentTaken":1,"takenRate":1},"K":{"finalCount":1,"firstRound":12.46,"firstRoundSd":0.84,"recentTaken":1,"takenRate":1},"QB":{"finalCount":2,"firstRound":4.02,"firstRoundSd":1.17,"recentTaken":1,"takenRate":1},"RB":{"finalCount":3,"firstRound":1.68,"firstRoundSd":0.47,"recentTaken":1,"takenRate":1},"TE":{"finalCount":2,"firstRound":4.34,"firstRoundSd":1.49,"recentTaken":1,"takenRate":1},"WR":{"finalCount":6,"firstRound":1.32,"firstRoundSd":0.47,"recentTaken":1,"takenRate":1}},"sampleYears":9,"years":[2017,2018,2019,2020,2021,2022,2023,2024,2025]},"Thomas":{"excludedYears":[],"identity":"Thomas","phaseShares":{"early":{"DEF":0,"K":0,"QB":0.0772,"RB":0.4406,"TE":0,"WR":0.4822},"end":{"DEF":0.2261,"K":0.2261,"QB":0.1072,"RB":0.1844,"TE":0,"WR":0.2561},"late":{"DEF":0.1072,"K":0,"QB":0,"RB":0.4105,"TE":0,"WR":0.4822},"mid1":{"DEF":0,"K":0,"QB":0,"RB":0.3333,"TE":0.3333,"WR":0.3333},"mid2":{"DEF":0,"K":0.1072,"QB":0.2561,"RB":0.4822,"TE":0,"WR":0.1544}},"positions":{"DEF":{"finalCount":1,"firstRound":12.71,"firstRoundSd":1.87,"recentTaken":1,"takenRate":1},"K":{"finalCount":1,"firstRound":12.75,"firstRoundSd":3.27,"recentTaken":1,"takenRate":1},"QB":{"finalCount":1.32,"firstRound":6.07,"firstRoundSd":1.69,"recentTaken":1,"takenRate":1},"RB":{"finalCount":5.55,"firstRound":2.13,"firstRoundSd":0.87,"recentTaken":1,"takenRate":1},"TE":{"finalCount":1,"firstRound":6,"firstRoundSd":0,"recentTaken":1,"takenRate":1},"WR":{"finalCount":5.13,"firstRound":1.32,"firstRoundSd":0.47,"recentTaken":1,"takenRate":1}},"sampleYears":3,"years":[2023,2024,2025]}},"recencyDecay":0.72,"schema":2};
const MANAGER_PROFILE_SOURCE_HASH='c5f601051850185b81801aaaa3efe554d9214f6cfa15999a0beec6cb0b192493';
function parseManagerMap(text){const out={};for(const part of String(text||'').split(',')){const m=part.trim().match(/^(\d+)\s*=\s*(.+)$/);if(m)out[Number(m[1])]=m[2].trim()}return out}
const ACTIVE_2026_MANAGER_MAP=Object.freeze(parseManagerMap(ACTIVE_2026_MANAGER_MAP_TEXT));
function resolvedManagerMap(mode,season,teams,text){
  // The real 2026 league composition/order is confirmed. Never let stale historical/localStorage maps
  // (e.g. Kai) leak into LIVE Return-v2. Replay/mock keep their explicit mapping semantics.
  if((mode==='live'||mode==='mock')&&String(season)==='2026'&&Number(teams)===10)return {...ACTIVE_2026_MANAGER_MAP};
  return parseManagerMap(text);
}
function managerProfile(name){
  const n=norm(name).replace(/oe/g,'o').replace(/ue/g,'u');
  const base=Object.entries(MANAGER_PROFILES).find(([k])=>n.includes(norm(k).replace(/oe/g,'o').replace(/ue/g,'u')))?.[1]||null;
  const histEntry=Object.entries(MANAGER_PROFILE_DATA.profiles).find(([k])=>n.includes(norm(k).replace(/oe/g,'o').replace(/ue/g,'u')))?.[1]||null;
  if(!base&&!histEntry)return null;
  return {...(base||{}),label:base?.label||histEntry?.identity||name,historical:histEntry||null};
}
function managerProfilesActive(mode,season=els.season.value,teams=10){return mode==='live'||(mode==='mock'&&String(season)==='2026'&&Number(teams)===10)}
function managerPhase(round){return round<=3?'early':round<=6?'mid1':round<=9?'mid2':round<=12?'late':'end'}
let LIVE_MANAGER_ADAPTATION_STATE={};
const LIVE_MANAGER_MODE_SEGMENTS_KEY='v118_managerModeSegments';
function parseManagerModeOverrides(text){const out={};for(const part of String(text||'').split(',')){const m=part.trim().match(/^(\d+)\s*=.*?\[(manual|autodraft|infer)\]\s*$/i);if(m){const v=m[2].toLowerCase();out[Number(m[1])]=v==='manual'?'manual':v==='autodraft'?'autodraft':'infer'}}return out}
function loadManagerModeSegments(){try{const v=JSON.parse(localStorage.getItem(LIVE_MANAGER_MODE_SEGMENTS_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
function saveManagerModeSegments(v){try{localStorage.setItem(LIVE_MANAGER_MODE_SEGMENTS_KEY,JSON.stringify(v))}catch{}}
function syncManagerModeSegments(text,current){const overrides=parseManagerModeOverrides(text),segments=loadManagerModeSegments();for(const [slotText,mode] of Object.entries(overrides)){const slot=Number(slotText),arr=Array.isArray(segments[slot])?segments[slot]:[],last=arr[arr.length-1];if(!last||last.mode!==mode){arr.push({fromPick:Number(current)||1,mode,source:'user-explicit'});segments[slot]=arr}}saveManagerModeSegments(segments);return segments}
function explicitManagerModeAt(segments,slot,pickNo){const arr=Array.isArray(segments?.[slot])?segments[slot]:[];let hit=null;for(const x of arr)if(Number(x.fromPick)<=Number(pickNo))hit=x;return hit?.mode==='infer'?null:(hit?.mode||null)}
function observedManagerMode(pk){const m=pk?.metadata||{};if(m.autodraft===true||m.is_autodraft===true||String(m.pick_mode||'').toLowerCase()==='autodraft')return'autodraft';if(String(m.pick_mode||'').toLowerCase()==='manual')return'manual';return null}
function inferManagerAutodraftProbability(rows,players){const obs=(rows||[]).map(pk=>({pick:Number(pk.pick_no)||999,pos:players?.[String(pk.player_id)]?.position||pk?.metadata?.position||''}));const specials=obs.filter(x=>x.pos==='K'||x.pos==='DEF');let p=0;if(specials.length>=1&&specials[0].pick<=100)p=.18;if(specials.length>=2&&specials[1].pick<=110)p=.42;if(specials.length>=2&&Math.abs(specials[1].pick-specials[0].pick)<=12&&specials[1].pick<=95)p=.82;return clamp(p,0,.90)}
function effectiveManagerMode({explicitMode=null,observedMode=null,inferredAutodraft=0}){if(explicitMode==='manual'||explicitMode==='autodraft')return explicitMode;if(observedMode==='manual'||observedMode==='autodraft')return observedMode;return inferredAutodraft>=.80?'autodraft':'manual'}
function rebuildLiveManagerAdaptation({mode,picks,players,map,current,modeText}){if(mode!=='live'){LIVE_MANAGER_ADAPTATION_STATE={};return LIVE_MANAGER_ADAPTATION_STATE}const segments=syncManagerModeSegments(modeText,current),out={};for(const [slotText,name] of Object.entries(map||{})){const slot=Number(slotText);if(slot===9)continue;const prof=managerProfile(name),key=norm(prof?.label||name),mine=(picks||[]).filter(pk=>Number(pk.draft_slot)===slot).sort((a,b)=>Number(a.pick_no)-Number(b.pick_no)),inferred=inferManagerAutodraftProbability(mine,players);let humanObservations=0;const phaseCounts={QB:0,RB:0,WR:0,TE:0};let latestMode='manual',latestExplicit=null,latestObserved=null;for(const pk of mine){const pos=players?.[String(pk.player_id)]?.position||pk?.metadata?.position||'',explicitMode=explicitManagerModeAt(segments,slot,pk.pick_no),observedMode=observedManagerMode(pk),inferredAtPick=inferManagerAutodraftProbability(mine.filter(q=>Number(q.pick_no)<=Number(pk.pick_no)),players),effective=effectiveManagerMode({explicitMode,observedMode,inferredAutodraft:inferredAtPick});latestMode=effective;if(explicitMode)latestExplicit=explicitMode;if(observedMode)latestObserved=observedMode;if(effective==='autodraft'||!['QB','RB','WR','TE'].includes(pos))continue;const weight=explicitMode==='manual'||observedMode==='manual'?1:Math.max(.15,1-.85*inferredAtPick);humanObservations+=weight;phaseCounts[pos]+=weight}const liveWeight=clamp(humanObservations*.12,0,.72);out[key]={slot,name:prof?.label||name,humanObservations,phaseCounts,currentDraftWeight:liveWeight,autodraftProbability:inferred,currentMode:latestMode,explicitMode:latestExplicit,observedMode:latestObserved,provenance:{pickCount:mine.length,segments:Array.isArray(segments?.[slot])?segments[slot]:[]}}}for(const s of Object.values(out)){const arr=Array.isArray(segments?.[s.slot])?segments[s.slot]:[];let seg=null;for(const x of arr)if(Number(x.fromPick)<=Number(current))seg=x;const explicitNow=explicitManagerModeAt(segments,s.slot,current);if(explicitNow){s.currentMode=explicitNow;s.explicitMode=explicitNow}else if(seg?.mode==='infer'){s.explicitMode=null;s.currentMode=effectiveManagerMode({observedMode:s.observedMode,inferredAutodraft:s.autodraftProbability})}}LIVE_MANAGER_ADAPTATION_STATE=out;return out}
function liveManagerStateForProfile(profile){return LIVE_MANAGER_ADAPTATION_STATE[norm(profile?.label||'')]||null}
function liveManagerDiagnostics(){const rows=Object.values(LIVE_MANAGER_ADAPTATION_STATE);if(!rows.length)return'keine Live-Updates';return rows.map(s=>`${s.name}: ${s.currentMode} · n=${Number(s.humanObservations||0).toFixed(1)} · Live-Gewicht ${Math.round((s.currentDraftWeight||0)*100)}% · Auto-P ${Math.round((s.autodraftProbability||0)*100)}%${s.explicitMode?' · expl. '+s.explicitMode:''}`).join(' | ')}
function managerHistoryPosMult(profile,pos,pickNo){
  const h=profile?.historical;let historical=1;
  if(h){const round=Math.floor((pickNo-1)/10)+1,phase=managerPhase(round),own=h.phaseShares?.[phase]?.[pos]??0,league=MANAGER_PROFILE_DATA.leaguePhaseShares?.[phase]?.[pos]??0;if(league>0){const raw=own/league,shrink=clamp((h.sampleYears||0)/8,.25,.8);historical=clamp(1+(raw-1)*shrink,.55,1.85)}}
  const live=liveManagerStateForProfile(profile);if(!live)return historical;if(live.currentMode==='autodraft')return 1;const n=live.humanObservations||0;if(!n)return historical;const observed=(live.phaseCounts?.[pos]||0)/n,neutral=.25,currentMult=clamp(1+(observed-neutral)*1.2,.70,1.60),w=live.currentDraftWeight||0;return clamp(historical*(1-w)+currentMult*w,.55,1.85);
}
function specialPositionHazard(profile,pos,pickNo,teams=10){
  if(liveManagerStateForProfile(profile)?.currentMode==='autodraft')return 0;
  const d=profile?.historical?.positions?.[pos];if(!d||!Number.isFinite(d.firstRound)||!(d.recentTaken>0))return 0;
  const round=(pickNo-1)/teams+1,sd=Math.max(1.15,Number(d.firstRoundSd)||1.8),scale=Math.max(.8,sd*.72),take=clamp(Number(d.recentTaken),0,1);
  const logistic=x=>1/(1+Math.exp(-x));
  const f=take*logistic((round-d.firstRound)/scale),prev=take*logistic(((round-1)-d.firstRound)/scale);
  let h=clamp((f-prev)/Math.max(.06,1-prev),0,.62);
  // 15-round 2026 draft: managers who historically almost always fill the slot get
  // an endgame urgency floor, while low-take managers remain genuinely likely to skip it.
  if(round>=14){const floor=take>=.9?(round>=15?.78:.38):take>=.7?(round>=15?.42:.16):0;h=Math.max(h,floor)}
  return clamp(h,0,.85);
}
function chooseSpecialTeamPick(profile,roster,pickNo,teams,rng){
  const hk=roster.K===0?specialPositionHazard(profile,'K',pickNo,teams):0,hd=roster.DEF===0?specialPositionHazard(profile,'DEF',pickNo,teams):0;
  const any=1-(1-hk)*(1-hd);if(rng()>=any)return null;
  if(hk<=0)return'DEF';if(hd<=0)return'K';return rng()<hk/(hk+hd)?'K':'DEF';
}
function rosterBySlot(picks,players,teams){const out={};for(let s=1;s<=teams;s++)out[s]={QB:0,RB:0,WR:0,TE:0,K:0,DEF:0};for(const pick of picks){const s=Number(pick.draft_slot),pos=pinfo(String(pick.player_id),pick.metadata,players).pos;if(out[s]&&out[s][pos]!=null)out[s][pos]++}return out}
function slotsBetween(current,next,teams){const a=[];if(!Number.isFinite(next))return a;for(let p=current;p<next;p++){const r=Math.floor((p-1)/teams)+1,w=(p-1)%teams+1,s=r%2?w:teams-w+1;a.push(s)}return a}
function endgameSkillShare(c,current,mode='live'){
  if(current<120)return 1;
  // Opponents with open K/DST slots consume many endgame picks there. Two consecutive
  // natural Sleeper mocks showed 13 K/DEF picks in the final 16-pick window, so MOCK/TEST
  // gets a stronger round-14/15 special-teams hazard. LIVE keeps the prior conservative
  // rate until real-league prospective evidence supports a change.
  const openSpecial=(c.K===0?1:0)+(c.DEF===0?1:0);
  if(mode==='mock'&&current>=130)return openSpecial===2?.20:openSpecial===1?.45:.92;
  return openSpecial===2?.34:openSpecial===1?.62:.92;
}
function basePositionPlausible(pos,c){let v;if(pos==='QB')v=c.QB===0?1:c.QB===1?.18:.03;else if(pos==='TE')v=c.TE===0?1:c.TE===1?.20:.04;else if(pos==='RB')v=c.RB<3?1:c.RB<5?.72:.35;else if(pos==='WR')v=c.WR<4?1:c.WR<6?.78:.40;else v=.2;return v}
function expectedSkillShare(profile,roster,pickNo,teams=10){if(!profile)return null;const hk=roster.K===0?specialPositionHazard(profile,'K',pickNo,teams):0,hd=roster.DEF===0?specialPositionHazard(profile,'DEF',pickNo,teams):0;return clamp((1-hk)*(1-hd),.05,1)}
function plausibleFor(pos,c,current=1,mode='live'){return basePositionPlausible(pos,c)*endgameSkillShare(c,current,mode)}
function candidateManagerMod(prof,p,current){
  if(!prof||!p)return{mult:1,labels:[]};
  const live=liveManagerStateForProfile(prof);if(live?.currentMode==='autodraft')return{mult:1,labels:['Autodraft · persönliche Traits aus']};
  const personalWeight=live?clamp(1-live.autodraftProbability*.75,.35,1):1;
  const t=prof.traits||{},labels=[];let delta=0;
  // Historical position/timing evidence is scored exactly once by managerHistoryPosMult().
  // This layer is reserved for capped qualitative/current-regime evidence so old profile
  // summaries cannot double-count the same historical QB/TE/position signal.
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
  delta=clamp(delta,-.25,.25)*personalWeight;
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
  const pos=p.pos,between=slotsBetween(current+1,next,teams),rosters=rosterBySlot(picks,players,teams);let hazard=0,plausible=0,uncertain=0,mods=[],effectiveSkillPicks=0;
  for(let i=0;i<between.length;i++){const s=between[i],pickNo=current+1+i,roster=rosters[s]||{QB:0,RB:0,WR:0,TE:0,K:0,DEF:0},prof=managerProfilesActive(mode,els.season.value,teams)?managerProfile(map[s]):null;
    const skillShare=prof?(expectedSkillShare(prof,roster,pickNo,teams)??1):endgameSkillShare(roster,pickNo,mode),base=basePositionPlausible(pos,roster)*skillShare;if(base>=.6)plausible++;effectiveSkillPicks+=skillShare;let mult=1;
    if(prof){mult*=managerHistoryPosMult(prof,pos,pickNo);const cm=candidateManagerMod(prof,p,pickNo);mult*=cm.mult;if(cm.labels.length)mods.push(`${prof.label} · ${cm.labels.join(' · ')}`);if(prof.uncertain)uncertain++}
    const sp=stressProfile(stress,p,pickNo);mult*=sp.mult;if(sp.label)mods.push(`Stress: ${sp.label}`);hazard+=base*mult;
  }
  return{between:between.length,effectiveSkillPicks,plausible,hazard,uncertain,mods:[...new Set(mods)]};
}
function adjustedReturn(base,intel){if(base==null)return null;const eff=Math.max(.5,intel.effectiveSkillPicks??intel.between);const pressure=clamp((intel.hazard-eff*.45)*.07,-.12,.15);const endgameRelief=clamp((intel.between-eff)*.035,0,.30);return clamp(base-pressure+endgameRelief,.02,.98)}
function returnConfidence(ret,intel,mode,hasAdp){let score=hasAdp?82:52;score-=Math.min(22,intel.between*1.7);score-=intel.uncertain*5;if(mode==='replay')score+=4;return clamp(Math.round(score),30,94)}
function lossIfGone(x){let loss=0;if(x.sameTier<=2)loss+=2;if(Number.isFinite(x.tierGap))loss+=Math.min(4,x.tierGap/4);if(Number.isFinite(x.alternativeGap))loss+=Math.min(3,x.alternativeGap/6);if((x.nearAlternatives||0)>=2)loss-=1.5;else if((x.nearAlternatives||0)===1)loss-=.5;if(x.p.pos==='RB'&&x.r.rank>=70)loss+=1;return loss>=5?'hoch':loss>=2.5?'mittel':'niedrig'}
function actionLabel(x){
  // Microfix rc4.97: preserve the stable two-state data contract (WAIT / —).
  // The bug was semantic/presentation: WAIT is Return timing, never an automatic pick command.
  if((x.ret??0)>=.72)return'WAIT';
  return'—';
}
function actionDisplayLabel(x){
  if(x.action==='WAIT')return'RETURN GUT';
  if((x.ret??1)<=.25)return'RETURN KRITISCH';
  return'RETURN OFFEN';
}
function modeStatusText(mode,map){if(mode==='live')return `LIVE LEAGUE: Managerhistorie + adaptive 2026-Priors aktiv${Object.keys(map).length?` · ${Object.keys(map).length} Slots zugeordnet`:' · WARNUNG: keine Slot→Manager-Zuordnung'} · Optionaler Modus-Override im Manager-Feld: [manual] / [autodraft] / [infer]`;if(mode==='mock')return `MOCK/TEST: 2026-Managerprofile aktiv · Markt-Prior + Roster-State + Profilvarianz${Object.keys(map).length?` · ${Object.keys(map).length} Slots zugeordnet`:''}`;if(mode==='replay')return 'REPLAY: historische Picks werden nur bis zum gewählten Cutoff sichtbar.';return 'Managerprofil-Status unbekannt.'}



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
function sleeperLiveAutopickWeight(p,pickNo,roster){
  // Sleeper live CPU auto-pick with an empty queue: roster need + a higher-ranked
  // available player. The exact proprietary tie-break is undocumented, so keep a
  // narrow stochastic band around Sleeper's visible SearchRank instead of claiming
  // a deterministic exact pick. Queue contents are private/unknown and therefore
  // cannot be simulated here.
  const sr=Number(p?.searchRank),a=adpFor(p?.name);
  const board=Number.isFinite(sr)&&sr>0?sr:(Number.isFinite(a)?a:rankFor(p?.name,p?.pos)?.rank);
  if(!Number.isFinite(board))return .00005;
  const need=simNeedWeight(p.pos,roster);
  const distance=Math.max(0,board-pickNo);
  return Math.max(.00005,Math.exp(-distance/2.35)*need);
}
function simCandidateWeight(p,pickNo,roster,profile,stress){
  const r=rankFor(p.name,p.pos);if(!r)return 0;
  const a=adpFor(p.name);
  // Market is a plausibility prior, not the opponent decision model. Sleeper ADP dominates
  // because it is visible in the room; panel rank is only a light stabilizer/fallback.
  const center=Number.isFinite(a)?a*.90+r.rank*.10:r.rank;
  // rc4.91: Early-turn market calibration. The former tau=1.35 made players
  // whose ADP sat only ~7-10 picks after the current pick virtually impossible choices.
  // That produced false ~99% return confidence at short snake turns (e.g. 1.09 -> 2.02).
  // Use a broader early market distribution; manager/roster modifiers still decide WHICH
  // nearby player a specific opponent prefers.
  const tauBase=pickNo<=30?4.25:pickNo<=80?4.5:7.5,tau=tauBase*(stress==='baseline'?1:1.18);
  let w=Math.exp(clamp((pickNo-center)/tau,-9,3.8))*simNeedWeight(p.pos,roster);
  if(profile){
    w*=managerHistoryPosMult(profile,p.pos,pickNo);
    w*=candidateManagerMod(profile,p,pickNo).mult;
  }
  w*=stressProfile(stress,p,pickNo).mult;
  return Math.max(.00005,w);
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
  const {current,next,picks,players,teams,map,rankedAvailable,mode='mock',userSlot}=ctx;
  if(!Number.isFinite(next)||next<=current)return null;
  const targets=rankedAvailable.slice(0,24),targetNames=targets.map(p=>norm(p.name));
  const survive=Object.fromEntries(targetNames.map(n=>[n,0]));
  const takenBy=Object.fromEntries(targetNames.map(n=>[n,{}]));
  // Target Collision Probability: per-manager probability of taking >=1 current target
  // before the user's return. Count once per manager/run even if that manager has
  // two sequential picks and takes two targets.
  const collisionByManager={};
  const collisionTargetCounts={};
  const baseRosters=rosterBySlot(picks,players,teams),firstOpponentPick=(Number(userSlot)>0&&draftSlotAtPick(current,teams)===Number(userSlot))?current+1:current,slots=slotsBetween(firstOpponentPick,next,teams);
  const mappedSlots=new Set(slots.filter(s=>managerProfile(map[s])));
  const mapCoverage=slots.length?mappedSlots.size/new Set(slots).size:0;
  const seedBase=(current*1009+next*9176+stress.split('').reduce((a,c)=>a+c.charCodeAt(0),0)*131+731)>>>0;
  for(let run=0;run<runs;run++){
    const rng=seededRng(seedBase+run*2654435761);
    let pool=rankedAvailable.slice(),rosters=cloneRosters(baseRosters);
    const collidedManagers=new Set();
    for(let i=0;i<slots.length&&pool.length;i++){
      const slot=slots[i],pickNo=firstOpponentPick+i,prof=managerProfilesActive(mode,els.season.value,teams)?managerProfile(map[slot]):null,roster=rosters[slot];
      const special=prof?chooseSpecialTeamPick(prof,roster,pickNo,teams,rng):null;
      if(special){roster[special]++;continue;}
      if(!prof){const skillShare=endgameSkillShare(roster,pickNo,mode);if(pickNo>=120&&rng()>skillShare){if(roster.DEF===0&&roster.K===0){if(rng()<.5)roster.DEF++;else roster.K++;}else if(roster.DEF===0)roster.DEF++;else if(roster.K===0)roster.K++;continue;}}
      const liveAuto=(mode==='live'&&liveManagerStateForProfile(prof)?.currentMode==='autodraft');
      const board=pool.slice(0,70).map(p=>({p,w:liveAuto?sleeperLiveAutopickWeight(p,pickNo,roster):simCandidateWeight(p,pickNo,roster,prof,stress)}));
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
function compactDecisionFixtureForStorage(f){
  if(!f||typeof f!=='object')return f;
  // Full per-expert rows inside every ranked-pool player dominate localStorage and are
  // redundant for replay: frozen panel/pos/tier/ADP + robust summaries are retained,
  // while detailed expert rows remain on the decision candidates and in Backup rankCache.
  return{...f,rankedPool:Array.isArray(f.rankedPool)?f.rankedPool.map(p=>{if(!p||typeof p!=='object')return p;const{panelIndividuals,robustRankShadow,...rest}=p;return rest}):f.rankedPool};
}
function saveDecisionFixtures(rows){
  const compact=(Array.isArray(rows)?rows:[]).map(compactDecisionFixtureForStorage);
  const currentDraftId=resolveActiveDraftId?.()||draftId(els.draftInput.value);
  const current=compact.filter(f=>String(f?.draftId||'')===String(currentDraftId||''));
  const history=compact.filter(f=>String(f?.draftId||'')!==String(currentDraftId||''));
  // Never degrade the active draft: a 15-round v4/v5 comparison requires all 30 paired
  // fixtures. Quota recovery may trim old drafts only; active evidence is atomic.
  for(const historyKeep of[90,60,30,0]){
    const keptHistory=historyKeep===0?[]:history.slice(-historyKeep);
    const payload=[...keptHistory,...current];
    try{localStorage.setItem(decisionFixtureKey(),JSON.stringify(payload));return true}catch{}
  }
  return false;
}
function resolveReturnValidation(draftId,picks){
  const rows=loadReturnValidation();let changed=false;
  for(const row of rows){
    if(row.draftId!==draftId||row.resolved||!Number.isFinite(row.returnPick))continue;
    const ownPick=picks.find(p=>Number(p.pick_no)===Number(row.current)&&(!Number.isFinite(Number(row.slot))||Number(p.draft_slot)===Number(row.slot)));
    const chosenKey=ownPick?norm(ownPick.metadata?.first_name&&ownPick.metadata?.last_name?`${ownPick.metadata.first_name} ${ownPick.metadata.last_name}`:(ownPick.metadata?.player_name||'')):'';
    if((picks?.length||0)<row.returnPick-1&&!chosenKey)continue;
    // current is the user's own pick only when an ownPick exists. Pre-draft/paused snapshots
    // can point at an opponent pick, which must be included in the resolution window.
    const firstOpponentPick=ownPick?Number(row.current)+1:Number(row.current);
    const window=picks.filter(p=>p.pick_no>=firstOpponentPick&&p.pick_no<row.returnPick);
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
  const predictions=rankedAvailable.slice(0,12).map(p=>{const x=rv2.players[norm(p.name)];return x?{key:norm(p.name),name:p.name,pos:p.pos,returnProb:x.ret,confidence:x.confidence,topRisk:x.topRisk,takers:x.takers||{},forecastResolution:'pending',brier:null}:null}).filter(Boolean);
  rows.push({id,draftId,current,returnPick,slot:Number.isFinite(Number(slot))?Number(slot):null,createdAt:Date.now(),resolved:false,predictions});saveReturnValidation(rows);
}
function robustRankShadow(r){
  // Live panels expose weight as `w`; embedded Expert-v2/v3 rows expose
  // `effectiveWeight`. Evidence export must preserve both, otherwise every
  // frozen embedded panel looks like it has zero expert rows.
  const vals=(r?.individual||[]).map(x=>({...x,__w:Number.isFinite(Number(x.w))?Number(x.w):Number(x.effectiveWeight)})).filter(x=>Number.isFinite(Number(x.rank))&&Number.isFinite(x.__w)&&x.__w>0).map(x=>({rank:Number(x.rank),w:x.__w,expertId:String(x.expertId||''),expertName:String(x.expertName||''),source:String(x.source||''),exact:x.exact!==false,reconstructed:!!x.reconstructed,spread:Number(x.spread)||0,anchors:Number(x.anchors)||0})).sort((a,b)=>a.rank-b.rank);
  if(!vals.length)return null;
  const sw=vals.reduce((a,x)=>a+x.w,0);
  let acc=0,median=vals[vals.length-1].rank;
  for(const x of vals){acc+=x.w;if(acc>=sw/2){median=x.rank;break}}
  const ranks=vals.map(x=>x.rank),lo=ranks[Math.floor((ranks.length-1)*.2)],hi=ranks[Math.ceil((ranks.length-1)*.8)];
  const wins=vals.map(x=>({...x,wrank:clamp(x.rank,lo,hi)}));
  const winsMean=wins.reduce((a,x)=>a+x.w*x.wrank,0)/sw;
  return{weightedMedian:median,winsorizedMean:winsMean,experts:vals};
}
function freezeDecisionFixture({draftId,current,returnPick,picks,mine,players,rankedAvailable,scored,rv2,mode,strategy,stress,teams,slot,fingerprint,map}){
  const analysisProfile=currentExpertProfile();
  const rows=loadDecisionFixtures(),id=`${draftId}|${current}|${fingerprint}|${analysisProfile}|${strategy}`;if(rows.some(r=>r.id===id))return;
  const endOfDraft=!Number.isFinite(returnPick)||returnPick<=current;
  const evidenceCutoff=Date.now();
  rows.push({
    id,draftId,current,returnPick:Number.isFinite(returnPick)?returnPick:null,createdAt:evidenceCutoff,fingerprint,analysisProfile,mode,strategy,stress,teams,slot,
    modelVersion:APP_VERSION,researchResidualModel:RESEARCH_RESIDUAL_MODEL_VERSION,managerProfileHash:MANAGER_PROFILE_SOURCE_HASH,managerMapSnapshot:{...(map||{})},managerLiveStateSnapshot:JSON.parse(JSON.stringify(LIVE_MANAGER_ADAPTATION_STATE)),rng:{runs:rv2?.runs??900,seedBasis:`${current}|${returnPick??'end'}|${stress}`},
    picks:picks.map(p=>({pick_no:p.pick_no,draft_slot:p.draft_slot,player_id:String(p.player_id),player_name:p.metadata?.first_name&&p.metadata?.last_name?`${p.metadata.first_name} ${p.metadata.last_name}`:(p.metadata?.player_name||'')})),
    userRoster:mine.map(p=>{const meta=players?.[String(p.player_id)]||p.metadata||{};return{pick_no:p.pick_no,player_id:String(p.player_id),player_name:p.metadata?.first_name&&p.metadata?.last_name?`${p.metadata.first_name} ${p.metadata.last_name}`:(p.metadata?.player_name||''),pos:meta.position||p.metadata?.position||null}}),
    // Full frozen skill-player pool makes post-mock counterfactuals reproducible without
    // later Sleeper metadata. This is validation evidence only; it never changes Coach scoring.
    rankedPool:rankedAvailable.map(p=>{const r=rankFor(p.name,p.pos),a=adpFor(p.name),rob=robustRankShadow(r);return{playerId:String(p.id||''),name:p.name,pos:p.pos,team:p.team||'FA',searchRank:Number.isFinite(p.searchRank)?p.searchRank:null,injury:p.injury||null,bye:p.bye??null,yearsExp:Number.isFinite(p.yearsExp)?p.yearsExp:null,panelRank:r?.rank??null,panelId:r?.panelId??null,posRank:r?.posRank??null,tier:r?.tier??null,adp:Number.isFinite(a)?a:null,panelIndividuals:rob?.experts||[],robustRankShadow:rob?{weightedMedian:rob.weightedMedian,winsorizedMean:rob.winsorizedMean}:null}}),
    candidates:scored.slice(0,16).map(x=>{const v2=rv2?.players?.[norm(x.p.name)],rob=robustRankShadow(x.r);return{playerId:String(x.p.id||''),name:x.p.name,pos:x.p.pos,panelRank:x.r?.rank??null,panelId:x.r?.panelId??null,panelN:Number.isFinite(Number(x.r?.n))?Number(x.r.n):null,panelSd:Number.isFinite(Number(x.r?.sd))?Number(x.r.sd):null,panelIndividuals:rob?.experts||[],robustRankShadow:rob?{weightedMedian:rob.weightedMedian,winsorizedMean:rob.winsorizedMean}:null,adp:Number.isFinite(x.a)?x.a:null,injury:x.p.injury||null,reasons:Array.isArray(x.reasons)?[...x.reasons]:[],confidence:Number.isFinite(Number(x.confidence))?Number(x.confidence):null,outsideNormalCut:!!x.outsideNormalCut,researchEvidence:researchPlayerState(x.p,evidenceCutoff).slice(-4),researchResidual:x.researchResidual||null,shadowCoachScore:x.shadowScore??null,shadowRank:x.shadowRank??null,returnProb:x.ret??null,returnConfidence:x.returnConfidence??null,topRisk:x.topRisk??null,returnTakers:v2?.takers||{},coachScore:x.score??null,action:x.action??null}}),
    targetCollisions:rv2?.collisions||{},
    forecastResolution:endOfDraft?'unresolved_end_of_draft':'pending',chosenPlayer:null,decisionOutcome:null
  });
  if(!saveDecisionFixtures(rows)){
    throw new Error('Decision-Evidence konnte nicht gespeichert werden. Aktiver Draft bleibt geschützt; bitte sofort Backup erstellen und Speicher prüfen.');
  }
}
function resolveDecisionFixtures(draftId,picks){const rows=loadDecisionFixtures();let changed=false;for(const f of rows){if(f.draftId!==draftId)continue;if(f.chosenPlayer){if(!f.decisionOutcome){const coach=f.candidates?.[0]||null,chosenCandidate=(f.candidates||[]).find(x=>norm(x.name)===norm(f.chosenPlayer?.name||''))||null;f.decisionOutcome={coachTop:coach?{name:coach.name,pos:coach.pos,coachScore:coach.coachScore,panelRank:coach.panelRank,adp:coach.adp}:null,chosenInFrozenCandidates:!!chosenCandidate,chosenFrozenRank:chosenCandidate?(f.candidates||[]).indexOf(chosenCandidate)+1:null,followedCoach:!!coach&&norm(coach.name)===norm(f.chosenPlayer?.name||''),chosenVsCoachScoreDelta:chosenCandidate&&coach&&Number.isFinite(chosenCandidate.coachScore)&&Number.isFinite(coach.coachScore)?chosenCandidate.coachScore-coach.coachScore:null,chosenVsCoachPanelDelta:chosenCandidate&&coach&&Number.isFinite(chosenCandidate.panelRank)&&Number.isFinite(coach.panelRank)?chosenCandidate.panelRank-coach.panelRank:null};changed=true}continue;}const hit=picks.find(p=>Number(p.pick_no)===Number(f.current)&&Number(p.draft_slot)===Number(f.slot));if(hit){const chosenName=hit.metadata?.first_name&&hit.metadata?.last_name?`${hit.metadata.first_name} ${hit.metadata.last_name}`:(hit.metadata?.player_name||'');const coach=f.candidates?.[0]||null,chosenCandidate=(f.candidates||[]).find(x=>norm(x.name)===norm(chosenName))||null;f.chosenPlayer={playerId:String(hit.player_id),name:chosenName};f.decisionOutcome={coachTop:coach?{name:coach.name,pos:coach.pos,coachScore:coach.coachScore,panelRank:coach.panelRank,adp:coach.adp}:null,chosenInFrozenCandidates:!!chosenCandidate,chosenFrozenRank:chosenCandidate?(f.candidates||[]).indexOf(chosenCandidate)+1:null,followedCoach:!!coach&&norm(coach.name)===norm(chosenName),chosenVsCoachScoreDelta:chosenCandidate&&coach&&Number.isFinite(chosenCandidate.coachScore)&&Number.isFinite(coach.coachScore)?chosenCandidate.coachScore-coach.coachScore:null,chosenVsCoachPanelDelta:chosenCandidate&&coach&&Number.isFinite(chosenCandidate.panelRank)&&Number.isFinite(coach.panelRank)?chosenCandidate.panelRank-coach.panelRank:null};if(f.forecastResolution==='pending')f.forecastResolution='chosen';changed=true}}if(changed)saveDecisionFixtures(rows)}
function simulateToReturn(ctx,stress='baseline',runs=1200){
  const {current,next,picks,players,teams,map,rankedAvailable,mode='mock'}=ctx;
  if(!Number.isFinite(next)||next<=current)return null;
  const targetNames=rankedAvailable.slice(0,24).map(p=>norm(p.name)),survive=Object.fromEntries(targetNames.map(n=>[n,0]));
  const baseRosters=rosterBySlot(picks,players,teams),slots=slotsBetween(current+1,next,teams),seedBase=(current*1009+next*9176+stress.split('').reduce((a,c)=>a+c.charCodeAt(0),0)*131)>>>0;
  for(let run=0;run<runs;run++){
    const rng=seededRng(seedBase+run*2654435761);
    let pool=rankedAvailable.slice(),rosters=cloneRosters(baseRosters);
    for(let i=0;i<slots.length&&pool.length;i++){
      const slot=slots[i],pickNo=firstOpponentPick+i,prof=managerProfilesActive(mode,els.season.value,teams)?managerProfile(map[slot]):null,roster=rosters[slot];
      // K/DST timing is manager-specific when historical profiles are active.
      // Generic endgame hazard remains only as a fallback for unprofiled/replay contexts.
      const special=prof?chooseSpecialTeamPick(prof,roster,pickNo,teams,rng):null;
      if(special){roster[special]++;continue;}
      if(!prof){const skillShare=endgameSkillShare(roster,pickNo,mode);if(pickNo>=120&&rng()>skillShare){
        if(roster.DEF===0&&roster.K===0){if(rng()<.5)roster.DEF++;else roster.K++;}
        else if(roster.DEF===0)roster.DEF++;else if(roster.K===0)roster.K++;continue;
      }}
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
  const valid=rows.filter(x=>x?.r&&Number.isFinite(x.r.rank)&&Number.isFinite(x.rawScore)&&!x.hardExcluded&&!x.recommendationBlocked&&!x.userStrategyExcluded);
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
  // rc4.64: Safety must not resurrect a repeated QB/TE after roster scoring demoted it.
  // Existing exceptional-slide thresholds are reused exactly; no new numeric penalty family.
  const safetyPromotionEligible=x=>safetyPromotionEligiblePolicy({
    pos:x.p.pos,counts:x.stateCounts||{},rank:x.r.rank,adp:x.a,current
  });
  const eligible=valid.filter(safetyPromotionEligible);
  const eligibleBestPanelRank=eligible.length?Math.min(...eligible.map(x=>x.r.rank)):bestPanelRank;
  const eligibleBandMax=eligibleBestPanelRank+Math.max(3,Math.floor(threshold/2));
  const qualityBand=eligible.filter(x=>x.r.rank<=eligibleBandMax);
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

// No player-specific blacklist. User recommendations remain ranking/utility driven.
// Low-ranked players stay available but naturally sink through selected-panel quality, market timing,
// roster/championship utility and validated evidence.

function buildEmergencyQueueText(scored,state,current,draftId){
  const max=35,out=[];
  let qb=0,te=0;
  for(const x of scored){
    if(out.length>=max)break;
    if(x.p.pos==='QB'){if((state.counts.QB||0)>=1||qb>=1)continue;qb++;}
    if(x.p.pos==='TE'){if((state.counts.TE||0)>=1||te>=1)continue;te++;}
    out.push(x);
  }
  const lines=[
    '===== PITTI EMERGENCY SLEEPER QUEUE =====',
    `App-Version: ${APP_VERSION}`,
    `Draft-ID: ${draftId}`,
    `Stand: Pick ${current}`,
    'Nur manueller Sleeper-Queue-Fallback; keine API-/Import-Automation.',
    'K/DST ausgeschlossen. Maximal ein QB- und ein TE-Kandidat solange QB1/TE1 offen; nach QB1/TE1 keiner mehr.',
    'Reihenfolge = aktueller Draft-Companion-Coach; bei materiellen News/Rollenänderungen neu erzeugen.',
    ''
  ];
  out.forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team}${x.p.injury?` | ${x.p.injury}`:''}`));
  return lines.join('\n');
}

function bestAvailablePanelRank(available){
  const ranks=available.map(x=>rankFor(x.name,x.pos)?.rank).filter(Number.isFinite);
  return ranks.length?Math.min(...ranks):null;
}
function playerQualityBaseScore(panelRank,available){
  const best=bestAvailablePanelRank(available);
  if(!Number.isFinite(panelRank)||!Number.isFinite(best))return null;
  // Player Quality is independent of current pick/ADP. A better selected-panel rank
  // can never reduce this component. Market timing belongs to the separate ADP/Return layers.
  return 100-clamp((panelRank-best)*1.0,0,74);
}
function scoreCandidate(p,current,next,state,available,strategy='progressive'){
  const r=rankFor(p.name,p.pos),a=Number(adp[norm(p.name)]);
  if(!r)return{score:-999,r:null,a,reasons:['Panel-Rang fehlt']};
  if(userDraftStrategyExcluded(p.pos,state.counts,p.name))return{score:-999,rawScore:-999,r,a,reasons:[['Geno Smith','Aaron Rodgers'].some(n=>norm(n)===norm(p.name))?'USER HARD EXCLUSION: nicht draften':'USER STRATEGY: genau 1 QB · QB2 nicht draften'],hardExcluded:true,userStrategyExcluded:true};
  const acuteStatus=DRAFT_ACUTE_STATUS_2026[norm(p.name)];
  if(acuteStatus?.blockRecommendation)return{score:-998,rawScore:-998,r,a,reasons:[acuteStatus.label],acuteStatus,recommendationBlocked:true};
  /* rc4.10: monotonic selected-panel Player Quality, anchored to best available panel rank. */
  const stage=strategy==='progressive'?progressiveStage(current):0;
  let score=playerQualityBaseScore(r.rank,available),reasons=[];
  if(!Number.isFinite(score))return{score:-999,r:null,a,reasons:['Player-Quality-Basis fehlt']};
  const value=valueLabel(current,a);
  if(Number.isFinite(value.value)){
    const reachScale=strategy==='progressive'?[1,.85,.65,.45][stage]:1;
    const valueScale=value.value<0?reachScale:1;
    score+=clamp(value.value*.16*valueScale,-4.5,4.5);
  }
  reasons.push(value.label);
  const rawNeed=state.need[p.pos]||0;
  // Early portfolio guard: after two RBs but only one WR, generic RB roster need is
  // already satisfied enough that it must not overturn a superior WR panel/tier.
  // This is deliberately narrow (through pick 50) and soft: concrete scarcity/value
  // evidence can still make an RB win; only the generic need channel is neutralized.
  const portfolioNeed=(current<=50&&p.pos==='RB'&&state.counts.RB>=2&&state.counts.WR<=1)?Math.min(rawNeed,0):rawNeed;
  const needContribution=clamp(portfolioNeed*draftPhaseNeedFactor(current),-16,7);
  score+=needContribution;
  if((state.need[p.pos]||0)>=7)reasons.push(`${p.pos}-Need (${p.pos==='QB'?'aufschiebbar':'draftphasenabhängig'})`);
  const exceptionPenalty=rosterExceptionPenalty(p.pos,state,current,r.rank,a);
  if(exceptionPenalty){score+=exceptionPenalty;reasons.push(p.pos==='QB'?'QB2 nur Ausnahmefall':'TE2 nur Ausnahmefall')}
  const upside=lateUpsideBonus(p,current,state);if(upside){score+=upside;reasons.push(upside>0?'Late-RB Upside-Bonus':'WR-Sättigung')}
  if(strategy==='progressive'){const prog=progressiveUpsideBonus(p,current,state);if(prog){score+=prog;reasons.push(prog>0?`Progressive-Upside +${prog.toFixed(1)}`:'Progressive WR-Sättigung')}}
  const stash=injuryStashAdjustment(p,current,state);if(stash){score+=stash;reasons.push(stash<0?'Injury-Stash Opportunity Cost':'Injury-Stash')};
  const mru=marginalRosterUtility(p,current,state);if(mru){score+=mru;reasons.push(`Marginal Roster Utility ${mru>0?'+':''}${mru.toFixed(1)}`)}
  const tier=tierContext(p,r,available);
  // Tier geometry is diagnostic only here. Replacement-aware alternative scarcity below
  // is the single scored positional-scarcity channel; scoring both would double-count
  // the same loss-of-access signal (especially around tier boundaries).
  if(tier.isLastInTier)reasons.push(`Letzter Spieler in Tier ${r.tier}`);
  else if(tier.sameTierCount<=2)reasons.push(`Tier fast leer (${tier.sameTierCount})`);
  if(tier.tierGap!=null&&tier.tierGap>=8)reasons.push(`Tier-Drop +${tier.tierGap.toFixed(0)}`);
  const alt=positionalAlternativeContext(p,r,available);
  if(alt.bonus){score+=alt.bonus;reasons.push(`Positions-Alternativen ${alt.nearEqual} nah · Gap ${alt.bestGap.toFixed(1)} (${alt.bonus>0?'+':''}${alt.bonus.toFixed(1)})`)}
  const agree=agreement(r.sd,r.n);
  if(agree==='Sehr hoher Konsens')score+=1.5;
  else if(agree==='Stark umstritten')score-=3;
  // rc4.96: modest continuous dispersion calibration. Expert disagreement is uncertainty,
  // not evidence that a player is bad; keep the adjustment small and symmetric around SD 7.
  // This prevents two optimistic experts from over-promoting a volatile panel while preserving
  // genuine breakout candidates for the research/upside layers.
  if(Number.isFinite(r.sd)){
    const dispersionAdj=clamp((7-r.sd)*.12,-1.25,.75);
    score+=dispersionAdj;
    if(Math.abs(dispersionAdj)>=.5)reasons.push(`Panel-Streuung ${dispersionAdj>0?'Bonus':'Unsicherheit'} ${dispersionAdj>0?'+':''}${dispersionAdj.toFixed(1)}`);
  }
  if(p.injury){const st=String(p.injury).toUpperCase(),freeIr=(state.irEligible||0)<(state.irSlots||0);const pen=st==='PUP'&&freeIr&&current>=121?0:st==='PUP'?3:st==='QUESTIONABLE'?0:st==='DOUBTFUL'?7:st==='IR'&&freeIr?12:st==='IR'?18:8;score-=pen;if(pen>0)reasons.push(`Injury ${p.injury}${st==='PUP'?' · Return-Timetable prüfen':''}${st==='IR'?' · Season-ending prüfen':''}`);else if(st==='QUESTIONABLE')reasons.push('Questionable · kein pauschaler Score-Abzug; aktuelle Evidenz prüfen')}
  if(p.bye&&(state.byes[p.pos]?.[p.bye]||0)>=2){score-=1;reasons.push(`Bye ${p.bye} (nur Tiebreaker)`)}
  // Return is scored only after Return-v2 / fallback resolution in the coach loop.
  // Keeping the legacy ADP curve here as a score input would double-count return pressure
  // and could make the displayed Return-v2 probability disagree with the actual ranking.
  const ret=returnChance(next,a);
  // Sparse-panel guard: 1-2 embedded voices are not a normal consensus panel.
  // Penalize recommendation score as well as confidence; otherwise scarcity/return can still
  // turn a partial panel into a misleading LOSS-HIGH recommendation (e.g. Dobbins).
  const sparsePanelPenalty=r.n>=4?0:r.n===3?2:r.n===2?7:14;
  if(sparsePanelPenalty){score-=sparsePanelPenalty;reasons.push(`Panel unvollständig (${r.n||0} Stimmen) · Confidence begrenzt`);}
  const expertBase=r.n>=5?4:r.n>=4?1:r.n===3?-4:r.n===2?-14:-22;
  const confidenceCap=r.n>=4?96:r.n===3?78:r.n===2?62:50;
  const confidence=clamp(Math.min(confidenceCap,Math.round(88-r.sd*2+(Number.isFinite(a)?4:-10)+expertBase)),35,96);
  const researchResidual=researchResidualShadow(p,r,a,current);
  return{score:0,rawScore:score,r,a,ret,reasons,agree,sameTier:tier.sameTierCount,tierGap:tier.tierGap,alternativeGap:alt.bestGap,nearAlternatives:alt.nearEqual,confidence,valueKind:value.kind,researchResidual};
}
function applyResolvedReturnScore(x,current,strategy){
  if(x.ret==null)return;
  const stage=progressiveStage(current);
  // Return is a timing signal, not a second Player-Quality model. Early drafts previously
  // let a high Return probability erase too much of a strong panel edge (Chase Brown canary).
  // Cap the early WAIT discount tightly; relative board urgency below remains available.
  const returnWeight=strategy==='progressive'?[8,8,6,4][stage]:8;
  const returnCap=stage===0?3.5:stage===1?4.5:6;
  x.rawScore+=clamp((.50-x.ret)*returnWeight,-returnCap,returnCap);
  // Reasons must describe the same resolved probability that the UI displays.
  if(x.ret>=.80)x.reasons.push(`Warten attraktiv (${Math.round(x.ret*100)}% Return)`);
  else if(x.ret<=.25)x.reasons.push(`Jetzt-Pick dringlich (${Math.round(x.ret*100)}% Return)`);
  else if(x.ret>=.65)x.reasons.push(`Gute Return-Chance (${Math.round(x.ret*100)}%)`);
}

const EXPERT_DISPLAY_ROWS_2026=[
  ['Sean Koerner','Dalton Del Don','Pat Fitzmaurice'],
  ['Nick Mariano','Justin Boone','Ryan Weisse'],
  ['Todd D Clark','Wolf of Roto Street','Kev Wheeler']
];
const NON_V4_EXPERT_DISPLAY_PRIORITY_2026=[
  'Sean Koerner','Dalton Del Don','Pat Fitzmaurice',
  'Nick Mariano','Justin Boone','Todd D Clark','Ryan Weisse',
  'Kev Wheeler','Wolf of Roto Street'
];
const NON_V4_EXPERT_DISPLAY_PRIORITY_MAP_2026=new Map(NON_V4_EXPERT_DISPLAY_PRIORITY_2026.map((name,i)=>[norm(name),i]));
function nonV4ExpertDisplayOrder(names){
  return [...names].sort((a,b)=>(NON_V4_EXPERT_DISPLAY_PRIORITY_MAP_2026.get(norm(a))??999)-(NON_V4_EXPERT_DISPLAY_PRIORITY_MAP_2026.get(norm(b))??999)||String(a).localeCompare(String(b)));
}
function expertRankInlineHtml(name,r,byExpert){
  const x=byExpert.get(norm(name)),overall=Number(x?.overallRank??x?.rank);
  const rank=!x||!Number.isFinite(overall)||overall<=0?'–':String(Math.round(overall));
  return `<span class="expert-inline"><b>${esc(name)}</b> #${rank}</span>`;
}
function expertRanksHtml(r){
  const rows=Array.isArray(r?.individual)?r.individual:[];
  const byExpert=new Map(rows.filter(x=>x?.expertName).map(x=>[norm(x.expertName),x]));
  const panelId=String(r?.panelId||'');
  if(panelId.startsWith('expert-v4-')){
    // Fixed three-line v4 matrix. Position is taken from the panel id itself because
    // sanitizeExpertPanelRow historically does not expose row.pos through rankFor().
    // This was the rc4.155 root cause: pos became empty, so the matrix had no members
    // and the card fell back to the legacy one-line expert prose.
    const pos=panelId.slice('expert-v4-'.length).toUpperCase();
    const members=new Set((EXPERT_V4_BLUEPRINT[pos]?.experts||[]).map(norm));
    const matrix=EXPERT_DISPLAY_ROWS_2026.map(displayRow=>{
      let last=-1;
      for(let i=0;i<displayRow.length;i++)if(members.has(norm(displayRow[i])))last=i;
      if(last<0)return '';
      return `<div class="expert-display-row">${displayRow.slice(0,last+1).map(name=>{
        if(!members.has(norm(name)))return `<span class="expert-inline expert-inline-placeholder" aria-hidden="true">${esc(name)} #000</span>`;
        return expertRankInlineHtml(name,r,byExpert);
      }).join('')}</div>`;
    }).join('');
    return `<div class="expert-grid expert-grid-fixed">${matrix}</div>`;
  }
  const panelWeights=panels[r?.panelId]?.weights||{};
  const intended=nonV4ExpertDisplayOrder(Object.keys(panelWeights).filter(name=>Number(panelWeights[name])>0));
  const names=intended.length?intended:nonV4ExpertDisplayOrder(rows.map(x=>x.expertName).filter(Boolean));
  return `<div class="expert-grid expert-grid-inline">${names.map(name=>expertRankInlineHtml(name,r,byExpert)).join('')}</div>`;
}
function researchBadgesHtml(x){
  const rr=x?.researchResidual;if(!rr?.active||!Array.isArray(rr.components)||!rr.components.length)return '';
  const pos=rr.components.filter(c=>Number(c.dir)>0),neg=rr.components.filter(c=>Number(c.dir)<0);
  const peak=a=>a.length?Math.max(...a.map(c=>Number(c.strength||0)*Number(c.confidence||0))):0;
  const arrows=(v,dir=1)=>v>=.58?(dir<0?'↓↓':'↑↑'):v>=.30?(dir<0?'↓':'↑'):'';
  const priced=a=>a.some(c=>c.pricing==='POSSIBLY_UNPRICED')?'EDGE OFFEN':a.some(c=>c.pricing==='PARTLY_PRICED')?'TEILW. EINGEPREIST':'WEITG. EINGEPREIST';
  const out=[];
  if(pos.length){const a=arrows(peak(pos));if(a)out.push(`<span class="tag research-up">BREAKOUT ${a}</span>`);}
  if(neg.length){const a=arrows(peak(neg),-1);if(a)out.push(`<span class="tag research-down">DECLINE/RISK ${a}</span>`);}
  out.push(`<span class="tag research-price">${priced(rr.components)}</span>`);
  out.push(`<span class="tag research-shadow">Research ${rr.delta>0?'+':''}${Number(rr.delta).toFixed(2)} · Shadow</span>`);
  return `<div class="research-badges">${out.join('')}</div>`;
}
function pittiVisibleEvidence(x){
  const rr=x?.researchResidual;if(!rr||!Array.isArray(rr.components))return[];
  const rows=[];
  for(const c of rr.components){
    if(c?.display!==true&&c?.displayRisk!==true)continue;
    const causal=String(c?.causal||'').trim();if(!causal)continue;
    // displayRisk is a visibility flag, not a polarity override. Neutral context
    // (dir===0) must stay neutral; only signed evidence may render as +/−.
    const dir=Number(c.dir);
    rows.push({dir:dir>0?1:dir<0?-1:0,causal});
  }
  return rows.slice(0,3);
}
function pittiVisibleEvidenceHtml(x){
  const rows=pittiVisibleEvidence(x);if(!rows.length)return'';
  return '<div class="research-evidence">'+rows.map(e=>'<div class="'+(e.dir<0?'research-evidence-risk':e.dir>0?'research-evidence-up':'research-evidence-neutral')+'">'+(e.dir<0?'− ':e.dir>0?'+ ':'• ')+esc(e.causal)+'</div>').join('')+'</div>';
}
function pittiFantasyRole(p,players){
 const pos=String(p?.pos||'').toUpperCase(),team=String(p?.team||'').toUpperCase();if(!['QB','RB','WR','TE'].includes(pos))return pos||'?';const same=[];for(const q of Object.values(players||{})){if(String(q?.team||'').toUpperCase()!==team||String(q?.position||'').toUpperCase()!==pos)continue;const name=q?.full_name||[q?.first_name,q?.last_name].filter(Boolean).join(' ');if(!name)continue;const r=rankFor(name,pos),sr=Number(q?.search_rank);if(r&&Number.isFinite(r.rank))same.push({name,rank:r.rank,sr});}same.sort((a,b)=>a.rank-b.rank||(a.sr||9999)-(b.sr||9999));const i=same.findIndex(q=>norm(q.name)===norm(p?.name));if(i>=0)return pos+(i+1);const d=Number(p?.depthOrder);return Number.isFinite(d)&&d>=1&&d<=6?pos+Math.round(d):pos;}
function pittiResearchArrows(x){const rr=x?.researchResidual;if(!rr?.active||!Array.isArray(rr.components))return'';const eligible=c=>{const k=String(c?.kind||'').toLowerCase();return /(ascension|upside|ceiling|talent|efficiency|role_environment|elite_rookie_role|elite_role|decline_tail|decline_risk|regression)/.test(k)&&!/(injury|ankle|achilles|recurrence)/.test(k)};const c=rr.components.filter(c=>Number(c.dir)!==0&&eligible(c)).sort((a,b)=>Number(b.strength||0)*Number(b.confidence||0)-Number(a.strength||0)*Number(a.confidence||0))[0];if(!c)return'';const s=Number(c.strength||0)*Number(c.confidence||0),up=Number(c.dir)>0;return s>=.58?(up?'↑↑':'↓↓'):s>=.30?(up?'↑':'↓'):'';}
function pittiDecisionAuditRow(x,c){if(!x)return null;const panelId=x.r.panelId||null,intendedExperts=Object.keys(panels[panelId]?.weights||{}).filter(name=>Number(panels[panelId]?.weights?.[name])>0);return{name:x.p.name,pos:x.p.pos,team:x.p.team,injury:x.p.injury||null,panel:x.r.rank,panelId,panelName:x.r.panel||null,expertCount:Number.isFinite(Number(x.r.n))?Number(x.r.n):null,intendedExperts,panelSd:Number.isFinite(Number(x.r.sd))?Number(x.r.sd):null,individual:x.r.individual||[],adp:Number.isFinite(x.a)?x.a:null,ret:x.ret,returnConfidence:x.returnConfidence,confidence:x.confidence,score:x.score,rawScore:x.rawScore,action:x.action,loss:x.loss,outsideNormalCut:!normalCandidateAdmissible(x),role:pittiFantasyRole(x.p,c.players),arrows:pittiResearchArrows(x),expertTier:externalExpertTierContext(x),reasons:Array.isArray(x.reasons)?x.reasons.slice():[],researchResidual:x.researchResidual||null,valueSafety:x.valueSafety||null,nearAlternatives:x.nearAlternatives??null,alternativeGap:x.alternativeGap??null,valueKind:x.valueKind??null};}
window.PITTI_LIVE_DECISION_STATE=()=>{const c=lastDraftContext;if(!c?.scored)return null;const rows=visibleCoachCandidates(c.scored).filter(x=>!x.hardExcluded&&!x.recommendationBlocked).slice(0,10);return{version:APP_VERSION,current:c.current,next:c.next,profile:currentExpertProfile(),positionPanels:{...positionPanels},rows:rows.map(x=>pittiDecisionAuditRow(x,c))};};
window.PITTI_CANDIDATE_AUDIT=(query='Kenneth Walker')=>{const c=lastDraftContext;if(!c?.scored)return null;const q=norm(query),x=c.scored.find(z=>norm(z?.p?.name)===q)||c.scored.find(z=>norm(z?.p?.name).includes(q)||q.includes(norm(z?.p?.name)));if(!x)return{version:APP_VERSION,query,found:false,scoredCount:c.scored.length};const rank=c.scored.indexOf(x)+1,cut=c.scored[9]||null;return{version:APP_VERSION,query,found:true,coachRank:rank,visible:rank<=10,candidate:pittiDecisionAuditRow(x,c),visibleCut:cut?{rank:10,name:cut.p.name,pos:cut.p.pos,score:cut.score,rawScore:cut.rawScore,panel:cut.r.rank,adp:Number.isFinite(cut.a)?cut.a:null,ret:cut.ret,reasons:cut.reasons||[]}:null,scoreGapToVisibleCut:cut?Number((x.rawScore-cut.rawScore).toFixed(3)):null};};

// rc4.148: v4 tier display is derived from the exact same six verified individual
// v4 expert rows that drive the v4 position panel. FantasyPros' public consensus API does
// not expose a documented player tier field; requiring one caused the rc4.137-147 dead end.
// Display-only: never feeds Coach score, Return-v2, opponent model, roster logic or history.
let v4ConsensusTierCache=store.get('v4148_v4ConsensusTiers',{});
function v4TierFromPanelRank(posRank){
  const r=Number(posRank);
  if(!Number.isFinite(r)||r<=0)return null;
  // Stable position-relative bands; expert membership/ranks come from sealed v4.
  const size={QB:4,RB:8,WR:8,TE:4};
  return size;
}
function buildV4PanelTiers(){
  const next={},status=[];
  for(const pos of ['QB','RB','WR','TE']){
    const panelId=EXPERT_PROFILE_IDS.expertv4[pos],rows=panelRanks[panelId]||{};
    const expected=EXPERT_V4_BLUEPRINT[pos].experts;
    const out={};let shown=0,partial=0;
    for(const [key,row] of Object.entries(rows)){
      const individual=Array.isArray(row.individual)?row.individual:[];
      const names=new Set(individual.map(x=>norm(x.expertName)));
      const present=expected.filter(name=>names.has(norm(name)));
      const missing=expected.filter(name=>!names.has(norm(name)));
      // Cross-position comparable overall tier for this 10-team league:
      // T1 = Overall-v4 1-10, T2 = 11-20, ... . Use the same common-scale
      // Overall panel rank that already drives Coach quality. Keep sparse coverage visible.
      if(present.length<2)continue;
      const overall=Number(row.rank);
      if(!Number.isFinite(overall)||overall<=0)continue;
      const tier=Math.max(1,Math.ceil(overall/10));
      out[key]={name:row.name,tier,present,missing,coverage:present.length/expected.length,overallRank:overall,posRank:Number(row.posRank)||null};
      shown++;if(missing.length)partial++;
    }
    next[pos]={rows:out,selected:[...expected],updated:Date.now(),source:'Expert-v4 global overall tiers · 10-team bands'};
    status.push(shown?pos+' '+shown+' Spieler · globale v4-Tiers aus Overall-Panelrang'+(partial?' · Coverage sichtbar':''):pos+' KEINE TIER-FREIGABE · weniger als 2/6 v4-Einzelränge');
  }
  v4ConsensusTierCache=next;store.set('v4148_v4ConsensusTiers',next);return status;
}
async function loadV4ConsensusTiers(){return buildV4PanelTiers()}
function v4ConsensusTierContext(x){
  const pos=String(x?.p?.pos||'').toUpperCase(),block=v4ConsensusTierCache?.[pos],row=block?.rows?.[norm(x?.p?.name||'')];
  if(!row||!Number.isFinite(Number(row.tier)))return null;
  const n=Array.isArray(row.present)?row.present.length:0;
  const missing=Array.isArray(row.missing)?row.missing:[];
  return{label:'T '+Number(row.tier)+(n&&n<6?' · '+n+'/6':''),details:'Globales v4-Overall-Tier · '+Number(row.overallRank).toFixed(1)+' Overall · '+n+'/6 vorgesehene Individual-Experten'+(missing.length?' · fehlen: '+missing.join(', '):''),tier:Number(row.tier),selected:row.present||[],unavailable:missing,source:block.source};
}
function externalExpertTierContext(x){return v4ConsensusTierContext(x)}
function externalTierHtml(x){const t=v4ConsensusTierContext(x);return t?` · <span class="expert-tier" title="${esc(t.details)}">${esc(t.label)}</span>`:'';}

function renderCoach(rows,state,current,next){
  const top=visibleCoachCandidates(rows);
  els.favoritesBlock.innerHTML=top.length?`<div class="favorite-box"><b>${esc(top[0].p.name)} · ${top[0].p.pos}</b><div class="tiny">Bis zu 10 nützliche Kandidaten sichtbar · Normalbereich und Fallbacks klar getrennt.</div></div>`:'';
  els.coachList.innerHTML=`<div class="coach-section-title">Empfehlung + Alternativen</div>`+top.map((x,i)=>`${x.outsideNormalCut&&(i===0||!top[i-1]?.outsideNormalCut)?'<div class="coach-section-title">Weitere sichtbare Kandidaten · außerhalb Normal-Cut</div>':''}<article class="coach"><div class="coach-head"><div><h3>${i+1}. ${esc(x.p.name)}${externalTierHtml(x)} · ${x.p.pos}</h3><div class="tiny">${x.outsideNormalCut?'FALLBACK · AUSSERHALB NORMAL-CUT · ':i===0?'EMPFEHLUNG · ':''}Tier ${x.r.tier||'–'} · Loss ${x.loss}</div></div><div class="score">${x.score}${Number.isFinite(x.balancedScore)?`<small class="strategy-compare">v10 ${x.balancedScore}</small>`:''}</div></div><div class="metrics"><div class="metric"><b>${x.r.rank.toFixed(1)}</b><span>Overall-Panel</span></div><div class="metric"><b>${Number.isFinite(x.a)?x.a.toFixed(1):'–'}</b><span>ADP</span></div><div class="metric"><b>${x.ret!=null?Math.round(x.ret*100)+'%':'–'}</b><span>Return</span></div><div class="metric"><b>${x.returnConfidence}%</b><span>Return-Conf.</span></div><div class="metric"><b>${x.intel.plausible}</b><span>Abnehmer</span></div></div>${researchBadgesHtml(x)}${pittiVisibleEvidenceHtml(x)}${expertRanksHtml(x.r)}<div class="tags">${x.reasons.slice(-7).map(reason=>`<span class="tag info">${esc(reason)}</span>`).join('')}</div><button class="secondary live-only live-detail-toggle" type="button" data-live-detail-toggle>${i===0?'Details ausblenden':'Details anzeigen'}</button></article>`).join('');
  els.teamSummary.innerHTML=Object.entries(state.counts).map(([p,n])=>`<div class="summary-item"><b>${n}</b><span>${p}</span></div>`).join('')+`<div class="summary-item"><b>${current}</b><span>Pick</span></div><div class="summary-item"><b>${next??'–'}</b><span>Nächster</span></div>`;
  els.coachList.querySelectorAll('[data-live-detail-toggle]').forEach(btn=>btn.onclick=()=>{const card=btn.closest('.coach');card.classList.toggle('live-detail-open');btn.textContent=card.classList.contains('live-detail-open')?'Details ausblenden':'Details anzeigen';});
}

const FP_ANALYZER_URL='https://dw.fantasypros.com/football/draft-analyzer/';
const FP_CAPTURE_BOOKMARKLET=`javascript:(()=>{try{let t=[...document.scripts].map(s=>s.textContent||'').find(t=>t.includes('const modelJS'));if(!t)throw Error('Full Analysis öffnen');let i=t.indexOf('const modelJS'),s=t.indexOf('{',i),d=0,q='',e=0,j=s;for(;j<t.length;j++){let c=t[j];if(q){if(e)e=0;else if(c=='\\')e=1;else if(c==q)q='';continue}if(c=='"'||c=="'"){q=c;continue}if(c=='{')d++;else if(c=='}'&&!--d)break}let m=JSON.parse(t.slice(s,j+1));if(!m.isLogged)throw Error('Bei FantasyPros anmelden');let u=m.userTeamId,r=a=>(a||[]).find(x=>x&&x.id===u)||null,o={schema:'draft-companion.external-benchmark.fantasypros.v1',source:{provider:'FantasyPros',capturedAt:new Date().toISOString(),draftKey:m.draftKey||null},draft:{title:m.draft?.title||null,scoring:m.scoring||null,teams:(m.draft?.teams||[]).length,userTeamName:m.userTeamName||null,userTeamId:u??null},result:{overall:{grade:m.grade||null,scoreExact:typeof m.perc=='number'?m.perc:null,scoreRounded:typeof m.perc=='number'?Math.round(m.perc):null},projectedStanding:r(m.completeRankingJSON),starters:r(m.startersRankingJSON),bench:r(m.benchRankingJSON)},pickAnalysis:m.pickAnalysis||[],expertsPositive:m.expertsPositive||[],expertsNegative:m.expertsNegative||[],startingLineup:m.startingLineup||{}};let x=document.getElementById('pitti-fp-export');if(x)x.remove();x=document.createElement('div');x.id='pitti-fp-export';x.style='position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;padding:14px;background:#fff;color:#111;border:2px solid #1677d2;border-radius:12px;box-shadow:0 4px 24px #0008;font:16px sans-serif';let h=document.createElement('b');h.textContent='PITTI: FantasyPros-Daten bereit';let a=document.createElement('a');a.textContent='JSON herunterladen';a.download='PITTI-FantasyPros.json';a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.style='display:block;margin-top:12px;padding:12px;background:#1677d2;color:#fff;text-align:center;text-decoration:none;border-radius:8px;font-weight:700';let c=document.createElement('button');c.textContent='Schließen';c.style='display:block;margin-top:8px;padding:8px;width:100%';c.onclick=()=>{URL.revokeObjectURL(a.href);x.remove()};x.append(h,a,c);document.body.append(x)}catch(e){let x=document.getElementById('pitti-fp-export');if(x)x.remove();x=document.createElement('div');x.id='pitti-fp-export';x.style='position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;padding:14px;background:#fff;color:#900;border:2px solid #900;border-radius:12px;font:16px sans-serif';x.textContent='PITTI-Fehler: '+e.message;document.body.append(x)}})()`;

function renderRosterWorkspace(mine,players,current,draftComplete){
  if(!els.rosterStatus||!els.rosterSummary||!els.rosterList)return;
  if(!mine?.length){els.rosterStatus.className='notice warn';els.rosterStatus.textContent='Noch kein eigener Kader aus dem geladenen Sleeper-Draft verfügbar.';els.rosterSummary.innerHTML='';els.rosterList.innerHTML='';return;}
  const rows=mine.map(pk=>{const p=pinfo(String(pk.player_id),pk.metadata,players),r=rankFor(p.name,p.pos),a=adpFor(p.name);return{pk,p,r,a}});
  const counts={QB:0,RB:0,WR:0,TE:0,K:0,DEF:0};for(const x of rows)if(counts[x.p.pos]!=null)counts[x.p.pos]++;
  const ranked=rows.filter(x=>x.r).sort((a,b)=>a.r.rank-b.r.rank);
  const avg=ranked.length?ranked.reduce((z,x)=>z+x.r.rank,0)/ranked.length:null;
  els.rosterStatus.className='notice ok';els.rosterStatus.textContent=`${draftComplete?'Abgeschlossener':'Laufender'} Draftkader · ${rows.length} Spieler · Panel-first Baseline${avg!=null?` · Ø Panel ${avg.toFixed(1)}`:''}. Keine automatische Add/Drop-Transaktion.`;
  els.rosterSummary.innerHTML=Object.entries(counts).filter(([,n])=>n).map(([pos,n])=>`<div class="summary-item"><b>${n}</b><span>${pos}</span></div>`).join('');
  els.rosterList.innerHTML=rows.map(({pk,p,r,a})=>{
    const pick=Number(pk.pick_no),round=Math.ceil(pick/10),gap=(r&&Number.isFinite(a))?a-r.rank:null;
    let protect='HOLD';
    if(pick<=80||r?.rank<=90)protect='CORE / PROTECT';
    else if(pick<=120||r?.rank<=140)protect='HOLD / REVIEW';
    else protect='BENCH CAPITAL';
    const market=gap==null?'':gap>=12?' · Panel > Markt':gap<=-12?' · Markt > Panel':'';
    return `<div class="coach-row"><div><b>${p.name}</b> <span class="tiny">${p.pos} · ${p.team}</span><div class="tiny">Pick ${pick} · Rd ${round}${r?` · Panel ${r.rank.toFixed(1)}`:' · Panel –'}${Number.isFinite(a)?` · ADP ${a.toFixed(1)}`:''}${p.injury?` · Injury ${p.injury}`:''}</div></div><div><b>${protect}</b><div class="tiny">${market||'Baseline unverändert'}</div></div></div>`;
  }).join('');
  renderRosterBenchAudit(rows,players,current,draftComplete);
}

function rosterBenchCapitalScore(x){
  const pick=Number(x.pk?.pick_no)||999, rank=Number(x.r?.rank), adp=Number(x.a);
  let score=0;
  if(Number.isFinite(rank))score+=clamp((rank-95)/12,-4,7);else score+=5;
  if(pick>=120)score+=2.5;else if(pick>=90)score+=1;else score-=3;
  if(Number.isFinite(adp)&&Number.isFinite(rank))score+=clamp((rank-adp)/22,-2,2);
  if(x.p?.injury)score+=String(x.p.injury).toUpperCase()==='IR'?4:2;
  if(x.p?.pos==='RB')score-=1.25; // preserve contingent RB upside unless a clearly better path appears
  return score;
}
function renderRosterBenchAudit(rows,players,current,draftComplete){
  if(!els.rosterBenchStatus||!els.rosterBenchList)return;
  if(!draftComplete){els.rosterBenchStatus.className='notice';els.rosterBenchStatus.textContent='Bench-Audit wird nach Draftabschluss aktiv.';els.rosterBenchList.innerHTML='';return;}
  const protectedRows=rows.filter(x=>(Number(x.pk?.pick_no)||999)<=80||Number(x.r?.rank)<=90);
  const review=rows.filter(x=>!protectedRows.includes(x)).map(x=>({...x,capitalScore:rosterBenchCapitalScore(x)})).sort((a,b)=>b.capitalScore-a.capitalScore).slice(0,5);
  els.rosterBenchStatus.className='notice ok';
  els.rosterBenchStatus.textContent='Drop-Review v1 · nur Priorisierung des eigenen Bench-Kapitals. Kein Spieler wird ohne Vergleich mit einem konkreten Free Agent zum Drop empfohlen.';
  els.rosterBenchList.innerHTML=review.length?`<div class="coach-section-title">Zuerst gegen Free Agents vergleichen</div>`+review.map((x,i)=>{
    const flags=[];if(x.p.injury)flags.push(`Injury ${x.p.injury}`);if(x.p.pos==='RB')flags.push('Contingent-RB-Schutz');if(Number.isFinite(x.r?.rank))flags.push(`Panel ${x.r.rank.toFixed(1)}`);if(Number.isFinite(x.a))flags.push(`ADP ${x.a.toFixed(1)}`);
    return `<div class="coach-row"><div><b>${i+1}. ${esc(x.p.name)}</b> <span class="tiny">${x.p.pos} · ${x.p.team}</span><div class="tiny">${flags.join(' · ')||'Panel-/Marktdaten unvollständig'}</div></div><div><b>REVIEW ONLY</b><div class="tiny">Kein Drop ohne materiell besseren FA</div></div></div>`;
  }).join(''):'<div class="notice">Kein klar expendables Bench-Kapital aus der aktuellen Baseline.</div>';
}


function postDraftRosterCounts(rows){
  const c={QB:0,RB:0,WR:0,TE:0};for(const x of rows)if(c[x.p?.pos]!=null)c[x.p.pos]++;return c;
}
function seasonRosterCapitalScore(x){
  let score=0;const rank=Number(x.r?.rank),adp=Number(x.a);
  if(Number.isFinite(rank))score+=clamp((rank-95)/12,-4,7);else score+=5;
  if(Number.isFinite(adp)&&Number.isFinite(rank))score+=clamp((rank-adp)/22,-2,2);
  if(x.seasonStatus==='RESERVE'||x.p?.injury)score+=String(x.p?.injury||'').toUpperCase()==='IR'?4:2;
  if(x.p?.pos==='RB')score-=1.25;
  return score;
}
function postDraftOpportunityProxy(x){
  let v=0;
  const ev=actionableResearchEvents(x.p),all=researchPlayerState(x.p);
  const flags=[...new Set(ev.flatMap(e=>e.flags||[]).map(x=>String(x).toLowerCase()))];
  if(flags.some(f=>/starter|lead|workload|goal|receiv|role up|depth up/.test(f)))v+=3;
  if(flags.some(f=>/backup|committee|role down|limited|pup|ir|injur/.test(f)))v-=3;
  if(x.p?.injury)v-=String(x.p.injury).toUpperCase()==='IR'?4:2;
  return {value:clamp(v,-6,6),events:ev.length,rejected:Math.max(0,all.length-ev.length),hint:researchHint(x.p)};
}
function postDraftUpsideProxy(x){
  let v=x.p?.pos==='RB'?2:x.p?.pos==='WR'?1:0;
  if(Number.isFinite(x.r?.rank)&&x.r.rank<=130)v+=1;
  if(Number.isFinite(x.a)&&Number.isFinite(x.r?.rank)&&x.a-x.r.rank>=18)v+=1;
  return clamp(v,0,5);
}
function freshAcquisitionEvidence(x,maxAgeMs=7*86400000){
  const now=Date.now(),ev=actionableResearchEvents(x.p).filter(e=>{const t=Number(e.sourcePublishedAt||e.eventOccurredAt||e.observedAt||0);return t&&t<=now+3600000&&now-t<=maxAgeMs;});
  return {events:ev.length,latestAt:ev.length?Math.max(...ev.map(e=>Number(e.sourcePublishedAt||e.eventOccurredAt||e.observedAt||0))):0};
}
function postDraftSwapScore(drop,fa,ctx){
  const dr=Number(drop.r?.rank),fr=Number(fa.r?.rank);
  const panelDelta=(Number.isFinite(dr)?dr:230)-(Number.isFinite(fr)?fr:230);
  const dOpp=postDraftOpportunityProxy(drop),fOpp=postDraftOpportunityProxy(fa);
  const opportunityDelta=fOpp.value-dOpp.value;
  const upsideDelta=postDraftUpsideProxy(fa)-postDraftUpsideProxy(drop);
  let rosterUtility=0;
  if(ctx.WR>=7&&fa.p.pos==='RB'&&drop.p.pos==='WR')rosterUtility+=3;
  if(ctx.RB<=4&&fa.p.pos==='RB'&&drop.p.pos!=='RB')rosterUtility+=1.5;
  if(drop.p.pos==='RB'&&fa.p.pos!=='RB'&&drop.capitalScore<7)rosterUtility-=2.5;
  if((fa.p.pos==='QB'&&ctx.QB>=1)||(fa.p.pos==='TE'&&ctx.TE>=1))rosterUtility-=5; // 10-team 1QB: QB2/TE2 exceptional only
  if(drop.p.injury&&String(drop.p.injury).toUpperCase()==='IR')rosterUtility+=3;
  const score=clamp(panelDelta*.22,-6,6)+clamp(opportunityDelta,-6,6)+clamp(upsideDelta*.5,-3,3)+rosterUtility;
  const evidencePresent=(fOpp.events+dOpp.events)>0,faFresh=freshAcquisitionEvidence(fa),dropFresh=freshAcquisitionEvidence(drop),freshEvidencePresent=(faFresh.events+dropFresh.events)>0;
  let action='HOLD';
  if(score>=6&&freshEvidencePresent)action='CLEAR ADD';
  else if(score>=2)action='WATCH';
  const confidence=clamp(Math.round(55+(Number.isFinite(fr)&&Number.isFinite(dr)?15:0)+(freshEvidencePresent?12:evidencePresent?4:0)-(fOpp.rejected+dOpp.rejected)*4),35,88);
  return {drop,fa,score,panelDelta,opportunityDelta,upsideDelta,rosterUtility,action,confidence,dOpp,fOpp,evidencePresent,freshEvidencePresent,faFresh,dropFresh};
}
function renderRosterFaAudit(rows,rankedAvailable,draftComplete){
  if(!els.rosterFaStatus||!els.rosterFaList)return;
  if(!draftComplete){els.rosterFaStatus.className='notice';els.rosterFaStatus.textContent='FA-Vergleich wird nach Draftabschluss aktiv.';els.rosterFaList.innerHTML='';return;}
  const counts=postDraftRosterCounts(rows);
  const liveSeason=rows.some(x=>x?.seasonStatus);
  const drops=rows.filter(x=>liveSeason?(!x.r||Number(x.r?.rank)>90):((Number(x.pk?.pick_no)||999)>80&&(!x.r||Number(x.r?.rank)>90))).map(x=>({...x,capitalScore:liveSeason?seasonRosterCapitalScore(x):rosterBenchCapitalScore(x)})).sort((a,b)=>b.capitalScore-a.capitalScore).slice(0,7);
  const hasQB=counts.QB>=1;
  const fas=rankedAvailable.slice(0,80).map(p=>({p,r:rankFor(p.name,p.pos),a:adpFor(p.name)})).filter(x=>x.r&&!(hasQB&&x.p.pos==='QB')).slice(0,45);
  const pairs=[];
  for(const fa of fas){let best=null;for(const drop of drops){const z=postDraftSwapScore(drop,fa,counts);if(!best||z.score>best.score)best=z;}if(best)pairs.push(best);}
  pairs.sort((a,b)=>b.score-a.score||a.fa.r.rank-b.fa.r.rank);
  const surfaced=pairs.filter(x=>x.action!=='HOLD').slice(0,5);lastPostDraftPairs=pairs.slice(0,20);
  const panelAge=Number(store.get('v7_lastRankingUpdate',0)),adpAge=Number(adpMeta.updated||0);
  const provenance=`Panel ${panelAge?new Date(panelAge).toLocaleString('de-DE'):'Zeit unbekannt'} · Sleeper-ADP ${adpAge?new Date(adpAge).toLocaleString('de-DE'):'Zeit unbekannt'} · Research Cache append-only`;
  els.rosterFaStatus.className=`notice ${surfaced.some(x=>x.action==='CLEAR ADD')?'warn':'ok'}`;
  els.rosterFaStatus.textContent=`FA-vs-Roster v1 · ${fas.length} gerankte Free Agents geprüft · ${drops.length} Drop-Kandidaten · Ownership live aus allen Sleeper-Rostern gegengeprüft · ${provenance}. CLEAR ADD erfordert zusätzlich verifizierte Evidence aus den letzten 7 Tagen; ältere Cache-Evidence kann höchstens WATCH auslösen.`;
  if(!surfaced.length){els.rosterFaList.innerHTML='<div class="notice ok"><b>HOLD</b> · Kein materiell positiver Add/Drop-Swap aus der aktuell geladenen Baseline.</div>';return;}
  els.rosterFaList.innerHTML=`<div class="coach-section-title">Konkrete Add/Drop-Paare</div>`+surfaced.map((x,i)=>{
    const why=[`Panel Δ ${x.panelDelta>=0?'+':''}${x.panelDelta.toFixed(1)}`,`Opportunity Δ ${x.opportunityDelta>=0?'+':''}${x.opportunityDelta.toFixed(1)}`,`Upside Δ ${x.upsideDelta>=0?'+':''}${x.upsideDelta.toFixed(1)}`,`Roster ${x.rosterUtility>=0?'+':''}${x.rosterUtility.toFixed(1)}`];
    const fresh=x.fOpp.hint||x.dOpp.hint||'keine aktuelle Research-Cache-Evidence';
    const invalidator=x.action==='CLEAR ADD'?'Rollen-/Health-News oder Panel-Update kippt den materiellen Vorteil':'Neue verifizierte Rollen-/Health-Evidence kann WATCH zu ADD oder HOLD auflösen';
    return `<article class="coach"><div class="coach-head"><div><h3>${i+1}. ${x.action}: ${esc(x.fa.p.name)} → für ${esc(x.drop.p.name)}</h3><div class="tiny">ADD ${x.fa.p.pos} ${x.fa.p.team} · DROP ${x.drop.p.pos} ${x.drop.p.team} · Confidence ${x.confidence}% · ${x.action==='CLEAR ADD'?'sofort prüfen':'monitor / kein Rush'}</div></div><div class="score">${x.score.toFixed(1)}</div></div><div class="tiny">Player Quality: FA Panel ${x.fa.r.rank.toFixed(1)} vs Roster ${Number.isFinite(x.drop.r?.rank)?x.drop.r.rank.toFixed(1):'–'} · ${why.join(' · ')}</div><div class="tiny">Freshness: ${esc(fresh)} · Provenance: ${esc(provenance)}</div><div class="tiny">Invalidator/Recheck: ${esc(invalidator)}</div></article>`;
  }).join('');
}



function renderSpecialTeamsBoard(){
  const c=lastDraftContext;if(!c?.draftComplete||!els.waiverList)return'';
  const dst=c.availableDST||[],ks=c.availableK||[];
  const rb26=[
    ['JAX',1,1,'CLE',16.5],['LAC',2,1,'ARI',18],['PIT',3,1,'ATL',19.25],['SEA',4,1,'NE',20.5],['HOU',5,1,'BUF',21.5],['DEN',6,1,'KC',23],['LAR',7,1,'SF',22.5],
    ['KC',8,2,'DEN',20.5],['TEN',9,2,'NYJ',18.5],['DET',10,2,'NO',21.25],['PHI',11,3,'WSH',20.5],['CHI',12,3,'CAR',22.5],['BAL',13,3,'IND',22.5],
    ['MIN',14,4,'GB',21.5],['LV',15,4,'MIA',21],['BUF',16,4,'HOU',23],['NYJ',17,4,'TEN',18.5],['ATL',18,4,'PIT',22.25]
  ];
  const aliases={JAC:'JAX',LA:'LAR',LAC:'LAC',WSH:'WAS',WAS:'WAS',LV:'LV'};
  const rbMap=new Map(rb26.map(x=>[x[0],{rank:x[1],tier:x[2],opp:x[3],implied:x[4]}]));
  const normTeam=t=>aliases[String(t||'').toUpperCase()]||String(t||'').toUpperCase();
  const d=dst.map(p=>({p,rb:rbMap.get(normTeam(p.team||p.name))})).filter(x=>x.rb).sort((a,b)=>a.rb.rank-b.rb.rank);
  const kProj=new Map([['Cameron Dicker',8.7],['Harrison Mevis',8.4],['Brandon Aubrey',8.3],['Jake Bates',8.2],['Jason Myers',8.0],["Ka'imi Fairbairn",8.0],['Cam Little',7.9],['Tyler Loop',7.9],['Evan McPherson',7.7],['Chris Boswell',7.6]]);
  const k=ks.map(p=>({p,proj:kProj.get(p.name)})).filter(x=>Number.isFinite(x.proj)).sort((a,b)=>b.proj-a.proj);
  const dHtml=d.length?d.slice(0,7).map((x,i)=>{const team=normTeam(x.p.team||x.p.name),jax=team==='JAX',label=jax?'PRIORITY W1 · HOLD-HORIZON WEAK':(x.rb.tier<=2?'TARGET':'WATCH'),detail=jax?' · 2025 DST FP #4 · 31 takeaways (#2) · W2 DEN / W3 NE / W4 CIN → eher W1-Stream als 4W-Hold':'';return '<div class="coach-row"><div><b>'+(i+1)+'. '+esc(x.p.name)+'</b><div class="tiny">D/ST · RotoBaller W1 #'+x.rb.rank+' · Tier '+x.rb.tier+' · vs '+esc(x.rb.opp)+' · Opp implied '+x.rb.implied+' · Sleeper frei'+detail+'</div></div><div><b>'+label+'</b></div></div>'}).join(''):'<div class="notice">Keine RotoBaller-Top-18-D/ST ist aktuell im Sleeper-FA-Pool.</div>';
  const kHtml=k.length?k.slice(0,7).map((x,i)=>'<div class="coach-row"><div><b>'+(i+1)+'. '+esc(x.p.name)+'</b><div class="tiny">K · FantasyPros W1 Consensus-Projektion · Sleeper frei</div></div><div><b>'+x.proj.toFixed(1)+' proj.</b></div></div>').join(''):'<div class="notice">Keiner der aktuell verifizierten Top-10-Kicker ist im Sleeper-FA-Pool.</div>';
  return '<div class="coach-section-title">WEEK 1 · D/ST STREAMING</div><div class="notice ok">RotoBaller W1: Rank + Tier + Gegner + Vegas-Implied-Points. Quality-Floor: Tier 5/6 ausgeschlossen; Tier 4 nur Notfall. Early-Add-Gate: Vorteil gegenüber nächstbestem freien Stream × Verlust-/Marktrisiko muss den Optionswert des besten Drop-Kandidaten übersteigen. Pre-W1-RB-Optionswert wird erhöht. Weeks 1–4 wird vor finalem Add als Hold-Horizon gegengeprüft.</div>'+dHtml+'<div class="coach-section-title">WEEK 1 · KICKER</div>'+kHtml;
}

function renderWaiverWorkspace(draftComplete){
  if(!els.waiverStatus||!els.waiverList)return;
  if(!draftComplete){els.waiverStatus.className='notice';els.waiverStatus.textContent='Waiver-Priorität wird nach Draftabschluss aktiv.';els.waiverList.innerHTML='';return;}
  const q=lastPostDraftPairs.filter(x=>x.action!=='HOLD').slice(0,8);
  els.waiverStatus.className=`notice ${q.some(x=>x.action==='CLEAR ADD')?'warn':'ok'}`;
  els.waiverStatus.textContent='Waiver/FA Priority v1 · nutzt dieselbe FA-vs-Roster Engine wie Team/Roster. Numerisches FAAB bleibt bewusst aus: ohne aktuelle Waiver-Woche, Gegnerbudget/Markt und belastbare Rollen-News wäre ein Betrag Scheingenauigkeit.';
  const special=renderSpecialTeamsBoard();if(!q.length){els.waiverList.innerHTML=special+'<div class="notice ok"><b>SKILL-POSITION HOLD</b> · Aktuell kein materiell positiver RB/WR/TE-Swap aus der geladenen Baseline.</div>';return;}
  els.waiverList.innerHTML=renderSpecialTeamsBoard()+q.map((x,i)=>{
    const urgency=x.action==='CLEAR ADD'?(x.score>=10?'P1 · HIGH':'P1 · CLAIM'):x.score>=4?'P2 · WATCH':'P3 · MONITOR';
    const market=x.action==='CLEAR ADD'?'FAAB: nach aktueller Wochen-/Marktprüfung':'FAAB: 0 / kein Blindgebot aus statischer Baseline';
    return `<div class="coach-row"><div><b>${i+1}. ${esc(x.fa.p.name)}</b> <span class="tiny">${x.fa.p.pos} · DROP ${esc(x.drop.p.name)}</span><div class="tiny">${x.action} · Swap-Score ${x.score.toFixed(1)} · Confidence ${x.confidence}% · ${market}</div></div><div><b>${urgency}</b><div class="tiny">Keine automatische Transaktion</div></div></div>`;
  }).join('');
}

function renderSeasonActionBoard(draftComplete){
  if(!els.seasonActionStatus||!els.seasonActionList)return;
  if(!draftComplete){els.seasonActionStatus.className='notice';els.seasonActionStatus.textContent='Action Board wird nach Draftabschluss aktiv.';els.seasonActionList.innerHTML='';return;}
  const pairs=lastPostDraftPairs||[],clear=pairs.filter(x=>x.action==='CLEAR ADD'),watch=pairs.filter(x=>x.action==='WATCH');
  const urgent=clear.length?`ACTION · ${clear.length} verifizierte CLEAR-ADD-Swap${clear.length===1?'':'s'} prüfen.`:watch.length?`WATCH · ${watch.length} mögliche Roster-Upgrades, aber noch kein verifiziertes Sofortsignal.`:'HOLD · Kein materieller Add/Drop-Trigger aus der geladenen Baseline.';
  els.seasonActionStatus.className=`notice ${clear.length?'warn':'ok'}`;els.seasonActionStatus.textContent=`Season Action Board v1 · ${urgent} Read-only; keine automatische Transaktion.`;
  const q=clear.length?clear.slice(0,4):watch.slice(0,4);
  els.seasonActionList.innerHTML=q.map(x=>`<div class="coach-row"><div><b>${x.action==='CLEAR ADD'?'ADD prüfen':'Watch'}: ${esc(x.fa.p.name)}</b><div class="tiny">gegen ${esc(x.drop.p.name)} · Swap ${x.score.toFixed(1)} · Confidence ${x.confidence}% · ${esc(x.fOpp.hint||x.dOpp.hint||'keine zusätzliche aktuelle Evidence')}</div></div><div><b>${x.action==='CLEAR ADD'?'ACTION':'WATCH'}</b><div class="tiny">Waiver/FA öffnen</div></div></div>`).join('')||'<div class="notice ok"><b>INBOX LEER</b> · Kein aktueller verifizierter Handlungs-Trigger.</div>';
}

function rerenderPostDraftFromContext(){
  const c=lastDraftContext;
  if(!c?.draftComplete||!Array.isArray(c.mine)||!Array.isArray(c.rankedAvailable)||!c.players)return false;
  const rows=Array.isArray(c.seasonRows)&&c.seasonRows.length?c.seasonRows:c.mine.map(pk=>{const p=pinfo(String(pk.player_id),pk.metadata,c.players),r=rankFor(p.name,p.pos),a=adpFor(p.name);return{pk,p,r,a}});
  renderRosterFaAudit(rows,c.rankedAvailable,true);
  renderTradeWorkspace(c.picks,c.players,Number(els.slot.value),c.teams,true);
  renderWaiverWorkspace(true);
  renderSeasonActionBoard(true);
  return true;
}
const TRADE_TARGET_DEPTH={QB:1,RB:3,WR:4,TE:1};
function tradeLineupBenchmark(mine,pos){
  const depth=TRADE_TARGET_DEPTH[pos]||1;
  const ranks=mine.filter(m=>m.p.pos===pos&&m.r&&Number.isFinite(m.r.rank)).map(m=>m.r.rank).sort((a,b)=>a-b);
  if(!ranks.length)return{rank:180,depth,filled:0,open:true};
  if(ranks.length<depth)return{rank:135,depth,filled:ranks.length,open:true};
  return{rank:ranks[Math.min(depth,ranks.length)-1],depth,filled:ranks.length,open:false};
}
function renderTradeWorkspace(picks,players,userSlot,teams,draftComplete){
  if(!els.tradeStatus||!els.tradeList)return;
  if(!draftComplete){els.tradeStatus.className='notice';els.tradeStatus.textContent='Trade Target Board wird nach Draftabschluss aktiv.';els.tradeList.innerHTML='';return;}
  const bySlot={};for(let slot=1;slot<=teams;slot++)bySlot[slot]=[];
  const live=lastDraftContext?.season;
  if(live?.ok&&Array.isArray(live.rosters)){
    for(const rr of live.rosters){const slot=Number(rr.roster_id);if(!bySlot[slot])bySlot[slot]=[];for(const pid of rr.players||[]){const p=sleeperPlayerRow(pid,players),r=rankFor(p.name,p.pos),a=adpFor(p.name);if(['QB','RB','WR','TE'].includes(p.pos))bySlot[slot].push({pk:{player_id:pid,pick_no:999},p,r,a});}}
  }else for(const pk of picks){const slot=Number(pk.draft_slot);if(!bySlot[slot])continue;const p=pinfo(String(pk.player_id),pk.metadata,players),r=rankFor(p.name,p.pos),a=adpFor(p.name);if(['QB','RB','WR','TE'].includes(p.pos))bySlot[slot].push({pk,p,r,a});}
  const mine=Array.isArray(lastDraftContext?.seasonRows)&&lastDraftContext.seasonRows.length?lastDraftContext.seasonRows:(bySlot[userSlot]||[]);
  const targets=[];
  for(const [slotS,roster] of Object.entries(bySlot)){
    const slot=Number(slotS);if(slot===userSlot)continue;
    for(const x of roster){if(!x.r||x.r.rank>110)continue;
      const bench=tradeLineupBenchmark(mine,x.p.pos),lineupEdge=bench.rank-x.r.rank;
      const research=researchHint(x.p);
      let desirability=clamp(lineupEdge*.16,-5,10)+clamp((110-x.r.rank)/20,-2,5);
      // In this 10-team 1QB league, QB2/TE2 are not generic depth targets. They surface only when they materially beat QB1/TE1.
      if(x.p.pos==='QB'&&bench.filled>=1&&lineupEdge<8)desirability-=5;
      if(x.p.pos==='TE'&&bench.filled>=1&&lineupEdge<8)desirability-=5;
      if(research)desirability+=.5;
      if(desirability>=2)targets.push({slot,x,lineupEdge,bench,desirability,research});
    }
  }
  targets.sort((a,b)=>b.desirability-a.desirability||b.lineupEdge-a.lineupEdge||a.x.r.rank-b.x.r.rank);
  els.tradeStatus.className='notice warn';
  els.tradeStatus.textContent='Trade Target Board v3 · LIVE Sleeper-Rosters statt Draftkader. Targets werden gegen die marginale eigene Start-/Flex-Geometrie bewertet. Marktwert/Annahme-Plausibilität und Gegenangebot fehlen weiterhin: TARGET DISCOVERY, noch keine ACCEPT/DECLINE-Freigabe.';
  els.tradeList.innerHTML=targets.length?`<div class="coach-section-title">Interessante gegnerische Assets — Target Discovery, Verhandlung noch nicht freigegeben</div>`+targets.slice(0,10).map((t,i)=>{
    const x=t.x,market=Number.isFinite(x.a)?` · Draft-ADP ${x.a.toFixed(1)}`:'';
    const geometry=t.bench.open?`offener ${x.p.pos}-Start/Flex-Pfad (${t.bench.filled}/${t.bench.depth})`:`eigene ${x.p.pos}-Lineup-Grenze Panel ${t.bench.rank.toFixed(1)}`;
    return `<div class="coach-row"><div><b>${i+1}. ${esc(x.p.name)}</b> <span class="tiny">${x.p.pos} · ${x.p.team} · Team/Slot ${t.slot}</span><div class="tiny">Panel ${x.r.rank.toFixed(1)}${market} · ${geometry} · Lineup-Edge ${t.lineupEdge>=0?'+':''}${t.lineupEdge.toFixed(1)} · ${esc(t.research||'keine aktuelle Research-Cache-Evidence')}</div></div><div><b>TARGET</b><div class="tiny">Boone/Markt + Gegnernutzen fehlen</div></div></div>`;
  }).join(''):'<div class="notice ok">Kein klarer Trade-Target-Vorteil aus der aktuellen Panel-/Roster-/Lineup-Baseline.</div>';
}

function fpStoreKey(draftId){return `v118_fpBenchmark_${draftId}`}
function allFpBenchmarks(){const out={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith('v118_fpBenchmark_')){const id=k.slice('v118_fpBenchmark_'.length),v=store.get(k,null);if(v)out[id]=v}}return out}
function restoreFpBenchmarks(v){const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith('v118_fpBenchmark_'))keys.push(k)}for(const k of keys)localStorage.removeItem(k);for(const[id,b]of Object.entries(v||{}))if(b?.schema==='draft-companion.external-benchmark.fantasypros.v1')store.set(fpStoreKey(id),b)}
function getFpBenchmark(draftId){return draftId?store.get(fpStoreKey(draftId),null):null}
function fpRosterNames(v){
  const line=v?.pickAnalysis?.[0]?.current_lineup;
  if(Array.isArray(line)&&line.length)return line.map(x=>x?.name).filter(Boolean);
  return (v?.startingLineup?.starters||[]).map(x=>x?.name).filter(Boolean);
}
function validateFpBenchmark(v,ctx){
  if(v?.schema!=='draft-companion.external-benchmark.fantasypros.v1')throw new Error('FantasyPros-Datei hat nicht das erwartete PITTI-Schema.');
  if(v?.source?.provider!=='FantasyPros')throw new Error('FantasyPros-Quelle nicht bestätigt.');
  if(Number(v?.draft?.teams)!==Number(ctx.teams))throw new Error(`FantasyPros-Teamzahl ${v?.draft?.teams??'–'} passt nicht zu Sleeper ${ctx.teams}.`);
  const fpNames=[...new Set(fpRosterNames(v).map(norm).filter(Boolean))], mineNames=new Set((ctx.mine||[]).map(x=>norm(ctx.players?.[x.player_id]?.full_name||`${ctx.players?.[x.player_id]?.first_name||''} ${ctx.players?.[x.player_id]?.last_name||''}`)).filter(Boolean));
  const overlap=fpNames.filter(n=>mineNames.has(n)).length,needed=Math.min(fpNames.length,Math.max(4,Math.ceil(fpNames.length*.6)));
  if(fpNames.length>=4&&overlap<needed)throw new Error(`FantasyPros-Kader passt nicht sicher zu diesem Draft (${overlap}/${fpNames.length} Treffer).`);
  return{overlap,total:fpNames.length};
}
function fpSummary(v){
  if(!v)return 'Noch kein FantasyPros-Benchmark für diesen Draft importiert.';
  const o=v.result?.overall||{},p=v.result?.projectedStanding||{},st=v.result?.starters||{},bn=v.result?.bench||{};
  return `Importiert: ${o.grade||'–'} / ${o.scoreRounded??'–'} · Projected #${p.rank??'–'} (${p.score??'–'}) · Starter #${st.rank??'–'} · Bench #${bn.rank??'–'}.`;
}
function renderFpHandoff(draftId,complete){
  if(!els.fpHandoff)return;els.fpHandoff.hidden=!complete;if(!complete)return;
  const v=getFpBenchmark(draftId);els.fpStatus.className=`notice ${v?'ok':'warn'}`;els.fpStatus.textContent=fpSummary(v);
}
let lastPostDraftPairs=[];
let analysisBusy=false,lastEmergencyQueueText='',lastSnapshotFingerprint=store.text('v116_lastSnapshotFingerprint',''),lastAnalysisFingerprint=store.text('v124_lastAnalysisFingerprint',''),lastSnapshotPickCount=Number(store.text('v116_lastSnapshotPickCount','-1'));
function snapshotFingerprint(id,picks,slot){
  const tail=picks.slice(-8).map(p=>`${p.pick_no}:${p.player_id}:${p.draft_slot}`).join('|');
  return `${id}|${slot}|${picks.length}|${tail}`;
}
function setAnalysisBusy(busy){
  analysisBusy=busy;
  els.refreshBtn.disabled=busy;
  els.copyBtn.disabled=busy || !els.snapshot.value;
  els.shareBtn.disabled=busy || !els.snapshot.value;
  if(els.queueBtn)els.queueBtn.disabled=busy || !lastEmergencyQueueText;
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
const RESEARCH_CACHE_MAX_EVENTS=320;
function loadResearchEvents(){try{const v=JSON.parse(localStorage.getItem(researchCacheKey())||'[]');return Array.isArray(v)?v:[]}catch{return []}}
function compactResearchEvents(events){
  const rows=Array.isArray(events)?events:[],seen=new Set(),out=[];
  for(let i=rows.length-1;i>=0;i--){const e=rows[i],id=evidenceIdentity(e);if(seen.has(id))continue;seen.add(id);out.push(e);if(out.length>=RESEARCH_CACHE_MAX_EVENTS)break}
  return out.reverse();
}
function saveResearchEvents(events){
  const key=researchCacheKey(),previous=localStorage.getItem(key),compact=compactResearchEvents(events);
  try{localStorage.setItem(key,JSON.stringify(compact));return{ok:true,count:compact.length,compacted:compact.length<(events?.length||0)}}
  catch(err){
    // Quota recovery is fail-safe: never delete the existing evidence cache. Retry with progressively smaller tails.
    for(const limit of [240,180,120,80]){try{const smaller=compact.slice(-limit);localStorage.setItem(key,JSON.stringify(smaller));return{ok:true,count:smaller.length,compacted:true,quotaRecovered:true}}catch{}}
    // Best effort restore if a browser partially disturbed the key; normally setItem is atomic and previous remains intact.
    if(previous!==null&&localStorage.getItem(key)!==previous){try{localStorage.setItem(key,previous)}catch{}}
    return{ok:false,error:err,count:loadResearchEvents().length};
  }
}
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
  const e={id:input.id||`ev_${now}_${Math.random().toString(36).slice(2,8)}`,observedAt:Number(input.observedAt||now),sourcePublishedAt:critical?(published||0):(published||Number(input.observedAt||now)),eventOccurredAt:eventAt||null,currentStatusCorroboratedAt:corroboratedAt||null,ingestedAt:Number(input.ingestedAt||now),playerId:String(input.playerId||''),playerKey:norm(input.playerName||input.playerKey||''),evidenceType:String(input.evidenceType||'unknown'),thesisPath:String(input.thesisPath||''),sourceId:String(input.sourceId||''),sourceOriginality:String(input.sourceOriginality||'unknown'),confidence:clamp(Number(input.confidence??.5),0,1),flags:Array.isArray(input.flags)?input.flags.slice(0,8):[],payload:input.payload||{},freshnessVerified:critical?freshnessVerified:true,critical};
  const events=loadResearchEvents();if(events.some(x=>evidenceIdentity(x)===evidenceIdentity(e)))return {added:false,event:e};events.push(e);const saved=saveResearchEvents(events);if(!saved.ok)return {added:false,event:e,storageFull:true,error:saved.error};updateResearchCacheStatus();return {added:true,event:e,compacted:saved.compacted,quotaRecovered:saved.quotaRecovered};
}
function researchEventsAt(cutoff=Infinity){return loadResearchEvents().filter(e=>Number(e.sourcePublishedAt||e.observedAt||0)<=cutoff)}
function researchPlayerState(p,cutoff=Infinity){const key=norm(p.name),pid=String(p.id||'');return researchEventsAt(cutoff).filter(e=>(pid&&e.playerId===pid)||e.playerKey===key).sort((a,b)=>a.sourcePublishedAt-b.sourcePublishedAt)}
function actionableResearchEvents(p,cutoff=Infinity){return researchPlayerState(p,cutoff).filter(e=>!e.critical||e.freshnessVerified===true)}
function researchHint(p,cutoff=Infinity){const all=researchPlayerState(p,cutoff),ev=actionableResearchEvents(p,cutoff);if(!all.length)return '';const rejected=all.length-ev.length;if(!ev.length)return rejected?`${rejected} kritische Meldung(en) wegen ungeprüfter Ereignis-Aktualität ignoriert`:'';const latest=ev[ev.length-1],age=Math.round((Date.now()-Number(latest.sourcePublishedAt||latest.observedAt))/3600000),flags=[...new Set(ev.flatMap(x=>x.flags||[]))].slice(-4).join(', '),suffix=rejected?` · ${rejected} stale/unverifiziert ignoriert`:'';return flags?`${flags}${age<48?` · Cache ${age}h`:' · Cache veraltet'}${suffix}`:`${ev.length} Evidence-Event(s)${suffix}`}
function updateResearchCacheStatus(){if(!els.researchCacheStatus)return;const e=loadResearchEvents();const players=new Set(e.map(x=>x.playerId||x.playerKey).filter(Boolean));els.researchCacheStatus.textContent=e.length?`${e.length} Evidence-Events · ${players.size} Spieler · append-only`:'Noch keine versionierte Evidence gespeichert.'}
const WATCHER_FEED_URL='https://pitti-watcher.tim-muero.workers.dev/companion-feed';
const WATCHER_SYNC_META_KEY='v118_watcherFeedMeta';
function watcherPayload(row){try{return JSON.parse(row?.payload_json||'{}')}catch{return{}}}
function watcherEvidenceInput(row){
  const payload=watcherPayload(row),diffs=payload?.diffs||{},observed=Number(row?.first_seen_at||row?.occurred_at||Date.now());
  if(String(row?.fundamental_or_market)==='market')return{id:`watcher_${row.id}`,playerId:String(row.player_id||''),evidenceType:String(row.event_type||'WATCHER_MARKET'),sourceId:String(row.original_source||row.source||'Sleeper Trending'),observedAt:observed,sourcePublishedAt:Number(row.occurred_at||observed),eventOccurredAt:Number(row.occurred_at||observed),thesisPath:String(row.thesis_link||'market_recognition'),sourceOriginality:'primary_platform_measurement',confidence:Number(row.confidence??.5),payload:{...payload,watcherEventId:row.id,watcherFeed:true}};
  const critical=Boolean(diffs.injury_status||diffs.practice_participation||diffs.status);
  return{id:`watcher_${row.id}`,playerId:String(row.player_id||''),evidenceType:critical?'WATCHER_INJURY_STATE_CHANGE':'WATCHER_ROLE_STATE_CHANGE',sourceId:String(row.original_source||row.source||'Sleeper Player Data'),observedAt:observed,sourcePublishedAt:0,eventOccurredAt:critical?0:Number(row.occurred_at||0),currentStatusCorroboratedAt:critical?observed:0,thesisPath:String(row.thesis_link||'player_state'),sourceOriginality:'primary_platform_state',confidence:Number(row.confidence??.5),payload:{...payload,watcherEventId:row.id,watcherFeed:true,chronologyNote:critical?'Sleeper state observation only; not a source publication timestamp':null}};
}
async function syncWatcherFeed(){
  if(els.watcherSyncStatus){els.watcherSyncStatus.className='notice';els.watcherSyncStatus.textContent='Pitti Watcher: prüfe öffentlichen read-only Feed …'}
  const c=new AbortController(),t=setTimeout(()=>c.abort(),4500);
  try{
    const r=await fetch(WATCHER_FEED_URL,{cache:'no-store',signal:c.signal});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const v=await r.json();
    if(v?.schema!=='draft-companion.watcher-feed.v1')throw new Error('Feed-Schema nicht verfügbar');
    const gate=String(v?.gate?.overall||'UNKNOWN');
    if(gate!=='PASS'){
      store.set(WATCHER_SYNC_META_KEY,{at:Date.now(),gate,watcherVersion:v?.watcherVersion||null,added:0});
      if(els.watcherSyncStatus){els.watcherSyncStatus.className=gate==='FAIL'?'notice bad':'notice warn';els.watcherSyncStatus.textContent=`Pitti Watcher: ${gate} · automatische Research-Ingestion bleibt AUS.`}
      return{ok:false,gate,added:0};
    }
    let added=0,rejectedCritical=0,storageFull=false,quotaRecovered=false;
    for(const row of Array.isArray(v.events)?v.events:[]){
      const input=watcherEvidenceInput(row),out=appendResearchEvidence(input);
      if(out.added)added++;
      if(out.storageFull)storageFull=true;
      if(out.quotaRecovered)quotaRecovered=true;
      if(out.event?.critical&&!out.event?.freshnessVerified)rejectedCritical++;
    }
    try{store.set(WATCHER_SYNC_META_KEY,{at:Date.now(),gate,watcherVersion:v.watcherVersion||null,generatedAt:v.generatedAt||null,added,rejectedCritical,storageFull,quotaRecovered})}catch{};
    if(added>0){updateResearchCacheStatus();rerenderPostDraftFromContext();}
    if(els.watcherSyncStatus){els.watcherSyncStatus.className=storageFull?'notice warn':'notice ok';els.watcherSyncStatus.textContent=storageFull?`Pitti Watcher: PASS · lokaler Evidence-Speicher voll; bestehender Cache bleibt erhalten, neue Events werden bis zur Speicherbereinigung nicht persistiert.`:`Pitti Watcher: PASS · ${added} neue Evidence-Events${quotaRecovered?' · Cache automatisch kompaktiert':''} · kritische State-Deltas ohne Quellenchronologie bleiben nicht-actionable (${rejectedCritical}).`}
    return{ok:true,gate,added,rejectedCritical,storageFull,quotaRecovered};
  }catch(e){
    if(els.watcherSyncStatus){els.watcherSyncStatus.className='notice warn';els.watcherSyncStatus.textContent=`Pitti Watcher nicht automatisch verfügbar (${e?.name==='AbortError'?'Timeout':e.message}). Bestehender Cache bleibt unverändert.`}
    return{ok:false,gate:'UNAVAILABLE',added:0};
  }finally{clearTimeout(t)}
}
/*
 * rc4.18 — Research Residual Shadow v2.
 *
 * This is deliberately orthogonal to Player Quality, Market Price, Return-v2 and
 * roster utility. It computes a counterfactual SHADOW score only; the live Coach
 * rawScore is untouched. The purpose is to collect prospective decision-time
 * evidence before any residual modifier is promoted to live weighting.
 *
 * Static 2026 priors below are short-lived research hypotheses, not timeless
 * player rankings. They expire before the draft freeze unless refreshed by the
 * versioned Research Cache. Structured cache events can supersede/extend them.
 */
const RESEARCH_RESIDUAL_MODEL_VERSION='shadow-v2.0';
const RESEARCH_PRIOR_EXPIRY=Date.parse('2026-08-24T00:00:00Z');
const RESEARCH_RESIDUAL_PRIORS={
  [norm('Jahmyr Gibbs')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'consistency',dir:0,strength:1,confidence:.95,display:true,causal:'Einziger RB mit mindestens 21 PPR-Punkten/Spiel in beiden letzten Saisons; dazu 500+ Receiving-Yards im Zweijahresfenster',invalidator:'Rollen- oder Effizienzbruch'}]},
  [norm('Bijan Robinson')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'dual_threat_elite',dir:0,strength:1,confidence:.95,display:true,causal:'Elite Dual-Threat-Profil: 2025 Top-3 bei Target Share, YPRR, Missed Tackles und Yards after Contact; zusätzlicher Goal-Line-Pfad 2026',invalidator:'unerwartete Rollenbegrenzung'}]},
  [norm("Ja'Marr Chase")]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_qb',dir:0,strength:1,confidence:.95,display:true,causal:'Bewährte WR-Elite mit Joe Burrow: 185 Targets sowie 125-1.412-8 in 2025',invalidator:'Knieproblem verschärft sich'},{kind:'current_knee_context',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Aktuell Knie-Hyperextension; Chase bezeichnete sie als gering und wäre nach eigener Aussage spielbereit',invalidator:'Schwellung oder erneute Einschränkung'}]},
  [norm('Puka Nacua')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_volume',dir:0,strength:1,confidence:.95,display:true,causal:'Extremes Volumen/Floor: 129 Receptions und 1.715 Receiving-Yards in 2025',invalidator:'gesundheitliche Einschränkung oder deutlicher Rollenverlust'},{kind:'current_psoas_context',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Psoas-Soreness: am 24.8. weiter ohne Teamtraining; zusätzlich mögliche NFL-Disziplinarmaßnahme noch ungeklärt. Atwell-Trade laut McVay ausdrücklich nur WR-Tiefe',invalidator:'volle Trainingsrückkehr plus geklärter Disziplinarstatus'}]},
  [norm('Jonathan Taylor')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'workhorse_volume',dir:0,strength:1,confidence:.95,display:true,causal:'Bewährtes Workhorse: 2025 #1 Snap Share, #2 Opportunity Share und #2 Red-Zone-Touches unter RBs',invalidator:'Colts-Offense/Quarterback limitiert Effizienz deutlich'},{kind:'qb_environment',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Ceiling hängt stark an Daniel Jones’ Achilles-Rückkehr; 2025 fiel Taylors Produktion ohne Jones deutlich ab',invalidator:'Jones kehrt effizient und stabil zurück'}]},
  [norm('Jaxon Smith-Njigba')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_share',dir:0,strength:1,confidence:.95,display:true,causal:'2025 Elite-Volumen: 119-1.793-10, 32,6% Target Share und 44,6% First-Read Share',invalidator:'deutlich geringere Nutzung nach Coordinator-Wechsel'}]},
  [norm('Amon-Ra St. Brown')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'consistency',dir:0,strength:1,confidence:.97,display:true,causal:'Elite-Konstanz: drei Jahre in Folge mindestens 1.250 Yards und 141 Targets; 172 Targets in 2025',invalidator:'unerwarteter Rollen- oder QB-Einbruch'}]},
  [norm('James Cook')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'workhorse_efficiency',dir:0,strength:1,confidence:.94,display:true,causal:'2025 NFL-Rushing-Leader mit 1.621 Yards, RB6 in Punkten/Spiel und weiter starker Explosivität/Yards after Contact; zusätzlicher Receiving-Ceiling bleibt vorhanden',invalidator:'Effizienz oder Lead-Rolle fällt deutlich zurück'},{kind:'receiving_ceiling_not_bankable',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Passing-Game-Nutzung blieb 2025 bei nur 40 Targets; RB1-overall-Ceiling setzt echte Third-Down-/Receiving-Ausweitung voraus',invalidator:'klar erweiterte Route-/Target-Rolle'}]},
  [norm('CeeDee Lamb')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_alpha_efficiency',dir:0,strength:1,confidence:.94,display:true,causal:'Bereinigt um zwei verkürzte Spiele: 2025 rund 24,8% Target Share, 89,4 Yards/Spiel und 2,51 YPRR; mit Dak weiterhin stabiler WR1-Unterbau',invalidator:'Target-Command oder Effizienz fällt trotz gesunder Rolle weiter'},{kind:'target_competition',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'George Pickens nahm 2025 Zielvolumen und TD-Ceiling weg; Lambs wöchentliche Dominanz war geringer als 2023/24',invalidator:'Lamb gewinnt wieder klar dominante First-Read-/Red-Zone-Rolle'}]},
  [norm('Justin Jefferson')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_share',dir:0,strength:1,confidence:.94,display:true,causal:'Trotz schwachem 2025 weiterhin 28,5% Target Share und 35,1% First-Read Share; klarer Alpha mit Rebound-Potenzial bei besserem QB-Spiel',invalidator:'Target-Command oder Trennung bleibt unter früherem Elite-Niveau'},{kind:'qb_efficiency_risk',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'2025 fielen Separation/Route-Win deutlich ab und die QB-Situation bleibt mit Murray/McCarthy nicht risikofrei',invalidator:'QB1 stabilisiert sich und Jeffersons per-route Effizienz normalisiert sich'}]},
  [norm('Brock Bowers')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_ceiling',dir:0,strength:1,confidence:.96,display:true,causal:'Als Rookie 112-1.194-5 auf 153 Targets; trotz 2025-PCL-Verletzung weiterhin starke per-route Effizienz und 2026 kaum echte WR1-Konkurrenz — realer TE1-overall-Pfad',invalidator:'Target-Volumen oder Beweglichkeit bleibt klar unter Rookie-Niveau'},{kind:'knee_recovery_context',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'2025 PCL-Verletzung/Bone Bruise beeinträchtigte fast die ganze Saison; Health ist der zentrale Gegenpfad zum Elite-Ceiling',invalidator:'voll belastbare Rolle ohne erkennbare Einschränkung'}]},

  [norm('David Montgomery')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{display:true,kind:'workhorse_volume',dir:1,strength:.74,confidence:.90,pricing:'PARTLY_PRICED',causal:'Houston behandelt Montgomery 2026 als klaren Lead-/Three-Down-Back; aktueller FantasyPros-Outlook erwartet eine Mixon-ähnliche Workload und sieht ihn als volumengetriebenen RB2 mit RB1-Ausreißerpfad',invalidator:'Woody Marks übernimmt deutlich mehr Early-Down- oder Goal-Line-Arbeit als aktuell erwartet'},{displayRisk:true,kind:'age_role_risk',dir:-1,strength:.46,confidence:.84,pricing:'PARTLY_PRICED',causal:'2025 fiel Montgomery in Detroit spät auf 32,1% Snap Rate und 8,2 Touches/Spiel zurück; mit 29 bleibt Rollen- und Altersrisiko trotz besserer Houston-Chance real',invalidator:'Houston bestätigt früh eine stabile 18+-Touch-/Goal-Line-Rolle'}]},
  [norm("D'Andre Swift")]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'lead_back_receiving_floor',dir:0,strength:1,confidence:.90,display:true,causal:'Chicago-Leadback mit belastbarem Receiving-Floor: 2025 trotz wechselnder Effizienz weiter klare Touch-/Route-Beteiligung; der Fantasy-Pfad kommt über Volumen plus Targets statt über einen sicheren Effizienzsprung',invalidator:'Monangai oder ein anderer Back übernimmt klar Early-Down-/Route-Anteile'},{kind:'efficiency_ceiling',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'Der Ceiling-Pfad bleibt volumenabhängig: Swifts Rushing-Effizienz und Goal-Line-Dominanz waren zuletzt nicht stabil genug für einen sicheren High-End-RB2-Ausreißer',invalidator:'klar verbesserte Effizienz plus dominante Red-Zone-Nutzung'}]},
  [norm('Lamar Jackson')]:{pos:'QB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_dual_threat_qb',dir:0,strength:1,confidence:.97,display:true,causal:'Elite Dual-Threat-Ceiling: Jackson verbindet effizientes Passing mit ligaweit seltenem QB-Rushing und bleibt dadurch ein realer Overall-QB1-Kandidat',invalidator:'Designed-Rushing oder Explosivität fällt deutlich'},{kind:'qb_opportunity_cost',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'In 1-QB ist der Preis der zentrale Gegenpfad: ein früher Jackson-Pick kostet einen RB/WR-Starter, während mehrere spielbare QBs später verfügbar bleiben',invalidator:'Jackson fällt deutlich unter seinen normalen Draftpreis'}]},
  [norm('Kyler Murray')]:{pos:'QB',expiresAt:Date.parse('2026-09-01T12:00:00Z'),components:[{display:true,kind:'expert_qualitative_upside',dir:1,strength:.62,confidence:.90,pricing:'PARTLY_PRICED',causal:'Fitzmaurice 27.08.: bevorzugter Mid/Late-QB; Karrierehistorie als QB1-Punkte/Spiel-Profil, Rushing-Floor und Jefferson/Addison unter Kevin O’Connell stützen Rebound-Ceiling',invalidator:'Rushing/gesundheitliche Rolle oder Passing-Effizienz bleibt klar unter früherem QB1-Niveau'}]},
  [norm('Malik Willis')]:{pos:'QB',expiresAt:Date.parse('2026-09-01T12:00:00Z'),components:[{display:true,kind:'expert_qualitative_upside',dir:1,strength:.72,confidence:.90,pricing:'POSSIBLY_UNPRICED',causal:'Fitzmaurice 27.08.: einer seiner drei Lieblings-QBs; außergewöhnlicher Rushing-Hebel plus verbesserter Passer. Miami behandelt ihn aktuell als Starter; Markt bleibt spät. Week-1-Fantasy-Floor bleibt wegen kleinem Starter-Sample und Passing-Translation unbewiesen',invalidator:'QB1-Status kippt, designed/read-option/red-zone rushing bleibt niedrig, Sack/Turnover- oder Passing-Effizienz verhindert spielbaren Floor'}]},
  [norm('Jared Goff')]:{pos:'QB',expiresAt:Date.parse('2026-09-01T12:00:00Z'),components:[{display:true,kind:'expert_qualitative_floor',dir:1,strength:.48,confidence:.88,pricing:'LIKELY_PRICED',causal:'Fitzmaurice 27.08.: Waffen, mögliche Shootouts, indoor-lastiger Schedule und mehrjährige Passing-Produktion ergeben stabilen Late-QB-Floor',invalidator:'Passvolumen/TD-Effizienz sinkt deutlich oder Offense/Spielumfeld liefert weniger Shootouts als erwartet'}]},

  [norm('Parker Washington')]:{pos:'WR',expiresAt:Date.parse('2026-09-01T12:00:00Z'),components:[{display:true,kind:'ascension',dir:1,strength:.82,confidence:.78,pricing:'PARTLY_PRICED',causal:'WR2 mit WR1-Upside · 2025 Effizienz + Vollzeit-Slot/Target-Pfad',invalidator:'route share falls behind healthy target competition'}]},
  [norm('Jalen Coker')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'WR',components:[{display:true,kind:'ascension',dir:1,strength:.72,confidence:.72,pricing:'PARTLY_PRICED',causal:'strong healthy-sample production + established Carolina WR2 role + Year-3 breakout window',invalidator:'route share falls materially or Bryce Young/pass-volume ceiling persists'}]},
  [norm('Zay Flowers')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'WR',components:[{display:true,kind:'ascension',dir:1,strength:.68,confidence:.78,pricing:'LIKELY_PRICED',causal:'career-high efficiency/target share + vacated targets + explicit expanded-usage plan',invalidator:'red-zone role and pass volume remain capped'}]},
  [norm('DeVonta Smith')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'WR',components:[{display:true,kind:'ascension',dir:1,strength:.78,confidence:.82,pricing:'PARTLY_PRICED',causal:'clear Philadelphia WR1 target path + strong prior efficiency without A.J. Brown',invalidator:'target tree stays diffuse or new scheme suppresses pass volume'}]},
  [norm('Malik Nabers')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'WR',components:[{display:true,kind:'elite_ceiling',dir:1,strength:.86,confidence:.86,pricing:'LIKELY_PRICED',causal:'elite pre-injury target/first-read/YPRR profile + improved QB ceiling',invalidator:'post-ACL explosiveness/target command does not return'},{displayRisk:true,kind:'injury_recurrence',dir:-1,strength:.82,confidence:.88,pricing:'PARTLY_PRICED',causal:'complex ACL/meniscus recovery with second procedure and possible early-season ramp',invalidator:'full team-work return with sustained pre-injury movement/usage'}]},
  [norm('Jeremiyah Love')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'RB',components:[{display:true,kind:'elite_rookie_role',dir:1,strength:.88,confidence:.86,pricing:'LIKELY_PRICED',causal:'No. 3 overall draft capital + starter usage + 11-58 preseason efficiency; Trey Benson waived/injured removes one backfield competitor',invalidator:'role becomes committee-heavy behind Conner/Allgeier or efficiency/receiving role disappoints'},{displayRisk:true,kind:'current_ankle',dir:-1,strength:.58,confidence:.90,pricing:'PARTLY_PRICED',causal:'High-Ankle-Sprain; restliche Preseason verpasst, Week-1-Verfügbarkeit bleibt bis zur vollen Trainingsrückkehr unsicher',invalidator:'full practice return without limitation before Week 1'}]},
  [norm('George Kittle')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'TE',components:[{display:true,kind:'elite_role',dir:1,strength:.74,confidence:.86,pricing:'LIKELY_PRICED',causal:'established elite TE receiving role if physically restored',invalidator:'route/target share materially reduced after return'},{displayRisk:true,kind:'achilles_recovery',dir:-1,strength:.86,confidence:.92,pricing:'PARTLY_PRICED',causal:'January Achilles tear creates early-season availability and post-injury efficiency uncertainty despite encouraging rehab',invalidator:'full-pads return plus sustained pre-injury movement/route usage'}]},
  [norm('Matthew Golden')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'WR',components:[{display:true,kind:'ascension',dir:1,strength:.70,confidence:.70,pricing:'POSSIBLY_UNPRICED',causal:'first-round talent + clearer Year-2 route path',invalidator:'remains rotational'}]},
  [norm('Quinshon Judkins')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'RB',components:[{display:true,kind:'role_environment',dir:1,strength:.58,confidence:.66,pricing:'PARTLY_PRICED',causal:'larger workload + improved blocking environment',invalidator:'committee/receiving cap persists'}]},
  [norm('Bhayshul Tuten')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'RB',components:[{display:true,kind:'efficiency',dir:1,strength:.55,confidence:.63,pricing:'POSSIBLY_UNPRICED',causal:'per-touch efficiency',invalidator:'efficiency fails with volume'},{displayRisk:true,kind:'role_uncertainty',dir:-1,strength:.52,confidence:.66,pricing:'PARTLY_PRICED',causal:'contested early-down/goal-line role',invalidator:'clear lead role emerges'}]},
  [norm('Jonathon Brooks')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'RB',components:[{display:true,kind:'ascension',dir:1,strength:.67,confidence:.68,pricing:'PARTLY_PRICED',causal:'healthy role expansion / Hubbard opportunity delta',invalidator:'Hubbard retains dominant role'},{displayRisk:true,kind:'injury_recurrence',dir:-1,strength:.58,confidence:.78,pricing:'PARTLY_PRICED',causal:'second ACL recovery risk',invalidator:'sustained healthy efficiency/availability'}]},
  [norm('Colston Loveland')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'TE',components:[{display:true,kind:'ascension',dir:1,strength:.78,confidence:.82,pricing:'LIKELY_PRICED',causal:'strong rookie receiving efficiency + route/target growth',invalidator:'late-season role does not persist'}]},
  [norm('Harold Fannin Jr.')]:{expiresAt:Date.parse('2026-09-02T12:00:00Z'),pos:'TE',components:[{display:true,kind:'talent',dir:1,strength:.66,confidence:.74,pricing:'LIKELY_PRICED',causal:'rookie target/YPRR profile',invalidator:'target share falls'},{displayRisk:true,kind:'competition',dir:-1,strength:.38,confidence:.62,pricing:'PARTLY_PRICED',causal:'added target competition',invalidator:'target command remains elite'}]},
  [norm('Christian McCaffrey')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_dual_threat_role',dir:0,strength:1,confidence:.95,display:true,causal:'Weiterhin seltenes Rushing-/Receiving-Ceiling: bei voller Gesundheit bleibt McCaffrey durch hohe Touch- und Target-Beteiligung ein realer RB1-overall-Kandidat',invalidator:'Rolle oder Receiving-Anteil fällt deutlich'},{kind:'decline_tail',dir:-1,strength:.55,confidence:.78,pricing:'LIKELY_PRICED',displayRisk:true,causal:'Age 30, extreme kumulierte NFL-Workload und wiederholte Verletzungshistorie erhöhen das Risiko eines abrupten Effizienz-/Availability-Rückgangs gegenüber jüngeren Elite-RBs',invalidator:'volle Gesundheit plus stabile Explosivität und Workload'},{kind:'current_camp_context',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Camp-Tightness zuletzt gemanagt; seit 24.8 wieder in Team-Drills, Auszeit laut McCaffrey Teil des Plans',invalidator:'erneute Trainingspause oder Belastungsrückschritt'}]},
  [norm('Derrick Henry')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_workhorse_td',dir:0,strength:1,confidence:.94,display:true,causal:'Weiterhin klarer Baltimore-Workhorse mit ligaweit seltenem Goal-Line-/TD-Ceiling; bei stabiler Effizienz bleibt ein Top-5-RB-Pfad trotz geringerem Receiving-Anteil realistisch',invalidator:'Goal-Line-Anteil oder Early-Down-Workload fällt deutlich'},{kind:'decline_tail',dir:-1,strength:.55,confidence:.78,pricing:'LIKELY_PRICED',displayRisk:true,causal:'Alter und extreme kumulierte NFL-Workload erhöhen das Risiko eines abrupten Effizienzrückgangs; Receiving-Floor ist niedriger als bei den Dual-Threat-RBs im gleichen Draftbereich',invalidator:'Explosivität und Yards after Contact bleiben bei voller Workload stabil'}]},
  [norm('Josh Jacobs')]:{pos:'RB',expiresAt:Date.parse('2026-09-08T12:00:00Z'),components:[{kind:'availability',dir:-1,strength:3,confidence:.98,displayRisk:true,causal:'Commissioner’s Exempt List: Jacobs darf derzeit weder trainieren noch spielen; Verfügbarkeit für Week 1 und darüber hinaus ist ungeklärt',invalidator:'NFL hebt Exempt-Status auf und Green Bay bestätigt aktive Spielberechtigung'}]},
  [norm('Saquon Barkley')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'workhorse_td_ceiling',dir:0,strength:1,confidence:.91,display:true,causal:'Trotz 2025-Regressionsjahr weiter ca. 300-Touch-Pfad plus zweistellige TD-Upside in Philadelphia; damit belastbarer Top-15-Floor und Top-5/7-Ceiling bei besserer Offense',invalidator:'Touch-Anteil oder Goal-Line-Rolle sinkt deutlich'},{kind:'decline_tail',dir:-1,strength:.48,confidence:.72,pricing:'LIKELY_PRICED',displayRisk:true,causal:'2025 fielen Explosive-Run-Rate und Yards after Contact deutlich; Alter und extreme Mehrjahres-Workload erhöhen das Effizienz-/Decline-Risiko',invalidator:'Effizienz reboundet bei stabiler Gesundheit und O-Line'}]},
  [norm('Chase Brown')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'workhorse_receiving',dir:0,strength:1,confidence:.94,display:true,causal:'Ab Week 7 2025 RB7 in Punkten/Spiel; mit Burrow zurück Weeks 13-17 sogar RB3. Dazu 69 Receptions und 437 Receiving-Yards — echter Dual-Threat-RB1-Pfad',invalidator:'Lead-/Receiving-Anteil fällt deutlich'},{kind:'role_competition',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Samaje Perine kann Third-Down-/Receiving-Arbeit abschneiden; Browns Ceiling hängt an stabil hohem Passspiel-Anteil',invalidator:'Brown dominiert Routes/Targets klar'}]},
  [norm("De'Von Achane")]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_efficiency_receiving',dir:0,strength:1,confidence:.95,display:true,causal:'2025 RB5 in Punkten/Spiel mit 1.838 Total-Yards; #1 Explosive-Run-Rate und 18,7% Target Share zeigen seltene Rushing- plus Receiving-Effizienz',invalidator:'Explosivität oder Lead-Rolle fällt deutlich'},{kind:'qb_target_suppression',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Malik Willis’ Rushing kann Checkdowns und RB-Targets deutlich reduzieren; Top-3/5-Ceiling ist stärker vom Receiving-Volumen abhängig als der RB1-Floor',invalidator:'Achane behält annähernd 2025-Target-Anteil'}]},
  [norm('Kenneth Walker III')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_efficiency_role',dir:0,strength:1,confidence:.94,display:true,causal:'2025 trotz Seattle-Nutzung #2 Explosive-Run-Rate und #1 Missed-Tackle-Rate; Kansas City gibt ihm einen klareren Lead-/Red-Zone-Pfad als 2025',invalidator:'Kansas City bleibt echte Committee-Nutzung oder Effizienz übersetzt nicht'},{kind:'current_foot',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Ende August wegen Fuß/Knöchel-Schwellung (laut Bericht durch Cleats ausgelöst) aus dem Training; kurzfristige Verfügbarkeit weiter prüfen, solange keine volle Trainingsfreigabe vorliegt',invalidator:'volle Trainingsfreigabe ohne Einschränkung'}]},
  [norm('Omarion Hampton')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'bellcow_ascension',dir:1,strength:.82,confidence:.91,pricing:'PARTLY_PRICED',display:true,causal:'Vor der 2025-Knöchelverletzung Weeks 1-4: 17 Touches und 95 Total-Yards/Spiel plus 10,1% Target Share; McDaniel-System eröffnet echten Three-Down-/Bellcow-Ceiling',invalidator:'Workload split oder Gesundheit limitiert Snap-/Route-Anteil'}]},
  [norm('Drake London')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_share',dir:0,strength:1,confidence:.95,display:true,causal:'Weeks 1-10 2025 WR6 in Punkten/Spiel bei 30,3% Target Share, 2,74 YPRR und 37,6% First-Read Share — klarer Alpha mit Top-5-Ceiling',invalidator:'Target-Command fällt trotz voller Gesundheit deutlich'},{kind:'qb_uncertainty',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'QB-Situation mit Penix-Reha/Tua begrenzt Effizienz-Sicherheit; Londons Volumen schützt den Floor, aber Top-5-Ceiling braucht stabiles QB-Spiel',invalidator:'QB1 liefert stabile überdurchschnittliche Effizienz'}]},
  [norm('Nico Collins')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_alpha_efficiency',dir:0,strength:1,confidence:.94,display:true,causal:'Drei WR1-Saisons in Folge nach Punkten/Spiel; 2025 23,1% Target Share, 74,5 Yards/Spiel und 24 Deep Targets — klarer Houston-Alpha mit Top-5-Ceiling bei Stroud-Rebound',invalidator:'Target-Command oder Downfield-Effizienz fällt deutlich'},{kind:'qb_environment',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'Ceiling hängt teilweise an C.J. Strouds Rebound; die letzten zwei Jahre war QB-Effizienz unter Rookie-Niveau',invalidator:'Stroud kehrt stabil zu überdurchschnittlicher Effizienz zurück'}]},
  [norm('George Pickens')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'spike_week_elite',dir:0,strength:1,confidence:.93,display:true,causal:'2025 WR5 in Punkten/Spiel; selbst mit CeeDee Lamb aktiv 15,0 Punkte/Spiel, 2,24 YPRR und 77,1 Yards/Spiel — echte WR1- und Spike-Week-Upside',invalidator:'Dak-Chemie oder Downfield-Rolle fällt zurück'},{kind:'weekly_volatility',dir:0,strength:1,confidence:.82,displayRisk:true,causal:'Big-Play-Profil bleibt volatiler als reine Target-Hogs; Lamb begrenzt den absoluten Target-Ceiling',invalidator:'First-Read-/Target-Anteil steigt klar'}]},
  [norm('Chris Olave')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_share',dir:0,strength:1,confidence:.95,display:true,causal:'2025 WR7 in Punkten/Spiel bei 27,2% Target Share und 33,8% First-Read Share; unumstrittener Saints-WR1 mit zusätzlichem Shough-Entwicklungspfad',invalidator:'Target-Dominanz oder Downfield-Rolle fällt deutlich'},{kind:'td_regression',dir:0,strength:1,confidence:.8,displayRisk:true,causal:'Neun TDs waren Karrierehoch; ein Teil der 2025-Spitze kann über Touchdown-Regression zurückkommen',invalidator:'Red-Zone-/End-Zone-Nutzung bleibt auf 2025-Niveau'}]},
  [norm('Kyren Williams')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'red_zone_lead_role',dir:0,strength:1,confidence:.93,display:true,causal:'Drei Jahre in Folge RB1-Niveau nach Punkten/Spiel; trotz Corum behielt er Weeks 7-18 rund 63% der Red-Zone-Rushing-Attempts in einer starken Rams-Offense',invalidator:'Corum übernimmt Red-Zone- oder klare Lead-Arbeit'},{kind:'committee_ceiling',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'Corum nahm mehr Early-Down-Arbeit; Williams’ Ceiling ist stärker TD-/Red-Zone-getrieben als bei einem echten Bellcow',invalidator:'Snap-/Route-Anteil steigt wieder klar'}]},
  [norm('Trey McBride')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_ceiling',dir:0,strength:1,confidence:.98,display:true,causal:'2025 TE1 mit 169 Targets, 126 Receptions, 1.239 Yards und 11 TDs; 25,4% Target Share und 33,8% First-Read Share — echter TE1-overall-Anker',invalidator:'Passvolumen oder Target-Anteil fällt deutlich'},{kind:'volume_regression',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'Arizona führte 2025 die Liga bei Passrate an; mehr Jeremiyah Love und Marvin-Harrison-Involvement können das historische Volumen drücken',invalidator:'Offense bleibt ähnlich passlastig und McBride hält First-Read-Anteil'}]},
  [norm('Ashton Jeanty')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'workhorse_environment_rebound',dir:0,strength:1,confidence:.92,display:true,causal:'2025 trotz schwachem Umfeld 321 Touches, #1 Opportunity Share und RB15 in Punkten/Spiel; bessere Line/Kubiak-Offense eröffnet klaren RB1-Rebound',invalidator:'Opportunity Share sinkt oder Offense bleibt Bottom-5'},{kind:'current_ankle',dir:0,strength:1,confidence:.98,displayRisk:true,causal:'Aktuelle Sprunggelenkverletzung ist vor Draft ein harter Freshness-Gate; Belastbarkeit und Week-1-Rolle müssen bestätigt sein',invalidator:'volle Trainingsfreigabe ohne Einschränkung'}]},
  [norm('Javonte Williams')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'efficiency_volume',dir:0,strength:1,confidence:.91,display:true,causal:'2025 RB11 in Punkten/Spiel mit 1.201 Rushing-Yards und 13 TDs; #3 Yards after Contact/Attempt stützt mehr als nur volumengetriebene Produktion',invalidator:'Effizienz oder Lead-Rolle sinkt deutlich'},{kind:'second_half_td_variance',dir:0,strength:1,confidence:.82,displayRisk:true,causal:'Weeks 9-17 nur RB25 durch deutlich weniger TDs; Floor ist eher Low-End-RB1 als sichere Top-5-Produktion',invalidator:'Red-Zone-Volumen bleibt hoch und TD-Rate normalisiert nach oben'}]},
  [norm('Josh Allen')]:{pos:'QB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_rushing_qb',dir:0,strength:1,confidence:.98,display:true,causal:'Viermal QB1 in Punkten/Spiel in sechs Jahren; drei Jahre in Folge mindestens 524 Rushing-Yards und 12 Rushing-TDs — einzigartiger Floor plus Overall-QB1-Ceiling',invalidator:'Designed-/Red-Zone-Rushing wird klar reduziert'},{kind:'passing_ceiling',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'2025 Sechsjahrestief bei Passing-Yards/Spiel und Pass-TDs; fehlende Elite-WR-Produktion begrenzt den reinen Passing-Ceiling',invalidator:'D.J. Moore hebt Passing-Effizienz/Explosivität deutlich'}]},
  [norm('Tee Higgins')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'efficient_wr2_ceiling',dir:0,strength:1,confidence:.93,display:true,causal:'2025 WR12 overall; mit Burrow Weeks 14-18 2,20 YPRR und 67,8 Yards/Spiel — High-End-WR2 mit WR1-Upside in Elite-Passoffense',invalidator:'Burrow-Verfügbarkeit oder per-route Effizienz fällt'},{kind:'target_cap',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'Ja’Marr Chase begrenzt den absoluten Target-Anteil; Higgins’ Top-Ceiling braucht Effizienz/TDs oder Chase-Ausfall',invalidator:'Target Share steigt trotz Chase deutlich'}]},
  [norm('Rashee Rice')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_target_efficiency',dir:0,strength:1,confidence:.92,display:true,causal:'2025 in gesunden Spielen 26,2% Target Share, 71,4 Yards/Spiel, 2,28 YPRR und 31,9% First-Read Share — klarer Mahomes-Target-Hog mit WR1/2-Ceiling',invalidator:'Target-Hierarchie oder Explosivität fällt'},{kind:'availability_risk',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Knie-Scope und keine volle Saison seit 2023 erhöhen aktuelle Availability-Risiken; Ceiling ist stark, Bankability geringer',invalidator:'volle Belastbarkeit und stabiler Trainingsstatus'}]},
  [norm('Garrett Wilson')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'target_monster_rebound',dir:1,strength:.72,confidence:.9,pricing:'PARTLY_PRICED',display:true,causal:'Vor der 2025-Knieverletzung WR10 in Punkten/Spiel bei 31,2% Target Share und 45,9% First-Read Share — klarer Jets-Alpha mit WR1-Rebound-Pfad',invalidator:'Knie/Target-Command kehrt nicht zurück'} ,{kind:'target_competition',dir:0,strength:1,confidence:.82,displayRisk:true,causal:'Neue Waffen können den extremen 2025-First-Read-Anteil reduzieren; Geno hebt Floor, garantiert aber keinen Elite-Pass-Ceiling',invalidator:'Wilson hält >28% Targets bei verbesserter QB-Effizienz'}]},
  [norm('Jaylen Waddle')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'volume_environment_ascension',dir:1,strength:.76,confidence:.91,pricing:'PARTLY_PRICED',display:true,causal:'Wechsel nach Denver bringt ihn aus #29 Neutral-Passrate in eine 2025 Top-4-Passvolumen-Offense; zugleich Top-12 in TPRR/YPRR/Separation — WR1-Upside bei WR2-Preis',invalidator:'Sutton/Verteilung verhindert klare Featured-Receiver-Rolle'}]},
  [norm('Breece Hall')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'efficiency_environment_rebound',dir:1,strength:.62,confidence:.88,pricing:'PARTLY_PRICED',display:true,causal:'2025 trotz Jets-Offense #4 Explosive-Run-Rate und #10 Missed-Tackle-Rate; stabile starke Line plus besseres Umfeld eröffnet RB1-Rebound',invalidator:'Receiving-Anteil bleibt bei Karriere-Tief oder Offense stagniert'},{kind:'receiving_role',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'2025 nur 10,9% Target Share; ohne Receiving-Rebound bleibt der Ceiling unter früheren Elite-Saisons',invalidator:'Routes/Targets steigen wieder klar'}]},
  [norm('Ladd McConkey')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'scheme_efficiency_rebound',dir:1,strength:.55,confidence:.8,pricing:'LIKELY_PRICED',display:true,causal:'Mike McDaniel plus weniger Keenan-Allen-Zielkonkurrenz eröffnen Rückkehr Richtung Rookie-Effizienz von 2,6 YPRR',invalidator:'Target Share bleibt um 20% und YPRR nahe 2025-Niveau'},{kind:'target_ceiling',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'2025 nur 19,8% Target Share, 1,47 YPRR und 20,4% First-Read Share; aktueller Preis verlangt einen klaren WR1-Näherungspfad, der noch nicht bewiesen ist',invalidator:'Camp/Start zeigt deutliche First-Read-/Target-Ascension'}]},
  [norm('A.J. Brown')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'alpha_role_rebound',dir:1,strength:.35,confidence:.90,display:true,causal:'New England hat Brown als primären Perimeter-/Red-Zone-Receiver neben Drake Maye aufgebaut; etablierte Elite-Effizienz und Alpha-Target-Historie geben weiterhin WR1/2-Ceiling',invalidator:'Target-/First-Read-Anteil oder Separation fällt klar unter frühere Alpha-Werte'},{kind:'decline_risk',dir:-1,strength:.45,confidence:.88,displayRisk:true,causal:'Mit 29 und wiederkehrender Soft-Tissue-Historie ist Availability/Separation weniger bankable als beim Peak; das erhöht Varianz, ohne den Alpha-Ceiling zu entfernen',invalidator:'volle Trainings-/Spielbelastung bei stabiler Separation'}]},
  [norm('Blake Corum')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'contingent_workhorse',dir:1,strength:.55,confidence:.82,pricing:'PARTLY_PRICED',display:true,causal:'2025 zeigte Corum in begrenzter Rolle brauchbare Effizienz; als klarer Rams-RB2 besitzt er bei Williams-Ausfall unmittelbaren Workhorse-/Red-Zone-Upside in einer starken Offense',invalidator:'Rams verteilen Ausfall-Workload auf mehrere Backs oder Corum verliert RB2-Rolle'}]},
  [norm('Rachaad White')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'receiving_role_upside',dir:1,strength:.52,confidence:.78,pricing:'PARTLY_PRICED',display:true,causal:'Drei Saisons mit mindestens 50 Catches plus Washington-Backfield ohne unumstrittenen Every-Down-Leader geben White einen realen Receiving-/RB2-Pfad bei Late-Round-Preis',invalidator:'Croskey-Merritt dominiert Early Downs und White verliert Routes/Targets'}]},
  [norm('Jordan Mason')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'contingent_rushing_upside',dir:1,strength:.46,confidence:.76,pricing:'PARTLY_PRICED',display:true,causal:'Masons physisches Early-Down-Profil bietet bei zusätzlicher Backfield-Arbeit touchdowngetriebenen RB2-Upside; der Wert kommt primär aus Rollenwachstum, nicht aus sicherem Receiving-Volumen',invalidator:'Rolle bleibt klarer Backup ohne Goal-Line-Zuwachs'}]},
  [norm('Jake Ferguson')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'volume_insurance_ceiling',dir:1,strength:.55,confidence:.86,pricing:'PARTLY_PRICED',display:true,causal:'2025 war Ferguson bei Lamb-Ausfall zeitweise TE1; selbst mit Lamb und Pickens hatte er häufig fünf-plus Catches. Dallas gibt ihm einen belastbaren Volumen-Floor plus Top-5-Ceiling bei WR-Ausfall',invalidator:'Route-/Target-Anteil sinkt deutlich bei voller Dallas-WR-Besetzung'}]},
  [norm('Juwan Johnson')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'target_role_upside',dir:1,strength:.48,confidence:.8,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Nach TE10-Finish 2025 und Shaheed-Abgang ist Johnson ein plausibler früher Second Read hinter Olave; Tysons Hamstring-Probleme erhöhen den kurzfristigen Target-Pfad',invalidator:'Tyson kehrt sofort voll zurück oder Johnson verliert Route-/Target-Anteil'}]},
  [norm('Malachi Fields')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'deep_sleeper_role',dir:1,strength:.5,confidence:.72,pricing:'POSSIBLY_UNPRICED',display:true,causal:'6-foot-5 Deep-/Red-Zone-Profil plus starke Camp-Berichte und offene Giants-Zielhierarchie hinter Nabers schaffen einen echten Last-Pick-TD-/Starter-Pfad',invalidator:'Mooney/Slayton halten Fields klar in Rotationsrolle'}]},
  [norm('Romeo Doubs')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'pass_environment_upside',dir:1,strength:.46,confidence:.77,pricing:'PARTLY_PRICED',display:true,causal:'New England bietet Doubs einen plausiblen WR2-Pfad hinter A.J. Brown und deutlich höheres neutrales Passvolumen als sein 2025-Green-Bay-Umfeld; Maye schafft Effizienz-Upside',invalidator:'Doubs verliert klare WR2-Rolle oder Patriots-Passrate fällt deutlich'}]},
  [norm('Denzel Boston')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'rookie_alpha_path',dir:1,strength:.62,confidence:.84,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Second-round rookie has moved into Cleveland first-team work; size/contested-catch profile gives him a plausible perimeter/red-zone WR1 path at a near-free draft cost',invalidator:'Concepcion clearly commands targets while Boston remains rotational'}]},
  [norm("Ja'Kobi Lane")]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'rookie_redzone_path',dir:1,strength:.52,confidence:.76,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Baltimore has an unsettled WR2 role behind Flowers; Lane’s 6-foot-4 frame and vertical profile create a final-round red-zone/breakout path in Lamar Jackson’s offense',invalidator:'Lane remains rotational and fails to earn meaningful red-zone/routes share'}]},
  [norm('Keaton Mitchell')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'explosive_contingent_role',dir:1,strength:.57,confidence:.82,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Elite-speed back in Mike McDaniel’s Chargers scheme has space-touch spike-week upside plus contingent value if Hampton misses time',invalidator:'Mitchell remains a low-volume gadget back even when backfield opportunity opens'}]},
  [norm("De'Zhaun Stribling")]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'open_target_path',dir:1,strength:.58,confidence:.78,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Multiple late-August analyst discussions flag an unusually open runway relative to price; the value case is a cheap route/target-share breakout rather than a safe floor',invalidator:'Stribling fails to secure a starting route share before Week 1'}]},
  [norm('Terrance Ferguson')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'year2_te_breakout',dir:1,strength:.59,confidence:.8,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Year-2 athletic TE has drawn positive Rams camp reports and offers a cheap route/target breakout path in a productive passing environment',invalidator:'Ferguson remains in a low-route committee role'}]},
  [norm('Isaiah Likely')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'featured_te_role',dir:1,strength:.55,confidence:.8,pricing:'PARTLY_PRICED',display:true,causal:'Move to the Giants removes the long-standing Mark Andrews target block; prior big-play efficiency gives Likely a plausible featured-TE breakout path around a late-middle-round price',invalidator:'Giants usage keeps Likely in a part-time route role'}]},
  [norm('Tre Tucker')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'deep_value_projection',dir:1,strength:.48,confidence:.7,pricing:'POSSIBLY_UNPRICED',display:true,causal:'Fresh projection-based sleeper work identifies Tucker as a player whose late cost can be beaten materially if his route/volume assumptions rise even modestly',invalidator:'Route share or target rate remains replacement-level'}]},
  [norm('Luther Burden')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'slot_breakout',dir:1,strength:.62,confidence:.84,pricing:'PARTLY_PRICED',display:true,causal:'Starker 2025-Schlussspurt plus Ben-Johnson-Slotrolle geben Burden einen echten Year-2-Breakout-Pfad',invalidator:'Odunze/Loveland begrenzen Targets klar oder Burden bleibt nur Teilzeit'},{kind:'current_groin',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'Leistenverletzung kostete fast drei Camp-Wochen; inzwischen zurück in Individual-Drills, Week-1-Ramp bleibt aber zu prüfen',invalidator:'volle Team-Teilnahme ohne Einschränkung'}]},
  [norm('Davante Adams')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'td_role_ceiling',dir:0,strength:1,confidence:.9,display:true,causal:'2025 ligaweit 14 Receiving-TDs in nur 14 Spielen; McVay/Stafford halten den Red-Zone-Ceiling weiterhin hoch',invalidator:'Red-Zone-Rolle oder Stafford-Effizienz fällt deutlich'},{kind:'age_td_regression',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Mit 33 und nur 60 Catches/789 Yards war 2025 stark TD-getrieben; ohne erneute zweistellige TD-Zahl sinkt der Wochenfloor klar',invalidator:'Target-/Yardage-Volumen steigt deutlich'}]},
  [norm('Terry McLaurin')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'bounceback_alpha',dir:1,strength:.58,confidence:.88,pricing:'PARTLY_PRICED',display:true,causal:'Trotz verletzungsgeprägtem 2025 blieben Target-per-route, YPRR und First-Down-per-route stark; klarer Bounceback-WR2-Pfad',invalidator:'Target-Anteil fällt durch neue Konkurrenz deutlich'},{kind:'target_competition',dir:0,strength:1,confidence:.82,displayRisk:true,causal:'Stefon Diggs und weitere neue Targets reduzieren die Chance auf einen 2024-artigen Target-Hog-Ausreißer',invalidator:'McLaurin dominiert First Reads klar'}]},
  [norm('Christian Watson')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'alpha_deep_redzone',dir:1,strength:.68,confidence:.86,pricing:'PARTLY_PRICED',display:true,causal:'Nach Rückkehr 2025 Green Bays bevorzugtes Deep-/Red-Zone-Ziel mit 34% Air-Yard-Share; vacated targets erhöhen 2026 den Volumenpfad',invalidator:'Love verteilt Targets wieder breit oder Watson verliert Red-Zone-Rolle'},{kind:'durability_variance',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Mehrjährige Soft-Tissue-/Kniehistorie macht Availability und Wochenfloor volatiler als der Ceiling',invalidator:'volle Saison bei stabiler Snap- und Route-Rate'}]},
  [norm('Mike Evans')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'td_ceiling',dir:0,strength:1,confidence:.84,display:true,causal:'Weiter echter End-Zone-/TD-Pfad; in Shanahan-Offense kann Evans auch mit moderatem Volumen Spike-Weeks liefern',invalidator:'Red-Zone-Target-Anteil bleibt niedrig'},{kind:'age_health_volume',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'33 Jahre, 12 verpasste Spiele in zwei Jahren und zuletzt Karriere-Tief bei Yards/Spiel/Yards pro Target; zudem verteilt SF Targets stark auf TE/RB',invalidator:'volle Gesundheit plus klarer WR1-Target-Anteil'}]},
  [norm('DJ Moore')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'qb_environment_rebound',dir:1,strength:.55,confidence:.82,pricing:'PARTLY_PRICED',display:true,causal:'Josh Allen ist ein klarer QB-Upgrade und Buffalo sucht wieder einen verlässlichen Perimeter-WR1; Moores Separation bleibt brauchbar',invalidator:'Buffalo verteilt Targets weiter stark und Moore bleibt unter ~20% Share'},{kind:'volume_uncertainty',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'2025 nur 14,3% Target Share; Bills bleiben run-first und verteilen Targets, daher ist ein echter Target-Hog-Rebound nicht garantiert',invalidator:'Camp/Season zeigt klaren First-Read-Anstieg'}]},
  [norm('Travis Etienne')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'lead_role_efficiency',dir:0,strength:1,confidence:.9,display:true,causal:'Nach 2025-Karrierehoch bei TDs und effizientem Rushing geht Etienne als Saints-Leadback in eine Rolle mit möglichem Snap-Zuwachs',invalidator:'Early-Down-/Goal-Line-Anteil wird klar geteilt'},{kind:'receiving_committee',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Passing-Game-Ceiling hängt daran, wie viel Kamara auf Third Downs/Targets behält; Etienne blieb zuletzt unter 40 Catches',invalidator:'Etienne übernimmt klare Passing-Down-Rolle'}]},
  [norm('Jameson Williams')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'established_explosive_wr2',dir:0,strength:1,confidence:.92,display:true,causal:'2025 mit 1.182 Yards, knapp 18 Yards/Catch und 16 Red-Zone-Targets längst mehr als nur Deep Threat; echte week-winning WR2-Upside',invalidator:'Intermediate-/Red-Zone-Nutzung fällt zurück'},{kind:'target_ceiling',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Amon-Ra bleibt Detroits primärer Target-Anker; Williams braucht Effizienz und Big Plays für WR1-Wochen statt sicheren Target-Hog-Floor',invalidator:'First-Read-/Target-Anteil steigt klar'}]},
  [norm('J.K. Dobbins')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'early_down_efficiency',dir:0,strength:1,confidence:.9,display:true,causal:'Vor der 2025-Fußverletzung rund 16,4 Touches und 80,6 Total-Yards/Spiel; explosive Early-Down-Effizienz hält einen RB2-/Flex-Pfad offen',invalidator:'Denver reduziert Early-Down-/Goal-Line-Anteil klar'},{kind:'durability_receiving_cap',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Wiederholte schwere Verletzungen plus 2025 kaum Receiving-Arbeit machen Saison-Floor und PPR-Ceiling deutlich fragiler',invalidator:'volle Gesundheit plus klar erweiterte Passing-Down-Rolle'}]},
  [norm('Jayden Reed')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'post_hype_slot',dir:0,strength:1,confidence:.9,display:true,causal:'Green Bay verlängerte mit Reed und räumte Veteran-Targets frei; Effizienz und Slot-Explosivität geben echten Post-Hype-Rebound-Pfad',invalidator:'Route Participation bleibt klar unter Vollzeitniveau'},{kind:'route_uncertainty',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'2025 war stark verletzungsgeprägt und seine Fantasy-Decke hängt weiterhin daran, ob Green Bay ihm dauerhaft mehr Routes statt nur schematische Touches gibt',invalidator:'stabile Vollzeit-Route-Rate etabliert sich'}]},
  [norm('Jordan Addison')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'qb_bounceback',dir:0,strength:1,confidence:.88,display:true,causal:'2025 produzierte Addison bei kompetentem QB-Spiel deutlich besser; verbesserte Vikings-QB-Situation erhält seinen Downfield-/Splash-Play-Rebound',invalidator:'QB-Effizienz bleibt schwach oder Target-Anteil sinkt'},{kind:'volume_variance',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Downfield-Profil erzeugt Wochenvolatilität und begrenzte Catch-Volumina; zusätzlicher Red-Zone-Wettbewerb deckelt den sicheren Floor',invalidator:'First-Read- und Short/Intermediate-Targets steigen klar'}]},
  [norm('Quentin Johnston')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'downfield_redzone_role',dir:0,strength:1,confidence:.88,display:true,causal:'2025 Karrierebestwert und WR25-Punkte/Spiel-Phasen zeigen echten Downfield-/Red-Zone-Ceiling in Herberts Offense',invalidator:'Vollzeitrolle oder Red-Zone-Nutzung fällt zurück'},{kind:'weekly_volatility',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Produktion brach nach stärkerer Target-Konkurrenz erneut ein; drei Jahre ohne stabiles Top-30-Finish halten den Wochenfloor unsicher',invalidator:'Target Share stabilisiert sich klar über früherem Niveau'}]},
  [norm('Jacory Croskey-Merritt')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'rushing_efficiency',dir:0,strength:1,confidence:.84,display:true,causal:'2025 zeigte brauchbare Zone-/Yards-after-contact-Effizienz und mehrere RB2-Wochen; Early-Down-Starterpfad bleibt vorhanden',invalidator:'Early-Down-Anteil fällt hinter Konkurrenz zurück'},{kind:'committee_receiving_cap',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'Washington-Backfield ist tief und Croskey-Merritt war 2025 kaum vertrauenswürdige Passing-Down-Option; Goal-Line/Third-Down-Rolle kann geteilt bleiben',invalidator:'klare Three-Down- und Goal-Line-Nutzung etabliert sich'}]},
  [norm('Michael Pittman')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'possession_volume',dir:0,strength:1,confidence:.88,display:true,causal:'Mehrjährige 111+-Target-Historie und starke Catch-Rate geben Pittman in Pittsburgh weiterhin einen belastbaren Possession-/WR3-Floor',invalidator:'DK Metcalf und weitere Targets drücken ihn klar unter stabile WR2-Route-Rate'},{kind:'ceiling_environment',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Yards/Spiel sind zwei Jahre gefallen; hinter Metcalf und mit alterndem QB ist der explosive Ceiling deutlich begrenzter als der Name vermuten lässt',invalidator:'Pittman führt Team bei Targets/Receptions klar'}]},
  [norm('Josh Downs')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'target_separation',dir:0,strength:1,confidence:.9,display:true,causal:'2025 erneut rund 24% Targets pro Route und starke Separation; mehr Routes könnten Downs zum stabilen PPR-WR3 machen',invalidator:'Route Participation bleibt begrenzt'},{kind:'target_competition',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'Keenan Allen, Tyler Warren und Alec Pierce konkurrieren um dieselben Targets; Downs braucht mehr Vollzeit-Routes für echten Ceiling-Sprung',invalidator:'Downs wird klarer Full-Time-Slot/First-Read'}]},
  [norm('Stefon Diggs')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'veteran_floor',dir:0,strength:1,confidence:.88,display:true,causal:'2025 trotz Alter zehn Spiele mit zweistelligem PPR-Output; kurze/mittlere Targets von Jayden Daniels stützen einen brauchbaren Bench-Floor',invalidator:'Route-Rate oder Targets fallen deutlich'},{kind:'age_target_ceiling',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Mit fast 33 und McLaurin als primärem Alpha ist Diggs eher Floor- als League-Winner-Profil; Volumen- und YAC-Ceiling sind begrenzt',invalidator:'Diggs übernimmt klaren 1A-Target-Anteil'}]},
  [norm('Kenny Gainwell')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'receiving_standalone',dir:0,strength:1,confidence:.9,display:true,causal:'Starker 2025-Schlussspurt mit hoher Target Share und Receiving-Effizienz gibt Gainwell auch hinter Bucky Irving einen eigenständigen PPR-Pfad',invalidator:'Passing-Down-Rolle fällt an andere Backs'},{kind:'lead_role_dependency',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Für echtes RB2-Ceiling braucht Gainwell zusätzliche Carries oder Irving-Ausfälle; als reiner Third-Down-Back bleibt Half-PPR begrenzt',invalidator:'Early-Down-Anteil steigt klar'}]},
  [norm('Xavier Worthy')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'post_hype_breakout',dir:0,strength:1,confidence:.86,display:true,causal:'Age-23-Speedprofil plus frei gewordene Veteran-Targets lassen nach enttäuschendem 2025 einen echten Post-Hype-Breakout mit Mahomes zu',invalidator:'Target-Anteil bleibt klar hinter Rice/Kelce'},{kind:'shoulder_target_hierarchy',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'Erneute Schulterprobleme im August und Rashee Rice als klarer Target-Hog erhöhen Availability-/Volumenrisiko; Worthy bleibt eher Ceiling-Stash als Floor-Pick',invalidator:'volle Gesundheit plus klarer Target-Share-Anstieg'}]},
  [norm('Woody Marks')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'passing_handcuff',dir:0,strength:1,confidence:.86,display:true,causal:'2025 als Starter rund 17,5 Touches/Spiel und brauchbare Receiving-Effizienz; hinter Montgomery realer Contingent-/Passing-Down-Pfad',invalidator:'Backup-/Route-Rolle fällt zurück'},{kind:'standalone_ceiling',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Per-touch-Effizienz war nur mittelmäßig und Montgomery dürfte Early Downs/Goal Line führen; ohne Ausfall ist Marks eher Bench-Handcuff als Starter',invalidator:'Committee kippt deutlich Richtung Marks'}]},
  [norm('Tyjae Spears')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'receiving_role',dir:0,strength:1,confidence:.82,display:true,causal:'Passing-Down-Erfahrung erhält einen flexiblen Receiving-Floor, falls Tennessee ihn weiter als Third-Down-Back nutzt',invalidator:'Passing-Down-Rolle geht an Konkurrenz'},{kind:'contingent_role_dilution',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Pollard plus Nicholas Singleton reduzieren selbst bei Ausfall die Garantie auf Workhorse-Volumen; 2025 Rushing-/Receiving-Effizienz war schwach',invalidator:'Spears sichert klare RB2- und Ausfall-Lead-Rolle'}]},
  [norm('Tank Bigsby')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_handcuff_efficiency',dir:0,strength:1,confidence:.92,display:true,causal:'2025 Topwerte bei Explosive-Run-, Missed-Tackle- und Yards-after-contact-Metriken; bei Barkley-Ausfall unmittelbarer Start-RB-Pfad in starker Eagles-Offense',invalidator:'verliert klare Backup-Rolle'},{kind:'standalone_volume',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Bei gesundem Saquon ist die wöchentliche Touch-Basis sehr klein; Wert ist stark ereignis-/Ausfallabhängig',invalidator:'regelmäßige 8-10+ Touches/Goal-Line-Rolle ohne Barkley-Ausfall'}]},
  [norm('Mike Washington')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'contingent_three_down',dir:0,strength:1,confidence:.92,display:true,causal:'Fourth-round Rookie mit 4.3-Speed, Größe und starkem Preseason-Output; bei Jeanty-Ausfall unmittelbarer volumengetriebener RB2-Pfad',invalidator:'verliert klare RB2-Rolle'},{kind:'standalone_volume',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'Bei gesundem Jeanty ist eher niedrige einstellige Touch-Zahl zu erwarten; primär Lottery-Ticket statt Wochenstarter',invalidator:'Kubiak etabliert echte Committee-Nutzung'}]},
  [norm('James Conner')]:{pos:'RB',expiresAt:Date.parse('2026-09-08T12:00:00Z'),components:[{kind:'ir_return',dir:-1,strength:2.4,confidence:.99,displayRisk:true,causal:'Arizona hat Conner beim finalen Cut auf IR/designated to return gesetzt; er verpasst damit mindestens die ersten vier Spiele',invalidator:'Aktivierung nach der Mindestpause plus volle Trainingsfreigabe'}]},
  [norm('Zach Charbonnet')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'preinjury_efficiency',dir:0,strength:1,confidence:.86,display:true,causal:'2025 vor der Playoff-ACL-Verletzung RB27-Punkte/Spiel mit starken Tackle-/YAC-Werten; gesund wäre ein brauchbarer Flex-Pfad vorhanden',invalidator:'Explosivität kehrt nicht zurück'},{kind:'acl_timeline',dir:0,strength:1,confidence:.96,displayRisk:true,causal:'Nach Playoff-ACL jetzt auf Reserve/PUP; damit verpasst er mindestens die ersten vier Spiele der Saison',invalidator:'Aktivierung nach Mindestpause plus volle Trainingsfreigabe und normale Explosivität'}]},
  [norm('Rashid Shaheed')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'big_play_role',dir:0,strength:1,confidence:.84,display:true,causal:'Explosives Deep-Play-Profil kann einzelne Spike-Weeks erzeugen und Seattle investierte langfristig in ihn',invalidator:'verliert WR2-/Deep-Route-Rolle'},{kind:'route_target_floor',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Nach Seattle-Trade 2025 nur geringe Route-/Target-Anteile in run-lastiger Offense; Half-PPR-Wochenfloor bleibt sehr niedrig',invalidator:'Route Share steigt dauerhaft Richtung 75%+'}]},
  [norm('Khalil Shakir')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'short_area_floor',dir:0,strength:1,confidence:.9,display:true,causal:'Josh-Allen-Vertrauen und kurze Targets ergeben weiterhin brauchbaren Catch-Floor als Bye-/Injury-Fill-in',invalidator:'Snap-/Target-Anteil fällt'},{kind:'ceiling_cap',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'DJ Moore nimmt Target Ceiling weg; Shakir war bereits WR39/WR33 nach Punkten/Spiel und bietet wenig Downfield-/TD-Upside',invalidator:'Shakir gewinnt klaren First-Read-/Red-Zone-Anteil'}]},
  [norm('Jalen Coker')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'wr2_route_path',dir:0,strength:1,confidence:.84,display:true,causal:'Starker 2025-Schlussspurt und gute Produktion bei 80%+ Snap Share geben einen günstigen Carolina-WR2-/Year-3-Pfad',invalidator:'Chris Brazzell oder andere Konkurrenz nimmt Vollzeit-Routes'},{kind:'offense_ceiling',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'Carolina-Passvolumen/QB-Effizienz begrenzen selbst bei WR2-Rolle den sicheren Ceiling; Coker braucht Bryce-Young-Schritt nach vorn',invalidator:'Offense wird klar überdurchschnittlich effizient'}]},
  [norm('Drake Maye')]:{pos:'QB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_dual_threat_qb',dir:0,strength:1,confidence:.95,display:true,causal:'2025 etablierte Maye sich als High-End-QB1 mit starkem Passing plus rund 450 Rushing-Yards; der Boden bleibt durch Rushing deutlich höher als bei reinen Pocket-QBs',invalidator:'Designed-/Scramble-Rushing oder Passing-Effizienz fällt klar'},{kind:'price_opportunity_cost',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'In 1QB ist der Positions-Opportunity-Cost hoch; Maye muss gegenüber späteren Rushing-QBs einen echten Wochenvorteil liefern',invalidator:'spätere QB-Tiers brechen deutlich weg'}]},
  [norm('Joe Burrow')]:{pos:'QB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_passing_qb',dir:0,strength:1,confidence:.96,display:true,causal:'Bei Gesundheit bleibt Burrow ein Elite-Passer in schneller, passlastiger Bengals-Offense mit Chase und Higgins; echter Top-3-Passing-Ceiling',invalidator:'Passing-Effizienz oder Waffenverfügbarkeit sinkt deutlich'},{kind:'injury_rushing_floor',dir:0,strength:1,confidence:.93,displayRisk:true,causal:'Mehrere schwere Ausfalljahre und wenig Rushing-Wert machen seinen Fantasy-Floor verletzungs- und TD-abhängiger als bei Dual-Threat-QBs',invalidator:'volle Saison plus stabiler Passing-TD-Output'}]},
  [norm('Rome Odunze')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'year3_alpha_path',dir:0,strength:1,confidence:.91,display:true,causal:'Vor dem 2025-Fußbruch WR21 in Punkten/Spiel mit 22,4% Target Share und 27,2% First-Read Share; frei gewordene Targets halten den Year-3-WR2-Upside-Pfad offen',invalidator:'Burden/Loveland drücken ihn klar aus der Target-Spitze'},{kind:'foot_recurrence',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Der Fußbruch bleibt ein echter Risikofaktor, weil Odunze selbst von einer neuen Normalität beim Pflanzen/Laufen gesprochen hat',invalidator:'dauerhaft volle Trainings-/Spielbelastung ohne Einschränkung'}]},
  [norm('Tucker Kraft')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'elite_per_route_te',dir:0,strength:1,confidence:.96,display:true,causal:'Vor dem ACL-Riss war Kraft TE1/TE2 nach Punkten pro Spiel mit 18,3% Target Share, 67 Yards/Spiel und Elite-YAC/2,71 YPRR; Top-5-TE-Ceiling bleibt real',invalidator:'per-route Effizienz oder Target-Rate fällt deutlich'},{kind:'acl_snap_ramp',dir:0,strength:1,confidence:.95,displayRisk:true,causal:'ACL-/Meniskus-Rückkehr kann die Route-/Snap-Zahl in der ersten Saisonhälfte begrenzen, auch wenn Week 1 aktuell auf Kurs ist',invalidator:'volle Route-Rate ohne Belastungsmanagement'}]},
  [norm('Sam LaPorta')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'efficient_te1',dir:0,strength:1,confidence:.93,display:true,causal:'Vor dem 2025-Rücken-Aus war LaPorta TE7 in Punkten/Spiel und blieb per Route effizient; Petzing-System bietet weiterhin Top-8- mit Top-5-Ceiling',invalidator:'Target-Rate bleibt dauerhaft niedrig oder Effizienz fällt'},{kind:'current_health_target_volume',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Camp-Hüftproblem hatte Week-1-Fragezeichen erzeugt; LaPorta kehrte am 26.8. in Team-Drills zurück. Gesundheit weiter prüfen; Target-Volumen lag zwei Jahre klar unter der Rookie-Saison',invalidator:'volle Gesundheit plus deutlicher Target-Anstieg'}]},
  [norm('Marvin Harrison Jr.')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'post_hype_volume',dir:0,strength:1,confidence:.9,display:true,causal:'Trotz chaotischem 2025 hielt Harrison vor den Ausfällen rund 22% Targets und 27% First Reads; als Year-3-Post-Hype-Pick bleibt ein volumengetriebener WR2-Pfad',invalidator:'Target-Command oder per-route Effizienz bleibt mittelmäßig'},{kind:'efficiency_qb_uncertainty',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'2025 war die per-route Effizienz trotz hoher Passrate nur durchschnittlich; QB-Spiel und Michael Wilson verhindern einen sicheren Alpha-Ceiling',invalidator:'Harrison gewinnt klaren First-Read-/End-Zone-Anteil'}]},
  [norm('Jaylen Warren')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'efficient_dual_role',dir:0,strength:1,confidence:.93,display:true,causal:'2025 RB18 in Punkten/Spiel mit starken Missed-Tackle-, YAC- und Receiving-Metriken; eigenständiger RB2-Pfad bleibt vorhanden',invalidator:'Snap-/Route-Anteil fällt deutlich'},{kind:'committee_role_risk',dir:0,strength:1,confidence:.91,displayRisk:true,causal:'Rico Dowdle und neuer Coaching-Staff machen die Workload-Verteilung unsicherer als 2025; Lead-Back-Status ist nicht garantiert',invalidator:'Warren übernimmt klar die Mehrheit der High-Value-Touches'}]},
  [norm('Brian Thomas Jr.')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'big_play_rebound',dir:0,strength:1,confidence:.87,display:true,causal:'Rookie-Talent und Downfield-Profil lassen trotz enttäuschendem 2025 weiterhin einen großen Big-Play-/TD-Rebound zu',invalidator:'Route-/First-Read-Rolle bleibt dauerhaft sekundär'},{kind:'target_role_volatility',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Nach Verletzungen fiel BTJ mit Meyers/Washington auf nur 14,9% Target Share und volatile Field-Stretcher-Nutzung; Alpha-Rückkehr ist unbewiesen',invalidator:'Target Share und First Reads steigen klar'}]},
  [norm('Harold Fannin Jr.')]:{pos:'TE',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'year2_te_volume',dir:0,strength:1,confidence:.93,display:true,causal:'Rookie-Saison mit 72-731-6 und Top-5-TE Target-/First-Read-Anteilen gibt Fannin einen belastbaren Year-2-TE1-Pfad',invalidator:'Route-/Target-Anteil fällt klar'},{kind:'target_qb_competition',dir:0,strength:1,confidence:.88,displayRisk:true,causal:'Denzel Boston/KC Concepcion erhöhen Konkurrenz und Clevelands QB-Situation begrenzt den absoluten Ceiling',invalidator:'Fannin bleibt klarer First-Read-Anker'}]},
  [norm('DK Metcalf')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'redzone_wr1_role',dir:0,strength:1,confidence:.88,display:true,causal:'Metcalf bleibt wahrscheinlich Pittsburghs primärer Perimeter-/Red-Zone-WR und besitzt damit WR2-Spike-Week-Ceiling',invalidator:'Pittman übernimmt klaren Target-/Red-Zone-Anteil'},{kind:'weekly_volume_volatility',dir:0,strength:1,confidence:.93,displayRisk:true,causal:'2025 lag er in neun von 15 Spielen außerhalb der Top 24; zusätzliche Target-Konkurrenz macht ihn eher volatilen WR3 als sicheren Alpha',invalidator:'Target Share stabilisiert sich deutlich über 2025'}]},
  [norm('Rico Dowdle')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'committee_lead_upside',dir:0,strength:1,confidence:.9,display:true,causal:'2025 als Carolina-Starter 18,6 Touches und 87,7 Total-Yards/Spiel; effiziente Rushing-/Receiving-Metriken geben ihm realen Pittsburgh-RB1-Committee-Pfad',invalidator:'Warren dominiert High-Value-Touches klar'},{kind:'committee_uncertainty',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'Warren und Dowdle teilen aktuell First-Team-Reps; Wochenvolumen ist ohne klare Rollenentscheidung unsicher',invalidator:'Dowdle übernimmt klare Mehrheit der Early-/Goal-Line-Touches'}]},
  [norm('Tony Pollard')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'leadback_volume_rebound',dir:0,strength:1,confidence:.92,display:true,causal:'2025 trotz miesem Umfeld Top-20 bei Snap-/Opportunity-Share; Daboll hat historisch einen Leadback genutzt und bessere Offense eröffnet starken RB2-Rebound',invalidator:'Backfield wird echtes Committee oder Offense bleibt Bottom-5'},{kind:'td_offense_dependency',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Nur fünf TDs und wenig Red-Zone-Arbeit machten ihn 2025 RB29; der Ceiling hängt stark an einem realen Titans-Offense-Sprung',invalidator:'Red-Zone-Touches steigen klar'}]},
  [norm('Courtland Sutton')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'pass_offense_redzone',dir:0,strength:1,confidence:.9,display:true,causal:'Sutton bleibt ein bewährtes Red-Zone-Ziel in einer passfreudigen Denver-Offense und kann als WR2/3 weiter stabile Wochen liefern',invalidator:'Red-Zone-Targets oder Route-Rate fallen klar'},{kind:'waddle_target_ceiling',dir:0,strength:1,confidence:.94,displayRisk:true,causal:'Jaylen Waddle dürfte Target-Alpha werden; Suttons 2025-Fantasyfinish übertraf seine per-route Nutzung und reduziert den sicheren Ceiling',invalidator:'Sutton hält First-Read-/Target-Anteil trotz Waddle'}]},
  [norm('Chris Godwin')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'late2025_efficiency',dir:0,strength:1,confidence:.89,display:true,causal:'Nach voller Rückkehr Weeks 13-18 wieder 1,88 YPRR und WR32-Punkte/Spiel; bei gesunder Rolle besitzt Godwin noch brauchbaren WR3/Flex-Wert',invalidator:'Route-/Target-Effizienz fällt trotz Gesundheit'},{kind:'age_injury_ceiling',dir:0,strength:1,confidence:.93,displayRisk:true,causal:'Zwei verletzungsgeprägte Jahre und Age-30 reduzieren Bankability und früheren Elite-Ceiling erheblich',invalidator:'volle Saison plus Rückkehr zu hohem Target-Anteil'}]},
  [norm('Jakobi Meyers')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'possession_target_floor',dir:0,strength:1,confidence:.92,display:true,causal:'Nach Jacksonville-Wechsel hielt Meyers selbst mit BTJ/Washington rund 23% Targets und 27% First Reads; verlässlicher WR3/Flex-Floor',invalidator:'Target Share fällt deutlich'},{kind:'qb_ceiling_dependency',dir:0,strength:1,confidence:.84,displayRisk:true,causal:'Sein Ceiling hängt daran, dass Trevor Lawrence den späten 2025-Effizienzsprung bestätigt; Big-Play-Profil bleibt begrenzter',invalidator:'Lawrence bleibt überdurchschnittlich und Meyers gewinnt Red-Zone-Volumen'}]},
  [norm('Chris Rodriguez Jr.')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'early_down_efficiency',dir:0,strength:1,confidence:.9,display:true,causal:'2025 als Starter 12,7 Touches/57,7 Yards und starke Missed-Tackle/YAC-Werte; als Coen-vertrauter Early-Down-Back realer Late-Round-Pfad',invalidator:'Tuten dominiert Early Downs klar'},{kind:'receiving_health_cap',dir:0,strength:1,confidence:.92,displayRisk:true,causal:'Nur vier Targets 2025 und aktueller Foot-Ramp begrenzen Half-PPR-Ceiling und sofortige Einsatzsicherheit',invalidator:'volle Gesundheit plus Passing-Down-Arbeit'}]},
  [norm('Aaron Jones')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'receiving_flex_role',dir:0,strength:1,confidence:.88,display:true,causal:'Jones bleibt als Receiving-Back effizient genug für PPR/Flex-Nutzen und dürfte Passing Downs vor Jordan Mason behalten',invalidator:'Route-/Target-Anteil fällt klar'},{kind:'age_durability_efficiency',dir:0,strength:1,confidence:.95,displayRisk:true,causal:'Age 32, fünf verpasste Spiele 2025 und schwache Early-Down-Effizienz machen Workhorse-/Saison-Ceiling fragil',invalidator:'volle Saison plus Effizienz-Rebound'}]},
  [norm("Wan'Dale Robinson")]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'target_earner_wr2',dir:0,strength:1,confidence:.92,display:true,causal:'2025 WR14-Punkte/Spiel mit 26,8% Targets/32,9% First Reads und mehr Downfield-Nutzung; Daboll-Verbindung erhält WR2/3-Pfad',invalidator:'Target Share fällt durch Tate/Ridley deutlich'},{kind:'qb_competition_ceiling',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Mehr Target-Konkurrenz und Cam-Ward-Entwicklung bestimmen, ob der 2025-Volumenpeak wiederholbar ist',invalidator:'Robinson bleibt klarer Top-2-Target-Earner bei gutem QB-Spiel'}]},
  [norm('Tyler Allgeier')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'touchdown_handcuff',dir:0,strength:1,confidence:.9,display:true,causal:'Acht TDs 2025 und klare Early-/Goal-Line-Fähigkeit geben Allgeier eigenständige Spike-Weeks plus starken Love-Handcuff-Pfad',invalidator:'Goal-Line-/RB2-Rolle fällt zurück'},{kind:'standalone_efficiency_cap',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Per-touch-Effizienz war 2025 unterdurchschnittlich; ohne TDs oder Love-Ausfall bleibt der Wochenfloor niedrig',invalidator:'Touch-Volumen steigt dauerhaft'}]},
  [norm('Deebo Samuel')]:{pos:'WR',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'yac_early_role',dir:0,strength:1,confidence:.88,display:true,causal:'Rückkehr nach San Francisco plus weiterhin starke YAC/Forced-Missed-Tackle-Werte geben einen frühen WR3-/Spike-Week-Pfad',invalidator:'WR2-Rolle fällt an Stribling oder Target Share sinkt'},{kind:'efficiency_decline',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'2025 fielen YPRR/First-Down-per-route trotz hoher Target Share ab; Mike Evans und Konkurrenz begrenzen den sicheren Ceiling',invalidator:'per-route Effizienz und Downfield-Rolle erholen sich klar'}]},
  [norm('Kaleb Johnson')]:{pos:'RB',expiresAt:Date.parse('2026-09-08T12:00:00Z'),components:[{kind:'gb_opportunity',dir:1,strength:1.6,confidence:.96,display:true,causal:'Green Bay hat Johnson nach Jacobs’ Exempt-List-Platzierung per Trade geholt; hinter Jacobs stehen aktuell Lloyd, Johnson und Chris Brooks, wodurch Johnson einen realen frühen Rollen-/Contingent-Pfad erhält',invalidator:'Jacobs kehrt sofort zurück und Johnson bleibt klar hinter Lloyd/Brooks ohne relevante Touches'}]},
  [norm('MarShawn Lloyd')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'explosive_contingent_back',dir:0,strength:1,confidence:.91,display:true,causal:'Starker Camp/Preseason und explosives Collegeprofil geben Standalone- plus unmittelbaren RB2-Upside-Pfad bei Jacobs-Ausfall',invalidator:'verliert klare RB2-/Change-of-pace-Rolle'},{kind:'durability_role',dir:0,strength:1,confidence:.9,displayRisk:true,causal:'Bisherige Availability bleibt die zentrale Unsicherheit; ohne Jacobs-Ausfall muss eigenständiges Volumen erst bewiesen werden',invalidator:'mehrwöchig stabile Rolle und Gesundheit'}]},
  [norm('Ray Davis')]:{pos:'RB',expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'cook_handcuff_efficiency',dir:0,strength:1,confidence:.9,display:true,causal:'In vier Spielen mit zweistelligen Carries im NFL-Sample rund 94 Rushing-Yards/Spiel bei 5,6 YPC; bei Cook-Ausfall unmittelbarer Volumen-/RB2-Pfad',invalidator:'verliert klare Early-Down-Backup-Rolle'},{kind:'standalone_passing_cap',dir:0,strength:1,confidence:.86,displayRisk:true,causal:'Bei gesundem Cook ist die Wochenrolle klein und Ty Johnson kann Passing Downs abziehen; primär Contingent-Stash',invalidator:'regelmäßige eigenständige 8-10+ Touch-Rolle'}]},
  [norm("Tyler Warren")]:{pos:"TE",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Rookie-TE mit unmittelbarem Receiving-Ceiling; Draftkapital und projizierte Route-Beteiligung geben ihm einen realen TE1-Pfad",invalidator:"Rookie-Anpassung oder geringere Route-Beteiligung"}]},
  [norm("Emeka Egbuka")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Polierter Rookie-Receiver mit Inside/Outside-Flexibilität und frühem Target-Pfad; Profil trägt sowohl Floor als auch Year-1-Upside",invalidator:"Target-Konkurrenz begrenzt frühes Volumen"}]},
  [norm("Tetairoa McMillan")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Großes Alpha-Profil mit starker Contested-Catch- und Downfield-Upside; kann früh eine dominante Team-Target-Rolle übernehmen",invalidator:"Rookie-Effizienz oder Quarterback-Spiel begrenzt Ceiling"}]},
  [norm("Cam Skattebo")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Kontaktstarker Rookie mit Three-Down-Fähigkeiten und Receiving-Nutzen; bei wachsender Rolle klarer Upside-Pfad",invalidator:"Backfield-Aufteilung hält Touch-Volumen niedrig"}]},
  [norm("Jayden Daniels")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Elite-Fantasyprofil durch Rushing-Floor plus explosives Passing; besitzt wöchentliches Overall-QB1-Ceiling",invalidator:"Rushing-Volumen oder Passing-Effizienz fällt zurück"}]},
  [norm("TreVeyon Henderson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Explosiver Rookie mit Receiving-Fähigkeit und Big-Play-Ceiling; zusätzliche Rolle kann schnell Fantasy-Wert freisetzen",invalidator:"Backfield-Split begrenzt frühe Touches"}]},
  [norm("Jadarian Price")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Athletischer Upside-Back mit Wert über Explosivität und möglicher Rollenexpansion; interessant sobald Touch-Anteil steigt",invalidator:"Depth-Chart-Rolle bleibt zu klein"}]},
  [norm("Jalen Hurts")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Elite-Fantasy-Floor durch Goal-Line- und Rushing-Nutzung bei gleichzeitig starkem Passing-Umfeld",invalidator:"Rushing-TD-Anteil oder Designed Runs sinken deutlich"}]},
  [norm("Rhamondre Stevenson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Bewährter NFL-Back mit Receiving-Kompetenz und möglichem volumenbasiertem RB2-Pfad",invalidator:"Backfield-Konkurrenz reduziert Early-Down- oder Passing-Down-Anteil"}]},
  [norm("Justin Herbert")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Elite-Arm-Talent mit hohem Effizienz-Ceiling; zusätzliche Passlautstärke eröffnet klaren QB1-Upside-Pfad",invalidator:"Offense bleibt volumenarm"}]},
  [norm("Trevor Lawrence")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Athletisches QB-Profil mit Rushing-Zusatz und Rebound-Potenzial bei stabilerer Offensive",invalidator:"Effizienz und Sack-/Turnover-Probleme bleiben bestehen"}]},
  [norm("Dak Prescott")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Bewährter High-Volume-Passer mit starkem wöchentlichem Ceiling in einer passfreundlichen Offense",invalidator:"Gesundheit oder Passing-Volumen fällt zurück"}]},
  [norm("Brock Purdy")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Effizienter Distributor in einer YAC-starken Offense; Umfeld ermöglicht hohe TD- und Effizienzwochen",invalidator:"Volumen oder Supporting Cast limitiert Ceiling"}]},
  [norm("Chuba Hubbard")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Bewährter Volumen-Back mit brauchbarer Receiving-Rolle; stabile Touches tragen einen RB2-Floor",invalidator:"Backfield-Konkurrenz reduziert Snap- und Goal-Line-Anteil"}]},
  [norm("Jaxson Dart")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Mobiler junger Quarterback mit Fantasy-Upside über Rushing und vertikale Aggressivität",invalidator:"Startstatus oder Passing-Konstanz begrenzt Nutzbarkeit"}]},
  [norm("RJ Harvey")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Explosiver Rookie mit Receiving-Profil und Raumgewinn-Upside; Rollenwachstum kann schnell Fantasy-Wert schaffen",invalidator:"Committee begrenzt Touches"}]},
  [norm("Patrick Mahomes")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Elite-Passer mit hohem TD- und Playmaking-Ceiling; Talent hält Overall-QB1-Ausreißer jederzeit offen",invalidator:"Rushing-Floor und reguläres Saisonvolumen begrenzen Fantasy-Abstand"}]},
  [norm("Bo Nix")]:{pos:"QB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Dual-Threat-Floor durch Rushing plus strukturierte Passing-Offense; Entwicklung kann weiteres QB1-Ceiling öffnen",invalidator:"Passing-Effizienz stagniert oder Rushing sinkt"}]},
  [norm("Alec Pierce")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Vertikaler Big-Play-Receiver mit hoher Air-Yard-Upside; wenige Treffer können Wochen entscheiden",invalidator:"Target-Volumen bleibt volatil"}]},
  [norm("Michael Wilson")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Großer Outside-Receiver mit Red-Zone- und Downfield-Pfad; zusätzliche Targets geben flex-relevante Upside",invalidator:"Target-Konkurrenz hält Volumen niedrig"}]},
  [norm("KC Concepcion")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Dynamisches Rookie-YAC-Profil mit vielseitiger Nutzung; schematische Touches eröffnen Breakout-Upside",invalidator:"Rookie-Rolle bleibt gadgetlastig oder volumenarm"}]},
  [norm("Makai Lemon")]:{pos:"WR",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Produktiver junger Receiver mit Separation- und YAC-Potenzial; wachsender Target-Anteil bietet späte Upside",invalidator:"NFL-Rolle entwickelt sich langsamer als erwartet"}]},
  [norm("Jonah Coleman")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Kompakter Runner mit Kontaktbalance und Receiving-Nutzen; kann bei Rollenöffnung mehrere Downs spielen",invalidator:"Depth Chart verhindert ausreichendes Volumen"}]},
  [norm("Dylan Sampson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Explosiver Speed-Back mit Big-Play- und Receiving-Potenzial; zusätzliche Touches haben überproportionales Ceiling",invalidator:"kleine Rolle und Passprotection begrenzen Einsatz"}]},
  [norm("Hunter Henry")]:{pos:"TE",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Bewährter Route-Running-TE mit Red-Zone-Nutzen; stabile Beteiligung bietet streambaren TE1-Pfad",invalidator:"Target-Konkurrenz drückt Wochenvolumen"}]},
  [norm("Brian Robinson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Bewährter Early-Down-Runner mit Goal-Line-Pfad; Volumen kann einen stabilen RB2/3-Floor tragen",invalidator:"Passing-Down-Anteil und Backfield-Konkurrenz deckeln Ceiling"}]},
  [norm("Braelon Allen")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Power-Back mit Goal-Line-Profil und erheblichem Contingent-Ceiling bei größerer Rolle",invalidator:"eigenständige Wochenrolle bleibt klein"}]},
  [norm("Alvin Kamara")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Elite-Receiving-Historie gibt weiterhin Half-PPR-Floor und volumenbasierten Starter-Pfad",invalidator:"Alter, Effizienz oder reduzierte Touches drücken Ceiling"}]},
  [norm("Tyrone Tracy")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Explosiver ehemaliger Receiver mit natürlichem Passing-Game-Nutzen und Big-Play-Potenzial",invalidator:"Backfield-Konkurrenz begrenzt Early-Down-Volumen"}]},
  [norm("Emmett Johnson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Vielseitiger Rookie-Back mit Receiving-Fähigkeit und möglichem Three-Down-Entwicklungspfad",invalidator:"Depth Chart verhindert frühe Rolle"}]},
  [norm("Kaelon Black")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Athletischer Upside-Back mit möglichem Contingent-Wert; bei klarer Rollenöffnung interessant",invalidator:"geringe gesicherte Wochenrolle"}]},
  [norm("Nicholas Singleton")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Explosives Power-Speed-Profil mit Receiving-Fähigkeit und hohem Touch-Ceiling",invalidator:"Rookie-Rotation oder inkonstante Vision begrenzt Volumen"}]},
  [norm("Kaleb Johnson")]:{pos:"RB",expiresAt:Date.parse('2026-09-02T12:00:00Z'),components:[{kind:'individual_context',dir:0,strength:1,confidence:.82,display:true,causal:"Produktiver Zone-Runner mit Größe und Workhorse-Profil; bei Lead-Rolle klarer volumenbasierter Upside-Pfad",invalidator:"Depth Chart oder Passing-Down-Rolle begrenzt Touches"}]},
};
function researchResidualCap(current){if(current<=30)return 1.5;if(current<=70)return 2.0;if(current<=110)return 2.6;return 3.2}
function researchPricingFactor(state){return state==='POSSIBLY_UNPRICED'?1:state==='PARTLY_PRICED'?.62:state==='LIKELY_PRICED'?.28:.45}
function structuredResidualComponents(p,cutoff=Infinity){
  const now=Date.now(),out=[];
  for(const e of actionableResearchEvents(p,cutoff)){
    const q=e?.payload?.residual||e?.payload?.residualSignal;
    if(!q||typeof q!=='object')continue;
    const expires=Number(q.expiresAt||e?.payload?.expiresAt||0);if(expires&&expires<now)continue;
    const dir=String(q.direction||'').toLowerCase();
    const d=dir==='up'||dir==='positive'||Number(q.direction)>0?1:dir==='down'||dir==='negative'||Number(q.direction)<0?-1:0;
    const strength=clamp(Number(q.strength??q.magnitude??0),0,1),confidence=clamp(Number(q.confidence??e.confidence??0),0,1);
    if(!d||strength<=0||confidence<.55||!String(q.causalPath||e.thesisPath||'').trim()||!String(q.invalidator||'').trim())continue;
    out.push({kind:String(q.kind||e.evidenceType||'structured'),dir:d,strength,confidence,pricing:String(q.pricing||'PARTLY_PRICED').toUpperCase(),causal:String(q.causalPath||e.thesisPath),invalidator:String(q.invalidator),source:'cache'});
  }
  return out;
}
function researchResidualShadow(p,r,a,current,cutoff=Infinity){
  const now=Date.now(),prior=RESEARCH_RESIDUAL_PRIORS[norm(p.name)],priorExpiry=Number(prior?.expiresAt||RESEARCH_PRIOR_EXPIRY);
  const components=[];
  if(prior&&prior.pos===p.pos&&now<priorExpiry)components.push(...prior.components.map(x=>({...x,source:'2026-prior'})));
  components.push(...structuredResidualComponents(p,cutoff));
  if(!components.length)return{model:RESEARCH_RESIDUAL_MODEL_VERSION,delta:0,active:false,displayActive:false,components:[],expired:Boolean(prior&&now>=priorExpiry)};
  let raw=0;const used=[];
  for(const c of components){
    let pricing=researchPricingFactor(c.pricing);
    if(Number.isFinite(a)&&Number.isFinite(r?.rank)){
      const gap=a-r.rank; // +gap: market is cheaper/later than selected panel.
      const marketAdj=clamp(gap/50,-.20,.20);
      pricing=clamp(pricing+(c.dir>0?marketAdj:-marketAdj),.12,1.10);
    }
    // Current Sleeper injury status can reinforce downside and suppress bullish priors,
    // but never manufacture an injury thesis on its own.
    let statusAdj=1;
    if(p.injury&&c.dir>0)statusAdj=.70;
    if(p.injury&&c.dir<0&&/injury|decline|recurrence/i.test(c.kind))statusAdj=1.12;
    const contribution=c.dir*c.strength*c.confidence*pricing*statusAdj;
    raw+=contribution;used.push({...c,pricingFactor:Number(pricing.toFixed(3)),contribution:Number(contribution.toFixed(3))});
  }
  const cap=researchResidualCap(current),delta=clamp(raw*3.0,-cap,cap);
  return{model:RESEARCH_RESIDUAL_MODEL_VERSION,delta:Number(delta.toFixed(2)),raw:Number(raw.toFixed(3)),cap,active:Math.abs(delta)>=.05,displayActive:used.some(x=>x.display===true),components:used,expiresAt:prior?priorExpiry:null};
}
function assignResearchShadowScores(rows,current){
  const clones=rows.map(x=>({...x,reasons:[...(x.reasons||[])],rawScore:x.rawScore+Number(x.researchResidual?.delta||0)}));
  applyPlayerQualitySafetyGate(clones,current);normalizeCoachScores(clones);
  clones.sort((a,b)=>b.score-a.score||b.rawScore-a.rawScore||a.r.rank-b.r.rank);
  const map=new Map(clones.map((x,i)=>[norm(x.p.name),{score:x.score,rawScore:x.rawScore,rank:i+1}]));
  for(const x of rows){const z=map.get(norm(x.p.name));x.shadowScore=z?.score??x.score;x.shadowRawScore=z?.rawScore??x.rawScore;x.shadowRank=z?.rank??null}
}
function positionPathCandidates(scored,pos,limit){
  // Position paths are availability/quality ladders, not a second Coach ranking.
  // Do not let late-QB/TE need penalties, Return timing or roster utility promote
  // deep positional options over materially better panel-ranked starters.
  return scored.filter(x=>x.p.pos===pos).slice().sort((a,b)=>{
    const ap=Number.isFinite(a.r?.posRank)?a.r.posRank:Infinity;
    const bp=Number.isFinite(b.r?.posRank)?b.r.posRank:Infinity;
    if(ap!==bp)return ap-bp;
    const ar=Number.isFinite(a.r?.rank)?a.r.rank:Infinity;
    const br=Number.isFinite(b.r?.rank)?b.r.rank:Infinity;
    if(ar!==br)return ar-br;
    const aa=Number.isFinite(a.a)?a.a:Infinity;
    const ba=Number.isFinite(b.a)?b.a:Infinity;
    if(aa!==ba)return aa-ba;
    return (b.score??-999)-(a.score??-999);
  }).slice(0,limit);
}
function positionDecisionPath(state,scored,current,next){
  const out=[];
  if(state.counts.QB===0){
    const q=positionPathCandidates(scored,'QB',4);
    if(q.length)out.push(`QB-Pfad: ${q.map(x=>`${x.p.name} (${actionDisplayLabel(x)})`).join(' → ')}`);
  }
  if(state.counts.TE===0){
    const t=positionPathCandidates(scored,'TE',3);
    if(t.length)out.push(`TE-Pfad: ${t.map(x=>`${x.p.name} (${actionDisplayLabel(x)})`).join(' → ')}`);
  }
  const r=scored.filter(x=>x.p.pos==='RB').slice(0,5);
  if(current>=81&&r.length)out.push(`Late-RB-Pfad: ${r.map(x=>x.p.name).join(' / ')}`);
  return out;
}

async function refresh(){
  persist();
  const surface=activeDraftSurface(),id=resolveActiveDraftId();
  if(!id)throw new Error(surface==='live'?'LIVE-Draft-ID fehlt.':'Draft-ID fehlt.');
  setAnalysisBusy(true);
  els.draftStatus.textContent='Aktualisiere Sleeper … Snapshot-Kopie ist bis zum Abschluss gesperrt.';
  try{
    const fetched=await fetchDraftFresh(id),draft=fetched.draft,players=fetched.players,mode=surface==='live'?'live':els.draftMode.value,strategy=els.strategyMode.value,stress=els.stressMode.value,cutoff=Number(els.replayCutoff.value),preview=livePreviewActive&&mode==='live',previewCutoff=Number(els.livePreviewCutoff?.value),picks=(preview&&Number.isFinite(previewCutoff)&&previewCutoff>=0?fetched.picks.filter(p=>Number(p.pick_no)<=previewCutoff):(mode==='replay'&&Number.isFinite(cutoff)&&cutoff>=0?fetched.picks.filter(p=>Number(p.pick_no)<=cutoff):fetched.picks)),
      teams=Number(draft.settings?.teams||10),
      rounds=Number(draft.settings?.rounds||15),
      map=resolvedManagerMap(mode,els.season.value,teams,els.managerMap.value),
      slot=Number(els.slot.value),
      liveGuard=surface==='live'?validateCanonicalLiveDraft({id,season:els.season.value,teams,rounds,slot}):{ok:true,errors:[]},
      total=teams*rounds,
      current=Math.min(picks.length+1,total),
      next=nextOwn(current,teams,slot,total),
      liveGuardMessage=!liveGuard.ok?`LIVE-Draft blockiert: ${liveGuard.errors.join(', ')} stimmen nicht mit 2026/10 Teams/15 Runden/Slot 9 überein.`:'',
      returnPick=next===current?nextOwn(current+1,teams,slot,total):next,
      mine=picks.filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no),
      drafted=new Set(picks.map(p=>String(p.player_id))),
      fingerprint=snapshotFingerprint(id,picks,slot),
      analysisFingerprint=`${fingerprint}|${currentExpertProfile()}|${strategy}|${APP_VERSION}`,
      duplicateSnapshot=analysisFingerprint===lastAnalysisFingerprint,
      tier=speedTier(current,next);

    const allAvailable=Object.entries(players)
      .filter(([pid,p])=>!drafted.has(pid)&&['QB','RB','WR','TE'].includes(p.position)&&p.active!==false&&p.full_name)
      .map(([pid,p])=>({id:pid,name:p.full_name,pos:p.position,team:p.team||'FA',searchRank:Number(p.search_rank),injury:p.injury_status||null,bye:p.bye_week||null,yearsExp:Number.isFinite(Number(p.years_exp))?Number(p.years_exp):null}));

    const rankedAvailable=allAvailable
      .map(p=>({p,r:rankFor(p.name,p.pos)}))
      .filter(x=>x.r&&panelSelectable(x.r.panelId))
      .sort((a,b)=>a.r.rank-b.r.rank||(a.p.searchRank||9999)-(b.p.searchRank||9999))
      .map(x=>x.p);

    const diagnosticAvailable=allAvailable
      .slice()
      .sort((a,b)=>(a.searchRank||9999)-(b.searchRank||9999))
      .slice(0,25);

    if(liveGuardMessage)throw new Error(liveGuardMessage);
    if(mode==='live')applyPendingLiveManagerModesAtPick(current);
    rebuildLiveManagerAdaptation({mode,picks,players,map,current,modeText:els.managerMap.value});
    if(mode==='live')renderLiveManagerModeStatus();

    const state=rosterState(mine,players,current);
    // No player-specific blacklist: all selected-panel candidates remain eligible.
    let scored=rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,strategy),stateCounts:{...state.counts}})).filter(x=>x.r&&!x.userStrategyExcluded);
    const referenceBalanced=(mode!=='live'&&strategy==='progressive')?rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,'balanced'),stateCounts:{...state.counts}})).filter(x=>x.r&&!x.userStrategyExcluded):null;
    const returnCtx={current,next:returnPick,picks,players,teams,map,rankedAvailable,mode,userSlot:slot};
    const returnRuns=mode==='live'?300:900;
    const rv2=Number.isFinite(returnPick)&&returnPick>current?simulateReturnV2(returnCtx,stress,returnRuns):null;
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
    if(!preview){resolveReturnValidation(id,picks);resolveDecisionFixtures(id,picks);freezeReturnValidation(id,current,returnPick,rv2,rankedAvailable,slot);}
    els.modeStatus.className=`notice ${mode==='live'&&!Object.keys(map).length?'warn':'ok'}`;els.modeStatus.textContent=modeStatusText(mode,map);
    const boardTop=scored.slice().sort((x,y)=>x.r.rank-y.r.rank).slice(0,12).filter(x=>x.ret!=null);
    const sortedReturns=boardTop.map(x=>x.ret).sort((x,y)=>x-y);
    const medianReturn=sortedReturns.length?sortedReturns[Math.floor(sortedReturns.length/2)]:null;
    if(medianReturn!=null)for(const x of scored){
      if(x.ret==null)continue;
      const rel=clamp((medianReturn-x.ret)*4,-2,2);
      x.rawScore+=rel;
      if(Math.abs(rel)>=1.5)x.reasons.push(rel>0?'Dringlicher als Board':'Mehr Wartepotenzial als Board');
    }
    if(referenceBalanced){
      const refBoard=referenceBalanced.slice().sort((x,y)=>x.r.rank-y.r.rank).slice(0,12).filter(x=>x.ret!=null);
      const refReturns=refBoard.map(x=>x.ret).sort((x,y)=>x-y),refMedian=refReturns.length?refReturns[Math.floor(refReturns.length/2)]:null;
      if(refMedian!=null)for(const x of referenceBalanced){if(x.ret==null)continue;x.rawScore+=clamp((refMedian-x.ret)*4,-2,2);}
    }
    // Counterfactual Research Residual v2 is computed in parallel and never mutates
    // the live Coach score in rc4.18. This preserves a clean prospective baseline.
    assignResearchShadowScores(scored,current);
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
    scored=applyTurnPortfolioOrdering(scored,current,returnPick);

    const draftComplete=(!preview&&String(draft.status||'').toLowerCase()==='complete')||picks.length>=total;
    lastEmergencyQueueText=draftComplete?'':buildEmergencyQueueText(scored,state,current,id);
    if(els.queueBtn)els.queueBtn.disabled=!lastEmergencyQueueText;
    if(draftComplete){
      els.favoritesBlock.innerHTML='<div class="favorite-box"><b>Draft abgeschlossen</b><div class="tiny">Keine Live-Empfehlungen mehr. Mock Review und Snapshot bleiben verfügbar.</div></div>';
      els.coachList.innerHTML='';
      els.teamSummary.innerHTML=Object.entries(state.counts).map(([p,n])=>`<div class="summary-item"><b>${n}</b><span>${p}</span></div>`).join('')+`<div class="summary-item"><b>✓</b><span>Fertig</span></div>`;
    }else renderCoach(scored,state,current,returnPick);
    renderFpHandoff(id,draftComplete);
    let season=null,seasonRows=null,seasonAvailable=null;
    if(draftComplete){try{season=await fetchSeasonLeagueState(draft);seasonRows=seasonRosterRows(season,players,mine);seasonAvailable=seasonAvailablePlayers(season,players);}catch(e){season={ok:false,reason:e?.message||String(e)};}}
    if(seasonRows){
      renderRosterWorkspace(mine,players,current,draftComplete);
      const counts=postDraftRosterCounts(seasonRows);els.rosterStatus.className='notice ok';els.rosterStatus.textContent='LIVE Sleeper-Kader · '+seasonRows.length+' Spieler · Source of Truth: League-State · Reserve/IR '+seasonRows.filter(x=>x.seasonStatus==='RESERVE').length+' · keine automatische Transaktion.';
      els.rosterSummary.innerHTML=Object.entries(counts).filter(([,n])=>n).map(([pos,n])=>'<div class="summary-item"><b>'+n+'</b><span>'+pos+'</span></div>').join('');
      els.rosterList.innerHTML=seasonLineupHtml(seasonRows,season);
      renderRosterBenchAudit(seasonRows,players,current,draftComplete);renderRosterFaAudit(seasonRows,seasonAvailable||[],draftComplete);
    }else{renderRosterWorkspace(mine,players,current,draftComplete);renderRosterFaAudit(mine.map(pk=>{const p=pinfo(String(pk.player_id),pk.metadata,players),r=rankFor(p.name,p.pos),a=adpFor(p.name);return{pk,p,r,a}}),rankedAvailable,draftComplete);if(draftComplete&&els.rosterStatus){els.rosterStatus.className='notice warn';els.rosterStatus.textContent='Season Sync FAIL-CLOSED · '+esc(season?.reason||'League-State nicht verfügbar')+' · Draftkader nur historische Baseline; keine FA-Aktion freigegeben.';}}
    renderTradeWorkspace(picks,players,slot,teams,draftComplete);
    renderWaiverWorkspace(draftComplete);
    renderSeasonActionBoard(draftComplete);
    renderMockReview(mine,players);

    const best=scored[0]?.score??0,
      favorites=scored.slice(0,5),
      snapshotCandidates=visibleCoachCandidates(scored),
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

    const expertHealth=desiredExpertPoolHealth();
    const expertMissing=expertHealth.rows.filter(x=>x.status!=='verified'&&x.status!=='stale-fallback');
    const expertDegraded=expertHealth.rows.filter(x=>x.status==='stale-fallback');
    const expertHealthSummary=`Gewünschter Expertenpool: ${expertHealth.verified}/${expertHealth.total} aktuell verifiziert${expertHealth.stale?` · ${expertHealth.stale} stale fallback`:''}${expertMissing.length?` · fehlt: ${expertMissing.map(x=>`${x.name}${x.error?` (${x.error})`:''}`).join(', ')}`:''}`;
    const expertHealthDetails=expertHealth.rows.map(expertHealthDetailLine);
    const panelHealthLines=['QB','RB','WR','TE'].map(effectivePanelHealthLine);
    const activeHealth=activePanelHealthState();

    const lines=[
      '===== SLEEPER DRAFT SNAPSHOT =====',
      `App-Version: ${APP_VERSION}`,
      `Draft-ID: ${id}`,
      `Status: ${draft.status}`,
      `Teams: ${teams} | Runden: ${rounds} | Mein Slot: ${slot}`,
      `Aktueller Pick: ${current}`,
      `Mein nächster Pick: ${next??'keiner'} | Picks bis dahin: ${next==null?'–':next-current}`,
      `Return-Modell: Folgepick ${returnPick??'keiner'}${returnPick!=null?` | ${rv2?.slots?.length??Math.max(0,returnPick-current-1)} gegnerische Picks bis dahin`:''}`,
      `Snapshot-Fingerprint: ${fingerprint} | Analyse-Profil: ${currentExpertProfile()} | ${duplicateSnapshot?'DUPLIKAT/UNVERÄNDERT':'NEU'}`,
      `Live-Speed: ${tier.label} | Analysebudget ${tier.budget}s`,
      ...(preview?[`LIVE-PREVIEW: READ-ONLY · Cutoff ${previewCutoff} · keine Validierungs-Fixtures geschrieben`]:[]), 
      '',
      'DATENSTATUS',
      `Verwendete Panels: ${usedPanelIds.map(pid=>panels[pid]?.name||pid).join(' / ')||'FEHLT'}`,
      `Geladene Panel-Spieler: ${rankedCounts||'FEHLT'}`,
      `Verifizierte Einzelrankings: ${usedPanelIds.map(panelIndividualVerificationLine).join(' · ')||'FEHLT'}`,
      expertHealthSummary,
      `Expertenpool-Details: ${expertHealthDetails.join(' | ')}`,
      `Panel-Health: ${activeHealth.degraded?'DEGRADED':'OK'} · ${panelHealthLines.join(' · ')}`,
      `Expertenquelle: ${activePanelSourceSummary()}`,
      `Kandidatenpool: max. 230 ohne K/DST · QB 30 · RB 90 · WR 80 · TE 30 · Auswahl ausschließlich aus Expertenrankings`,
      `Overall-Ränge: Originalwerte inkl. K/DST-Einfluss; K/DST werden erst NACH der Ranking-Rekonstruktion aus dem Draftpool entfernt`,
      `Panel-Gewichte: ${activePanelWeightSummary()}`,
      `Coach-Modell: ${APP_VERSION} Return-v2 · Strategie ${strategyLabel(strategy)} · Modus ${mode} · Stress ${stressLabel(stress)} · Panel-first · Return + Gegnerroster + plausible Abnehmer${managerProfilesActive(mode,els.season.value,teams)?' + Manager-Layer':''} · Loss-if-Gone`,
      ...(mode==='live'?[`Manager-Live-Adaption: ${liveManagerDiagnostics()}`]:[]),
      ...(mode==='live'&&rv2?.collisions?(()=>{
        const b=Object.values(rv2.collisions).find(x=>norm(x.label)==='basti');
        return b?[`Basti Target Collision: ${Math.round(b.prob*100)}% · ${b.targets.slice(0,4).map(x=>`${x.name} ${Math.round(x.prob*100)}%`).join(' · ')}`]:[];
      })():[]),
      `Aktive Expertenquellen: ${activePanelSourceLines(usedPanelIds).join(' · ')||'KEINE'}`,
      `Panel-Stand: ${rankingStamp}`,
      `Sleeper-ADP: ${Object.keys(adp).length} | Quelle: ${adpMeta.source||'none'} | Stand: ${adpStamp}`,
      `Bewertbare verfügbare Spieler: ${scored.length}`,
      `Roster-Regel: max. 4 WR / 3 RB / 2 TE gleichzeitig startbar; das sind KEINE Draft-/Roster-Caps. Bench-Spieler dieser Positionen bleiben legal und können Value/Upside sein.`,
      `Ranking-Prinzip: keine spielerspezifische Blacklist; Panel-Qualität, Markt/Timing, Roster-/Championship-Utility und valide Evidenz entscheiden.`,
      `Snapshot-Guard: ${duplicateSnapshot?'DUPLIKAT/UNVERÄNDERT — wenn dieser Pick/Fingerprint im Chat bereits ausgewertet wurde, NICHT erneut analysieren; sofort einen aktuellen/neuen Snapshot anfordern.':'NEU — normal analysieren.'}`,
      '',
      `RESEARCH RESIDUAL SHADOW: ${RESEARCH_RESIDUAL_MODEL_VERSION} · NICHT live im Coach · statische Priors verfallen ${new Date(RESEARCH_PRIOR_EXPIRY).toLocaleDateString('de-DE')}`,
      ...scored.filter(x=>x.researchResidual?.active).slice().sort((a,b)=>Math.abs(b.researchResidual.delta)-Math.abs(a.researchResidual.delta)).slice(0,10).map(x=>`${x.p.name} — ${x.p.pos} | Shadow ${x.researchResidual.delta>0?'+':''}${x.researchResidual.delta.toFixed(2)} | Coach ${x.score} -> Shadow ${x.shadowScore} | Shadow-Rang ${x.shadowRank??'–'} | ${x.researchResidual.components.slice(0,2).map(c=>`${c.kind}:${c.contribution>0?'+':''}${c.contribution}`).join(' · ')}`),
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
    lines.push('','LIVE-ENTSCHEIDUNG · BIS ZU 10 NÜTZLICHE KANDIDATEN');
    if(draftComplete){
      lines.push('DRAFT ABGESCHLOSSEN — keine Pick-Entscheidung und keine Return-Prognose mehr.');
    }else if(snapshotCandidates.length){
      snapshotCandidates.forEach((x,i)=>lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score}${Number.isFinite(x.balancedScore)?` | v10-Ref ${x.balancedScore}`:''} | Panel ${x.r.rank.toFixed(1)} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Return-Confidence ${x.returnConfidence}% | ${x.outsideNormalCut?'FALLBACK AUSSERHALB NORMAL-CUT · '+actionDisplayLabel(x)+' NUR KONTEXT':actionDisplayLabel(x)} | Loss ${x.loss}`));
    }else lines.push('KEINE — Panel-Zuordnung/Rankings prüfen.');

    lines.push('','DRAFT COACH TOP 8');
    if(draftComplete){
      lines.push('NICHT ANWENDBAR — Draft abgeschlossen. Verfügbare Spieler unten sind nur noch Post-Draft/FA-Kontext.');
    }else if(scored.length){
      scored.slice(0,8).forEach((x,i)=>{
        lines.push(`${i+1}. ${x.p.name} — ${x.p.pos}, ${x.p.team} | Coach ${x.score}${Number.isFinite(x.balancedScore)?` | v10-Ref ${x.balancedScore}`:''} | ${x.r.panel} ${x.r.rank.toFixed(1)} Tier ${x.r.tier||'–'} | ADP ${Number.isFinite(x.a)?x.a.toFixed(1):'FEHLT'} | Return ${x.ret!=null?Math.round(x.ret*100)+'%':'FEHLT'} | Confidence ${x.confidence}% | ${x.agree}`);
        lines.push(`   Einzelrankings: ${verifiedIndividualEntries(x.r).map(v=>`${v.expertName} ${v.reconstructed?'≈':'#'}${Math.round(v.rank)}${Number.isFinite(v.posRank)?` (${x.p.pos}${Math.round(v.posRank)})`:''}${v.reconstructed?` [rekonstr., ${v.anchors} Anker]`:''}`).join(' · ')||'KEINE VERIFIZIERT'}`);
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
        if(els.snapshotMode.value==='full'){const orderedIndividuals=[...(x.r.individual||[])].sort((a,b)=>expertDisplayIndex(a.expertName)-expertDisplayIndex(b.expertName)||String(a.expertName).localeCompare(String(b.expertName)));lines.push(`   Einzelrankings: ${orderedIndividuals.map(v=>`${v.expertName} ${v.reconstructed?'≈':'#'}${Math.round(Number.isFinite(Number(v.overallRank))?Number(v.overallRank):Number(v.rank))}${Number.isFinite(Number(v.posRank))?` (${x.p.pos}${Math.round(Number(v.posRank))})`:''}${v.reconstructed?' [rekonstr.]':''}`).join(' · ')||'FEHLT'}`);}
      });
    }else lines.push('KEINE.');

    lines.push(
      '',
      'HARTE REGEL',
      strategy==='balanced'?'Kein großer Reach ohne konkrete aktuelle Begründung. Fehlende Panel- oder ADP-Daten ausdrücklich als Unsicherheit behandeln. K und DST werden nicht gedraftet. Bye Weeks sind nur ein kleiner Tiebreaker.':'Panel bleibt Baseline. Ab Runde 9 graduell mehr Ceiling/Breakout-EV und höhere Reach-Toleranz; ein Reach braucht weiterhin einen plausiblen Upside-Pfad. K und DST werden nicht gedraftet. Bye Weeks sind nur ein kleiner Tiebreaker.',
      '',
      'AUFGABE',
      'Prüfe aktuelle Verletzungen, Depth Charts und News, einschließlich angekündigter/geplanter IR- oder PUP-Moves und ob IR season-ending ist, sowie gezielt die Research-Kandidaten auf aktuelle Sleeper-, Breakout-, League-Winner- und Bust-Analysen. Artikel dienen als begründungspflichtiger Kontext; das Expertenpanel bleibt Baseline. Nutze das Expertenpanel als Baseline und Sleeper-ADP als Marktindikator, sofern vorhanden. Nenne alle nahezu gleichwertigen Favoriten, danach 2–3 Alternativen, Return-Chancen und Confidence. Erzwinge keine Einzelentscheidung, wenn mehrere Spieler nahezu gleichauf liegen. Abweichungen vom Expertenpanel oder der Sleeper-ADP ausdrücklich begründen. In dieser 10-Team-1QB-Liga QB2 und TE2 nur in absoluten Ausnahmefällen empfehlen; TE1 darf bei einem Run bis nach dem Draft aufgeschoben werden. Bei ähnlich guten QB1-Kandidaten Rushing-Upside bevorzugen. Späte Bench-Picks primär auf RB-Upside optimieren. Override-Guard: Behandle den Coach-Topfavoriten als Board-Leader, nicht als automatischen Pick-Befehl. Return-Labels beschreiben Timing und sind kein Pick-Befehl. Am Turn darf die Reihenfolge zwischen plausiblen Kandidaten angepasst werden, wenn Portfolio, Opportunity Cost und unterschiedliche Return-/Loss-Risiken dies konkret stützen; allgemeine Positions-/Upside-Präferenz allein reicht weiterhin nicht. Snapshot-Freshness-Guard: Wenn dieser Snapshot als DUPLIKAT/UNVERÄNDERT markiert ist UND derselbe Pick/Fingerprint im Chat bereits ausgewertet wurde, keine zweite Analyse liefern; nur den aktuellen/neuen Snapshot anfordern. Voranalyse-Regel: gleiche Player-Quality-, Roster-, Injury-, Return-Timing- und Championship-Utility-Regeln wie in der Live-Analyse verwenden; Starter-Maxima niemals als Roster-Caps behandeln.'
    );
    }

    if(draftComplete){
      const fp=getFpBenchmark(id);
      lines.push('','===== FANTASYPROS POST-DRAFT BENCHMARK =====');
      if(fp){
        const o=fp.result?.overall||{},p=fp.result?.projectedStanding||{},st=fp.result?.starters||{},bn=fp.result?.bench||{};
        lines.push(`FantasyPros: ${o.grade||'–'} / ${o.scoreRounded??'–'} | Projected #${p.rank??'–'} (${p.score??'–'}) | Starter #${st.rank??'–'} | Bench #${bn.rank??'–'}`,'Benchmark-Rolle: externe Post-hoc-Diagnose; NICHT als Live-Scoring-/Trainingslabel verwenden.');
      }else lines.push('FantasyPros: NOCH NICHT IMPORTIERT. Companion kennt Draft/Picks/Kader bereits; nur externe Analyzer-Daten fehlen.','Handoff: FantasyPros Full Analysis öffnen → PITTI-FP-Capture einmal ausführen → erzeugte PITTI-FantasyPros.json hier importieren. Keine Picks manuell rekonstruieren.');
    }

    els.snapshot.value=lines.join('\n');
    if(!preview){lastSnapshotFingerprint=fingerprint;lastAnalysisFingerprint=analysisFingerprint;lastSnapshotPickCount=picks.length;store.setText('v116_lastSnapshotFingerprint',fingerprint);store.setText('v124_lastAnalysisFingerprint',analysisFingerprint);store.setText('v116_lastSnapshotPickCount',String(picks.length));}
    els.draftStatus.className=scored.length?'notice ok':'notice warn';
    const dataState=scored.length?(navigator.onLine?'LIVE':'VERALTET'):'FALLBACK';
    const nextText=draftComplete?'DRAFT ABGESCHLOSSEN':`NÄCHSTER EIGENER PICK: ${next??'keiner'}${next===current?' · DU BIST DRAN':''}`;
    els.draftStatus.textContent=`${nextText} · ${dataState} · Sleeper-Picks ${picks.length}/${total} · ${scored.length} Kandidaten bewertet · Modus ${mode.toUpperCase()}.`;
    els.draftSummary.hidden=false;
    els.emptyCoach.hidden=true;
    els.copyBtn.disabled=false;
    els.shareBtn.disabled=false;
    // Evidence retention must follow the actual user decision geometry, not whether a future return pick exists.
    // The final own pick has no return window but still needs a frozen fixture for post-draft retrospective.
    const userDecisionNow=!draftComplete&&next===current;
    if(userDecisionNow)if(!preview)freezeDecisionFixture({draftId:id,current,returnPick,picks,mine,players,rankedAvailable,scored,rv2,mode,strategy,stress,teams,slot,fingerprint,map});
    lastDraftContext={id,current,next:returnPick,favorites,scored,picks,mine,mode,strategy,stress,map,dataState,players,teams,rankedAvailable,draftComplete};
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

function backup(){return{format:'draft-companion-v7',version:APP_VERSION.replace(/^v/,''),createdAt:new Date().toISOString(),season:els.season.value,scoring:els.scoring.value,experts,panels,activePanelId,positionPanels,rankCache,panelRanks,adp,adpMeta,decisionLog,returnValidation:loadReturnValidation(),decisionFixtures:loadDecisionFixtures(),fpBenchmarks:allFpBenchmarks(),draft:els.draftInput.value,slot:els.slot.value,draftMode:els.draftMode.value,strategyMode:els.strategyMode.value,stressMode:els.stressMode.value,managerMap:els.managerMap.value,managerModeSegments:loadManagerModeSegments(),managerProfileHash:MANAGER_PROFILE_SOURCE_HASH}}
function decisionEvidenceExport(){
  const id=draftId(els.draftInput.value),all=loadDecisionFixtures(),rawRows=all.filter(f=>String(f.draftId||'')===String(id||''));
  // Preserve model-comparison variants (v4/v5) for the same Sleeper decision state.
  // Canonical summaries remain one newest fixture per own pick for backward compatibility.
  const byPick=new Map();
  for(const f of rawRows){const k=Number(f.current);const prev=byPick.get(k);if(!prev||Number(f.createdAt||0)>=Number(prev.createdAt||0))byPick.set(k,f);}
  const rows=[...byPick.values()].sort((a,b)=>Number(a.current)-Number(b.current));
  const byPickProfile=new Map();
  for(const f of rawRows){const profile=String(f.analysisProfile||'legacy'),k=`${Number(f.current)}|${profile}`;const prev=byPickProfile.get(k);if(!prev||Number(f.createdAt||0)>=Number(prev.createdAt||0))byPickProfile.set(k,f);}
  const comparisonFixtures=[...byPickProfile.values()].sort((a,b)=>Number(a.current)-Number(b.current)||String(a.analysisProfile||'').localeCompare(String(b.analysisProfile||'')));
  const supersededFixtureCount=Math.max(0,rawRows.length-comparisonFixtures.length);
  const summaries=rows.map(f=>{const counts={QB:0,RB:0,WR:0,TE:0};for(const p of f.userRoster||[]){const pos=p.pos||(f.rankedPool||[]).find(x=>String(x.playerId)===String(p.player_id))?.pos;if(pos&&counts[pos]!=null)counts[pos]++}const d=f.decisionOutcome||{},top=d.coachTop||f.candidates?.[0]||null,chosen=(f.candidates||[]).find(x=>norm(x.name)===norm(f.chosenPlayer?.name||''))||null;return{pick:f.current,returnPick:f.returnPick,modelVersion:f.modelVersion||null,rosterCounts:counts,coachTop:top?{name:top.name,pos:top.pos,score:top.coachScore??null,panelRank:top.panelRank??null,adp:top.adp??null}:null,chosen:f.chosenPlayer?{name:f.chosenPlayer.name,pos:chosen?.pos||null,frozenRank:d.chosenFrozenRank??null,score:chosen?.coachScore??null,panelRank:chosen?.panelRank??null,adp:chosen?.adp??null}:null,followedCoach:d.followedCoach??null,override:!!d&&d.followedCoach===false,chosenInFrozenCandidates:d.chosenInFrozenCandidates??null,scoreDelta:d.chosenVsCoachScoreDelta??null,panelDelta:d.chosenVsCoachPanelDelta??null,wrSaturationFlag:top?.pos==='WR'&&counts.WR>=6,wr7PlusFlag:top?.pos==='WR'&&counts.WR>=7,qb2Violation:top?.pos==='QB'&&counts.QB>=1};});
  const modelVersions=[...new Set(rows.map(f=>String(f.modelVersion||'unknown')))];
  return{format:'pitti-decision-evidence-v3',appVersion:APP_VERSION,createdAt:new Date().toISOString(),draftId:id||null,slot:Number(els.slot.value),mode:els.draftMode.value,fixtureCount:rows.length,rawFixtureCount:rawRows.length,comparisonFixtureCount:comparisonFixtures.length,supersededFixtureCount,modelVersions,mixedModelVersions:modelVersions.length>1,resolvedCount:rows.filter(f=>f.chosenPlayer).length,overrideCount:summaries.filter(x=>x.override).length,wrSaturationRecommendationCount:summaries.filter(x=>x.wrSaturationFlag).length,qb2ViolationCount:summaries.filter(x=>x.qb2Violation).length,summaries,fixtures:rows,comparisonFixtures};
}
async function downloadJson(name,v){
  const text=JSON.stringify(v,null,2),file=new File([text],name,{type:'application/json'});
  // Android/PWA: Web Share with a real File is more reliable than navigating to a blob URL.
  // It also lets the backup be shared directly to ChatGPT or saved with Android's file picker.
  try{
    if(navigator.share&&navigator.canShare?.({files:[file]})){
      await navigator.share({files:[file],title:'Draft Companion Sicherung'});
      return;
    }
  }catch(e){
    if(e?.name==='AbortError')return;
    console.warn('File share failed; falling back to download',e);
  }
  const u=URL.createObjectURL(file),a=document.createElement('a');
  a.href=u;a.download=name;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(u),10000);
}
function applyBackup(v){if(v?.format!=='draft-companion-v7')throw new Error('Ungültige Sicherung.');experts=v.experts||[];panels=v.panels||panels;activePanelId=v.activePanelId||'standard';positionPanels=v.positionPanels||positionPanels;rankCache=v.rankCache||{};panelRanks=v.panelRanks||{};for(const[id,c]of Object.entries(rankCache)){try{store.set('v7_rank_'+id,c)}catch{}}try{localStorage.removeItem('v7_rankCache');localStorage.removeItem('v7_panelRanks')}catch{};adp=v.adp||{};adpMeta=v.adpMeta||{source:'Backup',updated:Date.now(),count:Object.keys(adp).length};decisionLog=Array.isArray(v.decisionLog)?v.decisionLog:[];saveReturnValidation(Array.isArray(v.returnValidation)?v.returnValidation:[]);saveDecisionFixtures(Array.isArray(v.decisionFixtures)?v.decisionFixtures:[]);restoreFpBenchmarks(v.fpBenchmarks);els.season.value=v.season||'2026';els.scoring.value=v.scoring||'HALF';els.draftInput.value=v.draft||'';els.slot.value=String(v.slot||9);if(['mock','live','replay'].includes(v.draftMode))els.draftMode.value=v.draftMode;if(['progressive','balanced'].includes(v.strategyMode))els.strategyMode.value=v.strategyMode;if(['baseline','rb','te','rookie','late'].includes(v.stressMode))els.stressMode.value=v.stressMode;if(typeof v.managerMap==='string')els.managerMap.value=canonicalize2026ManagerMap(v.managerMap);if(v.managerModeSegments&&typeof v.managerModeSegments==='object')saveManagerModeSegments(v.managerModeSegments);persist();renderAll()}
function setAuto(){if(autoTimer)clearInterval(autoTimer);autoTimer=null;persist();if(els.autoRefresh.checked)autoTimer=setInterval(()=>{if(!document.hidden&&els.draftInput.value.trim())refresh().catch(()=>{})},10000)}

if(els.loadExpertsBtn)els.loadExpertsBtn.onclick=()=>loadExperts().catch(e=>{els.presetStatus.className='notice bad';els.presetStatus.textContent=e.message});
if(els.expertDeltaBtn)els.expertDeltaBtn.onclick=()=>checkExpertDeltas().catch(e=>{els.panelStatus.className='notice bad';els.panelStatus.textContent=e.message});
if(els.applyPresetBtn)els.applyPresetBtn.onclick=()=>{try{applyPreset()}catch(e){els.presetStatus.className='notice bad';els.presetStatus.textContent=e.message}};
if(els.loadAllRanksBtn)els.loadAllRanksBtn.onclick=()=>loadAllRanks().catch(e=>{els.panelStatus.className='notice bad';els.panelStatus.textContent=e.message});
els.refreshAllBtn.onclick=async()=>{els.refreshAllBtn.disabled=true;els.refreshAllBtn.textContent='Aktualisiere …';els.qualityStatus.className='notice';els.qualityStatus.textContent='Datenupdate gestartet …';await new Promise(requestAnimationFrame);try{
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

els.queueBtn.onclick=async()=>{if(analysisBusy||!lastEmergencyQueueText)return;await navigator.clipboard.writeText(lastEmergencyQueueText);els.queueBtn.textContent='Queue kopiert ✓';setTimeout(()=>els.queueBtn.textContent='Emergency Queue kopieren',1200)};
els.refreshBtn.onclick=async()=>{try{await refresh();if(!els.snapshot.value)throw new Error('Kein frischer Snapshot erzeugt.');await navigator.clipboard.writeText(els.snapshot.value);els.draftStatus.className='notice ok';els.draftStatus.textContent+=' · Frischer Snapshot kopiert ✓';}catch(e){els.draftStatus.className='notice bad';els.draftStatus.textContent=e.message}};
els.copyBtn.onclick=async()=>{if(analysisBusy)return;await navigator.clipboard.writeText(els.snapshot.value);els.copyBtn.textContent='Kopiert ✓';setTimeout(()=>els.copyBtn.textContent='Snapshot erneut kopieren',1200)};
els.shareBtn.onclick=()=>{if(analysisBusy)return;return navigator.share?navigator.share({title:'Sleeper Draft Snapshot',text:els.snapshot.value}):navigator.clipboard.writeText(els.snapshot.value)};
if(els.fpOpenBtn)els.fpOpenBtn.onclick=()=>window.open(FP_ANALYZER_URL,'_blank','noopener');
if(els.fpSetupBtn)els.fpSetupBtn.onclick=async()=>{try{await navigator.clipboard.writeText(FP_CAPTURE_BOOKMARKLET);els.fpStatus.className='notice ok';els.fpStatus.textContent='PITTI-FP-Capture kopiert. Einmalig als Chrome-Lesezeichen-URL „PITTI FP“ speichern.'}catch(e){els.fpStatus.className='notice bad';els.fpStatus.textContent='Capture-Code konnte nicht kopiert werden: '+e.message}};
if(els.fpImportFile)els.fpImportFile.onchange=async()=>{try{
  if(!lastDraftContext)throw new Error('Zuerst den abgeschlossenen Sleeper-Draft analysieren.');
  const v=JSON.parse(await els.fpImportFile.files[0].text()),check=validateFpBenchmark(v,lastDraftContext);
  store.set(fpStoreKey(lastDraftContext.id),v);renderFpHandoff(lastDraftContext.id,true);
  els.fpStatus.textContent=fpSummary(v)+` Kader-Match ${check.overlap}/${check.total}. Snapshot erneut erzeugen, um den Benchmark einzubetten.`;
}catch(e){els.fpStatus.className='notice bad';els.fpStatus.textContent=e.message}finally{els.fpImportFile.value=''}};
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
if(els.expertProfile){els.expertProfile.value=currentExpertProfile();els.expertProfile.onchange=()=>applyExpertProfile(els.expertProfile.value);}
if(els.liveManagerApply)els.liveManagerApply.onclick=applyLiveManagerModesToCoach;
if(els.analysisExpertProfile){
  syncAnalysisExpertSelector();
  els.analysisExpertProfile.onchange=()=>{
    const requested=els.analysisExpertProfile.value;
    if(!applyExpertProfile(requested)){
      els.analysisExpertProfile.value=currentExpertProfile()==='expertv3'?'expertv3':'expertv3';
      els.draftStatus.className='notice warn';
      els.draftStatus.textContent=requested+' ist noch nicht vollständig verifiziert und bleibt gesperrt.';
    }
  };
}

async function exportExpertV3Challengers(){
  const status=els.expertV3AuditStatus;
  if(!els.apiKey.value.trim())throw new Error('FantasyPros-Zugang fehlt. Zuerst Alles aktualisieren.');
  const targets=[
    {name:'Ryan Weisse',pos:'RB'},
    {name:'Wolf of Roto Street',pos:'TE'},
    {name:'Todd D Clark',pos:'QB'},
    {name:'Joey Wright',pos:'WR'}
  ];
  status.textContent='Lade Expert-v3 Challenger …';
  await loadExperts();
  const found=[];
  for(const target of targets){
    const {name,pos}=target,e=findExpert(name);
    if(!e){found.push({name,pos,status:'missing'});continue}
    try{
      status.textContent='Lade '+name+' · '+pos+' …';
      const row=await loadExpertRanks(e.id);
      if(!row?.verifiedIndividual)throw new Error(row?.error||'Kein verifiziertes Einzelranking verfügbar.');
      const ranks=Object.values(row.ranks||{})
        .filter(v=>String(v.pos||'').toUpperCase()===pos&&Number.isFinite(Number(v.rank)))
        .sort((a,b)=>Number(a.rank)-Number(b.rank))
        .map(v=>[v.name,Number(v.rank)]);
      if(!ranks.length)throw new Error('Kein verifiziertes '+pos+'-Ranking verfügbar.');
      found.push({name,pos,id:String(e.id),status:'ok',updated:row.sourceUpdated||row.updated||null,source:row.source||null,staleFallback:!!row.staleFallback,ranks});
    }catch(err){found.push({name,pos,id:String(e.id),status:'error',error:err?.message||String(err)})}
  }
  const out={schema:'pitti-expert-v3-compact.v1',appVersion:APP_VERSION,createdAt:new Date().toISOString(),season:els.season.value,scoring:els.scoring.value,containsCredential:false,experts:found};
  const text=JSON.stringify(out);
  try{
    await navigator.clipboard.writeText(text);
  }catch(e){
    await downloadJson('pitti-expert-v3-compact-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',out);
  }
  const ok=found.filter(x=>x.status==='ok');
  status.className='notice '+(ok.length?'ok':'warn');
  status.textContent='v3 Kompakt-Export: '+ok.length+'/'+targets.length+' Positionsrankings · '+text.length+' Zeichen · '+(navigator.clipboard?'in Zwischenablage kopiert':'als Datei exportiert')+' · '+found.map(x=>x.name+' '+x.pos+': '+x.status).join(' · ');
}

if(els.expertV3AuditBtn)els.expertV3AuditBtn.onclick=()=>exportExpertV3Challengers().catch(e=>{els.expertV3AuditStatus.className='notice bad';els.expertV3AuditStatus.textContent='v3 Audit fehlgeschlagen: '+e.message});
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
els.backupBtn.onclick=async()=>{try{await downloadJson(`draft-companion-v7-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.json`,backup())}catch(e){alert('Sicherung konnte nicht exportiert werden: '+e.message)}};
if(els.decisionEvidenceBtn)els.decisionEvidenceBtn.onclick=async()=>{try{const v=decisionEvidenceExport();if(!v.draftId)throw new Error('Draft-ID fehlt.');await downloadJson(`PITTI-Decision-Evidence-${v.draftId}-${new Date().toISOString().replace(/[:.]/g,'-')}.json`,v);if(els.decisionEvidenceStatus)els.decisionEvidenceStatus.textContent=`${v.fixtureCount} Picks exportiert · ${v.resolvedCount} aufgelöst · ${v.overrideCount} Overrides.`;}catch(e){if(els.decisionEvidenceStatus)els.decisionEvidenceStatus.textContent='Export fehlgeschlagen: '+e.message;}};
els.restoreFile.onchange=async()=>{try{applyBackup(JSON.parse(await els.restoreFile.files[0].text()))}catch(e){alert(e.message)}finally{els.restoreFile.value=''}};

if(els.simulateBtn)els.simulateBtn.onclick=runSimulationLab;
if(els.strategyMode)els.strategyMode.onchange=()=>{persist();els.strategyStatus.className='notice ok';els.strategyStatus.textContent=strategyStatusText(els.strategyMode.value);};
if(els.strategyStatus){els.strategyStatus.className='notice ok';els.strategyStatus.textContent=strategyStatusText(els.strategyMode.value);}
els.clearDraftDataBtn.onclick=()=>{if(confirm('Draft-Verbindung zurücksetzen?')){els.draftInput.value='';els.draftSummary.hidden=true;els.emptyCoach.hidden=false;persist()}};
if(els.draftInput)els.draftInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();els.draftInput.blur();}});
for(const el of [els.apiKey,els.season,els.scoring,els.draftInput,els.slot,els.topN,els.snapshotMode,els.draftMode,els.replayCutoff,els.managerMap,els.stressMode])el.addEventListener('change',()=>{persist();updateStatus()});
addEventListener('online',updateStatus);addEventListener('offline',updateStatus);
setInterval(updateStatus,60000);
let livePreviewActive=false;
function populateLivePreviewPoints(){
  if(!els.livePreviewCutoff)return;
  const fixtures=loadDecisionFixtures().filter(f=>Number.isFinite(Number(f.current))&&String(f.draftId||'')===draftId(els.draftInput.value));
  const points=[...new Map(fixtures.map(f=>[Number(f.current),f])).values()].sort((a,b)=>Number(a.current)-Number(b.current));
  els.livePreviewCutoff.innerHTML='';
  if(points.length){for(const f of points){const current=Number(f.current),cut=Math.max(0,current-1);els.livePreviewCutoff.add(new Option(`Pick ${current} · Cutoff ${cut}`,String(cut)));}}
  else{for(const current of [9,12,29,32,49,52,69,72,89,92,109,112,129,132,149])els.livePreviewCutoff.add(new Option(`Pick ${current} · Cutoff ${current-1}`,String(current-1)));}
}
function setDraftSurface(name){
  if(name!=='live')name='mock';
  document.body.classList.toggle('draft-live-view',name==='live');if(name!=='live')document.body.classList.remove('live-coach-active');
  els.mockViewBtn?.classList.toggle('active',name==='mock');els.liveViewBtn?.classList.toggle('active',name==='live');
  localStorage.setItem('v118_draftSurface',name);
  if(name==='live'){
    els.draftMode.value='live';
    if(els.autoRefresh.checked){els.autoRefresh.checked=false;setAuto();}
    populateLivePreviewPoints();
    renderLiveManagerModeStatus();
    if(els.liveLockStatus){els.liveLockStatus.className='notice ok';els.liveLockStatus.textContent=`LIVE-Engine aktiv · Slot ${els.slot.value} · Progressive/Panel-/Manager-State unverändert.`;}
  }else{
    livePreviewActive=false;if(els.livePreviewExitBtn)els.livePreviewExitBtn.hidden=true;
    if(els.livePreviewStatus)els.livePreviewStatus.textContent='Vorschau inaktiv.';
    if(els.draftMode.value==='live')els.draftMode.value='mock';
  }
  persist();updateStatus();
}
if(els.mockViewBtn)els.mockViewBtn.onclick=()=>setDraftSurface('mock');
if(els.liveViewBtn)els.liveViewBtn.onclick=()=>setDraftSurface('live');
if(els.livePreviewBtn)els.livePreviewBtn.onclick=async()=>{try{livePreviewActive=true;els.draftMode.value='live';els.livePreviewExitBtn.hidden=false;els.livePreviewStatus.className='notice warn';els.livePreviewStatus.textContent='Read-only Vorschau aktiv …';await refresh();document.body.classList.add('live-coach-active');els.livePreviewStatus.className='notice ok';els.livePreviewStatus.textContent=`Read-only LIVE-Vorschau bei Pick ${Number(els.livePreviewCutoff.value)+1}. Keine Forecast-/Decision-Fixtures geschrieben.`;}catch(e){livePreviewActive=false;els.livePreviewStatus.className='notice bad';els.livePreviewStatus.textContent=e.message;}};
if(els.livePreviewExitBtn)els.livePreviewExitBtn.onclick=()=>{livePreviewActive=false;document.body.classList.remove('live-coach-active');els.livePreviewExitBtn.hidden=true;els.livePreviewStatus.className='notice';els.livePreviewStatus.textContent='Vorschau inaktiv. Nächste Analyse verwendet den echten Draftzustand.';};
function setWorkspace(name){
  const valid=['draft','roster','waiver','trade','live'];if(!valid.includes(name))name='draft';
  localStorage.setItem('v117_workspace',name);
  document.querySelectorAll('[data-workspace]').forEach(el=>{el.hidden=el.dataset.workspace!==name});
  document.querySelectorAll('[data-workspace-target]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.workspaceTarget===name);btn.setAttribute('aria-pressed',btn.dataset.workspaceTarget===name?'true':'false')});
}
document.querySelectorAll('[data-workspace-target]').forEach(btn=>btn.addEventListener('click',()=>setWorkspace(btn.dataset.workspaceTarget)));
setDraftSurface(localStorage.getItem('v118_draftSurface')||'mock');
setWorkspace(localStorage.getItem('v117_workspace')||'draft');
updateResearchCacheStatus();

// Derived v2/v3/v4/v5 panels are intentionally not persisted as a second full localStorage
// copy. Rebuild them deterministically from the persisted per-expert caches on every app
// startup; otherwise a clean reopen leaves v4/v5 source counts present but COMPLETE=0 and
// disables both selectors until "Alles aktualisieren" is run again.
function rehydrateDerivedExpertPanelsOnStartup(){
  try{
    ensureExpertV2Panels();
    ensureExpertV3Panels();
    ensureExpertV4Panels();
    ensureExpertV5Panels();
    syncAnalysisExpertSelector();
  }catch(e){
    console.warn('Derived expert-panel startup rehydration failed',e);
  }
}
rehydrateDerivedExpertPanelsOnStartup();
void syncWatcherFeed();
setInterval(()=>{if(!document.hidden)void syncWatcherFeed()},15*60*1000);

try{renderAll();setAuto();updateStatus();void bootstrapSeasonWorkspace();}catch(e){
  console.error('PITTI startup tail failed',e);
  const q=document.getElementById('qualityStatus');
  if(q){q.className='notice bad';q.textContent='Startfehler nach UI-Bindung: '+(e?.message||String(e));}
}