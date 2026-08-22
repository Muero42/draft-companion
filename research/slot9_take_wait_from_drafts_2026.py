#!/usr/bin/env python3
"""Extract slot-9 TAKE/WAIT timing evidence from PITTI full-draft artifacts.

Timing evidence is deliberately separated from player quality. A low return probability
creates TAKE pressure only among otherwise viable candidates; it never promotes a weak
player by itself.
"""
from __future__ import annotations
import argparse,collections,json,math,pathlib,statistics
USER_PICKS=(9,12,29,32,49,52,69,72,89,92,109,112,129,132,149)
NEXT={p:(USER_PICKS[i+1] if i+1<len(USER_PICKS) else None) for i,p in enumerate(USER_PICKS)}

def mean(xs): return statistics.mean(xs) if xs else None

def qtile(xs,q):
    if not xs:return None
    a=sorted(xs);z=(len(a)-1)*q;lo=math.floor(z);hi=math.ceil(z)
    return a[lo] if lo==hi else a[lo]*(hi-z)+a[hi]*(z-lo)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('draft_json');ap.add_argument('--out',default='research/SLOT9_TAKE_WAIT_MAP_2026.json');args=ap.parse_args()
    x=json.load(open(args.draft_json)); rows=[r for r in x.get('rows',[]) if r.get('policy')=='COACH']
    if not rows: raise SystemExit('no COACH rows')
    agg=collections.defaultdict(lambda:collections.defaultdict(lambda:{'ret':[],'score':[],'raw':[],'top_rank':[],'selected':0,'seen':0,'pos':None}))
    selected=collections.Counter()
    for r in rows:
        for d in r.get('decisions',[]):
            p=d.get('pick');
            if p not in USER_PICKS:continue
            selected[(p,d.get('name'))]+=1
            top=((d.get('coach_diag') or {}).get('top') or [])
            for c in top:
                z=agg[p][c.get('name')];z['pos']=c.get('pos');z['seen']+=1
                if isinstance(c.get('ret'),(int,float)):z['ret'].append(float(c['ret']))
                if isinstance(c.get('score'),(int,float)):z['score'].append(float(c['score']))
                if isinstance(c.get('raw'),(int,float)):z['raw'].append(float(c['raw']))
                if isinstance(c.get('rank'),(int,float)):z['top_rank'].append(float(c['rank']))
    out={'schema':1,'source':args.draft_json,'rows':len(rows),'warning':'Return probability is timing evidence only; combine with independent player quality and roster opportunity cost.','picks':{}}
    for p in USER_PICKS:
        cs=[]
        for name,z in agg[p].items():
            mr=mean(z['ret']);
            cs.append({'name':name,'pos':z['pos'],'top5_appearances':z['seen'],'selected_count':selected[(p,name)],'mean_return_probability':mr,'return_p25':qtile(z['ret'],.25),'return_p75':qtile(z['ret'],.75),'timing_pressure_1_minus_return':None if mr is None else 1-mr,'mean_canonical_score':mean(z['score']),'mean_raw_score':mean(z['raw']),'mean_top_rank':mean(z['top_rank'])})
        cs.sort(key=lambda a:(-(a['top5_appearances']), -(a['timing_pressure_1_minus_return'] or -1), a['name']))
        out['picks'][str(p)]={'next_own_pick':NEXT[p],'gap':None if NEXT[p] is None else NEXT[p]-p,'candidates':cs}
    pathlib.Path(args.out).parent.mkdir(parents=True,exist_ok=True);pathlib.Path(args.out).write_text(json.dumps(out,indent=2,ensure_ascii=False));print(args.out)
if __name__=='__main__':main()
