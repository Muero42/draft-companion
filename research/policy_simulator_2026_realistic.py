#!/usr/bin/env python3
"""PITTI research-only current-freeze full-draft Monte Carlo.

Primary outputs are availability, return/turn structure, roster construction and
regime sensitivity. Policy ordering is deliberately NOT certified here: the
v3.5 outcome functional form is independent, but a separately validated 2026
rank->weekly-outcome forecast bridge is not assumed.
"""
from __future__ import annotations
import collections, json, math, random, re, statistics, pathlib, hashlib, sys

TEAMS=10; USER_SLOT=9
USER_PICKS=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]
TURN_PAIRS=[(9,12),(29,32),(49,52),(69,72),(89,92),(109,112),(129,132)]
ACTIVE={1:'Michael',2:'Pascal Voerde',3:'Marc Düsseldorf',4:'Thomas',5:'Bjoern',6:'Pascal Gelderner',7:'Giuliano',8:'Basti',10:'Dutch Marc'}
HARD_OUT={'jaydenhiggins','rickypearsall'}
POLICIES=['PANEL_FIRST','QUALITY_MARKET','USER_LATE_QB_TE']
REGIMES=['MARKET_CONTROL','FULL_MANAGER_BJOERN_AUTO','FULL_MANAGER_BJOERN_MANUAL']
VARIANCE={'REALISTIC':1.0,'STRESS':1.18}


def norm(s):
    return re.sub(r'[^a-z0-9]+','',str(s or '').lower().replace('’',"'").replace('é','e').replace('ö','o').replace('ü','u').replace('ä','a'))
def slot_at_pick(p):
    r=(p-1)//10+1; w=(p-1)%10+1
    return w if r%2 else 11-w
def phase(p):
    r=(p-1)//10+1
    return 'early' if r<=3 else 'mid1' if r<=6 else 'mid2' if r<=9 else 'late' if r<=12 else 'end'
def scale(p,stress=1.0): return (2.45 if p<=80 else 4.2 if p<=120 else 6.5)*stress

def load():
    gate=json.load(open('freeze_2026/FRESH_2026_FREEZE_GATE.json'))
    if gate.get('status')!='PASS': raise RuntimeError('fresh freeze not PASS')
    raw=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'))
    health=json.load(open('freeze_2026/FRESH_2026_HEALTH_ROLE_2026-08-22.json'))
    txt=pathlib.Path('app.js').read_text(encoding='utf-8')
    m=re.search(r'const MANAGER_PROFILE_DATA=(\{.*?\});\n',txt,re.S)
    if not m: raise RuntimeError('MANAGER_PROFILE_DATA missing')
    managers=json.loads(m.group(1))
    players={}
    for x in raw['pool_rows']:
        k=str(x['key']); pos=x['pos'];
        if pos not in {'QB','RB','WR','TE'}: continue
        panel=x.get('panel_position') if isinstance(x.get('panel_position'),(int,float)) else x.get('panel_standard')
        std=x.get('panel_standard') if isinstance(x.get('panel_standard'),(int,float)) else panel
        adp=x.get('adp') if isinstance(x.get('adp'),(int,float)) else std
        players[k]={'key':k,'name':x['name'],'pos':pos,'panel':float(panel),'std':float(std),'adp':float(adp)}
    # Hard season-ending exclusions are removed from the whole simulated draft universe.
    players={k:v for k,v in players.items() if norm(v['name']) not in HARD_OUT}
    if len(players)<225: raise RuntimeError(f'implausible pool after hard exclusions: {len(players)}')
    return gate,raw,health,managers,players

def candidate_board(players,available,pn):
    arr=[players[k] for k in available]
    elite=sorted(arr,key=lambda x:(x['panel'],x['std']))[:16]
    market=sorted(arr,key=lambda x:abs(x['adp']-pn))[:64]
    out=[]; seen=set()
    for p in elite+market:
        if p['key'] not in seen: seen.add(p['key']);out.append(p)
    return out

