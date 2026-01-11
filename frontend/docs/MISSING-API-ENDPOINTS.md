# Missing API Endpoints for Event Stats Page

## Overview
This document outlines the API endpoints that are missing or need fixes to fully populate the Event Stats page.

## Current Implementation Status

### ✅ Working Endpoint
- **GET** `/api/v1/events/{event_id}/stats?sex={sex}`
  - Status: Implemented and working
  - Returns: Event statistics including move type stats, top jump scores, and top wave scores

## Issues & Missing Data

### 1. ❌ Top Heat Scores - Missing from API Response

**Issue:** The current API response does not include a `top_heat_scores` array.

**Current Response Structure:**
```json
{
  "summary": {
    "best_heat_score": null,
    "best_jump_score": {...},
    "best_wave_score": {...}
  },
  "move_type_stats": [...],
  "top_jump_scores": [...],
  "top_wave_scores": [...],
  "metadata": {...}
}
```

**Required Addition:**
```json
{
  "top_heat_scores": [
    {
      "rank": 1,
      "athlete_name": "Athlete Name",
      "athlete_id": 123,
      "score": 24.50,
      "heat_number": 21
    }
  ]
}
```

**Frontend Impact:**
- The "Top Heat Scores" table on the Event Stats page is currently empty
- Component is ready to display data once API provides it
- Located in: `src/components/TopScoresTable.tsx`

**Backend Requirements:**
- Query to calculate total heat scores (sum of counting scores per athlete per heat)
- Rank heats by total score
- Return top N heats (suggest top 50, paginated if needed)

---

### 2. ⚠️ Best Heat Score - Returns Null

**Issue:** The `summary.best_heat_score` field consistently returns `null` in the API response.

**Example from API:**
```json
{
  "summary": {
    "best_heat_score": null,  // <-- Always null
    "best_jump_score": {
      "score": 5.5,
      "athlete_name": "Example",
      ...
    }
  }
}
```

**Expected Structure:**
```json
{
  "summary": {
    "best_heat_score": {
      "score": 24.50,
      "athlete_name": "Athlete Name",
      "athlete_id": 123,
      "heat_number": 21
    }
  }
}
```

**Frontend Impact:**
- The "Best Heat Score" summary card is hidden when data is null
- Component at: `src/components/StatsSummaryCards.tsx`

**Investigation Needed:**
- Is the backend logic not calculating heat scores correctly?
- Is the database query missing heat score data?
- Should heat scores be the sum of all counting scores in a heat?

---

## Frontend Workarounds Implemented

1. **Conditional Rendering**: All components handle null/missing data gracefully
2. **Empty Arrays**: Top Heat Scores table accepts empty array without breaking
3. **Loading States**: Basic loading spinner while fetching data
4. **Gender Filter**: API call is triggered when user switches between Men/Women

---

## Next Steps for Backend Team

1. **High Priority**: Implement `top_heat_scores` array in stats response
2. **High Priority**: Fix `best_heat_score` calculation/query
3. **Medium Priority**: Consider adding pagination for top scores (if lists get very long)
4. **Low Priority**: Add caching to improve response times for frequently accessed events

---

## Testing Recommendations

Once the backend is updated, test with:
- Event ID: 14 (2025 Tenerife Grand Slam)
- Both Men and Women divisions
- Events with varying numbers of heats
- Edge cases: events with no heats, incomplete data

---

## Contact
Frontend implementation complete and ready to receive data.
Updated: 2025-11-09
Branch: `feature/event-stats-api-integration`
