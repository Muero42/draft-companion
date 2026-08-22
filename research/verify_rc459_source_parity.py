#!/usr/bin/env python3
import hashlib,json,pathlib,re
EXPECTED={
'simCandidateWeight':'41f03730d268b68c0cb89f3dc89fa97b5b2b061ab0eb5646cf98809e84753f4e',
'simulateReturnV2':'f0c812ff20b4cb4558c9c186869189bcdb9ca837ac5ff764d20a98530d38a8cc',
'scoreCandidate':'489b94cdc75aeb70b12c6c81a4a99aedb38eba04e3a4132dcaee2c1bd66de207',
'applyResolvedReturnScore':'0d24f8f83a0a3a07faac263eb98d4c3d1090b940591e335b1a59153ee66198cd',
'applyPlayerQualitySafetyGate':'fada37d249940322e08f3466f358009b0af3ef732c69ec8c4a29706db2cf0c99',
'managerHistoryPosMult':'75b0932d589020c8db8fadec9383009ae96b3ea3dfa1ae48985fdf9649346611',
'candidateManagerMod':'669f31609238e2095d08208adedc186c14c578d3cb518c65a8692a0cd121cd3f',
'specialPositionHazard':'fff67a6125266ad042a88b5b64dcd2ebaa2571ee5a62cfd49ab2f28a8560fb4a',
'rosterState':'1c6b091689cfcc884d0b407e16f4be6c8d4fd25cfbd50eec380c04275181a77a'}
APP_EXPECTED='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3'
MANAGER_EXPECTED='c5f601051850185b81801aaaa3efe554d9214f6cfa15999a0beec6cb0b192493'
s=pathlib.Path('app.js').read_text(encoding='utf-8')

def function_source(name):
    start=s.index('function '+name);i=s.index('{',start);depth=0;state='code';quote=None;esc=False;j=i
    while j<len(s):
        c=s[j];n=s[j+1] if j+1<len(s) else ''
        if state=='code':
            if c=='/' and n=='/':state='line';j+=2;continue
            if c=='/' and n=='*':state='block';j+=2;continue
            if c in "'\"`":quote=c;state='str';j+=1;continue
            if c=='{':depth+=1
            elif c=='}':
                depth-=1
                if depth==0:return s[start:j+1]
        elif state=='line':
            if c=='\n':state='code'
        elif state=='block':
            if c=='*' and n=='/':state='code';j+=2;continue
        else:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c==quote:state='code'
        j+=1
    raise RuntimeError('unclosed function '+name)
actual={n:hashlib.sha256(function_source(n).encode()).hexdigest() for n in EXPECTED}
hm=re.search(r"const MANAGER_PROFILE_SOURCE_HASH='([^']+)'",s)
checks={n:(actual[n]==h) for n,h in EXPECTED.items()}
checks['manager_profile_source_hash']=bool(hm and hm.group(1)==MANAGER_EXPECTED)
# Whole app hash is diagnostic only because the research branch intentionally carries an
# older surrounding runtime shell. Function hashes + manager payload hash are the parity gate.
app_hash=hashlib.sha256(s.encode()).hexdigest()
status='PASS' if all(checks.values()) else 'FAIL_CLOSED'
out={'schema':1,'status':status,'expected_numbered_rc459_app_sha256':APP_EXPECTED,'research_branch_app_sha256':app_hash,
     'whole_app_equal':app_hash==APP_EXPECTED,'manager_profile_hash':hm.group(1) if hm else None,'checks':checks,
     'function_sha256':actual,'expected_function_sha256':EXPECTED,
     'interpretation':'PASS permits research harnesses to reuse these exact verified functions/data from branch app.js; it does not assert whole-runtime rc4.59 identity.'}
pathlib.Path('RC459_SOURCE_FUNCTION_PARITY.json').write_text(json.dumps(out,indent=2))
print(json.dumps(out,indent=2))
if status!='PASS':raise SystemExit(2)
