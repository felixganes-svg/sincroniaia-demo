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


## Actualización visual · 2026-09-06

Cambios aprobados tras revisión visual:
- Eliminado el botón superior `← MENÚ` en la vista de familia.
- Eliminado el segundo título repetido de la familia (por ejemplo, `Carnicería`).
- `ARTÍCULOS A–Z` se mantiene como acceso superior.
- `Venta directa · peso y precio` conserva su función, pero pasa a un estilo secundario de menor protagonismo.
- La navegación inferior `MENÚ PRINCIPAL / SUBTOTAL` se mantiene como referencia constante.

Verificación posterior:
- A-Z presente: **OK**.
- Subsecciones operativas en código: **OK**.
- Navegación inferior presente: **OK**.
- SUBTOTAL presente: **OK**.
- Script de Modificar venta cargado: **OK**.
- Sintaxis de los scripts inline: **OK**.

La comprobación de publicación visual en GitHub Pages queda sujeta al refresco/caché del navegador del dispositivo.


## Actualización · Listado de artículos · filtros en una línea

Cambio aprobado:
- En **Empresa → Artículos → Listado de artículos**, los filtros de escritorio quedan en una sola fila:
  1. Familia / sección.
  2. Subsección.
  3. Altas / Bajas / Todas.
  4. Código o nombre.
- El nuevo filtro de estado es funcional:
  - **Todas**: muestra activos e inactivos.
  - **Altas**: muestra artículos activos (`active !== false`).
  - **Bajas**: muestra artículos inactivos (`active === false`).

Verificación:
- Cuatro columnas en escritorio: **OK**.
- Filtro Todas: **OK**.
- Filtro Altas: **OK**.
- Filtro Bajas: **OK**.
- Combinación con Familia/Subsección/Código o nombre: implementada en la misma función de filtrado.
- Sintaxis JavaScript: **OK**.

En pantallas pequeñas la cuadrícula se adapta para mantener legibilidad; no altera la lógica del filtro.


## Actualización · Conservación de filtros tras editar artículo

### Error reportado
En **Empresa → Artículos → Listado de artículos**, al trabajar con un filtro como:

**Charcutería → Todas → Altas**

y abrir un artículo, modificarlo y guardar, la pantalla se reconstruía con:

**Todas → Todas → Todas**

### Causa
El guardado ejecutaba `render()` y reconstruía la vista de Artículos con los valores por defecto de los filtros.

### Corrección
Se guarda en memoria de sesión el estado de los cuatro filtros:
- Familia / sección.
- Subsección.
- Altas / Bajas / Todas.
- Código o nombre.

Al volver a renderizar **Empresa → Artículos**, esos valores se restauran y se vuelve a aplicar el filtro.

Los filtros no se guardan permanentemente entre recargas completas del navegador, para evitar que otro día se abra el listado con un filtro antiguo sin que el usuario lo recuerde.

### Evidencia de prueba
Caso simulado:
- Familia / sección: **Charcutería**.
- Subsección: **Todas**.
- Estado: **Altas**.
- Código o nombre: vacío.
- Abrir artículo: estado capturado correctamente.
- Simular reconstrucción de pantalla a valores por defecto.
- Restauración posterior:
  - Charcutería: **OK**.
  - Todas: **OK**.
  - Altas: **OK**.
  - Código o nombre vacío: **OK**.

Resultado: **PRUEBA SUPERADA**.

Pendiente únicamente la comprobación visual/táctil real en navegador del usuario.


## Actualización · Depuración de navegación de subsecciones

### Cambios aprobados
- Eliminado el botón superior de vuelta a familia:
  - `← Carnicería`
  - `← Charcutería`
  - `← Elaborados`
- Se mantiene arriba únicamente `Menú principal` como salto directo al nivel raíz.
- Eliminado el segundo título grande repetido de la subsección.
- La barra inferior conserva:
  - izquierda: vuelta contextual a la familia;
  - derecha: `SUBTOTAL`.
- El encabezado evita repetir familia y subsección cuando son el mismo texto:
  - `Elaborados · Elaborados` pasa a `Elaborados`.
  - `Elaborados · Preparados` se mantiene.
  - `Elaborados · Hamburguesas` se mantiene.

