import importlib
import os
import sqlite3
import tempfile
from pathlib import Path

from fastapi.testclient import TestClient


def load_app(tmp_path: Path):
    os.environ["VERIFACTU_DB"] = str(tmp_path / "test.sqlite3")
    import app as backend
    importlib.reload(backend)
    return backend


def test_append_only_chain_and_numbering(tmp_path, monkeypatch):
    monkeypatch.syspath_prepend(str(Path(__file__).parent))
    backend = load_app(tmp_path)
    client = TestClient(backend.app)

    payload = {
        "emisor": "89890001K",
        "fecha": "12-09-2026",
        "tipo": "F2",
        "cuota": "1.75",
        "total": "22.45",
        "fechaHora": "2026-09-12T23:20:00+02:00",
    }

    r1 = client.post("/records", json=payload)
    assert r1.status_code == 201
    a = r1.json()
    assert a["numero"] == "VF-SRV-D-000001"
    assert a["huellaAnterior"] == ""
    assert len(a["huella"]) == 64

    payload["fechaHora"] = "2026-09-12T23:20:05+02:00"
    r2 = client.post("/records", json=payload)
    assert r2.status_code == 201
    b = r2.json()
    assert b["numero"] == "VF-SRV-D-000002"
    assert b["huellaAnterior"] == a["huella"]

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
