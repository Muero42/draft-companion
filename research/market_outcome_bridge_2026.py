#!/usr/bin/env python3
"""Independent 2026 market->realized-weekly-outcome bridge.

Uses archived *Sleeper Half-PPR ADP* as the preseason forecast variable and
realized FantasyPros Half-PPR weekly leader tables as factual outcomes for
2022-2025. It never uses the selected 2026 expert panel to fit or certify the
bridge. Rolling OOS tests 2024 and 2025 before producing 2026 forecasts.
"""
from __future__ import annotations
import json, math, pathlib, re, statistics
import requests
from bs4 import BeautifulSoup

YEARS=[2022,2023,2024,2025]
POS={'QB','RB','WR','TE'}
K=20

def norm(s):
    s=str(s or '').lower().replace('’',"'").replace('é','e').replace('ö','o').replace('ü','u').replace('ä','a')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',s)
    return re.sub(r'[^a-z0-9]+','',s)

def num(s):
    m=re.search(r'-?\d+(?:\.\d+)?',str(s or '').replace(',',''))
    return float(m.group()) if m else None

def get(url):
    r=requests.get(url,headers={'User-Agent':'Mozilla/5.0 (compatible; PITTI-Bridge/1.0)','Accept':'text/html'},timeout=45)
    r.raise_for_status();return r.text

def table_with(html,need):
    soup=BeautifulSoup(html,'lxml')
    for t in soup.find_all('table'):
        heads=[x.get_text(' ',strip=True) for x in t.find_all('th')]
        joined=' | '.join(heads).lower()
        if all(x.lower() in joined for x in need):return t,heads
    raise RuntimeError(f'table not found: {need}')

def parse_adp(year):
    url=f'https://www.fantasypros.com/nfl/adp/half-point-ppr-overall.php?year={year}'
    t,heads=table_with(get(url),['player','sleeper'])
    headers=[h.strip().lower() for h in heads]
    # FantasyPros can use multi-row headers; row-cell detection below is label-assisted.
    sleeper_i=next((i for i,h in enumerate(headers) if h=='sleeper' or 'sleeper' in h),None)
    out={}
    for tr in t.find_all('tr'):
        cells=tr.find_all(['td','th'])
        if len(cells)<4:continue
        a=tr.find('a',href=re.compile(r'/nfl/players/'))
        if not a:continue
        name=a.get_text(' ',strip=True)
        texts=[c.get_text(' ',strip=True) for c in cells]
        pos=None
        for txt in texts:
            m=re.search(r'\b(QB|RB|WR|TE)\s*\d*\b',txt.upper())
            if m:pos=m.group(1);break
        if pos not in POS:continue
        val=None
        if sleeper_i is not None and sleeper_i<len(texts):val=num(texts[sleeper_i])
        # Fallback: infer column from row using table header sequence if top header was offset.
        if val is None:
            th=[x.get_text(' ',strip=True).lower() for x in t.find_all('th')]
            try:
                si=th.index('sleeper')
                if si<len(texts):val=num(texts[si])
            except ValueError:pass
        if val is None or not (0<val<400):continue
        out[norm(name)]={'year':year,'name':name,'pos':pos,'sleeper_adp':float(val),'adp_url':url}
    if len(out)<120:raise RuntimeError(f'{year} ADP parse too small: {len(out)}')
    return out

def parse_outcomes(year):
    url=f'https://www.fantasypros.com/nfl/reports/leaders/half-ppr.php?year={year}'
    t,heads=table_with(get(url),['player','pos','ttl'])
    out={}
    for tr in t.find_all('tr'):
        cells=tr.find_all(['td','th'])
        if len(cells)<8:continue
        a=tr.find('a',href=re.compile(r'/nfl/players/'))
        if not a:continue
        name=a.get_text(' ',strip=True);texts=[c.get_text(' ',strip=True) for c in cells]
        pos=None
        for txt in texts[:5]:
            m=re.search(r'\b(QB|RB|WR|TE)\b',txt.upper())
            if m:pos=m.group(1);break
        if pos not in POS:continue
        # Header-map weekly columns robustly.
        hs=[h.strip().upper() for h in heads]
        vals=[]
        for w in range(1,15):
            wi=next((i for i,h in enumerate(hs) if h==str(w)),None)
            if wi is not None and wi<len(texts):
                v=num(texts[wi]);vals.append(float(v) if v is not None else 0.0)
        if len(vals)!=14:
            # Common table layout: RK PLAYER POS GP then weekly 1..18.
            start=4
            raw=texts[start:start+14]
            if len(raw)==14:vals=[float(num(v) or 0.0) for v in raw]
        if len(vals)!=14:continue
        out[norm(name)]={'name':name,'pos':pos,'weeks_1_14':vals,'weekly_mean_1_14':sum(vals)/14,'outcome_url':url}
    if len(out)<150:raise RuntimeError(f'{year} outcome parse too small: {len(out)}')
    return out

def build_year(year):
    a=parse_adp(year);o=parse_outcomes(year);rows=[]
    for k,x in a.items():
        y=o.get(k)
        if y and y['pos']==x['pos']:
            rows.append({**x,'weeks_1_14':y['weeks_1_14'],'weekly_mean_1_14':y['weekly_mean_1_14']})
    return rows,{'adp_count':len(a),'outcome_count':len(o),'joined_count':len(rows)}

