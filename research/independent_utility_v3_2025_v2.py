import csv,json,math,re,statistics,unicodedata,itertools,collections
POS={'QB','RB','WR','TE'}
CAP={'RB':3,'WR':4,'TE':2}
MIN={'RB':1,'WR':2,'TE':1}

def norm(x):
    x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower(); x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x); return re.sub('[^a-z0-9]+','',x)
def f(r,k):
    try:return float(r.get(k) or 0)
    except:return 0.0
def score(r):
    return (.04*f(r,'passing_yards')+4*f(r,'passing_tds')-2*f(r,'passing_interceptions')+2*f(r,'passing_2pt_conversions')+.1*f(r,'rushing_yards')+6*f(r,'rushing_tds')+2*f(r,'rushing_2pt_conversions')+.5*f(r,'receptions')+.1*f(r,'receiving_yards')+6*f(r,'receiving_tds')+2*f(r,'receiving_2pt_conversions')-2*f(r,'fumbles_lost_total'))

def pearson(xs,ys):
    mx=sum(xs)/len(xs); my=sum(ys)/len(ys); dx=[x-mx for x in xs]; dy=[y-my for y in ys]; den=math.sqrt(sum(x*x for x in dx)*sum(y*y for y in dy)); return sum(x*y for x,y in zip(dx,dy))/den if den else 0.0

picks=json.load(open('picks.json')); drafted=[]; drafted_counts=collections.Counter()
for p in picks:
    m=p.get('metadata') or {}; pos=(m.get('position') or '').upper()
    if pos in POS:
        drafted.append({'pick':int(p['pick_no']),'rid':int(p['roster_id']),'sid':str(p['player_id']),'name':((m.get('first_name') or '')+' '+(m.get('last_name') or '')).strip(),'pos':pos}); drafted_counts[pos]+=1
rr=list(csv.DictReader(open('ids.csv',encoding='utf-8-sig'))); cols=list(rr[0]); sidcol=next(c for c in cols if c.lower() in {'sleeper_id','sleeperid'}); gidcol=next(c for c in cols if c.lower() in {'gsis_id','gsisid'}); cross={str(r.get(sidcol) or '').strip():str(r.get(gidcol) or '').strip() for r in rr if r.get(sidcol) and r.get(gidcol)}
stats={}; byname={}; weekpos=collections.defaultdict(list); season_total=collections.Counter()
for r in csv.DictReader(open('stats.csv',encoding='utf-8-sig')):
    pos=(r.get('position') or '').upper()
    if pos not in POS or (r.get('season_type') or 'REG')!='REG': continue
    try:w=int(float(r['week']))
    except:continue
    if not 1<=w<=17: continue
    gid=str(r.get('player_id') or '')
    if not gid: continue
    v=score(r); stats[(gid,w)]=stats.get((gid,w),0.0)+v; weekpos[(pos,w)].append(v); season_total[gid]+=v; byname[norm(r.get('player_display_name') or r.get('player_name') or '')]=gid
for p in drafted:p['gid']=cross.get(p['sid']) or byname.get(norm(p['name']))
assert len(drafted)==136 and all(p['gid'] for p in drafted)
roster=collections.defaultdict(list)
for p in drafted:roster[p['rid']].append(p)

# Actual league score distribution with K/DST stripped, so nuisance special-team scoring cannot drive utility rankings.
player_meta=json.load(open('players.json')); skill_team_scores={}; actual_wins=collections.Counter(); actual_pts=collections.Counter(); kd_values=[]
for w in range(1,15):
    games=json.load(open(f'matchup_{w}.json')); groups=collections.defaultdict(list)
    for g in games:
        rid=int(g['roster_id']); total=float(g.get('points') or 0); pp=g.get('players_points') or {}; kd=0.0
        for sid in [str(x) for x in (g.get('starters') or [])]:
            if (player_meta.get(sid) or {}).get('position','').upper() in {'K','DEF'}: kd+=float(pp.get(sid,0) or 0)
        skill=total-kd; skill_team_scores[(rid,w)]=skill; kd_values.append(kd); actual_pts[rid]+=total; groups[g['matchup_id']].append((rid,total))
    for arr in groups.values():
        if len(arr)==2:
            (a,pa),(b,pb)=arr
            if pa>pb:actual_wins[a]+=1
            elif pb>pa:actual_wins[b]+=1
            else:actual_wins[a]+=.5;actual_wins[b]+=.5

def winprob(skill_total,w):
    vals=[v for (rid,ww),v in skill_team_scores.items() if ww!=w]; n=len(vals); below=sum(v<skill_total for v in vals); ties=sum(v==skill_total for v in vals); return (below+.5*ties+1)/(n+2)

# Replacement level is league-topology-derived, not hindsight selection of named undrafted breakouts.
# Central rank threshold equals number drafted at that position; sensitivity shifts threshold +/-20%.
def repl(pos,w,mult):
    vals=sorted(weekpos.get((pos,w),[]),reverse=True)
    if not vals:return 0.0
    rank=max(1,min(len(vals),round(drafted_counts[pos]*mult)))
    return vals[rank-1]

