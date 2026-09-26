import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { IconArrow, IconClock, IconFacebook, IconInstagram, IconX } from "@/components/icons";
import { AwardCard } from "@/components/home/AwardCard";
import { Cover } from "@/components/post/Cover";
import { featuredPosts, formatRelativeTr, latestPosts, readTime } from "@/data/posts";
import { AUTHORS, SITE, getCategory } from "@/data/site";

export function Sidebar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function search(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/ara", search: { q: q.trim() } });
  }

  return (
    <aside className="space-y-8">
      <section>
        <h3 className="mb-4 font-display text-[1.5rem] font-semibold">Sıra Sende!</h3>
        <form onSubmit={search} className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ne olmasaydı?"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm outline-none"
            aria-label="Ne olmasaydı?"
          />
          <button
            type="submit"
            className="flex size-9 items-center justify-center rounded-full bg-brand text-inverse"
            aria-label="Gönder"
          >
            <IconArrow className="size-4" />
          </button>
        </form>
      </section>

      <section>
        <p className="text-xs tracking-wide text-muted">Bize Katılın</p>
        <h3 className="mb-3 font-display text-lg font-semibold">Takip Et</h3>
        <div className="flex gap-2">
          <a href={SITE.social.x} className="social-round" target="_blank" rel="noreferrer" aria-label="X">
            <IconX className="size-3.5" />
          </a>
          <a href={SITE.social.facebook} className="social-round bg-fb" target="_blank" rel="noreferrer" aria-label="Facebook">
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

      <section>
        <p className="text-xs text-muted">En popüler içeriklerimiz</p>
        <h3 className="mb-4 font-display text-lg font-semibold">Öne Çıkan Yazılar</h3>
        <ul className="space-y-4">
          {featuredPosts().map((p) => {
            const cat = getCategory(p.category);
            return (
              <li key={p.slug} className="border-b border-line pb-4 last:border-0">
                <span className="cat-pill mb-2" data-cat={p.category}>
                  {cat?.name}
                </span>
                <Link to="/$slug" params={{ slug: p.slug }} className="mt-1 block font-display text-[0.95rem] font-semibold leading-snug hover:text-accent">
                  {p.title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{AUTHORS[p.author].name}</span>
                  <span className="inline-flex items-center gap-1">
                    <IconClock className="size-3" />
                    {readTime(p)} dk
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <p className="text-xs text-muted">Blogumuza eklenen en yeni içerikler.</p>
        <h3 className="mb-4 font-display text-lg font-semibold">Son Eklenenler</h3>
        <ol className="space-y-4">
          {latestPosts(4).map((p) => {
            const cat = getCategory(p.category);
            return (
              <li key={p.slug} className="flex gap-3">
                <Link
                  to="/$slug"
                  params={{ slug: p.slug }}
                  className="relative size-14 shrink-0 overflow-hidden rounded-full"
                >
                  <Cover category={p.category} slug={p.slug} title={p.title} mark={false} className="h-full" />
                </Link>
                <div className="min-w-0">
                  <span className="cat-pill mb-1" data-cat={p.category}>
                    {cat?.name}
                  </span>
                  <Link to="/$slug" params={{ slug: p.slug }} className="mt-1 block font-display text-sm font-semibold leading-snug hover:text-accent">
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {AUTHORS[p.author].name} · {formatRelativeTr(p.publishedAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </aside>
  );
}
