# SINCRONIAIA · TPV ALIMENTACIÓN
## MAESTRO PRINCIPAL
**Fecha de estado:** 16/09/2026  
**Estado:** TPV principal operativo y validado por bloques  
**Principio rector:** EVIDENCIA ANTES QUE AFIRMACIÓN

---

## REGLA ABSOLUTA · CENTRO DE CONTROL

El **Centro de Control de SINCRONIAIA es el índice maestro completo**.

Esta regla es permanente y prevalece sobre cualquier actualización futura:

1. **Nunca se debe perder contenido anterior del Centro de Control.**
2. Las actualizaciones deben **añadir y actualizar**, no sustituir ni recortar el inventario maestro.
3. Un elemento anterior solo puede salir del bloque principal si queda expresamente clasificado como **HISTÓRICO**, **RETIRADO**, **SUSTITUIDO** o equivalente, conservando su trazabilidad.
4. El Centro debe mantener accesos, estados, fechas, evidencias, históricos, pendientes y referencias maestras de todos los módulos conocidos.
5. Cada actualización debe indicar la **fecha de estado**.
6. No se debe convertir el Centro de Control en un resumen parcial de un único proyecto.
7. Antes de publicar una nueva versión del Centro se debe comprobar que los bloques existentes siguen presentes o han sido reclasificados de forma explícita.
8. Si se añade un módulo nuevo, se incorpora sin borrar los anteriores.
9. Si cambia la ruta principal de un módulo, la anterior se conserva como referencia histórica/protegida cuando corresponda.
10. El Centro de Control funciona como **índice maestro completo de SINCRONIAIA**, no como página temporal de trabajo.

**Regla operativa corta:**

> ACTUALIZAR = CONSERVAR + AÑADIR + RECLASIFICAR CUANDO PROCEDA. NUNCA BORRAR CONTEXTO MAESTRO SIN TRAZABILIDAD.

---

## 1. TPV PRINCIPAL

**Enlace principal actual:**

https://felixganes-svg.github.io/sincroniaia-demo/tpv-alimentacion-fusion-lab-v1/

**Carpeta principal:**

`tpv-alimentacion-fusion-lab-v1/`

Decisión: se mantiene esta carpeta tal como está.  
No se renombra, no se mueve y no se crean nuevas variantes LAB innecesarias.

Aunque el nombre interno conserve `lab`, desde este momento esta carpeta se considera el **TPV PRINCIPAL DE REFERENCIA**.

---

## 2. RESPALDO PROTEGIDO

Existe un respaldo independiente del punto validado:

**Rama GitHub:**

`respaldo-tpv-fusion-validado-2026-09-16`

**Commit de referencia validado:**

`00262939023f828073c769fc8d6235283d95c9ed`

Regla: antes de cualquier cambio importante debe existir un respaldo recuperable.

---

## 3. VERSIONES QUE NO DEBEN USARSE COMO PRINCIPAL

### MASTER CANDIDATE v1
Carpeta:

`tpv-alimentacion-master-candidate-v1/`

Estado: **NO USAR COMO TPV PRINCIPAL**.

Motivo: al probarla apareció:

> MASTER CANDIDATE  
> No se ha podido cargar la base.  
> Error: No se pudo cargar la base

Por tanto, esta carpeta no sustituye al TPV principal.

### Versiones A y B anteriores
Se conservan únicamente como referencias históricas.  
No deben volver a convertirse en el TPV operativo salvo recuperación justificada.

---

## 4. BLOQUES VALIDADOS FUNCIONALMENTE

### Acceso y seguridad
- Acceso Empresa correcto.
- Código Empresa incorrecto bloqueado.
- Campo de código se limpia cuando corresponde.
- Cambio de Código Empresa validado.
- Vendedor correcto entra.
- PIN incorrecto bloqueado.
- Vendedor deshabilitado no entra.
- Bloqueo Empresa tras 5 intentos incorrectos: **2 minutos**.
- Bloqueo individual de vendedor tras 5 intentos incorrectos: **15 segundos**.
- Sesión Empresa se cierra tras **5 minutos de inactividad**.
- Mensaje real observado: `Sesión Empresa cerrada por 5 minutos de inactividad.`

### Mi actividad
- Acceso por vendedor validado.
- PIN correcto abre.
- PIN incorrecto bloquea.
- Venta neta personal y rectificaciones coherentes con tickets.

### Rectificación de tickets
- Rectificación positiva validada.
- Rectificación negativa/devolución validada.
- Cantidad vacía bloqueada.
- Cantidad 0 permitida para devolución completa.
- Precio vacío bloqueado.
- Relación con ticket original conservada.

