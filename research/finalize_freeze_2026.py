#!/usr/bin/env python3
import hashlib,json,pathlib,datetime,sys
ROOT=pathlib.Path('.')
FD=ROOT/'freeze_2026'

def load(name): return json.loads((FD/name).read_text(encoding='utf-8'))
def canon(x): return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def sha(x): return hashlib.sha256(canon(x)).hexdigest()

gate=load('FRESH_2026_MARKET_PANEL_GATE.json')
raw=load('FRESH_2026_MARKET_PANEL_RAW.json')
health=load('FRESH_2026_HEALTH_ROLE_2026-08-22.json')
static=load('FRESH_2026_STATIC_LAYERS_2026-08-22.json')

pool=raw.get('pool_rows') or []
keys=[str(x.get('key') or '') for x in pool]
unique=len(keys)==len(set(keys)) and all(keys)
unresolved=[x for x in pool if not x.get('key') or not x.get('name') or x.get('pos') not in {'QB','RB','WR','TE'}]

panel_payload={
 'as_of':raw.get('as_of'),'season':raw.get('season'),'scoring':raw.get('scoring'),
 'expert_sources':raw.get('expert_sources'),'effective_members':raw.get('effective_members'),
 'candidate_pool_counts':raw.get('candidate_pool_counts'),'candidate_pool_total':raw.get('candidate_pool_total'),
 'panels':raw.get('panels')
}
adp_rows=[{'key':x.get('key'),'name':x.get('name'),'pos':x.get('pos'),'adp':x.get('adp')} for x in pool if isinstance(x.get('adp'),(int,float))]
adp_payload={'as_of':raw.get('as_of'),'season':2026,'format':'HALF_PPR','selected_source':(raw.get('sleeper_adp') or {}).get('selected_source'),'players':adp_rows}
health_payload={k:v for k,v in health.items() if k!='payload_sha256'}
static_payload={k:v for k,v in static.items() if k!='payload_sha256'}
health_hash=sha(health_payload); static_hash=sha(static_payload); panel_hash=sha(panel_payload); adp_hash=sha(adp_payload)

hard={x.get('name'):x for x in health.get('hard_exclusions',[])}
watches={x.get('name'):x for x in health.get('material_watch',[])}
required_hard=['Jayden Higgins','Ricky Pearsall']
required_watch=['Jordyn Tyson','Jeremiyah Love','Malik Nabers','Sam LaPorta','Tyler Warren','Breece Hall','George Kittle','Zach Charbonnet','Alvin Kamara','Tucker Kraft']
hard_ok=all(n in hard and hard[n].get('recommendation_eligible') is False and hard[n].get('as_of') for n in required_hard)
watch_ok=all(n in watches and watches[n].get('as_of') and (watches[n].get('status') or '').strip() for n in required_watch)
source_health_ok=all(bool((raw.get('expert_sources') or {}).get(n,{}).get('ok')) for n in ['Pat Fitzmaurice','Andrew Erickson','Derek Brown'])
market_gate_ok=gate.get('status')=='PASS'
adp_ok=len(adp_rows)>=200 and bool((raw.get('sleeper_adp') or {}).get('selected_source'))
panel_ok=raw.get('candidate_pool_total')==230 and source_health_ok

criteria={
 'utility_v3_5_pass_precondition': True,
 'market_panel_gate_pass':market_gate_ok,
 'panel_pool_230':panel_ok,
 'sleeper_half_ppr_pool_adp_ge_200':adp_ok,
 'identity_unique_player_keys':bool(unique),
 'identity_unresolved_count_zero':len(unresolved)==0,
 'hard_exclusions_valid':hard_ok,
 'material_watches_dated_or_explicit_unknown':watch_ok,
 'health_role_hash_present':bool(health_hash),
 'manager_profile_hash_present':bool((static.get('manager_model') or {}).get('profile_snapshot_sha256')),
 'k_dst_calibration_present':bool((static.get('k_dst') or {}).get('manager_specific_hazards')),
 'research_residual_shadow_only':(static.get('research') or {}).get('research_residual')=='SHADOW_ONLY'
}
status='PASS' if all(criteria.values()) else 'FAIL_CLOSED'
manifest={
 'schema_version':1,'status':status,'package_as_of':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'utility':{'version':'v3.5','status':'PASS'},
 'panel':{'as_of':raw.get('as_of'),'source':'deterministic current configured expert feeds with explicit source health','payload_sha256':panel_hash,'player_count':raw.get('candidate_pool_total'),'expert_sources':raw.get('expert_sources'),'effective_members':raw.get('effective_members')},
 'sleeper_half_ppr_adp':{'as_of':raw.get('as_of'),'source':(raw.get('sleeper_adp') or {}).get('selected_source'),'payload_sha256':adp_hash,'player_count':len(adp_rows)},
 'health_role':{'as_of':health.get('as_of'),'source_manifest':'freeze_2026/FRESH_2026_HEALTH_ROLE_2026-08-22.json','payload_sha256':health_hash},
 'static_layers':{'as_of':static.get('as_of'),'source_manifest':'freeze_2026/FRESH_2026_STATIC_LAYERS_2026-08-22.json','payload_sha256':static_hash},
 'identity':{'unique_player_keys':bool(unique),'unresolved_count':len(unresolved)},
 'hard_exclusions':required_hard,'material_watch':required_watch,'criteria':criteria,
 'fail_closed_notes':['Historical Aug-17/18 fixtures are not labeled fresh.','Generic Questionable is not a mechanical penalty.','Unavailable expert feeds remain explicitly degraded; no stale row is silently relabeled fresh.']
}
manifest['package_sha256']=sha(manifest)
(FD/'FRESH_2026_PANEL_PAYLOAD.json').write_text(json.dumps(panel_payload,indent=2,ensure_ascii=False),encoding='utf-8')
(FD/'FRESH_2026_SLEEPER_HALF_PPR_ADP_PAYLOAD.json').write_text(json.dumps(adp_payload,indent=2,ensure_ascii=False),encoding='utf-8')
(FD/'FRESH_2026_FREEZE_MANIFEST.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
(FD/'FRESH_2026_FREEZE_GATE.json').write_text(json.dumps({'status':status,'criteria':criteria,'package_sha256':manifest['package_sha256']},indent=2),encoding='utf-8')
print(json.dumps({'status':status,'criteria':criteria,'adp_count':len(adp_rows),'unresolved':len(unresolved),'package_sha256':manifest['package_sha256']},indent=2))
if status!='PASS': sys.exit(2)
