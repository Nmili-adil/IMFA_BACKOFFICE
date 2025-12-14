# Testing Authentication with Role ID

## Issue
User with `role_id = 1` gets "Access Denied" even though they should have admin access.

## What Was Fixed

1. **Changed the query approach**: Instead of using a join that returns null, we now:
   - Fetch user data first
   - Fetch role data separately using `role_id`
   - Combine them manually

2. **Added fallback logic**: If role data isn't found, we check the `role_id` directly:
   - `role_id` 1, 2, or 3 = allowed (adjust if needed)

3. **Added debug logging**: Console logs will show:
   - Role fetch result
   - Role name being checked
   - Why access was denied

## Database Setup Required

Run this SQL in your Supabase SQL Editor:

```sql
-- Check if roles table has data
SELECT * FROM roles;

-- If empty or missing admin roles, insert them:
INSERT INTO roles (id, name) VALUES 
  (1, 'admin'),
  (2, 'manager'),
  (3, 'super-admin')
ON CONFLICT (id) DO NOTHING;

-- Verify user role assignment
SELECT 
  u.code_pin,
  u.emailEmp,
  u.nomEmp,
  u.role_id,
  r.id as role_table_id,
  r.name as role_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.emailEmp = 'Maryem@email.com';
```

Expected output should show:
- role_id: 1
- role_table_id: 1
- role_name: "admin"

## Testing Steps

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12) to see debug logs

3. **Try to login** with:
   - Email: `Maryem@email.com`
   - Password: `332211` (the code_pin value)

4. **Check console logs** for:
   ```
   Role fetch result: { roleData: {...}, roleError: null, role_id: 1 }
   Checking role access: { roleName: 'admin', allowedRoles: [...] }
   ```

5. **If role data is null**, you'll see:
   ```
   Role fetch result: { roleData: null, roleError: null, role_id: 1 }
   No role data found, checking by role_id: { role_id: 1, allowedRoleIds: [1,2,3] }
   ```
   This means your roles table might be empty or missing id=1

## Possible Issues and Solutions

### Issue 1: Roles table is empty
**Solution**: Run the INSERT SQL above to populate roles table

### Issue 2: Role IDs don't match
If your roles table uses different IDs, update `authService.ts`:
```typescript
const allowedRoleIds = [1, 2, 3]; // Change these to your actual role IDs
```

### Issue 3: Role names are different
If your role names are different (e.g., "Admin" with capital A), they'll still work because we use `.toLowerCase()`

### Issue 4: Foreign key constraint
If `users.role_id` doesn't match any `roles.id`, the join will fail. Check:
```sql
SELECT u.emailEmp, u.role_id, r.id as role_exists
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.role_id IS NOT NULL;
```

## Quick Fix (Temporary)

If you need immediate access while debugging, you can temporarily allow any user by commenting out the role check in `authService.ts`:

```typescript
// Temporarily allow all users
// if (roleData) {
//   const roleName = roleData.name?.toLowerCase();
//   if (!roleName || !['admin', 'manager', 'super-admin'].includes(roleName)) {
//     return { user: null, error: new Error('Access denied...') };
//   }
// }
```

**⚠️ Don't forget to uncomment this for production!**

## Expected Behavior After Fix

1. Login with `Maryem@email.com` and password `332211`
2. Should see user object with role populated
3. Should redirect to dashboard
4. Dashboard should show:
   - Name: "Maryem"
   - Email: "Maryem@email.com"
   - Role: "ADMIN" (or whatever role_id 1 maps to)

## Next Steps

After confirming authentication works:
1. Check the console logs to see what role name is returned
2. Verify it matches one of: admin, manager, super-admin
3. If role names are different, update the allowed roles array
4. Remove debug console.logs before production
