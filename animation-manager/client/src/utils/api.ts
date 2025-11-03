import axios from 'axios';

// Use relative URL to leverage Vite proxy, or use env var if set
const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Animation {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  filename: string;
  file_path: string;
  file_size: number | null;
  tags: string | null;
  is_public: number;
  created_at: string;
  updated_at: string;
}

export interface AnimationCreate {
  title: string;
  description?: string;
  tags?: string;
  is_public?: boolean;
}

const api = {
  animations: {
    getAll: async (): Promise<Animation[]> => {
      const response = await axios.get('/animations');
      return response.data;
    },
    getPublic: async (): Promise<Animation[]> => {
      const response = await axios.get('/animations/public');
      return response.data;
    },
    getMyAnimations: async (): Promise<Animation[]> => {
      const response = await axios.get('/animations/my-animations');
      return response.data;
    },
    getById: async (id: number): Promise<Animation> => {
      const response = await axios.get(`/animations/${id}`);
      return response.data;
    },
    search: async (query: string): Promise<Animation[]> => {
      const response = await axios.get(`/animations/search/${encodeURIComponent(query)}`);
      return response.data;
    },
    create: async (data: AnimationCreate, file: File): Promise<Animation> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', data.tags);
      formData.append('is_public', String(data.is_public || false));

      const response = await axios.post('/animations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    update: async (id: number, data: Partial<AnimationCreate>): Promise<Animation> => {
      const response = await axios.put(`/animations/${id}`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await axios.delete(`/animations/${id}`);
    },
  },
};

export default api;