def missing_core(roster):
    c=collections.Counter(x['pos'] for x in roster); out=[]
    if c['QB']<1: out+=['QB']
    if c['RB']<1: out+=['RB']
    if c['WR']<2: out+=['WR']*(2-c['WR'])
    if c['TE']<1: out+=['TE']
    return out

def completion_guard(board,roster,pn):
    miss=missing_core(roster); rem=sum(x>=pn for x in USER_PICKS)
    force=bool(miss) and (rem<=len(miss) or (pn>=132 and any(x in ('QB','TE') for x in miss) and rem<=len(miss)+1))
    if force:
        b=[p for p in board if p['pos'] in set(miss)]
        if b:return b,True
    return board,False

def user_score(p,pn,policy,roster):
    c=collections.Counter(x['pos'] for x in roster)
    if policy=='PANEL_FIRST': s=p['panel']
    else: s=.74*p['panel']+.26*p['adp']
    # Roster-aware but soft; no early hard positional quota.
    if p['pos']=='QB' and c['QB']>=1:s+=10
    if p['pos']=='TE' and c['TE']>=1:s+=8
    if p['pos']=='WR' and c['WR']>=6:s+=2.5
    if p['pos']=='RB' and c['RB']>=6:s+=2.0
    if policy=='USER_LATE_QB_TE':
        # Stated preference only: exceptional quality can overcome these finite penalties.
        if p['pos']=='QB' and pn<69:s+=8
        if p['pos']=='TE' and pn<49:s+=5
    return s

def weighted_pick(rng,items,weights):
    total=sum(weights); x=rng.random()*total
    for item,w in zip(items,weights):
        x-=w
        if x<=0:return item
    return items[-1]

def special_schedule(rng,manager_data):
    """Generate ~16.8 opponent K/DST selections per draft with manager-specific timing."""
    out={}
    for s,name in ACTIVE.items():
        prof=manager_data['profiles'].get(name,{})
        n=2 if rng.random()<.87 else 1
        types=['DEF','K'] if n==2 else [('DEF' if rng.random()<.55 else 'K')]
        own=[p for p in range(96,151) if slot_at_pick(p)==s]
        chosen=[]
        for typ in types:
            pos=prof.get('positions',{}).get(typ,{})
            mu=float(pos.get('firstRound',13.3))*10-4.5
            sd=max(5.0,float(pos.get('firstRoundSd',1.8))*10)
            cand=[p for p in own if p not in chosen]
            if not cand:continue
            weights=[math.exp(-.5*((p-mu)/sd)**2)+.01 for p in cand]
            pn=weighted_pick(rng,cand,weights); chosen.append(pn);out[pn]=(typ,f'{typ}_{s}')
    return out

def manager_multiplier(p,slot,pn,regime,manager_data):
    if regime=='MARKET_CONTROL':return 1.0
    name=ACTIVE[slot]
    if name=='Bjoern' and regime=='FULL_MANAGER_BJOERN_AUTO':return 1.0
    prof=manager_data['profiles'].get(name); ph=phase(pn)
    if not prof:return 1.0
    own=float(prof.get('phaseShares',{}).get(ph,{}).get(p['pos'],0) or 0)
    league=float(manager_data.get('leaguePhaseShares',{}).get(ph,{}).get(p['pos'],0) or 0)
    if league<=0:return 1.0
    # Research-calibrated strong shrinkage: manager history is secondary to market+roster state.
    mult=1+.10*(own/league-1)
    if name=='Bjoern' and regime=='FULL_MANAGER_BJOERN_MANUAL' and p['pos']=='RB':mult*=1.08
    return min(1.18,max(.82,mult))

