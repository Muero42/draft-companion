#!/usr/bin/env python3
"""Research-only OOS calibration for Manager Mock v2 market tails and center bias."""
import argparse,json,math,statistics
from pathlib import Path
import manager_mock_v2 as m

def density_log(st,pn,shift=0.0):
 scale=max(3.0,st.sd*1.08*(1+.12*max(0,4-st.n)))
 z=(pn-(st.mean+shift))/scale
 x=-.5*z*z
 guard=st.mean+shift+max(8,1.75*st.sd)
 if pn>guard:x+=math.log(1+min(3.5,(pn-guard)/max(3,scale)*.9))
 return x

def hazard_log(st,pn,tail=1.0,shift=0.0):
 tau=2.2 if pn<=30 else 5.0 if pn<=80 else 9.0
 scale=max(tau,st.sd*.58*(1+.10*max(0,4-st.n)),1.5)
 x=max(-8,min(3.5,(pn-(st.mean+shift))/scale))
 guard=st.mean+shift+max(7,1.70*st.sd)
 if pn>guard:x+=math.log(1+min(5,(pn-guard)/max(3,scale)*1.4*tail))
 return x

def weight_factory(lam,tail,shift):
 def f(st,pn):
  logw=(1-lam)*density_log(st,pn,shift)+lam*hazard_log(st,pn,tail,shift)
  w=math.exp(max(-12,min(8,logw)))
  if st.source=='user_tail':w*=.20
  return max(1e-10,w)
 return f

def empirical_targets(drafts):
 loo=m.loo_metrics(drafts)
 return {
  'loo_mean_mae':statistics.mean(r['mae'] for r in loo),
  'loo_slide_rate':statistics.mean(r['extreme_slide_rate_per_draft'] for r in loo),
  'loo':loo,
 }

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--app',default='app.js');ap.add_argument('--runs',type=int,default=300);ap.add_argument('--out',default='manager_mock_v2_grid.json');a=ap.parse_args()
 drafts,errors=m.collect(m.DEFAULT_DRAFT_IDS);stats,_=m.build_empirical(drafts);data=m.load_profiles(Path(a.app));target=empirical_targets(drafts)
 rows=[];i=0
 # Around the previous lambda~.25 optimum, explicitly tune late-tail strength and center shift.
 for lam in [.15,.20,.25,.30,.35]:
  for tail in [.75,1.0,1.25,1.5,2.0]:
   for shift in [0.0,1.0,2.0,3.0]:
    i+=1;m.market_weight=weight_factory(lam,tail,shift)
    s,slides,invalid=m.simulate(stats,data,a.runs,280000+i,'auto',False)
    cal=m.calibration(stats,s);sr=len(slides)/a.runs
    # Bias is a calibration target, not a free reward for merely matching tail count.
    obj=(abs(sr-target['loo_slide_rate'])/max(1,target['loo_slide_rate'])+
         .50*abs(cal['mean_bias'])/max(1,target['loo_mean_mae'])+
         .20*abs(cal['mean_abs_center_error']-target['loo_mean_mae'])/max(1,target['loo_mean_mae']))
    rows.append({'lambda':lam,'tail':tail,'shift':shift,'runs':a.runs,'center_mae':cal['mean_abs_center_error'],'bias':cal['mean_bias'],'slide_rate':sr,'invalid':len(invalid),'objective':obj})
 best=min(rows,key=lambda x:x['objective'])
 # Robustness: shortlist must not rely on one seed. Re-run five independent seeds at larger aggregate N.
 finalists=sorted(rows,key=lambda x:x['objective'])[:5];rob=[]
 for j,r in enumerate(finalists):
  vals=[]
  for k in range(5):
   m.market_weight=weight_factory(r['lambda'],r['tail'],r['shift']);s,sl,inv=m.simulate(stats,data,max(100,a.runs),390000+j*10+k,'auto',False);c=m.calibration(stats,s)
   vals.append({'mae':c['mean_abs_center_error'],'bias':c['mean_bias'],'slide_rate':len(sl)/max(100,a.runs),'invalid':len(inv)})
  agg={x:statistics.mean(v[x] for v in vals) for x in ['mae','bias','slide_rate','invalid']}
  agg.update({q:r[q] for q in ['lambda','tail','shift']});agg['objective']=abs(agg['slide_rate']-target['loo_slide_rate'])/max(1,target['loo_slide_rate'])+.50*abs(agg['bias'])/max(1,target['loo_mean_mae'])+.20*abs(agg['mae']-target['loo_mean_mae'])/max(1,target['loo_mean_mae']);rob.append(agg)
 robust_best=min(rob,key=lambda x:x['objective'])
 report={'schema':'draft-companion.manager-mock-v2.grid.v2','errors':errors,'target':target,'rows':rows,'best_single_seed':best,'robustness':rob,'best_robust':robust_best,'gate':{'geometry_pass':all(r['invalid']==0 for r in rows) and all(r['invalid']==0 for r in rob),'research_only':True}}
 Path(a.out).write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
 assert report['gate']['geometry_pass']
if __name__=='__main__':main()
