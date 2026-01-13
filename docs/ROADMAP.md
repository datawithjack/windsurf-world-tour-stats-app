# Product Roadmap - Windsurf World Tour Stats App

**Created**: 2026-01-13
**Strategy**: Release Events section first to core windsurf community, then expand.

---

## Release Strategy

```
Phase 0: MVP Fixes          → Fix critical bugs before any release
Phase 1: Events MVP         → Release to PWA, riders, core fans
Phase 2: Polish & Feedback  → Iterate based on user feedback
Phase 3: Athletes Section   → Full athlete browsing and profiles
Phase 4: Head-to-Head       → Cross-event athlete comparisons
Phase 5: Community Features → User engagement and growth
```

---

## Phase 0: MVP Blockers

**Goal**: Fix issues that would embarrass us or confuse users.
**Audience**: Internal testing only

### Critical Fixes (Must Complete)

| Task | Issue | File | Effort |
|------|-------|------|--------|
| [ ] Fix React Router navigation | Uses `window.location` instead of navigate | EventsPage.tsx:298 | 30min |
| [ ] Add gender switch notification | Silent Women→Men switch is confusing | EventResultsPage.tsx:67-76 | 1hr |
| [ ] Add error retry buttons | No recovery when API fails | LandingPage, EventsPage | 2hr |
| [ ] Fix keyboard navigation | Table rows not keyboard accessible | ResultsTable, TopScoresTable | 2hr |

### High Priority Fixes

| Task | Issue | File | Effort |
|------|-------|------|--------|
| [ ] Add reduced motion support | No prefers-reduced-motion check | All Framer Motion | 1hr |
| [ ] Add ARIA live regions | Screen readers miss animated content | StatCounter | 30min |
| [ ] Consistent loading skeletons | Skeleton doesn't match final layout | EventsPage | 2hr |
| [ ] Add back navigation | Users rely on browser back button | EventResultsPage | 1hr |

### Definition of Done
- [ ] All critical fixes merged
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (iOS Safari, Android Chrome)
- [ ] Internal walkthrough with no blockers found

---

## Phase 1: Events MVP Release

**Goal**: Ship Events section to core windsurf community.
**Audience**: PWA staff, professional riders, dedicated fans (50-100 users)

### Features (Already Complete)
- [x] Events listing page with filters (year, status, type)
- [x] Grid and list view modes
- [x] Event results with rankings table
- [x] Event statistics (best scores, move types)
- [x] Per-event athlete stats
- [x] Per-event head-to-head comparison
- [x] Mobile responsive design
- [x] Production API deployed

### Polish Items

| Task | Effort |
|------|--------|
| [ ] Add filter state to URL (refresh preserves filters) | 2hr |
| [ ] Persist view mode preference to localStorage | 30min |
| [ ] Add medal colors to TopScoresTable | 30min |
| [ ] Fix table border inconsistencies | 1hr |
| [ ] Add "Back to Events" button on results page | 30min |
| [ ] Improve empty state messaging (be more helpful) | 1hr |

### Release Checklist
- [ ] Phase 0 fixes complete
- [ ] Polish items complete
- [ ] Performance check (Lighthouse score >80)
- [ ] Accessibility check (axe scan, fix critical issues)
- [ ] Final QA walkthrough
- [ ] Prepare feedback collection method (Google Form, Discord, etc.)
- [ ] Announce to initial user group

### Success Metrics
- Users can browse events without confusion
- Event results load correctly for all historical events
- No critical bugs reported in first week
- Qualitative: "This is useful" feedback from riders/fans

---

## Phase 2: Feedback & Polish

**Goal**: Iterate based on real user feedback from Phase 1.
**Audience**: Same initial group + word-of-mouth growth

### Expected Feedback Areas
Based on design review, users will likely report:
- Confusion about what data is/isn't included
- Requests for specific athletes or events
- Mobile UX rough edges
- "Why can't I..." feature requests

### Planned Improvements

