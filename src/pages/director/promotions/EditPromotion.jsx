import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { promotionService } from "@/services/promotion.service";
import { NIVEAUX_ETUDES } from "@/utils/constants";

const EditPromotion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadPromotion();
  }, [id]);

  const loadPromotion = async () => {
    try {
      const data = await promotionService.getById(id);
      // Formater les dates pour les inputs
      if (data.dateDebut) {
        data.dateDebut = new Date(data.dateDebut).toISOString().split("T")[0];
      }
      if (data.dateFin) {
        data.dateFin = new Date(data.dateFin).toISOString().split("T")[0];
      }
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement promotion:", error);
      setToast({ show: true, message: "Erreur de chargement", type: "error" });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await promotionService.update(id, formData);
      setToast({
        show: true,
        message: "Promotion modifiée avec succès",
        type: "success",
      });
      setTimeout(() => navigate("/director/promotions"), 1500);
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

  if (loading) return <Loader />;

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
            Modifier la Promotion
          </h1>
          <p className="text-gray-600 mt-1">{formData?.nom}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              name="nom"
              value={formData?.nom || ""}
              onChange={handleChange}
              required
            />
            <Input
              label="Code"
              name="code"
              value={formData?.code || ""}
              onChange={handleChange}
              required
            />
            <Input
              label="Année"
              name="anneeAcademique"
              type="number"
              value={formData?.anneeAcademique || ""}
              onChange={handleChange}
              required
            />
            <Select
              label="Niveau"
              name="niveauEtudes"
              value={formData?.niveauEtudes || ""}
              onChange={handleChange}
              options={NIVEAUX_ETUDES}
            />
            <Input
              label="Date Début"
              name="dateDebut"
              type="date"
              value={formData?.dateDebut || ""}
              onChange={handleChange}
            />
            <Input
              label="Date Fin"
              name="dateFin"
              type="date"
              value={formData?.dateFin || ""}
              onChange={handleChange}
            />
            <Input
              label="Capacité"
              name="capaciteMax"
              type="number"
              value={formData?.capaciteMax || ""}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData?.description || ""}
                onChange={handleChange}
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
          <Button type="submit" loading={saving} icon={Save}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPromotion;
