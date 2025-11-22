export const filterCharacters = (characters, searchTerm) => {
  if (!searchTerm.trim()) return characters;

  const term = searchTerm.toLowerCase().trim();
  return characters.filter((character) => {
    return (
      character.name?.toLowerCase().includes(term) ||
      character.gender?.toLowerCase().includes(term) ||
      character.birth_year?.toLowerCase().includes(term) ||
      character.homeworld?.toLowerCase().includes(term) ||
      character.height?.toLowerCase().includes(term) ||
      character.mass?.toLowerCase().includes(term)
    );
  });
};

