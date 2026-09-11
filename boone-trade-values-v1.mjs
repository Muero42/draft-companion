const SCHEMA='pitti.boone-trade-values.v1';
const RECORD_SCHEMA='pitti.season-evidence.v1';
const CACHE_KEY='pitti.boone-trade-values.v1.current';
const SOURCE_ID='yahoo_justin_boone_trade_values';
const PROVIDER='Yahoo Sports';
const AUTHOR='Justin Boone';
const MAPPING_VERSION='boone-sleeper-v1';
const POSITIONS=['QB','RB','WR','TE'];
const MIN_COUNTS={QB:24,RB:32,WR:60,TE:24};
const MAX_SOURCE_AGE_MS=8*24*60*60*1000;
const SNAPSHOT_TTL_MS=24*60*60*1000;
const POSITION_LABELS={QB:/\bquarterback|\bqb\b/i,RB:/\brunning back|\brb\b/i,WR:/\bwide receiver|\bwr\b/i,TE:/\btight end|\bte\b/i};
const WEEK1_URLS={
  QB:'https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-qb-trade-value-charts-193721885.html',
  RB:'https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-rb-trade-value-charts-193804763.html',
  WR:'https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-wr-trade-value-charts-193843688.html',
  TE:'https://sports.yahoo.com/fantasy/article/fantasy-football-week-1-justin-boones-te-trade-value-charts-194108969.html'
};

