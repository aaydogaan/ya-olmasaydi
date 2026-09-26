import { Link } from "@tanstack/react-router";
import { IconClock } from "@/components/icons";
import { Avatar } from "@/components/post/Avatar";
import { Cover } from "@/components/post/Cover";
import { ShareIcons } from "@/components/post/ShareIcons";
import { formatRelativeTr, readTime, type Post } from "@/data/posts";
import { AUTHORS, getCategory } from "@/data/site";

export function PostCard({ post }: { post: Post }) {
  const cat = getCategory(post.category);
  const author = AUTHORS[post.author];
  const minutes = readTime(post);
  const url = `https://yaolmasaydi.com/${post.slug}/`;
  return (
    <article className="overflow-hidden rounded-[var(--radius-thumb)] bg-card shadow-(--shadow-post)">
      <Link to="/$slug" params={{ slug: post.slug }} className="relative block aspect-16/8 overflow-hidden">
        <Cover category={post.category} slug={post.slug} title={post.title} image={post.image} />
        <span className="cat-pill absolute top-3 right-3 z-10" data-cat={post.category}>
          {cat?.name}
        </span>
      </Link>
      <div className="p-6">
        <h3 className="font-display text-[1.45rem] font-semibold leading-snug md:text-[1.7rem]">
          <Link to="/$slug" params={{ slug: post.slug }} className="hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8rem] text-muted">
          <span className="flex items-center gap-2 text-fg">
            <Avatar slug={post.author} size={36} />
            <Link to="/author/$slug" params={{ slug: post.author }} className="font-medium text-fg hover:text-accent">
              {author.name}
            </Link>
          </span>
          <time dateTime={post.publishedAt}>{formatRelativeTr(post.publishedAt)}</time>
          <span>
            {post.comments} <span className="hidden sm:inline">Yorumlar</span>
          </span>
        </div>
        <div className="mt-3">
          <ShareIcons url={url} title={post.title} />
        </div>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link to="/$slug" params={{ slug: post.slug }} className="read-more">
            Okumaya devam et ›
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <IconClock className="size-3.5" />
            {minutes} dk
          </span>
        </div>
      </div>
    </article>
  );
}
