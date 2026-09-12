# SINCRONIAIA FISCAL · VERI*FACTU LAB 1.2.1 · VALIDACIÓN

Fecha: 12/09/2026
Tipo: PRUEBA REAL DEL USUARIO
Resultado: APROBADA PARA FASE 3
Ámbito: LAB AISLADA · NO PRODUCCIÓN

## Pruebas ejecutadas

1. Generación de registro A con SHA-256.
2. Bloqueo del registro A desde la interfaz.
3. Generación de registro B encadenado mediante `previous_record_hash = hash A`.
4. Verificación A → B con resultado `CADENA CORRECTA`.
5. Generación de representación QR técnica local.
6. Carga del recurso `qr-demo.svg` desde el propio repositorio, sin CDN.
7. Visualización de `QR tributario:` y `VERI*FACTU`.
8. Visualización de la URL de pruebas AEAT con NIF, número de factura, fecha e importe.
9. Trazabilidad registrada en pantalla.

## Evidencia comunicada por el usuario

- `CADENA CORRECTA`.
- `QR TÉCNICO GENERADO`.
- `QR técnico local cargado correctamente, sin dependencia externa.`
- Dependencia QR: `LOCAL · sin CDN`.
- Envío AEAT: `NO realizado`.

## Errores

- CRÍTICOS: ninguno reportado en esta prueba.
- RELEVANTES: ninguno reportado en esta prueba.
- MENOR: el texto de estado de la propia LAB todavía indicaba `pendiente de revalidación real`; queda como corrección documental a aplicar tras esta validación.

## Capacidades validadas en esta fase

- Aislamiento del LAB respecto al TPV protegido.
- Generación de registros fiscales de prueba separados del ticket comercial.
- SHA-256 en LAB.
- Encadenamiento A → B.
- Verificación de cadena.
- Representación QR técnica local sin dependencia CDN.

## Capacidades NO validadas / NO implementadas

- Persistencia fiscal robusta.
- Estructura técnica completa de alta AEAT.
- Remisión de registros a AEAT.
- Gestión de respuesta/aceptación/rechazo.
- Reintentos.
- Cumplimiento global VERI*FACTU.
- Producción.

## Resultado

**APROBADA PARA CERRAR FASE 3 Y PASAR A FASE 4.**

Esta validación no convierte el producto en sistema VERI*FACTU operativo ni conforme en producción.
