// ============================================
// CONSTANTES GLOBALES DE L'APPLICATION
// ============================================

// Rôles des utilisateurs
export const ROLES = {
  DIRECTEUR: 'DIRECTEUR',
  FORMATEUR: 'FORMATEUR',
  ETUDIANT: 'ETUDIANT',
  TECHNICIEN: 'TECHNICIEN',
};

// Niveaux d'études
export const NIVEAUX_ETUDES = [
  { value: 'L1', label: 'Licence 1' },
  { value: 'L2', label: 'Licence 2' },
  { value: 'L3', label: 'Licence 3' },
  { value: 'M1', label: 'Master 1' },
  { value: 'M2', label: 'Master 2' },
];

// Grades des formateurs
export const GRADES_FORMATEUR = [
  { value: 'M.', label: 'M.' },
  { value: 'Mme', label: 'Mme' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Prof. Dr.', label: 'Prof. Dr.' },
];

// Genres
export const GENRES = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
  { value: 'Autre', label: 'Autre' },
];

// Semestres
export const SEMESTRES = [
  { value: 1, label: 'Semestre 1' },
  { value: 2, label: 'Semestre 2' },
];

// Types de travail
export const TYPES_TRAVAIL = {
  INDIVIDUEL: 'INDIVIDUEL',
  COLLECTIF: 'COLLECTIF',
};

// Modes de formation de groupes
export const MODES_GROUPE = {
  FORMATEUR: 'FORMATEUR',
  ETUDIANT: 'ETUDIANT',
  NON_APPLICABLE: 'NON_APPLICABLE',
};

// Statuts de livraison
export const STATUTS_LIVRAISON = {
  EN_COURS: 'EN_COURS',
  LIVRE: 'LIVRE',
  EN_RETARD: 'EN_RETARD',
};

// Configuration pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Taille max fichiers (50 MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Formats de fichiers acceptés
export const ACCEPTED_FILE_TYPES = {
  documents: '.pdf,.doc,.docx,.txt,.zip',
  images: '.jpg,.jpeg,.png,.gif',
  all: '.pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png,.gif',
};

// Types de toast
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// URL de l'API backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Clés localStorage
export const STORAGE_KEYS = {
  TOKEN: 'eduplatform_token',
  USER: 'eduplatform_user',
  THEME: 'eduplatform_theme',
};

// Couleurs pour les graphiques
export const CHART_COLORS = {
  primary: '#ff5c1a',
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
  pink: '#ec4899',
};

// Comptes de démonstration (affichés sur la page de login)
export const DEMO_ACCOUNTS = [
  {
    email: 'director@academie.fr',
    role: 'Directeur',
    color: 'blue',
  },
  {
    email: 'teacher@academie.fr',
    role: 'Formateur',
    color: 'pink',
  },
  {
    email: 'student@academie.fr',
    role: 'Étudiant',
    color: 'purple',
  },
];