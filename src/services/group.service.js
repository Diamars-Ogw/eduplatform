import api from './api';

const groupService = {
  // Récupère tous les groupes
  async getAll(filters = {}) {
    const response = await api.get('/groups', { params: filters });
    return response.data;
  },

  // Crée un nouveau groupe
  async create(groupData) {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Met à jour un groupe
  async update(id, groupData) {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  // Supprime un groupe
  async delete(id) {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },

  // Ajoute un membre au groupe
  async addMember(groupId, studentId) {
    const response = await api.post(`/groups/${groupId}/members/${studentId}`);
    return response.data;
  },

  // Retire un membre du groupe
  async removeMember(groupId, studentId) {
    const response = await api.delete(`/groups/${groupId}/members/${studentId}`);
    return response.data;
  },
};

export default groupService;