import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toast from "@/components/ui/Toast";
import { spaceService } from "@/services/space.service";
import { promotionService } from "@/services/promotion.service";
import { userService } from "@/services/user.service";

const CreateSpace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    nom: "",
    promotionId: "",
    matiereId: "",
    formateurId: "",
    description: "",
    semestre: "",
    volumeHoraireTotal: "",
    dateDebut: "",
    dateFin: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [promosData, matieresData, usersData] = await Promise.all([
        promotionService.getAll({ estActive: "true" }),
        spaceService.getMatieres(),
        userService.getAll({ role: "FORMATEUR", estActif: "true" }),
      ]);

      setPromotions(promosData.promotions || []);
      setMatieres(matieresData.matieres || []);
      setFormateurs(usersData.users || []);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      showToast("Erreur de chargement des données", "error");
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
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.promotionId)
      newErrors.promotionId = "La promotion est requise";
    if (!formData.matiereId) newErrors.matiereId = "La matière est requise";
    if (!formData.formateurId)
      newErrors.formateurId = "Le formateur est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await spaceService.create(formData);
      showToast("Espace créé avec succès", "success");
      setTimeout(() => navigate("/director/spaces"), 1500);
    } catch (error) {
      console.error("Erreur création:", error);
      showToast(
        error.response?.data?.error || "Erreur lors de la création",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

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

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/director/spaces")}
          icon={ArrowLeft}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Créer un Espace Pédagogique
          </h1>
          <p className="text-gray-600 mt-1">
            Nouveau cours ou espace d'enseignement
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informations Générales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom de l'Espace"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              required
            />
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
            <Select
              label="Matière"
              name="matiereId"
              value={formData.matiereId}
              onChange={handleChange}
              error={errors.matiereId}
              options={matieres.map((m) => ({
                value: m.id.toString(),
                label: m.nom,
              }))}
              required
            />
            <Select
              label="Formateur Principal"
              name="formateurId"
              value={formData.formateurId}
              onChange={handleChange}
              error={errors.formateurId}
              options={formateurs.map((f) => ({
                value: f.id.toString(),
                label: `${f.nom} ${f.prenom}`,
              }))}
              required
            />
            <Select
              label="Semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              options={[
                { value: "1", label: "Semestre 1" },
                { value: "2", label: "Semestre 2" },
              ]}
            />
            <Input
              label="Volume Horaire"
              name="volumeHoraireTotal"
              type="number"
              value={formData.volumeHoraireTotal}
              onChange={handleChange}
              placeholder="40"
            />
            <Input
              label="Date Début"
              name="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={handleChange}
            />
            <Input
              label="Date Fin"
              name="dateFin"
              type="date"
              value={formData.dateFin}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/director/spaces")}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} icon={Save}>
            Créer l'Espace
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpace;
