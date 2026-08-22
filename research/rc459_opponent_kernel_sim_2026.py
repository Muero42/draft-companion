#!/usr/bin/env python3
"""Research-only rc4.59 opponent-kernel parity simulation.

Purpose: quantify how much the already-certified 36k market/availability results move
when the opponent draw kernel is changed from the simplified research sampler to
the exact rc4.59 Return-v2 opponent equations that were independently extracted
from Draft_Companion_v11.8.0-rc4.59_FULL_TEST.zip.

This is NOT yet exact Coach-policy parity: the user's own selections remain a
neutral selected-panel policy so opponent/timing effects can be isolated.
No production coefficients are fitted or changed here.
"""
from __future__ import annotations
import collections, hashlib, json, math, pathlib, random, re, statistics, sys, requests

TEAMS=10; USER_SLOT=9
USER_PICKS=[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]
ACTIVE={1:'Michael',2:'Pascal Voerde',3:'Marc Düsseldorf',4:'Thomas',5:'Bjoern',6:'Pascal Gelderner',7:'Giuliano',8:'Basti',10:'Dutch Marc'}
HARD_OUT={'jaydenhiggins','rickypearsall'}
EXPECTED_MANAGER_HASH='c5f601051850185b81801aaaa3efe554d9214f6cfa15999a0beec6cb0b192493'
EXPECTED_RC459_APP_SHA='1de9c6dcbd39bec35dffd2b43575260da6601abf3a9a29fe329ffeb8a4065fa3'
# Qualitative traits copied from exact rc4.59. knownNames/unconventional are intentionally
# retained as evidence but, matching candidateManagerMod(), are not auto-scored.
TRAITS={
 'Basti':{'rookieRB':.18,'bears':.06,'lateReach':.12,'bearsTargets':.08},
 'Michael':{'knownNames':.10,'rookie':-.10},
 'Pascal Voerde':{'unconventional':.05},
 'Dutch Marc':{},
 'Pascal Gelderner':{'waitQBTE':.07,'wrEarly':.05,'unconventional':.05},
 'Thomas':{},'Giuliano':{},'Bjoern':{'recentEarlyRB':.08},'Marc Düsseldorf':{}
}

def norm(s):
    s=str(s or '').lower().replace('’',"'").replace('é','e').replace('ö','o').replace('ü','u').replace('ä','a')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\.?\b','',s)
    return re.sub(r'[^a-z0-9]+','',s)
def clamp(x,a,b):return max(a,min(b,x))
def slot_at_pick(p):
    r=(p-1)//10+1; w=(p-1)%10+1
    return w if r%2 else 11-w
def phase(p):
    r=(p-1)//10+1
    return 'early' if r<=3 else 'mid1' if r<=6 else 'mid2' if r<=9 else 'late' if r<=12 else 'end'
def weighted_pick(rng,items,weights):
    total=sum(weights);x=rng.random()*total
    for item,w in zip(items,weights):
        x-=w
        if x<=0:return item
    return items[-1]

def parse_manager_data():
    txt=pathlib.Path('app.js').read_text(encoding='utf-8')
    m=re.search(r'const MANAGER_PROFILE_DATA=(\{.*?\});\nconst MANAGER_PROFILE_SOURCE_HASH=',txt,re.S)
    hm=re.search(r"const MANAGER_PROFILE_SOURCE_HASH='([^']+)'",txt)
    if not m or not hm:raise RuntimeError('manager profile payload/hash missing from app.js')
    if hm.group(1)!=EXPECTED_MANAGER_HASH:raise RuntimeError(f'manager profile hash mismatch {hm.group(1)}')
    return json.loads(m.group(1)),hm.group(1)

def sleeper_metadata():
    try:
        r=requests.get('https://api.sleeper.app/v1/players/nfl',timeout=45,headers={'User-Agent':'PITTI-rc459-kernel/1.0'});r.raise_for_status();raw=r.json()
    except Exception:
        return {}
    out={}
    for p in raw.values():
        name=p.get('full_name') or ' '.join(x for x in [p.get('first_name'),p.get('last_name')] if x)
        if not name:continue
        try:ye=int(p.get('years_exp')) if p.get('years_exp') is not None else None
        except Exception:ye=None
        out[norm(name)]={'team':str(p.get('team') or ''),'years_exp':ye}
    return out

