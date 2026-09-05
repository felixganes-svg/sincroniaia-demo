# Manual de usuario · SINCRONIAIA TPV Local Red v0.1

## Entrar desde un puesto

Abra en el navegador la dirección indicada por el ordenador servidor, por ejemplo `http://192.168.1.50:8080`. Todos los puestos deben estar conectados a la misma red local, por cable o Wi-Fi.

## Identificar el puesto

Entre en `Vendedores > Identificar puesto` y escriba un nombre como `Carnicería`, `Charcutería` o `Caja`.

## Iniciar vendedor

Pulse `Iniciar vendedor`, introduzca el código y el PIN. En la configuración inicial, Vendedor 1 utiliza código `1` y PIN `1111`.

## Añadir una venta

1. Entre en Venta.
2. Seleccione Carnicería, Charcutería, Elaborados, Código o A-Z.
3. Pulse un artículo.
4. Introduzca peso o unidades.
5. Si corresponde, introduzca la tara.
6. Pulse Entrar y elija vendedor.

La línea se guarda inmediatamente en el servidor y queda visible desde los demás puestos.

## Cobrar

1. Pulse Subtotal.
2. Elija vendedor.
3. Revise la venta.
4. Pulse Cobrar.
5. Seleccione la forma de pago.
6. En efectivo, introduzca la entrega del cliente.
7. Pulse Finalizar ticket.

El ticket queda cerrado e inalterable. Solo puede consultarse o reimprimirse desde Empresa.

## Encargos

Los encargos pendientes aparecen en `Venta > Encargos`. Al cargar uno, introduzca el peso definitivo realmente preparado, elija vendedor y finalice el cobro como una venta normal.

## Si no conecta

Compruebe que el servidor está encendido, que `server.py` continúa abierto, que ambos equipos pertenecen a la misma red y que el cortafuegos permite el puerto 8080.
