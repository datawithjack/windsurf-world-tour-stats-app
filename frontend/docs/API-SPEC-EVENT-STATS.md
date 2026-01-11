# Event Stats API Specification

**Version:** 1.0
**Last Updated:** 2025-11-09
**Status:** Ready for Implementation

---

## Overview

This document specifies the API endpoint required for the Event Stats page. The endpoint provides pre-aggregated statistics for a specific event, including summary cards, move type analysis, and top scores tables.

**Frontend Implementation:** ✅ Complete (awaiting API)
**Components:** StatsSummaryCards, EventStatsChart, TopScoresTable

---

## Endpoint Definition

### Base Endpoint
```
GET /api/v1/events/{event_id}/stats
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sex` | string | No | `Women` | Filter by gender division (`Women` or `Men`) |

### Example Requests
```bash
# Women's division (default)
GET /api/v1/events/123/stats

# Men's division
GET /api/v1/events/123/stats?sex=Men

# Explicit women's division
GET /api/v1/events/123/stats?sex=Women
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "event_id": 123,
  "event_name": "2025 Tenerife Grand Slam",
  "sex": "Women",
  "summary_stats": {
    "best_heat_score": {
      "score": 24.50,
      "athlete_name": "Degrieck",
      "athlete_id": 456,
      "heat_number": "21a"
    },
    "best_jump_score": {
      "score": 7.10,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "heat_number": "19a",
      "move_type": "Forward Loop"
    },
    "best_wave_score": {
      "score": 7.50,
      "athlete_name": "Degrieck",
      "athlete_id": 456,
      "heat_number": "21a"
    }
  },
  "move_type_stats": [
    {
      "move_type": "Wave",
      "best_score": 7.50,
      "average_score": 2.95,
      "best_scored_by": {
        "athlete_name": "Degrieck",
        "athlete_id": 456,
        "heat_number": "21a",
        "score": 7.50
      }
    },
    {
      "move_type": "Forward Loop",
      "best_score": 7.10,
      "average_score": 2.82,
      "best_scored_by": {
        "athlete_name": "Ruano Moreno",
        "athlete_id": 789,
        "heat_number": "19a",
        "score": 7.10
      }
    },
    {
      "move_type": "Backloop",
      "best_score": 6.95,
      "average_score": 4.82,
      "best_scored_by": {
        "athlete_name": "Offringa",
        "athlete_id": 321,
        "heat_number": "49a",
        "score": 6.95
      }
    },
    {
      "move_type": "Pushloop",
      "best_score": 6.88,
      "average_score": 4.29,
      "best_scored_by": {
        "athlete_name": "Ruano Moreno",
        "athlete_id": 789,
        "heat_number": "23a",
        "score": 6.88
      }
    },
    {
      "move_type": "Tabletop",
      "best_score": 2.12,
      "average_score": 1.08,
      "best_scored_by": {
        "athlete_name": "Snady",
        "athlete_id": 654,
        "heat_number": "45a",
        "score": 2.12
      }
    }
  ],
  "top_heat_scores": [
    {
      "rank": 1,
      "athlete_name": "Degrieck",
      "athlete_id": 456,
      "score": 24.50,
      "heat_number": "21a"
    },
    {
      "rank": 2,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 23.95,
      "heat_number": "49a"
    },
    {
      "rank": 3,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 23.63,
      "heat_number": "20a"
    },
    {
      "rank": 4,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "score": 23.58,
      "heat_number": "23a"
    },
    {
      "rank": 5,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 21.69,
      "heat_number": "48a"
    }
    // ... continue for ALL heat scores (not just top 10)
  ],
  "top_jump_scores": [
    {
      "rank": 1,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "score": 7.10,
      "move_type": "Forward Loop",
      "heat_number": "19a"
    },
    {
      "rank": 2,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 6.95,
      "move_type": "Backloop",
      "heat_number": "49a"
    },
    {
      "rank": 3,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 6.88,
      "move_type": "Backloop",
      "heat_number": "20a"
    },
    {
      "rank": 4,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 6.88,
      "move_type": "Backloop",
      "heat_number": "23a"
    },
    {
      "rank": 5,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "score": 6.75,
      "move_type": "Backloop",
      "heat_number": "19a"
    }
    // ... continue for ALL jump scores
  ],
  "top_wave_scores": [
    {
      "rank": 1,
      "athlete_name": "Degrieck",
      "athlete_id": 456,
      "score": 7.50,
      "heat_number": "21a"
    },
    {
      "rank": 2,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "score": 6.75,
      "heat_number": "23a"
    },
    {
      "rank": 3,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 6.12,
      "heat_number": "20a"
    },
    {
      "rank": 4,
      "athlete_name": "Offringa",
      "athlete_id": 321,
      "score": 6.12,
      "heat_number": "49a"
    },
    {
      "rank": 5,
      "athlete_name": "Ruano Moreno",
      "athlete_id": 789,
      "score": 6.00,
      "heat_number": "22a"
    }
    // ... continue for ALL wave scores
  ],
  "metadata": {
    "total_heats": 52,
    "total_athletes": 26,
    "generated_at": "2025-11-09T17:45:00Z"
  }
}
```

