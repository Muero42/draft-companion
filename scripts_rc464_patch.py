from pathlib import Path
p=Path('app.js')
s=p.read_text()
old="""  const qualityBandMax=bestPanelRank+Math.max(3,Math.floor(threshold/2));
  const qualityBand=valid.filter(x=>x.r.rank<=qualityBandMax);
  const safetyLeader=qualityBand.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];"""
new="""  const qualityBandMax=bestPanelRank+Math.max(3,Math.floor(threshold/2));
  // rc4.64: Safety must not resurrect a repeated QB/TE after roster scoring demoted it.
  // Existing exceptional-slide thresholds are reused exactly; no new numeric penalty family.
  const safetyPromotionEligible=x=>{
    if(x.p.pos==='QB'&&(x.stateCounts?.QB??0)>=1)return x.r.rank<=45&&Number.isFinite(x.a)&&current-x.a>=35;
    if(x.p.pos==='TE'&&(x.stateCounts?.TE??0)>=1)return x.r.rank<=35&&Number.isFinite(x.a)&&current-x.a>=30;
    return true;
  };
  const eligible=valid.filter(safetyPromotionEligible);
  const eligibleBestPanelRank=eligible.length?Math.min(...eligible.map(x=>x.r.rank)):bestPanelRank;
  const eligibleBandMax=eligibleBestPanelRank+Math.max(3,Math.floor(threshold/2));
  const qualityBand=eligible.filter(x=>x.r.rank<=eligibleBandMax);
  const safetyLeader=qualityBand.slice().sort((a,b)=>b.rawScore-a.rawScore||a.r.rank-b.r.rank)[0];"""
if 'const safetyPromotionEligible=x=>' not in s:
    if old not in s: raise SystemExit('Safety target not found')
    s=s.replace(old,new,1)
old2="""    const scored=rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,strategy)})).filter(x=>x.r);
    const referenceBalanced=strategy==='progressive'?rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,'balanced')})).filter(x=>x.r):null;"""
new2="""    const scored=rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,strategy),stateCounts:{...state.counts}})).filter(x=>x.r);
    const referenceBalanced=strategy==='progressive'?rankedAvailable.map(p=>({p,...scoreCandidate(p,current,returnPick,state,rankedAvailable,'balanced'),stateCounts:{...state.counts}})).filter(x=>x.r):null;"""
if 'stateCounts:{...state.counts}' not in s:
    if old2 not in s: raise SystemExit('scored target not found')
    s=s.replace(old2,new2,1)
p.write_text(s)
print('PASS rc4.64 narrow patch applied')
