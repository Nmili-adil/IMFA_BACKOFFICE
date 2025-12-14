# 🚀 Quick Start Guide - IMFA Backoffice

## Prerequisites
- Node.js installed (v18 or higher recommended)
- Supabase account (free tier is fine)

## Step-by-Step Setup

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and create

### 3. Get Your Supabase Credentials
1. In your Supabase project dashboard
2. Go to Settings → API
3. Copy your:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")

### 4. Configure Environment Variables
1. Rename `.env.local` or create it if it doesn't exist
2. Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Create Your First Admin User

#### Method 1: Via Supabase Dashboard (Easiest)
1. In Supabase dashboard → Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Click on the user to edit
5. Scroll to "User Metadata"
6. Click "Edit" and add:
```json
{
  "role": "super-admin",
  "full_name": "Your Name"
}
```
7. Save

#### Method 2: Via SQL Editor
1. In Supabase dashboard → SQL Editor
2. Run this query (replace with your email):
```sql
-- First, create the user via Dashboard, then run this:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
  'role', 'super-admin',
  'full_name', 'Admin User'
)
WHERE email = 'your-email@example.com';
```

### 6. Start Development Server
```bash
npm run dev
```

### 7. Test Login
1. Open [http://localhost:5173/login](http://localhost:5173/login)
2. Log in with your admin credentials
3. You should be redirected to the dashboard

## 🎯 Role Types

Create users with one of these roles:
- `super-admin` - Full access to everything
- `manager` - Management level access
- `admin` - Standard admin access

**Important:** Only these three roles can access the backoffice!

## 🔧 Useful Commands

### Development
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Supabase CLI Helper
```bash
./supabase-cli.sh  # Interactive CLI helper
```

Or use npx directly:
```bash
npx supabase --version           # Check CLI version
npx supabase init                # Initialize local project
npx supabase start               # Start local Supabase
npx supabase status              # Check status
```

## 📂 Project Structure

```
src/
├── app/                    # App entry and layout
├── components/             
│   ├── shared/            # Shared components (ProtectedRoute, RoleGuard)
│   └── ui/                # UI components
├── context/               # Auth context
│   └── AuthContext.tsx
├── lib/                   # Utilities and configs
│   ├── supabase.ts       # Supabase client
│   └── queryClient.ts    # React Query config
├── pages/                 # Page components
│   ├── loginPage.tsx
│   └── dashboardPage.tsx
├── router/                # Routing configuration
├── services/              # API services
│   └── api.ts            # React Query hooks
├── store/                 # State management
│   └── authStore.ts      # Zustand auth store
└── types/                 # TypeScript types
```

## 🛡️ Security Features

✅ Role-based access control (RBAC)  
✅ Automatic session management  
✅ Protected routes  
✅ Persistent auth state  
✅ Admin-only access enforcement  

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists in the root directory
- Verify variable names start with `VITE_`
- Restart dev server after adding env variables

### "Access denied" after login
- Verify user has `role` in their metadata
- Role must be one of: `admin`, `manager`, `super-admin`
- Check role spelling exactly matches

### Cannot log in
- Verify Supabase credentials are correct
- Check Supabase project is active (not paused)
- Try resetting password in Supabase dashboard

### Redirected to login immediately
- Clear browser localStorage
- Check browser console for errors
- Verify session is being stored

## 📚 Learn More

- **Full Setup Guide:** See `AUTH_SETUP.md`
- **Summary:** See `SETUP_SUMMARY.md`
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **React Query Docs:** [https://tanstack.com/query](https://tanstack.com/query)
- **Zustand Docs:** [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/)

## 🎉 You're Ready!

Your backoffice is now configured with:
- ✅ Authentication system
- ✅ Role-based access control  
- ✅ Protected routes
- ✅ State management
- ✅ Server state with React Query

Start building your admin features! 🚀

---

**Need help?** Check the other documentation files or the inline code comments.
