import fs from 'node:fs';

const file=process.argv[2];
const selfTest=process.argv.includes('--self-test');
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');

function auditBackup(d){
  if(!d||typeof d!=='object')throw new Error('backup object missing');
  const fixtures=Array.isArray(d.decisionFixtures)?d.decisionFixtures:[];
  const activeDraft=(String(d.draft||'').match(/(\d{10,})/)||[])[1]||String(fixtures.at(-1)?.draftId||'');
  const active=fixtures.filter(f=>String(f?.draftId||'')===activeDraft);
  const byPick=new Map();
  for(const f of active){
    const pick=Number(f.current); if(!Number.isFinite(pick))continue;
    if(!byPick.has(pick))byPick.set(pick,new Map());
    byPick.get(pick).set(String(f.analysisProfile||''),f);
  }
  const expectedProfiles=['expertv4','expertv5'];
  const picks=[...byPick.keys()].sort((a,b)=>a-b);
  const missingPairs=picks.flatMap(pick=>expectedProfiles.filter(p=>!byPick.get(pick).has(p)).map(profile=>({pick,missingProfile:profile})));
  const pairedPicks=picks.filter(pick=>expectedProfiles.every(p=>byPick.get(pick).has(p)));

  const panelRanks=d.panelRanks&&typeof d.panelRanks==='object'?d.panelRanks:{};
  const sparseTop10=[];
  const genericTop10=[];
  const genericTop1=[];
  const sparsePanelRows=new Map();
  const topDiffs=[];

  const specificEvidence=c=>{
    if(Array.isArray(c?.researchEvidence)&&c.researchEvidence.length)return true;
    const comps=Array.isArray(c?.researchResidual?.components)?c.researchResidual.components:[];
    return comps.some(x=>x&&typeof x==='object'&&(x.display===true||x.displayRisk===true));
  };

  for(const f of active){
    const profile=String(f.analysisProfile||'');
    for(const [idx,c] of (Array.isArray(f.candidates)?f.candidates:[]).slice(0,10).entries()){
      const panelId=String(c.panelId||'');
      const row=panelRanks?.[panelId]?.[norm(c.name)]||null;
      const n=Number.isFinite(Number(c.panelN))?Number(c.panelN):Number(row?.n);
      const intendedN=Number(row?.intendedN);
      if(Number.isFinite(n)&&Number.isFinite(intendedN)&&n<intendedN){
        const rec={pick:Number(f.current),profile,rank:idx+1,name:c.name,panelId,n,intendedN,missingExperts:Array.isArray(row?.missingExperts)?row.missingExperts:[],panelRank:c.panelRank??null,coachScore:c.coachScore??null};
        sparseTop10.push(rec);
        sparsePanelRows.set(panelId+'|'+norm(c.name),rec);
      }
      if(!specificEvidence(c)){
        const rec={pick:Number(f.current),profile,rank:idx+1,name:c.name,coachScore:c.coachScore??null};
        genericTop10.push(rec); if(idx===0)genericTop1.push(rec);
      }
    }
  }

  for(const pick of pairedPicks){
    const a=byPick.get(pick).get('expertv4'),b=byPick.get(pick).get('expertv5');
    const ta=a?.candidates?.[0]||null,tb=b?.candidates?.[0]||null;
    topDiffs.push({pick,v4:ta?{name:ta.name,score:ta.coachScore??null,panel:ta.panelRank??null}:null,v5:tb?{name:tb.name,score:tb.coachScore??null,panel:tb.panelRank??null}:null,sameTop:!!ta&&!!tb&&norm(ta.name)===norm(tb.name),chosen:a?.chosenPlayer?.name||b?.chosenPlayer?.name||null});
  }

  return {
    meta:{format:d.format||null,version:d.version||null,activeDraft,fixtureCount:active.length,ownPickStates:picks.length,pairedPickStates:pairedPicks.length},
    pairGate:{expectedPickStates:15,expectedFixtures:30,actualFixtures:active.length,actualPickStates:picks.length,pairedPickStates:pairedPicks.length,pass:active.length===30&&picks.length===15&&missingPairs.length===0,missingPairs},
    coverageAudit:{sparseTop10Count:sparseTop10.length,uniqueSparsePlayers:[...new Set(sparseTop10.map(x=>x.name))],sparseTop10,uniqueSparsePanelRows:[...sparsePanelRows.values()]},
    descriptionAudit:{top10Rows:active.reduce((n,f)=>n+Math.min(10,Array.isArray(f.candidates)?f.candidates.length:0),0),genericOnlyTop10Count:genericTop10.length,genericOnlyTop1Count:genericTop1.length,genericOnlyTop1:genericTop1,uniqueGenericPlayers:[...new Set(genericTop10.map(x=>x.name))]},
    pairedModelAudit:{pairedCount:topDiffs.length,sameTopCount:topDiffs.filter(x=>x.sameTop).length,differentTop:topDiffs.filter(x=>!x.sameTop),all:topDiffs}
  };
}

if(selfTest){
  const mk=(pick,profile,name,n=6,intendedN=6,specific=true)=>({draftId:'1234567890123',current:pick,analysisProfile:profile,candidates:[{name,panelId:profile==='expertv4'?'expert-v4-wr':'expert-v5-wr',panelN:n,panelRank:20,coachScore:100,researchEvidence:specific?[{x:1}]:[]}],chosenPlayer:{name}});
  const d={draft:'https://sleeper.app/draft/nfl/1234567890123',decisionFixtures:[mk(9,'expertv4','A',4,6,false),mk(9,'expertv5','A')],panelRanks:{'expert-v4-wr':{a:{n:4,intendedN:6,missingExperts:['E1','E2']}},'expert-v5-wr':{a:{n:6,intendedN:6,missingExperts:[]}}}};
  const r=auditBackup(d);
  if(r.pairGate.actualFixtures!==2||r.pairGate.pairedPickStates!==1)throw new Error('pair self-test failed');
  if(r.coverageAudit.sparseTop10Count!==1||r.coverageAudit.sparseTop10[0].missingExperts.length!==2)throw new Error('coverage self-test failed');
  if(r.descriptionAudit.genericOnlyTop1Count!==1)throw new Error('description self-test failed');
  console.log('PITTI_V45_BACKUP_AUDIT_SELF_TEST_PASS');
  process.exit(0);
}

if(!file){console.error('Usage: node tools/audit-v45-backup.mjs draft-companion-v7-backup-*.json');process.exit(2)}
const data=JSON.parse(fs.readFileSync(file,'utf8'));
console.log(JSON.stringify(auditBackup(data),null,2));
