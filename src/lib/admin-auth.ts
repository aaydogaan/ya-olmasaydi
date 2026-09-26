import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "yaolmasaydi2026!";
const SESSION_SECRET = process.env.SESSION_SECRET || "ya-olmasaydi-super-secret-salt-key-999";
export const ADMIN_COOKIE_NAME = "ya_admin_session";

/**
 * Yönetici şifresini güvenli bir şekilde kontrol eder.
 */
export function checkAdminPassword(password: string): boolean {
  if (!password) return false;
  return password === ADMIN_PASSWORD;
}

/**
 * 7 gün geçerli HMAC-SHA256 imzalı oturum jetonu oluşturur.
 */
export function generateAdminSessionToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 gün
  const payload = `admin:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${payload}:${hmac}`;
}

/**
 * Oturum jetonunun sahte olup olmadığını ve süresinin dolup dolmadığını doğrular.
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [role, expiresStr, signature] = parts;
  if (role !== "admin") return false;

  const expiresAt = parseInt(expiresStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const expectedHmac = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`admin:${expiresStr}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
}
