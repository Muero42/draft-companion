#!/usr/bin/env python3
"""Broaden the rc4.59 source lock to the transitive named decision graph.

Builds on the already-PASS 40-function gate and adds every named function reached
from the production roots plus norm/clamp and the manager qualitative/data literals.
"""
import hashlib,json,pathlib,re
BASE='diagnostics_2026/RC459_FULL_POLICY_SOURCE_PARITY_2026.json'
MANAGER_HASH='c5f601051850185b81801aaaa3efe554d9214f6cfa15999a0beec6cb0b192493'
APP_SHA='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3'
EXTRA={
'actionableResearchEvents':'5b42455e45b6a54b819a96e4d137c197b8606a36b9048087a9bf9636c79b282d',
'liveManagerStateForProfile':'03623fce0bfbd88182bfe3d725183307cd91edf2ffaf6fa02fb393ca4c462e8a',
'loadResearchEvents':'ceaee2cc849ba664d9490bdfa94c9591f0d69aa76d36c3c46280b74f4783220e',
'managerPhase':'072a658fd8eac3cbd3d77cbcc75cb503831b96b02b0fdcd35cb8f90e3ee23bcf',
'panelFor':'10796cdc3737ef55bb69851eb72c14ec8c23f16a704ce5f684669a4f26fea096',
'panelHasVerifiedExperts':'7e7508d9b9ccfb45813a4f2fc95c5bafc359cccab9a5c0a3f40ae496b44da3d2',
'pinfo':'902793b45f9ca2b98048c0394d0f23f150c56e204f80e69c1f8a5c6f86aaf681',
'researchCacheKey':'e5184e36fc7a308d4b67ec5f7334909f31d8bba03fab6bfcc0e11c20023c0380',
'researchEventsAt':'b4f6d26f11f4b71d2360b0998beed6a48ccccbcedc43a8e26caf824132000443',
'researchPlayerState':'1f4a869e5c70a1170511cb081a7159f7bd7882a9a04679c897c5240ab10304fe',
'researchPricingFactor':'a46e917191349c7b2543d8e872fa19df8577c8aa0c87a079daa897490731760e',
'researchResidualCap':'168a33a4582ce283b128dffcfb03ee6c885fdeeebeb74d61120066c3e698cf74',
'specialPositionHazard':'fff67a6125266ad042a88b5b64dcd2ebaa2571ee5a62cfd49ab2f28a8560fb4a',
'structuredResidualComponents':'c3014762e250bd3b6658dbe321b56a3466d1f63e1f99708651a7f7572f62772e',
'const:norm':'e77c4331087e612dc883c8aafe46ca62eb9476c0ddb511e54cca2be375669fce',
'const:clamp':'6326e1336c861e50d6a39810e7a14ca7fffb494b08844616747cda29f8041090',
'const:MANAGER_PROFILES':'c1e912d559c59ab0aab5b389498d7c232ae73f792541ac0b7a21e40ab8447cef',
'const:MANAGER_PROFILE_DATA':'ed6ea9d6df58d12f1269b3fbc540945611519db9ea72efed57a020092e21fb6f'}

def fn(s,n):
 st=s.find('function '+n+'(')
 if st<0:return None
 d=0;seen=False
 for i in range(st,len(s)):
  if s[i]=='{':d+=1;seen=True
  elif s[i]=='}' and seen:
   d-=1
   if d==0:return s[st:i+1]
 return None

def const(s,n):
 if n in {'norm','clamp'}:
  m=re.search(r'^const '+re.escape(n)+r'=.*?;$',s,re.M);return m.group(0) if m else None
 if n=='MANAGER_PROFILES':
  st=s.find('const MANAGER_PROFILES=');en=s.find('\nconst MANAGER_PROFILE_DATA=',st);return s[st:en] if st>=0<en else None
 if n=='MANAGER_PROFILE_DATA':
  st=s.find('const MANAGER_PROFILE_DATA=');en=s.find('\nconst MANAGER_PROFILE_SOURCE_HASH=',st);return s[st:en] if st>=0<en else None
 return None

def main():
 base=json.load(open(BASE));assert base['status']=='PASS'
 expected=dict(base['expected_function_sha256']);expected.update(EXTRA)
 s=pathlib.Path('app.js').read_text(encoding='utf-8');actual={};missing=[];mismatch=[]
 for k,want in expected.items():
  src=const(s,k.split(':',1)[1]) if k.startswith('const:') else fn(s,k)
  if src is None:missing.append(k);continue
  got=hashlib.sha256(src.encode()).hexdigest();actual[k]=got
  if got!=want:mismatch.append({'name':k,'expected':want,'actual':got})
 hm=re.search(r"const MANAGER_PROFILE_SOURCE_HASH='([^']+)'",s);manager=hm.group(1) if hm else None
 ok=not missing and not mismatch and manager==MANAGER_HASH
 out={'schema':1,'status':'PASS' if ok else 'FAIL_CLOSED','numbered_rc459_app_sha256':APP_SHA,
      'scope':'58 source items: prior 40-function PASS plus transitive named dependencies, norm/clamp, MANAGER_PROFILES and MANAGER_PROFILE_DATA',
      'source_item_count':len(expected),'matching_count':sum(actual.get(k)==v for k,v in expected.items()),'missing':missing,'mismatch':mismatch,
      'manager_profile_expected':MANAGER_HASH,'manager_profile_actual':manager,
      'interpretation':'PASS source-locks the broader transitive decision dependency graph. Dynamic fixture/input equivalence, explicit fresh health-scenario integration and policy superiority remain separate gates.',
      'expected_sha256':expected,'actual_sha256':actual}
 pathlib.Path('RC459_TRANSITIVE_POLICY_SOURCE_PARITY_2026.json').write_text(json.dumps(out,indent=2))
 keys=['status','numbered_rc459_app_sha256','scope','source_item_count','matching_count','missing','mismatch','manager_profile_expected','manager_profile_actual','interpretation']
 pathlib.Path('RC459_TRANSITIVE_POLICY_SOURCE_PARITY_2026_GATE.json').write_text(json.dumps({k:out[k] for k in keys},indent=2))
 print(json.dumps({k:out[k] for k in ['status','source_item_count','matching_count','missing','mismatch']},indent=2))
 if not ok:raise SystemExit(2)
if __name__=='__main__':main()
