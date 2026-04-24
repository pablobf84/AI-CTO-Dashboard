Actúa como principal product architect y technical spec writer para el proyecto AI CTO Dashboard.

Lee primero:
- docs/project-core.md
- docs/project-architecture.md
- docs/project-build-rules.md
- docs/sprint-1.md

Objetivo:
Definir la especificación estructurada exacta del Sprint 1 del producto.

Contexto del producto:
AI CTO Dashboard es un SaaS GitHub-first que convierte una idea de SaaS en:
- PRD
- arquitectura técnica
- backlog por fases
- prompt packs para agentes
- memoria de proyecto
- aprobaciones por etapa

Sprint 1 debe dejar funcional:
- autenticación
- organizaciones
- proyectos
- intake inicial
- dashboard base
- persistencia real

Stack:
- Next.js App Router
- TypeScript
- Tailwind
- Supabase
- PostgreSQL

Quiero una salida JSON estricta con esta estructura:
{
  "sprint_goal": "",
  "user_flow": [],
  "routes": [],
  "entities": [],
  "forms": [],
  "ui_modules": [],
  "backend_modules": [],
  "database_tables": [],
  "rls_rules": [],
  "acceptance_criteria": [],
  "non_goals": [],
  "technical_risks": []
}

Reglas:
- No inventes funcionalidades fuera del Sprint 1
- Sé concreto
- Optimiza para implementación por Codex
- Nada genérico
- Nada visual innecesario
- Prioriza claridad estructural y ejecución
