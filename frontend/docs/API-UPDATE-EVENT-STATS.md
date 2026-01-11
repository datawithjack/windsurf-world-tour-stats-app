# API Update Request: Event Stats Endpoint

**Date:** 2025-01-10
**Priority:** High
**Endpoint:** `GET /api/v1/events/{event_id}/stats`
**Impact:** Non-breaking (additive changes only)

---

## Summary

Two issues with the event stats endpoint are preventing frontend features from working:

1. **Missing `athlete_id`** in top scores - prevents navigation to athlete detail
2. **Only 10 scores returned** - prevents "show more" feature from working

---

## Issue 1: Missing `athlete_id` in Top Scores

### Problem

When users click an athlete name in the "Top Heat Scores" table, nothing happens. The frontend needs `athlete_id` to navigate to that athlete's stats page.

### Current Response

```json
{
  "top_heat_scores": [
    {
      "rank": 1,
      "athlete_name": "Philip Köster",
      "score": 24.50,
      "heat_number": "49a"
    }
  ]
}
```

### Required Response

```json
{
  "top_heat_scores": [
    {
      "rank": 1,
      "athlete_name": "Philip Köster",
      "athlete_id": 456,           // ← ADD THIS
      "score": 24.50,
      "heat_number": "49a"
    }
  ]
}
```

### Affected Arrays

Add `athlete_id` to all three:

- `top_heat_scores[]`
- `top_jump_scores[]`
- `top_wave_scores[]`

### SQL Update

```sql
-- Add athlete_id to the SELECT
SELECT
  rank,
  athlete_name,
  athlete_id,      -- ← Add this
  score,
  heat_number,
  move_type        -- for jumps only
FROM ...
```

---

## Issue 2: Only Top 10 Scores Returned

### Problem

The frontend has a dropdown to show 10/25/50 rows, but the API only returns 10 scores. Users can't see beyond the top 10.

### Current Behavior

```json
{
  "top_heat_scores": [
    // Only 10 items, even if 50+ athletes competed
  ]
}
```

### Required Behavior

Return **ALL scores**, not just top 10. The frontend handles pagination.

```json
{
  "top_heat_scores": [
    // All heat scores (could be 30-100+ entries)
  ],
  "top_jump_scores": [
    // All jump scores (could be 100-500+ entries)
  ],
  "top_wave_scores": [
    // All wave scores (could be 100-500+ entries)
  ]
}
```

### SQL Update

```sql
-- Remove LIMIT clause
SELECT ...
FROM move_scores
WHERE event_id = ? AND sex = ?
ORDER BY score DESC
-- LIMIT 10  ← Remove this
```

---

## Complete Required Format

### top_heat_scores

```json
{
  "top_heat_scores": [
    {
      "rank": 1,
      "athlete_name": "Philip Köster",
      "athlete_id": 456,            // ← Required
      "score": 24.50,
      "heat_number": "49a"
    },
    {
      "rank": 2,
      "athlete_name": "Victor Fernandez",
      "athlete_id": 789,            // ← Required
      "score": 23.80,
      "heat_number": "48a"
    }
    // ... ALL heat scores, not just top 10
  ]
}
```

### top_jump_scores

```json
{
  "top_jump_scores": [
    {
      "rank": 1,
      "athlete_name": "Philip Köster",
      "athlete_id": 456,            // ← Required
      "score": 7.10,
      "heat_number": "49a",
      "move_type": "Forward Loop"
    }
    // ... ALL jump scores
  ]
}
```

### top_wave_scores

```json
{
  "top_wave_scores": [
    {
      "rank": 1,
      "athlete_name": "Sarah-Quita Offringa",
      "athlete_id": 321,            // ← Required
      "score": 6.95,
      "heat_number": "49a"
    }
    // ... ALL wave scores
  ]
}
```

---

## Backwards Compatibility

| Change | Impact |
|--------|--------|
| Add `athlete_id` field | ✅ Safe - additive field |
| Return more than 10 scores | ✅ Safe - frontend already slices with `.slice(0, limit)` |

**No frontend code changes required.**

---

## Data Volume Expectations

For a typical event with 30-50 athletes:

| Data Type | Current | Expected |
|-----------|---------|----------|
| top_heat_scores | 10 | 50-200 entries |
| top_jump_scores | 10 | 200-500 entries |
| top_wave_scores | 10 | 200-500 entries |

**Response size increase:** ~20-50 KB (acceptable)

Consider gzip compression if not already enabled.

---

## Verification Checklist

After the update:

- [ ] Each score in `top_heat_scores` has `athlete_id` (number)
- [ ] Each score in `top_jump_scores` has `athlete_id` (number)
- [ ] Each score in `top_wave_scores` has `athlete_id` (number)
- [ ] More than 10 scores returned per category
- [ ] Scores still sorted by `score` descending
- [ ] `rank` field still accurate (1, 2, 3, ...)

---

## Testing

```bash
# Fetch event stats
curl "/api/v1/events/123/stats?sex=Women"

# Verify athlete_id exists
jq '.top_heat_scores[0].athlete_id' response.json
# Should return a number like 456, not null

# Verify more than 10 scores
jq '.top_heat_scores | length' response.json
# Should return > 10 if event had > 10 heat scores
```

---

## Questions?

Let me know if you need clarification on field types or expected behavior.

Thanks!
