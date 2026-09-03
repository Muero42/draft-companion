import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
const out=path.resolve(process.argv[2]||'.pitti-cloud-output'),root=process.cwd();fs.mkdirSync(out,{recursive:true});
if(process.versions.node.split('.')[0]!=='22')throw Error('Cloud validation requires Node 22');
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim(),head=git('rev-parse','HEAD');
// write-tree includes a staged candidate before publication; CI uses a clean exact HEAD.
const tree=process.env.PITTI_VALIDATED_TREE||git('write-tree'),run=(file,...args)=>execFileSync(process.execPath,[file,...args],{stdio:'inherit',env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'0'}});
run('tools/strict-suite.mjs',path.join(out,'strict-suite.json'));
run('tools/cloud-workflow-check.mjs');
run('tools/season-browser-review.mjs',path.join(out,'browser'));
run('tools/package-reextract.mjs',out);
const pack=fs.readdirSync(out).find(x=>x.startsWith('package-')),receipt=JSON.parse(fs.readFileSync(path.join(out,pack,'receipt.json')));
// Exercise re-extracted bytes in a full validation harness, without changing source.
const harness=path.join(out,'reextract-harness');fs.mkdirSync(harness,{recursive:true});
for(const f of git('ls-files').split('\n')){if(f.startsWith('dist/'))continue;const p=path.join(harness,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.copyFileSync(path.join(root,f),p);}
for(const f of fs.readdirSync(path.join(out,pack,'reextract')))fs.copyFileSync(path.join(out,pack,'reextract',f),path.join(harness,f));
for(const t of ['release-contract-v2','runtime-startup-contract','live-presentation-behavior','season-decision-engine-regression','season-adversarial-review-regression','pitti_guardrail_check'])execFileSync(process.execPath,['tools/'+t+'.mjs'],{cwd:harness,stdio:'inherit',env:{...process.env,PITTI_SKIP_SEAL_INTEGRITY:'0',PITTI_CANDIDATE_PREFLIGHT:'0'}});
if(!process.env.PITTI_VALIDATED_TREE&&(git('write-tree')!==tree||git('diff','--name-only')))throw Error('validation mutated tracked content');
const implementation=JSON.parse(fs.readFileSync(path.join(path.dirname(out),'implementation.json'),'utf8'));
fs.writeFileSync(path.join(out,'candidate-validation.json'),JSON.stringify({schema:'pitti.candidate-validation.v1',status:'PASS',head,tree,patch_sha256:implementation.patch_sha256,node:process.version,package:receipt,checks:['strict-suite','workflow-syntax','browser','package-reextract-behavior','strict-seal'],deployment:false,deviceAccepted:false},null,2));
