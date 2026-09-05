# SINCRONIAIA TPV Local Red · PILOTO v0.1

Servidor local para compartir artículos, ventas, encargos y tickets entre varios puestos del mismo establecimiento, conectados por Ethernet o Wi-Fi.

## Arranque

1. Instalar Python 3 en el ordenador que actuará como servidor.
2. Ejecutar `INICIAR_TPV_WINDOWS.bat`.
3. En el ordenador principal abrir `http://localhost:8080`.
4. En las tablets abrir `http://IP-DEL-ORDENADOR:8080`.

Código inicial de Empresa: `1234`. Vendedor 1: código `1`, PIN `1111`.

## Datos

La base `tpv_local_red.db` se crea automáticamente. Todos los puestos utilizan la misma base. Los tickets cerrados están protegidos por reglas de base de datos que impiden actualizarlos o eliminarlos.

## Alcance

Este piloto funciona dentro de la red local. No permite acceso desde casa sin VPN o una posterior versión híbrida.
