import fs from 'node:fs';

let app=fs.readFileSync('app.js','utf8');
function replaceOnce(from,to,label){const i=app.indexOf(from);if(i<0)throw new Error(`missing hardening anchor: ${label}`);if(app.indexOf(from,i+from.length)>=0)throw new Error(`ambiguous hardening anchor: ${label}`);app=app.slice(0,i)+to+app.slice(i+from.length);console.log(`hardening anchor OK: ${label}`)}

replaceOnce(
  "const m=part.trim().match(/^(\\d+)\\s*=.*?\\[(manual|autodraft|auto)\\]\\s*$/i);if(m)out[Number(m[1])]=m[2].toLowerCase()==='manual'?'manual':'autodraft'",
  "const m=part.trim().match(/^(\\d+)\\s*=.*?\\[(manual|autodraft|infer)\\]\\s*$/i);if(m){const v=m[2].toLowerCase();out[Number(m[1])]=v==='manual'?'manual':v==='autodraft'?'autodraft':'infer'}",
  'explicit mode syntax has unambiguous infer reset'
);
replaceOnce("return hit?.mode||null}","return hit?.mode==='infer'?null:(hit?.mode||null)}",'infer segment clears explicit override');
replaceOnce(
  "if(specials.length>=2&&Math.abs(specials[1].pick-specials[0].pick)<=12&&specials[1].pick<=100)p=.62;",
  "if(specials.length>=2&&Math.abs(specials[1].pick-specials[0].pick)<=12&&specials[1].pick<=95)p=.82;",
  'strong autodraft inference can cross mode threshold'
);
replaceOnce("return clamp(p,0,.75)}","return clamp(p,0,.90)}",'autodraft inference cap permits strong automatic mode switch');
replaceOnce(
  "observedMode=observedManagerMode(pk),effective=effectiveManagerMode({explicitMode,observedMode,inferredAutodraft:inferred})",
  "observedMode=observedManagerMode(pk),inferredAtPick=inferManagerAutodraftProbability(mine.filter(q=>Number(q.pick_no)<=Number(pk.pick_no)),players),effective=effectiveManagerMode({explicitMode,observedMode,inferredAutodraft:inferredAtPick})",
  'autodraft inference is prefix-causal per pick'
);
replaceOnce(
  "const weight=explicitMode==='manual'||observedMode==='manual'?1:Math.max(.15,1-.85*inferred);",
  "const weight=explicitMode==='manual'||observedMode==='manual'?1:Math.max(.15,1-.85*inferredAtPick);",
  'manual learning weight uses only evidence available at that pick'
);
replaceOnce(
  "}LIVE_MANAGER_ADAPTATION_STATE=out;return out}",
  "}for(const s of Object.values(out)){const explicitNow=explicitManagerModeAt(segments,s.slot,current);if(explicitNow){s.currentMode=explicitNow;s.explicitMode=explicitNow}else if((segments?.[s.slot]||[]).some(x=>x.mode==='infer'&&Number(x.fromPick)<=Number(current))){s.explicitMode=null}}LIVE_MANAGER_ADAPTATION_STATE=out;return out}",
  'current explicit mode applies before next manager pick and infer can release it'
);
replaceOnce(
  "function liveManagerStateForProfile(profile){return LIVE_MANAGER_ADAPTATION_STATE[norm(profile?.label||'')]||null}",
  "function liveManagerStateForProfile(profile){return LIVE_MANAGER_ADAPTATION_STATE[norm(profile?.label||'')]||null}\nfunction liveManagerDiagnostics(){const rows=Object.values(LIVE_MANAGER_ADAPTATION_STATE);if(!rows.length)return'keine Live-Updates';return rows.map(s=>`${s.name}: ${s.currentMode} · n=${Number(s.humanObservations||0).toFixed(1)} · Live-Gewicht ${Math.round((s.currentDraftWeight||0)*100)}% · Auto-P ${Math.round((s.autodraftProbability||0)*100)}%${s.explicitMode?' · expl. '+s.explicitMode:''}`).join(' | ')}",
  'manager provenance diagnostics'
);
replaceOnce(
  "      favorites=scored.slice(0,5),\n      snapshotLimit=els.snapshotMode.value==='full'?40:25,",
  "      favorites=scored.slice(0,5),\n      snapshotCandidates=visibleCoachCandidates(scored),\n      snapshotLimit=els.snapshotMode.value==='full'?40:25,",
  'snapshot dynamic candidate set'
);
replaceOnce(
  "      ...(mode==='live'&&rv2?.collisions?(()=>{",
  "      ...(mode==='live'?[`Manager-Live-Adaption: ${liveManagerDiagnostics()}`]:[]),\n      ...(mode==='live'&&rv2?.collisions?(()=>{",
  'snapshot manager provenance line'
);
replaceOnce("    lines.push('','TOP 5 LIVE-ENTSCHEIDUNG');","    lines.push('','LIVE-ENTSCHEIDUNG · BIS ZU 10 NÜTZLICHE KANDIDATEN');",'snapshot candidate heading');
replaceOnce("    }else if(favorites.length){\n      favorites.forEach((x,i)=>lines.push(`","    }else if(snapshotCandidates.length){\n      snapshotCandidates.forEach((x,i)=>lines.push(`",'snapshot candidate source');
replaceOnce(
  " | ${x.action} | Loss ${x.loss}`));",
  " | ${x.outsideNormalCut?'FALLBACK AUSSERHALB NORMAL-CUT · '+x.action+' NUR KONTEXT':x.action} | Loss ${x.loss}`));",
  'snapshot fallback authority label'
);
replaceOnce(
  "managerMap:els.managerMap.value,managerProfileHash:MANAGER_PROFILE_SOURCE_HASH}",
  "managerMap:els.managerMap.value,managerModeSegments:loadManagerModeSegments(),managerProfileHash:MANAGER_PROFILE_SOURCE_HASH}",
  'backup manager mode segments'
);
replaceOnce(
  "if(typeof v.managerMap==='string')els.managerMap.value=v.managerMap;persist();renderAll()}",
  "if(typeof v.managerMap==='string')els.managerMap.value=v.managerMap;if(v.managerModeSegments&&typeof v.managerModeSegments==='object')saveManagerModeSegments(v.managerModeSegments);persist();renderAll()}",
  'restore manager mode segments'
);

fs.writeFileSync('app.js',app);
console.log('rc4.52 finalization hardening applied');
