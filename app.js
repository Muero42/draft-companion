import {USER_DRAFT_QB_LIMIT,userDraftStrategyExcluded,safetyPromotionEligiblePolicy} from './decision-policy.js';
const APP_VERSION='v11.8.0-rc4.175';
const $=id=>document.getElementById(id);
const ids=['onlineState','rankingAge','adpCount','qualityMini','seasonLiveStateAge','seasonLiveStateStatus','seasonRankingAge','seasonRankingStatus','apiQuickStatus','qualityStatus','panelSummary','dataSection','draftSection','coachSection','loadExpertsBtn','applyPresetBtn','loadAllRanksBtn','refreshAllBtn','expertDeltaBtn','presetStatus','panelStatus','adpFile','adpStatus','adpHelper','draftInput','slot','topN','snapshotMode','draftMode','replayCutoff','managerMap','stressMode','modeStatus','simulateBtn','simulationStatus','simulationResults','strategyMode','strategyStatus','refreshBtn','copyBtn','shareBtn','autoRefresh','draftStatus','draftSummary','teamSummary','favoritesBlock','coachList','snapshot','emptyCoach','logDecisionBtn','clearLogBtn','mockReview','decisionLog','apiKey','toggleKeyBtn','clearKeyBtn','season','scoring','activePanel','diagnoseBtn','diagnostic','expertSearch','expertsList','savePanelBtn','newPanelBtn','renamePanelBtn','deletePanelBtn','qbPanel','rbPanel','wrPanel','tePanel','backupBtn','restoreFile','decisionEvidenceBtn','decisionEvidenceStatus','clearDraftDataBtn','researchCacheStatus','watcherSyncStatus','rosterStatus','rosterSummary','rosterList','rosterBenchStatus','rosterBenchList','rosterFaStatus','rosterFaList','tradeStatus','tradeList','waiverStatus','waiverList','seasonActionStatus','seasonActionList','fpHandoff','fpOpenBtn','fpSetupBtn','fpImportFile','fpStatus','queueBtn','mockViewBtn','liveViewBtn','livePreviewCutoff','livePreviewBtn','livePreviewExitBtn','livePreviewStatus','liveLockStatus','expertProfile','analysisExpertProfile','analysisExpertAuditStatus','expertV3AuditBtn','expertV3AuditStatus','liveManagerModeControl','liveManagerGrid','liveManagerApply','liveManagerModeStatus'];
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
  let draftMeta=(draft&&draft.draft_id)?draft:null;
  if(!draftMeta){try{draftMeta=await jf(S+'/draft/'+LIVE_DRAFT_ID_2026+'?_='+Date.now(),'Season-Identität',6000)}catch(e){console.warn('PITTI season identity draft lookup failed',e)}}
  let leagueId=String(store.text(SEASON_LEAGUE_ID_KEY,'')||draftMeta?.league_id||'').trim();
  if(!leagueId)return{ok:false,reason:'NO_LEAGUE_ID'};
  store.setText(SEASON_LEAGUE_ID_KEY,leagueId);
  const bust=Date.now()+'-'+Math.random().toString(36).slice(2);
  const rosters=await jf(S+'/league/'+encodeURIComponent(leagueId)+'/rosters?_='+bust,'Sleeper Kader',7000);
  if(!Array.isArray(rosters)||!rosters.length)return{ok:false,reason:'LEAGUE_ROSTERS_EMPTY',leagueId};
  const slot=Number(els.slot.value||9);
  let userId=String(store.text(SEASON_USER_ID_KEY,'')||'').trim();
  const mappedRosterId=Number(draftMeta?.slot_to_roster_id?.[String(slot)]??draftMeta?.slot_to_roster_id?.[slot]);
  let roster=userId?rosters.find(x=>String(x.owner_id||'')===userId):null;
  if(!roster&&Number.isFinite(mappedRosterId))roster=rosters.find(x=>Number(x.roster_id)===mappedRosterId);
  if(!roster){const order=draftMeta?.draft_order||{};const ownerFromSlot=Object.entries(order).find(([,s])=>Number(s)===slot)?.[0]||'';if(ownerFromSlot)roster=rosters.find(x=>String(x.owner_id||'')===String(ownerFromSlot));}
  if(!roster)return{ok:false,reason:'USER_ROSTER_MAPPING_UNRESOLVED',leagueId,userId,slot};
  userId=String(roster.owner_id||'').trim();if(!userId)return{ok:false,reason:'USER_ID_UNRESOLVED',leagueId,slot,rosterId:roster.roster_id};
  store.setText(SEASON_USER_ID_KEY,userId);
  const ownership={};for(const r of rosters){const reserve=new Set((r.reserve||[]).map(String)),taxi=new Set((r.taxi||[]).map(String));for(const pid of new Set([...(r.players||[]),...(r.reserve||[]),...(r.taxi||[])].filter(Boolean).map(String))){ownership[pid]={roster_id:r.roster_id,owner_id:r.owner_id,mine:Number(r.roster_id)===Number(roster.roster_id),reserve:reserve.has(pid),taxi:taxi.has(pid)};}}
  return{ok:true,league_id:leagueId,user_id:userId,roster_id:roster.roster_id,generated_at:Date.now(),my_roster:roster,rosters,my_starters:roster.starters||[],my_players:roster.players||[],my_reserve:roster.reserve||[],ownership,source:'Sleeper direct'};
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
  version:'st-v2.1',updated:'2026-09-01',
  acquisitionPolicy:{dstEarlyAdd:'compare replacement edge vs weakest roster option value and market-loss risk',kEarlyAdd:'allow durable top-tier candidate only when projected edge plus market-loss risk clears weakest roster option value',rbPreWeek1OptionValue:'elevated',defaultTiming:'wait unless K/DST scarcity or durable edge clears roster-option threshold'},
  dst:{panelCandidates:['Ted Chmyz — Fantasy Football Blueprint','Nathan Jahnke — PFF','Marc Shannep — Fantasy Knockout','Sean Koerner — Action Network'],specialist:'Joey Pollizze — RotoBaller',qualityFloor:true,horizonWeeks:4},
  k:{panelCandidates:['Jared Smola / Draft Sharks','Joe Bond — Fantasy Six Pack','Nathan Jahnke — PFF','Sean Koerner — Action Network'],qualityFloor:false,horizonWeeks:1,earlyAddWatch:{name:'Harrison Mevis',week1Projection:8.4,week1ProjectionRank:2,draftSharksWeek1Rank:9,rotoballerWeek1Rank:10,policy:'WATCH_NOT_AUTO_ADD',dropCandidatePolicy:{primary:['Tank Bigsby','Tyjae Spears','Kenneth Gainwell'],protected:['Jadarian Price','Christian Watson','Josh Downs'],orderBasis:'standalone role + contingent ceiling; acquisition recency ignored'},rationale:'Strong Rams scoring environment and potential season-hold value; add only if live ownership/market-loss risk and weakest-roster-slot opportunity cost justify it.'}},
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
  // Ownership discovery must be independent from expert-panel hydration. Return the
  // complete live unowned skill-position pool; ranking/filtering happens downstream.
  // This prevents a clean startup with cold rank caches from collapsing a valid FA pool to zero.
  return Object.entries(players||{}).filter(([pid,p])=>!owned.has(String(pid))&&['QB','RB','WR','TE'].includes(String(p.position||'').toUpperCase())&&p.active!==false&&p.full_name).map(([pid])=>sleeperPlayerRow(pid,players)).sort((a,b)=>(a.searchRank||9999)-(b.searchRank||9999));
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
function runSeasonSurface(label,render,statusEl,listEl){
  try{render();return{ok:true,label}}
  catch(e){
    const reason=e?.message||String(e);console.error('PITTI season surface failed',label,e);
    if(statusEl){statusEl.className='notice bad';statusEl.textContent=label+' FAIL-CLOSED · '+reason+' · keine Aktion freigegeben.';}
    if(listEl)listEl.innerHTML='';
    return{ok:false,label,reason};
  }
}
function blockSeasonDependentSurface(label,reason,statusEl,listEl){
  if(statusEl){statusEl.className='notice bad';statusEl.textContent=label+' FAIL-CLOSED · Abhängigkeit '+reason+' nicht verfügbar · keine Aktion freigegeben.';}
  if(listEl)listEl.innerHTML='';
  return{ok:false,label,reason:'DEPENDENCY_'+reason};
}
let seasonBootstrapBusy=false;
function renderSeasonLiveStateFreshness(note=''){
  const t=Number(localStorage.getItem('v118_seasonBootstrapAt')||0),age=t?Date.now()-t:Infinity;
  if(els.seasonLiveStateAge)els.seasonLiveStateAge.textContent=!t?'nicht geladen':age<60000?'< 1 Min.':age<3600000?Math.round(age/60000)+' Min.':Math.round(age/3600000)+' Std.';
  if(els.seasonLiveStateStatus&&!seasonBootstrapBusy)els.seasonLiveStateStatus.textContent=note||(!t?'Live-Kader noch nicht geladen.':'Live-Kader direkt von Sleeper · zuletzt erfolgreich aktualisiert.');
}
async function bootstrapSeasonWorkspace({force=false}={}){
  if(seasonBootstrapBusy){if(force&&els.seasonLiveStateStatus)els.seasonLiveStateStatus.textContent='Kader-Aktualisierung läuft bereits …';return{ok:false,busy:true};}
  if(!navigator.onLine){if(els.seasonLiveStateStatus){els.seasonLiveStateStatus.className='notice warn';els.seasonLiveStateStatus.textContent='Offline · letzter erfolgreicher Live-Kader bleibt sichtbar.';}return{ok:false,offline:true};}
  seasonBootstrapBusy=true;
  if(els.seasonRefreshLiveBtn){els.seasonRefreshLiveBtn.disabled=true;els.seasonRefreshLiveBtn.textContent='Kader lädt …';}
  if(els.seasonLiveStateStatus){els.seasonLiveStateStatus.className='notice';els.seasonLiveStateStatus.textContent='Live-Kader wird direkt von Sleeper geladen …';}
  let stage='league-state';
  try{
    if(els.seasonLiveStateStatus)els.seasonLiveStateStatus.textContent='1/3 Sleeper-Liga und Kader werden geladen …';
    const season=await fetchSeasonLeagueState({});
    if(!season?.ok)throw new Error(season?.reason||'SEASON_LEAGUE_STATE_UNAVAILABLE');
    stage='player-directory';
    const bust=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if(els.seasonLiveStateStatus)els.seasonLiveStateStatus.textContent='2/3 Sleeper-Spielerverzeichnis wird geladen …';
    const players=await jf(`${S}/players/nfl?_=${bust}`,'Season Spieler',15000);
    let draft=null,picks=[],mine=[],teams=10,total=150,slot=Number(els.slot.value||9);
    stage='optional-draft-archive';
    try{
      const id=LIVE_DRAFT_ID_2026;
      [draft,picks]=await Promise.all([jf(`${S}/draft/${id}?_=${bust}`,'Draft-Archiv',6500),jf(`${S}/draft/${id}/picks?_=${bust}`,'Draft-Picks-Archiv',6500)]);
      teams=Number(draft?.settings?.teams||10);total=teams*Number(draft?.settings?.rounds||15);
      mine=(picks||[]).filter(p=>Number(p.draft_slot)===slot).sort((a,b)=>a.pick_no-b.pick_no);
    }catch(e){console.warn('PITTI optional draft archive unavailable',e)}
    stage='live-season-model';
    if(els.seasonLiveStateStatus)els.seasonLiveStateStatus.textContent='3/3 Kader und Saisonflächen werden berechnet …';
    const rows=seasonRosterRows(season,players,mine),available=seasonAvailablePlayers(season,players),availableDST=seasonAvailableSpecialTeams(season,players,'DST'),availableK=seasonAvailableSpecialTeams(season,players,'K');
    if(!rows)throw new Error('MY_ROSTER_UNRESOLVED');
    if(!Array.isArray(available)||available.length===0)throw new Error('SEASON_FA_POOL_ZERO_INVALID');
    const counts=postDraftRosterCounts(rows);
    els.rosterStatus.className='notice ok';els.rosterStatus.textContent='LIVE Sleeper-Kader · '+rows.length+' Spieler · Source of Truth: League-State · Reserve/IR '+rows.filter(x=>x.seasonStatus==='RESERVE').length+' · Auto-Sync beim Start.';
    els.rosterSummary.innerHTML=Object.entries(counts).filter(([,n])=>n).map(([pos,n])=>'<div class="summary-item"><b>'+n+'</b><span>'+pos+'</span></div>').join('');
    els.rosterList.innerHTML=seasonLineupHtml(rows,season);
    lastDraftContext={id:LIVE_DRAFT_ID_2026,current:total,players,picks,mine,teams,rankedAvailable:available||[],availableDST,availableK,draftComplete:true,season,seasonRows:rows,specialTeamsModel:SEASON_SPECIAL_TEAMS_MODEL,historicalDraftAvailable:!!draft};
    lastPostDraftPairs=[];
    stage='season-surfaces';
    runSeasonSurface('Aufstellung',()=>renderRosterBenchAudit(rows,players,total,true),els.rosterBenchStatus,els.rosterBenchList);
    const faLane=runSeasonSurface('FA-vs-Roster',()=>renderRosterFaAudit(rows,available||[],true),els.rosterFaStatus,els.rosterFaList);
    runSeasonSurface('Trades',()=>renderTradeWorkspace(picks,players,slot,teams,true),els.tradeStatus,els.tradeList);
    if(faLane.ok){
      runSeasonSurface('Waiver/FA',()=>renderWaiverWorkspace(true),els.waiverStatus,els.waiverList);
      runSeasonSurface('Action Board',()=>renderSeasonActionBoard(true),els.seasonActionStatus,els.seasonActionList);
    }else{
      blockSeasonDependentSurface('Waiver/FA','FA-vs-Roster',els.waiverStatus,els.waiverList);
      blockSeasonDependentSurface('Action Board','FA-vs-Roster',els.seasonActionStatus,els.seasonActionList);
    }
    updateStatus();renderSeasonRankingFreshness();
    localStorage.setItem('v118_seasonBootstrapAt',String(Date.now()));
    if(els.seasonLiveStateStatus){els.seasonLiveStateStatus.className='notice ok';els.seasonLiveStateStatus.textContent='Live-Kader direkt von Sleeper aktualisiert.';}
    return{ok:true};
  }catch(e){
    const reason=stage+' · '+(e?.message||String(e));console.error('PITTI season bootstrap failed',stage,e);
    if(els.rosterStatus){els.rosterStatus.className='notice warn';els.rosterStatus.textContent='Season Auto-Sync FAIL-CLOSED · '+esc(reason)+' · keine FA-Aktion freigegeben.';}
    if(els.waiverStatus){els.waiverStatus.className='notice bad';els.waiverStatus.textContent='Season Auto-Sync FAIL-CLOSED · '+reason+' · keine Aktion freigegeben.';els.waiverList.innerHTML='';}
    if(els.tradeStatus){els.tradeStatus.className='notice bad';els.tradeStatus.textContent='Season Auto-Sync FAIL-CLOSED · '+reason+' · keine Aktion freigegeben.';els.tradeList.innerHTML='';}
    if(els.seasonLiveStateStatus){els.seasonLiveStateStatus.className='notice bad';els.seasonLiveStateStatus.textContent='Kader-Aktualisierung fehlgeschlagen · '+reason;}
    return{ok:false,error:reason};
  }finally{
    seasonBootstrapBusy=false;
    
    renderSeasonLiveStateFreshness(els.seasonLiveStateStatus?.textContent||'');
  }
}
/* rc4.175 — Season refresh is automatic-only; manual duplicate controls removed. */
renderSeasonLiveStateFreshness();
renderSeasonRankingFreshness();
setInterval(()=>{if(!document.hidden)void syncWatcherFeed()},15*60*1000);

try{
  renderAll();setAuto();updateStatus();
  void (async()=>{
    const rosterResult=await bootstrapSeasonWorkspace();
    // Roster authority always gets first network priority. Ranking/Watcher work starts only
    // after roster bootstrap has either succeeded or failed closed, avoiding mobile connection starvation.
    void refreshSeasonRankings({auto:true});
    void syncWatcherFeed();
    return rosterResult;
  })();
}catch(e){
  console.error('PITTI startup tail failed',e);
  const q=document.getElementById('qualityStatus');
  if(q){q.className='notice bad';q.textContent='Startfehler nach UI-Bindung: '+(e?.message||String(e));}
}