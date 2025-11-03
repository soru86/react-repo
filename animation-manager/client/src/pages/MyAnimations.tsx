import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Lottie from 'lottie-react';
import api, { Animation } from '../utils/api';
import './MyAnimations.css';

export default function MyAnimations() {
  const { data: animations = [], isLoading } = useQuery<Animation[]>(
    'my-animations',
    api.animations.getMyAnimations,
    {
      refetchOnWindowFocus: false,
    }
  );

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

