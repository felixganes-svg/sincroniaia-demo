# SINCRONIAIA TPV Alimentación · MASTER CANDIDATE v1

Fecha: 16/09/2026

## Estado
CANDIDATO A MASTER. Todavía NO sellado como MASTER/STABLE.

## Regla aplicada
EVIDENCIA ANTES QUE AFIRMACIÓN.

## Origen protegido / respaldo
La versión previa validada permanece intacta en:
`tpv-alimentacion-fusion-lab-v1/`

No se ha modificado ni eliminado el LAB FUSIÓN.

## Consolidación realizada
Se ha creado una carpeta independiente con copia exacta de la base y de los módulos que estaban cargados por el LAB FUSIÓN validado. Se conservan los mismos blobs Git de los archivos funcionales para evitar reescrituras innecesarias antes del sellado.

Base copiada exactamente:
- `base.html` SHA `187246e8de98ff44155cfb74aa9bca5fd0d77977`

Módulos cargados en el candidato, en el mismo orden funcional:
- `fase1-x-fechas.js` SHA `ecfc8bb3d3e9225af33744aed911a66c3d37dc8d`
- `fase5-trazabilidad-ticket.js` SHA `666f73e690b130b64cd7c903c1091a81a0504895`
- `fase6-ticket58-v4.js` SHA `09ac5d9616bb6b8e09c5e468aa5c9f2d1f894a58`
- `fase6-logo-centrado-v5.js` SHA `1f0132fae0d462d47e47f47e5405fa1851d8754e`
- `fase-rectificacion-validacion-v1.js` SHA `432402077d710d606fa7a3cc35bccdefd33cb3d7`
- `fase-seguridad-sesion-empresa-v1.js` SHA `2058c27f6eb70c639b199ccfdec6fe7d5e6f5468`
- `fase-informes-xz-rectificaciones-v1.js` SHA `ef68013bf90f8e6f7c3b01a3b2563910fb86d041`
- `fase-seguridad-intentos-v1.js` SHA `ac94852e8196af9a9fde5fbf41c12e9198d3edac`

## Qué NO se ha hecho
No se han reescrito las funciones validadas ni se han sustituido por nuevas implementaciones. La consolidación es una congelación limpia e independiente de la versión probada, para minimizar riesgo.

## Paso obligatorio antes de sellar MASTER/STABLE
Prueba corta de humo sobre esta carpeta:
1. Abrir Empresa y Venta.
2. Iniciar un vendedor y registrar una línea.
3. Abrir Consulta de tickets e Informes X/Z.
4. Abrir un ticket existente / copia.
5. Confirmar que Encargos abre correctamente.
6. Confirmar acceso Empresa y vendedor.

Si la prueba es correcta, crear `VALIDACION_MASTER.md` con estado APROBADA y entonces sellar MASTER/STABLE.
