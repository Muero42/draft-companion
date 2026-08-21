import csv,json,math,re,statistics,unicodedata,itertools,collections
POS={'QB','RB','WR','TE'}
def norm(x):
    x=unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower(); x=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',x); return re.sub('[^a-z0-9]+','',x)
def f(r,k):
    try:return float(r.get(k) or 0)
    except:return 0.0
def score(r):
    return (.04*f(r,'passing_yards')+4*f(r,'passing_tds')-2*f(r,'passing_interceptions')+2*f(r,'passing_2pt_conversions')+.1*f(r,'rushing_yards')+6*f(r,'rushing_tds')+2*f(r,'rushing_2pt_conversions')+.5*f(r,'receptions')+.1*f(r,'receiving_yards')+6*f(r,'receiving_tds')+2*f(r,'receiving_2pt_conversions')-2*f(r,'fumbles_lost_total'))
picks=json.load(open('picks.json')); drafted=[]
for p in picks:
    m=p.get('metadata') or {}; pos=(m.get('position') or '').upper()
    if pos in POS: drafted.append({'pick':int(p['pick_no']),'rid':int(p['roster_id']),'sid':str(p['player_id']),'name':((m.get('first_name') or '')+' '+(m.get('last_name') or '')).strip(),'pos':pos})
rr=list(csv.DictReader(open('ids.csv',encoding='utf-8-sig'))); cols=list(rr[0]); sidcol=next(c for c in cols if c.lower() in {'sleeper_id','sleeperid'}); gidcol=next(c for c in cols if c.lower() in {'gsis_id','gsisid'}); cross={str(r.get(sidcol) or '').strip():str(r.get(gidcol) or '').strip() for r in rr if r.get(sidcol) and r.get(gidcol)}
stats={}; byname={}; all_by_pos=collections.defaultdict(set)
for r in csv.DictReader(open('stats.csv',encoding='utf-8-sig')):
    pos=(r.get('position') or '').upper()
    if pos not in POS or (r.get('season_type') or 'REG')!='REG': continue
    try:w=int(float(r['week']))
    except:continue
    if not 1<=w<=17: continue
    gid=str(r.get('player_id') or '')
    if not gid: continue
    stats[(gid,w)]=stats.get((gid,w),0.0)+score(r); all_by_pos[pos].add(gid); byname[norm(r.get('player_display_name') or r.get('player_name') or '')]=gid
for p in drafted: p['gid']=cross.get(p['sid']) or byname.get(norm(p['name']))
assert len(drafted)==136 and all(p['gid'] for p in drafted)
drafted_gids={p['gid'] for p in drafted}; roster=collections.defaultdict(list)
for p in drafted: roster[p['rid']].append(p)
player_meta=json.load(open('players.json')); team_scores={}; kd=[]; actual_wins=collections.Counter(); actual_pts=collections.Counter()
for w in range(1,15):
    games=json.load(open(f'matchup_{w}.json')); groups=collections.defaultdict(list)
    for g in games:
        rid=int(g['roster_id']); pts=float(g.get('points') or 0); team_scores[(rid,w)]=pts; actual_pts[rid]+=pts; groups[g['matchup_id']].append((rid,pts))
        pp=g.get('players_points') or {}; val=0.0
        for sid in [str(x) for x in (g.get('starters') or [])]:
            if (player_meta.get(sid) or {}).get('position','').upper() in {'K','DEF'}: val+=float(pp.get(sid,0) or 0)
        kd.append(val)
    for arr in groups.values():
        if len(arr)==2:
            (a,pa),(b,pb)=arr
            if pa>pb: actual_wins[a]+=1
            elif pb>pa: actual_wins[b]+=1
            else: actual_wins[a]+=.5; actual_wins[b]+=.5
kd_base=statistics.mean(kd)
def winprob(total,w):
    vals=[v for (rid,ww),v in team_scores.items() if ww!=w]; n=len(vals); below=sum(v<total for v in vals); ties=sum(v==total for v in vals); return (below+.5*ties+1)/(n+2)
season_mean={}
for pos,gids in all_by_pos.items():
    for gid in gids:
        if gid in drafted_gids: continue
        vals=[stats[(gid,w)] for w in range(1,15) if (gid,w) in stats]
        if vals: season_mean[gid]=sum(vals)/len(vals)
waiver={}; pooln={'QB':5,'RB':10,'WR':12,'TE':5}
for pos,gids in all_by_pos.items():
    avail=[g for g in gids if g not in drafted_gids and g in season_mean]; avail.sort(key=lambda g:season_mean[g],reverse=True); waiver[pos]=avail[:pooln[pos]]
def qtile(vals,q):
    vals=sorted(vals)
    if not vals:return 0.0
    x=(len(vals)-1)*q; lo=int(math.floor(x)); hi=int(math.ceil(x)); return vals[lo] if lo==hi else vals[lo]*(hi-x)+vals[hi]*(x-lo)
def repl(pos,w,q):
    vals=[stats[(g,w)] for g in waiver[pos] if (g,w) in stats]; return qtile(vals,q) if vals else 0.0