### Error Responses

#### 404 Not Found
```json
{
  "error": "Event not found",
  "event_id": 999,
  "message": "No event exists with ID 999"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid sex parameter",
  "message": "sex must be 'Women' or 'Men'"
}
```

---

## Data Requirements

### 1. Pre-Aggregation (CRITICAL)

**All statistics MUST be calculated on the backend.** Do not return raw data.

✅ **Required Calculations:**
- Best heat score across all heats
- Best jump score and which move type
- Best wave score
- Best and average score for each move type
- All heat scores sorted descending
- All jump scores sorted descending
- All wave scores sorted descending

### 2. Sorting Requirements

All score arrays MUST be sorted by `score` in **descending order** (highest first):
- `top_heat_scores`: Highest total heat score first
- `top_jump_scores`: Highest individual jump score first
- `top_wave_scores`: Highest individual wave score first
- `move_type_stats`: Highest best_score first

### 3. Ranking

Include `rank` field in all top score arrays:
- Rank starts at 1
- Handle ties appropriately (see Edge Cases section)
- Rank numbers should be sequential

### 4. Data Completeness

**IMPORTANT:** Return ALL scores, not just top 10.

The frontend handles pagination/limiting. Backend should return complete dataset:
- All heat scores (might be 50+ entries)
- All jump scores (might be 100+ entries)
- All wave scores (might be 100+ entries)

### 5. Move Type Categories

Expected move types (add others as they appear in your data):
- `Wave`
- `Forward Loop`
- `Backloop`
- `Pushloop`
- `Tabletop`
- `Air Jibe`
- `Spock`
- *(Any other move types in your database)*

---

## Database Query Examples

### Best Heat Score
```sql
SELECT
  h.athlete_name,
  h.athlete_id,
  h.heat_number,
  h.total_score as score
FROM heat_results h
WHERE h.event_id = ?
  AND h.sex = ?
ORDER BY h.total_score DESC
LIMIT 1;
```

### Move Type Statistics
```sql
-- Get best and average for each move type
SELECT
  m.move_type,
  MAX(m.score) as best_score,
  AVG(m.score) as average_score
FROM move_scores m
WHERE m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Jump'  -- or 'Wave'
GROUP BY m.move_type
ORDER BY best_score DESC;

-- Get athlete who scored the best for each move type
SELECT DISTINCT ON (m.move_type)
  m.move_type,
  m.score,
  m.athlete_name,
  m.athlete_id,
  m.heat_number
FROM move_scores m
WHERE m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Jump'
ORDER BY m.move_type, m.score DESC;
```

### Top Heat Scores
```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank,
  athlete_name,
  athlete_id,
  heat_number,
  total_score as score
FROM heat_results
WHERE event_id = ?
  AND sex = ?
ORDER BY total_score DESC;
```

