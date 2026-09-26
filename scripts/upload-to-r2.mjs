import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const UPLOADS_DIR = './public/uploads';

// MIME Type resolver
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.avif': return 'image/avif';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.mp3': return 'audio/mpeg';
    case '.m4a': return 'audio/mp4';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

async function uploadAll() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || 'yaolmasaydi-media';

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error('❌ Lütfen Cloudflare R2 ortam değişkenlerini tanımlayın:');
    console.log('   - R2_ACCOUNT_ID');
    console.log('   - R2_ACCESS_KEY_ID');
    console.log('   - R2_SECRET_ACCESS_KEY');
    console.log('   - R2_BUCKET_NAME (isteğe bağlı, varsayılan: yaolmasaydi-media)');
    console.log('\nÖrnek kullanım:');
    console.log('  R2_ACCOUNT_ID="xxx" R2_ACCESS_KEY_ID="yyy" R2_SECRET_ACCESS_KEY="zzz" node scripts/upload-to-r2.mjs');
    process.exit(1);
  }

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log(`🚀 Cloudflare R2'ye yükleme başlatılıyor...`);
  console.log(`🪣 Hedef Bucket: ${bucketName}`);

  // Collect all files
  function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (item.isFile()) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = getFiles(UPLOADS_DIR);
  console.log(`📦 Toplam yüklenecek dosya: ${files.length}`);

  let uploaded = 0;
  let failed = 0;

  for (const filePath of files) {
    const relativeKey = path.relative(UPLOADS_DIR, filePath).replace(/\\/g, '/');
    const contentType = getContentType(filePath);
    const fileStream = fs.createReadStream(filePath);

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: relativeKey,
          Body: fileStream,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
      uploaded++;
      if (uploaded % 50 === 0 || uploaded === files.length) {
        console.log(`⏳ [${uploaded}/${files.length}] yüklendi: ${relativeKey}`);
      }
    } catch (err) {
      console.error(`❌ Hata (${relativeKey}):`, err.message);
      failed++;
    }
  }

  console.log(`\n🎉 Cloudflare R2 Aktarımı Tamamlandı!`);
  console.log(`✅ Başarılı: ${uploaded}`);
  console.log(`❌ Hatalı: ${failed}`);
}

uploadAll().catch(console.error);
