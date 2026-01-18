import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Users, BookOpen } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { spaceService } from "@/services/space.service";

const SpacesList = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const data = await spaceService.getAll();
      setSpaces(data.espaces || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement espaces:", error);
      setToast({
        show: true,
        message: "Erreur lors du chargement",
        type: "error",
      });
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Chargement des espaces..." />;

  return (
    <div className="space-y-6">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ show: false, message: "", type: "" })}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Espaces Pédagogiques
          </h1>
          <p className="text-gray-600 mt-1">
            Gérer les cours et espaces d'enseignement
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate("/director/spaces/create")}>
          Créer un Espace
        </Button>
      </div>

      {spaces.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p>Aucun espace pédagogique trouvé</p>
            <Button
              onClick={() => navigate("/director/spaces/create")}
              className="mt-4"
            >
              Créer le premier espace
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Card key={space.id} className="card-hover">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {space.nom}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {space.promotion?.nom || "Aucune promotion"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{space.nombreInscrits || 0} étudiants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      Formateur: {space.formateur?.nom}{" "}
                      {space.formateur?.prenom}
                    </span>
                  </div>
                  {space.semestre && (
                    <Badge variant="info">Semestre {space.semestre}</Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() =>
                      navigate(`/director/spaces/edit/${space.id}`)
                    }
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() =>
                      navigate(`/director/spaces/${space.id}/enroll`)
                    }
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Inscrire
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacesList;
