import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://25a590ec7a3007eae8fba5fb3a603c03.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '9cd65ed1fcb0fe3afd06ab8a965fc4f4',
    secretAccessKey: '0187453a4d82882d42e5f923658a321664ed0c16153f1c64acb5db8fbfc608bf',
  },
});

async function testConnection() {
  console.log('Testing R2 connection...');
  try {
    await s3.send(new PutObjectCommand({
      Bucket: 'yaolmasaydi-media',
      Key: 'test-connection.txt',
      Body: 'Cloudflare R2 bağlantısı başarılı!',
      ContentType: 'text/plain',
    }));
    console.log('✅ Bağlantı BAŞARILI! Test dosyası yüklendi.');
  } catch (err) {
    console.error('❌ Bağlantı hatası:', err);
  }
}

testConnection();
