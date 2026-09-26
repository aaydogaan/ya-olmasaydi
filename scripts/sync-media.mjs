import fs from 'fs';
import path from 'path';

const SRC_DIR = './wp-yedek/uploads';
const DEST_DIR = './public/uploads';

const ALLOWED_EXTS = new Set([
  '.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.avif',
  '.mp3', '.m4a', '.wav', '.pdf'
]);

let copiedCount = 0;
let skippedCount = 0;
let securityFilteredCount = 0;

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip backup or suspicious directories
      if (entry.name === 'shield' || entry.name === 'redux') {
        continue;
      }
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      } else {
        if (ext === '.php' || ext === '.phtml' || ext === '.phar') {
          securityFilteredCount++;
        } else {
          skippedCount++;
        }
      }
    }
  }
}

console.log('🔄 Medya dosyaları temizlenerek public/uploads klasörüne senkronize ediliyor...');
copyDir(SRC_DIR, DEST_DIR);
console.log(`✅ Tamamlandı!`);
console.log(`📸 Güvenle Kopyalanan Temiz Medya: ${copiedCount}`);
console.log(`🛡️ Güvenlik Filtresine Takılan Zararlı/PHP Dosyaları: ${securityFilteredCount}`);
console.log(`⏩ Atlanan Diğer Dosyalar (txt, log vs.): ${skippedCount}`);
