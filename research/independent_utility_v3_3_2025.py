import csv,json,math,re,statistics,unicodedata,collections,itertools
POS={'QB','RB','WR','TE'}
START={'QB':1,'RB':1,'WR':2,'TE':1}
CAP={'RB':3,'WR':4,'TE':2}
TAIL_FRACS=(0.15,0.20,0.25)
TAIL_QS=(0.40,0.50,0.60)

def norm(x):
    x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower()
    x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x)
    return re.sub('[^a-z0-9]+','',x)

def f(r,k):
    try:return float(r.get(k) or 0)
    except:return 0.0

def score(r):
    return (.04*f(r,'passing_yards')+4*f(r,'passing_tds')-2*f(r,'passing_interceptions')+2*f(r,'passing_2pt_conversions')+.1*f(r,'rushing_yards')+6*f(r,'rushing_tds')+2*f(r,'rushing_2pt_conversions')+.5*f(r,'receptions')+.1*f(r,'receiving_yards')+6*f(r,'receiving_tds')+2*f(r,'receiving_2pt_conversions')-2*f(r,'fumbles_lost_total'))

def qtile(vals,q):
    vals=sorted(vals)
    if not vals:return 0.0
    x=(len(vals)-1)*q; lo=int(math.floor(x)); hi=int(math.ceil(x))
    return vals[lo] if lo==hi else vals[lo]*(hi-x)+vals[hi]*(x-lo)

# Frozen opening draft: no post-draft ownership/transactions.
picks=json.load(open('picks.json')); drafted=[]
for p in picks:
    m=p.get('metadata') or {}; pos=(m.get('position') or '').upper()
    if pos in POS:
        drafted.append({'pick':int(p['pick_no']),'rid':int(p['roster_id']),'sid':str(p['player_id']),'name':((m.get('first_name') or '')+' '+(m.get('last_name') or '')).strip(),'pos':pos})
rr=list(csv.DictReader(open('ids.csv',encoding='utf-8-sig'))); cols=list(rr[0])
sidcol=next(c for c in cols if c.lower() in {'sleeper_id','sleeperid'}); gidcol=next(c for c in cols if c.lower() in {'gsis_id','gsisid'})
cross={str(r.get(sidcol) or '').strip():str(r.get(gidcol) or '').strip() for r in rr if r.get(sidcol) and r.get(gidcol)}
stats={}; byname={}
for r in csv.DictReader(open('stats.csv',encoding='utf-8-sig')):
    pos=(r.get('position') or '').upper()
    if pos not in POS or (r.get('season_type') or 'REG')!='REG':continue
    try:w=int(float(r['week']))
    except:continue
    if not 1<=w<=17:continue
    gid=str(r.get('player_id') or '')
    if not gid:continue
    stats[(gid,w)]=stats.get((gid,w),0.0)+score(r)
    nm=norm(r.get('player_display_name') or r.get('player_name') or '')
    if nm:byname[nm]=gid
for p in drafted:p['gid']=cross.get(p['sid']) or byname.get(norm(p['name']))
assert len(drafted)==136 and all(p['gid'] for p in drafted)
roster=collections.defaultdict(list)
for p in drafted:roster[p['rid']].append(p)

# Actual league skill-score environment only for the score->win transform; K/DST removed.
player_meta=json.load(open('players.json')); team_skill_scores={}; actual_wins=collections.Counter(); actual_pts=collections.Counter(); kd_removed=[]
for w in range(1,15):
    games=json.load(open(f'matchup_{w}.json')); groups=collections.defaultdict(list)
    for g in games:
        rid=int(g['roster_id']); total=float(g.get('points') or 0); pp=g.get('players_points') or {}; kd=0.0
        for sid in [str(x) for x in (g.get('starters') or [])]:
            if (player_meta.get(sid) or {}).get('position','').upper() in {'K','DEF'}:kd+=float(pp.get(sid,0) or 0)
        skill=total-kd; kd_removed.append(kd); team_skill_scores[(rid,w)]=skill; actual_pts[rid]+=total; groups[g['matchup_id']].append((rid,total))
    for arr in groups.values():
        if len(arr)==2:
            (a,pa),(b,pb)=arr
            if pa>pb:actual_wins[a]+=1
            elif pb>pa:actual_wins[b]+=1
            else:actual_wins[a]+=.5;actual_wins[b]+=.5

