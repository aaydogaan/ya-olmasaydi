import React, { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { adminLoginAction } from "@/lib/admin-actions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-[#0d0e12] p-4 text-neutral-100 font-sans selection:bg-orange-500/30">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900/80 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/25">
            <Lock className="size-7" />
          </div>

          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
            Ya Olmasaydı Yönetim
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Devam etmek için yönetici güvenlik şifrenizi girin.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300">Yönetici Şifresi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Doğrulanıyor...</span>
              </>
            ) : (
              <>
                <span>Panele Giriş Yap</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-[0.7rem] text-neutral-500">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>256-bit HMAC Uçtan Uca Güvenli Oturum</span>
        </div>
      </div>
    </div>
  );
}
