# Athlete Stats API Specification

**Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** Ready for Implementation

---

## Overview

This document specifies the API endpoint required for the Athlete Stats detail panel on the Event Results page. The endpoint provides comprehensive statistics for a specific athlete in a specific event, including profile information, summary stats, move type analysis, heat scores, and detailed jump/wave scores.

**Frontend Implementation:** ✅ Complete (awaiting API)
**Components:** AthleteStatsTab, AthleteDetailPanel, AthleteHeatScoresChart, MoveTypeChart
**Use Case:** Display complete athlete performance statistics when user selects an athlete from dropdown

---

## Endpoint Definition

### Base Endpoint
```
GET /api/v1/events/{event_id}/athletes/{athlete_id}/stats
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | integer | Yes | Unique identifier for the event |
| `athlete_id` | integer | Yes | Unique identifier for the athlete |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sex` | string | No | Auto-detect | Gender division (`Women` or `Men`). Optional validation parameter. |

### Example Requests
```bash
# Basic request
GET /api/v1/events/123/athletes/456/stats

# With gender division specified
GET /api/v1/events/123/athletes/456/stats?sex=Women

# Men's division
GET /api/v1/events/123/athletes/789/stats?sex=Men
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "event_id": 123,
  "event_name": "2025 Tenerife Grand Slam",
  "sex": "Women",
  "athlete_id": 456,
  "profile": {
    "name": "Daida Ruano Moreno",
    "country": "Spain",
    "country_code": "ES",
    "profile_image": "https://cdn.example.com/athletes/456.jpg",
    "sponsors": "Bruch Boards, Severne Windsurfing, Maui Ultra Fins",
    "sail_number": "E-64"
  },
  "summary_stats": {
    "overall_position": 1,
    "best_heat_score": {
      "score": 23.58,
      "heat": "23a",
      "opponents": ["Kiefer Quintana", "Degrieck", "Offringa"]
    },
    "best_jump_score": {
      "score": 7.10,
      "heat": "19a",
      "move": "Forward Loop",
      "opponents": ["Katz", "Morales Navarro", "Wermeister"]
    },
    "best_wave_score": {
      "score": 6.75,
      "heat": "23a",
      "opponents": ["Kiefer Quintana", "Degrieck", "Offringa"]
    }
  },
  "move_type_scores": [
    {
      "move_type": "Forward Loop",
      "best_score": 7.10,
      "average_score": 5.65
    },
    {
      "move_type": "Backloop",
      "best_score": 6.75,
      "average_score": 6.11
    },
    {
      "move_type": "Wave",
      "best_score": 6.75,
      "average_score": 3.86
    }
  ],
  "heat_scores": [
    {
      "heat_number": "23a",
      "score": 23.58,
      "elimination_type": "Single"
    },
    {
      "heat_number": "22a",
      "score": 20.12,
      "elimination_type": "Single"
    },
    {
      "heat_number": "19a",
      "score": 19.11,
      "elimination_type": "Single"
    },
    {
      "heat_number": "50a",
      "score": 17.45,
      "elimination_type": "Double"
    },
    {
      "heat_number": "49a",
      "score": 17.13,
      "elimination_type": "Double"
    }
  ],
  "jump_scores": [
    {
      "heat_number": "19a",
      "move": "Forward Loop",
      "score": 7.10,
      "counting": true
    },
    {
      "heat_number": "19a",
      "move": "Backloop",
      "score": 6.75,
      "counting": true
    },
    {
      "heat_number": "49a",
      "move": "Backloop",
      "score": 6.50,
      "counting": true
    },
    {
      "heat_number": "19a",
      "move": "Forward Loop",
      "score": 6.50,
      "counting": false
    },
    {
      "heat_number": "23a",
      "move": "Forward Loop",
      "score": 6.38,
      "counting": true
    },
    {
      "heat_number": "23a",
      "move": "Backloop",
      "score": 6.20,
      "counting": true
    },
    {
      "heat_number": "22a",
      "move": "Backloop",
      "score": 6.00,
      "counting": true
    },
    {
      "heat_number": "50a",
      "move": "Forward Loop",
      "score": 5.38,
      "counting": true
    },
    {
      "heat_number": "22a",
      "move": "Backloop",
      "score": 5.12,
      "counting": false
    }
  ],
  "wave_scores": [
    {
      "heat_number": "23a",
      "score": 6.75,
      "counting": true,
      "wave_index": 1014
    },
    {
      "heat_number": "22a",
      "score": 6.00,
      "counting": true,
      "wave_index": 985
    },
    {
      "heat_number": "23a",
      "score": 4.25,
      "counting": true,
      "wave_index": 1012
    },
    {
      "heat_number": "49a",
      "score": 3.75,
      "counting": true,
      "wave_index": 2130
    },
    {
      "heat_number": "50a",
      "score": 3.75,
      "counting": true,
      "wave_index": 2138
    },
    {
      "heat_number": "22a",
      "score": 3.62,
      "counting": true,
      "wave_index": 986
    },
    {
      "heat_number": "50a",
      "score": 3.20,
      "counting": true,
      "wave_index": 2137
    },
    {
      "heat_number": "19a",
      "score": 2.88,
      "counting": true,
      "wave_index": 891
    }
  ],
  "metadata": {
    "total_heats": 5,
    "total_jumps": 9,
    "total_waves": 8,
    "generated_at": "2025-11-14T11:15:00Z"
  }
}
```

