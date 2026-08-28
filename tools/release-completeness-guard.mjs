import fs from 'node:fs';
import vm from 'node:vm';
const must=(ok,msg)=>{if(!ok){console.error('RELEASE_GUARD_FAIL:',msg);process.exitCode=1;}};
const read=f=>fs.readFileSync(f,'utf8');
const index=read('index.html'),app=read('app.js'),sw=read('sw.js'),manifest=read('manifest.webmanifest'),live=read('live-surface-v3.js'),readme=read('README.md');
const m=index.match(/<span class="version">(v11\.8\.0-rc4\.\d+)<\/span>/);must(m,'visible version missing');const V=m?.[1];
if(V){
  const runtime={index,app,sw,manifest,live};
  for(const [name,text] of Object.entries(runtime)){
    const refs=[...new Set(text.match(/v11\.8\.0-rc4\.\d+/g)||[])];
    must(refs.every(x=>x===V),`${name} contains stale runtime RC refs: ${refs.filter(x=>x!==V).join(', ')}`);
  }
  const head=readme.split(/\r?\n/).slice(0,8).join('\n');const processMode=head.includes('Release Contract v2 (noch kein Installationsrelease)');must(processMode||head.includes(V),`README state is neither explicit process-mode nor ${V}`);
  must(index.includes(`app.js?v=${V}`),`index app.js cache-buster != ${V}`);
  must(index.includes(`live-surface-v3.js?v=${V}`),`index live JS cache-buster != ${V}`);
  must(index.includes(`live-surface-v3.css?v=${V}`),`index live CSS cache-buster != ${V}`);
  must(sw.includes(`./app.js?v=${V}`),`service-worker app.js cache key != ${V}`);
  must(sw.includes(`./live-surface-v3.js?v=${V}`),`service-worker live JS cache key != ${V}`);
  must(sw.includes(`./live-surface-v3.css?v=${V}`),`service-worker live CSS cache key != ${V}`);
}
for(const x of [
  "GLOBAL_EXPERT_ORDER=['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone'",
  'headerArrow(x)',
  'WR2 mit WR1-Upside',
  '<b>Fazit:</b>',
  '${esc(keyword(x,i))}</strong>',
  'expertName||r.source',
  '10ER-ÜBERSICHT'
]) must(live.includes(x),`live UI invariant missing: ${x}`);
must(!live.includes('— ${esc(keyword(x,i))}'),'Top-10 keywords must not sit behind player name');
must(!live.includes('<details><summary>Experten'),'expert ranks must not be collapsible');
must(!/shortName\(name\).*%/.test(live),'expert weights leaked into live cards');
must(app.includes('expertProfileBeforeReload'),'expert profile refresh preservation missing');
must(app.includes('injury|ankle|achilles|recurrence'),'arrow injury-exclusion guard missing');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(read('expert-v2-board.js'),ctx);vm.runInContext(read('expert-v3-board.js'),ctx);const b=ctx.window.PITTI_EXPERT_V2,v3=ctx.window.PITTI_EXPERT_V3;
must(b?.schema==='pitti-expert-v2-board.v4','Expert-v2 board schema/completeness not v4');
must(v3?.schema==='pitti-expert-v3-board.v1','Expert-v3 board schema missing');
for(const p of ['QB','RB','TE'])must(Math.abs(Object.values(v3?.weights?.[p]||{}).reduce((a,x)=>a+Number(x),0)-100)<1e-9,`v3 ${p} weights != 100`);
must(v3?.weights?.WR===null,'v3 WR must preserve v2 due missing qualified vector');
for(const p of ['QB','RB','WR','TE'])must(Math.abs(Object.values(b?.weights?.[p]||{}).reduce((a,x)=>a+Number(x),0)-100)<1e-9,`${p} weights != 100`);
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z0-9]/g,'').replace('cameronskattebo','camskattebo');
const rows=Object.values(b?.rows||{}).flat(),by=new Map(rows.map(r=>[norm(r.name),r]));
const required={
  'Jahmyr Gibbs':['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano'],
  'Bijan Robinson':['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano'],
  'Puka Nacua':['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone'],
  "Ja'Marr Chase":['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone'],
  'Parker Washington':['Draft Sharks Team','Dalton Del Don','Pat Fitzmaurice','Nick Mariano','Justin Boone']
};
for(const [name,names] of Object.entries(required)){const r=by.get(norm(name));must(r,`${name} missing from Expert-v2 board`);const got=new Set((r?.individual||[]).map(e=>e.expertName||e.source));for(const e of names)must(got.has(e),`${name} missing individual rank for ${e}`);}
must(rows.filter(r=>norm(r.name)==='camskattebo').length===1,'Cam/Cameron Skattebo duplicate board row');
if(!process.exitCode)console.log('RELEASE_GUARD_PASS',V);
