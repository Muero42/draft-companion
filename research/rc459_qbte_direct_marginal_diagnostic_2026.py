#!/usr/bin/env python3
import json,glob,pathlib,statistics,math,collections
POS={'QB','RB','WR','TE'}
BASE='/tmp/base'
BRIDGE='bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'
OUT='diagnostics_2026/RC459_QBTE_DIRECT_MARGINAL_DIAGNOSTIC_2026.json'
EXPECTED_REPEATS=166

def qtile(v,q):
    v=sorted(float(x) for x in v); z=(len(v)-1)*q; lo=int(math.floor(z)); hi=int(math.ceil(z))
    return v[lo] if lo==hi else v[lo]*(hi-z)+v[hi]*(z-lo)

def load_drafts():
    out={}
    for p in glob.glob(BASE+'/**/*.json',recursive=True):
        try:x=json.load(open(p))
        except:continue
        if x.get('status')!='PASS' or not isinstance(x.get('drafts'),list):continue
        for d in x['drafts']: out[int(d['seed'])]=d
    exp=list(range(459710001,459710061))
    if sorted(out)!=exp: raise RuntimeError('baseline seed union mismatch')
    return out

def bridge_map():
    b=json.load(open(BRIDGE))
    if b.get('status')!='PASS': raise RuntimeError('bridge not PASS')
    fc=b['forecasts']; by=collections.defaultdict(list); bypos={p:[] for p in POS}
    for v in fc.values():
        key=(str(v.get('name','')).strip().lower(),str(v.get('pos','')).upper())
        by[key].append(v)
        if key[1] in POS and isinstance(v.get('sleeper_adp'),(int,float)):
            bypos[key[1]].append((float(v['sleeper_adp']),v))
    repl={}
    for pos,a in bypos.items():
        a.sort(key=lambda z:z[0]); tail=a[max(0,int(len(a)*.80)):]
        repl[pos]=[qtile([v['pred_weeks_1_14'][w] for _,v in tail],.5) for w in range(14)]
    return by,repl

def forecast(by,name,pos):
    m=by[(str(name).strip().lower(),str(pos).upper())]
    if len(m)!=1: raise RuntimeError(f'forecast mapping {name} {pos} {len(m)}')
    return {'name':name,'pos':pos,'weeks':m[0]['pred_weeks_1_14']}

def lineup(players,w,repl):
    vals={p:sorted([x['weeks'][w] for x in players if x['pos']==p],reverse=True) for p in POS}
    qb=vals['QB'][0] if vals['QB'] else repl['QB'][w]
    best=-1e9
    for rb in range(1,4):
      for wr in range(2,5):
       for te in range(1,3):
        if rb+wr+te!=6: continue
        tot=0
        for pos,n in [('RB',rb),('WR',wr),('TE',te)]:
            have=min(len(vals[pos]),n); tot+=sum(vals[pos][:have])+(n-have)*repl[pos][w]
        best=max(best,tot)
    return qb+best

def eligible_natural_alt(dec):
    # Critical correction: once a repeat QB/TE is being mechanism-audited, do NOT
    # reuse the original Safety-Gate quality band centered on that repeat. That
    # reproduces the diagnosed admissibility-order defect and can hide the true
    # eligible RB/WR competitor. Use the highest-raw visible RB/WR natural option.
    opts=[]
    for r in dec.get('top') or []:
        if r.get('pos') not in {'RB','WR'}: continue
        try:raw=float(r['raw']); panel=float(r['panel'])
        except:continue
        opts.append((raw,-panel,r))
    if not opts: raise RuntimeError(f"no visible RB/WR alternative at seed/pick unknown/{dec.get('pick')}")
    return max(opts,key=lambda x:(x[0],x[1]))[2]