def load():
    gate=json.load(open('freeze_2026/FRESH_2026_FREEZE_GATE.json'))
    simgate=json.load(open('simulation_2026/SIMULATION_2026_REALISTIC_GATE.json'))
    if gate.get('status')!='PASS' or simgate.get('status')!='PASS' or simgate.get('total_full_drafts')!=36000:raise RuntimeError('preconditions not PASS/36k')
    if gate.get('package_sha256')!=simgate.get('freeze_package_sha256'):raise RuntimeError('freeze hash mismatch')
    raw=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'));meta=sleeper_metadata();managers,mhash=parse_manager_data()
    players={}
    for x in raw['pool_rows']:
        if x.get('pos') not in {'QB','RB','WR','TE'}:continue
        k=str(x['key']);panel=x.get('panel_position') if isinstance(x.get('panel_position'),(int,float)) else x.get('panel_standard')
        std=x.get('panel_standard') if isinstance(x.get('panel_standard'),(int,float)) else panel
        adp=x.get('adp') if isinstance(x.get('adp'),(int,float)) else std
        if not all(isinstance(v,(int,float)) for v in [panel,std,adp]):continue
        md=meta.get(norm(x['name']),{})
        players[k]={'key':k,'name':x['name'],'pos':x['pos'],'panel':float(panel),'std':float(std),'adp':float(adp),'team':md.get('team',''),'years_exp':md.get('years_exp')}
    players={k:v for k,v in players.items() if norm(v['name']) not in HARD_OUT}
    if len(players)<225:raise RuntimeError(f'pool too small {len(players)}')
    return gate,players,managers,mhash

def hist_name(name):
    return {'Bjoern':'Bjoern','Marc Düsseldorf':'Marc Düsseldorf','Dutch Marc':'Dutch Marc'}.get(name,name)

def manager_history_mult(manager_data,name,pos,pn):
    h=manager_data.get('profiles',{}).get(hist_name(name));
    if not h:return 1.0
    ph=phase(pn);own=float(h.get('phaseShares',{}).get(ph,{}).get(pos,0) or 0);league=float(manager_data.get('leaguePhaseShares',{}).get(ph,{}).get(pos,0) or 0)
    if league<=0:return 1.0
    shrink=clamp(float(h.get('sampleYears',0) or 0)/8,.25,.8)
    return clamp(1+(own/league-1)*shrink,.55,1.85)

def trait_mult(name,p,pn):
    t=TRAITS.get(name,{}) or {};delta=0.0;rookie=(p.get('years_exp')==0)
    if t.get('rookie') and rookie:delta+=t['rookie']
    if t.get('rookieRB') and rookie and p['pos']=='RB':delta+=t['rookieRB']
    if t.get('bears') and p.get('team')=='CHI':delta+=t['bears']
    if t.get('bearsTargets') and norm(p['name']) in {norm('Caleb Williams'),norm('Colston Loveland')}:delta+=t['bearsTargets']
    if t.get('wrEarly') and p['pos']=='WR' and pn<=60:delta+=t['wrEarly']
    if t.get('recentEarlyRB') and p['pos']=='RB' and pn<=50:delta+=t['recentEarlyRB']
    if t.get('lateReach') and pn>=81:delta+=t['lateReach']
    if t.get('waitQBTE') and p['pos'] in {'QB','TE'} and pn<100:delta-=t['waitQBTE']
    return max(.65,1+clamp(delta,-.25,.25))

def need_weight(pos,c):
    if pos=='QB':return 1.15 if c['QB']==0 else .18 if c['QB']==1 else .03
    if pos=='TE':return 1.10 if c['TE']==0 else .20 if c['TE']==1 else .04
    if pos=='RB':return 1.12 if c['RB']<2 else .92 if c['RB']<4 else .58
    if pos=='WR':return 1.10 if c['WR']<3 else .94 if c['WR']<5 else .62
    return .2

