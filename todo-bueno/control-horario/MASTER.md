# TODO BUENO · CONTROL HORARIO · BÁSICA · CRITERIO MAESTRO

Estado actual: **EN CONSOLIDACIÓN PROFESIONAL**

Fecha de revisión: **26/08/2026 · 23:29**

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

### EN PRUEBAS
- Informe diario detallado.
- Tratamiento visual de duplicados históricos exactos.
- Reinicio limpio del informe al volver a entrar.
- PDF profesional generado desde la aplicación.
- Maquetación final del documento.

### PENDIENTE DE CIERRE MAESTRO
- Auditoría completa de regresiones de principio a fin.
- Consolidación del frontend para eliminar físicamente restos de Profesional/Avanzada.
- Confirmar que el Apps Script activo contiene solo funciones necesarias para BÁSICA.
- Sincronizar en GitHub la copia exacta del backend finalmente desplegado.
- Validación final en móvil y escritorio.
- Prueba final de alta, fichaje, salida, cómputo, panel, baja, informe, PDF, QR y copia de seguridad.

## Backend
No se debe afirmar que GitHub reproduce exactamente el Apps Script desplegado hasta comparar ambos códigos.

El backend de GitHub queda como **pendiente de sincronización exacta** hasta que el código definitivo desplegado sea consolidado y comprobado.

## Política de sellado
No utilizar las palabras **MASTER**, **SELLADO**, **APROBADO** o **LISTO PARA CLIENTE** como garantía del estado actual hasta completar todas las pruebas finales.

Cuando se complete la auditoría final se creará un nuevo punto de recuperación y una nueva documentación de MASTER desde el estado realmente probado.

## Objetivo comercial
TODO BUENO · CONTROL HORARIO · BÁSICA debe poder entregarse y cobrarse sin explicaciones técnicas, sin referencias a GitHub, Apps Script o ajustes de Chrome y sin errores conocidos.
