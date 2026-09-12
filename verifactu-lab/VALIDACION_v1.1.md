# SINCRONIAIA FISCAL · VERI*FACTU LAB · VALIDACIÓN v1.1

Fecha: 12/09/2026
Tipo: AUTOVALIDACIÓN + PRUEBA REAL DE USUARIO
Estado corregido: APROBADA FUNCIONALMENTE COMO POC LAB · NO APROBADA PARA CIERRE FISCAL OFICIAL DE FASE 2

## Alcance realmente validado

Se comprobó en navegador real que:
- puede generarse un registro A;
- puede generarse un registro B referenciando la huella de A;
- la interfaz detecta una cadena A → B coherente dentro del modelo LAB;
- los registros quedan bloqueados en la interfaz después de generarse.

## Limitación relevante

La huella utilizada en v1.1 se calculaba mediante SHA-256 sobre una serialización JSON determinista del objeto LAB.

Ese mecanismo demuestra integridad funcional dentro del prototipo, pero NO equivale por sí mismo al procedimiento oficial de huella exigido por AEAT para VERI*FACTU.

Por tanto:
- v1.1 queda conservada como evidencia de POC;
- no se considera validación de huella fiscal oficial;
- no se considera cerrada la FASE 2 a nivel normativo/fiscal;
- la alineación con el algoritmo/cadena oficial AEAT se desarrolla posteriormente en LAB 1.3.1 y siguientes.

## Evidencia de usuario

Prueba real comunicada por el responsable:
- Registro A generado y bloqueado.
- Registro B generado y encadenado.
- Resultado mostrado: `CADENA CORRECTA`.

## Resultado

APROBADA FUNCIONALMENTE COMO POC LAB.

NO APROBADA PARA CIERRE FISCAL OFICIAL DE FASE 2.

Motivo: pendiente de demostrar coincidencia exacta con la construcción oficial de huella AEAT y prueba específica de alteración sobre copia.

Principio aplicado: EVIDENCIA ANTES QUE AFIRMACIÓN.
