import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PostCard } from "@/components/post/PostCard";
import { getPostsByCategory } from "@/data/posts";
import { getCategory } from "@/data/site";

export const Route = createFileRoute("/kategori/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat, posts: getPostsByCategory(params.slug) };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.cat;
    if (!cat) return {};
    const title = `${cat.name} - Ya Olmasaydı`;
    const description =
      cat.description ||
      `${cat.name} kategorisindeki tüm 'Ya Olmasaydı' senaryoları ve özgün içerikleri keşfedin.`;
    const canonical = `https://yaolmasaydi.com/kategori/${cat.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, posts } = Route.useLoaderData();
  return (
    <SiteLayout>
      <header className="border-b border-line bg-paper py-12 text-center">
        <p className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">Kategori</p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{cat.name}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-dim">{cat.description}</p>
      </header>
      <div className="site-wrap py-10">
        {posts.length === 0 ? (
          <p className="text-center text-muted">
            Bu kategoride henüz yazı yok.{" "}
            <Link to="/" className="text-accent">
              Anasayfaya dön
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((p: any) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
