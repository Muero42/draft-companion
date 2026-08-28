import fs from 'node:fs';
const app=fs.readFileSync('app.js','utf8');
const must=(ok,msg)=>{if(!ok){console.error('RC499_WR_SATURATION_FAIL:',msg);process.exitCode=1;}};
const m=app.match(/function marginalRosterUtility\(p,current,state\)\{([\s\S]*?)\n\}/);
must(!!m,'marginalRosterUtility missing');
const fn=new Function('p','current','state',m?m[1]+'\nreturn x;':'return NaN;');
const s=(wr,rb,pick,pos='WR')=>fn({pos},pick,{counts:{WR:wr,RB:rb,QB:0,TE:0}});
const vals=[
 ['WR6/RB4@101',s(6,4,101),-7.5],
 ['WR7/RB4@101',s(7,4,101),-10.5],
 ['WR8/RB4@101',s(8,4,101),-13.5],
 ['WR6/RB4@121',s(6,4,121),-17],
 ['WR7/RB4@121',s(7,4,121),-20],
 ['WR8/RB4@121',s(8,4,121),-23],
];
for(const [label,got,want] of vals)must(Math.abs(got-want)<1e-9,`${label}: ${got} != ${want}`);
must(s(7,4,101)<s(6,4,101),'WR7 must cost more than WR6');
must(s(8,4,101)<s(7,4,101),'WR8 must cost more than WR7');
must(s(6,4,121)<s(6,4,101),'late WR6 cost must strengthen');
must(s(5,4,121)===0,'WR5 must not be hard-capped');
must(s(6,5,121)===-14,'portfolio imbalance penalty must disappear once RB5 exists');
must(s(6,4,121,'RB')===3.5,'RB5 late contingency utility expected');
must(!/return\s+-999/.test(m?.[1]||''),'hard positional exclusion detected');
console.log('RC499_WR_SATURATION_PASS '+vals.map(x=>x[0]+'='+x[1]).join(' '));
