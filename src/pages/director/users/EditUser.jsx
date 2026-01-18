import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Mail,
  User,
  Phone,
  GraduationCap,
  Award,
  Building,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { userService } from "@/services/user.service";
import { promotionService } from "@/services/promotion.service";
import { GRADES_FORMATEUR, GENRES } from "@/utils/constants";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [userData, promotionsData] = await Promise.all([
        userService.getById(id),
        promotionService.getAll({ estActive: "true" }),
      ]);

      setFormData(userData);
      setPromotions(promotionsData.promotions || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error);
      setToast({ show: true, message: "Erreur de chargement", type: "error" });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom?.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom?.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email?.trim()) newErrors.email = "L'email est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);

    try {
      await userService.update(id, formData);
      setToast({
        show: true,
        message: "Utilisateur modifié avec succès",
        type: "success",
      });
      setTimeout(() => navigate("/director/users"), 1500);
    } catch (error) {
      console.error("Erreur modification:", error);
      setToast({
        show: true,
        message:
          error.response?.data?.error || "Erreur lors de la modification",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Chargement de l'utilisateur..." />;
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Utilisateur introuvable</p>
        <Button onClick={() => navigate("/director/users")} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

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

      {/* En-tête */}
      <div className="flex items-center gap-4 animate-slide-up">
        <Button
          variant="ghost"
          onClick={() => navigate("/director/users")}
          icon={ArrowLeft}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier l'Utilisateur
          </h1>
          <p className="text-gray-600 mt-1">
            {formData.nom} {formData.prenom} - {formData.role}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informations de Base" className="animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              name="nom"
              value={formData.nom || ""}
              onChange={handleChange}
              error={errors.nom}
              icon={User}
              required
            />

            <Input
              label="Prénom"
              name="prenom"
              value={formData.prenom || ""}
              onChange={handleChange}
              error={errors.prenom}
              icon={User}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone || ""}
              onChange={handleChange}
              icon={Phone}
            />

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">
                <strong>Rôle :</strong> {formData.role} (non modifiable)
              </p>
            </div>
          </div>
        </Card>

        {/* Champs spécifiques FORMATEUR */}
        {formData.role === "FORMATEUR" && (
          <Card title="Informations Formateur" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Spécialité"
                name="specialite"
                value={formData.specialite || ""}
                onChange={handleChange}
                icon={GraduationCap}
              />

              <Select
                label="Grade"
                name="grade"
                value={formData.grade || ""}
                onChange={handleChange}
                options={GRADES_FORMATEUR}
                icon={Award}
              />

              <Input
                label="Département"
                name="departement"
                value={formData.departement || ""}
                onChange={handleChange}
                icon={Building}
              />

              <Input
                label="Bureau"
                name="bureau"
                value={formData.bureau || ""}
                onChange={handleChange}
              />
            </div>
          </Card>
        )}

        {/* Champs spécifiques ÉTUDIANT */}
        {formData.role === "ETUDIANT" && (
          <Card title="Informations Étudiant" className="animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Promotion"
                name="promotionId"
                value={formData.promotionId?.toString() || ""}
                onChange={handleChange}
                options={promotions.map((p) => ({
                  value: p.id.toString(),
                  label: `${p.nom} (${p.code})`,
                }))}
              />

              <Input
                label="Date de Naissance"
                name="dateNaissance"
                type="date"
                value={
                  formData.dateNaissance
                    ? new Date(formData.dateNaissance)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />

              <Select
                label="Genre"
                name="genre"
                value={formData.genre || ""}
                onChange={handleChange}
                options={GENRES}
              />
            </div>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/director/users")}
          >
            Annuler
          </Button>
          <Button type="submit" loading={saving} icon={Save}>
            Enregistrer les Modifications
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
