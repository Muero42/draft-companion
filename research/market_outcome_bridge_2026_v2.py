#!/usr/bin/env python3
"""Independent 2026 market -> realized outcome bridge using direct Sleeper data.

Preseason signal: historical Sleeper Half-PPR ADP from season projection endpoint.
Outcome: realized Sleeper weekly Half-PPR points, weeks 1-14, 2022-2025.
The selected 2026 expert panel is never used to fit or certify this bridge.
Rolling OOS: 2024 trained on 2022-23; 2025 trained on 2022-24.
"""
from __future__ import annotations
import json, math, pathlib, statistics, requests
YEARS=[2022,2023,2024,2025]
POS={'QB','RB','WR','TE'}
K=24
S=requests.Session();S.headers.update({'User-Agent':'PITTI-MarketBridge/2.0','Accept':'application/json'})

def getj(url):
    r=S.get(url,timeout=45);r.raise_for_status();return r.json()

def val(row,*fields):
    for f in fields:
        x=(row.get('stats') or {}).get(f,row.get(f))
        try:
            y=float(x)
            if math.isfinite(y): return y
        except (TypeError,ValueError): pass
    return None

def meta(row):
    p=row.get('player') or {}
    pid=str(row.get('player_id') or p.get('player_id') or '')
    pos=str(p.get('position') or row.get('position') or '').upper()
    name=p.get('full_name') or ' '.join(x for x in [p.get('first_name'),p.get('last_name')] if x)
    return pid,pos,name

def season_adp(year):
    ps='&'.join(f'position[]={p}' for p in sorted(POS))
    urls=[
      f'https://api.sleeper.app/projections/nfl/{year}?season_type=regular&{ps}&order_by=adp_half_ppr',
      f'https://api.sleeper.com/projections/nfl/{year}?season_type=regular&{ps}&order_by=adp_half_ppr']
    last=None
    for url in urls:
        try:
            raw=getj(url);out={}
            for row in raw if isinstance(raw,list) else []:
                pid,pos,name=meta(row);a=val(row,'adp_half_ppr','adp_half')
                if pid and pos in POS and a is not None and 0<a<400:
                    out[pid]={'year':year,'player_id':pid,'name':name or pid,'pos':pos,'sleeper_adp':a}
            if len(out)>=120:return out,{'url':url,'count':len(out)}
            last=f'only {len(out)} ADP rows'
        except Exception as e:last=repr(e)
    raise RuntimeError(f'{year} historical Sleeper ADP unavailable: {last}')

def weekly_outcomes(year):
    ps='&'.join(f'position[]={p}' for p in sorted(POS));weeks={}
    source=[]
    for wk in range(1,15):
        urls=[
          f'https://api.sleeper.app/stats/nfl/{year}/{wk}?season_type=regular&{ps}&order_by=pts_half_ppr',
          f'https://api.sleeper.com/stats/nfl/{year}/{wk}?season_type=regular&{ps}&order_by=pts_half_ppr']
        raw=None;used=None;err=None
        for u in urls:
            try: raw=getj(u);used=u;break
            except Exception as e:err=e
        if not isinstance(raw,list):raise RuntimeError(f'{year} W{wk} stats unavailable: {err!r}')
        source.append({'week':wk,'url':used,'rows':len(raw)})
        for row in raw:
            pid,pos,name=meta(row);pts=val(row,'pts_half_ppr')
            if not pid or pos not in POS or pts is None:continue
            d=weeks.setdefault(pid,{'name':name or pid,'pos':pos,'weeks':[0.0]*14})
            d['weeks'][wk-1]=float(pts)
    for d in weeks.values():d['weekly_mean_1_14']=sum(d['weeks'])/14
    return weeks,source

def build_year(year):
    a,adiag=season_adp(year);o,odiag=weekly_outcomes(year);rows=[]
    for pid,x in a.items():
        y=o.get(pid)
        if y and y['pos']==x['pos']:
            rows.append({**x,'weeks_1_14':y['weeks'],'weekly_mean_1_14':y['weekly_mean_1_14']})
    if len(rows)<110:raise RuntimeError(f'{year} joined historical rows too small: {len(rows)}')
    return rows,{'adp_count':len(a),'outcome_players':len(o),'joined_count':len(rows),'adp_source':adiag,'weekly_sources':odiag}

