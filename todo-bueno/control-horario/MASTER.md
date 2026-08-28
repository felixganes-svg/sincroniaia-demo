# TODO BUENO · CONTROL HORARIO · BÁSICA · CRITERIO MAESTRO

Estado actual: **EN CONSOLIDACIÓN PROFESIONAL · NO VALIDADA TRAS LOS ÚLTIMOS CAMBIOS**

Punto de control MAESTRO: **26/08/2026 · 23:29**
Última revisión de criterio: **27/08/2026**

> BÁSICA significa menor alcance, no menor calidad. Ningún bloque puede llamarse validado si después se modifica código que puede afectarlo y no se repite la prueba correspondiente.

## Ruta oficial
`https://felixganes-svg.github.io/sincroniaia-demo/todo-bueno/control-horario/`

Esta es la única ruta operativa válida para pruebas y futura entrega al cliente.

## Regla MAESTRO de validación
Para marcar un bloque con ✅ deben cumplirse simultáneamente estas condiciones cuando correspondan:
1. Félix lo ha probado personalmente.
2. Se ha probado en el dispositivo objetivo; para esta demo, móvil es obligatorio.
3. Si después se modifica `app.js`, `config.js`, `report-fix.js`, `app.css`, `index.html` o el backend y el cambio puede afectar ese bloque, el ✅ pasa a **VALIDADO HISTÓRICAMENTE · PENDIENTE DE REGRESIÓN**.
4. No depende de trucos del navegador ni conocimientos técnicos del cliente.
5. Mantiene datos e histórico correctamente.
6. No rompe funciones previamente aceptadas.
7. Tiene presentación profesional.
8. La versión exacta probada debe poder recuperarse.

**BÁSICA = alcance sencillo, calidad profesional.**

## Estado real después de la limpieza del frontend
Los siguientes bloques fueron probados correctamente en versiones anteriores, pero los cambios posteriores de frontend obligan a repetir la prueba antes de volver a marcarlos como ✅ actual:

| Bloque | Validación histórica | Móvil registrado | Estado actual |
|---|---|---|---|
| Seguridad de acceso | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| Validación de código en alta | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| Alta de trabajador | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| Ruta oficial / versión | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN VISUAL |
| Mi cómputo Hoy / Semana / Mes | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| Detalle diario de Mi cómputo | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| PDF profesional sin URL del navegador | Sí | No consta prueba móvil específica | PENDIENTE DE REGRESIÓN |
| Limpieza visual BÁSICA | Primera comprobación correcta | No consta prueba móvil específica | EN PRUEBAS |
| Informe detallado | Parcial | No consta prueba móvil específica | EN PRUEBAS |
| Duplicados visuales históricos | No cerrado | No | EN PRUEBAS |
| Reinicio limpio de informe | No cerrado | No | EN PRUEBAS |
| Copia de seguridad automática | No auditada de extremo a extremo | No aplica | PENDIENTE |

**Conclusión:** actualmente no hay ningún bloque que pueda conservar un ✅ vigente después de la limpieza sin una nueva prueba de regresión. Los ✅ anteriores se conservan únicamente como evidencia histórica.

## Riesgo crítico de backend activo
El Apps Script que está actualmente desplegado **no está demostrado que coincida con el backend BÁSICA limpio preparado en GitHub**. Por tanto:
- puede conservar funciones heredadas o paralelas;
- no se puede asegurar que SOS, auxilio, vacaciones, festivos u otras funciones avanzadas hayan desaparecido realmente del proyecto activo;
- no se debe desplegar el backend limpio sobre producción sin conservar antes una copia exacta del backend actualmente operativo;
- GitHub y Apps Script no deben declararse sincronizados hasta compararlos de forma exacta.

Este punto se clasifica como **RIESGO CRÍTICO / BLOQUEANTE PARA CLIENTE**.

## Regla de congelación antes de tocar backend
Antes de sustituir Apps Script:
1. Congelar una copia recuperable del frontend actual.
2. Obtener y conservar una copia completa del `Código.gs` actualmente desplegado y de cualquier otro `.gs` activo.
3. Identificar qué archivos `.gs` están realmente activos en el proyecto.
4. Crear un Apps Script paralelo para el backend BÁSICA limpio.
5. Probar el frontend contra ese backend paralelo.
6. Solo después de pasar toda la regresión, cambiar la URL oficial del frontend al backend nuevo.

