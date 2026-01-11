# Athlete List API Specification

**Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** Ready for Implementation

---

## Overview

This document specifies the API endpoint required for populating the athlete selector dropdown on the Event Results page's Athlete Stats tab. The endpoint provides a list of all athletes who competed in a specific event, with basic profile information and their final placement.

**Frontend Implementation:** ✅ Complete (awaiting API)
**Components:** AthleteStatsTab (dropdown selector)
**Use Case:** Populate athlete dropdown to allow user to select an athlete and view their detailed stats

---

## Endpoint Definition

### Base Endpoint
```
GET /api/v1/events/{event_id}/athletes
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | integer | Yes | Unique identifier for the event |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sex` | string | No | `Women` | Filter by gender division (`Women` or `Men`) |

### Example Requests
```bash
# Women's division (default)
GET /api/v1/events/123/athletes

# Men's division
GET /api/v1/events/123/athletes?sex=Men

# Explicit women's division
GET /api/v1/events/123/athletes?sex=Women
```

---

## Response Format

### Success Response (200 OK)

```json
{
  "event_id": 123,
  "event_name": "2025 Tenerife Grand Slam",
  "sex": "Women",
  "athletes": [
    {
      "athlete_id": 456,
      "name": "Sarah Degrieck",
      "country": "Belgium",
      "country_code": "BE",
      "overall_position": 1,
      "sail_number": "BEL-8",
      "profile_image": "https://cdn.example.com/athletes/456.jpg",
      "total_heats": 8,
      "best_heat_score": 24.50
    },
    {
      "athlete_id": 321,
      "name": "Sarah-Quita Offringa",
      "country": "Aruba",
      "country_code": "AW",
      "overall_position": 2,
      "sail_number": "ARU-1",
      "profile_image": "https://cdn.example.com/athletes/321.jpg",
      "total_heats": 9,
      "best_heat_score": 23.95
    },
    {
      "athlete_id": 789,
      "name": "Nia Suardiaz Ruano Moreno",
      "country": "Spain",
      "country_code": "ES",
      "overall_position": 3,
      "sail_number": "ESP-42",
      "profile_image": null,
      "total_heats": 7,
      "best_heat_score": 23.58
    }
    // ... all athletes who competed
  ],
  "metadata": {
    "total_athletes": 26,
    "generated_at": "2025-11-14T10:30:00Z"
  }
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `athlete_id` | integer | Yes | Unique identifier for the athlete |
| `name` | string | Yes | Full name of the athlete |
| `country` | string | Yes | Country name (for display with flag) |
| `country_code` | string | Yes | ISO 3166-1 alpha-2 country code (for flag emoji/icon) |
| `overall_position` | integer | Yes | Final placement in event (1 = winner) |
| `sail_number` | string | No | Competition sail number (null if not available) |
| `profile_image` | string | No | URL to athlete profile photo (null if not available) |
| `total_heats` | integer | Yes | Number of heats competed in |
| `best_heat_score` | number | Yes | Highest single heat score (2 decimal places) |

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

### 1. Sorting

Athletes MUST be sorted by `overall_position` in **ascending order** (winner first):
- Position 1 first
- Position 2 second
- And so on...

This allows the frontend to display athletes in ranking order in the dropdown.

### 2. Position Calculation

`overall_position` should reflect the final tournament standings:
- Winner = 1
- Runner-up = 2
- Third place = 3
- Handle ties appropriately (see Edge Cases section)
- Positions should be based on the competition format (single/double elimination)

### 3. Data Completeness

**IMPORTANT:** Return ALL athletes who competed in the event, not just finalists.
- Include athletes eliminated in early rounds
- Include athletes who did not complete the event (DNS, DNF)
- Use appropriate position numbers for all placements

### 4. Country Codes

Use standard ISO 3166-1 alpha-2 codes:
- `BE` = Belgium
- `AW` = Aruba
- `ES` = Spain
- `NL` = Netherlands
- `BR` = Brazil
- etc.

**Frontend will use these for flag display** (either emoji or flag icons).

### 5. Profile Images

- Return full URL to image (with https://)
- Return `null` if no image available
- Images should be optimized (recommend max 400x400px)
- Support common formats: JPG, PNG, WebP

---

## Database Query Examples

### Main Query
```sql
SELECT
  a.athlete_id,
  a.name,
  a.country,
  a.country_code,
  a.sail_number,
  a.profile_image,
  er.overall_position,
  COUNT(DISTINCT hr.heat_id) as total_heats,
  MAX(hr.total_score) as best_heat_score
FROM athletes a
INNER JOIN event_results er ON a.athlete_id = er.athlete_id
LEFT JOIN heat_results hr ON a.athlete_id = hr.athlete_id
  AND hr.event_id = ?
WHERE er.event_id = ?
  AND er.sex = ?
