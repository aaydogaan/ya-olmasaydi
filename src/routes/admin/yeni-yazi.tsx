import React, { useState } from "react";
import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import {
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RichEditor } from "@/components/admin/RichEditor";
import { SeoPreview } from "@/components/admin/SeoPreview";
import { CustomSelect } from "@/components/admin/CustomSelect";
import {
  adminCheckSessionAction,
  adminGetCategoriesAction,
  adminGetAuthorsAction,
  adminSavePostAction,
  adminUploadImageAction,
} from "@/lib/admin-actions";

export const Route = createFileRoute("/admin/yeni-yazi")({
  loader: async () => {
    const session = await adminCheckSessionAction();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" as any });
    }
    const [categories, authors] = await Promise.all([
      adminGetCategoriesAction(),
      adminGetAuthorsAction(),
    ]);
    return { categories, authors };
  },
  component: NewPostPage,
});

function slugify(text: string) {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function NewPostPage() {
  const data = Route.useLoaderData() as any;
  const categories: any[] = data.categories || [];
  const authors: any[] = data.authors || [];
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "1");
  const [authorId, setAuthorId] = useState(authors[0]?.id || "1");
  const [tagsInput, setTagsInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadStats, setUploadStats] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setUploadStats(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await adminUploadImageAction({
          data: {
            base64,
            fileName: file.name,
            maxWidth: 1920,
          },
        });

        if (res.url) {
          setCoverImage(res.url);
          setUploadStats(
            `Kayıpsız Sıkıştırıldı! ${(res.optimizedSize / 1024).toFixed(0)} KB (Tasarruf: %${res.compressionRatio})`
          );
        }
      } catch (err: any) {
        alert(`Kapak görseli yüklenirken hata: ${err.message}`);
      } finally {
        setIsUploadingCover(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (isPublished = true) => {
    if (!title.trim()) {
      setError("Lütfen bir başlık girin.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!slug.trim()) {
      setError("Lütfen geçerli bir URL (slug) girin.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await adminSavePostAction({
        data: {
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage,
          category_id: categoryId,
          author_id: authorId,
          tags,
          seo_title: seoTitle || title,
          seo_description: seoDescription || excerpt,
          seo_focus_keyword: focusKeyword,
          is_published: isPublished,
        },
      });

      if (res.success) {
        router.navigate({ to: "/admin" as any });
      }
    } catch (err: any) {
      setError(err?.message || "Yazı kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="new-post">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to={"/admin" as any}
            className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              Yeni Yazı Yaz
            </h1>
            <p className="text-xs text-neutral-400">
              Yeni bir senaryo kurgulayın ve canlı yayına alın.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            Taslak Olarak Kaydet
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Yazıyı Yayınla</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor & Settings Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Yazı Başlığı (Örn: Ya Yapay Zeka Olmasaydı?)..."
              className="w-full rounded-2xl border border-white/10 bg-neutral-900/60 p-5 font-display text-2xl md:text-3xl font-bold text-white placeholder-neutral-600 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 backdrop-blur-md"
            />
          </div>

          {/* Slug URL */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-950/60 px-4 py-2.5 text-xs text-neutral-400">
            <span className="text-neutral-500 shrink-0">https://yaolmasaydi.com/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugManuallyEdited(true);
              }}
              placeholder="yazi-url-adresi"
              className="w-full bg-transparent text-white font-mono outline-none"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Makale İçeriği (Zengin Metin)
            </label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="Senaryoyu yazmaya başlayın. H2, H3, alıntılar, linkler ve görseller ekleyebilirsiniz..."
              minHeight="480px"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Kısa Özet (Excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                if (!seoDescription) setSeoDescription(e.target.value);
              }}
              rows={3}
              placeholder="Ana sayfada ve listelerde görünecek çekici bir özet..."
              className="w-full rounded-2xl border border-white/10 bg-neutral-900/60 p-4 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500 backdrop-blur-md resize-none"
            />
          </div>
        </div>

        {/* Right Sidebar Options (1 col) */}
        <div className="space-y-6">
          {/* Cover Image Box */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Kapak Görseli
            </label>

            {coverImage ? (
              <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-neutral-950">
                <img
                  src={coverImage}
                  alt="Kapak"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 p-6 text-center cursor-pointer transition-colors ${
                  isUploadingCover ? "bg-orange-500/10 border-orange-500/40" : "hover:border-orange-500/50 hover:bg-white/[0.02]"
                }`}
              >
                {isUploadingCover ? (
                  <div className="flex flex-col items-center gap-2 text-orange-400">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="text-xs font-medium">Kayıpsız Sıkıştırılıyor...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-neutral-400 mb-2">
                      <ImageIcon className="size-5" />
                    </div>
                    <span className="text-xs font-medium text-white">Görsel Seç veya Sürükle</span>
                    <span className="text-[0.65rem] text-neutral-500 mt-1">
                      WebP, JPG, PNG (R2'ye otomatik optimize yüklenir)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={isUploadingCover}
                />
              </label>
            )}

            {uploadStats && (
              <div className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-emerald-400">
                <CheckCircle className="size-3.5 shrink-0" />
                <span>{uploadStats}</span>
              </div>
            )}
          </div>

          {/* Taxonomy (Category & Author) */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md space-y-4">
            <CustomSelect
              label="Kategori"
              value={categoryId}
              onChange={setCategoryId}
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />

            <CustomSelect
              label="Yazar"
              value={authorId}
              onChange={setAuthorId}
              options={authors.map((a) => ({
                value: a.id,
                label: a.name,
              }))}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Etiketler (Virgülle Ayırın)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="renkler, evren, dunya"
                className="w-full rounded-xl border border-white/10 bg-neutral-950 p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Live Google SEO Preview Card */}
          <SeoPreview
            title={seoTitle}
            slug={slug}
            description={seoDescription}
            focusKeyword={focusKeyword}
            onTitleChange={setSeoTitle}
            onDescriptionChange={setSeoDescription}
            onKeywordChange={setFocusKeyword}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
