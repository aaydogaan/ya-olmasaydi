import React, { useEffect, useState, FormEvent } from "react";
import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { IconArrow, IconClock, IconFacebook, IconInstagram, IconX } from "@/components/icons";
import { AwardCard } from "@/components/home/AwardCard";
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
  POSTS,
} from "@/data/posts";
import { AUTHORS, SITE, getCategory } from "@/data/site";
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
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: desc,
      image: [imgUrl],
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        "@type": "Person",
        name: AUTHORS[post.author]?.name || "Recep Aydoğan",
      },
      publisher: {
        "@type": "Organization",
        name: "Ya Olmasaydı",
        logo: {
          "@type": "ImageObject",
          url: "https://yaolmasaydi.com/images/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    };

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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
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
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/ara", search: { q: q.trim() } });
  }

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

  // Guarantee 4 related posts for bottom section and sidebar (newest first)
  const sortedAll = [...POSTS].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  const sameCat = sortedAll.filter((p) => p.slug !== post.slug && p.category === post.category);
  const diffCat = sortedAll.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const bottomRelated = [...sameCat, ...diffCat].slice(0, 4);
  const sidebarRelated = [...sameCat, ...diffCat].slice(0, 4);

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

            {/* Benzer Yazılar (Bottom Section - 4 Posts) */}
            <div className="mt-12 border-t border-line/80 pt-8">
              <h3 className="mb-6 font-display text-xl font-semibold text-fg">
                Benzer Yazılar
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {bottomRelated.map((p) => {
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
                      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper p-3 transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 border border-white/20">
                        {rImg ? (
                          <img
                            src={rImg}
                            alt={p.title}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center font-bold text-orange-500">
                            ?
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5 flex-1 flex flex-col justify-between">
                        <div>
                          <span
                            className="cat-pill text-[9px] px-1.5 py-0.5 mb-1 inline-block"
                            data-cat={p.category}
                          >
                            {rCat?.name}
                          </span>
                          <h4 className="font-display text-sm font-bold text-fg leading-snug group-hover:text-accent line-clamp-2">
                            {p.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-[0.72rem] text-muted">
                          {AUTHORS[p.author]?.name || "Recep Aydoğan"} · {formatRelativeTr(p.publishedAt)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Comments Box */}
            <CommentBox slug={post.slug} seed={post.comments} />
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            {/* Sıra Sende! Search */}
            <section>
              <h3 className="mb-4 font-display text-[1.4rem] font-semibold">Sıra Sende!</h3>
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5"
              >
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ne olmasaydı?"
                  className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm outline-none"
                  aria-label="Ne olmasaydı?"
                />
                <button
                  type="submit"
                  className="flex size-9 items-center justify-center rounded-full bg-brand text-inverse cursor-pointer"
                  aria-label="Gönder"
                >
                  <IconArrow className="size-4" />
                </button>
              </form>
            </section>

            {/* Takip Et */}
            <section>
              <p className="text-xs tracking-wide text-muted">Bize Katılın</p>
              <h3 className="mb-3 font-display text-lg font-semibold">Takip Et</h3>
              <div className="flex gap-2">
                <a
                  href={SITE.social.x}
                  className="social-round"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                >
                  <IconX className="size-3.5" />
                </a>
                <a
                  href={SITE.social.facebook}
                  className="social-round bg-fb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <IconFacebook className="size-3.5" />
                </a>
                <a
                  href={SITE.social.instagram}
                  className="social-round bg-linear-to-br from-ig-from via-pin to-cat-kultur"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <IconInstagram className="size-3.5" />
                </a>
              </div>
            </section>

            <AwardCard />

            {/* Benzer Yazılar Sidebar */}
            <section>
              <p className="text-xs text-muted">Aynı kategorideki içerikler</p>
              <h3 className="mb-4 font-display text-lg font-semibold">Benzer Yazılar</h3>
              <div className="space-y-3.5">
                {sidebarRelated.map((p) => {
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
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border-2 border-white shadow-sm">
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
                        <span
                          className="cat-pill text-[9px] px-1.5 py-0.5 mb-1 inline-block"
                          data-cat={p.category}
                        >
                          {rCat?.name}
                        </span>
                        <p className="font-display text-[0.85rem] font-bold leading-snug text-fg group-hover:text-accent line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </SiteLayout>
  );
}
