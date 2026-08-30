import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync('app.js','utf8');
const live=fs.readFileSync('live-surface-v3.js','utf8');
const v3src=fs.readFileSync('expert-v3-board.js','utf8');

const must=(s,x,msg)=>{if(!s.includes(x))throw new Error(msg+': '+x)};
must(app,"const APP_VERSION='v11.8.0-rc4.127'",'version');
must(app,'function sanitizeExpertPanelRow(id,row)','sanitizer');
must(app,'function expertPanelMembershipAudit(id)','membership audit');
must(app,"if((id==='expertv4'||id==='expertv5')&&expertPanelMembershipAudit(pid).length)return false;",'fail closed readiness');

// v5 WR intended set is DS + Mariano + Pat + Del Don + Boone + Koerner; Ryan Weisse is forbidden.
const v5Start=app.indexOf('function ensureExpertV5Panels');
const v5End=app.indexOf('function expertPanelMembershipAudit',v5Start);
if(v5Start<0||v5End<0)throw new Error('v5 block missing');
const v5=app.slice(v5Start,v5End);
must(v5,"const v3Id=EXPERT_PROFILE_IDS.expertv3[pos]",'v5 baseline map');
must(app,"expertv3:{QB:'expert-v3-qb',RB:'expert-v3-rb',WR:'expert-v2-wr',TE:'expert-v3-te'}",'v3 WR baseline');
must(v3src,"WR:null",'v3 WR unchanged marker');

// Execute sanitizer against the exact failure pattern seen on device.
const start=app.indexOf('function sanitizeExpertPanelRow');
const end=app.indexOf('\nfunction rankFor',start);
const fnSrc=app.slice(start,end);
const context={
  panels:{'expert-v5-wr':{weights:{
    'Draft Sharks Team':.15,
    'Nick Mariano':.35,
    'Pat Fitzmaurice':.15,
    'Dalton Del Don':.10,
    'Justin Boone':.10,
    'Sean Koerner':.15
  }}},
  norm:s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
};
vm.createContext(context);
vm.runInContext(fnSrc,context);
const badRow={name:'Deebo Samuel',rank:131,individual:[
  {expertName:'Draft Sharks Team',rank:144},
  {expertName:'Dalton Del Don',rank:131},
  {expertName:'Pat Fitzmaurice',rank:139},
  {expertName:'Nick Mariano',rank:140},
  {expertName:'Ryan Weisse',rank:126},
  {expertName:'Sean Koerner',rank:149}
]};
const clean=context.sanitizeExpertPanelRow('expert-v5-wr',badRow);
const names=clean.individual.map(x=>x.expertName);
if(names.includes('Ryan Weisse'))throw new Error('Ryan Weisse survived WR sanitizer');
if(!clean.missingExperts.includes('Justin Boone'))throw new Error('missing Boone not surfaced explicitly');
if(clean.coverageStatus==='COMPLETE')throw new Error('contaminated/sparse WR row marked complete');

// Live surface only renders the row it receives; unexpected names must not be invented there.
must(live,'function ex(x)','live expert render');
if(live.includes("Ryan Weisse")&&live.includes("function ex(x)")) {
  // Ryan exists in global order for legitimate RB/TE use; ensure ex() derives from actual row only.
  must(live,"const rows=x.individual||[]",'live actual-row source');
}

console.log('rc4.127 expert-membership fail-closed contract PASS');
