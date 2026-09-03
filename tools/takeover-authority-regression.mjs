import assert from 'node:assert/strict';import {takeoverErrors} from './takeover-authority.mjs';
const head='a'.repeat(40),main='b'.repeat(40),now=Date.now(),local={branch:'pitti/example',head,clean:true,origin:'https://github.com/Muero42/draft-companion.git',remoteMain:main};
const e={...local,repo:'Muero42/draft-companion',canonicalBranch:'main',canonicalHead:main,prHead:head,prState:'OPEN',ciHead:head,fresh:true,verifiedAt:now,evidenceSource:'GITHUB_API',authorizedWorkPackage:true,checks:['project_guardrails','release_contract_v2','candidate_package'].map(name=>({name,result:'PASS'}))};
assert.deepEqual(takeoverErrors(e,local,now),[]);
for(const patch of [{verifiedAt:now-300001},{verifiedAt:now+1},{head:main},{canonicalHead:head},{evidenceSource:'CHECKPOINT'},{ciHead:main},{authorizedWorkPackage:false}])assert(takeoverErrors({...e,...patch},local,now).length);
assert(takeoverErrors(e,{...local,clean:false},now).length);assert(takeoverErrors(e,{...local,origin:'https://github.com/other/repo'},now).length);
console.log('TAKEOVER_REGRESSION_PASS positive + 9 negatives');
