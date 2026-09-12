# SINCRONIAIA FISCAL · VERI*FACTU DESARROLLO 1.4 · VALIDACIÓN

Fecha: 12/09/2026
Tipo: VALIDACIÓN FUNCIONAL POR USUARIO EN NAVEGADOR REAL
Entorno: DEMO/LAB AISLADA · NO PRODUCCIÓN
Ruta: `/verifactu-lab-desarrollo/`
Prototipo protegido: `/verifactu-lab/` · NO MODIFICADO

## Resultado

APROBADA FUNCIONALMENTE PARA EL ALCANCE DE DESARROLLO 1.4.

NO equivale a conformidad VERI*FACTU completa, validación XSD oficial, persistencia fiscal robusta ni comunicación AEAT.

## Pruebas realizadas y evidencia comunicada por usuario

1. Vector oficial de huella AEAT:
   - Resultado visible: `COINCIDE CON VECTOR AEAT`.
   - Huella calculada: `3C464DAF61ACB827C65FDA19F352A4E3BDC2C640E9E9FC4CC058073F38F12F60`.
   - Huella esperada: idéntica.
   - Resultado: APROBADA.

2. Alteración sobre copia:
   - Resultado visible: `ALTERACIÓN DETECTADA`.
   - No altera el vector original.
   - Resultado: APROBADA.

3. Numeración fiscal DEMO consumible:
   - Emitidos consecutivamente `VF-LAB-D-000001` y `VF-LAB-D-000002`.
   - Siguiente número mostrado: `VF-LAB-D-000003`.
   - Contador consumido: 2.
   - Resultado: APROBADA EN MEMORIA DE SESIÓN.

4. Verificación automática de cadena:
   - Antes del segundo registro aparece `ANTERIOR VERIFICADO AUTOMÁTICAMENTE`.
   - La segunda huella referencia la huella del primer registro.
   - Resultado: APROBADA FUNCIONALMENTE EN LAB.

5. Bloqueo de reutilización:
   - Intento sobre `VF-LAB-D-000002` bloqueado.
   - Texto visible: `REUTILIZACIÓN BLOQUEADA · VF-LAB-D-000002 YA CONSUMIDO`.
   - Resultado: APROBADA EN SESIÓN DEMO.

6. Histórico inmutable de sesión:
   - Dos registros visibles como `EMITIDO · BLOQUEADO`.
   - Las huellas quedan asociadas a cada número emitido.
   - Resultado: APROBADA PARA MEMORIA DE SESIÓN.

7. Regresión IVA 10% / 4%:
   - IVA 10%: base 15,41 €, cuota 1,54 €, total 16,95 €.
   - IVA 4%: base 5,29 €, cuota 0,21 €, total 5,50 €.
   - Totales: base 20,70 €, cuota 1,75 €, total 22,45 €.
   - Resultado visible: `DESGLOSE CORRECTO`.
   - Resultado: APROBADA.

8. Bloque `SistemaInformatico` DEMO:
   - Se genera previsualización XML con `NombreRazon`, `NIF`, `NombreSistemaInformatico`, `IdSistemaInformatico`, `Version`, `NumeroInstalacion`, `TipoUsoPosibleSoloVerifactu`, `TipoUsoPosibleMultiOT` e `IndicadorMultiplesOT`.
   - Estado visible: `PREVISUALIZACIÓN DEMO GENERADA · PENDIENTE XSD`.
   - Resultado: APROBADA COMO PREVISUALIZACIÓN, NO COMO ESTRUCTURA XSD VALIDADA.

## Pendientes que bloquean cierre fiscal

- Validación contra XSD oficial AEAT.
- Sustitución de identidad SIF DEMO por identidad definitiva.
- Persistencia fiscal robusta / append-only fuera de memoria de navegador.
- Gestión de reinicio de sesión sin pérdida de numeración ni cadena.
- Comunicación AEAT, respuestas, errores y reintentos.
- Casos de anulación, subsanación y rectificación.
- Sellado completo y revisión externa cuando sea posible.

## Clasificación

CRÍTICOS: ninguno detectado dentro del alcance funcional probado de 1.4.

RELEVANTES pendientes para conformidad fiscal: persistencia robusta, XSD oficial, identidad SIF definitiva, comunicación AEAT.

Resultado final: **APROBADA FUNCIONALMENTE EN LAB 1.4 · NO APROBADA TODAVÍA COMO SISTEMA VERI*FACTU CONFORME/OPERATIVO.**
