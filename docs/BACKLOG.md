# Project Backlog

A single place to track feature ideas, improvements, and bugs.

**Last Updated**: 2026-01-11

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

---

## Planned

*Agreed upon - will implement*

### Frontend Improvements

- [ ] **Add axios error interceptors** - Global error handling so users see helpful messages
- [ ] **Remove unused API methods** - Clean up `getRiders`, `getFeaturedRider`, `getHeats`, `getQuickStats`
- [ ] **Standardize terminology** - Rename all "Rider" references to "Athlete"
- [ ] **Split EventResultsPage.tsx** - Break into smaller components (ResultsTab, EventStatsTab, AthleteStatsTab, HeadToHeadTab)
- [ ] **Extract ComingSoon component** - Move from App.tsx to own file
- [ ] **Add React Error Boundary** - Graceful error display instead of white screen
- [ ] **Add Vitest tests** - Basic tests for API service layer

### Backend Improvements

- [ ] **Add pytest tests** - Test API endpoints
- [ ] **Input validation tests** - Edge cases and error scenarios

### New Features

- [ ] **Athletes page** - Browse all athletes, search, filter by nationality
- [ ] **Head-to-Heads page** - Global head-to-head comparisons (not just per-event)
- [ ] **Search functionality** - Search events and athletes from navigation

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

## Notes

*Decisions, constraints, or context*

- **Author background**: Data analyst, not web developer - prioritize clarity over complexity
- **Data sources**: PWA + LiveHeats - both have different data formats
- **Production API**: https://windsurf-world-tour-stats-api.duckdns.org
- **Frontend hosting**: Vercel
- **Database**: Oracle MySQL Heatwave
