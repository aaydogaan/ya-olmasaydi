import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { parseSqlInsertValues } from './sql-parser.mjs';

const SQL_FILE = './wp-yedek/yaolmasa_wp95.sql';

async function extract() {
  console.log('🚀 WordPress veritabanı ayrıştırması başlatılıyor...');
  console.log(`📁 Dosya: ${SQL_FILE}`);

  const users = {}; // id -> { id, login, name, email }
  const terms = {}; // term_id -> { term_id, name, slug }
  const termTaxonomies = {}; // term_taxonomy_id -> { term_taxonomy_id, term_id, taxonomy, description }
  const rawRelationships = []; // [postId, ttId]
  const postMeta = {}; // post_id -> { thumbnail_id, yoast_title, yoast_desc, yoast_focuskw, attached_file }
  const attachments = {}; // attachment_id -> file path
  const posts = [];
  const pages = [];

  const fileStream = fs.createReadStream(SQL_FILE, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let lineCounter = 0;

  for await (const line of rl) {
    lineCounter++;

    if (line.startsWith('INSERT INTO `')) {
      const match = line.match(/^INSERT INTO `([^`]+)` VALUES\s*(.*);?$/);
      if (!match) continue;

      const tableName = match[1];
      const valuesStr = match[2];

      if (tableName === 'wpwv_users') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          const id = String(r[0]);
          users[id] = {
            id,
            login: r[1],
            name: r[9] || r[1],
            email: r[4],
          };
        }
      } else if (tableName === 'wpwv_terms') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          const id = String(r[0]);
          terms[id] = {
            term_id: id,
            name: r[1],
            slug: r[2],
          };
        }
      } else if (tableName === 'wpwv_term_taxonomy') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          const ttId = String(r[0]);
          const termId = String(r[1]);
          termTaxonomies[ttId] = {
            term_taxonomy_id: ttId,
            term_id: termId,
            taxonomy: r[2],
            description: r[3],
          };
        }
      } else if (tableName === 'wpwv_term_relationships') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          rawRelationships.push([String(r[0]), String(r[1])]);
        }
      } else if (tableName === 'wpwv_postmeta') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          const postId = String(r[1]);
          const key = r[2];
          const val = r[3];

          if (!postMeta[postId]) postMeta[postId] = {};

          if (key === '_thumbnail_id') {
            postMeta[postId].thumbnail_id = String(val);
          } else if (key === '_yoast_wpseo_title') {
            postMeta[postId].yoast_title = val;
          } else if (key === '_yoast_wpseo_metadesc') {
            postMeta[postId].yoast_desc = val;
          } else if (key === '_yoast_wpseo_focuskw') {
            postMeta[postId].yoast_focuskw = val;
          } else if (key === '_wp_attached_file') {
            postMeta[postId].attached_file = val;
            attachments[postId] = val;
          }
        }
      } else if (tableName === 'wpwv_posts') {
        const rows = parseSqlInsertValues(valuesStr);
        for (const r of rows) {
          const id = String(r[0]);
          const postType = r[20];
          const status = r[7];

          if (postType === 'attachment') {
            if (r[18]) attachments[id] = r[18];
          }

          if (status !== 'publish') continue;

          if (postType === 'post') {
            posts.push({
              id,
              author_id: String(r[1]),
              created_at: r[2],
              updated_at: r[14],
              content: r[4],
              title: r[5],
              excerpt: r[6],
              slug: r[11],
              comment_count: parseInt(r[22] || '0', 10),
            });
          } else if (postType === 'page') {
            pages.push({
              id,
              author_id: String(r[1]),
              created_at: r[2],
              updated_at: r[14],
              content: r[4],
              title: r[5],
              slug: r[11],
            });
          }
        }
      }
    }
  }

  // Now resolve relationships because all terms and taxonomies are loaded
  const postTaxonomies = {};
  for (const [postId, ttId] of rawRelationships) {
    if (!postTaxonomies[postId]) {
      postTaxonomies[postId] = { categories: [], tags: [] };
    }
    const tt = termTaxonomies[ttId];
    if (tt) {
      const term = terms[tt.term_id];
      if (term) {
        if (tt.taxonomy === 'category' && term.slug !== 'uncategorized') {
          postTaxonomies[postId].categories.push({
            name: term.name,
            slug: term.slug,
            description: tt.description,
          });
        } else if (tt.taxonomy === 'post_tag') {
          postTaxonomies[postId].tags.push({
            name: term.name,
            slug: term.slug,
          });
        }
      }
    }
  }

  console.log(`\n✅ Ayrıştırma tamamlandı!`);
  console.log(`👥 Bulunan Yazarlar: ${Object.keys(users).length}`);
  console.log(`🏷️  Bulunan Kategoriler/Etiketler: ${Object.keys(terms).length}`);
  console.log(`🔗 Bulunan İlişkiler: ${rawRelationships.length}`);
  console.log(`🖼️  Bulunan Ekler (Medya/Görseller): ${Object.keys(attachments).length}`);
  console.log(`📝 Yayınlanmış Yazılar (Posts): ${posts.length}`);
  console.log(`📄 Yayınlanmış Sayfalar (Pages): ${pages.length}`);

  // Resolve thumbnail, authors, categories for each post
  const fullPosts = posts.map((p) => {
    const meta = postMeta[p.id] || {};
    const tax = postTaxonomies[p.id] || { categories: [], tags: [] };
    const author = users[p.author_id] || { id: p.author_id, name: 'Ya Olmasaydı Ekibi', login: 'admin' };

    let imagePath = null;
    if (meta.thumbnail_id && attachments[meta.thumbnail_id]) {
      imagePath = attachments[meta.thumbnail_id];
    } else if (meta.thumbnail_id && postMeta[meta.thumbnail_id]?.attached_file) {
      imagePath = postMeta[meta.thumbnail_id].attached_file;
    }

    // Normalize image URL to relative uploads path if full URL
    if (imagePath && imagePath.includes('/wp-content/uploads/')) {
      imagePath = imagePath.split('/wp-content/uploads/')[1];
    }

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      created_at: p.created_at,
      updated_at: p.updated_at,
      author: {
        id: author.id,
        name: author.name,
        login: author.login,
      },
      categories: tax.categories,
      tags: tax.tags.map((t) => t.name),
      image: imagePath,
      comment_count: p.comment_count,
      seo: {
        title: meta.yoast_title || p.title,
        description: meta.yoast_desc || p.excerpt || '',
        focus_keyword: meta.yoast_focuskw || '',
      },
    };
  });

  const fullPages = pages.map((p) => {
    const meta = postMeta[p.id] || {};
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      content: p.content,
      created_at: p.created_at,
      updated_at: p.updated_at,
      seo: {
        title: meta.yoast_title || p.title,
        description: meta.yoast_desc || '',
      },
    };
  });

  // Extract all categories
  const allCategories = [];
  const catSlugs = new Set();
  for (const [ttId, tt] of Object.entries(termTaxonomies)) {
    if (tt.taxonomy === 'category') {
      const term = terms[tt.term_id];
      if (term && term.slug !== 'uncategorized' && !catSlugs.has(term.slug)) {
        catSlugs.add(term.slug);
        allCategories.push({
          id: term.term_id,
          name: term.name,
          slug: term.slug,
          description: tt.description || '',
        });
      }
    }
  }

  // Save to src/data/
  const outDir = './src/data';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'wp-posts.json'), JSON.stringify(fullPosts, null, 2), 'utf8');
  fs.writeFileSync(path.join(outDir, 'wp-pages.json'), JSON.stringify(fullPages, null, 2), 'utf8');
  fs.writeFileSync(path.join(outDir, 'wp-categories.json'), JSON.stringify(allCategories, null, 2), 'utf8');
  fs.writeFileSync(path.join(outDir, 'wp-users.json'), JSON.stringify(Object.values(users), null, 2), 'utf8');

  console.log(`\n🎉 Veriler başarıyla kaydedildi:`);
  console.log(`- ${path.join(outDir, 'wp-posts.json')} (${fullPosts.length} yazı)`);
  console.log(`- ${path.join(outDir, 'wp-pages.json')} (${fullPages.length} sayfa)`);
  console.log(`- ${path.join(outDir, 'wp-categories.json')} (${allCategories.length} kategori)`);
  console.log(`- ${path.join(outDir, 'wp-users.json')} (${Object.keys(users).length} yazar)`);

  // Show 10 sample posts with their resolved categories & images
  console.log('\n🔍 Örnek Çıkarılan Yazılar:');
  fullPosts.slice(0, 10).forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.slug}] - "${p.title}"`);
    console.log(`   📂 Kategori: ${p.categories.map(c => c.name).join(', ') || 'Yok'}`);
    console.log(`   🖼️  Görsel: ${p.image || 'Yok'}`);
    console.log(`   🔍 Yoast SEO Açıklaması: "${p.seo.description.substring(0, 70)}..."\n`);
  });
}

extract().catch(console.error);
