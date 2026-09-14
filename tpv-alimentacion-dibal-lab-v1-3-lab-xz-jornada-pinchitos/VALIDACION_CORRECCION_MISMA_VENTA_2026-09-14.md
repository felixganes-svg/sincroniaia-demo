# VALIDACIÓN · CORRECCIÓN EN LA MISMA VENTA

Fecha: 14/09/2026
Ámbito: LAB ACTUAL `tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos`
Archivo de prueba: `prueba-correccion-misma-venta.html`

## Objetivo
Cuando una venta sigue abierta y se corrige una cantidad/peso cobrado de más, mantener el cálculo interno con la cantidad correcta pero mostrar en el ticket la línea originalmente marcada y, debajo, una segunda línea con la diferencia negativa, siguiendo el criterio visual del ticket de referencia aportado por el usuario.

## Comprobaciones técnicas
- [x] No se crea un TPV nuevo: la prueba envuelve la LAB ACTUAL.
- [x] No se modifica `index.html` ni la versión base validada.
- [x] Se reutiliza el circuito existente `MODIFICAR VENTA`.
- [x] La cantidad corregida sigue siendo la usada para total y cobro.
- [x] La línea original se conserva solo como metadato de presentación/trazabilidad.
- [x] La diferencia se calcula contra la línea original y se representa como segunda línea en el ticket.
- [x] El ticket guardado conserva los metadatos necesarios para reimpresión dentro de esta prueba.
- [x] La prueba no cambia la lógica de tickets cerrados/rectificativos.

## Prueba manual pendiente
1. Iniciar vendedor.
2. Vender un artículo por unidades con cantidad 2.
3. Abrir SUBTOTAL > MODIFICAR VENTA.
4. Cambiar cantidad correcta a 1 y guardar con motivo `Peso / cantidad incorrecta`.
5. Cobrar y cerrar.
6. Confirmar que el ticket muestra primero `2 ud` y después `-1 ud`, y que el TOTAL equivale a 1 unidad.
7. Repetir con artículo por kg, reduciendo el peso, y comprobar la línea negativa en kg.
8. Comprobar que X refleja únicamente el total neto cobrado.

## Resultado
VALIDACIÓN TÉCNICA: APROBADA PARA PRUEBA MANUAL.
VALIDACIÓN FUNCIONAL REAL: PENDIENTE DE PRUEBA DEL USUARIO.
NO MASTER / NO STABLE.
