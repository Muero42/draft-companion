#!/usr/bin/env python3
"""Compact research-only decision insights from already-PASS PITTI artifacts.

No simulation is rerun and no production coefficient is changed. The outputs keep
market timing (rc4.59 opponent kernel) separate from the independent historical
Sleeper-ADP outcome challenger. They are decision aids, not policy certification.
"""
from __future__ import annotations
import json, pathlib, re, statistics

FREEZE='5339a37d275505f2a3a6fe0b84785f435d840d02cc7472a2b8bd934244e884fd'
PAIRS=['9->12','29->32','49->52','69->72']
FOCUS={
 '9->12': {'Amon-Ra St. Brown','Jaxon Smith-Njigba','Jonathan Taylor','James Cook III','Chase Brown','Ashton Jeanty','Justin Jefferson','CeeDee Lamb','Saquon Barkley','Omarion Hampton','De\'Von Achane','Drake London'},
 '29->32': {'Chris Olave','Zay Flowers','Malik Nabers','Kyren Williams','DeVonta Smith','Colston Loveland','George Pickens'},
 '49->52': {'Colston Loveland','Tyler Warren','D\'Andre Swift','Terry McLaurin','Jaylen Waddle','Jameson Williams','Garrett Wilson','Parker Washington'},
 '69->72': {'Christian Watson','Rome Odunze','Parker Washington','Marvin Harrison Jr.','Jayden Daniels','Jalen Hurts','Tucker Kraft','Jaylen Warren','Carnell Tate'}
}

def norm(s):return re.sub(r'[^a-z0-9]+','',str(s or '').lower())
def timing_label(r):
    if r<=.25:return 'TAKE_FIRST_IF_TARGET'
    if r<.65:return 'MATERIAL_COLLISION_RISK'
    if r<.90:return 'WAITABLE_WITH_RISK'
    return 'VERY_WAITABLE'
def wilson(p,n,z=1.96):
    if not n:return [None,None]
    den=1+z*z/n;ctr=(p+z*z/(2*n))/den;rad=z*((p*(1-p)/n+z*z/(4*n*n))**.5)/den
    return [round(max(0,ctr-rad),4),round(min(1,ctr+rad),4)]

def main():
    tp=json.load(open('simulation_2026/RC459_TURN_PAIR_MARKET_2026.json'))
    tpg=json.load(open('simulation_2026/RC459_TURN_PAIR_MARKET_2026_GATE.json'))
    mb=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026.json'))
    mbg=json.load(open('bridge_2026/MARKET_OUTCOME_BRIDGE_2026_GATE.json'))
    raw=json.load(open('freeze_2026/FRESH_2026_MARKET_PANEL_RAW.json'))
    if tp.get('status')!='PASS' or tpg.get('status')!='PASS' or mb.get('status')!='PASS' or mbg.get('status')!='PASS':raise SystemExit('precondition gate not PASS')
    if tp.get('freeze_package_sha256')!=FREEZE:raise SystemExit('turn-pair freeze mismatch')
    out={'schema':1,'status':'PASS','freeze_package_sha256':FREEZE,'policy_ranking_certified':False,
         'interpretation':'Timing labels describe conditional collision/return only. Market-outcome residuals are an independent challenger and do not replace selected-panel Player Quality.',
         'turns':{},'market_panel_challenger':{}}
    for pair in PAIRS:
        rows=[]
        for r in tp['pairs'][pair]['candidates']:
            if r['name'] not in FOCUS[pair]:continue
            ret=float(r['return_if_wait']);n=int(r['eligible_runs'])
            rows.append({'name':r['name'],'pos':r['pos'],'panel':r['panel'],'adp':r['adp'],'exposure':r['exposure'],'eligible_runs':n,
                         'return_if_wait':ret,'return_95ci':wilson(ret,n),'timing_label':timing_label(ret),
                         'slot10_take_total':round(float(r['taken_on_slot10_first'])+float(r['taken_on_slot10_second']),4),
                         'take_now_second_pick_top':r.get('take_branch_second_pick_top',[])[:4],
                         'wait_second_pick_top':r.get('wait_branch_second_pick_top',[])[:4]})
        rows.sort(key=lambda x:(x['return_if_wait'],x['panel']))
        out['turns'][pair]=rows
    # Independent bridge residual by position: compare within-position market-implied forecast rank
    # to the selected panel's within-position rank. Never compare raw weekly means across positions.
    forecasts=mb.get('forecast_2026') or mb.get('forecasts_2026') or mb.get('forecasts') or {}
    if isinstance(forecasts,list): forecasts={norm(x.get('name')):x for x in forecasts}
    pool=raw.get('pool_rows',[]) if isinstance(raw,dict) else []
    panel=[]
    for x in pool:
        pos=x.get('pos');name=x.get('name')
        if pos not in {'QB','RB','WR','TE'} or not name:continue
        pr=x.get('panel_position') if isinstance(x.get('panel_position'),(int,float)) else x.get('panel_standard')
        if isinstance(pr,(int,float)):panel.append({'name':name,'pos':pos,'panel':float(pr)})
    for pos in ['QB','RB','WR','TE']:
        pp=sorted([x for x in panel if x['pos']==pos],key=lambda x:x['panel'])
        ppos={norm(x['name']):i+1 for i,x in enumerate(pp)}
        ff=[]
        for k,f in forecasts.items():
            if not isinstance(f,dict) or f.get('pos')!=pos:continue
            pred=f.get('pred_weekly_mean');name=f.get('name')
            if not isinstance(pred,(int,float)) or norm(name) not in ppos:continue
            ff.append((name,float(pred),float(f.get('sleeper_adp')) if isinstance(f.get('sleeper_adp'),(int,float)) else None))
        ff.sort(key=lambda x:-x[1]);rows=[]
        for i,(name,pred,adp) in enumerate(ff,1):
            rows.append({'name':name,'pred_weekly_mean':round(pred,3),'sleeper_adp':adp,'bridge_pos_rank':i,'panel_pos_rank':ppos[norm(name)],'bridge_minus_panel_pos_rank':i-ppos[norm(name)]})
        # negative residual = bridge likes player more than selected panel; positive = less.
        out['market_panel_challenger'][pos]={
            'bridge_more_bullish':sorted(rows,key=lambda x:(x['bridge_minus_panel_pos_rank'],x['bridge_pos_rank']))[:12],
            'bridge_more_bearish':sorted(rows,key=lambda x:(-x['bridge_minus_panel_pos_rank'],x['bridge_pos_rank']))[:12],
            'coverage':len(rows)}
    pathlib.Path('RC459_DECISION_INSIGHTS_2026.json').write_text(json.dumps(out,indent=2,ensure_ascii=False))
    gate={'status':'PASS','freeze_package_sha256':FREEZE,'turns':{p:len(out['turns'][p]) for p in PAIRS},
          'bridge_coverage':{p:out['market_panel_challenger'][p]['coverage'] for p in out['market_panel_challenger']},'policy_ranking_certified':False}
    if any(v<3 for v in gate['turns'].values()) or any(v<20 for v in gate['bridge_coverage'].values()):gate['status']='FAIL_CLOSED'
    pathlib.Path('RC459_DECISION_INSIGHTS_2026_GATE.json').write_text(json.dumps(gate,indent=2))
    print(json.dumps(gate,indent=2))
if __name__=='__main__':main()
