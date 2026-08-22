#!/usr/bin/env python3
"""Independent market-outcome challenger for exact rc4.59 dynamic Coach decisions.

This is deliberately not a policy certification. It asks whether the selected Coach
leader is materially dominated, within the same locally viable top-10 set, by an OOS-
validated historical Sleeper ADP -> realized Half-PPR outcome forecast that never used
the selected 2026 panel in fitting.
"""
import json,pathlib,re,statistics,math

def norm(s):return re.sub(r'[^a-z0-9]','',str(s).lower())

def main():
 d=json.load(open('diagnostics_2026/RC459_DYNAMIC_COACH_EXECUTION_2026.json'));b=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
 assert d['status']=='PASS' and b['status']=='PASS' and b['criteria']['selected_panel_not_used_in_fit']
 fc=b['forecasts'];rows=[]
 for f in d['fixtures']:
  cand=[]
  for x in f['top']:
   q=fc.get(norm(x['name']));
   if q:cand.append({**x,'bridge_pred_weekly_mean':round(q['pred_weekly_mean'],4),'bridge_p10':q.get('weekly_sample_p10'),'bridge_p50':q.get('weekly_sample_p50'),'bridge_p90':q.get('weekly_sample_p90')})
  if not cand:continue
  coach=cand[0];best=max(cand,key=lambda x:x['bridge_pred_weekly_mean']);delta=best['bridge_pred_weekly_mean']-coach['bridge_pred_weekly_mean']
  rows.append({'id':f['id'],'current':f['current'],'coach':coach,'bridge_best_in_coach_top10':best,'bridge_mean_delta':round(delta,4),'material_gt_1_weekly_point':delta>1.0})
 material=[x for x in rows if x['material_gt_1_weekly_point']];byturn={}
 for x in rows:
  q=byturn.setdefault(str(x['current']),{'n':0,'material':0,'deltas':[]});q['n']+=1;q['material']+=int(x['material_gt_1_weekly_point']);q['deltas'].append(x['bridge_mean_delta'])
 for q in byturn.values():q['mean_delta']=round(statistics.mean(q.pop('deltas')),4)
 coverage=len(rows)/max(1,len(d['fixtures']));ok=coverage>=.95
 out={'schema':1,'status':'PASS' if ok else 'FAIL_CLOSED','dynamic_gate_status':d['status'],'bridge_gate_status':b['status'],'bridge_selected_panel_used_in_fit':False,'fixture_coverage':round(coverage,4),'fixture_count':len(rows),'material_bridge_dominance_count':len(material),'material_bridge_dominance_rate':round(len(material)/max(1,len(rows)),4),'by_turn':byturn,'interpretation':'Challenger only. A >1.0 predicted weekly-point gap flags a decision for deeper independent review; it does not prove the Coach is wrong because the bridge is market/position based and omits roster/ceiling/health interactions.','policy_ranking_certified':False,'rows':rows}
 pathlib.Path('diagnostics_2026/RC459_DYNAMIC_OUTCOME_CHALLENGER_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False));pathlib.Path('diagnostics_2026/RC459_DYNAMIC_OUTCOME_CHALLENGER_2026_GATE.json').write_text(json.dumps({k:out[k] for k in ['status','dynamic_gate_status','bridge_gate_status','bridge_selected_panel_used_in_fit','fixture_coverage','fixture_count','material_bridge_dominance_count','material_bridge_dominance_rate','by_turn','interpretation','policy_ranking_certified']},indent=2,ensure_ascii=False));print(json.dumps({k:out[k] for k in ['status','fixture_count','material_bridge_dominance_count','material_bridge_dominance_rate','by_turn']},indent=2))
 if not ok:raise SystemExit(2)
if __name__=='__main__':main()
