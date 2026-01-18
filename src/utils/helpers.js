// ============================================
// FONCTIONS UTILITAIRES
// ============================================

import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date au format français (ex: 25/12/2024)
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr, { locale: fr });
  } catch (error) {
    return '';
  }
};

/**
 * Formate une date avec l'heure (ex: 25/12/2024 14:30)
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
  } catch (error) {
    return '';
  }
};

/**
 * Retourne le temps relatif (ex: "il y a 2 jours")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  } catch (error) {
    return '';
  }
};

/**
 * Vérifie si une date est passée
 */
export const isPastDate = (date) => {
  try {
    return isBefore(new Date(date), new Date());
  } catch (error) {
    return false;
  }
};

/**
 * Vérifie si une date est future
 */
export const isFutureDate = (date) => {
  try {
    return isAfter(new Date(date), new Date());
  } catch (error) {
    return false;
  }
};

/**
 * Calcule le nombre de jours restants jusqu'à une date
 */
export const getDaysRemaining = (date) => {
  try {
    return differenceInDays(new Date(date), new Date());
  } catch (error) {
    return 0;
  }
};

/**
 * Formate un nombre avec des décimales
 */
export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toFixed(decimals);
};

/**
 * Formate une note sur 20 (ex: 15.50/20)
 */
export const formatGrade = (grade) => {
  if (grade === null || grade === undefined) return '-';
  return `${formatNumber(grade, 2)}/20`;
};

/**
 * Calcule un pourcentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Tronque un texte avec des points de suspension
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Génère des initiales à partir d'un nom et prénom
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return 'U';
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Génère une couleur d'avatar basée sur un ID
 */
export const getAvatarColor = (id) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];
  return colors[id % colors.length];
};

/**
 * Formate la taille d'un fichier (ex: 2.5 MB)
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Valide un email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Génère un mot de passe temporaire aléatoire
 */
export const generateTempPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

/**
 * Retourne la classe CSS du badge selon le statut
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    ACTIF: 'badge-success',
    INACTIF: 'badge-danger',
    EN_COURS: 'badge-info',
    TERMINE: 'badge-success',
    EN_RETARD: 'badge-danger',
    A_CORRIGER: 'badge-warning',
    CORRIGE: 'badge-success',
  };
  return statusMap[status] || 'badge-info';
};

/**
 * Retourne le label français d'un statut
 */
export const getStatusLabel = (status) => {
  const statusMap = {
    ACTIF: 'Actif',
    INACTIF: 'Inactif',
    EN_COURS: 'En cours',
    TERMINE: 'Terminé',
    EN_RETARD: 'En retard',
    A_CORRIGER: 'À corriger',
    CORRIGE: 'Corrigé',
    LIVRE: 'Livré',
  };
  return statusMap[status] || status;
};

/**
 * Debounce une fonction (utile pour les recherches)
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Combine des classes CSS conditionnellement
 * Utilise la librairie clsx
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Télécharge un fichier
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copie du texte dans le presse-papier
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur copie presse-papier:', err);
    return false;
  }
};