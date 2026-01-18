// ============================================
// HOOK PERSONNALISÉ POUR LES APPELS API
// Gère le loading, les erreurs et les données
// ============================================

import { useState, useEffect, useCallback } from "react";

/**
 * Hook générique pour les appels API
 * @param {Function} apiFunction - Fonction de service à appeler
 * @param {Array} dependencies - Dépendances pour re-fetch
 * @returns {Object} - { data, loading, error, refetch }
 *
 * Exemple d'utilisation:
 * const { data: users, loading, error, refetch } = useApi(userService.getAll);
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      console.error("Erreur API:", err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  // Fonction pour refetch manuellement
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 * @returns {Object} - { mutate, loading, error, data }
 *
 * Exemple d'utilisation:
 * const { mutate: createUser, loading } = useMutation();
 * await createUser(() => userService.create(userData));
 */
export const useMutation = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (apiFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      console.error("Erreur mutation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
};
