#!/usr/bin/env python3
"""Research-only OOS calibration for Manager Mock v2 market tails and center bias.

Each CI unit may evaluate one exact grid combination. This preserves the original
100-combination OOS target while removing the 20-simulations-per-job timeout
failure mode and makes every result independently resumable.
"""
import argparse,json,math,statistics
from pathlib import Path
import manager_mock_v2 as m

LAMBDAS=[.15,.20,.25,.30,.35]
TAILS=[.75,1.0,1.25,1.5,2.0]
SHIFTS=[0.0,1.0,2.0,3.0]
COMBOS=[(lam,tail,shift) for lam in LAMBDAS for tail in TAILS for shift in SHIFTS]

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
 return {'loo_mean_mae':statistics.mean(r['mae'] for r in loo),'loo_slide_rate':statistics.mean(r['extreme_slide_rate_per_draft'] for r in loo),'loo':loo}

def evaluate(stats,data,target,i,runs):
 lam,tail,shift=COMBOS[i]
 m.market_weight=weight_factory(lam,tail,shift)
 s,slides,invalid=m.simulate(stats,data,runs,280000+i+1,'auto',False)
 cal=m.calibration(stats,s);sr=len(slides)/runs
 obj=(abs(sr-target['loo_slide_rate'])/max(1,target['loo_slide_rate'])+.50*abs(cal['mean_bias'])/max(1,target['loo_mean_mae'])+.20*abs(cal['mean_abs_center_error']-target['loo_mean_mae'])/max(1,target['loo_mean_mae']))
 return {'combo_index':i,'lambda':lam,'tail':tail,'shift':shift,'runs':runs,'center_mae':cal['mean_abs_center_error'],'bias':cal['mean_bias'],'slide_rate':sr,'invalid':len(invalid),'objective':obj}

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--app',default='app.js');ap.add_argument('--runs',type=int,default=300);ap.add_argument('--out',default='manager_mock_v2_grid.json');ap.add_argument('--combo-index',type=int);ap.add_argument('--shard',type=int,default=0);ap.add_argument('--shards',type=int,default=1);a=ap.parse_args()
 if a.combo_index is not None:
  if not 0<=a.combo_index<len(COMBOS):raise SystemExit('invalid combo-index')
  indices=[a.combo_index]
 else:
  if a.shards<1 or not 0<=a.shard<a.shards:raise SystemExit('invalid shard')
  indices=[i for i in range(len(COMBOS)) if i%a.shards==a.shard]
 drafts,errors=m.collect(m.DEFAULT_DRAFT_IDS);stats,_=m.build_empirical(drafts);data=m.load_profiles(Path(a.app));target=empirical_targets(drafts)
 rows=[evaluate(stats,data,target,i,a.runs) for i in indices]
 report={'schema':'draft-companion.manager-mock-v2.grid-unit.v4','errors':errors,'target':target,'combo_indices':indices,'grid_size':len(COMBOS),'rows':rows,'best':min(rows,key=lambda x:x['objective']),'gate':{'geometry_pass':all(r['invalid']==0 for r in rows),'research_only':True}}
 Path(a.out).write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report,indent=2));assert report['gate']['geometry_pass']
if __name__=='__main__':main()
