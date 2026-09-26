import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Avatar } from "@/components/post/Avatar";
import { AUTHORS } from "@/data/site";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda - Ya Olmasaydı" },
      {
        name: "description",
        content:
          "Ya Olmasaydı, dünyada var olan şeylerin yokluğunu hayal ederek eğlenceli ve bilgilendirici içerikler sunan özgün bir blog platformudur.",
      },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/hakkimizda" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader title="Hakkımızda" kicker="Ya Olmasaydı" />
      <div className="site-wrap prose-yo max-w-3xl py-12">
        <p className="text-lg leading-relaxed text-dim">
          <strong>Ya Olmasaydı</strong>, 03 Mart 2024 tarihinde <strong>Recep Aydoğan</strong> ve <strong>Selman Aydoğan</strong> tarafından kurulmuş bir blog sitesidir. Amacımız, dünyada hep var olan şeylerin olmadığını hayal ederek eğlenceli ve bilgilendirici içerikler üretmek. Sitemiz, bu özgün bakış açısıyla okuyucularımıza alternatif bir dünya sunarak hem eğlendirmeyi hem de düşündürmeyi hedefliyor.
        </p>

        <h2>TRT Geleceğin İletişimcileri Yarışması’nda Birincilik</h2>
        <p>
          2024 yılında katıldığı TRT Geleceğin İletişimcileri Yarışması’nda <strong>1. olarak</strong> önemli bir başarıya imza atmıştır. Bu ödül, ekibimizin özgün fikirlerini ve yaratıcı içeriklerini takdir eden prestijli bir kazanım olarak bize büyük bir gurur kaynağı olmuştur.
        </p>
        <div className="my-6 overflow-hidden rounded-2xl border border-line/60 shadow-md">
          <img
            src="/images/birincilik.jpg"
            alt="TRT Geleceğin İletişimcileri Birincilik Ödülü"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <h2>Türkiye Gazeteciler Cemiyeti Aydın Doğan Genç İletişimcileri Yarışması</h2>
        <p>
          İnternet Sitesi / İnternet Yayıncılığı dalında kazandığımız 1.lik ödülüyle bir başka önemli başarıya daha imza attık. Bu ödül de, ekip olarak başarımızın ve kaliteli içerik üretme yolundaki azmimizin bir göstergesi oldu.
        </p>

        {/* Ödül Görselleri Galerisi */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-xl border border-line shadow-xs">
            <img
              src="https://cdn.yaolmasaydi.com/2025/03/aydin-dogan-odul.webp"
              alt="Aydın Doğan Ödül Töreni"
              className="w-full h-56 object-cover"
              loading="lazy"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-line shadow-xs">
            <img
              src="https://cdn.yaolmasaydi.com/2024/11/TRT1-e1731606793981.webp"
              alt="TRT Geleceğin İletişimcileri Töreni"
              className="w-full h-56 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <h2>Ekibimiz</h2>
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {Object.values(AUTHORS).map((a) => (
            <div
              key={a.slug}
              className="flex items-center gap-4 rounded-2xl bg-paper p-5 border border-line/60 shadow-2xs"
            >
              <Avatar slug={a.slug} size={64} link={false} />
              <div>
                <p className="font-display text-base font-bold text-fg">{a.name}</p>
                <p className="text-xs text-muted font-medium">{a.role}</p>
                <p className="mt-1 text-xs text-dim leading-relaxed">{a.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Ne Yapıyoruz?</h2>
        <p>
          Sitemizde, dünyada var olan şeylerin yokluğunu hayal ederek, “Ya olmasaydı?” sorusuna yanıt arıyoruz. Amacımız, okuyucularımıza bu senaryolarla hem eğlenceli bir deneyim yaşatmak hem de düşündürücü içerikler sunmak. Her hafta farklı kategorilerde içerikler üreterek geniş bir yelpazede ilgi çekici konulara değiniyoruz.
        </p>

        <h2>Neden Buradayız?</h2>
        <p>
          Ya Olmasaydı, sıradan bilgi platformlarından farklı olarak, okuyucularımıza farklı bir bakış açısı sunmak amacıyla kurulmuştur. Hedefimiz, siz değerli okuyucularımıza keyifli ve düşündürücü bir deneyim sunmak.
        </p>
        <p>
          İletişim:{" "}
          <a href="mailto:hello@yaolmasaydi.com" className="text-accent font-semibold">
            hello@yaolmasaydi.com
          </a>
        </p>
      </div>
    </SiteLayout>
  );
}
