import { useState } from "react";
import { BookOpen, Users, FileText, TrendingUp, Eye } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function MySpaces() {
  const [spaces] = useState([
    {
      id: 1,
      name: "React Avancé",
      promotion: "Web Dev 2024",
      teacher: "Sophie Martin",
      works: 3,
      pending: 1,
      average: 16.5,
      color: "from-blue-500 to-cyan-500",
      progress: 75,
    },
    {
      id: 2,
      name: "Node.js API",
      promotion: "Web Dev 2024",
      teacher: "Jean Dupont",
      works: 2,
      pending: 2,
      average: 15.0,
      color: "from-green-500 to-emerald-500",
      progress: 60,
    },
    {
      id: 3,
      name: "TypeScript",
      promotion: "Web Dev 2024",
      teacher: "Marie Dubois",
      works: 4,
      pending: 0,
      average: 17.2,
      color: "from-purple-500 to-pink-500",
      progress: 100,
    },
    {
      id: 4,
      name: "Next.js",
      promotion: "Web Dev 2024",
      teacher: "Pierre Laurent",
      works: 2,
      pending: 1,
      average: 14.8,
      color: "from-orange-500 to-amber-500",
      progress: 50,
    },
  ]);

  const getAverageColor = (avg) => {
    if (avg >= 16) return "text-green-600 bg-green-100";
    if (avg >= 14) return "text-blue-600 bg-blue-100";
    if (avg >= 12) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mes Cours
        </h1>
        <p className="text-gray-600 mt-1">
          Suivez vos cours et votre progression
        </p>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spaces.map((space) => (
          <Card
            key={space.id}
            className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {space.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {space.promotion}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Prof. {space.teacher}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${space.color} flex items-center justify-center shadow-lg`}
                >
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {space.works}
                  </p>
                  <p className="text-xs text-gray-600">Travaux</p>
                </div>
                <div className="text-center border-l border-r border-gray-100">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {space.pending}
                  </p>
                  <p className="text-xs text-gray-600">À rendre</p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold rounded-lg px-2 py-1 ${getAverageColor(
                      space.average
                    )}`}
                  >
                    {space.average}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Moyenne</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Progression
                  </span>
                  <span className="font-semibold text-gray-900">
                    {space.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${space.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${space.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                fullWidth
                className="border-2 border-blue-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir les détails
              </Button>
            </div>
          </Card>
        ))}
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
