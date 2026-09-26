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
    role: "Yazar",
    bio: "",
    slug: "recep",
    initials: "RA",
  };
  const minutes = readTime(post);
  const related = relatedPosts(post);
  const url = typeof window !== "undefined" ? window.location.href : `/${post.slug}`;

  return (
    <SiteLayout>
      <article>
        <div className="relative isolate min-h-[22rem] overflow-hidden md:min-h-[28rem]">
          <Cover
            category={post.category}
            slug={post.slug}
            title={post.title}
            image={post.image}
            mark={false}
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
            <h1 className="font-display text-3xl leading-tight font-semibold md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-inverse/90">
              <span className="flex items-center gap-2">
                <Avatar slug={post.author} size={44} />
                <Link to="/author/$slug" params={{ slug: post.author }} className="font-medium">
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

        <div className="site-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
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
            <div className="mt-10 flex gap-4 rounded-md bg-paper p-5">
              <Avatar slug={post.author} size={64} />
              <div>
                <p className="font-display text-lg font-semibold">{author.name}</p>
                <p className="text-sm text-muted">{author.role}</p>
                <p className="mt-2 text-sm text-dim">{author.bio}</p>
              </div>
            </div>
            <CommentBox slug={post.slug} seed={post.comments} />
          </div>
          <aside className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Benzer Yazılar</h3>
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/$slug"
                params={{ slug: p.slug }}
                className="block rounded-md bg-paper p-4 hover:text-accent"
              >
                <span className="cat-pill mb-2" data-cat={p.category}>
                  {getCategory(p.category)?.name}
                </span>
                <p className="font-display font-semibold">{p.title}</p>
              </Link>
            ))}
          </aside>
        </div>
      </article>
    </SiteLayout>
  );
}
