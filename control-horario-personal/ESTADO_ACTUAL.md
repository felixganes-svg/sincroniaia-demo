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
- Se ha publicado en Empresa la función CORREGIR FICHAJE para modificar un periodo existente sin depender de soporte técnico.
- La corrección exige fecha, periodo, entrada, salida y motivo.
- Cada corrección conserva antes/después, fecha de modificación, actor Empresa y motivo en data.audit.
- Cada corrección pasa por la misma protección de copia automática e integridad del histórico.
- Validación técnica de sintaxis de la lógica de corrección: SUPERADA.
- Validación funcional real en móvil/PWA de la corrección: PENDIENTE.
- No se debe cambiar de enlace ni crear una versión paralela.

## Bloqueo para entrega a cliente
Aunque el histórico local está ahora protegido, el módulo NO puede considerarse listo para cliente hasta verificar y consolidar el backend central como fuente fiable de verdad.

Actualmente se ha detectado que fichajes recientes no constan de forma completa en la hoja central. Esto obliga a bloquear el sellado para cliente.

## Próximas acciones obligatorias
1. Verificar en móvil/PWA que aparecen 27, 28 y 29 de agosto con sus horarios correctos.
2. Probar desde Empresa > Corregir fichaje una modificación controlada y confirmar que actualiza totales y deja auditoría.
3. Cerrar y reabrir la PWA y comprobar persistencia de la corrección.
4. Verificar que una entrada y una salida nuevas generan respaldo automático.
5. Resolver la sincronización completa con backend central.
6. Probar recuperación desde backend en un dispositivo limpio o almacenamiento vacío.
7. Comprobar que una actualización de interfaz no altera totales ni histórico.
8. Generar evidencia de validación y solo entonces valorar sellado MASTER.

## Resultado de validación
PENDIENTE / BLOQUEADA PARA CLIENTE.

No declarar MASTER, STABLE, OPERATIVA o LISTA PARA CLIENTE hasta superar las pruebas anteriores.