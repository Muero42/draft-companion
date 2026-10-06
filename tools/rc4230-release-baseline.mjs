import fs from 'node:fs';
export const rc4230Binding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4230/release-binding.json',import.meta.url)));
export const rc4230FunctionalRuntime=text=>text.replaceAll('v11.8.0-rc4.230','v11.8.0-rc4.229');
export function rc4229AuthorityBeforeBinding(d){
  if(d['PITTI_CURRENT_STATE.json']?.authority?.source_candidate!=='v11.8.0-rc4.230')return d;
  const copy=structuredClone(d),f=rc4230Binding();
  for(const e of f.patch){
    if(e.documentPrefix){copy[e.file]=copy[e.file].replace(e.documentPrefix,'');continue;}
    const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];
    if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=structuredClone(e.old);
  }
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.functionalSealIntegrity);
  copy['app.js']=rc4230FunctionalRuntime(copy['app.js']);return copy;
}
