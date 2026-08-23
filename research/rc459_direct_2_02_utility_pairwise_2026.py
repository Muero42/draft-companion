#!/usr/bin/env python3
import json,statistics,pathlib,itertools
SRC='counterfactual_2026/RC459_DIRECT_2_02_REGULAR_SEASON_UTILITY_2026.json'
OUT='counterfactual_2026/RC459_DIRECT_2_02_UTILITY_PAIRWISE_2026.json'

def main():
    x=json.load(open(SRC))
    if x.get('status')!='PASS' or x.get('true_title_probability') is not False:raise RuntimeError('utility source gate')
    cand={}; pair={}; groups={}
    for st in x['states']:
        vals={z['candidate']['name']:float(z['expected_wins_14w']) for z in st['ranking']}
        if len(vals)<3:continue
        best=max(vals.values()); ordered=sorted(vals.items(),key=lambda kv:(-kv[1],kv[0])); ranks={n:i+1 for i,(n,_) in enumerate(ordered)}
        prefix=st['forced_1_09']['name']; g=groups.setdefault(prefix,{})
        for n,v in vals.items():
            a=cand.setdefault(n,{'n':0,'regrets':[],'ranks':[],'wins':0});a['n']+=1;a['regrets'].append(best-v);a['ranks'].append(ranks[n]);a['wins']+=int(v==best)
            gg=g.setdefault(n,{'n':0,'regrets':[],'ranks':[],'wins':0});gg['n']+=1;gg['regrets'].append(best-v);gg['ranks'].append(ranks[n]);gg['wins']+=int(v==best)
        for a,b in itertools.combinations(sorted(vals),2):
            d=vals[a]-vals[b];p=pair.setdefault((a,b),[]);p.append(d)
    summary=[]
    for n,a in cand.items():summary.append({'candidate':n,'n_states':a['n'],'state_win_rate':a['wins']/a['n'],'mean_regret_to_state_best_expected_wins':statistics.mean(a['regrets']),'median_regret':statistics.median(a['regrets']),'mean_state_rank':statistics.mean(a['ranks'])})
    summary.sort(key=lambda z:(z['mean_regret_to_state_best_expected_wins'],z['mean_state_rank'],-z['n_states'],z['candidate']))
    pairs=[]
    for (a,b),ds in pair.items():
        if len(ds)<5:continue
        pairs.append({'a':a,'b':b,'n_shared_states':len(ds),'mean_a_minus_b_expected_wins':statistics.mean(ds),'median_a_minus_b':statistics.median(ds),'a_better_rate':sum(d>0 for d in ds)/len(ds),'tie_rate':sum(d==0 for d in ds)/len(ds)})
    pairs.sort(key=lambda z:(-z['n_shared_states'],-abs(z['mean_a_minus_b_expected_wins']),z['a'],z['b']))
    strat={}
    for prefix,gm in groups.items():
        arr=[]
        for n,a in gm.items():arr.append({'candidate':n,'n_states':a['n'],'state_win_rate':a['wins']/a['n'],'mean_regret':statistics.mean(a['regrets']),'mean_state_rank':statistics.mean(a['ranks'])})
        arr.sort(key=lambda z:(z['mean_regret'],z['mean_state_rank'],-z['n_states'],z['candidate']));strat[prefix]=arr
    out={'schema':1,'status':'PASS','method':'within-state normalization of independent weeks-1-14 utility; avoids comparing raw means across different availability/prefix mixes','interpretation':'Diagnostic only; lower regret and lower rank are better. Candidate n and shared-state n must accompany every comparison. Not P(title), not policy certification.','summary':summary,'pairwise':pairs,'by_forced_1_09':strat}
    pathlib.Path(OUT).write_text(json.dumps(out,indent=2,ensure_ascii=False))
    print(json.dumps({'status':'PASS','top_state_normalized':[(z['candidate'],round(z['mean_regret_to_state_best_expected_wins'],4),round(z['mean_state_rank'],2),z['n_states']) for z in summary[:12]],'largest_shared_pairs':[(z['a'],z['b'],z['n_shared_states'],round(z['mean_a_minus_b_expected_wins'],4),round(z['a_better_rate'],2)) for z in pairs[:12]],'output':OUT},indent=2))
if __name__=='__main__':main()
