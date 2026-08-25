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

### ACTUAL INTERNO · Drive / backend
- Google Sheet `SINCRONIAIA — CONTROL HORARIO — TODO BUENO PILOTO` (ID `1ShVF1jKQal-jlErDwY8_ugfpH5d1oX2JUNGvfX5a2hc`) — fuente de datos activa del piloto. Contiene FICHAJES, INCIDENCIAS, EMPRESAS, TRABAJADORES, HORARIOS, CALENDARIO, LOG y ALERTAS. Tiene registros de fichaje de prueba reales del piloto.
- Apps Script `TODO_BUENO_CONTROL_HORARIO_v0.1` — backend asociado al piloto Todo Bueno. Uso interno; no presentar al cliente.
- Google Sheet `SINCRONIAIA - Respuestas de negocios` (ID `1MRcROiaKrFQtAr-AJaCNQnET51gIqN4dEoLbRqm4oOo`) — núcleo de captación/seguimiento. Incluye Respuestas, Captacion, Incidencias, backups y Seguimiento_Copiloto.
- Apps Script `SINCRONIAIA — CONTROL DE CAPTACIÓN` — backend administrativo de captación. Uso interno.

### DOCUMENTACIÓN MAESTRA INTERNA · SINCRONIAIA LABS
- `Arquitectura de Interfaz y Método SINCRONIAIA LABS` — versión 2.0. Documento maestro vigente de método, flujo consultivo y matriz ILE / ICE.
- `MODELO_DE_NEGOCIO.md v1.2.0` — documento estable y definitivo del modelo operativo, comercial y de ingresos. Define oferta, planes, fuentes de ingresos, cualificación y límites de personalización.
- `GUIA_UI.md V2` — contenido interno versión 1.1.0, marcada como Versión Definitiva Aprobada. Es la referencia vigente de UX/UI, responsive, accesibilidad y plantillas.
- `FASE_C_1_1_MODELO_CANONICO_DE_CAPTACION` — documento técnico maestro para arquitectura de captación, fuente única de verdad, estados del lead, conversión y reglas antduplicidad.

## REVISAR
- `/prueba-ascensores-v1/` — Demo aislada de Ascensores. Buena base; pendiente validación móvil final.
- `/prueba-can-soler-v1/` — Demo aislada Can Soler. APARCADA por decisión actual; no trabajar ahora.
- `/todo-bueno/empresa/` — Panel empresa / pedidos.
- `/todo-bueno/conectada/` — Flujo conectado de demostración; no equivale todavía a backend compartido real.
- `/control-horario-comercial/` — Presentación/entrada comercial, separada del motor operativo.
- `/calculadora-gestion-laboral/` — Herramienta comercial de cálculo y propuesta.
- `/gestion-laboral-lab/` — Gestión Laboral LAB; BOE/convenio todavía en desarrollo.
- `/sincroniaia-bienestar-animal-estudio/` — Estudio comercial aislado de Bienestar Animal.
- Copiloto Comercial SINCRONIAIA v1.3.4 — última versión localizada por correo y también como HTML en Drive. Tiene correcciones de CLIENTE_ID/INTERACCION_ID y estado ENVIADA. Clasificación: REVISAR CONECTADO. Mantener acceso administrativo fuera de GitHub Pages hasta consolidar una ruta interna segura.
- Apps Script `Copiloto Comercial` — backend localizado en Drive; uso interno y asociado al seguimiento comercial.
- Simulador Comercial SINCRONIAIA v2.1 — última versión localizada por correo, con separación Autónomo/Sociedad y tamaño del equipo. Clasificación: REVISAR / herramienta comercial. No existe ruta pública maestra confirmada.
- Bienestar Animal v3.0 AISLADO — paquete de instalación localizado por correo con frontend + backend Apps Script. Clasificación: REVISAR / aislado conectado; no confundir con SINCRONIA Animal.
- Google Sheet `SINCRONIAIA — Respuestas Bienestar Animal` + Apps Script `SINCRONIAIA — Bienestar Animal Mataró — AISLADO` — pareja administrativa de estudio/recogida de datos. REVISAR como herramienta de investigación, no como producto final.
- Gestoría Copiloto v0.1 — demo aislada localizada por correo. Clasificación: REVISAR / prueba sectorial temprana; no producto final.
- TPV prototipo — `tpv_con monedas.html` localizado en Drive. Es el prototipo ejecutable más avanzado localizado de esta familia. Clasificación: REVISAR / prototipo, no producto final ni ruta pública consolidada.

### MATERIAL COMERCIAL / MARCA · REVISAR
- `Sincronía IA - La Estrategia de la Intriga` — presentación creativa aprovechable como referencia de tono y marketing de atracción, pero NO doctrina maestra. Usa marca antigua `SINCRONIA.IA` y contiene cifras/afirmaciones sin fuente demostrada; no presentar tal cual.
- `Estructura Landing Sincronía IA - V1` — referencia de copy emocional centrado en recuperar tiempo y presencia. No sustituye al Portal público actual; conservar como banco de mensajes para una futura landing.
- `SINCRONIAIA — Ficha Inteligencia Comercial — Mimats Perruqueria Canina` — caso concreto y, sobre todo, buena referencia metodológica de investigación comercial: separar hechos, desconocidos e hipótesis, no inventar necesidades y validar antes de crear demo.

