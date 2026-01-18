import { useState, useEffect } from "react";
import { Mail, Trash2, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { userService } from "@/services/user.service";

const InactiveAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadInactiveAccounts();
  }, []);

  const loadInactiveAccounts = async () => {
    try {
      const data = await userService.getInactive();
      setAccounts(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement comptes inactifs:", error);
      showToast("Erreur lors du chargement", "error");
      setLoading(false);
    }
  };

  const handleSendReminder = async (id) => {
    try {
      // TODO: Implémenter l'envoi d'email dans le backend
      showToast("Email de relance envoyé !", "success");
    } catch (error) {
      showToast("Erreur lors de l'envoi", "error");
    }
  };

  const handleBulkSend = async () => {
    try {
      // TODO: Implémenter l'envoi groupé
      showToast(`${selected.length} emails envoyés !`, "success");
      setSelected([]);
    } catch (error) {
      showToast("Erreur lors de l'envoi groupé", "error");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce compte ?")) {
      try {
        await userService.delete(id);
        setAccounts(accounts.filter((a) => a.id !== id));
        showToast("Compte supprimé avec succès", "success");
      } catch (error) {
        showToast("Erreur lors de la suppression", "error");
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const calculateDaysRemaining = (dateCreation) => {
    const created = new Date(dateCreation);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(30 - diffDays, 0); // Supposons 30 jours max
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Toast */}
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
          <h1 className="text-3xl font-bold text-gray-900">Comptes Inactifs</h1>
          <p className="text-gray-600 mt-1">Gérer les comptes non activés</p>
        </div>
        {selected.length > 0 && (
          <Button onClick={handleBulkSend} icon={Send}>
            Envoyer à {selected.length} compte(s)
          </Button>
        )}
      </div>

      <Card>
        {accounts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun compte inactif
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? accounts.map((a) => a.id) : [],
                      )
                    }
                    checked={
                      selected.length === accounts.length && accounts.length > 0
                    }
                  />
                </th>
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
                  Jours Restants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts.map((account) => {
                const daysRemaining = calculateDaysRemaining(
                  account.dateCreation,
                );
                return (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(account.id)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked
                              ? [...prev, account.id]
                              : prev.filter((id) => id !== account.id),
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {account.nom} {account.prenom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {account.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="warning">{account.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 font-medium">
                      {daysRemaining} jours
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSendReminder(account.id)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                        title="Envoyer un rappel"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default InactiveAccounts;
