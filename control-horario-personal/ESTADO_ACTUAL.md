# SINCRONIAIA · CONTROL HORARIO PERSONAL · ESTADO ACTUAL

Fecha de estado: 03/09/2026
Estado: EN VALIDACIÓN · NO LISTO PARA CLIENTE

## Producción
URL oficial:
https://felixganes-svg.github.io/sincroniaia-demo/control-horario-personal/

Rama: main
Entrada pública: index.html
Base estable: app-base.html
Corrección de fichajes: corregir.html

## Situación consolidada
- El acceso móvil oficial funciona.
- La barra flotante de Corrección de fichajes ha sido eliminada.
- El acceso CORREGIR FICHAJE aparece dentro de Empresa.
- La ida y vuelta desde Corregir fichaje al Control Horario ha sido validada por el usuario en móvil.
- La corrección exige fecha, periodo, entrada, salida y motivo.
- Cada corrección conserva antes/después, fecha de modificación, actor Empresa y motivo en data.audit.
- Antes de una corrección se crea copia local de seguridad.
- Después de una entrada o salida se genera copia automática local.
- Las copias se concentran en el bloque Empresa > Respaldo Control Horario > Copias locales.
- Se mantienen exportación JSON y CSV, calendario, histórico mensual, consulta de periodos, GPS, totales y saldo semanal.
- No se debe cambiar de enlace oficial ni crear una versión paralela para resolver incidencias.

## Histórico protegido confirmado
- 18/08/2026 · 07:30–13:00.
- 19/08/2026 · 07:30–13:30 y 16:57–20:00.
- 20/08/2026 · 07:30–13:30.
- 21/08/2026 · 07:30–13:30.
- 22/08/2026 · 07:30–13:30.
- 24/08/2026 · 08:30–13:30.
- 25/08/2026 · 07:30–13:30.
- 26/08/2026 · 07:30–13:30, turno de mañana confirmado.
- 27/08/2026 · 07:30–13:30 · 6:00 h.
- 28/08/2026 · 07:30–13:30 · 6:00 h.
- 29/08/2026 · 07:30–13:30 · 6:00 h.

Ausencias protegidas:
- 27/07/2026 · Festivo.
- 28/07/2026–17/08/2026 · Vacaciones.

## Planificación horaria
Horario del periodo 31/08/2026–06/09/2026: se conserva sin alterar fichajes históricos.

Nuevo horario desde 07/09/2026:
- Lunes 17:00–20:15 = 3:15.
- Martes 07:30–13:30 = 6:00.
- Miércoles 07:30–13:45 = 6:15.
- Jueves 07:30–13:30 y 17:00–20:15 = 9:15.
- Viernes 07:30–13:30 y 17:00–20:15 = 9:15.
- Sábado 07:30–13:30 = 6:00.
- Domingo descanso.
- Total semanal: 40:00.

## Backend central
Hoja central localizada:
SINCRONIAIA — CONTROL HORARIO — FÉLIX DEMO
ID: 1202SKpx9v8sjCnKo2aUurLGcu8Pk47KESkhz4ODyZ_Y

La aplicación usa Google Apps Script para registrar y consultar fichajes. A fecha 03/09/2026 no se ha consolidado todavía el backend como fuente única y completa de verdad entre dispositivos. El proyecto Apps Script real debe revisarse desde la hoja vinculada antes de añadir correcciones servidor-servidor o recuperación total en dispositivo limpio.

## Bloqueos para entrega a cliente
1. Confirmar sincronización completa de fichajes recientes en la hoja central.
2. Hacer que una corrección auditada se refleje también en backend, no solo en local.
3. Validar recuperación completa del histórico en otro dispositivo o almacenamiento limpio.
4. Repetir prueba real entrada → salida → copia → cierre → reapertura.
5. Ejecutar checklist de sellado desde cero y dejar evidencia.

## Resultado
EN VALIDACIÓN · BLOQUEADO PARA CLIENTE.

No declarar MASTER SELLADO, STABLE, OPERATIVA o LISTA PARA CLIENTE hasta superar los bloqueos anteriores.