### Verificación
- Carnicería · Cabrito: **OK**.
- Carnicería · Cerdo: **OK**.
- Carnicería · Conejo: **OK**.
- Carnicería · Cordero: **OK**.
- Carnicería · Pollo: **OK**.
- Carnicería · Ternera: **OK**.
- Charcutería · Embutidos: **OK**.
- Elaborados sin duplicación: **OK**.
- Menú principal superior: **OK**.
- Familia contextual inferior: **OK**.
- SUBTOTAL inferior: **OK**.
- Sintaxis JavaScript: **OK**.

Resultado: **APROBADA TÉCNICAMENTE PARA PRUEBA VISUAL/TACTIL**.


## Actualización · Venta compacta + orden alfabético

### Objetivo
Mostrar el máximo número de artículos posible dentro de la pantalla sin reducirlos a botones incómodos para uso táctil.

### Cambios
- Los artículos de cada subsección se ordenan automáticamente **A → Z por nombre**.
- La búsqueda dentro de una subsección conserva también el orden A → Z.
- El código del artículo se mantiene visible.
- Se elimina de cada tarjeta el nombre de la subsección, porque ya está indicado en la cabecera.
- Tarjetas más compactas:
  - altura mínima: 58 px;
  - menor separación vertical;
  - nombre + código + precio/unidad.
- Cuadrícula adaptativa:
  - móvil: 2 columnas;
  - tablet / pantalla media: 4 columnas;
  - escritorio: 5 columnas;
  - escritorio ancho (≥1250 px): 6 columnas.

### Verificación técnica
- Orden alfabético normal: **OK**.
- Orden alfabético en búsqueda: **OK**.
- Código visible: **OK**.
- Precio/unidad visible: **OK**.
- Subsección redundante eliminada de tarjeta: **OK**.
- 2/4/5/6 columnas según anchura: **OK**.
- Sintaxis JavaScript: **OK**.

### Capacidad aproximada en pantalla ancha
Con 6 columnas:
- Cerdo: alrededor de 4 filas.
- Ternera: alrededor de 3 filas.
- Cordero / Pollo: alrededor de 1 fila.
- Quesos: alrededor de 3 filas.
- Elaborados / Preparados: aproximadamente 2–3 filas.
- Embutidos es una subsección mucho más extensa y puede necesitar desplazamiento; no se fuerza una reducción excesiva del tamaño táctil para eliminarlo.

### Regla consolidada
**Prioridad: máximo contenido visible sin perder legibilidad ni precisión táctil.**
No se fuerza “cero scroll” cuando el volumen de artículos convertiría los botones en elementos demasiado pequeños.


## Actualización · Cambio rápido de precio

### Objetivo
Permitir a Empresa cambiar un precio de forma inmediata sin entrar en la ficha completa del artículo.

### Flujo
**Empresa → Artículos → CAMBIO RÁPIDO DE PRECIO**
1. Introducir código corto o completo.
2. El sistema normaliza el código a 6 dígitos.
3. Localiza el artículo y muestra nombre + precio actual.
4. Introducir nuevo precio.
5. Confirmación explícita del cambio.
6. Guardado del nuevo precio.
7. Registro en histórico de cambios rápidos.

### Reglas
- Solo modifica el precio del artículo.
- No modifica nombre, familia, subsecciones ni estado.
- El nuevo precio se aplica a ventas nuevas.
- Tickets cerrados permanecen intactos.
- Líneas ya guardadas en ventas abiertas permanecen con su precio capturado.
- Líneas de encargos ya preparadas/guardadas permanecen con su precio capturado.
- Se conserva trazabilidad con fecha, código, artículo, precio anterior y precio nuevo.
- El histórico se incluye en copia/restauración JSON de esta LAB.

### Prueba exacta solicitada
Catálogo real de la LAB:
- Código: **000083**
- Artículo: **Llonza**
- Precio inicial: **12,10 €/kg**

Entrada:
- Código escrito: **83**
- Nuevo precio: **15,50**

Resultado simulado con las funciones publicadas:
- Normalización 83 → 000083: **OK**
- Artículo encontrado: Llonza: **OK**
- Precio 12,10 → 15,50 €/kg: **OK**
- Registro histórico oldPrice=12,10 / newPrice=15,50: **OK**
- Persistencia ejecutada: **OK**
- Ticket anterior sin cambios: **OK**
- Venta abierta existente sin cambios: **OK**
- Encargo ya guardado sin cambios: **OK**
- Sintaxis JavaScript: **OK**

Resultado: **PRUEBA TÉCNICA SUPERADA**.

Pendiente únicamente comprobación visual/táctil real en navegador.


