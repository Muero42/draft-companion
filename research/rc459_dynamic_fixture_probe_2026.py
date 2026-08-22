#!/usr/bin/env python3
import json, pathlib
raw=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'))
panel=json.load(open('freeze_2026/FRESH_2026_PANEL_PAYLOAD.json'))
health=json.load(open('freeze_2026/FRESH_2026_HEALTH_ROLE_2026-08-22.json'))
out={
 'raw_top_keys':sorted(raw.keys()),
 'pool_count':len(raw.get('pool_rows',[])),
 'pool_row_keys':sorted(raw.get('pool_rows',[{}])[0].keys()) if raw.get('pool_rows') else [],
 'pool_samples':raw.get('pool_rows',[])[:3],
 'panel_top_type':type(panel).__name__,
 'panel_top_keys':sorted(panel.keys()) if isinstance(panel,dict) else [],
 'panel_summary':{},
 'health_top_keys':sorted(health.keys()) if isinstance(health,dict) else [],
}
if isinstance(panel,dict):
 for k,v in panel.items():
  if isinstance(v,dict): out['panel_summary'][k]={'type':'dict','keys':sorted(v.keys())[:40],'len':len(v)}
  elif isinstance(v,list): out['panel_summary'][k]={'type':'list','len':len(v),'sample':v[:1]}
  else: out['panel_summary'][k]={'type':type(v).__name__,'value':v if isinstance(v,(str,int,float,bool)) or v is None else None}
pathlib.Path('diagnostics_2026').mkdir(exist_ok=True)
pathlib.Path('diagnostics_2026/RC459_DYNAMIC_FIXTURE_SCHEMA_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
print(json.dumps({'pool_count':out['pool_count'],'pool_row_keys':out['pool_row_keys'],'panel_top_keys':out['panel_top_keys']},indent=2))
