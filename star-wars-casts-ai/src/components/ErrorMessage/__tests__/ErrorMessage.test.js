import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should display error title', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('should display error message text', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    render(<ErrorMessage message="Test error" onRetry={mockOnRetry} />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorMessage message="Test error" onRetry={mockOnRetry} />);
    const retryButton = screen.getByText('Try Again');

    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});

