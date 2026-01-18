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
import { spaceService } from "@/services/space.service";
import { promotionService } from "@/services/promotion.service";
import { userService } from "@/services/user.service";

const EditSpace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [spaceData, promosData, matieresData, usersData] = await Promise.all([
        spaceService.getById(id),
        promotionService.getAll({ estActive: 'true' }),
        spaceService.getMatieres(),
        userService.getAll({ role: 'FORMATEUR', estActif: 'true' })
      ]);

      // Formater les dates
      if (spaceData.dateDebut) {
        spaceData.dateDebut = new Date(spaceData.dateDebut).toISOString().split('T')[0];
      }
      if (spaceData.dateFin) {
        spaceData.dateFin = new Date(spaceData.dateFin).toISOString().split('T')[0];
      }

      setFormData(spaceData);
      setPromotions(promosData.promotions || []);
      setMatieres(matieresData.matieres || []);
      setFormateurs(usersData.users || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement:", error);
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
      await spaceService.update(id, formData);
      setToast({ show: true, message: "Espace modifié avec succès", type: "success" });
      setTimeout(() => navigate("/director/spaces"), 1500);
    } catch (error) {
      console.error("Erreur modification:", error);
      setToast({ 
        show: true, 
        message: error.response?.data?.error || "Erreur lors de la modification", 
        type: "error" 
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
          onClick={() => navigate("/director/spaces")}
          icon={ArrowLeft}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier l'Espace
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
            <Select
              label="Promotion"
              name="promotionId"
              value={formData?.promotionId?.toString() || ""}
              onChange={handleChange}
              options={promotions.map(p => ({
                value: p.id.toString(),
                label: `${p.nom} (${p.code})`
              }))}
            />
            <Select
              label="Matière"
              name="matiereId"
              value={formData?.matiereId?.toString() || ""}
              onChange={handleChange}
              options={matieres.map(m => ({
                value: m.id.toString(),
                label: m.nom
              }))}
            />
            <Select
              label="Formateur"
              name="formateurId"
              value={formData?.formateurId?.toString() || ""}
              onChange={handleChange}
              options={formateurs.map(f => ({
                value: f.id.toString(),
                label: `${f.nom} ${f.prenom}`
              }))}
            />
            <Select
              label="Semestre"
              name="semestre"
              value={formData?.semestre?.toString() || ""}
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
              value={formData?.volumeHoraireTotal || ""}
              onChange={handleChange}
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
            onClick={() => navigate("/director/spaces")}
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

export default EditSpace;