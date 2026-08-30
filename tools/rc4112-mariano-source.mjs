import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync('_worker.js','utf8');
for(const x of [
  'ROTOBALLER_MARIANO_HALF_PPR_URLS',
  'function parseRotoBallerOverall',
  'async function tryRotoBallerMariano',
  "if(/nick mariano/i.test(name)&&scoring==='HALF')",
  "source:'RotoBaller – Nick Mariano Half-PPR Overall'",
  "sourceContextVerified:true",
  "sourceScoring:'HALF'",
  "1916255",
  "neuere Mariano-Half-PPR-Publikation vorhanden"
])if(!src.includes(x))throw new Error('Mariano source contract missing: '+x);
const a=src.indexOf("if(/nick mariano/i.test(name)&&scoring==='HALF')");
const b=src.indexOf("// 1) Exact public individual list.");
if(!(a>=0&&b>a))throw new Error('Mariano official-source adapter must precede FP reconstruction');

const p0=src.indexOf('function parseRotoBallerOverall');
const p1=src.indexOf('async function tryRotoBallerMariano',p0);
const parser=src.slice(p0,p1);
const helper=`
function parsePosToken(text){
 const m=String(text||'').toUpperCase().match(/\\b(QB|RB|WR|TE|K|DST)\\s*[-#]?\\s*(\\d+)?\\b/);
 return m?{pos:m[1],posRank:m[2]?Number(m[2]):null}:null;
}
function tableRows(html){
 return [...String(html||'').matchAll(/<tr\\b[^>]*>([\\s\\S]*?)<\\/tr>/gi)].map(m=>({cells:[...m[1].matchAll(/<t[dh]\\b[^>]*>([\\s\\S]*?)<\\/t[dh]>/gi)].map(x=>String(x[1]).replace(/<[^>]*>/g,'').trim())}));
}`;
const ctx={};vm.createContext(ctx);vm.runInContext(helper+parser,ctx);
const html='<table><tr><th>Tier</th><th>Rank</th><th>Player Name</th><th>Pos</th></tr>'+
 '<tr><td>1</td><td>1</td><td>Jahmyr Gibbs</td><td>RB</td></tr>'+
 '<tr><td>1</td><td>2</td><td>Bijan Robinson</td><td>RB</td></tr>'+
 '<tr><td>1</td><td>3</td><td>Ja\'Marr Chase</td><td>WR</td></tr>'+
 '<tr><td>3</td><td>20</td><td>Brock Bowers</td><td>TE</td></tr></table>';
const rows=ctx.parseRotoBallerOverall(html);
if(rows.length!==4)throw new Error('RotoBaller table parser fixture failed: '+JSON.stringify(rows));
const byName=new Map(rows.map(x=>[x.name,x]));
if(byName.get('Jahmyr Gibbs')?.rank!==1||byName.get('Brock Bowers')?.rank!==20||byName.get('Brock Bowers')?.pos!=='TE')throw new Error('RotoBaller parsed values wrong: '+JSON.stringify(rows));
console.log('Nick Mariano RotoBaller source regression PASS');
