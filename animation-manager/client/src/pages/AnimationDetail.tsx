import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import SafeLottie from '../components/SafeLottie';
import { useAuth } from '../contexts/AuthContext';
import api, { Animation } from '../utils/api';
import './AnimationDetail.css';

export default function AnimationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [animationData, setAnimationData] = useState<any>(null);

  const { data: animation, isLoading } = useQuery<Animation>(
    ['animation', id],
    () => api.animations.getById(Number(id)),
    {
      enabled: !!id,
      onSuccess: (data) => {
        // Fetch animation file using relative path (will go through Vite proxy)
        if (!data.file_path) {
          console.error('Animation has no file_path');
          setAnimationData(null);
          return;
        }
        
        fetch(data.file_path)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to load animation: ${res.status} ${res.statusText}`);
            }
            
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error(`Invalid content type: ${contentType}`);
            }
            
            return res.json();
          })
          .then((jsonData) => {
            // Validate it's a valid object
            if (jsonData && typeof jsonData === 'object') {
              setAnimationData(jsonData);
            } else {
              throw new Error('Invalid animation data structure');
            }
          })
          .catch((err) => {
            console.error('Error loading animation:', err);
            setAnimationData(null);
          });
      },
    }
  );

  const deleteMutation = useMutation(
    () => api.animations.delete(Number(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('animations');
        navigate('/animations');
      },
    }
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this animation?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="loading">Loading animation...</div>;
  }

  if (!animation) {
    return <div className="error">Animation not found</div>;
  }

  const isOwner = user?.id === animation.user_id;

  return (
    <div className="animation-detail-container">
      <Link to="/animations" className="back-link">← Back to Animations</Link>
      
      <div className="animation-detail">
        <div className="animation-detail-preview">
          <SafeLottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', maxHeight: '500px' }}
            fallback={
              <div className="loading">
                {animationData ? 'Invalid animation data' : 'Loading animation preview...'}
              </div>
            }
          />
        </div>

        <div className="animation-detail-info">
          <h1>{animation.title}</h1>
          
          {animation.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{animation.description}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Details</h3>
            <div className="detail-meta">
              <div className="meta-item">
                <strong>File:</strong> {animation.filename}
              </div>
              {animation.file_size && (
                <div className="meta-item">
                  <strong>Size:</strong> {(animation.file_size / 1024).toFixed(2)} KB
                </div>
              )}
              <div className="meta-item">
                <strong>Created:</strong> {new Date(animation.created_at).toLocaleString()}
              </div>
              <div className="meta-item">
                <strong>Visibility:</strong>{' '}
                {animation.is_public ? (
                  <span className="badge-public">Public</span>
                ) : (
                  <span className="badge-private">Private</span>
                )}
              </div>
              {animation.tags && (
                <div className="meta-item">
                  <strong>Tags:</strong> {animation.tags}
                </div>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="detail-actions">
              <Link to={`/animations/${id}/edit`} className="btn-secondary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


