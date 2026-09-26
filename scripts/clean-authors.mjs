import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:9lxaPYBN6PKaoPBXnEkoTyiYbdIXpCufxaehsT6Vtu6oFuZlKr2oT40p9Lw160ax@179.198.200.147:5432/postgres";

const client = new pg.Client({
  connectionString,
  ssl: false,
});

async function main() {
  await client.connect();
  console.log("✅ Veritabanına bağlanıldı.");

  // 1. 1 ve 4 dışındaki tüm makaleleri Recep Aydoğan'a (ID 4) devret
  const reassign = await client.query(`
    UPDATE posts 
    SET author_id = '4' 
    WHERE author_id NOT IN ('1', '4') OR author_id IS NULL;
  `);
  console.log(`📝 Başka yazarlara ait ${reassign.rowCount} yazı Recep Aydoğan'a atandı.`);

  // 2. 1 ve 4 dışındaki tüm spam/sahte yazarları sil
  const del = await client.query("DELETE FROM authors WHERE id NOT IN ('1', '4')");
  console.log(`🗑️ Silinen spam/sahte yazar sayısı: ${del.rowCount}`);

  // 3. Selman (ID 1) ve Recep (ID 4) bilgilerini güncelle
  await client.query(`
    UPDATE authors 
    SET name = 'Selman Aydoğan', slug = 'selman', role = 'Tasarım & Yazar', bio = 'Ya Olmasaydı görsel tasarım ve içerik yazarı.'
    WHERE id = '1';
  `);

  await client.query(`
    UPDATE authors 
    SET name = 'Recep Aydoğan', role = 'Kurucu & Yazar', bio = 'Ya Olmasaydı kurucusu ve içerik üreticisi.'
    WHERE id = '4';
  `);

  // 4. Doğrulama
  const afterAuthors = await client.query("SELECT id, name, slug FROM authors ORDER BY id");
  console.log("✅ Kalan gerçek yazarlar:", afterAuthors.rows);

  const postStats = await client.query(`
    SELECT a.name, count(p.id) as post_count 
    FROM authors a 
    LEFT JOIN posts p ON p.author_id = a.id 
    GROUP BY a.id, a.name
  `);
  console.log("📊 Yazarlar ve güncel yazı sayıları:", postStats.rows);

  await client.end();
}

main().catch(console.error);
