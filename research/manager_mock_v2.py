#!/usr/bin/env python3
"""Manager Mock v2 empirical calibration / realism harness.

Research-only. The market baseline is learned from completed 2026 Sleeper mocks with
Tim's slot excluded. League-manager evidence is a capped modifier on top of that
baseline, never the generator of the board. Hard snake/availability/roster invariants
are enforced mechanically.
"""
from __future__ import annotations
import argparse, collections, json, math, random, re, statistics, urllib.request
from dataclasses import dataclass
from pathlib import Path

DEFAULT_DRAFT_IDS=[
 "1393362700163096576","1393522165596303360","1393907487035375616",
 "1394347695488925696","1394444512406835200","1394654621347094528",
]
USER_SLOT=9; TEAMS=10; ROUNDS=15
SKILL={"QB","RB","WR","TE"}; ALL_POS=SKILL|{"K","DEF"}
MANAGER_MAP={1:"Michael",2:"Pascal Voerde",3:"Marc Düsseldorf",4:"Thomas",5:"Bjoern",6:"Pascal Gelderner",7:"Giuliano",8:"Basti",9:"Tim",10:"Dutch Marc"}


def get_json(url):
 req=urllib.request.Request(url,headers={"User-Agent":"draft-companion-manager-mock-v2/0.2"})
 with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)

def slot_at_pick(p,teams=TEAMS):
 rnd=(p-1)//teams+1; within=(p-1)%teams+1
 return within if rnd%2 else teams-within+1

def own_picks(slot=USER_SLOT):return [p for p in range(1,TEAMS*ROUNDS+1) if slot_at_pick(p)==slot]
def phase(p):
 if p<=30:return "early"
 if p<=70:return "mid1"
 if p<=110:return "mid2"
 if p<=135:return "late"
 return "end"
def pname(pk):
 m=pk.get("metadata") or {}; n=(str(m.get("first_name") or "")+" "+str(m.get("last_name") or "")).strip()
 return n or str(m.get("player_name") or pk.get("player_id") or "")
def ppos(pk):
 p=str((pk.get("metadata") or {}).get("position") or "").upper()
 return "DEF" if p in {"DST","D/ST"} else p

def load_manager_profile_data(path):
 txt=path.read_text(encoding="utf-8")
 m=re.search(r"const MANAGER_PROFILE_DATA=(\{.*?\});\s*const MANAGER_PROFILE_SOURCE_HASH",txt,re.S)
 return json.loads(m.group(1)) if m else None

@dataclass
class PlayerStat:
 name:str; pos:str; picks:list
 @property
 def mean(self):return statistics.mean(self.picks)
 @property
 def sd(self):return max(2.5,statistics.pstdev(self.picks)) if len(self.picks)>1 else 8.0
 @property
 def n(self):return len(self.picks)
 @property
 def lo(self):return min(self.picks)
 @property
 def hi(self):return max(self.picks)


def collect(ids):
 drafts={}; errors={}
 for did in ids:
  try:
   d=get_json(f"https://api.sleeper.app/v1/draft/{did}"); picks=get_json(f"https://api.sleeper.app/v1/draft/{did}/picks")
   picks=sorted(picks,key=lambda x:int(x.get("pick_no") or 0))
   if d.get("status")!="complete" or len(picks)<TEAMS*ROUNDS:raise RuntimeError(f"not complete status={d.get('status')} picks={len(picks)}")
   for pk in picks:
    pn=int(pk["pick_no"]); ds=int(pk["draft_slot"])
    if slot_at_pick(pn)!=ds:raise RuntimeError(f"geometry mismatch {pn}: {ds}")
   drafts[did]=picks
  except Exception as e:errors[did]=str(e)
 return drafts,errors

def build_empirical(drafts,exclude_slot=USER_SLOT):
 bp=collections.defaultdict(list); pos={}; phase_pos=collections.defaultdict(collections.Counter)
 for picks in drafts.values():
  for pk in picks:
   pn=int(pk["pick_no"]); ds=int(pk["draft_slot"]); po=ppos(pk); nm=pname(pk)
   if not nm or po not in ALL_POS:continue
   pos[nm]=po
   if ds==exclude_slot:continue
   bp[nm].append(pn); phase_pos[phase(pn)][po]+=1
 stats={n:PlayerStat(n,pos[n],v) for n,v in bp.items()}
 shares={ph:{p:c/sum(cnt.values()) for p,c in cnt.items()} for ph,cnt in phase_pos.items()}
 return stats,shares

