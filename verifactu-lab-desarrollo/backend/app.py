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

app = FastAPI(title="SINCRONIAIA FISCAL · VERI*FACTU BACKEND LAB 1.7")


class RecordIn(BaseModel):
    emisor: str = Field(default="89890001K", min_length=1)
    fecha: str = Field(pattern=r"^\d{2}-\d{2}-\d{4}$")
    tipo: str = Field(default="F2", min_length=2, max_length=2)
    cuota: str = Field(default="1.75")
    total: str = Field(default="22.45")
    fechaHora: Optional[str] = None


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
        "estado": row["estado"],
        "huella": row["huella"],
        "storage": "SQLITE_SERVER_LAB_APPEND_ONLY",
    }


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "lab": "1.7",
        "storage": "sqlite-append-only-demo",
        "production": False,
        "aeat_connected": False,
    }


@app.get("/records")
def list_records() -> list[dict]:
    with connect() as conn:
        rows = conn.execute("SELECT * FROM fiscal_records ORDER BY id").fetchall()
    return [row_to_api(r) for r in rows]


@app.get("/records/{numero}")
def get_record(numero: str) -> dict:
    with connect() as conn:
        row = conn.execute("SELECT * FROM fiscal_records WHERE numero = ?", (numero,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="record not found")
    return row_to_api(row)


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
        conn.execute(
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
        conn.execute("UPDATE meta SET value = ? WHERE key='next_number'", (str(next_number + 1),))
        conn.commit()
        record["storage"] = "SQLITE_SERVER_LAB_APPEND_ONLY"
        return record
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
