# AI CTO Dashboard — Project Architecture

## Stack inicial
- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- PostgreSQL (Supabase)
- Zod
- React Hook Form

## Arquitectura funcional
### Frontend
- Dashboard shell
- Sidebar
- Header
- páginas protegidas
- formularios de proyecto e intake

### Backend
- Server Actions
- Route Handlers
- cliente y servidor Supabase
- validación centralizada

### Persistencia
Tablas:
- profiles
- organizations
- organization_members
- projects
- project_briefs
- project_phases
- approvals
- decisions
- artifacts

## Flujo principal del usuario
1. Registro
2. Login
3. Crear organización
4. Crear proyecto
5. Completar intake
6. Guardar brief
7. Ver dashboard del proyecto

## Rutas
### Públicas
- /
- /login
- /register

### Protegidas
- /app
- /app/onboarding
- /app/projects
- /app/projects/new
- /app/projects/[projectId]
- /app/projects/[projectId]/intake

## Estados
### project.status
- draft
- intake_ready
- prd_pending
- architecture_pending
- active
- archived

### phase.status
- locked
- pending
- in_progress
- ready_for_approval
- approved
