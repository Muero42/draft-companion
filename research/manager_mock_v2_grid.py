#!/usr/bin/env python3
"""Small research-only grid to interpolate density and sequential-hazard market models."""
import argparse,json,math,statistics
from pathlib import Path
import manager_mock_v2 as m

def density_log(st,pn):
 scale=max(3.0,st.sd*1.08*(1+.12*max(0,4-st.n)))
 z=(pn-st.mean)/scale
 x=-.5*z*z
 guard=st.mean+max(8,1.75*st.sd)
 if pn>guard:x+=math.log(1+min(3.5,(pn-guard)/max(3,scale)*.9))
 return x

def hazard_log(st,pn):
 tau=2.2 if pn<=30 else 5.0 if pn<=80 else 9.0
 scale=max(tau,st.sd*.58*(1+.10*max(0,4-st.n)),1.5)
 x=max(-8,min(3.5,(pn-st.mean)/scale))
 guard=st.mean+max(7,1.70*st.sd)
 if pn>guard:x+=math.log(1+min(4,(pn-guard)/max(3,scale)*1.4))
 return x

def weight_factory(lam):
 def f(st,pn):
  logw=(1-lam)*density_log(st,pn)+lam*hazard_log(st,pn)
  w=math.exp(max(-12,min(8,logw)))
  if st.source=='user_tail':w*=.20
  return max(1e-10,w)
 return f

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--app',default='app.js');ap.add_argument('--runs',type=int,default=30);ap.add_argument('--out',default='manager_mock_v2_grid.json');a=ap.parse_args()
 drafts,errors=m.collect(m.DEFAULT_DRAFT_IDS);stats,_=m.build_empirical(drafts);data=m.load_profiles(Path(a.app));loo=m.loo_metrics(drafts)
 empirical_slide=statistics.mean(r['extreme_slide_rate_per_draft'] for r in loo)
 empirical_mae=statistics.mean(r['mae'] for r in loo)
 rows=[]
 for i,lam in enumerate([0,.05,.10,.15,.20,.25,.35]):
  m.market_weight=weight_factory(lam)
  s,slides,invalid=m.simulate(stats,data,a.runs,270000+i,'auto',False)
  cal=m.calibration(stats,s)
  rows.append({'lambda':lam,'runs':a.runs,'center_mae':cal['mean_abs_center_error'],'bias':cal['mean_bias'],'slide_rate':len(slides)/a.runs,'invalid':len(invalid)})
 target={'loo_mean_mae':empirical_mae,'loo_slide_rate':empirical_slide}
 # Descriptive objective only; selection must still be sanity-checked.
 for r in rows:
  r['objective']=abs(r['slide_rate']-empirical_slide)/max(1,empirical_slide)+0.35*abs(r['bias'])/max(1,empirical_mae)+0.15*abs(r['center_mae']-empirical_mae)/max(1,empirical_mae)
 report={'schema':'draft-companion.manager-mock-v2.grid.v1','target':target,'rows':rows,'best_by_objective':min(rows,key=lambda x:x['objective'])}
 Path(a.out).write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2))
 assert all(r['invalid']==0 for r in rows)
if __name__=='__main__':main()
