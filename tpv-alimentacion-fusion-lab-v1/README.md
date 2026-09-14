# SINCRONIAIA TPV Alimentación · LAB FUSIÓN v1

Fecha de creación: 14/09/2026

## Regla de seguridad
LAB independiente. No modifica ni sustituye:
- tpv-alimentacion-lab-verificado-20260908-cerrar (BASE B)
- tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos (FUENTE A)

## Estrategia
BASE funcional inicial: B, por ser la versión cuyo flujo de Encargos fue validado en prueba real el 11/09/2026.

Las mejoras de A se incorporarán UNA A UNA, con prueba desde cero después de cada incorporación. No se declara MASTER/STABLE hasta superar todas las pruebas.

## Fase 0 · copia segura de B
VALIDADA MANUALMENTE SIN ERRORES por el usuario el 14/09/2026.

## Fase 1 · X por fecha/rango
Corrección aislada: se conserva la base exacta de B como `base.html` y se añade únicamente `fase1-x-fechas.js` para hacer visibles las fechas, preseleccionar el día actual y mostrar el resultado de la X por fechas dentro de la propia pantalla de Informes.

No se modifica A ni B. No se cambia Z, Encargos, catálogo, cobros ni ventas.

Estado: PENDIENTE DE PRUEBA MANUAL.

## Orden previsto de incorporación
1. X por fecha/rango.
2. Z por jornada concreta.
3. Catálogo maestro y reglas de persistencia.
4. Vendedor VN.
5. Corrección dentro de venta abierta.
6. Ticket térmico 58 mm / Fun Print.
7. Revisión final de Encargos, compra adicional, cobro/recogida y cierres.
