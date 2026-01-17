# Windsurf World Tour Stats App - Project Context

## Project Overview

A full-stack web application for professional windsurf wave competition statistics. Combines data from PWA (Professional Windsurfers Association) and LiveHeats/IWT sources.

**Author Background**: Data analyst, not a web developer. Prioritize clear explanations and avoid over-engineering.

**Feedback Style**: Be brutally honest when reviewing code or giving opinions. No flattery, no inflated scores. The goal is to ship the best possible product, not to feel good about mediocre work. Point out every flaw, suggest fixes, and hold work to a high standard.

---

## Monorepo Structure

```
windsurf-world-tour-stats-app/
├── frontend/          # React 19 + TypeScript + Vite
├── backend/           # FastAPI + Python data pipeline
├── docs/              # Documentation and backlog
│   └── BACKLOG.md     # Feature ideas and changes
└── package.json       # Monorepo scripts (npm run dev)
```

---

## Quick Start

```bash
# Run both frontend and backend together
npm run dev

# Or run separately:
npm run dev:frontend    # React on localhost:5173
npm run dev:backend     # FastAPI on localhost:8000
```

---

## Frontend-Backend Connection

| Frontend | Backend | Description |
|----------|---------|-------------|
| `VITE_API_URL` env var | Base URL | Points to API (local or production) |
| `services/api.ts` | `/api/v1/*` routes | All API calls go through apiService |
| TanStack Query | FastAPI | Caching + automatic retries |

**Production API**: https://windsurf-world-tour-stats-api.duckdns.org
**Production Frontend**: https://windsurfworldtourstats.com (Vercel)
**Dev Preview**: Vercel auto-deploys `dev` branch to preview URL

---

## Data Flow

```
PWA Website ──┐
              ├──► Python Scrapers ──► MySQL Database ──► FastAPI ──► React Frontend
LiveHeats ────┘
```

- **43,515 records** in database
- **359 unified athletes** (matched across sources)
- **118 events** (2016-2025)

---

## Things to Remember

**Before writing any code:**

1. **State how you will verify** this change works (test, bash command, browser check, etc.)
2. **Write the test or verification step first**
3. **Then implement the code**
4. **Run verification and iterate** until it passes

This ensures every change can be proven to work.

---

## Verification Commands

**IMPORTANT:** Always use the full build command for TypeScript verification, not just `tsc --noEmit`.

| Task | Command | Why |
|------|---------|-----|
| **Frontend TypeScript** | `cd frontend && npm run build` | Uses Vite's strict `verbatimModuleSyntax` setting |
| **Backend Python** | `cd backend && python -m py_compile app/main.py` | Basic syntax check |

**Do NOT use:** `tsc --noEmit` alone - it doesn't catch all errors that the Vite build will catch.

---

## Slash Commands

Remind the user about available slash commands when relevant:

| Command | When to Suggest |
|---------|-----------------|
| `/deploy` | User mentions deploying frontend to Vercel |
| `/deploy-api` | User mentions deploying backend API to VM |
| `/test` | After writing code, or user asks about testing |
| `/new-component` | User wants to create a React component |
| `/query-db` | User wants to check data or run a query |
| `/add-feature` | User mentions a new idea or feature request |
| `/ship` | User wants to deploy to production (from dev branch) |
| `/commit-push` | User wants to save work to dev or feature branch |

**Prompt the user** if they haven't used commands in a while and one would help.

---

## Key Conventions

### Git Workflow
- **`dev` branch** for active development (Vercel preview deploys here)
- **`main` branch** for production (auto-deploys to windsurfworldtourstats.com)
- **Feature branches** for isolated work → merge to `dev`
- `/commit-push` commits to current branch (blocks `main`)
- `/ship` merges `dev` → `main` (deploys to production)

### Terminology
- Use **"Athlete"** not "Rider" (standardizing across codebase)
- Use **"Event"** for competitions
- Use **"Heat"** for individual matchups

### Code Style
- **Frontend**: TypeScript strict mode, functional components, Tailwind CSS
- **Backend**: Python type hints, Pydantic models, FastAPI conventions

---

## What Each CLAUDE.md Contains

| File | Purpose |
|------|---------|
| `/.claude/CLAUDE.md` (this file) | Monorepo overview, how parts connect |
| `/frontend/.claude/CLAUDE.md` | React patterns, components, UI conventions |
| `/backend/.claude/CLAUDE.md` | Database schema, API endpoints, data pipeline |

---

## Common Tasks

### Adding a New Feature
1. Check `docs/BACKLOG.md` for context
2. Ask about creating a feature branch
3. Reference frontend or backend CLAUDE.md for patterns
4. Update BACKLOG.md when complete

### Debugging Data Issues
1. Check backend CLAUDE.md for schema details
2. API docs at `/docs` endpoint
3. Database has views: `ATHLETE_RESULTS_VIEW`, `ATHLETE_SUMMARY_VIEW`

### UI Changes
1. Check frontend CLAUDE.md for component patterns
2. Use existing Tailwind classes from design system
3. Follow existing component structure

---

## Important Links

- **Production**: https://windsurfworldtourstats.com
- **API Docs**: https://windsurf-world-tour-stats-api.duckdns.org/docs
- **GitHub**: https://github.com/datawithjack/windsurf-world-tour-stats-app
- **Backlog**: `docs/BACKLOG.md`
