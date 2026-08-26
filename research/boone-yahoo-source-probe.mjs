const urls=[
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-300-players-155300098.html',
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-draft-qb-quarterback-181419842.html',
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-draft-wr-wide-receiver-172147910.html'
];
const ua='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36';
const strip=s=>String(s||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
for(const url of urls){
  const r=await fetch(url,{headers:{'user-agent':ua,'accept':'text/html,application/xhtml+xml'}});
  const t=await r.text(),plain=strip(t);
  console.log('\nURL',url,'HTTP',r.status,'bytes',t.length,'tables',(t.match(/<table\b/gi)||[]).length,'trs',(t.match(/<tr\b/gi)||[]).length);
  for(const needle of ['Bijan Robinson','Jahmyr Gibbs','Josh Allen','Justin Jefferson','Jalen Coker','Puka Nacua']){
    const i=t.indexOf(needle),j=plain.indexOf(needle);console.log('NEEDLE',needle,'htmlIndex',i,'plainIndex',j,'plainContext',j>=0?plain.slice(Math.max(0,j-180),j+360):'');
  }
  const jsonish=[...t.matchAll(/<(?:script)[^>]*(?:type=["']application\/json["']|id=["'][^"']*(?:data|state|article)[^"']*["'])[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  console.log('jsonishBlocks',jsonish.length,'sizes',jsonish.map(x=>x.length).sort((a,b)=>b-a).slice(0,10));
  const tables=[...t.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(m=>strip(m[1]));
  console.log('tableSamples',JSON.stringify(tables.slice(0,5).map(x=>x.slice(0,1200)),null,2));
}