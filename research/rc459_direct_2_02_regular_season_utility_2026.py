#!/usr/bin/env python3
"""Independent weeks-1-14 lineup-utility lens for direct 2.02 causal branches.

Research-only. Uses the frozen historical Sleeper market->weekly outcome bridge from
pitti-outcome-bridge-20250821 and the empirical 2025 league skill-score CDF. The
selected 2026 expert panel is never used to fit weekly outcomes. This is NOT P(title).
"""
from __future__ import annotations
import json,math,pathlib,statistics,urllib.request,hashlib

RAW='counterfactual_2026/RC459_DIRECT_2_02_CANDIDATES_2026.json'
OUT='counterfactual_2026/RC459_DIRECT_2_02_REGULAR_SEASON_UTILITY_2026.json'
BRIDGE_URL='https://raw.githubusercontent.com/Muero42/draft-companion/pitti-outcome-bridge-20250821/bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'
GATE_URL='https://raw.githubusercontent.com/Muero42/draft-companion/pitti-outcome-bridge-20250821/bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'
BRIDGE_GIT_BLOB='99271617c09a279c904618eb9af15c2f2744d6c4'
GATE_GIT_BLOB='047a260558bcf4887572fbdbc688b3946936cb21'
DRAFT_ID='1225769229928648704'
POS={'QB','RB','WR','TE'}

def get_bytes(url):
    req=urllib.request.Request(url,headers={'User-Agent':'PITTI-Direct202-RegularSeason/1.0'})
    with urllib.request.urlopen(req,timeout=60) as r:return r.read()
def getj(url): return json.loads(get_bytes(url))
def git_blob_sha(b): return hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest()
def qtile(vals,q):
    v=sorted(float(x) for x in vals)
    if not v:return None
    z=(len(v)-1)*q;lo=int(math.floor(z));hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)

def lineup_value(players,week,repl):
    vals={p:sorted([x['weeks'][week] for x in players if x['pos']==p],reverse=True) for p in POS}
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][week]
    best=None
    # Actual league topology used by v3.5: RB1, WR2, TE1 + two flex;
    # one flex RB/WR/TE, second RB/WR; TE max 2 in a lineup.
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6:continue
        c={'RB':rb,'WR':wr,'TE':te};tot=0.0
        for pos in ('RB','WR','TE'):
            have=min(len(vals[pos]),c[pos]);tot+=sum(vals[pos][:have]);tot+=(c[pos]-have)*repl[pos][week]
        if best is None or tot>best:best=tot
    return qb+(best or 0.0)

