import axios, { AxiosError } from 'axios';
import type { Event, EventsResponse, AthleteResultsResponse, EventStatsResponse, GlobalStatsResponse, AthleteListResponse, AthleteStatsResponse, EventHeadToHeadResponse } from '../types';

// Production API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://windsurf-world-tour-stats-api.duckdns.org/api/v1';

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

// User-friendly error messages
const getErrorMessage = (error: AxiosError): string => {
  if (!error.response) {
    // Network error - no response received
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return 'Invalid request. Please try again.';
    case 401:
      return 'You are not authorized to access this resource.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'The requested data was not found.';
    case 408:
      return 'Request timed out. Please try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'Server error. Our team has been notified.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return `An error occurred (${status}). Please try again.`;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Response interceptor - handles all errors
api.interceptors.response.use(
  // Success - pass through
  (response) => response,

  // Error - log and format
  (error: AxiosError) => {
    const endpoint = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const status = error.response?.status || 0;

    // Log error details for debugging
    console.error(`[API Error] ${method} ${endpoint}`, {
      status,
      message: error.message,
      data: error.response?.data,
    });

    // Create user-friendly error
    const userMessage = getErrorMessage(error);
    const apiError = new ApiError(userMessage, status, endpoint);

    return Promise.reject(apiError);
  }
);

// API Service
export const apiService = {
  // Events
  async getEvents(page = 1, pageSize = 50, waveOnly = true): Promise<EventsResponse> {
    const response = await api.get('/events', {
      params: {
        page,
        page_size: pageSize,
        wave_only: waveOnly,
      },
    });
    return response.data;
  },

  async getEvent(id: number): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async getRecentEvents(limit = 3): Promise<Event[]> {
    const response = await this.getEvents(1, limit, true);
    return response.events;
  },

  // Athlete Results
  async getAthleteResults(params: {
    event_id?: number;
    sex?: string;
    page?: number;
    page_size?: number;
  }): Promise<AthleteResultsResponse> {
    const response = await api.get('/athletes/results', { params });
    return response.data;
  },

  // Event Stats
  async getEventStats(eventId: number, sex: 'Men' | 'Women'): Promise<EventStatsResponse> {
    const response = await api.get(`/events/${eventId}/stats`, {
      params: { sex },
    });
    return response.data;
  },

  // Global Stats
  async getGlobalStats(): Promise<GlobalStatsResponse> {
    const response = await api.get('/stats');
    return response.data;
  },

  // Event Athletes
  async getEventAthletes(eventId: number, sex: 'Men' | 'Women' = 'Women'): Promise<AthleteListResponse> {
    const response = await api.get(`/events/${eventId}/athletes`, {
      params: { sex },
    });
    return response.data;
  },

  // Athlete Event Stats
  async getAthleteEventStats(
    eventId: number,
    athleteId: number,
    sex?: 'Men' | 'Women',
    filters?: {
      elimination?: string;
      round_name?: string;
      heat_number?: string;
    }
  ): Promise<AthleteStatsResponse> {
    const params: Record<string, string> = {};
    if (sex) params.sex = sex;
    if (filters?.elimination) params.elimination = filters.elimination;
    if (filters?.round_name) params.round_name = filters.round_name;
    if (filters?.heat_number) params.heat_number = filters.heat_number;

    const response = await api.get(`/events/${eventId}/athletes/${athleteId}/stats`, {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
    return response.data;
  },

  // Event Head to Head
  async getEventHeadToHead(
    eventId: number,
    athlete1Id: number,
    athlete2Id: number,
    division: 'Men' | 'Women'
  ): Promise<EventHeadToHeadResponse> {
    const response = await api.get(`/events/${eventId}/head-to-head`, {
      params: {
        athlete1_id: athlete1Id,
        athlete2_id: athlete2Id,
        division,
      },
    });
    return response.data;
  },
};

export default api;
