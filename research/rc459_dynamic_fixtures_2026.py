#!/usr/bin/env python3
"""Generate deterministic realistic draft-state fixtures for exact rc4.59 Coach execution.

Fixtures use the already-validated rc4.59 profiled opponent kernel and neutral user
control only to create realistic prefixes. They are not calibration targets and do not
certify policy superiority.
"""
from __future__ import annotations
import collections,json,pathlib,random,requests
import rc459_opponent_kernel_sim_2026 as k

TURNS=[9,12,29,32,49,52,69,72]
SEEDS=[45991001,45992001]
MAP={1:'Michael',2:'Pascal Voerde',3:'Marc Düsseldorf',4:'Thomas',5:'Bjoern',6:'Pascal Gelderner',7:'Giuliano',8:'Basti',9:'Tim',10:'Dutch Marc'}

def metadata():
    r=requests.get('https://api.sleeper.app/v1/players/nfl',timeout=45,headers={'User-Agent':'PITTI-rc459-dynamic/1.0'});r.raise_for_status();raw=r.json();out={}
    for sp in raw.values():
        name=sp.get('full_name') or ' '.join(x for x in [sp.get('first_name'),sp.get('last_name')] if x)
        if not name:continue
        try:ye=int(sp.get('years_exp')) if sp.get('years_exp') is not None else None
        except Exception:ye=None
        out[k.norm(name)]={'team':str(sp.get('team') or 'FA'),'years_exp':ye,'injury_status':sp.get('injury_status'),'bye_week':sp.get('bye_week'),'search_rank':sp.get('search_rank')}
    return out

def record_pick(picks,players_meta,pn,slot,p=None,special=None):
    if special:
        pid=f'__special_{special}_{pn}';players_meta[pid]={'full_name':f'{special} placeholder {pn}','position':special,'team':'','years_exp':None,'injury_status':None,'bye_week':None}
        picks.append({'pick_no':pn,'draft_slot':slot,'player_id':pid,'metadata':{'position':special,'player_name':f'{special} placeholder {pn}'}});return
    pid=p['key'];m=players_meta[pid]
    picks.append({'pick_no':pn,'draft_slot':slot,'player_id':pid,'metadata':{'position':p['pos'],'player_name':p['name'],'team':m.get('team') or p.get('team') or 'FA'}})

def fixture(players,meta,seed,stop_pick):
    rng=random.Random(seed);avail=set(players);rosters={s:collections.Counter({'QB':0,'RB':0,'WR':0,'TE':0,'K':0,'DEF':0}) for s in range(1,11)};picks=[];pm={}
    for key,p in players.items():
        md=meta.get(k.norm(p['name']),{});pm[key]={'full_name':p['name'],'position':p['pos'],'team':md.get('team') or p.get('team') or 'FA','years_exp':md.get('years_exp',p.get('years_exp')),'injury_status':md.get('injury_status'),'bye_week':md.get('bye_week'),'search_rank':md.get('search_rank')}
    for pn in range(1,stop_pick):
        slot=k.slot_at_pick(pn);pool=sorted((players[z] for z in avail),key=lambda p:(p['panel'],p['adp']))
        if slot==k.USER_SLOT:
            chosen=k.neutral_user_pick(pool[:70],rosters[slot],pn);avail.remove(chosen['key']);rosters[slot][chosen['pos']]+=1;record_pick(picks,pm,pn,slot,chosen)
        else:
            name=k.ACTIVE[slot];sp=k.choose_special(rng,k.MANAGER_DATA,name,rosters[slot],pn)
            if sp:
                rosters[slot][sp]+=1;record_pick(picks,pm,pn,slot,special=sp);continue
            board=pool[:70];weights=[k.candidate_weight(p,pn,rosters[slot],name,'baseline') for p in board];chosen=k.weighted_pick(rng,board,weights);avail.remove(chosen['key']);rosters[slot][chosen['pos']]+=1;record_pick(picks,pm,pn,slot,chosen)
    available=[]
    for z in avail:
        p=players[z];m=pm[z];available.append({'id':z,'name':p['name'],'pos':p['pos'],'team':m.get('team') or 'FA','searchRank':m.get('search_rank'),'injury':m.get('injury_status'),'bye':m.get('bye_week'),'yearsExp':m.get('years_exp')})
    available.sort(key=lambda p:(players[p['id']]['panel'],players[p['id']]['adp']))
    return {'id':f'{seed}-{stop_pick}','seed':seed,'current':stop_pick,'next':k.USER_PICKS[k.USER_PICKS.index(stop_pick)+1] if stop_pick in k.USER_PICKS[:-1] else None,'teams':10,'userSlot':9,'mode':'mock','stress':'baseline','strategy':'progressive','managerMap':MAP,'picks':picks,'players':pm,'available':available,'expected_rosters':{str(s):dict(rosters[s]) for s in rosters}}

def main():
    gate,players,k.MANAGER_DATA,mhash=k.load();meta=metadata();fixtures=[]
    for seed in SEEDS:
        for turn in TURNS:fixtures.append(fixture(players,meta,seed+turn*100003,turn))
    out={'schema':1,'status':'PASS','freeze_package_sha256':gate['package_sha256'],'manager_profile_source_hash':mhash,'fixture_count':len(fixtures),'turns':TURNS,'seeds':SEEDS,'generator_policy':'rc4.59 profiled-baseline opponent kernel + neutral user prefix control','calibration_target':False,'fixtures':fixtures}
    pathlib.Path('diagnostics_2026').mkdir(exist_ok=True);pathlib.Path('diagnostics_2026/RC459_DYNAMIC_FIXTURES_2026.json').write_text(json.dumps(out,ensure_ascii=False))
    print(json.dumps({'status':'PASS','fixture_count':len(fixtures),'turns':TURNS,'freeze':gate['package_sha256']},indent=2))
if __name__=='__main__':main()
