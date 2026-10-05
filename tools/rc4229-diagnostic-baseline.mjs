import fs from 'node:fs';import assert from 'node:assert/strict';
// Retain exact historical RC4228 assertions while testing the new block independently.
export function rc4228HistoricalApp(text){
  if(!text.includes('// RC4229 nested route shape research:'))return text;
  const begin='// BEGIN RC4228 DIAGNOSTIC ONLY\n',end='// END RC4228 DIAGNOSTIC ONLY\n';
  assert.equal(text.split(begin).length,2);assert.equal(text.split(end).length,2);
  const start=text.indexOf(begin),finish=text.indexOf(end)+end.length;
  return text.slice(0,start)+fs.readFileSync(new URL('./fixtures/rc4229/rc4228-diagnostic-block.txt',import.meta.url),'utf8').replace(/\r\n/g,'\n')+text.slice(finish);
}
