# VALIDACIÓN · MODIFICAR VENTA DIRECTAMENTE

Fecha inicial: 14/09/2026
Validación de usuario: 15/09/2026
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
- [x] La cantidad/peso corregidos siguen siendo los datos usados para el total de la venta.
- [x] Se conserva en el ticket la línea original y se añade la diferencia negativa.
- [x] El fichero Maestro ha sido actualizado.

## Validación real del usuario
- [x] El usuario confirma el flujo y da la orden explícita **“Validamos”**.
- [x] Se considera validado el acceso a **MODIFICAR VENTA** directamente desde la venta abierta, sin pasar por SUBTOTAL.
- [x] Se considera validado el criterio de representación en ticket: línea original + línea negativa de corrección dentro de la misma venta.

## Comprobaciones no declaradas como realizadas
Estas pruebas siguen pendientes de confirmación específica y no se dan por superadas por inferencia:
1. Comprobar X/Z después de una venta corregida.
2. Comprobar selector con dos vendedores que tengan venta pendiente simultáneamente.
3. Cualquier prueba no ejecutada expresamente en el flujo real de mostrador.

## Resultado
**VALIDADA FUNCIONALMENTE POR EL USUARIO PARA EL FLUJO PROBADO.**

La función queda aprobada dentro de la LAB ACTUAL para el comportamiento validado. Esto no convierte por sí solo toda la LAB en MASTER/STABLE ni declara superadas las comprobaciones pendientes indicadas arriba.
