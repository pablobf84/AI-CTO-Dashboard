# AI CTO Dashboard Starter Kit

Orden de uso:
1. Crea un repo nuevo en GitHub.
2. Copia `docs/` y `CLAUDE.md` dentro del repo.
3. Usa `prompts/gemini_sprint1_spec.md` en Gemini para generar la especificación estructurada.
4. Usa la salida de Gemini + `docs/` como contexto para `prompts/codex_sprint1_build.md` en Codex.
5. Pasa el resultado por Claude con `prompts/claude_sprint1_review.md`.
6. Aplica correcciones y cierra Sprint 1.

Archivos:
- docs/project-core.md
- docs/project-architecture.md
- docs/project-build-rules.md
- docs/sprint-1.md
- CLAUDE.md
- prompts/gemini_sprint1_spec.md
- prompts/codex_sprint1_build.md
- prompts/claude_sprint1_review.md
