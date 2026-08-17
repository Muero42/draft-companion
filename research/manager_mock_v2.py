#!/usr/bin/env python3
"""Manager Mock v2 empirical calibration / realism harness. Research only."""
from __future__ import annotations
import argparse,collections,json,math,random,re,statistics,urllib.request
from dataclasses import dataclass
from pathlib import Path
DEFAULT_DRAFT_IDS=["1393362700163096576","1393522165596303360","1393907487035375616","1394347695488925696","1394444512406835200","1394654621347094528"]
USER_SLOT=9;TEAMS=10;ROUNDS=15;ALL_POS={"QB","RB","WR","TE","K","DEF"}
MANAGER_MAP={1:"Michael",2:"Pascal Voerde",3:"Marc Düsseldorf",4:"Thomas",5:"Bjoern",6:"Pascal Gelderner",7:"Giuliano",8:"Basti",9:"Tim",10:"Dutch Marc"}
def get_json(url):
 req=urllib.request.Request(url,headers={"User-Agent":"draft-companion-manager-mock-v2/0.6"})
 with urllib.request.urlopen(req,timeout=30) as r:return json.load(r)
def slot_at_pick(p):
 r=(p-1)//TEAMS+1;w=(p-1)%TEAMS+1;return w if r%2 else TEAMS-w+1
def own_picks():return[p for p in range(1,151) if slot_at_pick(p)==USER_SLOT]
def phase(p):return"early"if p<=30 else"mid1"if p<=70 else"mid2"if p<=110 else"late"if p<=135 else"end"
def pname(pk):
 m=pk.get("metadata")or{};n=(str(m.get("first_name")or"")+" "+str(m.get("last_name")or"")).strip();return n or str(m.get("player_name")or pk.get("player_id")or"")
def ppos(pk):
 p=str((pk.get("metadata")or{}).get("position")or"").upper();return"DEF"if p in{"DST","D/ST"}else p
def load_profiles(path):
 t=path.read_text(encoding="utf-8");m=re.search(r"const MANAGER_PROFILE_DATA=(\{.*?\});\s*const MANAGER_PROFILE_SOURCE_HASH",t,re.S);return json.loads(m.group(1))if m else None
@dataclass
class PlayerStat:
 name:str;pos:str;picks:list;source:str="opponent"
 @property
 def mean(self):return statistics.mean(self.picks)
 @property
 def sd(self):return max(2.5,statistics.pstdev(self.picks))if len(self.picks)>1 else 8.0
 @property
 def n(self):return len(self.picks)
def collect(ids):
 drafts={};errors={}
 for did in ids:
  try:
   d=get_json(f"https://api.sleeper.app/v1/draft/{did}");ps=sorted(get_json(f"https://api.sleeper.app/v1/draft/{did}/picks"),key=lambda x:int(x.get("pick_no")or 0))
   if d.get("status")!="complete"or len(ps)<150:raise RuntimeError("incomplete")
   if any(slot_at_pick(int(x["pick_no"]))!=int(x["draft_slot"])for x in ps):raise RuntimeError("geometry")
   drafts[did]=ps
  except Exception as e:errors[did]=str(e)
 return drafts,errors
def build_empirical(drafts,tail=True):
 opp=collections.defaultdict(list);allp=collections.defaultdict(list);pos={};phase_pos=collections.defaultdict(collections.Counter)
 for ps in drafts.values():
  for pk in ps:
   pn=int(pk["pick_no"]);ds=int(pk["draft_slot"]);po=ppos(pk);nm=pname(pk)
   if not nm or po not in ALL_POS:continue
   pos[nm]=po;allp[nm].append(pn)
   if ds!=USER_SLOT:opp[nm].append(pn);phase_pos[phase(pn)][po]+=1
 st={n:PlayerStat(n,pos[n],v)for n,v in opp.items()}
 if tail:
  for n,v in allp.items():
   if n not in st:st[n]=PlayerStat(n,pos[n],v,"user_tail")
 sh={ph:{p:c/sum(cnt.values())for p,c in cnt.items()}for ph,cnt in phase_pos.items()}
 return st,sh
def loo_metrics(drafts):
 out=[]
 for hold,ps in drafts.items():
  st,_=build_empirical({k:v for k,v in drafts.items()if k!=hold},False);e=[];cov=tot=slides=0
  for pk in ps:
   if int(pk["draft_slot"])==USER_SLOT:continue
   tot+=1;s=st.get(pname(pk))
   if not s:continue
   cov+=1;pn=int(pk["pick_no"]);e.append(abs(pn-s.mean));slides+=pn>s.mean+max(10,2*s.sd)
  out.append({"draft_id":hold,"coverage":cov/tot,"mae":statistics.mean(e),"n":len(e),"extreme_slides":slides,"extreme_slide_rate_per_draft":slides})
 return out
def manager_mult(data,mgr,pos,ph):
 if not data or mgr=="Tim":return 1.0
 prof=data.get("profiles",{}).get(mgr)or data.get("profiles",{}).get(mgr.replace("ö","oe"));league=data.get("leaguePhaseShares",{}).get(ph,{})
 if not prof:return 1.0
 a=float(prof.get("phaseShares",{}).get(ph,{}).get(pos,0)or 0);b=float(league.get(pos,0)or 0)
 return math.exp(.30*math.log(max(.45,min(2,a/b))))if b>0 else 1.0
