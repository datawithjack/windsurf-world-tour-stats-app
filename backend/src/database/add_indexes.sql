-- Performance Indexes for Windsurf World Tour Stats API
-- Run this script to add indexes that improve query performance
-- These indexes target the most frequently filtered/joined columns
--
-- NOTE: MySQL doesn't support "IF NOT EXISTS" for indexes.
-- If an index already exists, that statement will error - just skip it.

-- ============================================================================
-- PWA_IWT_HEAT_SCORES (39,460 records - most queried table)
-- ============================================================================

-- Index for event filtering
CREATE INDEX idx_heat_scores_event_id ON PWA_IWT_HEAT_SCORES (pwa_event_id);

-- Index for heat filtering
CREATE INDEX idx_heat_scores_heat_id ON PWA_IWT_HEAT_SCORES (heat_id);

-- Index for athlete filtering
CREATE INDEX idx_heat_scores_athlete_id ON PWA_IWT_HEAT_SCORES (athlete_id);

-- Index for score type filtering (Wave vs Jump)
CREATE INDEX idx_heat_scores_type ON PWA_IWT_HEAT_SCORES (type);

-- Index for counting scores filtering
CREATE INDEX idx_heat_scores_counting ON PWA_IWT_HEAT_SCORES (counting);

-- Composite index for common event+sex queries
CREATE INDEX idx_heat_scores_event_sex ON PWA_IWT_HEAT_SCORES (pwa_event_id, sex);


-- ============================================================================
-- PWA_IWT_HEAT_RESULTS (793 records)
-- ============================================================================

-- Index for event filtering
CREATE INDEX idx_heat_results_event_id ON PWA_IWT_HEAT_RESULTS (pwa_event_id);

-- Index for heat filtering
CREATE INDEX idx_heat_results_heat_id ON PWA_IWT_HEAT_RESULTS (heat_id);

-- Index for athlete filtering
CREATE INDEX idx_heat_results_athlete_id ON PWA_IWT_HEAT_RESULTS (athlete_id);


-- ============================================================================
-- PWA_IWT_RESULTS (2,052 records)
-- ============================================================================

-- Index for event filtering
CREATE INDEX idx_results_event_id ON PWA_IWT_RESULTS (event_id);

-- Index for athlete filtering
CREATE INDEX idx_results_athlete_id ON PWA_IWT_RESULTS (athlete_id);

-- Index for sex/division filtering
CREATE INDEX idx_results_sex ON PWA_IWT_RESULTS (sex);

-- Composite index for common event+sex queries
CREATE INDEX idx_results_event_sex ON PWA_IWT_RESULTS (event_id, sex);


-- ============================================================================
-- ATHLETES (359 records)
-- ============================================================================

-- Index for nationality filtering
CREATE INDEX idx_athletes_nationality ON ATHLETES (nationality);


-- ============================================================================
-- ATHLETE_SOURCE_IDS (514 records)
-- ============================================================================

-- Index for source+source_id lookups (critical for joining)
CREATE INDEX idx_source_ids_source_sourceid ON ATHLETE_SOURCE_IDS (source, source_id);

-- Index for athlete_id lookups
CREATE INDEX idx_source_ids_athlete_id ON ATHLETE_SOURCE_IDS (athlete_id);


-- ============================================================================
-- PWA_IWT_HEAT_PROGRESSION (219 records)
-- ============================================================================

-- Index for heat_id lookups (used in joins)
CREATE INDEX idx_heat_progression_heat_id ON PWA_IWT_HEAT_PROGRESSION (heat_id);


-- ============================================================================
-- Verify indexes were created
-- ============================================================================

-- Run these to see all indexes:
SHOW INDEX FROM PWA_IWT_HEAT_SCORES;
SHOW INDEX FROM PWA_IWT_HEAT_RESULTS;
SHOW INDEX FROM PWA_IWT_RESULTS;
SHOW INDEX FROM ATHLETES;
SHOW INDEX FROM ATHLETE_SOURCE_IDS;
SHOW INDEX FROM PWA_IWT_HEAT_PROGRESSION;
