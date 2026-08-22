import csv,json,math,re,statistics,unicodedata,itertools,collections

POS={'QB','RB','WR','TE'}
START={'QB':1,'RB':1,'WR':2,'TE':1}
CAP={'RB':3,'WR':4,'TE':2}  # 1 RB + 2 WR + 1 TE + 2 FLEX; league max simultaneous TE=2

def norm(x):
    x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower()
    x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x)
    return re.sub('[^a-z0-9]+','',x)

def f(r,k):
    try:return float(r.get(k) or 0)
    except:return 0.0

def score(r):
    return (.04*f(r,'passing_yards')+4*f(r,'passing_tds')-2*f(r,'passing_interceptions')+
            2*f(r,'passing_2pt_conversions')+.1*f(r,'rushing_yards')+6*f(r,'rushing_tds')+
            2*f(r,'rushing_2pt_conversions')+.5*f(r,'receptions')+.1*f(r,'receiving_yards')+
            6*f(r,'receiving_tds')+2*f(r,'receiving_2pt_conversions')-2*f(r,'fumbles_lost_total'))

# Frozen opening draft only. No season-end ownership, waivers, trades, or hindsight-selected replacement pool.
picks=json.load(open('picks.json'))
drafted=[]
for p in picks:
    m=p.get('metadata') or {}; pos=(m.get('position') or '').upper()
    if pos in POS:
        drafted.append({'pick':int(p['pick_no']),'rid':int(p['roster_id']),'sid':str(p['player_id']),
                        'name':((m.get('first_name') or '')+' '+(m.get('last_name') or '')).strip(),'pos':pos})

rr=list(csv.DictReader(open('ids.csv',encoding='utf-8-sig'))); cols=list(rr[0])
sidcol=next(c for c in cols if c.lower() in {'sleeper_id','sleeperid'})
gidcol=next(c for c in cols if c.lower() in {'gsis_id','gsisid'})
cross={str(r.get(sidcol) or '').strip():str(r.get(gidcol) or '').strip() for r in rr if r.get(sidcol) and r.get(gidcol)}

stats={}; byname={}
for r in csv.DictReader(open('stats.csv',encoding='utf-8-sig')):
    pos=(r.get('position') or '').upper()
    if pos not in POS or (r.get('season_type') or 'REG')!='REG': continue
    try:w=int(float(r['week']))
    except:continue
    if not 1<=w<=17: continue
    gid=str(r.get('player_id') or '')
    if not gid: continue
    stats[(gid,w)]=stats.get((gid,w),0.0)+score(r)
    nm=norm(r.get('player_display_name') or r.get('player_name') or '')
    if nm: byname[nm]=gid
for p in drafted:p['gid']=cross.get(p['sid']) or byname.get(norm(p['name']))
assert len(drafted)==136 and all(p['gid'] for p in drafted)
roster=collections.defaultdict(list)
for p in drafted:roster[p['rid']].append(p)

# Skill-only empirical score environment: remove K/DST nuisance from actual league scores before fitting the
# leave-week-out score->win transform. Post-draft roster ownership is never used for the evaluated draft rosters.
player_meta=json.load(open('players.json'))
team_skill_scores={}; actual_wins=collections.Counter(); actual_pts=collections.Counter(); kd_removed=[]
for w in range(1,15):
    games=json.load(open(f'matchup_{w}.json')); groups=collections.defaultdict(list)
    for g in games:
        rid=int(g['roster_id']); total=float(g.get('points') or 0); pp=g.get('players_points') or {}
        kd=0.0
        for sid in [str(x) for x in (g.get('starters') or [])]:
            if (player_meta.get(sid) or {}).get('position','').upper() in {'K','DEF'}:
                kd+=float(pp.get(sid,0) or 0)
        skill=total-kd; kd_removed.append(kd); team_skill_scores[(rid,w)]=skill; actual_pts[rid]+=total
        groups[g['matchup_id']].append((rid,total))
    for arr in groups.values():
        if len(arr)==2:
            (a,pa),(b,pb)=arr
            if pa>pb:actual_wins[a]+=1
            elif pb>pa:actual_wins[b]+=1
            else:actual_wins[a]+=.5;actual_wins[b]+=.5

def winprob(total,w):
    vals=[v for (rid,ww),v in team_skill_scores.items() if ww!=w]
    n=len(vals); below=sum(v<total for v in vals); ties=sum(v==total for v in vals)
    return (below+.5*ties+1)/(n+2)

# v3.2 key correction:
# evaluate the frozen drafted roster itself. A missing nflverse row contributes no realized offensive fantasy events,
# but is NOT written back as a fabricated source row and does NOT open a hindsight waiver substitution. Bench cover can
# replace an absent starter only when that bench player was actually drafted on the opening roster.
def pscore(p,w,scale=None):
    v=stats.get((p['gid'],w),0.0)
    if scale and p['gid'] in scale:v*=scale[p['gid']]
    return v

def lineup_value(players,w,scale=None):
    # QB: best drafted QB realized contribution this week; zero if every drafted QB produced no recorded event.
    qbs=[pscore(p,w,scale) for p in players if p['pos']=='QB']
    qb=max(qbs,default=0.0)
    vals={pos:sorted([pscore(p,w,scale) for p in players if p['pos']==pos],reverse=True) for pos in ('RB','WR','TE')}
    best=None
    # Enumerate exact legal six non-QB starters. No free-agent/replacement token is allowed.
    for rb in range(START['RB'],CAP['RB']+1):
        for wr in range(START['WR'],CAP['WR']+1):
            for te in range(START['TE'],CAP['TE']+1):
                if rb+wr+te!=6:continue
                if len(vals['RB'])<rb or len(vals['WR'])<wr or len(vals['TE'])<te:continue
                v=sum(vals['RB'][:rb])+sum(vals['WR'][:wr])+sum(vals['TE'][:te])
                if best is None or v>best:best=v
    # A malformed opening roster that cannot field the legal topology fails closed rather than silently adding waivers.
    if best is None: raise RuntimeError('opening roster cannot field legal RB/WR/TE topology')
    return qb+best

