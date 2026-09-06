(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiTradeTeamNeedsV2=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SKILL=new Set(['QB','RB','WR','TE']);
  const FLEX={QB:['QB'],RB:['RB'],WR:['WR'],TE:['TE'],FLEX:['RB','WR','TE'],'W/R':['RB','WR'],'WRRB_FLEX':['RB','WR'],'W/R/T':['RB','WR','TE'],'REC_FLEX':['RB','WR','TE']};
  const DEFAULT_SLOTS=['QB','RB','WR','WR','TE','FLEX','W/R','K','DST'];
  const normPos=p=>String(p||'').toUpperCase()==='DEF'?'DST':String(p||'').toUpperCase();
  const eligible=(slot,pos)=>(FLEX[String(slot||'').toUpperCase()]||[normPos(slot)]).includes(normPos(pos));
  const valueOf=(row,values)=>Number(values?.[String(row?.p?.id)]?.value??values?.[row?.p?.name]?.value);
  const pickOf=row=>Number(row?.draft_pick??row?.pk?.pick_no);
  const active=roster=>(roster||[]).filter(x=>x&&x.seasonStatus!=='RESERVE'&&x.seasonStatus!=='IR');
  const tradable=roster=>active(roster).filter(x=>SKILL.has(normPos(x.p?.pos)));

  function adaptEvidence(raw,now=Date.now(),maxAgeMs=7*86400000){
    const asOf=Date.parse(raw?.as_of||raw?.asOf||''),expiresAt=Date.parse(raw?.expires_at||raw?.expiresAt||'');
    const source=String(raw?.source||raw?.provider||'').trim(),rows=raw?.values;
    const fresh=!!source&&Number.isFinite(asOf)&&asOf<=now+3600000&&now-asOf<=maxAgeMs&&(!Number.isFinite(expiresAt)||now<=expiresAt);
    return{available:fresh&&rows&&typeof rows==='object',fresh,source:source||null,asOf:Number.isFinite(asOf)?asOf:null,values:rows&&typeof rows==='object'?rows:{},reason:!source?'MISSING_PROVENANCE':!Number.isFinite(asOf)?'MISSING_AS_OF':!fresh?'STALE_VALUATION':!rows?'MISSING_VALUES':'OK'};
  }

  function bestLineup(roster,values,slots=DEFAULT_SLOTS){
    const pool=active(roster),used=new Set(),assignments=[];
    const order=slots.map((slot,index)=>({slot,index,count:pool.filter(x=>Number.isFinite(valueOf(x,values))&&eligible(slot,x.p?.pos)).length})).sort((a,b)=>a.count-b.count||a.index-b.index);
    for(const d of order){
      const choice=pool.map((x,i)=>({x,i,v:valueOf(x,values)})).filter(z=>!used.has(z.i)&&Number.isFinite(z.v)&&eligible(d.slot,z.x.p?.pos)).sort((a,b)=>b.v-a.v)[0];
      if(choice)used.add(choice.i);assignments.push({slot:d.slot,index:d.index,player:choice?.x||null,value:choice?.v||0});
    }
    assignments.sort((a,b)=>a.index-b.index);
    return{assignments,score:assignments.reduce((n,x)=>n+x.value,0),used};
  }

  function rosterUtility(roster,values,slots=DEFAULT_SLOTS){
    const rows=active(roster),lineup=bestLineup(rows,values,slots);
    const bench=rows.filter((_,i)=>!lineup.used.has(i)).map(x=>valueOf(x,values)).filter(Number.isFinite).sort((a,b)=>b-a);
    return lineup.score+bench.reduce((n,v,i)=>n+v*(i<3?.16:.06),0);
  }

  function needs(roster,values,slots=DEFAULT_SLOTS){
    const base=rosterUtility(roster,values,slots),out={};
    for(const pos of SKILL){
      const synthetic={p:{id:'need-'+pos,name:'need-'+pos,pos},seasonStatus:'ACTIVE'};
      const copy={...values,['need-'+pos]:{value:50}};
      out[pos]=Math.max(0,rosterUtility([...active(roster),synthetic],copy,slots)-base);
    }
    return out;
  }

  function preservesCore(before,after,incoming){
    for(const pos of ['QB','TE']){
      const had=active(before).filter(x=>normPos(x.p?.pos)===pos).length;
      const has=active(after).filter(x=>normPos(x.p?.pos)===pos).length;
      if(had===1&&has===0&&!incoming.some(x=>normPos(x.p?.pos)===pos))return false;
    }
    return true;
  }

  function temporalPhase({season,currentDate=Date.now()}={}){
    const rawWeek=season?.week??season?.transaction_round??season?.league?.settings?.leg;
    const week=Number(rawWeek);
    if(rawWeek!==null&&rawWeek!==undefined&&rawWeek!==''&&Number.isInteger(week)&&week>=1)return'IN_SEASON';
    if(rawWeek!==null&&rawWeek!==undefined&&rawWeek!==''&&Number.isInteger(week)&&week===0)return'PRE_WEEK_1';
    const startsAt=Date.parse(season?.season_start_date||season?.league?.season_start_date||season?.league?.start_date||'');
    const now=typeof currentDate==='number'?currentDate:Date.parse(currentDate||'');
    if(Number.isFinite(startsAt)&&Number.isFinite(now))return now<startsAt?'PRE_WEEK_1':'IN_SEASON';
    return'AMBIGUOUS';
  }

  function evaluateOffer({mine,opponent,give,get,evidence,slots=DEFAULT_SLOTS,maxActive=15,season,currentDate}){
    const ev=evidence?.values?evidence:adaptEvidence(evidence);
    const result={actionable:false,status:'REJECT',reason:'',acceptanceProbability:null,acceptanceLabel:'conservative heuristic'};
    if(!ev.available){result.status='MONITOR';result.reason=ev.reason||'MISSING_OR_STALE_VALUATION';return result;}
    const phase=temporalPhase({season,currentDate});
    if(phase==='AMBIGUOUS'){result.status='MONITOR';result.reason='TEMPORAL_STATE_UNVERIFIED';return result;}
    if(![...give,...get].every(x=>Number.isFinite(valueOf(x,ev.values)))){result.status='MONITOR';result.reason='PLAYER_VALUE_UNAVAILABLE';return result;}
    if(!give.length||!get.length||give.length>2||get.length>2){result.reason='UNSUPPORTED_BUNDLE';return result;}
    const mineActive=active(mine),oppActive=active(opponent),giveIds=new Set(give.map(x=>String(x.p?.id))),getIds=new Set(get.map(x=>String(x.p?.id)));
    const mineAfterRoster=[...mineActive.filter(x=>!giveIds.has(String(x.p?.id))),...get],oppAfterRoster=[...oppActive.filter(x=>!getIds.has(String(x.p?.id))),...give];
    if(mineAfterRoster.length>maxActive||oppAfterRoster.length>maxActive){result.reason='ILLEGAL_ROSTER_CAPACITY';return result;}
    if(!preservesCore(mineActive,mineAfterRoster,get)||!preservesCore(oppActive,oppAfterRoster,give)){result.reason='ONLY_ACTIVE_QB_TE';return result;}
    const myBefore=rosterUtility(mineActive,ev.values,slots),myAfter=rosterUtility(mineAfterRoster,ev.values,slots),oppBefore=rosterUtility(oppActive,ev.values,slots),oppAfter=rosterUtility(oppAfterRoster,ev.values,slots);
    result.myUtility=myAfter-myBefore;result.opponentUtility=oppAfter-oppBefore;result.myNeeds=needs(mineActive,ev.values,slots);result.opponentNeeds=needs(oppActive,ev.values,slots);
    if(result.myUtility<=0||result.opponentUtility<=0){result.reason=result.opponentUtility<=0?'OPPONENT_UTILITY_NOT_IMPROVED':'PITTI_UTILITY_NOT_IMPROVED';return result;}
    const severe=phase==='PRE_WEEK_1'&&get.some(receive=>give.every(sent=>Number.isFinite(pickOf(receive))&&Number.isFinite(pickOf(sent))&&pickOf(sent)-pickOf(receive)>24));
    const reversalExplained=[...give,...get].some(x=>{const row=ev.values[String(x.p?.id)]||ev.values[x.p?.name]||{},at=Date.parse(row.reversal_evidence_as_of||'');return row.fresh_reversal_evidence===true&&!!String(row.reversal_evidence_source||'').trim()&&Number.isFinite(at)&&Date.now()-at<=7*86400000&&at<=Date.now()+3600000;});
    if(severe&&!reversalExplained){result.reason='SEVERE_DRAFT_CAPITAL_REVERSAL';return result;}
    const giveValue=give.reduce((n,x)=>n+valueOf(x,ev.values),0),getValue=get.reduce((n,x)=>n+valueOf(x,ev.values),0),gap=Math.abs(giveValue-getValue)/Math.max(giveValue,getValue,1);
    if(gap>.18){result.reason='TRADE_VALUE_GAP';return result;}
    result.actionable=true;result.status='REVIEW';result.reason='BILATERAL_UTILITY_PASS';result.acceptanceProbability=Math.max(5,Math.min(35,Math.round(22-gap*60+Math.min(6,result.opponentUtility/4))));
    return result;
  }

  function generate({mine,opponent,evidence,slots=DEFAULT_SLOTS,maxActive=15,season,currentDate}){
    const a=tradable(mine),b=tradable(opponent),offers=[];
    const bundles=rows=>[...rows.map(x=>[x]),...rows.flatMap((x,i)=>rows.slice(i+1).map(y=>[x,y]))];
    for(const give of bundles(a))for(const get of bundles(b)){
      if(give.length===2&&get.length===2)continue;
      const evaluation=evaluateOffer({mine,opponent,give,get,evidence,slots,maxActive,season,currentDate});
      if(evaluation.actionable)offers.push({give,get,...evaluation});
    }
    return offers.sort((x,y)=>(y.myUtility+y.opponentUtility)-(x.myUtility+x.opponentUtility));
  }

  return{DEFAULT_SLOTS,temporalPhase,adaptEvidence,bestLineup,rosterUtility,needs,evaluateOffer,generate};
});
