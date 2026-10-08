import {rc4230FunctionalRuntime} from './rc4230-release-baseline.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
// Exact inverse of the bounded rc4230 diagnostic/UI edits; historical contracts stay frozen.
export function rc4229HistoricalRuntime(file,text){
  text=rc4230FunctionalRuntime(text);
  const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/rc4230/historical-patches.json',import.meta.url)));
  for(const p of fixture.patches.filter(p=>p.file===file)){
    if(!text.includes(p.marker))continue;
    assert.equal(text.split(p.value).length,2,'exact rc4230 inverse boundary '+p.marker);
    text=text.replace(p.value,p.old);
  }
  return text;
}
