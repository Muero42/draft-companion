import fs from 'node:fs';
const s=fs.readFileSync('app.js','utf8');
for(const x of ["const v4Id='expert-v4-'+pos.toLowerCase()","const koernerWeight=.20,scale=1-koernerWeight","source:'verified v4 individual-only + verified Sean Koerner'"])if(!s.includes(x))throw new Error('v5 hybrid contract missing '+x);
if(s.includes("const baseId=EXPERT_PROFILE_IDS.expertv3[pos]"))throw new Error('v5 still depends on legacy v3');
if(s.includes("'Draft Sharks Team funding'"))throw new Error('v5 still requires DS funding');
console.log('rc4.115 v5 hybrid PASS');