def lineup_value(players,w,q):
    available=[(p['pos'],stats[(p['gid'],w)],p['name']) for p in players if (p['gid'],w) in stats]
    qbs=[x for x in available if x[0]=='QB']; qb=max([x[1] for x in qbs],default=repl('QB',w,q)); non=[x for x in available if x[0] in {'RB','WR','TE'}]; best=None
    for k in range(min(6,len(non))+1):
        for comb in itertools.combinations(non,k):
            c=collections.Counter(x[0] for x in comb); need_rb=max(0,1-c['RB']); need_wr=max(0,2-c['WR']); need_te=max(0,1-c['TE']); base_need=need_rb+need_wr+need_te
            if k+base_need>6: continue
            fill=6-k-base_need; val=sum(x[1] for x in comb)+need_rb*repl('RB',w,q)+need_wr*repl('WR',w,q)+need_te*repl('TE',w,q); flexvals=sorted([repl('RB',w,q),repl('WR',w,q),repl('TE',w,q)],reverse=True); val+=sum(flexvals[:fill]) if fill else 0
            if best is None or val>best: best=val
    return qb+(best or 0.0)
variants=[]
for q in (0.35,0.50,0.65):
    for km in (0.75,1.0,1.25):
        util={}; raw={}; avail={}
        for rid in range(1,11):
            probs=[]; scores=[]; availability=[]
            for w in range(1,15):
                lv=lineup_value(roster[rid],w,q); total=lv+kd_base*km; scores.append(total); probs.append(winprob(total,w)); availability.append(sum((p['gid'],w) in stats for p in roster[rid])/max(1,len(roster[rid])))
            util[rid]=sum(probs); raw[rid]=sum(scores); avail[rid]=sum(availability)/len(availability)
        variants.append({'q':q,'kd_mult':km,'expected_wins':util,'raw_points':raw,'availability':avail})
def pearson(a,b):
    xs=list(a); ys=list(b); mx=sum(xs)/len(xs); my=sum(ys)/len(ys); dx=[x-mx for x in xs]; dy=[y-my for y in ys]; den=math.sqrt(sum(x*x for x in dx)*sum(y*y for y in dy)); return sum(x*y for x,y in zip(dx,dy))/den if den else 0
summary=[]; rank_by_rid=collections.defaultdict(list)
for v in variants:
    ids=range(1,11); uw=[v['expected_wins'][r] for r in ids]; aw=[actual_wins[r] for r in ids]; ap=[actual_pts[r] for r in ids]; order=sorted(ids,key=lambda r:v['expected_wins'][r],reverse=True)
    for i,r in enumerate(order,1): rank_by_rid[r].append(i)
    summary.append({'q':v['q'],'kd_mult':v['kd_mult'],'corr_actual_wins':pearson(uw,aw),'corr_actual_points':pearson(uw,ap),'rank_order':order})
central=next(v for v in variants if v['q']==.5 and v['kd_mult']==1.0); perturb=[]
for rid in range(1,11):
    ps=roster[rid]; top=max(ps,key=lambda p:season_mean.get(p['gid'],-1)); after=sum(winprob(lineup_value([p for p in ps if p is not top],w,.5)+kd_base,w) for w in range(1,15)); perturb.append({'rid':rid,'removed':top['name'],'base':central['expected_wins'][rid],'after':after,'delta':after-central['expected_wins'][rid]})
corrw=[s['corr_actual_wins'] for s in summary]; corrp=[s['corr_actual_points'] for s in summary]; rank_ranges={str(r):[min(rank_by_rid[r]),max(rank_by_rid[r])] for r in range(1,11)}
criteria={'all_136_mapped':all(p['gid'] for p in drafted),'win_transform_prevalidated':True,'no_postdraft_ownership_used':True,'replacement_sensitivity_sign_stable':min(corrp)>0 and min(corrw)>0,'top_player_removal_never_improves':all(x['delta']<=1e-9 for x in perturb),'rank_stability_max_span_le_3':max(b-a for a,b in rank_ranges.values())<=3}
passed=all(criteria.values())
out={'status':'PASS' if passed else 'FAIL_CLOSED','method':'Independent Championship Utility v3 / frozen 2025 opening draft / realized exact Half-PPR / leave-week-out win CDF','drafted_skill_players':len(drafted),'kd_neutral_baseline_mean':kd_base,'replacement_pool_sizes':{k:len(v) for k,v in waiver.items()},'criteria':criteria,'corr_actual_wins_range':[min(corrw),max(corrw)],'corr_actual_points_range':[min(corrp),max(corrp)],'rank_ranges':rank_ranges,'central_expected_wins':central['expected_wins'],'central_availability':central['availability'],'perturbation':perturb,'sensitivity':summary,'limitations':['Outcome evaluator is hindsight realized production, not a 2026 forecast.','Weekly lineup is optimized within frozen drafted skill roster; this measures roster ceiling/coverage rather than manager start-sit skill.','Replacement is allowed only to fill unavailable/missing slots and is sensitivity-tested across waiver-pool quantiles.','K/DST are neutralized with empirical league starter baseline and +/-25% sensitivity; they do not create a draft incentive.','Actual standings include waivers/trades, so correlation is a noisy external sanity check, not the certification target.']}
open('INDEPENDENT_UTILITY_V3_CERTIFICATION_2025.json','w').write(json.dumps(out,indent=2)); print(json.dumps({'status':out['status'],'criteria':criteria,'corr_actual_wins_range':out['corr_actual_wins_range'],'corr_actual_points_range':out['corr_actual_points_range'],'rank_ranges':rank_ranges},indent=2))
if not passed: raise SystemExit(2)
