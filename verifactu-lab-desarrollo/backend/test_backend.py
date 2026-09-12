import importlib
import os
import sqlite3
from pathlib import Path

from fastapi.testclient import TestClient


def load_app(tmp_path: Path):
    os.environ["VERIFACTU_DB"] = str(tmp_path / "test.sqlite3")
    os.environ.pop("VERIFACTU_AEAT_SEND_ENABLED", None)
    os.environ.pop("VERIFACTU_AEAT_ENDPOINT", None)
    os.environ.pop("VERIFACTU_AEAT_CERT_FILE", None)
    os.environ.pop("VERIFACTU_AEAT_KEY_FILE", None)
    import app as backend
    importlib.reload(backend)
    return backend


def demo_payload(fecha_hora: str):
    return {
        "emisor": "89890001K",
        "fecha": "12-09-2026",
        "tipo": "F2",
        "cuota": "1.75",
        "total": "22.45",
        "fechaHora": fecha_hora,
    }


def test_append_only_chain_and_numbering(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    r1 = client.post("/records", json=demo_payload("2026-09-12T23:20:00+02:00"))
    assert r1.status_code == 201
    a = r1.json()
    assert a["numero"] == "VF-SRV-D-000001"
    assert a["huellaAnterior"] == ""
    assert a["estadoActual"] == "PENDIENTE_ENVIO"
    assert len(a["huella"]) == 64

    r2 = client.post("/records", json=demo_payload("2026-09-12T23:20:05+02:00"))
    assert r2.status_code == 201
    b = r2.json()
    assert b["numero"] == "VF-SRV-D-000002"
    assert b["huellaAnterior"] == a["huella"]
    assert b["estadoActual"] == "PENDIENTE_ENVIO"

    integrity = client.get("/integrity")
    assert integrity.status_code == 200
    assert integrity.json()["ok"] is True
    assert integrity.json()["count"] == 2

    assert client.put("/records/VF-SRV-D-000001", json={}).status_code == 405
    assert client.delete("/records/VF-SRV-D-000001").status_code == 405

    conn = sqlite3.connect(backend.DB_PATH)
    try:
        for sql, marker in [
            ("UPDATE fiscal_records SET total='99.99' WHERE numero='VF-SRV-D-000001'", "append-only"),
            ("DELETE FROM fiscal_records WHERE numero='VF-SRV-D-000001'", "append-only"),
        ]:
            try:
                conn.execute(sql)
                conn.commit()
                raise AssertionError("Mutación directa no fue bloqueada")
            except sqlite3.DatabaseError as exc:
                assert marker in str(exc)
                conn.rollback()
    finally:
        conn.close()

    assert client.get("/integrity").json()["ok"] is True


def test_state_event_flow_rejection_retry_and_immutability(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    created = client.post("/records", json=demo_payload("2026-09-12T23:30:00+02:00"))
    assert created.status_code == 201
    numero = created.json()["numero"]
    original_hash = created.json()["huella"]

    invalid = client.post(f"/records/{numero}/events", json={"estado": "ACEPTADO", "source": "TEST"})
    assert invalid.status_code == 409

    assert client.post(f"/records/{numero}/events", json={"estado": "ENVIADO", "source": "AEAT_TEST"}).status_code == 201
    assert client.post(
        f"/records/{numero}/events",
        json={"estado": "RECHAZADO", "codigo": "DEMO-001", "detalle": "Respuesta ficticia", "source": "AEAT_TEST"},
    ).status_code == 201
    assert client.post(f"/records/{numero}/events", json={"estado": "REINTENTO_PENDIENTE", "source": "SYSTEM"}).status_code == 201
    assert client.post(f"/records/{numero}/events", json={"estado": "ENVIADO", "source": "AEAT_TEST"}).status_code == 201
    assert client.post(f"/records/{numero}/events", json={"estado": "ACEPTADO", "codigo": "0", "source": "AEAT_TEST"}).status_code == 201
    assert client.post(f"/records/{numero}/events", json={"estado": "ENVIADO", "source": "TEST"}).status_code == 409

    events = client.get(f"/records/{numero}/events").json()
    assert [e["estado"] for e in events] == [
        "PENDIENTE_ENVIO", "ENVIADO", "RECHAZADO",
        "REINTENTO_PENDIENTE", "ENVIADO", "ACEPTADO",
    ]
    record = client.get(f"/records/{numero}").json()
    assert record["huella"] == original_hash
    assert record["estadoRegistro"] == "GENERADO"
    assert record["estadoActual"] == "ACEPTADO"


def test_transport_disabled_prepares_but_never_sends(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    created = client.post("/records", json=demo_payload("2026-09-12T23:40:00+02:00"))
    numero = created.json()["numero"]
    original_hash = created.json()["huella"]

    status = client.get("/transport/status").json()
    assert status["enabled"] is False
    assert status["ready"] is False
    assert status["reason"] == "REAL_SEND_DISABLED"
    assert status["productionAllowed"] is False

    prepared = client.post(f"/records/{numero}/transport/prepare")
    assert prepared.status_code == 200
    assert prepared.json()["sent"] is False
    assert prepared.json()["transportReady"] is False
    assert len(prepared.json()["requestSha256"]) == 64

    sent = client.post(f"/records/{numero}/transport/send")
    assert sent.status_code == 503
    assert sent.json()["detail"]["reason"] == "REAL_SEND_DISABLED"
    assert sent.json()["detail"]["sent"] is False

    events = client.get(f"/records/{numero}/technical-events").json()
    assert [e["kind"] for e in events] == ["REQUEST_PREPARED", "SEND_BLOCKED"]
    assert all(e["requestSha256"] for e in events)

    state = client.get(f"/records/{numero}/state").json()["estadoActual"]
    assert state == "PENDIENTE_ENVIO"
    assert client.get(f"/records/{numero}").json()["huella"] == original_hash

    conn = sqlite3.connect(backend.DB_PATH)
    try:
        try:
            conn.execute("UPDATE technical_events SET result='X' WHERE id=1")
            conn.commit()
            raise AssertionError("UPDATE technical_events no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only technical events" in str(exc)
            conn.rollback()
        try:
            conn.execute("DELETE FROM technical_events WHERE id=1")
            conn.commit()
            raise AssertionError("DELETE technical_events no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only technical events" in str(exc)
            conn.rollback()
    finally:
        conn.close()


def test_transport_simulated_aeat_acceptance_without_network(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    created = client.post("/records", json=demo_payload("2026-09-12T23:45:00+02:00"))
    numero = created.json()["numero"]
    original_hash = created.json()["huella"]

    cert = tmp_path / "demo-cert.pem"
    cert.write_text("CERTIFICADO DEMO NO USADO EN TEST", encoding="utf-8")
    monkeypatch.setenv("VERIFACTU_AEAT_SEND_ENABLED", "1")
    monkeypatch.setenv("VERIFACTU_AEAT_ENDPOINT", backend.transport.DEFAULT_ENDPOINT)
    monkeypatch.setenv("VERIFACTU_AEAT_CERT_FILE", str(cert))

    calls = []
    response_xml = """<?xml version='1.0' encoding='UTF-8'?>
    <RespuestaRegFactuSistemaFacturacion>
      <EstadoEnvio>Correcto</EstadoEnvio>
      <RespuestaLinea>
        <EstadoRegistro>Correcto</EstadoRegistro>
      </RespuestaLinea>
    </RespuestaRegFactuSistemaFacturacion>"""

    def fake_send(xml_text, config):
        calls.append((xml_text, config.endpoint))
        return backend.transport.TransportResult(status_code=200, body=response_xml, headers={})

    monkeypatch.setattr(backend.transport, "perform_send", fake_send)

    status = client.get("/transport/status").json()
    assert status["ready"] is True
    assert status["endpointPreproductionWhitelisted"] is True

    sent = client.post(f"/records/{numero}/transport/send")
    assert sent.status_code == 200
    body = sent.json()
    assert body["sent"] is True
    assert body["estadoActual"] == "ACEPTADO"
    assert body["aeat"]["estadoEnvio"] == "Correcto"
    assert body["aeat"]["estadoRegistro"] == "Correcto"
    assert len(calls) == 1
    assert "RegFactuSistemaFacturacion" in calls[0][0]
    assert calls[0][1] == backend.transport.DEFAULT_ENDPOINT

    states = client.get(f"/records/{numero}/events").json()
    assert [x["estado"] for x in states] == ["PENDIENTE_ENVIO", "ENVIADO", "ACEPTADO"]

    technical = client.get(f"/records/{numero}/technical-events").json()
    assert [x["kind"] for x in technical] == ["SEND_ATTEMPT", "RESPONSE_RECEIVED"]
    assert technical[-1]["httpStatus"] == 200
    assert technical[-1]["result"] == "ACEPTADO"
    assert technical[-1]["responseSha256"]

    record = client.get(f"/records/{numero}").json()
    assert record["huella"] == original_hash
    assert record["estadoRegistro"] == "GENERADO"
    assert client.get("/integrity").json()["ok"] is True


def test_transport_rejects_non_preproduction_endpoint(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)
    created = client.post("/records", json=demo_payload("2026-09-12T23:50:00+02:00"))
    numero = created.json()["numero"]
    cert = tmp_path / "demo-cert.pem"
    cert.write_text("DEMO", encoding="utf-8")
    monkeypatch.setenv("VERIFACTU_AEAT_SEND_ENABLED", "1")
    monkeypatch.setenv("VERIFACTU_AEAT_ENDPOINT", "https://www1.agenciatributaria.gob.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP")
    monkeypatch.setenv("VERIFACTU_AEAT_CERT_FILE", str(cert))

    status = client.get("/transport/status").json()
    assert status["ready"] is False
    assert status["reason"] == "ENDPOINT_NOT_PREPRODUCTION_WHITELISTED"
    response = client.post(f"/records/{numero}/transport/send")
    assert response.status_code == 503
    assert response.json()["detail"]["sent"] is False
