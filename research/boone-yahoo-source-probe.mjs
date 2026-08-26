const urls=[
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-300-players-155300098.html',
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-draft-qb-quarterback-181419842.html',
  'https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-draft-wr-wide-receiver-172147910.html'
];
const ua='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36';
for(const url of urls){
  const r=await fetch(url,{headers:{'user-agent':ua,'accept':'text/html,application/xhtml+xml'}});
  const t=await r.text();
  console.log('\nURL',url,'HTTP',r.status,'bytes',t.length);
  const frames=[...t.matchAll(/<iframe\b[^>]*src=["']([^"']+)["']/gi)].map(m=>m[1]);
  const links=[...t.matchAll(/https?:\\?\/\\?\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;=%\\-]+/g)].map(m=>m[0].replace(/\\\//g,'/'));
  const interesting=[...new Set([...frames,...links.filter(x=>/datawrapper|rank|iframe|table|yahoo|fantasy/i.test(x))])];
  console.log('iframes',JSON.stringify(frames,null,2));
  console.log('interesting',JSON.stringify(interesting.slice(0,120),null,2));
  console.log('markers',JSON.stringify({boone:/Justin Boone/i.test(t),half:/Half PPR|Half-PPR/i.test(t),top300:/Top 300/i.test(t)}));
}