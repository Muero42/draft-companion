# RC4.203 physical projection-lane failure — immutable history

- Version observed: `v11.8.0-rc4.203`.
- Production source: `main@fb458e076de6710a91f1162e504b5b79fb67167c`.
- Production deployment: `ef65bcf6-92d1-4c34-9873-c362bec002c7`, verified successful independently of device acceptance.
- Physical verdict: `RC4.203_PHYSICAL_FAIL_WEEKLY_PROJECTION_SEMANTIC_SCOPE_MISMATCH`.
- Acceptance: `FAILED / NOT ACCEPTED`.
- Failure boundary: provider projection evidence was rejected before mapping because weekly semantic/distribution safety failed for QB/RB/WR/TE.
- Mapping, missing numeric access, proxy mutation, and chronology were disproven as the first failure.

The later secret-safe provider A/B diagnostic proved that explicit `ros=false` materially changed weekly projection semantics, including all-zero QB output, while the same explicit season/week/position request with `ros` omitted produced materially different weekly evidence. This diagnosis occurred after the rc4.203 physical observation and must not be rewritten as contemporaneous physical evidence.

RC4.204 repairs the proven cause by omitting `ros` from weekly explicit-week/position requests. This historical record proves neither RC4.204 deployment nor device acceptance.
