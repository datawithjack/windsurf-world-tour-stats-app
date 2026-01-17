# Project Backlog

A single place to track feature ideas, improvements, and bugs.

**Last Updated**: 2026-01-13

---

## How to Use This File

- **Ideas**: Rough concepts, "someday" features
- **Planned**: Agreed upon, will do soon
- **In Progress**: Currently being worked on
- **Done**: Completed (move here, then archive periodically)

---

## Ideas

*Rough concepts - not committed to yet*

- [ ] Mobile app version
- [ ] Live event tracking (real-time updates during competitions)
- [ ] Athlete career timelines
- [ ] Season rankings/leaderboards
- [ ] Compare multiple athletes (3+ way comparison)
- [ ] Heat bracket visualization
- [ ] Export data to CSV/PDF
- [ ] User accounts for saved favorites
- [ ] Push notifications for favorite athletes
- [ ] **Chatbot** - AI assistant to answer questions about athletes/events
- [ ] **Buy Me a Coffee** - Support button/link for users to donate to the project
- [ ] **YouTube Stream Indexing** - Index and link to YouTube livestream recordings of events/heats
- [ ] **Visitor Counter** - Display site visitor/view count
- [ ] **Comments Section** - Let users leave comments on events or athlete pages
- [ ] **Elimination Round Display** - Show "Lost in Final", "Eliminated in Round 1", etc. on event results in italics grey text. Requires data cleaning to derive elimination round from existing results.
- [ ] **Changelog Page** - Add a public changelog after MVP launch to show users what's new and track updates
- [ ] **Member Portal** - User login to select favorite athletes or build a team. Could evolve into a fantasy league feature
- [ ] **Athlete Competition Journey** - Package-delivery-style progress tracker showing an athlete's path through rounds: who they beat, scores per heat, and final placement
- [ ] **Wave vs Jump Score Breakdown Visualization** - Visual way to show percentage breakdown of wave scores vs jump scores in heats. Could be a pie chart, donut chart, stacked bar, or other visualization showing the composition of an athlete's heat score
- [ ] **Tooltip Design Review** - Review and improve tooltips throughout the app for consistency, clarity, and helpfulness
- [ ] **Interactive World Map** - Desktop-only interactive map with pins showing event locations. Click pins to navigate to events. Could use Mapbox, Leaflet, or similar library
- [ ] **Road to Finals Page** - Bump chart showing rankings progression and possible outcomes 1-2 events out from the season finale. Visualize who can still win the title and what results they need

---

## MVP (Phase 1) - Events Only

*Launching with event browsing and detailed event stats*

- [x] Landing page with global statistics
- [x] Events browsing with filters (year, type, status)
- [x] Event Results with stats, charts, scores
- [x] Athlete Stats per event
- [x] Production deployment (API + Frontend)
- [ ] **Final polish and launch**

---

## Phase 2 - Athletes & Search

*After MVP launch*

### New Features

- [ ] **Athletes page** - Browse all athletes, search, filter by nationality
- [ ] **Head-to-Heads page** - Global head-to-head comparisons (not just per-event)
- [ ] **Search functionality** - Search events and athletes from navigation

### Code Quality

- [ ] **Add axios error interceptors** - Global error handling so users see helpful messages
- [ ] **Remove unused API methods** - Clean up `getRiders`, `getFeaturedRider`, `getHeats`, `getQuickStats`
- [ ] **Standardize terminology** - Rename all "Rider" references to "Athlete"
- [ ] **Split EventResultsPage.tsx** - Break into smaller components (ResultsTab, EventStatsTab, AthleteStatsTab, HeadToHeadTab)
- [ ] **Extract ComingSoon component** - Move from App.tsx to own file
- [ ] **Add React Error Boundary** - Graceful error display instead of white screen
- [ ] **Add Vitest tests** - Basic tests for API service layer
- [ ] **Add pytest tests** - Test API endpoints
- [ ] **Input validation tests** - Edge cases and error scenarios

---

## In Progress

*Currently being worked on*

- [x] Claude Code optimization (CLAUDE.md files) - **DONE 2026-01-11**

---

## Done

*Completed items - archive periodically*

### 2026-01-11
- [x] Created root-level CLAUDE.md for monorepo context
- [x] Enhanced frontend CLAUDE.md with component patterns
- [x] Created this BACKLOG.md file

