# VALIDACIÓN · SINCRONIAIA TPV Alimentación · LAB ENCARGOS TICKET ABIERTO v0.1

Fecha: 2026-09-05
Tipo: comprobación técnica de implementación; pendiente validación funcional real en móvil por el usuario.

## Estado
**PENDIENTE DE VALIDACIÓN EN MÓVIL. NO MASTER. NO CLIENTE REAL.**

## Implementado
- Encargo como estructura abierta por líneas.
- Bandeja como grupo de productos.
- Cantidad/peso solicitado opcional.
- Preparación línea por línea.
- Precio vigente al guardar peso/cantidad real.
- Cantidad 0 / No servido.
- Sustitución conservando el artículo originalmente solicitado.
- Bloqueo de modificación tras generar venta/ticket.
- Generación de venta + ticket al finalizar preparación.
- Ticket con total cerrado y estado Pendiente de cobro.
- Cobro posterior sin recalcular artículos ni total.
- Efectivo vacío = importe exacto.
- Importe efectivo inferior = bloqueo.
- Estado Cobrado pendiente de entrega y posterior Entregado.

## Prueba funcional que debe hacerse
1. Crear vendedor/iniciar vendedor.
2. Crear encargo.
3. Añadir un artículo normal sin peso.
4. Crear Bandeja 6 personas.
5. Añadir al menos 3 productos a la bandeja.
6. Preparar una línea con peso real.
7. Marcar otra línea cantidad 0.
8. Sustituir otra línea y pesar el sustituto.
9. Finalizar preparación.
10. Confirmar que se genera ticket y que ya no se pueden modificar líneas.
11. Cobrar con campo de efectivo vacío.
12. Confirmar que el total del ticket no cambia.
13. Marcar Entregado.

## Pendiente aparte
- Validar cómo deben tratarse los tickets pendientes de cobro dentro de Informes X/Z.