def special_hazard(manager_data,name,pos,pn):
    d=manager_data.get('profiles',{}).get(hist_name(name),{}).get('positions',{}).get(pos)
    if not d or not isinstance(d.get('firstRound'),(int,float)) or not (float(d.get('recentTaken',0) or 0)>0):return 0.0
    rnd=(pn-1)/10+1;sd=max(1.15,float(d.get('firstRoundSd',1.8) or 1.8));scale=max(.8,sd*.72);take=clamp(float(d.get('recentTaken',0)),0,1)
    logistic=lambda z:1/(1+math.exp(-z))
    f=take*logistic((rnd-float(d['firstRound']))/scale);prev=take*logistic(((rnd-1)-float(d['firstRound']))/scale)
    h=clamp((f-prev)/max(.06,1-prev),0,.62)
    if rnd>=14:
        floor=.78 if take>=.9 and rnd>=15 else .38 if take>=.9 else .42 if take>=.7 and rnd>=15 else .16 if take>=.7 else 0
        h=max(h,floor)
    return clamp(h,0,.85)

def choose_special(rng,manager_data,name,c,pn):
    hk=special_hazard(manager_data,name,'K',pn) if c['K']==0 else 0;hd=special_hazard(manager_data,name,'DEF',pn) if c['DEF']==0 else 0
    anyp=1-(1-hk)*(1-hd)
    if rng.random()>=anyp:return None
    if hk<=0:return 'DEF'
    if hd<=0:return 'K'
    return 'K' if rng.random()<hk/(hk+hd) else 'DEF'

def candidate_weight(p,pn,c,name,stress='baseline'):
    center=.90*p['adp']+.10*p['panel'];tau=(1.35 if pn<=30 else 4.5 if pn<=80 else 7.5)*(1 if stress=='baseline' else 1.18)
    # Exact rc4.59 exponent orientation, including clamp.
    w=math.exp(clamp((pn-center)/tau,-9,3.8))*need_weight(p['pos'],c)
    if name:
        w*=manager_history_mult(MANAGER_DATA,name,p['pos'],pn);w*=trait_mult(name,p,pn)
    return max(.00005,w)

def neutral_user_pick(board,roster,pn):
    # Neutral control isolates opponent kernel. Soft anti-duplicate-position guard only.
    c=roster
    def score(p):
        s=p['panel']
        if p['pos']=='QB' and c['QB']>=1:s+=10
        if p['pos']=='TE' and c['TE']>=1:s+=8
        if p['pos']=='WR' and c['WR']>=6:s+=2.5
        if p['pos']=='RB' and c['RB']>=6:s+=2
        return (s,p['panel'],p['adp'])
    return min(board,key=score)

def one(players,seed,profiled=True,stress='baseline'):
    rng=random.Random(seed);avail=set(players);rost={s:collections.Counter({'QB':0,'RB':0,'WR':0,'TE':0,'K':0,'DEF':0}) for s in range(1,11)};pre={};sels=[];special=0
    for pn in range(1,151):
        slot=slot_at_pick(pn);pool=sorted((players[k] for k in avail),key=lambda p:(p['panel'],p['adp']))
        if not pool:raise AssertionError('empty pool')
        if slot==USER_SLOT:
            pre[pn]=set(avail);chosen=neutral_user_pick(pool[:70],rost[slot],pn);sels.append((pn,chosen['key']))
        else:
            name=ACTIVE[slot] if profiled else None
            sp=choose_special(rng,MANAGER_DATA,name,rost[slot],pn) if name else None
            if sp:
                rost[slot][sp]+=1;special+=1;continue
            board=pool[:70];weights=[candidate_weight(p,pn,rost[slot],name,stress) for p in board];chosen=weighted_pick(rng,board,weights)
        if chosen['key'] not in avail:raise AssertionError('state')
        avail.remove(chosen['key']);rost[slot][chosen['pos']]+=1
    return pre,sels,special

