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
