import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import { evaluationService } from "@/services/evaluation.service";

const ModifyEvaluation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const evaluationId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    note: "",
    commentaire: "",
    raisonModification: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (evaluationId) {
      loadEvaluation();
    }
  }, [evaluationId]);

  const loadEvaluation = async () => {
    try {
      const data = await evaluationService.getById(evaluationId);
      setEvaluation(data);
      setFormData({
        note: data.note.toString(),
        commentaire: data.commentaire || "",
        raisonModification: ""
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement évaluation:", error);
      showToast("Erreur de chargement", "error");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    const note = parseFloat(formData.note);
    if (isNaN(note) || note < 0 || note > 20) {
      newErrors.note = "La note doit être entre 0 et 20";
    }
    
    if (!formData.raisonModification.trim()) {
      newErrors.raisonModification = "La raison de modification est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await evaluationService.update(evaluationId, {
        note: parseFloat(formData.note),
        commentaire: formData.commentaire,
        raisonModification: formData.raisonModification
      });
      
      showToast("Évaluation modifiée avec succès", "success");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Erreur modification:", error);
      showToast(error.response?.data?.error || "Erreur lors de la modification", "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  if (loading) return <Loader text="Chargement de l'évaluation..." />;

  if (!evaluation) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Évaluation introuvable</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Retour</Button>
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

      {/* En-tête */}
      <div className="flex items-center gap-4 animate-slide-up">
        <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier une Évaluation
          </h1>
          <p className="text-gray-600 mt-1">
            Action réservée au Directeur - Modification exceptionnelle
          </p>
        </div>
      </div>

      {/* Alert avertissement */}
      <Card className="border-l-4 border-yellow-500 bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-900">Attention</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Vous êtes sur le point de modifier une évaluation déjà attribuée.
              Cette action doit être justifiée et sera enregistrée dans l'historique.
            </p>
          </div>
        </div>
      </Card>

      {/* Informations actuelles */}
      <Card title="Évaluation Actuelle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Travail</p>
            <p className="font-medium text-gray-900">
              {evaluation.livraison?.affectation?.travail?.titre || 
               evaluation.livraison?.groupe?.travail?.titre || 
               "Travail inconnu"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Étudiant / Groupe</p>
            <p className="font-medium text-gray-900">
              {evaluation.livraison?.affectation ? (
                `${evaluation.livraison.affectation.etudiant?.nom} ${evaluation.livraison.affectation.etudiant?.prenom}`
              ) : (
                evaluation.livraison?.groupe?.nomGroupe || "Inconnu"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Note actuelle</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {evaluation.note}/20
              </span>
              <Badge variant={evaluation.note >= 10 ? "success" : "danger"}>
                {evaluation.note >= 10 ? "Admis" : "Non admis"}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Évaluateur</p>
            <p className="font-medium text-gray-900">
              {evaluation.evaluateur?.nom} {evaluation.evaluateur?.prenom}
            </p>
            <p className="text-xs text-gray-500">
              Le {new Date(evaluation.dateEvaluation).toLocaleDateString()}
            </p>
          </div>

          {evaluation.commentaire && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Commentaire actuel</p>
              <p className="text-gray-900 mt-1">{evaluation.commentaire}</p>
            </div>
          )}

          {evaluation.dateModification && (
            <div className="md:col-span-2">
              <Badge variant="warning">Déjà modifiée</Badge>
              <p className="text-xs text-gray-500 mt-2">
                Modifiée par {evaluation.modificateur?.nom} {evaluation.modificateur?.prenom}
                le {new Date(evaluation.dateModification).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Raison: {evaluation.raisonModification}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Nouvelle Évaluation">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nouvelle Note"
              name="note"
              type="number"
              step="0.5"
              min="0"
              max="20"
              value={formData.note}
              onChange={handleChange}
              error={errors.note}
              required
              placeholder="15.5"
            />

            <Textarea
              label="Nouveau Commentaire (optionnel)"
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              rows={4}
              placeholder="Commentaire sur le travail..."
            />

            <Textarea
              label="Raison de la Modification"
              name="raisonModification"
              value={formData.raisonModification}
              onChange={handleChange}
              error={errors.raisonModification}
              rows={3}
              required
              placeholder="Ex: Erreur de calcul, Reconsidération après contestation, etc."
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Cette modification sera tracée et visible dans l'historique.
                L'étudiant sera notifié du changement de note.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            loading={saving}
            icon={Save}
            variant="warning"
          >
            Modifier l'Évaluation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModifyEvaluation;