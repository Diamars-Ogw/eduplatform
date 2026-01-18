import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { submissionService } from "@/services/submission.service";
import { evaluationService } from "@/services/evaluation.service";

export default function EvaluateWork() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evaluation, setEvaluation] = useState({
    note: "",
    commentaire: "",
  });

  useEffect(() => {
    loadSubmission();
  }, [id]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const data = await submissionService.getById(id);
      setSubmission(data);

      // Si déjà évalué, pré-remplir
      if (data.evaluations && data.evaluations.length > 0) {
        const evaluations = data.evaluations[0];
        setEvaluation({
          note: evaluations.note.toString(),
          commentaire: evaluations.commentaire || "",
        });
      }
    } catch (error) {
      console.error("Erreur chargement soumission:", error);
      alert("Erreur lors du chargement de la soumission");
      navigate("/trainer/submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const note = parseFloat(evaluation.note);
    if (isNaN(note) || note < 0 || note > 20) {
      alert("La note doit être entre 0 et 20");
      return;
    }

    try {
      setSaving(true);
      await evaluationService.create({
        livraisonId: submission.id,
        note: note,
        commentaire: evaluation.commentaire,
      });
      alert("Évaluation enregistrée avec succès !");
      navigate("/trainer/submissions");
    } catch (error) {
      console.error("Erreur évaluation:", error);
      alert(error.response?.data?.error || "Erreur lors de l'évaluation");
    } finally {
      setSaving(false);
    }
  };

  const gradeColor = (grade) => {
    if (grade >= 16) return "text-green-600";
    if (grade >= 12) return "text-blue-600";
    if (grade >= 10) return "text-orange-600";
    return "text-red-600";
  };

  const getAppreciation = (grade) => {
    if (grade >= 16) return "Excellent";
    if (grade >= 12) return "Bien";
    if (grade >= 10) return "Passable";
    return "Insuffisant";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Soumission non trouvée</p>
      </div>
    );
  }

  const isEvaluated =
    submission.evaluations && submission.evaluations.length > 0;
  const studentName = submission.affectation
    ? `${submission.affectation.etudiant?.prenom} ${submission.affectation.etudiant?.nom}`
    : submission.groupe?.nomGroupe;
  const matricule = submission.affectation?.etudiant?.matricule;
  const initials = submission.affectation
    ? `${submission.affectation.etudiant?.prenom?.[0]}${submission.affectation.etudiant?.nom?.[0]}`
    : submission.groupe?.nomGroupe?.substring(0, 2);
  const work = submission.affectation?.travail || submission.groupe?.travail;
  const color = submission.affectation
    ? "from-purple-400 to-pink-400"
    : "from-blue-400 to-cyan-400";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/trainer/submissions")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Évaluer le Travail
            </h1>
            <p className="text-gray-600 mt-1">
              Consulter et noter la soumission
            </p>
          </div>
        </div>
        {isEvaluated && (
          <Badge variant="success" className="text-base px-4 py-2">
            Déjà évalué
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Submission Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
              >
                {initials}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {studentName}
                </h2>
                {matricule && (
                  <p className="text-sm text-gray-600">{matricule}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Rendu le{" "}
                  {new Date(submission.dateLivraison).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          </Card>

          {/* Work Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Travail : {work?.titre}
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Consignes :
              </p>
              <p className="text-gray-600 whitespace-pre-wrap">
                {work?.consignes}
              </p>
            </div>
          </Card>

          {/* Submission Content */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Contenu de la Soumission
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-wrap">
                {submission.contenu || "Pas de contenu texte"}
              </p>
            </div>
          </Card>

          {/* Files */}
          {submission.fichierUrl && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Fichiers Joints
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Fichier de soumission
                      </p>
                      <p className="text-sm text-gray-600">
                        Cliquez pour télécharger
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(submission.fichierUrl, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Evaluation Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Évaluation
                  </h3>
                </div>

                {/* Grade Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Note <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={evaluation.note}
                      onChange={(e) =>
                        setEvaluation({ ...evaluation, note: e.target.value })
                      }
                      placeholder="0"
                      required
                      disabled={isEvaluated}
                      className={`text-3xl font-bold text-center ${
                        evaluation.note
                          ? gradeColor(parseFloat(evaluation.note))
                          : ""
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                      /20
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Note sur 20 (décimales autorisées)
                  </p>
                </div>

                {/* Grade Indicator */}
                {evaluation.note && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Appréciation
                    </p>
                    <p
                      className={`text-lg font-bold ${gradeColor(parseFloat(evaluation.note))}`}
                    >
                      {getAppreciation(parseFloat(evaluation.note))}
                    </p>
                  </div>
                )}

                {/* Comment */}
                <div className="mt-6">
                  <Textarea
                    label="Commentaire"
                    value={evaluation.commentaire}
                    onChange={(e) =>
                      setEvaluation({
                        ...evaluation,
                        commentaire: e.target.value,
                      })
                    }
                    placeholder="Votre appréciation détaillée..."
                    rows={8}
                    required
                    disabled={isEvaluated}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Fournissez un feedback constructif à l'étudiant
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              {!isEvaluated && (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  disabled={saving}
                >
                  {saving ? (
                    <Loader size="small" />
                  ) : (
                    "Enregistrer l'Évaluation"
                  )}
                </Button>
              )}
            </form>
          </Card>
        </div>
      </div>

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
