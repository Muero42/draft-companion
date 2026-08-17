#!/usr/bin/env python3
"""Rookie WR/RB residual sanity test: does NFL draft capital/age add beyond preseason ECR?

Research-only. Rolling-origin by season. Rookie-year NFL outcomes are labels only.
No college-production model is implied by this limited structural challenger.
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import spearmanr
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import roc_auc_score, brier_score_loss, log_loss, mean_squared_error, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

def norm(s):
    s=str(s or '').lower(); s=re.sub(r'\b(jr|sr|ii|iii|iv)\b\.?','',s); return re.sub(r'[^a-z0-9]','',s)

def load_stats(root):
    rows=[]
    for f in sorted(root.glob('stats_player_reg_*.csv')):
        y=int(re.findall(r'(20\d{2})',f.name)[-1]); q=pd.read_csv(f,low_memory=False); q['season']=y; rows.append(q)
    d=pd.concat(rows,ignore_index=True); d['position']=d.position.astype(str).str.upper(); d=d[d.position.isin(['WR','RB'])].copy()
    d['player_name']=d.player_display_name; d['name_key']=d.player_name.map(norm)
    d['half_points']=d.fantasy_points.fillna(0)+.5*d.receptions.fillna(0); d['ppg']=np.where(d.games>0,d.half_points/d.games,np.nan)
    d['ppg_pct']=d.groupby(['season','position']).ppg.rank(pct=True); return d

def load_rosters(root):
    rows=[]
    for f in sorted(root.glob('roster_*.csv')):
        y=int(re.findall(r'(20\d{2})',f.name)[-1]); q=pd.read_csv(f,low_memory=False)
        q=q[['gsis_id','birth_date','years_exp','rookie_year','draft_number']].copy(); q['season']=y; q=q.groupby(['season','gsis_id'],as_index=False).first()
        q=q.rename(columns={'gsis_id':'player_id'}); bd=pd.to_datetime(q.birth_date,errors='coerce'); q['age_at_draft']=(pd.Timestamp(f'{y}-09-01')-bd).dt.days/365.2425; rows.append(q)
    return pd.concat(rows,ignore_index=True)

def load_ecr(root):
    rows=[]
    for f in sorted(root.glob('fantasypros_ecr_*.csv')):
        q=pd.read_csv(f); q['position']=q.pos.astype(str).str.upper(); q=q[q.position.isin(['WR','RB'])].copy(); q['name_key']=q.player_name.map(norm); q['ecr']=pd.to_numeric(q.ecr,errors='coerce')
        n=q.groupby(['season','position']).ecr.transform('count'); q['ecr_quality_pct']=1-q.groupby(['season','position']).ecr.rank(pct=True)+1/n; rows.append(q[['season','position','name_key','ecr','ecr_quality_pct']])
    return pd.concat(rows,ignore_index=True)

def pipe(kind):
    est=LogisticRegression(max_iter=5000,C=.25) if kind=='bin' else Ridge(alpha=10); return Pipeline([('imp',SimpleImputer(strategy='median',add_indicator=True)),('scale',StandardScaler()),('model',est)])

def eval_bin(d,fs,first):
    out=[]
    for y in sorted(d.season.unique()):
        if y<first: continue
        tr=d[d.season<y]; te=d[d.season==y]
        if len(tr)<40 or tr.rookie_breakout.nunique()<2 or te.rookie_breakout.nunique()<2: continue
        m=pipe('bin'); m.fit(tr[fs],tr.rookie_breakout); p=m.predict_proba(te[fs])[:,1]; out.append(pd.DataFrame({'season':y,'y':te.rookie_breakout,'p':p}))
    p=pd.concat(out); q=p.p.quantile(.8); top=p[p.p>=q]
    return {'n':len(p),'positives':int(p.y.sum()),'auc':roc_auc_score(p.y,p.p),'brier':brier_score_loss(p.y,p.p),'logloss':log_loss(p.y,p.p),'top20_precision':float(top.y.mean()),'annual':{str(y):{'auc':roc_auc_score(g.y,g.p),'brier':brier_score_loss(g.y,g.p)} for y,g in p.groupby('season')}}

def eval_cont(d,fs,first):
    d=d[d.games>=8]; out=[]
    for y in sorted(d.season.unique()):
        if y<first: continue
        tr=d[d.season<y]; te=d[d.season==y]
        if len(tr)<40: continue
        m=pipe('cont'); m.fit(tr[fs],tr.ppg_pct); p=np.clip(m.predict(te[fs]),0,1); out.append(pd.DataFrame({'season':y,'y':te.ppg_pct,'p':p}))
    p=pd.concat(out); return {'n':len(p),'rmse':mean_squared_error(p.y,p.p)**.5,'mae':mean_absolute_error(p.y,p.p),'spearman':spearmanr(p.y,p.p).statistic}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--stats-dir',type=Path,required=True); ap.add_argument('--roster-dir',type=Path,required=True); ap.add_argument('--ecr-dir',type=Path,required=True); ap.add_argument('--first-test',type=int,default=2021); ap.add_argument('--out',type=Path,default=Path('rookie_residual_report.json')); a=ap.parse_args()
    x=load_stats(a.stats_dir).merge(load_rosters(a.roster_dir),on=['season','player_id'],how='left').merge(load_ecr(a.ecr_dir),on=['season','position','name_key'],how='left')
    x=x[(x.season==x.rookie_year)&x.ecr.notna()].copy(); x['rookie_breakout']=((x.games>=8)&(x.ppg_pct>=.75)).astype(int)
    specs={'ecr':['ecr','ecr_quality_pct'],'draft_capital':['ecr','ecr_quality_pct','draft_number'],'draft_capital_age':['ecr','ecr_quality_pct','draft_number','age_at_draft']}
    rep={'architecture':'rookie-only rolling-origin; ECR baseline; draft capital/age known preseason; NFL rookie outcome labels only','positions':{}}
    for pos in ['WR','RB']:
        z=x[x.position==pos]; rep['positions'][pos]={k:{'breakout':eval_bin(z,fs,a.first_test),'continuous':eval_cont(z,fs,a.first_test)} for k,fs in specs.items()}
    a.out.write_text(json.dumps(rep,indent=2)); print(json.dumps(rep,indent=2))
if __name__=='__main__': main()
