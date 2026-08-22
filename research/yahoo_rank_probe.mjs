import fs from 'node:fs';
const urls={boone:'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-300-players-155300098.html',harmon:'https://sports.yahoo.com/fantasy/article/fantasy-football-rankings-consensus-top-300-players-160643696.html'};
const out={as_of:new Date().toISOString(),pages:{}};
for(const [id,url] of Object.entries(urls)){
  try{
    const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; PITTI-Freeze-Probe/1.0)','accept':'text/html,application/xhtml+xml'}});
    const html=await r.text();
    const needles=['Bijan','Jahmyr','Justin Jefferson','Matt Harmon','Justin Boone','Half PPR','Top 300'];
    const hits={};
    for(const n of needles){const i=html.toLowerCase().indexOf(n.toLowerCase());hits[n]=i>=0?html.slice(Math.max(0,i-800),Math.min(html.length,i+1800)):null;}
    const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((m,i)=>({i,attrs:m[1].slice(0,300),len:m[2].length,head:m[2].slice(0,500)})).filter(x=>/json|apollo|next|yahoo|ranking|fantasy/i.test(x.attrs+x.head)).slice(0,30);
    out.pages[id]={status:r.status,url,length:html.length,table_count:(html.match(/<table\b/gi)||[]).length,tr_count:(html.match(/<tr\b/gi)||[]).length,hits,scripts};
  }catch(e){out.pages[id]={url,error:String(e?.message||e)};}
}
fs.writeFileSync('YAHOO_RANK_PROBE.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(out.pages).map(([k,v])=>[k,{status:v.status,length:v.length,table_count:v.table_count,tr_count:v.tr_count,error:v.error||''}]))));
