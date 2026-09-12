# SINCRONIAIA FISCAL · VERI*FACTU DESARROLLO 1.5 · VALIDACIÓN

Fecha: 12/09/2026
Tipo: PRUEBA REAL DE USUARIO · LAB AISLADA
Resultado: APROBADA FUNCIONALMENTE PARA PERSISTENCIA LOCAL DEMO

## Alcance validado

- IndexedDB local separada del TPV protegida.
- Recuperación tras recarga/cierre de la página.
- Recuperación inicial observada: 2 registros.
- Cadena recuperada verificada correctamente.
- Numeración fiscal continuada sin reinicio.
- Tras recuperación, se continuó emitiendo desde VF-LAB-D-000003 hasta VF-LAB-D-000007.
- Próximo número observado: VF-LAB-D-000008.
- Bloqueo de reutilización del último número consumido.
- Verificación automática del registro anterior antes de nuevas emisiones.
- Persistencia local de registro + contador mediante transacción IndexedDB.
- Reproducción correcta del vector oficial AEAT SHA-256.
- Detección de alteración sobre copia.
- Regresión IVA 10% / 4% correcta.
- Bloque SistemaInformatico DEMO generado.

## Evidencia funcional aportada por usuario

- Registros recuperados: 2.
- Cadena recuperada: VERIFICADA · COINCIDE CON MEMORIA.
- Histórico visible y encadenado desde VF-LAB-D-000001 hasta VF-LAB-D-000007.
- Última huella observada: 7C197FD8B5329A9B59C0BC1CE2204CD151293A02ACD38662FC2B557B89DDAA76.
- Próximo número recuperado/activo al final de la prueba: VF-LAB-D-000008.
- Reutilización de VF-LAB-D-000007 bloqueada.

## Límites explícitos

Esta validación NO acredita todavía:

- almacenamiento fiscal robusto definitivo;
- persistencia de servidor;
- conservación legal/fiscal;
- base de datos append-only de servidor;
- validación XSD completa;
- identidad SIF definitiva;
- comunicación AEAT;
- gestión de respuestas/reintentos;
- conformidad VERI*FACTU;
- declaración responsable del software.

IndexedDB sigue siendo almacenamiento local del navegador y puede ser eliminado externamente. Por tanto, esta versión queda APROBADA solo como prueba funcional de recuperación/persistencia local DEMO.

## Estado de versiones protegidas

- Prototipo 1.3.1: CONGELADO · no modificado.
- TPV Alimentación protegido: no modificado.
- Desarrollo activo: verifactu-lab-desarrollo/.

## Conclusión

APROBADA FUNCIONALMENTE PARA PERSISTENCIA LOCAL DEMO.
NO APROBADA COMO PERSISTENCIA FISCAL ROBUSTA NI COMO VERI*FACTU OPERATIVO.
