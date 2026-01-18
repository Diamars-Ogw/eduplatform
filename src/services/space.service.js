import api from "./api";

export const spaceService = {
  // Matières
  async getMatieres() {
    const response = await api.get("/spaces/matieres");
    return response.data;
  },

  async createMatiere(matiereData) {
    const response = await api.post("/spaces/matieres", matiereData);
    return response.data;
  },

  // Espaces
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/spaces${params ? "?" + params : ""}`);
    return response.data;
  },

  // ✅ NOUVELLE MÉTHODE AJOUTÉE
  async getMySpaces() {
    const response = await api.get("/spaces/my-spaces");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/spaces/${id}`);
    return response.data;
  },

  async create(spaceData) {
    const response = await api.post("/spaces", spaceData);
    return response.data;
  },

  async update(id, spaceData) {
    const response = await api.put(`/spaces/${id}`, spaceData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/spaces/${id}`);
    return response.data;
  },

  // Inscriptions
  async enrollStudents(id, etudiantIds) {
    const response = await api.post(`/spaces/${id}/enroll`, { etudiantIds });
    return response.data;
  },

  async unenrollStudent(id, etudiantId) {
    const response = await api.delete(`/spaces/${id}/unenroll/${etudiantId}`);
    return response.data;
  },

  async getAvailableStudents(id) {
    const response = await api.get(`/spaces/${id}/available-students`);
    return response.data;
  },
};
