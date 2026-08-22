#!/usr/bin/env python3
"""Strict rc4.59 profiled BASELINE opponent-kernel run.

Imports the phase-1 kernel implementation but deliberately executes only the
PROFILED/baseline cell, for which every scored opponent component implemented
there maps to the verified rc4.59 equations. This avoids treating the exploratory
temperature-only stress control as an exact named rc4.59 stress regime.
"""
import json, pathlib, sys
import research.rc459_opponent_kernel_sim_2026 as k

runs=int(sys.argv[1]) if len(sys.argv)>1 else 2500
gate,players,k.MANAGER_DATA,mhash=k.load()
cell=k.summarize(players,runs,True,'baseline',45959000)
out={'schema':1,'status':'PASS' if cell['split_half_max_top50_availability_delta']<=.07 else 'FAIL_CLOSED',
     'freeze_package_sha256':gate['package_sha256'],'runs':runs,'cell':cell,
     'policy_ranking_certified':False,
     'scope':'rc4.59 PROFILED BASELINE opponent-kernel parity; neutral user selected-panel control; not Coach-policy parity',
     'rc459_numbered_artifact_app_sha256':k.EXPECTED_RC459_APP_SHA,
     'manager_profile_source_hash':mhash}
# Compare with existing 36k robust means using the same helper shape.
tmp={'cells':{'PROFILED|baseline':cell}}
out['comparison_vs_36k_robust_mean']=k.compare_to_36k(tmp)
pathlib.Path('RC459_OPPONENT_KERNEL_BASELINE_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
pathlib.Path('RC459_OPPONENT_KERNEL_BASELINE_2026_GATE.json').write_text(json.dumps({x:out[x] for x in ['status','freeze_package_sha256','runs','policy_ranking_certified','scope','rc459_numbered_artifact_app_sha256','manager_profile_source_hash']},indent=2))
print(json.dumps({'status':out['status'],'runs':runs,'split_half':cell['split_half_max_top50_availability_delta'],'mean_kdst':cell['mean_opponent_kdst']},indent=2))
