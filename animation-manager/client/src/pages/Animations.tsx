import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Lottie from 'lottie-react';
import api, { Animation } from '../utils/api';
import './Animations.css';

export default function Animations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Animation[]>([]);

  const { data: animations = [], isLoading, refetch } = useQuery<Animation[]>(
    'animations',
    api.animations.getAll,
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await api.animations.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const displayAnimations = searchQuery ? searchResults : animations;

  return (
    <div className="animations-container">
      <div className="animations-header">
        <h1>All Animations</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search animations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {isLoading ? (
        <div className="loading">Loading animations...</div>
      ) : displayAnimations.length === 0 ? (
        <div className="empty-state">
          <p>No animations found. {searchQuery && 'Try a different search term.'}</p>
          <Link to="/upload" className="btn-primary">Upload Your First Animation</Link>
        </div>
      ) : (
        <div className="animations-grid">
          {displayAnimations.map((animation) => (
            <Link
              key={animation.id}
              to={`/animations/${animation.id}`}
              className="animation-card"
            >
              <div className="animation-preview">
                <Lottie
                  style={{ width: '100%', height: '200px' }}
                  loop={true}
                  autoplay={true}
                  path={`http://localhost:5000${animation.file_path}`}
                />
              </div>
              <div className="animation-info">
                <h3>{animation.title}</h3>
                {animation.description && (
                  <p className="animation-description">{animation.description}</p>
                )}
                <div className="animation-meta">
                  <span className="animation-date">
                    {new Date(animation.created_at).toLocaleDateString()}
                  </span>
                  {animation.is_public ? (
                    <span className="badge-public">Public</span>
                  ) : (
                    <span className="badge-private">Private</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

