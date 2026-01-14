# Mobile Design Review

**Date:** 2026-01-14
**Target:** MVP launch mobile optimization
**Primary devices:** iPhone SE (375px), iPhone 14 (390px), Android phones

---

## Current State Assessment

### What's Working Well
- **Navigation**: Proper mobile menu with md:hidden toggle
- **H2HStatBar**: Good text scaling with sm: and md: breakpoints
- **StatsSummaryCards**: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- **Page layouts**: Correct padding breakpoints (px-4 sm:px-6 lg:px-8)

### What Needs Work
Tables, spacing, and text sizing need mobile-specific adjustments.

---

## Issues by Priority

### HIGH Priority

| Issue | Files | Problem | Solution | Status |
|-------|-------|---------|----------|--------|
| Tables force horizontal scroll | `ResultsTable.tsx`, `TopScoresTable.tsx`, `AthleteDetailPanel.tsx` | All columns visible on mobile | Hide low-priority columns with `hidden sm:table-cell` | |
| No mobile card view | `TopScoresTable.tsx`, `ResultsTable.tsx` | Tables only; cards better on mobile | Add card view toggle (future work) | Future |

### MEDIUM Priority

| Issue | Files | Problem | Solution | Status |
|-------|-------|---------|----------|--------|
| Grid gaps too large | Multiple components | `gap-6` everywhere | Change to `gap-3 sm:gap-6` or `gap-4 sm:gap-6` | |
| Hero text overflow | `LandingPage.tsx:27` | `text-6xl` overflows on <375px | Add `text-4xl sm:text-6xl md:text-8xl` | |
| Event header cramped | `EventResultsPage.tsx:208-240` | Stats on one line | Stack with `flex-col sm:flex-row` | |

### LOW Priority

| Issue | Files | Problem | Solution | Status |
|-------|-------|---------|----------|--------|
| H2H athlete images too large | `H2HAthleteCard.tsx:29` | Fixed `w-28 h-28` | Use `w-20 h-20 sm:w-28 sm:h-28` | |
| Tab scroll indicator | `EventResultsPage.tsx:249` | No visual hint tabs scroll | Add fade gradient at edges | Future |

---

## Quick Wins Checklist

- [x] **ResultsTable.tsx** ✅
  - [x] Hide Sponsor column on mobile (`hidden md:table-cell`)
  - [x] Hide Nationality column on mobile (`hidden sm:table-cell`)
  - [x] Reduce cell padding on mobile (`py-3 px-2 sm:py-4 sm:px-4`)

- [x] **TopScoresTable.tsx** ✅
  - [x] Adjust grid gap (`gap-4 sm:gap-6`)
  - [x] Hide Move, Round, Heat columns on mobile (`hidden sm:table-cell`)
  - [x] Reduce cell padding on mobile (`py-2 px-2 sm:py-3 sm:px-4`)

- [x] **AthleteDetailPanel.tsx** ✅
  - [x] Reduce grid gap on all grids (`gap-4 sm:gap-6`)
  - [x] Scale summary card text (`text-3xl sm:text-5xl`)
  - [x] Reduce card padding on mobile (`p-4 sm:p-6`)

- [x] **LandingPage.tsx** ✅
  - [x] Fix hero text (`text-4xl sm:text-6xl md:text-8xl`)

- [x] **EventResultsPage.tsx** ✅
  - [x] Stack event header stats on mobile (`flex-col sm:flex-row`)

- [x] **H2HAthleteCard.tsx** ✅
  - [x] Responsive image sizing (`w-20 h-20 sm:w-28 sm:h-28`)

- [x] **HeadToHeadComparison.tsx** ✅
  - [x] Add sm: and md: breakpoints to grid (`gap-3 sm:gap-4 md:gap-6`)

---

## Future Work

### Card View for Tables (4-6 hours)
Not in quick wins scope, but would be a significant UX improvement:
- Create `MobileResultsCard` component
- Add breakpoint detection
- Toggle between table and card views automatically

### Tab Scroll Indicator
- Add fade gradient at edges to hint that tabs are scrollable
- Low priority, users typically discover scrolling naturally

---

## Testing Checklist

After implementing changes:
1. [ ] Run `cd frontend && npm run build` - verify TypeScript
2. [ ] Test at 375px width (iPhone SE size)
3. [ ] Test at 390px width (iPhone 14 size)
4. [ ] Test at 414px width (iPhone Plus/Max size)
5. [ ] Check all pages:
   - [ ] Landing page
   - [ ] Events page
   - [ ] Event Results - Results tab
   - [ ] Event Results - Stats tab
   - [ ] Event Results - Head to Head tab

---

## Responsive Breakpoints Reference

Tailwind default breakpoints used in this project:
- `sm:` - 640px and up (large phones, small tablets)
- `md:` - 768px and up (tablets)
- `lg:` - 1024px and up (laptops)
- `xl:` - 1280px and up (desktops)

**Mobile-first approach**: Base styles are for mobile, then add breakpoints for larger screens.
