-- ==============================================================================
-- YA OLMASAYDI - SUPABASE (POSTGRESQL) SCHEMA
-- ==============================================================================

-- 1. AUTHORS (Yazarlar)
CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'Yazar',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES (Kategoriler)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#e85d04',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POSTS (Yazılar & İçerikler)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id TEXT REFERENCES authors(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  comment_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_focus_keyword TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance & SEO Indexing (Permalinks must be instant)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 4. POST CATEGORIES RELATIONSHIP (Çoktan Çoğa Kategori İlişkisi)
CREATE TABLE IF NOT EXISTS post_categories (
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- 5. POST TAGS (Etiketler)
CREATE TABLE IF NOT EXISTS post_tags (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag);

-- 6. PAGES (Statik Sayfalar)
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all published content
CREATE POLICY "Public read for authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Public read for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read for published posts" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read for post_categories" ON post_categories FOR SELECT USING (true);
CREATE POLICY "Public read for post_tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Public read for pages" ON pages FOR SELECT USING (true);
