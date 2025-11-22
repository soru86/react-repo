import { sortCharacters } from '../sortCharacters';

describe('sortCharacters', () => {
  const mockCharacters = [
    { name: 'Zebra', height: '200', mass: '80', gender: 'male' },
    { name: 'Alpha', height: '150', mass: '100', gender: 'female' },
    { name: 'Beta', height: '180', mass: '90', gender: 'male' },
  ];

  it('should return original array when sortField is null', () => {
    const result = sortCharacters(mockCharacters, null, 'asc');
    expect(result).toEqual(mockCharacters);
  });

  it('should sort by name ascending', () => {
    const result = sortCharacters(mockCharacters, 'name', 'asc');
    expect(result[0].name).toBe('Alpha');
    expect(result[1].name).toBe('Beta');
    expect(result[2].name).toBe('Zebra');
  });

  it('should sort by name descending', () => {
    const result = sortCharacters(mockCharacters, 'name', 'desc');
    expect(result[0].name).toBe('Zebra');
    expect(result[1].name).toBe('Beta');
    expect(result[2].name).toBe('Alpha');
  });

  it('should sort by height ascending', () => {
    const result = sortCharacters(mockCharacters, 'height', 'asc');
    expect(result[0].height).toBe('150');
    expect(result[1].height).toBe('180');
    expect(result[2].height).toBe('200');
  });

  it('should sort by height descending', () => {
    const result = sortCharacters(mockCharacters, 'height', 'desc');
    expect(result[0].height).toBe('200');
    expect(result[1].height).toBe('180');
    expect(result[2].height).toBe('150');
  });

  it('should sort by mass ascending', () => {
    const result = sortCharacters(mockCharacters, 'mass', 'asc');
    expect(result[0].mass).toBe('80');
    expect(result[1].mass).toBe('90');
    expect(result[2].mass).toBe('100');
  });

  it('should handle unknown height values', () => {
    const charsWithUnknown = [
      { name: 'A', height: 'unknown', mass: '80' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithUnknown, 'height', 'asc');
    expect(result[0].height).toBe('unknown');
    expect(result[1].height).toBe('150');
  });

  it('should handle unknown mass values', () => {
    const charsWithUnknown = [
      { name: 'A', height: '150', mass: 'unknown' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithUnknown, 'mass', 'asc');
    expect(result[0].mass).toBe('unknown');
    expect(result[1].mass).toBe('90');
  });

  it('should handle height with commas', () => {
    const charsWithCommas = [
      { name: 'A', height: '1,200', mass: '80' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithCommas, 'height', 'asc');
    expect(result[0].height).toBe('150');
    expect(result[1].height).toBe('1,200');
  });

  it('should handle mass with commas', () => {
    const charsWithCommas = [
      { name: 'A', height: '150', mass: '1,200' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithCommas, 'mass', 'asc');
    expect(result[0].mass).toBe('90');
    expect(result[1].mass).toBe('1,200');
  });

  it('should sort by gender ascending', () => {
    const result = sortCharacters(mockCharacters, 'gender', 'asc');
    expect(result[0].gender).toBe('female');
    expect(result[1].gender).toBe('male');
    expect(result[2].gender).toBe('male');
  });

  it('should handle null or undefined values', () => {
    const charsWithNulls = [
      { name: 'A', height: null, mass: '80' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithNulls, 'height', 'asc');
    expect(result).toHaveLength(2);
  });

  it('should not mutate original array', () => {
    const original = [...mockCharacters];
    sortCharacters(mockCharacters, 'name', 'asc');
    expect(mockCharacters).toEqual(original);
  });

  it('should handle null values for height', () => {
    const charsWithNull = [
      { name: 'A', height: null, mass: '80' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithNull, 'height', 'asc');
    expect(result).toHaveLength(2);
    expect(result[0].height).toBeNull();
  });

  it('should handle undefined values for mass', () => {
    const charsWithUndefined = [
      { name: 'A', height: '150', mass: undefined },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(charsWithUndefined, 'mass', 'asc');
    expect(result).toHaveLength(2);
  });

  it('should handle aValue > bValue case', () => {
    const chars = [
      { name: 'A', height: '100', mass: '50' },
      { name: 'B', height: '200', mass: '100' },
    ];
    const result = sortCharacters(chars, 'height', 'asc');
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
  });

  it('should handle height with valid numeric value (not unknown, not null)', () => {
    const chars = [
      { name: 'A', height: '150', mass: '80' },
      { name: 'B', height: '200', mass: '90' },
    ];
    const result = sortCharacters(chars, 'height', 'asc');
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
  });

  it('should handle string field sorting (else branch)', () => {
    const chars = [
      { name: 'Zebra', gender: 'male' },
      { name: 'Alpha', gender: 'female' },
    ];
    const result = sortCharacters(chars, 'name', 'asc');
    expect(result[0].name).toBe('Alpha');
    expect(result[1].name).toBe('Zebra');
  });

  it('should handle height with truthy non-unknown value (ternary else branch)', () => {
    const chars = [
      { name: 'A', height: '150', mass: '80' },
      { name: 'B', height: '200', mass: '90' },
    ];
    const result = sortCharacters(chars, 'height', 'asc');
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
  });

  it('should handle mass with truthy non-unknown value (ternary else branch)', () => {
    const chars = [
      { name: 'A', height: '150', mass: '50' },
      { name: 'B', height: '150', mass: '100' },
    ];
    const result = sortCharacters(chars, 'mass', 'asc');
    expect(result[0].name).toBe('A');
    expect(result[1].name).toBe('B');
  });

  it('should handle string values in else branch (lines 14-15)', () => {
    const chars = [
      { name: 'Zebra', gender: 'male', birth_year: '19BBY' },
      { name: 'Alpha', gender: 'female', birth_year: '19BBY' },
    ];
    const result = sortCharacters(chars, 'gender', 'asc');
    expect(result[0].gender).toBe('female');
    expect(result[1].gender).toBe('male');
  });

  it('should handle height with truthy non-unknown value (line 10 else branch)', () => {
    const chars = [
      { name: 'A', height: '150', mass: '80' },
      { name: 'B', height: '100', mass: '90' },
    ];
    const result = sortCharacters(chars, 'height', 'asc');
    expect(result[0].name).toBe('B'); // 100 < 150
    expect(result[1].name).toBe('A');
  });

  it('should handle mass with truthy non-unknown value (line 10 else branch)', () => {
    const chars = [
      { name: 'A', height: '150', mass: '50' },
      { name: 'B', height: '150', mass: '100' },
    ];
    const result = sortCharacters(chars, 'mass', 'asc');
    expect(result[0].name).toBe('A'); // 50 < 100
    expect(result[1].name).toBe('B');
  });

  it('should handle string field with truthy value (line 14 else branch)', () => {
    const chars = [
      { name: 'Zebra', gender: 'male' },
      { name: 'Alpha', gender: 'female' },
    ];
    const result = sortCharacters(chars, 'name', 'asc');
    expect(result[0].name).toBe('Alpha');
    expect(result[1].name).toBe('Zebra');
  });

  it('should handle height with valid numeric string (line 10 else branch - not unknown, not falsy)', () => {
    const chars = [
      { name: 'A', height: '200', mass: '80' },
      { name: 'B', height: '150', mass: '90' },
    ];
    const result = sortCharacters(chars, 'height', 'asc');
    expect(result[0].name).toBe('B'); // 150 < 200
    expect(result[1].name).toBe('A');
  });
});

