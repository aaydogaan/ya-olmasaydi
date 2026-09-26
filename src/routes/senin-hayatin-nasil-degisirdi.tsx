import { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/senin-hayatin-nasil-degisirdi")({
  head: () => ({
    meta: [
      { title: "Senin Hayatın Nasıl Değişirdi? - Ya Olmasaydı" },
      {
        name: "description",
        content:
          "Dünyada var olan bir şey bir gün yok olsa senin hayatın nasıl değişirdi? Kendi özgün senaryonuzu bizimle paylaşın.",
      },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/senin-hayatin-nasil-degisirdi" }],
  }),
  component: StoryPage,
});

function StoryPage() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Hikâyeniz ön kayıt olarak bize ulaştı. Teşekkürler!");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader title="Senin Hayatın Nasıl Değişirdi?" kicker="Sıra sende" />
      <div className="site-wrap max-w-2xl py-12">
        {/* Banner image */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-line/60 shadow-sm">
          <img
            src="/images/Senin-hayat%C4%B1n-nas%C4%B1l-de%C4%9Fi%C5%9Firdi-Banner.jpg"
            alt="Senin Hayatın Nasıl Değişirdi?"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Yakında Açılıyor Bildirimi */}
        <div className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-50/80 p-4 text-xs text-amber-950 flex items-center gap-3 shadow-2xs">
          <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs shrink-0">
            ✦
          </span>
          <span className="leading-relaxed">
            <strong>Bu Bölüm Çok Yakında Açılıyor!</strong> Okuyucuların kaleminden çıkan hikâyeler yakında burada yayımlanacak. Kendi senaryonuzu şimdiden gönderebilirsiniz.
          </span>
        </div>

        <p className="mb-8 text-base text-dim leading-relaxed">
          Senin hikayeni duymak için sabırsızlanıyoruz. Dünyada hep var sandığın bir şey bir sabah yok olsa, hayatın nasıl değişirdi?
        </p>

        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-paper p-6 md:p-8 border border-line/60 shadow-xs">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Ad
              <input name="first" required className="input-line mt-1.5" />
            </label>
            <label className="block text-sm font-medium">
              Soyad
              <input name="last" required className="input-line mt-1.5" />
            </label>
          </div>
          <label className="block text-sm font-medium">
            E-posta
            <input name="email" type="email" required className="input-line mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            Bizi nereden duydunuz?
            <select name="source" className="input-line mt-1.5" defaultValue="">
              <option value="" disabled>
                Seçiniz
              </option>
              <option>Instagram</option>
              <option>X (Twitter)</option>
              <option>Facebook</option>
              <option>Google Arama</option>
              <option>Arkadaş / Tavsiye</option>
              <option>Diğer</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Hikâyeniz
            <textarea
              name="story"
              required
              className="input-line min-h-40 resize-y mt-1.5"
              placeholder="Ya … olmasaydı, benim hayatım…"
            />
          </label>
          <button type="submit" className="btn-black w-full sm:w-auto cursor-pointer">
            Hikâyemi Gönder
          </button>
        </form>
      </div>
    </SiteLayout>
  );
}
