#!/usr/bin/env python3
# workflow-ready-v2
import json,glob,pathlib,statistics,math,urllib.request,collections

DRAFT_ID='1225769229928648704'
EXPECTED=list(range(459820001,459820121))
POS={'QB','RB','WR','TE'}


def getj(url):
    req=urllib.request.Request(url,headers={'User-Agent':'PITTI-RC463-V5-ChampionshipUtility/1.0'})
    return json.load(urllib.request.urlopen(req,timeout=60))


def qtile(v,q):
    v=sorted(float(x) for x in v)
    if not v: raise RuntimeError('empty quantile input')
    z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)


def load_shards(root,tag,flag=None):
    out={}
    seen=[]
    for p in glob.glob(root+'/**/*.json',recursive=True):
        try: x=json.load(open(p))
        except Exception: continue
        if x.get('status')!='PASS' or not isinstance(x.get('drafts'),list): continue
        if flag and not x.get(flag): continue
        seen.append(p)
        for d in x['drafts']:
            seed=int(d['seed'])
            if seed in out: raise RuntimeError(f'{tag} duplicate seed {seed}')
            out[seed]=d
    if sorted(out)!=EXPECTED:
        missing=sorted(set(EXPECTED)-set(out)); extra=sorted(set(out)-set(EXPECTED))
        raise RuntimeError(f'{tag} seed union mismatch missing={missing} extra={extra} files={seen}')
    return out


def lineup(players,w,repl):
    vals={p:sorted([float(x['weeks'][w]) for x in players if x['pos']==p],reverse=True) for p in POS}
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]
    best=-1e100
    # League topology excluding K/DST: 1 QB + RB/WR/TE six slots = 1 RB, 2 WR, 1 TE + two flex.
    for rb in range(1,4):
        for wr in range(2,5):
            for te in range(1,3):
                if rb+wr+te!=6: continue
                tot=0.0
                for pos,n in [('RB',rb),('WR',wr),('TE',te)]:
                    have=min(len(vals[pos]),n)
                    tot+=sum(vals[pos][:have])+(n-have)*repl[pos][w]
                best=max(best,tot)
    if best < -1e90: raise RuntimeError('no legal lineup topology')
    return qb+best


