# Agrou App - Supabase & Cloudflare Integration Plan

## 📊 Current State Analysis

### Architecture Overview
- **Framework**: Next.js 15.1.6 (App Router)
- **UI**: React 19, Tailwind CSS, Shadcn/ui components
- **State**: Currently using dummy data with no backend integration
- **Auth**: UI components exist but no real authentication
- **Database**: None - all data is hardcoded/mock
- **Deployment**: Not configured

### Existing Structure
```
Agrou/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth routes (login, register)
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/              # Shadcn components
│   └── lib/
│       └── utils.ts
├── public/
└── package.json
```

### Current Features (UI Only)
1. ✅ Login/Register pages
2. ✅ Dashboard layout
3. ✅ UI components (Button, Input, Card, etc.)
4. ❌ No authentication logic
5. ❌ No database connection
6. ❌ No API routes
7. ❌ No user management
8. ❌ No data persistence

---

## 🎯 Target Architecture

### Tech Stack
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **CDN/Edge**: Cloudflare (Pages/Workers, Images, R2)
- **Frontend**: Next.js (already setup)
- **Auth**: Supabase Auth + JWT
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage + Cloudflare R2 (for static assets)
- **CDN**: Cloudflare CDN

### Database Schema (Planned)
```
Users (via Supabase Auth)
├── id (uuid)
├── email
├── created_at
└── metadata (JSON)

Profiles
├── id (uuid, FK to auth.users)
├── full_name
├── avatar_url
├── bio
├── role (farmer/buyer/admin)
├── created_at
└── updated_at

Products
├── id (uuid)
├── user_id (FK)
├── name
├── description
├── price
├── category
├── images (text[])
├── stock
├── created_at
└── updated_at

Orders
├── id (uuid)
├── buyer_id (FK)
├── seller_id (FK)
├── total_amount
├── status
├── created_at
└── updated_at

Order_Items
├── id (uuid)
├── order_id (FK)
├── product_id (FK)
├── quantity
├── price
└── created_at
```

---

## 📋 Implementation Phases

### **Phase 0: Setup & Configuration** (2-3 hours)
**Goal**: Initialize Supabase and Cloudflare, configure environment

#### Tasks:
1. **Supabase Setup**
   - [ ] Create Supabase project
   - [ ] Get API keys (anon key, service role key)
   - [ ] Configure auth providers
   - [ ] Set up database schema
   - [ ] Configure RLS (Row Level Security) policies

2. **Cloudflare Setup**
   - [ ] Create Cloudflare account
   - [ ] Set up Pages project
   - [ ] Configure custom domain (if needed)
   - [ ] Set up R2 bucket for assets
   - [ ] Configure CDN rules

