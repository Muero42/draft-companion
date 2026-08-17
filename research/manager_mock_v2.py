#!/usr/bin/env python3
"""Manager Mock v2 empirical calibration / realism harness.

Purpose: learn the opponent-market baseline from completed 2026 Sleeper mocks, then
apply league-manager phase tendencies as a *shrunk modifier* rather than generating
picks freehand. The user slot is excluded from opponent calibration.

This is research/validation code only. It does not change live Coach weights.
"""
from __future__ import annotations
import argparse, collections, json, math, random, re, statistics, urllib.request
from dataclasses import dataclass
from pathlib import Path

DEFAULT_DRAFT_IDS = [
    "1393362700163096576", "1393522165596303360", "1393907487035375616",
    "1394347695488925696", "1394444512406835200", "1394654621347094528",
]
USER_SLOT = 9
TEAMS = 10
ROUNDS = 15
SKILL = {"QB","RB","WR","TE"}
ALL_POS = SKILL | {"K","DEF"}


def get_json(url: str):
    req=urllib.request.Request(url,headers={"User-Agent":"draft-companion-manager-mock-v2/0.1"})
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)

def slot_at_pick(pick_no:int, teams:int=TEAMS)->int:
    rnd=(pick_no-1)//teams+1; within=(pick_no-1)%teams+1
    return within if rnd%2 else teams-within+1

def own_picks(slot:int=USER_SLOT, teams:int=TEAMS, rounds:int=ROUNDS):
    return [p for p in range(1,teams*rounds+1) if slot_at_pick(p,teams)==slot]

def phase(pick_no:int)->str:
    if pick_no<=30:return "early"
    if pick_no<=70:return "mid1"
    if pick_no<=110:return "mid2"
    if pick_no<=135:return "late"
    return "end"

def pname(pk):
    m=pk.get("metadata") or {}
    n=(str(m.get("first_name") or "")+" "+str(m.get("last_name") or "")).strip()
    return n or str(m.get("player_name") or pk.get("player_id") or "")

def ppos(pk):
    p=str((pk.get("metadata") or {}).get("position") or "").upper()
    return "DEF" if p in {"DST","D/ST"} else p

def load_manager_profile_data(app_path:Path):
    txt=app_path.read_text(encoding="utf-8")
    m=re.search(r"const MANAGER_PROFILE_DATA=(\{.*?\});\s*const MANAGER_PROFILE_SOURCE_HASH",txt,re.S)
    if not m: return None
    return json.loads(m.group(1))

@dataclass
class PlayerStat:
    name:str; pos:str; picks:list
    @property
    def mean(self): return statistics.mean(self.picks)
    @property
    def sd(self): return statistics.pstdev(self.picks) if len(self.picks)>1 else 8.0
    @property
    def n(self): return len(self.picks)


def collect(draft_ids):
    drafts={}; errors={}
    for did in draft_ids:
        try:
            d=get_json(f"https://api.sleeper.app/v1/draft/{did}")
            picks=get_json(f"https://api.sleeper.app/v1/draft/{did}/picks")
            picks=sorted(picks,key=lambda x:int(x.get("pick_no") or 0))
            if d.get("status")!="complete" or len(picks)<TEAMS*ROUNDS:
                raise RuntimeError(f"not complete: status={d.get('status')} picks={len(picks)}")
            for pk in picks:
                pn=int(pk["pick_no"]); ds=int(pk["draft_slot"])
                if slot_at_pick(pn)!=ds: raise RuntimeError(f"geometry mismatch pick {pn}: {ds}")
            drafts[did]=picks
        except Exception as e: errors[did]=str(e)
    return drafts,errors

def build_empirical(drafts, exclude_slot=USER_SLOT):
    by_player=collections.defaultdict(list); pos_by_player={}
    phase_pos=collections.defaultdict(collections.Counter)
    for picks in drafts.values():
        for pk in picks:
            pn=int(pk["pick_no"]); ds=int(pk["draft_slot"]); pos=ppos(pk); name=pname(pk)
            if not name or not pos: continue
            pos_by_player[name]=pos
            if ds==exclude_slot: continue
            by_player[name].append(pn); phase_pos[phase(pn)][pos]+=1
    stats={n:PlayerStat(n,pos_by_player[n],v) for n,v in by_player.items()}
    shares={ph:{p:c/sum(cnt.values()) for p,c in cnt.items()} for ph,cnt in phase_pos.items() for c in [cnt]}
    return stats,shares

def loo_metrics(drafts):
    rows=[]
    for hold,picks in drafts.items():
        train={k:v for k,v in drafts.items() if k!=hold}; stats,_=build_empirical(train)
        errs=[]; covered=0; total=0
        for pk in picks:
            if int(pk["draft_slot"])==USER_SLOT: continue
            total+=1; st=stats.get(pname(pk))
            if st:
                covered+=1; errs.append(abs(int(pk["pick_no"])-st.mean))
        rows.append({"draft_id":hold,"coverage":covered/total if total else 0,"mae":statistics.mean(errs) if errs else None,"n":len(errs)})
    return rows

