# SINCRONIAIA · CONTROL HORARIO — PANADERÍA TODO BUENO

Versión actual: **v0.3.9 BÁSICA**

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
- Seguridad y auxilio: aviso discreto al responsable configurado por la empresa.

## Seguridad y auxilio
La empresa puede definir un código secreto de auxilio y un destinatario para las alertas. Si un trabajador utiliza su código de auxilio, la pantalla se comporta como un fichaje normal y el sistema genera una alerta discreta para el responsable. Esta función no sustituye al 112 ni realiza llamadas automáticas a emergencias.

## Modo de acceso
- Si hay tablet u ordenador en el centro: se deja abierta la pantalla de fichaje.
- Si no hay dispositivo fijo: el trabajador escanea el QR o abre el enlace desde su móvil.
- El mismo acceso sirve a la empresa; el sistema diferencia el rol por el código introducido.

## GPS
En esta versión BÁSICA de Todo Bueno el GPS no se utiliza porque existe un único centro de trabajo. La arquitectura conserva la posibilidad de añadir control de ubicación en versiones posteriores o para otros clientes.

## Funciones avanzadas conservadas
No se eliminan del desarrollo. Calendario, ausencias, festivos y otras funciones quedan disponibles para una versión profesional posterior.

## Datos y backend
La interfaz pública está conectada mediante `config.js` al servicio desplegado para el piloto real. El cliente no ve la hoja de datos ni información técnica.

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
10. Verificar código/alerta de auxilio con un destinatario de prueba antes de uso real.
