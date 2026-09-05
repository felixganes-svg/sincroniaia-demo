# VALIDACIÓN · SINCRONIAIA TPV Local Red v0.1

Fecha: 2026-09-05  
Responsable: Codex  
Tipo: Autovalidación técnica; pendiente prueba física externa con dos dispositivos reales.

## Resultado

**APROBADA COMO PILOTO DE LABORATORIO. NO APROBADA PARA CLIENTE REAL.**

## Pruebas superadas

- Servidor Python compila correctamente.
- Interfaz JavaScript tiene sintaxis válida.
- Base inicial contiene 148 artículos y 148 códigos únicos.
- Inicio de vendedor correcto.
- Venta por peso con tara: 1,250 kg menos 0,050 kg = 1,200 kg netos.
- Cálculo de importe y cambio correcto.
- Creación correlativa del ticket.
- Cierre simultáneo desde dos puestos: tickets `000001` y `000002`, sin duplicación.
- Ticket y líneas persisten en SQLite.
- Intento directo de modificar un ticket bloqueado por la base de datos.
- Consulta de tickets protegida por código de Empresa.
- Creación de encargo.
- Conversión del peso estimado al peso definitivo antes de cargar la venta.

## Pendientes relevantes

- Prueba física con tablet Carnicería, tablet Charcutería y ordenador servidor.
- Medición de estabilidad durante una jornada.
- Instalador y arranque automático.
- Copia de seguridad automática y restauración probada.
- Control de acceso y cambio seguro del código Empresa.
- Tratamiento formal de devoluciones mediante operación negativa independiente.

## Errores críticos abiertos

Ninguno para laboratorio. La ausencia de copias automáticas y endurecimiento de seguridad bloquea su uso con ventas reales.
