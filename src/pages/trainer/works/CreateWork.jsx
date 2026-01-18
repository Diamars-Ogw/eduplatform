import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { spaceService } from "@/services/space.service";
import { uploadService } from "@/services/upload.service";

export default function CreateWork() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
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
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      setLoadingSpaces(true);
      console.log("🔄 Chargement des espaces...");

      const response = await spaceService.getAll();
      console.log("📦 Réponse API espaces:", response);

      const spacesData = response.espaces || response.data || [];
      console.log("✅ Espaces chargés:", spacesData.length);

      setSpaces(spacesData);
    } catch (error) {
      console.error("❌ Erreur chargement espaces:", error);
      console.error("Détails:", error.response?.data);
      alert("Erreur lors du chargement des espaces pédagogiques");
    } finally {
      setLoadingSpaces(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Changement ${name}:`, value);
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
      console.log("📤 Upload fichier:", file.name);
      const result = await uploadService.uploadFile(file);
      console.log("✅ Fichier uploadé:", result);
      setFormData((prev) => ({ ...prev, fichierConsigneUrl: result.url }));
    } catch (error) {
      console.error("❌ Erreur upload:", error);
      alert("Erreur lors de l'upload du fichier");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📋 Données du formulaire:", formData);

    if (!formData.espacePedagogiqueId) {
      alert("Veuillez sélectionner un espace pédagogique");
      return;
    }

    if (
      formData.typeTravail === "COLLECTIF" &&
      formData.modeGroupe === "NON_APPLICABLE"
    ) {
      alert("Veuillez sélectionner un mode de formation des groupes");
      return;
    }

    try {
      setLoading(true);
      console.log("🚀 Envoi au backend...");

      const payload = {
        espacePedagogiqueId: parseInt(formData.espacePedagogiqueId),
        titre: formData.titre,
        typeTravail: formData.typeTravail,
        modeGroupe: formData.modeGroupe,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        consignes: formData.consignes,
        fichierConsigneUrl: formData.fichierConsigneUrl,
      };

      console.log("📦 Payload:", payload);

      const result = await workService.create(payload);
      console.log("✅ Travail créé:", result);

      alert("Travail créé avec succès !");
      navigate("/trainer/works");
    } catch (error) {
      console.error("❌ Erreur création travail:", error);
      console.error("Détails:", error.response?.data);
      alert(
        error.response?.data?.error || "Erreur lors de la création du travail",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
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
            Créer un Travail
          </h1>
          <p className="text-gray-600 mt-1">
            Définir un nouveau travail pour vos étudiants
          </p>
        </div>
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
                  placeholder="Ex: Projet React E-commerce"
                  required
                />

                {/* Espace pédagogique avec loader */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espace pédagogique <span className="text-red-500">*</span>
                  </label>
                  {loadingSpaces ? (
                    <div className="flex items-center justify-center py-4 border border-gray-300 rounded-lg bg-gray-50">
                      <Loader size="small" />
                      <span className="ml-2 text-gray-600">
                        Chargement des espaces...
                      </span>
                    </div>
                  ) : spaces.length === 0 ? (
                    <div className="p-4 border border-orange-300 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-800">
                        ⚠️ Aucun espace pédagogique disponible. Contactez
                        l'administrateur pour qu'il vous en assigne.
                      </p>
                    </div>
                  ) : (
                    <select
                      name="espacePedagogiqueId"
                      value={formData.espacePedagogiqueId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Sélectionner un espace</option>
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.nom} -{" "}
                          {space.promotion?.nom || "Sans promotion"}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {spaces.length} espace{spaces.length > 1 ? "s" : ""}{" "}
                    disponible{spaces.length > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Type de travail */}
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
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Travail Individuel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="typeTravail"
                        value="COLLECTIF"
                        checked={formData.typeTravail === "COLLECTIF"}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Travail Collectif</span>
                    </label>
                  </div>
                </div>

                {/* Mode de formation des groupes */}
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
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">
                          Groupes définis par le formateur
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="modeGroupe"
                          value="ETUDIANT"
                          checked={formData.modeGroupe === "ETUDIANT"}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">
                          Groupes formés par les étudiants
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Dates */}
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

                {/* Consignes */}
                <Textarea
                  label="Consignes"
                  name="consignes"
                  value={formData.consignes}
                  onChange={handleChange}
                  placeholder="Décrivez les consignes du travail..."
                  rows={6}
                  required
                />

                {/* Upload fichier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier de consignes (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploading
                        ? "Upload en cours..."
                        : "Cliquez pour télécharger un fichier"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOCX, ZIP (max. 10MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.zip"
                      onChange={handleFileChange}
                      disabled={uploading}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {formData.fichierConsigneUrl && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Fichier uploadé
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/trainer/works")}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading || loadingSpaces}
          >
            {loading ? <Loader size="small" /> : "Créer le Travail"}
          </Button>
        </div>
      </form>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