def loo_metrics(drafts):
 out=[]
 for hold,picks in drafts.items():
  train={k:v for k,v in drafts.items() if k!=hold}; stats,_=build_empirical(train)
  errs=[]; covered=0; total=0; slides=0
  for pk in picks:
   if int(pk["draft_slot"])==USER_SLOT:continue
   total+=1; st=stats.get(pname(pk))
   if not st:continue
   covered+=1; pn=int(pk["pick_no"]); errs.append(abs(pn-st.mean))
   if pn>st.mean+max(10,2*st.sd):slides+=1
  out.append({"draft_id":hold,"coverage":covered/total if total else 0,"mae":statistics.mean(errs) if errs else None,"n":len(errs),"extreme_slides":slides,"extreme_slide_rate_per_draft":slides})
 return out

def manager_phase_multiplier(data,mgr,pos,ph,shrink=.30):
 if not data or not mgr or mgr=="Tim":return 1.0
 profiles=data.get("profiles",{}); league=data.get("leaguePhaseShares",{}).get(ph,{})
 prof=profiles.get(mgr) or profiles.get(mgr.replace("ö","oe"))
 if not prof:return 1.0
 a=float(prof.get("phaseShares",{}).get(ph,{}).get(pos,0) or 0); b=float(league.get(pos,0) or 0)
 if b<=0:return 1.0
 raw=max(.45,min(2.0,a/b)); return math.exp(shrink*math.log(raw))

def eligible(pos,r):
 # Prevent chat-side pathologies: no QB3/TE3, no second K/DEF.
 if pos=="QB" and r[pos]>=2:return False
 if pos=="TE" and r[pos]>=2:return False
 if pos in {"K","DEF"} and r[pos]>=1:return False
 return True

def roster_mult(pos,r,pn):
 c=r[pos]
 if pos=="QB":return 1.15 if c==0 else .16
 if pos=="TE":return 1.10 if c==0 else .20
 if pos=="RB":return 1.12 if c<2 else (.94 if c<5 else .64)
 if pos=="WR":return 1.10 if c<3 else (.96 if c<6 else .66)
 if pos in {"K","DEF"}:return .03 if pn<95 else 1.0
 return 1.0

def bjorn_mode_mult(mgr,pos,mode):
 if mgr!="Bjoern":return 1.0
 if mode=="auto":return 1.0
 if mode=="manual_rb":return 1.12 if pos=="RB" else (0.96 if pos=="WR" else 1.0)
 return 1.0

def market_weight(st,pn):
 # Empirical player distribution is primary. Larger uncertainty for sparse observations.
 sparse=1.0+0.16*max(0,4-st.n); scale=max(2.0,st.sd*.78*sparse)
 delta=abs(pn-st.mean)/scale
 w=math.exp(-0.5*delta*delta)
 # Once beyond the empirical late tail, apply calibrated soft catch-up pressure.
 guard=st.mean+max(7,1.55*st.sd)
 if pn>guard:w*=1+min(7,(pn-guard)/max(2.5,scale)*2.0)
 return max(1e-10,w)

