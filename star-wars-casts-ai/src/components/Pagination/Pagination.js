import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container" data-testid="pagination">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} characters
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
          data-testid="prev-button"
        >
          ‹ Previous
        </button>
        
        <div className="page-numbers">
          {getPageNumbers().map((page, index) => {
            // Show ellipsis before first page if needed
            if (index === 0 && page > 1) {
              return (
                <React.Fragment key={`ellipsis-start-${page}`}>
                  <button
                    className="pagination-button page-number"
                    onClick={() => handlePageClick(1)}
                    aria-label={`Go to page 1`}
                  >
                    1
                  </button>
                  {page > 2 && <span className="ellipsis">...</span>}
                </React.Fragment>
              );
            }
            
            return (
              <button
                key={page}
                className={`pagination-button page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                data-testid={`page-button-${page}`}
              >
                {page}
              </button>
            );
          })}
          
          {/* Show ellipsis after last page if needed */}
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span className="ellipsis">...</span>
              )}
              <button
                className="pagination-button page-number"
                onClick={() => handlePageClick(totalPages)}
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        <button
          className="pagination-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          data-testid="next-button"
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;

