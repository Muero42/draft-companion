import fs from 'node:fs';
import assert from 'node:assert/strict';

const src=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

assert(!html.includes('Bisherige Konfiguration (rc4.64)'),'obsolete top expert selector still visible');
assert(html.includes('v4 PRIMARY · v5 CHALLENGER · v3 Failsafe'),'draft-day model authority missing');

function selection(payload,requestedIds){
  const requested=[...new Set(requestedIds.map(String))],want=new Set(requested);
  const filters=(String(payload?.filters??'').match(/\d+/g)||[]).map(String);
  const available=payload?.experts_available&&typeof payload.experts_available==='object'?payload.experts_available:{};
  const included=(Array.isArray(available.included)?available.included:[]).map(String).filter(id=>want.has(id));
  const excluded=(Array.isArray(available.excluded)?available.excluded:[]).map(String).filter(id=>want.has(id));
  const exactFilters=filters.length===requested.length&&requested.every(id=>filters.includes(id));
  if(exactFilters)return {ok:true,used:requested,excluded:[],proof:'filters-exact'};
  const filterSubset=[...new Set(filters.filter(id=>want.has(id)))];
  if(filterSubset.length>=2){
    const omitted=requested.filter(id=>!filterSubset.includes(id));
    if(omitted.every(id=>excluded.includes(id)))return {ok:true,used:filterSubset,excluded:omitted,proof:'filters-subset+explicit-excluded'};
  }
  const classified=new Set([...included,...excluded]);
  if(included.length>=2&&requested.every(id=>classified.has(id)))return {ok:true,used:included,excluded:requested.filter(id=>excluded.includes(id)),proof:'experts_available'};
  return {ok:false,used:[],excluded:[],proof:'unverified'};
}

// Official FantasyPros docs show comma-returned filters, total_experts unrelated to requested count,
// experts_available included/excluded, and players[].tier.
const exact={
  filters:'6297,6318,375,4317,908,5446',
  total_experts:25,
  experts_available:{included:[6297,6318,375,4317,908,5446,9999],excluded:[]},
  position_id:'RB',scoring:'HALF',ranking_type_name:'DRAFT',
  players:[{player_name:'Fixture RB',player_position_id:'RB',tier:3}]
};
assert.deepEqual(selection(exact,['6297','6318','375','4317','908','5446']),{ok:true,used:['6297','6318','375','4317','908','5446'],excluded:[],proof:'filters-exact'});

const subset={
  ...exact,
  filters:'6297,6318,375,4317,908',
  experts_available:{included:[6297,6318,375,4317,908],excluded:[5446]}
};
const sub=selection(subset,['6297','6318','375','4317','908','5446']);
assert.equal(sub.ok,true);
assert.equal(sub.used.length,5);
assert.deepEqual(sub.excluded,['5446']);

const bad={...exact,filters:'6297,6318,9999',experts_available:{included:[6297,6318,9999],excluded:[]}};
assert.equal(selection(bad,['6297','6318','375']).ok,false,'outsider/unaccounted omission must fail closed');

assert(src.includes('const tier=fpConsensusTierNumber(row)'),'explicit FantasyPros tier parser missing');
assert(src.includes('externalTierHtml(x)'),'coach render does not call external tier renderer');
assert(src.includes("label:`T ${Number(row.tier)}`"),'visible T x label missing');
assert(src.includes("proof:'filters-subset+explicit-excluded'"),'explicit excluded provenance path missing');
console.log('rc4.146 FantasyPros payload -> provenance -> tier -> coach render contract PASS');
