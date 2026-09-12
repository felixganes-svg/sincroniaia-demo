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

Prototipo fiscal congelado:
`/verifactu-lab/`

Regla expresa del responsable a 12/09/2026:
- el prototipo actual NO SE TOCA;
- se continúa desde una copia aislada de desarrollo;
- ruta de desarrollo separada: `/verifactu-lab-desarrollo/`;
- el TPV protegido permanece intacto;
- cualquier avance nuevo se realiza sobre la copia de desarrollo hasta nueva validación.

## Estado de la copia aislada de desarrollo

Ruta:
`/verifactu-lab-desarrollo/`

Estado validado hasta 12/09/2026:
- huella SHA-256 construida contra vector oficial AEAT: validada en prueba real de navegador;
- detección de alteración: validada;
- numeración fiscal DEMO no reutilizable dentro del circuito: validada;
- comprobación automática de cadena: validada;
- persistencia IndexedDB DEMO y recuperación tras recarga: validada funcionalmente, NO equivale a almacenamiento fiscal robusto;
- desglose IVA 10% / 4% de la prueba: validado funcionalmente;
- generación XML SOAP de alta: validada funcionalmente en navegador;
- prevalidación estructural del XML: validada funcionalmente;
- payload `RegFactuSistemaFacturacion / RegistroAlta` equivalente a la prueba `VF-LAB-D-000012`: validado automáticamente contra `SuministroLR.xsd` + `SuministroInformacion.xsd` oficiales descargados durante GitHub Actions;
- evidencia XSD: workflow `verifactu xsd validation`, run `34719536323`, job `validate-xsd`, resultado `success`, salida `XSD_RESULT=PASS`;
- no hay remisión real a AEAT;
- no hay autenticación/certificado de servicio;
- no hay gestión real de respuestas, rechazos o reintentos AEAT;
- no hay persistencia fiscal robusta de servidor;
- no hay declaración responsable ni conformidad global demostrada.

## Próximo bloque técnico

Siguiente objetivo autorizado en la copia aislada:
1. API separada + base de datos de servidor / prueba equivalente append-only;
2. estados de envío y respuesta;
3. preparar comunicación con servicios AEAT de prueba;
4. modelar rechazo/reintento;
5. rectificación/anulación conforme a estructura oficial antes de integración con TPV.

Principio: no promocionar ni declarar VERI*FACTU operativo sin evidencia completa y sellado.
