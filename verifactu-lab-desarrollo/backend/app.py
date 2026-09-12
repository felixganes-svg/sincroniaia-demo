from __future__ import annotations

import hashlib
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

DB_PATH = Path(os.getenv("VERIFACTU_DB", Path(__file__).with_name("verifactu_dev.sqlite3")))
SERIES = "VF-SRV-D"

app = FastAPI(title="SINCRONIAIA FISCAL · VERI*FACTU BACKEND LAB 1.8")


class RecordIn(BaseModel):
    emisor: str = Field(default="89890001K", min_length=1)
    fecha: str = Field(pattern=r"^\d{2}-\d{2}-\d{4}$")
    tipo: str = Field(default="F2", min_length=2, max_length=2)
    cuota: str = Field(default="1.75")
    total: str = Field(default="22.45")
    fechaHora: Optional[str] = None


class StateEventIn(BaseModel):
    estado: str
    codigo: Optional[str] = None
    detalle: Optional[str] = None
    source: str = "LAB_MANUAL"
    fechaHora: Optional[str] = None


ALLOWED_TRANSITIONS = {
    "PENDIENTE_ENVIO": {"ENVIADO"},
    "ENVIADO": {"ACEPTADO", "ACEPTADO_CON_INCIDENCIA", "RECHAZADO"},
    "RECHAZADO": {"REINTENTO_PENDIENTE"},
    "REINTENTO_PENDIENTE": {"ENVIADO"},
    "ACEPTADO": set(),
    "ACEPTADO_CON_INCIDENCIA": set(),
}


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS meta (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS fiscal_records (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              emisor TEXT NOT NULL,
              numero TEXT NOT NULL UNIQUE,
              fecha TEXT NOT NULL,
              tipo TEXT NOT NULL,
              cuota TEXT NOT NULL,
              total TEXT NOT NULL,
              huella_anterior TEXT NOT NULL,
              fecha_hora TEXT NOT NULL,
              estado TEXT NOT NULL,
              huella TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS state_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fiscal_record_id INTEGER NOT NULL,
              estado TEXT NOT NULL,
              codigo TEXT,
              detalle TEXT,
              source TEXT NOT NULL,
              fecha_hora TEXT NOT NULL,
              created_at TEXT NOT NULL,
              FOREIGN KEY(fiscal_record_id) REFERENCES fiscal_records(id)
            );

            CREATE TRIGGER IF NOT EXISTS fiscal_records_no_update
            BEFORE UPDATE ON fiscal_records
            BEGIN
              SELECT RAISE(ABORT, 'append-only: UPDATE forbidden');
            END;

            CREATE TRIGGER IF NOT EXISTS fiscal_records_no_delete
            BEFORE DELETE ON fiscal_records
            BEGIN
              SELECT RAISE(ABORT, 'append-only: DELETE forbidden');
            END;

            CREATE TRIGGER IF NOT EXISTS state_events_no_update
            BEFORE UPDATE ON state_events
            BEGIN
              SELECT RAISE(ABORT, 'append-only events: UPDATE forbidden');
            END;

            CREATE TRIGGER IF NOT EXISTS state_events_no_delete
            BEFORE DELETE ON state_events
            BEGIN
              SELECT RAISE(ABORT, 'append-only events: DELETE forbidden');
            END;

            INSERT OR IGNORE INTO meta(key, value) VALUES ('next_number', '1');
            """
        )


def local_iso_now() -> str:
    return datetime.now().astimezone().replace(microsecond=0).isoformat()


def number_for(n: int) -> str:
    return f"{SERIES}-{n:06d}"


def hash_input(r: dict) -> str:
    return (
        f"IDEmisorFactura={r['emisor']}"
        f"&NumSerieFactura={r['numero']}"
        f"&FechaExpedicionFactura={r['fecha']}"
        f"&TipoFactura={r['tipo']}"
        f"&CuotaTotal={r['cuota']}"
        f"&ImporteTotal={r['total']}"
        f"&Huella={r.get('huellaAnterior', '')}"
        f"&FechaHoraHusoGenRegistro={r['fechaHora']}"
    )


def sha256_upper(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest().upper()


def row_to_api(row: sqlite3.Row) -> dict:
    return {
        "emisor": row["emisor"],
        "numero": row["numero"],
        "fecha": row["fecha"],
        "tipo": row["tipo"],
        "cuota": row["cuota"],
        "total": row["total"],
        "huellaAnterior": row["huella_anterior"],
        "fechaHora": row["fecha_hora"],
        "estadoRegistro": row["estado"],
        "huella": row["huella"],
        "storage": "SQLITE_SERVER_LAB_APPEND_ONLY",
    }


def event_to_api(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "estado": row["estado"],
        "codigo": row["codigo"],
        "detalle": row["detalle"],
        "source": row["source"],
        "fechaHora": row["fecha_hora"],
    }


def get_record_row(conn: sqlite3.Connection, numero: str) -> sqlite3.Row:
    row = conn.execute("SELECT * FROM fiscal_records WHERE numero = ?", (numero,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="record not found")
    return row


def latest_state(conn: sqlite3.Connection, fiscal_record_id: int) -> Optional[str]:
    row = conn.execute(
        "SELECT estado FROM state_events WHERE fiscal_record_id = ? ORDER BY id DESC LIMIT 1",
        (fiscal_record_id,),
    ).fetchone()
    return row["estado"] if row else None


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "lab": "1.8",
        "storage": "sqlite-append-only-demo",
        "state_events": "append-only",
        "production": False,
        "aeat_connected": False,
    }


@app.get("/records")
def list_records() -> list[dict]:
    with connect() as conn:
        rows = conn.execute("SELECT * FROM fiscal_records ORDER BY id").fetchall()
        out = []
        for row in rows:
            item = row_to_api(row)
            item["estadoActual"] = latest_state(conn, row["id"])
            out.append(item)
    return out


@app.get("/records/{numero}")
def get_record(numero: str) -> dict:
    with connect() as conn:
        row = get_record_row(conn, numero)
        item = row_to_api(row)
        item["estadoActual"] = latest_state(conn, row["id"])
    return item


@app.post("/records", status_code=201)
def append_record(payload: RecordIn) -> dict:
    conn = connect()
    try:
        conn.execute("BEGIN IMMEDIATE")
        next_number = int(conn.execute("SELECT value FROM meta WHERE key='next_number'").fetchone()[0])
        prev = conn.execute("SELECT * FROM fiscal_records ORDER BY id DESC LIMIT 1").fetchone()
        numero = number_for(next_number)
        fecha_hora = payload.fechaHora or local_iso_now()
        record = {
            "emisor": payload.emisor,
            "numero": numero,
            "fecha": payload.fecha,
            "tipo": payload.tipo,
            "cuota": payload.cuota,
            "total": payload.total,
            "huellaAnterior": prev["huella"] if prev else "",
            "fechaHora": fecha_hora,
            "estado": "GENERADO",
        }
        record["huella"] = sha256_upper(hash_input(record))
        cur = conn.execute(
            """
            INSERT INTO fiscal_records(
              emisor, numero, fecha, tipo, cuota, total,
              huella_anterior, fecha_hora, estado, huella, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record["emisor"], record["numero"], record["fecha"], record["tipo"],
                record["cuota"], record["total"], record["huellaAnterior"],
                record["fechaHora"], record["estado"], record["huella"], local_iso_now(),
            ),
        )
        fiscal_id = cur.lastrowid
        event_time = local_iso_now()
        conn.execute(
            """
            INSERT INTO state_events(
              fiscal_record_id, estado, codigo, detalle, source, fecha_hora, created_at
            ) VALUES (?, 'PENDIENTE_ENVIO', NULL, 'Registro generado; pendiente de remisión', 'SYSTEM', ?, ?)
            """,
            (fiscal_id, event_time, event_time),
        )
        conn.execute("UPDATE meta SET value = ? WHERE key='next_number'", (str(next_number + 1),))
        conn.commit()
        record["storage"] = "SQLITE_SERVER_LAB_APPEND_ONLY"
        record["estadoActual"] = "PENDIENTE_ENVIO"
        return record
    except sqlite3.Error as exc:
        conn.rollback()
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    finally:
        conn.close()


