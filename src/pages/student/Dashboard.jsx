import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Clock, TrendingUp, Award, Calendar, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import etudiantService from "@/services/etudiant.service";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courses: 0,
    pendingWorks: 0,
    average: 0,
    completedWorks: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, worksData, gradesData, spacesData] = await Promise.all([
        etudiantService.getMyStats(),
        etudiantService.getMyWorks(),
        etudiantService.getMyGrades(),
        etudiantService.getMySpaces()
      ]);

      // Stats
      setStats({
        courses: spacesData.length,
        pendingWorks: statsData.pendingWorks,
        average: statsData.averageGrade,
        completedWorks: statsData.submittedWorks,
      });

      // Prochaines échéances
      const allWorks = [
        ...(worksData.individuels || []).map(w => ({
          ...w.travail,
          type: 'INDIVIDUEL',
          affectationId: w.id
        })),
        ...(worksData.groupes || []).map(g => ({
          ...g.groupe.travail,
          type: 'COLLECTIF',
          groupeId: g.groupe.id
        }))
      ];

      const upcoming = allWorks
        .filter(w => {
          const deadline = new Date(w.dateFin);
          return deadline > new Date();
        })
        .map(w => {
          const deadline = new Date(w.dateFin);
          const now = new Date();
          const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
          
          return {
            id: w.id,
            title: w.titre,
            course: w.espacePedagogique?.matiere?.nom || w.espacePedagogique?.nom || 'Sans matière',
            deadline: w.dateFin,
            daysLeft,
            status: daysLeft <= 3 ? 'urgent' : daysLeft <= 7 ? 'warning' : 'normal'
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);

      setUpcomingDeadlines(upcoming);

      // Dernières notes
      const allGrades = [
        ...(gradesData.individuelles || []),
        ...(gradesData.groupes || [])
      ];

      const recent = allGrades
        .sort((a, b) => new Date(b.dateEvaluation) - new Date(a.dateEvaluation))
        .slice(0, 3)
        .map(g => ({
          id: g.id,
          work: g.livraison?.affectation?.travail?.titre || g.livraison?.groupe?.travail?.titre || 'Sans titre',
          course: g.livraison?.affectation?.travail?.espacePedagogique?.matiere?.nom || 
                  g.livraison?.groupe?.travail?.espacePedagogique?.matiere?.nom || 
                  'Sans matière',
          grade: g.note,
          date: g.dateEvaluation
        }));

      setRecentGrades(recent);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "urgent") return "text-red-600 bg-red-50 border-red-200";
    if (status === "warning") return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const getGradeColor = (grade) => {
    if (grade >= 16) return "text-green-600 bg-green-100";
    if (grade >= 14) return "text-blue-600 bg-blue-100";
    if (grade >= 12) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bonjour, {user?.etudiant?.prenom || 'Étudiant'} !
        </h1>
        <p className="text-gray-600 mt-1">Bienvenue sur votre espace personnel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Mes Cours</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.courses}</h3>
              <p className="text-blue-600 text-sm mt-2">Actifs</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">À Rendre</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingWorks}</h3>
              <p className="text-orange-600 text-sm mt-2">Travaux</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Moyenne Générale</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.average.toFixed(1)}/20</h3>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                En progression
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Travaux Rendus</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.completedWorks}</h3>
              <p className="text-purple-600 text-sm mt-2">Ce semestre</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-900">Prochaines Échéances</h3>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune échéance à venir</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(deadline.status)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{deadline.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{deadline.course}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>Échéance: {new Date(deadline.deadline).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <Badge variant={deadline.status === "urgent" ? "danger" : "warning"}>
                      {deadline.daysLeft}j
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/student/works">
            <Button variant="outline" fullWidth className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50">
              Voir tous les travaux
            </Button>
          </Link>
        </Card>

        {/* Recent Grades */}
        <Card className="hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Dernières Notes</h3>
          </div>

          {recentGrades.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune note disponible</p>
          ) : (
            <div className="space-y-3">
              {recentGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{grade.work}</h4>
                    <p className="text-sm text-gray-600">{grade.course}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(grade.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getGradeColor(grade.grade)}`}>
                    {grade.grade}/20
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/student/grades">
            <Button variant="outline" fullWidth className="mt-4 border-green-200 text-green-600 hover:bg-green-50">
              Voir toutes mes notes
            </Button>
          </Link>
        </Card>
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