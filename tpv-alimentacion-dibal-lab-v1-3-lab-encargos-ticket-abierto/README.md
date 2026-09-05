# SINCRONIAIA TPV Alimentación · LAB ENCARGOS TICKET ABIERTO v0.1

Copia aislada para diseñar y validar Encargos sin tocar la LAB estable de ventas/rectificaciones.

## Decisiones implementadas
- Encargo = ticket abierto y modificable hasta finalizar preparación.
- Cliente, teléfono, fecha/hora, vendedor y observaciones generales.
- Artículos como líneas estructuradas.
- Bandeja como agrupador (ej. Bandeja 6 personas) con productos internos.
- Peso/cantidad solicitada puede quedar vacío.
- Peso/cantidad real se incorpora al preparar cada línea.
- Precio vigente del catálogo se toma al guardar la preparación de cada línea.
- Producto no disponible: cantidad 0 / No servido.
- Producto no disponible: puede sustituirse por otro; se conserva el producto originalmente solicitado.
- Al FINALIZAR PREPARACIÓN se genera inmediatamente una venta y un ticket con total cerrado.
- Después de generar el ticket, el encargo ya no modifica líneas ni importes.
- El ticket puede quedar Pendiente de cobro; el cobro posterior solo registra forma de pago, entrega/cambio y estado, sin recalcular el total.
- Efectivo: campo vacío = importe exacto; inferior = bloqueo.
- Tras cobrar: estado Cobrado · pendiente de entrega; después se marca Entregado.
- Una corrección posterior del importe/ticket debe seguir el circuito de Rectificación ya validado.

## Importante
Esta LAB usa almacenamiento local propio y empieza sin ventas/encargos previos para no contaminar las pruebas anteriores.

## Pendientes de validación
- Flujo completo móvil.
- Bandeja con varios artículos.
- Sustitución y cantidad 0.
- Generación de ticket al finalizar preparación.
- Cobro posterior sin alterar total.
- Efecto de tickets pendientes de cobro en Informes X/Z (no validado todavía).

Estado: LABORATORIO. No MASTER ni aprobado para cliente.


## Cambio de diseño aprobado · Ticket aparcado
- Para localizar artículos se usa exactamente la misma navegación que Venta: Carnicería, Charcutería, Elaborados, Código y A-Z.
- Al crear el encargo se abre ese TPV en modo **TICKET APARCADO**.
- Los artículos seleccionados se guardan en el encargo, no en la venta normal del vendedor.
- El ticket aparcado es un borrador operativo y se puede modificar libremente mientras no haya generado ticket de venta.
- Antes de generar la venta se pueden añadir artículos, modificar líneas, cambiar peso/cantidad, sustituir artículos, marcar cantidad 0 y eliminar líneas o bandejas.
- Puede aparcarse y retomarse más tarde desde Encargos.
- Al finalizar preparación y generar VENTA + TICKET, queda bloqueado: ya no se añaden, eliminan ni modifican líneas.
- Cualquier cambio posterior sigue el circuito de Rectificación.


## Centro de Encargos · estados operativos
- **Inacabados**: ticket aparcado sin ticket de venta y con alguna línea sin peso/cantidad real (o todavía sin líneas).
- **Preparados**: todas las líneas están resueltas (Preparado o No servido) y el encargo está listo para finalizar preparación/generar venta.
- **Por cobrar**: ya existe ticket de venta y todavía no está pagado.
- **Por recoger**: ya existe ticket de venta y el género sigue en el establecimiento, esté pagado o pendiente de pago.
- **Recogidos**: género entregado al cliente.
- Cada encargo muestra progreso: X de Y artículos preparados y cuántos faltan.
- Introducir peso/cantidad real valida automáticamente la línea como Preparada.
- Cantidad 0 se resuelve mediante No servido.
- En tickets de Encargos se muestra: **Encargo nº + cliente**, **PAGADO/PENDIENTE DE PAGO** y **RECOGIDO/PENDIENTE DE RECOGER**.
- Un encargo pagado puede permanecer Pendiente de recoger para entrega rápida posterior.
