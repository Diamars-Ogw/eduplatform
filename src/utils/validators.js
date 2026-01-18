// ============================================
// VALIDATEURS AVEC ZOD
// ============================================

import { z } from 'zod';

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

/**
 * Schéma de validation pour la création d'utilisateur
 */
export const createUserSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  role: z.enum(['DIRECTEUR', 'FORMATEUR', 'ETUDIANT', 'TECHNICIEN']),
  matricule: z.string().optional(),
  telephone: z.string().optional(),
  promotion_id: z.number().optional(),
  specialite: z.string().optional(),
  grade: z.string().optional(),
});

/**
 * Schéma de validation pour la création de promotion
 */
export const createPromotionSchema = z.object({
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  code: z.string().min(2, 'Le code est requis'),
  annee_academique: z.number().min(2020, 'Année invalide'),
  niveau_etudes: z.string().optional(),
  date_debut: z.string().min(1, 'La date de début est requise'),
  date_fin: z.string().min(1, 'La date de fin est requise'),
  capacite_max: z.number().positive('La capacité doit être positive').optional(),
  description: z.string().optional(),
});

/**
 * Schéma de validation pour la création d'espace pédagogique
 */
export const createSpaceSchema = z.object({
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  promotion_id: z.number().positive('Sélectionnez une promotion'),
  matiere_id: z.number().positive('Sélectionnez une matière'),
  formateur_id: z.number().positive('Sélectionnez un formateur'),
  description: z.string().optional(),
  semestre: z.enum([1, 2]),
  volume_horaire_total: z.number().positive().optional(),
  date_debut: z.string().optional(),
  date_fin: z.string().optional(),
});

/**
 * Schéma de validation pour la création de travail
 */
export const createWorkSchema = z.object({
  espace_pedagogique_id: z.number().positive('Sélectionnez un espace'),
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  consignes: z.string().min(10, 'Les consignes doivent être détaillées'),
  type_travail: z.enum(['INDIVIDUEL', 'COLLECTIF']),
  mode_groupe: z.enum(['FORMATEUR', 'ETUDIANT', 'NON_APPLICABLE']),
  date_debut: z.string().min(1, 'La date de début est requise'),
  date_fin: z.string().min(1, 'La date de fin est requise'),
  fichier_consigne_url: z.string().optional(),
});

/**
 * Schéma de validation pour l'évaluation
 */
export const evaluationSchema = z.object({
  note: z
    .number()
    .min(0, 'La note doit être entre 0 et 20')
    .max(20, 'La note doit être entre 0 et 20'),
  commentaire: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères'),
});