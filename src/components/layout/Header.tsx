import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import {
  IconFacebook,
  IconInstagram,
  IconMenu,
  IconSearch,
  IconUser,
  IconX,
} from "@/components/icons";
import { NAV_LEFT, NAV_RIGHT, SITE } from "@/data/site";

export function Header({
  onMenu,
  onSearch,
}: {
  onMenu: () => void;
  onSearch: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg shadow-(--shadow-header)">
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <button
          type="button"
          className="flex size-11 items-center justify-center"
          onClick={onMenu}
          aria-label="Menü"
        >
          <IconMenu className="size-6" />
        </button>
        <Logo width={110} />
        <button
          type="button"
          className="flex size-11 items-center justify-center"
          onClick={onSearch}
          aria-label="Ara"
        >
          <IconSearch className="size-5" />
        </button>
      </div>

      <div className="site-wrap hidden h-[4.6rem] items-center lg:flex">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex size-10 items-center justify-center text-dim"
            onClick={onMenu}
            aria-label="Menü"
          >
            <IconMenu className="size-5" />
          </button>
          <div className="flex items-center gap-3 text-fg">
            <a href={SITE.social.x} target="_blank" rel="noreferrer" aria-label="X">
              <IconX className="size-3.5" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <IconFacebook className="size-3.5" />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconInstagram className="size-3.5" />
            </a>
          </div>
          <nav className="ml-1 min-w-0">
            <ul className="flex items-center gap-4">
              {NAV_LEFT.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/kategori/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-[0.8rem] font-medium whitespace-nowrap text-fg hover:text-muted"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="shrink-0 px-3">
          <Logo width={120} />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <nav className="min-w-0">
            <ul className="flex items-center gap-4">
              {NAV_RIGHT.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/kategori/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-[0.8rem] font-medium whitespace-nowrap text-fg hover:text-muted"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={onSearch}
            className="flex size-9 items-center justify-center rounded-full border border-line text-dim hover:border-fg"
            aria-label="Ara"
          >
            <IconSearch className="size-4" />
          </button>
          <Link
            to="/yazar-ol"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 font-display text-[0.7rem] font-semibold tracking-wide whitespace-nowrap text-inverse hover:bg-fg"
          >
            <IconUser className="size-3.5" />
            Yazar Ol
          </Link>
        </div>
      </div>
    </header>
  );
}
