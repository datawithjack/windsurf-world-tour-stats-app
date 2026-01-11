# API Update Request: Athlete Stats Endpoint

**Date:** 2025-01-10
**Priority:** High
**Endpoint:** `GET /api/v1/events/{event_id}/athletes/{athlete_id}/stats`
**Impact:** Non-breaking (additive changes only)

---

## Summary

The frontend needs additional data from the athlete stats endpoint to support new filtering features. Currently, the API only returns heats where the athlete achieved their best/counting scores. We need **all heats** the athlete competed in.

---

## Current Problem

When viewing Philip Köster's stats, the heat filter dropdown only shows 3 heats, but he competed in 6+ heats during the event. This is because the API only returns data for heats containing his best scores.

**Current behavior:**
```json
{
  "heat_scores": [
    { "heat_number": "49a", "score": 24.50 },
    { "heat_number": "23a", "score": 22.30 },
    { "heat_number": "19a", "score": 21.10 }
  ]
}
```

**Expected behavior:**
```json
{
  "heat_scores": [
    { "heat_number": "49a", "score": 24.50 },
    { "heat_number": "48a", "score": 19.80 },
    { "heat_number": "23a", "score": 22.30 },
    { "heat_number": "22a", "score": 18.50 },
    { "heat_number": "19a", "score": 21.10 },
    { "heat_number": "18a", "score": 17.20 }
  ]
}
```

---

## Required Changes

### 1. Return ALL Heat Scores

**Current:** Only heats with best/top scores
**Required:** Every heat the athlete competed in

```sql
-- Current query (assumed)
SELECT heat_number, score, ...
FROM heat_results
WHERE athlete_id = ? AND event_id = ?
ORDER BY score DESC
LIMIT 10;  -- Remove this limit

-- Updated query
SELECT heat_number, score, elimination_type, round_name
FROM heat_results
WHERE athlete_id = ? AND event_id = ?
ORDER BY score DESC;  -- No limit, return all
```

---

### 2. Return ALL Jump Scores

**Current:** Only counting/best jumps
**Required:** Every jump attempt (with `counting` flag to indicate if it counted)

The `counting: boolean` field already exists in the spec - just ensure non-counting jumps are also returned.

```sql
-- Return ALL jumps, not just counting ones
SELECT heat_number, move_type, score, counting, round_name
FROM move_scores
WHERE athlete_id = ? AND event_id = ? AND category = 'Jump'
ORDER BY score DESC;
```

---

### 3. Return ALL Wave Scores

**Current:** Only counting/best waves
**Required:** Every wave attempt (with `counting` flag)

```sql
-- Return ALL waves, not just counting ones
SELECT heat_number, score, counting, wave_index, round_name
FROM move_scores
WHERE athlete_id = ? AND event_id = ? AND category = 'Wave'
ORDER BY score DESC;
```

---

### 4. Add `round_name` to All Score Types (if missing)

The frontend filter needs `round_name` for each score. Please ensure it's included:

**heat_scores:**
```json
{
  "heat_number": "49a",
  "round_name": "Quarter Final",  // ← Ensure this is included
  "score": 24.50,
  "elimination_type": "Single"
}
```

**jump_scores:**
```json
{
  "heat_number": "49a",
  "round_name": "Quarter Final",  // ← Ensure this is included
  "move": "Forward Loop",
  "score": 7.10,
  "counting": true
}
```

**wave_scores:**
```json
{
  "heat_number": "49a",
  "round_name": "Quarter Final",  // ← Ensure this is included
  "score": 6.75,
  "counting": true,
  "wave_index": 2130
}
```

---

## Backwards Compatibility

These changes are **non-breaking**:

| Change | Impact |
|--------|--------|
| Return more heat_scores | ✅ Safe - frontend already handles arrays of any length |
| Return more jump_scores | ✅ Safe - frontend already handles arrays of any length |
| Return more wave_scores | ✅ Safe - frontend already handles arrays of any length |
| Add round_name field | ✅ Safe - additive field, frontend already expects it |

**No frontend code changes required** - we just need more complete data.

---

## Data Volume Expectations

Per athlete per event:

| Data Type | Current | Expected |
|-----------|---------|----------|
| heat_scores | 3-5 | 5-10 heats |
| jump_scores | 10-15 | 20-50 attempts |
| wave_scores | 10-15 | 20-50 attempts |

Total response size increase: ~2-5 KB (negligible)

---

## Verification

After the update, for an athlete like Philip Köster:

1. **heat_scores** should contain ALL heats he competed in (typically 5-8)
2. **jump_scores** should contain ALL jump attempts (including `counting: false`)
3. **wave_scores** should contain ALL wave attempts (including `counting: false`)
4. Each score should have both `heat_number` and `round_name`

---

## Example Response (Complete)

```json
{
  "event_id": 123,
  "athlete_id": 456,
  "heat_scores": [
    { "heat_number": "49a", "round_name": "Final", "score": 24.50, "elimination_type": "Single" },
    { "heat_number": "48a", "round_name": "Semi Final", "score": 22.30, "elimination_type": "Single" },
    { "heat_number": "23a", "round_name": "Quarter Final", "score": 21.10, "elimination_type": "Single" },
    { "heat_number": "22a", "round_name": "Round 4", "score": 19.80, "elimination_type": "Single" },
    { "heat_number": "19a", "round_name": "Round 3", "score": 18.50, "elimination_type": "Double" },
    { "heat_number": "18a", "round_name": "Round 2", "score": 17.20, "elimination_type": "Double" }
  ],
  "jump_scores": [
    { "heat_number": "49a", "round_name": "Final", "move": "Forward Loop", "score": 7.10, "counting": true },
    { "heat_number": "49a", "round_name": "Final", "move": "Backloop", "score": 6.80, "counting": true },
    { "heat_number": "49a", "round_name": "Final", "move": "Pushloop", "score": 5.20, "counting": false },
    { "heat_number": "48a", "round_name": "Semi Final", "move": "Forward Loop", "score": 6.50, "counting": true },
    // ... all other jump attempts
  ],
  "wave_scores": [
    { "heat_number": "49a", "round_name": "Final", "score": 6.75, "counting": true, "wave_index": 2130 },
    { "heat_number": "49a", "round_name": "Final", "score": 5.50, "counting": true, "wave_index": 2131 },
    { "heat_number": "49a", "round_name": "Final", "score": 4.20, "counting": false, "wave_index": 2132 },
    { "heat_number": "48a", "round_name": "Semi Final", "score": 6.00, "counting": true, "wave_index": 2050 },
    // ... all other wave attempts
  ]
}
```

---

## Questions?

Contact me if you need clarification on:
- Which fields are required vs optional
- Expected data formats
- How the frontend uses this data

Thanks!
