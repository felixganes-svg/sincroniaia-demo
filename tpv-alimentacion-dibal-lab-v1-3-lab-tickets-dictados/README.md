# SINCRONIAIA TPV Alimentación · LAB MODIFICAR VENTA ABIERTA v0.1

Copia aislada derivada de la LAB ENCARGOS · LIBRETA. No modifica la LAB anterior ni comparte su almacenamiento.

## Regla funcional cerrada

- **SUBTOTAL = solo consulta.**
- No existe eliminar/quitar directamente en cada línea del Subtotal.
- Desde Subtotal aparece una acción separada: **MODIFICAR VENTA**.
- Una venta aún no cobrada permite:
  - corregir peso/cantidad;
  - retirar una línea.
- El precio queda bloqueado para el vendedor en este circuito.
- Toda modificación exige un motivo.
- Se registra fecha, vendedor, artículo, antes/después, acción y motivo.
- Empresa puede consultar el registro en **Empresa → Modificaciones venta abierta**.
- Si el ticket ya está cerrado, este circuito no se usa: se mantiene **Rectificación autorizada** y el original no se altera.

## Caso objetivo

Cliente cambia de opinión antes de cobrar:
Subtotal → MODIFICAR VENTA → línea → RETIRAR ARTÍCULO → motivo "Cliente no lo quiere".

La línea desaparece de la venta abierta, pero queda constancia en el registro interno.

## Aislamiento

Prefijo de almacenamiento:
`tpv_lab_modificar_venta_v1_`

## Estado

**LABORATORIO. Validación técnica realizada. Pendiente prueba funcional física/móvil por el usuario antes de cualquier sellado o uso con cliente real.**


## LAB VENTA COMPACTA · 07/09/2026

Copia aislada de la LAB anterior. No sustituye ni modifica la versión de origen.

Cambios:
- Botones de artículos: muestran únicamente el nombre.
- El precio se consulta desde el botón separado **MIRAR PRECIO**.
- La consulta de precio no añade artículos a la venta.
- Se reduce la altura de los botones para mostrar más artículos en pantalla.
- Venta directa mantiene el bloqueo de peso/precio no válidos.
- Se añade defensa adicional: ningún artículo del catálogo ni ninguna línea puede validarse o guardarse con precio 0 o no válido.
- Se conservan las mismas claves de almacenamiento local de la LAB anterior para que, en el mismo navegador/dispositivo, siga leyendo los artículos modificados previamente.


## LAB PRECIO CONTEXTUAL · 07/09/2026

Copia aislada de LAB Venta Compacta. No sustituye ni modifica la versión anterior.

Regla funcional consolidada:
- MIRAR PRECIO hereda el contexto desde el que se abre.
- En una subsección (ej. Carne → Ternera), muestra primero solo los artículos de esa subsección.
- En una familia sin subsección, muestra todos los artículos de esa familia.
- En A–Z respeta familia/letra cuando existe ese contexto.
- El usuario puede ampliar expresamente a TODOS LOS PRECIOS o CAMBIAR SECCIÓN.
- La búsqueda se limita al contexto seleccionado.
- La consulta sigue siendo solo informativa: no añade líneas a la venta.
- Se mantienen los botones de artículo compactos, solo con nombre.
- Se mantienen los bloqueos de precio 0/no válido de la LAB anterior.
- Se conservan las mismas claves de almacenamiento local para seguir leyendo los artículos modificados previamente en el mismo navegador/dispositivo.


## LAB CATÁLOGO MAESTRO · 07/09/2026

Se consolida el catálogo real a partir del listado fotografiado de balanza y confirmaciones del usuario. Ver CATALOGO_MAESTRO_2026-09-07.csv, PENDIENTES_CATALOGO.md y CONTINUIDAD.md.


## LAB DESPENSA 6 DÍGITOS · 07/09/2026

Se incorpora la regla de identificación por los 6 últimos dígitos del código de barras para artículos de Despensa y se añaden las referencias confirmadas por el usuario.

- 710782 · Queso Entremont rallado 70 g · 1,70 €/ud.


## LAB TICKETS DICTADOS · 07/09/2026
- Importador automático de ventas dictadas por el usuario.
- Cada ticket usa una referencia única y se incorpora una sola vez.
- Los tickets importados entran en Tickets guardados e informes X/Z.
- No se crea ninguna venta ficticia para la prueba técnica.