### Top Jump/Wave Scores
```sql
SELECT
  ROW_NUMBER() OVER (ORDER BY score DESC) as rank,
  athlete_name,
  athlete_id,
  score,
  move_type,
  heat_number
FROM move_scores
WHERE event_id = ?
  AND sex = ?
  AND category = 'Jump'  -- or 'Wave'
ORDER BY score DESC;
```

---

## Edge Cases

### 1. Wave-Only or Jump-Only Events

If an event has no jump scores (wave-only) or no wave scores (jump-only):

```json
{
  "summary_stats": {
    "best_jump_score": null,  // or omit entirely
    // ... other stats
  },
  "top_jump_scores": [],  // Empty array
  "move_type_stats": [
    // Only include move types that exist
    { "move_type": "Wave", ... }
  ]
}
```

**Frontend behavior:** Will hide cards/tables with empty arrays.

### 2. Tied Scores

When multiple athletes have the same score:

**Option A: Same Rank (Recommended)**
```json
[
  { "rank": 1, "athlete_name": "Athlete A", "score": 7.50 },
  { "rank": 2, "athlete_name": "Athlete B", "score": 7.10 },
  { "rank": 3, "athlete_name": "Athlete C", "score": 6.88 },
  { "rank": 3, "athlete_name": "Athlete D", "score": 6.88 },
  { "rank": 5, "athlete_name": "Athlete E", "score": 6.75 }
]
```

**Option B: Sequential Rank**
```json
[
  { "rank": 1, "athlete_name": "Athlete A", "score": 7.50 },
  { "rank": 2, "athlete_name": "Athlete B", "score": 7.10 },
  { "rank": 3, "athlete_name": "Athlete C", "score": 6.88 },
  { "rank": 4, "athlete_name": "Athlete D", "score": 6.88 },
  { "rank": 5, "athlete_name": "Athlete E", "score": 6.75 }
]
```

Choose one approach and be consistent.

### 3. Missing Data

If athlete name is missing:
```json
{
  "athlete_name": "Unknown Athlete",
  "athlete_id": null
}
```

If heat number is missing:
```json
{
  "heat_number": "N/A"
}
```

### 4. No Data Available

If event has no completed heats:
```json
{
  "summary_stats": {
    "best_heat_score": null,
    "best_jump_score": null,
    "best_wave_score": null
  },
  "move_type_stats": [],
  "top_heat_scores": [],
  "top_jump_scores": [],
  "top_wave_scores": [],
  "metadata": {
    "total_heats": 0,
    "total_athletes": 0,
    "generated_at": "2025-11-09T17:45:00Z"
  }
}
```

---

## Performance Requirements

### Response Time
- **Target:** < 500ms
- **Maximum:** < 2 seconds

### Optimization Strategies

1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_heat_results_event_sex ON heat_results(event_id, sex, total_score DESC);
   CREATE INDEX idx_move_scores_event_sex ON move_scores(event_id, sex, category, score DESC);
   CREATE INDEX idx_move_scores_move_type ON move_scores(event_id, sex, move_type, score DESC);
   ```

2. **Caching:**
   - Cache this endpoint for 5-10 minutes
   - Invalidate cache when new heat results are added
   - Use Redis or similar for caching

3. **Query Optimization:**
   - Use database aggregation functions (not application loops)
   - Limit subqueries where possible
   - Use `EXPLAIN ANALYZE` to optimize slow queries

---

## TypeScript Interface (Frontend Reference)

```typescript
interface EventStatsResponse {
  event_id: number;
  event_name: string;
  sex: "Women" | "Men";
  summary_stats: {
    best_heat_score: ScoreDetail;
    best_jump_score: ScoreDetail & { move_type: string };
    best_wave_score: ScoreDetail;
  };
  move_type_stats: MoveTypeStat[];
  top_heat_scores: ScoreEntry[];
  top_jump_scores: (ScoreEntry & { move_type: string })[];
  top_wave_scores: ScoreEntry[];
  metadata: {
    total_heats: number;
    total_athletes: number;
    generated_at: string; // ISO 8601 format
  };
}

