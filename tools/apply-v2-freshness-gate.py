from pathlib import Path

p=Path('app.js')
s=p.read_text()

def once(old,new,label):
    global s
    c=s.count(old)
    if c!=1:
        raise SystemExit(f'{label} mismatch: {c}')
    s=s.replace(old,new)

once("function desiredExpertPoolHealth(){\n", """function expertSourceFreshness(cache,now=Date.now()){
  const raw=String(cache?.sourceUpdated||'').trim();
  if(!raw)return{status:'unknown',days:null,eligible:false,degraded:true};
  const ts=Date.parse(raw);
  if(!Number.isFinite(ts))return{status:'unknown',days:null,eligible:false,degraded:true};
  const days=Math.max(0,(now-ts)/86400000);
  if(days<=2.999)return{status:'current',days,eligible:true,degraded:false};
  if(days<=5.999)return{status:'degraded',days,eligible:true,degraded:true};
  return{status:'expired',days,eligible:false,degraded:true};
}
function v2ExpertEligible(cache){return !!cache?.verifiedIndividual&&!cache?.duplicateOf&&expertSourceFreshness(cache).eligible}
function desiredExpertPoolHealth(){
""", 'health insertion')

once("""    let status='unavailable';
    if(c?.duplicateOf)status='duplicate';
    else if(c?.verifiedIndividual&&c?.staleFallback)status='stale-fallback';
    else if(c?.verifiedIndividual)status='verified';
    else if(c?.error)status='unavailable';
    const source=c?.source||'none';
    const sourceUpdated=c?.sourceUpdated||'';
    const refreshed=Number(c?.updated||0);
    return{name,id:e?.id||null,status,source,sourceUpdated,refreshed,error:c?.error||'',counts:c?.counts||{}};
""", """    let status='unavailable';
    const freshness=expertSourceFreshness(c);
    if(c?.duplicateOf)status='duplicate';
    else if(c?.verifiedIndividual&&c?.staleFallback)status='stale-fallback';
    else if(c?.verifiedIndividual&&expertConfig==='v2'&&freshness.status==='expired')status='expired';
    else if(c?.verifiedIndividual&&expertConfig==='v2'&&freshness.status==='unknown')status='freshness-unknown';
    else if(c?.verifiedIndividual&&expertConfig==='v2'&&freshness.status==='degraded')status='freshness-degraded';
    else if(c?.verifiedIndividual)status='verified';
    else if(c?.error)status='unavailable';
    const source=c?.source||'none';
    const sourceUpdated=c?.sourceUpdated||'';
    const refreshed=Number(c?.updated||0);
    return{name,id:e?.id||null,status,source,sourceUpdated,refreshed,error:c?.error||'',counts:c?.counts||{},freshness};
""", 'health body')

once("""  const verified=rows.filter(x=>x.status==='verified').length;
  const stale=rows.filter(x=>x.status==='stale-fallback').length;
  const usable=verified+stale;
  return{verified,stale,usable,total:rows.length,degraded:verified<rows.length,rows};
""", """  const verified=rows.filter(x=>x.status==='verified').length;
  const freshDegraded=rows.filter(x=>x.status==='freshness-degraded').length;
  const stale=rows.filter(x=>x.status==='stale-fallback').length;
  const usable=verified+freshDegraded+stale;
  return{verified,stale,freshDegraded,usable,total:rows.length,degraded:verified<rows.length,rows};
""", 'health counts')

once("  const status=row.status==='verified'?'VERIFIED':row.status==='stale-fallback'?'STALE-FALLBACK':row.status==='duplicate'?'DUPLICATE':'UNAVAILABLE';\n", "  const status=row.status==='verified'?'VERIFIED':row.status==='freshness-degraded'?'FRESHNESS 3-5D':row.status==='expired'?'EXPIRED >5D':row.status==='freshness-unknown'?'FRESHNESS UNKNOWN':row.status==='stale-fallback'?'STALE-FALLBACK':row.status==='duplicate'?'DUPLICATE':'UNAVAILABLE';\n", 'detail status')

once("""      const c=rankCache[e.id];
      if(c?.verifiedIndividual&&!c?.duplicateOf&&Object.keys(members).length<p.max)members[e.id]=w;
""", """      const c=rankCache[e.id];
      const allowed=id.startsWith('v2')?v2ExpertEligible(c):(c?.verifiedIndividual&&!c?.duplicateOf);
      if(allowed&&Object.keys(members).length<p.max)members[e.id]=w;
""", 'backfill')

once("""    const cache=rankCache[eid],w=Number(w0);
    if(!cache?.verifiedIndividual)continue;
    if(cache?.duplicateOf)continue;
""", """    const cache=rankCache[eid],w=Number(w0);
    if(!cache?.verifiedIndividual)continue;
    if(cache?.duplicateOf)continue;
    if(String(panelId).startsWith('v2')&&!v2ExpertEligible(cache))continue;
""", 'compute gate')

p.write_text(s)
