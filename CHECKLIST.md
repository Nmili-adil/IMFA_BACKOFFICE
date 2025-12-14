# ✅ Setup Checklist

Use this checklist to ensure your IMFA Backoffice is properly configured.

## Prerequisites
- [ ] Node.js v18+ installed
- [ ] npm or yarn available
- [ ] Git installed (optional, for version control)
- [ ] Supabase account created

## Installation
- [x] Dependencies installed (`npm install`) ✅
- [x] Supabase client configured ✅
- [x] Zustand state management setup ✅
- [x] React Query configured ✅
- [x] Auth context created ✅
- [x] Protected routes implemented ✅

## Supabase Configuration
- [ ] Created Supabase project
- [ ] Got Project URL from Supabase dashboard
- [ ] Got Anon/Public Key from Supabase dashboard
- [ ] Created `.env.local` file
- [ ] Added `VITE_SUPABASE_URL` to `.env.local`
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env.local`

## User Setup
- [ ] Created at least one admin user in Supabase
- [ ] Set user role in user metadata (super-admin, manager, or admin)
- [ ] Verified user metadata format: `{"role": "super-admin"}`
- [ ] Tested login with admin credentials

## Testing
- [ ] Started development server (`npm run dev`)
- [ ] Accessed login page successfully
- [ ] Tried accessing protected route without login (should redirect)
- [ ] Logged in with admin user successfully
- [ ] Verified dashboard loads correctly
- [ ] Checked user info displays properly
- [ ] Tested logout functionality
- [ ] Verified role-specific content displays correctly

## Optional - Advanced Setup
- [ ] Installed Supabase CLI (via `brew` or direct download)
- [ ] Initialized local Supabase project (`npx supabase init`)
- [ ] Created database tables (if needed)
- [ ] Generated TypeScript types from database schema
- [ ] Set up database migrations
- [ ] Configured Row Level Security (RLS) policies

## Code Quality
- [ ] No TypeScript errors (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All environment variables properly configured
- [ ] Git repository initialized (if using version control)
- [ ] Added `.env.local` to `.gitignore` (already done ✅)

## Documentation Review
- [ ] Read `QUICK_START.md`
- [ ] Reviewed `AUTH_SETUP.md`
- [ ] Checked `SETUP_SUMMARY.md`
- [ ] Understood role-based access control
- [ ] Familiar with React Query usage
- [ ] Comfortable with Zustand state management

## Production Readiness (Before Deploying)
- [ ] Environment variables configured for production
- [ ] Build tested locally (`npm run build` && `npm run preview`)
- [ ] Supabase RLS policies configured
- [ ] Error boundaries implemented
- [ ] Loading states added to all async operations
- [ ] User feedback for errors implemented
- [ ] Analytics setup (if needed)
- [ ] Monitoring/logging configured

## Next Steps
- [ ] Create additional pages for your use case
- [ ] Set up database tables in Supabase
- [ ] Implement business logic
- [ ] Add more protected routes
- [ ] Create role-specific features
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build locally

# Supabase CLI
npx supabase --version   # Check CLI version
npx supabase init        # Initialize project
npx supabase start       # Start local Supabase
npx supabase status      # Check status

# Or use the helper script
./supabase-cli.sh        # Interactive menu
```

## Need Help?

1. Check the documentation files:
   - `QUICK_START.md` - Getting started guide
   - `AUTH_SETUP.md` - Detailed auth documentation
   - `SETUP_SUMMARY.md` - What was configured

2. Common issues and solutions are in the Troubleshooting section of each doc

3. Check Supabase Dashboard for:
   - User authentication status
   - Database tables and data
   - API logs and errors

4. Browser DevTools:
   - Console for JavaScript errors
   - Network tab for API requests
   - Application → Local Storage → `auth-storage` for auth state

---

**Once all items are checked, you're ready to start building! 🚀**
