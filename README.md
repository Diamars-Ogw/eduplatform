# 🎨 EduPlatform Frontend

Application React pour l'interface utilisateur d'EduPlatform.

## 🛠️ Stack Technique

- **React 18** avec Hooks
- **Vite** comme bundler
- **Tailwind CSS** pour le styling
- **React Router v6** pour la navigation
- **Axios** pour les appels API
- **Lucide React** pour les icônes

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
```

## ⚙️ Configuration

Modifier le fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=EduPlatform
VITE_MAX_FILE_SIZE=52428800
```

## 🚀 Commandes

```bash
# Démarrage en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

## 📁 Structure

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, Footer
│   └── ui/              # Button, Input, Card, etc.
├── pages/
│   ├── auth/            # Login, ForgotPassword
│   ├── director/        # Pages Directeur
│   ├── trainer/         # Pages Formateur
│   └── student/         # Pages Étudiant
├── services/            # Services API (axios)
├── context/             # Context React (Auth, Theme)
├── hooks/               # Custom hooks
├── utils/               # Helpers et utilitaires
└── routes/              # Configuration React Router
```

## 🎯 Composants UI

Tous les composants UI sont dans `src/components/ui/` :

- `Button.jsx` - Bouton avec variants
- `Input.jsx` - Champ de saisie
- `Select.jsx` - Menu déroulant
- `Card.jsx` - Carte conteneur
- `Modal.jsx` - Fenêtre modale
- `Badge.jsx` - Badges (US, DB, statuts)
- `Textarea.jsx` - Zone de texte

### Exemple d'utilisation

```jsx
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

<Button variant="primary" icon={Plus}>
  Créer
</Button>

<Input
  label="Email"
  type="email"
  required
  error={errors.email}
/>
```

## 🔌 Services API

Les services sont dans `src/services/` :

```javascript
// Exemple : user.service.js
import api from './api';

export const getAllUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
```

## 🎨 Styling

Utilisation de **Tailwind CSS** :

```jsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Titre</h1>
</div>
```

Classes personnalisées dans `src/assets/styles/globals.css`

## 🛣️ Routes

Configuration dans `src/routes/index.jsx` :

- `/login` - Connexion
- `/director/*` - Routes Directeur
- `/trainer/*` - Routes Formateur
- `/student/*` - Routes Étudiant

Protection des routes avec `ProtectedRoute.jsx`

## 🔐 Authentification

Gestion avec `AuthContext.jsx` :

```jsx
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout } = useAuth();
```

## 🌐 Variables d'environnement

- `VITE_API_URL` - URL de l'API backend
- `VITE_APP_NAME` - Nom de l'application
- `VITE_MAX_FILE_SIZE` - Taille max upload (bytes)

## 📝 Convention de nommage

- **Composants** : PascalCase (`UserCard.jsx`)
- **Fichiers utilitaires** : camelCase (`helpers.js`)
- **Constantes** : UPPER_SNAKE_CASE (`API_URL`)

## 🐛 Debugging

```bash
# Lancer avec logs détaillés
npm run dev -- --debug
```

## 📦 Build Production

```bash
# Build optimisé
npm run build

# Tester le build
npm run preview
```

Le build génère dans `dist/`

## ⚡ Performance

- Code splitting automatique par route
- Lazy loading des composants
- Optimisation Tailwind CSS (purge des classes inutilisées)
- Compression Vite automatique

## 🔧 Troubleshooting

**Problème : Port 5173 déjà utilisé**
```bash
# Changer le port dans vite.config.js
server: { port: 3001 }
```

**Problème : CORS**
```bash
# Vérifier VITE_API_URL dans .env
# Vérifier CORS_ORIGIN dans backend/.env
```

## 📚 Ressources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

**Note** : Toujours démarrer le backend avant le frontend !