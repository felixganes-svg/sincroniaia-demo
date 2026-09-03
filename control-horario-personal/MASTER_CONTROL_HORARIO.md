# SINCRONIAIA · CONTROL HORARIO PERSONAL · MASTER DE MÓDULO

Estado: EN VALIDACIÓN FINAL
Gobernado por: /MAESTRO/SINCRONIAIA_MASTER.md

## Fuente única de verdad
- URL oficial de producción: https://felixganes-svg.github.io/sincroniaia-demo/control-horario-personal/
- Rama oficial publicada: main
- Entrada pública: control-horario-personal/index.html
- Base estable protegida: control-horario-personal/app-base.html
- Corrección auditada: control-horario-personal/corregir.html
- Clave maestra local: sincroniaia_control_personal_master
- Backend: Google Apps Script configurado en la aplicación
- Hoja central Félix: SINCRONIAIA — CONTROL HORARIO — FÉLIX DEMO
- ID hoja: 1202SKpx9v8sjCnKo2aUurLGcu8Pk47KESkhz4ODyZ_Y

## Regla operativa
No crear enlaces alternativos ni versiones paralelas para resolver fallos de producción. Primero localizar y corregir la fuente real publicada.

Modificar solo la pieza que falla. Lo que funciona queda protegido. No sustituir un flujo estable por parches sucesivos que puedan degradar el módulo.

## Funciones protegidas
No pueden desaparecer ni degradarse sin autorización expresa:
- Fichar entrada y salida.
- Estado Trabajando / Fuera de jornada.
- GPS y comprobación de ubicación.
- Registro de hoy.
- Totales Hoy / Semana / Mes.
- Jornada contratada y saldo semanal.
- Horario previsto por periodos.
- Calendario mensual visual.
- Detalle por día.
- Vacaciones y festivos históricos.
- Consulta de 1, 2, 3, 6 y 12 meses.
- Histórico mensual de empresa.
- Corrección de fichajes desde Empresa con motivo y auditoría.
- Copia previa a corrección.
- Copia automática tras entrada y salida.
- Sincronización backend.
- Registros pendientes.
- Copias locales.
- Exportación JSON y CSV.
- UX móvil.

## Histórico protegido
Los fichajes reales y los datos históricos no se sustituyen por cambios de interfaz ni por nuevas versiones.

Datos base consolidados existentes:
- 18/08/2026: 07:30–13:00
- 19/08/2026: 07:30–13:30 y 16:57–20:00
- 20/08/2026: 07:30–13:30
- 21/08/2026: 07:30–13:30
- 22/08/2026: 07:30–13:30
- 24/08/2026: 08:30–13:30
- 25/08/2026: 07:30–13:30
- 26/08/2026: 07:30–13:30, mañana confirmada
- 27/08/2026: 07:30–13:30
- 28/08/2026: 07:30–13:30
- 29/08/2026: 07:30–13:30

Ausencias históricas protegidas:
- 27/07/2026: Festivo.
- 28/07/2026–17/08/2026: Vacaciones.

## Horarios por vigencia
### Hasta 30/08/2026
Horario de verano existente.

### 31/08/2026–06/09/2026
Se mantiene el horario ya configurado para ese periodo. No se reescribe el histórico real.

### Desde 07/09/2026
- Lunes: 17:00–20:15 = 3:15
- Martes: 07:30–13:30 = 6:00
- Miércoles: 07:30–13:45 = 6:15
- Jueves: 07:30–13:30 y 17:00–20:15 = 9:15
- Viernes: 07:30–13:30 y 17:00–20:15 = 9:15
- Sábado: 07:30–13:30 = 6:00
- Domingo: descanso
- Total semanal: 40:00

## Validaciones móviles ya confirmadas
- El acceso oficial abre correctamente.
- La barra flotante de Corrección de fichajes fue retirada.
- CORREGIR FICHAJE se integra dentro de Empresa.
- Entrada y salida de la pantalla de corrección vuelven correctamente al Control Horario sin reaparecer la barra antigua.

## Backend: limitación actual
El backend todavía no está validado como fuente única completa entre dispositivos. No se puede considerar terminado mientras una corrección local no se refleje también de forma auditada en servidor y mientras no se demuestre recuperación total del histórico desde un dispositivo limpio.

## Criterio para sellado
No declarar este módulo MASTER SELLADO hasta completar desde cero:
1. Entrada real.
2. Salida real.
3. Registro de hoy correcto.
4. Total diario/semanal/mensual correcto.
5. Copia automática visible.
6. Corrección auditada y persistente.
7. Cierre y reapertura sin pérdida.
8. Histórico anterior intacto.
9. Backend central completo y coherente con el dispositivo.
10. Recuperación en segundo dispositivo o almacenamiento limpio.
11. Evidencia de validación guardada con resultado APROBADA.

Hasta entonces: EN VALIDACIÓN FINAL · NO LISTO PARA CLIENTE.