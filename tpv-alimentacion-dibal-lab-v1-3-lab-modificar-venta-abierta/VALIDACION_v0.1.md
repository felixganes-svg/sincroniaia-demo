# VALIDACIÓN · LAB MODIFICAR VENTA ABIERTA v0.1

Fecha: 2026-09-06  
Tipo: autovalidación técnica de laboratorio.

## Resultado

**APROBADA TÉCNICAMENTE PARA PRUEBA FUNCIONAL. NO APROBADA PARA CLIENTE REAL.**

## Comprobaciones técnicas

- Base: LAB ENCARGOS · LIBRETA.
- Almacenamiento independiente de la LAB de origen.
- JavaScript nuevo compila sintácticamente.
- Subtotal no incorpora botón Quitar/Eliminar por línea.
- Existe botón separado MODIFICAR VENTA.
- La edición permite cambiar peso/cantidad.
- La edición permite RETIRAR ARTÍCULO.
- El precio no se edita desde este circuito.
- Motivo obligatorio antes de guardar o retirar.
- Las unidades exigen entero positivo.
- El peso/cantidad debe ser positivo.
- Las ofertas de artículo se recalculan al cambiar cantidad/peso.
- La memoria del vendedor se actualiza tras la modificación.
- Se registra trazabilidad: fecha, vendedor, acción, motivo, línea antes y después.
- Empresa dispone de consulta Modificaciones venta abierta.
- El registro entra en la copia completa.
- El circuito de tickets cerrados/Rectificación autorizada se mantiene separado.

## Prueba funcional móvil obligatoria

1. Iniciar Vendedor 1.
2. Añadir dos artículos a una venta.
3. Abrir SUBTOTAL.
4. Confirmar que no existe Quitar/Eliminar junto a las líneas.
5. Pulsar MODIFICAR VENTA.
6. Elegir una línea.
7. Intentar retirar sin motivo: debe bloquear.
8. Elegir "Cliente no lo quiere" y retirar.
9. Volver al Subtotal: la línea ya no debe estar y el total debe actualizarse.
10. Empresa → Modificaciones venta abierta: debe aparecer el registro.
11. Hacer otra venta y cambiar el peso/cantidad de una línea.
12. Confirmar antes/después y motivo en el registro.
13. Cobrar la venta.
14. Abrir el ticket cerrado: no debe poder usar Modificar venta abierta; la corrección debe seguir por Rectificación autorizada.

## Pendiente

- Validación visual y táctil en móvil real.
- Confirmación del usuario de que el flujo resulta suficientemente rápido en mostrador.


## Evidencia de simulación funcional

Prueba ejecutada tras publicar los archivos en `main`:

### Caso 1 · Corrección de peso
- Artículo: Entrecot.
- Peso inicial: 1,250 kg.
- Precio: 32,50 €/kg.
- Nuevo peso: 0,800 kg.
- Importe recalculado: 26,00 €.
- Memoria del vendedor actualizada: **OK**.
- Registro creado con acción `CAMBIO PESO/CANTIDAD`: **OK**.

### Caso 2 · Cliente no quiere el artículo
- Motivo: `Cliente no lo quiere`.
- Acción: `RETIRAR ARTÍCULO`.
- Línea eliminada de la venta abierta: **OK**.
- Memoria del vendedor queda sin esa línea: **OK**.
- Registro creado con acción `LÍNEA RETIRADA`: **OK**.
- Registro persistido en almacenamiento de la LAB: **OK**.

### Resultado de simulación
**2/2 casos superados.**

Esto no sustituye la prueba táctil real en móvil, que sigue siendo obligatoria antes de sellar una versión.
