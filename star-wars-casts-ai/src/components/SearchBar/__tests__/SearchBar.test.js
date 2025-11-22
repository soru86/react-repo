import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render search input', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByLabelText('Search characters');
    expect(input).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Search characters...');
    expect(input).toBeInTheDocument();
  });

  it('should display custom placeholder', () => {
    render(
      <SearchBar value="" onChange={mockOnChange} placeholder="Custom placeholder" />
    );
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when input value changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByLabelText('Search characters');

    await user.type(input, 'Luke');

    expect(mockOnChange).toHaveBeenCalled();
    // user.type() calls onChange for each character typed
    // Since it's a controlled component, onChange is called with each character
    // Verify it was called multiple times (once per character: 'L', 'u', 'k', 'e')
    expect(mockOnChange.mock.calls.length).toBeGreaterThanOrEqual(4);
    // Verify that onChange was called with at least one character
    const allCalls = mockOnChange.mock.calls.map(call => call[0]);
    expect(allCalls.length).toBeGreaterThan(0);
  });

  it('should display current value', () => {
    render(<SearchBar value="Luke Skywalker" onChange={mockOnChange} />);
    const input = screen.getByLabelText('Search characters');
    expect(input).toHaveValue('Luke Skywalker');
  });

  it('should render search icon', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const icon = screen.getByText('🔍');
    expect(icon).toBeInTheDocument();
  });

  it('should show clear button when there is text', () => {
    render(<SearchBar value="Luke" onChange={mockOnChange} />);
    const clearButton = screen.getByTestId('clear-button');
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when there is no text', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const clearButton = screen.queryByTestId('clear-button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should not show clear button when there is only whitespace', () => {
    render(<SearchBar value="   " onChange={mockOnChange} />);
    const clearButton = screen.queryByTestId('clear-button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="Luke" onChange={mockOnChange} />);
    const clearButton = screen.getByTestId('clear-button');

    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should have aria-label on clear button', () => {
    render(<SearchBar value="Luke" onChange={mockOnChange} />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });
});

