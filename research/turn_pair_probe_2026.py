#!/usr/bin/env python3
"""Research-only deterministic turn-pair scoring core.

This module deliberately contains no outcome evaluator and no player-specific rules.
It is intended to be wired to rc4.59 candidate/Return-v2 snapshots by the harness.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Iterable, Mapping, Sequence

USER_PICKS = (9, 12, 29, 32, 49, 52, 69, 72, 89, 92, 109, 112, 129, 132, 149)
TURN_START_TO_RETURN = {9: 12, 29: 32, 49: 52, 69: 72, 89: 92, 109: 112, 129: 132}

@dataclass(frozen=True)
class Candidate:
    player_id: str
    name: str
    pos: str
    quality: float

@dataclass(frozen=True)
class ReturnState:
    probability: float
    available_ids: frozenset[str]

@dataclass(frozen=True)
class PairScore:
    first: Candidate
    expected_return_quality: float
    expected_starter_delta: float
    total: float


def _best_available(candidates: Sequence[Candidate], available_ids: frozenset[str], excluded: str) -> Candidate | None:
    viable = [c for c in candidates if c.player_id != excluded and c.player_id in available_ids]
    return max(viable, key=lambda c: (c.quality, c.player_id), default=None)


def validate_return_states(states: Iterable[ReturnState], tol: float = 1e-6) -> tuple[ReturnState, ...]:
    states = tuple(states)
    if not states:
        raise ValueError("return-state distribution is empty")
    if any(s.probability < 0 for s in states):
        raise ValueError("negative return-state probability")
    total = sum(s.probability for s in states)
    if abs(total - 1.0) > tol:
        raise ValueError(f"return-state probabilities sum to {total}, expected 1")
    return states


def score_first_candidate(
    first: Candidate,
    return_candidates: Sequence[Candidate],
    return_states: Iterable[ReturnState],
    starter_delta_by_pair: Mapping[tuple[str, str], float],
    starter_lambda: float,
) -> PairScore:
    states = validate_return_states(return_states)
    eq = 0.0
    es = 0.0
    for state in states:
        second = _best_available(return_candidates, state.available_ids, first.player_id)
        if second is None:
            raise ValueError(f"no legal return candidate for state after {first.name}")
        eq += state.probability * second.quality
        es += state.probability * float(starter_delta_by_pair.get((first.player_id, second.player_id), 0.0))
    return PairScore(first, eq, es, first.quality + eq + starter_lambda * es)


def choose_turn_pair(
    frontier: Sequence[Candidate],
    return_candidates: Sequence[Candidate],
    return_states_by_first: Mapping[str, Sequence[ReturnState]],
    starter_delta_by_pair: Mapping[tuple[str, str], float],
    starter_lambda: float,
) -> tuple[Candidate, tuple[PairScore, ...]]:
    if not frontier:
        raise ValueError("frontier is empty")
    scored = []
    for first in frontier:
        states = return_states_by_first.get(first.player_id)
        if states is None:
            raise ValueError(f"missing return states for {first.name}")
        scored.append(score_first_candidate(first, return_candidates, states, starter_delta_by_pair, starter_lambda))
    ranked = tuple(sorted(scored, key=lambda x: (-x.total, -x.first.quality, x.first.player_id)))
    return ranked[0].first, ranked


def assert_geometry() -> None:
    assert USER_PICKS == tuple(sorted(USER_PICKS))
    for start, ret in TURN_START_TO_RETURN.items():
        assert start in USER_PICKS and ret in USER_PICKS and ret > start


def self_test() -> None:
    assert_geometry()
    a = Candidate("a", "A", "WR", 100.0)
    b = Candidate("b", "B", "RB", 99.0)
    c = Candidate("c", "C", "WR", 95.0)
    states_a = (ReturnState(1.0, frozenset({"c"})),)
    states_b = (ReturnState(1.0, frozenset({"a", "c"})),)
    chosen, ranked = choose_turn_pair(
        [a, b], [a, b, c], {"a": states_a, "b": states_b}, {}, 0.0
    )
    # B wins despite lower current quality because A can return after B, while B cannot after A.
    assert chosen.player_id == "b", ranked

    # Starter-state term is bounded/external and can break an otherwise close pair without a position rule.
    chosen2, _ = choose_turn_pair(
        [a, b], [a, b, c], {"a": states_a, "b": states_b}, {("a", "c"): 10.0}, 1.0
    )
    assert chosen2.player_id == "a"

    try:
        validate_return_states((ReturnState(0.8, frozenset({"a"})),))
    except ValueError:
        pass
    else:
        raise AssertionError("invalid probability mass was accepted")

if __name__ == "__main__":
    self_test()
    print("turn_pair_probe_2026: self-test PASS")
