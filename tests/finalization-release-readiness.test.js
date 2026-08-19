'use strict';
const assert = require('assert');
const fs = require('fs');

const app = fs.readFileSync('app.js','utf8');

// This gate intentionally checks the generated runtime, not standalone reference helpers.
// rc4.52 must not be committed as a release candidate while the visible normal/below-cut
// split is hard-coded. The canonical requirement is a dynamic split (for example 7+3,
// 6+4, 8+2) based on the actual admissible Companion block.
assert(app.includes("const LIVE_DRAFT_ID_2026='1366053132970233856'"), 'generated runtime missing canonical LIVE draft ID');
assert(app.includes('validateCanonicalLiveDraft'), 'generated runtime missing LIVE metadata guard');
assert(app.includes('visibleCoachCandidates'), 'generated runtime missing Top-10 visibility helper');
assert(!app.includes('visibleCoachCandidates(rows,7)'), 'Top-10 normal/below-cut split is still hard-coded to 7+3; dynamic cut integration is required before release-candidate commit');

console.log('PASS finalization release-readiness gate');
