import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const BUCKET_NAME = process.env.R2_BUCKET || "yaolmasaydi-media";
const CDN_URL = process.env.CDN_BASE_URL || "https://cdn.yaolmasaydi.com";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "https://25a590ec7a3007eae8fba5fb3a603c03.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "9cd65ed1fcb0fe3afd06ab8a965fc4f4",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "0187453a4d82882d42e5f923658a321664ed0c16153f1c64acb5db8fbfc608bf",
  },
});

export interface OptimizeAndUploadOptions {
  /**
   * Hedef Cloudflare R2 dosya yolu (Örn: 2026/09/yeni-makale-kapak.webp)
   */
  destinationKey: string;
  /**
   * Maksimum genişlik (Örn: 1920px). Daha küçükse büyütülmez.
   * Varsayılan: 1920px
   */
  maxWidth?: number;
  /**
   * Sıkıştırma kalitesi (1-100).
   * 85: İnsan gözünün fark edemeyeceği "Visually Lossless" altın standarttır.
   * Varsayılan: 85
   */
  quality?: number;
  /**
   * Çıktı formatı.
   * Varsayılan: "webp"
   */
  format?: "webp" | "avif" | "jpeg" | "png";
}

export interface UploadResult {
  url: string;
  key: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: string;
  width?: number;
  height?: number;
  contentType: string;
}

/**
 * Görseli piksel kalitesini zerre bozmadan (visually lossless) sıkıştırır,
 * gereksiz EXIF metadata yükünü atar ve Cloudflare R2'ye yükler.
 */
export async function optimizeAndUploadImage(
  inputBuffer: Buffer,
  options: OptimizeAndUploadOptions
): Promise<UploadResult> {
  const {
    destinationKey,
    maxWidth = 1920,
    quality = 85,
    format = "webp",
  } = options;

  const originalSize = inputBuffer.length;
  let pipeline = sharp(inputBuffer, { failOnError: false });

  // 1. Metadata ve boyut kontrolü
  const metadata = await pipeline.metadata();

  // 2. Maksimum genişliğe göre orantılı boyutlandırma (asla büyütmez)
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  // 3. Kaliteyi bozmadan akıllı sıkıştırma
  let contentType = "image/webp";
  if (format === "webp") {
    contentType = "image/webp";
    pipeline = pipeline.webp({
      quality,
      effort: 6, // En iyi sıkıştırma algoritmik derinliği
      smartSubsample: true, // Renk kenarlarını korur
    });
  } else if (format === "avif") {
    contentType = "image/avif";
    pipeline = pipeline.avif({
      quality,
      effort: 6,
    });
  } else if (format === "jpeg") {
    contentType = "image/jpeg";
    pipeline = pipeline.jpeg({
      quality,
      mozjpeg: true, // MozJPEG optimize sıkıştırma
    });
  } else if (format === "png") {
    contentType = "image/png";
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
    });
  }

  const optimizedBuffer = await pipeline.toBuffer();
  const optimizedSize = optimizedBuffer.length;
  const ratio = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);

  // 4. Cloudflare R2'ye yükleme
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: destinationKey,
      Body: optimizedBuffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const finalMetadata = await sharp(optimizedBuffer).metadata();

  return {
    url: `${CDN_URL}/${destinationKey.replace(/^\//, "")}`,
    key: destinationKey,
    originalSize,
    optimizedSize,
    compressionRatio: `${ratio}%`,
    width: finalMetadata.width,
    height: finalMetadata.height,
    contentType,
  };
}
