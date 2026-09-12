# SINCRONIAIA FISCAL · VERI*FACTU · VALIDACIÓN ROADMAP 2.1–2.6

Fecha: 12/09/2026
Tipo: AUTOVALIDACIÓN TÉCNICA · LAB AISLADO · NO PRODUCCIÓN
Resultado del alcance probado: APROBADA
Conformidad global VERI*FACTU: NO DECLARADA

## Principio

EVIDENCIA ANTES QUE AFIRMACIÓN.

## Alcance creado y probado

### 2.1 · Reenvío por incidencia
- `transport.build_soap(..., incidencia=True)` incorpora `Cabecera / RemisionVoluntaria / Incidencia = S`.
- La primera implementación colocó `Incidencia` directamente bajo `Cabecera` y FALLÓ XSD.
- Se corrigió en origen a `RemisionVoluntaria / Incidencia`.
- XSD oficial AEAT: PASS.

### 2.2 · Anulación
- Módulo aislado `backend/fiscal_ops.py`.
- El original no se modifica.
- Genera `RegistroAnulacion` relacionado.
- Algoritmo de huella de anulación reproducido contra vector oficial AEAT.
- Vector esperado y obtenido: `177547C0D57AC74748561D054A9CEC14B4C4EA23D1BEFD6F2E69E3A388F90C68`.
- XSD oficial AEAT: PASS.

### 2.3 · Subsanación
- Genera un nuevo `RegistroAlta` con `Subsanacion = S`.
- Mantiene identidad de la factura que se subsana y conserva el original para auditoría.
- Admite `RechazoPrevio` cuando proceda en la construcción aislada.
- XSD oficial AEAT: PASS.

### 2.4 · Cola de reintentos
- Módulo `backend/retry_queue.py`.
- Selección por `eligible_at`.
- Orden determinista.
- Deduplicación por hash de petición.
- Probado automáticamente.

### 2.5 · Contrato TPV → API fiscal
- Módulo `backend/tpv_contract.py`.
- Solo acepta copia de ticket cerrado.
- Verifica referencia, fecha de cierre, líneas fiscales y coherencia de total.
- Declara `CLOSED_TICKET_COPY_ONLY`.
- Declara `allowFiscalEngineToModifyCommercialTicket = False`.
- NO está conectado al TPV protegido.

### 2.6 · Readiness de preproducción
- Módulo `backend/readiness.py`.
- Distingue preparación técnica de LAB de preparación real de preproducción.
- Con los bloques internos probados puede devolver `labTechnicalReady = true`.
- No puede devolver preparación real mientras existan bloqueos externos.

## Evidencia automática

Workflow backend tras crear 2.1–2.6:
- run `34720710372`
- resultado: success
- salida: `12 passed`

Workflow backend tras corregir Incidencia 2.1.1:
- run `34720873528`
- job `backend-tests`
- resultado: success

Workflow XSD ampliado:
- run `34720895170`
- job `validate-xsd`
- resultado: success
- `XSD_RESULT=PASS` para alta previa
- `XSD_INCIDENCIA_ALTA=PASS`
- `XSD_ANULACION=PASS`
- `XSD_SUBSANACION=PASS`
- `XSD_ROADMAP_21_23=PASS`

## Bloqueos que permanecen abiertos

1. Backend fiscal persistente desplegado con conservación real: PENDIENTE.
2. Certificado cliente válido configurado fuera del repositorio: PENDIENTE.
3. Respuesta real del entorno AEAT de preproducción: PENDIENTE.
4. Identidad definitiva del producto / declaración responsable / revisión final de conformidad: PENDIENTE.

## Límites

- No se realizó ninguna remisión real a AEAT en estas pruebas.
- GitHub Actions usa almacenamiento temporal y no equivale a conservación fiscal desplegada.
- Los módulos 2.2–2.6 están aislados; no se han conectado al TPV protegido.
- El TPV protegido y el prototipo fiscal 1.3.1 permanecen sin modificar.
- Autovalidación no equivale a validación independiente.

Resultado: APROBADA para el alcance técnico de LAB descrito. NO APROBADA como declaración de sistema VERI*FACTU operativo/conforme.
