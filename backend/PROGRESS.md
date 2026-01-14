# Backend API Progress - January 2026

## Summary

Backend review completed with most fixes applied. Currently blocked on a **data source mismatch issue** affecting events 133 and 134 (Chile 2025, Maui 2025).

---

## Completed Fixes

### Security & Configuration
- [x] **CORS restricted** - `config.py:35-41` - No longer allows `*`, only specific origins
- [x] **Production validation** - `main.py:83-88` - Startup fails if CORS is open in production
- [x] **Connection string logging fixed** - No longer exposes user info in logs

### Data Handling
- [x] **Non-numeric placements** - All queries now use `REGEXP '^[0-9]+$'` check before CAST
- [x] **Country code fixed** - Uses `COALESCE(a.country_code, e.country_code)`
- [x] **Error messages improved** - 404s now distinguish "event not found" vs "no division data"

### Code Quality
- [x] **Error logging** - Added `exc_info=True` to all error handlers
- [x] **Database pool init bug** - Fixed flag to only set on success
- [x] **View verification on startup** - Warns if required views are missing

### Performance
- [x] **Database indexes** - Script created at `backend/src/database/add_indexes.sql` and executed

---

## Blocking Issue: Live Heats Source Mismatch

### Problem
Events 133 (Chile 2025) and 134 (Maui 2025) were re-scraped from Live Heats but have inconsistent `source` values across tables:

| Table | source value |
|-------|--------------|
| PWA_IWT_EVENTS | `Live Heats` |
| PWA_IWT_RESULTS | `Live Heats` |
| PWA_IWT_HEAT_SCORES | `Live Heats` |
| PWA_IWT_HEAT_RESULTS | `Live Heats` |

The **database views** had `source = 'PWA'` hardcoded in their JOIN conditions, causing these events to return no data.

### Fixes Applied

#### API Code (events.py)
Changed all hardcoded source filters to dynamic matching:
```sql
-- Before (broken)
JOIN PWA_IWT_EVENTS e ON s.pwa_event_id = e.event_id AND e.source = 'PWA'

-- After (fixed)
JOIN PWA_IWT_EVENTS e ON s.pwa_event_id = e.event_id AND s.source = e.source
```

#### Database Views Needing Update
The following views need `source = 'PWA'` replaced with dynamic source matching:

1. **EVENT_STATS_VIEW** - Change to: `s.source = e.source`
2. **EVENT_INFO_VIEW** - Already updated by user
3. **ATHLETE_RESULTS_VIEW** - Change to: `r.source = e.source`
4. **ATHLETE_SUMMARY_VIEW** - Check if needs update

### SQL to Fix ATHLETE_RESULTS_VIEW

```sql
DROP VIEW IF EXISTS ATHLETE_RESULTS_VIEW;

CREATE VIEW ATHLETE_RESULTS_VIEW AS
SELECT
    r.id AS result_id,
    r.source AS result_source,
    a.id AS athlete_id,
    a.primary_name AS athlete_name,
    a.nationality AS nationality,
    a.year_of_birth AS year_of_birth,
    COALESCE(a.liveheats_image_url, a.pwa_profile_url) AS profile_picture_url,
    a.pwa_profile_url AS pwa_picture_url,
    a.liveheats_image_url AS liveheats_picture_url,
    a.pwa_sail_number AS pwa_sail_number,
    a.pwa_sponsors AS pwa_sponsors,
    a.match_stage AS match_stage,
    a.match_score AS match_score,
    e.id AS event_db_id,
    e.event_id AS event_id,
    e.event_name AS event_name,
    e.year AS event_year,
    e.event_date AS event_date,
    e.start_date AS start_date,
    e.end_date AS end_date,
    e.country_code AS country_code,
    e.stars AS stars,
    e.event_image_url AS event_image_url,
    e.event_url AS event_url,
    r.division_label AS division_label,
    r.division_code AS division_code,
    r.sex AS sex,
    r.place AS placement,
    r.athlete_id AS source_athlete_id,
    r.sail_number AS result_sail_number,
    r.scraped_at AS result_scraped_at,
    r.created_at AS result_created_at
FROM PWA_IWT_RESULTS r
LEFT JOIN ATHLETE_SOURCE_IDS asi ON r.source = asi.source AND r.athlete_id = asi.source_id
LEFT JOIN ATHLETES a ON asi.athlete_id = a.id
LEFT JOIN PWA_IWT_EVENTS e ON r.event_id = e.event_id AND r.source = e.source
WHERE r.athlete_id IS NOT NULL AND r.athlete_id <> ''
ORDER BY e.year DESC, e.event_id, r.division_code, CAST(r.place AS UNSIGNED);
```

