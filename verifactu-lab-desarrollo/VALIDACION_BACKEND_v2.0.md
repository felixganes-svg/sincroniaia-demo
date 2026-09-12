# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN BACKEND v2.0

Fecha: 12/09/2026
Tipo: autovalidación automatizada en GitHub Actions.
Entorno: LAB aislada · NO PRODUCCIÓN.

## Alcance

Validación de comportamiento ante timeout/ausencia de respuesta y política segura de reintento sobre el backend append-only.

## Base documental contrastada

AEAT indica que, si tras un envío no se obtiene respuesta, deben volver a remitirse los registros hasta obtenerla. También documenta reenvíos periódicos en situaciones de incidencia y un mecanismo de control de flujo con valor inicial de 60 segundos, susceptible de ser actualizado mediante `TiempoEsperaEnvio` en la respuesta.

La espera de 60 segundos implementada aquí se usa como valor conservador de LAB. En comunicación real deberá respetarse el valor informado por AEAT cuando exista respuesta.

## Evidencia automática

Workflow: `verifactu backend 2.0`
Run ID: `34720359399`
Job: `backend-tests`
Resultado: `success`
Salida pytest: `6 passed`

## Pruebas superadas

- backend append-only y numeración/encadenamiento previos siguen funcionando;
- estados append-only previos siguen funcionando;
- transporte real sigue desactivado/bloqueado sin configuración explícita;
- respuesta AEAT simulada correcta sigue produciendo `ACEPTADO`;
- `TiempoEsperaEnvio=60` se interpreta correctamente;
- timeout/no respuesta produce la secuencia `PENDIENTE_ENVIO -> ENVIADO -> REINTENTO_PENDIENTE`;
- la huella fiscal original permanece inalterada;
- se crea evento técnico `NO_RESPONSE_RETRY_PENDING`;
- se registra `retryAfterSeconds=60` y `eligibleAt`;
- un reintento antes de `eligibleAt` se bloquea con `RETRY_WAIT_ACTIVE` y no produce una segunda llamada de red;
- endpoint no preproducción sigue bloqueado.

## Resultado

APROBADA FUNCIONALMENTE PARA EL ALCANCE 2.0 DE TIMEOUT / AUSENCIA DE RESPUESTA / REINTENTO SEGURO EN LAB.

## Límites

Esta validación NO demuestra todavía:
- conexión real con AEAT;
- autenticación real con certificado;
- recepción de una respuesta real AEAT;
- comportamiento real del servicio ante duplicados/reenvíos;
- aplicación real de la marca `Incidencia` en cabecera;
- scheduler persistente que ejecute reintentos automáticamente;
- despliegue persistente del backend;
- conformidad global del producto.

Principio: EVIDENCIA ANTES QUE AFIRMACIÓN.