def main():
    B=load_shards('/tmp/base','baseline','rc463_baseline_roster_export')
    C=load_shards('/tmp/v5','v5','rc463_roster_championship_v5_marginal')

    bridge=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
    if bridge.get('status')!='PASS': raise RuntimeError('bridge not PASS')
    fc=bridge['forecasts']
    if not fc: raise RuntimeError('bridge forecasts empty')

    byname=collections.defaultdict(list)
    for _,v in fc.items():
        byname[(v.get('name','').strip().lower(),v.get('pos'))].append(v)

    def map_roster(d):
        out=[]
        for p in d['user_roster']:
            key=(p['name'].strip().lower(),p['pos'])
            m=byname[key]
            if len(m)!=1: raise RuntimeError('forecast mapping '+p['name']+' '+p['pos']+' '+str(len(m)))
            weeks=m[0].get('pred_weeks_1_14')
            if not isinstance(weeks,list) or len(weeks)!=14: raise RuntimeError('forecast weeks '+p['name'])
            out.append({'name':p['name'],'pos':p['pos'],'weeks':weeks})
        return out

    bypos={p:[] for p in POS}
    for v in fc.values():
        pos=v.get('pos')
        if pos in POS and isinstance(v.get('sleeper_adp'),(int,float)):
            bypos[pos].append((float(v['sleeper_adp']),v))
    repl={}
    for pos,a in bypos.items():
        if not a: raise RuntimeError('no ADP forecasts '+pos)
        a.sort(key=lambda z:z[0])
        tail=a[max(0,int(len(a)*.80)):]
        repl[pos]=[qtile([v['pred_weeks_1_14'][w] for _,v in tail],.5) for w in range(14)]

    meta=getj('https://api.sleeper.app/v1/draft/'+DRAFT_ID)
    league=str(meta['league_id'])
    players=getj('https://api.sleeper.app/v1/players/nfl')
    skill=[]
    for w in range(1,15):
        for g in getj(f'https://api.sleeper.app/v1/league/{league}/matchups/{w}'):
            total=float(g.get('points') or 0)
            pp=g.get('players_points') or {}; kd=0.0
            for sid in map(str,g.get('starters') or []):
                if (players.get(sid) or {}).get('position','').upper() in {'K','DEF'}:
                    kd+=float(pp.get(sid,0) or 0)
            skill.append((w,total-kd))
    if len(skill)<100: raise RuntimeError('historical skill sample too small '+str(len(skill)))

    def wp(score,w):
        # Leave target week out of empirical reference to avoid same-week leakage in the historical CDF.
        v=[x for ww,x in skill if ww!=w]
        return (sum(x<score for x in v)+.5*sum(x==score for x in v)+1)/(len(v)+2)

    rows=[]
    changed_rosters=0
    for seed in EXPECTED:
        rb,rc=map_roster(B[seed]),map_roster(C[seed])
        if [(x['name'],x['pos']) for x in B[seed]['user_roster']] != [(x['name'],x['pos']) for x in C[seed]['user_roster']]:
            changed_rosters+=1
        sb=[lineup(rb,w,repl) for w in range(14)]
        sc=[lineup(rc,w,repl) for w in range(14)]
        ub=sum(wp(sb[w],w+1) for w in range(14))
        uc=sum(wp(sc[w],w+1) for w in range(14))
        rows.append({
            'seed':seed,
            'baseline_expected_wins_14w':ub,
            'challenger_expected_wins_14w':uc,
            'delta':uc-ub,
            'baseline_weekly_mean':statistics.mean(sb),
            'challenger_weekly_mean':statistics.mean(sc)
        })

    ds=[r['delta'] for r in rows]
    mean=statistics.mean(ds); med=statistics.median(ds)
    sd=statistics.stdev(ds) if len(ds)>1 else 0.0
    se=sd/math.sqrt(len(ds)) if ds else 0.0
    # Normal approximation is diagnostic only; raw paired rows are retained for exact downstream checks.
    ci95=[mean-1.96*se,mean+1.96*se]
    nonzero=[x for x in ds if abs(x)>1e-12]

    out={
        'schema':1,
        'status':'PASS',
        'research_only':True,
        'production_mutation':False,
        'method':'paired exact 120-seed complete-roster baseline vs v5 -> independent 2022-2025 market/outcome bridge -> Utility-v3.5 exact league lineup topology + empirical 2025 league skill CDF',
        'selected_panel_used_in_outcome_fit':False,
        'seed_family':'459820001..459820120',
        'seeds':120,
        'changed_rosters':changed_rosters,
        'mean_delta_expected_wins_14w':mean,
        'median_delta':med,
        'sd_delta':sd,
        'mean_delta_ci95_normal_diagnostic':ci95,
        'challenger_better':sum(x>1e-12 for x in ds),
        'same':sum(abs(x)<=1e-12 for x in ds),
        'challenger_worse':sum(x<-1e-12 for x in ds),
        'nonzero_pairs':len(nonzero),
        'min_delta':min(ds),
        'max_delta':max(ds),
        'baseline_mean_expected_wins_14w':statistics.mean(r['baseline_expected_wins_14w'] for r in rows),
        'challenger_mean_expected_wins_14w':statistics.mean(r['challenger_expected_wins_14w'] for r in rows),
        'policy_promotion_authorized':False,
        'promotion_note':'Utility is one required gate only. Natural executable pick92/rawScore control and freeze-risk review remain mandatory before any production consideration.',
        'rows':rows
    }
    pathlib.Path('diagnostics_2026').mkdir(exist_ok=True)
    dst=pathlib.Path('diagnostics_2026/RC463_V5_PAIRED_CHAMPIONSHIP_UTILITY_120_20260825.json')
    dst.write_text(json.dumps(out,indent=2))
    print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))

if __name__=='__main__': main()
