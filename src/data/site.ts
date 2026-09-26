export const SITE = {
  name: "Ya Olmasaydı",
  tagline:
    "Hazır olun, dünyanın en ilginç hikayeleri sizlerle! ‘Ya Olmasaydı‘ serimizde sıra dışı konuları keşfedin.",
  email: "hello@yaolmasaydi.com",
  copyright: "© Telif Hakkı 2024, Tüm Hakları Saklıdır.",
  social: {
    x: "https://x.com/yaolmasaydicom/",
    facebook:
      "https://www.facebook.com/people/Ya-Olmasayd%C4%B1/61560369372118/",
    instagram: "https://www.instagram.com/yaolmasaydicom/",
  },
} as const;

export type CategorySlug =
  | "doga-ve-evren"
  | "canlilar-ve-ekosistem"
  | "tarih-ve-medeniyet"
  | "bilim-ve-teknoloji"
  | "kultur-ve-sanat"
  | "fantastik"
  | "gunluk-yasam"
  | "sizden-gelenler";

export const CATEGORIES: {
  slug: CategorySlug;
  name: string;
  color: string;
  description: string;
}[] = [
  {
    slug: "doga-ve-evren",
    name: "Doğa ve Evren",
    color: "#191970",
    description: "Evrenin derinliklerine ve doğanın gizemlerine dair içerikler.",
  },
  {
    slug: "canlilar-ve-ekosistem",
    name: "Canlılar ve Ekosistem",
    color: "#228b22",
    description: "Doğa ve ekosistem üzerine düşündürücü senaryolar.",
  },
  {
    slug: "tarih-ve-medeniyet",
    name: "Tarih ve Medeniyet",
    color: "#daa520",
    description: "Tarihin ve medeniyetin yokluğunda dünya nasıl olurdu?",
  },
  {
    slug: "bilim-ve-teknoloji",
    name: "Bilim ve Teknoloji",
    color: "#0074d9",
    description: "Bilimsel ve teknolojik gelişmelerin yokluğunda hayat nasıl olurdu?",
  },
  {
    slug: "kultur-ve-sanat",
    name: "Kültür ve Sanat",
    color: "#001f3f",
    description: "Kültür ve sanat dünyasının olmadığını hayal etmek.",
  },
  {
    slug: "fantastik",
    name: "Fantastik",
    color: "#ff7633",
    description: "Hayal gücünün sınırlarını zorlayan senaryolar.",
  },
  {
    slug: "gunluk-yasam",
    name: "Günlük Yaşam",
    color: "#09659b",
    description: "Günlük hayatın içinde hep var olan şeylerin eksikliği.",
  },
  {
    slug: "sizden-gelenler",
    name: "Sizden Gelenler",
    color: "#ea3535",
    description: "Ziyaretçilerimizin hayal gücünü kullanarak önerdiği özel içerikler.",
  },
];

export const NAV_LEFT = [
  CATEGORIES[0],
  CATEGORIES[1],
  CATEGORIES[2],
] as const;

export const NAV_RIGHT = [
  CATEGORIES[3],
  CATEGORIES[4],
  CATEGORIES[5],
] as const;

export const MOBILE_CATEGORIES = [
  CATEGORIES[3],
  CATEGORIES[1],
  CATEGORIES[0],
  CATEGORIES[2],
  CATEGORIES[6],
  CATEGORIES[7],
  CATEGORIES[5],
];

export const PAGE_LINKS = [
  { href: "/ya-podcast", label: "Ya Olmasaydı Podcast" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/yazar-ol", label: "Yazar Ol" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sartlar-ve-kosullar", label: "Şartlar ve Koşullar" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
];

export const LEGAL_LINKS = [
  { href: "/sartlar-ve-kosullar", label: "Şartlar ve Koşullar" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export type AuthorSlug = "recep" | "selman";

export const AUTHORS: Record<
  AuthorSlug,
  {
    slug: AuthorSlug;
    name: string;
    initials: string;
    role: string;
    bio: string;
    avatar: string;
  }
> = {
  recep: {
    slug: "recep",
    name: "Recep Aydoğan",
    initials: "RA",
    role: "Kurucu & Yazar",
    bio: "Ya Olmasaydı kurucusu. Tasarım, içerik, SEO ve teknik altyapı.",
    avatar: "/images/Recep-rastgel.webp",
  },
  selman: {
    slug: "selman",
    name: "Selman Aydoğan",
    initials: "SA",
    role: "Tasarım & Yazar",
    bio: "Ya Olmasaydı görsel tasarım ve içerik yazarı.",
    avatar: "/images/selman-rastgel.webp",
  },
};

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
