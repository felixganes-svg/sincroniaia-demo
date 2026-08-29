# SINCRONIAIA · CONTROL HORARIO PERSONAL · MASTER DE MÓDULO

Estado: EN VALIDACIÓN FINAL
Gobernado por: /MAESTRO/SINCRONIAIA_MASTER.md

## Fuente única de verdad
- URL oficial de producción: https://felixganes-svg.github.io/sincroniaia-demo/control-horario-personal/
- Rama oficial publicada: main
- Entrada pública: control-horario-personal/index.html
- Aplicación completa: control-horario-personal/app.html
- Clave maestra local: sincroniaia_control_personal_master
- Backend: Google Apps Script configurado en la aplicación

## Regla operativa
No crear enlaces alternativos ni versiones paralelas para resolver fallos de producción. Primero localizar y corregir la fuente real publicada.

Modificar solo la pieza que falla. Lo que funciona queda protegido.

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
- 26/08/2026: 07:30–13:30

Ausencias históricas protegidas:
- 27/07/2026: Festivo.
- 28/07/2026–17/08/2026: Vacaciones.

## Horarios vigentes
Hasta 30/08/2026: horario de verano.
Desde 31/08/2026:
- Lunes 17:00–20:15
- Martes 07:30–13:30
- Miércoles 07:30–13:30 y 17:00–20:15
- Jueves 07:30–13:45
- Viernes 07:30–13:30 y 17:00–20:15
- Sábado 07:30–13:30
- Domingo descanso
Total semanal: 40:00.

## Incidencia 29/08/2026
Entrada de hoy regularizada a las 07:30 en producción. La comprobación visual del usuario confirmó estado Trabajando y botón FICHAR SALIDA.

## Criterio para sellado
No declarar este módulo MASTER SELLADO hasta completar y verificar una jornada real de principio a fin:
1. Salida real.
2. Registro de hoy con entrada y salida correctas.
3. Total del día correcto.
4. Calendario conserva el día trabajado.
5. Cerrar y volver a abrir: datos persistentes.
6. Histórico anterior intacto.
7. Backend/sincronización sin regresiones críticas.

Hasta entonces: EN VALIDACIÓN FINAL.