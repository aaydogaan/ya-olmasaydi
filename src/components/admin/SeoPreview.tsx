import React, { useState } from "react";
import { Search, Smartphone, Monitor } from "lucide-react";

interface SeoPreviewProps {
  title: string;
  slug: string;
  description: string;
  focusKeyword?: string;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onKeywordChange?: (val: string) => void;
}

export function SeoPreview({
  title,
  slug,
  description,
  focusKeyword = "",
  onTitleChange,
  onDescriptionChange,
  onKeywordChange,
}: SeoPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const titleLen = title.length;
  const descLen = description.length;

  const titleScore = titleLen >= 40 && titleLen <= 65 ? "good" : titleLen > 65 ? "warning" : "short";
  const descScore = descLen >= 120 && descLen <= 160 ? "good" : descLen > 160 ? "warning" : "short";

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/90 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
            <Search className="size-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-white">Google SEO Önizlemesi</h3>
            <p className="text-[0.7rem] text-neutral-400">
              Yazınız Google arama sonuçlarında nasıl görünecek?
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center rounded-lg bg-neutral-950 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
              device === "desktop" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Monitor className="size-3.5" />
            <span>Masaüstü</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
              device === "mobile" ? "bg-white/15 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Smartphone className="size-3.5" />
            <span>Mobil</span>
          </button>
        </div>
      </div>

      {/* Google Result Preview Box */}
      <div className="mt-4 rounded-xl border border-white/10 bg-[#202124] p-4 text-left shadow-inner">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-orange-600 font-bold text-[0.65rem] text-white">
            Y
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.75rem] text-[#dadce0]">Ya Olmasaydı</p>
            <p className="truncate text-[0.7rem] text-[#bdc1c6]">https://yaolmasaydi.com/{slug || "ornek-yazi-linki"}</p>
          </div>
        </div>

        <h4 className="mt-2 text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
          {title || "Yazınızın Başlığı Google'da Böyle Görünecek"}
        </h4>

        <p className="mt-1 text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
          {description ||
            "Yazınızın arama motorlarında çıkacak meta açıklaması burada yer alır. Okuyucuların dikkatini çekecek bir özet yazın."}
        </p>
      </div>

      {/* Form Fields */}
      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-300">SEO Başlığı</label>
            <span
              className={`text-[0.7rem] font-mono ${
                titleScore === "good"
                  ? "text-emerald-400"
                  : titleScore === "warning"
                  ? "text-amber-400"
                  : "text-neutral-400"
              }`}
            >
              {titleLen} / 60 karakter
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Google'da görünecek başlık..."
            className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-orange-500"
          />
          {/* Score Bar */}
          <div className="mt-1 h-1 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className={`h-full transition-all ${
                titleScore === "good" ? "bg-emerald-500" : titleScore === "warning" ? "bg-amber-500" : "bg-neutral-600"
              }`}
              style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-300">Meta Açıklaması (Description)</label>
            <span
              className={`text-[0.7rem] font-mono ${
                descScore === "good"
                  ? "text-emerald-400"
                  : descScore === "warning"
                  ? "text-amber-400"
                  : "text-neutral-400"
              }`}
            >
              {descLen} / 160 karakter
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            placeholder="Google arama sonuçlarında çıkacak kısa özet açıklama..."
            className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-orange-500 resize-none"
          />
          {/* Score Bar */}
          <div className="mt-1 h-1 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className={`h-full transition-all ${
                descScore === "good" ? "bg-emerald-500" : descScore === "warning" ? "bg-amber-500" : "bg-neutral-600"
              }`}
              style={{ width: `${Math.min(100, (descLen / 160) * 100)}%` }}
            />
          </div>
        </div>

        {onKeywordChange && (
          <div>
            <label className="block text-xs font-medium text-neutral-300">Odak Anahtar Kelime</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Örn: yapay zeka olmasaydı"
              className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-orange-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
