# TODO BUENO · CONTROL HORARIO

Estado: EN CONSOLIDACIÓN MASTER

Base funcional localizada: `control-horario-felix-v065/index.html` (identificación interna MASTER v0.6.6).

## Objetivo
Dejar el sistema 100% operativo, probado en uso real y convertirlo en plantilla maestra reutilizable para futuros clientes.

## Regla de trabajo
- No rehacer desde cero.
- No mezclar con otras demos o proyectos.
- No añadir funciones nuevas mientras exista un fallo en el circuito básico.
- Toda función aprobada debe superar prueba de regresión después de cualquier cambio.
- No declarar MASTER SELLADO hasta completar la batería de pruebas.

## Criterios de cierre
1. Acceso trabajador individual correcto.
2. Entrada y salida registradas correctamente.
3. Persistencia de fichajes tras recargar/cambiar de dispositivo.
4. Consulta histórica por fechas.
5. Totales diarios, mensuales y anuales correctos.
6. Gestión de incidencias/correcciones sin alterar el histórico de forma opaca.
7. Separación clara entre vista trabajador y vista empresa.
8. Alta y gestión de varios trabajadores.
9. Uso correcto desde móvil, tablet y ordenador.
10. GPS/localización validada según la configuración elegida por la empresa.
11. Informes imprimibles/PDF y consulta por rango de fechas.
12. Copia/recuperación de datos comprobada.
13. Prueba completa con varios trabajadores y varios días.
14. Documentación de instalación, operación y verificación.

## Estados permitidos
- EN PRUEBAS
- APROBADO
- MASTER SELLADO

## Condición para MASTER SELLADO
Una semana completa ficticia o real con empresa + varios trabajadores + fichajes + consultas + informe, sin necesidad de tocar código para completar el flujo normal.
