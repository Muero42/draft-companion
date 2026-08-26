// EXPERT_V2_LOCAL_AUDIT_EXPORT_V1
(function(){
  const names=['Pat Fitzmaurice','Justin Boone','Sean Koerner','Nick Mariano','Dalton Del Don','Matt Harmon'];
  const nn=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const save=obj=>{const b=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`pitti-expert-v2-audit-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
  async function run(){
    const btn=document.getElementById('expertV2AuditBtn'),st=document.getElementById('expertV2AuditStatus');
    if(!els.apiKey.value.trim()){st.textContent='FantasyPros-Zugang ist in dieser App nicht gesetzt.';return}
    if(els.season.value.trim()!=='2026'||String(els.scoring.value).toUpperCase()!=='HALF'){st.textContent='Bitte Saison 2026 und Half-PPR verwenden.';return}
    btn.disabled=true;st.textContent='Experten-Audit läuft …';
    const out={schema:'pitti-expert-v2-audit-v1',createdAt:new Date().toISOString(),season:'2026',scoring:'HALF',containsCredential:false,experts:[],missing:[]};
    try{
      let dir=[];
      try{dir=extractExperts(await proxyCall('/nfl/2026/rankings/experts?type=DRAFT&scoring=HALF&include_overall=true'))}catch(e){}
      if(!dir.length)try{dir=await loadPublicExpertDirectory()}catch(e){}
      if(!dir.length&&Array.isArray(experts))dir=experts;
      for(const name of names){
        const e=dir.find(x=>nn(x.name)===nn(name));
        if(!e){out.missing.push({name,reason:'not_in_directory'});continue}
        st.textContent=`${name} …`;
        const row={name,id:String(e.id),site:e.site||'',status:'error'};
        try{
          const r=await fetchVerifiedExpertOverall(e),d=r.data;
          const scoring=String(d?.scoring||d?.scoring_type||d?.scoring_name||'HALF').toUpperCase();
          const position=String(d?.position_id||d?.position||'ALL').toUpperCase();
          const rankingType=String(d?.ranking_type_name||d?.ranking_type||d?.type||'DRAFT').toUpperCase();
          row.format={scoring,position,rankingType};
          row.lastUpdated=d?.last_updated??null;row.lastUpdatedTs=d?.last_updated_ts??null;row.expertPub=d?.expert_pub?.[String(e.id)]??d?.expert_pub??null;
          const valid=scoring.includes('HALF')&&(position==='ALL'||position==='OVERALL')&&!rankingType.includes('SUPERFLEX')&&!rankingType.includes('2QB')&&position!=='OP';
          if(!valid){row.status='format_rejected'}else{
            const raw=Array.isArray(d?.players)?d.players:[],by=new Map(raw.map(x=>[String(field(x,['player_id','playerid','id'])||''),x]));
            row.players=r.rows.map(x=>{const q=by.get(String(x.id))||{},tier=Number(field(q,['tier','rank_tier','tier_ecr']));return {...x,tier:Number.isFinite(tier)&&tier>0?tier:null}});
            row.tierCoverage=row.players.length?row.players.filter(x=>x.tier!=null).length/row.players.length:0;row.status='ok';
          }
        }catch(err){row.error=err?.message||String(err)}
        out.experts.push(row);
      }
      save(out);st.textContent=`Audit exportiert · ${out.experts.filter(x=>x.status==='ok').length}/${out.experts.length} FP-Boards nutzbar.`;
    }catch(e){st.textContent=`Audit fehlgeschlagen: ${e?.message||e}`}
    finally{btn.disabled=false}
  }
  function mount(){
    if(document.getElementById('expertV2AuditBtn'))return;
    const host=els.backupBtn?.parentElement||document.body,wrap=document.createElement('div');wrap.className='card';wrap.style.marginTop='10px';
    wrap.innerHTML='<b>Expert-v2 Audit</b><p class="muted">Verwendet den bereits lokal gespeicherten FantasyPros-Zugang. Der Export enthält keine Zugangsdaten.</p><button type="button" id="expertV2AuditBtn">Expert-v2 Audit exportieren</button><div id="expertV2AuditStatus" class="muted" style="margin-top:6px"></div>';
    host.appendChild(wrap);document.getElementById('expertV2AuditBtn').addEventListener('click',run);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
