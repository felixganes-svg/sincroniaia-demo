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

Si falta cualquiera de estos puntos, se detiene la modificación hasta localizarlo.

## Durante la modificación

- Cambiar únicamente lo necesario.
- No crear versiones paralelas sin justificación.
- No cambiar el enlace oficial del usuario final.
- No sustituir datos reales por datos de prueba.
- No borrar históricos.
- No reintroducir errores ya corregidos.
- No declarar una versión MASTER/STABLE/OPERATIVA sin validación.

## Después de modificar

Debe verificarse desde cero:
- acceso oficial;
- carga correcta de la versión publicada;
- función modificada;
- funciones protegidas;
- datos históricos;
- persistencia;
- sincronización, si existe;
- comportamiento móvil;
- ausencia de regresiones críticas/relevantes.

## Clasificación de errores

CRÍTICO: pérdida/corrupción de datos, acceso incorrecto, seguridad, fichaje erróneo, bloqueo de una función esencial. Bloquea publicación.

RELEVANTE: función importante incorrecta, cálculo equivocado, flujo incoherente, versión publicada distinta de la validada. Bloquea declaración de STABLE/MASTER.

MENOR: defecto visual o de texto sin impacto funcional. Puede publicarse solo si queda registrado y aceptado.

## Autovalidación

Si la misma persona desarrolla, prueba y valida, debe constar como autovalidación. Autovalidar no equivale a validación independiente.

## Regla de excepción

Una excepción solo existe si el responsable la autoriza expresamente. Debe registrarse indicando qué regla se exceptúa, motivo, alcance y fecha.