def predict(row,train):
    cand=[r for r in train if r['pos']==row['pos']]
    cand.sort(key=lambda r:abs(math.log1p(r['sleeper_adp'])-math.log1p(row['sleeper_adp'])))
    neigh=cand[:min(K,len(cand))]
    if not neigh:return None
    ds=[abs(math.log1p(r['sleeper_adp'])-math.log1p(row['sleeper_adp'])) for r in neigh]
    ws=[math.exp(-d/.45) for d in ds];sw=sum(ws)
    mean=sum(w*r['weekly_mean_1_14'] for w,r in zip(ws,neigh))/sw
    weekly=[]
    for wk in range(14):weekly.append(sum(w*r['weeks_1_14'][wk] for w,r in zip(ws,neigh))/sw)
    samples=[v for r in neigh for v in r['weeks_1_14']]
    samples.sort()
    def q(p):
        if not samples:return 0.0
        return samples[min(len(samples)-1,max(0,round((len(samples)-1)*p)))]
    return {'pred_weekly_mean':mean,'pred_weeks_1_14':weekly,'weekly_sample_p10':q(.10),'weekly_sample_p50':q(.50),'weekly_sample_p90':q(.90),
            'neighbors':[{'year':r['year'],'name':r['name'],'pos':r['pos'],'adp':r['sleeper_adp'],'realized_weekly_mean':r['weekly_mean_1_14']} for r in neigh[:8]]}

def rankdata(vals):
    order=sorted(range(len(vals)),key=lambda i:vals[i]);r=[0.0]*len(vals);i=0
    while i<len(order):
        j=i
        while j+1<len(order) and vals[order[j+1]]==vals[order[i]]:j+=1
        avg=(i+j)/2+1
        for k in range(i,j+1):r[order[k]]=avg
        i=j+1
    return r

def corr(a,b):
    if len(a)<3:return None
    ma=statistics.mean(a);mb=statistics.mean(b);da=sum((x-ma)**2 for x in a);db=sum((x-mb)**2 for x in b)
    if da<=0 or db<=0:return 0.0
    return sum((x-ma)*(y-mb) for x,y in zip(a,b))/math.sqrt(da*db)

def metrics(test,train):
    ys=[];ps=[];bs=[]
    bypos={p:statistics.mean([r['weekly_mean_1_14'] for r in train if r['pos']==p]) for p in POS if any(r['pos']==p for r in train)}
    for r in test:
        pr=predict(r,train)
        if not pr:continue
        ys.append(r['weekly_mean_1_14']);ps.append(pr['pred_weekly_mean']);bs.append(bypos[r['pos']])
    mae=lambda a,b:sum(abs(x-y) for x,y in zip(a,b))/len(a)
    return {'n':len(ys),'mae_bridge':mae(ys,ps),'mae_position_only':mae(ys,bs),'pearson':corr(ps,ys),'spearman':corr(rankdata(ps),rankdata(ys))}

rows=[];source_health={}
for year in YEARS:
    yr,diag=build_year(year);rows+=yr;source_health[str(year)]=diag

oos={}
for target in (2024,2025):
    train=[r for r in rows if r['year']<target];test=[r for r in rows if r['year']==target]
    oos[str(target)]=metrics(test,train)

freeze=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'))
train=rows
forecasts={}
for r in freeze['pool_rows']:
    if r.get('pos') not in POS or not isinstance(r.get('adp'),(int,float)):continue
    pr=predict({'pos':r['pos'],'sleeper_adp':float(r['adp'])},train)
    if pr:forecasts[str(r['key'])]={'name':r['name'],'pos':r['pos'],'sleeper_adp':r['adp'],**pr}

criteria={
 'source_years_4':len(source_health)==4,
 'oos_2024_n_ge_120':oos['2024']['n']>=120,
 'oos_2025_n_ge_120':oos['2025']['n']>=120,
 'bridge_beats_position_baseline_2024':oos['2024']['mae_bridge']<oos['2024']['mae_position_only'],
 'bridge_beats_position_baseline_2025':oos['2025']['mae_bridge']<oos['2025']['mae_position_only'],
 'spearman_positive_2024':(oos['2024']['spearman'] or 0)>.20,
 'spearman_positive_2025':(oos['2025']['spearman'] or 0)>.20,
 'forecast_coverage_ge_220':len(forecasts)>=220,
 'selected_panel_not_used_in_fit':True
}
status='PASS' if all(criteria.values()) else 'FAIL_CLOSED'
out={'schema':1,'status':status,'method':'Historical Sleeper Half-PPR ADP -> realized weekly Half-PPR neighbor bridge','years':YEARS,'k_neighbors':K,
     'source_health':source_health,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts),'forecasts':forecasts,
     'interpretation':'Independent market-implied forecast bridge. PASS certifies an ADP-based outcome mapping, not selected-panel optimality. Use as an external policy challenger/control, not as the sole player-quality truth.'}
pathlib.Path('MARKET_OUTCOME_BRIDGE_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
pathlib.Path('MARKET_OUTCOME_BRIDGE_2026_GATE.json').write_text(json.dumps({'status':status,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts)},indent=2))
print(json.dumps({'status':status,'oos':oos,'criteria':criteria,'forecast_count':len(forecasts)},indent=2))