GROUP BY
  a.athlete_id,
  a.name,
  a.country,
  a.country_code,
  a.sail_number,
  a.profile_image,
  er.overall_position
ORDER BY er.overall_position ASC;
```

### Alternative (if using different schema)
```sql
-- If overall_position needs to be calculated from heat results
SELECT
  a.athlete_id,
  a.name,
  a.country,
  a.country_code,
  a.sail_number,
  a.profile_image,
  RANK() OVER (ORDER BY SUM(hr.total_score) DESC) as overall_position,
  COUNT(DISTINCT hr.heat_id) as total_heats,
  MAX(hr.total_score) as best_heat_score
FROM athletes a
INNER JOIN heat_results hr ON a.athlete_id = hr.athlete_id
WHERE hr.event_id = ?
  AND hr.sex = ?
GROUP BY
  a.athlete_id,
  a.name,
  a.country,
  a.country_code,
  a.sail_number,
  a.profile_image
ORDER BY overall_position ASC;
```

---

## Edge Cases

### 1. Tied Final Positions

When multiple athletes finish with the same placement:

**Option A: Same Position (Recommended for Tournament Standings)**
```json
[
  { "athlete_id": 101, "name": "Athlete A", "overall_position": 1 },
  { "athlete_id": 102, "name": "Athlete B", "overall_position": 2 },
  { "athlete_id": 103, "name": "Athlete C", "overall_position": 3 },
  { "athlete_id": 104, "name": "Athlete D", "overall_position": 3 },
  { "athlete_id": 105, "name": "Athlete E", "overall_position": 5 }
]
```

Both athletes get position 3, next athlete gets position 5 (skipping 4).

**Option B: Sequential Position**
```json
[
  { "athlete_id": 101, "name": "Athlete A", "overall_position": 1 },
  { "athlete_id": 102, "name": "Athlete B", "overall_position": 2 },
  { "athlete_id": 103, "name": "Athlete C", "overall_position": 3 },
  { "athlete_id": 104, "name": "Athlete D", "overall_position": 4 },
  { "athlete_id": 105, "name": "Athlete E", "overall_position": 5 }
]
```

Ties broken by secondary criteria (e.g., best heat score, sail number).

**Choose one approach and be consistent across all endpoints.**

### 2. Missing Profile Data

If athlete information is incomplete:
```json
{
  "athlete_id": 999,
  "name": "Unknown Athlete",
  "country": "Unknown",
  "country_code": "XX",
  "overall_position": 15,
  "sail_number": null,
  "profile_image": null,
  "total_heats": 2,
  "best_heat_score": 12.50
}
```

**Frontend behavior:** Will display placeholder flag for unknown country code.

### 3. Athletes Who Did Not Finish (DNF/DNS)

Include athletes who started but didn't complete:
```json
{
  "athlete_id": 888,
  "name": "Jane Doe",
  "country": "France",
  "country_code": "FR",
  "overall_position": 20,
  "sail_number": "FRA-5",
  "profile_image": null,
  "total_heats": 1,
  "best_heat_score": 10.25
}
```

Assign appropriate position based on when eliminated.

### 4. No Athletes Found

If event exists but has no competitors for specified division:
```json
{
  "event_id": 123,
  "event_name": "2025 Tenerife Grand Slam",
  "sex": "Men",
  "athletes": [],
  "metadata": {
    "total_athletes": 0,
    "generated_at": "2025-11-14T10:30:00Z"
  }
}
```

**Frontend behavior:** Will display "No athletes found" message.

### 5. Default Profile Images

**Backend Option:** Provide default placeholder URL:
```json
{
  "profile_image": "https://cdn.example.com/athletes/default-avatar.jpg"
}
```

**Frontend Option:** Handle null and show placeholder:
```json
{
  "profile_image": null
}
```

Frontend will display generic avatar icon.

---

## Performance Requirements

### Response Time
- **Target:** < 200ms
- **Maximum:** < 500ms

This endpoint should be very fast as it returns minimal data.

### Optimization Strategies

1. **Database Indexes:**
   ```sql
   CREATE INDEX idx_event_results_event_sex ON event_results(event_id, sex, overall_position);
   CREATE INDEX idx_heat_results_athlete_event ON heat_results(athlete_id, event_id);
   CREATE INDEX idx_athletes_id ON athletes(athlete_id);
   ```

2. **Caching:**
   - Cache this endpoint for 10-15 minutes
   - Invalidate cache when event results are updated
   - Key: `athlete_list:{event_id}:{sex}`
   - Use Redis or similar

3. **Query Optimization:**
   - Use JOIN instead of subqueries where possible
   - Limit returned data (only fields needed)
   - Avoid N+1 queries

4. **CDN for Images:**
   - Serve profile images from CDN
   - Use image optimization (WebP, compression)
   - Include cache headers

---

## TypeScript Interface (Frontend Reference)

```typescript
interface AthleteListResponse {
  event_id: number;
  event_name: string;
  sex: "Women" | "Men";
  athletes: AthleteListItem[];
  metadata: {
    total_athletes: number;
    generated_at: string; // ISO 8601 format
  };
}