### Field Descriptions

#### Profile Section
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the athlete |
| `country` | string | Yes | Country name (without emoji) |
| `country_code` | string | Yes | ISO 3166-1 alpha-2 country code |
| `profile_image` | string | No | URL to athlete profile photo (null if not available) |
| `sponsors` | string | No | Comma-separated list of sponsors (null if not available) |
| `sail_number` | string | No | Competition sail number (null if not available) |

#### Summary Stats Section
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `overall_position` | integer | Yes | Final placement in event (1 = winner) |
| `best_heat_score.score` | number | Yes | Highest total heat score (2 decimal places) |
| `best_heat_score.heat` | string | Yes | Heat identifier for best heat |
| `best_heat_score.opponents` | array | No | List of opponent names in that heat (optional) |
| `best_jump_score.score` | number | Yes | Highest individual jump score |
| `best_jump_score.heat` | string | Yes | Heat identifier for best jump |
| `best_jump_score.move` | string | Yes | Move type name for best jump |
| `best_jump_score.opponents` | array | No | List of opponent names (optional) |
| `best_wave_score.score` | number | Yes | Highest individual wave score |
| `best_wave_score.heat` | string | Yes | Heat identifier for best wave |
| `best_wave_score.opponents` | array | No | List of opponent names (optional) |

#### Move Type Scores
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `move_type` | string | Yes | Name of move type (e.g., "Forward Loop", "Wave") |
| `best_score` | number | Yes | Best score achieved for this move type |
| `average_score` | number | Yes | Average score for this move type across all attempts |

#### Heat Scores
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heat_number` | string | Yes | Heat identifier (e.g., "19a", "23a") |
| `score` | number | Yes | Total heat score (sum of best jumps + best waves) |
| `elimination_type` | string | Yes | Either "Single" or "Double" |

#### Jump Scores
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heat_number` | string | Yes | Heat identifier where jump was performed |
| `move` | string | Yes | Move type performed |
| `score` | number | Yes | Individual jump score |
| `counting` | boolean | Yes | Whether this score counted toward heat total |

