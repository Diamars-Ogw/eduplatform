import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { classNames } from '@/utils/helpers';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const directorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/director/dashboard' },
    { icon: Users, label: 'Utilisateurs', path: '/director/users' },
    { icon: GraduationCap, label: 'Promotions', path: '/director/promotions' },
    { icon: BookOpen, label: 'Espaces Péd.', path: '/director/spaces' },
    { icon: FileText, label: 'Comptes Inactifs', path: '/director/inactive-accounts' },
    { icon: BarChart3, label: 'Rapports', path: '/director/reports' },
  ];

  const trainerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/trainer/dashboard' },
    { icon: BookOpen, label: 'Mes Espaces', path: '/trainer/spaces' },
    { icon: FileText, label: 'Mes Travaux', path: '/trainer/works' },
    { icon: Users, label: 'Groupes', path: '/trainer/groups' },
    { icon: BarChart3, label: 'Évaluations', path: '/trainer/evaluations' },
  ];

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'Mes Cours', path: '/student/spaces' },
    { icon: FileText, label: 'Mes Travaux', path: '/student/works' },
    { icon: BarChart3, label: 'Mes Notes', path: '/student/grades' },
  ];

  const menuItems = {
    DIRECTEUR: directorMenuItems,
    FORMATEUR: trainerMenuItems,
    ETUDIANT: studentMenuItems,
  };

  const currentMenuItems = menuItems[user?.role] || [];
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={classNames(
          'fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200',
          'transform transition-transform duration-300 ease-in-out z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <GraduationCap className="w-8 h-8 text-purple-600" />
          <span className="ml-2 text-xl font-bold text-purple-600">EduPlatform</span>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
              {user?.nom?.charAt(0)}{user?.prenom?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.nom} {user?.prenom}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {currentMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={classNames(
                'flex items-center px-4 py-3 rounded-lg transition-all',
                isActive(item.path)
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;