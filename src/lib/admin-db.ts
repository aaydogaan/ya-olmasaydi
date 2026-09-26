import pg from "pg";
import { POSTS } from "@/data/posts";
import { CATEGORIES, AUTHORS } from "@/data/site";

const connectionString = process.env.DATABASE_URL;

let pool: pg.Pool | null = null;
function getPool() {
  if (!pool && connectionString) {
    pool = new pg.Pool({
      connectionString,
      max: 5,
      ssl: connectionString.includes("sslmode=require") || connectionString.includes("supabase.co")
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return pool;
}

export interface AdminPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string | null;
  author_name: string;
  category_id: string | null;
  category_name: string;
  category_slug: string;
  published_at: string;
  updated_at: string | null;
  comment_count: number;
  views_count: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_focus_keyword: string | null;
  is_published: boolean;
  tags: string[];
}

export async function getDashboardStats() {
  const p = getPool();
  if (!p) {
    return {
      totalPosts: POSTS.length,
      publishedPosts: POSTS.length,
      totalCategories: CATEGORIES.length,
      totalAuthors: Object.keys(AUTHORS).length,
      recentPosts: POSTS.slice(0, 5).map((x) => ({
        id: x.slug,
        title: x.title,
        slug: x.slug,
        cover_image: x.image || null,
        category_name: CATEGORIES.find((c) => c.slug === x.category)?.name || x.category,
        author_name: AUTHORS[x.author]?.name || x.author,
        published_at: x.publishedAt,
        is_published: true,
      })),
      dbConnected: false,
    };
  }

  const client = await p.connect();
  try {
    const postCountRes = await client.query("SELECT count(*) as count FROM posts");
    const pubCountRes = await client.query("SELECT count(*) as count FROM posts WHERE is_published = true");
    const catCountRes = await client.query("SELECT count(*) as count FROM categories");
    const authCountRes = await client.query("SELECT count(*) as count FROM authors");
    const recentRes = await client.query(`
      SELECT p.id, p.title, p.slug, p.cover_image, p.published_at, p.is_published,
             c.name as category_name, a.name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      LEFT JOIN authors a ON a.id = p.author_id
      ORDER BY p.published_at DESC
      LIMIT 6
    `);

    return {
      totalPosts: parseInt(postCountRes.rows[0].count, 10),
      publishedPosts: parseInt(pubCountRes.rows[0].count, 10),
      totalCategories: parseInt(catCountRes.rows[0].count, 10),
      totalAuthors: parseInt(authCountRes.rows[0].count, 10),
      recentPosts: recentRes.rows,
      dbConnected: true,
    };
  } finally {
    client.release();
  }
}

export async function getAdminPosts(params: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const p = getPool();
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = (page - 1) * limit;

  if (!p) {
    let filtered = [...POSTS];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((x) => x.title.toLowerCase().includes(q) || x.slug.includes(q));
    }
    if (params.category && params.category !== "all") {
      filtered = filtered.filter((x) => x.category === params.category);
    }
    const total = filtered.length;
    const items = filtered.slice(offset, offset + limit).map((x) => ({
      id: x.slug,
      title: x.title,
      slug: x.slug,
      excerpt: x.excerpt,
      content: typeof x.content === "string" ? x.content : JSON.stringify(x.content),
      cover_image: x.image || null,
      author_id: x.author,
      author_name: AUTHORS[x.author]?.name || x.author,
      category_id: x.category,
      category_name: CATEGORIES.find((c) => c.slug === x.category)?.name || x.category,
      category_slug: x.category,
      published_at: x.publishedAt,
      updated_at: null,
      comment_count: x.comments,
      views_count: 0,
      seo_title: x.seo?.title || null,
      seo_description: x.seo?.description || null,
      seo_focus_keyword: x.seo?.focus_keyword || null,
      is_published: true,
      tags: x.tags || [],
    }));
    return { items, total, totalPages: Math.ceil(total / limit), page };
  }

  const client = await p.connect();
  try {
    let whereClauses: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search && params.search.trim()) {
      whereClauses.push(`(p.title ILIKE $${paramIndex} OR p.slug ILIKE $${paramIndex})`);
      queryParams.push(`%${params.search.trim()}%`);
      paramIndex++;
    }

    if (params.category && params.category !== "all") {
      whereClauses.push(`c.slug = $${paramIndex}`);
      queryParams.push(params.category);
      paramIndex++;
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countSql = `
      SELECT count(DISTINCT p.id) as count
      FROM posts p
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      ${whereStr}
    `;
    const countRes = await client.query(countSql, queryParams);
    const total = parseInt(countRes.rows[0].count, 10);

    const listSql = `
      SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.author_id,
             p.published_at, p.updated_at, p.comment_count, p.views_count,
             p.seo_title, p.seo_description, p.seo_focus_keyword, p.is_published,
             c.id as category_id, c.name as category_name, c.slug as category_slug,
             a.name as author_name,
             COALESCE(
               (SELECT json_agg(pt.tag) FROM post_tags pt WHERE pt.post_id = p.id),
               '[]'::json
             ) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      LEFT JOIN authors a ON a.id = p.author_id
      ${whereStr}
      ORDER BY p.published_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const listRes = await client.query(listSql, [...queryParams, limit, offset]);

    return {
      items: listRes.rows,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  } finally {
    client.release();
  }
}

export async function getAdminPost(idOrSlug: string) {
  const p = getPool();
  if (!p) {
    const post = POSTS.find((x) => x.slug === idOrSlug);
    if (!post) return null;
    return {
      id: post.slug,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: typeof post.content === "string" ? post.content : JSON.stringify(post.content),
      cover_image: post.image || null,
      author_id: post.author,
      author_name: AUTHORS[post.author]?.name || post.author,
      category_id: post.category,
      category_name: CATEGORIES.find((c) => c.slug === post.category)?.name || post.category,
      category_slug: post.category,
      published_at: post.publishedAt,
      updated_at: null,
      comment_count: post.comments,
      views_count: 0,
      seo_title: post.seo?.title || null,
      seo_description: post.seo?.description || null,
      seo_focus_keyword: post.seo?.focus_keyword || null,
      is_published: true,
      tags: post.tags || [],
    };
  }

  const client = await p.connect();
  try {
    const res = await client.query(
      `
      SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image, p.author_id,
             p.published_at, p.updated_at, p.comment_count, p.views_count,
             p.seo_title, p.seo_description, p.seo_focus_keyword, p.is_published,
             c.id as category_id, c.name as category_name, c.slug as category_slug,
             a.name as author_name,
             COALESCE(
               (SELECT json_agg(pt.tag) FROM post_tags pt WHERE pt.post_id = p.id),
               '[]'::json
             ) as tags
      FROM posts p
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
      LEFT JOIN authors a ON a.id = p.author_id
      WHERE p.id = $1 OR p.slug = $1
      LIMIT 1
    `,
      [idOrSlug]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function saveAdminPost(data: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  category_id?: string;
  author_id?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_focus_keyword?: string;
  is_published?: boolean;
}) {
  const p = getPool();
  if (!p) throw new Error("Veritabanı bağlantısı bulunamadı (DATABASE_URL)");

  const client = await p.connect();
  try {
    await client.query("BEGIN");

    const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const isUpdate = Boolean(data.id);
    const postId = data.id || `post_${Date.now()}`;
    const now = new Date().toISOString();

    if (isUpdate) {
      await client.query(
        `
        UPDATE posts
        SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5,
            author_id = $6, updated_at = $7, seo_title = $8, seo_description = $9,
            seo_focus_keyword = $10, is_published = $11
        WHERE id = $12
      `,
        [
          data.title,
          cleanSlug,
          data.excerpt || "",
          data.content,
          data.cover_image || null,
          data.author_id || "1",
          now,
          data.seo_title || data.title,
          data.seo_description || data.excerpt || "",
          data.seo_focus_keyword || "",
          data.is_published ?? true,
          postId,
        ]
      );
    } else {
      await client.query(
        `
        INSERT INTO posts (
          id, title, slug, excerpt, content, cover_image, author_id,
          published_at, updated_at, comment_count, views_count,
          seo_title, seo_description, seo_focus_keyword, is_published
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0, $10, $11, $12, $13)
      `,
        [
          postId,
          data.title,
          cleanSlug,
          data.excerpt || "",
          data.content,
          data.cover_image || null,
          data.author_id || "1",
          now,
          now,
          data.seo_title || data.title,
          data.seo_description || data.excerpt || "",
          data.seo_focus_keyword || "",
          data.is_published ?? true,
        ]
      );
    }

    // Update Category
    if (data.category_id) {
      await client.query("DELETE FROM post_categories WHERE post_id = $1", [postId]);
      await client.query(
        "INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [postId, data.category_id]
      );
    }

    // Update Tags
    if (Array.isArray(data.tags)) {
      await client.query("DELETE FROM post_tags WHERE post_id = $1", [postId]);
      for (const tag of data.tags) {
        if (tag && tag.trim()) {
          await client.query(
            "INSERT INTO post_tags (post_id, tag) VALUES ($1, $2)",
            [postId, tag.trim()]
          );
        }
      }
    }

    await client.query("COMMIT");
    return { success: true, id: postId, slug: cleanSlug };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteAdminPost(id: string) {
  const p = getPool();
  if (!p) throw new Error("Veritabanı bağlantısı bulunamadı");
  const client = await p.connect();
  try {
    await client.query("DELETE FROM posts WHERE id = $1", [id]);
    return { success: true };
  } finally {
    client.release();
  }
}

export async function getAdminCategories() {
  const p = getPool();
  if (!p) {
    return CATEGORIES.map((c) => ({ id: c.slug, name: c.name, slug: c.slug, description: c.description }));
  }
  const client = await p.connect();
  try {
    const res = await client.query("SELECT id, name, slug, description FROM categories ORDER BY name ASC");
    return res.rows;
  } finally {
    client.release();
  }
}

export async function getAdminAuthors() {
  const p = getPool();
  if (!p) {
    return Object.entries(AUTHORS).map(([slug, a]) => ({ id: slug, name: a.name, slug }));
  }
  const client = await p.connect();
  try {
    const res = await client.query("SELECT id, name, slug FROM authors ORDER BY name ASC");
    return res.rows;
  } finally {
    client.release();
  }
}
