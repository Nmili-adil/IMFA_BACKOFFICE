# Authentication Setup Guide

## Overview
This backoffice application is configured with role-based access control (RBAC) using Supabase, Zustand, and React Query. Only users with **admin**, **manager**, or **super-admin** roles can access the system.

## Technologies Used
- **Supabase**: Authentication and backend services
- **Zustand**: State management for auth state
- **React Query**: Server state management and data fetching
- **React Router**: Route protection and navigation

## Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase CLI Installation

### Linux (via NPM alternative - npx)
```bash
# Use npx to run Supabase commands without global installation
npx supabase --version
```

### Or install via package manager (recommended)
```bash
# Using Homebrew (Linux)
brew install supabase/tap/supabase

# Or using direct download
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

## Supabase Setup

### 1. Initialize Supabase Project (Optional - for local development)
```bash
npx supabase init
npx supabase start
```

### 2. Database Setup

Create a user metadata structure in your Supabase project to store roles:

```sql
-- In Supabase SQL Editor, add this to your user metadata
-- Users will have a structure like:
{
  "role": "admin", -- or "manager" or "super-admin"
  "full_name": "John Doe",
  "department": "IT"
}
```

### 3. Set User Roles

You can set user roles via Supabase Dashboard or using SQL:

```sql
-- Update user metadata with role
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'user@example.com';
```

### 4. Create Admin Users

Using Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password
4. In User Metadata, add:
```json
{
  "role": "admin",
  "full_name": "Admin User"
}
```

## Role Hierarchy

- **super-admin**: Full system access (highest privilege)
- **manager**: Management level access
- **admin**: Administrative access

All three roles can access the backoffice, but you can implement different permissions for each role in your components.

## Usage

### Protecting Routes

All routes inside the protected area are automatically secured:

```tsx
// In router.tsx - already configured
{
  element: (
    <AuthProvider>
      <ProtectedRoute />
    </AuthProvider>
  ),
  children: [
    {
      path: "/",
      element: <Layout />,
      children: [
        // Your protected routes here
      ],
    },
  ],
}
```

### Using Auth in Components

```tsx
import { useAuth } from "@/context/AuthContext";
import { useAuthStore } from "@/store/authStore";

function MyComponent() {
  // Using auth context
  const { signOut, hasAdminAccess, isSuperAdmin } = useAuth();
  
  // Using auth store
  const { user, role, isAuthenticated } = useAuthStore();
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <p>Role: {role}</p>
      {isSuperAdmin() && <button>Super Admin Only Feature</button>}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Restricting Access by Specific Roles

```tsx
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// Only allow super-admin
<ProtectedRoute allowedRoles={['super-admin']}>
  <SuperAdminComponent />
</ProtectedRoute>

// Allow manager and super-admin only
<ProtectedRoute allowedRoles={['manager', 'super-admin']}>
  <ManagerComponent />
</ProtectedRoute>
```

### Using React Query for Data Fetching

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

function DataComponent() {
  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Mutate data
  const mutation = useMutation({
    mutationFn: async (newItem) => {
      const { data, error } = await supabase
        .from('items')
        .insert(newItem);
      
      if (error) throw error;
      return data;
    },
  });

  return <div>{/* Your component */}</div>;
}
```

## Files Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Auth context with sign in/out functions
├── store/
│   └── authStore.ts             # Zustand store for auth state
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── queryClient.ts           # React Query configuration
├── components/
│   └── shared/
│       └── ProtectedRoute.tsx   # Route protection component
└── router/
    └── router.tsx               # Router with protected routes
```

## Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Try to access the app without logging in - you should be redirected to login

3. Try logging in with a user that doesn't have admin/manager/super-admin role - access should be denied

4. Log in with a user that has one of the allowed roles - you should gain access

## Security Notes

- User roles are stored in Supabase user metadata
- Authentication state persists in localStorage via Zustand
- All protected routes check for valid session AND admin role
- Sessions are automatically refreshed by Supabase client
- Unauthorized users are immediately signed out and redirected

## Development Tools

- **React Query Devtools**: Available in development mode (bottom-left corner)
- Check auth state in Redux DevTools or browser localStorage (key: `auth-storage`)

## Troubleshooting

### "Access Denied" after login
- Check that the user has the correct role in their metadata
- Verify the role is one of: 'admin', 'manager', or 'super-admin'

### Infinite redirect loop
- Clear localStorage and cookies
- Check that environment variables are correctly set

### Supabase errors
- Verify `.env.local` file exists and contains correct credentials
- Check that Supabase project is active and accessible
