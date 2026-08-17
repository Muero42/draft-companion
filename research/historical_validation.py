#!/usr/bin/env python3
"""PITTI Research Residual historical validator.

Leakage-safe, rolling-origin validation for returning NFL WR/RB player-seasons.

Predictor chronology:
- season-t preseason rank/market controls are allowed;
- football production/workload features are season t-1 or earlier only;
- age/draft metadata are known by the season-t draft date;
- season-t performance/availability is target-only.

Important scope:
- this validator does NOT cover rookie breakouts (no NFL t-1 season);
- historical FantasyPros ECR is a proxy baseline, not the 2026 selected expert panel;
- no model is promoted to live Companion scoring by this script.
"""
from __future__ import annotations
import argparse, json, math, re
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import roc_auc_score, brier_score_loss, log_loss, mean_squared_error, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

POSITIONS = {"WR", "RB"}

def norm_name(s):
    s = str(s or "").lower()
    s = re.sub(r"\b(jr|sr|ii|iii|iv)\b\.?", "", s)
    return re.sub(r"[^a-z0-9]", "", s)

def read_stats(root: Path):
    files = sorted(list(root.glob("stats_player_reg_*.csv")) + list(root.glob("player_stats_*.csv")))
    if not files:
        raise SystemExit("No season player-stat CSVs found.")
    frames = []
    for f in files:
        m = re.findall(r"(20\d{2})", f.name)
        if not m:
            continue
        y = int(m[-1])
        d = pd.read_csv(f, low_memory=False)
        d["season"] = y
        frames.append(d)
    d = pd.concat(frames, ignore_index=True)
    if "season_type" in d:
        d = d[d["season_type"].astype(str).eq("REG")].copy()
    name_col = "player_display_name" if "player_display_name" in d else "player_name"
    req = ["player_id", name_col, "position", "games"]
    miss = [c for c in req if c not in d]
    if miss:
        raise SystemExit(f"Missing required stats columns: {miss}")
    numeric = [
        "games","fantasy_points","receptions","targets","receiving_yards","receiving_tds",
        "receiving_air_yards","receiving_yards_after_catch","receiving_first_downs",
        "target_share","air_yards_share","wopr","carries","rushing_yards","rushing_tds",
        "rushing_first_downs"
    ]
    for c in numeric:
        if c not in d:
            d[c] = np.nan if c in {"target_share","air_yards_share","wopr"} else 0
        d[c] = pd.to_numeric(d[c], errors="coerce")
    d["position"] = d["position"].astype(str).str.upper()
    d = d[d.position.isin(POSITIONS)].copy()
    d["player_name"] = d[name_col]
    d["name_key"] = d.player_name.map(norm_name)
    d["half_points"] = d["fantasy_points"].fillna(0) + 0.5 * d["receptions"].fillna(0)
    d["ppg"] = np.where(d.games > 0, d.half_points / d.games, np.nan)
    d["ppg_pct"] = d.groupby(["season","position"]).ppg.rank(pct=True)
    return d

def add_rank_history(d, path: Path | None):
    if not path:
        d["ecr"] = np.nan
        d["ecr_quality_pct"] = np.nan
        return d
    r = pd.read_csv(path, low_memory=False)
    if "pos" in r and "position" not in r:
        r["position"] = r["pos"]
    if "player_name" not in r or "season" not in r or "position" not in r:
        raise SystemExit("Rank-history file requires season/player_name/pos(or position).")
    r["position"] = r.position.astype(str).str.upper()
    r = r[r.position.isin(POSITIONS)].copy()
    r["name_key"] = r.player_name.map(norm_name)
    rank_col = "ecr" if "ecr" in r else "rank"
    r[rank_col] = pd.to_numeric(r[rank_col], errors="coerce")
    r = r.sort_values(["season","position","name_key",rank_col]).drop_duplicates(["season","position","name_key"])
    n = r.groupby(["season","position"])[rank_col].transform("count")
    r["ecr_quality_pct"] = 1 - r.groupby(["season","position"])[rank_col].rank(pct=True) + 1/n
    r = r.rename(columns={rank_col:"ecr"})
    return d.merge(r[["season","position","name_key","ecr","ecr_quality_pct"]], on=["season","position","name_key"], how="left")

