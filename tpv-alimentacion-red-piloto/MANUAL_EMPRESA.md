# Manual de Empresa · SINCRONIAIA TPV Local Red v0.1

## Arquitectura

Un ordenador funciona como servidor local. Las tablets y puestos acceden mediante navegador. Ethernet y Wi-Fi son dos formas de entrar en la misma red; todos utilizan la base `tpv_local_red.db` del servidor.

## Puesta en marcha

1. Instale Python 3 en el ordenador servidor.
2. Conecte el servidor por cable Ethernet cuando sea posible.
3. Ejecute `INICIAR_TPV_WINDOWS.bat`.
4. Consulte la IP local del ordenador con `ipconfig`.
5. Abra `http://IP-DEL-SERVIDOR:8080` en cada tablet.
6. Autorice Python en el cortafuegos únicamente para redes privadas.

## Acceso Empresa

El código inicial es `1234`. Esta versión es un piloto: antes de uso real deberá cambiarse y añadirse gestión segura de credenciales.

## Artículos

Empresa puede buscar y modificar nombre, precio, familia y subsección. El cambio se escribe en el servidor y los puestos lo reciben al actualizar su pantalla. El historial queda registrado en la tabla de auditoría.

## Tickets

Empresa puede consultar y reimprimir. No existe API para editar o eliminar tickets. Además, la base contiene disparadores que bloquean cualquier actualización o eliminación directa de tickets y líneas.

## Encargos

Empresa puede crear encargos con varios artículos, cliente, teléfono, recogida y preparación. Los puestos los ven dentro de la red. Al preparar, se sustituye la cantidad estimada por el peso definitivo y se carga la venta.

## Copias

Ejecute `CREAR_COPIA_WINDOWS.bat`. El sistema utiliza la función de copia segura de SQLite y guarda el resultado dentro de `copias`. Después copie ese archivo a una unidad externa. Para explotación real se añadirá una programación automática y una prueba periódica de restauración.

## Limitaciones del piloto

- No permite entrar desde casa sin VPN.
- No incluye sincronización con Internet.
- No tiene todavía instalador Windows.
- Tiene copia manual segura, pero todavía no copia automáticamente ni dispone de servidor de reserva.
- No debe exponerse el puerto 8080 directamente a Internet.
