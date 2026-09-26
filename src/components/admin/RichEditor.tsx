import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Undo,
  Redo,
  Loader2,
  Upload,
} from "lucide-react";
import { adminUploadImageAction } from "@/lib/admin-actions";

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichEditor({
  value,
  onChange,
  placeholder = "Yazınızı buraya yazmaya başlayın...",
  minHeight = "400px",
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync value from props to editor DOM only when content differs
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, isCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const handleOpenLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    setLinkText(sel ? sel.toString() : "");
    setLinkUrl("");
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    setShowLinkModal(false);
    restoreSelection();
    if (!linkUrl) return;

    const formattedUrl = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    if (linkText && savedSelectionRef.current && savedSelectionRef.current.collapsed) {
      exec("insertHTML", `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
    } else {
      exec("createLink", formattedUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await adminUploadImageAction({
            data: {
              base64,
              fileName: file.name,
              maxWidth: 1600,
            },
          });

          if (res.url) {
            if (isCodeView) {
              onChange(`${value}\n<figure><img src="${res.url}" alt="Görsel" /></figure>\n`);
            } else {
              if (editorRef.current) editorRef.current.focus();
              exec(
                "insertHTML",
                `<figure class="my-6"><img src="${res.url}" alt="Görsel" class="rounded-xl shadow-md my-4 max-w-full" /></figure><p><br></p>`
              );
            }
          }
        } catch (err: any) {
          alert(`Görsel yüklenirken hata oluştu: ${err.message}`);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  // Format block (H2, H3, P, Blockquote)
  const formatBlock = (tag: string) => {
    if (tag === "blockquote") {
      exec("formatBlock", "<blockquote>");
    } else if (tag === "h2") {
      exec("formatBlock", "<h2>");
    } else if (tag === "h3") {
      exec("formatBlock", "<h3>");
    } else {
      exec("formatBlock", "<p>");
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/90 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-neutral-950/80 p-2.5 text-neutral-300">
        <button
          type="button"
          onClick={() => exec("undo")}
          title="Geri Al (Ctrl+Z)"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Undo className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("redo")}
          title="İleri Al (Ctrl+Y)"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Redo className="size-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-white/15" />

        <button
          type="button"
          onClick={() => formatBlock("p")}
          title="Normal Paragraf"
          className="rounded px-2.5 py-1 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => formatBlock("h2")}
          title="Başlık 2 (H2)"
          className="flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
        >
          <Heading2 className="size-4" />
          <span>H2</span>
        </button>
        <button
          type="button"
          onClick={() => formatBlock("h3")}
          title="Başlık 3 (H3)"
          className="flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
        >
          <Heading3 className="size-4" />
          <span>H3</span>
        </button>

        <div className="mx-1 h-5 w-px bg-white/15" />

        <button
          type="button"
          onClick={() => exec("bold")}
          title="Kalın (Ctrl+B)"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="İtalik (Ctrl+I)"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Altı Çizili (Ctrl+U)"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Underline className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("strikeThrough")}
          title="Üstü Çizili"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Strikethrough className="size-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-white/15" />

        <button
          type="button"
          onClick={() => formatBlock("blockquote")}
          title="Alıntı Ekle"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Quote className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Madde İşaretli Liste"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numaralı Liste"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ListOrdered className="size-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-white/15" />

        <button
          type="button"
          onClick={handleOpenLinkModal}
          title="Bağlantı (Link) Ekle"
          className="rounded p-1.5 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LinkIcon className="size-4" />
        </button>

        <label
          title="İçeriğe Görsel Ekle (Cloudflare R2 Kayıpsız)"
          className={`flex items-center gap-1.5 cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            isUploading ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/10 hover:text-white"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Sıkıştırılıyor...</span>
            </>
          ) : (
            <>
              <ImageIcon className="size-4" />
              <span>Görsel Ekle</span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsCodeView(!isCodeView)}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              isCodeView
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isCodeView ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
            <span>{isCodeView ? "Görsel Mod" : "HTML Kodu"}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isCodeView ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="HTML kodunu buraya yapıştırabilir veya düzenleyebilirsiniz..."
          className="w-full bg-neutral-950 p-6 font-mono text-sm text-neutral-200 outline-none resize-y selection:bg-orange-500/30"
          style={{ minHeight }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          data-placeholder={placeholder}
          className="admin-editor-content w-full p-6 text-neutral-100 outline-none focus:ring-0 empty:before:text-neutral-500 empty:before:content-[attr(data-placeholder)]"
          style={{ minHeight }}
        />
      )}

      {/* Footer stats */}
      <div className="flex items-center justify-between border-t border-white/5 bg-neutral-950/60 px-4 py-2 text-[0.75rem] text-neutral-500">
        <div className="flex items-center gap-3">
          <span>Kelime: {value.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length}</span>
          <span>Karakter: {value.replace(/<[^>]*>/g, "").length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500"></span>
          <span>Zengin Metin Editörü Aktif</span>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="font-display text-base font-semibold text-white">Bağlantı (Link) Ekle</h3>
            <p className="mt-1 text-xs text-neutral-400">
              Yazıya tıklanabilir bir web linki ekleyin.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300">Görüntülenecek Metin</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Örn: Wikipedia Kaynağı"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300">Hedef URL Adresi</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/10"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                className="rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-orange-500"
              >
                Bağlantıyı Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
