import api from "./api";

export const evaluationService = {
  // Évaluer
  async create(evaluationData) {
    const response = await api.post("/evaluations", evaluationData);
    return response.data;
  },

  // Modifier (Directeur)
  async update(id, evaluationData) {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },

  // Détails
  async getById(id) {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },

  // Mes notes (Étudiant)
  async getMyGrades() {
    const response = await api.get("/evaluations/student/my-grades");
    return response.data;
  },

  async getGradesBySubject() {
    const response = await api.get("/evaluations/student/grades-by-subject");
    return response.data;
  },

  // Statistiques (Directeur)
  async getGlobalStats(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(
      `/evaluations/stats/global${params ? "?" + params : ""}`,
    );
    return response.data;
  },
};
