# SINCRONIAIA FISCAL · VERI*FACTU LAB 1.0 · MODELO DE REGISTRO FISCAL

Fecha: 12/09/2026
Estado: FASE 1 · DEMO/LAB · NO PRODUCCIÓN
Autoridad: `MAESTRO/VERIFACTU_MASTER.md`

## Objetivo

Definir el primer objeto fiscal separado del ticket comercial.

No pretende ser todavía el esquema definitivo de AEAT. Sirve para fijar qué datos necesita conservar SINCRONIAIA antes de abordar hash, QR, estructura AEAT y comunicación.

## Entidades separadas

### Ticket comercial

Pertenece al TPV.

Contiene la operativa de venta, vendedor, líneas, cobro, encargos y demás lógica comercial.

### Registro fiscal

Es una entidad distinta y relacionada mediante `commercial_ticket_ref`.

Una vez generado de forma definitiva, no se sobrescribe ni se reutiliza como ticket comercial.

## Modelo canónico inicial

```json
{
  "lab_version": "1.0",
  "record_state": "GENERADO",
  "internal_id": "VF-LAB-000001",
  "commercial_ticket_ref": "DEMO-0023",
  "generated_at": "ISO-8601",
  "issuer": {
    "name": "EMPRESA DEMO SINCRONIAIA",
    "tax_id": "NIF-DEMO-NO-VALIDO"
  },
  "receiver": null,
  "invoice_type": "SIMPLIFICADA_DEMO",
  "lines": [
    {
      "description": "Artículo DEMO",
      "quantity": 1,
      "unit": "ud",
      "unit_price": 10.00,
      "gross_amount": 10.00,
      "tax_rate": null,
      "tax_base": null,
      "tax_amount": null
    }
  ],
  "totals": {
    "gross_total": 10.00,
    "tax_base": null,
    "tax_amount": null,
    "total": 10.00
  },
  "payment_method": "EFECTIVO",
  "previous_record_hash": null,
  "record_hash": null,
  "aeat": {
    "status": "NO_CONECTADO",
    "response": null
  }
}
```

## Campos ya fijados conceptualmente

- identificador interno único;
- referencia al ticket comercial origen;
- momento de generación;
- emisor;
- receptor cuando proceda;
- tipo de factura/registro;
- líneas;
- cantidades;
- precios;
- bases e IVA cuando se implementen;
- total;
- forma de pago como dato comercial relacionado;
- referencia al hash anterior;
- hash propio;
- estado AEAT;
- respuesta AEAT.

## Lo que esta FASE 1 NO valida

- tipos de IVA correctos;
- reglas de factura simplificada;
- campos obligatorios AEAT;
- canonicalización para hash;
- algoritmo/entrada exacta de huella;
- encadenamiento;
- QR;
- XML u otra estructura técnica AEAT;
- certificados/autenticación;
- envío;
- reintentos;
- almacenamiento fiscal definitivo.

## Criterio de salida de FASE 1

La FASE 1 podrá considerarse validada únicamente cuando:

1. la LAB exista publicada en ruta propia;
2. el ticket de ejemplo no dependa del TPV protegido;
3. se genere un registro fiscal separado;
4. el registro generado quede bloqueado frente a edición normal desde la UI;
5. quede visible una trazabilidad mínima;
6. el usuario pruebe el flujo real de la LAB;
7. no se afirme ninguna capacidad de fases posteriores.

## Siguiente fase autorizada tras validación

FASE 2 · Encadenamiento / hash:

- definir canonicalización;
- generar huella;
- enlazar con registro anterior;
- verificar la cadena;
- detectar una alteración provocada en una copia de prueba.
