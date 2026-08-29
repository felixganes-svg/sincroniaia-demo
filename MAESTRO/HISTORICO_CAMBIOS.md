# SINCRONIAIA · HISTÓRICO DE CAMBIOS DE GOBIERNO

## 29/08/2026 · Desarrollo aislado obligatorio

Se consolida como regla general de SINCRONIAIA que todo desarrollo nuevo, ampliación relevante o modificación con riesgo sobre una versión funcional se realizará primero en una DEMO/LAB aislada e independiente.

Motivo:
- proteger versiones operativas;
- evitar regresiones sobre sistemas ya funcionales;
- evitar perder días reparando producción por cambios de prueba;
- permitir descartar una prueba sin consecuencias;
- exigir validación y sellado antes de promoción.

Reglas asociadas:
- producción no se toca para experimentar;
- la DEMO/LAB debe estar marcada como NO PRODUCCIÓN;
- la DEMO/LAB debe ser independiente y descartable;
- si una prueba falla, se corrige o elimina el laboratorio;
- solo una versión validada y sellada puede convertirse en producción;
- después de promocionar, se verifica de nuevo la URL oficial.

Caso de aplicación inmediato:
- `SINCRONIAIA ENCARGOS` continúa como desarrollo aislado hasta estar validado y sellado.

Esta decisión pasa a formar parte del MAESTRO y prevalece sobre prácticas anteriores incompatibles.
