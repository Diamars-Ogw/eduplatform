import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";

export default function GroupsList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      // Charger tous les travaux puis leurs groupes
      const worksRes = await workService.getAll({ typeTravail: "COLLECTIF" });
      const works = worksRes.travaux || [];

      let allGroups = [];
      for (const work of works) {
        try {
          const groupsRes = await workService.getGroups(work.id);
          const workGroups = (groupsRes.groupes || []).map((g) => ({
            ...g,
            work: work.titre,
          }));
          allGroups = [...allGroups, ...workGroups];
        } catch (err) {
          console.error(`Erreur chargement groupes travail ${work.id}:`, err);
        }
      }

      setGroups(allGroups);
    } catch (error) {
      console.error("Erreur chargement groupes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await workService.deleteGroup(selectedGroup.id);
      alert("Groupe supprimé avec succès");
      setShowDeleteModal(false);
      loadGroups();
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const colors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-orange-400 to-amber-400",
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestion des Groupes
          </h1>
          <p className="text-gray-600 mt-1">
            Créer et gérer les groupes d'étudiants
          </p>
        </div>
        <Link to="/trainer/groups/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Créer un Groupe
          </Button>
        </Link>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <Card
            key={group.id}
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {group.nomGroupe}
                    </h3>
                    <Badge
                      variant={
                        group.modeFormation === "FORMATEUR"
                          ? "primary"
                          : "success"
                      }
                    >
                      {group.modeFormation === "FORMATEUR"
                        ? "Formateur"
                        : "Étudiant"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{group.work}</p>
                </div>
              </div>

              {/* Members */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">
                    {group.membres?.length || 0} membres
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(group.membres || []).slice(0, 6).map((membre, mIdx) => (
                    <div
                      key={mIdx}
                      className="group relative cursor-pointer"
                      title={`${membre.etudiant?.prenom} ${membre.etudiant?.nom}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[mIdx % colors.length]} flex items-center justify-center text-white font-bold text-sm shadow-md hover:scale-110 transition-transform`}
                      >
                        {membre.etudiant?.prenom?.[0]}
                        {membre.etudiant?.nom?.[0]}
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {membre.etudiant?.prenom} {membre.etudiant?.nom}
                      </div>
                    </div>
                  ))}
                  {(group.membres?.length || 0) > 6 && (
                    <div className="w-10 h-10 rounded-lg bg-gray-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
                      +{group.membres.length - 6}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                  onClick={() => navigate(`/trainer/groups/edit/${group.id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(group)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {groups.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun groupe</h3>
          <p className="text-gray-500">
            Vous n'avez pas encore créé de groupes
          </p>
          <Link to="/trainer/groups/create">
            <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier groupe
            </Button>
          </Link>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le groupe{" "}
            <strong>{selectedGroup?.nomGroupe}</strong> ?
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              ⚠️ Cette action est irréversible.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

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