## Actualización · LAB VENTA COMPACTA · 07/09/2026

### Decisión funcional
Los botones de artículos de las secciones muestran **solo el nombre del artículo**. El precio deja de ocupar espacio en cada botón y se consulta mediante **MIRAR PRECIO**.

### Objetivo
Aumentar el número de artículos visibles simultáneamente y reducir ruido visual en mostrador.

### Reglas verificadas en código
- Venta directa ya exigía peso neto > 0 y precio/kg > 0 antes de elegir vendedor.
- Se añade bloqueo en selección de artículo si el precio del catálogo es 0/no válido.
- Se añade bloqueo en preparación de línea si el precio es 0/no válido.
- Se añade bloqueo antes de mostrar vendedores si la línea no tiene precio válido.
- Se añade bloqueo final antes de guardar la línea en la memoria del vendedor.
- **MIRAR PRECIO** es solo consulta: no dispara selección ni venta.
- Botones de producto ya no muestran código, precio, unidad ni oferta; internamente siguen identificados por su código.
- La pantalla A–Z también dispone de MIRAR PRECIO al entrar en una letra.

### Estado
**APROBADA PARA PRUEBA VISUAL/TÁCTIL EN LAB.**
Pendiente prueba manual desde móvil con artículos reales modificados por el usuario.


## Actualización · LAB PRECIO CONTEXTUAL · 07/09/2026

### Objetivo
Evitar que MIRAR PRECIO muestre todo el catálogo cuando el vendedor ya está trabajando dentro de una sección concreta.

### Comportamiento esperado
- Carne → Ternera → MIRAR PRECIO = solo Ternera.
- Charcutería → Quesos → MIRAR PRECIO = solo Quesos.
- Elaborados → Hamburguesas → MIRAR PRECIO = solo Hamburguesas.
- Familia sin subsección = todos los artículos de esa familia.
- TODOS LOS PRECIOS = catálogo completo activo.
- CAMBIAR SECCIÓN = elección táctil Familia → Subsección.
- La búsqueda filtra únicamente dentro del contexto actual.

### Protección funcional conservada
- MIRAR PRECIO no vende ni añade líneas.
- Ninguna línea con precio 0/no válido puede seleccionarse, prepararse, validarse o guardarse.

### Estado
**APROBADA PARA PRUEBA VISUAL/TÁCTIL EN LAB.**
Pendiente comprobación manual desde móvil en el flujo real de mostrador.


## Validación · LAB CATÁLOGO MAESTRO · 07/09/2026

- Catálogo fuente contrastado con las cuatro fotografías del listado de balanza.
- Se conservan 000001-000144 como base real.
- Se retiran 000145-000148 de prueba.
- 000016 = Formatge cabra fresc · 17,95 €/kg.
- 004330 = Caldo de pollo Cala Abril · 5,50 €/ud.
- Picada mixta (000088) permanece y su subsección se habilita para navegación.
- Se reejecuta la migración después de restaurar IndexedDB.
- Pendientes sin inventar: alas, contramuslos y jamoncitos hasta disponer de código/precio.

Estado: **APROBADA PARA PRUEBA FUNCIONAL EN LAB. NO CLIENTE REAL.**


## Validación · DESPENSA 6 DÍGITOS · 07/09/2026
- Código de Despensa: exactamente 6 dígitos en alta/edición.
- 004330 sustituido por 584330 sin duplicado.
- Nuevas referencias de despensa con códigos únicos y precios > 0.
- Despensa habilitada en navegación.
- Pendientes incompletos no se incorporan.
Estado: APROBADA PARA PRUEBA FUNCIONAL EN LAB.

- 710782 · Queso Entremont rallado 70 g · 1,70 €/ud: incorporado con código de 6 dígitos y precio válido.


## Validación · TICKETS DICTADOS · 07/09/2026
- Lote inicial vacío: no modifica ventas reales.
- Referencia única por ticket: implementada.
- Reapertura sin duplicado: control por dictatedRef.
- Fecha, vendedor, pago, líneas y total son obligatorios.
- El total debe cuadrar con las líneas (tolerancia 0,02 €).
- Efectivo entregado no puede ser inferior al total.
- Los tickets usan la estructura normal de tickets y por tanto participan en Tickets guardados e X/Z.
- UI Empresa → Ventas dictadas añadida.
Estado: APROBADA PARA PRUEBA FUNCIONAL EN LAB. PENDIENTE PRIMER TICKET REAL DICTADO.