def eligible(pos,r):return not((pos=="QB"and r[pos]>=2)or(pos=="TE"and r[pos]>=2)or(pos in{"K","DEF"}and r[pos]>=1))
def roster_mult(pos,r,pn):
 c=r[pos]
 if pos=="QB":return 1.15 if c==0 else .16
 if pos=="TE":return 1.10 if c==0 else .20
 if pos=="RB":return 1.12 if c<2 else(.94 if c<5 else .64)
 if pos=="WR":return 1.10 if c<3 else(.96 if c<6 else .66)
 if pos in{"K","DEF"}:return .03 if pn<95 else 1.0
 return 1.0
def bjorn_mult(mgr,pos,mode):return 1.0 if mgr!="Bjoern"or mode=="auto"else 1.12 if pos=="RB"else .96 if pos=="WR"else 1.0
def market_weight(st,pn):
 # Wider Gaussian around empirical center: allows realistic tails but does not force every
 # overdue fringe player to be selected. Sparse observations widen uncertainty further.
 scale=max(3.0,st.sd*1.08*(1+.12*max(0,4-st.n)))
 z=(pn-st.mean)/scale;w=math.exp(-.5*z*z)
 guard=st.mean+max(8,1.75*st.sd)
 if pn>guard:w*=1+min(3.5,(pn-guard)/max(3,scale)*.9)
 if st.source=="user_tail":w*=.20
 return max(1e-10,w)
def simulate(stats,data,runs,seed,mode,use_manager):
 ordered=sorted(stats.values(),key=lambda s:s.mean);rng=random.Random(seed);samples=collections.defaultdict(list);slides=[];invalid=[]
 for run in range(runs):
  avail={p.name for p in ordered};rosters={s:collections.Counter()for s in range(1,11)}
  for pn in range(1,151):
   slot=slot_at_pick(pn);mgr=MANAGER_MAP[slot];board=[st for st in ordered if st.name in avail and eligible(st.pos,rosters[slot])][:80]
   if not board:invalid.append({"run":run,"pick":pn,"slot":slot});break
   ws=[]
   for st in board:
    w=market_weight(st,pn)*roster_mult(st.pos,rosters[slot],pn)
    if use_manager and not(mgr=="Bjoern"and mode=="auto"):w*=manager_mult(data,mgr,st.pos,phase(pn))
    w*=bjorn_mult(mgr,st.pos,mode);ws.append((st,w))
   total=sum(w for _,w in ws);x=rng.random()*total;chosen=ws[-1][0]
   for st,w in ws:
    x-=w
    if x<=0:chosen=st;break
   if slot!=USER_SLOT:samples[chosen.name].append(pn)
   rosters[slot][chosen.pos]+=1;avail.remove(chosen.name)
   if slot!=USER_SLOT and chosen.source=="opponent"and pn>chosen.mean+max(10,2*chosen.sd):slides.append(pn-chosen.mean)
 return samples,slides,invalid
def calibration(stats,samples):
 e=[];b=[]
 for n,s in stats.items():
  if s.source!="opponent":continue
  x=samples.get(n,[])
  if len(x)<5:continue
  m=statistics.mean(x);e.append(abs(m-s.mean));b.append(m-s.mean)
 return{"players":len(e),"mean_abs_center_error":statistics.mean(e),"mean_bias":statistics.mean(b)}
def scenario(stats,data,runs,mode,use_manager,seed):
 s,sl,inv=simulate(stats,data,runs,seed,mode,use_manager);return{"runs":runs,"bjorn_mode":mode,"manager_layer":use_manager,"calibration":calibration(stats,s),"extreme_slide_rate_per_draft":len(sl)/runs,"invalid_count":len(inv),"invalid":inv[:10]}
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--app",default="app.js");ap.add_argument("--runs",type=int,default=100);ap.add_argument("--out",default="manager_mock_v2_report.json");a=ap.parse_args();drafts,errors=collect(DEFAULT_DRAFT_IDS)
 if len(drafts)<4:raise SystemExit(errors)
 st,shares=build_empirical(drafts);data=load_profiles(Path(a.app));loo=loo_metrics(drafts);emp=statistics.mean(r["extreme_slide_rate_per_draft"]for r in loo)
 sc={"market_only":scenario(st,data,a.runs,"auto",False,260817),"manager_bjorn_auto":scenario(st,data,a.runs,"auto",True,260818),"manager_bjorn_manual_rb":scenario(st,data,a.runs,"manual_rb",True,260819)}
 report={"schema":"draft-companion.manager-mock-v2.validation.v6","draft_ids":list(drafts),"errors":errors,"geometry":{"own_picks":own_picks()},"empirical":{"opponent_players":sum(s.source=="opponent"for s in st.values()),"user_tail_players":sum(s.source=="user_tail"for s in st.values()),"total_universe":len(st),"phase_position_shares":shares,"loo_mean_extreme_slide_rate_per_draft":emp},"leave_one_mock_out":loo,"scenarios":sc,"policy":{"market_process":"wider empirical density with soft late-tail guard","manager_layer":"phase shares shrunk 30%; Bjorn auto bypasses profile","status":"RESEARCH_ONLY_NOT_LIVE"}}
 Path(a.out).write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8");print(json.dumps(report,indent=2,ensure_ascii=False))
 assert own_picks()==[9,12,29,32,49,52,69,72,89,92,109,112,129,132,149];assert all(r["coverage"]>.75 for r in loo);assert all(v["invalid_count"]==0 for v in sc.values())
if __name__=="__main__":main()
