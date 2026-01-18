import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserCheck,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { spaceService } from "@/services/space.service";

export default function AssignIndividual() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [works, setWorks] = useState([]);
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    travailId: "",
    espacePedagogiqueId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadWorks();
  }, []);

  useEffect(() => {
    if (formData.travailId) {
      loadStudents(formData.travailId);
    }
  }, [formData.travailId]);

  const loadWorks = async () => {
    try {
      const response = await workService.getAll({ typeTravail: "INDIVIDUEL" });
      setWorks(response.travaux || []);
    } catch (error) {
      console.error("Erreur chargement travaux:", error);
    }
  };

  const loadStudents = async (workId) => {
    try {
      const work = await workService.getById(workId);
      if (work.espacePedagogiqueId) {
        const space = await spaceService.getById(work.espacePedagogiqueId);
        const studentsData = (space.inscriptions || []).map(
          (inscription, idx) => ({
            id: inscription.etudiant.id,
            name: `${inscription.etudiant.prenom} ${inscription.etudiant.nom}`,
            matricule: inscription.etudiant.matricule,
            promotion: space.promotion?.nom || "N/A",
            initials: `${inscription.etudiant.prenom?.[0]}${inscription.etudiant.nom?.[0]}`,
            color: [
              "from-purple-400 to-pink-400",
              "from-blue-400 to-cyan-400",
              "from-green-400 to-emerald-400",
              "from-orange-400 to-amber-400",
              "from-red-400 to-rose-400",
              "from-teal-400 to-cyan-400",
              "from-indigo-400 to-purple-400",
              "from-pink-400 to-rose-400",
            ][idx % 8],
          }),
        );
        setStudents(studentsData);
        setFormData((prev) => ({
          ...prev,
          espacePedagogiqueId: work.espacePedagogiqueId.toString(),
        }));
      }
    } catch (error) {
      console.error("Erreur chargement étudiants:", error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.promotion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert("Veuillez sélectionner au moins un étudiant");
      return;
    }

    try {
      setLoading(true);
      await workService.assignIndividual(formData.travailId, selectedStudents);
      alert(
        `Travail assigné à ${selectedStudents.length} étudiant(s) avec succès !`,
      );
      navigate("/trainer/assignments");
    } catch (error) {
      console.error("Erreur assignation:", error);
      alert(error.response?.data?.error || "Erreur lors de l'assignation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/trainer/assignments")}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Assignation Individuelle
          </h1>
          <p className="text-gray-600 mt-1">
            Assigner un travail à des étudiants
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Work Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informations
              </h2>

              <div className="space-y-4">
                <Select
                  label="Travail à assigner"
                  name="travailId"
                  value={formData.travailId}
                  onChange={(e) =>
                    setFormData({ ...formData, travailId: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un travail</option>
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>
                      {work.titre}
                    </option>
                  ))}
                </Select>

                {/* Selected Count */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Étudiants sélectionnés
                    </span>
                    <Badge variant="primary" className="text-lg px-3 py-1">
                      {selectedStudents.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {selectedStudents.length === 0
                      ? "Aucun étudiant sélectionné"
                      : `${selectedStudents.length} étudiant${selectedStudents.length > 1 ? "s" : ""} sélectionné${selectedStudents.length > 1 ? "s" : ""}`}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg mt-6"
                  disabled={
                    selectedStudents.length === 0 ||
                    !formData.travailId ||
                    loading
                  }
                >
                  {loading ? (
                    <Loader size="small" />
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 mr-2" />
                      Assigner aux {selectedStudents.length} étudiant
                      {selectedStudents.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Students List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Liste des Étudiants ({filteredStudents.length})
                </h2>
                {filteredStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    {selectAll ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                    {selectAll ? "Tout désélectionner" : "Tout sélectionner"}
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, matricule ou promotion..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Students Grid */}
              <div className="max-h-[600px] overflow-y-auto space-y-2">
                {!formData.travailId ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Sélectionnez d'abord un travail</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Aucun étudiant trouvé</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => toggleStudent(student.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "bg-purple-50 border-purple-500"
                            : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Checkbox */}
                          <div
                            className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all ${
                              isSelected
                                ? "bg-purple-600 border-purple-600"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Avatar */}
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${student.color} flex items-center justify-center text-white font-bold shadow-md`}
                          >
                            {student.initials}
                          </div>

                          {/* Info */}
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student.matricule}
                            </p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {student.promotion}
                            </Badge>
                          </div>
                        </div>

                        {/* Status indicator */}
                        {isSelected && (
                          <div className="text-purple-600">
                            <CheckSquare className="w-6 h-6" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </form>

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
