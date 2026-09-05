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


## Actualización 3 · Pago mixto real

### Regla cerrada
**Mixto describe cómo se pagó el ticket; no es una forma económica separada en el Informe X.**

### Implementado
- Pago MIXTO disponible tanto en:
  - venta normal,
  - ticket de encargo.
- Campos separados:
  - Efectivo,
  - Tarjeta,
  - Bizum.
- Deben utilizarse al menos dos formas.
- La suma debe coincidir exactamente con el total del ticket.
- Si falta dinero, bloquea indicando cuánto falta.
- Si sobra, bloquea indicando cuánto sobra.
- El ticket guarda `paymentBreakdown`.
- El ticket muestra:
  - Pago: MIXTO,
  - Efectivo: X,
  - Tarjeta: Y,
  - Bizum: Z,
  mostrando solo las formas con importe > 0.
- Informe X:
  - reparte la parte de efectivo en Efectivo,
  - la parte de tarjeta en Tarjeta,
  - la parte de Bizum en Bizum,
  - no muestra una cantidad económica adicional llamada Mixto.
- El efectivo esperado en caja incluye únicamente la parte real de efectivo.
- Mi actividad / X personal aplica el mismo reparto.
- Tickets MIXTOS antiguos sin desglose no se inventan: si existen, se muestran como dato anterior sin repartir.

### Validación técnica
- JavaScript completo: OK.
- Función de pago mixto normal: presente.
- Función de pago mixto de encargos: presente.
- Validación de suma exacta: presente.
- Desglose guardado en ticket: presente.
- Reparto en Informe X: presente.
- Reparto en X personal: presente.

### Prueba móvil pendiente
1. Venta normal de 50,00 €:
   - Efectivo 20,00 €
   - Tarjeta 30,00 €
   - confirmar ticket MIXTO con ambos importes.
2. Abrir Informe X:
   - Efectivo debe aumentar 20,00 €
   - Tarjeta debe aumentar 30,00 €
   - no debe aparecer una cantidad adicional Mixto de 50,00 €.
3. Ticket de encargo de cualquier importe:
   - repartir entre Efectivo + Bizum.
   - confirmar desglose en ticket.
4. Volver al X:
   - cada parte debe sumarse a su medio real.
5. Probar una suma inferior al total: debe bloquear.
6. Probar una suma superior al total: debe bloquear.


## Actualización 4 · X/Z maestro e histórico por fechas

### Regla de diseño cerrada
El Informe X y el Informe Z muestran únicamente:
1. Resumen general.
2. Formas de pago.
3. Ventas por sección.
4. Ventas por vendedor.

Los listados detallados de tickets quedan fuera de X/Z.

### Implementado
- X actual con los 4 bloques.
- Z guardada con los mismos 4 bloques.
- Pago mixto repartido en Efectivo / Tarjeta / Bizum.
- Ventas por sección calculadas desde las líneas reales de los tickets y el catálogo.
- Ventas por vendedor agrupadas por vendedor.
- Botón **Histórico / Consulta X-Z por fechas**.
- Consulta X por fecha Desde / Hasta:
  - se recalcula desde los tickets,
  - no guarda copias X innecesarias,
  - se puede imprimir.
- Histórico Z por fecha Desde / Hasta:
  - filtra cierres guardados,
  - permite abrir cada Z,
  - cada nueva Z guarda periodo de inicio y fin.
- Las Z anteriores que no tenían periodo explícito siguen visibles con su fecha de cierre.

### Validación técnica
- JavaScript completo: OK.
- 4 bloques X/Z: presentes.
- Consulta X por fechas: presente.
- Histórico Z por fechas: presente.
- Periodo Z: presente.
- Listados de tickets fuera de X/Z: confirmado.

### Prueba móvil pendiente
1. Empresa → Informes X/Z.
2. Confirmar que solo aparecen los 4 bloques acordados.
3. Comprobar Ventas por sección.
4. Comprobar Ventas por vendedor.
5. Abrir Histórico / Consulta X-Z por fechas.
6. Consultar X de hoy.
7. Cambiar Desde/Hasta y comprobar que cambian los totales.
8. Abrir histórico Z.
9. Si hay una Z, abrirla y comprobar los mismos 4 bloques.
10. Imprimir X por fechas y comprobar que no sale en blanco.


## Actualización 5 · Siguiente código automático al crear artículo

### Implementado
- En **Empresa → Artículos**, el campo Código se rellena automáticamente.
- Regla: **máximo código numérico existente + 1**.
- Formato: 6 dígitos con ceros a la izquierda.
- Ejemplo: si el mayor código es 000148, propone 000149.
- El código sigue siendo editable manualmente.
- Se mantiene el bloqueo existente contra códigos duplicados.
- Tras guardar un artículo y volver a renderizar Artículos, se propone el siguiente código nuevo.

### Validación técnica
- JavaScript completo: OK.
- Función de cálculo de siguiente código: presente.
- Máximo + 1: presente.
- Formato de 6 dígitos: presente.
- Aplicación solo en pantalla Artículos: presente.

### Prueba móvil pendiente
1. Empresa → Artículos.
2. Comprobar que Código aparece ya rellenado.
3. Anotar el código sugerido.
4. Crear un artículo de prueba.
5. Volver a Artículos.
6. Confirmar que el código sugerido ha avanzado +1.
7. Intentar escribir manualmente un código ya existente y guardar: debe bloquear.