def winprob(total,w):
    vals=[v for (rid,ww),v in team_skill_scores.items() if ww!=w]; n=len(vals)
    below=sum(v<total for v in vals); ties=sum(v==total for v in vals)
    return (below+.5*ties+1)/(n+2)

def tail_cohort(pos,frac):
    ps=sorted([p for p in drafted if p['pos']==pos],key=lambda p:p['pick'])
    n=max(3,int(round(len(ps)*frac)))
    return ps[-min(n,len(ps)):]

def replacement(pos,w,frac,q):
    # Replacement cohort is selected ONLY by frozen opening-draft market cutline (latest drafted at position), never by later production.
    vals=[stats[(p['gid'],w)] for p in tail_cohort(pos,frac) if (p['gid'],w) in stats]
    return qtile(vals,q) if vals else 0.0

def pscore(p,w,scale=None):
    v=stats.get((p['gid'],w),0.0)
    if scale and p['gid'] in scale:v*=scale[p['gid']]
    return v

def hasrow(p,w):return (p['gid'],w) in stats

def lineup_value(players,w,frac,q,scale=None):
    # Replacement is vacancy-only: it fills a mandatory slot when the opening roster has no active/row-bearing drafted option.
    # It never displaces an active drafted player merely because hindsight says the waiver baseline scored more.
    qbps=[p for p in players if p['pos']=='QB' and hasrow(p,w)]
    qb=max([pscore(p,w,scale) for p in qbps],default=replacement('QB',w,frac,q))
    vals={pos:sorted([pscore(p,w,scale) for p in players if p['pos']==pos and hasrow(p,w)],reverse=True) for pos in ('RB','WR','TE')}
    best=None
    # Exact six non-QB slots: RB1 + WR2 + TE1 + one RB/WR/TE FLEX + one WR/RB FLEX. TE max two.
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6:continue
        counts={'RB':rb,'WR':wr,'TE':te}; v=0.0; legal=True
        for pos in ('RB','WR','TE'):
            have=min(len(vals[pos]),counts[pos]); v+=sum(vals[pos][:have])
            miss=counts[pos]-have
            # Only vacancy fill; no hindsight waiver upgrade of an existing row-bearing drafted option.
            if miss:v+=miss*replacement(pos,w,frac,q)
        if legal and (best is None or v>best):best=v
    return qb+(best if best is not None else 0.0)

def evaluate(frac,q,scale=None,weeks=range(1,15)):
    util={}; raw={}
    for rid in range(1,11):
        scores=[]; probs=[]
        for w in weeks:
            lv=lineup_value(roster[rid],w,frac,q,scale); scores.append(lv); probs.append(winprob(lv,w))
        raw[rid]=sum(scores); util[rid]=sum(probs)
    return util,raw

def pearson(a,b):
    xs=list(a);ys=list(b);mx=sum(xs)/len(xs);my=sum(ys)/len(ys);dx=[x-mx for x in xs];dy=[y-my for y in ys];den=math.sqrt(sum(x*x for x in dx)*sum(y*y for y in dy));return sum(x*y for x,y in zip(dx,dy))/den if den else 0.0

variants=[]; rank_by_rid=collections.defaultdict(list); ids=list(range(1,11))
for frac in TAIL_FRACS:
  for q in TAIL_QS:
    u,raw=evaluate(frac,q); order=sorted(ids,key=lambda r:u[r],reverse=True)
    for i,r in enumerate(order,1):rank_by_rid[r].append(i)
    variants.append({'tail_frac':frac,'quantile':q,'expected_wins':u,'raw_skill_points':raw,'rank_order':order,'corr_actual_wins_diagnostic_only':pearson([u[r] for r in ids],[actual_wins[r] for r in ids]),'corr_actual_points_diagnostic_only':pearson([u[r] for r in ids],[actual_pts[r] for r in ids])})
