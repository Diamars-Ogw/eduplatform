import api from './api';

export const promotionService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/promotions${params ? '?' + params : ''}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  async create(promotionData) {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  },

  async update(id, promotionData) {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.patch(`/promotions/${id}/toggle-status`);
    return response.data;
  }
};