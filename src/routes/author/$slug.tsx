import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Avatar } from "@/components/post/Avatar";
import { PostCard } from "@/components/post/PostCard";
import { getPostsByAuthor } from "@/data/posts";
import { AUTHORS, type AuthorSlug } from "@/data/site";

export const Route = createFileRoute("/author/$slug")({
  loader: ({ params }) => {
    const author = AUTHORS[params.slug as AuthorSlug];
    if (!author) throw notFound();
    return { author, posts: getPostsByAuthor(author.slug) };
  },
  component: AuthorPage,
});

function AuthorPage() {
  const { author, posts } = Route.useLoaderData();
  return (
    <SiteLayout>
      <header className="border-b border-line bg-paper py-12">
        <div className="site-wrap flex flex-col items-center text-center">
          <Avatar slug={author.slug} size={80} link={false} />
          <h1 className="mt-4 font-display text-3xl font-semibold">{author.name}</h1>
          <p className="mt-1 text-sm text-muted">{author.role}</p>
          <p className="mt-3 max-w-lg text-sm text-dim">{author.bio}</p>
        </div>
      </header>
      <div className="site-wrap grid gap-8 py-10 md:grid-cols-2">
        {posts.map((p: any) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </SiteLayout>
  );
}