def main():
    drafts=load_drafts(); by,repl=bridge_map(); events=[]; repeat_count=0
    for seed,d in sorted(drafts.items()):
        prior=[]; counts=collections.Counter()
        for dec in d['decisions']:
            pos=dec['pos']; repeat=counts[pos]>=1 and pos in {'QB','TE'}
            if repeat:
                repeat_count+=1
                alt=eligible_natural_alt(dec)
                chosen=forecast(by,dec['name'],pos); other=forecast(by,alt['name'],alt['pos'])
                base=[forecast(by,x['name'],x['pos']) for x in prior]
                sc=[lineup(base+[chosen],w,repl) for w in range(14)]
                sa=[lineup(base+[other],w,repl) for w in range(14)]
                ds=[sc[w]-sa[w] for w in range(14)]
                samepos=[x for x in prior if x['pos']==pos]
                best_prior_panel=min(float(x['panel']) for x in samepos)
                events.append({
                    'seed':seed,'pick':dec['pick'],'repeat_pos':pos,'chosen':dec['name'],'chosen_panel':dec['panel'],'chosen_raw':dec['raw'],
                    'best_prior_samepos_panel':best_prior_panel,'samepos_panel_upgrade':float(dec['panel'])<best_prior_panel,
                    'alt':alt['name'],'alt_pos':alt['pos'],'alt_panel':alt['panel'],'alt_raw':alt['raw'],
                    'direct_mean_weekly_points_delta':statistics.mean(ds),'direct_total_points_delta_14w':sum(ds),
                    'positive_weeks':sum(x>1e-9 for x in ds),'negative_weeks':sum(x<-1e-9 for x in ds),'zero_weeks':sum(abs(x)<=1e-9 for x in ds),
                    'repeat_beats_alt_direct':statistics.mean(ds)>1e-9,
                    'repeat_ties_alt_direct':abs(statistics.mean(ds))<=1e-9,
                    'safety_triggered':bool((dec.get('safety') or {}).get('triggered')),
                })
            prior.append({'name':dec['name'],'pos':pos,'panel':dec['panel']}); counts[pos]+=1
    if repeat_count!=EXPECTED_REPEATS or len(events)!=EXPECTED_REPEATS:
        raise RuntimeError(f'repeat coverage {repeat_count}/{len(events)} expected {EXPECTED_REPEATS}')
    ds=[e['direct_mean_weekly_points_delta'] for e in events]
    bypos={p:[e for e in events if e['repeat_pos']==p] for p in ['QB','TE']}
    out={'schema':2,'status':'PASS','research_only':True,'production_mutation':False,
         'purpose':'mechanism-only direct marginal lineup/option-value diagnostic on quarantined 459710001..060 audit seeds; NOT threshold calibration',
         'threshold_calibration_authorized':False,'fresh_seed_policy_promotion_authorized':False,
         'coverage_invariant':f'exactly {EXPECTED_REPEATS} repeat QB/TE decisions required',
         'method':'At every baseline repeat QB/TE decision, compare prior roster + repeated candidate versus prior roster + highest-raw visible eligible RB/WR natural alternative, using independent Sleeper-history market/outcome bridge weekly forecasts and exact lineup topology; no later draft cascade included. Original repeat-centered Safety-Gate band is intentionally not reused.',
         'events':len(events),'repeat_beats_alt_direct':sum(e['repeat_beats_alt_direct'] for e in events),
         'repeat_ties_alt_direct':sum(e['repeat_ties_alt_direct'] for e in events),'repeat_loses_alt_direct':sum((not e['repeat_beats_alt_direct'] and not e['repeat_ties_alt_direct']) for e in events),
         'mean_direct_weekly_points_delta':statistics.mean(ds),'median_direct_weekly_points_delta':statistics.median(ds),
         'by_position':{},'rows':events}
    for p,rows in bypos.items():
        x=[r['direct_mean_weekly_points_delta'] for r in rows]
        out['by_position'][p]={'n':len(rows),'beats':sum(r['repeat_beats_alt_direct'] for r in rows),'ties':sum(r['repeat_ties_alt_direct'] for r in rows),'loses':sum((not r['repeat_beats_alt_direct'] and not r['repeat_ties_alt_direct']) for r in rows),'mean':statistics.mean(x),'median':statistics.median(x)}
    pathlib.Path(OUT).parent.mkdir(exist_ok=True); pathlib.Path(OUT).write_text(json.dumps(out,indent=2)); print(json.dumps({k:v for k,v in out.items() if k!='rows'},indent=2))
if __name__=='__main__': main()
