# RC4.220 adversarial local review

1. VERDICT: REPAIRED. Three defects reproduced before tracked mutation: microscopic rank differences created BUY LOW / SELL HIGH; an opponent acquired another owner's drafted player and inherited a draft penalty of 12; equal score 23/utility 10.5 switched from actionable to suppressed at 50% -> 50.000125% market deviation. Partial transaction history was also missing an explicit scope label.

2. Git-read reviewed identity: branch codex/rc4220-trade-opportunity-model; HEAD 6df0552904fbb3c4a78ab6c9b1bfdc3a96db0cf0; tree 43cee9370be5f96aba0cf38882dd2726f77c9c39; parent 32681046e0e24956ed521f7615dc67ffd06ea6a2; worktree CLEAN at entry. The corrective commit's exact identity is reported after committing, avoiding a self-reference in this sealed document. Generation 20261002T2007Z-v287.

3. Three axes: PITTI utility is verified optimal weekly lineup delta plus 0.25 of verified bench replacement delta. Optimal FLEX/starter geometry uses the unchanged actual slot optimizer. Bench counts only unused active skill assets, at most two per position, so lineup and bench assets are disjoint. Boone prices are a separate native market scale, never summed with fantasy points. Current role/injury/ROS/consolidation/bye/scarcity evidence receives no additional unverified bonus; no long-term utility model or season-wide forecast is claimed. This is a bounded weekly/bench proxy, a stated limitation. Both positive weekly and positive bench-only cases remain supported. Opponent gain <=0 is not an admission gate; utility >0.5, conservative score >=18 and credible fit/need/market evidence are required. Illegal, negative-utility and stale cases remain suppressed.

