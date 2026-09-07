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
