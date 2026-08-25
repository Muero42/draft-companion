const fs=require('fs');
const js=fs.readFileSync('live-surface.js','utf8');
const css=fs.readFileSync('live-surface.css','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const must=(ok,msg)=>{if(!ok)throw new Error(msg)};
// The legacy staged module itself is intentionally pinned to rc4.61. The integrated app/html
// release is not: requiring rc4.60 there made every later legitimate release bump fail.
must(js.includes("const VERSION='v11.8.0-rc4.61'"),'rc4.61 staged module version missing');
must(js.includes('PITTI LIVE DECISION'),'compact handoff missing');
must(js.includes('Full Diagnostic Snapshot kopiert.'),'full diagnostic path missing');
must(js.includes("scrollIntoView({behavior:'smooth',block:'start'})"),'analysis jump missing');
must(js.includes("slice(0,5)"),'live candidate surface must stay compact');
must(css.includes('.draft-live-view .live-decision-surface'),'live-only surface CSS missing');
must(css.includes('position:sticky'),'decision surface must remain reachable on mobile');
must(app.includes('visibleCoachCandidates(scored)'),'canonical candidate safety gate missing');
must(/App-Version: v11\.8\.0-rc4\.\d+/.test(app),'current app release marker missing');
must(/v11\.8\.0-rc4\.\d+/.test(html),'current HTML release marker missing');
console.log('RC4_61_LIVE_SURFACE_REGRESSION PASS (legacy module staged; current release baseline accepted)');
