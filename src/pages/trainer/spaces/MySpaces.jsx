import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, FileText, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { spaceService } from "@/services/space.service";

export default function MySpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setLoading(true);
      const response = await spaceService.getAll();
      setSpaces(response.espaces || []);
    } catch (error) {
      console.error("Erreur chargement espaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-cyan-500 to-teal-500",
    "from-teal-500 to-emerald-500",
  ];

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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mes Espaces Pédagogiques
        </h1>
        <p className="text-gray-600 mt-1">
          Gérer vos cours et espaces d'enseignement
        </p>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spaces.map((space, idx) => (
          <Card
            key={space.id}
            className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {space.nom}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {space.promotion?.nom}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {space.matiere?.nom}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center shadow-lg`}
                >
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-2xl font-bold">
                      {space.nombreInscrits || 0}
                    </p>
                    <p className="text-xs">Étudiants</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  <FileText className="w-5 h-5" />
                  <div>
                    <p className="text-2xl font-bold">
                      {space.nombreTravaux || 0}
                    </p>
                    <p className="text-xs">Travaux</p>
                  </div>
                </div>
              </div>

              {/* Action Button - Temporairement désactivé */}
              <Button
                variant="outline"
                className="w-full border-2 border-purple-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all"
                onClick={() => {
                  // TODO: Implémenter la page de détails d'espace
                  alert(
                    `Détails de l'espace: ${space.nom}\n\nCette fonctionnalité sera implémentée prochainement.`,
                  );
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir les détails
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {spaces.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            Aucun espace pédagogique
          </h3>
          <p className="text-gray-500">
            Vous n'avez pas encore d'espaces pédagogiques assignés
          </p>
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
