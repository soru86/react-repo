export const sortCharacters = (characters, sortField, sortDirection) => {
  if (!sortField) return characters;

  return [...characters].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle numeric values (height, mass)
    if (sortField === 'height' || sortField === 'mass') {
      aValue = aValue === 'unknown' || !aValue ? 0 : parseInt(String(aValue).replace(/,/g, ''), 10);
      bValue = bValue === 'unknown' || !bValue ? 0 : parseInt(String(bValue).replace(/,/g, ''), 10);
    } else {
      // Handle string values
      aValue = (aValue || '').toString().toLowerCase();
      bValue = (bValue || '').toString().toLowerCase();
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

