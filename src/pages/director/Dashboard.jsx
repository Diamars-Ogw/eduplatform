import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Loader from "@/components/ui/Loader";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/utils/constants";
import { getRelativeTime } from "@/utils/helpers";
import { userService } from "@/services/user.service";
import { promotionService } from "@/services/promotion.service";
import { spaceService } from "@/services/space.service";

const DirectorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger toutes les données en parallèle
      const [usersData, promotionsData, spacesData] = await Promise.all([
        userService.getAll(),
        promotionService.getAll(),
        spaceService.getAll(),
      ]);

      // Calculer les statistiques
      const totalStudents =
        usersData.users?.filter((u) => u.role === "ETUDIANT").length || 0;
      const totalTeachers =
        usersData.users?.filter((u) => u.role === "FORMATEUR").length || 0;
      const activePromotions =
        promotionsData.promotions?.filter((p) => p.estActive).length || 0;
      const pedagogicalSpaces = spacesData.espaces?.length || 0;

      // Distribution par promotion
      const distribution =
        promotionsData.promotions?.map((promo) => ({
          name: promo.nom,
          value: promo._count?.etudiants || 0,
          students: promo._count?.etudiants || 0,
        })) || [];

      // Données d'évolution (simulées pour le moment)
      const evolution = [
        {
          month: "Sep",
          students: totalStudents - 27,
          teachers: totalTeachers - 3,
        },
        {
          month: "Oct",
          students: totalStudents - 12,
          teachers: totalTeachers - 2,
        },
        {
          month: "Nov",
          students: totalStudents - 5,
          teachers: totalTeachers - 1,
        },
        { month: "Déc", students: totalStudents, teachers: totalTeachers },
      ];

      setStats({
        totalStudents,
        studentsChange: "+12%",
        totalTeachers,
        teachersChange: "+3%",
        activePromotions,
        promotionsChange: "+2%",
        pedagogicalSpaces,
        spacesChange: "+8%",
        evolution,
        distribution,
        successRate: 87,
        successRateChange: "+5%",
        recentActivities: [
          {
            id: 1,
            type: "Création",
            title: "Nouvelle promotion créée",
            user: "Admin",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: 2,
            type: "Inscription",
            title: `${totalStudents} étudiants inscrits`,
            user: "Système",
            time: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
          {
            id: 3,
            type: "Évaluation",
            title: "Nouvelles notes disponibles",
            user: "Formateurs",
            time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Chargement du dashboard..." />;
  }

  const COLORS = [
    CHART_COLORS.purple,
    CHART_COLORS.blue,
    CHART_COLORS.cyan,
    CHART_COLORS.green,
    CHART_COLORS.yellow,
    CHART_COLORS.pink,
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-gradient">
          Dashboard Directeur
        </h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de la plateforme académique
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Étudiants"
          value={stats.totalStudents}
          change={stats.studentsChange}
          icon={Users}
          color="blue"
          delay="0s"
        />
        <StatCard
          title="Formateurs"
          value={stats.totalTeachers}
          change={stats.teachersChange}
          icon={GraduationCap}
          color="pink"
          delay="0.1s"
        />
        <StatCard
          title="Promotions Actives"
          value={stats.activePromotions}
          change={stats.promotionsChange}
          icon={Award}
          color="purple"
          delay="0.2s"
        />
        <StatCard
          title="Espaces Pédagogiques"
          value={stats.pedagogicalSpaces}
          change={stats.spacesChange}
          icon={BookOpen}
          color="cyan"
          delay="0.3s"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'évolution */}
        <Card
          title="Évolution des Inscriptions"
          className="animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                name="Étudiants"
                stroke={CHART_COLORS.blue}
                strokeWidth={3}
                dot={{ r: 6, fill: CHART_COLORS.blue }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="teachers"
                name="Formateurs"
                stroke={CHART_COLORS.pink}
                strokeWidth={3}
                dot={{ r: 6, fill: CHART_COLORS.pink }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Graphique de répartition */}
        <Card
          title="Répartition par Promotion"
          className="animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.distribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Dernières activités et taux de réussite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Taux de réussite */}
        <Card
          title="Taux de Réussite Global"
          className="animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl font-bold text-gradient mb-4">
                {stats.successRate}%
              </div>
              <p className="text-gray-600">Taux de réussite moyen</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Excellent</span>
                  <span className="text-green-600 font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Bien</span>
                  <span className="text-blue-600 font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Passable</span>
                  <span className="text-yellow-600 font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dernières activités */}
        <Card
          title="Dernières Activités"
          className="col-span-2 animate-slide-up"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {activity.type}
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Par {activity.user} • {getRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Composant StatCard
const StatCard = ({ title, value, change, icon: Icon, color, delay }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    pink: "from-pink-500 to-pink-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <Card
      className="card-hover animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </p>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default DirectorDashboard;