def manager_phase_multiplier(profile_data, manager_label, pos, ph, shrink=.45):
    if not profile_data or not manager_label:return 1.0
    profiles=profile_data.get("profiles",{}); league=profile_data.get("leaguePhaseShares",{}).get(ph,{})
    prof=profiles.get(manager_label) or profiles.get(manager_label.replace("ö","oe"))
    if not prof:return 1.0
    a=float(prof.get("phaseShares",{}).get(ph,{}).get(pos,0) or 0); b=float(league.get(pos,0) or 0)
    if b<=0:return 1.0
    raw=max(.35,min(2.4,a/b)); return math.exp(shrink*math.log(raw))

def need_mult(pos, roster):
    c=roster[pos]
    if pos=="QB": return 1.18 if c==0 else (.18 if c==1 else .03)
    if pos=="TE": return 1.12 if c==0 else (.22 if c==1 else .05)
    if pos=="RB": return 1.14 if c<2 else (.94 if c<4 else .62)
    if pos=="WR": return 1.12 if c<3 else (.96 if c<5 else .66)
    if pos in {"K","DEF"}: return 0.05 if c else 1.0
    return 1.0

def simulate(stats, profile_data, manager_map, runs=1000, seed=260817):
    players=list(stats.values()); rng=random.Random(seed); pick_samples=collections.defaultdict(list)
    value_slide=[]
    for run in range(runs):
        avail={p.name:p for p in players}; rosters={s:collections.Counter() for s in range(1,TEAMS+1)}
        for pn in range(1,TEAMS*ROUNDS+1):
            slot=slot_at_pick(pn); ph=phase(pn); mgr=manager_map.get(slot)
            board=sorted(avail.values(),key=lambda x:x.mean)[:80]
            weighted=[]
            for st in board:
                tau=2.0 if pn<=30 else (5.0 if pn<=80 else 9.0)
                z=(pn-st.mean)/max(tau,st.sd*.55,1.5)
                w=math.exp(max(-9,min(4,z))) * need_mult(st.pos,rosters[slot])
                w*=manager_phase_multiplier(profile_data,mgr,st.pos,ph)
                threshold=st.mean+max(6,1.65*st.sd)
                if pn>threshold:
                    excess=(pn-threshold)/max(3,tau); w*=1+min(8,excess*2.5)
                weighted.append((st,w))
            total=sum(w for _,w in weighted); x=rng.random()*total; chosen=weighted[-1][0]
            for st,w in weighted:
                x-=w
                if x<=0: chosen=st; break
            pick_samples[chosen.name].append(pn); rosters[slot][chosen.pos]+=1; del avail[chosen.name]
            if pn>chosen.mean+max(10,2*chosen.sd): value_slide.append(pn-chosen.mean)
    return pick_samples,value_slide

def sim_calibration(stats,samples):
    errs=[]; biases=[]; n=0
    for name,st in stats.items():
        s=samples.get(name,[])
        if len(s)<5: continue
        sm=statistics.mean(s); errs.append(abs(sm-st.mean)); biases.append(sm-st.mean); n+=1
    return {"players":n,"mean_abs_center_error":statistics.mean(errs) if errs else None,"mean_bias":statistics.mean(biases) if biases else None}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--app",default="app.js"); ap.add_argument("--runs",type=int,default=1500); ap.add_argument("--out",default="manager_mock_v2_report.json")
    args=ap.parse_args(); drafts,errors=collect(DEFAULT_DRAFT_IDS)
    if len(drafts)<4: raise SystemExit(f"Need >=4 completed mocks, got {len(drafts)}: {errors}")
    stats,shares=build_empirical(drafts); profile_data=load_manager_profile_data(Path(args.app))
    manager_map={1:"Michael",2:"Pascal Voerde",3:"Marc Düsseldorf",4:"Thomas",5:"Bjoern",6:"Pascal Gelderner",7:"Giuliano",8:"Basti",9:"Tim",10:"Dutch Marc"}
    samples,slides=simulate(stats,profile_data,manager_map,args.runs)
    loo=loo_metrics(drafts); cal=sim_calibration(stats,samples)
    report={
      "schema":"draft-companion.manager-mock-v2.validation.v1","draft_ids":list(drafts),"errors":errors,
      "geometry":{"teams":TEAMS,"rounds":ROUNDS,"user_slot":USER_SLOT,"own_picks":own_picks()},
      "empirical":{"opponent_players":len(stats),"phase_position_shares":shares},
      "leave_one_mock_out":loo,
      "simulation":{"runs":args.runs,"calibration":cal,"extreme_slide_count":len(slides),"extreme_slide_rate_per_draft":len(slides)/args.runs},
      "policy":{"market_baseline":"completed 2026 Sleeper mocks, user slot excluded","manager_layer":"historical phase shares, log-shrunk 45%","value_guard":"empirical mean + max(6,1.65 SD), soft pressure","status":"RESEARCH_ONLY_NOT_LIVE"}
    }
    Path(args.out).write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
    print(json.dumps(report,indent=2,ensure_ascii=False))
    assert report["geometry"]["own_picks"]==[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]
    assert all(r["coverage"]>.75 for r in loo), loo

if __name__=="__main__": main()
