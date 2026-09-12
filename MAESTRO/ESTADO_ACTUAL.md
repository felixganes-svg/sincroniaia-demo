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
- detección de alteración, numeración DEMO no reutilizable y comprobación de cadena: validadas;
- persistencia IndexedDB DEMO y recuperación tras recarga: validada funcionalmente; NO equivale a conservación fiscal robusta;
- desglose IVA 10% / 4%: validado funcionalmente;
- XML SOAP de alta y prevalidación estructural: validados funcionalmente en navegador;
- `RegistroAlta` de prueba: validado contra XSD oficiales AEAT; evidencia workflow `verifactu xsd validation`, run `34719536323`, `XSD_RESULT=PASS`;
- backend 1.7 FastAPI + SQLite append-only: numeración central, huella servidor, cadena, transacción e integridad validadas; run `34719729472` success;
- backend 1.8: estados append-only separados del registro fiscal, transiciones y bloqueo de mutaciones validados; run `34719918175` success;
- backend 1.9: transporte SOAP preproducción preparado con envío real desactivado por defecto, whitelist preproducción, certificado obligatorio y trazabilidad técnica; run `34720139172`, `5 passed`;
- backend 2.0: timeout/no respuesta -> `REINTENTO_PENDIENTE`, conservación de huella, espera/retry gate y parseo `TiempoEsperaEnvio`; run `34720359399`, `6 passed`;
- roadmap 2.1–2.6 creado en módulos aislados y sometido a autovalidación técnica;
- 2.1: reenvío por incidencia con `Cabecera / RemisionVoluntaria / Incidencia = S`; la primera ubicación directa bajo `Cabecera` falló XSD y fue corregida en origen;
- 2.2: anulación aislada con `RegistroAnulacion`; reproduce el vector oficial de huella de anulación `177547C0D57AC74748561D054A9CEC14B4C4EA23D1BEFD6F2E69E3A388F90C68`;
- 2.3: subsanación modelada como nuevo `RegistroAlta` con `Subsanacion = S`, sin alterar el original;
- 2.4: módulo de cola de reintentos con selección por vencimiento y deduplicación por hash de petición;
- 2.5: contrato aislado TPV -> API fiscal que solo acepta copia de ticket cerrado y prohíbe que el motor fiscal modifique el ticket comercial;
- 2.6: checklist de readiness separa preparación técnica de LAB de preparación real de preproducción;
- pruebas backend/roadmap: run `34720710372`, `12 passed`; tras corrección 2.1.1 run `34720873528`, resultado `success`;
- validación XSD ampliada oficial: run `34720895170`, `XSD_INCIDENCIA_ALTA=PASS`, `XSD_ANULACION=PASS`, `XSD_SUBSANACION=PASS`, `XSD_ROADMAP_21_23=PASS`;
- evidencia consolidada: `verifactu-lab-desarrollo/VALIDACION_ROADMAP_v2.1-v2.6.md`;
- módulos 2.2–2.6 permanecen aislados del runtime principal y del TPV hasta sellado/integración controlada;
- ninguna prueba realizó remisión real a AEAT;
- la SQLite de GitHub Actions es temporal y NO equivale a conservación fiscal desplegada;
- no hay autenticación real con certificado ante AEAT;
- no hay respuesta real procedente de AEAT;
- no hay backend fiscal persistente desplegado;
- no hay declaración responsable ni conformidad global demostrada.

## Bloqueos externos / siguiente fase

Antes de una prueba real de preproducción faltan cuatro puntos:
1. desplegar backend fiscal persistente con conservación real;
2. configurar certificado cliente válido fuera del repositorio;
3. obtener y validar una respuesta real de AEAT en preproducción;
4. completar identidad definitiva del producto, declaración responsable y revisión final de conformidad.

Después, y solo después de sellar el LAB fiscal, podrá ejecutarse la FASE 6 de integración controlada con el TPV mediante copia de ticket cerrado.

Principio: no promocionar ni declarar VERI*FACTU operativo sin evidencia completa y sellado.
