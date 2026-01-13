# Product Roadmap - Windsurf World Tour Stats App

**Created**: 2026-01-13
**Last Updated**: 2026-01-13
**Strategy**: Release Events section first to core windsurf community, then expand.

---

## Release Strategy

```
Phase 0: MVP Fixes          → ✅ COMPLETE
Phase 1: Events MVP         → 🔄 READY TO LAUNCH (minor items remain)
Phase 2: Polish & Feedback  → Planned
Phase 3: Athletes Section   → Planned
Phase 4: Head-to-Head       → Planned
Phase 5: Community Features → Ideas only
```

---

## Phase 0: MVP Blockers - ✅ COMPLETE

**Goal**: Fix issues that would embarrass us or confuse users.
**Status**: All critical and high priority fixes complete.

### Critical Fixes - ✅ ALL DONE

| Task | Issue | Status |
|------|-------|--------|
| ~~Fix React Router navigation~~ | Uses `window.location` instead of navigate | ✅ Done |
| ~~Add gender switch notification~~ | Silent Women→Men switch is confusing | ✅ Done |
| ~~Add error retry buttons~~ | No recovery when API fails | ✅ Done |
| ~~Fix keyboard navigation~~ | Table rows not keyboard accessible | ✅ Done |

### High Priority Fixes - ✅ ALL DONE

| Task | Issue | Status |
|------|-------|--------|
| ~~Add reduced motion support~~ | No prefers-reduced-motion check | ✅ Done |
| ~~Add ARIA live regions~~ | Screen readers miss animated content | ✅ Done |
| ~~Consistent loading skeletons~~ | Skeleton doesn't match final layout | ✅ Done |

### Definition of Done - Phase 0
- [x] All critical fixes merged
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (iOS Safari, Android Chrome)
- [ ] Internal walkthrough with no blockers found

---

## Phase 1: Events MVP Release - 🔄 READY TO LAUNCH

**Goal**: Ship Events section to core windsurf community.
**Audience**: PWA staff, professional riders, dedicated fans (50-100 users)
**Status**: Features complete, polish complete, ready for final checklist.

### Features - ✅ ALL COMPLETE
- [x] Events listing page with filters (year, status, type)
- [x] Grid and list view modes
- [x] Event results with rankings table
- [x] Event statistics (best scores, move types)
- [x] Per-event athlete stats
- [x] Per-event head-to-head comparison
- [x] Mobile responsive design
- [x] Production API deployed

### Polish Items - ✅ ALL COMPLETE

| Task | Status |
|------|--------|
| ~~Add filter state to URL~~ | ✅ Done |
| ~~Persist view mode preference~~ | ✅ Done |
| ~~Add medal colors to TopScoresTable~~ | ✅ Done |
| ~~Fix table border inconsistencies~~ | ✅ Done |
| ~~Improve empty state messaging~~ | ✅ Done |

### Code Quality - ✅ COMPLETE

| Task | Status |
|------|--------|
| ~~Refactor EventStatsTabContent (522→370 lines)~~ | ✅ Done - extracted ScoreTable, StatsFilterBar, ShowMoreButton |
| ~~Remove unused typography classes~~ | ✅ Done |
| ~~Standardize transition timing~~ | ✅ Done |

### Release Checklist - BEFORE LAUNCH

| Task | Status | Notes |
|------|--------|-------|
| Phase 0 fixes complete | ✅ Done | All 7 items fixed |
| Polish items complete | ✅ Done | All 5 items fixed |
| Performance check (Lighthouse >80) | ⬜ TODO | Run audit |
| Accessibility check (axe scan) | ⬜ TODO | Fix critical issues |
| Cross-browser testing | ⬜ TODO | Chrome, Firefox, Safari |
| Mobile testing | ⬜ TODO | iOS Safari, Android Chrome |
| Final QA walkthrough | ⬜ TODO | No blockers |
| Feedback collection method | ⬜ TODO | Google Form or Discord |
| Announce to initial user group | ⬜ TODO | - |

### Success Metrics
- Users can browse events without confusion
- Event results load correctly for all historical events
- No critical bugs reported in first week
- Qualitative: "This is useful" feedback from riders/fans

---

## Phase 2: Feedback & Polish

**Goal**: Iterate based on real user feedback from Phase 1.
**Audience**: Same initial group + word-of-mouth growth
**Status**: Planned - waiting for Phase 1 feedback

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

### Technical Improvements

| Task | Source | Effort |
|------|--------|--------|
| [ ] Route-level code splitting | Design review | 30min |
| [ ] Add error boundaries | Design review | 30min |
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
**Status**: Planned

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
**Status**: Planned

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
**Status**: Ideas only

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

---

## Technical Debt Roadmap

### Phase 2 (During Feedback)

| Task | Priority | Status |
|------|----------|--------|
| Route code splitting | High | ⬜ TODO |
| Add error boundaries | High | ⬜ TODO |
| Add axios error interceptors | Medium | ⬜ TODO |
| Add Vitest tests for API service | Medium | ⬜ TODO |
| Set up Playwright E2E tests | Medium | ⬜ TODO |
| Add Playwright MCP for automated cross-browser/mobile testing | Low | ⬜ TODO |

### Phase 3-4 (During Expansion)

| Task | Priority | Status |
|------|----------|--------|
| Split EventResultsPage into sub-components | Medium | ⬜ TODO |
| Split HeadToHeadComparison | Low | ⬜ TODO |
| Add component snapshot tests | Low | ⬜ TODO |

### Ongoing

| Task | Priority |
|------|----------|
| Accessibility audits (quarterly) | High |
| Performance monitoring | Medium |
| Bundle size monitoring | Low |

---

## Current Status Summary

**Last Updated**: 2026-01-13

| Phase | Status | What's Left |
|-------|--------|-------------|
| Phase 0 | ✅ COMPLETE | Nothing |
| Phase 1 | 🔄 READY | Final checklist (testing, Lighthouse, axe scan) |
| Phase 2 | Planned | Awaiting Phase 1 feedback |
| Phase 3 | Planned | - |
| Phase 4 | Planned | - |
| Phase 5 | Ideas | - |

### MVP Launch Checklist (What's Left)

```
⬜ 1. Run Lighthouse audit (target >80 performance)
⬜ 2. Run axe accessibility scan (fix critical issues)
⬜ 3. Test on Chrome, Firefox, Safari
⬜ 4. Test on iOS Safari and Android Chrome
⬜ 5. Final walkthrough - no blockers
⬜ 6. Set up feedback collection (Google Form recommended)
⬜ 7. Announce to initial users
```

**Estimated time to launch: 2-4 hours of testing/polish**

### Post-Launch Setup

```
⬜ Connect custom domain name
⬜ Add changelog page for updates
⬜ Set up dev branch workflow (main = production, dev = staging)
```

---

## Success Metrics by Phase

| Phase | Key Metric | Target |
|-------|------------|--------|
| Phase 0 | Critical bugs | ✅ 0 |
| Phase 1 | Active users (weekly) | 25+ |
| Phase 2 | User satisfaction | "Useful" feedback |
| Phase 3 | Athletes viewed | 100+ unique profiles |
| Phase 4 | H2H comparisons | 50+ comparisons/week |
| Phase 5 | Return visitors | 40%+ return rate |

---

*Roadmap maintained by project team. Update as priorities shift based on user feedback.*
