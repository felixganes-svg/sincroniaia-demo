# SINCRONIAIA FISCAL · VERI*FACTU DESARROLLO 1.6.1 · VALIDACIÓN

Fecha: 12/09/2026
Tipo: VALIDACIÓN FUNCIONAL EN LAB AISLADA
Responsable de prueba real: usuario/responsable del proyecto
Estado: APROBADA FUNCIONALMENTE PARA EL ALCANCE 1.6.1

## Alcance validado

- Recuperación de 12 registros desde IndexedDB DEMO.
- Cadena recuperada: CORRECTA.
- Siguiente número conservado: VF-LAB-D-000013.
- Último registro fiscal recuperado: VF-LAB-D-000012.
- Registro anterior usado en XML: VF-LAB-D-000011.
- XML SOAP generado con Envelope, RegFactuSistemaFacturacion, Cabecera, RegistroFactura y RegistroAlta.
- Namespaces principales presentes.
- Desglose IVA 10% / 4% conservado en XML.
- Encadenamiento XML coherente con histórico.
- SistemaInformatico incluido con datos DEMO.
- FechaHoraHusoGenRegistro, TipoHuella y Huella incluidos.
- Corrección 1.6.1 comprobada: la prevalidación compara la Huella final de RegistroAlta y no la Huella de RegistroAnterior.
- Resultado de prevalidación: PREVALIDACIÓN ESTRUCTURAL CORRECTA.
- Huella final de RegistroAlta coincide con el registro persistido.

## Evidencia observada

Último registro:
- NumSerieFactura: VF-LAB-D-000012
- Huella: 3FB10634D5D8719731E118C953CED1EC4F8A2D4547E05E7314F12EA48E5756BB

Registro anterior:
- NumSerieFactura: VF-LAB-D-000011
- Huella: B910BBFD4947921A62109B20E1342660F82CA278197903347CAE24A39D0541CE

Resultado mostrado por la LAB:
- PREVALIDACIÓN ESTRUCTURAL CORRECTA
- XML bien formado
- namespaces principales correctos
- jerarquía principal presente
- campos usados en la prueba presentes
- encadenamiento coherente con histórico
- SistemaInformatico completo
- Huella final de RegistroAlta coincide con el registro persistido

## Limitaciones y bloqueos pendientes

NO se considera validado todavía:
- validación contra los XSD oficiales de AEAT;
- conformidad completa del XML con todos los tipos/restricciones XSD;
- comunicación con servicios AEAT;
- autenticación/certificados;
- respuestas AEAT;
- reintentos;
- persistencia fiscal robusta de servidor;
- identidad SIF definitiva;
- declaración responsable;
- integración con el TPV protegido.

IndexedDB sigue siendo DEMO local y no almacenamiento fiscal robusto definitivo.

## Clasificación de errores

CRÍTICOS: ninguno observado en esta prueba.
RELEVANTES: ninguno observado en el alcance 1.6.1.
MENORES: ninguno bloqueante observado.

## Resultado

APROBADA FUNCIONALMENTE COMO LAB 1.6.1 PARA GENERACIÓN SOAP/XML Y PREVALIDACIÓN ESTRUCTURAL LOCAL.

NO APROBADA como VERI*FACTU operativo/conforme.
NO APROBADA todavía para cierre de FASE 4 hasta ejecutar validación XSD oficial.

Principio aplicado: EVIDENCIA ANTES QUE AFIRMACIÓN.
