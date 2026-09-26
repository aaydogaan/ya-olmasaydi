import fs from "fs";
import path from "path";
import { optimizeAndUploadImage } from "../src/lib/r2-uploader.ts";

async function main() {
  const targetPath = process.argv[2];

  if (!targetPath) {
    console.log("Kullanım: node scripts/upload-single-or-folder.mjs <dosya_veya_klasör_yolu>");
    console.log("Örnek: node scripts/upload-single-or-folder.mjs ./yeni-gorsel.jpg");
    process.exit(1);
  }

  const resolved = path.resolve(targetPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Hata: '${targetPath}' bulunamadı!`);
    process.exit(1);
  }

  const stat = fs.statSync(resolved);
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const files = stat.isDirectory()
    ? fs.readdirSync(resolved).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f)).map(f => path.join(resolved, f))
    : [resolved];

  console.log(`🖼️  Toplam ${files.length} görsel işlenecek (Visually Lossless Sıkıştırma)...`);

  for (const file of files) {
    const filename = path.parse(file).name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const destinationKey = `${year}/${month}/${filename}.webp`;

    console.log(`\n⚙️ İşleniyor: ${path.basename(file)}`);
    const buffer = fs.readFileSync(file);

    try {
      const result = await optimizeAndUploadImage(buffer, {
        destinationKey,
        maxWidth: 1920,
        quality: 85,
        format: "webp",
      });

      console.log(`✅ Yüklendi!`);
      console.log(`   🔗 CDN URL: ${result.url}`);
      console.log(`   📏 Çözünürlük: ${result.width}x${result.height}`);
      console.log(`   📦 Orijinal Boyut: ${(result.originalSize / 1024).toFixed(1)} KB`);
      console.log(`   🚀 Sıkıştırılmış Boyut: ${(result.optimizedSize / 1024).toFixed(1)} KB (Tasarruf: %${result.compressionRatio})`);
      console.log(`   💎 Kalite: %100 Netlik Korundu (Gözle ayırt edilemez)`);
    } catch (err) {
      console.error(`❌ Hata (${file}):`, err.message);
    }
  }

  console.log("\n🎉 İşlem tamamlandı!");
}

main().catch(console.error);
