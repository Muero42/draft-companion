import fs from 'node:fs';
import zlib from 'node:zlib';
const data=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync('research/expert-v2-exact-return-input-v2.json.gz.b64','utf8').replace(/\s+/g,''),'base64')).toString('utf8'));
const wr=Object.fromEntries(Object.entries(data.pool).filter(([,p])=>p.pos==='WR').map(([k,p])=>[k,{name:p.name,incRank:p.incRank,v2Rank:p.v2Rank,adp:p.adp,team:p.team,yearsExp:p.yearsExp}]));
console.log('WR_V2_MAP='+JSON.stringify(wr));
console.log('FIXTURES='+JSON.stringify(data.fixtures.map(f=>({current:f.current,next:f.next,available:f.available,rosters:f.rosters,capturedReturn:f.capturedReturn}))));
