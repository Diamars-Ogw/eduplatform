import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { spaceService } from "@/services/space.service";
import { uploadService } from "@/services/upload.service";

export default function EditWork() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    espacePedagogiqueId: "",
    titre: "",
    typeTravail: "INDIVIDUEL",
    modeGroupe: "NON_APPLICABLE",
    dateDebut: "",
    dateFin: "",
    consignes: "",
    fichierConsigneUrl: null,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workRes, spacesRes] = await Promise.all([
        workService.getById(id),
        spaceService.getAll(),
      ]);

      const work = workRes;
      setSpaces(spacesRes.espaces || []);

      setFormData({
        espacePedagogiqueId: work.espacePedagogiqueId?.toString() || "",
        titre: work.titre || "",
        typeTravail: work.typeTravail || "INDIVIDUEL",
        modeGroupe: work.modeGroupe || "NON_APPLICABLE",
        dateDebut: work.dateDebut
          ? new Date(work.dateDebut).toISOString().split("T")[0]
          : "",
        dateFin: work.dateFin
          ? new Date(work.dateFin).toISOString().split("T")[0]
          : "",
        consignes: work.consignes || "",
        fichierConsigneUrl: work.fichierConsigneUrl || null,
      });
    } catch (error) {
      console.error("Erreur chargement travail:", error);
      alert("Erreur lors du chargement du travail");
      navigate("/trainer/works");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "typeTravail" && value === "INDIVIDUEL"
        ? { modeGroupe: "NON_APPLICABLE" }
        : {}),
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadService.uploadFile(file);
      setFormData((prev) => ({ ...prev, fichierConsigneUrl: result.url }));
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.typeTravail === "COLLECTIF" &&
      formData.modeGroupe === "NON_APPLICABLE"
    ) {
      alert("Veuillez sélectionner un mode de formation des groupes");
      return;
    }

    try {
      setSaving(true);
      await workService.update(id, formData);
      alert("Travail modifié avec succès !");
      navigate("/trainer/works");
    } catch (error) {
      console.error("Erreur modification travail:", error);
      alert(error.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await workService.delete(id);
      alert("Travail supprimé avec succès");
      navigate("/trainer/works");
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/trainer/works")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Modifier le Travail
            </h1>
            <p className="text-gray-600 mt-1">Mettre à jour les informations</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informations du Travail
              </h2>
              <div className="space-y-4">
                <Input
                  label="Titre du travail"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Espace pédagogique"
                  name="espacePedagogiqueId"
                  value={formData.espacePedagogiqueId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un espace</option>
                  {spaces.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.nom} - {space.promotion?.nom}
                    </option>
                  ))}
                </Select>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Type de travail
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="typeTravail"
                        value="INDIVIDUEL"
                        checked={formData.typeTravail === "INDIVIDUEL"}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span>Travail Individuel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="typeTravail"
                        value="COLLECTIF"
                        checked={formData.typeTravail === "COLLECTIF"}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span>Travail Collectif</span>
                    </label>
                  </div>
                </div>

                {formData.typeTravail === "COLLECTIF" && (
                  <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <label className="block text-sm font-medium text-gray-700">
                      Mode de formation des groupes
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="modeGroupe"
                          value="FORMATEUR"
                          checked={formData.modeGroupe === "FORMATEUR"}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span>Formateur</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="modeGroupe"
                          value="ETUDIANT"
                          checked={formData.modeGroupe === "ETUDIANT"}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span>Étudiants</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Date de début"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="date"
                    label="Date de fin"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Textarea
                  label="Consignes"
                  name="consignes"
                  value={formData.consignes}
                  onChange={handleChange}
                  rows={6}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier de consignes (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploading
                        ? "Upload en cours..."
                        : "Cliquez pour télécharger"}
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.zip"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    {formData.fichierConsigneUrl && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Fichier présent
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/trainer/works")}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            disabled={saving}
          >
            {saving ? <Loader size="small" /> : "Enregistrer"}
          </Button>
        </div>
      </form>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le travail{" "}
            <strong>{formData.titre}</strong> ?
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
              onClick={handleDelete}
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
