(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.PittiLineupStartSitV2=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const DEFAULT_SLOTS=['QB','RB','WR','WR','TE','FLEX','W/R','K','DST'];
  const SKILL=new Set(['QB','RB','WR','TE']);
  const normPos=p=>String(p||'').toUpperCase()==='DEF'?'DST':String(p||'').toUpperCase();
  const eligible=(slot,pos)=>{
    const s=String(slot||'').toUpperCase(),p=normPos(pos);
    if(s==='FLEX')return ['RB','WR','TE'].includes(p);
    if(s==='W/R')return ['RB','WR'].includes(p);
    return normPos(s)===p;
  };
  const active=roster=>(roster||[]).filter(x=>x&&x.seasonStatus!=='RESERVE'&&x.seasonStatus!=='IR');
  const playerKey=row=>String(row?.p?.id??row?.player_id??'');

  function adaptEvidence(raw,{week,now=Date.now(),maxAgeMs=7*86400000}={}){
    const evidenceWeek=Number(raw?.week),requestedWeek=Number(week),asOf=Date.parse(raw?.as_of||raw?.asOf||''),source=String(raw?.source||raw?.provider||'').trim();
    const scoring=String(raw?.scoring||raw?.format||'').toUpperCase().replace(/[^A-Z]/g,'');
    const values=raw?.players||raw?.values;
    const weekMatches=Number.isInteger(evidenceWeek)&&evidenceWeek>0&&(!Number.isInteger(requestedWeek)||requestedWeek===evidenceWeek);
    const fresh=Number.isFinite(asOf)&&asOf<=now+3600000&&now-asOf<=maxAgeMs;
    const halfPpr=['HALF','HALFPPR','05PPR'].includes(scoring);
    const available=!!source&&weekMatches&&fresh&&halfPpr&&values&&typeof values==='object';
    const reason=!source?'MISSING_PROVENANCE':!weekMatches?'WEEK_MISMATCH':!halfPpr?'SCORING_MISMATCH':!Number.isFinite(asOf)?'MISSING_AS_OF':!fresh?'STALE_WEEKLY_EVIDENCE':!values?'MISSING_PLAYER_EVIDENCE':'OK';
    return{available,fresh,source:source||null,asOf:Number.isFinite(asOf)?asOf:null,week:evidenceWeek||null,scoring:halfPpr?'HALF_PPR':null,values:values&&typeof values==='object'?values:{},reason,now,maxAgeMs};
  }

  function playerEvidence(row,evidence){
    const raw=evidence?.values?.[playerKey(row)]||evidence?.values?.[row?.p?.name]||{};
    const projection=Number(raw.projected_points??raw.projection_half_ppr??raw.projection),rank=Number(raw.positional_rank??raw.rank),opponent=String(raw.opponent||'').trim();
    const available=!!evidence?.available&&Number.isFinite(projection)&&projection>=0&&Number.isInteger(rank)&&rank>0&&!!opponent;
    const context=raw.team_context,contextAt=Date.parse(context?.as_of||context?.asOf||''),contextSource=String(context?.source||context?.provider||'').trim();
    const contextFresh=!!contextSource&&Number.isFinite(contextAt)&&contextAt<=evidence.now+3600000&&evidence.now-contextAt<=evidence.maxAgeMs;
    return{available,projection:available?projection:null,rank:available?rank:null,opponent:available?opponent:null,teamContext:contextFresh?context:null,reason:!evidence?.available?evidence?.reason:!Number.isFinite(projection)?'MISSING_WEEK_PROJECTION':!Number.isInteger(rank)||rank<=0?'MISSING_POSITIONAL_RANK':!opponent?'MISSING_OPPONENT':'OK'};
  }

  function optimize(roster,evidence,slots=DEFAULT_SLOTS){
    const pool=active(roster).map((row,index)=>({row,index,ev:playerEvidence(row,evidence)})).filter(x=>x.ev.available);
    let best={score:-Infinity,assignments:[]};
    function visit(slotIndex,used,assignments,score){
      if(slotIndex===slots.length){if(score>best.score)best={score,assignments:[...assignments]};return;}
      const slot=slots[slotIndex],choices=pool.filter(x=>!used.has(x.index)&&eligible(slot,x.row?.p?.pos));
      if(!choices.length){visit(slotIndex+1,used,[...assignments,{slot,player:null,evidence:null}],score);return;}
      for(const choice of choices){used.add(choice.index);assignments.push({slot,player:choice.row,evidence:choice.ev});visit(slotIndex+1,used,assignments,score+choice.ev.projection);assignments.pop();used.delete(choice.index);}
    }
    visit(0,new Set(),[],0);
    const assignedIds=new Set(best.assignments.filter(x=>x.player).map(x=>playerKey(x.player)));
    const complete=best.assignments.length===slots.length&&best.assignments.every(x=>x.player);
    return{...best,complete,assignedIds,status:complete?'RECOMMENDED':'MONITOR'};
  }

  function alternatives(roster,evidence,lineup,{materialPoints=.5,limit=4}={}){
    if(!lineup?.complete)return[];
    const bench=active(roster).filter(x=>!lineup.assignedIds.has(playerKey(x))).map(row=>({row,ev:playerEvidence(row,evidence)})).filter(x=>x.ev.available&&SKILL.has(normPos(x.row?.p?.pos)));
    const out=[];
    for(const starter of lineup.assignments){
      if(!starter.player||!SKILL.has(normPos(starter.player.p?.pos)))continue;
      for(const candidate of bench){
        if(!eligible(starter.slot,candidate.row.p?.pos))continue;
        const edge=candidate.ev.projection-starter.evidence.projection;
        if(Math.abs(edge)>=materialPoints)out.push({slot:starter.slot,start:edge>0?candidate.row:starter.player,bench:edge>0?starter.player:candidate.row,edge:Math.abs(edge),recommended:edge>0});
      }
    }
    return out.sort((a,b)=>b.edge-a.edge).slice(0,limit);
  }

  function evaluate({roster,evidence,week,slots=DEFAULT_SLOTS,now=Date.now()}={}){
    const ev=evidence?.values&&Object.hasOwn(evidence,'available')?evidence:adaptEvidence(evidence,{week,now});
    if(!ev.available)return{status:'UNAVAILABLE',reason:ev.reason,evidence:ev,lineup:null,alternatives:[]};
    const lineup=optimize(roster,ev,slots),alts=alternatives(roster,ev,lineup);
    return{status:lineup.complete?'RECOMMENDED':'MONITOR',reason:lineup.complete?'OK':'INCOMPLETE_VERIFIED_LINEUP',evidence:ev,lineup,alternatives:alts};
  }

  return{DEFAULT_SLOTS,eligible,adaptEvidence,playerEvidence,optimize,alternatives,evaluate};
});
