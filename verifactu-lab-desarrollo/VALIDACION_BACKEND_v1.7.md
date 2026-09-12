# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN BACKEND v1.7

Fecha: 12/09/2026
Tipo: validación automatizada en GitHub Actions.
Entorno: LAB aislada · NO PRODUCCIÓN.

## Alcance

Backend separado en `verifactu-lab-desarrollo/backend/` con:
- API FastAPI;
- SQLite independiente;
- numeración central `VF-SRV-D-xxxxxx`;
- huella SHA-256 construida en servidor;
- encadenamiento por huella anterior;
- escritura registro + contador dentro de transacción;
- endpoints de lectura e integridad;
- sin endpoints de modificación o borrado de registros fiscales;
- triggers SQLite que bloquean `UPDATE` y `DELETE` sobre `fiscal_records`.

## Prueba automática

Workflow: `verifactu backend 1.7`
Run ID: `34719729472`
Job: `backend-tests`
Resultado: `success`.

Casos comprobados:
1. alta del primer registro `VF-SRV-D-000001`;
2. alta del segundo registro `VF-SRV-D-000002`;
3. segundo registro enlazado con la huella del primero;
4. `/integrity` devuelve cadena correcta con 2 registros;
5. lectura de histórico conserva el orden;
6. `PUT` sobre registro devuelve método no permitido;
7. `DELETE` sobre registro devuelve método no permitido;
8. `UPDATE` SQL directo bloqueado por trigger append-only;
9. `DELETE` SQL directo bloqueado por trigger append-only;
10. integridad posterior sigue correcta.

## Resultado

APROBADA FUNCIONALMENTE COMO BACKEND LAB 1.7 APPEND-ONLY.

## Límites expresos

Esta prueba NO demuestra todavía:
- despliegue persistente de servidor en producción;
- alta disponibilidad o copias de seguridad;
- autenticación/autorización de clientes;
- comunicación real con AEAT;
- certificados;
- respuestas/rechazos/reintentos AEAT;
- rectificación/anulación completa;
- conformidad global o declaración responsable.

SQLite en GitHub Actions es una prueba equivalente de backend; la base del runner es temporal y no constituye conservación fiscal real.

Principio: EVIDENCIA ANTES QUE AFIRMACIÓN.
