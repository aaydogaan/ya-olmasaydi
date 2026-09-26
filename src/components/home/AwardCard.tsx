export function AwardCard() {
  return (
    <a
      href="https://brodigitalmedia.com/odullerimiz/"
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-md shadow-(--shadow-post)"
    >
      <div className="relative aspect-square overflow-hidden bg-linear-to-b from-brand to-accent-hot p-5 text-inverse">
        <p className="text-center text-[0.7rem] font-semibold tracking-wide uppercase">
          TRT Geleceğin İletişimcileri Yarışması’nda
        </p>
        <p className="mt-1 text-center font-display text-2xl font-bold">Birinci Olduk!</p>
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <svg viewBox="0 0 120 140" className="h-36 w-28 drop-shadow-lg" aria-hidden="true">
            <ellipse cx="60" cy="128" rx="28" ry="6" fill="#8a4b12" opacity="0.45" />
            <rect x="52" y="78" width="16" height="34" fill="#f4d06f" />
            <path d="M36 88h48l-8 18H44l-8-18Z" fill="#e6b422" />
            <circle cx="60" cy="44" r="32" fill="#f7d774" stroke="#c9a227" strokeWidth="4" />
            <path d="M28 44c0 18 8 28 18 32" fill="none" stroke="#f7d774" strokeWidth="8" />
            <path d="M92 44c0 18-8 28-18 32" fill="none" stroke="#f7d774" strokeWidth="8" />
            <text x="60" y="52" textAnchor="middle" fontSize="28" fill="#8a4b12" fontFamily="Kumbh Sans, sans-serif" fontWeight="700">
              1
            </text>
          </svg>
        </div>
      </div>
    </a>
  );
}
