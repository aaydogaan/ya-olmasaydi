import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/gizlilik-politikasi")({
  head: () => ({
    meta: [
      { title: "Gizlilik Politikası - Ya Olmasaydı" },
      {
        name: "description",
        content:
          "yaolmasaydi.com gizlilik politikası: Kullanıcı verilerinin güvenliği, çerezler ve gizlilik şartları hakkında detaylı bilgi.",
      },
      { property: "og:title", content: "Gizlilik Politikası - Ya Olmasaydı" },
      { property: "og:url", content: "https://yaolmasaydi.com/gizlilik-politikasi" },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/gizlilik-politikasi" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader title="Gizlilik Politikası" />
      <div className="site-wrap prose-yo max-w-3xl py-12">
        <p>
          Bu gizlilik politikası, yaolmasaydi.com web sitemizi ziyaret eden kullanıcıların kişisel bilgilerini nasıl topladığımız, kullandığımız ve koruduğumuz konusunda bilgi vermektedir.
        </p>
        <h2>Toplanan Bilgiler</h2>
        <h3>Kişisel Bilgiler</h3>
        <p>
          Web sitemizi ziyaret ettiğinizde, gönüllü olarak sağladığınız kişisel bilgiler toplanabilir. Bu bilgiler arasında adınız, e-posta adresiniz ve diğer iletişim bilgileriniz bulunabilir.
        </p>
        <h3>Otomatik Olarak Toplanan Bilgiler</h3>
        <p>
          Tarayıcınız tarafından sağlanan IP adresi, tarayıcı türü, ziyaret edilen sayfalar ve ziyaret süresi gibi bilgiler otomatik olarak toplanabilir.
        </p>
        <h2>Bilgilerin Kullanımı</h2>
        <ul className="mb-6 list-disc space-y-1 pl-5">
          <li>Web sitemizi iyileştirmek ve kullanıcı deneyimini geliştirmek.</li>
          <li>Sizinle iletişim kurmak ve sorularınıza yanıt vermek.</li>
          <li>Sitemizdeki içeriği kişiselleştirmek.</li>
          <li>Yasal gerekliliklere uymak ve kullanıcı güvenliğini sağlamak.</li>
        </ul>
        <h2>Çerezler</h2>
        <p>
          Çerezler, tarayıcınız tarafından bilgisayarınıza depolanan küçük veri dosyalarıdır. Kullanıcı tercihlerini saklamak ve sitemizin performansını analiz etmek için kullanılır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
        </p>
        <h2>Bilgilerin Paylaşımı</h2>
        <p>
          Topladığımız kişisel bilgileri, sizin açık rızanız olmadan üçüncü şahıslarla paylaşmayız, satmayız veya kiralamayız. Yasal gereklilikler veya güvenlik nedeniyle paylaşım gerekebilir.
        </p>
        <h2>Güvenlik</h2>
        <p>
          Kişisel bilgilerinizi korumak için uygun güvenlik önlemleri almaktayız. İnternet üzerinden yapılan hiçbir veri iletiminin tamamen güvenli olmadığını unutmamanız önemlidir.
        </p>
        <h2>İletişim</h2>
        <p>E-posta: hello@yaolmasaydi.com</p>
        <p>Güncellenme Tarihi: 28 Ağustos 2025</p>
      </div>
    </SiteLayout>
  );
}
