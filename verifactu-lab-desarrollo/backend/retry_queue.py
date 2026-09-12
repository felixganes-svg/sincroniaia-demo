from __future__ import annotations
from dataclasses import dataclass
from datetime import datetime

@dataclass(frozen=True)
class RetryItem:
    numero: str
    eligible_at: str
    request_sha256: str


def due(items: list[RetryItem], now_iso: str) -> list[RetryItem]:
    now = datetime.fromisoformat(now_iso)
    return sorted(
        [x for x in items if datetime.fromisoformat(x.eligible_at) <= now],
        key=lambda x: (datetime.fromisoformat(x.eligible_at), x.numero),
    )


def dedupe_by_request(items: list[RetryItem]) -> list[RetryItem]:
    seen: set[str] = set()
    out: list[RetryItem] = []
    for item in items:
        if item.request_sha256 in seen:
            continue
        seen.add(item.request_sha256)
        out.append(item)
    return out
