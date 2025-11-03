import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import './Upload.css';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(
    () => {
      if (!file) throw new Error('File is required');
      return api.animations.create(
        { title, description, tags, is_public: isPublic },
        file
      );
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('animations');
        navigate(`/animations/${data.id}`);
      },
      onError: (err: any) => {
        setError(err.response?.data?.error || 'Upload failed');
      },
    }
  );

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

