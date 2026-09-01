import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
const fn=s.indexOf('async function bootstrapSeasonWorkspace()');if(fn<0)throw new Error('bootstrap missing');const end=s.indexOf('\nasync function fetchDraftFresh',fn);const b=s.slice(fn,end);
const ctx=b.indexOf('lastDraftContext={id,current:total');const rosterFa=b.indexOf('renderRosterFaAudit(rows,available||[],true)');const trade=b.indexOf('renderTradeWorkspace(picks,players,slot,teams,true)');const waiver=b.indexOf('renderWaiverWorkspace(true)');const action=b.indexOf('renderSeasonActionBoard(true)');const status=b.indexOf('updateStatus();');
if(ctx<0||rosterFa<0||trade<0||waiver<0||action<0||status<0)throw new Error('season bootstrap tokens missing');
if(!(ctx<rosterFa&&rosterFa<trade&&trade<waiver&&waiver<action&&action<status))throw new Error('season surfaces/status not rerendered in canonical post-hydration order');
if(!b.includes("if(!completed)throw new Error('CANONICAL_DRAFT_NOT_COMPLETE')"))throw new Error('silent incomplete-draft return remains');
console.log('season bootstrap render-order regression PASS');

const draftFirst=b.indexOf("jf(\`${S}/draft/\${id}?_=\${bust}\`,'Season Draft',6500)");
const picksFirst=b.indexOf("jf(\`${S}/draft/\${id}/picks?_=\${bust}\`,'Season Picks',6500)");
const playersLater=b.indexOf("const players=await jf(\`${S}/players/nfl?_=\${bust}\`,'Season Spieler',15000)");
const completion=b.indexOf("if(!completed)throw new Error('CANONICAL_DRAFT_NOT_COMPLETE')");
if(draftFirst<0||picksFirst<0||playersLater<0||completion<0||!(completion<playersLater))throw new Error('mobile bootstrap transport is not draft/picks-first');
if(!b.includes("if(els.waiverWorkspace)els.waiverWorkspace.innerHTML=fail")||!b.includes("if(els.tradeWorkspace)els.tradeWorkspace.innerHTML=fail"))throw new Error('season bootstrap failure is not surfaced on waiver/trade');
console.log('season mobile transport/failure observability regression PASS');
