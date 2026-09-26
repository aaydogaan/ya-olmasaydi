import { FormEvent, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconUp,
  IconX,
} from "@/components/icons";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/post/Avatar";
import { editorPicks, likedPosts } from "@/data/posts";
import { AUTHORS, SITE, getCategory } from "@/data/site";

function SocialRow({ filled = false }: { filled?: boolean }) {
  const cls = filled
    ? "social-round"
    : "inline-flex size-8 items-center justify-center text-fg hover:text-muted";
  return (
    <div className="flex items-center gap-2">
      <a href={SITE.social.x} className={cls} target="_blank" rel="noreferrer" aria-label="X">
        <IconX className="size-3.5" />
      </a>
      <a
        href={SITE.social.facebook}
        className={filled ? "social-round bg-fb" : cls}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
      >
        <IconFacebook className="size-3.5" />
      </a>
      <a
        href={SITE.social.instagram}
        className={filled ? "social-round bg-linear-to-br from-ig-from via-pin to-cat-kultur" : cls}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
      >
        <IconInstagram className="size-3.5" />
      </a>
    </div>
  );
}

export function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("İsim ve e-posta gerekli.");
      return;
    }
    toast.success("Abone oldunuz. Keşfedilmeyi bekleyen senaryolar yolda.");
    setName("");
    setEmail("");
  }

  return (
    <footer className="mt-8 bg-paper text-fg border-t border-line/60">
      <div className="site-wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Col */}
        <div>
          <Logo width={160} className="mb-4" />
          <p className="mb-6 text-sm leading-relaxed text-dim">
            Hazır olun, dünyanın en ilginç hikayeleri sizlerle! ‘
            <strong>Ya Olmasaydı</strong>‘ serimizde sıra dışı konuları keşfedin.
          </p>
          <h3 className="mb-3 font-display text-base font-semibold">Takipte Kal</h3>
          <SocialRow filled />
          <ul className="mt-6 space-y-2 text-sm text-dim">
            <li>
              <Link to="/sartlar-ve-kosullar" className="hover:text-fg">
                Şartlar ve Koşullar
              </Link>
            </li>
            <li>
              <Link to="/gizlilik-politikasi" className="hover:text-fg">
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link to="/hakkimizda" className="hover:text-fg">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link to="/iletisim" className="hover:text-fg">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* Beğenilen Yazılar With Thumbnails */}
        <div>
          <h3 className="font-display text-base font-semibold">Beğenilen Yazılar</h3>
          <p className="mb-4 text-xs text-muted">En çok beğenilen içerikler</p>
          <ul className="space-y-3.5">
            {likedPosts().map((p) => {
              const cat = getCategory(p.category);
              const cleanImg = (p.image || "").replace(/^\/?uploads\//, "");
              const imgSrc = !p.image
                ? null
                : p.image.startsWith("http")
                ? p.image
                : `https://cdn.yaolmasaydi.com/${cleanImg}`;

              return (
                <li key={p.slug} className="flex items-center gap-3">
                  <Link
                    to="/$slug"
                    params={{ slug: p.slug }}
                    className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-900 border border-line"
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p.title}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-bold text-orange-500 text-xs">
                        ?
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 text-[0.65rem] font-semibold tracking-wider text-muted uppercase">
                      {cat?.name}
                    </p>
                    <Link
                      to="/$slug"
                      params={{ slug: p.slug }}
                      className="font-display text-xs font-semibold leading-snug hover:text-accent line-clamp-2"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-1 text-[0.7rem] text-muted">
                      {AUTHORS[p.author]?.name || "Recep Aydoğan"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Editörün Favorileri */}
        <div>
          <h3 className="font-display text-base font-semibold">Editörün Favorileri</h3>
          <p className="mb-4 text-xs text-muted">Editörün beğendikleri</p>
          <ol className="space-y-4">
            {editorPicks().map((p, i) => {
              const cat = getCategory(p.category);
              return (
                <li key={p.slug} className="flex gap-3">
                  <Link
                    to="/$slug"
                    params={{ slug: p.slug }}
                    className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/20"
                  >
                    <span className="absolute top-0 left-0 z-10 flex size-4.5 items-center justify-center rounded-full bg-ink text-[0.6rem] font-bold text-inverse">
                      {i + 1}
                    </span>
                    <Avatar slug={p.author} size={48} link={false} />
                  </Link>
                  <div className="min-w-0">
                    <span className="cat-pill mb-1 text-[0.6rem]" data-cat={p.category}>
                      {cat?.name}
                    </span>
                    <Link
                      to="/$slug"
                      params={{ slug: p.slug }}
                      className="mt-1 block font-display text-xs font-semibold leading-snug hover:text-accent line-clamp-2"
                    >
                      {p.title}
                    </Link>
                    <p className="text-[0.7rem] text-muted">
                      {AUTHORS[p.author]?.name || "Recep Aydoğan"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Newsletter & Contact Col */}
        <div>
          <h3 className="font-display text-base font-semibold">Bülten</h3>
          <p className="mb-4 text-sm text-dim">Keşfedilmeyi bekleyen senaryolar posta kutunda!</p>
          <form onSubmit={subscribe} className="space-y-3">
            <label className="block text-sm">
              İsim *
              <input
                className="input-line"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="block text-sm">
              E-posta adresi *
              <input
                type="email"
                className="input-line"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-black w-full cursor-pointer">
              Abone ol!
            </button>
          </form>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-5 flex items-center gap-2 text-sm text-dim hover:text-fg"
          >
            <IconMail className="size-4" />
            {SITE.email}
          </a>
        </div>
      </div>

      {/* Bottom Bar: Copyright | Owner | Socials */}
      <div className="border-t border-line">
        <div className="site-wrap flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted sm:flex-row">
          <p>{SITE.copyright}</p>

          <div className="flex items-center gap-1.5 text-xs">
            <span>Site Sahibi & Kurucusu:</span>
            <a
              href="https://www.instagram.com/recepaydogaann"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-fg hover:text-accent transition-colors"
            >
              Recep Aydoğan
            </a>
          </div>

          <SocialRow />
        </div>
      </div>

      <button
        type="button"
        className="fixed right-5 bottom-5 z-30 flex size-11 items-center justify-center rounded-full bg-ink text-inverse shadow-lg cursor-pointer hover:bg-neutral-800 transition-colors"
        aria-label="Yukarı"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <IconUp className="size-5" />
      </button>
    </footer>
  );
}