interface AthleteListItem {
  athlete_id: number;
  name: string;
  country: string;
  country_code: string;
  overall_position: number;
  sail_number: string | null;
  profile_image: string | null;
  total_heats: number;
  best_heat_score: number;
}
```

### Frontend Usage Example
```typescript
// Fetch athlete list for event
const response = await fetch(`/api/v1/events/${eventId}/athletes?sex=Women`);
const data: AthleteListResponse = await response.json();

// Populate dropdown
const athleteOptions = data.athletes.map(athlete => ({
  value: athlete.athlete_id,
  label: `${athlete.overall_position}. ${athlete.name} (${athlete.country})`
}));
```

---

## Testing Checklist

### Functional Tests
- [ ] Returns 404 if `event_id` doesn't exist
- [ ] Returns 400 if `sex` parameter is invalid
- [ ] Returns correct athletes for Women's division
- [ ] Returns correct athletes for Men's division
- [ ] Athletes sorted by `overall_position` ascending
- [ ] All required fields present (no missing keys)
- [ ] Handles null values correctly (sail_number, profile_image)
- [ ] Country codes are valid ISO 3166-1 alpha-2
- [ ] Profile image URLs are valid (or null)

### Data Accuracy Tests
- [ ] `overall_position` matches actual tournament standings
- [ ] `total_heats` count is accurate
- [ ] `best_heat_score` matches actual best heat for athlete
- [ ] All athletes who competed are included
- [ ] No duplicate athletes

### Performance Tests
- [ ] Response time < 200ms for typical event (25 athletes)
- [ ] Response time < 500ms for large event (50+ athletes)
- [ ] Handles concurrent requests (20+ simultaneous)
- [ ] Database queries optimized (no N+1 queries)

### Edge Case Tests
- [ ] Event with no competitors in division
- [ ] Event with tied positions
- [ ] Athletes with missing profile data
- [ ] Athletes with no profile image
- [ ] Athletes with DNS/DNF status

---

## Implementation Notes

### Decimal Precision
- Return `best_heat_score` with 2 decimal places
- Example: `24.50` not `24.5`
- Use `ROUND(score, 2)` in SQL or equivalent

### Naming Conventions
- Use `name` for full athlete name (not `athlete_name`)
- Use `athlete_id` (not `id`, `rider_id`)
- Use `country_code` (not `country_iso`, `code`)
- Use snake_case for JSON keys

### Country Code Reference
Common codes for windsurfing:
- Aruba: `AW`
- Belgium: `BE`
- Brazil: `BR`
- France: `FR`
- Germany: `DE`
- Netherlands: `NL`
- Spain: `ES`
- United Kingdom: `GB`
- United States: `US`

Full list: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

### Profile Image Guidelines
- **Resolution:** 400x400px (or aspect ratio maintained)
- **Format:** JPEG, PNG, or WebP
- **Size:** < 200KB per image
- **Default:** Return `null` if not available
- **CDN:** Use CDN for serving images

---

## Success Criteria

The API endpoint is ready for frontend integration when:

✅ Returns data matching the exact structure above
✅ Athletes sorted by position (winner first)
✅ All athletes included (not just top finishers)
✅ Handles both Men and Women divisions
✅ Response time under 200ms
✅ All edge cases handled gracefully
✅ Valid country codes (ISO 3166-1 alpha-2)
✅ Profile images served from CDN or null
✅ Error responses follow standard format
✅ All required fields present
✅ Decimal precision correct (2 places)

---

## Integration with Athlete Stats Endpoint

This endpoint works in conjunction with the **Athlete Stats endpoint**:

1. **User Flow:**
   - Frontend calls this endpoint to populate dropdown
   - User selects an athlete from dropdown
   - Frontend calls `/api/v1/events/{event_id}/athletes/{athlete_id}/stats` for details

2. **Data Consistency:**
   - `athlete_id` must match across both endpoints
   - `overall_position` here should match position in stats endpoint
   - `best_heat_score` here should match best heat in stats endpoint

3. **Performance:**
   - This endpoint loads first (lightweight)
   - Stats endpoint loads on-demand (heavier payload)
   - Consider preloading stats for top 3 athletes

---

## Questions?

Contact frontend developer if clarification needed on:
- Dropdown component requirements
- Display format for athlete names
- Flag icon/emoji implementation
- Profile image sizing and optimization
- Future filtering requirements (search, country filter, etc.)

---

**Document Version:** 1.0
**Created:** 2025-11-14
**Frontend Status:** ✅ Ready and waiting for API
**Backend Status:** ⏳ Awaiting implementation
