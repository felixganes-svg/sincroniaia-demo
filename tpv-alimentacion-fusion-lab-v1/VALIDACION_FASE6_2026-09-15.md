# VALIDACIÓN · FASE 6 · Ticket 58 mm / Fun Print

Fecha: 15/09/2026

## Regla maestra aplicada
- EVIDENCIA ANTES QUE AFIRMACIÓN.
- LAB aislada: no se modifica BASE A ni BASE B.
- Cada mejora se incorpora una a una.
- No se declara MASTER/STABLE sin prueba desde cero.

## Evidencia previa confirmada
- El ticket PNG 58 mm normal ya genera el formato propio de SINCRONIAIA y el usuario mostró una impresión física del ticket nº 49 con el mismo formato general.
- La marca añadida por la app de impresión no forma parte del PNG del TPV.

## Hallazgo
El generador 58 mm de origen dibuja las líneas normales de `t.items`, pero no incorpora la trazabilidad añadida en FASE 5:
- `item._openSaleTrace` para correcciones parciales.
- `ticket._removedOpenSaleTrace` para líneas anuladas completas.

## Cambio aislado aplicado
Archivo nuevo: `fase6-ticket58-trazabilidad.js`.

Reglas del parche:
1. El ticket 58 mm normal, sin correcciones ni anulaciones, NO cambia de formato.
2. Si existe trazabilidad, se conserva la imagen 58 mm original y se añade al final una sección `CORRECCIONES / ANULACIONES`.
3. Una corrección muestra original, corrección, resultado y motivo.
4. Una anulación muestra artículo anulado, original, anulación negativa y motivo.
5. Descargar/Abrir imagen usa la nueva imagen solo cuando existe trazabilidad.

## Verificación técnica realizada
- Sintaxis JavaScript comprobada con `node --check`: OK.
- Archivo publicado en la LAB FUSIÓN y recuperado desde GitHub: OK.
- `index.html` carga el parche de FASE 6 después de FASE 5: OK.
- A y B no han sido modificadas: OK según alcance de los commits realizados.

## Prueba manual obligatoria pendiente
Estado: **NO VALIDADA AÚN EN USO REAL**.

Prueba requerida desde cero:
1. Crear una venta con dos artículos.
2. Anular uno con motivo.
3. Finalizar y comprobar el ticket normal.
4. Abrir `REIMPRIMIR 58 MM · COPIA`.
5. Verificar que el PNG mantiene el formato normal y añade la anulación con importe negativo y motivo.
6. Descargar la imagen e imprimirla con Fun Print.
7. Confirmar que la impresión física conserva esa trazabilidad.

Solo después de esta prueba podrá marcarse FASE 6 como VALIDADA.