def predict(row,train):
    cand=[r for r in train if r['pos']==row['pos']]
    cand.sort(key=lambda r:abs(math.log1p(r['sleeper_adp'])-math.log1p(row['sleeper_adp'])))
    neigh=cand[:min(K,len(cand))]
    if not neigh:return None
    ds=[abs(math.log1p(r['sleeper_adp'])-math.log1p(row['sleeper_adp'])) for r in neigh]
    ws=[math.exp(-d/.42) for d in ds];sw=sum(ws)
    mean=sum(w*r['weekly_mean_1_14'] for w,r in zip(ws,neigh))/sw
    weekly=[sum(w*r['weeks_1_14'][wk] for w,r in zip(ws,neigh))/sw for wk in range(14)]
    vals=sorted(v for r in neigh for v in r['weeks_1_14'])
    def q(p):return vals[min(len(vals)-1,max(0,round((len(vals)-1)*p)))] if vals else 0.0
    return {'pred_weekly_mean':mean,'pred_weeks_1_14':weekly,'weekly_sample_p10':q(.10),'weekly_sample_p50':q(.50),'weekly_sample_p90':q(.90),
            'neighbors':[{'year':r['year'],'name':r['name'],'pos':r['pos'],'adp':r['sleeper_adp'],'realized_weekly_mean':r['weekly_mean_1_14']} for r in neigh[:8]]}

def rankdata(vals):
    order=sorted(range(len(vals)),key=lambda i:vals[i]);r=[0.0]*len(vals);i=0
    while i<len(order):
        j=i
        while j+1<len(order) and vals[order[j+1]]==vals[order[i]]:j+=1
        av=(i+j)/2+1
        for k in range(i,j+1):r[order[k]]=av
        i=j+1
    return r

def corr(a,b):
    if len(a)<3:return None
    ma=statistics.mean(a);mb=statistics.mean(b);da=sum((x-ma)**2 for x in a);db=sum((y-mb)**2 for y in b)
    if da<=0 or db<=0:return 0.0
    return sum((x-ma)*(y-mb) for x,y in zip(a,b))/math.sqrt(da*db)

def metrics(test,train):
    ys=[];ps=[];bs=[]
    bypos={p:statistics.mean([r['weekly_mean_1_14'] for r in train if r['pos']==p]) for p in POS if any(r['pos']==p for r in train)}
    for r in test:
        pr=predict(r,train)
        if pr:ys.append(r['weekly_mean_1_14']);ps.append(pr['pred_weekly_mean']);bs.append(bypos[r['pos']])
    mae=lambda a,b:sum(abs(x-y) for x,y in zip(a,b))/len(a)
    return {'n':len(ys),'mae_bridge':mae(ys,ps),'mae_position_only':mae(ys,bs),'pearson':corr(ps,ys),'spearman':corr(rankdata(ps),rankdata(ys))}

rows=[];health={}
for y in YEARS:
    yr,d=build_year(y);rows+=yr;health[str(y)]=d
oos={}
for target in (2024,2025):
    oos[str(target)]=metrics([r for r in rows if r['year']==target],[r for r in rows if r['year']<target])
freeze=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'))
forecasts={}
for r in freeze['pool_rows']:
    if r.get('pos') not in POS or not isinstance(r.get('adp'),(int,float)):continue
    pr=predict({'pos':r['pos'],'sleeper_adp':float(r['adp'])},rows)
    if pr:forecasts[str(r['key'])]={'name':r['name'],'pos':r['pos'],'sleeper_adp':r['adp'],**pr}
criteria={
 'four_historical_years':len(health)==4,
 'oos_2024_n_ge_110':oos['2024']['n']>=110,
 'oos_2025_n_ge_110':oos['2025']['n']>=110,
 'bridge_beats_position_baseline_2024':oos['2024']['mae_bridge']<oos['2024']['mae_position_only'],
 'bridge_beats_position_baseline_2025':oos['2025']['mae_bridge']<oos['2025']['mae_position_only'],
 'spearman_positive_2024':(oos['2024']['spearman'] or 0)>.20,
 'spearman_positive_2025':(oos['2025']['spearman'] or 0)>.20,
 'forecast_coverage_ge_220':len(forecasts)>=220,
 'selected_panel_not_used_in_fit':True
}
status='PASS' if all(criteria.values()) else 'FAIL_CLOSED'
out={'schema':2,'status':status,'method':'Direct historical Sleeper Half-PPR ADP -> realized Sleeper weekly Half-PPR neighbor bridge','years':YEARS,'k_neighbors':K,
     'source_health':health,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts),'forecasts':forecasts,
     'interpretation':'Independent from the selected expert panel. This certifies only a market-implied outcome challenger/control, not policy optimality.'}
pathlib.Path('MARKET_OUTCOME_BRIDGE_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
pathlib.Path('MARKET_OUTCOME_BRIDGE_2026_GATE.json').write_text(json.dumps({'status':status,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts)},indent=2))
print(json.dumps({'status':status,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts)},indent=2))