def summarize(players,runs,profiled,stress,seedbase):
    av={p:collections.Counter() for p in USER_PICKS};sel={p:collections.Counter() for p in USER_PICKS};spec=[];halves=[{p:collections.Counter() for p in USER_PICKS},{p:collections.Counter() for p in USER_PICKS}]
    for i in range(runs):
        pre,sels,sp=one(players,seedbase+i,profiled,stress);spec.append(sp);h=0 if i<runs//2 else 1
        for pn,a in pre.items():
            for k in a:av[pn][k]+=1;halves[h][pn][k]+=1
        for pn,k in sels:sel[pn][k]+=1
    top50=set(k for k,_ in sorted(players.items(),key=lambda kv:kv[1]['panel'])[:50]);n0=max(1,runs//2);n1=max(1,runs-n0);mx=0
    for pn in USER_PICKS:
        for k in top50:mx=max(mx,abs(halves[0][pn][k]/n0-halves[1][pn][k]/n1))
    def top_av(pn):
        rows=[]
        for k,c in av[pn].items():
            if c/runs<.03:continue
            p=players[k];rows.append({'name':p['name'],'pos':p['pos'],'panel':round(p['panel'],2),'adp':round(p['adp'],2),'availability':round(c/runs,4)})
        rows.sort(key=lambda r:(r['panel'],-r['availability']));return rows[:25]
    return {'runs':runs,'profiled':profiled,'stress':stress,'mean_opponent_kdst':round(statistics.mean(spec),3),'split_half_max_top50_availability_delta':round(mx,4),
            'availability':{str(p):top_av(p) for p in USER_PICKS},'selection':{str(p):[{'name':players[k]['name'],'pos':players[k]['pos'],'rate':round(c/runs,4)} for k,c in sel[p].most_common(12)] for p in USER_PICKS}}

def compare_to_36k(out):
    old=json.load(open('simulation_2026/SIMULATION_2026_ROBUST_SUMMARY.json'));comp={}
    exact=out['cells']['PROFILED|baseline']
    for pn in USER_PICKS:
        oldm={r['name']:r for r in old['availability'].get(str(pn),[])};newm={r['name']:r for r in exact['availability'].get(str(pn),[])};rows=[]
        for name in set(oldm)&set(newm):
            o=oldm[name];n=newm[name];rows.append({'name':name,'pos':n['pos'],'old_mean':o['mean'],'rc459_kernel':n['availability'],'delta':round(n['availability']-o['mean'],4)})
        rows.sort(key=lambda r:-abs(r['delta']));comp[str(pn)]=rows[:15]
    return comp

def main():
    global MANAGER_DATA
    gate,players,MANAGER_DATA,mhash=load();runs=int(sys.argv[1]) if len(sys.argv)>1 else 1000
    cells={};i=0
    for profiled in (False,True):
        for stress in ('baseline','stress'):
            i+=1;cells[f"{'PROFILED' if profiled else 'MARKET'}|{stress}"]=summarize(players,runs,profiled,stress,45900000+i*100000)
    out={'schema':1,'status':'PASS','freeze_package_sha256':gate['package_sha256'],'runs_per_cell':runs,'total_full_drafts':runs*len(cells),
         'scope':'opponent-kernel parity only; neutral user policy; no Coach-policy certification','policy_ranking_certified':False,
         'rc459_exact_source':{'numbered_artifact_app_sha256':EXPECTED_RC459_APP_SHA,'manager_profile_source_hash':mhash,
          'verified_equations':['simCandidateWeight 90/10 ADP-panel center','tau 1.35/4.5/7.5','simNeedWeight','managerHistoryPosMult','candidateManagerMod scored traits','specialPositionHazard','70-player panel-ranked opponent board','exact snake geometry','sequential roster mutation']},
         'cells':cells}
    out['comparison_vs_36k_robust_mean']=compare_to_36k(out)
    maxsplit=max(c['split_half_max_top50_availability_delta'] for c in cells.values());gateout={'status':'PASS' if maxsplit<=.09 else 'FAIL_CLOSED','freeze_package_sha256':gate['package_sha256'],'runs_per_cell':runs,'cells':len(cells),'total_full_drafts':runs*len(cells),'max_split_half_delta':maxsplit,'policy_ranking_certified':False}
    out['status']=gateout['status'];pathlib.Path('RC459_OPPONENT_KERNEL_SIM_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False));pathlib.Path('RC459_OPPONENT_KERNEL_SIM_2026_GATE.json').write_text(json.dumps(gateout,indent=2))
    print(json.dumps(gateout,indent=2))

if __name__=='__main__':main()
