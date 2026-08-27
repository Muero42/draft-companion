import fs from 'node:fs';

const app=fs.readFileSync('app.js','utf8');
const arg=(name,def)=>{
  const hit=process.argv.find(x=>x.startsWith(name+'='));
  return hit?hit.slice(name.length+1):def;
};
const asOf=arg('--as-of',new Date().toISOString().slice(0,10));
const maxAge=Number(arg('--max-age-days','2'));
if(!/^\d{4}-\d{2}-\d{2}$/.test(asOf)||!Number.isFinite(maxAge)||maxAge<0){
  console.error('Usage: node tools/pre-draft-freshness-gate.mjs [--as-of=YYYY-MM-DD] [--max-age-days=2]');
  process.exit(2);
}
const src=(app.match(/const DRAFT_ACUTE_STATUS_2026=([^;]+);/)||[])[1]||'';
if(!src){console.error('PRE_DRAFT_FRESHNESS_FAIL: acute-status registry missing');process.exit(1)}
const rows=[];
const re=/(\w+):\{([^{}]+)\}/g;
let m;
while((m=re.exec(src))){
  const body=m[2];
  if(!/blockRecommendation:true/.test(body))continue;
  const d=(body.match(/asOf:'(\d{4}-\d{2}-\d{2})'/)||[])[1];
  rows.push({key:m[1],asOf:d||null});
}
const now=Date.parse(asOf+'T00:00:00Z');
const stale=rows.filter(r=>{
  if(!r.asOf)return true;
  return (now-Date.parse(r.asOf+'T00:00:00Z'))/86400000>maxAge;
});
if(stale.length){
  console.error('PRE_DRAFT_FRESHNESS_FAIL: blocking acute status requires fresh review:',stale);
  process.exit(1);
}
console.log('PRE_DRAFT_FRESHNESS_PASS',JSON.stringify({asOf,maxAge,blocking:rows}));
