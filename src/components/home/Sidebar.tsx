import { FormEvent, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { IconArrow, IconClock, IconFacebook, IconInstagram, IconX } from "@/components/icons";
import { AwardCard } from "@/components/home/AwardCard";
import { featuredPosts, formatRelativeTr, latestPosts, readTime } from "@/data/posts";
import { AUTHORS, SITE, getCategory } from "@/data/site";

function PostThumb({ image, title, category }: { image?: string | null; title: string; category: string }) {
  const cleanImg = (image || "").replace(/^\/?uploads\//, "");
  const src = !image ? null : image.startsWith("http") ? image : `https://cdn.yaolmasaydi.com/${cleanImg}`;
  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className="size-full object-cover"
        loading="lazy"
      />
    );
  }
  // Fallback: coloured block based on category
  const colors: Record<string, string> = {
    "doga-ve-evren": "#191970",
    "canlilar-ve-ekosistem": "#228b22",
    "tarih-ve-medeniyet": "#daa520",
    "bilim-ve-teknoloji": "#0074d9",
    "kultur-ve-sanat": "#001f3f",
    "fantastik": "#ff7633",
    "gunluk-yasam": "#09659b",
    "sizden-gelenler": "#ea3535",
  };
  return (
    <div
      className="flex size-full items-center justify-center text-white font-bold text-xs"
      style={{ background: colors[category] ?? "#333" }}
    >
      ?
    </div>
  );
}

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

      {/* Öne Çıkan Yazılar — with thumbnails */}
      <section>
        <p className="text-xs text-muted">En popüler içeriklerimiz</p>
        <h3 className="mb-4 font-display text-lg font-semibold">Öne Çıkan Yazılar</h3>
        <ul className="space-y-3.5">
          {featuredPosts().map((p) => {
            const cat = getCategory(p.category);
            return (
              <li key={p.slug} className="flex items-center gap-3">
                <Link
                  to="/$slug"
                  params={{ slug: p.slug }}
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-sm bg-neutral-900"
                >
                  <PostThumb image={p.image} title={p.title} category={p.category} />
                </Link>
                <div className="min-w-0 flex-1">
                  <span className="cat-pill mb-1" data-cat={p.category}>
                    {cat?.name}
                  </span>
                  <Link
                    to="/$slug"
                    params={{ slug: p.slug }}
                    className="mt-1 block font-display text-[0.85rem] font-semibold leading-snug hover:text-accent line-clamp-2"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[0.72rem] text-muted">
                    <span>{AUTHORS[p.author].name}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <IconClock className="size-3" />
                      {readTime(p)} dk
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Son Eklenenler — with thumbnails */}
      <section>
        <p className="text-xs text-muted">Blogumuza eklenen en yeni içerikler.</p>
        <h3 className="mb-4 font-display text-lg font-semibold">Son Eklenenler</h3>
        <ol className="space-y-3.5">
          {latestPosts(4).map((p) => {
            const cat = getCategory(p.category);
            return (
              <li key={p.slug} className="flex items-center gap-3">
                <Link
                  to="/$slug"
                  params={{ slug: p.slug }}
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-sm bg-neutral-900"
                >
                  <PostThumb image={p.image} title={p.title} category={p.category} />
                </Link>
                <div className="min-w-0 flex-1">
                  <span className="cat-pill mb-1" data-cat={p.category}>
                    {cat?.name}
                  </span>
                  <Link
                    to="/$slug"
                    params={{ slug: p.slug }}
                    className="mt-1 block font-display text-sm font-semibold leading-snug hover:text-accent line-clamp-2"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[0.72rem] text-muted mt-0.5">
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
