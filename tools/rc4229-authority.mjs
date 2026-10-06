import {rc4229Binding,rc4228AuthorityBeforeBinding} from './rc4229-release-baseline.mjs';import {validateRc4228Authority} from './rc4228-authority.mjs';
export function validateRc4229Authority(d){const f=rc4229Binding(),errors=[];
  for(const e of f.patch){if(e.documentPrefix){if(!d[e.file]?.startsWith(e.documentPrefix))errors.push(e.file+': rc4229 prefix drift');continue;}let value=d[e.file];for(const k of e.path.split('.'))value=value?.[k];if(JSON.stringify(value)!==JSON.stringify(e.value))errors.push(e.file+': '+e.path+' drift');}
  if(f.version!=='v11.8.0-rc4.229'||!/^20261006T\d{4}Z-v305$/.test(f.generation)||f.functionalHead!=='347ee60a552a52084c7ba8b0b73ee6a1bbcbed31'||f.baselineHead!=='8baff6f6ec20c098ac47212dc7bd0d6e0e4a8447'||f.unpublished!==true||f.merged!==false||f.deployed!==false||f.physicalAccepted!==false||f.adapterImplemented!==false)errors.push('RC4229 binding overclaim');
  if(!d['app.js']?.includes("APP_VERSION='v11.8.0-rc4.229'"))errors.push('rc4229 runtime version drift');
  return [...errors,...validateRc4228Authority(rc4228AuthorityBeforeBinding(d))];
}