4. Buy-low/sell-high: two independently sourced within-position orders (verified weekly projection and current Boone) require >=4 comparable players and percentile gap >=0.34. Corrected material margins: weekly max(0.5 points, 2% of player's projection), market max(1 native Boone unit, 2%). Smaller gaps count as ties. Fixtures cover true BUY LOW and SELL HIGH, neutral, microscopic noise and expired evidence. These are current-week forward signals, explicitly not ROS conviction or a fabricated role trajectory. No transformed Boone value serves as the internal projection.

5. Manager evidence: live positional depth/shortage and actual lineup delta provide fit. Draft history now requires exact picked_by == the unique current live owner_id AND pick player_id == asset ID for every received asset. Missing/duplicate owner IDs, wrong player binding, changed owner/roster and duplicate display names cannot cross-map. No manager profile/personality is consumed by trade admission. Only verified owner-mapped early-season draft reversal gets the existing 12 penalty at 25% weight; unknown mapping has zero weight. The unchanged pre-Week-1 draft-capital safety veto remains. Current transactions are ONLY the fetched current round/week, max128 scanned, unique IDs, completed status, correct recipient, current season and <=30-day event age. They contribute max4 index points and are labeled CURRENT_ROUND_PARTIAL, not complete season history or stable personality.

6. Fairness: separate classification boundaries remain descriptive. Corrected score penalizes absolute signed market deviation continuously in both directions; removed the additional >50% hard admission veto. Under/overpayment monotonicity passes with fixed utility and opponent roster; both adjacent 50% values pass identically. Extreme underpayment and overpayment remain below minimum plausibility; historical evidence can only penalize and cannot rescue them. HIGH/MEDIUM/LOW/VERY LOW remain uncalibrated categories; no fake acceptance percentage is rendered.

7. Packages/complexity: six sell assets, six targets/opponent, <=five secondaries before expansion; 21 give groups x6 get groups =126/target, <=9x6x126=6,804 evaluations in the production-scale ten-team/15-player fixture. Cooperative yield every four evaluations; <=12 retained offers/target, <=four cards. Supports 1:1/2:1/1:2/2:2. Core rejects duplicated/cross-side IDs, same roster, capacity failure, reserve/IR assets and loss of sole active QB/TE. Equivalent packages across targets deduplicate by sorted full asset ID sets. Pool prioritization is heuristic and intentionally does not guarantee exhaustive optimal search.

8. Surfacing/explanation: ordering by conservative plausibility then utility, market/tie rules; separate realistic/buy/sell/exploratory category selection. Canonically equivalent packages appear once. Cards keep PITTI BENEFIT / MARKET PRICE / OPPONENT FIT / ACCEPTANCE PLAUSIBILITY / WHY THEY MIGHT ACCEPT / WHY WE WANT IT / confidence and INVALIDATOR. Nonpositive opponent delta explicitly says equal or weaker, exploratory. Actual-card fixture proves a LOW asymmetric offer renders instead of HOLD, ignores unrelated synthetic position need and preserves live FAAB. Categories are bounded exact-package deduplication, not an exhaustive similarity clustering scheme. No automatic send or external communication.

9. Initial 261/262 failure: exact failing test tools/live-trade-manager-faab-regression.mjs, missing managerLabel=t.manager?.manager_name in the rewritten card. Original card showed manager identity and FAAB; initial rewrite retained identity but omitted FAAB. Repair restored live managerLabel/faab rendering and excludes null/undefined budgets. Live metadata hydration and all waiver/FAAB computation functions stayed unchanged, proven by source equality against v285. Original manager/FAAB regression file is byte-for-byte unchanged; actual-card assertion FAAB37 is additional coverage. No assertion was weakened to pass that failure.

10. Regression safety: v285 byte-equality proven for waiverMarketSummary, waiverOpponentMarket, renderQbOpportunityBoard, renderSpecialTeamsBoard, seasonAcquisitionDecision, seasonProjectionLineup, seasonWeeklyMetric, seasonEvidenceCache, seasonRunWork, seasonReadUnit and directory/context helpers. 13 unchanged runtime files remain canonical-identical. Real scorer parity, sync/cooperative trade equivalence, six invalidations, bootstrap cleanup, expiry/context/revision cancellation and evidence reuse tests pass. QB FAAB9/9, D/ST, Weekly, CHI->NYJ and Start/Sit are unchanged; final Strict validates these retained contracts.

11. Complete 25-file diff review: all files attributable below. Version-only runtime files verified; historical source/Production receipts unchanged; prior document bodies preserved as exact historical suffixes; existing historical JSON entries unchanged. No unrelated cleanup, formatting-only churn or generated runtime drift. Deprecated trade-team-needs-v2.js remains outside the 17-file runtime; Production decisions use seasonTradeDecision only, with synchronous wrapper draining the same cooperative generator. Formula/source-lock expectations changed only for the deliberately authorized trade semantics; evidence/lineup/FAAB/ownership/capacity gates remain. Test adaptation replacing the old card rationale is backed by the actual RC4220 card fixture, not merely text tokens.

- HANDOFF_COMPLETENESS_MATRIX.md: Current Authority header; prior text retained as historical suffix
- NEW_CHAT_HANDOFF_CURRENT.md: Current Authority header; prior text retained as historical suffix
- PITTI_AUTO_PREFLIGHT.md: Current Authority header; prior text retained as historical suffix
- PITTI_COMMAND_CONTRACTS.json: Authority/Seal coupling
- PITTI_CURRENT_STATE.json: Authority/Seal coupling
- PITTI_EXECUTION_LOCK.json: Authority/Seal coupling
- PITTI_HANDOFF_SEAL.json: Authority/Seal coupling
- PITTI_NEW_CHAT_BOOTSTRAP.md: Current Authority header; prior text retained as historical suffix
- PITTI_PROJECT_STATE.md: Current Authority header; prior text retained as historical suffix
- README.md: Current Authority header; prior text retained as historical suffix
- app.js: Three-axis model, bounded generation and card rendering
- docs/PITTI_RC4216_DECISION_QUALITY.md: Current Authority header; prior text retained as historical suffix
- docs/PITTI_RC4220_TRADE_OPPORTUNITY_MODEL.md: Exact local implementation/validation report
- index.html: Version/cache identity
- manifest.webmanifest: Version/cache identity
- sw.js: Version/cache identity
- tools/pitti_guardrail_check.mjs: Focused regression/guardrail/authority contract
- tools/postmerge-authority-contract.mjs: Focused regression/guardrail/authority contract
- tools/postmerge-authority-regression.mjs: Focused regression/guardrail/authority contract
- tools/season-boone-production-parity-regression.mjs: Focused regression/guardrail/authority contract
- tools/season-browser-review.mjs: Focused regression/guardrail/authority contract
- tools/season-rc4219-adversarial-regression.mjs: Focused regression/guardrail/authority contract
- tools/season-rc4220-trade-model-regression.mjs: Focused regression/guardrail/authority contract
- tools/season-residual-interaction-regression.mjs: Focused regression/guardrail/authority contract
- tools/season-waiver-trade-v1-regression.mjs: Focused regression/guardrail/authority contract

12. Actual validation: entry guardrail PASS; initial receipt 261/262 and corrected implementation receipt 262/262 inspected. Read-only inline probes reproduced all three defects. Focused semantic/adversarial, Boone adapter parity, real RC4219 scorer/cancellation, bounded stress, legal-capacity, original manager/FAAB and decision-engine tests passed after repairs. Because this review changed files, Complete Strict Suite runs exactly once on the final corrected sealed review tree, with final result reported after it finishes; no result is inherited from the previous 262/262 receipt. Candidate/Main Guardrail and Seal integrity required; runtime manifest17 and diff check required before the single corrective commit.

13. Authority: rc4.219 USER_CONFIRMED RESPONSIVENESS PHYSICAL PASS preserved; full functional acceptance remains PENDING. rc4.220 LOCAL CANDIDATE / NOT PUBLISHED / NOT DEPLOYED / NOT PHYSICALLY ACCEPTED. Historical rc4.218 failure and canonical Production receipt untouched.

14. Exact next safe gate: RC4220_CORRECTED_LOCAL_REVIEW_COMPLETE_PUBLICATION_PENDING. STOP after one corrective local commit; no publication, PR, merge, deployment, physical acceptance or Sleeper transaction.
