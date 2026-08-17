#!/usr/bin/env python3
"""PITTI Research Residual historical validator.

Leakage-safe player-season validation for WR breakout and RB decline.
Input: nflverse season CSVs named stats_player_reg_<year>.csv or player_stats_<year>.csv.
Optional market CSV: market_baseline.csv with season, player_name and sleeper_adp/ecr_rank.
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, brier_score_loss, log_loss
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder

POS={'WR','RB'}

def norm_name(s):
    s=str(s or '').lower()
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b\.?','',s)
    return re.sub(r'[^a-z0-9]','',s)

def first_col(df,*names):
    for n in names:
        if n in df.columns:return n
    return None

def load_stats(root:Path):
    files=sorted(list(root.glob('stats_player_reg_*.csv'))+list(root.glob('player_stats_*.csv')))
    if not files: raise SystemExit('No season CSVs found')
    rows=[]
    for f in files:
        y=int(re.findall(r'(20\d{2})',f.name)[-1]); d=pd.read_csv(f,low_memory=False); d['season']=y; rows.append(d)
    d=pd.concat(rows,ignore_index=True)
    ren={}
    for target,cands in {
      'player_name':['player_display_name','player_name','display_name'], 'position':['position','position_group'],
      'games':['games','games_played'], 'targets':['targets'], 'receptions':['receptions'], 'rec_yards':['receiving_yards','rec_yards'],
      'rec_tds':['receiving_tds','rec_tds'], 'carries':['carries','rushing_attempts'], 'rush_yards':['rushing_yards','rush_yards'],
      'rush_tds':['rushing_tds','rush_tds']}.items():
        c=first_col(d,*cands)
        if c:ren[c]=target
    d=d.rename(columns=ren)
    req=['player_name','position','games']; miss=[x for x in req if x not in d]
    if miss:raise SystemExit(f'Missing required columns: {miss}; have {list(d.columns)}')
    for c in ['targets','receptions','rec_yards','rec_tds','carries','rush_yards','rush_tds']:
        if c not in d:d[c]=0
        d[c]=pd.to_numeric(d[c],errors='coerce').fillna(0)
    d['half_points']=d.receptions*.5+d.rec_yards*.1+d.rec_tds*6+d.rush_yards*.1+d.rush_tds*6
    d['position']=d.position.astype(str).str.upper(); d=d[d.position.isin(POS)].copy(); d['name_key']=d.player_name.map(norm_name)
    d['games']=pd.to_numeric(d.games,errors='coerce').fillna(0)
    d['ppg']=np.where(d.games>0,d.half_points/d.games,np.nan)
    d['ppg_pct']=d.groupby(['season','position']).ppg.rank(pct=True)
    return d

def add_market(d, path):
    if not path:return d
    m=pd.read_csv(path); m['name_key']=m.player_name.map(norm_name)
    keep=['season','name_key']+[c for c in ['sleeper_adp','ecr_rank'] if c in m]
    return d.merge(m[keep].drop_duplicates(['season','name_key']),on=['season','name_key'],how='left')

def build_rows(d):
    lag=d.copy(); lag['season']=lag.season+1
    cols=['season','name_key','position','games','targets','receptions','rec_yards','rec_tds','carries','rush_yards','rush_tds','half_points','ppg','ppg_pct']
    lag=lag[cols].rename(columns={c:f'prev_{c}' for c in cols if c not in ['season','name_key','position']})
    x=d.merge(lag,on=['season','name_key','position'],how='inner')
    x['breakout']=((x.ppg_pct>=.75)&((x.ppg_pct-x.prev_ppg_pct)>=.20)&(x.games>=8)).astype(int)
    x['decline']=((x.prev_ppg_pct>=.55)&((x.prev_ppg_pct-x.ppg_pct)>=.20)&(x.games>=8)).astype(int)
    x['availability_drop']=((x.games<=8)&(x.prev_games>=12)).astype(int)
    return x

def evaluate(x,pos,target,features,baseline,first_test):
    z=x[(x.position==pos)&x[target].notna()].copy(); years=sorted(y for y in z.season.unique() if y>=first_test); preds=[]
    for y in years:
        tr=z[z.season<y]; te=z[z.season==y]
        if len(tr)<50 or te[target].nunique()<2 or tr[target].nunique()<2:continue
        def fit(fs):
            cat=['position'] if 'position' in fs else []; num=[c for c in fs if c not in cat]
            pre=ColumnTransformer([('num',Pipeline([('imp',SimpleImputer(strategy='median')),('scale',StandardScaler())]),num),('cat',OneHotEncoder(handle_unknown='ignore'),cat)],remainder='drop')
            mdl=Pipeline([('pre',pre),('lr',LogisticRegression(max_iter=3000,class_weight='balanced',C=.5))]); mdl.fit(tr[fs],tr[target]); return mdl.predict_proba(te[fs])[:,1]
        for kind,fs in [('baseline',baseline),('residual',baseline+features)]:
            p=fit(fs); preds.append(pd.DataFrame({'season':y,'y':te[target].to_numpy(),'p':p,'kind':kind,'player':te.player_name.to_numpy()}))
    if not preds:return None
    p=pd.concat(preds,ignore_index=True); out={}
    for k,g in p.groupby('kind'):
        auc=roc_auc_score(g.y,g.p) if g.y.nunique()>1 else None; q=g.p.quantile(.8); top=g[g.p>=q]
        out[k]={'n':len(g),'positives':int(g.y.sum()),'auc':auc,'brier':brier_score_loss(g.y,g.p),'logloss':log_loss(g.y,g.p,labels=[0,1]),'top20_precision':float(top.y.mean()),'top20_n':len(top)}
    out['delta']={k:(out['residual'][k]-out['baseline'][k] if out['residual'][k] is not None and out['baseline'][k] is not None else None) for k in ['auc','brier','logloss','top20_precision']}
    return out

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--stats-dir',type=Path,required=True); ap.add_argument('--market',type=Path); ap.add_argument('--out',type=Path,default=Path('historical_validation_report.json')); ap.add_argument('--first-test',type=int,default=2022); a=ap.parse_args()
    d=add_market(load_stats(a.stats_dir),a.market); x=build_rows(d)
    market=[c for c in ['sleeper_adp','ecr_rank'] if c in x and x[c].notna().mean()>.5]; base=market if market else ['prev_ppg_pct']
    wr=['prev_games','prev_targets','prev_receptions','prev_rec_yards','prev_rec_tds','prev_ppg','prev_ppg_pct']
    rb=['prev_games','prev_carries','prev_rush_yards','prev_rush_tds','prev_targets','prev_receptions','prev_rec_yards','prev_ppg','prev_ppg_pct']
    report={'architecture':'rolling-origin; season t labels; season t-1 football features only','market_baseline':base,'rows':len(x),'season_range':[int(x.season.min()),int(x.season.max())],
            'wr_breakout':evaluate(x,'WR','breakout',wr,base,a.first_test),'rb_decline':evaluate(x,'RB','decline',rb,base,a.first_test)}
    a.out.write_text(json.dumps(report,indent=2,ensure_ascii=False)); print(json.dumps(report,indent=2,ensure_ascii=False))
if __name__=='__main__':main()
