import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Textarea from "@/components/ui/Textarea";
import Toast from "@/components/ui/Toast";
import { userService } from "@/services/user.service";
import { promotionService } from "@/services/promotion.service";
import { ROLES, GRADES_FORMATEUR, GENRES } from "@/utils/constants";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "ETUDIANT",
    telephone: "",
    // Champs Étudiant
    promotionId: "",
    dateNaissance: "",
    genre: "",
    // Champs Formateur
    specialite: "",
    grade: "",
    departement: "",
    bureau: "",
  });

  const [errors, setErrors] = useState({});

  // Charger les promotions
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await promotionService.getAll({ estActive: "true" });
        setPromotions(data.promotions || []);
      } catch (error) {
        console.error("Erreur chargement promotions:", error);
      }
    };
    loadPromotions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation selon le rôle
    if (formData.role === "ETUDIANT") {
      if (!formData.promotionId)
        newErrors.promotionId = "La promotion est requise";
    }

    if (formData.role === "FORMATEUR") {
      if (!formData.specialite.trim())
        newErrors.specialite = "La spécialité est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await userService.create(formData);
      setToast({
        show: true,
        message: "Utilisateur créé avec succès",
        type: "success",
      });
      setTimeout(() => navigate("/director/users"), 1500);
    } catch (error) {
      console.error("Erreur création:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Erreur lors de la création",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Créer un Utilisateur
          </h1>
          <p className="text-gray-600 mt-1">
            Remplissez les informations pour créer un nouveau compte
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <Card
          title="Informations de Base"
          className="animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              icon={User}
              required
            />

            <Input
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              error={errors.prenom}
              icon={User}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Téléphone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              icon={Phone}
              placeholder="06 12 34 56 78"
            />

            <Select
              label="Rôle"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: "ETUDIANT", label: "Étudiant" },
                { value: "FORMATEUR", label: "Formateur" },
                { value: "DIRECTEUR", label: "Directeur" },
              ]}
              required
            />
          </div>
        </Card>

        {/* Champs spécifiques ÉTUDIANT */}
        {formData.role === "ETUDIANT" && (
          <Card
            title="Informations Étudiant"
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Promotion"
                name="promotionId"
                value={formData.promotionId}
                onChange={handleChange}
                error={errors.promotionId}
                options={promotions.map((p) => ({
                  value: p.id.toString(),
                  label: `${p.nom} (${p.code})`,
                }))}
                required
              />

              <Input
                label="Date de Naissance"
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleChange}
              />

              <Select
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                options={GENRES}
              />
            </div>
          </Card>
        )}

        {/* Champs spécifiques FORMATEUR */}
        {formData.role === "FORMATEUR" && (
          <Card
            title="Informations Formateur"
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Spécialité"
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                error={errors.specialite}
                icon={GraduationCap}
                placeholder="Informatique, Mathématiques..."
                required
              />

              <Select
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                options={GRADES_FORMATEUR}
                icon={Award}
              />

              <Input
                label="Département"
                name="departement"
                value={formData.departement}
                onChange={handleChange}
                icon={Building}
                placeholder="Sciences Informatiques"
              />

              <Input
                label="Bureau"
                name="bureau"
                value={formData.bureau}
                onChange={handleChange}
                placeholder="Bâtiment A, Bureau 205"
              />
            </div>
          </Card>
        )}

        {/* Boutons d'action */}
        <div
          className="flex justify-end gap-4 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/director/users")}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} icon={Save}>
            Créer l'Utilisateur
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
