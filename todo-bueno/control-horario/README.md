# SINCRONIAIA · CONTROL HORARIO — PANADERÍA TODO BUENO

## Estado consolidado

**Versión actual:** **v0.3.9 BÁSICA**  
**Estado:** **APROBADA FUNCIONALMENTE · CANDIDATA A MASTER 1.0**  
**Fecha de aprobación funcional:** 25/08/2026

Ruta pública principal:  
`/todo-bueno/control-horario/`

Ruta de revisión/pantalla BÁSICA:  
`/todo-bueno/control-horario/basica.html`

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

## Funciones avanzadas conservadas
No se borran. Seguridad/auxilio, calendario, ausencias, vacaciones, bajas, festivos y ficha mensual ampliada permanecen en el proyecto para versiones superiores. La versión BÁSICA se diferencia por una pantalla y un flujo más sencillos, no por destruir funciones ya desarrolladas.

## Modo de acceso
- Si hay tablet u ordenador en el centro: se deja abierta la pantalla de fichaje.
- Si no hay dispositivo fijo: el trabajador escanea el QR o abre el enlace desde su móvil.
- El mismo acceso sirve a la empresa; el sistema diferencia el rol por el código introducido.

## GPS
En esta versión BÁSICA de Todo Bueno el GPS no se utiliza porque existe un único centro de trabajo. La arquitectura conserva la posibilidad de añadir control de ubicación en versiones posteriores o para otros clientes.

## Datos y backend
La interfaz pública está conectada mediante `config.js` al servicio desplegado para el piloto real. El cliente no ve la hoja de datos ni información técnica.

**Importante para el sellado MASTER:** el archivo `backend/Code.gs` guardado actualmente en GitHub es una copia histórica y todavía no se ha verificado que coincida exactamente con el Apps Script desplegado que está funcionando en producción/piloto. No tocar el backend desplegado mientras funciona; primero recuperar y guardar una copia exacta.

## Prueba funcional BÁSICA aprobada
Se ha confirmado manualmente que la v0.3.9 funciona correctamente en el flujo BÁSICO publicado.

## Criterio pendiente para MASTER 1.0 sellado
Antes de declarar `TODO BUENO · CONTROL HORARIO · BÁSICO MASTER 1.0 · SELLADO` deben quedar completados y documentados estos puntos:
1. Recuperar/sincronizar el código exacto del backend desplegado.
2. Guardar frontend + configuración + backend como conjunto recuperable.
3. Repetir el recorrido integral: crear trabajador → entrada → “Trabajando ahora” → salida → cómputo → informe → PDF → baja → histórico.
4. Reabrir desde otro dispositivo/navegador y confirmar persistencia.
5. Mantener una versión estable separada antes de iniciar nuevas mejoras.

## Regla de conservación
No borrar funciones aprobadas ni sustituir la versión estable durante nuevas pruebas. Las mejoras futuras se harán en copias/versiones superiores hasta ser aprobadas.
