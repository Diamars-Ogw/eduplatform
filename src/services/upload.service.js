/**
 * Service pour gérer l'upload de fichiers
 * Note: Pour une vraie production, intégrer avec un service cloud (AWS S3, Cloudinary, etc.)
 */

export const uploadService = {
  /**
   * Convertir un fichier en base64
   * Utile pour stocker temporairement ou prévisualiser
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Valider un fichier avant upload
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB par défaut
      allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/zip",
      ],
    } = options;

    const errors = [];

    if (file.size > maxSize) {
      errors.push(
        `Le fichier est trop volumineux (max: ${maxSize / 1024 / 1024}MB)`,
      );
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(
        `Type de fichier non autorisé (autorisés: ${allowedTypes.join(", ")})`,
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  },

  /**
   * Upload un fichier (simulation - à adapter selon votre backend)
   * Pour production: uploader vers un service cloud puis retourner l'URL
   */
  async uploadFile(file, progressCallback) {
    // Valider le fichier
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.errors.join(", "));
    }

    // Simulation d'upload avec progression
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progressCallback) {
          progressCallback(progress);
        }

        if (progress >= 100) {
          clearInterval(interval);

          // En production, retourner l'URL réelle du fichier uploadé
          // Pour l'instant, on stocke en base64 (pas recommandé en prod)
          this.fileToBase64(file)
            .then((base64) =>
              resolve({
                url: base64, // En prod: URL du fichier sur le serveur/cloud
                name: file.name,
                size: file.size,
                type: file.type,
              }),
            )
            .catch(reject);
        }
      }, 200);
    });
  },

  /**
   * Upload multiple fichiers
   */
  async uploadMultiple(files, progressCallback) {
    const uploads = [];
    let totalProgress = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const result = await this.uploadFile(file, (progress) => {
        if (progressCallback) {
          const fileProgress = progress / files.length;
          const currentProgress = (i / files.length) * 100 + fileProgress;
          progressCallback(Math.round(currentProgress));
        }
      });

      uploads.push(result);
    }

    return uploads;
  },

  /**
   * Télécharger un fichier depuis une URL
   */
  downloadFile(url, filename) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Prévisualiser un fichier image
   */
  async previewImage(file) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Le fichier doit être une image");
    }
    return this.fileToBase64(file);
  },
};
