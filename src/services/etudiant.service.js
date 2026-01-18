import api from './api';

const etudiantService = {
  // ============================================
  // MES ESPACES
  // ============================================
  getMySpaces: async () => {
    const response = await api.get('/spaces');
    return response.data.espaces || [];
  },

  // ============================================
  // MES TRAVAUX
  // ============================================
  getMyWorks: async () => {
    const response = await api.get('/works/student/my-works');
    return response.data;
  },

  getWork: async (workId) => {
    const response = await api.get(`/works/${workId}`);
    return response.data;
  },

  // ============================================
  // SOUMISSIONS
  // ============================================
  submitIndividualWork: async (affectationId, submissionData) => {
    const formData = new FormData();
    
    if (submissionData.contenu) {
      formData.append('contenu', submissionData.contenu);
    }
    if (submissionData.fichierUrl) {
      formData.append('fichierUrl', submissionData.fichierUrl);
    }

    const response = await api.post(
      `/submissions/individual/${affectationId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  submitGroupWork: async (groupeId, submissionData) => {
    const formData = new FormData();
    
    if (submissionData.contenu) {
      formData.append('contenu', submissionData.contenu);
    }
    if (submissionData.fichierUrl) {
      formData.append('fichierUrl', submissionData.fichierUrl);
    }

    const response = await api.post(
      `/submissions/group/${groupeId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submissions/student/my-submissions');
    return response.data;
  },

  getSubmission: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  },

  updateSubmission: async (submissionId, submissionData) => {
    const response = await api.put(`/submissions/${submissionId}`, submissionData);
    return response.data;
  },

  deleteSubmission: async (submissionId) => {
    const response = await api.delete(`/submissions/${submissionId}`);
    return response.data;
  },

  // ============================================
  // NOTES & ÉVALUATIONS
  // ============================================
  getMyGrades: async () => {
    const response = await api.get('/evaluations/student/my-grades');
    return response.data;
  },

  getGradesBySubject: async () => {
    const response = await api.get('/evaluations/student/grades-by-subject');
    return response.data;
  },

  getEvaluation: async (evaluationId) => {
    const response = await api.get(`/evaluations/${evaluationId}`);
    return response.data;
  },

  // ============================================
  // STATISTIQUES
  // ============================================
  getMyStats: async () => {
    try {
      const [grades, works, submissions] = await Promise.all([
        etudiantService.getMyGrades(),
        etudiantService.getMyWorks(),
        etudiantService.getMySubmissions()
      ]);

      // Calculer les statistiques
      const allGrades = [
        ...(grades.individuelles || []),
        ...(grades.groupes || [])
      ];

      const allWorks = [
        ...(works.individuels || []),
        ...(works.groupes || [])
      ];

      const pendingWorks = allWorks.filter(w => {
        if (w.livraisons && w.livraisons.length > 0) return false;
        if (w.groupe && w.groupe.livraisons && w.groupe.livraisons.length > 0) return false;
        return true;
      });

      const submittedWorks = allWorks.filter(w => {
        if (w.livraisons && w.livraisons.length > 0) return true;
        if (w.groupe && w.groupe.livraisons && w.groupe.livraisons.length > 0) return true;
        return false;
      });

      const evaluatedWorks = allGrades.length;

      const totalNotes = allGrades.map(g => g.note);
      const average = totalNotes.length > 0
        ? totalNotes.reduce((sum, note) => sum + note, 0) / totalNotes.length
        : 0;

      return {
        totalSpaces: 0, // À calculer depuis getMySpaces si nécessaire
        pendingWorks: pendingWorks.length,
        submittedWorks: submittedWorks.length,
        evaluatedWorks,
        averageGrade: parseFloat(average.toFixed(2)),
        totalGrades: totalNotes.length
      };
    } catch (error) {
      console.error('Erreur calcul stats:', error);
      return {
        totalSpaces: 0,
        pendingWorks: 0,
        submittedWorks: 0,
        evaluatedWorks: 0,
        averageGrade: 0,
        totalGrades: 0
      };
    }
  }
};

export default etudiantService;