def add_market(d, path: Path | None):
    if not path:
        return d
    m = pd.read_csv(path, low_memory=False)
    if "player_name" not in m or "season" not in m:
        raise SystemExit("Market CSV requires season/player_name.")
    m["name_key"] = m.player_name.map(norm_name)
    keep = ["season","name_key"] + [c for c in ["sleeper_adp","market_adp"] if c in m]
    m = m[keep].drop_duplicates(["season","name_key"])
    return d.merge(m, on=["season","name_key"], how="left")

def load_rosters(root: Path | None):
    if not root:
        return None
    frames=[]
    for f in sorted(root.glob("roster_*.csv")):
        m=re.findall(r"(20\d{2})",f.name)
        if not m:
            continue
        y=int(m[-1])
        q=pd.read_csv(f, low_memory=False)
        if "gsis_id" not in q:
            continue
        q["season"]=y
        q["player_id"]=q["gsis_id"]
        bd=pd.to_datetime(q.get("birth_date"),errors="coerce")
        q["age_at_draft"]=(pd.Timestamp(f"{y}-09-01")-bd).dt.days/365.2425
        for c in ["years_exp","draft_number","entry_year","rookie_year","height","weight"]:
            if c not in q:
                q[c]=np.nan
        keep=["season","player_id","age_at_draft","years_exp","draft_number","entry_year","rookie_year","height","weight"]
        q=q[keep].dropna(subset=["player_id"]).groupby(["season","player_id"],as_index=False).first()
        frames.append(q)
    return pd.concat(frames,ignore_index=True) if frames else None

def build_rows(d, rosters=None):
    lag_cols=[
        "games","receptions","targets","receiving_yards","receiving_tds","receiving_air_yards",
        "receiving_yards_after_catch","receiving_first_downs","target_share","air_yards_share","wopr",
        "carries","rushing_yards","rushing_tds","rushing_first_downs","half_points","ppg","ppg_pct"
    ]
    lag=d[["player_id","season","position"]+lag_cols].copy()
    lag["season"]=lag.season+1
    lag=lag.rename(columns={c:f"prev_{c}" for c in lag_cols})
    x=d.merge(lag,on=["player_id","season","position"],how="left")
    ds=d.sort_values(["player_id","season"]).copy()
    for c in ["games","carries","targets","receptions","half_points"]:
        ds[f"career_prev_{c}"]=ds.groupby("player_id")[c].cumsum()-ds[c]
    ds["career_prev_seasons"]=ds.groupby("player_id").cumcount()
    ccols=[c for c in ds if c.startswith("career_prev_")]
    x=x.merge(ds[["player_id","season"]+ccols],on=["player_id","season"],how="left")
    if rosters is not None:
        x=x.merge(rosters,on=["season","player_id"],how="left")
    else:
        for c in ["age_at_draft","years_exp","draft_number"]:
            x[c]=np.nan
    x["prev_rec_ypt"]=np.where(x.prev_targets>0,x.prev_receiving_yards/x.prev_targets,np.nan)
    x["prev_rec_td_rate"]=np.where(x.prev_targets>0,x.prev_receiving_tds/x.prev_targets,np.nan)
    x["prev_rush_ypc"]=np.where(x.prev_carries>0,x.prev_rushing_yards/x.prev_carries,np.nan)
    x["prev_rush_td_rate"]=np.where(x.prev_carries>0,x.prev_rushing_tds/x.prev_carries,np.nan)
    x["career_touches"]=x.career_prev_carries.fillna(0)+x.career_prev_receptions.fillna(0)
    x["recent_touches"]=x.prev_carries.fillna(0)+x.prev_receptions.fillna(0)
    x["age_x_career_touches"]=x.age_at_draft*x.career_touches
    x["heavy_recent_load"]=(x.recent_touches>=300).astype(float)
    x["breakout"]=((x.ppg_pct>=.75)&((x.ppg_pct-x.prev_ppg_pct)>=.20)&(x.games>=8)&(x.prev_games>=8)).astype(int)
    x["performance_decline"]=((x.prev_ppg_pct>=.55)&((x.prev_ppg_pct-x.ppg_pct)>=.20)&(x.games>=8)&(x.prev_games>=8)).astype(int)
    x["availability_drop"]=((x.games<=8)&(x.prev_games>=12)).astype(int)
    x["downside_event"]=((x.prev_ppg_pct>=.55)&(x.prev_games>=8)&(x.performance_decline.astype(bool)|x.availability_drop.astype(bool))).astype(int)
    return x

