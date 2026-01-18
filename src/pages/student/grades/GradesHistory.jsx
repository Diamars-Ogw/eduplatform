import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Calendar,
  Download,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

export default function GradesHistory() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const [years] = useState(["2024", "2023", "2022"]);

  const [historicalData] = useState({
    2024: {
      semester1: {
        average: 15.8,
        courses: [
          { course: "React Avancé", average: 16.5, grades: [16, 17, 18] },
          { course: "TypeScript", average: 17.2, grades: [16, 18, 17] },
          { course: "Node.js API", average: 15.0, grades: [14, 15, 16] },
          { course: "Next.js", average: 14.8, grades: [15, 14] },
        ],
      },
      semester2: {
        average: 14.5,
        courses: [
          { course: "Vue.js", average: 15.0, grades: [14, 15, 16] },
          { course: "Python", average: 14.0, grades: [13, 14, 15] },
        ],
      },
    },
    2023: {
      semester1: {
        average: 14.2,
        courses: [
          { course: "HTML/CSS", average: 16.0, grades: [15, 16, 17] },
          { course: "JavaScript", average: 15.5, grades: [14, 16, 17] },
          { course: "PHP", average: 13.0, grades: [12, 13, 14] },
        ],
      },
      semester2: {
        average: 15.0,
        courses: [
          { course: "SQL", average: 16.0, grades: [15, 17, 16] },
          { course: "Git", average: 14.0, grades: [13, 14, 15] },
        ],
      },
    },
  });

  const evolutionData = [
    { period: "2022 S1", moyenne: 13.5 },
    { period: "2022 S2", moyenne: 14.0 },
    { period: "2023 S1", moyenne: 14.2 },
    { period: "2023 S2", moyenne: 15.0 },
    { period: "2024 S1", moyenne: 15.8 },
    { period: "2024 S2", moyenne: 14.5 },
  ];

  const yearData = historicalData[selectedYear] || {
    semester1: null,
    semester2: null,
  };

  const getFilteredData = () => {
    if (selectedSemester === "all") {
      return [
        ...(yearData.semester1?.courses || []),
        ...(yearData.semester2?.courses || []),
      ];
    }
    return yearData[`semester${selectedSemester}`]?.courses || [];
  };

  const filteredCourses = getFilteredData();

  const getYearAverage = () => {
    const s1 = yearData.semester1?.average || 0;
    const s2 = yearData.semester2?.average || 0;
    return ((s1 + s2) / 2).toFixed(1);
  };

  const getGradeColor = (grade) => {
    if (grade >= 16) return "text-green-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/grades")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Historique des Notes
            </h1>
            <p className="text-gray-600 mt-1">
              Consultez toute votre progression académique
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Télécharger le relevé
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Période :</span>
          </div>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-40"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                Année {year}
              </option>
            ))}
          </Select>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-48"
          >
            <option value="all">Tous les semestres</option>
            <option value="1">Semestre 1</option>
            <option value="2">Semestre 2</option>
          </Select>
        </div>
      </Card>

      {/* Year Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Moyenne Annuelle
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {getYearAverage()}/20
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {yearData.semester1 && (
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Semestre 1</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {yearData.semester1.average}/20
                </h3>
              </div>
              <Badge variant="info">
                {yearData.semester1.courses.length} cours
              </Badge>
            </div>
          </Card>
        )}

        {yearData.semester2 && (
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Semestre 2</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {yearData.semester2.average}/20
                </h3>
              </div>
              <Badge variant="primary">
                {yearData.semester2.courses.length} cours
              </Badge>
            </div>
          </Card>
        )}
      </div>

      {/* Evolution Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Évolution sur Plusieurs Années
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 20]} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="moyenne"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 6 }}
              name="Moyenne"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Courses */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">
            Détail des Cours ({filteredCourses.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Cours
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Moyenne
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Notes
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Appréciation
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {course.course}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`text-2xl font-bold ${getGradeColor(
                        course.average
                      )}`}
                    >
                      {course.average}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      {course.grades.map((grade, gIdx) => (
                        <Badge
                          key={gIdx}
                          variant={
                            grade >= 16
                              ? "success"
                              : grade >= 14
                              ? "info"
                              : "warning"
                          }
                        >
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge
                      variant={
                        course.average >= 16
                          ? "success"
                          : course.average >= 14
                          ? "info"
                          : course.average >= 12
                          ? "warning"
                          : "danger"
                      }
                    >
                      {course.average >= 16
                        ? "Excellent"
                        : course.average >= 14
                        ? "Bien"
                        : course.average >= 12
                        ? "Passable"
                        : "Insuffisant"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Aucune donnée disponible pour cette période</p>
          </div>
        )}
      </Card>

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
