Actúa como principal software engineer y constructor principal de este repositorio.

Lee primero:
- docs/project-core.md
- docs/project-architecture.md
- docs/project-build-rules.md
- docs/sprint-1.md

Si existe una especificación estructurada generada por Gemini para Sprint 1, úsala como contrato prioritario.

Objetivo:
Construir el Sprint 1 del proyecto AI CTO Dashboard como una aplicación SaaS real y usable.

Contexto funcional del Sprint 1:
El usuario debe poder:
- registrarse
- iniciar sesión
- crear organización
- acceder al dashboard
- crear un proyecto
- completar el intake inicial
- guardar el brief
- visualizar el proyecto

Stack obligatorio:
- Next.js App Router
- TypeScript estricto
- Tailwind
- Supabase Auth
- PostgreSQL
- Zod
- React Hook Form

Reglas absolutas:
1. No generes demos ni placeholders.
2. No dejes TODOs.
3. Todo debe quedar listo para compilar.
4. Implementa multi-tenant por organización.
5. Usa migraciones SQL y políticas RLS correctas.
6. Si cambias un archivo, devuélvelo completo.
7. Antes de escribir código, resume el plan.
8. Después implementa por bloques ordenados.

Bloques del Sprint 1:
- bootstrap del proyecto
- auth y sesión
- organizaciones
- proyectos
- intake
- dashboard shell

Formato de salida obligatorio:
A. plan técnico breve
B. árbol de archivos
C. migraciones SQL
D. archivos completos
E. instrucciones de instalación y prueba
F. checklist de terminado del Sprint 1

Criterio de terminado:
Sprint 1 no está terminado si no funcionan:
- registro/login
- creación de organización
- creación de proyecto
- formulario de intake
- guardado real en base de datos
- navegación protegida