#### Wave Scores
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heat_number` | string | Yes | Heat identifier where wave was ridden |
| `score` | number | Yes | Individual wave score |
| `counting` | boolean | Yes | Whether this score counted toward heat total |
| `wave_index` | integer | No | Wave index number (optional, for tracking) |

### Error Responses

#### 404 Not Found - Event
```json
{
  "error": "Event not found",
  "event_id": 999,
  "message": "No event exists with ID 999"
}
```

#### 404 Not Found - Athlete
```json
{
  "error": "Athlete not found",
  "athlete_id": 888,
  "event_id": 123,
  "message": "Athlete 888 did not compete in event 123"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid sex parameter",
  "message": "sex must be 'Women' or 'Men'"
}
```

#### 400 Bad Request - Gender Mismatch
```json
{
  "error": "Gender mismatch",
  "athlete_id": 456,
  "event_id": 123,
  "expected_sex": "Women",
  "provided_sex": "Men",
  "message": "Athlete 456 competed in Women's division, not Men's"
}
```

---

## Data Requirements

### 1. Pre-Aggregation (CRITICAL)

**All statistics MUST be calculated on the backend.** Do not return raw data.

✅ **Required Calculations:**
- Overall position (tournament placement)
- Best heat score (highest total across all heats)
- Best jump score (highest individual jump)
- Best wave score (highest individual wave)
- Best and average score for each move type
- Total counts (heats, jumps, waves)
- Identify which scores counted toward heat totals

### 2. Sorting Requirements

All score arrays MUST be sorted by `score` in **descending order** (highest first):
- `move_type_scores`: Highest best_score first
- `heat_scores`: Highest heat score first
- `jump_scores`: Highest jump score first
- `wave_scores`: Highest wave score first

### 3. Data Completeness

**IMPORTANT:** Return ALL scores for the athlete, not just top scores.

The frontend handles display logic. Backend should return complete dataset:
- All heats the athlete competed in (5-10 typically)
- All jump attempts (10-50+ typically)
- All wave attempts (10-50+ typically)
- All move types attempted (not just successful ones)

### 4. Move Type Categories

Expected move types (add others as they appear in your data):
- `Wave` - Wave riding scores
- `Forward Loop` - Forward rotation jumps
- `Backloop` - Backward rotation jumps
- `Pushloop` - Push loop variations
- `Tabletop` - Tabletop jumps
- `Air Jibe` - Aerial transitions
- `Spock` - Spock rotations
- *(Any other move types in your database)*

### 5. Counting vs Non-Counting Scores

The `counting` field indicates whether a score contributed to the heat total:
- In most formats: Best 2-3 jumps + best 2-3 waves count
- Non-counting scores are still displayed in tables (for transparency)
- Must accurately reflect competition rules

### 6. Heat Number Format

Keep as strings: `"19a"`, `"23a"`, `"50a"` etc.
- Include the letter suffix (a, b, c) for heat instances
- Do not convert to integers

### 7. Opponents List

The `opponents` array is **optional** but valuable:
- Provides context for performance (who they were competing against)
- Only include first/last names (no full names if too long)
- Example: `["Kiefer Quintana", "Degrieck", "Offringa"]`
- Return `null` or omit field if opponent data unavailable

---

## Database Query Examples

### Profile and Summary Stats
```sql
-- Get athlete profile and basic stats
SELECT
  a.athlete_id,
  a.name,
  a.country,
  a.country_code,
  a.profile_image,
  a.sponsors,
  a.sail_number,
  er.overall_position
FROM athletes a
INNER JOIN event_results er ON a.athlete_id = er.athlete_id
WHERE a.athlete_id = ?
  AND er.event_id = ?
  AND er.sex = ?;
```

### Best Heat Score
```sql
-- Get best heat score with opponents
SELECT
  h.heat_number,
  h.total_score as score,
  ARRAY_AGG(DISTINCT opp.athlete_name) as opponents
FROM heat_results h
LEFT JOIN heat_results opp ON h.heat_id = opp.heat_id
  AND opp.athlete_id != h.athlete_id
WHERE h.athlete_id = ?
  AND h.event_id = ?
  AND h.sex = ?
GROUP BY h.heat_id, h.heat_number, h.total_score
ORDER BY h.total_score DESC
LIMIT 1;
```

### Best Jump Score
```sql
-- Get best jump score with details
SELECT
  m.score,
  m.heat_number,
  m.move_type as move,
  ARRAY_AGG(DISTINCT opp.athlete_name) as opponents
FROM move_scores m
LEFT JOIN heat_results hr ON m.heat_id = hr.heat_id
  AND hr.athlete_id != m.athlete_id
WHERE m.athlete_id = ?
  AND m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Jump'
GROUP BY m.move_score_id, m.score, m.heat_number, m.move_type
ORDER BY m.score DESC
LIMIT 1;
```

### Best Wave Score
```sql
-- Get best wave score
SELECT
  m.score,
  m.heat_number,
  ARRAY_AGG(DISTINCT opp.athlete_name) as opponents
