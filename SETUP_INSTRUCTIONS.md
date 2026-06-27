# Agrou - Supabase Setup Instructions

## Phase 0: Initial Setup (Complete ✅)

The following has been completed:
- ✅ Dependencies installed (@supabase/supabase-js, @supabase/ssr, @tanstack/react-query, zod, react-hot-toast, date-fns)
- ✅ Project structure created
- ✅ Supabase client utilities created (client.ts, server.ts, middleware.ts)
- ✅ Database schema SQL prepared (supabase/schema.sql)
- ✅ TypeScript types defined (database.types.ts)
- ✅ Auth context and hooks created (useAuth)
- ✅ Middleware configured for route protection
- ✅ Login/Register pages updated with real auth
- ✅ Environment example file created

## Next Steps: Supabase Project Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create an account
4. Click "New Project"
5. Fill in:
   - **Name**: agrou (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
6. Click "Create new project"
7. Wait 2-3 minutes for project provisioning

### 2. Get API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (under Project API keys)
   - **service_role** key (under Project API keys - keep this secret!)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 4. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy all content from `supabase/schema.sql`
4. Paste into the query editor
5. Click **Run** (bottom right)
6. Wait for success message

**What this does:**
- Creates `profiles`, `products`, `orders`, and `order_items` tables
- Sets up Row Level Security (RLS) policies
- Creates storage buckets for avatars and product images
- Adds triggers for auto-updating timestamps
- Creates function to auto-create profile on user signup

### 5. Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see:
   - profiles
   - products
   - orders
   - order_items

3. Go to **Storage** in Supabase dashboard
4. You should see:
   - avatars
   - products

### 6. Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** > **Email Templates**
2. Customize the templates:
   - **Confirm signup**: Sent when user registers
   - **Magic Link**: For passwordless login (if you enable it)
   - **Change Email Address**: When user changes email
   - **Reset Password**: For password reset

3. Update the redirect URLs to match your app:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

### 7. Configure Auth Settings

1. Go to **Authentication** > **URL Configuration**
2. Add your **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - Add production URLs when ready

4. Go to **Authentication** > **Providers**
5. Email auth is enabled by default
6. Optionally enable OAuth providers (Google, GitHub, etc.)

### 8. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Test registration:
   - Go to `/register`
   - Create a new account
   - Check your email for verification
   - Verify your email

4. Test login:
   - Go to `/login`
   - Sign in with your credentials
   - You should be redirected to `/dashboard`

5. Check Supabase:
   - Go to **Authentication** > **Users** in Supabase dashboard
   - You should see your new user
   - Go to **Table Editor** > **profiles**
   - You should see a profile row created automatically

### 9. Troubleshooting

**Issue: "Invalid API key"**
- Double-check your `.env.local` file
- Make sure you copied the correct keys from Supabase
- Restart your dev server after changing env variables

**Issue: "User already registered"**
- Use a different email
- Or go to Supabase dashboard > Authentication > Users and delete the test user

**Issue: RLS policy error**
- Make sure you ran the entire `schema.sql` file
- Check Supabase dashboard > SQL Editor for any errors
- Verify RLS is enabled in Table Editor > table settings

**Issue: Email not being sent**
- Check Supabase dashboard > Authentication > Email Templates
- For development, check the Supabase logs for the magic link
- Free tier has email rate limits - be patient between tests

### 10. Next Phase: Profile Management

Once authentication is working, we'll implement:
- Profile viewing and editing
- Avatar upload
- Role management (farmer/buyer/admin)

See `IMPLEMENTATION_PLAN.md` Phase 3 for details.

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Generate types from Supabase (after setup)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Need help?** Check the implementation plan in `IMPLEMENTATION_PLAN.md` or refer to Supabase documentation.
