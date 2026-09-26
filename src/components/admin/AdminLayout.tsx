import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ExternalLink,
  LogOut,
  Database,
  Cloud,
} from "lucide-react";
import { adminLogoutAction } from "@/lib/admin-actions";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: "dashboard" | "posts" | "new-post";
}

export function AdminLayout({ children, activeTab = "dashboard" }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm("Yönetim panelinden çıkmak istediğinize emin misiniz?")) {
      await adminLogoutAction();
      router.navigate({ to: "/admin/login" as any });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 font-sans selection:bg-orange-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#0d0e12]/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/" target="_blank" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Ya Olmasaydı"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[0.65rem] font-semibold text-orange-400 border border-orange-500/20">
              YÖNETİM PANELİ
            </span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink className="size-3.5" />
            <span>Siteyi Görüntüle</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            title="Çıkış Yap"
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-neutral-950/40 p-4 hidden md:flex md:flex-col md:justify-between">
          <div className="space-y-1">
            <Link
              to={"/admin" as any}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to={"/admin/yeni-yazi" as any}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "new-post"
                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <PlusCircle className="size-4" />
              <span>Yeni Yazı Yaz</span>
            </Link>

            <Link
              to={"/admin" as any}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileText className="size-4" />
              <span>Tüm Yazılar</span>
            </Link>
          </div>

          {/* Panel Bilgileri (PostgreSQL & Cloudflare R2 Status) */}
          <div className="pt-6 border-t border-white/10 space-y-2.5">
            <div className="px-1 text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-500">
              Panel Bilgileri
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                <Database className="size-3.5 shrink-0" />
                <span className="font-medium">PostgreSQL: Aktif</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-400">
                <Cloud className="size-3.5 shrink-0" />
                <span className="font-medium">Cloudflare R2 CDN</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
