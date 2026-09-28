import api from '../lib/axios';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
  googleSignIn: async (data: any) => {
    const response = await api.post('/api/auth/google', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
};
