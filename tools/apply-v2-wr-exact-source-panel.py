from pathlib import Path
p=Path('app.js')
s=p.read_text()
old="""  // Gianni/Bobal WR boards are near-duplicates, so Bobal is shrunk; Harmon supplies specialist diversity.
  v2wr:{name:'v2 Shadow · WR',list:[['Guilherme Gianni',40],['Matt Harmon',35],['Michael Bobal',15],['Pat Fitzmaurice',10]],max:4},
"""
new="""  // WR exact-source panel: Harmon is excluded while no fresh exact individual board is ingestible.
  // Gianni/Bobal are near-duplicates (rho .997); Bobal is shrunk. Pat adds the stronger multi-year WR signal.
  v2wr:{name:'v2 Shadow · WR',list:[['Guilherme Gianni',45],['Pat Fitzmaurice',40],['Michael Bobal',15]],max:3},
"""
if s.count(old)!=1: raise SystemExit(f'v2 WR preset mismatch: {s.count(old)}')
s=s.replace(old,new)
p.write_text(s)
