import { fetchAllCharacters, clearCache } from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
    clearCache();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('fetchAllCharacters', () => {
    it('should fetch all characters from multiple pages', async () => {
      const page1Data = {
        results: [
          { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
          { name: 'Darth Vader', url: 'https://swapi.dev/api/people/4/' },
        ],
        next: 'https://swapi.dev/api/people/?page=2',
      };

      const page2Data = {
        results: [
          { name: 'Leia Organa', url: 'https://swapi.dev/api/people/5/' },
        ],
        next: null,
      };

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1Data,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2Data,
        });

      const result = await fetchAllCharacters();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Luke Skywalker');
      expect(result[0].id).toBe('1');
      expect(result[2].name).toBe('Leia Organa');
    });

    it('should cache the results', async () => {
      const mockData = {
        results: [{ name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' }],
        next: null,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result1 = await fetchAllCharacters();
      const result2 = await fetchAllCharacters();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should handle HTTP errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchAllCharacters()).rejects.toThrow('Failed to fetch characters');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchAllCharacters()).rejects.toThrow('Failed to fetch characters');
    });

    it('should extract ID from URL correctly', async () => {
      const mockData = {
        results: [
          { name: 'Luke', url: 'https://swapi.dev/api/people/1/' },
          { name: 'Vader', url: 'https://swapi.dev/api/people/4/' },
        ],
        next: null,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchAllCharacters();

      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('4');
    });

    it('should use index as fallback ID when URL pattern does not match', async () => {
      const mockData = {
        results: [
          { name: 'Luke', url: 'invalid-url' },
        ],
        next: null,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchAllCharacters();

      expect(result[0].id).toBe(1);
    });

    it('should expire cache after duration', async () => {
      const mockData = {
        results: [{ name: 'Luke', url: 'https://swapi.dev/api/people/1/' }],
        next: null,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await fetchAllCharacters();
      expect(fetch).toHaveBeenCalledTimes(1);

      // Advance time by more than cache duration (5 minutes)
      jest.advanceTimersByTime(5 * 60 * 1000 + 1000);

      await fetchAllCharacters();
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      const mockData = {
        results: [{ name: 'Luke', url: 'https://swapi.dev/api/people/1/' }],
        next: null,
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      await fetchAllCharacters();
      expect(fetch).toHaveBeenCalledTimes(1);

      clearCache();
      await fetchAllCharacters();
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});

