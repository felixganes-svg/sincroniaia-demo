# SINCRONIAIA · PROTOCOLO DE EJECUCIÓN

Objetivo: convertir el MAESTRO en comportamiento operativo y no en memoria informal.

## Puerta 1 · PREVIA

Antes de tocar producción deben estar respondidas y comprobadas estas preguntas:

- ¿Cuál es la URL oficial?
- ¿Qué rama publica realmente esa URL?
- ¿Cuál es el archivo principal?
- ¿Cuál es la última versión estable?
- ¿Qué datos e históricos son intocables?
- ¿Qué funciones ya funcionan?
- ¿Existe ya una solución aplicable?
- ¿El cambio solicitado contradice alguna regla del MAESTRO?

Resultado obligatorio: APTO / BLOQUEADO.

Si está BLOQUEADO, no se publica ni se crea una alternativa improvisada.

## Puerta 2 · CAMBIO

Aplicar la modificación mínima sobre la fuente correcta.

Regla de oro: ELIMINAR/CORREGIR LO QUE FALLA SIN CAMBIAR LO QUE FUNCIONA.

Los entornos de prueba deben estar identificados como PRUEBAS y no pueden convertirse accidentalmente en producción.

## Puerta 3 · VALIDACIÓN

Repetir pruebas desde cero. No vale considerar válida una prueba solo porque funcionó durante el desarrollo.

Comprobar como mínimo:
1. URL oficial.
2. Rama/commit publicado.
3. Función modificada.
4. Persistencia de datos.
5. Histórico intacto.
6. Funciones protegidas.
7. Móvil.
8. Sincronización/backend cuando aplique.
9. Ausencia de errores críticos/relevantes.

## Puerta 4 · SELLADO

Generar evidencia de validación con:
- fecha;
- responsable;
- tipo de validación;
- versión/commit;
- pruebas realizadas;
- errores encontrados;
- correcciones;
- resultado APROBADA / NO APROBADA.

Solo una versión APROBADA puede llamarse MASTER, STABLE, OPERATIVA o LISTA PARA CLIENTE.

## Puerta 5 · CONTINUIDAD

Actualizar ESTADO_ACTUAL y CHANGELOG del módulo.

La siguiente conversación debe poder retomar el trabajo leyendo esos archivos, sin reconstruir el proyecto desde recuerdos del chat.

## Prohibiciones expresas

- No decir “hecho” antes de verificar producción.
- No crear otro enlace para resolver un fallo del enlace oficial, salvo prueba autorizada.
- No crear otra rama de producción para evitar localizar la rama real.
- No reescribir un módulo estable por comodidad.
- No confiar en caché, memoria de conversación o suposiciones como prueba de publicación.
