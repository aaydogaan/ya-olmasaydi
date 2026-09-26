import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/sartlar-ve-kosullar")({ component: TermsPage });

function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader title="Şartlar ve Koşullar" />
      <div className="site-wrap prose-yo max-w-3xl py-12">
        <p>Kullanım Koşulları</p>
        <p>
          Web sitesi yaolmasaydi.com (“Web Sitesi”) ziyaretçileri için geçerli olan şartlar ve koşulları belirler. Web Sitesi’ni kullanarak bu şartları kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, lütfen Web Sitesi’ni kullanmaktan vazgeçiniz.
        </p>
        <h2>İçerik</h2>
        <p>
          Web Sitesi’nde bulunan tüm içerik, metinler, grafikler, logolar, ikonlar, resimler, ses klipleri, dijital indirmeler, veri derlemeleri ve yazılımlar, yaolmasaydi.com’un mülkiyetindedir ve telif hakkı yasaları tarafından korunmaktadır.
        </p>
        <h2>Kullanıcı Davranışları</h2>
        <p>Web Sitesi’ni kullanırken aşağıdaki davranışlardan kaçınmalısınız:</p>
        <ul className="mb-6 list-disc space-y-1 pl-5">
          <li>Yasa dışı, tehdit edici, iftira niteliğinde, ahlaksız, pornografik veya müstehcen içerik yayımlamak.</li>
          <li>Diğer kullanıcıların Web Sitesi’ni kullanmasını engellemek veya sınırlamak.</li>
          <li>Web Sitesi’nin güvenliğini tehlikeye atmak veya Web Sitesi’ne zarar vermek.</li>
        </ul>
        <h2>Üçüncü Taraf Bağlantıları</h2>
        <p>
          Web Sitesi, üçüncü taraf sitelere bağlantılar içerebilir. Bu bağlantılar sadece kolaylık sağlamak amacıyla verilmiştir ve bu sitelerin içeriklerinden yaolmasaydi.com sorumlu değildir.
        </p>
        <h2>Fikri Mülkiyet Hakları</h2>
        <p>
          Web Sitesi’nde yer alan tüm içerik ve materyaller, yaolmasaydi.com’a veya lisans verenlerine aittir. Bu içerik, yazılı izin olmadan ticari amaçlarla kullanılamaz.
        </p>
        <h2>Sorumluluk Sınırlaması</h2>
        <p>
          Web Sitesi’ni kullanımınızdan doğan herhangi bir zarar veya kayıptan yaolmasaydi.com sorumlu tutulamaz. Web Sitesi, “olduğu gibi” ve “mevcut olduğu şekilde” sunulmaktadır.
        </p>
        <h2>Formlar ve Kişisel Bilgiler</h2>
        <ul className="mb-6 list-disc space-y-2 pl-5">
          <li>“Senin Hayatın Nasıl Değişirdi” formu: ad, soyad, e-posta ve anket bilgileri yalnızca deneyimi geliştirmek için kullanılır.</li>
          <li>“Ya…..Olmasaydı” konu öneri formu: kişisel bilgi toplama amacı taşımaz.</li>
          <li>İletişim formu: isim, e-posta, konu ve mesaj sorularınızı yanıtlamak içindir.</li>
        </ul>
        <h2>Yürürlükteki Kanun</h2>
        <p>
          Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Anlaşmazlıklar Türkiye mahkemelerinin münhasır yargı yetkisine tabidir.
        </p>
        <p>E-posta: hello@yaolmasaydi.com</p>
        <p>Güncellenme Tarihi: 28 Ağustos 2025</p>
      </div>
    </SiteLayout>
  );
}
