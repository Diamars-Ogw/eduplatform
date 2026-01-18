import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import { workService } from "@/services/work.service";
import { spaceService } from "@/services/space.service";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [works, setWorks] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [formData, setFormData] = useState({
    nomGroupe: "",
    travailId: "",
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      const response = await workService.getAll({ typeTravail: "COLLECTIF" });
      setWorks(response.travaux || []);
    } catch (error) {
      console.error("Erreur chargement travaux:", error);
    }
  };

  const loadStudents = async (workId) => {
    try {
      const work = await workService.getById(workId);
      const spaceId = work.espacePedagogiqueId;

      if (spaceId) {
        const space = await spaceService.getById(spaceId);
        const students = (space.inscriptions || []).map((i) => ({
          id: i.etudiant.id,
          name: `${i.etudiant.prenom} ${i.etudiant.nom}`,
          matricule: i.etudiant.matricule,
        }));
        setAvailableStudents(students);
      }
    } catch (error) {
      console.error("Erreur chargement étudiants:", error);
    }
  };

  const filteredStudents = availableStudents.filter(
    (student) =>
      !selectedStudents.find((s) => s.id === student.id) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricule.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const addStudent = (student) => {
    setSelectedStudents([...selectedStudents, student]);
    setSearchTerm("");
  };

  const removeStudent = (id) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      alert("Veuillez ajouter au moins un membre au groupe");
      return;
    }

    try {
      setLoading(true);
      await workService.createGroup(formData.travailId, {
        nomGroupe: formData.nomGroupe,
        membresIds: selectedStudents.map((s) => s.id),
      });
      alert("Groupe créé avec succès !");
      navigate("/trainer/groups");
    } catch (error) {
      console.error("Erreur création groupe:", error);
      alert(
        error.response?.data?.error || "Erreur lors de la création du groupe",
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const colors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-orange-400 to-amber-400",
    "from-red-400 to-rose-400",
    "from-teal-400 to-cyan-400",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/trainer/groups")}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Créer un Groupe
          </h1>
          <p className="text-gray-600 mt-1">
            Former un nouveau groupe d'étudiants
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations du Groupe
            </h2>
            <div className="space-y-4">
              <Select
                label="Travail concerné"
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

              <Input
                label="Nom du groupe"
                name="nomGroupe"
                value={formData.nomGroupe}
                onChange={(e) =>
                  setFormData({ ...formData, nomGroupe: e.target.value })
                }
                placeholder="Ex: Groupe A"
                required
              />
            </div>
          </Card>

          {/* Selected Members */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Membres du groupe ({selectedStudents.length})
              </h2>
            </div>

            {selectedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Aucun membre ajouté</p>
                <p className="text-sm mt-1">
                  Recherchez et ajoutez des étudiants ci-dessous
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold shadow-md`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.matricule}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStudent(student.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Add Members */}
          {formData.travailId && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ajouter des Membres
              </h2>

              <Input
                placeholder="Rechercher un étudiant par nom ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    {searchTerm
                      ? "Aucun étudiant trouvé"
                      : "Aucun étudiant disponible"}
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => addStudent(student)}
                      className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
                          {getInitials(student.name)}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.matricule}
                          </p>
                        </div>
                      </div>
                      <UserPlus className="w-5 h-5 text-purple-600" />
                    </button>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/trainer/groups")}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading || selectedStudents.length === 0}
          >
            {loading ? <Loader size="small" /> : "Créer le Groupe"}
          </Button>
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
