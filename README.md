# IMFA Backoffice

A secure, role-based admin backoffice application built with React, TypeScript, Vite, Supabase, Zustand, and React Query.

## 🔐 Security Features

- **Role-Based Access Control (RBAC)**: Only users with `admin`, `manager`, or `super-admin` roles can access the system
- **Supabase Authentication**: Secure authentication with automatic session management
- **Protected Routes**: All routes are protected and require authentication
- **Persistent Sessions**: Auth state persists across browser refreshes

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step setup instructions.

### Prerequisites
- Node.js v18+
- Supabase account (free tier works)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   # Create .env.local and add:
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create admin user in Supabase**
   - Add user in Supabase Dashboard → Authentication → Users
   - Set user metadata: `{"role": "super-admin"}`

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Complete authentication documentation
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Overview of configuration
- **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** - Docker deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Authentication**: Supabase
- **State Management**: Zustand (auth state)
- **Server State**: TanStack React Query
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## 📦 Project Structure

```
src/
├── app/                    # App entry and layout
├── components/             
│   ├── shared/            # Reusable components
│   └── ui/                # UI library components
├── context/               # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                   # Core utilities
│   ├── supabase.ts       # Supabase client
│   └── queryClient.ts    # React Query config
├── pages/                 # Page components
├── router/                # Route definitions
├── services/              # API service hooks
├── store/                 # Zustand stores
│   └── authStore.ts      # Auth state store
└── types/                 # TypeScript definitions
```

## 🎯 User Roles

- **super-admin**: Full system access
- **manager**: Management level access
- **admin**: Standard administrative access

Only these roles can access the backoffice.

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Using Docker Compose (recommended)
docker-compose up -d --build

# Using Docker CLI
docker build -t imfa-backoffice:latest .
docker run -d -p 3000:80 --name imfa-backoffice imfa-backoffice:latest
```

The app will be available at http://localhost:3000

See **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** for detailed Docker instructions.

## 🛡️ Authentication Usage

### Protect Routes
```tsx
<ProtectedRoute allowedRoles={['super-admin']}>
  <SuperAdminPage />
</ProtectedRoute>
```

### Conditional Rendering by Role
```tsx
<RoleGuard allowedRoles={['manager', 'super-admin']}>
  <ManagerFeature />
</RoleGuard>
```

### Use Auth in Components
```tsx
import { useAuth } from '@/context/AuthContext';
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { signOut, isSuperAdmin } = useAuth();
  const { user, role } = useAuthStore();
  
  // Your component logic
}
```

## 📊 React Query Example

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const { data, isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: async () => {
    const { data, error } = await supabase.from('items').select('*');
    if (error) throw error;
    return data;
  },
});
```

## 🐛 Troubleshooting

**Access Denied Error**
- Verify user has correct role in Supabase user metadata
- Role must be exactly: `admin`, `manager`, or `super-admin`

**Environment Variables Not Loading**
- Ensure file is named `.env.local` (not `.env`)
- Variable names must start with `VITE_`
- Restart dev server after changes

**Session Issues**
- Clear browser localStorage
- Check Supabase project is active
- Verify credentials in `.env.local`

## 📄 License

MIT

---

## Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
