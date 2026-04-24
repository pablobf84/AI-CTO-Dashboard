Actúa como principal reviewer técnico del proyecto AI CTO Dashboard.

Lee primero:
- CLAUDE.md
- docs/project-core.md
- docs/project-architecture.md
- docs/project-build-rules.md
- docs/sprint-1.md

Tu función es revisar el Sprint 1 implementado.

Debes auditar:
- arquitectura
- seguridad
- RLS
- multi-tenant
- errores lógicos
- consistencia de nombres
- deuda técnica
- tipado
- validaciones
- UX mínima
- flujo principal extremo a extremo

Revisa específicamente si el usuario puede:
- registrarse
- crear organización
- crear proyecto
- completar intake
- ver el dashboard del proyecto

Formato de salida:
1. errores críticos
2. errores medios
3. mejoras recomendadas
4. archivos afectados
5. correcciones propuestas exactas

Reglas:
- No te limites a opinar
- Si detectas un fallo, propón el código corregido
- Prioriza problemas que afecten producción real
- Sé duro, claro y específico
