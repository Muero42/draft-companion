#!/usr/bin/env python3
"""Fail-closed source-parity gate for rc4.59 decision dependencies.

Expected hashes were re-extracted directly from the numbered rc4.59 app.js whose
SHA-256 is 1de9c6dc... using literal function start + balanced-brace slicing.
This tests source equality of the named dependency graph, not whole-app equality
and not empirical policy superiority.
"""
import hashlib,json,pathlib,re
APP_SHA='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3'
MANAGER_HASH='c5f601051850185b81801aaaa3efe554d9214f6cfa15999a0beec6cb0b192493'
EXPECTED={
'rankFor':'36ae0516f5ed5e49388794f061a9af1ee02f8880b9144adc89df89e0062c16bc','adpFor':'4602ea92ab931dc0ac7560d2355f0c76e4cbdfc0fe2736332ad9d9c832b7b0f2','simNeedWeight':'727f67181ac17f6cdc36e7c96ede99c5c2d08771501d7d0d6d77fdf4e341fcb1','managerHistoryPosMult':'75b0932d589020c8db8fadec9383009ae96b3ea3dfa1ae48985fdf9649346611','candidateManagerMod':'669f31609238e2095d08208adedc186c14c578d3cb518c65a8692a0cd121cd3f','stressProfile':'2b23298dee6ae9dbe4dae0bf26175ac4b528ea702ffbda0bd76b45ecd2ac3eb3','simCandidateWeight':'41f03730d268b68c0cb89f3dc89fa97b5b2b061ab0eb5646cf98809e84753f4e','rosterBySlot':'f5849cc30d809eaa136c7ab043af92976e1edab41fb13525a5b97fd687e981ca','draftSlotAtPick':'817683789d86e628cd5df35855344e0748b6cb7a39d33e64f87a90b8f0d93c69','slotsBetween':'a039fddabae031a99e69c24e104e8d88c52ce2722b2a4288ee60452bb966a14b','managerProfile':'bd6ed722ff589bd2d7919d53fff05245cc2c08f82d8b557cd9b7b74e0051d5a0','managerProfilesActive':'0ce1f174d2ea5d787c029d57f9c1df2bd36099da89d0a164bdd1b72dd49fb101','seededRng':'e5f7ebbdcec659db324f8d5b810232621f146a292ebdec57283914644b8af4ad','cloneRosters':'907f70e57f7c13f89d5e2ddb90a870aebddb3c14d3c76748f3618e4b6942670a','chooseSpecialTeamPick':'2ac28d8e1e785dc759003a6a97d3e61892d6d33ec52f6cd0c1d5dcc354715741','endgameSkillShare':'8fa3109e8333374c88c9df84f703c7113225c12e2eb830ea2c217d1698579dae','weightedChoice':'d9db88b2bf62d70c6dc10ef7b5559bc634048b012a9b586f1f6184671bec1290','returnV2Confidence':'9bdd97fa6926975f0e2b3560d8c7f47a06d2909d53531b89a6d52076df4a059a','simulateReturnV2':'c8fc1a72adbcc9e728dcfa477f8fe8fff1474336966b32a5793733c1f7c36b0f','progressiveStage':'353e0a4352691ed326f297167fb57bfd461893437647cdda4551e4637fda958b','valueLabel':'2fe8008a0e643dfb41a3ed786532145d0535cc41580ab14c07b763daa2a8be3b','draftPhaseNeedFactor':'3177d8b22ec9b14b37969a0df6938be732e69991ebea2b0fafeba82fb81c77a7','rosterExceptionPenalty':'91093ed2de302326b8e56a69cabde704a1e6a456725abbafc92fa303cfdf1033','lateUpsideBonus':'f0cc07b2d49f9fba68caf563bddfe14bbf7208dd7eaf5ae096c5d56cd218f7b3','progressiveUpsideBonus':'23d38e655eda4c155845e001769b92ca3cdf727282a01401a2af10d85aabb89c','injuryStashAdjustment':'2f8042b080e1fcfdacc7da9b691bca5a805e24049cf5d6851120459e3655136b','marginalRosterUtility':'4e18f562d0c927fefc6d307aa7fd48a98764f9b1482731a7cb82ddca904c48d0','tierContext':'80f66e6d4135c2de8fc0b7628567a180cdb3f55d2fa33223f699832d0e29ef99','positionalAlternativeContext':'641f8414bf8b63d87d3ece52090d16c8b2d5d0391ee3b0b1d9780f31ec537c70','agreement':'50cf82910f981487409d096034c44b3d9df3c06f06a911042932dd278ca04520','researchResidualShadow':'e1bcf69401b98045cbffb3f070745a5ee484774a007471637e50037391e3feec','returnChance':'3b23725add7495fac5baea146c7758afcbf9cec61ec1218d7d8d802c947a5507','bestAvailablePanelRank':'8e52413f026a3984b958e33f179218b496348edd40fcd04eff5888c036df6c41','playerQualityBaseScore':'23e5b27e3944fb7d02d5e1fb9597b5e023301298b663b5ab6c97b1cbb5fa2f79','scoreCandidate':'489b94cdc75aeb70b12c6c81a4a99aedb38eba04e3a4132dcaee2c1bd66de207','applyResolvedReturnScore':'0d24f8f83a0a3a07faac263eb98d4c3d1090b940591e335b1a59153ee66198cd','playerQualitySafetyThreshold':'096074e358615cf5a6b6a89449d42c151f774e5362aecc89ad89f05d25d9dbda','applyPlayerQualitySafetyGate':'fada37d249940322e08f3466f358009b0af3ef732c69ec8c4a29706db2cf0c99','normalizeCoachScores':'2338ec0a68d66a88cd398cde6a3a266e5bd8e19d361f37d25f7f81a50abb415a','rosterState':'1c6b091689cfcc884d0b407e16f4be6c8d4fd25cfbd50eec380c04275181a77a'}