FROM move_scores m
LEFT JOIN heat_results hr ON m.heat_id = hr.heat_id
  AND hr.athlete_id != m.athlete_id
WHERE m.athlete_id = ?
  AND m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Wave'
GROUP BY m.move_score_id, m.score, m.heat_number
ORDER BY m.score DESC
LIMIT 1;
```

### Move Type Statistics
```sql
-- Get best and average for each move type
SELECT
  move_type,
  MAX(score) as best_score,
  ROUND(AVG(score), 2) as average_score
FROM move_scores
WHERE athlete_id = ?
  AND event_id = ?
  AND sex = ?
  AND category = 'Jump'
GROUP BY move_type
ORDER BY best_score DESC;
```

### Heat Scores
```sql
-- Get all heat scores with elimination type
SELECT
  h.heat_number,
  h.total_score as score,
  h.elimination_type
FROM heat_results h
WHERE h.athlete_id = ?
  AND h.event_id = ?
  AND h.sex = ?
ORDER BY h.total_score DESC;
```

### Jump Scores
```sql
-- Get all jump attempts with counting status
SELECT
  m.heat_number,
  m.move_type as move,
  m.score,
  m.counting
FROM move_scores m
WHERE m.athlete_id = ?
  AND m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Jump'
ORDER BY m.score DESC;
```

### Wave Scores
```sql
-- Get all wave attempts with counting status
SELECT
  m.heat_number,
  m.score,
  m.counting,
  m.wave_index
FROM move_scores m
WHERE m.athlete_id = ?
  AND m.event_id = ?
  AND m.sex = ?
  AND m.category = 'Wave'
ORDER BY m.score DESC;
```

---

## Edge Cases

### 1. Wave-Only or Jump-Only Athlete

If an athlete only performed jumps or only waves (rare but possible):

```json
{
  "summary_stats": {
    "best_jump_score": null,  // Or omit entirely
    "best_wave_score": {
      "score": 7.50,
      "heat": "21a"
    }
  },
  "move_type_scores": [
    // Only include move types actually attempted
    { "move_type": "Wave", "best_score": 7.50, "average_score": 5.20 }
  ],
  "jump_scores": [],  // Empty array
  "wave_scores": [/* ... */]
}
```

**Frontend behavior:** Will hide empty sections/tables.

### 2. Missing Profile Data

If athlete information is incomplete:
```json
{
  "profile": {
    "name": "Unknown Athlete",
    "country": "Unknown",
    "country_code": "XX",
    "profile_image": null,
    "sponsors": null,
    "sail_number": null
  }
}
```

### 3. Tied Position

If multiple athletes share final position:
```json
{
  "summary_stats": {
    "overall_position": 3  // Both 3rd place athletes get position 3
  }
}
```

### 4. Incomplete Competition

If athlete withdrew or was disqualified:
```json
{
  "summary_stats": {
    "overall_position": null  // Or a special value like 999
  },
  "heat_scores": [/* Only heats completed */],
  "metadata": {
    "status": "withdrawn",  // Optional status field
    "total_heats": 2
  }
}
```

### 5. No Opponents Data Available

If opponent tracking isn't implemented:
```json
{
  "summary_stats": {
    "best_heat_score": {
      "score": 23.58,
      "heat": "23a",
      "opponents": null  // Or omit field entirely
    }
  }
}
```

### 6. Unusual Move Types

If athlete attempts non-standard moves:
```json
{
  "move_type_scores": [
    { "move_type": "Custom Move", "best_score": 5.50, "average_score": 5.50 },
    // ... standard moves
  ]
}
```

Include all move types, even if only attempted once.

---

## Performance Requirements

### Response Time
- **Target:** < 300ms
- **Maximum:** < 1 second

This endpoint returns more data than the athlete list, but should still be fast.

### Optimization Strategies

1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_heat_results_athlete_event ON heat_results(athlete_id, event_id, sex);
   CREATE INDEX idx_move_scores_athlete_event ON move_scores(athlete_id, event_id, sex, category, score DESC);
   CREATE INDEX idx_event_results_athlete ON event_results(athlete_id, event_id, sex);
   CREATE INDEX idx_move_scores_counting ON move_scores(athlete_id, event_id, counting);
   ```

