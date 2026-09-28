import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBanner } from "@/components/home/CtaBanner";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Sidebar } from "@/components/home/Sidebar";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PostCard } from "@/components/post/PostCard";
import { POSTS } from "@/data/posts";
import { getPublicAllPostsAction } from "@/lib/public-actions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const dbPosts = await getPublicAllPostsAction();
    return { dbPosts };
  },
  head: () => ({
    meta: [
      { title: "Ya Olmasaydı - Dünyanın En İlginç Alternatif Senaryoları" },
      {
        name: "description",
        content:
          "Hazır olun, dünyanın en ilginç hikayeleri sizlerle! Bilim, tarih, kültür ve evren hakkında 'Ya Olmasaydı' serisinde sıra dışı alternatif senaryoları keşfedin.",
      },
      { property: "og:title", content: "Ya Olmasaydı - Dünyanın En İlginç Alternatif Senaryoları" },
      {
        property: "og:description",
        content:
          "Hazır olun, dünyanın en ilginç hikayeleri sizlerle! Bilim, tarih, kültür ve evren hakkında 'Ya Olmasaydı' serisinde sıra dışı alternatif senaryoları keşfedin.",
      },
      { property: "og:url", content: "https://yaolmasaydi.com/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://yaolmasaydi.com/images/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ya Olmasaydı - Dünyanın En İlginç Alternatif Senaryoları" },
      {
        name: "twitter:description",
        content:
          "Hazır olun, dünyanın en ilginç hikayeleri sizlerle! Bilim, tarih, kültür ve evren hakkında 'Ya Olmasaydı' serisinde sıra dışı alternatif senaryoları keşfedin.",
      },
      { name: "twitter:image", content: "https://yaolmasaydi.com/images/og.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/" }],
  }),
  component: Home,
});

const POSTS_PER_PAGE = 10;

function Home() {
  const { dbPosts } = Route.useLoaderData();
  const allPosts = dbPosts || POSTS;
  const postsToShow = allPosts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <SiteLayout>
      <HeroCarousel />
      <div className="site-wrap py-8">
        <h2 className="mb-6 font-display text-[1.65rem] font-semibold text-fg">
          Haftanın Hitleri
        </h2>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div>
            <div className="grid gap-8 md:grid-cols-2">
              {postsToShow.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>

            {/* Pagination / Eski Yazılar Navigation */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4 border-t border-line/60 pt-8 sm:flex-row sm:justify-between">
                <Link
                  to={"/page/$page" as any}
                  params={{ page: "2" } as any}
                  className="btn-black text-xs font-semibold px-6 py-2.5"
                >
                  Eski Yazılar ›
                </Link>

                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-ink text-xs font-bold text-inverse shadow-xs">
                    1
                  </span>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 2)
                    .filter((p) => p <= totalPages)
                    .map((p) => (
                      <Link
                        key={p}
                        to={"/page/$page" as any}
                        params={{ page: String(p) } as any}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-paper text-xs font-semibold text-fg hover:border-fg transition-colors"
                      >
                        {p}
                      </Link>
                    ))}

                  {totalPages > 6 && <span className="text-xs text-muted">...</span>}

                  <Link
                    to={"/page/$page" as any}
                    params={{ page: "2" } as any}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-line bg-paper px-3 text-xs font-semibold text-fg hover:border-fg transition-colors"
                  >
                    Sonraki ›
                  </Link>
                </div>
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
