# SINCRONIAIA TPV · REGLA DE LABS VIVAS

Fecha de consolidación: 07/09/2026

## Regla
Para cada cadena activa de trabajo del TPV se mantendrán visibles en la rama principal únicamente:

1. **LAB ACTUAL**: la versión en la que se está trabajando y probando.
2. **LAB ANTERIOR**: la última versión inmediatamente anterior, conservada como retorno seguro.

Cuando se crea una nueva LAB y supera la validación técnica mínima:
- la LAB actual pasa a ser **ANTERIOR**;
- la nueva pasa a ser **ACTUAL**;
- cualquier LAB anterior a esas dos se elimina de la rama principal.

## Seguridad
Eliminar una LAB de la rama principal no borra su historial: Git conserva los commits y permite recuperar una versión antigua si fuera necesario.

## No borrar antes de comprobar
Antes de retirar una LAB antigua se comprobará que la cadena actual conserva las funciones que esa LAB aportó y que existe una LAB anterior operativa como retorno.

## Estado actual
- ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos`
- ANTERIOR: `tpv-alimentacion-dibal-lab-v1-3-lab-tickets-dictados`

## LAB retiradas de la rama principal al aplicar esta regla
- `tpv-alimentacion-dibal-lab-v1-3-lab-cobro-exacto`
- `tpv-alimentacion-dibal-lab-v1-3-lab-rectificacion-autorizada`
- `tpv-alimentacion-dibal-lab-v1-3-lab-encargos-tpv-aparcado`
- `tpv-alimentacion-dibal-lab-v1-3-lab-encargos-ticket-abierto`
- `tpv-alimentacion-dibal-lab-v1-3-lab-encargos-libreta`
- `tpv-alimentacion-dibal-lab-v1-3-lab-modificar-venta-abierta`

Estas LAB permanecen recuperables desde el historial de Git.


## Actualización 07/09/2026 · Catálogo maestro
- Nueva ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro`.
- ANTERIOR inmediata: `tpv-alimentacion-dibal-lab-v1-3-lab-precio-contextual`.
- Se retira de main `tpv-alimentacion-dibal-lab-v1-3-lab-venta-compacta` por quedar dos generaciones atrás.
- Continúa recuperable desde el historial Git.


## Actualización 07/09/2026 · Despensa 6 dígitos
- Nueva ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-despensa-6digitos`.
- ANTERIOR: `tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro`.
- Se retira de main `tpv-alimentacion-dibal-lab-v1-3-lab-precio-contextual` por quedar dos generaciones atrás.


## Actualización 07/09/2026 · Tickets dictados
- Nueva ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-tickets-dictados`.
- ANTERIOR: `tpv-alimentacion-dibal-lab-v1-3-lab-despensa-6digitos`.
- Importador con referencia única, control de duplicados y validación de cuadre.
- Se retira de main `tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro` por quedar dos generaciones atrás.


## Actualización 08/09/2026 · X/Z por jornada + pinchitos
- Nueva ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos`.
- ANTERIOR: `tpv-alimentacion-dibal-lab-v1-3-lab-tickets-dictados`.
- X por fecha/rango y cierre de jornada concreta con trazabilidad real.
- Nuevos artículos: 000150 Pinchitos de pollo · 17,95 €/kg · Pollo; 000151 Pinchitos de ibérico · 22,50 €/kg · Cerdo.
- Autovalidación técnica aprobada para prueba real; no MASTER/STABLE.


## Actualización 08/09/2026 · Mirar precio
- Se mantiene ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos`.
- Botón **CERRAR** añadido al principio de MIRAR PRECIO para uso móvil sin bajar al final.
- Eliminado el cartel temporal de comprobación 08/09 de la ruta visible.
- Verificación técnica: sintaxis OK, botón superior presente y texto temporal ausente.
- Estado: aprobada para prueba real; NO MASTER global.
