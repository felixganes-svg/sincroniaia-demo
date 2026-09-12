# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN BACKEND v1.8

Fecha: 12/09/2026
Tipo: validación automatizada en GitHub Actions.
Entorno: LAB aislada · NO PRODUCCIÓN.

## Alcance

Se valida la capa de estados de envío/respuesta sobre el backend append-only 1.7 sin reescribir el registro fiscal original.

## Modelo probado

- registro fiscal inmutable en `fiscal_records`;
- eventos de estado separados en `state_events`;
- `state_events` es append-only mediante triggers SQLite;
- el estado actual se deriva del último evento;
- no se modifica la huella del registro fiscal al cambiar de estado.

## Transiciones probadas

`PENDIENTE_ENVIO -> ENVIADO -> RECHAZADO -> REINTENTO_PENDIENTE -> ENVIADO -> ACEPTADO`

También se comprueba:
- bloqueo de `PENDIENTE_ENVIO -> ACEPTADO` directo;
- bloqueo de transición posterior desde `ACEPTADO`;
- conservación de la huella fiscal original durante todos los eventos;
- bloqueo de `UPDATE` y `DELETE` directos sobre `state_events`;
- integridad de la cadena fiscal tras todos los eventos.

## Evidencia automática

Workflow: `verifactu backend 1.8`
Run ID: `34719918175`
Job: `backend-tests`
Resultado: `success`

Paso principal: `Test backend append-only and state events` -> `success`.

## Resultado

APROBADA FUNCIONALMENTE PARA EL ALCANCE DE ESTADOS/REINTENTO DEL BACKEND LAB 1.8.

## Límites expresos

Esta validación NO demuestra todavía:
- comunicación real con AEAT;
- aceptación/rechazo procedente del servicio AEAT real;
- autenticación/certificado;
- política final de reintentos temporizados;
- persistencia de backend desplegada de forma duradera;
- rectificación/anulación completa;
- conformidad global del producto;
- declaración responsable del productor.

Principio: EVIDENCIA ANTES QUE AFIRMACIÓN.
