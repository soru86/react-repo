import React, { useState, useEffect } from 'react';
import { fetchAllCharacters } from './services/api';
import CharacterList from './components/CharacterList/CharacterList';
import SearchBar from './components/SearchBar/SearchBar';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import './App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="app-content">
          <h1 className="app-title">Star Wars Characters</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="app-content">
          <h1 className="app-title">Star Wars Characters</h1>
          <ErrorMessage message={error} onRetry={loadCharacters} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Star Wars Characters</h1>
        <p className="app-subtitle">
          Explore the galaxy far, far away... ({characters.length} characters)
        </p>
        <SearchBar value={searchTerm} onChange={handleSearchChange} />
        <div className="list-wrapper">
          <CharacterList
            characters={characters}
            sortField={sortField}
            sortDirection={sortDirection}
            searchTerm={searchTerm}
            onSort={handleSort}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

