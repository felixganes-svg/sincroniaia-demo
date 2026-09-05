# SINCRONIAIA TPV Alimentación · DIBAL LAB v1.3 · RECTIFICACIÓN AUTORIZADA

Copia aislada para validar el control de acceso a rectificaciones.

## Mantiene lo ya validado
- Subtotal sin Quitar/Eliminar.
- Finalizar ticket con entrega vacía = importe exacto.
- Entrega superior = calcula devolución.
- Entrega inferior = bloquea cierre.

## Cambios de esta LAB
- Rectificar un ticket original exige autorización antes de mostrar las líneas.
- En este LAB la autorización reutiliza el Código Empresa (demo 1234).
- La autorización se limita al ticket seleccionado y se revoca al crear la rectificación.
- Las funciones internas de corrección también comprueban autorización.
- Los tickets rectificativos no muestran botón Rectificar; muestran la etiqueta Rectificativo.
- El ticket original se conserva y la rectificación sigue generándose como operación separada.

## Aislamiento
Esta LAB usa claves de almacenamiento e IndexedDB propias para no compartir tickets ni encargos con la LAB anterior.

## Estado
Laboratorio. Pendiente prueba real en móvil. No MASTER ni aprobado para cliente.
