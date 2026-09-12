# SINCRONIAIA · VERI*FACTU · MASTER DE MÓDULO

Fecha de inicio: 12/09/2026
Estado: VIGENTE PARA DESARROLLO
Naturaleza: DEMO/LAB AISLADA · NO PRODUCCIÓN
Autoridad superior: `MAESTRO/SINCRONIAIA_MASTER.md`

## 1. Regla de aislamiento absoluto

El TPV Alimentación actual queda FIJADO y protegido.

Ruta actual protegida:
`https://felixganes-svg.github.io/sincroniaia-demo/tpv-alimentacion-lab-verificado-20260908-cerrar/`

Toda evolución relacionada con VERI*FACTU se desarrollará en una ruta, archivos y almacenamiento independientes.

Queda prohibido durante la fase LAB:
- modificar la ruta protegida del TPV para experimentar;
- reutilizar sus claves de almacenamiento para el laboratorio fiscal;
- introducir scripts fiscales directamente en la versión protegida;
- alterar tickets históricos reales;
- declarar el TPV como VERI*FACTU, conforme, certificado u homologado sin evidencia suficiente.

## 2. Objetivo del LAB

Construir y validar una capa fiscal separada capaz de recibir una copia inmutable de un ticket cerrado del TPV y transformarla progresivamente en un registro fiscal trazable.

El flujo objetivo del laboratorio será:

`Ticket cerrado de prueba -> Registro fiscal -> Encadenamiento/hash -> QR fiscal -> estructura AEAT -> envío/prueba -> respuesta -> trazabilidad`

Cada etapa se implementará y validará por separado.

## 3. Lo que ya existe y se protege

Del TPV actual se toman como referencia funcional, sin modificar su implementación:
- numeración de tickets;
- fecha y hora;
- líneas de venta;
- peso/unidades;
- precios;
- totales;
- vendedor;
- forma de pago;
- tickets cerrados no editables desde el flujo normal;
- rectificación separada;
- histórico de tickets;
- encargos y compra adicional;
- X/Z y caja como funciones comerciales independientes de la capa fiscal.

## 4. Lo que NO existe todavía

No se considera implementado hasta que exista evidencia de código + prueba:
- registro fiscal canónico separado;
- almacenamiento fiscal robusto;
- inmutabilidad verificable;
- hash/huella fiscal;
- encadenamiento entre registros;
- QR fiscal válido;
- estructura conforme a especificaciones AEAT;
- comunicación con servicios AEAT;
- gestión de respuestas;
- reintentos;
- trazabilidad técnica completa;
- documentación de conformidad;
- declaración responsable del software.

## 5. Fuente de verdad del LAB

El LAB fiscal no usará el localStorage del TPV protegido como fuente de verdad.

Arquitectura objetivo:
- interfaz LAB separada;
- API separada;
- base de datos separada;
- registro fiscal append-only / inmutable por diseño;
- localStorage, si se usa, solo para estado de interfaz o caché no fiscal.

Hasta que exista backend real, cualquier persistencia local del LAB se marcará expresamente como DEMO y no como almacenamiento fiscal válido.

## 6. Identidad y numeración

Los tickets comerciales del TPV y los registros fiscales son entidades distintas pero relacionadas.

Cada registro fiscal deberá conservar al menos:
- identificador interno único;
- referencia al ticket comercial origen;
- serie/número fiscal cuando corresponda;
- fecha/hora de generación;
- datos del emisor configurados en LAB;
- datos del receptor cuando proceda;
- detalle fiscal de líneas;
- bases imponibles;
- tipos y cuotas tributarias;
- total;
- referencia al registro anterior cuando proceda;
- huella/hash;
- estado de envío;
- respuesta recibida;
- historial de eventos.

## 7. Inmutabilidad

Una vez creado un registro fiscal definitivo en el LAB:
- no se sobrescribe;
- no se edita silenciosamente;
- no se elimina desde interfaz normal;
- cualquier corrección genera un nuevo evento/registro relacionado;
- el original permanece disponible para auditoría.

