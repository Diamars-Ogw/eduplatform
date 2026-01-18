import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Calendar, Users, FileText } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { submissionService } from "@/services/submission.service";

export default function WorksList() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workStats, setWorkStats] = useState({});

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      setLoading(true);
      const response = await workService.getAll();
      const worksData = response.travaux || [];
      setWorks(worksData);

      // Charger les stats pour chaque travail
      const stats = {};
      for (const work of worksData) {
        try {
          const subRes = await submissionService.getByWork(work.id);
          stats[work.id] = {
            total: subRes.stats?.total || 0,
            soumises: subRes.stats?.soumises || 0,
            evaluees: subRes.stats?.evaluees || 0,
          };
        } catch (err) {
          stats[work.id] = { total: 0, soumises: 0, evaluees: 0 };
        }
      }
      setWorkStats(stats);
    } catch (error) {
      console.error("Erreur chargement travaux:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (submitted, total) => {
    if (total === 0) return "bg-gray-500";
    const percentage = (submitted / total) * 100;
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 40) return "bg-purple-500";
    return "bg-orange-500";
  };

  const getProgressPercentage = (submitted, total) => {
    if (total === 0) return 0;
    return Math.round((submitted / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Liste des Travaux
          </h1>
          <p className="text-gray-600 mt-1">Gérer et évaluer les travaux</p>
        </div>
        <Link to="/trainer/works/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Créer un Travail
          </Button>
        </Link>
      </div>

      {/* Works List */}
      <div className="space-y-4">
        {works.map((work) => {
          const stats = workStats[work.id] || {
            total: 0,
            soumises: 0,
            evaluees: 0,
          };
          const progress = getProgressPercentage(stats.soumises, stats.total);
          const progressColor = getProgressColor(stats.soumises, stats.total);

          return (
            <Card
              key={work.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {work.titre}
                    </h3>
                    <Badge
                      variant={
                        work.typeTravail === "INDIVIDUEL" ? "info" : "success"
                      }
                    >
                      {work.typeTravail === "INDIVIDUEL"
                        ? "Individuel"
                        : "Collectif"}
                    </Badge>
                    {!work.estActif && (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">
                    {work.espacePedagogique?.matiere?.nom} -{" "}
                    {work.espacePedagogique?.promotion?.nom}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span>
                        Échéance:{" "}
                        {new Date(work.dateFin).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>
                        {stats.soumises}/{stats.total} rendus
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {stats.total > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-semibold text-gray-900">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressColor} transition-all duration-1000 rounded-full`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3 ml-6">
                  <Link to={`/trainer/works/edit/${work.id}`}>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Modifier
                    </Button>
                  </Link>
                  <Link to={`/trainer/submissions?workId=${work.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Eye className="w-4 h-4 mr-2" />
                      Évaluer
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {works.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            Aucun travail
          </h3>
          <p className="text-gray-500">
            Vous n'avez pas encore créé de travaux
          </p>
          <Link to="/trainer/works/create">
            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier travail
            </Button>
          </Link>
        </Card>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
