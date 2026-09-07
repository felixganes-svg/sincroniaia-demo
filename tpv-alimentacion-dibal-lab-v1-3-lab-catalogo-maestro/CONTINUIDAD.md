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