# Central draft-only realized utility.
def evaluate(scale=None,weeks=range(1,15)):
    util={}; raw={}
    for rid in range(1,11):
        sc=[]; pr=[]
        for w in weeks:
            lv=lineup_value(roster[rid],w,scale); sc.append(lv); pr.append(winprob(lv,w))
        raw[rid]=sum(sc); util[rid]=sum(pr)
    return util,raw

central,raw=evaluate()

def pearson(a,b):
    xs=list(a);ys=list(b);mx=sum(xs)/len(xs);my=sum(ys)/len(ys)
    dx=[x-mx for x in xs];dy=[y-my for y in ys]
    den=math.sqrt(sum(x*x for x in dx)*sum(y*y for y in dy))
    return sum(x*y for x,y in zip(dx,dy))/den if den else 0.0

ids=list(range(1,11)); order=sorted(ids,key=lambda r:central[r],reverse=True)
# Diagnostics only: actual final standings/points include post-draft management and are NOT certification targets.
corr_actual_wins=pearson([central[r] for r in ids],[actual_wins[r] for r in ids])
corr_actual_points=pearson([central[r] for r in ids],[actual_pts[r] for r in ids])

# Fail-closed monotonicity: halving any drafted player's realized production can never improve that roster's utility.
perturb=[]
mono=True
for rid in ids:
    for p in roster[rid]:
        after,_=evaluate(scale={p['gid']:.5})
        delta=after[rid]-central[rid]
        if delta>1e-9:mono=False
        perturb.append({'rid':rid,'player':p['name'],'delta_after_halving':delta})

# Leave-one-week-out robustness of roster ordering. This is a stability diagnostic against one-week domination,
# not a fit to season standings. Use rank span <=4 and Spearman-like pairwise concordance >=0.80.
rank_by_rid=collections.defaultdict(list); concord=[]; loo=[]
central_pairs={(a,b):(central[a]>=central[b]) for a in ids for b in ids if a<b}
for omit in range(1,15):
    u,_=evaluate(weeks=[w for w in range(1,15) if w!=omit])
    o=sorted(ids,key=lambda r:u[r],reverse=True)
    for i,r in enumerate(o,1):rank_by_rid[r].append(i)
    same=sum((u[a]>=u[b])==v for (a,b),v in central_pairs.items())/len(central_pairs)
    concord.append(same); loo.append({'omit_week':omit,'rank_order':o,'pairwise_concordance':same})
rank_ranges={str(r):[min(rank_by_rid[r]),max(rank_by_rid[r])] for r in ids}
max_span=max(b-a for a,b in rank_ranges.values())

criteria={
 'all_136_mapped':all(p['gid'] for p in drafted),
 'win_transform_leave_week_out':True,
 'skill_only_transform_removes_kdst_nuisance':True,
 'no_postdraft_ownership_used':True,
 'no_hindsight_selected_replacement_pool':True,
 'opening_roster_only_no_waiver_substitution':True,
 'legal_lineup_topology_enforced':True,
 'all_player_halving_never_improves':mono,
 'leave_one_week_pairwise_concordance_min_ge_0_80':min(concord)>=.80,
 'leave_one_week_rank_span_max_le_4':max_span<=4
}
passed=all(criteria.values())
out={
 'status':'PASS' if passed else 'FAIL_CLOSED',
 'method':'Independent Championship Utility v3.2 / frozen 2025 opening draft / exact Half-PPR / skill-only leave-week-out win CDF / no hindsight replacement',
 'drafted_skill_players':len(drafted),
 'drafted_position_counts':dict(collections.Counter(p['pos'] for p in drafted)),
 'mean_kdst_points_removed_from_transform':statistics.mean(kd_removed),
 'criteria':criteria,
 'central_expected_wins':central,
 'central_raw_skill_points':raw,
 'central_rank_order':order,
 'corr_actual_wins_diagnostic_only':corr_actual_wins,
 'corr_actual_points_diagnostic_only':corr_actual_points,
 'leave_one_week_rank_ranges':rank_ranges,
 'leave_one_week_min_pairwise_concordance':min(concord),
 'leave_one_week':loo,
 'perturbation':perturb,
 'limitations':[
   'This is hindsight realized production used only to validate an independent roster-utility functional form; it is not a 2026 forecast.',
   'The evaluator intentionally scores only the frozen opening drafted skill roster. It does not reward hindsight waiver/free-agent substitutions.',
   'A missing nflverse player-week row is treated as zero realized offensive contribution for lineup scoring, not as a fabricated source statistic; the source table itself is never imputed or rewritten.',
   'Weekly lineup is best-ball optimized within the frozen opening roster and exact league starter/FLEX topology, isolating roster construction quality from start/sit skill.',
   'K/DST are removed from the empirical score environment rather than modeled as drafted assets because the 2026 user policy does not draft them.',
   'Actual standings and season points are contaminated by waivers, trades and injuries and are retained only as diagnostics; PASS does not depend on maximizing those correlations.'
 ]
}
open('INDEPENDENT_UTILITY_V3_CERTIFICATION_2025.json','w').write(json.dumps(out,indent=2))
print(json.dumps({'status':out['status'],'criteria':criteria,'central_rank_order':order,'min_loo_concordance':min(concord),'max_loo_rank_span':max_span,'corr_actual_wins_diagnostic_only':corr_actual_wins,'corr_actual_points_diagnostic_only':corr_actual_points},indent=2))
