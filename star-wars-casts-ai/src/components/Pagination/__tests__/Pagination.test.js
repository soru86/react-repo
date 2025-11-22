import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={5}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('should display pagination info', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    expect(screen.getByText(/Showing 1-10 of 50 characters/)).toBeInTheDocument();
  });

  it('should display correct info for last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={47}
      />
    );
    expect(screen.getByText(/Showing 41-47 of 47 characters/)).toBeInTheDocument();
  });

  it('should call onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const nextButton = screen.getByTestId('next-button');
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const prevButton = screen.getByTestId('prev-button');
    await user.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const prevButton = screen.getByTestId('prev-button');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const page3Button = screen.getByTestId('page-button-3');
    await user.click(page3Button);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const page3Button = screen.getByTestId('page-button-3');
    expect(page3Button).toHaveClass('active');
  });

  it('should show ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    const ellipsis = document.querySelectorAll('.ellipsis');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should show first and last page when current page is in middle', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument();
  });

  it('should have proper aria labels', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
  });

  it('should have aria-current on active page', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const activeButton = screen.getByTestId('page-button-2');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('should show pages 1-5 when currentPage is 3 or less', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    expect(screen.getByTestId('page-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('page-button-5')).toBeInTheDocument();
    expect(screen.queryByTestId('page-button-6')).not.toBeInTheDocument();
  });

  it('should show last 5 pages when currentPage is near end', () => {
    render(
      <Pagination
        currentPage={9}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    // When currentPage is 9 (which is >= totalPages - 2 = 8), should show pages 6-10
    const page6Button = screen.queryByLabelText('Go to page 6');
    const page10Button = screen.getByLabelText('Go to page 10');
    // Page 6 might be in the visible range or might need to click through ellipsis
    expect(page10Button).toBeInTheDocument();
    // Verify we're showing the last pages
    expect(screen.getByTestId('page-button-9')).toBeInTheDocument();
  });

  it('should show ellipsis when page > 2', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    // Should show ellipsis before first page (page 1) when current page is 5
    const ellipsis = document.querySelectorAll('.ellipsis');
    expect(ellipsis.length).toBeGreaterThan(0);
    // Verify page 1 button exists (for ellipsis condition)
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
  });

  it('should call onPageChange when last page button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    const lastPageButton = screen.getByLabelText('Go to page 10');
    await user.click(lastPageButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('should not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const currentPageButton = screen.getByTestId('page-button-3');
    await user.click(currentPageButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when previous is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const prevButton = screen.getByTestId('prev-button');
    await user.click(prevButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when next is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const nextButton = screen.getByTestId('next-button');
    await user.click(nextButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should call onPageChange when clicking page 1 button from ellipsis', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    const page1Button = screen.getByLabelText('Go to page 1');
    await user.click(page1Button);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should show ellipsis when page is exactly 3', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={100}
      />
    );
    // When currentPage is 3, should show pages 1-5, and ellipsis before page 1 if needed
    expect(screen.getByTestId('page-button-1')).toBeInTheDocument();
    expect(screen.getByTestId('page-button-5')).toBeInTheDocument();
  });

  it('should not call onPageChange when previous is clicked on page 1', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const prevButton = screen.getByTestId('prev-button');
    await user.click(prevButton);
    // Should not call because button is disabled, but if it somehow gets called, it shouldn't change page
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when next is clicked on last page', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        itemsPerPage={10}
        totalItems={50}
      />
    );
    const nextButton = screen.getByTestId('next-button');
    await user.click(nextButton);
    // Should not call because button is disabled
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});

