import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, Download, Clock, CheckCircle, Filter } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { submissionService } from "@/services/submission.service";

export default function SubmissionsList() {
  const [searchParams] = useSearchParams();
  const workIdParam = searchParams.get("workId");

  const [filter, setFilter] = useState("all");
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(workIdParam || "");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, evaluated: 0 });

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    if (selectedWork) {
      loadSubmissions(selectedWork);
    }
  }, [selectedWork]);

  const loadWorks = async () => {
    try {
      const response = await workService.getAll();
      const worksData = response.travaux || [];
      setWorks(worksData);

      if (workIdParam && worksData.length > 0) {
        setSelectedWork(workIdParam);
      } else if (worksData.length > 0 && !selectedWork) {
        setSelectedWork(worksData[0].id.toString());
      }
    } catch (error) {
      console.error("Erreur chargement travaux:", error);
    }
  };

  const loadSubmissions = async (workId) => {
    try {
      setLoading(true);
      const response = await submissionService.getByWork(workId);
      const allSubmissions = response.livraisons || [];
      setSubmissions(allSubmissions);

      // Calculer les stats
      const pending = allSubmissions.filter(
        (s) => s.livraison && !s.evaluation,
      ).length;
      const evaluated = allSubmissions.filter((s) => s.evaluation).length;
      setStats({ pending, evaluated });
    } catch (error) {
      console.error("Erreur chargement soumissions:", error);
      setSubmissions([]);
      setStats({ pending: 0, evaluated: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === "all") return true;
    if (filter === "pending") return sub.livraison && !sub.evaluation;
    if (filter === "evaluated") return sub.evaluation;
    return true;
  });

  const colors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-orange-400 to-amber-400",
    "from-red-400 to-rose-400",
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Soumissions des Travaux
          </h1>
          <p className="text-gray-600 mt-1">
            Consulter et évaluer les travaux rendus
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning" className="text-base px-4 py-2">
            {stats.pending} à corriger
          </Badge>
          <Badge variant="success" className="text-base px-4 py-2">
            {stats.evaluated} corrigées
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <Select
            value={selectedWork}
            onChange={(e) => setSelectedWork(e.target.value)}
            className="w-96"
          >
            <option value="">Sélectionner un travail</option>
            {works.map((work) => (
              <option key={work.id} value={work.id}>
                {work.titre} - {work.espacePedagogique?.matiere?.nom}
              </option>
            ))}
          </Select>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64"
          >
            <option value="all">Toutes les soumissions</option>
            <option value="pending">À corriger</option>
            <option value="evaluated">Corrigées</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size="large" />
        </div>
      ) : (
        <>
          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.map((sub, idx) => {
              const isEvaluated = !!sub.evaluation;
              const studentName =
                sub.type === "INDIVIDUEL"
                  ? `${sub.etudiant?.prenom} ${sub.etudiant?.nom}`
                  : sub.groupe?.nomGroupe;
              const initials =
                sub.type === "INDIVIDUEL"
                  ? `${sub.etudiant?.prenom?.[0]}${sub.etudiant?.nom?.[0]}`
                  : sub.groupe?.nomGroupe?.substring(0, 2);

              return (
                <Card
                  key={idx}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                      >
                        {initials}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {studentName}
                          </h3>
                          {isEvaluated ? (
                            <Badge
                              variant="success"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Corrigé - {sub.evaluation.note}/20
                            </Badge>
                          ) : (
                            <Badge
                              variant="warning"
                              className="flex items-center gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              En attente
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">
                          {sub.type === "INDIVIDUEL"
                            ? "Travail Individuel"
                            : "Travail Collectif"}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Rendu le{" "}
                              {sub.livraison
                                ? new Date(
                                    sub.livraison.dateLivraison,
                                  ).toLocaleString("fr-FR")
                                : "-"}
                            </span>
                          </div>
                          {sub.livraison?.fichierUrl && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Download className="w-4 h-4" />
                              Fichier joint
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {sub.livraison?.fichierUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            window.open(sub.livraison.fichierUrl, "_blank")
                          }
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      {sub.livraison && (
                        <Link
                          to={`/trainer/submissions/evaluate/${sub.livraison.id}`}
                        >
                          <Button
                            size="sm"
                            className={
                              isEvaluated
                                ? "bg-gray-600 hover:bg-gray-700"
                                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {isEvaluated ? "Voir" : "Évaluer"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredSubmissions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <CheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                Aucune soumission
              </h3>
              <p className="text-gray-500">
                {!selectedWork
                  ? "Sélectionnez un travail pour voir les soumissions"
                  : "Aucune soumission ne correspond à vos critères"}
              </p>
            </Card>
          )}
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
    </div>
  );
}
