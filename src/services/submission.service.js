import api from "./api";

export const submissionService = {
  // Soumettre
  async submitIndividual(affectationId, submissionData) {
    const response = await api.post(
      `/submissions/individual/${affectationId}`,
      submissionData,
    );
    return response.data;
  },

  async submitGroup(groupeId, submissionData) {
    const response = await api.post(
      `/submissions/group/${groupeId}`,
      submissionData,
    );
    return response.data;
  },

  // Lister
  async getByWork(travailId) {
    const response = await api.get(`/submissions/work/${travailId}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },

  // Mes soumissions (Étudiant)
  async getMySubmissions() {
    const response = await api.get("/submissions/student/my-submissions");
    return response.data;
  },

  // Modifier/Supprimer
  async update(id, submissionData) {
    const response = await api.put(`/submissions/${id}`, submissionData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/submissions/${id}`);
    return response.data;
  },
};
