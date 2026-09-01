import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
const must=[
  "const WEEK1_WAIVER_MARKET_2026=",
  "expiresAt:Date.parse('2026-09-08T12:00:00Z')",
  "[norm('MarShawn Lloyd')]:{rank:1,move:'ALL'}",
  "[norm('Tyjae Spears')]:{rank:9,move:'10+'}",
  "[norm('Tank Bigsby')]:{rank:12,move:'10+'}",
  "Date.now()>WEEK1_WAIVER_MARKET_2026.expiresAt",
  "const waiverMarket=week1WaiverMarketSignal(fa.p)",
  "freshEvidencePresent=(faFresh.events+dropFresh.events)>0||!!waiverMarket",
  "Waiver/FA Priority v2"
];
for(const x of must)if(!s.includes(x))throw new Error('missing waiver-market contract: '+x);
if(!s.includes("source:'RotoBaller · Nick Mariano · Before Week 1 waiver rankings'"))throw new Error('missing provenance');
console.log('week1 waiver market regression PASS');
