import fs from 'node:fs';
import vm from 'node:vm';

const src=fs.readFileSync('app.js','utf8');
if(!src.includes("v11.8.0-rc4.130"))throw new Error('rc4.130 version missing');
if(!src.includes("historyKeep===0?[]:history.slice(-historyKeep)"))throw new Error('zero-history recovery fix missing');
if(!src.includes("const{panelIndividuals,robustRankShadow,...rest}=p"))throw new Error('rankedPool quota compaction missing');

const start=src.indexOf('function compactDecisionFixtureForStorage');
const end=src.indexOf('function resolveReturnValidation',start);
if(start<0||end<0)throw new Error('decision fixture storage block missing');
const helper=src.slice(start,end);

function makeCtx(limit){
  const m=new Map();
  const localStorage={
    getItem:k=>m.has(k)?m.get(k):null,
    setItem:(k,v)=>{
      if(String(v).length>limit){const e=new Error('QuotaExceededError');e.name='QuotaExceededError';throw e}
      m.set(k,String(v));
    }
  };
  const ctx={
    localStorage,JSON,
    resolveActiveDraftId:()=> 'D2',
    draftId:x=>x,
    els:{draftInput:{value:'D2'}}
  };
  vm.createContext(ctx);
  vm.runInContext(helper,ctx);
  return{ctx,m};
}
function fixture(draftId,i){
  return {
    id: draftId+'|'+i,
    draftId,
    current:i,
    rankedPool:[{
      name:'Player '+i,
      panelIndividuals:Array.from({length:25},(_,j)=>({expertName:'E'+j,rank:j+1,w:1})),
      robustRankShadow:{weightedMedian:10,winsorizedMean:11},
      panelRank:12,
      adp:13
    }],
    candidates:[{name:'Candidate '+i,blob:'x'.repeat(320)}]
  };
}

// Reproduce the rc4.129 defect: 22 historical rows plus active rows exceed quota.
// The final historyKeep=0 attempt must mean truly zero history (slice(-0) would keep all history).
{
  const {ctx,m}=makeCtx(2600);
  const rows=[
    ...Array.from({length:22},(_,i)=>fixture('D1',i)),
    ...Array.from({length:4},(_,i)=>fixture('D2',100+i))
  ];
  const ok=ctx.saveDecisionFixtures(rows);
  if(!ok)throw new Error('active-only recovery should succeed');
  const stored=JSON.parse(m.get('v118_decisionFixtures'));
  if(stored.length!==4||stored.some(x=>x.draftId!=='D2'))throw new Error('history was not fully evicted at zero-history recovery');
  if(stored.some(x=>x.rankedPool?.some(p=>'panelIndividuals' in p||'robustRankShadow' in p)))throw new Error('redundant rankedPool fields were persisted');
}

// Atomicity: if even the active draft cannot fit, do not silently trim active rows.
{
  const {ctx,m}=makeCtx(120);
  const rows=[fixture('D2',1),fixture('D2',2)];
  const ok=ctx.saveDecisionFixtures(rows);
  if(ok)throw new Error('oversized active evidence must fail closed');
  if(m.has('v118_decisionFixtures'))throw new Error('partial active evidence was written');
}

console.log('rc4.130 active fixture quota recovery PASS');
