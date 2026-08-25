# SINCRONIAIA · CLASIFICACIÓN MAESTRA

Actualizado: 25/08/2026 · 14:11 Europe/Madrid

## Regla desde ahora
- **ACTUAL / OPERATIVO** = funciona hoy y es la referencia recomendada.
- **MASTER CONSOLIDADO** = versión única validada en uso real. No se modifica salvo incidencia concreta o mejora planificada.
- **PENDIENTE / LAB / INTERNO** = existe, pero no se presenta como operativo.
- **HISTÓRICO / RETIRADO** = no usar.
- Una sola versión operativa por proyecto. No crear cadenas de parches ni nuevas rutas por cada corrección.

# ACTUAL · OPERATIVO

## Base
- `/` — Portal público SINCRONIAIA.
- `/investigacion/` — Investigación de Campo.
- `/centro-control/` — Centro de Control.

## Demos sectoriales
- `/can-soler/` — Can Soler consolidada.
- `/prueba-ascensores-v1/` — Ascensores validada.
- `/sincronia-animal/` — SINCRONIA Animal consolidada desde v0.4.2(2).

## Todo Bueno
- `/todo-bueno/` — Cliente · BASE ESTABLE v1.1.
- `/todo-bueno/control-horario/` — Control Horario estable del piloto.

## Control Horario
- `/control-horario-personal/` — **MASTER CONSOLIDADO · OPERATIVO**. Validado en uso real el 25/08/2026: carga correcta en móvil, GPS correcto, recuperación del estado de jornada, entrada de las 07:30 reconocida y fichaje de salida completado correctamente. Ruta canónica única. No modificar salvo incidencia concreta o mejora planificada.
- `/control-horario-versiones/` — Planes Básica / Intermedia / Premium.
- `/control-horario-calculadora/` — Calculadora comercial.

# ACTUAL INTERNO
- Google Sheet `SINCRONIAIA — CONTROL HORARIO — TODO BUENO PILOTO` · ID `1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc` — fuente de datos activa del piloto de fichaje.
- Apps Script `TODO_BUENO_CONTROL_HORARIO_v0.1` — backend interno del piloto de fichaje.
- Google Sheet `SINCRONIAIA - Respuestas de negocios` · ID `1MRcROiaKrFQtAr-AJaCNQnET51gIqN4dEoLbRqm4oOo` — captación/seguimiento.
- Apps Script `SINCRONIAIA — CONTROL DE CAPTACIÓN` — backend administrativo de captación.

# DOCUMENTACIÓN MAESTRA INTERNA
- `Arquitectura de Interfaz y Método SINCRONIAIA LABS` v2.0.
- `MODELO_DE_NEGOCIO.md v1.2.0`.
- `GUIA_UI.md V2` / contenido v1.1.0 aprobado.
- `FASE_C_1_1_MODELO_CANONICO_DE_CAPTACION`.

# PENDIENTE / NO OPERATIVO AÚN

## Todo Bueno · pedidos centralizados
- `/todo-bueno/conectada/` y `/todo-bueno/empresa/` funcionan como demostración local en el mismo navegador, pero **no se consideran operativas como producto**.
- La hoja `TODO BUENO · PEDIDOS` · ID `16pjTrjPcgy1oeFUjENA9Qiv9QWcZi_8z1Nx1SCHxSKE` existe, pero no se ha localizado/gestionado un Apps Script central de pedidos que conecte cliente y empresa desde dispositivos distintos.
- No marcar ACTUAL hasta disponer de backend central probado.

## Gestión Laboral
- `/gestion-laboral-lab/` — LAB. Horarios, ausencias, saldo y compensaciones; BOE/convenio no conectado.
- `/calculadora-gestion-laboral/` — calculadora comercial.

## Copiloto Comercial
- v1.3.4 — herramienta interna conectada. No publicar en GitHub Pages mientras no exista acceso protegido.

## TPV / Caja
- `tpv_con monedas.html` — módulo de caja/arqueo útil, pero no TPV completo.

## Otros
- Omuro / Yamaha — sin entregable canónico validado.
- Simulador Comercial v2.1 — sin ruta pública maestra consolidada.
- Gestoría Copiloto v0.1 — prueba temprana.

# RETIRADO / HISTÓRICO
- `/control-horario-felix/` — retirado por haber expuesto una credencial en una versión antigua. La página ya no contiene la aplicación.
- `/control-horario-felix-v065/` — histórico de compatibilidad. No usar como referencia.
- `/control-horario-felix-v064/`, `/control-horario/felix/`, `/control-horario-prueba/` y versiones personales anteriores — histórico.
- `/prueba-can-soler-v1/` — sustituida por `/can-soler/`.
- Versiones anteriores de Todo Bueno, SINCRONIA Animal, Copiloto, Simulador, Bienestar y voz — histórico/trazabilidad.
- `TPV.html` y `TPV_Con_Arqueo.html` — históricos frente a `tpv_con monedas.html`.

# SEGURIDAD OBLIGATORIA
1. GitHub Pages es público: nunca incluir claves, tokens, contraseñas o secretos en HTML/JS.
2. Una credencial publicada se considera comprometida aunque después se retire; debe rotarse.
3. La credencial del backend antiguo de Control Horario sigue pendiente de rotación porque no hay una acción segura disponible desde las conexiones actuales para modificar ese Apps Script.
4. No publicar herramientas administrativas internas sin acceso protegido.
5. ACTUAL nunca significa “demo que parece funcionar”; significa operativo de extremo a extremo para su alcance declarado.
6. Un MASTER CONSOLIDADO validado no se modifica por estética ni por crear otra versión: solo por incidencia real o mejora planificada.

# SIGUIENTE BLOQUE DE TRABAJO
1. Crear/conectar backend central real para `TODO BUENO · PEDIDOS` y probar cliente → hoja → panel empresa desde dispositivos distintos.
2. Dar acceso interno protegido al Copiloto Comercial v1.3.4.
3. Terminar Gestión Laboral solo cuando la parte normativa esté claramente separada o conectada a fuente oficial.
4. Consolidar TPV completo antes de publicarlo.
5. Rotar la credencial antigua de Control Horario cuando exista acceso de edición seguro al Apps Script.
