import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/ya-podcast")({
  head: () => ({
    meta: [
      { title: "Ya Olmasaydı Podcast - Dinle" },
      {
        name: "description",
        content:
          "Ya Olmasaydı serisinin sesli hali: Bilim, tarih, evren ve alternatif dünyalar hakkında sesli bölümler.",
      },
      { property: "og:title", content: "Ya Olmasaydı Podcast - Dinle" },
      { property: "og:url", content: "https://yaolmasaydi.com/ya-podcast" },
    ],
    links: [{ rel: "canonical", href: "https://yaolmasaydi.com/ya-podcast" }],
  }),
  component: PodcastPage,
});

function PodcastPage() {
  return (
    <SiteLayout>
      <PageHeader title="Ya Olmasaydı Podcast" kicker="Dinle" />
      <div className="site-wrap max-w-2xl py-12">
        <p className="mb-6 text-lg text-dim">
          Yazıların sesli hâli yolda. Her bölüm, “ya olmasaydı” sorusunu bir sohbet masasına taşıyacak: bilim, tarih, günlük hayat ve biraz da fantastik.
        </p>
        <div className="rounded-md bg-paper p-8 text-center">
          <p className="font-display text-xl font-semibold">Yakında</p>
          <p className="mt-2 text-sm text-muted">
            Bölümler yayınlandığında bülten ve sosyal hesaplarımızdan duyurulacak.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
