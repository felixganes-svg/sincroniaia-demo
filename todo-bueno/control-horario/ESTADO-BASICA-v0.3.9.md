# TODO BUENO · CONTROL HORARIO · BÁSICA v0.3.9

Estado: **APROBADA FUNCIONALMENTE**  
Fecha: **25/08/2026**

## Alcance aprobado
- Trabajador: entrada/salida + cómputo hoy/semana/mes.
- Empresa: panel + trabajadores + quién está trabajando ahora.
- Alta/baja conservando histórico.
- Informe por fechas.
- Imprimir/guardar PDF.
- QR de acceso.
- Copia de seguridad.

## Principio de versión
La BÁSICA es un cambio de pantalla y de flujo. No se borran funciones avanzadas ya desarrolladas.

## Archivos de referencia en main
- `index.html`
- `basica.html`
- `app.css`
- `app.js`
- `config.js` (VERSION 0.3.9)
- `qr-acceso.svg`
- `backend/Code.gs` (histórico; pendiente sincronizar con el Apps Script desplegado)

## Recuperación
Esta versión queda identificada como punto de recuperación aprobado antes de nuevas modificaciones.

## No declarar MASTER todavía
Pendiente recuperar/sincronizar el backend desplegado exacto y completar la prueba integral de persistencia/multidispositivo antes del sellado MASTER 1.0.
