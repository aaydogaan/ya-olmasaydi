import { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/senin-hayatin-nasil-degisirdi")({
  component: StoryPage,
});

function StoryPage() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Hikâyeniz bize ulaştı. Teşekkürler!");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader title="Senin Hayatın Nasıl Değişirdi?" kicker="Sıra sende" />
      <div className="site-wrap max-w-2xl py-12">
        <p className="mb-8 text-lg text-dim">
          Senin hikayeni duymak için sabırsızlanıyoruz. Dünyada hep var sandığın bir şey bir sabah yok olsa, hayatın nasıl değişirdi?
        </p>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              Ad
              <input name="first" required className="input-line" />
            </label>
            <label className="block text-sm">
              Soyad
              <input name="last" required className="input-line" />
            </label>
          </div>
          <label className="block text-sm">
            E-posta
            <input name="email" type="email" required className="input-line" />
          </label>
          <label className="block text-sm">
            Bizi nereden duydunuz?
            <select name="source" className="input-line" defaultValue="">
              <option value="" disabled>
                Seçiniz
              </option>
              <option>Instagram</option>
              <option>X</option>
              <option>Facebook</option>
              <option>Google</option>
              <option>Arkadaş / okul</option>
              <option>Diğer</option>
            </select>
          </label>
          <label className="block text-sm">
            Hikâyeniz
            <textarea name="story" required className="input-line min-h-40 resize-y" placeholder="Ya … olmasaydı, benim hayatım…" />
          </label>
          <button type="submit" className="btn-black">
            Hikâyemi Gönder
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