interface ScoreDetail {
  score: number;
  athlete_name: string;
  athlete_id: number;
  heat_number: string;
}

interface MoveTypeStat {
  move_type: string;
  best_score: number;
  average_score: number;
  best_scored_by: {
    athlete_name: string;
    athlete_id: number;
    heat_number: string;
    score: number;
  };
}

interface ScoreEntry {
  rank: number;
  athlete_name: string;
  athlete_id: number;
  score: number;
  heat_number: string;
  move_type?: string; // Only present in jump scores
}
```

---

## Testing Checklist

### Functional Tests
- [ ] Returns 404 if `event_id` doesn't exist
- [ ] Returns 400 if `sex` parameter is invalid
- [ ] Returns correct data for Women's division
- [ ] Returns correct data for Men's division
- [ ] Handles wave-only events (empty jump arrays)
- [ ] Handles jump-only events (empty wave arrays)
- [ ] All scores sorted in descending order
- [ ] Rank numbers are correct and sequential
- [ ] Best scores match actual data
- [ ] Average scores calculated correctly
- [ ] All required fields present (no missing keys)

### Performance Tests
- [ ] Response time < 500ms for typical event (50 heats)
- [ ] Response time < 2s for large event (100+ heats)
- [ ] Handles concurrent requests (10+ simultaneous)
- [ ] Database queries optimized (no N+1 queries)

### Edge Case Tests
- [ ] Event with no completed heats
- [ ] Event with tied scores
- [ ] Event with missing athlete names
- [ ] Event with 100+ athletes
- [ ] Event with unusual move types

---

## Implementation Notes

### Decimal Precision
- Return all scores with 2 decimal places
- Example: `7.10` not `7.1`
- Use `ROUND(score, 2)` in SQL or equivalent

### Heat Number Format
- Keep as strings: `"21a"`, `"19b"`, etc.
- Do not convert to integers

### Athlete IDs
- Always include `athlete_id` for linking to athlete pages
- Use consistent ID format across all endpoints

### Naming Conventions
- Use `athlete_name` (not `rider`, `name`, `athlete`)
- Use `heat_number` (not `heat`, `heat_id`)
- Use `move_type` (not `move`, `type`)
- Use snake_case for JSON keys

---

## Success Criteria

The API endpoint is ready for frontend integration when:

✅ Returns data matching the exact structure above
✅ All scores sorted correctly (descending)
✅ Rank numbers are accurate
✅ Handles both Men and Women divisions
✅ Response time under 500ms
✅ All edge cases handled gracefully
✅ Empty arrays for missing data (not null)
✅ Error responses follow standard format
✅ All required fields present
✅ Decimal precision correct (2 places)

---

## Known API Issues (Current Implementation)

**Last Updated:** 2026-01-03

### Issue 1: `best_heat_score` Returns `null`

**Status:** 🔴 Critical
**Endpoint:** `GET /api/v1/events/{event_id}/stats`
**Field:** `summary_stats.best_heat_score`

**Problem:**
```json
{
  "summary_stats": {
    "best_heat_score": null,  ← Always null
    "best_jump_score": { ... },  ← Works fine
    "best_wave_score": { ... }   ← Works fine
  }
}
```

**Expected Behavior:**
Should return the highest total heat score:
```json
"best_heat_score": {
  "score": 24.50,
  "athlete_name": "Degrieck",
  "athlete_id": 456,
  "heat_number": "21a"
}
```

**Impact:**
- "Best Heat Score" summary card never displays on frontend
- Users cannot see best overall performance

**Fix Required:**
Backend needs to calculate `MAX(total_heat_score)` and return athlete/heat details.

---

### Issue 2: `top_heat_scores` Returns Empty Array

**Status:** 🔴 Critical
**Endpoint:** `GET /api/v1/events/{event_id}/stats`
**Field:** `top_heat_scores`

**Problem:**
```json
{
  "top_heat_scores": [],  ← Always empty array
  "top_jump_scores": [...],  ← Populated correctly
  "top_wave_scores": [...]   ← Populated correctly
}
```

**Expected Behavior:**
Should return ALL heat total scores sorted descending:
```json
"top_heat_scores": [
  {
    "rank": 1,
    "athlete_name": "Degrieck",
    "athlete_id": 456,
    "score": 24.50,
    "heat_number": "21a"
  },
  {
    "rank": 2,
    "athlete_name": "Offringa",
    "athlete_id": 321,
    "score": 23.95,
    "heat_number": "49a"
  },
  // ... ALL heat scores
]
```

**Impact:**
- "Top Heat Scores" table shows "Heat scores data not available from API" message
- Cannot display leaderboard of best heat performances
- Side-by-side layout with bar chart has empty right panel

**Fix Required:**
Backend needs to query all heat_results and return sorted by total_score DESC.

---

### Issue 3: `best_by` Field Name Inconsistency

**Status:** ✅ Resolved (2026-01-03)
**Endpoint:** `GET /api/v1/events/{event_id}/stats`
**Field:** `move_type_stats[].best_scored_by`

**Resolution:**
API correctly uses `best_scored_by` matching the specification. Frontend types and data transformation updated to use `best_scored_by`.

**Changes Made:**
- Updated `MoveTypeStat` interface in `src/types/index.ts` to use `best_scored_by`
- Updated data transformation in `EventResultsPage.tsx` to read `stat.best_scored_by`
- Bar chart tooltip now correctly displays athlete name and heat number

---

### Issue 4: Multiple Athletes with Same Best Score Not Indicated

**Status:** 🟡 Medium
**Endpoint:** `GET /api/v1/events/{event_id}/stats`
**Field:** `move_type_stats[].best_by`

**Problem:**
When multiple athletes achieve the same best score (e.g., three athletes with 10.0), the API only returns one:

```json
{
  "move_type": "Pushloop Forward",
  "best_score": 10.0,
  "best_by": {
    "athlete_name": "Marcilio Browne",  ← Only shows one
    "heat_number": "1830_48a",
    "score": 10.0
  }
}
```

**Reality from `top_jump_scores`:**
```json
"top_jump_scores": [
  { "rank": 1, "athlete_name": "Marcilio Browne", "score": 10.0, "move_type": "Pushloop Forward" },
  { "rank": 2, "athlete_name": "Marino Gil Gherardi", "score": 10.0, "move_type": "Pushloop Forward" },
  { "rank": 3, "athlete_name": "Philip Köster", "score": 10.0, "move_type": "Pushloop Forward" },
  // ... 3 athletes tied at 10.0!
]
```

**Expected Behavior (Option A):**
Return all tied athletes:
```json
"best_by": [
  { "athlete_name": "Marcilio Browne", "heat_number": "1830_48a", "score": 10.0 },
  { "athlete_name": "Marino Gil Gherardi", "heat_number": "1830_48a", "score": 10.0 },
  { "athlete_name": "Philip Köster", "heat_number": "1830_50a", "score": 10.0 }
]
```

**Expected Behavior (Option B - Simpler):**
Add a tied count field:
```json
"best_by": {
  "athlete_name": "Marcilio Browne",
  "heat_number": "1830_48a",
  "score": 10.0,
  "tied_count": 3  ← New field indicating 3 athletes share this score
}
```

**Impact:**
- Bar chart tooltip shows incomplete information
- Users don't know if multiple athletes achieved the same best score
- Misleading display when ties exist

**Example Affected:**
Event 12 (2025 Gran Canaria), Men's division:
- Pushloop Forward: 3 athletes with 10.0
- Only "Marcilio Browne" shown in chart tooltip

**Fix Required:**
Backend should either:
- Count tied athletes and add `tied_count` field (Option B - recommended)
- Return array of all tied athletes (Option A)

---

### Issue 5: Bar Chart Tooltip Not Displaying Athlete/Heat Info

**Status:** ✅ Resolved (2026-01-03)
**Component:** `EventStatsChart.tsx` and `EventResultsPage.tsx`
**Root Cause:** Field name mismatch - frontend using `best_by`, API returning `best_scored_by`

**Problem:**
When hovering over "Best Score" (teal) bars in the bar chart, tooltip showed:
- Move type ✓
- Score ✓
- "Heat" label ✗ (shows label but no heat number)
- Athlete name ✗ (missing entirely)

**Root Cause:**
Frontend code was looking for `stat.best_by` but API correctly returns `stat.best_scored_by` per specification.

**Resolution:**
1. Updated `MoveTypeStat` interface to use `best_scored_by` instead of `best_by`
2. Updated data transformation in `EventResultsPage.tsx` to read `stat.best_scored_by`
3. Updated `EventStatsChart.tsx` tooltip to use `data.bestBy !== null` check
4. Added comprehensive debug logging to both components

**Changes Made:**
- `src/types/index.ts`: Changed `best_by` → `best_scored_by` in MoveTypeStat interface
- `src/pages/EventResultsPage.tsx`: Updated data transformation to use `best_scored_by`
- `src/components/EventStatsChart.tsx`: Improved tooltip null checking

**Tooltip Now Displays:**
```
Backloop
Best: 5.50 pts
Pauline Katz
Heat 1904_14a
```

---

## Additional Frontend Improvements (2026-01-03)

### Top Jump/Wave Scores Tables - Tooltip Enhancement

**Change:** Removed "Heat No" column and added hover tooltips

**Before:**
- Tables had 4 columns including visible "Heat No" column
- Cluttered display with redundant information

**After:**
- Jump scores: 4 columns → 3 columns (# | Rider | Score | Move)
- Wave scores: 4 columns → 3 columns (# | Rider | Score)
- Hover over any row to see heat number in tooltip
- Added `cursor-help` to indicate tooltip availability

**Implementation:**
- Added `title={Heat ${entry.heatNo}}` attribute to table rows
- Added `cursor-help` CSS class for visual feedback
- Cleaner, more compact table layout

**Files Changed:**
- `src/pages/EventResultsPage.tsx` (lines 387-447)

---

**Investigation Notes (Kept for Reference):**
- Check if `stat.best_by` exists in API response
- Verify data transformation correctly maps `athlete_name` → `athlete`
- Confirm tooltip receives populated `data.bestBy` object

**Temporary Workaround:**
Add defensive null checking and fallback text in tooltip:
```typescript
<p className="text-xs text-gray-400">
  {data.bestBy?.athlete || 'Unknown'}
