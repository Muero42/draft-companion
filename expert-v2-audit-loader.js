// PITTI Expert-v2 same-origin audit loader. Research-only; no credential export.
// Loads after app.js so it can reuse the app's existing local FantasyPros credential/proxy path.
(()=>{
 const s=document.createElement('script');
 s.src='./research/expert-v2-local-audit-snippet.js?v=20260826b';
 s.defer=true;
 document.head.appendChild(s);
})();
