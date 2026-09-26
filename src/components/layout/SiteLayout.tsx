import { useState, type ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      {children}
      <Footer />
    </div>
  );
}
