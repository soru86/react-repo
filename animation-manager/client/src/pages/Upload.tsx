import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { addToQueue, isOnline, onOnlineStatusChange, getPendingUploads } from '../utils/offlineUploadQueue';
import './Upload.css';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check online status and pending uploads
  useEffect(() => {
    setOnlineStatus(isOnline());
    updatePendingCount();
    
    const unsubscribe = onOnlineStatusChange((online) => {
      setOnlineStatus(online);
      if (online) {
        updatePendingCount();
        // Try to process queue when back online
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            if ('sync' in registration) {
              registration.sync.register('background-upload').catch((err) => {
                console.error('Background sync registration failed:', err);
              });
            }
          });
        }
      }
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPLOAD_SUCCESS') {
          updatePendingCount();
          queryClient.invalidateQueries('animations');
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const updatePendingCount = async () => {
    try {
      const pending = await getPendingUploads();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Error getting pending uploads:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/json' && !selectedFile.name.endsWith('.json')) {
        setError('Only JSON files are allowed');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const uploadMutation = useMutation(
    async () => {
      if (!file) throw new Error('File is required');
      
      // Check if online
      if (!isOnline()) {
        // Queue for offline upload
        await addToQueue(file, title, description, tags, isPublic);
        
        // Register background sync
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            if ('sync' in registration) {
              await registration.sync.register('background-upload');
            }
          } catch (err) {
            console.error('Background sync registration failed:', err);
          }
        }
        
        throw new Error('OFFLINE_QUEUED');
      }
      
      // Online - proceed with normal upload
      return api.animations.create(
        { title, description, tags, is_public: isPublic },
        file
      );
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('animations');
        // Reset form
        setTitle('');
        setDescription('');
        setTags('');
        setIsPublic(false);
        setFile(null);
        navigate(`/animations/${data.id}`);
      },
      onError: (err: any) => {
        if (err.message === 'OFFLINE_QUEUED') {
          setError('');
          // Show success message for queued upload
          alert('You are offline. Your upload has been queued and will be processed when you are back online.');
          updatePendingCount();
          // Reset form after queueing
          setTitle('');
          setDescription('');
          setTags('');
          setIsPublic(false);
          setFile(null);
        } else {
          setError(err.response?.data?.error || 'Upload failed');
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    uploadMutation.mutate();
  };

  return (
    <div className="upload-container">
      <h1>Upload Animation</h1>
      {!onlineStatus && (
        <div className="offline-notice" style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          border: '1px solid #ffc107'
        }}>
          ⚠️ You are offline. Uploads will be queued and processed when you are back online.
        </div>
      )}
      {pendingCount > 0 && (
        <div className="pending-notice" style={{ 
          background: '#d1ecf1', 
          color: '#0c5460', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          border: '1px solid #bee5eb'
        }}>
          📤 {pendingCount} upload{pendingCount > 1 ? 's' : ''} pending. {onlineStatus ? 'Processing...' : 'Will process when online.'}
        </div>
      )}
      <form onSubmit={handleSubmit} className="upload-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="file">Lottie Animation File (JSON)</label>
          <input
            type="file"
            id="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            required
            disabled={uploadMutation.isLoading}
          />
          {file && (
            <div className="file-info">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={uploadMutation.isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={uploadMutation.isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., loading, spinner, ui"
            disabled={uploadMutation.isLoading}
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={uploadMutation.isLoading}
            />
            Make this animation public
          </label>
        </div>

        <button
          type="submit"
          disabled={uploadMutation.isLoading || !file || !title.trim()}
          className="btn-primary"
        >
          {uploadMutation.isLoading ? 'Uploading...' : 'Upload Animation'}
        </button>
      </form>
    </div>
  );
}





