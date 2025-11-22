import React, { useState, useRef, useEffect } from 'react';
import './AddressBar.css';

const AddressBar = ({ 
  url, 
  onNavigate, 
  onBookmark, 
  isBookmarked, 
  onRemoveBookmark,
  bookmarks,
  history,
  onBack,
  onForward,
  onRefresh
}) => {
  const [inputValue, setInputValue] = useState(url);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const filteredHistory = history
        .filter(item => item.url.toLowerCase().includes(value.toLowerCase()) || 
                       item.title?.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      
      const filteredBookmarks = bookmarks
        .filter(bookmark => 
          bookmark.url.toLowerCase().includes(value.toLowerCase()) || 
          bookmark.title.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      
      setSuggestions([...filteredBookmarks, ...filteredHistory]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleNavigate = () => {
    setShowSuggestions(false);
    onNavigate(inputValue);
  };

  const handleSuggestionClick = (suggestionUrl) => {
    setInputValue(suggestionUrl);
    setShowSuggestions(false);
    onNavigate(suggestionUrl);
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleForward = () => {
    if (onForward) onForward();
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  const handleHome = () => {
    onNavigate('about:blank');
  };

  return (
    <div className="address-bar-container">
      <div className="address-bar">
        <div className="navigation-buttons">
          <button className="nav-button" onClick={handleBack} title="Back">
            ←
          </button>
          <button className="nav-button" onClick={handleForward} title="Forward">
            →
          </button>
          <button className="nav-button" onClick={handleRefresh} title="Refresh">
            ↻
          </button>
          <button className="nav-button" onClick={handleHome} title="Home">
            ⌂
          </button>
        </div>
        <div className="url-input-container" ref={suggestionsRef}>
          <input
            ref={inputRef}
            type="text"
            className="url-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder="Search Google or type a URL"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion.url)}
                >
                  <span className="suggestion-icon">🔍</span>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{suggestion.title || suggestion.url}</div>
                    <div className="suggestion-url">{suggestion.url}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="address-bar-actions">
          <button
            className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={isBookmarked ? onRemoveBookmark : onBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressBar;