@app.get("/records/{numero}/events")
def list_state_events(numero: str) -> list[dict]:
    with connect() as conn:
        row = get_record_row(conn, numero)
        events = conn.execute(
            "SELECT * FROM state_events WHERE fiscal_record_id = ? ORDER BY id",
            (row["id"],),
        ).fetchall()
    return [event_to_api(e) for e in events]


@app.get("/records/{numero}/state")
def get_current_state(numero: str) -> dict:
    with connect() as conn:
        row = get_record_row(conn, numero)
        state = latest_state(conn, row["id"])
    return {"numero": numero, "estadoActual": state}


@app.post("/records/{numero}/events", status_code=201)
def append_state_event(numero: str, payload: StateEventIn) -> dict:
    target = payload.estado.strip().upper()
    conn = connect()
    try:
        conn.execute("BEGIN IMMEDIATE")
        row = get_record_row(conn, numero)
        current = latest_state(conn, row["id"])
        allowed = ALLOWED_TRANSITIONS.get(current, set())
        if target not in allowed:
            conn.rollback()
            raise HTTPException(
                status_code=409,
                detail={"reason": "INVALID_STATE_TRANSITION", "from": current, "to": target},
            )
        event_time = payload.fechaHora or local_iso_now()
        cur = conn.execute(
            """
            INSERT INTO state_events(
              fiscal_record_id, estado, codigo, detalle, source, fecha_hora, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row["id"], target, payload.codigo, payload.detalle,
                payload.source, event_time, local_iso_now(),
            ),
        )
        conn.commit()
        created = conn.execute("SELECT * FROM state_events WHERE id = ?", (cur.lastrowid,)).fetchone()
        return {"numero": numero, "evento": event_to_api(created), "estadoActual": target}
    except HTTPException:
        raise
    except sqlite3.Error as exc:
        conn.rollback()
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    finally:
        conn.close()


@app.get("/integrity")
def integrity() -> dict:
    with connect() as conn:
        rows = conn.execute("SELECT * FROM fiscal_records ORDER BY id").fetchall()
    previous_hash = ""
    for idx, row in enumerate(rows, start=1):
        api = row_to_api(row)
        if api["huellaAnterior"] != previous_hash:
            return {"ok": False, "index": idx, "reason": "ENCADENAMIENTO"}
        if sha256_upper(hash_input(api)) != api["huella"]:
            return {"ok": False, "index": idx, "reason": "HUELLA"}
        previous_hash = api["huella"]
    return {"ok": True, "count": len(rows), "last_hash": previous_hash}


init_db()
