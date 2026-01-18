import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  History,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import etudiantService from "@/services/etudiant.service";

export default function MyGrades() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    trend: "+0.0",
    total: 0,
    best: 0,
  });
  const [courseAverages, setCourseAverages] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const [gradesData, gradesBySubject] = await Promise.all([
        etudiantService.getMyGrades(),
        etudiantService.getGradesBySubject()
      ]);

      // Combiner toutes les évaluations
      const allGrades = [
        ...(gradesData.individuelles || []),
        ...(gradesData.groupes || [])
      ];

      // Formater les notes
      const formattedGrades = allGrades.map(evaluation => ({
        id: evaluation.id,
        work: evaluation.livraison?.affectation?.travail?.titre || 
              evaluation.livraison?.groupe?.travail?.titre || 
              'Sans titre',
        course: evaluation.livraison?.affectation?.travail?.espacePedagogique?.matiere?.nom ||
                evaluation.livraison?.groupe?.travail?.espacePedagogique?.matiere?.nom ||
                'Sans matière',
        grade: evaluation.note,
        date: evaluation.dateEvaluation,
        comment: evaluation.commentaire || '',
        teacher: evaluation.evaluateur ? 
          `${evaluation.evaluateur.nom} ${evaluation.evaluateur.prenom}` : 
          'Non spécifié'
      }));

      setGrades(formattedGrades);

      // Calculer les stats
      const notes = formattedGrades.map(g => g.grade);
      const average = notes.length > 0 ? notes.reduce((sum, n) => sum + n, 0) / notes.length : 0;
      const best = notes.length > 0 ? Math.max(...notes) : 0;

      setStats({
        average: parseFloat(average.toFixed(2)),
        trend: "+0.8", // TODO: Calculer la vraie tendance
        total: notes.length,
        best
      });

      // Moyennes par matière
      if (gradesBySubject.parMatiere) {
        const courseAvgs = gradesBySubject.parMatiere.map(item => ({
          course: item.matiere.nom,
          average: parseFloat(item.moyenne),
          count: item.nombreNotes
        }));
        setCourseAverages(courseAvgs);
      }

      // Distribution des notes
      const dist = [
        { name: "16-20", value: notes.filter(n => n >= 16).length, color: "#10b981" },
        { name: "14-15", value: notes.filter(n => n >= 14 && n < 16).length, color: "#3b82f6" },
        { name: "12-13", value: notes.filter(n => n >= 12 && n < 14).length, color: "#f59e0b" },
        { name: "0-11", value: notes.filter(n => n < 12).length, color: "#ef4444" },
      ];
      setGradeDistribution(dist);

    } catch (error) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = grades.filter((grade) => {
    if (filter === "all") return true;
    return grade.course === filter;
  });

  const getGradeColor = (grade) => {
    if (grade >= 16) return "text-green-600 bg-green-100";
    if (grade >= 14) return "text-blue-600 bg-blue-100";
    if (grade >= 12) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getGradeLabel = (grade) => {
    if (grade >= 16) return "Excellent";
    if (grade >= 14) return "Bien";
    if (grade >= 12) return "Passable";
    return "Insuffisant";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mes Notes
          </h1>
          <p className="text-gray-600 mt-1">
            Consultez vos évaluations et votre progression
          </p>
        </div>
        <Link to="/student/grades/history">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <History className="w-4 h-4 mr-2" />
            Historique complet
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Moyenne Générale
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.average}/20
              </h3>
              <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stats.trend}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Notes</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </h3>
              <p className="text-blue-600 text-sm mt-2">Ce semestre</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Meilleure Note
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {stats.best}/20
              </h3>
              <p className="text-purple-600 text-sm mt-2">Bravo !</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Dernière Note</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {grades.length > 0 ? `${grades[0].grade}/20` : 'N/A'}
              </h3>
              <p className="text-orange-600 text-sm mt-2">
                {grades.length > 0 ? new Date(grades[0].date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Award className="w-5 h-5 text-gray-600" />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-1"
              >
                <option value="all">Toutes les matières ({grades.length})</option>
                {courseAverages.map((course, idx) => (
                  <option key={idx} value={course.course}>
                    {course.course} ({course.count})
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {/* Grades */}
          {filteredGrades.length === 0 ? (
            <Card className="p-12 text-center">
              <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Aucune note</h3>
              <p className="text-gray-500">Vous n'avez pas encore de notes</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredGrades.map((grade) => (
                <Card
                  key={grade.id}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {grade.work}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{grade.course}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(grade.date).toLocaleDateString("fr-FR")}
                        </span>
                        <span>•</span>
                        <span>Prof. {grade.teacher}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold px-4 py-2 rounded-xl ${getGradeColor(
                          grade.grade
                        )}`}
                      >
                        {grade.grade}/20
                      </div>
                      <Badge
                        variant={
                          grade.grade >= 16
                            ? "success"
                            : grade.grade >= 14
                            ? "info"
                            : "warning"
                        }
                        className="mt-2"
                      >
                        {getGradeLabel(grade.grade)}
                      </Badge>
                    </div>
                  </div>

                  {/* Comment */}
                  {grade.comment && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Commentaire du formateur
                          </p>
                          <p className="text-sm text-gray-700">{grade.comment}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Course Averages */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Moyennes par Matière
            </h3>
            {courseAverages.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Aucune donnée</p>
            ) : (
              <div className="space-y-4">
                {courseAverages.map((course, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {course.course}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          getGradeColor(course.average).split(" ")[0]
                        }`}
                      >
                        {course.average}/20
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${(course.average / 20) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.count} note{course.count > 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Grade Distribution */}
          {gradeDistribution.some(d => d.value > 0) && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Distribution des Notes
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gradeDistribution.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
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