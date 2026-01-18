import api from "./api";

export const workService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/works${params ? "?" + params : ""}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/works/${id}`);
    return response.data;
  },

  async create(workData) {
    const response = await api.post("/works", workData);
    return response.data;
  },

  async update(id, workData) {
    const response = await api.put(`/works/${id}`, workData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/works/${id}`);
    return response.data;
  },

  // Affectations individuelles
  async assignIndividual(id, etudiantIds) {
    const response = await api.post(`/works/${id}/assign-individual`, {
      etudiantIds,
    });
    return response.data;
  },

  // Groupes
  async createGroup(id, groupData) {
    const response = await api.post(`/works/${id}/groups`, groupData);
    return response.data;
  },

  async getGroups(id) {
    const response = await api.get(`/works/${id}/groups`);
    return response.data;
  },

  async updateGroup(groupeId, groupData) {
    const response = await api.put(`/works/groups/${groupeId}`, groupData);
    return response.data;
  },

  async deleteGroup(groupeId) {
    const response = await api.delete(`/works/groups/${groupeId}`);
    return response.data;
  },

  // Mes travaux (Étudiant)
  async getMyWorks() {
    const response = await api.get("/works/student/my-works");
    return response.data;
  },
};