| Task | Source | Effort |
|------|--------|--------|
| [ ] Add onboarding/help tooltips | Design review | 3hr |
| [ ] Improve mobile filter layout | Design review | 2hr |
| [ ] Add search functionality | Backlog: High Priority | 4hr |
| [ ] Sortable table columns | Backlog: Medium Priority | 3hr |
| [ ] Toast notifications for user actions | Backlog: Medium Priority | 2hr |
| [ ] Lazy load images | Performance | 1hr |

### Code Quality

| Task | Source | Effort |
|------|--------|--------|
| [ ] Refactor EventStatsTabContent (522 lines) | Design review | 4hr |
| [ ] Standardize typography usage | Design review | 2hr |
| [ ] Add basic component tests | Backlog | 4hr |
| [ ] Remove unused API methods | Backlog | 30min |

### Definition of Done
- [ ] Top 5 user-reported issues addressed
- [ ] Search functionality working
- [ ] Test coverage >20% on critical paths
- [ ] Ready to expand audience

---

## Phase 3: Athletes Section

**Goal**: Launch comprehensive athlete browsing and profiles.
**Audience**: Broader windsurf community

### Core Features

| Feature | Description | Effort |
|---------|-------------|--------|
| [ ] Athletes listing page | Browse all 359 athletes | 6hr |
| [ ] Athlete search | Search by name, nationality | 2hr |
| [ ] Athlete filters | Filter by nationality, active status | 3hr |
| [ ] Athlete profile page | Career overview, photo, stats | 8hr |
| [ ] Career timeline | Event history with results | 4hr |
| [ ] Best performances | Top scores across all events | 3hr |

### Backend Work

| Task | Description | Effort |
|------|-------------|--------|
| [ ] Create athlete profile endpoint | Aggregate athlete data | 4hr |
| [ ] Create athlete career endpoint | Historical results | 3hr |
| [ ] Add athlete search endpoint | Name/country search | 2hr |

### Navigation Updates
- [ ] Enable Athletes nav link (remove ComingSoon)
- [ ] Link athlete names from event results to profile
- [ ] Add athlete breadcrumbs

### Definition of Done
- [ ] Can browse all athletes
- [ ] Can view individual athlete profiles
- [ ] Athletes linked from event results
- [ ] Mobile responsive

---

## Phase 4: Global Head-to-Head

**Goal**: Compare athletes across their entire careers.
**Audience**: Stats enthusiasts, fantasy players

### Core Features

| Feature | Description | Effort |
|---------|-------------|--------|
| [ ] Head-to-head landing page | Select any two athletes | 4hr |
| [ ] Career comparison stats | Overall record, win rate | 4hr |
| [ ] Event-by-event breakdown | Where they've competed | 3hr |
| [ ] Score comparisons | Best/average across career | 3hr |
| [ ] Visual comparison charts | Side-by-side performance | 4hr |

### Backend Work

| Task | Description | Effort |
|------|-------------|--------|
| [ ] Create career H2H endpoint | Cross-event comparison | 4hr |
| [ ] Add common events logic | Find shared competitions | 2hr |

### Definition of Done
- [ ] Can compare any two athletes globally
- [ ] Shows head-to-head record
- [ ] Breaks down by event
- [ ] Enable Head-to-Head nav link

---

## Phase 5: Community & Growth

**Goal**: Build engagement and grow user base.
**Audience**: General windsurf fans, potential new fans

### Engagement Features

| Feature | Description | Priority |
|---------|-------------|----------|
| [ ] Season rankings/leaderboards | Current standings | High |
| [ ] Changelog page | Show what's new | High |
| [ ] Share buttons | Share specific views | Medium |
| [ ] Visitor counter | Show community size | Low |

### Future Ideas (Evaluate Later)

From backlog Ideas section - evaluate based on user demand:

