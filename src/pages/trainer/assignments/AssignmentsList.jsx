import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserCheck, Users as UsersIcon, Calendar } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";

export default function AssignmentsList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const response = await workService.getAll();
      const works = response.travaux || [];

      // Formater les données pour l'affichage
      const assignmentsData = works.map((work) => {
        const isIndividual = work.typeTravail === "INDIVIDUEL";
        const total = isIndividual
          ? work._count?.affectations || 0
          : work._count?.groupes || 0;

        return {
          id: work.id,
          work: work.titre,
          type: isIndividual ? "Individuel" : "Collectif",
          assigned: total,
          total: total,
          date: work.dateDebut,
          assignedTo: isIndividual
            ? `${total} étudiant${total > 1 ? "s" : ""}`
            : `${total} groupe${total > 1 ? "s" : ""}`,
        };
      });

      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Erreur chargement assignations:", error);
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

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Gestion des Assignations
        </h1>
        <p className="text-gray-600 mt-1">
          Assigner des travaux aux étudiants ou groupes
        </p>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {assignment.work}
                  </h3>
                  <Badge
                    variant={
                      assignment.type === "Individuel" ? "info" : "success"
                    }
                  >
                    {assignment.type}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>
                      Assigné le{" "}
                      {new Date(assignment.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-blue-600" />
                    <span>{assignment.assignedTo}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Assignations</span>
                    <span className="font-semibold text-gray-900">
                      {assignment.assigned}{" "}
                      {assignment.type === "Individuel"
                        ? "étudiant(s)"
                        : "groupe(s)"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 bg-purple-500`}
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 ml-6">
                <Link to={`/trainer/works/edit/${assignment.id}`}>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Modifier
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/trainer/assignments/individual">
          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-300 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Assigner en Individuel
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Assigner un travail à des étudiants
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/trainer/assignments/group">
          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-300 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <UsersIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Assigner en Collectif
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Assigner un travail à des groupes
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {assignments.length === 0 && (
        <Card className="p-12 text-center">
          <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            Aucune assignation
          </h3>
          <p className="text-gray-500">
            Commencez par créer des travaux puis assignez-les
          </p>
        </Card>
      )}

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
