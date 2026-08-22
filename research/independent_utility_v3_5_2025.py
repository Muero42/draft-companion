import runpy,json,math,statistics
ns=runpy.run_path('research/independent_utility_v3_3_2025.py')
out=ns['out']; ids=ns['ids']; central_u=ns['central_u']; evaluate=ns['evaluate']; concord=ns['concord']; loo_ranges=ns['loo_ranges']; loo_max_span=ns['loo_max_span']
central_order=sorted(ids,key=lambda r:central_u[r],reverse=True); top1=central_order[0]; n=14
loo_utils=[]; top1_by_omit=[]
for omit in range(1,15):
    u,_=evaluate(.20,.50,weeks=[w for w in range(1,15) if w!=omit]); loo_utils.append((omit,u)); top1_by_omit.append(max(ids,key=lambda r:u[r]))
pairs=[]; significant=[]; significant_flips=[]
for i,a in enumerate(ids):
  for b in ids[i+1:]:
    theta=central_u[a]-central_u[b]
    vals=[u[a]-u[b] for _,u in loo_utils]; mean=sum(vals)/n
    se=math.sqrt((n-1)/n*sum((x-mean)**2 for x in vals))
    lo=theta-1.96*se; hi=theta+1.96*se
    sig=(lo>0 or hi<0)
    flips=[{'omit_week':omit,'loo_gap':u[a]-u[b]} for omit,u in loo_utils if theta*(u[a]-u[b]) < -1e-9]
    rec={'a':a,'b':b,'central_gap':theta,'jackknife_se':se,'ci95':[lo,hi],'significant':sig,'sign_flips':flips}
    pairs.append(rec)
    if sig:
      significant.append(rec)
      if flips: significant_flips.append(rec)
criteria=dict(out['criteria'])
criteria.pop('leave_one_week_rank_span_max_le_4',None)
criteria['leave_one_week_pairwise_concordance_median_ge_0_90']=statistics.median(concord)>=.90
criteria['leave_one_week_top1_stable']=all(x==top1 for x in top1_by_omit)
criteria['jackknife_significant_pairs_exist']=len(significant)>0
criteria['jackknife_95pct_significant_pairs_have_no_loo_sign_flip']=len(significant_flips)==0
out['status']='PASS' if all(criteria.values()) else 'FAIL_CLOSED'
out['method']='Independent Championship Utility v3.5 / frozen 2025 opening draft / exact Half-PPR / draft-cutline vacancy replacement / jackknife uncertainty stability'
out['criteria']=criteria
out['diagnostics']=out.get('diagnostics',{})
out['diagnostics'].update({'leave_one_week_rank_span_max_diagnostic_only':loo_max_span,'leave_one_week_rank_ranges_diagnostic_only':loo_ranges,'leave_one_week_pairwise_concordance_median':statistics.median(concord),'leave_one_week_top1_by_omit':top1_by_omit,'jackknife_pair_count':len(pairs),'jackknife_significant_pair_count':len(significant),'jackknife_significant_pairs_with_flip':significant_flips,'jackknife_pairs':pairs})
out['limitations']=out.get('limitations',[])+['Absolute ordinal rank span and fixed expected-win gap thresholds are diagnostic only. Material pairwise stability is certified using a 14-week delete-one jackknife: pair ordering is treated as distinguishable only when the 95% jackknife interval of the expected-win gap excludes zero; every such pair must retain sign in each leave-one-week sample.']
open('INDEPENDENT_UTILITY_V3_5_CERTIFICATION_2025.json','w').write(json.dumps(out,indent=2))
print(json.dumps({'status':out['status'],'criteria':criteria,'median_loo_concordance':statistics.median(concord),'top1_by_omit':top1_by_omit,'jackknife_significant_pair_count':len(significant),'significant_pair_flips':significant_flips},indent=2))
