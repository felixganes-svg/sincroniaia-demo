from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class FiscalLine:
    description: str
    tax_rate: str
    base: str
    quota: str
    total: str

@dataclass(frozen=True)
class ClosedTicket:
    ticket_ref: str
    closed: bool
    closed_at: str
    total: str
    seller: str
    payment_method: str
    lines: tuple[FiscalLine, ...]


def validate_closed_ticket(ticket: ClosedTicket) -> None:
    if not ticket.closed:
        raise ValueError("TICKET_NOT_CLOSED")
    if not ticket.ticket_ref.strip():
        raise ValueError("TICKET_REF_REQUIRED")
    if not ticket.closed_at.strip():
        raise ValueError("CLOSED_AT_REQUIRED")
    if not ticket.lines:
        raise ValueError("FISCAL_LINES_REQUIRED")
    line_total = round(sum(float(x.total) for x in ticket.lines), 2)
    if line_total != round(float(ticket.total), 2):
        raise ValueError("TOTAL_MISMATCH")


def to_fiscal_api_payload(ticket: ClosedTicket) -> dict:
    validate_closed_ticket(ticket)
    return {
        "commercialOrigin": {
            "ticketRef": ticket.ticket_ref,
            "closedAt": ticket.closed_at,
            "seller": ticket.seller,
            "paymentMethod": ticket.payment_method,
        },
        "fiscalSnapshot": {
            "total": ticket.total,
            "lines": [
                {
                    "description": x.description,
                    "taxRate": x.tax_rate,
                    "base": x.base,
                    "quota": x.quota,
                    "total": x.total,
                }
                for x in ticket.lines
            ],
        },
        "sourceMode": "CLOSED_TICKET_COPY_ONLY",
        "allowFiscalEngineToModifyCommercialTicket": False,
    }
