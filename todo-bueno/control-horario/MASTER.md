# TODO BUENO · CONTROL HORARIO · BÁSICA · CRITERIO MAESTRO

Estado actual: **EN CONSOLIDACIÓN PROFESIONAL**

Punto de control MAESTRO: **26/08/2026 · 23:29**
Última consolidación técnica: **27/08/2026**

> La versión BÁSICA debe tener menos funciones que Profesional o Avanzada, pero exactamente el mismo nivel de calidad, estabilidad y presentación.

## Ruta oficial
`https://felixganes-svg.github.io/sincroniaia-demo/todo-bueno/control-horario/`

Esta es la única ruta operativa válida para pruebas y futura entrega al cliente.

## Punto de recuperación histórico
Se conserva sin modificar:
- Rama: `todo-bueno-basica-v0.3.9-aprobada`
- Commit: `de041db94bb34b4cce7a3bebb68949a7be4620d5`

Este punto sirve únicamente como recuperación histórica. **No certifica el estado actual como MASTER ni SELLADO.**

## Regla MAESTRO
Una función no se considera terminada porque simplemente responda o parezca funcionar.

Para cerrarla debe cumplir:
1. Funcionar en uso real.
2. Ser comprensible para un cliente sin conocimientos técnicos.
3. No depender de trucos del navegador ni pasos innecesarios.
4. No romper funciones ya validadas.
5. Mantener datos e histórico correctamente.
6. Funcionar correctamente en móvil y escritorio cuando corresponda.
7. Tener presentación profesional.
8. Pasar prueba real de Félix antes de marcarse con ✅.

**BÁSICA = alcance sencillo, calidad profesional.**

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
- PDF limpio generado desde la aplicación, sin URL del navegador ni encabezados/pies externos.
- Código QR de acceso.
- Copia de seguridad automática.

## Funciones que NO pertenecen a BÁSICA
Deben permanecer fuera del producto BÁSICA activo:
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

Pueden conservarse en histórico o desarrollos posteriores, pero no deben interferir con la BÁSICA.

## Estado de pruebas
### ✅ Probado por Félix
- Seguridad de acceso mediante la interfaz.
- Validación de código en alta de trabajador.
- Publicación de la ruta oficial y versión visible.
- Mi cómputo detallado Hoy / Semana / Mes.
- PDF profesional generado desde la aplicación, sin URL de GitHub ni encabezado/pie del navegador.

### REVISADO TÉCNICAMENTE · PENDIENTE DE PRUEBA DE FÉLIX
- Frontend BÁSICA físicamente limpiado de funciones Profesional/Avanzada.
- Núcleo `app.js` consolidado: deja de depender de un archivo vacío/código heredado.
- `config.js` reducido a configuración real, sin capa de parches funcionales.
- Informe diario detallado integrado con filtro visual de duplicados históricos exactos.
- Reinicio limpio del informe al volver a entrar.
- Maquetación final del documento.

### PENDIENTE DE CIERRE MAESTRO
- Desplegar en Apps Script el backend BÁSICA único y limpio preparado para consolidación.
- Eliminar del proyecto Apps Script activo cualquier `.gs` heredado o paralelo que no pertenezca a BÁSICA.
- Comparar el Apps Script desplegado con el backend canónico y sincronizar la copia exacta en GitHub.
- Auditoría completa de regresiones de principio a fin.
- Validación final en móvil y escritorio.
- Prueba final de alta, fichaje, salida, cómputo, panel, baja, informe, PDF, QR y copia de seguridad.

## Backend
El backend BÁSICA consolidado preparado para el siguiente despliegue contiene únicamente estas acciones públicas:
- `ping`
- `fichar`
- `resumen`
- `panel`
- `validarCodigoTrabajador`
- `crearTrabajador`
- `darBaja`
- `informe`

No incluye SOS, auxilio, vacaciones, festivos, ausencias ni funciones de Profesional/Avanzada.

Hasta que ese código se sustituya en Apps Script, se despliegue y se pruebe, **no se afirma que el backend activo y GitHub sean idénticos**.

## Política de sellado
No utilizar las palabras **MASTER**, **SELLADO**, **APROBADO** o **LISTO PARA CLIENTE** como garantía del estado actual hasta completar todas las pruebas finales.

Cuando se complete la auditoría final se creará un nuevo punto de recuperación y una nueva documentación de MASTER desde el estado realmente probado.

## Objetivo comercial
TODO BUENO · CONTROL HORARIO · BÁSICA debe poder entregarse y cobrarse sin explicaciones técnicas, sin referencias a GitHub, Apps Script o ajustes de Chrome y sin errores conocidos.