2. **Caching:**
   - Cache this endpoint for 10-15 minutes
   - Invalidate cache when new heat results are added for this athlete/event
   - Key: `athlete_stats:{event_id}:{athlete_id}:{sex}`
   - Use Redis or similar

3. **Query Optimization:**
   - Use database aggregation functions (MAX, AVG)
   - Batch multiple queries if possible
   - Consider materialized views for complex stats
   - Use `EXPLAIN ANALYZE` to optimize slow queries

4. **Response Size:**
   - Typical response size: 5-15 KB
   - Maximum expected: 50 KB (for athletes with many attempts)
   - Use gzip compression

---

## TypeScript Interface (Frontend Reference)

```typescript
interface AthleteStatsResponse {
  event_id: number;
  event_name: string;
  sex: "Women" | "Men";
  athlete_id: number;
  profile: AthleteProfile;
  summary_stats: AthleteSummaryStats;
  move_type_scores: MoveTypeScore[];
  heat_scores: HeatScore[];
  jump_scores: JumpScore[];
  wave_scores: WaveScore[];
  metadata: {
    total_heats: number;
    total_jumps: number;
    total_waves: number;
    generated_at: string; // ISO 8601 format
  };
}

interface AthleteProfile {
  name: string;
  country: string;
  country_code: string;
  profile_image: string | null;
  sponsors: string | null;
  sail_number: string | null;
}

interface AthleteSummaryStats {
  overall_position: number;
  best_heat_score: {
    score: number;
    heat: string;
    opponents?: string[];
  };
  best_jump_score: {
    score: number;
    heat: string;
    move: string;
    opponents?: string[];
  };
  best_wave_score: {
    score: number;
    heat: string;
    opponents?: string[];
  };
}

interface MoveTypeScore {
  move_type: string;
  best_score: number;
  average_score: number;
}

interface HeatScore {
  heat_number: string;
  score: number;
  elimination_type: "Single" | "Double";
}

interface JumpScore {
  heat_number: string;
  move: string;
  score: number;
  counting: boolean;
}

interface WaveScore {
  heat_number: string;
  score: number;
  counting: boolean;
  wave_index?: number;
}
```

### Frontend Usage Example
```typescript
// Fetch detailed stats when athlete selected
const athleteId = 456;
const response = await fetch(`/api/v1/events/${eventId}/athletes/${athleteId}/stats?sex=Women`);
const data: AthleteStatsResponse = await response.json();

// Populate UI components
displayProfile(data.profile);
displaySummaryCards(data.summary_stats);
renderMoveTypeChart(data.move_type_scores);
renderHeatScoresChart(data.heat_scores);
populateJumpTable(data.jump_scores);
populateWaveTable(data.wave_scores);
```

---

## Testing Checklist

### Functional Tests
- [ ] Returns 404 if `event_id` doesn't exist
- [ ] Returns 404 if `athlete_id` doesn't exist or didn't compete in event
- [ ] Returns 400 if `sex` parameter is invalid
- [ ] Returns 400 if athlete competed in different gender division
- [ ] Returns correct data for athlete in Women's division
- [ ] Returns correct data for athlete in Men's division
- [ ] All scores sorted in descending order
- [ ] Best scores match actual data
- [ ] Average scores calculated correctly
- [ ] Counting flags are accurate
- [ ] All required fields present (no missing keys)

### Data Accuracy Tests
- [ ] `overall_position` matches actual tournament standing
- [ ] `best_heat_score` is truly the highest heat
- [ ] `best_jump_score` is truly the highest jump
- [ ] `best_wave_score` is truly the highest wave
- [ ] Move type averages are correct
- [ ] Heat scores sum correctly (jumps + waves)
- [ ] Counting scores match competition rules
- [ ] Opponent lists are accurate (when available)

### Performance Tests
- [ ] Response time < 300ms for typical athlete (5 heats, 20 attempts)
- [ ] Response time < 1s for high-volume athlete (10 heats, 50+ attempts)
- [ ] Handles concurrent requests (10+ simultaneous)
- [ ] Database queries optimized (no N+1 queries)
- [ ] Response size reasonable (< 50 KB)

