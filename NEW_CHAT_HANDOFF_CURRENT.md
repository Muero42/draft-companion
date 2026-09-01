# NEW CHAT HANDOFF — PITTI SEASON COMPANION
Handoff generation: `20260901T2024Z-v220`

- Main source candidate: **v11.8.0-rc4.169** at `ca75081e4361092e42eb75d5568a21dfe69cca33`.
- Installed Android/PWA: **v11.8.0-rc4.168**.
- rc4.169 fixes the proven workspace leak caused by author CSS overriding the HTML hidden state.
- Draft-only Mock/LIVE/status controls remain exclusively in Draft-Archiv.
- Season workspaces now expose ranking age + manual refresh; stale rankings auto-refresh after 12h, with 2h retry throttle on failures. Cached verified rankings remain active on refresh failure.
- Season renderer lanes are isolated: Trade failure cannot blank Waiver/Kader; FA failure blocks only dependent Waiver/Action lanes. Failures include the exact surface/stage.
- PR #90 full gates PASS; main runtime package/release PASS. Main metadata reseal v220 is the remaining CI bookkeeping step before preview parity.
- Transaction canary preserved: Harrison Mevis rostered; Tank Bigsby absent; Zach Charbonnet Reserve/IR.
- Watcher v0.2.3 D1 fix preserved.
- AUTO rules: continuous. Never send status/progress/acknowledgement messages while executable AUTO work remains. No empty response, no micro-commit deployment storm.
- Next gate: **RC4169_PREVIEW_PARITY_THEN_DEVICE_REFRESH**.
