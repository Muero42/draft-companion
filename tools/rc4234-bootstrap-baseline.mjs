import {beforeGameRefreshRuntime,beforeGameRefreshAuthority} from './rc4235-game-refresh-baseline.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
export const bootstrapBinding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4234/release-binding.json',import.meta.url)));
export const bootstrapBlob=text=>{const b=Buffer.from(text.replace(/\r\n/g,'\n'));return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')};
export function beforeBootstrapRuntime(text){
  text=beforeGameRefreshRuntime(text);
  const f=bootstrapBinding();
  // Other files and already reconstructed historical layers remain unchanged.
  for(const p of [...f.runtimePatches].reverse()){
    if(!text.includes(p.value))continue;
    assert.equal(text.split(p.value).length,2,'unique bootstrap inverse '+p.name);
    text=text.replace(p.value,p.old);
  }
  return text.replaceAll(f.version,'v11.8.0-rc4.233');
}
export function beforeBootstrapAuthority(d){
  d=beforeGameRefreshAuthority(d);
  if(d['PITTI_CURRENT_STATE.json']?.authority?.source_candidate!=='v11.8.0-rc4.234')return d;
  const copy=structuredClone(d),f=bootstrapBinding();
  for(const e of [...f.patch].reverse()){
    if(e.documentPrefix){assert(copy[e.file].startsWith(e.documentPrefix));copy[e.file]=copy[e.file].slice(e.documentPrefix.length);continue;}
    const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];
    if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=structuredClone(e.old);
  }
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.previousSeal);
  copy['app.js']=beforeBootstrapRuntime(copy['app.js']);return copy;
}
export function validateBootstrapAuthority(d,validatePrevious){
  const f=bootstrapBinding(),errors=[];
  if(f.version!=='v11.8.0-rc4.234'||f.parent!=='c4ca793288d728f84f92e0319d18e9bb4f1373a0'||f.gate!=='RC4234_LOCAL_BOOTSTRAP_DIAGNOSTIC_REPAIR_PUBLICATION_NOT_AUTHORIZED')errors.push('bootstrap candidate identity drift');
  for(const e of f.patch){
    if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+' bootstrap prefix drift');continue;}
    let actual=d[e.file];for(const k of e.path.split('.'))actual=actual?.[k];
    if(JSON.stringify(actual)!==JSON.stringify(e.value))errors.push(e.file+' '+e.path+' bootstrap authority drift');
  }
  if(bootstrapBlob(d['app.js']||'')!==f.runtimeBlobs['app.js'])errors.push('bootstrap app bytes drift');
  if(errors.length)return errors;
  try{return validatePrevious(beforeBootstrapAuthority(d));}catch(e){return ['bootstrap inverse failed: '+e.message];}
}
