import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle, AlertCircle, Upload, FileText } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import etudiantService from "@/services/etudiant.service";

export default function MyWorks() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [works, setWorks] = useState([]);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const data = await etudiantService.getMyWorks();
      
      // Formater les travaux individuels
      const individuels = (data.individuels || []).map(aff => ({
        id: aff.travail.id,
        title: aff.travail.titre,
        course: aff.travail.espacePedagogique?.matiere?.nom || aff.travail.espacePedagogique?.nom || 'Sans matière',
        type: 'Individuel',
        deadline: aff.travail.dateFin,
        status: aff.livraisons && aff.livraisons.length > 0
          ? (aff.livraisons[0].evaluations && aff.livraisons[0].evaluations.length > 0 ? 'graded' : 'submitted')
          : 'pending',
        submittedAt: aff.livraisons && aff.livraisons.length > 0 ? aff.livraisons[0].dateLivraison : null,
        grade: aff.livraisons && aff.livraisons.length > 0 && aff.livraisons[0].evaluations && aff.livraisons[0].evaluations.length > 0
          ? aff.livraisons[0].evaluations[0].note
          : null,
        description: aff.travail.consignes,
        affectationId: aff.id,
        isIndividual: true
      }));

      // Formater les travaux de groupe
      const groupes = (data.groupes || []).map(membre => ({
        id: membre.groupe.travail.id,
        title: membre.groupe.travail.titre,
        course: membre.groupe.travail.espacePedagogique?.matiere?.nom || membre.groupe.travail.espacePedagogique?.nom || 'Sans matière',
        type: 'Collectif',
        deadline: membre.groupe.travail.dateFin,
        status: membre.groupe.livraisons && membre.groupe.livraisons.length > 0
          ? (membre.groupe.livraisons[0].evaluations && membre.groupe.livraisons[0].evaluations.length > 0 ? 'graded' : 'submitted')
          : 'pending',
        submittedAt: membre.groupe.livraisons && membre.groupe.livraisons.length > 0 ? membre.groupe.livraisons[0].dateLivraison : null,
        grade: membre.groupe.livraisons && membre.groupe.livraisons.length > 0 && membre.groupe.livraisons[0].evaluations && membre.groupe.livraisons[0].evaluations.length > 0
          ? membre.groupe.livraisons[0].evaluations[0].note
          : null,
        description: membre.groupe.travail.consignes,
        groupeId: membre.groupe.id,
        isIndividual: false
      }));

      const allWorks = [...individuels, ...groupes];

      // Calculer les jours restants pour les travaux en attente
      allWorks.forEach(work => {
        if (work.status === 'pending') {
          const deadline = new Date(work.deadline);
          const now = new Date();
          work.daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        }
      });

      setWorks(allWorks);
    } catch (error) {
      console.error('Erreur chargement travaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorks = works.filter((work) => {
    if (filter === "all") return true;
    if (filter === "pending") return work.status === "pending";
    if (filter === "submitted") return work.status === "submitted";
    if (filter === "graded") return work.status === "graded";
    return true;
  });

  const getStatusBadge = (work) => {
    if (work.status === "pending") {
      if (work.daysLeft <= 3) {
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Urgent - {work.daysLeft}j
          </Badge>
        );
      }
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {work.daysLeft} jours
        </Badge>
      );
    }
    if (work.status === "submitted") {
      return (
        <Badge variant="info" className="flex items-center gap-1">
          <Upload className="w-3 h-3" />
          Soumis
        </Badge>
      );
    }
    if (work.status === "graded") {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Noté - {work.grade}/20
        </Badge>
      );
    }
  };

  const pendingCount = works.filter((w) => w.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mes Travaux
          </h1>
          <p className="text-gray-600 mt-1">Consultez et soumettez vos travaux</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="warning" className="text-base px-4 py-2">
            {pendingCount} à rendre
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-64">
            <option value="all">Tous les travaux ({works.length})</option>
            <option value="pending">À rendre ({works.filter(w => w.status === 'pending').length})</option>
            <option value="submitted">Soumis ({works.filter(w => w.status === 'submitted').length})</option>
            <option value="graded">Notés ({works.filter(w => w.status === 'graded').length})</option>
          </Select>
        </div>
      </Card>

      {/* Works List */}
      <div className="space-y-4">
        {filteredWorks.map((work) => (
          <Card
            key={`${work.id}-${work.isIndividual ? 'ind' : 'grp'}`}
            className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              work.status === "pending" && work.daysLeft <= 3
                ? "border-l-4 border-red-500"
                : work.status === "pending"
                ? "border-l-4 border-orange-500"
                : "border-l-4 border-blue-500"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{work.title}</h3>
                      <Badge variant={work.type === "Individuel" ? "info" : "success"}>
                        {work.type}
                      </Badge>
                      {getStatusBadge(work)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{work.course}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{work.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Échéance: {new Date(work.deadline).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {work.submittedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Soumis le {new Date(work.submittedAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="ml-6">
                {work.status === "pending" && (
                  <Link to={`/student/submit/${work.id}?type=${work.isIndividual ? 'individual' : 'group'}&id=${work.isIndividual ? work.affectationId : work.groupeId}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Soumettre
                    </Button>
                  </Link>
                )}
                {work.status === "submitted" && (
                  <Button variant="outline" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    En attente
                  </Button>
                )}
                {work.status === "graded" && (
                  <Link to={`/student/grades`}>
                    <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Voir la note
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredWorks.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun travail</h3>
          <p className="text-gray-500">Aucun travail ne correspond à vos critères</p>
        </Card>
      )}

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