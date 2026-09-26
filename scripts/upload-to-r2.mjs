import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const UPLOADS_DIR = './public/uploads';
const BUCKET_NAME = 'yaolmasaydi-media';

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://25a590ec7a3007eae8fba5fb3a603c03.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '9cd65ed1fcb0fe3afd06ab8a965fc4f4',
    secretAccessKey: '0187453a4d82882d42e5f923658a321664ed0c16153f1c64acb5db8fbfc608bf',
  },
});

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

function getAllFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

async function uploadFile(filePath) {
  const relativeKey = path.relative(UPLOADS_DIR, filePath).replace(/\\/g, '/');
  const contentType = getContentType(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: relativeKey,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

async function main() {
  console.log('🚀 Cloudflare R2 Toplu Görsel Yüklemesi Başlatılıyor...');
  console.log(`🪣 Bucket: ${BUCKET_NAME}`);
  console.log(`🌐 Hedef CDN: https://cdn.yaolmasaydi.com/`);

  const files = getAllFiles(UPLOADS_DIR);
  console.log(`📦 Toplam yüklenecek dosya sayısı: ${files.length}\n`);

  let completed = 0;
  let failed = 0;
  const CONCURRENCY = 15; // 15 dosya aynı anda paralel yüklenir (ultra hızlı)

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (file) => {
        try {
          await uploadFile(file);
          completed++;
        } catch (err) {
          console.error(`❌ Hata (${file}):`, err.message);
          failed++;
        }
      })
    );

    if (completed % 100 === 0 || completed === files.length) {
      const percent = ((completed / files.length) * 100).toFixed(1);
      console.log(`⏳ İlerleme: [${completed}/${files.length}] (%${percent}) yüklendi...`);
    }
  }

  console.log('\n🎉 TEBRİKLER! Tüm görseller kalite bozulmadan Cloudflare R2\'ye aktarıldı!');
  console.log(`✅ Başarıyla Yüklenen: ${completed}`);
  console.log(`❌ Hatalı: ${failed}`);
}

main().catch(console.error);
