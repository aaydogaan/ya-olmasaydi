import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import {
  checkAdminPassword,
  generateAdminSessionToken,
  verifyAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "./admin-auth";
import {
  getDashboardStats,
  getAdminPosts,
  getAdminPost,
  saveAdminPost,
  deleteAdminPost,
  getAdminCategories,
  getAdminAuthors,
} from "./admin-db";
import { optimizeAndUploadImage } from "./r2-uploader";

function assertAdminSession() {
  const token = getCookie(ADMIN_COOKIE_NAME);
  const isValid = verifyAdminSessionToken(token);
  if (!isValid) {
    throw new Error("UNAUTHORIZED: Oturumunuz kapalı veya süresi dolmuş. Lütfen tekrar giriş yapın.");
  }
}

/**
 * Yönetici Girişi
 */
export const adminLoginAction = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const isValid = checkAdminPassword(data.password);
    if (!isValid) {
      return { success: false, message: "Hatalı yönetici şifresi!" };
    }

    const token = generateAdminSessionToken();
    setCookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: "/",
    });

    return { success: true };
  });

/**
 * Yönetici Çıkışı
 */
export const adminLogoutAction = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_COOKIE_NAME, { path: "/" });
  return { success: true };
});

/**
 * Oturum Durumu Kontrolü
 */
export const adminCheckSessionAction = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(ADMIN_COOKIE_NAME);
  return { authenticated: verifyAdminSessionToken(token) };
});

/**
 * Dashboard İstatistikleri
 */
export const adminGetDashboardAction = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  return await getDashboardStats();
});

/**
 * Yazı Listesi (Arama, filtreleme, sayfalama)
 */
export const adminGetPostsAction = createServerFn({ method: "GET" })
  .validator((params: { search?: string; category?: string; page?: number; limit?: number }) => params)
  .handler(async ({ data }) => {
    assertAdminSession();
    return await getAdminPosts(data);
  });

/**
 * Tek Bir Yazıyı Getir
 */
export const adminGetPostAction = createServerFn({ method: "GET" })
  .validator((idOrSlug: string) => idOrSlug)
  .handler(async ({ data }) => {
    assertAdminSession();
    return await getAdminPost(data);
  });

/**
 * Yazıyı Kaydet (Oluştur veya Güncelle)
 */
export const adminSavePostAction = createServerFn({ method: "POST" })
  .validator((postData: any) => postData)
  .handler(async ({ data }) => {
    assertAdminSession();
    return await saveAdminPost(data);
  });

/**
 * Yazı Sil
 */
export const adminDeletePostAction = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    assertAdminSession();
    return await deleteAdminPost(data);
  });

/**
 * Kategorileri Getir
 */
export const adminGetCategoriesAction = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  return await getAdminCategories();
});

/**
 * Yazarları Getir
 */
export const adminGetAuthorsAction = createServerFn({ method: "GET" }).handler(async () => {
  assertAdminSession();
  return await getAdminAuthors();
});

/**
 * Görsel Yükle (Visually Lossless Sıkıştırma + Cloudflare R2)
 */
export const adminUploadImageAction = createServerFn({ method: "POST" })
  .validator((data: { base64: string; fileName: string; maxWidth?: number }) => data)
  .handler(async ({ data }) => {
    assertAdminSession();

    // Base64 to buffer
    const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const nameWithoutExt = data.fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");

    const destinationKey = `${year}/${month}/${nameWithoutExt}-${Date.now().toString().slice(-4)}.webp`;

    const result = await optimizeAndUploadImage(buffer, {
      destinationKey,
      maxWidth: data.maxWidth || 1920,
      quality: 85,
      format: "webp",
    });

    return {
      success: true,
      url: result.url,
      key: result.key,
      width: result.width,
      height: result.height,
      compressionRatio: result.compressionRatio,
      optimizedSize: result.optimizedSize,
    };
  });
