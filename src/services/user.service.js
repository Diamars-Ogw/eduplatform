import api from "./api";

export const userService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/users${params ? "?" + params : ""}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(userData) {
    const response = await api.post("/users", userData);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async toggleStatus(id) {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  async getInactive() {
    const response = await api.get("/users/inactive/list");
    return response.data;
  },
};
