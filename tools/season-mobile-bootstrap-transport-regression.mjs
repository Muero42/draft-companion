import fs from 'node:fs';
const src=fs.readFileSync('app.js','utf8');const a=src.indexOf('async function bootstrapSeasonWorkspace()'),z=src.indexOf('\nasync function fetchDraftFresh',a);if(a<0||z<0)throw new Error('bootstrap missing');const b=src.slice(a,z);
const season=b.indexOf('const season=await fetchSeasonLeagueState({})');
const players=b.indexOf("jf(\`\${S}/players/nfl?_=\${bust}\`,'Season Spieler',15000)");
const draft=b.indexOf("'Draft-Archiv',6500");
if([season,players,draft].some(x=>x<0))throw new Error('season-first transport stages missing');
if(!(season<players&&players<draft))throw new Error('historical draft precedes/gates live season hydration');
if(b.includes('CANONICAL_DRAFT_NOT_COMPLETE')||b.includes('await fetchDraft(id)'))throw new Error('legacy draft gate remains in season bootstrap');
if(!b.includes("catch(e){console.warn('PITTI optional draft archive unavailable'"))throw new Error('draft archive failure is not optional');
for(const token of ["console.error('PITTI season bootstrap failed'","if(els.waiverStatus)","if(els.tradeStatus)"])if(!b.includes(token))throw new Error('missing fail-visible contract '+token);
console.log('season-first mobile bootstrap transport regression PASS');

if(!src.includes("'Season-Identität',5000"))throw new Error('fresh-origin league identity recovery missing');
