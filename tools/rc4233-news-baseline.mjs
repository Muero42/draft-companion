import {beforeBootstrapRuntime,beforeBootstrapAuthority} from './rc4234-bootstrap-baseline.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
export const newsBinding=()=>JSON.parse(fs.readFileSync(new URL('./fixtures/rc4233/release-binding.json',import.meta.url)));
export const newsBlob=text=>{const b=Buffer.from(text.replace(/\r\n/g,'\n'));return crypto.createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex')};
export function beforeNewsRuntime(text){
  text=beforeBootstrapRuntime(text);
  const f=newsBinding();
  // Other files and already reconstructed historical layers remain unchanged.
  for(const p of [...f.runtimePatches].reverse()){
    if(!text.includes(p.value))continue;
    assert.equal(text.split(p.value).length,2,'unique news inverse '+p.name);
    text=text.replace(p.value,p.old);
  }
  return text.replaceAll(f.version,'v11.8.0-rc4.232');
}
export function beforeNewsAuthority(d){
  d=beforeBootstrapAuthority(d);
  if(d['PITTI_CURRENT_STATE.json']?.authority?.source_candidate!=='v11.8.0-rc4.233')return d;
  const copy=structuredClone(d),f=newsBinding();
  for(const e of [...f.patch].reverse()){
    if(e.documentPrefix){assert(copy[e.file].startsWith(e.documentPrefix));copy[e.file]=copy[e.file].slice(e.documentPrefix.length);continue;}
    const keys=e.path.split('.');let x=copy[e.file];for(const k of keys.slice(0,-1))x=x[k];
    if(e.old===undefined)delete x[keys.at(-1)];else x[keys.at(-1)]=structuredClone(e.old);
  }
  copy['PITTI_HANDOFF_SEAL.json'].integrity=structuredClone(f.previousSeal);
  copy['app.js']=beforeNewsRuntime(copy['app.js']);return copy;
}
export function validateNewsAuthority(d,validatePrevious){
  const f=newsBinding(),errors=[];
  if(f.version!=='v11.8.0-rc4.233'||f.parent!=='0966857e48d3e0267e65c14db8b0b51a1d443306'||f.gate!=='RC4233_LOCAL_NEWS_BRIDGE_PUBLICATION_NOT_AUTHORIZED')errors.push('news candidate identity drift');
  for(const e of f.patch){
    if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+' news prefix drift');continue;}
    let actual=d[e.file];for(const k of e.path.split('.'))actual=actual?.[k];
    if(JSON.stringify(actual)!==JSON.stringify(e.value))errors.push(e.file+' '+e.path+' news authority drift');
  }
  if(newsBlob(d['app.js']||'')!==f.runtimeBlobs['app.js'])errors.push('news app bytes drift');
  if(errors.length)return errors;
  try{return validatePrevious(beforeNewsAuthority(d));}catch(e){return ['news inverse failed: '+e.message];}
}