def opponent_pick(rng,board,pn,slot,roster,regime,stress,manager_data):
    counts=collections.Counter(x['pos'] for x in roster); ws=[]
    for p in board:
        w=math.exp(-abs(p['adp']-pn)/scale(pn,stress))
        n=counts[p['pos']]
        if p['pos']=='QB':w*=1 if n==0 else .25 if n==1 else .06
        elif p['pos']=='TE':w*=1 if n==0 else .30 if n==1 else .08
        elif p['pos']=='RB':w*=1 if n<4 else .72 if n<6 else .35
        else:w*=1 if n<5 else .72 if n<7 else .35
        w*=manager_multiplier(p,slot,pn,regime,manager_data)
        ws.append(max(w,1e-16))
    return weighted_pick(rng,board,ws)

def one_draft(players,seed,policy,regime,variance,manager_data,collect=True):
    rng=random.Random(seed); available=set(players); rosters={s:[] for s in range(1,11)}; used=set(); special=special_schedule(rng,manager_data)
    pre_avail={}; selections=[]; forces=0; special_n=0
    for pn in range(1,151):
        s=slot_at_pick(pn)
        if s!=USER_SLOT and pn in special:
            typ,key=special[pn]
            if key in used:raise AssertionError('duplicate special')
            used.add(key); rosters[s].append({'key':key,'name':key,'pos':typ,'panel':999,'std':999,'adp':999});special_n+=1;continue
        board=candidate_board(players,available,pn)
        if not board:raise AssertionError('empty board')
        if s==USER_SLOT:
            if collect:pre_avail[pn]=set(available)
            board,forced=completion_guard(board,rosters[s],pn);forces+=int(forced)
            chosen=min(board,key=lambda p:(user_score(p,pn,policy,rosters[s]),p['panel'],p['adp']))
            selections.append((pn,chosen['key']))
        else:
            chosen=opponent_pick(rng,board,pn,s,rosters[s],regime,VARIANCE[variance],manager_data)
        if chosen['key'] not in available or chosen['key'] in used:raise AssertionError('state failure')
        available.remove(chosen['key']);used.add(chosen['key']);rosters[s].append(chosen)
    if len(used)!=150:raise AssertionError(f'pick count {len(used)}')
    if missing_core(rosters[USER_SLOT]):raise AssertionError('user core incomplete')
    return {'roster':rosters[USER_SLOT],'pre_avail':pre_avail,'selections':selections,'forces':forces,'special_n':special_n}

