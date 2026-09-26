import fs from 'fs';

const BASE_URL = 'https://yaolmasaydi.com';

const posts = JSON.parse(fs.readFileSync('./src/data/wp-posts.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('./src/data/wp-categories.json', 'utf8'));
const pages = JSON.parse(fs.readFileSync('./src/data/wp-pages.json', 'utf8'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Anasayfa -->
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

// Static pages
const corePages = [
  'ya-podcast',
  'hakkimizda',
  'iletisim',
  'yazar-ol',
  'sartlar-ve-kosullar',
  'gizlilik-politikasi',
  'senin-hayatin-nasil-degisirdi',
];

for (const p of corePages) {
  xml += `  <url>
    <loc>${BASE_URL}/${p}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

// Categories
for (const c of categories) {
  xml += `  <url>
    <loc>${BASE_URL}/kategori/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Posts (all 103 posts with exact dates and images)
for (const post of posts) {
  const lastmod = (post.updated_at || post.created_at || '').split(' ')[0] || '2024-05-01';
  xml += `  <url>
    <loc>${BASE_URL}/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>`;

  if (post.image) {
    const imgUrl = `${BASE_URL}/uploads/${post.image}`;
    xml += `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>`;
  }

  xml += `
  </url>
`;
}

xml += `</urlset>`;

fs.writeFileSync('./public/sitemap.xml', xml, 'utf8');
console.log(`✅ public/sitemap.xml oluşturuldu! (${posts.length} yazı, ${categories.length} kategori)`);

// Also generate clean robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync('./public/robots.txt', robotsTxt, 'utf8');
console.log('✅ public/robots.txt oluşturuldu!');