### Edge Case Tests
- [ ] Athlete with no jumps (wave-only)
- [ ] Athlete with no waves (jump-only)
- [ ] Athlete with tied position
- [ ] Athlete who withdrew/DNF
- [ ] Missing profile data (no sponsors, image, sail number)
- [ ] Missing opponent data
- [ ] Unusual/custom move types
- [ ] Very high score counts (100+ attempts)

---

## Implementation Notes

### Decimal Precision
- Return all scores with 2 decimal places
- Example: `7.10` not `7.1` or `7.100`
- Use `ROUND(score, 2)` in SQL or equivalent

### Heat Number Format
- Keep as strings: `"19a"`, `"23a"`, `"50a"`
- Include letter suffix (a, b, c for heat instances)
- Do not convert to integers

### Elimination Type
- Must be either `"Single"` or `"Double"` (exact case)
- Single elimination: One loss eliminates
- Double elimination: Two losses eliminates
- Used for color coding in frontend chart

### Counting Flag Logic
- Based on competition rules (typically best 2-3 jumps + best 2-3 waves count)
- Must be calculated per heat
- Non-counting scores still displayed (for transparency)
- Should match official scoring system

### Opponents Array
- Optional field (can be `null` or omitted)
- If provided, include first/last names only
- Order doesn't matter
- Exclude the athlete themselves
- Example: `["Smith", "Jones", "Garcia"]`

### Profile Image
- Return full HTTPS URL
- Recommended size: 400x400px (or similar square aspect)
- Support formats: JPG, PNG, WebP
- Return `null` if unavailable
- Serve from CDN for best performance

### Sponsors Format
- Comma-separated string
- Example: `"Bruch Boards, Severne Windsurfing, Maui Ultra Fins"`
- Return `null` if unavailable
- Truncate if extremely long (> 200 chars)

### Naming Conventions
- Use `name` for full athlete name (not `athlete_name` in profile)
- Use `athlete_id` for identifiers
- Use `heat_number` (not `heat`, `heat_id`)
- Use `move_type` (not `move`, `type`)
- Use `elimination_type` (not `type`, `format`)
- Use snake_case for JSON keys

---

## Success Criteria

The API endpoint is ready for frontend integration when:

✅ Returns data matching the exact structure above
✅ All scores sorted correctly (descending)
✅ Best scores and averages calculated accurately
✅ Counting flags match competition rules
✅ Handles both Men and Women divisions
✅ Response time under 300ms
✅ All edge cases handled gracefully
✅ Null values for missing optional data
✅ Error responses follow standard format
✅ All required fields present
✅ Decimal precision correct (2 places)
✅ Heat numbers formatted correctly (with letters)
✅ Elimination types are valid ("Single"/"Double")

---

## Integration with Athlete List Endpoint

This endpoint works in conjunction with the **Athlete List endpoint**:

1. **User Flow:**
   - Frontend calls `/api/v1/events/{event_id}/athletes` to populate dropdown
   - User selects athlete (e.g., athlete_id = 456)
   - Frontend calls this endpoint: `/api/v1/events/{event_id}/athletes/456/stats`
   - Detail panel displays comprehensive stats

2. **Data Consistency:**
   - `athlete_id` must match between endpoints
   - `overall_position` should match between endpoints
   - `best_heat_score` in list should match `best_heat_score.score` in stats
   - Profile data should be consistent

3. **Performance:**
   - List endpoint loads first (fast, lightweight)
   - Stats endpoint loads on-demand (slower, heavier)
   - Consider preloading stats for winner (position 1)
   - Cache both endpoints aggressively

---

## Questions?

Contact frontend developer if clarification needed on:
- Data structure requirements
- Component rendering logic
- Chart/table display behavior
- Counting score calculation rules
- Future feature requirements (historical comparison, career stats, etc.)

---

**Document Version:** 1.0
**Created:** 2025-11-14
**Frontend Status:** ✅ Ready and waiting for API
**Backend Status:** ⏳ Awaiting implementation
