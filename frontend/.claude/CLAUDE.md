# Frontend - React Application Context

## Quick Reference

- **Stack**: React 19 + TypeScript + Vite + Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## Git Workflow

**ALWAYS ask before creating a new branch.**

---

## Project Structure

```
frontend/src/
├── components/         # Reusable UI components
│   ├── PageLayout.tsx      # Main layout wrapper
│   ├── PageHero.tsx        # Hero sections
│   ├── Section.tsx         # Content sections
│   ├── Card.tsx            # Frosted glass cards
│   ├── FeatureCard.tsx     # Dashboard feature cards
│   ├── Navigation.tsx      # Top navigation bar
│   ├── ResultsTable.tsx    # Results data table
│   ├── StatsSummaryCards.tsx
│   ├── EventStatsChart.tsx
│   ├── AthleteStatsTab.tsx
│   ├── AthleteDetailPanel.tsx
│   ├── AthleteHeatScoresChart.tsx
│   ├── HeadToHeadComparison.tsx
│   ├── TopScoresTable.tsx
│   ├── TableRowTooltip.tsx
│   └── StatCounter.tsx     # Animated counters
├── pages/              # Route pages
│   ├── LandingPage.tsx
│   ├── EventsPage.tsx
│   └── EventResultsPage.tsx
├── services/
│   └── api.ts          # API client (axios + endpoints)
├── types/
│   └── index.ts        # TypeScript interfaces
└── App.tsx             # Routes and providers
```

---

## Design System

**Full details in `/frontend/DESIGN-SYSTEM.md`**

### Key Patterns

| Pattern | Usage |
|---------|-------|
| Frosted glass | `bg-slate-800/40 backdrop-blur-sm border border-slate-700/50` |
| Hover effect | `hover:bg-slate-800/60 hover:border-cyan-500/50` |
| Primary accent | `cyan-400` / `cyan-500` |
| Secondary accent | `teal-400` (for comparisons) |
| Transitions | `transition-all duration-300` |

### Typography

- **Headers**: Bebas Neue (uppercase)
- **Body/Data**: Inter
- **Stat cards**: Use Inter (not Bebas) for data readability

### Colors

```
Background:    #0A0E1A (deep navy)
Primary:       cyan-400 (#38bdf8)
Secondary:     teal-400 (#2dd4bf)
Text Primary:  white
Text Secondary: gray-400
Borders:       slate-700/50
```

---

## Component Guidelines

### When Creating Components

1. Use existing layout components (`PageLayout`, `Section`, `Card`)
2. Follow frosted glass pattern for containers
3. Add hover effects to interactive elements
4. Include loading states with skeleton animations
5. Use TanStack Query for data fetching

### Component Template

```tsx
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import FeatureCard from './FeatureCard';

interface MyComponentProps {
  eventId: number;
}

const MyComponent = ({ eventId }: MyComponentProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData', eventId],
    queryFn: () => apiService.getEventStats(eventId, 'Women'),
    enabled: !!eventId,
  });

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-slate-700 rounded" />;
  }

  if (error) {
    return <div className="text-red-400">Error loading data</div>;
  }

  return (
    <FeatureCard title="My Component">
      {/* Content */}
    </FeatureCard>
  );
};

export default MyComponent;
```

---

## API Integration

### API Service (`services/api.ts`)

All API calls go through `apiService`:

```typescript
import { apiService } from '../services/api';

// Events
apiService.getEvents(page, pageSize, waveOnly)
apiService.getEvent(id)

// Athletes
apiService.getAthleteResults({ event_id, sex, page, page_size })
apiService.getEventAthletes(eventId, sex)
apiService.getAthleteEventStats(eventId, athleteId, sex)

// Stats
apiService.getGlobalStats()
apiService.getEventStats(eventId, sex)

// Head to Head
apiService.getEventHeadToHead(eventId, athlete1Id, athlete2Id, division)
```

### TanStack Query Pattern

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['uniqueKey', dependency1, dependency2],
  queryFn: () => apiService.someMethod(params),
  enabled: !!dependency1,  // Only fetch when ready
  retry: 1,                // Limit retries
});
```

---

## Terminology Standards

**Use these terms consistently:**

| Correct | Avoid |
|---------|-------|
| Athlete | Rider |
| Event | Competition, Contest |
| Heat | Match, Round |
| Division | Category |

---

## Known Issues / Tech Debt

These are documented for future cleanup:

1. **Unused API methods**: `getRiders`, `getFeaturedRider`, `getHeats`, `getQuickStats` exist but aren't used
2. **Large component**: `EventResultsPage.tsx` (539 lines) should be split
3. **Inline component**: `ComingSoon` is defined inside `App.tsx`
4. **No error boundary**: Global error handling needed
5. **No tests**: Test coverage is zero

---

## Common Patterns

When creating new code, copy from these reference files:

| Task | Copy From |
|------|-----------|
| New React page | `src/pages/EventResultsPage.tsx` |
| New component with data fetching | `src/components/AthleteStatsTab.tsx` |
| New chart/visualization | `src/components/EventStatsChart.tsx` |
| Table component | `src/components/ResultsTable.tsx` |

---

## Adding New Pages

1. Create page in `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Use `PageLayout` wrapper
4. Add `PageHero` for title
5. Use `Section` for content blocks
6. Add to navigation in `Navigation.tsx`

### Route Pattern

```tsx
// App.tsx
<Route path="/new-page" element={<NewPage />} />

// NewPage.tsx
const NewPage = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* pt-16 accounts for fixed navigation */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Content */}
        </div>
      </section>
    </div>
  );
};
```

---

## Environment Variables

```bash
VITE_API_URL=http://localhost:8000/api/v1  # Development
VITE_API_URL=https://windsurf-world-tour-stats-api.duckdns.org/api/v1  # Production
```

Set in Vercel dashboard for production.

---

## Common Tasks

### Add a new data visualization
1. Create component in `src/components/`
2. Use Recharts for charts
3. Follow existing patterns (`EventStatsChart.tsx`, `AthleteHeatScoresChart.tsx`)
4. Add loading skeleton

### Add filtering to a page
1. Add state: `const [filter, setFilter] = useState('default')`
2. Add to query key: `queryKey: ['data', eventId, filter]`
3. Use select dropdown with Tailwind styling

### Style a new table
1. Use existing pattern from `ResultsTable.tsx` or `TopScoresTable.tsx`
2. Apply: `bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg`
3. Add hover: `hover:bg-slate-800/40 transition-colors`
