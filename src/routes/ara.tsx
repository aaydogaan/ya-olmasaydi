import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PostCard } from "@/components/post/PostCard";
import { searchPosts } from "@/data/posts";

type Search = { q?: string };

export const Route = createFileRoute("/ara")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Arama Sonuçları - Ya Olmasaydı" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchPosts(q);
  return (
    <SiteLayout>
      <header className="border-b border-line bg-paper py-12 text-center">
        <p className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">Arama</p>
        <h1 className="font-display text-3xl font-semibold">
          {q ? `“${q}”` : "Bir şey arayın"}
        </h1>
        <p className="mt-2 text-sm text-muted">{results.length} sonuç</p>
      </header>
      <div className="site-wrap py-10">
        {results.length === 0 ? (
          <p className="text-center text-dim">
            Sonuç yok.{" "}
            <Link to="/" className="text-accent">
              Anasayfaya dön
            </Link>
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {results.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
