# Sprint 1 — Scope

## Objetivo
Dejar la base del producto lista para que un usuario:
- cree cuenta
- cree organización
- cree proyecto
- complete el intake inicial
- vea el dashboard del proyecto

## Módulos
### A. Auth & Access
- registro
- login
- logout
- middleware
- sesión persistente

### B. Organizations
- creación
- membresía
- organización activa

### C. Projects
- crear proyecto
- listar proyectos
- ver detalle

### D. Intake
- formulario estructurado
- validación
- guardado de brief
- edición posterior

### E. Dashboard Shell
- layout
- sidebar
- navegación
- overview del proyecto

## Entidades Sprint 1
- profiles
- organizations
- organization_members
- projects
- project_briefs
- project_phases
- approvals
- decisions
- artifacts

## Árbol inicial
app/
  (public)/
    page.tsx
    login/page.tsx
    register/page.tsx
  app/
    layout.tsx
    page.tsx
    onboarding/page.tsx
    projects/page.tsx
    projects/new/page.tsx
    projects/[projectId]/page.tsx
    projects/[projectId]/intake/page.tsx
components/
  auth/
  organizations/
  projects/
  intake/
  layout/
  ui/
lib/
  auth/
  db/
  supabase/
  validations/
  actions/
  helpers/
types/
  db.ts
  domain.ts
supabase/
  migrations/
