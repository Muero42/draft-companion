export const RUNTIME_FILES=Object.freeze([
  'index.html',
  'app.js',
  'decision-policy.js',
  'weekly-evidence-v2.js',
  'styles.css',
  'manifest.webmanifest',
  'sw.js',
  '_worker.js',
  'icon.svg',
  'live-surface-v3.js',
  'live-surface-v3.css',
  'expert-board-export.js',
  'expert-v2-board.js',
  'expert-v3-board.js'
]);

export const STATIC_ASSET_FILES=Object.freeze(RUNTIME_FILES.filter(file=>file!=='_worker.js'));
