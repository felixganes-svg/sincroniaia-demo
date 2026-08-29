# SINCRONIAIA · CONTROL HORARIO PERSONAL · ESTADO ACTUAL

Fecha de estado: 29/08/2026
Estado: EN VALIDACIÓN · NO LISTO PARA CLIENTE

## Producción
URL oficial:
https://felixganes-svg.github.io/sincroniaia-demo/control-horario-personal/

Rama: main
Entrada pública: index.html
Aplicación: app.html

## Situación actual
- PWA sobre el MISMO acceso oficial.
- Histórico confirmado restaurado y protegido:
  - 27/08/2026 · 07:30–13:30 · 6:00 h.
  - 28/08/2026 · 07:30–13:30 · 6:00 h.
  - 29/08/2026 · 07:30–13:30 · 6:00 h.
- Se ha añadido respaldo automático previo a cada escritura de la clave maestra.
- Se conservan hasta 30 estados anteriores en una clave de respaldo independiente.
- Se ha añadido recuperación automática si la clave maestra queda perdida o ilegible.
- Se ha añadido bloqueo de integridad: una actualización no puede guardar un estado con menos sesiones históricas cerradas que el estado existente.
- Los intentos de pérdida de histórico quedan registrados como incidentes de integridad.
- Service Worker actualizado a v2 para que incluso una PWA instalada con arranque antiguo a app.html pase por el acceso protegido.
- No se debe cambiar de enlace ni crear una versión paralela.

## Bloqueo para entrega a cliente
Aunque el histórico local está ahora protegido, el módulo NO puede considerarse listo para cliente hasta verificar y consolidar el backend central como fuente fiable de verdad.

Actualmente se ha detectado que fichajes recientes no constan de forma completa en la hoja central. Esto obliga a bloquear el sellado para cliente.

## Próximas acciones obligatorias
1. Verificar en móvil/PWA que aparecen 27, 28 y 29 de agosto con sus horarios correctos.
2. Cerrar y reabrir la PWA y comprobar persistencia.
3. Verificar que una entrada y una salida nuevas generan respaldo automático.
4. Resolver la sincronización completa con backend central.
5. Probar recuperación desde backend en un dispositivo limpio o almacenamiento vacío.
6. Comprobar que una actualización de interfaz no altera totales ni histórico.
7. Generar evidencia de validación y solo entonces valorar sellado MASTER.

## Resultado de validación
PENDIENTE / BLOQUEADA PARA CLIENTE.

No declarar MASTER, STABLE, OPERATIVA o LISTA PARA CLIENTE hasta superar las pruebas anteriores.