def extract(s,name):
    st=s.find('function '+name+'(')
    if st<0:return None
    depth=0;seen=False
    for i in range(st,len(s)):
        if s[i]=='{':depth+=1;seen=True
        elif s[i]=='}' and seen:
            depth-=1
            if depth==0:return s[st:i+1]
    return None

def main():
    s=pathlib.Path('app.js').read_text(encoding='utf-8')
    hm=re.search(r"const MANAGER_PROFILE_SOURCE_HASH='([^']+)'",s)
    actual={};missing=[];mismatch=[]
    for name,want in EXPECTED.items():
        src=extract(s,name)
        if src is None:missing.append(name);continue
        got=hashlib.sha256(src.encode()).hexdigest();actual[name]=got
        if got!=want:mismatch.append({'name':name,'expected':want,'actual':got})
    manager=hm.group(1) if hm else None
    ok=not missing and not mismatch and manager==MANAGER_HASH
    out={'schema':1,'status':'PASS' if ok else 'FAIL_CLOSED','numbered_rc459_app_sha256':APP_SHA,
         'extraction_method':"literal 'function NAME(' through matching closing brace inclusive, UTF-8 SHA-256",
         'function_count':len(EXPECTED),'matching_function_count':sum(actual.get(k)==v for k,v in EXPECTED.items()),
         'missing':missing,'mismatch':mismatch,'manager_profile_expected':MANAGER_HASH,'manager_profile_actual':manager,
         'whole_app_equal_not_required':True,
         'interpretation':'PASS source-locks the named Coach/Return-v2/opponent/state dependency functions and manager profile hash to the numbered rc4.59 artifact. It does not certify dynamic fixture equivalence, fresh health-scenario integration, or policy superiority.',
         'expected_function_sha256':EXPECTED,'actual_function_sha256':actual}
    pathlib.Path('RC459_FULL_POLICY_SOURCE_PARITY_2026.json').write_text(json.dumps(out,indent=2))
    pathlib.Path('RC459_FULL_POLICY_SOURCE_PARITY_2026_GATE.json').write_text(json.dumps({k:out[k] for k in ['status','numbered_rc459_app_sha256','function_count','matching_function_count','missing','mismatch','manager_profile_expected','manager_profile_actual','whole_app_equal_not_required','interpretation']},indent=2))
    print(json.dumps({k:out[k] for k in ['status','function_count','matching_function_count','missing','mismatch','manager_profile_actual']},indent=2))
    if not ok:raise SystemExit(2)
if __name__=='__main__':main()
