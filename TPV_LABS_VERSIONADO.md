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
- ACTUAL: `tpv-alimentacion-dibal-lab-v1-3-lab-despensa-6digitos`
- ANTERIOR: `tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro`

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
