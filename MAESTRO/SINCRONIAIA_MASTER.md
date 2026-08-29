# SINCRONIAIA · MAESTRO DE GOBIERNO

Estado: VIGENTE
Autoridad: MÁXIMA dentro del proyecto, salvo instrucción expresa del responsable.

## 1. Principio de prevalencia del MAESTRO

El MAESTRO actúa como el agente que regula el tráfico: ante contradicción entre conversaciones, versiones, ramas, procedimientos, automatismos o instrucciones anteriores, prevalece el MAESTRO vigente.

Solo una instrucción expresa del responsable puede autorizar una excepción. Toda excepción debe quedar registrada.

## 2. Jerarquía de autoridad

1. Instrucción expresa actual del responsable.
2. SINCRONIAIA · MAESTRO vigente.
3. Regla específica más reciente y aprobada.
4. MASTER del módulo.
5. Estado operativo publicado.
6. Conversaciones, borradores, ideas y versiones antiguas.

Una conversación nunca puede invalidar por sí sola una regla consolidada del MAESTRO.

## 3. Principio: EL TIEMPO ES ORO

Antes de crear, buscar si ya existe.
Antes de reconstruir, recuperar.
Antes de modificar, localizar la versión real.
Antes de publicar, verificar.

Queda prohibido generar caminos paralelos, duplicados o enlaces alternativos cuando existe una versión operativa, salvo entorno de pruebas expresamente separado y justificado.

## 4. Fuente única de verdad

Cada módulo debe declarar de forma visible:
- URL oficial de producción.
- Rama oficial publicada.
- Archivo de entrada principal.
- Claves de datos/almacenamiento vigentes.
- Funciones protegidas que no pueden perderse.
- Estado actual.
- Última validación.

Si estos datos no están confirmados, no se modifica producción.

## 5. Lo estable se protege

Una modificación debe ser mínima y dirigida al fallo concreto.
No se sustituye una versión completa si basta con corregir una pieza.
No se eliminan funciones que ya funcionan.
No se alteran históricos reales por cambios de interfaz.

## 6. Producción y pruebas

Producción debe tener un único acceso oficial.

### Regla obligatoria de desarrollo aislado

Desde el 29/08/2026, todo desarrollo nuevo, ampliación relevante o modificación que pueda afectar a una versión funcional se realizará primero en una DEMO/LAB aislada e independiente de producción.

La DEMO/LAB debe:
- estar identificada claramente como NO PRODUCCIÓN;
- no sustituir ni modificar la URL oficial existente;
- no utilizar datos reales salvo autorización expresa y entorno seguro;
- poder descartarse sin afectar a producción;
- permitir pruebas desde cero;
- mantenerse separada hasta superar validación y sellado.

Una DEMO/LAB no puede promocionarse a producción por el hecho de funcionar parcialmente. Solo puede sustituir o convertirse en versión oficial después de superar el checklist de sellado aplicable y comprobarse desde la URL que vaya a ser oficial.

Si una prueba falla, se corrige o descarta la DEMO/LAB. No se parchea producción como consecuencia automática de un fallo en laboratorio.

## 7. Definición de HECHO

Un cambio NO está hecho porque el código se haya modificado.
Solo está hecho cuando:
- está publicado en la URL real de producción;
- se ha comprobado que la modificación funciona;
- las funciones protegidas siguen funcionando;
- los datos históricos permanecen intactos;
- no se han creado regresiones críticas o relevantes.

Para desarrollos nacidos en DEMO/LAB, antes de llegar a este estado deben haber superado validación y sellado en el entorno aislado.

## 8. Regla de memoria

Las conversaciones ayudan a trabajar, pero no gobiernan el proyecto.
El MAESTRO y los MASTER de módulo son la memoria persistente de SINCRONIAIA.

Al retomar un módulo, primero se consulta el MAESTRO y después su MASTER/ESTADO ACTUAL.

## 9. Regla superior

El sistema debe impedir, tanto como sea técnicamente posible, trabajar saltándose estas reglas. No basta con “recordarlas”.
