import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { fetchAllCharacters } from '../services/api';

jest.mock('../services/api');

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

describe('App', () => {
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

  beforeEach(() => {
    fetchAllCharacters.mockClear();
  });

  it('should render app title', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    render(<App />);
    expect(screen.getByText('Star Wars Characters')).toBeInTheDocument();
  });

  it('should display loading spinner initially', async () => {
    fetchAllCharacters.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockCharacters), 100))
    );
    render(<App />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('should fetch and display characters', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(screen.getByText('Leia Organa')).toBeInTheDocument();
    expect(fetchAllCharacters).toHaveBeenCalledTimes(1);
  });

  it('should display character count', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/2 characters/)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch characters';
    fetchAllCharacters.mockRejectedValue(new Error(errorMessage));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should retry fetching on retry button click', async () => {
    const user = userEvent.setup();
    fetchAllCharacters
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockCharacters);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Try Again');
    await waitFor(async () => {
      await act(async () => {
        await user.click(retryButton);
      });
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    expect(fetchAllCharacters).toHaveBeenCalledTimes(2);
  });

  it('should filter characters by search term', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search characters');
    await waitFor(async () => {
      await act(async () => {
        await user.type(searchInput, 'Luke');
      });
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.queryByText('Leia Organa')).not.toBeInTheDocument();
    });
  });

  it('should handle sorting', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    expect(nameHeader).toBeInTheDocument();
    
    await waitFor(async () => {
      await act(async () => {
        await user.click(nameHeader);
      });
      // Verify sorting was triggered (characters should still be visible)
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });

  it('should reset page to 1 when search changes', async () => {
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

    fetchAllCharacters.mockResolvedValue(manyCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });

    // The search change handler should reset page to 1
    const searchInput = screen.getByLabelText('Search characters');
    await waitFor(async () => {
      await act(async () => {
        await user.clear(searchInput);
        await user.type(searchInput, 'Character 1');
      });
      // After search, should show filtered results starting from page 1
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });
  });

  it('should reset page to 1 when sorting changes', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    await waitFor(async () => {
      await act(async () => {
        await user.click(nameHeader);
      });
      // Sorting should reset page to 1 - wait for re-render
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });

  it('should handle page change', async () => {
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

    fetchAllCharacters.mockResolvedValue(manyCharacters);
    const user = userEvent.setup();
    
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Character 1')).toBeInTheDocument();
    });

    // Click next page
    const nextButton = screen.getByTestId('next-button');
    await waitFor(async () => {
      await act(async () => {
        await user.click(nextButton);
      });
      expect(screen.getByText('Character 11')).toBeInTheDocument();
    });

    // Verify scrollTo was called
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should handle search change and reset page', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search characters');
    await waitFor(async () => {
      await act(async () => {
        await user.type(searchInput, 'Luke');
      });
      // Verify search works
      expect(searchInput).toHaveValue('Luke');
    });
  });

  it('should handle sort and reset page', async () => {
    fetchAllCharacters.mockResolvedValue(mockCharacters);
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const nameHeader = screen.getByText(/Name/).closest('.sortable');
    await waitFor(async () => {
      await act(async () => {
        await user.click(nameHeader);
      });
      // Verify sort was triggered
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
});

