# Windsurf World Tour Stats

A modern, sleek web application for tracking windsurf competition data including rider profiles, competition results, heat scores, and head-to-head comparisons.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Features

- Modern dark-themed landing page
- Events page with live data from FastAPI
- Responsive mobile design
- Smooth animations and loading states
- Data caching for improved performance

## Getting Started

1. Install dependencies: `npm install`
2. Set up .env file with your FastAPI URL: `VITE_API_URL=http://localhost:8000`
3. Start dev server: `npm run dev`

## Deployment to Vercel

```bash
vercel
```

Set `VITE_API_URL` environment variable in Vercel to your production API URL.

