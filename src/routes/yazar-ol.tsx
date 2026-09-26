import { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/yazar-ol")({
  head: () => ({
    meta: [
      { title: "Yazar Ol - Ya Olmasaydı" },
      {
        name: "description",
        content:
          "Ya Olmasaydı ekibine yazar olarak katılın! Özgün senaryolarınızı ve düşündürücü içeriklerinizi bizimle paylaşın.",
      },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/yazar-ol" }],
  }),
  component: WriterPage,
});

function WriterPage() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Ön başvurunuz alındı. Yakında sizinle iletişime geçeceğiz!");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader title="Yazar Ol" kicker="Hoş Geldin" />
      <div className="site-wrap max-w-2xl py-12">
        {/* Minimal Yakında Açılıyor Uyarısı */}
        <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-50/80 p-4 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs shrink-0">
              ✦
            </span>
            <span className="leading-relaxed">
              <strong>Yazar Alımları Yakında Açılıyor!</strong> Ön başvuru için aşağıdaki formu doldurabilir veya Instagram üzerinden bize ulaşabilirsiniz.
            </span>
          </div>
          <a
            href="https://www.instagram.com/recepaydogaann"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-inverse hover:bg-neutral-800 transition-colors shrink-0"
          >
            <span>@recepaydogaann</span>
            <span>↗</span>
          </a>
        </div>

        <p className="mb-8 text-base text-dim leading-relaxed">
          Bugün yeni bir gün. Bugün senin günün. Kendi ‘Ya Olmasaydı‘ hikayenizi yazmaya başlayın. Yeni yazılarınızı oluşturmak için ön başvuru yapın; ekibimiz sizinle iletişime geçsin.
        </p>

        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-paper p-6 md:p-8 border border-line/60 shadow-xs">
          <label className="block text-sm font-medium">
            Ad Soyad
            <input name="name" required className="input-line mt-1.5" placeholder="Adınız Soyadınız" />
          </label>
          <label className="block text-sm font-medium">
            E-posta
            <input name="email" type="email" required className="input-line mt-1.5" placeholder="ornek@domain.com" />
          </label>
          <label className="block text-sm font-medium">
            Konu önerisi (Ya … olmasaydı?)
            <input name="topic" required className="input-line mt-1.5" placeholder="Örn: Ya kahve olmasaydı?" />
          </label>
          <label className="block text-sm font-medium">
            Kısa örnek paragraf
            <textarea
              name="sample"
              required
              className="input-line min-h-36 resize-y mt-1.5"
              placeholder="Yazmayı düşündüğünüz konudan birkaç cümle..."
            />
          </label>
          <button type="submit" className="btn-black w-full sm:w-auto cursor-pointer">
            Ön Başvuruyu Gönder
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
