#!/usr/bin/env python3
# Reuse the audited multi-lens evaluator unchanged except for raw/output filenames.
import pathlib,runpy
p=pathlib.Path('research/rc459_cf_multilens_eval_2026.py')
s=p.read_text()
s=s.replace("RAW=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH_2026.json')","RAW=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH100_2026.json')")
s=s.replace("OUT=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH_MULTILENS_2026.json')","OUT=pathlib.Path('counterfactual_2026/RC459_CF_MARKET_BREADTH100_MULTILENS_2026.json')")
ns={};exec(compile(s,str(p),'exec'),ns,ns)