def summarize_cell(players,runs,policy,regime,variance,manager_data,seedbase):
    avail={p:collections.Counter() for p in USER_PICKS}; picks={p:collections.Counter() for p in USER_PICKS}; pos=collections.Counter(); patterns=collections.Counter();forces=[];special=[]
    half=[{p:collections.Counter() for p in USER_PICKS},{p:collections.Counter() for p in USER_PICKS}]
    for i in range(runs):
        d=one_draft(players,seedbase+i,policy,regime,variance,manager_data)
        hi=0 if i<runs//2 else 1
        for pn,aset in d['pre_avail'].items():
            for k in aset:avail[pn][k]+=1;half[hi][pn][k]+=1
        for pn,k in d['selections']:picks[pn][k]+=1
        c=collections.Counter(x['pos'] for x in d['roster']);pos[tuple(sorted(c.items()))]+=1
        patterns[tuple(k for _,k in d['selections'][:4])]+=1;forces.append(d['forces']);special.append(d['special_n'])
    def top_av(pn,n=15):
        # Report high-quality names with meaningful availability, not fringe 100%-available names.
        arr=[]
        for k,c in avail[pn].items():
            q=players[k]['panel']; rate=c/runs
            if rate>=.03:arr.append((q,-rate,k))
        arr.sort();return [{'name':players[k]['name'],'pos':players[k]['pos'],'quality_rank':round(players[k]['panel'],2),'adp':round(players[k]['adp'],2),'availability':round(-r,4)} for q,r,k in arr[:n]]
    def top_pick(pn,n=12):
        return [{'name':players[k]['name'],'pos':players[k]['pos'],'rate':round(c/runs,4)} for k,c in picks[pn].most_common(n)]
    # Split-half convergence on top-50 quality players at own decision points.
    maxdelta=0.0
    top50=set(k for k,_ in sorted(players.items(),key=lambda kv:kv[1]['panel'])[:50])
    n0=max(1,runs//2);n1=max(1,runs-n0)
    for pn in USER_PICKS:
        for k in top50:maxdelta=max(maxdelta,abs(half[0][pn][k]/n0-half[1][pn][k]/n1))
    posdist=[{'counts':dict(k),'rate':round(v/runs,4)} for k,v in pos.most_common(12)]
    patt=[{'players':[players[k]['name'] for k in ks],'rate':round(v/runs,4)} for ks,v in patterns.most_common(12)]
    return {'runs':runs,'policy':policy,'opponent_regime':regime,'variance':variance,'mean_completion_forces':round(statistics.mean(forces),4),'mean_opponent_kdst':round(statistics.mean(special),3),'split_half_max_top50_availability_delta':round(maxdelta,4),'availability':{str(p):top_av(p) for p in USER_PICKS},'selections':{str(p):top_pick(p) for p in USER_PICKS},'roster_position_distribution':posdist,'top_first_four_patterns':patt}

def main():
    gate,raw,health,manager_data,players=load();runs=int(sys.argv[1]) if len(sys.argv)>1 else 700
    result={'schema':1,'freeze_package_sha256':gate['package_sha256'],'runs_per_cell':runs,'cells':{},'state_invariants':'PASS','policy_ranking_certified':False,'policy_ranking_note':'Current simulations certify market/availability/roster-construction behavior. They do not use the circular Utility-v2 ranking; a separately validated 2026 forecast-to-weekly-outcome bridge is still required for independent policy superiority claims.'}
    cellid=0
    for variance in ('REALISTIC','STRESS'):
      for regime in REGIMES:
       for policy in POLICIES:
        cellid+=1;key=f'{variance}|{regime}|{policy}'
        result['cells'][key]=summarize_cell(players,runs,policy,regime,variance,manager_data,62600000+cellid*100000)
    result['total_full_drafts']=runs*len(result['cells'])
    # Global regime-robust availability ranges for current quality leaders at each pick.
    robust={}
    for pn in USER_PICKS:
        names={x['name'] for c in result['cells'].values() for x in c['availability'][str(pn)]}
        rows=[]
        for name in names:
            vals=[];meta=None
            for c in result['cells'].values():
                hit=next((x for x in c['availability'][str(pn)] if x['name']==name),None)
                vals.append(hit['availability'] if hit else 0);meta=meta or hit
            if meta:rows.append({**{k:meta[k] for k in ('name','pos','quality_rank','adp')},'availability_min':round(min(vals),4),'availability_max':round(max(vals),4),'availability_mean':round(statistics.mean(vals),4)})
        rows.sort(key=lambda x:(x['quality_rank'],-x['availability_mean']))
        robust[str(pn)]=rows[:20]
    result['robust_availability_ranges']=robust
    pathlib.Path('SIMULATION_2026_REALISTIC_RESULTS.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
    summary={'status':'PASS','freeze_package_sha256':gate['package_sha256'],'total_full_drafts':result['total_full_drafts'],'cells':len(result['cells']),'runs_per_cell':runs,'max_split_half_delta':max(c['split_half_max_top50_availability_delta'] for c in result['cells'].values()),'mean_opponent_kdst_range':[min(c['mean_opponent_kdst'] for c in result['cells'].values()),max(c['mean_opponent_kdst'] for c in result['cells'].values())],'policy_ranking_certified':False}
    pathlib.Path('SIMULATION_2026_REALISTIC_GATE.json').write_text(json.dumps(summary,indent=2),encoding='utf-8');print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
