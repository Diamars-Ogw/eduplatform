import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Toast from "@/components/ui/Toast";
import { promotionService } from "@/services/promotion.service";
import { NIVEAUX_ETUDES } from "@/utils/constants";

const CreatePromotion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    nom: "",
    code: "",
    anneeAcademique: new Date().getFullYear(),
    niveauEtudes: "",
    dateDebut: "",
    dateFin: "",
    capaciteMax: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.code.trim()) newErrors.code = "Le code est requis";
    if (!formData.dateDebut)
      newErrors.dateDebut = "La date de début est requise";
    if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await promotionService.create(formData);
      setToast({
        show: true,
        message: "Promotion créée avec succès",
        type: "success",
      });
      setTimeout(() => navigate("/director/promotions"), 1500);
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
          onClick={() => navigate("/director/promotions")}
          icon={ArrowLeft}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Créer une Promotion
          </h1>
          <p className="text-gray-600 mt-1">Nouvelle promotion académique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informations de Base">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom de la Promotion"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              required
            />
            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              placeholder="WD2024"
              required
            />
            <Input
              label="Année Académique"
              name="anneeAcademique"
              type="number"
              value={formData.anneeAcademique}
              onChange={handleChange}
              required
            />
            <Select
              label="Niveau d'Études"
              name="niveauEtudes"
              value={formData.niveauEtudes}
              onChange={handleChange}
              options={NIVEAUX_ETUDES}
            />
            <Input
              label="Date de Début"
              name="dateDebut"
              type="date"
              value={formData.dateDebut}
              onChange={handleChange}
              error={errors.dateDebut}
              required
            />
            <Input
              label="Date de Fin"
              name="dateFin"
              type="date"
              value={formData.dateFin}
              onChange={handleChange}
              error={errors.dateFin}
              required
            />
            <Input
              label="Capacité Maximale"
              name="capaciteMax"
              type="number"
              value={formData.capaciteMax}
              onChange={handleChange}
              placeholder="50"
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
            onClick={() => navigate("/director/promotions")}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} icon={Save}>
            Créer la Promotion
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePromotion;
