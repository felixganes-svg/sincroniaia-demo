# SINCRONIAIA TPV Alimentación · LAB ENCARGOS · LIBRETA

LAB aislada creada para validar un flujo de encargos tipo libreta digital, sin modificar la LAB anterior ni la versión estable.

## Objetivo
Que preparar un encargo sea tan sencillo como una lista en una libreta:
- artículo,
- observación/preparación,
- peso o cantidad real directamente en la línea,
- guardar,
- línea resuelta pasa abajo.

## Reglas implementadas
- Pendientes arriba; preparados/no servidos abajo.
- Peso/cantidad real se escribe directamente en la lista.
- Selector de vendedor que está preparando.
- Cada línea guarda quién la preparó.
- Duplicar línea del mismo artículo.
- Añadir línea mediante búsqueda simple del catálogo.
- Eliminar/modificar mientras no exista ticket.
- Aparcar y volver a Venta sin ocupar el TPV.
- Encargo completado con 0 pendientes, sin generar ticket automáticamente.
- Añadir una línea nueva devuelve el encargo a Inacabado.
- Generar Venta + Ticket es una acción explícita y posterior.
- Ticket generado mantiene el bloqueo y las rectificaciones de la LAB base.
- Almacenamiento aislado: tpv_lab_encargos_libreta_v1_.

## No afirmado / no validado
- Dos dispositivos físicos editando simultáneamente el mismo encargo.
- Sincronización en red.
- Impresión física real.
- Uso en cliente real.
