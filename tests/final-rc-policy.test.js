'use strict';
const assert=require('assert');
const fs=require('fs');
const app=fs.readFileSync('app.js','utf8');

assert(app.includes("const USER_HARD_QB_EXCLUSIONS=new Set(['genosmith','aaronrodgers'])"),'hard QB exclusions missing');
assert(app.includes("ashtonjeanty:{label:'AKUTER STATUS: Sprunggelenkverletzung"),'acute Jeanty status guard missing');
assert(app.includes('recommendationBlocked:true'),'acute status does not fail closed');

// Early/mid duplicate suppression remains strong.
assert(app.includes("current>=141?-2:current>=121?-10:-24"),'QB2 need is not phase-sensitive');
assert(app.includes("current>=141?-4:current>=121?-12:-22"),'TE2 need is not phase-sensitive');
assert(app.includes("if(current>=141)return elite?0:-8"),'late QB2 exceptional-value escape missing');
assert(app.includes("if(current>=141)return elite?0:-10"),'late TE2 exceptional-value escape missing');
assert(app.includes("if(current>=121)return elite?-4:-24"),'mid-late QB2 remains insufficiently guarded');
assert(app.includes("if(current>=121)return elite?-5:-26"),'mid-late TE2 remains insufficiently guarded');

// Stale blanket behavior must not survive unchanged.
assert(!app.includes("const qbNeed=c.QB===0?(current>=125?13:current>=95?9:current>=65?4:1):-24"),'permanent QB2 need penalty survived');
assert(!app.includes("return elite?-8:-42;\n  }\n  if(pos==='TE'"),'permanent QB2 exception penalty survived');

// Distinguish final candidate from stable baseline/research lineage.
assert(app.includes('rc4.60'),'final RC version marker missing');

console.log('PASS final RC policy gate');
