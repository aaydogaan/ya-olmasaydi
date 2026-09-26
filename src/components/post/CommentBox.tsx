import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Comment = { name: string; text: string; at: string };

export function CommentBox({ slug, seed }: { slug: string; seed: number }) {
  const key = `yo-comments-${slug}`;
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setComments(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      setComments([]);
    }
  }, [key]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Ad ve yorum gerekli.");
      return;
    }
    const next = [{ name: name.trim(), text: text.trim(), at: new Date().toISOString() }, ...comments];
    setComments(next);
    localStorage.setItem(key, JSON.stringify(next));
    setName("");
    setText("");
    toast.success("Yorumunuz eklendi.");
  }

  const total = seed + comments.length;

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
        <button type="submit" className="btn-black">
          Yorum Gönder
        </button>
      </form>
      <ul className="mt-8 space-y-5">
        {comments.map((c, i) => (
          <li key={i} className="rounded-md bg-paper p-4">
            <p className="font-display text-sm font-semibold">{c.name}</p>
            <p className="mt-1 text-sm text-dim">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