def make_logistic():
    return Pipeline([("imp",SimpleImputer(strategy="median",add_indicator=True)),("scale",StandardScaler()),("model",LogisticRegression(max_iter=5000,C=.25))])

def make_ridge():
    return Pipeline([("imp",SimpleImputer(strategy="median",add_indicator=True)),("scale",StandardScaler()),("model",Ridge(alpha=10.0))])

def binary_eval(z,target,specs,first_test):
    years=sorted(int(y) for y in z.season.unique() if y>=first_test)
    out={}
    for label,features in specs.items():
        rows=[]
        for y in years:
            tr=z[z.season<y]; te=z[z.season==y]
            if len(tr)<80 or tr[target].nunique()<2 or te[target].nunique()<2:
                continue
            mdl=make_logistic(); mdl.fit(tr[features],tr[target])
            p=mdl.predict_proba(te[features])[:,1]
            rows.append(pd.DataFrame({"season":y,"y":te[target].to_numpy(),"p":p}))
        if not rows:
            continue
        pr=pd.concat(rows,ignore_index=True)
        q=pr.p.quantile(.8); top=pr[pr.p>=q]
        agg={"n":int(len(pr)),"positives":int(pr.y.sum()),"auc":float(roc_auc_score(pr.y,pr.p)),"brier":float(brier_score_loss(pr.y,pr.p)),"logloss":float(log_loss(pr.y,pr.p,labels=[0,1])),"top20_precision":float(top.y.mean()),"top20_n":int(len(top))}
        annual={}
        for y,g in pr.groupby("season"):
            annual[str(int(y))]={"n":int(len(g)),"positives":int(g.y.sum()),"auc":float(roc_auc_score(g.y,g.p)) if g.y.nunique()>1 else None,"brier":float(brier_score_loss(g.y,g.p))}
        out[label]={"features":features,"aggregate":agg,"annual":annual}
    return out

def continuous_eval(z,specs,first_test):
    years=sorted(int(y) for y in z.season.unique() if y>=first_test)
    out={}
    for label,features in specs.items():
        rows=[]
        for y in years:
            tr=z[z.season<y]; te=z[z.season==y]
            if len(tr)<80:
                continue
            mdl=make_ridge(); mdl.fit(tr[features],tr.ppg_pct)
            p=np.clip(mdl.predict(te[features]),0,1)
            rows.append(pd.DataFrame({"season":y,"y":te.ppg_pct.to_numpy(),"p":p}))
        if not rows:
            continue
        pr=pd.concat(rows,ignore_index=True)
        agg={"n":int(len(pr)),"rmse":float(math.sqrt(mean_squared_error(pr.y,pr.p))),"mae":float(mean_absolute_error(pr.y,pr.p)),"spearman":float(spearmanr(pr.y,pr.p).statistic)}
        annual={}
        for y,g in pr.groupby("season"):
            annual[str(int(y))]={"n":int(len(g)),"rmse":float(math.sqrt(mean_squared_error(g.y,g.p))),"mae":float(mean_absolute_error(g.y,g.p)),"spearman":float(spearmanr(g.y,g.p).statistic)}
        out[label]={"features":features,"aggregate":agg,"annual":annual}
    return out

