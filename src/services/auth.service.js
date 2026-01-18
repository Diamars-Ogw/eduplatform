import api from './api';

export const authService = {
  async login(email, motDePasse) {
    const response = await api.post('/auth/login', { email, motDePasse });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async changePassword(nouveauMotDePasse) {
    const response = await api.post('/auth/change-password', { nouveauMotDePasse });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, nouveauMotDePasse) {
    const response = await api.post('/auth/reset-password', { token, nouveauMotDePasse });
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};