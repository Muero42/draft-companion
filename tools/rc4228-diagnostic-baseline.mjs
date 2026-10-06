import {rc4229HistoricalRuntime} from './rc4230-diagnostic-baseline.mjs';
import assert from 'node:assert/strict';
// Reconstruct immutable RC4227 runtime for its historical release-binding assertions.
// New diagnostic behavior is independently tested by season-rc4228-route-diagnostic-regression.
export function rc4227HistoricalApp(text){
 text=rc4229HistoricalRuntime('app.js',text);
 text=text.replaceAll('v11.8.0-rc4.230','v11.8.0-rc4.229').replaceAll('v11.8.0-rc4.229','v11.8.0-rc4.228');
 text=text.replaceAll('v11.8.0-rc4.228','v11.8.0-rc4.227');
 if(!text.includes('// BEGIN RC4228 DIAGNOSTIC ONLY'))return text;
 const begin='// BEGIN RC4228 DIAGNOSTIC ONLY\n',end='// END RC4228 DIAGNOSTIC ONLY\n';
 assert.equal(text.split(begin).length,2);assert.equal(text.split(end).length,2);
 const start=text.indexOf(begin),finish=text.indexOf(end)+end.length;
 assert(finish>start);const block=text.slice(start,finish);
 const trigger='    // RC4228 explicit-only route research; never publishes evidence.\n    report.individualRankRouteResearch=await seasonIndividualRankRouteResearch({...context,source,blocked:stopAll||stopExperts||stopProjections});\n';
 assert.equal(text.split(trigger).length,2);
 return text.replace(block,'').replace(trigger,'');
}
