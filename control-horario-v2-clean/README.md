# SINCRONIAIA · Control Horario V2 CLEAN

Proyecto nuevo e independiente. No reutiliza la lógica del Control Horario anterior.

## Objetivo de la primera prueba

Demostrar un único circuito completo y verificable:

**Trabajador → API central → Hoja central → Panel Empresa**

La prueba se considera válida solo cuando un fichaje realizado desde un dispositivo aparece en el panel de empresa desde otro dispositivo sin depender del almacenamiento local del primero.

## Fuente de verdad

La fuente de verdad es el backend central. `localStorage` no contiene el histórico oficial. Solo puede utilizarse como cola temporal si el dispositivo está sin conexión.

## Archivos

- `trabajador.html`: interfaz mínima para Entrada / Salida.
- `empresa.html`: panel que consulta el backend central y muestra los movimientos.
- `backend/Code.gs`: backend Google Apps Script nuevo, con control de duplicados mediante `event_id`.

## Prueba de aceptación V2.0.0

1. Abrir Trabajador en un móvil.
2. Registrar ENTRADA.
3. Confirmar respuesta `GUARDADO_EN_SERVIDOR`.
4. Abrir Empresa en otro dispositivo.
5. Ver el mismo movimiento sin copiar ni importar datos.
6. Registrar SALIDA desde el móvil.
7. Verla en Empresa.
8. Repetir el mismo `event_id` y comprobar que el backend no duplica el fichaje.
9. Probar sin conexión: queda pendiente localmente.
10. Recuperar conexión: se envía una sola vez y aparece en Empresa.

Hasta superar estos diez puntos, esta versión no se considera apta para cliente.