### SQL to Fix EVENT_STATS_VIEW

```sql
DROP VIEW IF EXISTS EVENT_STATS_VIEW;

CREATE VIEW EVENT_STATS_VIEW AS
SELECT
    e.id AS event_db_id,
    e.event_id AS pwa_event_id,
    e.event_name AS event_name,
    e.year AS event_year,
    s.source AS score_source,
    s.id AS score_id,
    s.heat_id AS heat_id,
    a.id AS athlete_id,
    s.athlete_id AS source_athlete_id,
    a.primary_name AS athlete_name,
    s.sail_number AS sail_number,
    COALESCE(NULLIF(s.sex, ''), hp.sex) AS sex,
    s.pwa_division_code AS division_code,
    ROUND(s.score, 2) AS score,
    s.type AS score_type_code,
    COALESCE(st.Type_Name, s.type) AS move_type,
    s.counting AS counting,
    ROUND(s.total_wave, 2) AS total_wave,
    ROUND(s.total_jump, 2) AS total_jump,
    ROUND(s.total_points, 2) AS total_points,
    s.scraped_at AS scraped_at,
    s.created_at AS created_at
FROM PWA_IWT_HEAT_SCORES s
JOIN PWA_IWT_EVENTS e ON s.pwa_event_id = e.event_id AND s.source = e.source
LEFT JOIN ATHLETE_SOURCE_IDS asi ON s.source = asi.source AND s.athlete_id = asi.source_id
LEFT JOIN ATHLETES a ON asi.athlete_id = a.id
LEFT JOIN (
    SELECT DISTINCT heat_id, pwa_event_id, pwa_division_code, sex, source
    FROM PWA_IWT_HEAT_PROGRESSION
) hp ON s.source = hp.source AND s.pwa_event_id = hp.pwa_event_id AND s.heat_id = hp.heat_id
LEFT JOIN SCORE_TYPES st ON s.type = st.Type
WHERE s.athlete_id IS NOT NULL
    AND s.athlete_id <> ''
    AND s.score IS NOT NULL
ORDER BY e.year DESC, e.event_id, s.heat_id, s.score DESC;
```

---

## Verification Steps

After updating views, verify with:

```sql
-- Check event 134 appears in views
SELECT COUNT(*) FROM EVENT_STATS_VIEW WHERE event_db_id = 134;
SELECT COUNT(*) FROM ATHLETE_RESULTS_VIEW WHERE event_db_id = 134;

-- Test API endpoint
curl http://localhost:8000/api/v1/events/134/stats?sex=Women
```

---

## Files Modified

| File | Changes |
|------|---------|
| `backend/src/api/config.py` | CORS origins, logging |
| `backend/src/api/main.py` | Production validation, view verification |
| `backend/src/api/database.py` | Pool init bug fix |
| `backend/src/api/routes/events.py` | Source matching, placements, errors |
| `backend/src/api/routes/athletes.py` | Placements, error logging |
| `backend/src/api/routes/stats.py` | Error logging |
| `backend/src/api/routes/head_to_head.py` | Placements, error logging |
| `backend/src/database/add_indexes.sql` | Performance indexes |
| `package.json` | Fixed dev:backend script path |

---

## Remaining Work

1. **Update all database views** to use `r.source = e.source` instead of `e.source = 'PWA'`
2. **Verify events 133/134** show data after view updates
3. **Test all endpoints** for both PWA and Live Heats events
4. **Deploy to production** once verified locally

---

## How to Test Locally

1. Start SSH tunnel:
   ```bash
   ssh -L 3306:10.0.151.92:3306 -i ~/.ssh/ssh-key-2025-08-30.key ubuntu@129.151.153.128
   ```

2. Start backend:
   ```bash
   npm run dev:backend
   ```

3. Test endpoints:
   - http://localhost:8000/docs (Swagger UI)
   - http://localhost:8000/api/v1/events
   - http://localhost:8000/api/v1/events/134/stats?sex=Women

---

## Reference

- Full review document: `docs/BACKEND-REVIEW.md`
- Index script: `backend/src/database/add_indexes.sql`
- Backend CLAUDE.md: `backend/.claude/CLAUDE.md`
