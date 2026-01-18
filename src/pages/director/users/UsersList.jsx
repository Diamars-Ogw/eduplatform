import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { userService } from "@/services/user.service";

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("🔄 Chargement utilisateurs...", {
        roleFilter,
        statusFilter,
      });

      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.estActif = statusFilter;

      const data = await userService.getAll(params);
      console.log("📦 Données reçues:", data);

      const usersData = data.users || [];
      console.log("✅ Utilisateurs chargés:", usersData.length);

      setUsers(usersData);
    } catch (error) {
      console.error("❌ Erreur chargement utilisateurs:", error);
      console.error("Détails:", error.response?.data);
      showToast("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (user.nom?.toLowerCase() || "").includes(search) ||
      (user.prenom?.toLowerCase() || "").includes(search) ||
      (user.email?.toLowerCase() || "").includes(search) ||
      (user.matricule?.toLowerCase() || "").includes(search)
    );
  });

  const stats = {
    total: users.length,
    actifs: users.filter((u) => u.estActif).length,
    inactifs: users.filter((u) => !u.estActif).length,
    etudiants: users.filter((u) => u.role === "ETUDIANT").length,
  };

  const handleDelete = async (userId) => {
    try {
      await userService.delete(userId);
      showToast("Utilisateur supprimé avec succès", "success");
      loadUsers();
      setDeleteModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Erreur suppression:", error);
      showToast(
        error.response?.data?.error || "Erreur lors de la suppression",
        "error",
      );
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleStatus(userId);
      showToast("Statut modifié avec succès", "success");
      loadUsers();
    } catch (error) {
      console.error("Erreur toggle:", error);
      showToast(
        error.response?.data?.error || "Erreur lors de la modification",
        "error",
      );
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const getInitials = (prenom, nom) => {
    return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      DIRECTEUR: "info",
      FORMATEUR: "primary",
      ETUDIANT: "success",
      TECHNICIEN: "warning",
    };
    return colors[role] || "secondary";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
        <span className="ml-3 text-gray-600">
          Chargement des utilisateurs...
        </span>
      </div>
    );
  }

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

      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-1">
            Créer et gérer les comptes utilisateurs de la plateforme
          </p>
        </div>
        <Button onClick={() => navigate("/director/users/create")}>
          <Plus className="w-5 h-5 mr-2" />
          Créer un Compte
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              👥
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comptes Actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.actifs}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              ✅
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Comptes Inactifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.inactifs}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              ⏳
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Étudiants</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.etudiants}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🎓
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="DIRECTEUR">Directeur</option>
            <option value="FORMATEUR">Formateur</option>
            <option value="ETUDIANT">Étudiant</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="true">Actifs uniquement</option>
            <option value="false">Inactifs uniquement</option>
          </Select>
        </div>
      </Card>

      {/* Liste */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Promotion/Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {getInitials(user.prenom, user.nom)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nom} {user.prenom}
                          </div>
                          {user.matricule && (
                            <div className="text-sm text-gray-500">
                              {user.matricule}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.promotion?.nom || user.specialite || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="flex items-center gap-1 hover:opacity-75 transition-opacity"
                      >
                        {user.estActif ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              Actif
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">
                              Inactif
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() =>
                          navigate(`/director/users/edit/${user.id}`)
                        }
                        className="text-purple-600 hover:text-purple-900 mr-3 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title="Confirmer la suppression"
      >
        {deleteModal.user && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <strong>
                {deleteModal.user.nom} {deleteModal.user.prenom}
              </strong>{" "}
              ?
            </p>
            <p className="text-sm text-red-600">
              ⚠️ Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, user: null })}
              >
                Annuler
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteModal.user.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersList;
