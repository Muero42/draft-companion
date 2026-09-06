import fs from 'node:fs'; const s=fs.readFileSync('app.js','utf8');
for(const t of ["liveRosterMeta=new Map((live?.league_rosters||[])","managerLabel=t.manager?.manager_name","faab_remaining","${esc(managerLabel)}${faab}"]) if(!s.includes(t)) throw new Error('live trade manager/FAAB regression: '+t);
if(s.includes("Team/Slot ${t.slot}")) throw new Error('opaque roster id resurrected in trade UI');
console.log('live trade manager/FAAB regression PASS');