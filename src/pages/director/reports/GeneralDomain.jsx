import { useState, useEffect } from "react";
import {
  Download,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import Badge from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
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
import { reportService } from "@/services/report.service";
import { promotionService } from "@/services/promotion.service";
import { spaceService } from "@/services/space.service";
import { CHART_COLORS } from "@/utils/constants";

const GeneralDomain = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [filters, setFilters] = useState({
    promotionId: "",
    matiereId: "",
    periode: "all",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (promotions.length > 0) {
      loadReportData();
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const [promosData, matieresData] = await Promise.all([
        promotionService.getAll(),
        spaceService.getMatieres(),
      ]);

      setPromotions(promosData.promotions || []);
      setMatieres(matieresData.matieres || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      setLoading(false);
    }
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getGeneralDomainReport(filters);
      setReportData(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement rapport:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    const exportData = [
      {
        type: "Statistiques Générales",
        total: reportData.totalEvaluations,
        moyenne: reportData.moyenne,
        noteMin: reportData.noteMin,
        noteMax: reportData.noteMax,
        tauxReussite: reportData.tauxReussite,
      },
    ];

    reportService.exportToCSV(exportData, `rapport-${Date.now()}`);
  };

  const handleExportJSON = () => {
    if (!reportData) return;
    reportService.exportToJSON(reportData, `rapport-${Date.now()}`);
  };

  if (loading && !reportData) {
    return <Loader text="Chargement des rapports..." />;
  }

  const distributionData = reportData?.distribution
    ? Object.entries(reportData.distribution).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  const COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rapports Généraux
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble des performances académiques
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExportCSV}
            disabled={!reportData}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExportJSON}
            disabled={!reportData}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Promotion"
            name="promotionId"
            value={filters.promotionId}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "Toutes les promotions" },
              ...promotions.map((p) => ({
                value: p.id.toString(),
                label: `${p.nom} (${p.code})`,
              })),
            ]}
          />

          <Select
            label="Matière"
            name="matiereId"
            value={filters.matiereId}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "Toutes les matières" },
              ...matieres.map((m) => ({
                value: m.id.toString(),
                label: m.nom,
              })),
            ]}
          />

          <Select
            label="Période"
            name="periode"
            value={filters.periode}
            onChange={handleFilterChange}
            options={[
              { value: "all", label: "Toute l'année" },
              { value: "s1", label: "Semestre 1" },
              { value: "s2", label: "Semestre 2" },
              { value: "month", label: "Ce mois" },
            ]}
          />
        </div>
      </Card>

      {loading ? (
        <Loader />
      ) : !reportData ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p>Sélectionnez des filtres pour voir les statistiques</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Évaluations"
              value={reportData.totalEvaluations || 0}
              icon={FileText}
              color="blue"
              delay="0.2s"
            />
            <StatCard
              title="Moyenne Générale"
              value={`${reportData.moyenne || 0}/20`}
              icon={Award}
              color="purple"
              delay="0.3s"
            />
            <StatCard
              title="Taux de Réussite"
              value={`${reportData.tauxReussite || 0}%`}
              icon={TrendingUp}
              color="green"
              delay="0.4s"
            />
            <StatCard
              title="Note Maximale"
              value={`${reportData.noteMax || 0}/20`}
              icon={Award}
              color="cyan"
              delay="0.5s"
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution des notes */}
            <Card
              title="Distribution des Notes"
              className="animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              {distributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </Card>

            {/* Statistiques détaillées */}
            <Card
              title="Détails des Notes"
              className="animate-slide-up"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Note Minimale</span>
                  <span className="text-xl font-bold text-red-600">
                    {reportData.noteMin || 0}/20
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Note Moyenne</span>
                  <span className="text-xl font-bold text-blue-600">
                    {reportData.moyenne || 0}/20
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Note Maximale</span>
                  <span className="text-xl font-bold text-green-600">
                    {reportData.noteMax || 0}/20
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                  <span className="font-medium">Taux de Réussite</span>
                  <span className="text-2xl font-bold">
                    {reportData.tauxReussite || 0}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Distribution par tranche */}
          <Card
            title="Répartition par Tranche de Notes"
            className="animate-slide-up"
            style={{ animationDelay: "0.8s" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre d'étudiants">
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Résumé textuel */}
          <Card
            title="Analyse"
            className="animate-slide-up"
            style={{ animationDelay: "0.9s" }}
          >
            <div className="prose max-w-none">
              <p className="text-gray-700">
                Sur un total de <strong>{reportData.totalEvaluations}</strong>{" "}
                évaluations, la moyenne générale s'établit à{" "}
                <strong>{reportData.moyenne}/20</strong>.
              </p>
              <p className="text-gray-700 mt-2">
                Le taux de réussite (notes ≥ 10/20) est de{" "}
                <strong className="text-green-600">
                  {reportData.tauxReussite}%
                </strong>
                .
              </p>
              <p className="text-gray-700 mt-2">
                Les notes s'échelonnent entre{" "}
                <strong className="text-red-600">
                  {reportData.noteMin}/20
                </strong>{" "}
                et{" "}
                <strong className="text-green-600">
                  {reportData.noteMax}/20
                </strong>
                .
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

// Composant StatCard
const StatCard = ({ title, value, icon: Icon, color, delay }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    cyan: "from-cyan-500 to-cyan-600",
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

export default GeneralDomain;
