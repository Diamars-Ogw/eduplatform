/**
 * Composant Footer
 */
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>© 2025 EduPlatform - Tous droits réservés</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-purple-600 transition-colors">
            Aide
          </a>
          <a href="#" className="hover:text-purple-600 transition-colors">
            Confidentialité
          </a>
          <a href="#" className="hover:text-purple-600 transition-colors">
            Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