3. **Project Configuration**
   - [ ] Install dependencies:
     ```bash
     npm install @supabase/supabase-js @supabase/ssr
     npm install -D @cloudflare/next-on-pages
     ```
   - [ ] Create `.env.local` file:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     CLOUDFLARE_ACCOUNT_ID=your_account_id
     CLOUDFLARE_API_TOKEN=your_api_token
     ```
   - [ ] Configure `next.config.ts` for Cloudflare
   - [ ] Set up Supabase client utilities

#### Deliverables:
- Supabase project with database schema
- Cloudflare Pages project configured
- Environment variables set
- Supabase client utilities created

---

### **Phase 1: Authentication System** (4-6 hours)
**Goal**: Implement full authentication flow with Supabase Auth

#### Tasks:
1. **Supabase Auth Configuration**
   - [ ] Enable email/password authentication
   - [ ] Configure email templates
   - [ ] Set up OAuth providers (Google, GitHub - optional)
   - [ ] Configure redirect URLs

2. **Auth Utilities**
   - [ ] Create `src/lib/supabase/client.ts` (client-side)
   - [ ] Create `src/lib/supabase/server.ts` (server-side)
   - [ ] Create `src/lib/supabase/middleware.ts` (middleware)
   - [ ] Create auth helper functions

3. **Auth Pages**
   - [ ] Update `/login` page with real auth
   - [ ] Update `/register` page with real auth
   - [ ] Create `/forgot-password` page
   - [ ] Create `/reset-password` page
   - [ ] Add email verification flow

4. **Protected Routes**
   - [ ] Create middleware for route protection
   - [ ] Add auth checks to dashboard routes
   - [ ] Implement redirect logic
   - [ ] Add loading states

5. **User Context/State**
   - [ ] Create `AuthContext` provider
   - [ ] Create `useAuth` hook
   - [ ] Add user session management
   - [ ] Handle token refresh

#### Deliverables:
- Working login/register flow
- Protected dashboard routes
- Session management
- Auth context and hooks

---

### **Phase 2: Database Schema & RLS** (3-4 hours)
**Goal**: Create and secure database with proper policies

#### Tasks:
1. **Database Schema Creation**
   - [ ] Create `profiles` table
   - [ ] Create `products` table
   - [ ] Create `orders` table
   - [ ] Create `order_items` table
   - [ ] Add indexes for performance
   - [ ] Create database functions/triggers

2. **Row Level Security (RLS)**
   - [ ] Enable RLS on all tables
   - [ ] Create SELECT policies (read access)
   - [ ] Create INSERT policies (create access)
   - [ ] Create UPDATE policies (edit access)
   - [ ] Create DELETE policies (delete access)
   - [ ] Test policies thoroughly

3. **Database Utilities**
   - [ ] Create TypeScript types from schema
   - [ ] Create database helper functions
   - [ ] Add error handling
   - [ ] Create query builders

#### SQL Examples:
```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('farmer', 'buyer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy Example
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
```

#### Deliverables:
- Complete database schema
- RLS policies for all tables
- TypeScript types
- Database helper functions

---

### **Phase 3: User Profile Management** (3-4 hours)
**Goal**: Implement user profile CRUD operations

#### Tasks:
1. **Profile API Routes**
   - [ ] Create `app/api/profile/route.ts` (GET, PUT)
   - [ ] Create `app/api/profile/avatar/route.ts` (POST)
   - [ ] Add validation with Zod
   - [ ] Implement error handling

2. **Profile UI Components**
   - [ ] Create profile view page
   - [ ] Create profile edit form
   - [ ] Create avatar upload component
   - [ ] Add form validation
   - [ ] Add loading/error states

3. **Profile Hooks**
   - [ ] Create `useProfile` hook
   - [ ] Create `useUpdateProfile` hook
   - [ ] Add optimistic updates
   - [ ] Handle cache invalidation

4. **Profile Features**
   - [ ] View profile
   - [ ] Edit profile
   - [ ] Upload avatar
   - [ ] Change role (if applicable)

#### Deliverables:
- Working profile management
- Avatar upload functionality
- Profile view/edit pages

---

### **Phase 4: Core Features Implementation** (8-12 hours)
**Goal**: Build main application features

#### Tasks:
1. **Products Module**
   - [ ] Product listing API
   - [ ] Product create/update/delete API
   - [ ] Product detail page
   - [ ] Product listing page
   - [ ] Product form component
   - [ ] Image upload for products
   - [ ] Search and filter functionality

2. **Orders Module**
   - [ ] Order creation API
   - [ ] Order listing API
   - [ ] Order detail page
   - [ ] Order status management
   - [ ] Order history page

3. **Dashboard**
   - [ ] Dashboard analytics
   - [ ] Recent orders
   - [ ] Product statistics
   - [ ] User statistics

#### Deliverables:
- Complete product management
- Order system
- Dashboard with analytics

---

### **Phase 5: File Storage & CDN** (3-4 hours)
**Goal**: Implement file uploads with Supabase Storage + Cloudflare

#### Tasks:
1. **Supabase Storage**
   - [ ] Create storage buckets
   - [ ] Configure bucket policies
   - [ ] Create upload utilities
   - [ ] Add image optimization

2. **Cloudflare Integration**
   - [ ] Set up Cloudflare Images
   - [ ] Configure R2 bucket
   - [ ] Create CDN routes
   - [ ] Add image transformations

3. **Upload Components**
   - [ ] Create file upload component
   - [ ] Add drag-and-drop
   - [ ] Add progress indicators
   - [ ] Handle multiple uploads

#### Deliverables:
- File upload system
- CDN integration
- Optimized image delivery

---

### **Phase 6: Real-time Features** (2-3 hours)
**Goal**: Add real-time updates with Supabase Realtime

#### Tasks:
1. **Realtime Setup**
   - [ ] Enable Realtime on tables
   - [ ] Create subscription utilities
   - [ ] Add connection management

2. **Real-time Features**
   - [ ] Live order updates
   - [ ] Live product updates
   - [ ] Notification system
   - [ ] Presence indicators

#### Deliverables:
- Real-time data updates
- Live notifications

---

### **Phase 7: Optimization & Performance** (3-4 hours)
**Goal**: Optimize for production

#### Tasks:
1. **Caching**
   - [ ] Implement React Query/SWR
   - [ ] Add Cloudflare page caching
   - [ ] Configure Next.js caching
   - [ ] Add stale-while-revalidate

2. **Performance**
   - [ ] Code splitting
   - [ ] Lazy loading
   - [ ] Image optimization
   - [ ] Bundle size optimization

3. **Security**
   - [ ] Add rate limiting
   - [ ] Implement CSRF protection
   - [ ] Add input sanitization
   - [ ] Security headers

#### Deliverables:
- Optimized performance
- Enhanced security
- Better caching

---

### **Phase 8: Testing & Deployment** (4-6 hours)
**Goal**: Test and deploy to production

#### Tasks:
1. **Testing**
   - [ ] Unit tests for utilities
   - [ ] Integration tests for API
   - [ ] E2E tests for critical flows
   - [ ] Load testing

2. **Deployment**
   - [ ] Configure Cloudflare Pages
   - [ ] Set up CI/CD pipeline
   - [ ] Configure environment variables
   - [ ] Set up monitoring

3. **Production Setup**
   - [ ] Custom domain configuration
   - [ ] SSL certificates
   - [ ] Analytics setup
   - [ ] Error tracking (Sentry)

#### Deliverables:
- Tested application
- Production deployment
- Monitoring and analytics

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "@tanstack/react-query": "^5.17.0",
    "zod": "^3.22.4",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.8.0",
    "@types/node": "^20",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.0"
  }
}
```

---

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] API keys not exposed in client
- [ ] RLS enabled on all tables
- [ ] Input validation on all forms
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented
- [ ] Secure headers configured
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication on all protected routes

---

## 📊 Success Metrics

- Authentication works seamlessly
- Page load time < 2s
- API response time < 500ms
- 99.9% uptime
- Zero security vulnerabilities
- All data properly persisted
- Real-time updates working
- Mobile responsive

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev

# Generate TypeScript types from Supabase
npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)

---

## ⏱️ Estimated Timeline

- **Phase 0**: 2-3 hours
- **Phase 1**: 4-6 hours
- **Phase 2**: 3-4 hours
- **Phase 3**: 3-4 hours
- **Phase 4**: 8-12 hours
- **Phase 5**: 3-4 hours
- **Phase 6**: 2-3 hours
- **Phase 7**: 3-4 hours
- **Phase 8**: 4-6 hours

**Total: 32-46 hours** (4-6 working days)

---

## 🎯 Next Steps

1. Review this plan
2. Create Supabase project
3. Create Cloudflare account
4. Start with Phase 0
5. Work through phases sequentially
6. Test thoroughly at each phase
7. Deploy to production

---

**Ready to start? Let me know which phase you'd like to begin with!**