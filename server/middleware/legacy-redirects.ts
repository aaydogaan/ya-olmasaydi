import { defineEventHandler, sendRedirect } from "h3";

/**
 * Eski WordPress URL'lerinden veya Google Görseller'den gelen
 * /wp-content/uploads/... ve /uploads/... isteklerini
 * kalıcı olarak (301) Cloudflare R2 CDN adresine yönlendirir.
 * Bu sayede 0 adet 404 hatası ve %100 SEO koruması sağlanır.
 */
export default defineEventHandler((event) => {
  const path = event.path || "";

  if (path.startsWith("/wp-content/uploads/")) {
    const clean = path.replace(/^\/wp-content\/uploads\//, "");
    return sendRedirect(event, `https://cdn.yaolmasaydi.com/${clean}`, 301);
  }

  if (path.startsWith("/uploads/")) {
    const clean = path.replace(/^\/uploads\//, "");
    return sendRedirect(event, `https://cdn.yaolmasaydi.com/${clean}`, 301);
  }
});
