import { cn } from "@/lib/utils";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Cover({
  category,
  slug,
  title,
  image,
  className,
  mark = true,
  zoomOnHover = true,
}: {
  category: string;
  slug: string;
  title: string;
  image?: string | null;
  className?: string;
  mark?: boolean;
  zoomOnHover?: boolean;
}) {
  if (image) {
    const cleanImg = image.replace(/^\/?uploads\//, "");
    const src = image.startsWith("http") ? image : `https://cdn.yaolmasaydi.com/${cleanImg}`;
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-neutral-900", className)}>
        <img
          src={src}
          alt={title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            zoomOnHover ? "hover:scale-105" : ""
          )}
          loading="lazy"
        />
        {mark ? (
          <span className="absolute bottom-3 left-3 z-10 rounded bg-black/50 px-2 py-0.5 font-display text-[0.65rem] font-semibold tracking-[0.18em] text-white/90 uppercase drop-shadow backdrop-blur-xs">
            Ya Olmasaydı
          </span>
        ) : null}
      </div>
    );
  }

  const n = hash(slug);
  const rot = (n % 40) - 20;
  const qx = 58 + (n % 18);
  const qy = 42 + ((n >> 3) % 16);
  return (
    <div
      className={cn("cover-art relative h-full w-full", className)}
      data-cat={category}
      role="img"
      aria-label={title}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx={80 + (n % 60)} cy={70} r={90} fill="white" fillOpacity="0.08" />
        <circle cx={320} cy={220} r={120} fill="black" fillOpacity="0.18" />
        <text
          x={qx}
          y={qy}
          fill="white"
          fillOpacity="0.16"
          fontSize="140"
          fontFamily="Kumbh Sans, sans-serif"
          fontWeight="700"
          transform={`rotate(${rot} 200 150)`}
        >
          ?
        </text>
      </svg>
      {mark ? (
        <span className="absolute bottom-3 left-3 z-10 font-display text-[0.65rem] font-semibold tracking-[0.18em] text-inverse/70 uppercase">
          Ya Olmasaydı
        </span>
      ) : null}
    </div>
  );
}
