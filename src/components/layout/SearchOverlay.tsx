import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconClose, IconSearch } from "@/components/icons";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    onClose();
    if (query) navigate({ to: "/ara", search: { q: query } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/95 px-4 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-lg font-semibold">Ara</p>
          <button type="button" onClick={onClose} className="flex items-center gap-2 text-sm text-muted" aria-label="kapalı">
            <IconClose className="size-4" />
            kapalı
          </button>
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-b border-fg pb-2">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Arayın ve enter tuşuna basın"
            className="min-w-0 flex-1 border-0 bg-transparent font-display text-xl outline-none placeholder:text-muted"
          />
          <button type="submit" className="flex size-11 items-center justify-center" aria-label="Ara">
            <IconSearch className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
