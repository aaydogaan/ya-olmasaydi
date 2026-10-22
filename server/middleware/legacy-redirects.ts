import { defineEventHandler, sendRedirect } from "h3";

/**
 * Eski WordPress URL'lerinden veya Google Görseller'den gelen
 * /wp-content/uploads/... ve /uploads/... isteklerini
 * kalıcı olarak (301) Cloudflare R2 CDN adresine yönlendirir.
 * Bu sayede 0 adet 404 hatası ve %100 SEO koruması sağlanır.
 */
export default defineEventHandler((event) => {
  const path = event.path || "";

  // 1. WordPress legacy media redirects to CDN
  if (path.startsWith("/wp-content/uploads/")) {
    const clean = path.replace(/^\/wp-content\/uploads\//, "");
    return sendRedirect(event, `https://cdn.yaolmasaydi.com/${clean}`, 301);
  }

  if (path.startsWith("/uploads/")) {
    const clean = path.replace(/^\/uploads\//, "");
    return sendRedirect(event, `https://cdn.yaolmasaydi.com/${clean}`, 301);
  }

  // 2. Sitemap and RSS feed redirects
  const [pathname, search] = path.split("?");
  const qs = search ? `?${search}` : "";

  if (pathname === "/sitemap_index.xml" || pathname === "/sitemap_index.xml/") {
    return sendRedirect(event, "/sitemap.xml", 301);
  }

  if (pathname.endsWith("/feed") || pathname.endsWith("/feed/")) {
    return sendRedirect(event, "/sitemap.xml", 301);
  }

  // 3. WordPress category URL migration (/category/xyz -> /kategori/xyz)
  if (pathname.startsWith("/category/")) {
    const rest = pathname.replace(/^\/category\//, "").replace(/\/+$/, "");
    return sendRedirect(event, `/kategori/${rest}${qs}`, 301);
  }

  // 4. Trailing slash 301 permanent redirect (consolidates PageRank & canonical URLs)
  if (
    pathname.length > 1 &&
    pathname.endsWith("/") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/__")
  ) {
    const clean = pathname.replace(/\/+$/, "");
    return sendRedirect(event, `${clean}${qs}`, 301);
  }
});
