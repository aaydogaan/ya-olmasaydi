import fs from 'fs';

const rawPosts = JSON.parse(fs.readFileSync('./src/data/wp-posts.json', 'utf8'));

// Helper to convert WordPress HTML content into ContentBlocks
function parseWpHtml(html) {
  if (!html) return [];
  // Strip wp comments
  let clean = html.replace(/<!--[\s\S]*?-->/g, '');

  const blocks = [];
  // Match headings, blockquotes, paragraphs
  const regex = /<(h[234]|blockquote|p)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  let foundAny = false;

  while ((match = regex.exec(clean)) !== null) {
    foundAny = true;
    const tag = match[1].toLowerCase();
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;

    if (tag === 'h2') blocks.push({ type: 'h2', text });
    else if (tag === 'h3' || tag === 'h4') blocks.push({ type: 'h3', text });
    else if (tag === 'blockquote') blocks.push({ type: 'quote', text });
    else blocks.push({ type: 'p', text });
  }

  if (!foundAny) {
    // fallback by double newlines
    const paras = clean.split(/\n\s*\n/).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    for (const p of paras) {
      blocks.push({ type: 'p', text: p });
    }
  }

  return blocks;
}

// Map author logins to site authors
function resolveAuthor(author) {
  const login = (author?.login || '').toLowerCase();
  const name = (author?.name || '').toLowerCase();
  if (login.includes('recep') || name.includes('recep')) return 'recep';
  if (login.includes('selman') || name.includes('selman')) return 'selman';
  if (login.includes('hazal') || name.includes('hazal')) return 'hazal';
  if (login.includes('furkan') || name.includes('furkan')) return 'furkan';
  return 'recep'; // default to founder
}

// Map category slug to site CategorySlug
function resolveCategory(cats) {
  if (!cats || cats.length === 0) return 'doga-ve-evren';
  for (const c of cats) {
    const s = c.slug.toLowerCase();
    if (s === 'doga-ve-evren') return 'doga-ve-evren';
    if (s === 'canlilar-ve-ekosistem') return 'canlilar-ve-ekosistem';
    if (s === 'tarih-ve-medeniyet') return 'tarih-ve-medeniyet';
    if (s === 'bilim-ve-teknoloji') return 'bilim-ve-teknoloji';
    if (s === 'kultur-ve-sanat') return 'kultur-ve-sanat';
    if (s === 'fantastik') return 'fantastik';
    if (s === 'gunluk-yasam') return 'gunluk-yasam';
    if (s === 'sizden-gelenler' || s === 'hayatin-nasil-degisti') return 'sizden-gelenler';
  }
  return 'doga-ve-evren';
}

const heroesList = new Set([
  'ya-agaclar-olmasaydi',
  'ya-fotosentez-olmasaydi',
  'ya-yalanlar-olmasaydi',
  'ya-istanbul-fethedilmeseydi',
  'ya-newton-olmasaydi',
  'ya-yercekimi-olmasaydi',
  'ya-michelangelo-olmasaydi',
  'ya-mevsimler-olmasaydi',
  'ya-arilar-olmasaydi',
  'ya-yildizlar-olmasaydi',
  'ya-dunya-olmasaydi',
  'ya-paralar-olmasaydi',
  'ya-renkler-olmasaydi',
  'ya-kuslar-olmasaydi',
  'ya-antibiyotik-olmasaydi',
]);

const processedPosts = rawPosts.map((p, index) => {
  const authorSlug = resolveAuthor(p.author);
  const catSlug = resolveCategory(p.categories);
  const blocks = parseWpHtml(p.content);
  const publishedDate = (p.created_at || '').split(' ')[0] || '2024-05-01';

  let cleanExcerpt = (p.excerpt || '').replace(/<[^>]+>/g, '').trim();
  if (!cleanExcerpt && blocks.length > 0) {
    cleanExcerpt = blocks[0].text.substring(0, 160) + '...';
  }

  return {
    slug: p.slug,
    title: p.title,
    category: catSlug,
    author: authorSlug,
    publishedAt: publishedDate,
    comments: p.comment_count || 0,
    excerpt: cleanExcerpt,
    image: p.image || null,
    hero: heroesList.has(p.slug),
    homepage: index < 24, // first 24 on homepage
    tags: p.tags && p.tags.length > 0 ? p.tags : ['Ya Olmasaydı'],
    content: blocks,
    seo: p.seo || { title: p.title, description: cleanExcerpt }
  };
});

const tsCode = `import {
  AUTHORS,
  CATEGORIES,
  type AuthorSlug,
  type CategorySlug,
} from "./site";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  category: CategorySlug;
  author: AuthorSlug;
  publishedAt: string;
  comments: number;
  excerpt: string;
  image?: string | null;
  content: ContentBlock[];
  tags: string[];
  hero?: boolean;
  homepage?: boolean;
  seo?: {
    title: string;
    description: string;
    focus_keyword?: string;
  };
};

export const POSTS: Post[] = ${JSON.stringify(processedPosts, null, 2)};

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(slug: string) {
  return POSTS.filter((p) => p.category === slug).sort(byDate);
}

export function getPostsByAuthor(slug: string) {
  return POSTS.filter((p) => p.author === slug).sort(byDate);
}

export function homepagePosts() {
  return POSTS.filter((p) => p.homepage).sort(byDate);
}

export function heroPosts() {
  const heroes = POSTS.filter((p) => p.hero);
  if (heroes.length > 0) return heroes;
  return POSTS.slice(0, 8);
}

export function latestPosts(n = 5) {
  return [...POSTS].sort(byDate).slice(0, n);
}

export function featuredPosts() {
  return POSTS.slice(0, 4);
}

export function editorPicks() {
  return POSTS.slice(4, 7);
}

export function likedPosts() {
  return POSTS.slice(7, 10);
}

export function relatedPosts(post: Post, n = 3) {
  return POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  )
    .sort(byDate)
    .slice(0, n);
}

export function searchPosts(q: string) {
  const s = q.trim().toLocaleLowerCase("tr");
  if (!s) return [];
  return POSTS.filter((p) => {
    const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? "";
    const author = AUTHORS[p.author]?.name ?? "";
    const blob = \`\${p.title} \${p.excerpt} \${cat} \${author} \${p.tags.join(" ")}\`.toLocaleLowerCase("tr");
    return blob.includes(s);
  });
}

function byDate(a: Post, b: Post) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function readTime(post: Post) {
  const words = post.content
    .map((b) => b.text)
    .join(" ")
    .split(/\\s+/)
    .filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
}

export function formatRelativeTr(iso: string, now = new Date()) {
  const then = new Date(iso + "T12:00:00");
  const diff = now.getTime() - then.getTime();
  const days = Math.max(0, Math.floor(diff / 86400000));
  if (days < 1) return "Bugün";
  if (days < 7) return \`\${days} gün Önce\`;
  const months = Math.floor(days / 30);
  if (months < 1) return \`\${Math.floor(days / 7)} hf Önce\`;
  if (months < 12) return \`\${months} ay Önce\`;
  const years = Math.floor(months / 12);
  return \`\${years} yıl Önce\`;
}
`;

fs.writeFileSync('./src/data/posts.ts', tsCode, 'utf8');
console.log('✅ src/data/posts.ts tüm 103 gerçek yazıyla güncellendi!');
