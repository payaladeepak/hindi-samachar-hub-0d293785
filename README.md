# हिंदी न्यूज़ पोर्टल (Hindi News Portal)

A full-featured Hindi news portal built with React, TypeScript, and Lovable Cloud (Supabase).

## 🚀 Project Overview

This is a complete news management system with:
- **Public News Portal**: Breaking news, featured articles, category-based browsing
- **Admin Dashboard**: Article management, user management, SEO settings
- **Role-based Access**: Admin, Editor, and User roles
- **Social Sharing**: WhatsApp, Facebook, Twitter, Instagram integration

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Lovable Cloud (Supabase PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## 📊 Database Schema

### Tables

#### 1. `news_articles`
Main table for storing news articles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Article title |
| slug | TEXT | URL-friendly slug (unique) |
| excerpt | TEXT | Short summary |
| content | TEXT | Full article content |
| category | ENUM | politics, sports, entertainment, national, international, business, technology, health |
| image_url | TEXT | Featured image URL |
| is_breaking | BOOLEAN | Breaking news flag |
| is_featured | BOOLEAN | Featured article flag |
| status | ENUM | draft, pending_review, published |
| author_id | UUID | Reference to user |
| view_count | INTEGER | Article views |
| seo_title | TEXT | SEO meta title |
| meta_description | TEXT | SEO meta description |
| keywords | TEXT[] | SEO keywords array |
| og_image | TEXT | Open Graph image |
| canonical_url | TEXT | Canonical URL |
| published_at | TIMESTAMP | Publish date |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

#### 2. `categories`
Dynamic categories management.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Category identifier |
| label | TEXT | Display label (Hindi) |
| color | TEXT | Tailwind color class |
| sort_order | INTEGER | Display order |
| is_active | BOOLEAN | Active status |

#### 3. `profiles`
User profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Auth user reference |
| display_name | TEXT | User display name |
| avatar_url | TEXT | Profile picture URL |
| bio | TEXT | User biography |

#### 4. `user_roles`
Role-based access control.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Auth user reference |
| role | ENUM | admin, editor, user |

### Database Functions

- `has_role(user_id, role)`: Check if user has specific role
- `increment_view_count(article_id)`: Increment article view count
- `handle_new_user_role()`: Auto-assign 'user' role on signup
- `update_updated_at_column()`: Auto-update timestamp trigger

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with these policies:

### news_articles
- **Public**: Can view published articles
- **Editors**: Can CRUD their own articles
- **Admins**: Can CRUD all articles

### categories
- **Public**: Can view all categories
- **Admins**: Can CRUD categories

### profiles
- **Public**: Can view all profiles
- **Users**: Can update their own profile

### user_roles
- **Users**: Can view their own roles
- **Admins**: Can manage all roles

## 📁 Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| news-images | Yes | Article images, avatars |

## 🔑 Environment Variables

The following environment variables are automatically configured by Lovable Cloud:

```env
VITE_SUPABASE_URL=https://ggomyknrddklqffmaajj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
VITE_SUPABASE_PROJECT_ID=ggomyknrddklqffmaajj
```

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features, user management, category management |
| **Editor** | Create/edit/delete own articles, view dashboard |
| **User** | View published articles, manage own profile |

## 📱 Features

### Public Pages
- **Home**: Breaking news ticker, featured article slider, category grids
- **Category Pages**: Filtered news by category
- **Article Page**: Full article view with author bio, social sharing, related articles
- **Authentication**: Login/Signup with email verification

### Admin Dashboard
- **Dashboard**: Overview statistics
- **Articles List**: Manage all articles with status filters
- **New/Edit Article**: Rich editor with SEO fields
- **Categories**: Manage news categories
- **Users Management**: Assign roles to users
- **SEO Settings**: Global SEO configuration

## 🚀 Deployment

### Via Lovable (Recommended)
1. Open the project in Lovable
2. Click **Share → Publish**
3. Your app will be live at `yourproject.lovable.app`

### Custom Domain
1. Go to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Follow DNS configuration instructions

### Self-Hosting
1. Clone the repository
2. Install dependencies: `npm install`
3. Set environment variables
4. Build: `npm run build`
5. Deploy the `dist` folder to any static hosting

## 🔧 Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 API Endpoints

All data is accessed through Supabase client library. No custom API endpoints needed.

```typescript
import { supabase } from "@/integrations/supabase/client";

// Fetch articles
const { data } = await supabase
  .from('news_articles')
  .select('*')
  .eq('status', 'published');
```

## 🎨 Customization

### Colors & Theming
Edit `src/index.css` for CSS variables and `tailwind.config.ts` for Tailwind configuration.

### Categories
Categories can be managed dynamically through the Admin Dashboard → Categories section.

## 📞 Support

For issues or feature requests, use the Lovable chat interface or check [Lovable Documentation](https://docs.lovable.dev/).

---

Built with ❤️ using [Lovable](https://lovable.dev)
