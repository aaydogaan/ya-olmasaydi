import { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/yazar-ol")({ component: WriterPage });

function WriterPage() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Başvurunuz alındı. Hikâyenizi okumak için sabırsızlanıyoruz.");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader title="Yazar Ol" kicker="Hoş Geldin" />
      <div className="site-wrap max-w-2xl py-12">
        <p className="mb-8 text-lg text-dim">
          Bugün yeni bir gün. Bugün senin günün. Kendi ‘Ya Olmasaydı‘ hikayenizi yazmaya başlayın. Yeni yazılarınızı oluşturmak için başvurun; ekibimiz sizinle iletişime geçsin.
        </p>
        <form onSubmit={submit} className="space-y-5 rounded-md bg-paper p-6 md:p-8">
          <label className="block text-sm">
            Ad Soyad
            <input name="name" required className="input-line" />
          </label>
          <label className="block text-sm">
            E-posta
            <input name="email" type="email" required className="input-line" />
          </label>
          <label className="block text-sm">
            Konu önerisi (Ya … olmasaydı?)
            <input name="topic" required className="input-line" placeholder="Ya kahve olmasaydı?" />
          </label>
          <label className="block text-sm">
            Kısa örnek paragraf
            <textarea name="sample" required className="input-line min-h-36 resize-y" />
          </label>
          <button type="submit" className="btn-black">
            Başvuruyu Gönder
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
