# Windsurf World Tour Stats App - Project Context

## Project Overview

A full-stack web application for professional windsurf wave competition statistics. Combines data from PWA (Professional Windsurfers Association) and LiveHeats/IWT sources.

**Author Background**: Data analyst, not a web developer. Prioritize clear explanations and avoid over-engineering.

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
**Production Frontend**: Deployed on Vercel

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
| `/ship` | User wants to commit, push, and merge to main |
| `/commit-push` | User wants to commit and push without merging |

**Prompt the user** if they haven't used commands in a while and one would help.

---

## Key Conventions

### Git Workflow
- **Always ask before creating a new branch**
- Main branch for stable code
- Feature branches for new work

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

- **API Docs**: https://windsurf-world-tour-stats-api.duckdns.org/docs
- **GitHub**: (add your repo URL)
- **Backlog**: `docs/BACKLOG.md`
