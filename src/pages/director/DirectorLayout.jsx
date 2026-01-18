// ============================================
// LAYOUT DU DIRECTEUR
// Enveloppe toutes les pages du directeur avec Sidebar + Header
// ============================================

import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const DirectorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Contenu de la page (changé par React Router) */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DirectorLayout;