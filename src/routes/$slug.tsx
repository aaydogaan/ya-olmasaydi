import React, { useEffect } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { IconClock } from "@/components/icons";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Avatar } from "@/components/post/Avatar";
import { CommentBox } from "@/components/post/CommentBox";
import { Cover } from "@/components/post/Cover";
import { ShareIcons } from "@/components/post/ShareIcons";
import {
  formatRelativeTr,
  getPost,
  readTime,
  relatedPosts,
} from "@/data/posts";
import { AUTHORS, getCategory } from "@/data/site";
import { getPublicPostAction } from "@/lib/public-actions";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const post = await getPublicPostAction({ data: params.slug });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const title = `${post.title} - Ya Olmasaydı`;
    const desc =
      post.seo?.description ||
      post.excerpt ||
      `${post.title} senaryosunu ve detaylarını Ya Olmasaydı'da keşfedin.`;
    const cleanImg = (post.image || "").replace(/^\/?uploads\//, "");
    const imgUrl = !post.image
      ? "https://yaolmasaydi.com/images/og.jpg"
      : post.image.startsWith("http")
      ? post.image
      : `https://cdn.yaolmasaydi.com/${cleanImg}`;
    const canonical = `https://yaolmasaydi.com/${post.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: imgUrl },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: imgUrl },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="site-wrap py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Sayfa bulunamadı</h1>
        <p className="mt-3 text-muted">Aradığınız yazı yok ya da taşınmış olabilir.</p>
        <Link to="/" className="btn-black mt-6 inline-flex">
          Anasayfaya dön
        </Link>
      </div>
    </SiteLayout>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const cat = getCategory(post.category);
  const author = AUTHORS[post.author as keyof typeof AUTHORS] || {
    name: "Recep Aydoğan",
    role: "Kurucu & Yazar",
    bio: "Ya Olmasaydı kurucusu. Tasarım, içerik, SEO ve teknik altyapı.",
    slug: "recep",
    initials: "RA",
    avatar: "/images/Recep-rastgel.webp",
  };
  const minutes = readTime(post);
  const related = relatedPosts(post);
  const url = typeof window !== "undefined" ? window.location.href : `https://yaolmasaydi.com/${post.slug}`;

  // Update document title for client-side navigation
  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} - Ya Olmasaydı`;
    }
  }, [post?.title]);

  return (
    <SiteLayout>
      <article>
        {/* Hero Banner with static image on hover */}
        <div className="relative isolate min-h-[22rem] overflow-hidden md:min-h-[28rem]">
          <Cover
            category={post.category}
            slug={post.slug}
            title={post.title}
            image={post.image}
            mark={false}
            zoomOnHover={false}
            className="absolute inset-0"
          />
          <div className="relative z-10 mx-auto flex min-h-[22rem] max-w-3xl flex-col justify-end px-5 py-12 text-inverse md:min-h-[28rem] md:py-16">
            <Link
              to="/kategori/$slug"
              params={{ slug: post.category }}
              className="cat-pill mb-4 w-fit"
              data-cat={post.category}
            >
              {cat?.name}
            </Link>
            <h1 className="font-display text-3xl leading-tight font-semibold md:text-5xl drop-shadow-sm">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-inverse/90">
              <span className="flex items-center gap-2">
                <Avatar slug={post.author} size={40} />
                <Link to="/author/$slug" params={{ slug: post.author }} className="font-medium hover:underline">
                  {author.name}
                </Link>
              </span>
              <time dateTime={post.publishedAt}>{formatRelativeTr(post.publishedAt)}</time>
              <span>{post.comments} Yorumlar</span>
              <span className="inline-flex items-center gap-1">
                <IconClock className="size-3.5" />
                {minutes} dk
              </span>
            </div>
          </div>
        </div>

        <div className="site-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">Bu yazıyı paylaş</p>
              <ShareIcons url={url} title={post.title} variant="filled" />
            </div>
            <div className="prose-yo">
              {typeof post.content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : Array.isArray(post.content) ? (
                post.content.map((block: any, i: number) => {
                  if (block.type === "h2")
                    return <h2 key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                  if (block.type === "h3")
                    return <h3 key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                  if (block.type === "quote")
                    return <blockquote key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                  return <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
                })
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <span key={t} className="rounded-full bg-paper px-3 py-1 text-xs text-dim">
                  {t}
                </span>
              ))}
            </div>

            {/* Author Profile Box */}
            <div className="mt-10 flex items-center gap-4 rounded-xl bg-paper p-5 border border-line/60">
              <Avatar slug={post.author} size={64} />
              <div>
                <p className="font-display text-lg font-semibold">{author.name}</p>
                <p className="text-xs text-muted font-medium">{author.role}</p>
                <p className="mt-1.5 text-sm text-dim leading-relaxed">{author.bio}</p>
              </div>
            </div>

            {/* Comments Box */}
            <CommentBox slug={post.slug} seed={post.comments} />
          </div>

          {/* Related Posts Sidebar with Thumbnails */}
          <aside className="space-y-6">
            <h3 className="font-display text-lg font-semibold border-b border-line pb-2">
              Benzer Yazılar
            </h3>
            <div className="space-y-3.5">
              {related.map((p) => {
                const rCat = getCategory(p.category);
                const rCleanImg = (p.image || "").replace(/^\/?uploads\//, "");
                const rImg = !p.image
                  ? null
                  : p.image.startsWith("http")
                  ? p.image
                  : `https://cdn.yaolmasaydi.com/${rCleanImg}`;

                return (
                  <Link
                    key={p.slug}
                    to="/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center gap-3 rounded-xl bg-paper p-2.5 transition-colors hover:bg-neutral-100 group border border-line/40"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-white/20">
                      {rImg ? (
                        <img
                          src={rImg}
                          alt={p.title}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center font-bold text-orange-500 text-xs">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="cat-pill mb-1 text-[0.6rem]" data-cat={p.category}>
                        {rCat?.name}
                      </span>
                      <p className="font-display text-xs font-semibold leading-snug text-fg group-hover:text-accent line-clamp-2">
                        {p.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </article>
    </SiteLayout>
  );
}
