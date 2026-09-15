# SINCRONIAIA · CLASIFICACIÓN MAESTRA

Actualizado: 15/09/2026

## Reglas de estado
- **ACTUAL / OPERATIVO** = funciona hoy dentro de su alcance declarado.
- **VERIFICADO EN CÓDIGO** = existe y está conectado en la implementación; no equivale a validación funcional real.
- **VALIDADO FUNCIONALMENTE** = recorrido probado y resultado confirmado.
- **VALIDADO EN HARDWARE** = comprobado además en el dispositivo físico implicado.
- **MASTER / STABLE** = versión consolidada, regresionada y sellada. No se modifica salvo incidencia concreta o mejora planificada.
- **PENDIENTE / LAB / INTERNO** = existe, pero no se presenta como producción final.
- **HISTÓRICO / RETIRADO** = no usar como referencia activa.

## Reglas maestras vigentes
1. **EVIDENCIA ANTES QUE AFIRMACIÓN.**
2. “No encontrado” no equivale a “no existe”: antes de negar una función hay que revisar el archivo fuente exacto responsable.
3. Una sola producción oficial por módulo.
4. Toda experimentación se hace en LAB aislado; no se toca una versión estable para probar.
5. Después de cada cambio relevante se repite la prueba desde cero.
6. No se encadenan parches indefinidamente. Si un fallo puede corregirse en origen, se corrige en origen.
7. Primero validar funciones; después consolidar; después regresión completa; después VALIDACION; solo entonces MASTER/STABLE.
8. Durante consolidación no se añaden funciones nuevas.
9. Una función debe tener un único dueño/implementación responsable en la versión consolidada.
10. Estado de sesión y permiso de acceso son conceptos distintos y no deben depender de una única variable.

# FOCO ACTUAL · TPV ALIMENTACIÓN / CARNICERÍA

## LAB FUSIÓN
- Ruta: `/tpv-alimentacion-fusion-lab-v1/`
- Estado: **LAB ACTUAL / NO MASTER**.
- Base funcional B protegida: `/tpv-alimentacion-lab-verificado-20260908-cerrar/`
- Referencia A equipada protegida: `/tpv-alimentacion-dibal-lab-v1-3-lab-xz-jornada-pinchitos/`
- Regla: B aporta el flujo base; A aporta mejoras seleccionadas una a una. A y B no se modifican durante la integración.

### Fases trabajadas
- FASE 0: base LAB aislada.
- FASE 1: X por fecha/rango.
- FASE 2: Z selectiva y protección contra doble cierre.
- FASE 3: catálogo/persistencia.
- FASE 4: vendedor VN.
- FASE 5: corrección de venta abierta con trazabilidad.
- FASE 6: ticket 58 mm / Fun Print, en cierre de validación.

### Ticket 58 mm
- Logo y dirección corregidos.
- Columnas PRECIO/TOTAL corregidas y verificadas visualmente el 15/09/2026.
- Corrección parcial con trazabilidad llegó a PNG y a impresión física.
- Pendiente: anulación completa de línea en ticket 58 mm + impresión física de esa anulación.

### Persistencia
- `base.html` contiene `pilotDb` con IndexedDB.
- Verificado en código: `indexedDB.open`, creación de objectStore, `put()` de snapshot, `get()` de estado y restauración al arrancar.
- Estado: **VERIFICADO EN CÓDIGO Y CONECTADO**.
- No afirmar por ello sincronización entre dispositivos ni backend central comercial.

### Seguridad PIN · estado en cuarentena
Riesgos verificados en código, pendientes de prueba funcional deliberada en móvil:
- PIN demo visibles en determinadas pantallas.
- alta de vendedor con PIN por defecto `0000`.
- sin límite de intentos / bloqueo temporal.
- sesión Empresa sin caducidad automática.
- `active` representa sesión/actividad, no revocación permanente de acceso.
- falta un estado separado tipo `enabled` / acceso revocado.
- seguridad completa del PIN: **NO VALIDADA todavía**.

### Arquitectura LAB
- Válida para integración y pruebas.
- No consolidada todavía: `base.html` + scripts de fase.
- Antes de MASTER: consolidar implementación, eliminar capas redundantes y repetir regresión completa.

# ORDEN AUTORIZADO DE TRABAJO TPV
1. Terminar FASE 6: anulación completa 58 mm + impresión física.
2. Ejecutar matriz de seguridad PIN en móvil.
3. FASE 7: regresión completa de ventas, vendedores, catálogo, Encargos, cobros, X/Z, persistencia, correcciones e impresión.
4. Congelar funciones nuevas.
5. Consolidar LAB FUSIÓN en una implementación limpia.
6. Repetir regresión desde cero.
7. Crear `VALIDACION_...md` con CRÍTICO / RELEVANTE / MENOR y APROBADA / NO APROBADA.
8. Solo si aprueba, promover a MASTER/STABLE.

# ACTUAL · OPERATIVO

## Base
- `/` — Portal público SINCRONIAIA.
- `/investigacion/` — Investigación de Campo.
- `/centro-control/` — Centro de Control.

## Demos sectoriales
- `/can-soler/` — Can Soler consolidada.
- `/prueba-ascensores-v1/` — Ascensores.
- `/sincronia-animal/` — SINCRONIA Animal.

## Todo Bueno
- `/todo-bueno/` — Cliente / demo panadería.
- `/todo-bueno/control-horario/` — Control Horario piloto; pendiente nuevo sellado antes de MASTER cliente.

## Control Horario
- `/control-horario-personal/` — **MASTER** personal protegido.
- `/demo-control-horario/` — demo genérica.
- `/control-horario-versiones/` — planes comerciales.
- `/control-horario-calculadora/` — calculadora comercial.

# PENDIENTE / NO OPERATIVO AÚN

## Todo Bueno · pedidos centralizados
- `/todo-bueno/conectada/` y `/todo-bueno/empresa/` siguen como demostración local.
- No marcar operativo entre dispositivos hasta backend central probado.

## Gestión Laboral
- `/gestion-laboral-lab/` — LAB.
- `/calculadora-gestion-laboral/` — calculadora asociada.

## Copiloto Comercial
- Interno. Pendiente acceso protegido y sellado.

## Encargos independiente
- `/encargos-lab/` — LAB aislada.
- MASTER 1.0 documental pendiente de cerrar E2E.

## Otros
- Simulador Comercial — pendiente ruta canónica vigente.
- Omuro / Yamaha — sin entregable canónico validado.
- Pruebas de voz — LAB, no producto canónico.

# RETIRADO / HISTÓRICO
- Versiones antiguas de Control Horario personal: no usar como referencia.
- `/prueba-can-soler-v1/` — histórica frente a `/can-soler/`.
- Versiones anteriores de TPV distintas de A, B y LAB FUSIÓN: histórico/trazabilidad salvo indicación expresa.
- Versiones antiguas de SINCRONIA Animal, Copiloto, Simulador, Bienestar y voz: histórico.

# SEGURIDAD OBLIGATORIA
1. GitHub Pages es público: nunca incluir secretos reales en HTML/JS.
2. Una credencial publicada se considera comprometida aunque después se retire.
3. No publicar herramientas administrativas internas sin protección.
4. ACTUAL nunca significa “parece funcionar”; significa operativo para el alcance declarado.
5. MASTER exige consolidación, regresión y evidencia de sellado.
6. Los PIN/códigos de demostración deben desaparecer antes de producción real.
7. La revocación de acceso de un vendedor debe ser distinta del simple cierre de sesión.
