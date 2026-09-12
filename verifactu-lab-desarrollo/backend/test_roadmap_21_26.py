from fiscal_ops import FiscalIdentity, cancellation_hash, build_cancellation_soap, build_subsanation_soap
from retry_queue import RetryItem, due, dedupe_by_request
from tpv_contract import ClosedTicket, FiscalLine, to_fiscal_api_payload
from readiness import ReadinessInput, evaluate
import transport


def demo_record(numero='VF-SRV-D-000001', huella='A'*64):
    return {
        'emisor':'89890001K','numero':numero,'fecha':'12-09-2026','tipo':'F2',
        'cuota':'1.75','total':'22.45','fechaHora':'2026-09-12T23:40:00+02:00','huella':huella,
    }


def test_21_incidencia_header_on_resend():
    xml = transport.build_soap(demo_record(), None, incidencia=True)
    assert '<sum1:Incidencia>S</sum1:Incidencia>' in xml
    normal = transport.build_soap(demo_record(), None, incidencia=False)
    assert '<sum1:Incidencia>' not in normal


def test_22_official_cancellation_hash_vector_and_xml():
    identity = FiscalIdentity('89890001K','12345679/G34','01-01-2024')
    prev = 'F7B94CFD8924EDFF273501B01EE5153E4CE8F259766F88CF6ACB8935802A2B97'
    got = cancellation_hash(identity, prev, '2024-01-01T19:20:40+01:00')
    assert got == '177547C0D57AC74748561D054A9CEC14B4C4EA23D1BEFD6F2E69E3A388F90C68'
    original = {'emisor':'89890001K','numero':'12345679/G34','fecha':'01-01-2024'}
    previous = {'emisor':'89890001K','numero':'12345679/G34','fecha':'01-01-2024','huella':prev}
    xml, huella = build_cancellation_soap(original, previous, '2024-01-01T19:20:40+01:00')
    assert '<sum1:RegistroAnulacion>' in xml
    assert huella == got
    assert '<sum1:IDEmisorFacturaAnulada>89890001K</sum1:IDEmisorFacturaAnulada>' in xml


def test_23_subsanation_is_new_alta_and_original_identity_is_preserved():
    corrected = {
        'emisor':'89890001K','numero':'VF-SRV-D-000001','fecha':'12-09-2026','tipo':'F2',
        'cuota':'2.00','total':'22.00','base':'20.00','fechaHora':'2026-09-12T23:50:00+02:00'
    }
    previous = demo_record('VF-SRV-D-000009','B'*64)
    xml = build_subsanation_soap(corrected, previous)
    assert '<sum1:RegistroAlta>' in xml
    assert '<sum1:Subsanacion>S</sum1:Subsanacion>' in xml
    assert '<sum1:NumSerieFactura>VF-SRV-D-000001</sum1:NumSerieFactura>' in xml
    assert previous['huella'] in xml


def test_24_retry_queue_due_order_and_dedupe():
    items = [
        RetryItem('B','2026-09-12T23:01:00+02:00','H2'),
        RetryItem('A','2026-09-12T23:00:00+02:00','H1'),
        RetryItem('A-DUP','2026-09-12T23:00:01+02:00','H1'),
        RetryItem('C','2026-09-13T01:00:00+02:00','H3'),
    ]
    ready = dedupe_by_request(due(items, '2026-09-12T23:10:00+02:00'))
    assert [x.numero for x in ready] == ['A','B']


def test_25_tpv_contract_accepts_only_closed_snapshot():
    ticket = ClosedTicket(
        ticket_ref='T-2026-001', closed=True, closed_at='2026-09-12T20:00:00+02:00',
        total='22.45', seller='V1', payment_method='EFECTIVO',
        lines=(
            FiscalLine('Lomo','10','15.41','1.54','16.95'),
            FiscalLine('Queso','4','5.29','0.21','5.50'),
        )
    )
    payload = to_fiscal_api_payload(ticket)
    assert payload['commercialOrigin']['ticketRef'] == 'T-2026-001'
    assert payload['sourceMode'] == 'CLOSED_TICKET_COPY_ONLY'
    assert payload['allowFiscalEngineToModifyCommercialTicket'] is False


def test_26_readiness_exposes_external_blockers_without_false_ready_claim():
    result = evaluate(ReadinessInput(
        xsd_passed=True, backend_append_only_passed=True, states_passed=True,
        transport_guardrails_passed=True, retry_logic_passed=True,
        cancellation_subsanation_passed=True, tpv_contract_passed=True,
        persistent_backend_deployed=False, client_certificate_configured=False,
        real_aeat_preproduction_response_obtained=False, responsible_declaration_prepared=False,
    ))
    assert result['labTechnicalReady'] is True
    assert result['preproductionRealReady'] is False
    assert result['blockers'] == ['persistentBackend','clientCertificate','realAeatPreproductionResponse','responsibleDeclaration']
