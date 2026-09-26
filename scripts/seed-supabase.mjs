import fs from 'fs';
import pg from 'pg';

const { Client } = pg;

async function seed() {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error('❌ Lütfen DATABASE_URL veya SUPABASE_DB_URL ortam değişkenini sağlayın.');
    console.log('Örnek kullanım:');
    console.log('  DATABASE_URL="postgresql://postgres:[SIFRE]@[HOST]:5432/postgres" node scripts/seed-supabase.mjs');
    process.exit(1);
  }

  const isSsl = connectionString.includes('sslmode=require') || connectionString.includes('supabase.co');
  const client = new Client({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Supabase PostgreSQL veritabanına bağlanıldı!');

    // Read schema
    console.log('📄 Şema oluşturuluyor...');
    const schemaSql = fs.readFileSync('./migrations/supabase_schema.sql', 'utf8');
    await client.query(schemaSql);
    console.log('✅ Tablolar ve RLS kuralları hazırlandı.');

    // Read JSON files
    const authors = JSON.parse(fs.readFileSync('./src/data/wp-users.json', 'utf8'));
    const categories = JSON.parse(fs.readFileSync('./src/data/wp-categories.json', 'utf8'));
    const posts = JSON.parse(fs.readFileSync('./src/data/wp-posts.json', 'utf8'));
    const pages = JSON.parse(fs.readFileSync('./src/data/wp-pages.json', 'utf8'));

    // Insert Authors
    console.log(`👤 ${authors.length} yazar ekleniyor...`);
    for (const a of authors) {
      await client.query(`
        INSERT INTO authors (id, name, slug)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;
      `, [String(a.id), a.name, a.login || String(a.id)]);
    }

    // Insert Categories
    console.log(`📁 ${categories.length} kategori ekleniyor...`);
    for (const c of categories) {
      await client.query(`
        INSERT INTO categories (id, name, slug, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description;
      `, [String(c.id), c.name, c.slug, c.description]);
    }

    // Insert Posts
    console.log(`📝 ${posts.length} yazı ve ilişkileri ekleniyor...`);
    for (const p of posts) {
      await client.query(`
        INSERT INTO posts (
          id, title, slug, excerpt, content, cover_image, author_id,
          published_at, updated_at, comment_count, seo_title, seo_description, seo_focus_keyword, is_published
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          seo_focus_keyword = EXCLUDED.seo_focus_keyword;
      `, [
        String(p.id),
        p.title,
        p.slug,
        p.excerpt || '',
        p.content,
        p.image || null,
        p.author?.id ? String(p.author.id) : null,
        p.created_at || new Date().toISOString(),
        p.updated_at || new Date().toISOString(),
        p.comment_count || 0,
        p.seo?.title || p.title,
        p.seo?.description || '',
        p.seo?.focus_keyword || ''
      ]);

      // Categories relation
      if (p.categories && p.categories.length > 0) {
        for (const cat of p.categories) {
          // find category id by slug
          const matchedCat = categories.find(c => c.slug === cat.slug);
          if (matchedCat) {
            await client.query(`
              INSERT INTO post_categories (post_id, category_id)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING;
            `, [String(p.id), String(matchedCat.id)]);
          }
        }
      }

      // Tags
      if (p.tags && p.tags.length > 0) {
        for (const tag of p.tags) {
          await client.query(`
            INSERT INTO post_tags (post_id, tag)
            VALUES ($1, $2);
          `, [String(p.id), tag]);
        }
      }
    }

    // Insert Pages
    console.log(`📄 ${pages.length} sayfa ekleniyor...`);
    for (const pgItem of pages) {
      await client.query(`
        INSERT INTO pages (id, title, slug, content, seo_title, seo_description, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          content = EXCLUDED.content,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description;
      `, [
        String(pgItem.id),
        pgItem.title,
        pgItem.slug,
        pgItem.content || '',
        pgItem.seo?.title || pgItem.title,
        pgItem.seo?.description || '',
        pgItem.created_at || new Date().toISOString()
      ]);
    }

    console.log('\n🎉 TEBRİKLER! Supabase veritabanına tüm içerikler başarıyla aktarıldı!');
  } catch (err) {
    console.error('❌ Aktarım sırasında hata oluştu:', err);
  } finally {
    await client.end();
  }
}

seed().catch(console.error);
