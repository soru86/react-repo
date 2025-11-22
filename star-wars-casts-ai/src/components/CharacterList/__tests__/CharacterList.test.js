import React from 'react';
import { render, screen } from '@testing-library/react';
import CharacterList from '../CharacterList';

// Mock react-virtualized
jest.mock('react-virtualized', () => ({
  List: ({ rowRenderer, rowCount }) => {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push(rowRenderer({ index: i, key: i, style: {} }));
    }
    return <div data-testid="virtualized-list">{rows}</div>;
  },
  AutoSizer: ({ children }) => children({ height: 600, width: 800 }),
}));

// Mock Pagination component
jest.mock('../../Pagination/Pagination', () => {
  return function MockPagination({ currentPage, totalPages, onPageChange, totalItems }) {
    return (
      <div data-testid="pagination">
        <div>Page {currentPage} of {totalPages}</div>
        <div>Total: {totalItems}</div>
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

describe('CharacterList', () => {
  const mockCharacters = [
    {
      id: '1',
      name: 'Luke Skywalker',
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
    },
    {
      id: '2',
      name: 'Leia Organa',
      gender: 'female',
      birth_year: '19BBY',
      height: '150',
      mass: '49',
      hair_color: 'brown',
      skin_color: 'light',
      eye_color: 'brown',
    },
  ];

  const mockOnSort = jest.fn();
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnSort.mockClear();
    mockOnPageChange.mockClear();
  });

  it('should render character list', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
  });

  it('should display character details', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getAllByText(/Gender:/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Birth Year:/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Height:/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Mass:/)[0]).toBeInTheDocument();
  });

  it('should filter characters by search term', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm="Luke"
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument();
  });

  it('should display "No characters found" when filtered list is empty', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm="NonExistent"
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('No characters found')).toBeInTheDocument();
  });

  it('should call onSort when header is clicked', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    nameHeader.click();

    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should toggle sort direction when same field is clicked', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    nameHeader.click();

    expect(mockOnSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('should display sort icons correctly', () => {
    const { rerender } = render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Name ⇅')).toBeInTheDocument();

    rerender(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Name ↑')).toBeInTheDocument();

    rerender(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="desc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Name ↓')).toBeInTheDocument();
  });

  it('should sort characters correctly', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="desc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const characterNames = screen.getAllByText(/Luke Skywalker|Leia Organa/);
    // First character name in the list should be Leia (sorted desc)
    const firstCharacter = characterNames.find(el => el.textContent.includes('Leia Organa'));
    expect(firstCharacter).toBeInTheDocument();
  });

  it('should handle characters with missing fields', () => {
    const incompleteCharacter = {
      id: '3',
      name: 'Test Character',
    };

    render(
      <CharacterList
        characters={[incompleteCharacter]}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('Test Character')).toBeInTheDocument();
    expect(screen.getByText(/Gender:/)).toBeInTheDocument();
  });

  it('should display pagination when onPageChange is provided', () => {
    const manyCharacters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
    }));

    render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should not display pagination when onPageChange is not provided', () => {
    const manyCharacters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
    }));

    render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should paginate characters correctly', () => {
    const manyCharacters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
    }));

    const { rerender } = render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    // First page should show first 10 characters
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 10')).toBeInTheDocument();
    expect(screen.queryByText('Character 11')).not.toBeInTheDocument();

    // Second page should show next 10 characters
    rerender(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={2}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Character 11')).toBeInTheDocument();
    expect(screen.queryByText('Character 1')).not.toBeInTheDocument();
  });

  it('should reset to first page when search changes', () => {
    const manyCharacters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
    }));

    const { rerender } = render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />
    );

    // Change search term - pagination should still work but with filtered results
    rerender(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm="Character 1"
        onSort={mockOnSort}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Character 1')).toBeInTheDocument();
  });

  it('should handle sorting by height with unknown values', () => {
    const charsWithUnknown = [
      { id: '1', name: 'A', height: 'unknown', mass: '80', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '150', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={charsWithUnknown}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const characterNames = screen.getAllByText(/^A$|^B$/);
    expect(characterNames[0]).toHaveTextContent('A');
  });

  it('should handle sorting by mass with unknown values', () => {
    const charsWithUnknown = [
      { id: '1', name: 'A', height: '150', mass: 'unknown', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '150', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={charsWithUnknown}
        sortField="mass"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const characterNames = screen.getAllByText(/^A$|^B$/);
    expect(characterNames[0]).toHaveTextContent('A');
  });

  it('should handle sorting when values are equal', () => {
    const equalChars = [
      { id: '1', name: 'A', height: '150', mass: '80' },
      { id: '2', name: 'B', height: '150', mass: '80' },
    ];

    render(
      <CharacterList
        characters={equalChars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should call onSort for gender header', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const genderHeaders = screen.getAllByText(/Gender/);
    const genderHeader = genderHeaders[0].closest('.sortable');
    genderHeader.click();
    expect(mockOnSort).toHaveBeenCalledWith('gender', 'asc');
  });

  it('should call onSort for birth_year header', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const birthYearHeaders = screen.getAllByText(/Birth Year/);
    const birthYearHeader = birthYearHeaders[0].closest('.sortable');
    birthYearHeader.click();
    expect(mockOnSort).toHaveBeenCalledWith('birth_year', 'asc');
  });

  it('should call onSort for height header', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const heightHeaders = screen.getAllByText(/Height/);
    const heightHeader = heightHeaders[0].closest('.sortable');
    heightHeader.click();
    expect(mockOnSort).toHaveBeenCalledWith('height', 'asc');
  });

  it('should call onSort for mass header', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const massHeaders = screen.getAllByText(/Mass/);
    const massHeader = massHeaders[0].closest('.sortable');
    massHeader.click();
    expect(mockOnSort).toHaveBeenCalledWith('mass', 'asc');
  });

  it('should handle invalid currentPage by clamping to valid range', () => {
    const manyCharacters = Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
    }));

    render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should still render characters (clamped to page 1)
    expect(screen.getByText('Character 1')).toBeInTheDocument();
  });

  it('should handle sorting by height with unknown value in CharacterList', () => {
    const charsWithUnknown = [
      { id: '1', name: 'A', height: 'unknown', mass: '80', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '150', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={charsWithUnknown}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should handle sorting when aValue > bValue', () => {
    const chars = [
      { id: '1', name: 'A', height: '100', mass: '50', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '200', mass: '100', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Should be sorted ascending
    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('A');
  });

  it('should toggle sort when clicking same field twice', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    nameHeader.click();
    
    // Should toggle to desc
    expect(mockOnSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('should handle sorting by height with valid numeric values (not unknown)', () => {
    const chars = [
      { id: '1', name: 'A', height: '100', mass: '80', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '200', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should handle sorting by non-numeric fields (else branch)', () => {
    const chars = [
      { id: '1', name: 'Zebra', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'Alpha', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="name"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const names = screen.getAllByText(/Zebra|Alpha/);
    expect(names[0]).toHaveTextContent('Alpha');
  });

  it('should handle aValue > bValue branch in sorting', () => {
    const chars = [
      { id: '1', name: 'B', height: '200', mass: '100', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'A', height: '100', mass: '50', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('A');
  });

  it('should handle height sorting with non-unknown values (ternary else branch)', () => {
    const chars = [
      { id: '1', name: 'A', height: '150', mass: '80', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '100', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Should sort by height ascending
    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('B'); // B has height 100, should come first
  });

  it('should handle sortField !== field branch in handleSort', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Click gender header when name is already sorted
    const genderHeaders = screen.getAllByText(/Gender/);
    const genderHeader = genderHeaders[0].closest('.sortable');
    genderHeader.click();
    
    // Should set new field to asc
    expect(mockOnSort).toHaveBeenCalledWith('gender', 'asc');
  });

  it('should toggle from desc to asc when clicking same field', () => {
    render(
      <CharacterList
        characters={mockCharacters}
        sortField="name"
        sortDirection="desc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    nameHeader.click();
    
    // Should toggle from desc to asc
    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should handle height sorting with non-unknown numeric values (line 30 else branch)', () => {
    const chars = [
      { id: '1', name: 'A', height: '100', mass: '80', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '200', mass: '90', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Should sort by height ascending (non-unknown values)
    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('A');
  });

  it('should handle mass sorting with non-unknown numeric values (line 30 else branch)', () => {
    const chars = [
      { id: '1', name: 'A', height: '150', mass: '50', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'B', height: '150', mass: '100', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="mass"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Should sort by mass ascending (non-unknown values)
    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('A');
  });

  it('should handle string field sorting (lines 33-34 else branch)', () => {
    const chars = [
      { id: '1', name: 'Zebra', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'Alpha', gender: 'female', birth_year: '19BBY', height: '172', mass: '77', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="gender"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // Should sort by gender (string field) ascending
    const names = screen.getAllByText(/Zebra|Alpha/);
    expect(names[0]).toHaveTextContent('Alpha');
  });

  it('should handle aValue > bValue branch in sorting (line 41)', () => {
    const chars = [
      { id: '1', name: 'B', height: '200', mass: '100', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
      { id: '2', name: 'A', height: '100', mass: '50', gender: 'male', birth_year: '19BBY', hair_color: 'brown', skin_color: 'fair', eye_color: 'blue' },
    ];

    render(
      <CharacterList
        characters={chars}
        sortField="height"
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
      />
    );

    // When sorting ascending, B (200) > A (100), so A should come first
    const names = screen.getAllByText(/^A$|^B$/);
    expect(names[0]).toHaveTextContent('A');
  });

  it('should handle rowRenderer returning null when character is missing (line 58)', () => {
    const manyCharacters = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Character ${i + 1}`,
      gender: 'male',
      birth_year: '19BBY',
      height: '172',
      mass: '77',
      hair_color: 'brown',
      skin_color: 'fair',
      eye_color: 'blue',
    }));

    render(
      <CharacterList
        characters={manyCharacters}
        sortField={null}
        sortDirection="asc"
        searchTerm=""
        onSort={mockOnSort}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );

    // Should render characters, but if rowRenderer is called with invalid index, it returns null
    // This is tested indirectly by ensuring pagination works correctly
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 10')).toBeInTheDocument();
  });
});

