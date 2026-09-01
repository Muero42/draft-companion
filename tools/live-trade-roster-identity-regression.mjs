import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const token of [
  'const myLiveRosterId=Number(live?.my_roster?.roster_id)',
  'Sleeper roster_id is a league roster identifier, NOT the historical draft slot.',
  'if(live?.ok?slot===myLiveRosterId:slot===userSlot)continue;'
])if(!s.includes(token))throw new Error('live trade identity guard missing: '+token);
if(s.includes('if(slot===userSlot)continue;'))throw new Error('stale draft-slot exclusion remains in live trade path');
console.log('live trade roster identity regression PASS');
