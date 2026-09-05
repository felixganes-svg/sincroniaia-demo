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


## Nueva prueba · Centro de Encargos
Pendiente de validación móvil:
1. Crear un encargo con 3 artículos.
2. Introducir peso/cantidad real en 1 artículo.
3. Confirmar que aparece 1 de 3 preparado y 2 pendientes.
4. Aparcarlo y comprobar que aparece en INACABADOS.
5. Preparar las líneas restantes (una puede ser No servido).
6. Confirmar que pasa a PREPARADOS.
7. Finalizar preparación y generar ticket.
8. Confirmar que el ticket muestra Encargo nº + cliente.
9. Confirmar PENDIENTE DE PAGO y PENDIENTE DE RECOGER.
10. Cobrarlo y comprobar PAGADO + PENDIENTE DE RECOGER.
11. Marcar Entregado y comprobar PAGADO + RECOGIDO.


## Validación técnica · actualización 5
Resultado técnico: **APROBADA PARA PRUEBA FUNCIONAL EN LAB**.

Comprobado:
- Sintaxis JavaScript completa: OK.
- La lógica nueva se carga después de las reglas anteriores.
- Pendientes tienen prioridad de orden sobre preparados/no servidos.
- Guardar peso/cantidad real marca la línea como Preparada.
- Al quedar 0 pendientes, estado Encargo completado sin crear ticket.
- Añadir una nueva línea antes del ticket devuelve el encargo a Inacabado.
- Generación de venta/ticket requiere acción expresa.
- Tras generar ticket, el estado pasa a ticket generado y se mantiene el bloqueo de edición.

Pendiente de validación real en móvil:
1. Crear encargo con 3 artículos sin peso.
2. Pesar el segundo artículo y comprobar que baja al final.
3. Pesar otro y comprobar que el pendiente restante queda arriba.
4. Completar el último y comprobar **ENCARGO COMPLETADO**.
5. Salir y recuperar el encargo desde PREPARADOS.
6. Añadir un artículo nuevo y comprobar que vuelve a INACABADOS.
7. Preparar ese artículo.
8. Pulsar GENERAR VENTA + TICKET.
9. Confirmar que después ya no se pueden añadir/eliminar/modificar líneas.
