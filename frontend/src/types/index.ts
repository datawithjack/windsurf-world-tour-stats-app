export interface Event {
  id: number;
  source: string;
  year: number;
  event_id: number;
  event_name: string;
  event_url: string;
  event_date: string;
  start_date: string;
  end_date: string;
  day_window: number;
  event_section: string;
  event_status: number;
  competition_state: number;
  has_wave_discipline: boolean;
  all_disciplines: string;
  country_flag: string;
  country_code: string;
  stars: number | null;
  event_image_url: string;
  total_athletes: number | null;
  total_men: number | null;
  total_women: number | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Event Head-to-Head Types
export interface EventHeadToHeadAthlete {
  athlete_id: number;
  name: string;
  nationality: string;
  place: number;
  profile_image: string | null;
  heat_scores_best: number;
  heat_scores_avg: number;
  jumps_best: number;
  jumps_avg_counting: number;
  waves_best: number;
  waves_avg_counting: number;
  heat_wins: number;
}

export interface EventHeadToHeadComparison {
  winner: 'athlete1' | 'athlete2' | 'tie';
  difference: number;
  athlete1_value: number;
  athlete2_value: number;
}

export interface EventHeadToHeadResponse {
  event_id: number;
  event_name: string;
  division: string;
  athlete1: EventHeadToHeadAthlete;
  athlete2: EventHeadToHeadAthlete;
  comparison: {
    heat_scores_best: EventHeadToHeadComparison;
    heat_scores_avg: EventHeadToHeadComparison;
    jumps_best: EventHeadToHeadComparison;
    jumps_avg_counting: EventHeadToHeadComparison;
    waves_best: EventHeadToHeadComparison;
    waves_avg_counting: EventHeadToHeadComparison;
    heat_wins: EventHeadToHeadComparison;
  };
  generated_at: string;
}

export interface AthleteResult {
  id: number;
  athlete_id: number;
  athlete_name: string;
  nationality: string;
  profile_picture_url: string;
  pwa_sponsors?: string;
  event_id: number;
  event_name: string;
  event_year: number;
  country_code: string;
  division: string;
  placement: number;
  source: string;
}

export interface AthleteResultsResponse {
  results: AthleteResult[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Event Stats Types
export interface BreakdownScore {
  score: number;
  move_type: string;
}

export interface HeatScoreBreakdown {
  waves: BreakdownScore[];
  jumps: BreakdownScore[];
}

export interface BestScoreDetail {
  score: number;
  athlete_name: string;
  athlete_id: string;
  heat_number: string;
  round_name?: string;
  move_type?: string;
  breakdown?: HeatScoreBreakdown | null;
  has_multiple_tied: boolean;
  all_tied_scores: {
    score: number;
    athlete_name: string;
    athlete_id: string;
    heat_number: string;
    round_name?: string;
    move_type?: string;
  }[] | null;
}

export interface MoveTypeStat {
  move_type: string;
  best_score: number;
  average_score: number;
  fleet_average: number;
  best_scored_by: {
    athlete_name: string;
    athlete_id: string;
    heat_number: string;
    round_name?: string;
    score: number;
  };
}

export interface RoundStat {
  round_name: string;
  best_heat_score: number | null;
  average_heat_score: number | null;
  best_jump_score: number | null;
  average_jump_score: number | null;
  best_wave_score: number | null;
  average_wave_score: number | null;
  total_heats: number;
}

export interface TopScore {
  rank: number;
  athlete_name: string;
  athlete_id: number;
  score: number;
  heat_number: string;
  round_name?: string;
  move_type?: string;
  elimination_type?: 'Single' | 'Double' | null;
}

export interface EventStatsResponse {
  event_id: number;
  event_name: string;
  sex: 'Men' | 'Women';
  summary_stats: {
    best_heat_score: BestScoreDetail | null;
    best_jump_score: BestScoreDetail | null;
    best_wave_score: BestScoreDetail | null;
  };
  move_type_stats: MoveTypeStat[];
  round_stats: RoundStat[];
  top_heat_scores: TopScore[];
  top_jump_scores: TopScore[];
  top_wave_scores: TopScore[];
  metadata: {
    total_heats: number;
    total_athletes: number;
    generated_at: string;
  };
}

// Global Stats Types
export interface StatMetric {
  metric: string;
  value: string;
}

export interface GlobalStatsResponse {
  stats: StatMetric[];
  generated_at: string;
}

// Event Athletes List Types
export interface AthleteListItem {
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

export interface AthleteListResponse {
  event_id: number;
  event_name: string;
  sex: string;
  athletes: AthleteListItem[];
  metadata: {
    total_athletes: number;
    generated_at: string;
  };
}

// Athlete Event Stats Types
export interface AthleteProfile {
  name: string;
  country: string;
  country_code: string;
  profile_image: string | null;
  sponsors: string | null;
  sail_number: string | null;
}

export interface AthleteSummaryStats {
  overall_position: number;
  best_heat_score: {
    score: number;
    heat: string;
    round_name: string;
    opponents?: string[] | null;
    breakdown?: HeatScoreBreakdown | null;
  } | null;
  best_jump_score: {
    score: number;
    heat: string;
    round_name: string;
    move: string;
    opponents?: string[] | null;
  } | null;
  best_wave_score: {
    score: number;
    heat: string;
    round_name: string;
    opponents?: string[] | null;
  } | null;
}

export interface MoveTypeScore {
  move_type: string;
  best_score: number;
  average_score: number;
  fleet_average: number;
}

export interface HeatScore {
  heat_number: string;
  round_name: string;
  score: number;
  elimination_type: 'Single' | 'Double';
}

export interface JumpScore {
  heat_number: string;
  round_name: string;
  move: string;
  score: number;
  counting: boolean;
}

export interface WaveScore {
  heat_number: string;
  round_name: string;
  score: number;
  counting: boolean;
  wave_index?: number;
}

export interface AthleteStatsResponse {
  event_id: number;
  event_name: string;
  sex: 'Men' | 'Women';
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
    generated_at: string;
  };
}
