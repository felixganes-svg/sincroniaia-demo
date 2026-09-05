#!/usr/bin/env python3
import os, sqlite3
from datetime import datetime
from pathlib import Path

root=Path(__file__).resolve().parent
source=Path(os.getenv('TPV_DB',str(root/'tpv_local_red.db')))
target_dir=root/'copias';target_dir.mkdir(exist_ok=True)
target=target_dir/f"tpv_local_red_{datetime.now():%Y%m%d_%H%M%S}.db"
if not source.exists(): raise SystemExit('Todavía no existe la base de datos del TPV.')
with sqlite3.connect(source) as src, sqlite3.connect(target) as dst: src.backup(dst)
print(f'Copia verificada creada: {target}')
