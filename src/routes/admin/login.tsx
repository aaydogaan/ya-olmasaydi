import React, { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { adminLoginAction } from "@/lib/admin-actions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Lütfen yönetici şifresini girin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await adminLoginAction({ data: { password } });
      if (res.success) {
        router.navigate({ to: "/admin" as any });
      } else {
        setError(res.message || "Hatalı şifre!");
      }
    } catch (err: any) {
      setError(err?.message || "Giriş yapılırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 font-sans overflow-hidden bg-gradient-to-b from-[#bfe4f7] via-[#d7effb] to-[#edf7fd]">
      {/* Subtle Sky & Cloud Atmosphere Ambient Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric radial glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-white/70 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-20 w-[600px] h-[400px] bg-white/50 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -right-20 w-[600px] h-[400px] bg-white/50 rounded-full blur-2xl" />
        {/* Soft light rings like in the screenshot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-white/40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[940px] h-[940px] rounded-full border border-white/25 pointer-events-none" />
      </div>

      {/* Main Crisp White Card */}
      <div className="relative w-full max-w-[400px] rounded-[36px] bg-white/95 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(25,65,110,0.14)] border border-white/80 backdrop-blur-md">
        {/* Top Logo / Favicon Badge */}
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white shadow-md shadow-sky-900/5 border border-slate-100 p-2.5 transition-transform hover:scale-105 duration-200">
            <img
              src="/favicon.svg"
              alt="Ya Olmasaydı"
              className="size-8 object-contain"
            />
          </div>

          {/* Ya Olmasaydı Brand Logo */}
          <div className="mt-4 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Ya Olmasaydı"
              className="h-6 w-auto object-contain opacity-90"
            />
          </div>

          <h1 className="mt-3 font-display text-xl font-bold tracking-tight text-neutral-900">
            Yönetici Girişi
          </h1>
          <p className="mt-1 text-xs text-neutral-500 leading-relaxed max-w-[280px] mx-auto">
            İçerik yönetim paneline erişmek için şifrenizi giriniz.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-600">
            <AlertCircle className="size-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="relative flex items-center rounded-2xl bg-slate-100/80 border border-slate-200/80 px-3.5 py-3 transition-all focus-within:bg-white focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-sky-100/60">
              <Lock className="size-4 text-neutral-400 shrink-0 mr-2.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yönetici Şifresi"
                autoFocus
                className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                aria-label={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18191d] py-3.5 text-sm font-semibold text-white shadow-md shadow-neutral-900/10 hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <>
                <span>Panele Giriş Yap</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
