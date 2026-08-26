from pathlib import Path

p=Path('_worker.js')
s=p.read_text()

def once(old,new,label):
    global s
    c=s.count(old)
    if c!=1:
        raise SystemExit(f'{label} mismatch: {c}')
    s=s.replace(old,new)

needle="""function parseYahooSimpleOverall(html){
"""
insert="""function sourceDateFromHtml(html){
  const text=String(html||'');
  const patterns=[
    /[\"']dateModified[\"']\\s*:\\s*[\"']([^\"']+)[\"']/i,
    /[\"']datePublished[\"']\\s*:\\s*[\"']([^\"']+)[\"']/i,
    /<meta\\b[^>]*(?:property|name)=[\"'](?:article:modified_time|article:published_time|dateModified|datePublished)[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>/i,
    /<time\\b[^>]*datetime=[\"']([^\"']+)[\"'][^>]*>/i
  ];
  for(const re of patterns){
    const raw=text.match(re)?.[1];
    if(!raw)continue;
    const ts=Date.parse(htmlDecode(raw));
    if(Number.isFinite(ts))return new Date(ts).toISOString();
  }
  return '';
}
function parseYahooSimpleOverall(html){
"""
once(needle,insert,'date helper insertion')

once("""        if(players.length>=120)return {ok:true,source:'Yahoo Sports – Justin Boone Top 300',sourceUrl:url,players,updated:''};
""", """        if(players.length>=120)return {ok:true,source:'Yahoo Sports – Justin Boone Top 300',sourceUrl:url,players,updated:sourceDateFromHtml(html)};
""", 'Boone date')

once("""      if(players.length>=80)return {ok:true,source:`Yahoo Sports Staff – ${name}`,sourceUrl:url,players,updated:''};
""", """      if(players.length>=80)return {ok:true,source:`Yahoo Sports Staff – ${name}`,sourceUrl:url,players,updated:sourceDateFromHtml(html)};
""", 'staff date')

p.write_text(s)