No se sustituirá directamente el backend actual sin esta marcha atrás.

## Alcance BÁSICA objetivo
### Trabajador
- Código personal de 4 cifras.
- Fichar entrada y salida.
- Protección frente a doble acción accidental.
- Confirmación de salida.
- Mi cómputo: Hoy / Semana / Mes.
- Detalle diario real de entradas, salidas y total diario.

### Empresa
- Acceso de empresa protegido.
- Panel del propietario.
- Quién está trabajando ahora.
- Totales Hoy / Semana / Mes.
- Trabajadores activos / bajas / todos.
- Alta sencilla: código, nombre y horas contratadas.
- Validación real de disponibilidad del código.
- Baja conservando código e histórico.
- Informe por trabajador y rango de fechas.
- Informe diario detallado.
- PDF limpio generado desde la aplicación.
- Código QR de acceso.
- Copia de seguridad automática.

## Dependencias críticas del frontend
**`report-fix.js` no es opcional: contiene la lógica completa de `cargarInforme` y `descargarInformePDF`. Sin él, el Informe de fichajes deja de funcionar. Revisar antes de cualquier limpieza de archivos.**

## Funciones fuera de BÁSICA activa
- vacaciones y ausencias
- bajas médicas
- festivos gestionados
- horario asignado por trabajador
- vigencias laborales complejas
- ficha mensual laboral completa
- GPS / geolocalización
- SOS / auxilio
- WhatsApp y alertas avanzadas
- integraciones n8n
- multi-centro

Pueden conservarse en histórico o futuras versiones, pero no deben permanecer ejecutables en el backend BÁSICA activo.

### Decisión histórica cerrada · Auxilio silencioso
**Auxilio silencioso (código de empresa 7670, ya retirado): probado el 25/08/2026, descartado por Félix. El email como único canal no es fiable para una alerta de emergencia real. No forma parte de BÁSICA ni de futuras versiones sin rediseñar el canal de notificación.**

Si en el futuro se retoma esta idea para Profesional/Avanzada, no se partirá de email como único canal. El diseño deberá contemplar un mecanismo con confirmación real de recepción/lectura, por ejemplo notificación push, WhatsApp o llamada automática, además de la revisión legal y funcional correspondiente.

## Duplicados en origen
El filtro visual no equivale a impedir duplicados en la base de datos. La prevención real debe probarse forzando el caso límite de dos peticiones simultáneas con el mismo `request_id` y verificando que solo exista un registro persistido.

Hasta hacer esa prueba: **PENDIENTE DE VALIDACIÓN REAL**.

## Validación móvil obligatoria
La ronda final se realizará desde teléfono, además de escritorio. Cada bloque tendrá columna explícita:
- Escritorio: Sí / No
- Móvil: Sí / No
- Regresión tras último cambio: Sí / No

Sin `Móvil = Sí` en las funciones de uso móvil, el bloque no se considera cerrado.

## Legal / comercial
Antes de comercializar se debe completar una revisión específica de obligaciones aplicables al control horario y protección de datos, incluyendo como mínimo:
- conservación/custodia de los registros de jornada;
- acceso y disponibilidad de los registros cuando proceda;
- información y protección de datos personales;
- política de copias y recuperación;
- tratamiento de geolocalización si alguna versión futura la incorpora.

La BÁSICA actual no debe incorporar geolocalización activa sin esa revisión específica.

Estado: **PENDIENTE DE REVISIÓN LEGAL ANTES DE CLIENTE**.

## Política de sellado
No utilizar **MASTER**, **SELLADO**, **APROBADO**, **ESTABLE** o **LISTO PARA CLIENTE** como garantía del estado actual hasta completar:
- copia recuperable de versión conocida;
- backend paralelo limpio;
- regresión completa;
- validación móvil;
- prueba de duplicados en origen;
- auditoría de backup;
- revisión legal previa a comercialización;
- coincidencia exacta entre código desplegado y código conservado.

## Objetivo inmediato
No añadir nuevas funciones. El trabajo inmediato es convertir la versión actual en una candidata controlada y recuperable, probarla de extremo a extremo y solo después valorar un piloto real.