def simulate(stats,profile_data,runs=250,seed=260817,bjorn_mode="auto",use_manager=True):
 ordered=sorted(stats.values(),key=lambda s:s.mean); rng=random.Random(seed)
 samples=collections.defaultdict(list); slides=[]; invalid=[]
 for run in range(runs):
  avail={p.name for p in ordered}; rosters={s:collections.Counter() for s in range(1,TEAMS+1)}
  for pn in range(1,TEAMS*ROUNDS+1):
   slot=slot_at_pick(pn); mgr=MANAGER_MAP[slot]; ph=phase(pn)
   board=[]
   for st in ordered:
    if st.name not in avail or not eligible(st.pos,rosters[slot]):continue
    board.append(st)
    if len(board)>=70:break
   if not board:
    invalid.append({"run":run,"pick":pn,"slot":slot,"reason":"empty_board"});break
   weighted=[]
   for st in board:
    w=market_weight(st,pn)*roster_mult(st.pos,rosters[slot],pn)
    if use_manager and not (mgr=="Bjoern" and bjorn_mode=="auto"):
     w*=manager_phase_multiplier(profile_data,mgr,st.pos,ph)
    w*=bjorn_mode_mult(mgr,st.pos,bjorn_mode)
    weighted.append((st,w))
   total=sum(w for _,w in weighted)
   if total<=0:chosen=min(board,key=lambda s:abs(s.mean-pn))
   else:
    x=rng.random()*total; chosen=weighted[-1][0]
    for st,w in weighted:
     x-=w
     if x<=0:chosen=st;break
   samples[chosen.name].append(pn); rosters[slot][chosen.pos]+=1; avail.remove(chosen.name)
   if pn>chosen.mean+max(10,2*chosen.sd):slides.append(pn-chosen.mean)
 return samples,slides,invalid

def calibration(stats,samples):
 errs=[]; bias=[]; covered=0
 for nm,st in stats.items():
  s=samples.get(nm,[])
  if len(s)<5:continue
  sm=statistics.mean(s); errs.append(abs(sm-st.mean)); bias.append(sm-st.mean); covered+=1
 return {"players":covered,"mean_abs_center_error":statistics.mean(errs) if errs else None,"mean_bias":statistics.mean(bias) if bias else None}

def scenario(stats,data,runs,mode,use_manager,seed):
 samples,slides,invalid=simulate(stats,data,runs,seed,mode,use_manager)
 return {"runs":runs,"bjorn_mode":mode,"manager_layer":use_manager,"calibration":calibration(stats,samples),"extreme_slide_count":len(slides),"extreme_slide_rate_per_draft":len(slides)/runs,"invalid":invalid[:10],"invalid_count":len(invalid)}

def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--app",default="app.js"); ap.add_argument("--runs",type=int,default=250); ap.add_argument("--out",default="manager_mock_v2_report.json")
 args=ap.parse_args(); drafts,errors=collect(DEFAULT_DRAFT_IDS)
 if len(drafts)<4:raise SystemExit(f"Need >=4 mocks, got {len(drafts)} {errors}")
 stats,shares=build_empirical(drafts); data=load_manager_profile_data(Path(args.app)); loo=loo_metrics(drafts)
 empirical_slide=statistics.mean(r["extreme_slide_rate_per_draft"] for r in loo)
 scenarios={
  "market_only":scenario(stats,data,args.runs,"auto",False,260817),
  "manager_bjorn_auto":scenario(stats,data,args.runs,"auto",True,260818),
  "manager_bjorn_manual_rb":scenario(stats,data,args.runs,"manual_rb",True,260819),
 }
 report={
  "schema":"draft-companion.manager-mock-v2.validation.v2","draft_ids":list(drafts),"errors":errors,
  "geometry":{"teams":TEAMS,"rounds":ROUNDS,"user_slot":USER_SLOT,"own_picks":own_picks()},
  "empirical":{"opponent_players":len(stats),"phase_position_shares":shares,"loo_mean_extreme_slide_rate_per_draft":empirical_slide},
  "leave_one_mock_out":loo,"scenarios":scenarios,
  "policy":{"market_baseline":"completed 2026 Sleeper mocks; user slot excluded","manager_layer":"historical phase shares log-shrunk 30%; Bjorn auto bypasses personal profile","bjorn_sensitivity":["auto","manual_rb"],"hard_invariants":["snake geometry","availability","QB<=2","TE<=2","K<=1","DEF<=1"],"status":"RESEARCH_ONLY_NOT_LIVE"}
 }
 Path(args.out).write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8");print(json.dumps(report,indent=2,ensure_ascii=False))
 assert report["geometry"]["own_picks"]==[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149]
 assert all(r["coverage"]>.75 for r in loo),loo
 assert all(v["invalid_count"]==0 for v in scenarios.values()),scenarios

if __name__=="__main__":main()
