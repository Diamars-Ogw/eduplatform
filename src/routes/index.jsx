import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Auth
import Login from "@/pages/auth/Login";

// Director
import DirectorLayout from "@/pages/director/DirectorLayout";
import DirectorDashboard from "@/pages/director/Dashboard";
import UsersList from "@/pages/director/users/UsersList";
import CreateUser from "@/pages/director/users/CreateUser";
import EditUser from "@/pages/director/users/EditUser";
import PromotionsList from "@/pages/director/promotions/PromotionsList";
import CreatePromotion from "@/pages/director/promotions/CreatePromotion";
import EditPromotion from "@/pages/director/promotions/EditPromotion";
import SpacesList from "@/pages/director/spaces/SpacesList";
import CreateSpace from "@/pages/director/spaces/CreateSpace";
import EditSpace from "@/pages/director/spaces/EditSpace";
import EnrollStudents from "@/pages/director/spaces/EnrollStudents";
import InactiveAccounts from "@/pages/director/InactiveAccounts";
import Reports from "@/pages/director/reports/GeneralDomain";

// Trainer
import TrainerLayout from "@/pages/trainer/TrainerLayout";
import TrainerDashboard from "@/pages/trainer/Dashboard";
import MySpaces from "@/pages/trainer/spaces/MySpaces";
import WorksList from "@/pages/trainer/works/WorksList";
import CreateWork from "@/pages/trainer/works/CreateWork";
import EditWork from "@/pages/trainer/works/EditWork";
import GroupsList from "@/pages/trainer/groups/GroupsList";
import CreateGroup from "@/pages/trainer/groups/CreateGroup";
import AssignmentsList from "@/pages/trainer/assignments/AssignmentsList";
import SubmissionsList from "@/pages/trainer/submissions/SubmissionsList";
import EvaluateWork from "@/pages/trainer/evaluation/EvaluateWork";
import AssignIndividual from "@/pages/trainer/assignments/AssignIndividual";
import AssignGroup from "@/pages/trainer/assignments/AssignGroup";
import SpaceDetails from "../pages/trainer/spaces/SpaceDetails";

// Student
import StudentLayout from "@/pages/student/StudentLayout";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentSpaces from "@/pages/student/spaces/MySpaces";
import MyWorks from "@/pages/student/works/MyWorks";
import SubmitWork from "@/pages/student/submit/SubmitWork";
import MyGrades from "@/pages/student/grades/MyGrades";
import GradesHistory from "@/pages/student/grades/GradesHistory";

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/director",
        element: (
          <ProtectedRoute allowedRoles={["DIRECTEUR"]}>
            <DirectorLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <DirectorDashboard /> },
          { path: "users", element: <UsersList /> },
          { path: "users/create", element: <CreateUser /> },
          { path: "users/edit/:id", element: <EditUser /> },
          { path: "promotions", element: <PromotionsList /> },
          { path: "promotions/create", element: <CreatePromotion /> },
          { path: "promotions/edit/:id", element: <EditPromotion /> },
          { path: "spaces", element: <SpacesList /> },
          { path: "spaces/create", element: <CreateSpace /> },
          { path: "spaces/edit/:id", element: <EditSpace /> },
          { path: "spaces/:id/enroll", element: <EnrollStudents /> },
          { path: "inactive-accounts", element: <InactiveAccounts /> },
          { path: "reports", element: <Reports /> },
        ],
      },
      {
        path: "/trainer",
        element: (
          <ProtectedRoute allowedRoles={["FORMATEUR"]}>
            <TrainerLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <TrainerDashboard /> },
          { path: "spaces", element: <MySpaces /> },
          { path: "works", element: <WorksList /> },
          { path: "works/create", element: <CreateWork /> },
          { path: "works/edit/:id", element: <EditWork /> },
          { path: "groups", element: <GroupsList /> },
          { path: "groups/create", element: <CreateGroup /> },
          { path: "assignments", element: <AssignmentsList /> },
          { path: "submissions", element: <SubmissionsList /> },
          { path: "submissions/evaluate/:id", element: <EvaluateWork /> },
          { path: "assignments/individual", element: <AssignIndividual /> },
          { path: "assignments/group", element: <AssignGroup /> },
          // Dans la section des routes Formateur
          { path: "trainer/spaces/:id", element: <SpaceDetails /> },
        ],
      },

      {
        path: "/student",
        element: (
          <ProtectedRoute allowedRoles={["ETUDIANT"]}>
            <StudentLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <StudentDashboard /> },
          { path: "spaces", element: <StudentSpaces /> },
          { path: "works", element: <MyWorks /> },
          { path: "submit/:id", element: <SubmitWork /> },
          { path: "grades", element: <MyGrades /> },
          { path: "grades/history", element: <GradesHistory /> },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
