import api from './api';

const assignmentService = {
  // Assigne un travail individuel
  async assignIndividual(workId, studentIds) {
    const response = await api.post(`/works/${workId}/assign-individual`, { studentIds });
    return response.data;
  },

  // Assigne un travail collectif
  async assignGroup(workId, groupIds) {
    const response = await api.post(`/works/${workId}/assign-group`, { groupIds });
    return response.data;
  },

  // Retire une assignation
  async remove(assignmentId) {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  },

  // Récupère les assignations d'un travail
  async getByWork(workId) {
    const response = await api.get(`/works/${workId}/assignments`);
    return response.data;
  },
};

export default assignmentService;