const finite=value=>typeof value==='number'&&Number.isFinite(value)?value:null;
const normalizeName=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'');
function htmlDecode(value){return String(value||'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCharCode(parseInt(n,16)));}
function stripHtml(value){return htmlDecode(String(value||'').replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();}
function tableRows(html){return[...String(html||'').matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(match=>[...match[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(cell=>stripHtml(cell[1]))).filter(row=>row.length);}
function yahooUrl(value){try{const url=new URL(htmlDecode(value),'https://sports.yahoo.com/');return url.protocol==='https:'&&/(^|\.)sports\.yahoo\.com$/i.test(url.hostname)&&/^\/(fantasy\/article|news)\//.test(url.pathname)?url.href:null;}catch{return null;}}
function sourceDates(html){
  const find=key=>{const match=String(html||'').match(new RegExp(`${key}(?:\\\\?\"|&quot;)\\s*:\\s*(?:\\\\?\"|&quot;)(20\\d{2}-\\d{2}-\\d{2}T[^\"&\\\\]+)`,'i'));const ms=match?Date.parse(match[1]):NaN;return Number.isFinite(ms)?ms:null;};
  const publishedAt=find('datePublished'),modifiedAt=find('dateModified')||publishedAt;
  return{publishedAt,modifiedAt};
}

function parseBooneChartHtml(html,{position,season,week,sourceUrl,now=Date.now()}={}){
  position=String(position||'').toUpperCase();
  const fail=reason=>({ok:false,position,reason,sourceUrl});
  if(!POSITIONS.includes(position)||!yahooUrl(sourceUrl))return fail('INVALID_SOURCE');
  const plain=stripHtml(html),dates=sourceDates(html),sourceAt=dates.modifiedAt||dates.publishedAt;
  if(!/Justin Boone/i.test(plain)||!/trade value/i.test(plain)||!POSITION_LABELS[position].test(plain))return fail('SOURCE_IDENTITY_MISMATCH');
  if(!new RegExp(`\\b${Number(season)}\\b`).test(plain)||!new RegExp(`\\bWeek\\s+${Number(week)}\\b`,'i').test(plain))return fail('SOURCE_CONTEXT_MISMATCH');
  if(!Number.isFinite(dates.publishedAt)||!Number.isFinite(dates.modifiedAt)||dates.modifiedAt<dates.publishedAt||sourceAt>now+60*60*1000||now-sourceAt>MAX_SOURCE_AGE_MS)return fail('STALE_OR_INVALID_SOURCE_DATE');
  const valueLabel=position==='QB'?'1qb':'half',tables=[...String(html||'').matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(match=>match[1]);
  let selected=null;
  for(const table of tables){
    const rows=tableRows(table);let header=-1,rankCol=-1,playerCol=-1,valueCol=-1;
    for(let i=0;i<rows.length;i++){
      const cells=rows[i].map(cell=>cell.toLowerCase().replace(/[^a-z0-9]/g,''));
      rankCol=cells.findIndex(cell=>cell==='rk'||cell==='rank');playerCol=cells.findIndex(cell=>cell==='player');valueCol=cells.findIndex(cell=>cell===valueLabel);
      if(rankCol>=0&&playerCol>=0&&valueCol>=0){header=i;break;}
    }
    if(header<0)continue;
    const players=[],seen=new Set();let duplicate=false;
    for(const cells of rows.slice(header+1)){
      if(cells.length<=Math.max(rankCol,playerCol,valueCol))continue;
      const rank=Number(String(cells[rankCol]).trim()),value=Number(String(cells[valueCol]).trim()),name=String(cells[playerCol]||'').trim(),key=normalizeName(name);
      if(!Number.isInteger(rank)||rank<1||rank>300||!Number.isFinite(value)||value<0||value>200||!key)continue;
      if(seen.has(key)){duplicate=true;break;}seen.add(key);players.push({rank,name,value,position});
    }
    if(duplicate)return fail('DUPLICATE_SOURCE_NAME');
    if(!selected||players.length>selected.length)selected=players;
  }
  if(!selected||selected.length<MIN_COUNTS[position])return fail('MALFORMED_OR_INCOMPLETE_TABLE');
  return{ok:true,position,sourceUrl:yahooUrl(sourceUrl),publishedAt:dates.publishedAt,modifiedAt:dates.modifiedAt,sourceAt,players:selected,column:position==='QB'?'1QB':'HALF'};
}

function sleeperIndexes(players){
  const byNamePosition=new Map();
  for(const [id,player] of Object.entries(players||{})){
    const position=String(player?.position||'').toUpperCase();if(!POSITIONS.includes(position))continue;
    const name=player.full_name||[player.first_name,player.last_name].filter(Boolean).join(' '),key=`${normalizeName(name)}|${position}`,rows=byNamePosition.get(key)||[];
    rows.push({id:String(id),name,position,team:String(player.team||'FA').toUpperCase()});byNamePosition.set(key,rows);
  }
  return{byNamePosition};
}
function mapBoonePlayer(row,indexes){
  const matches=indexes.byNamePosition.get(`${normalizeName(row?.name)}|${String(row?.position||'').toUpperCase()}`)||[];
  if(matches.length!==1)return{ok:false,reason:matches.length?'NAME_POSITION_COLLISION':'NO_MATCH'};
  const sourceTeam=String(row?.team||'').trim().toUpperCase();
  if(sourceTeam&&sourceTeam!=='FA'&&matches[0].team!==sourceTeam)return{ok:false,reason:'TEAM_MISMATCH'};
  return{ok:true,player:matches[0],method:'EXACT_NORMALIZED_NAME_POSITION'};
}

function buildBooneTradeValueSnapshot({charts,sleeperPlayers,season,week,verifiedAt=Date.now()}={}){
  const indexes=sleeperIndexes(sleeperPlayers),records=[],rejections=[],coverage={},editionId=`boone-yahoo-${Number(season)}-week-${Number(week)}`;
  for(const position of POSITIONS){
    const chart=charts?.[position];let mapped=0;
    if(chart?.ok){for(const row of chart.players){const mapping=mapBoonePlayer(row,indexes);if(!mapping.ok){rejections.push({position,name:row.name,reason:mapping.reason});continue;}mapped++;records.push({schema:RECORD_SCHEMA,playerId:mapping.player.id,sleeperId:mapping.player.id,sourcePlayerName:row.name,mappingMethod:mapping.method,mappingVersion:MAPPING_VERSION,metric:'trade_value',value:row.value,unit:'BOONE_TRADE_VALUE',position,season:Number(season),week:Number(week),scoring:'HALF_PPR',status:'VERIFIED',sourceId:SOURCE_ID,sourceProvider:PROVIDER,sourceAuthor:AUTHOR,sourceEdition:editionId,sourceUrl:chart.sourceUrl,publishedAt:chart.sourceAt,sourcePublishedAt:new Date(chart.publishedAt).toISOString(),sourceUpdatedAt:new Date(chart.modifiedAt||chart.publishedAt).toISOString(),sourceTimePrecision:'TIMESTAMP',verifiedAt,expiresAt:verifiedAt+SNAPSHOT_TTL_MS,provenance:{provider:PROVIDER,author:AUTHOR,chartPosition:position,selectedColumn:chart.column,publicationTimestamp:new Date(chart.publishedAt).toISOString(),updateTimestamp:new Date(chart.modifiedAt||chart.publishedAt).toISOString()},confidence:.95});}}
    const sourceCount=chart?.players?.length||0,mappingCoverage=sourceCount?mapped/sourceCount:0,status=chart?.ok&&sourceCount>=MIN_COUNTS[position]&&mappingCoverage>=.75?'AVAILABLE':'UNAVAILABLE';
    coverage[position]={status,sourceCount,mapped,mappingCoverage:Math.round(mappingCoverage*1000)/1000,sourceUrl:chart?.sourceUrl||null,publishedAt:chart?.publishedAt||null,updatedAt:chart?.modifiedAt||null,reason:chart?.reason||(status==='UNAVAILABLE'?'INSUFFICIENT_MAPPING_COVERAGE':null)};
  }
  const available=POSITIONS.every(position=>coverage[position].status==='AVAILABLE'),lastSuccessAt=available?verifiedAt:null;
  return{schema:SCHEMA,snapshotId:`btv1-${Number(season)}-${Number(week)}-${verifiedAt}`,season:Number(season),week:Number(week),scoring:'HALF_PPR',sourceId:SOURCE_ID,sourceProvider:PROVIDER,sourceAuthor:AUTHOR,sourceEdition:editionId,fetchedAt:verifiedAt,lastSuccessAt,expiresAt:verifiedAt+SNAPSHOT_TTL_MS,status:available?'AVAILABLE':'UNAVAILABLE',coverage:{positions:coverage,sourceRows:POSITIONS.reduce((n,p)=>n+coverage[p].sourceCount,0),mappedRows:POSITIONS.reduce((n,p)=>n+coverage[p].mapped,0)},records:available?records:[],rejections};
}
function validateBooneTradeValueSnapshot(snapshot,context={},now=Date.now()){
  if(!snapshot||snapshot.schema!==SCHEMA||snapshot.status!=='AVAILABLE'||!snapshot.snapshotId)return{ok:false,reason:'SCHEMA_OR_STATUS'};
  if(Number(snapshot.season)!==Number(context.season)||Number(snapshot.week)!==Number(context.week)||snapshot.scoring!=='HALF_PPR')return{ok:false,reason:'CONTEXT_MISMATCH'};
  if(!Number.isFinite(snapshot.lastSuccessAt)||snapshot.lastSuccessAt>now||now-snapshot.lastSuccessAt>SNAPSHOT_TTL_MS||snapshot.expiresAt<=now)return{ok:false,reason:'STALE'};
  if(!POSITIONS.every(position=>snapshot.coverage?.positions?.[position]?.status==='AVAILABLE'))return{ok:false,reason:'PARTIAL_POSITION_COVERAGE'};
  if(!Array.isArray(snapshot.records)||!snapshot.records.length||snapshot.records.some(row=>row.metric!=='trade_value'||row.sourceId!==SOURCE_ID||row.sourceEdition!==snapshot.sourceEdition||!yahooUrl(row.sourceUrl)||row.expiresAt<=now))return{ok:false,reason:'INVALID_RECORDS'};
  return{ok:true};
}
function atomicWriteBooneTradeValues(storage,snapshot){
  const text=JSON.stringify(snapshot),parsed=JSON.parse(text);if(!parsed||parsed.schema!==SCHEMA||parsed.snapshotId!==snapshot.snapshotId)throw new Error('BOONE_TRADE_VALUE_ATOMIC_VERIFY_FAILED');
  storage.setItem(CACHE_KEY,text);const current=JSON.parse(storage.getItem(CACHE_KEY)||'null');if(current?.snapshotId!==snapshot.snapshotId)throw new Error('BOONE_TRADE_VALUE_ATOMIC_VERIFY_FAILED');return snapshot;
}
function discoverBooneTradeChartUrls(html,{week}={}){
  const out=Object.fromEntries(POSITIONS.map(position=>[position,[]]));
  for(const match of String(html||'').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    const url=yahooUrl(match[1]),label=stripHtml(match[2]);if(!url||!/Justin Boone|Boone/i.test(label)||!/trade value/i.test(label)||!new RegExp(`\\bWeek\\s+${Number(week)}\\b`,'i').test(label))continue;
    for(const position of POSITIONS)if(POSITION_LABELS[position].test(label)||new RegExp(`\\b${position}\\b`,'i').test(label)){if(!out[position].includes(url))out[position].push(url);}
  }
  return out;
}

export{SCHEMA,RECORD_SCHEMA,CACHE_KEY,SOURCE_ID,PROVIDER,AUTHOR,MAPPING_VERSION,POSITIONS,MIN_COUNTS,MAX_SOURCE_AGE_MS,SNAPSHOT_TTL_MS,WEEK1_URLS,normalizeName,sourceDates,parseBooneChartHtml,sleeperIndexes,mapBoonePlayer,buildBooneTradeValueSnapshot,validateBooneTradeValueSnapshot,atomicWriteBooneTradeValues,discoverBooneTradeChartUrls};