| Idea | Notes |
|------|-------|
| Athlete career timelines | Visual journey through career |
| Heat bracket visualization | Tournament-style brackets |
| Export to CSV/PDF | Data download for analysis |
| Dark/light mode toggle | User preference |
| YouTube stream indexing | Link to recorded heats |
| Member portal / login | Favorite athletes, notifications |
| Fantasy league features | Team building, predictions |
| Interactive world map | Event locations visualization |
| Road to Finals page | Championship scenarios |
| Chatbot assistant | AI Q&A about athletes/events |

### Monetization/Support (Optional)

| Feature | Notes |
|---------|-------|
| [ ] Buy Me a Coffee link | Support development |
| [ ] Sponsor acknowledgment | Credit data sources |

---

## Technical Debt Roadmap

Address alongside feature work:

### Phase 1-2 (During MVP)

| Task | Priority |
|------|----------|
| [ ] Add React Error Boundary | High |
| [ ] Add axios error interceptors | High |
| [ ] Standardize terminology (Rider → Athlete) | Medium |
| [ ] Fix inline styles → Tailwind classes | Medium |

### Phase 3-4 (During Expansion)

| Task | Priority |
|------|----------|
| [ ] Split EventResultsPage into sub-components | High |
| [ ] Add Vitest tests for API service | High |
| [ ] Add component snapshot tests | Medium |
| [ ] Implement route code splitting | Medium |

### Ongoing

| Task | Priority |
|------|----------|
| [ ] Accessibility audits (quarterly) | High |
| [ ] Performance monitoring | Medium |
| [ ] Bundle size monitoring | Low |

---

## Data Quality Roadmap

From BACKLOG.md Data Quality Issues:

| Issue | Status | Priority |
|-------|--------|----------|
| [x] Move type abbreviations | Fixed 2026-01-12 | - |
| [ ] Empty move types (3,894 records) | Data collection issue | Low |
| [ ] "Jump" generic type (278 records) | Need lookup entry | Low |
| [ ] Elimination round derivation | Requires data cleaning | Phase 5 |

---

## Success Metrics by Phase

| Phase | Key Metric | Target |
|-------|------------|--------|
| Phase 0 | Critical bugs | 0 |
| Phase 1 | Active users (weekly) | 25+ |
| Phase 2 | User satisfaction | "Useful" feedback |
| Phase 3 | Athletes viewed | 100+ unique profiles |
| Phase 4 | H2H comparisons | 50+ comparisons/week |
| Phase 5 | Return visitors | 40%+ return rate |

---

## Current Status

**Last Updated**: 2026-01-13

| Phase | Status | Blockers |
|-------|--------|----------|
| Phase 0 | Not Started | Need to begin |
| Phase 1 | Features Complete | Awaiting Phase 0 |
| Phase 2 | Planned | Awaiting Phase 1 release |
| Phase 3 | Planned | - |
| Phase 4 | Planned | - |
| Phase 5 | Ideas only | - |

### Next Actions
1. Complete Phase 0 critical fixes
2. Complete Phase 0 high priority fixes
3. Release Phase 1 to initial user group
4. Collect feedback for Phase 2 planning

---

## Appendix: Full Backlog Mapping

### From BACKLOG.md → Roadmap Phase

| Backlog Item | Roadmap Phase |
|--------------|---------------|
| Axios error interceptors | Phase 0 |
| Remove unused API methods | Phase 2 |
| Standardize terminology | Phase 2 |
| Split EventResultsPage | Phase 2 |
| Add React Error Boundary | Phase 1 |
| Add Vitest tests | Phase 2 |
| Athletes page | Phase 3 |
| Head-to-Heads page | Phase 4 |
| Search functionality | Phase 2 |
| Filter state persistence | Phase 1 |
| Back navigation | Phase 0 |
| Sortable table columns | Phase 2 |
| Toast notifications | Phase 2 |
| Season rankings | Phase 5 |
| Heat bracket visualization | Phase 5+ |
| Export data | Phase 5+ |
| User accounts | Phase 5+ |

---

*Roadmap maintained by project team. Update as priorities shift based on user feedback.*
