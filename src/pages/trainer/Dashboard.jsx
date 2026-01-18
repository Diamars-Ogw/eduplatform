import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { spaceService } from "@/services/space.service";
import { workService } from "@/services/work.service";
import { submissionService } from "@/services/submission.service";
import { BookOpen, FileText, Clock, CheckCircle, Users } from "lucide-react";

const FormateurDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpaces: 0,
    totalWorks: 0,
    pendingSubmissions: 0,
    evaluatedSubmissions: 0,
    totalStudents: 0,
  });
  const [recentSpaces, setRecentSpaces] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger les espaces du formateur
      const spacesRes = await spaceService.getAll();
      const spaces = spacesRes.espaces || [];

      // Charger tous les travaux du formateur
      const worksRes = await workService.getAll();
      const works = worksRes.travaux || [];

      // Charger toutes les soumissions pour calculer les stats
      let allSubmissions = [];
      for (const work of works) {
        try {
          const subRes = await submissionService.getByWork(work.id);
          if (subRes.livraisons) {
            allSubmissions = [...allSubmissions, ...subRes.livraisons];
          }
        } catch (err) {
          console.error(`Erreur chargement soumissions travail ${work.id}:`, err);
        }
      }

      // Calculer les stats
      const pending = allSubmissions.filter(s => 
        s.livraison && !s.evaluation
      );
      const evaluated = allSubmissions.filter(s => 
        s.evaluation
      );

      // Compter le nombre total d'étudiants uniques
      const uniqueStudents = new Set();
      spaces.forEach(space => {
        if (space.nombreInscrits) {
          // Si on a le nombre d'inscrits, on l'ajoute directement
          for (let i = 0; i < space.nombreInscrits; i++) {
            uniqueStudents.add(`${space.id}-${i}`);
          }
        }
      });

      setStats({
        totalSpaces: spaces.length,
        totalWorks: works.length,
        pendingSubmissions: pending.length,
        evaluatedSubmissions: evaluated.length,
        totalStudents: uniqueStudents.size,
      });

      setRecentSpaces(spaces.slice(0, 5));
      setRecentWorks(works.slice(0, 5));
      setPendingSubmissions(pending.slice(0, 10));
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Formateur
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenue {user?.formateur?.prenom} {user?.formateur?.nom}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/trainer/spaces")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espaces pédagogiques</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.totalSpaces}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/trainer/works")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Travaux créés</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.totalWorks}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/trainer/submissions")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Soumissions en attente</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.pendingSubmissions}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Travaux évalués</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.evaluatedSubmissions}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Étudiants</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Espaces récents */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Mes espaces pédagogiques
            </h2>
            <button
              onClick={() => navigate("/trainer/spaces")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Voir tout →
            </button>
          </div>
          <div className="space-y-3">
            {recentSpaces.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun espace pédagogique
              </p>
            ) : (
              recentSpaces.map((space) => (
                <div
                  key={space.id}
                  onClick={() => navigate(`/trainer/spaces/${space.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {space.nom}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Promotion: {space.promotion?.nom}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {space.nombreInscrits || 0} étudiant(s)
                      </p>
                    </div>
                    <Badge variant={space.estActif ? "success" : "secondary"}>
                      {space.estActif ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Travaux récents */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Travaux récents</h2>
            <button
              onClick={() => navigate("/trainer/works")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Voir tout →
            </button>
          </div>
          <div className="space-y-3">
            {recentWorks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun travail créé
              </p>
            ) : (
              recentWorks.map((work) => (
                <div
                  key={work.id}
                  onClick={() => navigate(`/trainer/works/${work.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {work.titre}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {work.consignes}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          Type: {work.typeTravail === "INDIVIDUEL" ? "Individuel" : "Collectif"}
                        </span>
                        <span>
                          Échéance: {new Date(work.dateFin).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <Badge variant={work.typeTravail === "INDIVIDUEL" ? "primary" : "warning"}>
                      {work.typeTravail === "INDIVIDUEL" ? "Individuel" : "Collectif"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Soumissions en attente */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Soumissions à évaluer ({stats.pendingSubmissions})
          </h2>
          <button
            onClick={() => navigate("/trainer/submissions")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Voir toutes →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Travail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Étudiant/Groupe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date soumission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Aucune soumission en attente
                  </td>
                </tr>
              ) : (
                pendingSubmissions.map((submission, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.type === "INDIVIDUEL" 
                          ? submission.affectation?.travail?.titre
                          : submission.groupe?.travail?.titre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {submission.type === "INDIVIDUEL"
                          ? `${submission.etudiant?.prenom} ${submission.etudiant?.nom}`
                          : submission.groupe?.nomGroupe}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.livraison 
                        ? new Date(submission.livraison.dateLivraison).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="warning">En attente</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/trainer/submissions/evaluate/${submission.livraison?.id}`)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Évaluer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FormateurDashboard;