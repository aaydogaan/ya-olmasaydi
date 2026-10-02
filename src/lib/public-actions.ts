import { createServerFn } from "@tanstack/react-start";
import { getAdminPost } from "./admin-db";
import { getPost } from "@/data/posts";
import type { AuthorSlug } from "@/data/site";

async function withTimeout<T>(promise: Promise<T>, ms: number = 1000): Promise<T | null> {
  let timer: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

export const getPublicPostAction = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const dbPost = await withTimeout(getAdminPost(slug), 1000);
      if (dbPost && dbPost.is_published) {
        return {
          slug: dbPost.slug,
          title: dbPost.title,
          category: (dbPost.category_slug || "bilim-ve-teknoloji") as any,
          author: (dbPost.author_slug === "selman" ? "selman" : "recep") as AuthorSlug,
          publishedAt: dbPost.published_at
            ? new Date(dbPost.published_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          comments: Number(dbPost.comment_count || 0),
          excerpt: dbPost.excerpt || "",
          image: dbPost.cover_image || "",
          hero: false,
          homepage: false,
          tags: Array.isArray(dbPost.tags) ? dbPost.tags : [],
          content: dbPost.content,
          seo: {
            title: dbPost.seo_title || undefined,
            description: dbPost.seo_description || undefined,
            focus_keyword: dbPost.seo_focus_keyword || undefined,
          },
        };
      }
    } catch (e) {
      console.error("Error fetching post from DB:", e);
    }

    // Fallback to static posts
    const staticPost = getPost(slug);
    return staticPost || null;
  });

export const getPublicAllPostsAction = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { getAdminPosts } = await import("./admin-db");
      const dbRes = await withTimeout(getAdminPosts({ limit: 120 }), 1000);
      if (dbRes && dbRes.items && dbRes.items.length > 0) {
        return dbRes.items.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: (p.category_slug || "bilim-ve-teknoloji") as any,
          author: (p.author_slug === "selman" ? "selman" : "recep") as AuthorSlug,
          publishedAt: p.published_at
            ? new Date(p.published_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          comments: Number(p.comment_count || 0),
          excerpt: p.excerpt || "",
          image: p.cover_image || "",
          hero: false,
          homepage: true,
          tags: Array.isArray(p.tags) ? p.tags : [],
          content: p.content,
        }));
      }
    } catch (e) {
      console.error("Error fetching all posts from DB for homepage:", e);
    }
    return null;
  });

