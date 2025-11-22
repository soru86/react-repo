const API_BASE_URL = 'https://swapi.dev/api';

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

export const fetchAllCharacters = async () => {
  const cacheKey = 'all-characters';
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    let allCharacters = [];
    let nextUrl = `${API_BASE_URL}/people/`;

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      allCharacters = [...allCharacters, ...data.results];
      nextUrl = data.next;
    }

    // Extract ID from URL for each character
    const charactersWithId = allCharacters.map((character, index) => ({
      ...character,
      id: character.url.match(/\/(\d+)\/$/)?.[1] || index + 1,
    }));

    setCachedData(cacheKey, charactersWithId);
    return charactersWithId;
  } catch (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }
};

export const clearCache = () => {
  cache.clear();
};

