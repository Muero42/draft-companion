const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync('app.js','utf8');
for(const needle of ['RESEARCH_CACHE_MAX_EVENTS=320','function saveResearchEvents','quotaRecovered','storageFull']) if(!src.includes(needle)) throw new Error('missing '+needle);
if(src.includes("events.push(e);localStorage.setItem(researchCacheKey()")) throw new Error('unsafe direct evidence write remains');
console.log('PASS rc4.41 research-cache quota guards');
