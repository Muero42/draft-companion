const urls=['https://sports.yahoo.com/fantasy/article/2026-fantasy-football-rankings-justin-boone-top-300-players-155300098.html'];
const ua='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36';
for(const url of urls){
 const r=await fetch(url,{headers:{'user-agent':ua,'accept':'text/html,application/xhtml+xml'}}),t=await r.text();
 const blocks=[...t.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].map(m=>({attrs:m[1],body:m[2]})).filter(x=>/application\/json|state|data|article/i.test(x.attrs));
 console.log('blocks',blocks.length);
 for(let i=0;i<blocks.length;i++){console.log('BLOCK',i,'ATTRS',blocks[i].attrs,'BODY',blocks[i].body.slice(0,12000));}
 for(const needle of ['155300098','articleBody','contentType','canonicalUrl','uuid','story','graphql','api','caas']){
   const hits=[];let p=0;while((p=t.indexOf(needle,p))>=0&&hits.length<8){hits.push(t.slice(Math.max(0,p-220),p+500));p+=needle.length}console.log('HITS',needle,JSON.stringify(hits));
 }
}