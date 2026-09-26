import React, { useState } from "react";
import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import {
  FileText,
  Folder,
  Users,
  Search,
  PlusCircle,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  adminCheckSessionAction,
  adminGetDashboardAction,
  adminGetPostsAction,
  adminDeletePostAction,
} from "@/lib/admin-actions";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const session = await adminCheckSessionAction();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" as any });
    }
    const [stats, postsData] = await Promise.all([
      adminGetDashboardAction(),
      adminGetPostsAction({ data: { limit: 500 } }),
    ]);
    return { stats, initialPosts: postsData };
  },
  component: AdminDashboardPage,
});

const ITEMS_PER_PAGE = 15;

function AdminDashboardPage() {
  const data = Route.useLoaderData() as any;
  const stats = data.stats;
  const initialPosts = data.initialPosts;
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>(initialPosts.items || []);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter posts client-side
  const filteredPosts = posts.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.author_name && p.author_name.toLowerCase().includes(q))
    );
  });

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı yazıyı kalıcı olarak silmek istediğinize emin misiniz?`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await adminDeletePostAction({ data: id });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Silme başarısız: ${err?.message || "Bilinmeyen hata"}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <AdminLayout activeTab="dashboard">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Yönetim Paneli
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Sitenizdeki tüm içerikleri, görselleri ve SEO ayarlarını buradan yönetin.
          </p>
        </div>

        <Link
          to={"/admin/yeni-yazi" as any}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition-all cursor-pointer"
        >
          <PlusCircle className="size-4" />
          <span>Yeni Yazı Ekle</span>
        </Link>
      </div>

      {/* Stats Cards Grid (3 Clean Cards) */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Toplam Yazı</span>
            <FileText className="size-4 text-orange-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-white">
            {posts.length}
          </p>
          <span className="text-[0.7rem] text-emerald-400 font-medium">Tümü Aktif & Yayında</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Kategoriler</span>
            <Folder className="size-4 text-blue-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-white">
            {stats.totalCategories}
          </p>
          <span className="text-[0.7rem] text-neutral-400 font-medium">Düzenli Taksonomi</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Yazarlar</span>
            <Users className="size-4 text-purple-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-white">
            {stats.totalAuthors}
          </p>
          <span className="text-[0.7rem] text-neutral-400 font-medium">Recep Aydoğan & Selman Aydoğan</span>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md overflow-hidden">
        {/* Table Filters Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 p-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Yazı, yazar veya başlık ara..."
              className="w-full rounded-xl border border-white/10 bg-neutral-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto text-xs text-neutral-400">
            <span>Toplam: <strong className="text-white">{filteredPosts.length}</strong> yazı</span>
            <span>•</span>
            <span>Sayfa <strong className="text-white">{validCurrentPage}</strong> / {totalPages}</span>
          </div>
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-neutral-950/60 text-neutral-400 font-medium">
              <tr>
                <th className="py-3.5 pl-4 pr-2">Görsel</th>
                <th className="py-3.5 px-3">Başlık & URL</th>
                <th className="py-3.5 px-3">Kategori</th>
                <th className="py-3.5 px-3">Yazar</th>
                <th className="py-3.5 px-3">Tarih</th>
                <th className="py-3.5 px-3">Durum</th>
                <th className="py-3.5 pl-3 pr-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-500">
                    Arama kriterine uygun yazı bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => {
                  const imgClean = (post.cover_image || "").replace(/^\/?uploads\//, "");
                  const imgSrc = !post.cover_image
                    ? null
                    : post.cover_image.startsWith("http")
                    ? post.cover_image
                    : `https://cdn.yaolmasaydi.com/${imgClean}`;

                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3 pl-4 pr-2">
                        <div className="relative size-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0 border border-white/10">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={post.title}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center font-bold text-orange-500 text-xs">
                              ?
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-xs sm:max-w-md">
                        <p className="font-medium text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                          {post.title}
                        </p>
                        <p className="text-[0.7rem] text-neutral-500 truncate mt-0.5">
                          /{post.slug}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[0.7rem] font-medium text-neutral-300">
                          {post.category_name || "Genel"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-neutral-300 font-medium">
                        {post.author_name || "Recep Aydoğan"}
                      </td>

                      <td className="py-3 px-3 text-neutral-400 text-[0.7rem]">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3 text-neutral-500" />
                          <span>
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString("tr-TR")
                              : "-"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-400 border border-emerald-500/20">
                          <span className="size-1 rounded-full bg-emerald-400"></span>
                          <span>Yayında</span>
                        </span>
                      </td>

                      <td className="py-3 pl-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Sitede Gör"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>

                          <Link
                            to={`/admin/duzenle/${post.id}` as any}
                            title="Düzenle"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-orange-400 transition-colors"
                          >
                            <Edit3 className="size-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={isDeleting === post.id}
                            title="Sil"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            {isDeleting === post.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 p-4 text-xs text-neutral-400">
            <div>
              Toplam <strong className="text-white">{filteredPosts.length}</strong> yazıdan{" "}
              <strong className="text-white">
                {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredPosts.length)}
              </strong>{" "}
              arası gösteriliyor
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-neutral-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
                <span>Önceki</span>
              </button>

              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - validCurrentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && page - prev > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-1 text-neutral-600">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[28px] h-7 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            page === validCurrentPage
                              ? "bg-orange-500 text-white font-semibold shadow-sm"
                              : "border border-white/5 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-neutral-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Sonraki</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
