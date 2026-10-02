import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Sidebar } from "@/components/home/Sidebar";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PostCard } from "@/components/post/PostCard";
import { POSTS } from "@/data/posts";
import { getPublicAllPostsAction } from "@/lib/public-actions";

const POSTS_PER_PAGE = 10;

export const Route = createFileRoute("/page/$page")({
  loader: async ({ params }) => {
    const pageNum = parseInt(params.page, 10);
    if (isNaN(pageNum) || pageNum < 1) throw notFound();
    if (pageNum === 1) throw redirect({ to: "/" });

    const dbPosts = await getPublicAllPostsAction();
    const allPosts = (dbPosts && dbPosts.length > 0 ? dbPosts : POSTS)
      .slice()
      .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

    if (pageNum > totalPages) throw notFound();

    const startIndex = (pageNum - 1) * POSTS_PER_PAGE;
    const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    return {
      posts: currentPosts,
      pageNum,
      totalPages,
      totalCount: allPosts.length,
    };
  },
  head: ({ loaderData }) => {
    const pageNum = loaderData?.pageNum || 2;
    return {
      meta: [
        { title: `Yazılar - Sayfa ${pageNum} - Ya Olmasaydı` },
        {
          name: "description",
          content: `Ya Olmasaydı blog içerikleri arşivi - Sayfa ${pageNum}. Dünyanın en ilginç 'ya olmasaydı' senaryolarını keşfedin.`,
        },
      ],
      links: [{ rel: "canonical", href: `https://yaolmasaydi.com/page/${pageNum}` }],
    };
  },
  component: PaginatedPage,
});

function PaginatedPage() {
  const { posts, pageNum, totalPages, totalCount } = Route.useLoaderData();

  return (
    <SiteLayout>
      <div className="site-wrap py-8">
        <header className="mb-8 border-b border-line pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
              Tüm Yazılar
            </h1>
            <p className="text-xs text-muted mt-1">
              Sayfa {pageNum} / {totalPages} (Toplam {totalCount} içerik)
            </p>
          </div>
          <Link
            to="/"
            className="text-xs font-semibold text-accent hover:underline"
          >
            ‹ Anasayfaya Dön
          </Link>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-line/60 pt-8">
                {pageNum > 1 && (
                  <Link
                    to={pageNum === 2 ? "/" : ("/page/$page" as any)}
                    params={(pageNum === 2 ? undefined : { page: String(pageNum - 1) }) as any}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-line bg-paper px-3.5 text-xs font-semibold text-fg hover:border-fg transition-colors"
                  >
                    ‹ Önceki
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - pageNum) <= 2
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <span key={p} className="inline-flex items-center gap-2">
                        {showEllipsis && <span className="text-xs text-muted">...</span>}
                        {p === pageNum ? (
                          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-ink text-xs font-bold text-inverse shadow-xs">
                            {p}
                          </span>
                        ) : (
                          <Link
                            to={p === 1 ? "/" : ("/page/$page" as any)}
                            params={(p === 1 ? undefined : { page: String(p) }) as any}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-paper text-xs font-semibold text-fg hover:border-fg transition-colors"
                          >
                            {p}
                          </Link>
                        )}
                      </span>
                    );
                  })}

                {pageNum < totalPages && (
                  <Link
                    to={"/page/$page" as any}
                    params={{ page: String(pageNum + 1) } as any}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-line bg-paper px-3.5 text-xs font-semibold text-fg hover:border-fg transition-colors"
                  >
                    Sonraki ›
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24">
            <Sidebar />
          </div>
        </div>
      </div>
      <CtaBanner />
    </SiteLayout>
  );
}
