const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('app.js','utf8');
for(const needle of ['function loadRankCacheCompact','function rebuildPanelRanksFromCache',"localStorage.removeItem('v7_panelRanks')","localStorage.removeItem('v7_rankCache')"]) if(!src.includes(needle)) throw new Error('missing '+needle);
if(src.includes("store.set('v7_rankCache',rankCache)")) throw new Error('redundant aggregate rankCache persistence remains');
if(src.includes("store.set('v7_panelRanks',panelRanks)")) throw new Error('derived panelRanks persistence remains');
if(!src.includes("store.set('v7_rank_'+expertId,result)")) throw new Error('per-expert persistent source missing');
console.log('PASS rc4.42 ranking-storage quota guards');
