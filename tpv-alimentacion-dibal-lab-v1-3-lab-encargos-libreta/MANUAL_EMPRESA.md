# SINCRONIAIA TPV ALIMENTACIÓN
## Manual de empresa / administración

> Documento de trabajo para la LAB actual. No implica todavía sellado para producción.

## 1. Acceso Empresa
1. Abrir el TPV.
2. Entrar en **EMPRESA**.
3. Introducir el código de Empresa.
4. Acceder al menú de administración.

## 2. Configuración
Desde Empresa se pueden gestionar los parámetros del negocio disponibles en esta LAB:
- nombre del negocio,
- modo DEMO / PRODUCCIÓN,
- organización de caja,
- vendedores,
- artículos,
- subsecciones,
- descuentos,
- tickets,
- informes X/Z,
- copias locales.

## 3. Artículos
Ruta: **Empresa → Artículos**

### Crear artículo
Al abrir el alta:
- el sistema propone automáticamente el siguiente código numérico,
- usa formato de 6 dígitos,
- regla: código numérico más alto existente + 1.

Ejemplo:
- último código: 000148
- nuevo código propuesto: 000149

El código puede modificarse manualmente, pero no se permiten duplicados.

Datos principales:
- código,
- nombre,
- sección/familia,
- subsecciones,
- tipo de venta: peso o unidad,
- precio,
- oferta,
- letras de acceso,
- estado.

Tras guardar correctamente:
- vuelve al inicio del formulario,
- limpia el alta,
- no deja subsecciones marcadas,
- propone el siguiente código,
- queda preparado para el siguiente artículo.

## 4. Secciones y subsecciones
La LAB actual parte de una estructura de alimentación orientada a carnicería/charcutería/elaborados.

Para convertir el TPV en plantilla multi-negocio, las secciones deben pasar a ser configuración de Empresa y no quedar fijadas en código.

Ejemplo Frutería:
- Fruta.
- Verdura.
- Frutos secos.
- Preparados.
- Otros.

Ejemplo Pescadería:
- Pescado.
- Marisco.
- Preparados.
- Congelados.

La arquitectura objetivo debe permitir crear, activar, ordenar y desactivar secciones y subsecciones sin modificar programación.

## 5. Vendedores
Desde Empresa se gestionan los vendedores.

El vendedor:
- inicia su sesión,
- realiza ventas,
- queda asociado al ticket,
- puede consultar su actividad según permisos.

La Empresa debe conservar separación entre administración y venta.

## 6. Formas de pago
- Efectivo.
- Tarjeta.
- Bizum.
- Mixto.

**Mixto no es una bolsa contable separada.**
Cada importe se suma a su forma real de pago.

## 7. Informes X y Z
### X
Consulta del periodo abierto. No cierra caja.

### Z
Cierre definitivo del periodo. Queda guardado.

X y Z muestran únicamente:
1. Resumen general.
2. Formas de pago.
3. Ventas por sección.
4. Ventas por vendedor.

Los listados detallados de tickets deben permanecer en un módulo separado de consultas/listados.

### Consulta por fechas
- X por fechas se recalcula a partir de los tickets.
- Z muestra cierres guardados.
- Se puede filtrar por Desde / Hasta.

## 8. Rectificaciones
Un ticket cerrado es inmutable.

Para corregir:
- autorización de responsable/Empresa,
- motivo,
- actor,
- generación de ticket rectificativo,
- conservación del ticket original.

## 9. Datos y copias
La LAB actual utiliza datos locales del navegador.

Implicaciones:
- los datos pertenecen al navegador/dispositivo,
- borrar datos del navegador puede borrar la información,
- se deben realizar copias,
- no es todavía la arquitectura definitiva recomendada para varios puestos simultáneos.

## 10. Despliegue recomendado
### Un solo equipo
Para una tablet u ordenador único:
- puede instalarse como acceso web/PWA,
- o ejecutarse localmente en el equipo,
- los datos deben tener copia fiable.

### Varios equipos
Para trabajar con varios terminales a la vez no debe depender de localStorage.

Arquitectura recomendada:
- servidor local o servidor privado,
- base de datos,
- API,
- copias automáticas,
- control de concurrencia,
- autenticación,
- permisos.

## 11. GitHub
GitHub sirve para:
- guardar el código,
- controlar versiones,
- mantener LAB / STABLE,
- publicar demos con GitHub Pages.

GitHub Pages no sustituye a una base de datos local ni a un servidor de producción multiusuario.

## 12. Antes de producción real
Debe validarse:
- instalación local,
- persistencia real de datos,
- copias automáticas,
- recuperación de copia,
- funcionamiento sin conexión,
- seguridad,
- varios vendedores,
- varios dispositivos si aplica,
- impresión,
- impresora de tickets,
- balanza si se integra,
- cierres X/Z,
- rectificaciones,
- estabilidad de jornada completa,
- checklist de sellado.

## 13. Regla maestra
**No se enseña, promete ni representa nada que no esté implementado, verificado o claramente marcado como futuro.**
