import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Toast from "@/components/ui/Toast";
import { spaceService } from "@/services/space.service";

const EnrollStudents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [space, setSpace] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [spaceData, studentsData] = await Promise.all([
        spaceService.getById(id),
        spaceService.getAvailableStudents(id),
      ]);

      setSpace(spaceData);
      setAvailableStudents(studentsData.etudiants || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setToast({ show: true, message: "Erreur de chargement", type: "error" });
      setLoading(false);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      setToast({
        show: true,
        message: "Sélectionnez au moins un étudiant",
        type: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      await spaceService.enrollStudents(id, selectedIds);
      setToast({
        show: true,
        message: `${selectedIds.length} étudiant(s) inscrit(s)`,
        type: "success",
      });
      setTimeout(() => navigate("/director/spaces"), 1500);
    } catch (error) {
      console.error("Erreur inscription:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Erreur lors de l'inscription",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = availableStudents.filter((student) =>
    `${student.nom} ${student.prenom} ${student.matricule}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ show: false, message: "", type: "" })}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/director/spaces")}
          icon={ArrowLeft}
        >
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inscrire des Étudiants
          </h1>
          <p className="text-gray-600 mt-1">
            {space?.nom} - {space?.promotion?.nom}
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="max-w-md"
            />
            <div className="text-sm text-gray-600">
              {selectedIds.length} / {filteredStudents.length} sélectionné(s)
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm
                ? "Aucun étudiant trouvé"
                : "Tous les étudiants sont déjà inscrits"}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 pb-2 border-b">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={toggleAll}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Tout sélectionner
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {student.nom} {student.prenom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {student.matricule} • {student.compte?.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate("/director/spaces")}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            icon={Save}
            disabled={selectedIds.length === 0}
          >
            Inscrire {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnrollStudents;
