import { filterCharacters } from '../filterCharacters';

describe('filterCharacters', () => {
  const mockCharacters = [
    {
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
      homeworld: 'Tatooine',
    },
    {
      name: 'Leia Organa',
      gender: 'female',
      birth_year: '19BBY',
      height: '150',
      mass: '49',
      homeworld: 'Alderaan',
    },
    {
      name: 'Darth Vader',
      gender: 'male',
      birth_year: '41.9BBY',
      height: '202',
      mass: '136',
      homeworld: 'Tatooine',
    },
  ];

  it('should return all characters when search term is empty', () => {
    const result = filterCharacters(mockCharacters, '');
    expect(result).toEqual(mockCharacters);
  });

  it('should return all characters when search term is only whitespace', () => {
    const result = filterCharacters(mockCharacters, '   ');
    expect(result).toEqual(mockCharacters);
  });

  it('should filter by name', () => {
    const result = filterCharacters(mockCharacters, 'Luke');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('should filter by name case-insensitively', () => {
    const result = filterCharacters(mockCharacters, 'luke');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('should filter by gender', () => {
    const result = filterCharacters(mockCharacters, 'female');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leia Organa');
  });

  it('should filter by birth_year', () => {
    const result = filterCharacters(mockCharacters, '19BBY');
    expect(result).toHaveLength(2);
  });

  it('should filter by height', () => {
    const result = filterCharacters(mockCharacters, '172');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('should filter by mass', () => {
    const result = filterCharacters(mockCharacters, '77');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('should filter by homeworld', () => {
    const result = filterCharacters(mockCharacters, 'Tatooine');
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no matches found', () => {
    const result = filterCharacters(mockCharacters, 'NonExistent');
    expect(result).toHaveLength(0);
  });

  it('should handle partial matches', () => {
    const result = filterCharacters(mockCharacters, 'Sky');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Luke Skywalker');
  });

  it('should handle null or undefined values gracefully', () => {
    const charsWithNulls = [
      { name: 'Test', gender: null, birth_year: undefined },
    ];
    const result = filterCharacters(charsWithNulls, 'Test');
    expect(result).toHaveLength(1);
  });
});

