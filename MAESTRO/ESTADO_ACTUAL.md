# SINCRONIAIA · ESTADO ACTUAL

Fecha de actualización: 12/09/2026

## Principio transversal

EVIDENCIA ANTES QUE AFIRMACIÓN.

## Regla de ejecución técnica

Toda modificación debe hacerse en el origen real del código cuando este sea identificable. No se considera solución válida un parche externo o añadido posterior si existe una función fuente localizable que puede corregirse directamente.

## VERI*FACTU

Existe `MAESTRO/VERIFACTU_MASTER.md` como MASTER de módulo.

TPV protegido y congelado:
`https://felixganes-svg.github.io/sincroniaia-demo/tpv-alimentacion-lab-verificado-20260908-cerrar/`

VERI*FACTU sigue NO IMPLEMENTADO como sistema operativo/conforme.

LAB fiscal de referencia validada parcialmente:
`/verifactu-lab/`

Estado actual de esa LAB:
- versión 1.3.1;
- cadena LAB funcional, no equivalente por sí sola a huella fiscal oficial;
- prueba de huella oficial AEAT preparada contra vector oficial, pendiente de validación real del responsable;
- QR técnico local validado en prueba real;
- desglose IVA 10% / 4% validado en prueba real;
- estructura de alta AEAT en previsualización técnica, pendiente de validación XSD/oficial;
- no hay remisión AEAT;
- no hay persistencia fiscal robusta.

Nueva regla expresa del responsable a 12/09/2026:
- el prototipo actual NO SE TOCA;
- se continúa desde una copia aislada de desarrollo;
- ruta de desarrollo separada: `/verifactu-lab-desarrollo/`;
- el TPV protegido permanece intacto;
- cualquier avance nuevo se realiza sobre la copia de desarrollo hasta nueva validación.

## Próximo bloque técnico

Trabajar en la copia aislada de desarrollo sobre:
1. identidad `SistemaInformatico`;
2. numeración fiscal irrevocable;
3. comprobación automática de encadenamiento/huella;
4. validación de estructura contra XSD oficial;
5. persistencia y estados antes de cualquier remisión AEAT.

Principio: no promocionar ni declarar VERI*FACTU operativo sin evidencia completa y sellado.
