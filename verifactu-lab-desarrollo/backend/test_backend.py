import importlib
import os
import sqlite3
from pathlib import Path

from fastapi.testclient import TestClient


def load_app(tmp_path: Path):
    os.environ["VERIFACTU_DB"] = str(tmp_path / "test.sqlite3")
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

    all_records = client.get("/records").json()
    assert [x["numero"] for x in all_records] == ["VF-SRV-D-000001", "VF-SRV-D-000002"]

    assert client.put("/records/VF-SRV-D-000001", json={}).status_code == 405
    assert client.delete("/records/VF-SRV-D-000001").status_code == 405

    conn = sqlite3.connect(backend.DB_PATH)
    try:
        try:
            conn.execute("UPDATE fiscal_records SET total='99.99' WHERE numero='VF-SRV-D-000001'")
            conn.commit()
            raise AssertionError("UPDATE directo no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only" in str(exc)
            conn.rollback()
        try:
            conn.execute("DELETE FROM fiscal_records WHERE numero='VF-SRV-D-000001'")
            conn.commit()
            raise AssertionError("DELETE directo no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only" in str(exc)
            conn.rollback()
    finally:
        conn.close()

    integrity2 = client.get("/integrity")
    assert integrity2.json()["ok"] is True
    assert integrity2.json()["count"] == 2


def test_state_event_flow_rejection_retry_and_immutability(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    created = client.post("/records", json=demo_payload("2026-09-12T23:30:00+02:00"))
    assert created.status_code == 201
    numero = created.json()["numero"]
    original_hash = created.json()["huella"]

    initial_events = client.get(f"/records/{numero}/events").json()
    assert [e["estado"] for e in initial_events] == ["PENDIENTE_ENVIO"]

    invalid = client.post(
        f"/records/{numero}/events",
        json={"estado": "ACEPTADO", "source": "TEST"},
    )
    assert invalid.status_code == 409

    sent1 = client.post(
        f"/records/{numero}/events",
        json={"estado": "ENVIADO", "source": "AEAT_TEST", "fechaHora": "2026-09-12T23:30:05+02:00"},
    )
    assert sent1.status_code == 201

    rejected = client.post(
        f"/records/{numero}/events",
        json={
            "estado": "RECHAZADO",
            "codigo": "DEMO-001",
            "detalle": "Respuesta ficticia de rechazo",
            "source": "AEAT_TEST",
            "fechaHora": "2026-09-12T23:30:06+02:00",
        },
    )
    assert rejected.status_code == 201

    retry = client.post(
        f"/records/{numero}/events",
        json={"estado": "REINTENTO_PENDIENTE", "source": "SYSTEM"},
    )
    assert retry.status_code == 201

    sent2 = client.post(
        f"/records/{numero}/events",
        json={"estado": "ENVIADO", "source": "AEAT_TEST"},
    )
    assert sent2.status_code == 201

    accepted = client.post(
        f"/records/{numero}/events",
        json={"estado": "ACEPTADO", "codigo": "0", "source": "AEAT_TEST"},
    )
    assert accepted.status_code == 201

    terminal = client.post(
        f"/records/{numero}/events",
        json={"estado": "ENVIADO", "source": "TEST"},
    )
    assert terminal.status_code == 409

    state = client.get(f"/records/{numero}/state")
    assert state.status_code == 200
    assert state.json()["estadoActual"] == "ACEPTADO"

    events = client.get(f"/records/{numero}/events").json()
    assert [e["estado"] for e in events] == [
        "PENDIENTE_ENVIO",
        "ENVIADO",
        "RECHAZADO",
        "REINTENTO_PENDIENTE",
        "ENVIADO",
        "ACEPTADO",
    ]

    record = client.get(f"/records/{numero}").json()
    assert record["huella"] == original_hash
    assert record["estadoRegistro"] == "GENERADO"
    assert record["estadoActual"] == "ACEPTADO"

    conn = sqlite3.connect(backend.DB_PATH)
    try:
        try:
            conn.execute("UPDATE state_events SET estado='RECHAZADO' WHERE id=1")
            conn.commit()
            raise AssertionError("UPDATE de evento no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only events" in str(exc)
            conn.rollback()
        try:
            conn.execute("DELETE FROM state_events WHERE id=1")
            conn.commit()
            raise AssertionError("DELETE de evento no fue bloqueado")
        except sqlite3.DatabaseError as exc:
            assert "append-only events" in str(exc)
            conn.rollback()
    finally:
        conn.close()

    integrity = client.get("/integrity")
    assert integrity.json()["ok"] is True
