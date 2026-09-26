import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AUTHORS } from "@/data/site";

export const Route = createFileRoute("/hakkimizda")({ component: AboutPage });

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader title="Hakkımızda" kicker="Ya Olmasaydı" />
      <div className="site-wrap prose-yo max-w-3xl py-12">
        <p>
          Ya Olmasaydı, 03 Mart 2024 tarihinde Recep Aydoğan, Selman Aydoğan ve Muhammed Furkan Yağız tarafından kurulmuş bir blog sitesidir. Amacımız, dünyada hep var olan şeylerin olmadığını hayal ederek eğlenceli ve bilgilendirici içerikler üretmek. Sitemiz, bu özgün bakış açısıyla okuyucularımıza alternatif bir dünya sunarak hem eğlendirmeyi hem de düşündürmeyi hedefliyor.
        </p>
        <h2>TRT Geleceğin İletişimcileri Yarışması’nda Birincilik</h2>
        <p>
          2024 yılında katıldığı TRT Geleceğin İletişimcileri Yarışması’nda 1. olarak önemli bir başarıya imza atmıştır. Bu ödül, ekibimizin özgün fikirlerini ve yaratıcı içeriklerini takdir eden prestijli bir kazanım olarak bize büyük bir gurur kaynağı olmuştur.
        </p>
        <h2>Türkiye Gazeteciler Cemiyeti Aydın Doğan Genç İletişimcileri Yarışması</h2>
        <p>
          İnternet Sitesi / İnternet Yayıncılığı dalında kazandığımız 1.lik ödülüyle bir başka önemli başarıya daha imza attık. Bu ödül de, ekip olarak başarımızın ve kaliteli içerik üretme yolundaki azmimizin bir göstergesi oldu.
        </p>
        <h2>Ekibimiz</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-[1.05rem] text-dim">
          {Object.values(AUTHORS).map((a) => (
            <li key={a.slug}>
              <strong className="text-fg">{a.name}:</strong> {a.bio}
            </li>
          ))}
        </ul>
        <h2>Ne Yapıyoruz?</h2>
        <p>
          Sitemizde, dünyada var olan şeylerin yokluğunu hayal ederek, “Ya olmasaydı?” sorusuna yanıt arıyoruz. Amacımız, okuyucularımıza bu senaryolarla hem eğlenceli bir deneyim yaşatmak hem de düşündürücü içerikler sunmak. Her hafta farklı kategorilerde içerikler üreterek geniş bir yelpazede ilgi çekici konulara değiniyoruz.
        </p>
        <h2>Neden Buradayız?</h2>
        <p>
          Ya Olmasaydı, sıradan bilgi platformlarından farklı olarak, okuyucularımıza farklı bir bakış açısı sunmak amacıyla kurulmuştur. Hedefimiz, siz değerli okuyucularımıza keyifli ve düşündürücü bir deneyim sunmak.
        </p>
        <p>
          İletişim: <a href="mailto:hello@yaolmasaydi.com" className="text-accent">hello@yaolmasaydi.com</a>
        </p>
      </div>
    </SiteLayout>
  );
}
