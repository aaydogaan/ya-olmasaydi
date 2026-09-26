import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import {
  IconMenu,
  IconSearch,
  IconUser,
} from "@/components/icons";
import { NAV_LEFT, NAV_RIGHT } from "@/data/site";

export function Header({
  onMenu,
  onSearch,
}: {
  onMenu: () => void;
  onSearch: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 shadow-(--shadow-header) backdrop-blur-md">
      {/* Mobile Topbar */}
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <button
          type="button"
          className="flex size-11 items-center justify-center cursor-pointer text-fg"
          onClick={onMenu}
          aria-label="Menü"
        >
          <IconMenu className="size-6" />
        </button>
        <Logo width={110} />
        <button
          type="button"
          className="flex size-11 items-center justify-center cursor-pointer text-fg"
          onClick={onSearch}
          aria-label="Ara"
        >
          <IconSearch className="size-5" />
        </button>
      </div>

      {/* Desktop Topbar */}
      <div className="site-wrap hidden h-[4.8rem] items-center justify-between lg:flex">
        {/* Left Side: Mobile Menu Trigger & Left Navigation (Aligned towards center logo) */}
        <div className="flex min-w-0 flex-1 items-center justify-start gap-4">
          <button
            type="button"
            className="flex size-10 items-center justify-center text-dim hover:text-fg transition-colors cursor-pointer"
            onClick={onMenu}
            aria-label="Menü"
          >
            <IconMenu className="size-5" />
          </button>

          <nav className="min-w-0 flex-1 flex justify-end pr-4">
            <ul className="flex items-center gap-6">
              {NAV_LEFT.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/kategori/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-[0.925rem] font-semibold tracking-tight whitespace-nowrap text-fg hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Center Logo */}
        <div className="shrink-0 px-4">
          <Logo width={128} />
        </div>

        {/* Right Side: Right Navigation (Aligned from center logo outwards) & Actions */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-5">
          <nav className="min-w-0 flex-1 flex justify-start pl-4">
            <ul className="flex items-center gap-6">
              {NAV_RIGHT.map((item) => (
                <li key={item.slug}>
                  <Link
                    to="/kategori/$slug"
                    params={{ slug: item.slug }}
                    className="font-display text-[0.925rem] font-semibold tracking-tight whitespace-nowrap text-fg hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSearch}
              className="flex size-9 items-center justify-center rounded-full border border-line text-dim hover:border-fg hover:text-fg transition-all cursor-pointer shadow-2xs"
              aria-label="Ara"
              title="Sitede Ara"
            >
              <IconSearch className="size-4" />
            </button>
            <Link
              to="/yazar-ol"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-display text-[0.75rem] font-semibold tracking-wide whitespace-nowrap text-inverse hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <IconUser className="size-3.5" />
              <span>Yazar Ol</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
