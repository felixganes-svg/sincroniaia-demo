from __future__ import annotations
from dataclasses import dataclass

@dataclass(frozen=True)
class ReadinessInput:
    xsd_passed: bool
    backend_append_only_passed: bool
    states_passed: bool
    transport_guardrails_passed: bool
    retry_logic_passed: bool
    cancellation_subsanation_passed: bool
    tpv_contract_passed: bool
    persistent_backend_deployed: bool
    client_certificate_configured: bool
    real_aeat_preproduction_response_obtained: bool
    responsible_declaration_prepared: bool


def evaluate(x: ReadinessInput) -> dict:
    checks = {
        "xsd": x.xsd_passed,
        "appendOnly": x.backend_append_only_passed,
        "states": x.states_passed,
        "transportGuardrails": x.transport_guardrails_passed,
        "retryLogic": x.retry_logic_passed,
        "cancellationSubsanation": x.cancellation_subsanation_passed,
        "tpvContract": x.tpv_contract_passed,
        "persistentBackend": x.persistent_backend_deployed,
        "clientCertificate": x.client_certificate_configured,
        "realAeatPreproductionResponse": x.real_aeat_preproduction_response_obtained,
        "responsibleDeclaration": x.responsible_declaration_prepared,
    }
    blockers = [k for k, ok in checks.items() if not ok]
    return {
        "labTechnicalReady": all(checks[k] for k in ["xsd","appendOnly","states","transportGuardrails","retryLogic","cancellationSubsanation","tpvContract"]),
        "preproductionRealReady": len(blockers) == 0,
        "blockers": blockers,
        "checks": checks,
    }