def main():
    x=json.load(open(RAW));
    if x.get('status')!='PASS' or not x.get('raw_only') or x.get('outcome_evaluated') is not False:raise RuntimeError('raw direct-202 gate')
    bb=get_bytes(BRIDGE_URL);gb=get_bytes(GATE_URL)
    if git_blob_sha(bb)!=BRIDGE_GIT_BLOB:raise RuntimeError('bridge drift')
    if git_blob_sha(gb)!=GATE_GIT_BLOB:raise RuntimeError('bridge gate drift')
    bridge=json.loads(bb);gate=json.loads(gb)
    if bridge.get('status')!='PASS' or gate.get('status')!='PASS':raise RuntimeError('bridge not PASS')
    if not bridge.get('criteria',{}).get('selected_panel_not_used_in_fit'):raise RuntimeError('panel contamination guard')
    fc=bridge['forecasts']
    # Replacement fallback only for malformed/incomplete position rosters; derived from market tail, not panel.
    bypos={p:[] for p in POS}
    for k,v in fc.items():
        if v.get('pos') in POS and isinstance(v.get('sleeper_adp'),(int,float)):bypos[v['pos']].append((float(v['sleeper_adp']),k,v))
    repl={}
    for pos,arr in bypos.items():
        arr.sort();tail=arr[max(0,int(len(arr)*.80)):]
        repl[pos]=[qtile([z[2]['pred_weeks_1_14'][w] for z in tail],.50) for w in range(14)]
    # Empirical 2025 league score distribution with K/DST nuisance removed, identical concept to prior challenger.
    meta=getj(f'https://api.sleeper.app/v1/draft/{DRAFT_ID}');league=str(meta['league_id']);players_nfl=getj('https://api.sleeper.app/v1/players/nfl')
    skill=[]
    for w in range(1,15):
        games=getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}')
        for g in games:
            total=float(g.get('points') or 0);pp=g.get('players_points') or {};kd=0.0
            for sid in [str(z) for z in (g.get('starters') or [])]:
                if (players_nfl.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
            skill.append((w,total-kd))
    def winprob(score,w):
        vals=[v for ww,v in skill if ww!=w];below=sum(v<score for v in vals);ties=sum(v==score for v in vals)
        return (below+.5*ties+1)/(len(vals)+2)
    rows=[];missing=set();covered=0;total=0
    for st in x['states']:
        sr=[]
        for b in st['branches']:
            rost=[]
            for p in b['user_roster']:
                total+=1;f=fc.get(str(p['key']))
                if not f or f.get('pos') not in POS:missing.add(str(p['key']));continue
                covered+=1;rost.append({'key':str(p['key']),'name':f['name'],'pos':f['pos'],'weeks':f['pred_weeks_1_14']})
            scores=[lineup_value(rost,w,repl) for w in range(14)]
            util=sum(winprob(scores[w],w+1) for w in range(14))
            sr.append({'candidate':b['candidate'],'expected_wins_14w':util,'weekly_lineup_mean':statistics.mean(scores),'weekly_lineup_p10':qtile(scores,.10),'weekly_lineup_p90':qtile(scores,.90)})
        sr.sort(key=lambda z:(-z['expected_wins_14w'],z['candidate']['name']))
        rows.append({'seed':st['seed'],'forced_1_09':st['forced_1_09'],'prefix_fingerprint':st['prefix_fingerprint'],'ranking':sr})
    coverage=covered/total if total else 0
    if coverage<.985:raise RuntimeError(f'forecast coverage too low {coverage:.4f}; missing={len(missing)}')
    # Aggregate only within availability-conditioned observations; report n for every candidate.
    agg={}
    for r in rows:
        for z in r['ranking']:
            a=agg.setdefault(z['candidate']['name'],[]);a.append(z['expected_wins_14w'])
    summary=[]
    for name,vals in agg.items():summary.append({'candidate':name,'n_states':len(vals),'mean_expected_wins_14w':statistics.mean(vals),'median_expected_wins_14w':statistics.median(vals),'min':min(vals),'max':max(vals)})
    summary.sort(key=lambda z:(-z['mean_expected_wins_14w'],-z['n_states'],z['candidate']))
    out={'schema':1,'status':'PASS','method':'independent historical Sleeper market->weekly bridge + actual lineup topology + empirical 2025 weekly skill-score CDF','raw_source_sha256':hashlib.sha256(open(RAW,'rb').read()).hexdigest(),'bridge_git_blob':BRIDGE_GIT_BLOB,'selected_2026_panel_used_in_outcome_fit':False,'true_title_probability':False,'interpretation':'Regular-season/startability diagnostic only. Availability-conditioned candidate means are not a global ranking and do not certify policy.','roster_forecast_coverage':coverage,'missing_forecast_ids':sorted(missing),'summary':summary,'states':rows}
    pathlib.Path(OUT).write_text(json.dumps(out,indent=2,ensure_ascii=False));print(json.dumps({'status':'PASS','states':len(rows),'branches':sum(len(r['ranking']) for r in rows),'coverage':coverage,'top_mean':[(s['candidate'],round(s['mean_expected_wins_14w'],4),s['n_states']) for s in summary[:10]],'output':OUT},indent=2))
if __name__=='__main__':main()
