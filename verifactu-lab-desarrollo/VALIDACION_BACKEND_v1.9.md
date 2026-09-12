# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN BACKEND 1.9

Fecha: 12/09/2026
Tipo: validación automatizada en GitHub Actions.
Entorno: LAB aislada · NO PRODUCCIÓN.

## Alcance

Se valida la preparación del transporte SOAP hacia el servicio VERI*FACTU de pruebas sin realizar una remisión real a AEAT.

## Evidencia

Workflow: `verifactu backend 1.9`
Run ID: `34720139172`
Job: `backend-tests`
Resultado: `success`
Pytest: `5 passed`

## Comprobaciones superadas

- construcción del SOAP de remisión desde un registro fiscal persistido;
- transporte real desactivado por defecto;
- sin certificado/configuración explícita no se realiza conexión de red;
- lista blanca limitada a endpoints oficiales de preproducción `prewww1.aeat.es` y `prewww10.aeat.es`;
- endpoint de producción bloqueado por diseño en esta LAB;
- eventos técnicos `REQUEST_PREPARED`, `SEND_BLOCKED`, `SEND_ATTEMPT` y `RESPONSE_RECEIVED` almacenados de forma append-only;
- `technical_events` bloquea `UPDATE` y `DELETE`;
- petición y respuesta se trazan mediante SHA-256, sin almacenar secretos del certificado;
- respuesta AEAT simulada `EstadoEnvio=Correcto` + `EstadoRegistro=Correcto` se mapea a `ACEPTADO`;
- el flujo de estado pasa `PENDIENTE_ENVIO -> ENVIADO -> ACEPTADO`;
- la huella del registro fiscal original permanece inalterada;
- la integridad de la cadena fiscal permanece correcta;
- las pruebas no realizaron envío real a AEAT.

## Fuentes técnicas oficiales contrastadas

- WSDL `SistemaFacturacion.wsdl` y endpoints de VERI*FACTU publicados por AEAT.
- Entorno de pruebas `prewww1.aeat.es` / `prewww10.aeat.es`.
- Modelo de respuesta con estado global de envío y estado individual de registro.

## Resultado

APROBADA FUNCIONALMENTE PARA EL ALCANCE DE PREPARACIÓN Y PROTECCIÓN DEL TRANSPORTE 1.9.

## Límites expresos

Esta validación NO demuestra todavía:
- autenticación real con certificado ante AEAT;
- conexión real al servicio de preproducción;
- aceptación real de un registro por AEAT;
- gestión completa de timeout o respuesta desconocida;
- política final de reintentos temporizados;
- almacenamiento fiscal persistente desplegado;
- conformidad global del producto.

Principio: EVIDENCIA ANTES QUE AFIRMACIÓN.
