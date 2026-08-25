# SINCRONIAIA · CLASIFICACIÓN MAESTRA

Actualizado: 25/08/2026 · 11:30 Europe/Madrid

## Regla de trabajo
- **ACTUAL** = referencia recomendada hoy.
- **REVISAR** = útil y ejecutable, pero aún no debe presentarse como versión definitiva.
- **DESARROLLO** = laboratorio, simulación o producto incompleto.
- **HISTÓRICO** = conservar únicamente para trazabilidad.
- Una sola referencia recomendada por proyecto. Antes de crear una nueva versión se comprueba primero esta clasificación.

# ACTUAL · ACCESOS RECOMENDADOS

## Base
- `/` — Portal público SINCRONIAIA. Integra Restaurante, Fisioterapia, Reformas y Bienestar Animal.
- `/investigacion/` — Investigación de Campo.
- `/centro-control/` — Centro de Control interno para decidir qué versión utilizar.

## Demos sectoriales
- `/can-soler/` — Can Soler consolidada. Pedido simulado, catálogo, puntos de venta, Hoy/Mañana/Otra fecha, modificación y finalización. Sustituye a `prueba-can-soler-v1`.
- `/prueba-ascensores-v1/` — Ascensores validada. Prioriza personas atrapadas, diferencia emergencia médica/humo/incendio, remite a 112 cuando procede y no inventa precios, técnicos en camino ni tiempos de llegada.
- `/sincronia-animal/` — SINCRONIA Animal, consolidada desde la última rama v0.4.2(2). Uno/varios/todos los animales, ficha reutilizable, necesidades, servicios, consentimiento e historial. Datos simulados.

## Todo Bueno
- `/todo-bueno/` — Cliente · BASE ESTABLE v1.1. Referencia actual.
- `/todo-bueno/conectada/` — Cliente conectado en modo demostración local. Guarda pedidos en el navegador para que puedan verse en el panel de empresa del mismo navegador.
- `/todo-bueno/empresa/` — Panel empresa/pedidos de demostración. Permite filtrar y cambiar estado Pendiente → Confirmado → Preparando → Listo → Entregado. No es todavía backend central multiusuario.
- `/todo-bueno/control-horario/` — Control Horario estable del piloto Todo Bueno.

## Control Horario
- `/control-horario-versiones/` — Planes Básica / Intermedia / Premium.
- `/control-horario-calculadora/` — Calculadora comercial.
- `/control-horario-felix-v065/` — acceso personal público recomendado por ahora. **Pendiente revisión de seguridad específica antes de declararlo definitivo.** Existe v0.6.6 posterior por archivo/email aún no consolidada.

# ACTUAL INTERNO · NO PRESENTAR COMO FRONTEND DE CLIENTE

- Google Sheet `SINCRONIAIA — CONTROL HORARIO — TODO BUENO PILOTO` · ID `1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc` — fuente de datos activa del piloto Todo Bueno.
- Apps Script `TODO_BUENO_CONTROL_HORARIO_v0.1` — backend del piloto.
- Google Sheet `SINCRONIAIA - Respuestas de negocios` · ID `1MRcROiaKrFQtAr-AJaCNQnET51gIqN4dEoLbRqm4oOo` — núcleo de captación/seguimiento.
- Apps Script `SINCRONIAIA — CONTROL DE CAPTACIÓN` — backend administrativo de captación.

# DOCUMENTACIÓN MAESTRA INTERNA

- `Arquitectura de Interfaz y Método SINCRONIAIA LABS` — v2.0.
- `MODELO_DE_NEGOCIO.md v1.2.0` — modelo operativo/comercial estable.
- `GUIA_UI.md V2` — contenido v1.1.0 definitivo aprobado.
- `FASE_C_1_1_MODELO_CANONICO_DE_CAPTACION` — fuente única de verdad y reglas antduplicidad para captación.

# REVISAR

## Gestión Laboral
- `/gestion-laboral-lab/` — LAB útil para horarios, ausencias, saldo y compensaciones. Se corrigió el horario futuro para que figure como **programado desde 31/08/2026**, no como activo. La capa BOE/convenio continúa sin conexión automática y no sustituye validación laboral profesional.
- `/calculadora-gestion-laboral/` — calculadora comercial.
- `/control-horario-comercial/` — presentación comercial separada del motor operativo.

## Comercial interno
- **Copiloto Comercial v1.3.4** — última versión localizada. Incluye historial/Atrás, ficha en vivo, exportación, CLIENTE_ID/INTERACCION_ID y backend. **Uso interno. No publicar en GitHub Pages** mientras no exista acceso protegido.
- Apps Script `Copiloto Comercial` — backend interno.
- **Simulador Comercial v2.1** — última versión localizada; no hay ruta pública maestra consolidada.
- **Gestoría Copiloto v0.1** — prueba sectorial temprana.

## Bienestar Animal aislado
- Bienestar Animal v3.0 AISLADO — frontend + backend Apps Script; no confundir con SINCRONIA Animal.
- Google Sheet `SINCRONIAIA — Respuestas Bienestar Animal` + Apps Script aislado — herramienta de estudio/investigación.
- `/sincroniaia-bienestar-animal-estudio/` — estudio comercial aislado.

## TPV
- `tpv_con monedas.html` en Drive — prototipo ejecutable más avanzado localizado. REVISAR; aún no producto final ni ruta pública consolidada.

## Control Horario personal
- `SINCRONIAIA_CONTROL_HORARIO_PERSONAL_v0.6.6_MINUTOS_CONSOLIDADOS.html` — candidata posterior a v0.6.5. Revisar seguridad y funcionamiento antes de sustituir la ruta actual.