Ejemplos reales validados:
- R-0057: diferencia a cobrar de **3,23 €**.
- R-0060: devolución de **6,10 €**.

### Venta abierta
- Corrección parcial por unidades/kg.
- Eliminación completa de línea.
- Motivo y trazabilidad.
- Resultado reflejado en ticket.

### X / Z
- Consulta X por fechas validada.
- Rectificaciones positivas y negativas incluidas en los importes.
- Coherencia comprobada con tickets.

### Encargos
Flujo validado previamente:
- Crear encargo.
- Preparar.
- Líneas pendientes/preparadas.
- Precio congelado al preparar.
- Completar.
- Compra adicional.
- Cobrar.
- Recoger.
- Cerrar.

### Catálogo y artículos
- Edición rápida de artículo validada.
- Acceso Empresa para editar.
- Guardado de cambios validado.
- Persistencia conectada a IndexedDB.

### Ticket 58 mm / Fun Print
- Formato 58 mm desarrollado.
- Pruebas reales en papel efectuadas.
- Correspondencia visual PNG/papel validada.
- Ticket con correcciones/anulaciones probado.
- Ticket con mezcla kg/unidades probado.
- Total/cambio probado.

---

## 5. PERSISTENCIA

La base utiliza IndexedDB (`pilotDb`) para el estado persistente.

El snapshot incluye:
- empresa,
- vendedores,
- artículos,
- tickets,
- cierres Z,
- memorias de vendedores,
- subsecciones personalizadas,
- encargos.

Estado técnico:
**VERIFICADO EN CÓDIGO Y CONECTADO AL FLUJO SAVE/RESTORE.**

Esto no debe confundirse con una base de datos remota multi-dispositivo.

---

## 6. REGLAS DE TRABAJO DESDE AHORA

1. **No crear nuevas carpetas LAB por defecto.**
2. El enlace principal debe mantenerse estable.
3. Antes de un cambio importante: respaldo.
4. Cambios pequeños y aislados.
5. Después de cada cambio: prueba directa del punto modificado.
6. Si falla: recuperar desde respaldo o corregir únicamente el bloque afectado.
7. No declarar una función como validada sin evidencia.
8. No convertir un experimento en principal sin prueba real.
9. Mantener una única función propietaria por bloque cuando se consolide código.
10. El usuario debe tener siempre claro cuál es el enlace principal.
11. **El Centro de Control debe conservar siempre el índice maestro completo sin perder contenido previo.**

---

## 7. FLUJO PRINCIPAL DE VENTA

Flujo objetivo:

**Sección → subsección → artículo → peso/unidades → vendedor → menú principal**

Criterios:
- simplicidad táctil,
- no mostrar el ticket acumulado durante la compra,
- subtotal solo cuando se solicita,
- cobro por Efectivo / Tarjeta / Bizum / Mixto,
- cambio automático en efectivo,
- vendedor identificado,
- correcciones protegidas,
- encargado/Empresa para operaciones sensibles.

---

## 8. ESTRUCTURA DEL TPV

### Menú principal
- Carnicería
- Charcutería
- Elaborados / Preparados
- Código / venta rápida

### Empresa
Incluye, entre otros:
- vendedores,
- artículos,
- precios,
- secciones/subsecciones,
- tickets,
- informes X/Z,
- encargos,
- configuración,
- seguridad.

---

## 9. ESTADO ACTUAL

El TPV que debe abrirse y utilizarse como referencia es:

https://felixganes-svg.github.io/sincroniaia-demo/tpv-alimentacion-fusion-lab-v1/

**No usar el MASTER CANDIDATE.**

El TPV principal se mantiene sin renombrar para no introducir riesgo innecesario.

---

## 10. SIGUIENTE CRITERIO DE EVOLUCIÓN

A partir de este Maestro:

- no se reinicia el proyecto,
- no se repiten pruebas ya cerradas salvo que un cambio pueda afectarlas,
- se modifica únicamente lo necesario,
- cada nueva función debe quedar registrada aquí,
- cada incidencia debe indicar: síntoma, causa encontrada, corrección, prueba y resultado,
- el Centro de Control se actualiza sin perder nunca el inventario maestro anterior.

---

## 11. SELLADO DEL ESTADO

**TPV PRINCIPAL:** `tpv-alimentacion-fusion-lab-v1/`  
**RESPALDO PROTEGIDO:** `respaldo-tpv-fusion-validado-2026-09-16`  
**MASTER CANDIDATE v1:** no operativo / no principal  
**Fecha:** 16/09/2026

Este documento pasa a ser el **Maestro de continuidad del TPV Alimentación de SINCRONIAIA**.
