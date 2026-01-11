import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { apiService, ApiError } from './api';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  };
  return { default: mockAxios };
});

const mockedAxios = axios as unknown as {
  create: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should fetch events with default parameters', async () => {
      const mockResponse = {
        data: {
          events: [{ id: 1, event_name: 'Test Event' }],
          pagination: { total: 1, page: 1, page_size: 50 },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await apiService.getEvents();

      expect(mockedAxios.get).toHaveBeenCalledWith('/events', {
        params: { page: 1, page_size: 50, wave_only: true },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch events with custom parameters', async () => {
      const mockResponse = {
        data: {
          events: [],
          pagination: { total: 0, page: 2, page_size: 25 },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await apiService.getEvents(2, 25, false);

      expect(mockedAxios.get).toHaveBeenCalledWith('/events', {
        params: { page: 2, page_size: 25, wave_only: false },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getEvent', () => {
    it('should fetch a single event by id', async () => {
      const mockEvent = { id: 123, event_name: 'Chile World Cup 2025' };
      mockedAxios.get.mockResolvedValueOnce({ data: mockEvent });

      const result = await apiService.getEvent(123);

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/123');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getAthleteResults', () => {
    it('should fetch athlete results with filters', async () => {
      const mockResponse = {
        data: {
          results: [{ id: 1, athlete_name: 'Test Athlete' }],
          pagination: { total: 1 },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await apiService.getAthleteResults({
        event_id: 5,
        sex: 'Women',
        page: 1,
        page_size: 50,
      });

      expect(mockedAxios.get).toHaveBeenCalledWith('/athletes/results', {
        params: { event_id: 5, sex: 'Women', page: 1, page_size: 50 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getEventStats', () => {
    it('should fetch event stats for Men division', async () => {
      const mockStats = {
        event_id: 1,
        sex: 'Men',
        summary_stats: {},
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      const result = await apiService.getEventStats(1, 'Men');

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/stats', {
        params: { sex: 'Men' },
      });
      expect(result).toEqual(mockStats);
    });

    it('should fetch event stats for Women division', async () => {
      const mockStats = {
        event_id: 2,
        sex: 'Women',
        summary_stats: {},
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      const result = await apiService.getEventStats(2, 'Women');

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/2/stats', {
        params: { sex: 'Women' },
      });
      expect(result).toEqual(mockStats);
    });
  });

  describe('getGlobalStats', () => {
    it('should fetch global statistics', async () => {
      const mockStats = {
        stats: [{ metric: 'Total Events', value: '118' }],
        generated_at: '2026-01-11',
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      const result = await apiService.getGlobalStats();

      expect(mockedAxios.get).toHaveBeenCalledWith('/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getEventAthletes', () => {
    it('should fetch athletes for an event', async () => {
      const mockResponse = {
        event_id: 1,
        athletes: [{ athlete_id: 1, name: 'Test Athlete' }],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await apiService.getEventAthletes(1, 'Women');

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/athletes', {
        params: { sex: 'Women' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should default to Women division', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await apiService.getEventAthletes(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/athletes', {
        params: { sex: 'Women' },
      });
    });
  });

  describe('getAthleteEventStats', () => {
    it('should fetch athlete stats for an event', async () => {
      const mockStats = {
        event_id: 1,
        athlete_id: 100,
        profile: { name: 'Test Athlete' },
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

      const result = await apiService.getAthleteEventStats(1, 100, 'Women');

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/athletes/100/stats', {
        params: { sex: 'Women' },
      });
      expect(result).toEqual(mockStats);
    });

    it('should work without sex parameter', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: {} });

      await apiService.getAthleteEventStats(1, 100);

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/athletes/100/stats', {
        params: undefined,
      });
    });
  });

  describe('getEventHeadToHead', () => {
    it('should fetch head-to-head comparison', async () => {
      const mockH2H = {
        event_id: 1,
        athlete1: { athlete_id: 10 },
        athlete2: { athlete_id: 20 },
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockH2H });

      const result = await apiService.getEventHeadToHead(1, 10, 20, 'Women');

      expect(mockedAxios.get).toHaveBeenCalledWith('/events/1/head-to-head', {
        params: {
          athlete1_id: 10,
          athlete2_id: 20,
          division: 'Women',
        },
      });
      expect(result).toEqual(mockH2H);
    });
  });

  describe('getRecentEvents', () => {
    it('should fetch recent events with default limit', async () => {
      const mockResponse = {
        data: {
          events: [
            { id: 1, event_name: 'Event 1' },
            { id: 2, event_name: 'Event 2' },
            { id: 3, event_name: 'Event 3' },
          ],
          pagination: { total: 3 },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await apiService.getRecentEvents();

      expect(mockedAxios.get).toHaveBeenCalledWith('/events', {
        params: { page: 1, page_size: 3, wave_only: true },
      });
      expect(result).toHaveLength(3);
    });

    it('should fetch recent events with custom limit', async () => {
      const mockResponse = {
        data: {
          events: [{ id: 1, event_name: 'Event 1' }],
          pagination: { total: 1 },
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await apiService.getRecentEvents(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('/events', {
        params: { page: 1, page_size: 1, wave_only: true },
      });
      expect(result).toHaveLength(1);
    });
  });
});

describe('ApiError', () => {
  it('should create an error with correct properties', () => {
    const error = new ApiError('Test error message', 404, '/test/endpoint');

    expect(error.message).toBe('Test error message');
    expect(error.status).toBe(404);
    expect(error.endpoint).toBe('/test/endpoint');
    expect(error.name).toBe('ApiError');
  });

  it('should be an instance of Error', () => {
    const error = new ApiError('Test', 500, '/test');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });
});
