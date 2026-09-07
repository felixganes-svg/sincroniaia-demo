# CONTINUIDAD · SINCRONIAIA TPV CARNICERÍA · 07/09/2026

## LAB ACTUAL
tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro

Acceso:
https://felixganes-svg.github.io/sincroniaia-demo/tpv-alimentacion-dibal-lab-v1-3-lab-catalogo-maestro/

## LAB ANTERIOR
tpv-alimentacion-dibal-lab-v1-3-lab-precio-contextual

## Catálogo consolidado
- Fuente visual: listado real de balanza fotografiado el 07/09/2026.
- El listado impreso muestra 146 códigos totales, incluyendo 000000 y 000795 a 0,00.
- Artículos con nombre/precio en el listado real: códigos 000001 a 000144.
- No se incorporan 000000 ni 000795 como artículos vendibles.
- Se eliminan del catálogo fuente de esta LAB los cuatro artículos de prueba 000145-000148.
- 000016 confirmado: Formatge cabra fresc · 17,95 €/kg.
- 000018 se mantiene como Formatge cabra · 28,00 €/kg.
- 000088 Picada mixta · 16,95 €/kg se conserva y su subsección deja de quedar oculta.
- 004330: Caldo de pollo Cala Abril · 5,50 €/ud, incorporado en Elaborados → Preparados.
- Alas, contramuslos y jamoncitos quedan pendientes de código/precio; no se inventan.

## Reglas de navegación conservadas
- Botones de artículo: solo nombre.
- MIRAR PRECIO contextual por sección/subsección.
- TODOS LOS PRECIOS y CAMBIAR SECCIÓN disponibles bajo petición.
- Precio 0/no válido bloquea la venta.

## Persistencia
Se conservan las mismas claves locales de la cadena actual para no perder modificaciones del dispositivo.
La migración de catálogo se reaplica después de restaurar IndexedDB para evitar que una copia antigua vuelva a ocultar o revertir las correcciones maestras.

## Versionado
Regla: solo LAB ACTUAL + LAB ANTERIOR visibles en main.


## Actualización · DESPENSA 6 DÍGITOS
- Regla: Despensa exige exactamente 6 dígitos de código.
- 004330 → 584330 · Caldo de pollo Cala Abril · 5,50 €/ud.
- 581025 · Crostonets de pan fregits · 2,90 €/ud.
- 009291 · Padre panzas · 4,90 €/ud.
- 001269 · Plumas N.6 de gallo · 1,50 €/ud.
- 001139 · Pistón mediano de gallo · 1,50 €/ud.
- 006143 · Galetta huevo de Nadal el pavo · 1,50 €/ud.
- 930009 · Caldo de pollo brick 1 litro · 3,95 €/ud.
- Pendiente: 180137 Bastoncitos de aceite de oliva, sin precio confirmado.
- Pendiente: Brou de pollastre 750 grs · 4,50 €, sin código confirmado.

- 710782 · Queso Entremont rallado 70 g · 1,70 €/ud · Despensa.


## Actualización · TICKETS DICTADOS
LAB destinada a registrar ventas reales que el usuario dicte sin tener que rehacerlas manualmente en el TPV.
Archivo de datos: tickets-dictados-data.js.
Regla: cada ticket requiere ref única, fecha/hora, vendedor, forma de pago, líneas y total cuadrado.
No hay tickets ficticios cargados en la publicación inicial.


## Ticket real nº 12 · 07/09/2026
- Vendedor: Vendedor 1.
- Pago: Tarjeta.
- 000088 · Picada mixta · 0,410 kg × 16,95 €/kg = 6,95 €.
- 000149 · Salchicha de pollo · 0,265 kg × 17,95 €/kg = 4,76 €.
- Total: 11,71 €.
- Ref importación: VENTA-20260907-T12.
- Se crea 000149 como artículo nuevo a 17,95 €/kg.

- Corrección clasificación 000149: Salchicha de pollo pasa de Elaborados a **Carnicería → Pollo**. El ticket nº 12 se migra sin duplicarlo.


## Ticket real nº 13 · 07/09/2026
- Vendedor: Vendedor 1.
- Pago: Efectivo exacto.
- 000056 · Quart de pollastre · 1,080 kg × 6,95 €/kg = 7,51 €.
- 000074 · Hamburguesa vedella · 0,410 kg × 19,50 €/kg = 8,00 €.
- Total: 15,51 €.
- Efectivo entregado: 15,51 €.
- Cambio: 0,00 €.
- Ref importación: VENTA-20260907-T13.


## Ticket real nº 1 · 07/09/2026
- Vendedor: Vendedor 2.
- Pago: Efectivo exacto.
- 000078 · Hamburguesa pollastre · 0,245 kg × 18,95 €/kg = 4,64 €.
- 000074 · Hamburguesa vedella · 0,240 kg × 19,50 €/kg = 4,68 €.
- 000080 · Llom duroc · 0,545 kg × 15,95 €/kg = 8,69 €.
- 000057 · Pit pollastre · 0,605 kg × 13,25 €/kg = 8,02 €.
- 000111 · Salsitxes · 0,305 kg × 18,95 €/kg = 5,78 €.
- 000001 · Pernil dolç · 0,150 kg × 17,95 €/kg = 2,69 €.
- 000005 · Mortadela pavo · 0,155 kg × 17,00 €/kg = 2,64 €.
- 000019 · Havarti · 0,165 kg × 18,50 €/kg = 3,05 €.
- Total: 40,19 €.
- Efectivo entregado: 40,19 €.
- Cambio: 0,00 €.
- Ref importación: VENTA-20260907-T01.

## Ticket nº 2 · pendiente
- Vendedor 2.
- Pago: Efectivo.
- Total dictado: 29,62 €.
- Total calculado con las líneas recibidas: 28,54 €.
- Diferencia: 1,08 €.
- Estado: NO IMPORTADO hasta aclarar el dato que no cuadra.


## VN + Vendedor 5 · 07/09/2026
- Se crea Vendedor 5 con código 5 y PIN demo 5555.
- V1–V4 quedan como accesos rápidos al validar una línea.
- VN permite introducir el código de cualquier vendedor registrado.
- VN no crea vendedores.
- Si el vendedor elegido por VN existe pero no está iniciado, solicita su PIN y puede iniciar la sesión antes de guardar la línea.
- Empresa puede crear más vendedores; los códigos distintos de 1–4 se utilizan mediante VN.
- Se bloquean códigos de vendedor duplicados.


## Jornada real completa · 13 tickets · 07/09/2026
- Total ventas confirmado: 244,11 €.
- Tarjeta confirmada por cierre terminal: 106,42 €.
- Efectivo resultante: 137,69 €.
- Tarjeta: tickets 2, 6, 10, 11 y 12.
- Efectivo: tickets 1, 3, 4, 5, 7, 8, 9 y 13.
- Se publican los 13 tickets en el lote de Ventas dictadas.
- T4, T5 y T11 conservan una línea explícita "Detalle pendiente de identificar · ticket físico" para no inventar el detalle que faltó en el dictado y mantener el total físico confirmado.
- La X incorpora desglose visible por Efectivo, Tarjeta, Bizum, Mixto/Otros y Venta total.
