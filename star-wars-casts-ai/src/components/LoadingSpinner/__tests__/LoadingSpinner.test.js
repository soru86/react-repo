import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  it('should render spinner element', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});

