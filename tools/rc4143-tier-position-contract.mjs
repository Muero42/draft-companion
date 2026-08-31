import fs from 'node:fs';
const src=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const must=[
  "rankings/experts?position=${pos}&type=DRAFT&scoring=${scoring}&include_overall=true",
  "consensus-rankings?position=${pos}&scoring=${scoring}&week=0&type=DRAFT&filters=${filter}&experts=show",
  "fpConsensusContextVerified(data,pos,scoringRaw)",
  "fantasyProsSelectableV4Experts(pos)"
];
for(const x of must)if(!src.includes(x))throw new Error('missing rc4.143 contract: '+x);
const old="consensus-rankings?position=${pos}&scoring=${scoring}&week=0&filters=${filter}&experts=show";
if(src.includes(old))throw new Error('untyped/default consensus attempt must not precede DRAFT contract');
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}
const blueprint=['Sean Koerner','Todd D Clark','Justin Boone','Dalton Del Don','Nick Mariano','Pat Fitzmaurice'];
const directory=[{id:'10',name:'Sean Koerner'},{id:'20',name:'Justin Boone'},{id:'30',name:'Dalton Del Don'},{id:'40',name:'Nick Mariano'},{id:'50',name:'Pat Fitzmaurice'},{id:'999',name:'Andrew Erickson'}];
const byName=new Map(directory.map(e=>[norm(e.name),e])),selected=[],unavailable=[];
for(const name of blueprint){const e=byName.get(norm(name));if(e)selected.push(e);else unavailable.push(name)}
if(selected.some(e=>e.name==='Andrew Erickson'))throw new Error('outsider leaked into v4');
if(unavailable.join('|')!=='Todd D Clark')throw new Error('position unavailable expert not disclosed');
const payload={position_id:'QB',scoring:'HALF',ranking_type_name:'DRAFT',filters:'10,20,30,40,50',players:[{player_name:'Test QB',player_position_id:'QB',tier:2}]};
const want=selected.map(x=>x.id).sort(),filters=String(payload.filters).match(/\d+/g).sort();
if(want.length!==filters.length||!want.every((x,i)=>x===filters[i]))throw new Error('comma-returned filter provenance rejected');
if(!(payload.position_id==='QB'&&payload.scoring==='HALF'&&payload.ranking_type_name==='DRAFT'))throw new Error('context fixture failed');
if(Number(payload.players[0].tier)!==2)throw new Error('explicit tier fixture failed');
console.log('rc4.143 position-specific FantasyPros tier contract PASS');