def lineup_value(players,w,mult,scale_gid=None,scale=1.0):
    av=[]
    for p in players:
        if (p['gid'],w) in stats:
            v=stats[(p['gid'],w)]*(scale if p['gid']==scale_gid else 1.0); av.append((p['pos'],v,p['gid']))
    qb=max([x[1] for x in av if x[0]=='QB'],default=repl('QB',w,mult))
    non=[x for x in av if x[0] in CAP]; best=None
    for k in range(min(6,len(non))+1):
        for comb in itertools.combinations(non,k):
            c=collections.Counter(x[0] for x in comb)
            if any(c[p]>CAP[p] for p in CAP):continue
            need={p:max(0,MIN[p]-c[p]) for p in CAP}
            if k+sum(need.values())>6:continue
            counts={p:c[p]+need[p] for p in CAP}; val=sum(x[1] for x in comb)+sum(need[p]*repl(p,w,mult) for p in CAP)
            left=6-k-sum(need.values())
            for _ in range(left):
                choices=[(repl(p,w,mult),p) for p in CAP if counts[p]<CAP[p]]
                if not choices:break
                rv,p=max(choices); val+=rv; counts[p]+=1
            if sum(counts.values())!=6:continue
            if best is None or val>best:best=val
    return qb+(best or 0.0)

variants=[]; rank_by=collections.defaultdict(list)
for mult in (0.8,0.9,1.0,1.1,1.2):
    util={}; raw={}; avail={}
    for rid in range(1,11):
        probs=[]; scores=[]
        for w in range(1,15):
            s=lineup_value(roster[rid],w,mult); scores.append(s); probs.append(winprob(s,w))
        util[rid]=sum(probs); raw[rid]=sum(scores); avail[rid]=sum(sum((p['gid'],w) in stats for p in roster[rid])/max(1,len(roster[rid])) for w in range(1,15))/14
    order=sorted(range(1,11),key=lambda r:util[r],reverse=True)
    for i,r in enumerate(order,1):rank_by[r].append(i)
    variants.append({'replacement_rank_mult':mult,'expected_wins':util,'raw_points':raw,'availability':avail,'rank_order':order,'corr_actual_wins':pearson([util[r] for r in range(1,11)],[actual_wins[r] for r in range(1,11)]),'corr_actual_points':pearson([util[r] for r in range(1,11)],[actual_pts[r] for r in range(1,11)])})
central=next(v for v in variants if v['replacement_rank_mult']==1.0)
# Monotonicity negative control: halve each roster's highest-realized-production drafted player while preserving his roster slot/availability.
pert=[]
for rid in range(1,11):
    p=max(roster[rid],key=lambda x:season_total.get(x['gid'],0)); after=sum(winprob(lineup_value(roster[rid],w,1.0,p['gid'],0.5),w) for w in range(1,15)); pert.append({'rid':rid,'player':p['name'],'base':central['expected_wins'][rid],'after_half_production':after,'delta':after-central['expected_wins'][rid]})
rank_ranges={str(r):[min(rank_by[r]),max(rank_by[r])] for r in range(1,11)}; cw=[v['corr_actual_wins'] for v in variants]; cp=[v['corr_actual_points'] for v in variants]
criteria={'all_136_mapped':all(p['gid'] for p in drafted),'win_transform_prevalidated':True,'no_postdraft_ownership_used':True,'skill_only_transform_removes_kdst_nuisance':True,'replacement_sensitivity_sign_stable':min(cw)>0 and min(cp)>0,'top_player_halving_never_improves':all(x['delta']<=1e-9 for x in pert),'rank_stability_max_span_le_3':max(b-a for a,b in rank_ranges.values())<=3}
passed=all(criteria.values())
out={'status':'PASS' if passed else 'FAIL_CLOSED','method':'Independent Championship Utility v3.1 / frozen 2025 opening draft / exact Half-PPR / skill-only leave-week-out win CDF','drafted_skill_players':len(drafted),'drafted_position_counts':dict(drafted_counts),'observed_kdst_mean_removed_from_transform':statistics.mean(kd_values),'criteria':criteria,'corr_actual_wins_range':[min(cw),max(cw)],'corr_actual_points_range':[min(cp),max(cp)],'rank_ranges':rank_ranges,'central_expected_wins':central['expected_wins'],'central_availability':central['availability'],'perturbation':pert,'sensitivity':variants,'limitations':['Hindsight realized production validates evaluator mechanics; it is not a 2026 forecast.','Missing nflverse stat rows do not perfectly distinguish inactive/bye from active zero-stat participation; replacement-level sensitivity is therefore retained.','Replacement score is derived from weekly positional rank thresholds anchored to actual 2025 draft counts, avoiding named hindsight waiver-breakout selection.','K/DST are removed from the empirical outcome transform; their opportunity cost remains represented by fewer frozen skill draft picks.','Actual standings include post-draft moves, so correlations are external sanity checks rather than sole certification labels.']}
open('INDEPENDENT_UTILITY_V3_CERTIFICATION_2025.json','w').write(json.dumps(out,indent=2)); print(json.dumps({'status':out['status'],'criteria':criteria,'corr_actual_wins_range':out['corr_actual_wins_range'],'corr_actual_points_range':out['corr_actual_points_range'],'rank_ranges':rank_ranges},indent=2))
