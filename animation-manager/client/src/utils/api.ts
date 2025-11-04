import axios from 'axios';

// Use relative URL to leverage Vite proxy, or use env var if set
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance that uses the same baseURL as AuthContext
// This ensures all API calls use the correct base URL
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      const response = await apiClient.get('/animations');
      return response.data;
    },
    getPublic: async (): Promise<Animation[]> => {
      const response = await apiClient.get('/animations/public');
      return response.data;
    },
    getMyAnimations: async (): Promise<Animation[]> => {
      const response = await apiClient.get('/animations/my-animations');
      return response.data;
    },
    getById: async (id: number): Promise<Animation> => {
      const response = await apiClient.get(`/animations/${id}`);
      return response.data;
    },
    search: async (query: string): Promise<Animation[]> => {
      const response = await apiClient.get(`/animations/search/${encodeURIComponent(query)}`);
      return response.data;
    },
    create: async (data: AnimationCreate, file: File): Promise<Animation> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', data.tags);
      formData.append('is_public', String(data.is_public || false));

      const response = await apiClient.post('/animations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    update: async (id: number, data: Partial<AnimationCreate>): Promise<Animation> => {
      const response = await apiClient.put(`/animations/${id}`, data);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/animations/${id}`);
    },
  },
};

export default api;