def unique(base,*groups):
    return list(dict.fromkeys(base + [c for g in groups for c in g]))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--stats-dir",type=Path,required=True)
    ap.add_argument("--rank-history",type=Path)
    ap.add_argument("--market",type=Path)
    ap.add_argument("--roster-dir",type=Path)
    ap.add_argument("--first-test",type=int,default=2019)
    ap.add_argument("--out",type=Path,default=Path("historical_validation_report.json"))
    a=ap.parse_args()
    d=add_market(add_rank_history(read_stats(a.stats_dir),a.rank_history),a.market)
    x=build_rows(d,load_rosters(a.roster_dir))
    market=[]; market_label=[]
    if "ecr" in x and x.ecr.notna().mean()>0:
        market.append("ecr"); market_label.append("historical FantasyPros Half-PPR overall ECR proxy")
    if "ecr_quality_pct" in x and x.ecr_quality_pct.notna().mean()>0:
        market.append("ecr_quality_pct"); market_label.append("within-position historical FantasyPros ECR quality")
    for c,label in [("sleeper_adp","historical Sleeper ADP"),("market_adp","historical market ADP")]:
        if c in x and x[c].notna().mean()>0:
            market.append(c); market_label.append(label)
    if not market:
        raise SystemExit("No season-t historical market/rank baseline available; refusing promotion-grade run.")
    base=list(dict.fromkeys(market+["prev_ppg_pct"]))
    wr_volume=["prev_targets","prev_receptions","prev_receiving_yards","prev_receiving_tds","prev_receiving_first_downs","prev_target_share","prev_air_yards_share","prev_wopr"]
    wr_eff=["prev_rec_ypt","prev_rec_td_rate","prev_receiving_yards_after_catch"]
    wr_career=["career_prev_games","career_prev_targets","career_prev_receptions","career_prev_half_points","career_prev_seasons"]
    rb_age=["age_at_draft","years_exp"]
    rb_career=["age_at_draft","years_exp","career_prev_games","career_touches","age_x_career_touches"]
    rb_recent=["age_at_draft","years_exp","prev_carries","prev_targets","prev_receptions","recent_touches","heavy_recent_load"]
    rb_eff=["age_at_draft","years_exp","prev_rush_ypc","prev_rush_td_rate","prev_rec_ypt","prev_rec_td_rate"]
    rb_recv=["age_at_draft","years_exp","prev_targets","prev_receptions","prev_receiving_yards","prev_target_share"]
    wr_specs={"market_only":market,"market_plus_prior":base,"volume":unique(base,wr_volume),"efficiency":unique(base,wr_eff),"career":unique(base,wr_career),"full_residual":unique(base,wr_volume,wr_eff,wr_career)}
    rb_specs={"market_only":market,"market_plus_prior":base,"age_experience":unique(base,rb_age),"career_workload":unique(base,rb_career),"recent_workload":unique(base,rb_recent),"efficiency":unique(base,rb_eff),"receiving_role":unique(base,rb_recv),"full_residual":unique(base,rb_age,rb_career,rb_recent,rb_eff,rb_recv)}
    wr=x[(x.position=="WR")&x.prev_ppg_pct.notna()&x.ecr_quality_pct.notna()&(x.prev_games>=8)].copy()
    rb=x[(x.position=="RB")&x.prev_ppg_pct.notna()&x.ecr_quality_pct.notna()&(x.prev_games>=8)].copy()
    rb_perf=rb[(rb.prev_ppg_pct>=.55)&(rb.games>=8)].copy()
    rb_down=rb[rb.prev_ppg_pct>=.55].copy()
    wr_cont=wr[wr.games>=8].copy(); rb_cont=rb[rb.games>=8].copy()
    report={"architecture":{"split":"rolling-origin by season; no random row split","football_predictor_chronology":"season t-1 or earlier only","market_chronology":"season-t preseason/draft-date only","market_baseline":market_label,"scope":"returning NFL WR/RB only; rookie submodel not tested","calibration_note":"unweighted logistic regression; no class_weight probability distortion","promotion":"research-only; Companion live activation requires separate decision/counterfactual utility gate"},"coverage":{"stats_seasons":[int(d.season.min()),int(d.season.max())],"rank_seasons":[int(d.loc[d.ecr.notna(),"season"].min()),int(d.loc[d.ecr.notna(),"season"].max())],"wr_rows":int(len(wr)),"rb_rows":int(len(rb))},"wr_breakout":binary_eval(wr,"breakout",wr_specs,a.first_test),"rb_performance_decline":binary_eval(rb_perf,"performance_decline",rb_specs,a.first_test),"rb_downside_event":binary_eval(rb_down,"downside_event",rb_specs,a.first_test),"wr_continuous_performance":continuous_eval(wr_cont,wr_specs,a.first_test),"rb_continuous_performance":continuous_eval(rb_cont,rb_specs,a.first_test)}
    a.out.write_text(json.dumps(report,indent=2,ensure_ascii=False)); print(json.dumps(report,indent=2,ensure_ascii=False))

if __name__=="__main__":
    main()
