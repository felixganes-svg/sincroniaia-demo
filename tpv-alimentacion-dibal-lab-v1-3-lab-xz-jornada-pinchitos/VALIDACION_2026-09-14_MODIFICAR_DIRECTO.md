# VALIDACIÓN · MODIFICAR VENTA DIRECTAMENTE

Fecha: 14/09/2026
LAB: `tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos`
Prueba aislada: `prueba-correccion-misma-venta.html`

## Objetivo
Permitir acceder a **MODIFICAR VENTA** durante una venta abierta sin pasar antes por SUBTOTAL, manteniendo la corrección visible en el ticket como línea original + línea negativa.

## Comprobaciones técnicas
- [x] Se conserva la LAB ACTUAL registrada en `TPV_LABS_VERSIONADO.md`.
- [x] No se ha creado un TPV nuevo.
- [x] No se ha modificado el catálogo.
- [x] No se ha modificado la lógica base de X/Z.
- [x] No se ha modificado el circuito de tickets ya cerrados/rectificación.
- [x] La prueba reutiliza `openSaleModification`, `saveOpenSaleQty` y `receiptLineHtml` existentes.
- [x] Se añade acceso directo **MODIFICAR VENTA** en la barra inferior de la venta.
- [x] Una venta pendiente: acceso directo al vendedor correspondiente.
- [x] Varias ventas pendientes: selección previa de vendedor.
- [x] La cantidad/peso corregidos siguen siendo los datos usados para el total de la venta.
- [x] Se conserva en el ticket la línea original y se añade la diferencia negativa.
- [x] El fichero Maestro ha sido actualizado con la decisión y el estado de validación.

## Pruebas manuales pendientes
1. Venta por unidades: registrar 2 ud, modificar directamente a 1 ud y comprobar ticket `2 ud` + `-1 ud`.
2. Venta por kilos: registrar 0,850 kg, modificar directamente a 0,650 kg y comprobar ticket `0,850 kg` + `-0,200 kg`.
3. Comprobar total cobrado y cambio.
4. Comprobar que la venta aparece correctamente en X.
5. Con dos vendedores con venta pendiente, comprobar selector de vendedor.

## Resultado
**APROBADA TÉCNICAMENTE PARA PRUEBA MANUAL.**

No se declara MASTER, STABLE ni lista para cliente hasta superar las pruebas manuales anteriores desde el flujo real de mostrador.