### Previous (Pre-backlog)
- [x] Phase 1-3: Data collection complete (43,515 records)
- [x] Phase 4: Athlete data integration (359 unified athletes)
- [x] Phase 5: API development and production deployment
- [x] Frontend MVP: Landing, Events, Event Results pages
- [x] Head-to-head comparison feature
- [x] Event statistics visualization

---

## Bugs

*Known issues to fix*

- [ ] (None currently tracked)

---

## Data Quality Issues

*Database data that needs cleaning or normalization*

- [x] **Move type abbreviations** - FIXED 2026-01-12
  - API now joins with `SCORE_TYPES` lookup table using `TRIM()` to handle trailing spaces
  - "B " → "Back Loop", "F" → "Forward Loop", etc.
  - Remaining: `""` (3,894 records) - Empty/missing move type (data collection issue)
  - Remaining: `"Jump"` (278 records) - Generic jump type not in lookup table

---

## UI/UX Improvements

*From design review conducted 2026-01-12. Overall rating: 8.2/10*

### High Priority

- [ ] **Search functionality** - Add global search for athletes/events (also in Planned > New Features)
- [ ] **Filter state persistence** - Store filter selections in URL params so they survive navigation/refresh
- [ ] **Consistent empty states** - TopScoresTable and other components show blank when no data; add friendly messages like "No scores recorded for this category"
- [ ] **Back navigation** - Add breadcrumbs or explicit "← Back to Events" buttons on detail pages instead of relying on browser back

### Medium Priority

- [ ] **Sortable table columns** - Click column headers to sort ResultsTable and TopScoresTable
- [ ] **Pagination** - Add proper pagination for large tables (currently uses "Show More" only)
- [ ] **Toast notifications** - Brief pop-up confirmations for user actions (filter applied, data loaded, errors). Consider `react-hot-toast` or `sonner`
- [ ] **ComingSoon page styling** - Currently very minimal; match PageHero aesthetic with icon and description
- [ ] **Loading skeleton variety** - Different skeleton shapes for different content types (cards vs tables vs charts)

### Accessibility

- [ ] **Rank text labels** - Add "1st", "2nd", "3rd" text alongside color indicators for colorblind users
- [ ] **Focus visible audit** - Ensure all interactive elements have visible focus rings for keyboard navigation
- [ ] **TableRowTooltip accessibility** - Verify tooltip content is readable by screen readers
- [ ] **Keyboard navigation testing** - Document and test full keyboard support throughout app
- [ ] **ARIA labels audit** - Review all interactive elements for proper labeling

### Performance

- [ ] **Lazy load images** - Add `loading="lazy"` to event images and athlete avatars
- [ ] **Route code splitting** - Split page bundles for faster initial load (React.lazy)
- [ ] **Recharts tree-shaking** - Only import used chart components to reduce bundle size
- [ ] **Image optimization** - Consider next-gen formats (WebP) and responsive srcset

### Visual Polish

- [ ] **Hover states consistency** - Audit all clickable elements have clear hover feedback
- [ ] **Transition timing** - Standardize all transitions to 200-300ms ease-out
- [ ] **Error state styling** - Red error messages should have background container for visibility
- [ ] **Selected/active states** - Clearer indication of selected filters and active tabs
- [ ] **Micro-interactions** - Subtle feedback on button clicks (scale or color pulse)

### Data Presentation

- [ ] **Score breakdown on click** - Click a "best score" to see what it consists of (e.g., which waves/jumps made up the total). Needs UX design for how to display the breakdown (modal, expandable row, tooltip, or side panel)
- [ ] **Multi-event comparison** - Compare athlete performance across multiple events
- [ ] **Historical trends** - Timeline/sparkline showing athlete performance over time
- [ ] **Statistics aggregation** - "Most improved", "Highest average score", etc.
- [ ] **Score context** - Show how scores compare to event/fleet averages inline

### Future Considerations

- [ ] **Dark/light mode toggle** - Currently dark-only; some users prefer light mode
- [ ] **Data export** - Download tables as CSV or PDF (also in Ideas)
- [ ] **Share buttons** - Share specific views via URL with preserved state
- [ ] **Print styles** - CSS for printing results tables cleanly
- [ ] **Onboarding tooltips** - First-time user hints explaining features

---

## Notes

*Decisions, constraints, or context*

- **Author background**: Data analyst, not web developer - prioritize clarity over complexity
- **Data sources**: PWA + LiveHeats - both have different data formats
- **Production API**: https://windsurf-world-tour-stats-api.duckdns.org
- **Frontend hosting**: Vercel
- **Database**: Oracle MySQL Heatwave
