import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/home/CtaBanner";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { Sidebar } from "@/components/home/Sidebar";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PostCard } from "@/components/post/PostCard";
import { homepagePosts, POSTS } from "@/data/posts";
import { getPublicAllPostsAction } from "@/lib/public-actions";

export const Route = createFileRoute("/")({
  loader: async () => {
    const dbPosts = await getPublicAllPostsAction();
    return { dbPosts };
  },
  component: Home,
});

function Home() {
  const { dbPosts } = Route.useLoaderData();
  const allPosts = dbPosts || POSTS;
  const featured = dbPosts ? allPosts.slice(0, 10) : homepagePosts();
  const rest = dbPosts ? allPosts.slice(10) : POSTS.filter((p) => !p.homepage);
  const [showOlder, setShowOlder] = useState(false);

  return (
    <SiteLayout>
      <HeroCarousel />
      <div className="site-wrap py-8">
        <h2 className="mb-6 font-display text-[1.65rem] font-semibold">Haftanın Hitleri</h2>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_300px] lg:gap-10">
          <div>
            <div className="grid gap-8 md:grid-cols-2">
              {featured.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
              {showOlder
                ? rest.map((p) => <PostCard key={p.slug} post={p} />)
                : null}
            </div>
            {!showOlder && rest.length > 0 ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowOlder(true)}
                  className="btn-black"
                >
                  Eski Yazılar +
                </button>
              </div>
            ) : null}
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
