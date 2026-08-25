# SINCRONIAIA · CONTROL HORARIO — PANADERÍA TODO BUENO

Versión actual: **v0.3.8 BÁSICA**

Ruta pública:
`/todo-bueno/control-horario/`

## Objetivo de la versión BÁSICA
Una única pantalla de acceso para trabajador y empresa, usable desde tablet, ordenador o móvil mediante enlace/QR.

### Trabajador
- Acceso por código personal de 4 cifras.
- Fichar entrada.
- Fichar salida con confirmación.
- Ver su cómputo: hoy / semana / mes.

### Empresa
- Acceso con código de empresa.
- Panel del propietario.
- Ver quién está trabajando ahora y cuántos están fuera.
- Ver trabajadores activos / bajas / todos.
- Crear nuevos trabajadores.
- Dar de baja conservando código e histórico.
- Consultar informes por trabajador y fechas.
- Imprimir / guardar informe en PDF.
- Mostrar/imprimir QR de acceso.
- Copia de seguridad automática.

## Modo de acceso
- Si hay tablet u ordenador en el centro: se deja abierta la pantalla de fichaje.
- Si no hay dispositivo fijo: el trabajador escanea el QR o abre el enlace desde su móvil.
- El mismo acceso sirve a la empresa; el sistema diferencia el rol por el código introducido.

## GPS
En esta versión BÁSICA de Todo Bueno el GPS no se utiliza porque existe un único centro de trabajo. La arquitectura conserva la posibilidad de añadir control de ubicación en versiones posteriores o para otros clientes.

## Funciones avanzadas
No se eliminan del desarrollo. Seguridad/auxilio, calendario, ausencias y otras funciones quedan reservadas para versiones superiores y no se muestran como parte principal de la versión BÁSICA.

## Datos y backend
La interfaz pública está conectada mediante `config.js` al servicio de Google Apps Script desplegado para el piloto real. El cliente no ve Google Sheets ni información técnica.

## Criterio de validación BÁSICA
Debe superarse el recorrido completo:
1. Crear trabajador.
2. Fichar entrada.
3. Ver trabajador en “Trabajando ahora”.
4. Fichar salida.
5. Consultar cómputo.
6. Consultar informe por fechas.
7. Imprimir/guardar PDF.
8. Dar de baja conservando histórico.
9. Reabrir desde otro dispositivo y comprobar persistencia.
