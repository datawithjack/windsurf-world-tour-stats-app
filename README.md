# Windsurf World Tour Stats

A full-stack web application for tracking windsurf competition data including rider profiles, competition results, heat scores, and head-to-head comparisons.

## Project Structure

```
windsurf-world-tour-stats-app/
├── frontend/          # React + Vite + TypeScript
├── backend/           # FastAPI + Python
├── package.json       # Root scripts for development
└── README.md
```

## Tech Stack

### Frontend
- React 19 + TypeScript + Vite
- Tailwind CSS
- TanStack Query (React Query)
- React Router v7
- Framer Motion
- Axios

### Backend
- FastAPI (Python)
- Oracle Heatwave Database
- Pydantic

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip

### Installation

```bash
# Install root dependencies (concurrently)
npm install

# Install all project dependencies
npm run install:all
```

### Development

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:
```bash
# Frontend only (http://localhost:5173)
npm run dev:frontend

# Backend only (http://localhost:8000)
npm run dev:backend
```

### Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:8000/api/v1
```

**Backend** (`backend/.env`):
```
DATABASE_URL=your_connection_string
```

## Deployment

- **Frontend**: Deployed to Vercel from `frontend/` subdirectory
- **Backend**: Deployed to Oracle VM

See individual README files in each subdirectory for detailed deployment instructions.
