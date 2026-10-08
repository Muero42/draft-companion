import {rc4229AuthorityBeforeBinding} from './rc4230-release-baseline.mjs';
import {rc4229HistoricalRuntime} from './rc4230-diagnostic-baseline.mjs';
import fs from 'node:fs';
export const rc4229Binding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4229/release-binding.json',import.meta.url)));
export function rc4228AuthorityBeforeBinding(d){
  d=rc4229AuthorityBeforeBinding(d);
  if(d['PITTI_CURRENT_STATE.json']?.authority?.source_candidate!=='v11.8.0-rc4.229')return d;
  const copy=structuredClone(d),f=rc4229Binding();
  for(const e of f.patch){if(e.documentPrefix){copy[e.file]=copy[e.file].replace(e.documentPrefix,'');continue;}const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=e.old;}
  // Seal hashes are derived; reconstruct their immutable functional receipt exactly.
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.functionalSealIntegrity);
  copy['app.js']=rc4229HistoricalRuntime('app.js',copy['app.js']).replaceAll('v11.8.0-rc4.229','v11.8.0-rc4.228');return copy;
}
