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
- backend LAB 1.9: cliente SOAP de preproducción preparado con envío real desactivado por defecto;
- lista blanca de transporte limitada a `prewww1.aeat.es` y `prewww10.aeat.es`; endpoint de producción bloqueado en LAB;
- certificado cliente obligatorio para considerar el transporte preparado para red;
- eventos técnicos de petición/respuesta modelados como append-only y protegidos contra `UPDATE`/`DELETE`;
- petición y respuesta trazadas por SHA-256 sin almacenar secretos del certificado;
- respuesta AEAT simulada `Correcto/Correcto` validada como `PENDIENTE_ENVIO -> ENVIADO -> ACEPTADO` sin modificar la huella fiscal;
- evidencia backend 1.9: workflow `verifactu backend 1.9`, run `34720139172`, job `backend-tests`, resultado `success`, `5 passed`;
- backend LAB 2.0: timeout/ausencia de respuesta modelado como `PENDIENTE_ENVIO -> ENVIADO -> REINTENTO_PENDIENTE`;
- ante no respuesta se conserva la huella fiscal y se registra evento técnico append-only `NO_RESPONSE_RETRY_PENDING`;
- espera conservadora de LAB de 60 segundos registrada con `eligibleAt`; reintento anticipado bloqueado con `RETRY_WAIT_ACTIVE`;
- `TiempoEsperaEnvio` de respuesta AEAT se parsea y queda disponible para control de flujo futuro;
- evidencia backend 2.0: workflow `verifactu backend 2.0`, run `34720359399`, job `backend-tests`, resultado `success`, `6 passed`;
- ninguna prueba 1.9/2.0 realizó una remisión real a AEAT;
- la SQLite probada en GitHub Actions es temporal y NO equivale todavía a conservación fiscal robusta desplegada;
- no hay autenticación real con certificado ante AEAT;
- no hay respuesta real procedente de AEAT;
- no hay scheduler persistente de reintentos automáticos;
- no está implementada todavía la marca `Incidencia` en cabecera para reenvíos por caída/incidencia;
- no hay despliegue persistente de backend fiscal;
- no hay declaración responsable ni conformidad global demostrada.

## Próximo bloque técnico

Siguiente objetivo autorizado en la copia aislada:
1. modelar reenvíos periódicos automáticos/persistentes sin duplicar ni alterar el registro fiscal;
2. incorporar la marca `Incidencia` en la cabecera de remisión cuando proceda según especificación oficial;
3. separar certificado/clave de código y repositorio y comprobar su carga segura en un entorno persistente;
4. validar autenticación y respuestas reales de preproducción cuando exista certificado válido/autorizado;
5. rectificación/anulación conforme a estructura oficial antes de integración con TPV.

Principio: no promocionar ni declarar VERI*FACTU operativo sin evidencia completa y sellado.