central=next(v for v in variants if v['tail_frac']==.20 and v['quantile']==.50); central_u=central['expected_wins']
# Player-halving monotonicity on central specification.
mono=True; perturb=[]
for rid in ids:
  for p in roster[rid]:
    after,_=evaluate(.20,.50,scale={p['gid']:.5}); delta=after[rid]-central_u[rid]
    if delta>1e-9:mono=False
    perturb.append({'rid':rid,'player':p['name'],'delta_after_halving':delta})
# Leave-one-week-out stability on central specification.
rank_loo=collections.defaultdict(list); concord=[]; loo=[]; cp={(a,b):(central_u[a]>=central_u[b]) for a in ids for b in ids if a<b}
for omit in range(1,15):
    u,_=evaluate(.20,.50,weeks=[w for w in range(1,15) if w!=omit]); o=sorted(ids,key=lambda r:u[r],reverse=True)
    for i,r in enumerate(o,1):rank_loo[r].append(i)
    same=sum((u[a]>=u[b])==v for (a,b),v in cp.items())/len(cp); concord.append(same); loo.append({'omit_week':omit,'rank_order':o,'pairwise_concordance':same})
rank_ranges={str(r):[min(rank_by_rid[r]),max(rank_by_rid[r])] for r in ids}; sensitivity_max_span=max(b-a for a,b in rank_ranges.values())
loo_ranges={str(r):[min(rank_loo[r]),max(rank_loo[r])] for r in ids}; loo_max_span=max(b-a for a,b in loo_ranges.values())
criteria={'all_136_mapped':True,'no_postdraft_ownership_used':True,'replacement_cohort_selected_only_by_frozen_draft_cutline':True,'replacement_never_selected_by_realized_season_mean':True,'replacement_is_vacancy_only_not_hindsight_upgrade':True,'skill_only_transform_removes_kdst_nuisance':True,'all_player_halving_never_improves':mono,'replacement_sensitivity_rank_span_max_le_4':sensitivity_max_span<=4,'leave_one_week_pairwise_concordance_min_ge_0_80':min(concord)>=.80,'leave_one_week_rank_span_max_le_4':loo_max_span<=4}
out={'status':'PASS' if all(criteria.values()) else 'FAIL_CLOSED','method':'Independent Championship Utility v3.3 / frozen 2025 opening draft / exact Half-PPR / draft-cutline vacancy replacement / skill-only leave-week-out win CDF','criteria':criteria,'drafted_skill_players':len(drafted),'drafted_position_counts':dict(collections.Counter(p['pos'] for p in drafted)),'opening_roster_position_counts':{str(r):dict(collections.Counter(p['pos'] for p in roster[r])) for r in ids},'central_expected_wins':central_u,'central_rank_order':central['rank_order'],'replacement_sensitivity_rank_ranges':rank_ranges,'replacement_sensitivity_max_span':sensitivity_max_span,'leave_one_week_rank_ranges':loo_ranges,'leave_one_week_max_span':loo_max_span,'leave_one_week_min_pairwise_concordance':min(concord),'variants':variants,'leave_one_week':loo,'perturbation':perturb,'limitations':['Hindsight realized production is used only to validate functional form, not as a 2026 forecast.','Replacement identities are never chosen using realized production; replacement cohorts are fixed solely by the frozen opening-draft positional cutline.','Replacement is vacancy-only. It does not upgrade an active drafted player using hindsight waiver scoring.','A roster that intentionally drafts no TE/QB receives a neutral draft-cutline replacement baseline for that structurally vacant mandatory slot rather than an impossible season-long zero.','Actual standings/points remain diagnostics only because waivers, trades and injuries contaminate them.']}
open('INDEPENDENT_UTILITY_V3_3_CERTIFICATION_2025.json','w').write(json.dumps(out,indent=2));print(json.dumps({'status':out['status'],'criteria':criteria,'central_rank_order':out['central_rank_order'],'replacement_sensitivity_max_span':sensitivity_max_span,'loo_max_span':loo_max_span,'min_loo_concordance':min(concord)},indent=2))
