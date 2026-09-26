import { FormEvent, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/iletisim")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    toast.success("İletiniz alındı. En kısa sürede döneceğiz.");
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <PageHeader title="İletişim" />
      <div className="site-wrap max-w-xl py-12">
        <p className="mb-8 text-dim">
          Soru, öneri veya “ya olmasaydı” konunuz mu var? Formu doldurun ya da doğrudan{" "}
          <a className="text-accent" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>{" "}
          adresine yazın.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <label className="block text-sm">
            Adınız
            <input name="name" required className="input-line" />
          </label>
          <label className="block text-sm">
            E-posta adresiniz
            <input name="email" type="email" required className="input-line" />
          </label>
          <label className="block text-sm">
            Konu
            <input name="subject" required className="input-line" />
          </label>
          <label className="block text-sm">
            İletiniz (tercihe bağlı)
            <textarea name="message" className="input-line min-h-32 resize-y" />
          </label>
          <button type="submit" className="btn-black">
            Gönder
          </button>
        </form>
        {sent ? <p className="mt-4 text-sm text-cat-canli">Teşekkürler, mesajınız kaydedildi.</p> : null}
      </div>
    </SiteLayout>
  );
}
