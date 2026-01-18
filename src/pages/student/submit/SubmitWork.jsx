import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import etudiantService from "@/services/etudiant.service";

export default function SubmitWork() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const workType = searchParams.get('type'); // 'individual' or 'group'
  const entityId = searchParams.get('id'); // affectationId or groupeId

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [work, setWork] = useState(null);
  const [submission, setSubmission] = useState({
    content: "",
    files: [],
  });
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    loadWorkData();
  }, [id]);

  const loadWorkData = async () => {
    try {
      const workData = await etudiantService.getWork(id);
      setWork(workData);

      // Vérifier si déjà soumis
      if (workType === 'individual' && workData.affectations) {
        const aff = workData.affectations.find(a => a.id === parseInt(entityId));
        if (aff && aff.livraisons && aff.livraisons.length > 0) {
          setExistingSubmission(aff.livraisons[0]);
          setSubmission({
            content: aff.livraisons[0].contenu || '',
            files: []
          });
        }
      } else if (workType === 'group' && workData.groupes) {
        const grp = workData.groupes.find(g => g.id === parseInt(entityId));
        if (grp && grp.livraisons && grp.livraisons.length > 0) {
          setExistingSubmission(grp.livraisons[0]);
          setSubmission({
            content: grp.livraisons[0].contenu || '',
            files: []
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement travail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setSubmission({
      ...submission,
      files: [...submission.files, ...selectedFiles],
    });
  };

  const removeFile = (index) => {
    setSubmission({
      ...submission,
      files: submission.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submission.content && submission.files.length === 0) {
      alert("Veuillez ajouter du contenu ou des fichiers avant de soumettre");
      return;
    }

    if (existingSubmission && !existingSubmission.evaluations?.length) {
      if (!window.confirm("Vous avez déjà soumis ce travail. Voulez-vous le modifier ?")) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const submissionData = {
        contenu: submission.content,
        fichierUrl: submission.files.length > 0 ? 'uploaded' : null // TODO: Upload réel
      };

      if (workType === 'individual') {
        await etudiantService.submitIndividualWork(entityId, submissionData);
      } else {
        await etudiantService.submitGroupWork(entityId, submissionData);
      }

      navigate("/student/works", {
        state: { message: 'Travail soumis avec succès' }
      });
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert(error.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Travail introuvable</p>
        <Button onClick={() => navigate("/student/works")} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const deadline = new Date(work.dateFin);
  const now = new Date();
  const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  const getDeadlineColor = () => {
    if (daysLeft <= 0) return "text-red-600 bg-red-50 border-red-200";
    if (daysLeft <= 3) return "text-red-600 bg-red-50 border-red-200";
    if (daysLeft <= 7) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const isAlreadyEvaluated = existingSubmission?.evaluations && existingSubmission.evaluations.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/student/works")}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {existingSubmission ? 'Modifier ma Soumission' : 'Soumettre un Travail'}
          </h1>
          <p className="text-gray-600 mt-1">
            {existingSubmission ? 'Modifiez votre soumission' : 'Complétez et soumettez votre travail'}
          </p>
        </div>
      </div>

      {isAlreadyEvaluated && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Travail déjà évalué</p>
              <p>Ce travail a déjà été évalué. Vous ne pouvez plus le modifier.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Instructions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 sticky top-24">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{work.titre}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {work.espacePedagogique?.matiere?.nom || work.espacePedagogique?.nom}
                </p>
                <Badge variant={work.typeTravail === "INDIVIDUEL" ? "info" : "success"}>
                  {work.typeTravail}
                </Badge>
              </div>

              {/* Deadline Alert */}
              <div className={`p-4 rounded-lg border-2 ${getDeadlineColor()}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Échéance</span>
                </div>
                <p className="text-sm mb-1">
                  {deadline.toLocaleDateString("fr-FR")}
                </p>
                <p className="text-xs font-bold">
                  {daysLeft <= 0 
                    ? 'Dépassée' 
                    : daysLeft === 1 
                    ? '1 jour restant' 
                    : `${daysLeft} jours restants`}
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Consignes
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {work.consignes}
                </div>
              </div>

              {/* File Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">
                  Informations
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  Formateur: {work.createur?.nom} {work.createur?.prenom}
                </p>
                <p className="text-xs text-gray-600">
                  Créé le: {new Date(work.dateDebut).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Submission Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Content */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contenu de votre Travail
              </h3>
              <Textarea
                value={submission.content}
                onChange={(e) =>
                  setSubmission({ ...submission, content: e.target.value })
                }
                placeholder="Décrivez votre travail, ajoutez vos explications, liens, etc..."
                rows={12}
                className="font-mono text-sm"
                disabled={isAlreadyEvaluated}
              />
              <p className="text-xs text-gray-500 mt-2">
                {submission.content.length} caractères
              </p>
            </Card>

            {/* File Upload */}
            {!isAlreadyEvaluated && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Fichiers joints (optionnel)
                </h3>

                {/* Upload Area */}
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Cliquez pour télécharger ou glissez-déposez vos fichiers
                    </p>
                    <p className="text-xs text-gray-500">
                      Note: Upload de fichiers à implémenter
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Files List */}
                {submission.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      Fichiers sélectionnés ({submission.files.length})
                    </h4>
                    {submission.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Warning */}
            {!isAlreadyEvaluated && (
              <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">Attention</p>
                    <p>
                      {existingSubmission 
                        ? "Vous pouvez modifier votre travail tant qu'il n'a pas été évalué."
                        : "Une fois soumis, vous pourrez modifier votre travail jusqu'à son évaluation."}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            {!isAlreadyEvaluated && (
              <div className="flex items-center justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/student/works")}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  disabled={submitting}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {submitting ? 'Soumission...' : existingSubmission ? 'Modifier' : 'Soumettre'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}