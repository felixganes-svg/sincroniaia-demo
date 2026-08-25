# SINCRONIAIA · Clasificación maestra del repositorio y artefactos externos

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
- Copiloto Comercial SINCRONIAIA v1.3.4 — última versión localizada por correo. Tiene correcciones de CLIENTE_ID/INTERACCION_ID y estado ENVIADA. Clasificación: REVISAR CONECTADO. Mantener acceso administrativo fuera de GitHub Pages hasta consolidar una ruta interna segura.
- Simulador Comercial SINCRONIAIA v2.1 — última versión localizada por correo, con separación Autónomo/Sociedad y tamaño del equipo. Clasificación: REVISAR / herramienta comercial. No existe ruta pública maestra confirmada.
- Bienestar Animal v3.0 AISLADO — paquete de instalación localizado por correo con frontend + backend Apps Script. Clasificación: REVISAR / aislado conectado; no confundir con SINCRONIA Animal.
- Gestoría Copiloto v0.1 — demo aislada localizada por correo. Clasificación: REVISAR / prueba sectorial temprana; no producto final.

## DESARROLLO / DEMO
- `/gestion/` — Núcleo multiempresa v0.4; registros y avisos simulados.
- `/gestion-app/` — Gestión App multiempresa v0.4; simulación reutilizable.
- `/gestion/todo-bueno/` — Demo de gestión Todo Bueno; datos locales, sin backend/login real.
- SINCRONIA Animal — vertical aislada todavía en consolidación. Últimas versiones de laboratorio localizadas por correo: v0.1, v0.2 y v0.3. Existen versiones posteriores trabajadas, pero no hay ruta pública maestra confirmada en esta revisión.
- SINCRONIAIA POS 1.0 — concepto/desarrollo. No se ha localizado entregable final ni ruta pública estable.
- Omuro / Yamaha — concepto y propuesta de demo; no se ha localizado entregable final ni ruta pública estable.
- Simuladores adicionales — conceptos de hipoteca, márgenes, IVA, horas, amortización y presupuestos; no consolidarlos como producto hasta localizar una versión ejecutable actual.

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
- Bienestar Animal v2 AISLADO — histórico, sustituido por v3.
- Bienestar Animal v3 AISLADO — histórico de trabajo respecto a v3.0 para instalar.
- Prueba de ubicación Bienestar Animal — experimento específico, no versión recomendada.

### Copiloto Comercial
- v0.9 — histórico.
- v1.0 — histórico.
- v1.1 — histórico.
- v1.2 — histórico.
- v1.3 / v1.3.1 / v1.3.2 — históricos intermedios.
- v1.3.4 — conservar como candidata actual de revisión.

### Simulador Comercial
- v1.8 — histórico.
- v2.0 — histórico.
- v2.1 — candidata actual de revisión.

### SINCRONIA Animal LAB
- v0.1 — histórico de laboratorio.
- v0.2 — histórico de laboratorio.
- v0.3 — última versión de laboratorio localizada por correo en esta revisión, pero no producto final.

### Voz
- `/prueba-voz/`
- `/prueba-voz-v2/`
- `/prueba-voz-v3/`
Experimentos técnicos de voz; no producto actual.

## Seguridad
- El repositorio y GitHub Pages son públicos.
- No publicar PIN, contraseñas, tokens, claves API ni credenciales en HTML/JS cliente.
- Cualquier credencial detectada en una versión histórica debe considerarse comprometida y rotarse, no solo ocultarse.
- Copiloto Comercial y otras herramientas administrativas no deben exponerse como acceso público hasta separar correctamente front público y administración interna.

## Criterio de navegación interna
El Centro de Control es interno de trabajo. Las demos públicas no deben mostrar botones tipo «Volver al Centro de Control». Desde el Centro se abrirán las demos en una pestaña/ventana aparte para poder regresar al Maestro sin añadir elementos internos visibles al cliente.

## Regla de consolidación
Antes de desarrollar una nueva versión de cualquier proyecto:
1. comprobar si existe una candidata ACTUAL o REVISAR;
2. mantener una sola versión recomendada;
3. pasar las anteriores a HISTÓRICO;
4. no inventar ni publicar rutas no verificadas;
5. no mover a ACTUAL nada que sea solo simulación, laboratorio o concepto.