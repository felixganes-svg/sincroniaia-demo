# SINCRONIAIA · REGLAS OBLIGATORIAS

Estas reglas no son recomendaciones. Son condiciones de trabajo.

## Antes de modificar cualquier módulo

1. Leer `MAESTRO/SINCRONIAIA_MASTER.md`.
2. Identificar el MASTER del módulo.
3. Confirmar URL oficial de producción.
4. Confirmar rama realmente publicada.
5. Confirmar archivo principal.
6. Identificar datos/histórico que deben protegerse.
7. Identificar funciones que ya funcionan y no pueden perderse.
8. Comprobar si la solución ya existe antes de crear una nueva.
9. Crear o identificar una DEMO/LAB aislada e independiente para cualquier desarrollo nuevo, ampliación relevante o cambio con riesgo sobre producción.

Si falta cualquiera de estos puntos, se detiene la modificación hasta localizarlo.

## Regla obligatoria de DEMO/LAB aislada

Desde el 29/08/2026:

- Todo desarrollo nuevo se realiza primero fuera de producción.
- Toda ampliación relevante se prueba primero en DEMO/LAB aislada.
- Toda modificación con riesgo de regresión se prueba primero en DEMO/LAB aislada.
- La DEMO/LAB debe estar identificada como NO PRODUCCIÓN.
- La DEMO/LAB debe poder eliminarse sin afectar a la versión operativa.
- No se cambia la URL oficial mientras se está probando.
- No se reutilizan datos reales en pruebas salvo autorización expresa y entorno seguro.
- Si la prueba falla, se corrige o descarta la DEMO/LAB; no se parchea producción automáticamente.
- Solo después de validación y sellado puede plantearse promoción a producción.

## Durante la modificación

- Cambiar únicamente lo necesario.
- No crear versiones paralelas de producción sin justificación.
- No cambiar el enlace oficial del usuario final.
- No sustituir datos reales por datos de prueba.
- No borrar históricos.
- No reintroducir errores ya corregidos.
- No declarar una versión MASTER/STABLE/OPERATIVA sin validación.
- Mantener separadas DEMO/LAB y producción hasta completar el sellado.

## Después de modificar

Debe verificarse desde cero:
- acceso de la DEMO/LAB;
- carga correcta de la versión probada;
- función modificada;
- funciones protegidas;
- datos históricos;
- persistencia;
- sincronización, si existe;
- comportamiento móvil;
- ausencia de regresiones críticas/relevantes.

Antes de promocionar a producción debe repetirse la verificación sobre la URL oficial que vaya a quedar publicada.

## Clasificación de errores

CRÍTICO: pérdida/corrupción de datos, acceso incorrecto, seguridad, fichaje erróneo, bloqueo de una función esencial. Bloquea publicación.

RELEVANTE: función importante incorrecta, cálculo equivocado, flujo incoherente, versión publicada distinta de la validada. Bloquea declaración de STABLE/MASTER.

MENOR: defecto visual o de texto sin impacto funcional. Puede publicarse solo si queda registrado y aceptado.

## Autovalidación

Si la misma persona desarrolla, prueba y valida, debe constar como autovalidación. Autovalidar no equivale a validación independiente.

## Regla de excepción

Una excepción solo existe si el responsable la autoriza expresamente. Debe registrarse indicando qué regla se exceptúa, motivo, alcance y fecha.
