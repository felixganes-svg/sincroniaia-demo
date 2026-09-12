# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN XSD v1.6.1

Fecha: 12/09/2026
Tipo: validación automatizada independiente del navegador, ejecutada en GitHub Actions.
Entorno: LAB aislada · NO PRODUCCIÓN.

## Alcance

Se valida un payload `RegFactuSistemaFacturacion` / `RegistroAlta` equivalente al XML generado por la LAB para la factura DEMO `VF-LAB-D-000012`.

El sobre SOAP no forma parte de `SuministroLR.xsd`; la validación XSD se realiza sobre el payload del Body.

## Esquemas utilizados

Descargados durante la ejecución desde fuentes oficiales:
- `SuministroLR.xsd`
- `SuministroInformacion.xsd`
- esquema XMLDSig requerido por el import.

## Evidencia automática

Workflow: `verifactu xsd validation`
Run ID: `34719536323`
Job: `validate-xsd`
Resultado del job: `success`

Salida del validador:

`XSD_RESULT=PASS`

`SCHEMA=SuministroLR.xsd + SuministroInformacion.xsd (AEAT)`

`PAYLOAD=RegFactuSistemaFacturacion / RegistroAlta`

## Resultado

APROBADA FUNCIONALMENTE PARA EL ALCANCE XSD DEL PAYLOAD DE ALTA DE PRUEBA.

Esto demuestra que la estructura XML de alta utilizada en esta prueba es aceptada por los XSD oficiales descargados en la ejecución.

## Límites expresos

Esta validación NO demuestra todavía:
- remisión real a AEAT;
- aceptación por servicio web AEAT;
- autenticación/certificado;
- respuesta o códigos de error reales;
- reintentos;
- persistencia fiscal robusta de servidor;
- rectificación/anulación completa;
- conformidad global del producto;
- declaración responsable del productor.

Principio: EVIDENCIA ANTES QUE AFIRMACIÓN.
