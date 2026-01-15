# Athlete Stats Tab Enhancement Plan

## Expert Review Summary

### Current State Analysis

**Architecture Strengths:**
- Clean separation of concerns: EventResultsPage manages state, AthleteStatsTab fetches data, AthleteDetailPanel renders UI
- Cascading filter infrastructure already exists via `extractAthleteFilterOptions`
- Filter state properly lifted to parent component

**Issues Identified:**

1. **Filter cascade incomplete**: While filter options are extracted from athlete data, the summary cards display `summary_stats` from the API (pre-calculated) rather than being recalculated from filtered data
2. **Heat number prefix issue**: The `heat_number` field contains event-specific prefixes (e.g., "1833_19a" instead of "19a")
3. **Chart color contrast**: Single (#2dd4bf) and Double (#14b8a6) elimination colors are nearly identical teal shades
4. **Missing hierarchical axis**: Chart only shows round name, not the full hierarchy (Heat → Round → Elimination)
5. **Head-to-Head layout**: Athlete selectors stacked vertically on mobile rather than on same row

---

## Detailed Implementation Plan

### Phase 1: Backend - Clean Heat Numbers (Optional but Recommended)

**File:** `backend/src/api/routes/events.py`

**Change:** Add a utility function to strip event prefix from heat numbers before returning from API.

```python
def clean_heat_number(heat_id: str) -> str:
    """Strip event prefix from heat ID. E.g., '1833_19a' -> '19a'"""
    if '_' in heat_id:
        return heat_id.split('_', 1)[1]
    return heat_id
```

**Why Backend vs Frontend:** Cleaner to fix at source. Prevents frontend from needing to know about data format.

**Alternative:** If backend changes are undesirable, add frontend utility in AthleteDetailPanel.tsx.

---

### Phase 2: Frontend - Recalculate Summary Stats from Filtered Data

**File:** `frontend/src/components/AthleteDetailPanel.tsx`

**Current Problem:**
- `summary_stats` comes directly from API and shows best scores across ALL heats
- When filters are applied, summary cards still show unfiltered bests

**Solution:** Add `useMemo` to recalculate summary stats from filtered data

```typescript
const recalculatedSummaryStats = useMemo(() => {
  // If no filters applied, use API summary stats
  if (!data.heat_scores || data.heat_scores.length === 0) {
    return data.summary_stats;
  }

  // Find best heat score from filtered heat_scores
  const bestHeatScore = data.heat_scores.reduce((best, current) =>
    (current.score && (!best || current.score > best.score)) ? current : best
  , null as HeatScore | null);

  // Find best jump score from filtered jump_scores
  const bestJumpScore = data.jump_scores?.reduce((best, current) =>
    (current.score && (!best || current.score > best.score)) ? current : best
  , null as JumpScore | null);

  // Find best wave score from filtered wave_scores
  const bestWaveScore = data.wave_scores?.reduce((best, current) =>
    (current.score && (!best || current.score > best.score)) ? current : best
  , null as WaveScore | null);

  return {
    ...data.summary_stats,
    best_heat_score: bestHeatScore ? {
      score: bestHeatScore.score,
      round_name: bestHeatScore.round_name,
      heat_number: bestHeatScore.heat_number,
      // Note: opponents and breakdown not available in filtered data
    } : data.summary_stats.best_heat_score,
    best_jump_score: bestJumpScore ? {
      score: bestJumpScore.score,
      round_name: bestJumpScore.round_name,
      heat_number: bestJumpScore.heat_number,
      move: bestJumpScore.move,
    } : data.summary_stats.best_jump_score,
    best_wave_score: bestWaveScore ? {
      score: bestWaveScore.score,
      round_name: bestWaveScore.round_name,
      heat_number: bestWaveScore.heat_number,
    } : data.summary_stats.best_wave_score,
  };
}, [data]);
```

**Additional Props Needed:** Pass filter state to AthleteDetailPanel so it knows when to recalculate

---

### Phase 3: Frontend - Clean Heat Number Display

**File:** `frontend/src/components/AthleteDetailPanel.tsx`

**Add utility function:**
```typescript
const cleanHeatNumber = (heatNumber: string | null | undefined): string | null => {
  if (!heatNumber) return null;
  // Strip event prefix: "1833_19a" -> "19a"
  if (heatNumber.includes('_')) {
    return heatNumber.split('_').pop() || heatNumber;
  }
  return heatNumber;
};
```

**Update formatSubtitle:**
```typescript
const formatSubtitle = (roundName?: string | null, heatNumber?: string | null) => {
  const parts: string[] = [];
  if (roundName) parts.push(roundName);
  if (heatNumber) parts.push(`(Heat ${cleanHeatNumber(heatNumber)})`);
  return parts.join(' - ');
};
```

---

### Phase 4: Frontend - Heat Scores Chart Enhancements

**File:** `frontend/src/components/AthleteHeatScoresChart.tsx`

#### 4a. More Contrasting Colors

**Current:**
- Double: #14b8a6 (teal-500)
- Single: #2dd4bf (teal-400)

**Proposed:**
- Double: #8b5cf6 (violet-500) - Purple for "Double"
- Single: #22d3ee (cyan-400) - Cyan for "Single"

This provides clear visual distinction with semantic meaning (two colors = two eliminations).

#### 4b. Hierarchical X-Axis Labels

**Approach:** Use Recharts multi-line tick or custom tick renderer

```typescript
// Transform data to include all hierarchy levels
const chartData = data.map(d => ({
  ...d,
  // Combined label for grouping
  label: `${cleanHeatNumber(d.heatNumber)}`,
  round: d.roundName,
  elimination: d.type,
}));

// Custom X-axis tick component
const HierarchicalTick = ({ x, y, payload }: any) => {
  const item = chartData.find(d => d.label === payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        {payload.value}
      </text>
      <text x={0} y={0} dy={26} textAnchor="middle" fill="#64748b" fontSize={9}>
        {item?.round}
      </text>
      <text x={0} y={0} dy={38} textAnchor="middle" fill="#475569" fontSize={8}>
        {item?.elimination}
      </text>
    </g>
  );
};
```

**Update chart margin:** Increase bottom margin to accommodate 3-line labels (40 → 60)

---

### Phase 5: Frontend - Head-to-Head Tab Layout Fix

**File:** `frontend/src/components/HeadToHeadComparison.tsx`

**Current (lines 82-107):**
```tsx
<div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
```

**Issue:** Uses `flex-col` on mobile which stacks vertically.

**Solution:** Keep both selectors on same row, allow them to wrap naturally:
```tsx
<div className="flex flex-row flex-wrap items-center gap-3">
  <SearchableSelect className="min-w-[200px] flex-1 max-w-[50%]" ... />
  <SearchableSelect className="min-w-[200px] flex-1 max-w-[50%]" ... />
</div>
```

This keeps them side-by-side and wraps only when viewport is very narrow.

---

## Files to Modify

| File | Changes |
|------|---------|
| `frontend/src/components/AthleteDetailPanel.tsx` | Recalculate summary stats, clean heat numbers |
| `frontend/src/components/AthleteHeatScoresChart.tsx` | New colors, hierarchical x-axis |
| `frontend/src/components/HeadToHeadComparison.tsx` | Single-row filter layout |
| `frontend/src/components/AthleteStatsTab.tsx` | Pass filter state to AthleteDetailPanel |
| `backend/src/api/routes/events.py` (optional) | Clean heat numbers at source |

---

## Testing Verification

1. **Summary Cards Filter Test:**
   - Select an athlete
   - Apply elimination filter (e.g., "Single")
   - Verify summary cards show best scores only from Single elimination heats
   - Clear filter, verify summary returns to overall best

2. **Heat Number Display Test:**
   - Verify "Round 3 - (Heat 19a)" not "Round 3 - (Heat 1833_19a)"
   - Check all summary cards, tables, and chart tooltips

3. **Chart Color Test:**
   - View athlete with both Single and Double elimination heats
   - Verify clear visual distinction between bar colors
   - Verify legend matches new colors

4. **Chart Hierarchy Test:**
   - X-axis shows 3 levels: Heat number, Round name, Elimination type
   - Labels are readable and don't overlap

5. **Head-to-Head Layout Test:**
   - On mobile viewport, both athlete selectors visible on same row
   - Selectors wrap gracefully on very narrow screens

---

## Risk Assessment

| Change | Risk Level | Mitigation |
|--------|------------|------------|
| Recalculate summary stats | Medium | Fallback to API stats if filtered data empty |
| Clean heat numbers | Low | Null-safe utility function |
| Chart colors | Low | Visual only, no data impact |
| Hierarchical axis | Medium | Test with varying data lengths |
| H2H layout | Low | CSS only, no logic changes |

---

## Questions for User

1. **Hierarchical X-axis:** Do you have a screenshot example of the desired hierarchy layout? I want to confirm the exact visual style you're envisioning (grouped bars vs. multi-line labels vs. nested categories).

2. **Color preferences:** Are violet (#8b5cf6) and cyan (#22d3ee) acceptable for Double/Single, or do you have specific colors in mind?

3. **Backend vs Frontend for heat number cleaning:** Preference for fixing in API (cleaner) or frontend (faster to implement)?
