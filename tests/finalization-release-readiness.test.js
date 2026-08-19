'use strict';
const assert = require('assert');
const fs = require('fs');

const app = fs.readFileSync('app.js','utf8');

// Generated-runtime gate: reference helpers alone are insufficient.
assert(app.includes("const LIVE_DRAFT_ID_2026='1366053132970233856'"), 'generated runtime missing canonical LIVE draft ID');
assert(app.includes('validateCanonicalLiveDraft'), 'generated runtime missing LIVE metadata guard');

// Candidate visibility must derive a dynamic normal Companion boundary from the actual
// Value-Safety metadata and only then fill to at most ten with explicit fallbacks.
assert(app.includes('function normalCandidateAdmissible(row)'), 'generated runtime missing normal-admissibility predicate');
assert(app.includes('function visibleCoachCandidates(rows)'), 'generated runtime missing dynamic Top-10 helper');
assert(app.includes('qualityBandMax'), 'normal cut is not tied to Value-Safety quality band');
assert(!app.includes('visibleCoachCandidates(rows,7)'), 'Top-10 split is still hard-coded to 7+3');
assert(!app.includes("i===7?'<div class=\"coach-section-title\">Weitere sichtbare Kandidaten"), 'separator is still hard-coded at index 7');
assert(app.includes('AUSSERHALB NORMAL-CUT'), 'below-cut candidates are not conspicuously marked');
assert(app.includes('NUR KONTEXT'), 'below-cut candidates still appear to have normal TAKE/WAIT authority');

// Mandatory 2026 live manager adaptation must be wired into app.js itself. State is
// rebuilt from the visible pick history every refresh, so repeated refreshes cannot
// double-learn the same pick. Explicit user mode segments outrank observation/inference.
assert(app.includes('LIVE_MANAGER_ADAPTATION_STATE'), 'generated runtime missing live manager state');
assert(app.includes('parseManagerModeOverrides'), 'generated runtime missing explicit manual/autodraft override path');
assert(app.includes('syncManagerModeSegments'), 'generated runtime missing segment-switch provenance');
assert(app.includes('effectiveManagerMode'), 'generated runtime missing mode-precedence resolver');
assert(app.includes('rebuildLiveManagerAdaptation({mode,picks,players,map,current,modeText:els.managerMap.value})'), 'live manager adaptation not invoked from refresh');
assert(app.includes("if(live?.currentMode==='autodraft')return{mult:1"), 'autodraft personal-trait boundary missing');
assert(app.includes("if(live.currentMode==='autodraft')return 1"), 'autodraft historical manager multiplier is not disabled');
assert(app.includes('currentDraftWeight'), 'generated runtime missing bounded current-draft weighting');

console.log('PASS finalization release-readiness gate');
