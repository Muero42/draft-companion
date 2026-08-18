const assert = require('assert');

// Finalization gate for the live manager layer.
// Contract: explicit user status > observed live mode > automatic inference.
function effectiveMode({ explicitMode = null, observedMode = null, inferredAutodraft = 0 }) {
  if (explicitMode === 'manual' || explicitMode === 'autodraft') return explicitMode;
  if (observedMode === 'manual' || observedMode === 'autodraft') return observedMode;
  return inferredAutodraft >= 0.80 ? 'autodraft' : 'manual';
}

function learningWeight({ explicitMode = null, observedMode = null, inferredAutodraft = 0, isOwnPick = false }) {
  if (isOwnPick) return 0;
  if (effectiveMode({ explicitMode, observedMode, inferredAutodraft }) === 'autodraft') return 0;
  // Uncertain machine-like behavior damps learning even before the hard autodraft threshold.
  return Math.max(0.15, 1 - 0.85 * Math.max(0, Math.min(1, inferredAutodraft)));
}

function adaptivePreference({ historicalPrior = 0, observations = [], explicitMode = null, observedMode = null, inferredAutodraft = 0 }) {
  const usable = observations.filter(o => !o.isOwnPick && o.mode !== 'autodraft');
  const w = learningWeight({ explicitMode, observedMode, inferredAutodraft });
  if (!usable.length || w === 0) return historicalPrior;
  const liveMean = usable.reduce((s, o) => s + o.signal, 0) / usable.length;
  // 2025/history remains the prior; repeated 2026 evidence gains weight gradually.
  const liveEvidence = Math.min(0.85, (usable.length / (usable.length + 3)) * w);
  return historicalPrior * (1 - liveEvidence) + liveMean * liveEvidence;
}

assert.equal(effectiveMode({ explicitMode: 'autodraft', observedMode: 'manual', inferredAutodraft: 0 }), 'autodraft');
assert.equal(effectiveMode({ explicitMode: 'manual', observedMode: 'autodraft', inferredAutodraft: 1 }), 'manual');
assert.equal(effectiveMode({ observedMode: 'autodraft', inferredAutodraft: 0 }), 'autodraft');
assert.equal(effectiveMode({ inferredAutodraft: 0.95 }), 'autodraft');
assert.equal(learningWeight({ explicitMode: 'autodraft' }), 0);
assert.equal(learningWeight({ isOwnPick: true }), 0);
assert(learningWeight({ inferredAutodraft: 0.60 }) < learningWeight({ inferredAutodraft: 0.10 }));

// One surprising pick must not erase a meaningful historical prior.
const oneSurprise = adaptivePreference({ historicalPrior: -0.60, observations: [{ signal: 1 }] });
assert(oneSurprise < 0, `single pick overreacted: ${oneSurprise}`);

// Repeated consistent live evidence can overturn history.
const repeated = adaptivePreference({ historicalPrior: -0.60, observations: Array.from({ length: 6 }, () => ({ signal: 1 })) });
assert(repeated > 0, `repeated live evidence failed to overturn prior: ${repeated}`);

// Autodraft-labelled segments never teach personal preferences.
const noLearn = adaptivePreference({ historicalPrior: -0.60, observations: Array.from({ length: 8 }, () => ({ signal: 1, mode: 'autodraft' })) });
assert.equal(noLearn, -0.60);

// Explicit autodraft freezes learning even if observations look manual.
const explicitFreeze = adaptivePreference({ historicalPrior: 0.25, explicitMode: 'autodraft', observations: Array.from({ length: 8 }, () => ({ signal: -1 })) });
assert.equal(explicitFreeze, 0.25);

// Same frozen inputs must be deterministic.
assert.equal(
  adaptivePreference({ historicalPrior: 0.2, observations: [{ signal: -1 }, { signal: -1 }, { signal: 1 }], inferredAutodraft: 0.2 }),
  adaptivePreference({ historicalPrior: 0.2, observations: [{ signal: -1 }, { signal: -1 }, { signal: 1 }], inferredAutodraft: 0.2 })
);

console.log('manager-live-adaptation gate: OK');
