# Custom Authentication Setup

This document describes the custom authentication implementation using direct database queries instead of Supabase Auth.

## Database Schema

### Users Table
```sql
code_pin (PRIMARY KEY) - Used as user identifier and temporary password
rfid - RFID card identifier
nomEmp - Employee name
dateNaissanceEmp - Birth date
adressEmp - Address
mobileEmp - Mobile phone
emailEmp - Email address
image - Profile image
role_id (FOREIGN KEY) - References roles.id
```

### Roles Table
```sql
id (PRIMARY KEY)
created_at
name - Role name (admin, manager, super-admin)
```

## Authentication Flow

### 1. Login Process
- User enters email (`emailEmp`) and password
- System queries `users` table joining with `roles` table
- **TEMPORARY**: Password is validated against `code_pin` field
- System checks if role name is one of: 'admin', 'manager', 'super-admin' (case-insensitive)
- If valid, user object is stored in Zustand store with localStorage persistence

### 2. Session Management
- No server-side sessions (not using Supabase Auth)
- Auth state persisted in localStorage via Zustand persist middleware
- Key: `auth-storage`
- Contains: user object and roleName

### 3. Protected Routes
- `ProtectedRoute` component checks `isAuthenticated` from authStore
- Validates user has admin access using `hasAdminAccess(roleName)` helper
- Can specify allowed roles per route (e.g., super-admin only)

## Key Files

### `/src/lib/supabase.ts`
- Defines custom `User` and `Role` interfaces
- Provides role validation helpers:
  - `hasAdminAccess(roleName)` - Checks for admin/manager/super-admin
  - `isSuperAdmin(roleName)` - Checks for super-admin only
  - `isManager(roleName)` - Checks for manager only
  - `isAdmin(roleName)` - Checks for admin only

### `/src/services/authService.ts`
- `loginUser(email, password)` - Authenticates user against database
- `getUserByEmail(email)` - Retrieves user by emailEmp
- `getUserByCodePin(codePin)` - Retrieves user by code_pin

### `/src/store/authStore.ts`
- Zustand store with persist middleware
- State:
  - `user: User | null`
  - `roleName: string | null`
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
- Actions:
  - `setAuth(user)` - Stores user and extracts roleName
  - `clearAuth()` - Clears authentication state
  - `setLoading(isLoading)` - Sets loading state

### `/src/context/AuthContext.tsx`
- React context providing auth functions:
  - `signIn(email, password)` - Calls authService.loginUser()
  - `signOut()` - Calls authStore.clearAuth()
  - `hasAdminAccess()` - Checks admin access
  - `isSuperAdmin()` - Checks super-admin role
  - `isManager()` - Checks manager role
  - `isAdmin()` - Checks admin role

### `/src/components/shared/ProtectedRoute.tsx`
- Guards routes requiring authentication
- Validates admin access
- Supports role-based restrictions

### `/src/components/shared/RoleGuard.tsx`
- Component for conditional rendering based on role
- Hooks: `useHasRole`, `useHasAnyRole`

## Security Warnings ⚠️

### CRITICAL - Password Security
**CURRENT IMPLEMENTATION IS TEMPORARY AND INSECURE**

The system currently uses `code_pin` as the password field. This means:
- Passwords are stored in plain text
- No password hashing
- No secure password validation

### Required Security Improvements

1. **Add Password Column**
   ```sql
   ALTER TABLE users ADD COLUMN password_hash TEXT;
   ```

2. **Implement Password Hashing**
   - Use bcrypt or argon2 for password hashing
   - Hash passwords before storing in database
   - Compare hashed passwords during login

3. **Update authService.ts**
   ```typescript
   import bcrypt from 'bcryptjs';
   
   // During login
   const isValidPassword = await bcrypt.compare(password, user.password_hash);
   ```

4. **Password Reset Flow**
   - Implement secure password reset mechanism
   - Send reset tokens via email
   - Validate tokens before allowing password change

5. **Session Security**
   - Consider implementing JWT tokens
   - Add token expiration
   - Implement refresh token mechanism
   - Add CSRF protection

6. **Rate Limiting**
   - Implement login attempt rate limiting
   - Add account lockout after failed attempts
   - Log failed login attempts

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Examples

### Login
```typescript
const { signIn } = useAuth();
const { error } = await signIn('user@example.com', 'password');
```

### Check Role
```typescript
const { isSuperAdmin } = useAuth();
if (isSuperAdmin()) {
  // Super admin only feature
}
```

### Protected Component
```tsx
<RoleGuard allowedRoles={['super-admin', 'manager']}>
  <ManagerFeature />
</RoleGuard>
```

### Get Current User
```typescript
const { user, roleName } = useAuthStore();
console.log(`User: ${user?.nomEmp}, Role: ${roleName}`);
```

## Migration from Supabase Auth

This implementation was migrated from Supabase Auth to custom database authentication:

**Changed:**
- No longer using `supabase.auth.signInWithPassword()`
- No longer using `supabase.auth.onAuthStateChange()`
- No session management via Supabase Auth
- User type changed from Supabase User to custom User interface
- Role type changed from UserRole enum to string

**Kept:**
- Supabase client for database queries
- React Query for server state management
- Zustand for client state management
- Protected routes and role guards

## Testing

Test different scenarios:
1. Login with admin, manager, super-admin roles
2. Login with non-admin role (should fail)
3. Login with invalid credentials
4. Session persistence (refresh page)
5. Protected route access
6. Role-based component rendering
7. Logout functionality

## TODO

- [ ] Implement proper password hashing (bcrypt/argon2)
- [ ] Add password_hash column to users table
- [ ] Implement password reset functionality
- [ ] Add JWT token-based authentication
- [ ] Implement rate limiting for login attempts
- [ ] Add account lockout mechanism
- [ ] Implement CSRF protection
- [ ] Add audit logging for auth events
- [ ] Consider adding 2FA/MFA support
- [ ] Add session timeout/expiration
