from __future__ import annotations

import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

import transport

DB_PATH = Path(os.getenv("VERIFACTU_DB", Path(__file__).with_name("verifactu_dev.sqlite3")))
SERIES = "VF-SRV-D"

app = FastAPI(title="SINCRONIAIA FISCAL · VERI*FACTU BACKEND LAB 1.9")


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

            CREATE TABLE IF NOT EXISTS technical_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fiscal_record_id INTEGER NOT NULL,
              kind TEXT NOT NULL,
              endpoint TEXT,
              request_sha256 TEXT,
              response_sha256 TEXT,
              http_status INTEGER,
              result TEXT,
              detail TEXT,
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

            CREATE TRIGGER IF NOT EXISTS technical_events_no_update
            BEFORE UPDATE ON technical_events
            BEGIN
              SELECT RAISE(ABORT, 'append-only technical events: UPDATE forbidden');
            END;

            CREATE TRIGGER IF NOT EXISTS technical_events_no_delete
            BEFORE DELETE ON technical_events
            BEGIN
              SELECT RAISE(ABORT, 'append-only technical events: DELETE forbidden');
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
    import hashlib
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


def technical_to_api(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "kind": row["kind"],
        "endpoint": row["endpoint"],
        "requestSha256": row["request_sha256"],
        "responseSha256": row["response_sha256"],
        "httpStatus": row["http_status"],
        "result": row["result"],
        "detail": row["detail"],
        "createdAt": row["created_at"],
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


def append_state_event_db(
    conn: sqlite3.Connection,
    row: sqlite3.Row,
    target: str,
    source: str,
    codigo: Optional[str] = None,
    detalle: Optional[str] = None,
    fecha_hora: Optional[str] = None,
) -> sqlite3.Row:
    current = latest_state(conn, row["id"])
    if target not in ALLOWED_TRANSITIONS.get(current, set()):
        raise HTTPException(
            status_code=409,
            detail={"reason": "INVALID_STATE_TRANSITION", "from": current, "to": target},
        )
    event_time = fecha_hora or local_iso_now()
    cur = conn.execute(
        """
        INSERT INTO state_events(
          fiscal_record_id, estado, codigo, detalle, source, fecha_hora, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (row["id"], target, codigo, detalle, source, event_time, local_iso_now()),
    )
    return conn.execute("SELECT * FROM state_events WHERE id = ?", (cur.lastrowid,)).fetchone()


def append_technical_event(
    fiscal_record_id: int,
    kind: str,
    endpoint: Optional[str] = None,
    request_sha256: Optional[str] = None,
    response_sha256: Optional[str] = None,
    http_status: Optional[int] = None,
    result: Optional[str] = None,
    detail: Optional[str] = None,
) -> None:
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO technical_events(
              fiscal_record_id, kind, endpoint, request_sha256, response_sha256,
              http_status, result, detail, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                fiscal_record_id, kind, endpoint, request_sha256, response_sha256,
                http_status, result, detail, local_iso_now(),
            ),
        )


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    cfg = transport.TransportConfig.from_env()
    ready, reason = cfg.readiness()
    return {
        "status": "ok",
        "lab": "1.9",
        "storage": "sqlite-append-only-demo",
        "state_events": "append-only",
        "technical_events": "append-only",
        "production": False,
        "aeat_connected": False,
        "aeat_real_send_enabled": cfg.enabled,
        "aeat_transport_ready": ready,
        "aeat_transport_reason": reason,
    }


@app.get("/transport/status")
def transport_status() -> dict:
    cfg = transport.TransportConfig.from_env()
    ready, reason = cfg.readiness()
    return {
        "enabled": cfg.enabled,
        "ready": ready,
        "reason": reason,
        "endpoint": cfg.endpoint,
        "endpointPreproductionWhitelisted": cfg.endpoint in transport.PREPROD_ENDPOINTS,
        "certificateConfigured": bool(cfg.cert_file),
        "keyConfigured": bool(cfg.key_file),
        "productionAllowed": False,
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


@app.get("/records/{numero}/technical-events")
def list_technical_events(numero: str) -> list[dict]:
    with connect() as conn:
        row = get_record_row(conn, numero)
        events = conn.execute(
            "SELECT * FROM technical_events WHERE fiscal_record_id = ? ORDER BY id",
            (row["id"],),
        ).fetchall()
    return [technical_to_api(e) for e in events]


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
        created = append_state_event_db(
            conn, row, target, payload.source, payload.codigo, payload.detalle, payload.fechaHora
        )
        conn.commit()
        return {"numero": numero, "evento": event_to_api(created), "estadoActual": target}
    except HTTPException:
        conn.rollback()
        raise
    except sqlite3.Error as exc:
        conn.rollback()
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    finally:
        conn.close()


def _record_and_previous(numero: str) -> tuple[sqlite3.Row, Optional[sqlite3.Row], str]:
    with connect() as conn:
        row = get_record_row(conn, numero)
        prev = conn.execute(
            "SELECT * FROM fiscal_records WHERE id < ? ORDER BY id DESC LIMIT 1",
            (row["id"],),
        ).fetchone()
        current = latest_state(conn, row["id"])
    return row, prev, current


@app.post("/records/{numero}/transport/prepare")
def prepare_transport(numero: str) -> dict:
    row, prev, current = _record_and_previous(numero)
    if current not in {"PENDIENTE_ENVIO", "REINTENTO_PENDIENTE"}:
        raise HTTPException(status_code=409, detail={"reason": "STATE_NOT_SENDABLE", "state": current})
    xml = transport.build_soap(row_to_api(row), row_to_api(prev) if prev else None)
    cfg = transport.TransportConfig.from_env()
    request_hash = transport.body_sha256(xml)
    append_technical_event(
        row["id"], "REQUEST_PREPARED", cfg.endpoint, request_hash,
        result="NOT_SENT", detail="SOAP preparado; sin remisión de red",
    )
    ready, reason = cfg.readiness()
    return {
        "numero": numero,
        "estadoActual": current,
        "requestSha256": request_hash,
        "bytes": len(xml.encode("utf-8")),
        "transportReady": ready,
        "transportReason": reason,
        "sent": False,
    }


@app.post("/records/{numero}/transport/send")
def send_transport(numero: str) -> dict:
    row, prev, current = _record_and_previous(numero)
    if current not in {"PENDIENTE_ENVIO", "REINTENTO_PENDIENTE"}:
        raise HTTPException(status_code=409, detail={"reason": "STATE_NOT_SENDABLE", "state": current})

    record = row_to_api(row)
    xml = transport.build_soap(record, row_to_api(prev) if prev else None)
    request_hash = transport.body_sha256(xml)
    cfg = transport.TransportConfig.from_env()
    ready, reason = cfg.readiness()
    if not ready:
        append_technical_event(
            row["id"], "SEND_BLOCKED", cfg.endpoint, request_hash,
            result=reason, detail="No se realizó ninguna conexión de red",
        )
        raise HTTPException(status_code=503, detail={"reason": reason, "sent": False})

    append_technical_event(
        row["id"], "SEND_ATTEMPT", cfg.endpoint, request_hash,
        result="NETWORK_CALL_START", detail="Preproducción AEAT autorizada por configuración explícita",
    )
    try:
        response = transport.perform_send(xml, cfg)
    except Exception as exc:
        append_technical_event(
            row["id"], "TRANSPORT_ERROR", cfg.endpoint, request_hash,
            result=type(exc).__name__, detail=str(exc)[:500],
        )
        raise HTTPException(status_code=502, detail={"reason": "TRANSPORT_ERROR"}) from exc

    response_hash = transport.body_sha256(response.body)
    if not 200 <= response.status_code < 300:
        append_technical_event(
            row["id"], "HTTP_ERROR", cfg.endpoint, request_hash, response_hash,
            response.status_code, "HTTP_ERROR", response.body[:500],
        )
        raise HTTPException(status_code=502, detail={"reason": "AEAT_HTTP_ERROR", "status": response.status_code})

    try:
        parsed = transport.parse_aeat_response(response.body)
    except Exception as exc:
        append_technical_event(
            row["id"], "RESPONSE_PARSE_ERROR", cfg.endpoint, request_hash, response_hash,
            response.status_code, type(exc).__name__, str(exc)[:500],
        )
        raise HTTPException(status_code=502, detail={"reason": "AEAT_RESPONSE_PARSE_ERROR"}) from exc

    target = parsed.get("estadoInterno")
    if not target:
        append_technical_event(
            row["id"], "RESPONSE_UNMAPPED", cfg.endpoint, request_hash, response_hash,
            response.status_code, parsed.get("estadoRegistro"), str(parsed)[:500],
        )
        raise HTTPException(status_code=502, detail={"reason": "AEAT_RESPONSE_UNMAPPED"})

    conn = connect()
    try:
        conn.execute("BEGIN IMMEDIATE")
        fresh = get_record_row(conn, numero)
        append_state_event_db(conn, fresh, "ENVIADO", "AEAT_TRANSPORT_1_9", detalle="HTTP 2xx recibido")
        append_state_event_db(
            conn, fresh, target, "AEAT_RESPONSE_1_9",
            codigo=parsed.get("codigo"), detalle=parsed.get("descripcion"),
        )
        conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    finally:
        conn.close()

    append_technical_event(
        row["id"], "RESPONSE_RECEIVED", cfg.endpoint, request_hash, response_hash,
        response.status_code, target,
        f"EstadoEnvio={parsed.get('estadoEnvio')}; EstadoRegistro={parsed.get('estadoRegistro')}",
    )
    return {
        "numero": numero,
        "sent": True,
        "httpStatus": response.status_code,
        "requestSha256": request_hash,
        "responseSha256": response_hash,
        "aeat": parsed,
        "estadoActual": target,
    }


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
