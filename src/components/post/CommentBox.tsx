import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import WP_COMMENTS from "@/data/wp-comments.json";

type CommentItem = { name: string; text: string; at: string };

export function CommentBox({ slug, seed }: { slug: string; seed: number }) {
  const key = `yo-comments-${slug}`;

  // Find recovered WordPress comments for this article slug
  const normalizedSlug = (slug || "").trim().toLowerCase();
  const wpCommentsForPost: CommentItem[] = (WP_COMMENTS as any[])
    .filter((c) => (c.slug || "").trim().toLowerCase() === normalizedSlug && c.content && c.content.trim())
    .map((c) => ({
      name: c.author || "Ziyaretçi",
      text: c.content.trim(),
      at: c.date,
    }));

  const [localComments, setLocalComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setLocalComments(raw ? (JSON.parse(raw) as CommentItem[]) : []);
    } catch {
      setLocalComments([]);
    }
  }, [key]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Lütfen adınızı ve yorumunuzu girin.");
      return;
    }
    const newComment: CommentItem = {
      name: name.trim(),
      text: text.trim(),
      at: new Date().toISOString(),
    };
    const next = [newComment, ...localComments];
    setLocalComments(next);
    localStorage.setItem(key, JSON.stringify(next));
    setName("");
    setText("");
    toast.success("Yorumunuz başarıyla eklendi.");
  }

  // Combine local newly submitted comments and recovered WordPress comments
  const allComments = [...localComments, ...wpCommentsForPost];
  const total = allComments.length;

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="font-display text-2xl font-semibold">{total} Yorum</h2>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          className="input-line"
          placeholder="Adınız"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="input-line min-h-28 resize-y"
          placeholder="Yorumunuz"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-black cursor-pointer">
          Yorum Gönder
        </button>
      </form>

      {allComments.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {allComments.map((c, i) => (
            <li key={i} className="rounded-xl bg-paper p-4 border border-line/60">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-sm font-semibold text-fg">{c.name}</p>
                {c.at && (
                  <span className="text-[0.7rem] text-muted">
                    {new Date(c.at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-dim leading-relaxed whitespace-pre-line">
                {c.text}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted">İlk yorumu siz yapın!</p>
      )}
    </section>
  );
}
