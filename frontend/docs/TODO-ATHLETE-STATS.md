# Athlete Stats Tab - Remaining Tasks

## ✅ Completed
- Added TypeScript types for athlete list and stats endpoints
- Added API service methods (`getEventAthletes`, `getAthleteEventStats`)
- Integrated athlete list dropdown with real API data
- Implemented athlete stats display with profile, summary cards, charts, and tables
- Fixed ID issue: using `event.id` instead of `event.event_id` for API calls

## ⚠️ Known Issues

### 1. Tab Navigation Horizontal Scrollbar Issue
**Status:** 🔴 Needs fixing
**Description:** Horizontal scrollbar appears on the tab navigation (RESULTS, EVENT STATS, ATHLETE STATS, HEAD TO HEAD) when viewing the Athlete Stats tab.

**Screenshot:** `c:\Users\jackf\OneDrive\Pictures\Screenshots\Screenshot 2026-01-03 161825.png`

**Action Required:**
- Fix overflow issue in tab navigation container (EventResultsPage.tsx lines 201-245)
- Ensure tabs fit within viewport without horizontal scroll
- Consider making tab text smaller or using abbreviations on mobile
- Test tab navigation responsiveness across different screen sizes

**Possible Solutions:**
- Remove `overflow-x-auto` from tab container
- Add proper responsive text sizing for tab labels
- Consider stacking tabs vertically on mobile
- Use CSS to prevent horizontal overflow

### 2. UI/Layout Issues (General)
**Status:** Needs review
**Description:** Other visual/layout issues with the athlete stats view that need to be addressed.

**Action Required:**
- Review and fix layout/styling issues in AthleteStatsTab component
- Test responsive design on different screen sizes
- Verify chart rendering and data display

### 3. API Data Quality
**Status:** Backend dependency
**Description:** The API returns data but some fields may be incomplete:
- All athletes showing `0 total_heats` and `0.0 best_heat_score` in the athlete list
- Heat scores and other stats may need verification

**Action Required:**
- Verify backend data population is complete
- Check if this is test data vs. real competition data
- Confirm which events have complete heat/stats data

### 4. Profile Images
**Status:** Minor enhancement
**Description:** Profile images are returned as URLs but may not all be available

**Action Required:**
- Test image loading and add proper fallback handling
- Consider adding lazy loading for images

### 5. Error Handling
**Status:** Enhancement
**Description:** Better error messages when API data is unavailable

**Action Required:**
- Add user-friendly error states for missing data
- Show helpful messages when event has no stats data yet

## 🔧 Future Enhancements

1. **Caching Strategy**
   - Implement proper cache invalidation
   - Consider stale-while-revalidate pattern

2. **Performance**
   - Lazy load athlete stats (only fetch when selected)
   - Consider pagination for events with many athletes

3. **Features**
   - Add search/filter in athlete dropdown
   - Add sorting options for tables
   - Export stats data functionality

## 📋 Testing Checklist

Before marking this feature as complete:
- [ ] Test with multiple events (Men's and Women's divisions)
- [ ] Verify gender filter switching works correctly
- [ ] Test athlete selection and stats loading
- [ ] Verify all charts render correctly
- [ ] Test on mobile/tablet screen sizes
- [ ] Verify loading states display properly
- [ ] Test error states (no data, API failure)

## 🔗 Related Files

- `/src/pages/EventResultsPage.tsx` - Main event page with tabs
- `/src/components/AthleteStatsTab.tsx` - Athlete stats tab component
- `/src/components/AthleteDetailPanel.tsx` - Detailed stats display
- `/src/components/AthleteHeatScoresChart.tsx` - Heat scores chart
- `/src/types/index.ts` - TypeScript type definitions
- `/src/services/api.ts` - API service methods

## 🌐 API Endpoints Used

- `GET /api/v1/events/{event.id}/athletes?sex=Women|Men` - Get athlete list
- `GET /api/v1/events/{event.id}/athletes/{athlete_id}/stats?sex=Women|Men` - Get athlete stats

**Note:** These endpoints expect the database `id`, not the `event_id` field.