## Legal/comercial
- Contratos Control Horario Básica / Avanzada / Premium — **BORRADORES**, no listos para firma.
- Precios provisionales Control Horario — no son tarifa maestra hasta revisión expresa.
- `Sincronía IA - La Estrategia de la Intriga` — material creativo, no doctrina maestra; usa marca antigua y cifras sin fuente demostrada.
- `Estructura Landing Sincronía IA - V1` — banco de copy, no landing vigente.
- Ficha Inteligencia Comercial Mimats — buena plantilla metodológica: separar hechos, desconocidos e hipótesis.

# DESARROLLO

- `/gestion/` — núcleo multiempresa v0.4 con datos/avisos simulados.
- `/gestion-app/` — simulación multiempresa reutilizable.
- `/gestion/todo-bueno/` — demo local sin backend/login real.
- `SINCRONIAIA_BACKEND_MULTIEMPRESA` — núcleo backend en desarrollo.
- `TODO BUENO · PEDIDOS` — hoja localizada en Drive; no declararla fuente de verdad del panel actual sin integración real.
- Omuro / Yamaha — concepto; no se ha localizado entregable canónico validado.
- Simuladores adicionales de hipoteca, márgenes, IVA, horas, amortización y presupuestos — conceptos/artefactos dispersos; no consolidar como productos aún.

# HISTÓRICO

## Rutas sustituidas
- `/prueba-can-soler-v1/` — sustituida por `/can-soler/`.
- `/control-horario-felix-v064/`, `/control-horario/felix/`, `/control-horario-prueba/` — pruebas/versiones anteriores.
- `/control-horario-felix/` — **VERSIÓN RETIRADA**. El HTML que contenía una credencial de backend pública fue reemplazado el 25/08/2026 por una pantalla de retirada. La credencial debe seguir considerándose comprometida hasta su rotación en el backend.
- Todo Bueno Control Horario v0.2.1 / v0.2.8 / v0.3.1 / v0.3.2 / v0.3.3 — trazabilidad solamente.
- `/prueba-bienestar-animal/` y `/prueba-bienestar-animal-v2/` — pruebas anteriores al Portal actual.
- `/prueba-voz/`, `/prueba-voz-v2/`, `/prueba-voz-v3/` — experimentos técnicos.

## Todo Bueno / Panadería
- Panadería & Pastelería v0.1 y Todo Bueno v0.3, v0.6, v0.8, v0.9, v0.11, v0.12 y BASE ESTABLE v1.0 — evolución histórica. Usar v1.1.

## Control Horario personal
- v0.3.7, v0.4.0, v0.4.1, v0.4.2, v0.6.0, v0.6.1, v0.6.2 y v0.6.4 — históricos.
- v0.6.5 — actual provisional.
- v0.6.6 — candidata en REVISAR.

## Copiloto
- v0.9, v1.0, v1.1, v1.2, v1.3, v1.3.1 y v1.3.2 — históricos. v1.3.4 es la candidata vigente interna.

## Simulador Comercial
- v1.8 y v2.0 — históricos. v2.1 es la candidata vigente.

## SINCRONIA Animal LAB
- v0.1, v0.2, v0.3, v0.4, v0.4.1 y variantes intermedias de v0.4.2 — históricos de laboratorio. La referencia pública actual es `/sincronia-animal/`, derivada de v0.4.2(2).

## TPV
- `TPV.html` y `TPV_Con_Arqueo.html` — históricos. `tpv_con monedas.html` es la candidata de revisión.

## Documentación/material antiguo
- `GUIA_UI.md` v1.0.0 — borrador sustituido por V2/v1.1.0.
- `Manifiesto y Base de Conocimiento - Sincronía IA` — NO REUTILIZAR SIN REVISIÓN; mezcla contexto inmobiliario antiguo.
- `Estructura Landing Sincron IA - V1` — duplicado con marca incorrecta.
- `IA en Veterinaria` — material antiguo con cifras/afirmaciones sin referencias verificadas.
- Formularios sin título y copia antigua de Respuestas de negocios — históricos.

# SEGURIDAD · REGLAS OBLIGATORIAS

1. GitHub Pages es público. Nunca incluir contraseñas, PIN, tokens, claves API ni secretos en HTML/JS público.
2. Una credencial que haya estado publicada se considera comprometida incluso después de borrar el texto: debe rotarse.
3. La ruta antigua `/control-horario-felix/` ya está retirada, pero **la rotación del secreto del backend continúa pendiente**.
4. No publicar Copiloto Comercial administrativo mientras no exista separación entre frontend público y acceso interno protegido.
5. Minificación, compresión u ofuscación no cuentan como protección de secretos.
6. Para cada producto debe existir una sola fuente de verdad y una sola versión recomendada.
7. No declarar ACTUAL una simulación, un LAB o una función normativa no conectada.

# PRÓXIMOS PENDIENTES REALES

1. Auditar `control-horario-felix-v065` y la candidata v0.6.6; decidir una sola versión personal y retirar la otra.
2. Rotar la credencial comprometida del backend de Control Horario cuando exista acceso de edición seguro al Apps Script.
3. Validar Gestión Laboral en móvil, manteniéndola como LAB mientras BOE/convenio no sea una fuente oficial conectada.
4. Definir acceso interno protegido para Copiloto Comercial v1.3.4.
5. Decidir si el prototipo TPV merece una ruta pública de prueba o vuelve a desarrollo.
6. No abrir nuevas versiones de Can Soler, Ascensores, SINCRONIA Animal o Todo Bueno salvo incidencia concreta.
