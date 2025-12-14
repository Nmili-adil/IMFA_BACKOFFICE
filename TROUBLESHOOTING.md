# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: ENOSPC - File Watcher Limit Reached

**Error Message:**
```
Error: ENOSPC: System limit for number of file watchers reached
```

**Cause:** Linux has a default limit on the number of files that can be watched for changes. Large projects with many files can exceed this limit.

**Solutions:**

#### Solution 1: Increase System Limit (Recommended - Requires sudo)

**Temporary (until reboot):**
```bash
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p
```

**Permanent (survives reboot):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

After running either command, restart your dev server:
```bash
npm run dev
```

#### Solution 2: Optimize Vite Config (No sudo needed - Already Applied ✅)

The `vite.config.ts` has been updated to reduce file watcher usage by ignoring `node_modules` and `.git` directories.

Try running the dev server again:
```bash
npm run dev
```

#### Solution 3: Close Other Applications

If you have other dev servers or IDEs running, close them to free up file watchers:
- Close other VS Code windows
- Stop other running npm/yarn processes
- Close heavy applications

#### Solution 4: Check Current Limit

To see your current limit:
```bash
cat /proc/sys/fs/inotify/max_user_watches
```

The default is usually 8192 or 65536. We recommend 524288 for development.

---

### ❌ Environment Variables Not Loading

**Symptoms:**
- "Missing Supabase environment variables" error
- Login doesn't work

**Solutions:**

1. **Check file name:** Must be `.env.local` (not `.env` or `env.local`)
2. **Check variable prefix:** Must start with `VITE_`
3. **Restart dev server** after changing env variables
4. **Verify content:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

### ❌ "Access Denied" After Login

**Symptoms:**
- Can log in but immediately see access denied message
- User has valid credentials

**Solutions:**

1. **Check user role in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click on the user
   - Check "User Metadata" section
   - Must have: `{"role": "admin"}` or `{"role": "manager"}` or `{"role": "super-admin"}`

2. **Update user role via SQL:**
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"super-admin"'
   )
   WHERE email = 'your-email@example.com';
   ```

3. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Application → Local Storage → Clear All
   - Try logging in again

---

### ❌ Infinite Redirect Loop

**Symptoms:**
- Stuck between login and dashboard
- Console shows repeated navigation

**Solutions:**

1. **Clear auth state:**
   ```javascript
   // In browser console (F12):
   localStorage.clear()
   location.reload()
   ```

2. **Check Supabase project status:**
   - Ensure project isn't paused (free tier pauses after inactivity)
   - Check Supabase dashboard for errors

3. **Verify environment variables are correct**

---

### ❌ TypeScript Errors

**Error:** `Cannot find module '@/...'`

**Solution:**
Restart TypeScript server in VS Code:
1. Ctrl+Shift+P (or Cmd+Shift+P on Mac)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

---

### ❌ Build Errors

**Error during `npm run build`:**

**Solutions:**

1. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Update dependencies:**
   ```bash
   npm update
   ```

---

### ❌ Supabase Connection Issues

**Symptoms:**
- Login button doesn't respond
- Network errors in console

**Solutions:**

1. **Check Supabase project is active:**
   - Log into Supabase dashboard
   - Free tier projects pause after 1 week of inactivity
   - Click "Restore" if paused

2. **Verify credentials:**
   - Double-check URL and key in `.env.local`
   - Ensure no extra spaces or quotes

3. **Check network:**
   - Open browser DevTools → Network tab
   - Try logging in
   - Look for failed requests to Supabase

4. **Test Supabase connection:**
   ```javascript
   // In browser console:
   import { supabase } from './src/lib/supabase'
   const { data, error } = await supabase.auth.getSession()
   console.log({ data, error })
   ```

---

### ❌ React Query Issues

**Symptoms:**
- Data not loading
- Infinite loading states

**Solutions:**

1. **Open React Query DevTools:**
   - Look for floating icon in bottom-left corner in dev mode
   - Check query status and errors

2. **Clear query cache:**
   ```javascript
   // In a component or browser console:
   import { queryClient } from '@/lib/queryClient'
   queryClient.clear()
   ```

3. **Check query key consistency:**
   - Ensure query keys match between hooks
   - Use constants from `src/constants/appConstants.ts`

---

## Getting Help

1. **Check Documentation:**
   - `QUICK_START.md` - Setup guide
   - `AUTH_SETUP.md` - Authentication details
   - `SETUP_SUMMARY.md` - Configuration overview

2. **Enable Verbose Logging:**
   Add to your component:
   ```typescript
   console.log('Auth State:', useAuthStore.getState())
   ```

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed requests

4. **Verify Package Versions:**
   ```bash
   npm list @supabase/supabase-js zustand @tanstack/react-query
   ```

---

## System Requirements

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Operating System:** Linux, macOS, or Windows
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)
- **File Watchers:** At least 524288 (Linux only)

---

## Quick Health Check

Run these commands to verify your setup:

```bash
# Check Node version
node --version  # Should be v18+

# Check npm version
npm --version   # Should be v9+

# Check if dependencies are installed
npm list --depth=0

# Try to build
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

All commands should complete without errors.
