(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiSpecialTeamsStream=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const normPos=value=>String(value||'').toUpperCase()==='DEF'?'DST':String(value||'').toUpperCase();
  const playerId=row=>String(row?.p?.id??row?.player_id??row?.id??'');
  const active=roster=>(roster||[]).filter(row=>row&&row.seasonStatus!=='RESERVE'&&row.seasonStatus!=='IR');
  const available=(candidates,ownedIds)=>candidates.filter(row=>!ownedIds.has(playerId(row)));

  function protectedDrop(row,roster){
    const pos=normPos(row?.p?.pos),counts=active(roster).reduce((out,x)=>(out[normPos(x?.p?.pos)]=(out[normPos(x?.p?.pos)]||0)+1,out),{});
    return (pos==='QB'||pos==='TE')&&counts[pos]<=1;
  }
  function ordinaryDrops(roster){
    return active(roster).filter(row=>['QB','RB','WR','TE'].includes(normPos(row?.p?.pos))&&!protectedDrop(row,roster)).sort((a,b)=>Number(a.dropCost??Infinity)-Number(b.dropCost??Infinity));
  }
  function capacityPlan(roster,{activeLimit=15,retainCurrent=false,currentSpecial=null}={}){
    const rows=active(roster),needsSlot=retainCurrent||!currentSpecial;
    if(!needsSlot)return{legal:true,drop:currentSpecial,cost:Number(currentSpecial?.dropCost||0),reason:'SAME_POSITION_REPLACEMENT'};
    if(rows.length<activeLimit)return{legal:true,drop:null,cost:0,reason:'OPEN_ACTIVE_SLOT'};
    const drop=ordinaryDrops(roster)[0]||null;
    return drop?{legal:true,drop,cost:Number(drop.dropCost||0),reason:'ACTIVE_ROSTER_DROP'}:{legal:false,drop:null,cost:Infinity,reason:'NO_LEGAL_ACTIVE_DROP'};
  }
  function selected(cache,kind,week,id){return globalThis.PittiSeasonEvidence?.select(cache,{kind,week,playerId:id})||{status:'UNAVAILABLE'};}
  function verifiedPlayerWeek(cache,row,week){
    const id=playerId(row),projection=selected(cache,'PLAYER_PROJECTION',week,id),rank=selected(cache,'POSITIONAL_RANK',week,id),opponent=selected(cache,'OPPONENT',week,id);
    const records=[projection.record,rank.record,opponent.record].filter(Boolean),gameIds=new Set(records.map(x=>x.gameId).filter(Boolean));
    if([projection,rank,opponent].some(x=>x.status!=='AVAILABLE')||gameIds.size!==1)return{available:false,reason:gameIds.size>1?'TARGET_GAME_MISMATCH':'MATCHUP_EVIDENCE_UNAVAILABLE',projection,rank,opponent};
    const gameId=[...gameIds][0],team=projection.record.team||row?.p?.team||null;
    const stadium=globalThis.PittiSeasonEvidence.select(cache,{kind:'STADIUM_TYPE',week,gameId});
    const weather=globalThis.PittiSeasonEvidence.weatherImpact(cache,{week,gameId});
    const implied=team?globalThis.PittiSeasonEvidence.impliedTeamTotal(cache,{week,gameId,team}):{status:'UNAVAILABLE'};
    const contextReady=implied.status==='AVAILABLE'&&stadium.status==='AVAILABLE'&&(weather.suppressed||weather.status==='AVAILABLE');
    return{available:contextReady,reason:contextReady?'OK':'GAME_CONTEXT_UNAVAILABLE',week,projection:projection.value,rank:rank.value,opponent:opponent.value,gameId,impliedTotal:implied.value,weather,provenance:records.concat(implied.provenance||[],weather.provenance||[])};
  }
  function provenance(rows){
    const seen=new Set();return(rows||[]).filter(Boolean).filter(row=>{const key=`${row.provider}|${row.sourceAsOf}|${row.kind}`;if(seen.has(key))return false;seen.add(key);return true;}).map(row=>({kind:row.kind,provider:row.provider,sourceAsOf:row.sourceAsOf,status:row.status}));
  }
  function dstScore(ev){return ev.projection-ev.impliedTotal*.08+(25-ev.rank)*.04-(ev.weather?.material?.5:0);}
  function evaluateDst({roster=[],candidates=[],ownedPlayerIds=[],evidenceCache,week,activeLimit=15,earlyStashMargin=1.25,streamMargin=.75}={}){
    const rows=active(roster),owned=new Set([...ownedPlayerIds].map(String)),current=rows.find(x=>normPos(x?.p?.pos)==='DST')||null;
    const currentWeek=current?verifiedPlayerWeek(evidenceCache,current,week):null;
    return available(candidates.filter(x=>normPos(x?.p?.pos)==='DST'),owned).map(candidate=>{
      const now=verifiedPlayerWeek(evidenceCache,candidate,week),next=verifiedPlayerWeek(evidenceCache,candidate,Number(week)+1);
      const currentNext=current?verifiedPlayerWeek(evidenceCache,current,Number(week)+1):null;
      if(!now.available)return{type:'DST',candidate,status:'MONITOR',actionable:false,reason:now.reason,currentWeek:now,forwardWeek:next,provenance:provenance(now.provenance)};
      if(current&&!currentWeek?.available)return{type:'DST',candidate,current,status:'MONITOR',actionable:false,reason:'ROSTER_DST_EVIDENCE_UNAVAILABLE',currentWeek:now,forwardWeek:next,provenance:provenance(now.provenance)};
      const currentEdge=currentWeek?.available?dstScore(now)-dstScore(currentWeek):null;
      const forwardEdge=next.available&&(!current||currentNext?.available)?(currentNext?.available?dstScore(next)-dstScore(currentNext):dstScore(next)):null;
      const earlyStash=Number.isFinite(forwardEdge)&&forwardEdge>=earlyStashMargin&&(currentEdge==null||currentEdge<streamMargin);
      const plan=capacityPlan(roster,{activeLimit,retainCurrent:earlyStash,currentSpecial:current});
      const benefit=earlyStash?forwardEdge:currentEdge==null?dstScore(now):currentEdge,netBenefit=benefit-plan.cost;
      const actionable=plan.legal&&Number.isFinite(netBenefit)&&netBenefit>=(earlyStash?earlyStashMargin:streamMargin)&&(earlyStash?next.available:true);
      return{type:'DST',candidate,current,action:actionable?'STREAM/ADD':earlyStash?'MONITOR':'HOLD',status:actionable?'STREAM/ADD':earlyStash?'MONITOR':'HOLD',actionable,reason:!plan.legal?plan.reason:actionable?(earlyStash?'EARLY_STASH_NET_BENEFIT':'CURRENT_WEEK_STREAM_EDGE'):'NET_BENEFIT_BELOW_COST',currentWeek:now,forwardWeek:next,currentEdge,forwardEdge,earlyStash,benefit,netBenefit,capacity:plan,provenance:provenance([...(now.provenance||[]),...(next.provenance||[])])};
    }).sort((a,b)=>(b.netBenefit??-Infinity)-(a.netBenefit??-Infinity));
  }
  function evaluateKicker({roster=[],candidates=[],ownedPlayerIds=[],evidenceCache,week,meaningfulEdge=1.5}={}){
    const rows=active(roster),owned=new Set([...ownedPlayerIds].map(String)),current=rows.find(x=>normPos(x?.p?.pos)==='K')||null,currentEvidence=current?verifiedPlayerWeek(evidenceCache,current,week):null;
    const pool=available(candidates.filter(x=>normPos(x?.p?.pos)==='K'),owned);
    if(!current||!currentEvidence?.available)return{type:'K',current,status:'MONITOR',actionable:false,reason:current?'ROSTER_KICKER_EVIDENCE_UNAVAILABLE':'NO_LIVE_ROSTERED_KICKER',candidates:[]};
    const evaluated=pool.map(candidate=>{const evidence=verifiedPlayerWeek(evidenceCache,candidate,week);if(!evidence.available)return{candidate,evidence,edge:null,status:'MONITOR',actionable:false,reason:evidence.reason};const edge=evidence.projection-currentEvidence.projection;return{candidate,evidence,edge,status:edge>=meaningfulEdge?'STREAM/ADD':'HOLD',actionable:edge>=meaningfulEdge,reason:edge>=meaningfulEdge?'MEANINGFUL_VERIFIED_EDGE':'MARGINAL_EDGE_AVOID_CHURN',drop:current,provenance:provenance(evidence.provenance)};}).sort((a,b)=>(b.edge??-Infinity)-(a.edge??-Infinity));
    const best=evaluated[0]||null;
    return{type:'K',current,currentEvidence,status:best?.actionable?'STREAM/ADD':'HOLD',actionable:!!best?.actionable,reason:best?.reason||'NO_AVAILABLE_VERIFIED_KICKER',best,candidates:evaluated};
  }
  function evaluate(input={}){
    return{dst:evaluateDst(input),kicker:evaluateKicker(input)};
  }
  return{normPos,active,protectedDrop,ordinaryDrops,capacityPlan,verifiedPlayerWeek,evaluateDst,evaluateKicker,evaluate};
});
