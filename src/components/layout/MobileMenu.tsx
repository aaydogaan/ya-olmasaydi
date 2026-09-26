import { Link } from "@tanstack/react-router";
import { IconClose, IconFacebook, IconInstagram, IconX } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MOBILE_CATEGORIES, SITE } from "@/data/site";

const PAGES = [
  { to: "/ya-podcast" as const, label: "Ya Olmasaydı Podcast" },
  { to: "/hakkimizda" as const, label: "Hakkımızda" },
  { to: "/yazar-ol" as const, label: "Yazar Ol" },
  { to: "/iletisim" as const, label: "İletişim" },
  { to: "/sartlar-ve-kosullar" as const, label: "Şartlar ve Koşullar" },
  { to: "/gizlilik-politikasi" as const, label: "Gizlilik Politikası" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <button className="absolute inset-0 bg-ink/40" aria-label="Kapat" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto bg-bg p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo width={130} />
          <button type="button" className="flex size-10 items-center justify-center" onClick={onClose} aria-label="kapalı">
            <IconClose className="size-5" />
          </button>
        </div>
        <h3 className="mb-3 font-display text-sm font-semibold">Kategoriler</h3>
        <ul className="mb-8 space-y-2">
          {MOBILE_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                to="/kategori/$slug"
                params={{ slug: c.slug }}
                onClick={onClose}
                className="block py-1.5 text-[0.95rem] text-fg hover:text-accent"
              >
                {c.name}
                {c.slug === "sizden-gelenler" ? " ⭐️" : ""}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/senin-hayatin-nasil-degisirdi" onClick={onClose} className="block py-1.5 text-[0.95rem] hover:text-accent">
              Senin Hayatın Nasıl Değişirdi?
            </Link>
          </li>
        </ul>
        <h3 className="mb-3 font-display text-sm font-semibold">Menü</h3>
        <ul className="mb-8 space-y-2">
          {PAGES.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={onClose} className="block py-1.5 text-[0.95rem] hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="mb-3 font-display text-sm font-semibold">Bizlere Katılın</h3>
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
      </aside>
    </div>
  );
}
