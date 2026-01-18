import api from './api';

export const reportService = {
  /**
   * Statistiques générales du directeur
   */
  async getDashboardStats() {
    // Récupérer les données depuis plusieurs endpoints
    const [usersData, promotionsData, spacesData, evaluationsData] = await Promise.all([
      api.get('/users'),
      api.get('/promotions'),
      api.get('/spaces'),
      api.get('/evaluations/stats/global')
    ]);

    return {
      users: usersData.data,
      promotions: promotionsData.data,
      spaces: spacesData.data,
      evaluations: evaluationsData.data
    };
  },

  /**
   * Rapport général par domaine (promotions, matières, etc.)
   */
  async getGeneralDomainReport(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/evaluations/stats/global${params ? '?' + params : ''}`);
    return response.data;
  },

  /**
   * Statistiques par promotion
   */
  async getPromotionStats(promotionId) {
    const [promotion, evaluations] = await Promise.all([
      api.get(`/promotions/${promotionId}`),
      api.get(`/evaluations/stats/global?promotionId=${promotionId}`)
    ]);

    return {
      promotion: promotion.data,
      stats: evaluations.data
    };
  },

  /**
   * Statistiques par matière
   */
  async getMatiereStats(matiereId) {
    const response = await api.get(`/evaluations/stats/global?matiereId=${matiereId}`);
    return response.data;
  },

  /**
   * Rapport d'activité des formateurs
   */
  async getTrainersActivityReport() {
    const usersData = await api.get('/users?role=FORMATEUR');
    const trainers = usersData.data.users || [];

    // Pour chaque formateur, récupérer ses espaces et travaux
    const trainersWithStats = await Promise.all(
      trainers.map(async (trainer) => {
        try {
          const spacesData = await api.get('/spaces');
          const worksData = await api.get('/works');
          
          // Filtrer les données du formateur
          const trainerSpaces = spacesData.data.espaces?.filter(s => s.formateurId === trainer.id) || [];
          const trainerWorks = worksData.data.travaux?.filter(w => w.createurId === trainer.id) || [];

          return {
            ...trainer,
            nombreEspaces: trainerSpaces.length,
            nombreTravaux: trainerWorks.length
          };
        } catch (error) {
          return {
            ...trainer,
            nombreEspaces: 0,
            nombreTravaux: 0
          };
        }
      })
    );

    return trainersWithStats;
  },

  /**
   * Rapport de progression des étudiants
   */
  async getStudentsProgressReport(promotionId = null) {
    const filters = promotionId ? `?role=ETUDIANT&promotionId=${promotionId}` : '?role=ETUDIANT';
    const usersData = await api.get(`/users${filters}`);
    
    return usersData.data.users || [];
  },

  /**
   * Export des données (à adapter selon vos besoins)
   */
  exportToCSV(data, filename) {
    // Convertir les données en CSV
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    
    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  },

  /**
   * Export en JSON
   */
  exportToJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  }
};