</p>
<p className="text-xs text-gray-400">
  Heat {data.bestBy?.heat || 'N/A'}
</p>
```

---

## API Issues Summary

| Issue | Severity | Status | Frontend Impact |
|-------|----------|--------|-----------------|
| `best_heat_score` always null | 🔴 Critical | Needs backend fix | Summary card hidden |
| `top_heat_scores` empty array | 🔴 Critical | Needs backend fix | Table shows "no data" |
| `best_by` vs `best_scored_by` | 🟡 Medium | Working, needs doc update | None (adapted) |
| Tied scores not indicated | 🟡 Medium | Needs backend enhancement | Incomplete info |
| Tooltip not showing data | 🔴 Critical | Investigating | Poor UX |

**Priority Fix Order:**
1. Fix `best_heat_score` calculation (Issue #1)
2. Populate `top_heat_scores` array (Issue #2)
3. Fix tooltip display (Issue #5)
4. Add tied score indicator (Issue #4)
5. Update spec naming (Issue #3)

---

## Questions?

Contact frontend developer if clarification needed on:
- Data structure requirements
- Frontend component behavior
- Display logic
- Future feature requirements

---

**Document Version:** 1.0
**Created:** 2025-11-09
**Frontend Status:** ✅ Ready and waiting for API
**Backend Status:** ⏳ Awaiting implementation
