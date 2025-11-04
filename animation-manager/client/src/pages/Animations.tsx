import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import SafeLottie from '../components/SafeLottie';
import api, { Animation } from '../utils/api';
import './Animations.css';

export default function Animations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Animation[]>([]);
  const [animationsWithData, setAnimationsWithData] = useState<Map<number, any>>(new Map());
  const [searchAnimationsWithData, setSearchAnimationsWithData] = useState<Map<number, any>>(new Map());

  const { data: animations = [], isLoading, error, refetch } = useQuery<Animation[]>(
    'animations',
    async () => {
      try {
        const result = await api.animations.getAll();
        return result;
      } catch (err: any) {
        console.error('[Animations] API call failed:', err);
        throw err;
      }
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Create a stable reference for animation IDs to prevent infinite loops
  const animationIds = useMemo(() => {
    if (!animations || animations.length === 0) return '';
    return animations.map(a => a.id).sort().join(',');
  }, [animations]);

  // Load animation data for all animations
  useEffect(() => {
    if (!animations || animations.length === 0) {
      setAnimationsWithData(new Map());
      return;
    }

    let cancelled = false;
    const loadAnimationData = async () => {
      const dataMap = new Map();
      
      // Process animations in parallel with Promise.allSettled to prevent one failure from blocking others
      const promises = animations.map(async (animation) => {
        try {
          if (!animation || !animation.id) {
            return null;
          }
          
          if (!animation.file_path) {
            return null;
          }
          
          // Ensure file_path is a valid URL (handle relative paths)
          const fileUrl = animation.file_path.startsWith('http') 
            ? animation.file_path 
            : animation.file_path.startsWith('/') 
              ? animation.file_path 
              : `/${animation.file_path}`;
          
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            return null;
          }
          
          const data = await response.json();
          
          // Validate it's a valid object
          if (data && typeof data === 'object') {
            return { id: animation.id, data };
          }
          return null;
        } catch (error) {
          // Silently fail - errors are expected for some animations
          return null;
        }
      });
      
      const results = await Promise.allSettled(promises);
      if (!cancelled) {
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            dataMap.set(result.value.id, result.value.data);
          }
        });
        setAnimationsWithData(dataMap);
      }
    };

    loadAnimationData();
    
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationIds]);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchAnimationsWithData(new Map());
      return;
    }

    try {
      const results = await api.animations.search(query);
      setSearchResults(results);
      
      // Load animation data for search results
      const dataMap = new Map();
      
      if (!Array.isArray(results) || results.length === 0) {
        setSearchAnimationsWithData(dataMap);
        return;
      }
      
      // Process animations in parallel
      const promises = results.map(async (animation) => {
        try {
          if (!animation || !animation.id || !animation.file_path) {
            return null;
          }
          
          // Ensure file_path is a valid URL (handle relative paths)
          const fileUrl = animation.file_path.startsWith('http') 
            ? animation.file_path 
            : animation.file_path.startsWith('/') 
              ? animation.file_path 
              : `/${animation.file_path}`;
          
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            return null;
          }
          
          const data = await response.json();
          
          // Validate it's a valid object
          if (data && typeof data === 'object') {
            return { id: animation.id, data };
          }
          return null;
        } catch (error) {
          // Silently fail
          return null;
        }
      });
      
      const settledResults = await Promise.allSettled(promises);
      settledResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          dataMap.set(result.value.id, result.value.data);
        }
      });
      
      setSearchAnimationsWithData(dataMap);
    } catch (error) {
      console.error('Search error:', error);
      // Set empty results on error
      setSearchResults([]);
      setSearchAnimationsWithData(new Map());
    }
  }, []);

  // Auto-search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setSearchAnimationsWithData(new Map());
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const displayAnimations = searchQuery ? searchResults : (animations || []);
  const displayAnimationsWithData = searchQuery ? searchAnimationsWithData : animationsWithData;

  return (
    <div className="animations-container">
      <div className="animations-header">
        <h1>All Animations</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search animations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="search-input"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {isLoading ? (
        <div className="loading">Loading animations...</div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: '#dc3545' }}>
            Error loading animations: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          {error && typeof error === 'object' && 'response' in error && (error as any).response?.data && (
            <p style={{ color: '#dc3545', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {(error as any).response.data.error || JSON.stringify((error as any).response.data)}
            </p>
          )}
          <button onClick={() => refetch()} className="btn-primary" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      ) : !displayAnimations || displayAnimations.length === 0 ? (
        <div className="empty-state">
          <p>No animations found. {searchQuery && 'Try a different search term.'}</p>
          {!searchQuery && (
            <Link to="/upload" className="btn-primary">Upload Your First Animation</Link>
          )}
        </div>
      ) : (
        <div className="animations-grid">
          {Array.isArray(displayAnimations) && displayAnimations.length > 0 ? (
            displayAnimations.map((animation) => {
              if (!animation || !animation.id) {
                return null;
              }
              
              const animationData = displayAnimationsWithData?.get(animation.id);
              
              return (
                <Link
                  key={animation.id}
                  to={`/animations/${animation.id}`}
                  className="animation-card"
                >
                  <div className="animation-preview">
                    <SafeLottie
                      animationData={animationData}
                      style={{ width: '100%', height: '200px' }}
                      loop={true}
                      autoplay={true}
                      fallback={
                        <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                          {displayAnimationsWithData?.has(animation.id) ? 'Invalid animation' : 'Loading...'}
                        </div>
                      }
                    />
                  </div>
                  <div className="animation-info">
                    <h3>{animation.title || 'Untitled Animation'}</h3>
                    {animation.description && (
                      <p className="animation-description">{animation.description}</p>
                    )}
                    <div className="animation-meta">
                      <span className="animation-date">
                        {animation.created_at ? new Date(animation.created_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                      {animation.is_public ? (
                        <span className="badge-public">Public</span>
                      ) : (
                        <span className="badge-private">Private</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="empty-state">
              <p>No animations to display.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