## 8. Rectificaciones

La lógica de rectificación seguirá el principio ya aplicado en el TPV: el original no se modifica.

El LAB fiscal deberá modelar por separado:
- registro original;
- registro rectificativo;
- relación entre ambos;
- motivo;
- fecha/hora;
- estado fiscal independiente.

No se dará por válida esta parte hasta comprobarla con casos reales de prueba.

## 9. Estados del registro fiscal

Estados internos previstos para LAB:
- BORRADOR
- GENERADO
- PENDIENTE_ENVIO
- ENVIADO
- ACEPTADO
- ACEPTADO_CON_INCIDENCIA
- RECHAZADO
- REINTENTO_PENDIENTE
- RECTIFICADO

Estos nombres son internos y pueden adaptarse al comportamiento real de AEAT durante la implementación.

## 10. Regla de evidencia

No se marcará una capacidad como HECHA por estar escrita en documentación.

Para cada capacidad se exige:
1. código localizado;
2. prueba reproducible;
3. evidencia del resultado;
4. ausencia de regresión en el LAB;
5. registro en validación.

## 11. Fases autorizadas

### FASE 0 · Gobierno
- crear MASTER del módulo;
- fijar TPV protegido;
- fijar nombre/ruta del LAB;
- definir límites.

### FASE 1 · Registro fiscal local de prueba
- introducir ticket de prueba manual/copiado;
- generar objeto fiscal canónico;
- bloquear edición del registro generado;
- mostrar trazabilidad básica.

### FASE 2 · Encadenamiento
- definir canonicalización;
- generar hash;
- referenciar huella anterior;
- verificar cadena;
- detectar alteraciones.

### FASE 3 · QR y representación
- construir los datos requeridos;
- generar QR;
- integrarlo en representación de ticket LAB;
- validar formato.

### FASE 4 · Esquema / estructura AEAT
- mapear campos del ticket a especificación;
- validar tipos y obligatoriedad;
- generar estructura técnica conforme a documentación vigente.

### FASE 5 · Comunicación
- integrar servicio AEAT de pruebas/producción cuando corresponda;
- gestionar autenticación/certificados si son necesarios;
- envío;
- respuesta;
- reintentos;
- incidencias.

### FASE 6 · Integración controlada con TPV
Solo después de sellar el LAB fiscal:
- conectar mediante interfaz/API definida;
- enviar copia del ticket cerrado;
- nunca permitir que el motor fiscal modifique el ticket comercial ya cerrado.

### FASE 7 · Sellado
- pruebas desde cero;
- casos normales;
- errores;
- desconexión;
- reintentos;
- rectificaciones;
- persistencia;
- auditoría;
- móvil;
- revisión externa cuando sea posible.

## 12. Ruta del nuevo LAB

Nombre reservado:
`SINCRONIAIA FISCAL · VERI*FACTU LAB 1.0`

Ruta reservada:
`/verifactu-lab/`

La ruta se considerará creada únicamente cuando exista en repositorio y GitHub Pages publique correctamente.

## 13. Datos de prueba

Durante el desarrollo se usarán exclusivamente:
- tickets ficticios;
- copias anonimizadas;
- ejemplos expresamente autorizados.

No se utilizarán datos personales/fiscales reales de clientes para pruebas abiertas en GitHub Pages.

## 14. Criterio de promoción

El LAB no puede integrarse en el TPV protegido hasta superar:
- checklist de sellado;
- pruebas desde cero;
- verificación de persistencia;
- verificación de inmutabilidad;
- verificación de encadenamiento;
- validación técnica contra documentación oficial vigente;
- revisión de textos comerciales para evitar afirmaciones no demostradas.

## 15. Estado inicial

A 12/09/2026:
- TPV actual: FIJADO / PROTEGIDO.
- VERI*FACTU: NO IMPLEMENTADO.
- VERI*FACTU LAB: AUTORIZADO PARA CREARSE.
- Primera tarea técnica autorizada: crear LAB vacío/diagnóstico y definir el modelo canónico de registro fiscal con un ticket ficticio.
