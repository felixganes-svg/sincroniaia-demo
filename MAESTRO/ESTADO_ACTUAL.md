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
- backend LAB 1.7 separado: implementado en `verifactu-lab-desarrollo/backend/` con FastAPI + SQLite independiente;
- numeración central de backend, huella calculada en servidor, encadenamiento, transacción registro+contador y verificación `/integrity`: validados automáticamente;
- registros fiscales del backend protegidos contra `UPDATE` y `DELETE` mediante ausencia de endpoints de modificación y triggers SQLite append-only;
- evidencia backend 1.7: workflow `verifactu backend 1.7`, run `34719729472`, job `backend-tests`, resultado `success`;
- backend LAB 1.8: estados de envío/respuesta modelados como eventos separados append-only, sin reescribir `fiscal_records`;
- transiciones validadas: `PENDIENTE_ENVIO -> ENVIADO -> RECHAZADO -> REINTENTO_PENDIENTE -> ENVIADO -> ACEPTADO`;
- transiciones inválidas bloqueadas; `state_events` protegido contra `UPDATE` y `DELETE`; huella original conservada durante cambios de estado;
- evidencia backend 1.8: workflow `verifactu backend 1.8`, run `34719918175`, job `backend-tests`, resultado `success`;
- la SQLite probada en GitHub Actions es temporal y NO equivale todavía a conservación fiscal robusta desplegada;
- no hay remisión real a AEAT;
- no hay autenticación/certificado de servicio;
- no hay respuesta real procedente de AEAT;
- no hay política final de reintentos temporizados;
- no hay despliegue persistente de backend fiscal;
- no hay declaración responsable ni conformidad global demostrada.

## Próximo bloque técnico

Siguiente objetivo autorizado en la copia aislada:
1. preparar transporte real al servicio AEAT de pruebas sin activarlo todavía en producción;
2. modelar cliente HTTP/SOAP con certificado y configuración separada;
3. distinguir envío simulado de envío real y bloquear el real sin credenciales explícitas;
4. registrar petición/respuesta como eventos técnicos append-only;
5. rectificación/anulación conforme a estructura oficial antes de integración con TPV.

Principio: no promocionar ni declarar VERI*FACTU operativo sin evidencia completa y sellado.
