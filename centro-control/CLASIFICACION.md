# SINCRONIAIA · Clasificación maestra del repositorio

Actualizado: 25/08/2026

Regla operativa:
- ACTUAL = acceso recomendado hoy.
- REVISAR = existe y puede ser útil, pero no se presenta como versión final.
- DESARROLLO = laboratorio, simulación o producto todavía incompleto.
- HISTÓRICO = conservar para trazabilidad/recuperación, no usar como acceso recomendado.

## ACTUAL
- `/` — Portal público SINCRONIAIA. Integra Restaurante, Fisioterapia, Reformas y Bienestar Animal.
- `/investigacion/` — Investigación de campo.
- `/todo-bueno/` — Demo cliente Todo Bueno.
- `/todo-bueno/control-horario/` — Piloto estable de Control Horario Todo Bueno.
- `/control-horario-versiones/` — Menú comercial Básica / Intermedia / Premium.
- `/control-horario-calculadora/` — Calculadora comercial de Control Horario.
- `/control-horario-felix-v065/` — Último acceso personal recomendado localizado por ahora. Pendiente revisión específica de seguridad antes de considerarlo definitivo.

## REVISAR
- `/prueba-ascensores-v1/` — Demo aislada de Ascensores. Buena base; pendiente validación móvil final.
- `/prueba-can-soler-v1/` — Demo aislada Can Soler. APARCADA por decisión actual; no trabajar ahora.
- `/todo-bueno/empresa/` — Panel empresa / pedidos.
- `/todo-bueno/conectada/` — Flujo conectado de demostración; no equivale todavía a backend compartido real.
- `/control-horario-comercial/` — Presentación/entrada comercial, separada del motor operativo.
- `/calculadora-gestion-laboral/` — Herramienta comercial de cálculo y propuesta.
- `/gestion-laboral-lab/` — Gestión Laboral LAB; BOE/convenio todavía en desarrollo.
- `/sincroniaia-bienestar-animal-estudio/` — Estudio comercial aislado de Bienestar Animal.
- Copiloto Comercial SINCRONIAIA — acceso administrativo no publicar en GitHub Pages.

## DESARROLLO / DEMO
- `/gestion/` — Núcleo multiempresa v0.4; registros y avisos simulados.
- `/gestion-app/` — Gestión App multiempresa v0.4; simulación reutilizable.
- `/gestion/todo-bueno/` — Demo de gestión Todo Bueno; datos locales, sin backend/login real.
- SINCRONIA Animal — vertical aislada todavía en consolidación.
- SINCRONIAIA POS 1.0 — concepto/desarrollo.
- Omuro / Yamaha — concepto, no producto final.
- Simuladores comerciales — conjunto todavía por consolidar.

## HISTÓRICO / LAB
### Control Horario Félix
- `/control-horario-felix-v064/` — versión anterior.
- `/control-horario/felix/` — prueba fechada 25/08/2026; no sirve como acceso permanente.
- `/control-horario-felix/` — base consolidada antigua. IMPORTANTE: se detectó una credencial de backend embebida en HTML público. No usar; requiere saneamiento y rotación de la credencial antes de cualquier reutilización.
- `/control-horario-prueba/` — laboratorio/pruebas.

### Todo Bueno · Control Horario
- `/todo-bueno/control-horario/v0.2.1/`
- `/todo-bueno/control-horario/v0.2.8/`
- `/todo-bueno/control-horario/v0.3.1/`
- `/todo-bueno/control-horario/v0.3.2/`
- `/todo-bueno/control-horario/v0.3.3/`
Estas versiones se conservan solo para trazabilidad.

### Bienestar Animal
- `/prueba-bienestar-animal/`
- `/prueba-bienestar-animal-v2/`
Pruebas paralelas al Portal actual; no presentar como versiones vigentes.

### Voz
- `/prueba-voz/`
- `/prueba-voz-v2/`
- `/prueba-voz-v3/`
Experimentos técnicos de voz; no producto actual.

## Seguridad
- El repositorio y GitHub Pages son públicos.
- No publicar PIN, contraseñas, tokens, claves API ni credenciales en HTML/JS cliente.
- Cualquier credencial detectada en una versión histórica debe considerarse comprometida y rotarse, no solo ocultarse.

## Criterio de navegación interna
El Centro de Control es interno de trabajo. Las demos públicas no deben mostrar botones tipo «Volver al Centro de Control». Desde el Centro se abrirán las demos en una pestaña/ventana aparte para poder regresar al Maestro sin añadir elementos internos visibles al cliente.
