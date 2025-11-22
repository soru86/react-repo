import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search characters...' }) => {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search characters"
      />
      {value && value.trim() && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
          data-testid="clear-button"
        >
          ×
        </button>
      )}
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;

