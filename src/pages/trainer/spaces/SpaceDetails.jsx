import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Loader from '../../../components/ui/Loader';
import { spaceService } from '../../../services/space.service';
import { ArrowLeft, Users, FileText, BookOpen, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SpaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpace();
  }, [id]);

  const loadSpace = async () => {
    try {
      setLoading(true);
      const data = await spaceService.getById(id);
      setSpace(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger l\'espace');
      navigate('/trainer/spaces');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (!space) return null;

  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-emerald-400',
    'from-orange-400 to-amber-400',
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/trainer/spaces')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {space.nom}
            </h1>
            <p className="text-gray-600 mt-1">
              {space.promotion?.nom} - {space.matiere?.nom}
            </p>
          </div>
        </div>
        <Badge variant={space.estActif ? 'success' : 'secondary'}>
          {space.estActif ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Étudiants inscrits</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {space.inscriptions?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Travaux créés</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {space.travaux?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Matière</p>
              <p className="text-lg font-bold text-purple-600 mt-2">
                {space.matiere?.nom || 'Non défini'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h3>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate(`/trainer/works/create?spaceId=${space.id}`)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un travail
          </Button>
          <Button variant="outline" onClick={() => navigate('/trainer/works')}>
            <FileText className="w-4 h-4 mr-2" />
            Voir tous les travaux
          </Button>
        </div>
      </Card>

      {/* Liste des étudiants */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Étudiants inscrits ({space.inscriptions?.length || 0})
        </h3>
        {space.inscriptions && space.inscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {space.inscriptions.map((inscription, idx) => {
              const etudiant = inscription.etudiant;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${colors[idx % colors.length]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {etudiant?.prenom?.[0]}{etudiant?.nom?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {etudiant?.prenom} {etudiant?.nom}
                    </p>
                    <p className="text-sm text-gray-600">{etudiant?.matricule}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun étudiant inscrit dans cet espace</p>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default SpaceDetails;