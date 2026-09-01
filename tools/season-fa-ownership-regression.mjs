import fs from 'node:fs';
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
function extract(name,next){
  const s=app.indexOf('function '+name+'('); if(s<0) throw new Error(name+' missing');
  const e=app.indexOf('\nfunction '+next+'(',s); if(e<0) throw new Error(next+' missing');
  return app.slice(s,e);
}
const src=extract('seasonAvailablePlayers','activeDraftSurface');
const sleeperPlayerRow=(pid,players)=>{const p=players[pid]||{};return{id:String(pid),name:p.full_name,pos:String(p.position||'').toUpperCase(),team:p.team||'FA',searchRank:Number(p.search_rank)||9999}};
const rankFor=()=>null;
const fn=new Function('sleeperPlayerRow','rankFor',`return (${src.replace('function seasonAvailablePlayers','function')})`)(sleeperPlayerRow,rankFor);
const players={
  '1':{full_name:'Rostered RB',position:'RB',active:true,search_rank:10},
  '2':{full_name:'Free RB',position:'RB',active:true,search_rank:100},
  '3':{full_name:'Free WR',position:'WR',active:true,search_rank:90},
  '4':{full_name:'Free K',position:'K',active:true,search_rank:20}
};
const season={ok:true,ownership:{'1':1},rosters:[{players:['1'],reserve:[],taxi:[]}]};
const out=fn(season,players);
if(out.length!==2)throw new Error('Expected 2 unowned skill-position FAs, got '+out.length);
if(out.some(p=>p.name==='Rostered RB'))throw new Error('Owned player leaked into FA pool');
if(!out.some(p=>p.name==='Free RB')||!out.some(p=>p.name==='Free WR'))throw new Error('Unowned skill player missing');
if(out.some(p=>p.pos==='K'))throw new Error('K leaked into skill-position FA pool');
console.log('PASS season FA ownership pool independent of ranking hydration');
