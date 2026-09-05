# VALIDACIÓN · LAB ENCARGOS LIBRETA v0.1

Estado: **APROBADA TÉCNICAMENTE PARA PRUEBA FUNCIONAL EN MÓVIL. NO APROBADA PARA CLIENTE REAL.**

## Validación técnica realizada
- JavaScript completo: OK.
- Almacenamiento independiente de la LAB anterior.
- Vista de encargo sustituida por lista tipo libreta para encargos sin ticket.
- Campo directo de peso/cantidad en cada línea.
- Guardar línea marca Preparado, registra vendedor y reordena la lista.
- Duplicar crea una nueva línea Pendiente.
- Añadir línea crea una línea Pendiente vinculada a un artículo real del catálogo.
- 0 pendientes activa Encargo completado sin crear ticket.
- Aparcar y volver a Venta conserva el encargo.
- Generar Venta + Ticket continúa separado del estado Completado.



## Prueba móvil pendiente
1. Crear un encargo con 3 líneas.
2. Abrir el encargo y comprobar que se ve como lista/libreta.
3. Escribir peso en la segunda línea y GUARDAR.
4. Confirmar que baja a PREPARADOS y los pendientes quedan arriba.
5. Duplicar un artículo y comprobar que aparece otra línea pendiente.
6. Añadir una línea desde + AÑADIR LÍNEA.
7. Cambiar vendedor preparador y guardar otra línea.
8. Comprobar Preparado por: vendedor correcto.
9. Aparcar y volver a Venta.
10. Recuperar el encargo sin perder datos.
11. Completar todas las líneas y confirmar ENCARGO COMPLETADO.
12. Añadir una nueva línea y confirmar vuelta a INACABADO.
13. Volver a completar.
14. No generar ticket hasta pulsar GENERAR VENTA + TICKET.


## Actualización 2 · Informe X/Z y desglose de pagos

### Incidencia detectada en móvil
Al pulsar **Imprimir X**, la salida aparecía en blanco.

### Causa
La hoja de estilos de impresión del TPV solo imprime el bloque `#printTicket`. El Informe X se encontraba en la pantalla Empresa y quedaba oculto por las reglas `@media print`.

### Corrección aplicada
- **Imprimir X** genera ahora un bloque imprimible real `#printTicket`.
- **Informe Z** usa el mismo mecanismo, evitando el mismo fallo.
- El Informe X muestra:
  - tickets generados,
  - total generado,
  - total cobrado,
  - pendiente de cobro,
  - efectivo,
  - tarjeta,
  - Bizum,
  - mixto,
  - devoluciones/ajustes cuando existan,
  - efectivo esperado en caja.
- Los tickets de encargo generados pero todavía no cobrados se identifican como **Pendiente de cobro** y no se suman a una forma de pago.
- El efectivo esperado solo usa movimientos cuyo efectivo es conocido.
- **Mixto** se muestra separado; esta LAB todavía no guarda el desglose efectivo/tarjeta de un pago mixto y no se inventa su parte de efectivo.
- En el cuadre de caja compartida, si el campo **Efectivo contado** queda vacío y se calcula, se toma el esperado pero se marca expresamente como **valor asumido / sin recuento manual**.

### Regla de efectivo ya mantenida
En el cobro al cliente, dejar **Entrega cliente** vacío significa pago exacto y devolución 0,00 €.

### Estado
Validación técnica: **APROBADA PARA PRUEBA FUNCIONAL EN MÓVIL**.
Validación real de impresión y cuadre: **PENDIENTE**.

### Prueba móvil
1. Abrir Empresa → Informes X/Z.
2. Comprobar desglose Efectivo / Tarjeta / Bizum / Mixto / Pendiente de cobro.
3. Pulsar Imprimir X y comprobar que ya no aparece una hoja en blanco.
4. Verificar que el ticket pendiente de cobro aparece como pendiente y no como efectivo/tarjeta.
5. Dejar Efectivo contado vacío y pulsar Calcular diferencia: debe indicar que se usa el valor esperado sin recuento manual.
6. Introducir un importe distinto y comprobar la diferencia real.