## DESARROLLO / DEMO
- `/gestion/` — Núcleo multiempresa v0.4; registros y avisos simulados.
- `/gestion-app/` — Gestión App multiempresa v0.4; simulación reutilizable.
- `/gestion/todo-bueno/` — Demo de gestión Todo Bueno; datos locales, sin backend/login real.
- SINCRONIA Animal — vertical aislada todavía en consolidación. Últimas versiones de laboratorio localizadas por correo: v0.1, v0.2 y v0.3. Existen versiones posteriores trabajadas, pero no hay ruta pública maestra confirmada en esta revisión.
- Omuro / Yamaha — concepto y propuesta de demo; no se ha localizado entregable final ni ruta pública estable.
- Simuladores adicionales — conceptos de hipoteca, márgenes, IVA, horas, amortización y presupuestos; no consolidarlos como producto hasta localizar una versión ejecutable actual.
- `SINCRONIAIA_BACKEND_MULTIEMPRESA` — Google Sheet localizado en Drive. Núcleo de backend multiempresa en desarrollo; no confundir con una implantación final.
- `TODO BUENO · PEDIDOS` — hoja de pedidos localizada en Drive. Revisar relación con la demo/panel actual antes de declararla fuente de verdad.

## HISTÓRICO / LAB
### Documentación interna
- `GUIA_UI.md` — versión 1.0.0. Borrador oficial para revisión; sustituida por `GUIA_UI.md V2` / contenido v1.1.0 definitivo.
- `Manifiesto y Base de Conocimiento - Sincronía IA` — HISTÓRICO / NO REUTILIZAR SIN REVISIÓN. Mezcla la marca actual con mensajes y contexto de compraventa inmobiliaria y una base de conocimiento de una etapa anterior; no debe alimentar demos, agentes ni comunicación comercial vigente.

### Material comercial / marca
- `Estructura Landing Sincron IA - V1` — duplicado temprano de la landing, con nombre de marca incorrecto/incompleto; sustituido como referencia por `Estructura Landing Sincronía IA - V1`.
- `IA en Veterinaria` — HISTÓRICO / MATERIAL DE CONTENIDO A REVISAR. Usa marca antigua y contiene afirmaciones clínicas y cifras de impacto sin referencias verificadas dentro del documento. Solo rescatar conceptos operativos tras nueva investigación y validación de fuentes.

### Control Horario Félix
- `/control-horario-felix-v064/` — versión anterior.
- `/control-horario/felix/` — prueba fechada 25/08/2026; no sirve como acceso permanente.
- `/control-horario-felix/` — base consolidada antigua. IMPORTANTE: se detectó una credencial de backend embebida en HTML público. No usar; requiere saneamiento y rotación de la credencial antes de cualquier reutilización.
- `/control-horario-prueba/` — laboratorio/pruebas.
- Google Sheet `SINCRONIAIA — CONTROL HORARIO — FÉLIX DEMO` y Apps Script homónimo — conservar como material de prueba, no como acceso actual recomendado.
- HTML `SINCRONIAIA_CONTROL_HORARIO_DEMO_v0.3.7_FELIX_20AGO_ENTRADA_0730.html` en Drive — histórico fechado.

### Todo Bueno · Control Horario
- `/todo-bueno/control-horario/v0.2.1/`
- `/todo-bueno/control-horario/v0.2.8/`
- `/todo-bueno/control-horario/v0.3.1/`
- `/todo-bueno/control-horario/v0.3.2/`
- `/todo-bueno/control-horario/v0.3.3/`
Estas versiones se conservan solo para trazabilidad.
- Google Sheet `SINCRONIAIA — CONTROL HORARIO — TODO BUENO — PILOTO` (ID `1P_lz0RBteHM73CqSqFyPeeO_NFfm1hIs_m6U86E_Ezo`) — predecesora de la hoja activa; no usar como fuente de verdad.

### TPV
- `TPV.html` — prototipo inicial en Drive.
- `TPV_Con_Arqueo.html` — evolución con arqueo.
- `tpv_con monedas.html` — candidata actual de revisión; las dos anteriores quedan históricas.
- Documento `TPV Mostrador Pro - Control de Caja y Arqueo Completo` — documentación/concepto de apoyo.

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

### Captación / formularios antiguos
- `Copia de SINCRONIAIA - Respuestas de negocios` — copia antigua; histórico.
- `Cuestionario de Investigación de Negocios Locales - Sincronia IA -` — formulario inicial; conservar como referencia salvo que se reactive.
- `Formulario sin título` y `Formulario sin título (respuestas)` — pruebas/artefactos iniciales; histórico.

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
- Google Sheets y Apps Script son infraestructura interna: no deben aparecer en la interfaz que ve el cliente.

## Criterio de navegación interna
El Centro de Control es interno de trabajo. Las demos públicas no deben mostrar botones tipo «Volver al Centro de Control». Desde el Centro se abrirán las demos en una pestaña/ventana aparte para poder regresar al Maestro sin añadir elementos internos visibles al cliente.

## Regla de consolidación
Antes de desarrollar una nueva versión de cualquier proyecto:
1. comprobar si existe una candidata ACTUAL o REVISAR;
2. mantener una sola versión recomendada;
3. pasar las anteriores a HISTÓRICO;
4. no inventar ni publicar rutas no verificadas;
5. no mover a ACTUAL nada que sea solo simulación, laboratorio o concepto;
6. definir una sola fuente de verdad por producto cuando existan varias hojas/backends;
7. cuando exista documentación maestra, trabajar sobre la versión estable aprobada y no sobre borradores históricos;
8. material comercial antiguo con marca obsoleta o cifras no verificadas no se reutiliza directamente: primero se revisa y se adapta al estado actual.