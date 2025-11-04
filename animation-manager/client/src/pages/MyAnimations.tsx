import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import SafeLottie from '../components/SafeLottie';
import api, { Animation } from '../utils/api';
import './MyAnimations.css';

export default function MyAnimations() {
  const [animationsWithData, setAnimationsWithData] = useState<Map<number, any>>(new Map());

  const { data: animations = [], isLoading, error } = useQuery<Animation[]>(
    'my-animations',
    api.animations.getMyAnimations,
    {
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching my animations:', error);
      },
    }
  );

  // Load animation data for all animations
  useEffect(() => {
    const loadAnimationData = async () => {
      const dataMap = new Map();
      for (const animation of animations) {
        try {
          if (!animation.file_path) {
            console.warn(`Animation ${animation.id} has no file_path`);
            continue;
          }
          
          const response = await fetch(animation.file_path);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.warn(`Animation ${animation.id} is not JSON: ${contentType}`);
            continue;
          }
          
          const data = await response.json();
          
          // Validate it's a valid object
          if (data && typeof data === 'object') {
            dataMap.set(animation.id, data);
          } else {
            console.warn(`Animation ${animation.id} has invalid data structure`);
          }
        } catch (error) {
          console.error(`Error loading animation ${animation.id}:`, error);
        }
      }
      setAnimationsWithData(dataMap);
    };

    if (animations.length > 0) {
      loadAnimationData();
    }
  }, [animations]);

  return (
    <div className="my-animations-container">
      <div className="my-animations-header">
        <h1>My Animations</h1>
        <Link to="/upload" className="btn-primary">
          Upload New Animation
        </Link>
      </div>

      {isLoading ? (
        <div className="loading">Loading your animations...</div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: '#dc3545' }}>
            Error loading animations: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : animations.length === 0 ? (
        <div className="empty-state">
          <p>You haven't uploaded any animations yet.</p>
          <Link to="/upload" className="btn-primary">Upload Your First Animation</Link>
        </div>
      ) : (
        <div className="animations-grid">
          {animations.map((animation) => (
            <Link
              key={animation.id}
              to={`/animations/${animation.id}`}
              className="animation-card"
            >
              <div className="animation-preview">
                <SafeLottie
                  animationData={animationsWithData.get(animation.id)}
                  style={{ width: '100%', height: '200px' }}
                  loop={true}
                  autoplay={true}
                  fallback={
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      {animationsWithData.has(animation.id) ? 'Invalid animation' : 'Loading...'}
                    </div>
                  }
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

